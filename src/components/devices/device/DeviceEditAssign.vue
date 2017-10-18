<template>
    <div>
        <h5>Assigner l'équipement</h5>
        <form @submit.prevent="addPointToDevice(modObject, wiket)">
            <b-inputselect label="Point" id="point-select" :options="pointOptions" v-model="wiket.point"></b-inputselect>
            <b-inputselect label="Période" id="period-select" :options="currentPeriodOptions" :fullOptions="periodOptions" v-model="wiket.period" v-if="currentEvent.usePeriods"></b-inputselect>
            <mdl-button colored raised :disabled="disabledAdd">Ajouter</mdl-button>
        </form>
        <b-table
            :headers="displayedColumns"
            :data="displayedWikets"
            :actions="[
                { action: 'remove', text: 'Supprimer', type: 'confirm' }
            ]"
            route="wikets"
            :paging="5"
            @remove="removeObject">
        </b-table>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import { isPointUsedByEvent } from './isPointUsedByEvent';

const wiketPattern = {
    point : null,
    period: null
};

export default {
    data() {
        return {
            wiket: Object.assign({}, wiketPattern)
        };
    },

    methods: {
        ...mapActions([
            'createObject',
            'removeObject',
            'notify',
            'notifyError'
        ]),
        addPointToDevice(device, wiket) {
            wiket.period = (this.currentEvent.usePeriods) ?
                wiket.period : this.currentEvent.defaultPeriod;

            if (isPointUsedByEvent(this.modObject.wikets, wiket)) {
                return this.notifyError({
                    message: 'Le point est déjà utilisé par un autre événement pendant cette période'
                });
            }

            const newWiket = {
                point_id : wiket.point.id,
                device_id: device.id
            };

            if (wiket.period) {
                newWiket.period_id = wiket.period.id;
            }

            this
                .createObject({
                    route: 'wikets',
                    value: newWiket
                })
                .then(() => {
                    this.wiket = Object.assign({}, wiketPattern);
                    this.notify({ message: 'Le point a bien été lié à l\'équipement' });
                })
                .catch(err => this.notifyError({
                    message: 'Le point n\'a pas pu être lié à l\'équipement',
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
            const columns = [{ title: 'Point', field: 'point.name' }];
            if (this.currentEvent.usePeriods) {
                columns.push({ title: 'Période', field: 'period.name' });
            }

            return columns;
        },
        displayedWikets() {
            return (!this.modObject) ? [] : this.modObject.wikets
                .filter(wiket => (wiket.period.event_id === this.currentEvent.id))
                .map((wiket) => {
                    if (wiket.period.id !== this.currentEvent.defaultPeriod_id
                        && !this.currentEvent.usePeriods) {
                        wiket.warning = 'Une période autre que<br />celle par défaut est utilisée.';
                    }

                    return wiket;
                });
        },
        disabledAdd() {
            return (!this.wiket.period && this.currentEvent.usePeriods) || !this.wiket.point;
        }
    }
};
</script>
