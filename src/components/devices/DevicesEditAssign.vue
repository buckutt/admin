<template>
    <div>
        <h5>Assigner l'équipement</h5>
        <form @submit.prevent="createPeriodPoint(modObject, periodPoint)">
            <mdl-select label="Point" id="point-select" v-model="periodPoint.point" :options="pointOptions"></mdl-select>
            <mdl-select label="Période" id="period-select" v-model="periodPoint.period" :options="periodOptions"></mdl-select>

            <mdl-button colored raised :disabled="disabledAdd">Ajouter</mdl-button>
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
import { isPointUsedByEvent } from './isPointUsedByEvent';

const periodPointPattern = {
    point : null,
    period: null
};

export default {
    data() {
        return {
            periodPoint: Object.assign({}, periodPointPattern)
        };
    },

    methods: {
        ...mapActions([
            'removeObject',
            'createMultipleRelation',
            'showClientError'
        ]),
        createPeriodPoint(device, periodPoint) {
            if (periodPoint.point) {
                if (isPointUsedByEvent(this.modObject.periodPoints, periodPoint)) {
                    return this.showClientError({
                        message: 'Le point est déjà utilisé par un autre événement pendant cette période'
                    });
                }

                periodPoint.Point_id = periodPoint.point.id;
                delete periodPoint.point;
            }

            periodPoint.Period_id = periodPoint.period.id;
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

            this.periodPoint = Object.assign({}, periodPointPattern);
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
        },
        disabledAdd() {
            return !this.periodPoint.period;
        }
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';
</style>
