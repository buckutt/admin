<template>
    <div>
        <h5>Droits</h5>
        <form @submit.prevent="createUserRight(modObject, inputRight())">
            <mdl-select label="Droit" id="right-select" v-model="userRight.name" :options="rightsList"></mdl-select>
            <mdl-select label="Point" id="point-select" v-model="userRight.point" :options="pointOptions"></mdl-select>
            <mdl-select label="Période" id="period-select" v-model="userRight.period" :options="periodOptions"></mdl-select><br />
            <mdl-button colored raised>Ajouter</mdl-button>
        </form>
        <br />
        <b-table
            :headers="[
                { title: 'Droit', field: 'name' },
                { title: 'Point', field: 'point.name'},
                { title: 'Période', field: 'period.name' }
            ]"
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

export default {
    data() {
        return {
            rightsList: ['admin', 'seller', 'reloader'],
            userRight : {
                name  : null,
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
        createUserRight(user, right) {
            if (!right.name || !right.Period_id) {
                return this.showClientError({ message: 'Tous les champs doivent être remplis.' });
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
        },
        inputRight() {
            const userRight = Object.assign({}, this.userRight);

            Object.keys(this.userRight).map((key) => {
                this.userRight[key] = null;
            });

            if (userRight.point) {
                userRight.Point_id = userRight.point.id;
                delete userRight.point;
            }

            if (userRight.period) {
                userRight.Period_id = userRight.period.id;
                delete userRight.period;
            }

            return userRight;
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
        displayedRights() {
            return (!this.modObject) ? [] : this.modObject.rights
                .filter(right => (right.period.Event_id === this.currentEvent.id))
                .map((right) => {
                    if (!right.point) {
                        right.point = { name: 'Aucun' };
                    }
                    return right;
                });
        }
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';
</style>
