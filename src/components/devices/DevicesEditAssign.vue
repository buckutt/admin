<template>
    <div>
        <h5>Assigner l'équipement</h5>
        <form @submit.prevent="createPeriodPoint(modObject, inputPeriodPoint())">
            <mdl-select label="Point" id="point-select" v-model="periodPoint.point" :options="pointOptions"></mdl-select>
            <mdl-select label="Période" id="period-select" v-model="periodPoint.period" :options="periodOptions"></mdl-select>

            <mdl-button colored raised>Ajouter</mdl-button>
        </form>
        <b-table
            :headers="[
                { title: 'Point', field: 'point.name' },
                { title: 'Période', field: 'period.name' }
            ]"
            :data="displayedPeriodPoints"
            :actions="[
                { action: 'remove', text: 'Supprimer', type: 'confirm' }
            ]"
            route="periodPoints"
            :paging="5"
            @remove="removeObject">
        </b-table>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
    data() {
        return {
            periodPoint: {
                point : null,
                period: null
            }
        };
    },

    methods: {
        ...mapActions([
            'removeObject',
            'createMultipleRelation',
            'showClientError'
        ]),
        createPeriodPoint(device, periodPoint) {
            if (periodPoint.Point_id) {
                const filteredEvents = this.modObject.periodPoints
                    .filter((pP) => {
                        if (!pP.point) {
                            return false;
                        }

                        const samePoint = (periodPoint.Point_id === pP.point.id);
                        const overlap   = ((periodPoint.period.start <= pP.period.end)
                            && (periodPoint.period.end >= pP.period.start));

                        return samePoint && overlap;
                    })
                    .map(pP => pP.period.Event_id);

                if (filteredEvents.length > 0) {
                    if (periodPoint.period.Event_id !== filteredEvents[0]) {
                        return this.showClientError({
                            message: 'Le point est déjà utilisé par un autre événement sur cette période'
                        });
                    }
                }
            }

            delete periodPoint.period;

            this.createMultipleRelation({
                obj: {
                    route: 'devices',
                    value: device
                },
                relation: {
                    route : 'periodPoints',
                    fields: periodPoint
                }
            });
        },
        inputPeriodPoint() {
            const periodPoint = Object.assign({}, this.periodPoint);

            Object.keys(this.periodPoint).map((key) => {
                this.periodPoint[key] = null;
            });

            if (periodPoint.point) {
                periodPoint.Point_id = periodPoint.point.id;
                delete periodPoint.point;
            }

            if (periodPoint.period) {
                periodPoint.Period_id = periodPoint.period.id;
            }

            return periodPoint;
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
        displayedPeriodPoints() {
            return (!this.modObject) ? [] : this.modObject.periodPoints
                .filter(periodPoint => (periodPoint.period.Event_id === this.currentEvent.id))
                .map((periodPoint) => {
                    if (!periodPoint.point) {
                        periodPoint.point = { name: 'Aucun' };
                    }
                    return periodPoint;
                });
        }
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';
</style>
