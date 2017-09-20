<template>
    <div>
        <h5>Assigner l'équipement</h5>
        <form @submit.prevent="addPointToDevice(modObject, devicePoint)">
            <b-inputselect label="Point" id="point-select" :options="pointOptions" v-model="devicePoint.point"></b-inputselect>
            <b-inputselect label="Période" id="period-select" :options="currentPeriodOptions" :fullOptions="periodOptions" v-model="devicePoint.period" v-if="currentEvent.config.hasPeriods"></b-inputselect>
            <mdl-button colored raised :disabled="disabledAdd">Ajouter</mdl-button>
        </form>
        <b-table
            :headers="displayedColumns"
            :data="displayedPoints"
            :actions="[
                { action: 'unlink', text: 'Supprimer', type: 'confirm' }
            ]"
            :paging="5"
            @unlink="removePointFromCurrentDevice">
        </b-table>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import { isPointUsedByEvent } from './isPointUsedByEvent';

const devicePointPattern = {
    point : null,
    period: null
};

export default {
    data() {
        return {
            devicePoint: Object.assign({}, devicePointPattern)
        };
    },

    methods: {
        ...mapActions([
            'createSimpleRelation',
            'removeSimpleRelation',
            'notify',
            'notifyError'
        ]),
        addPointToDevice(device, devicePoint) {
            devicePoint.period = (this.currentEvent.config.hasPeriods) ?
                devicePoint.period : this.currentEvent.defaultPeriod;

            if (isPointUsedByEvent(this.modObject.points, devicePoint)) {
                return this.notifyError({
                    message: 'Le point est déjà utilisé par un autre événement pendant cette période'
                });
            }

            this.createSimpleRelation({
                obj1: {
                    route: 'devices',
                    value: device
                },
                obj2: {
                    route: 'points',
                    value: devicePoint.point
                },
                through: {
                    obj  : 'period',
                    field: 'Period_id',
                    value: devicePoint.period
                }
            })
                .then(() => {
                    this.devicePoint = Object.assign({}, devicePointPattern);
                    this.notify({ message: 'Le point a bien été lié à l\'équipement' });
                })
                .catch(err => this.notifyError({
                    message: 'Le point n\'a pas pu être lié à l\'équipement',
                    full   : err
                }));
        },
        removePointFromCurrentDevice(point) {
            this.removePointFromDevice(this.modObject, point);
        },
        removePointFromDevice(device, point) {
            this.removeSimpleRelation({
                obj1: {
                    route: 'devices',
                    value: device
                },
                obj2: {
                    route: 'points',
                    value: point
                },
                through: {
                    obj  : 'period',
                    field: 'Period_id',
                    value: point._through.period
                }
            })
                .then(() => this.notify({ message: 'Le point a bien été supprimé de l\'équipement' }))
                .catch(err => this.notifyError({
                    message: 'Le point n\'a pas pu être supprimé de l\'équipement',
                    full   : err
                }));
        }
    },

    computed: {
        ...mapState({
            currentEvent: state => state.app.currentEvent,
            modObject   : state => state.app.modObject
        }),
        ...mapGetters([
            'periodOptions',
            'currentPeriodOptions',
            'pointOptions'
        ]),
        displayedColumns() {
            const columns = [{ title: 'Point', field: 'name' }];
            if (this.currentEvent.config.hasPeriods) {
                columns.push({ title: 'Période', field: '_through.period.name' });
            }

            return columns;
        },
        displayedPoints() {
            return (!this.modObject) ? [] : this.modObject.points
                .filter(point => (point._through.period.Event_id === this.currentEvent.id))
                .map((point) => {
                    if (point._through.period.id !== this.currentEvent.DefaultPeriod_id
                        && !this.currentEvent.config.hasPeriods) {
                        point.warning = 'Une période autre que<br />celle par défaut est utilisée.';
                    }

                    return point;
                });
        },
        disabledAdd() {
            return (!this.devicePoint.period && this.currentEvent.config.hasPeriods) || !this.devicePoint.point;
        }
    }
};
</script>
