<template>
    <div>
        <h5>Assigner l'équipement</h5>
        <form @submit.prevent="addPointToDevice(modObject, devicePoint)">
            <mdl-select label="Point" id="point-select" v-model="devicePoint.point" :options="pointOptions"></mdl-select>
            <mdl-select label="Période" id="period-select" v-model="devicePoint.period" :options="periodOptions"></mdl-select>
            <mdl-button colored raised :disabled="disabledAdd">Ajouter</mdl-button>
        </form>
        <b-table
            :headers="[
                { title: 'Point', field: 'name' },
                { title: 'Période', field: '_through.period.name' }
            ]"
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
            'showClientError'
        ]),
        addPointToDevice(device, devicePoint) {
            if (isPointUsedByEvent(this.modObject.points, devicePoint)) {
                return this.showClientError({
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
            });

            this.devicePoint = Object.assign({}, devicePointPattern);
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
                }
            });
        }
    },

    computed: {
        ...mapState({
            currentEvent: state => state.app.currentEvent,
            modObject   : state => state.app.modObject
        }),
        ...mapGetters([
            'periodOptions',
            'pointOptions'
        ]),
        displayedPoints() {
            return (!this.modObject) ? [] : this.modObject.points
                .filter(point => (point._through.period.Event_id === this.currentEvent.id));
        },
        disabledAdd() {
            return !this.devicePoint.period || !this.devicePoint.point;
        }
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';
</style>
