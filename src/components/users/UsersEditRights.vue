<template>
    <div>
        <h5>Droits</h5>
        <form @submit.prevent="createUserRight(modObject, userRight)">
            <mdl-select label="Droit" id="right-select" v-model="userRight.name" :options="rightsList"></mdl-select>
            <mdl-select label="Point" id="point-select" v-model="userRight.point" :options="pointOptions"></mdl-select>
            <mdl-select label="Période" id="period-select" v-model="userRight.period" :options="periodOptions" v-if="currentEvent.config.hasPeriods"></mdl-select><br />
            <mdl-button colored raised :disabled="disabledAdd">Ajouter</mdl-button>
        </form>
        <br />
        <b-table
            :headers="displayedColumns"
            :data="displayedRights"
            :actions="[
                { action: 'remove', text: 'Supprimer', type: 'confirm' }
            ]"
            route="rights"
            :paging="10"
            @remove="removeObject">
        </b-table>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';

const userRightPattern = {
    name  : null,
    point : null,
    period: null
};

export default {
    data() {
        return {
            rightsList: ['admin', 'seller', 'reloader'],
            userRight : Object.assign({}, userRightPattern)
        };
    },

    methods: {
        ...mapActions([
            'removeObject',
            'createMultipleRelation',
            'showClientError'
        ]),
        createUserRight(user, right) {
            right.period = (this.currentEvent.config.hasPeriods) ? right.period : this.currentEvent.defaultPeriod;

            right.Period_id = right.period.id;
            delete right.period;

            if (right.point) {
                right.Point_id  = right.point.id;
                delete right.point;
            }

            this.createMultipleRelation({
                obj: {
                    route: 'users',
                    value: user
                },
                relation: {
                    route : 'rights',
                    fields: right
                }
            });

            this.userRight = Object.assign({}, userRightPattern);
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
        displayedColumns() {
            const columns = [
                { title: 'Droit', field: 'name' },
                { title: 'Point', field: 'point.name' }
            ];

            if (this.currentEvent.config.hasPeriods) {
                columns.push({ title: 'Période', field: 'period.name' });
            }

            return columns;
        },
        displayedRights() {
            return (!this.modObject) ? [] : this.modObject.rights
                .filter(right => (right.period.Event_id === this.currentEvent.id))
                .map((right) => {
                    if (!right.point) {
                        right.point = { name: 'Aucun' };
                    }
                    return right;
                });
        },
        disabledAdd() {
            return (!this.userRight.name || (!this.userRight.period && this.currentEvent.config.hasPeriods));
        }
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';
</style>
