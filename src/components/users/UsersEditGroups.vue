<template>
    <div>
        <h5>Groupes</h5>
        <form @submit.prevent="createGroupPeriod(modObject, inputGroupPeriod())">
            <mdl-select label="Groupe" id="group-select" v-model="groupPeriod.group" :options="groupOptions"></mdl-select>
            <mdl-select label="Période" id="period-select-2" v-model="groupPeriod.period" :options="periodOptions"></mdl-select><br />
            <mdl-button colored raised>Ajouter</mdl-button>
        </form>
        <br />
        <b-table
            :headers="[
                { title: 'Groupe', field: 'group.name' },
                { title: 'Période', field: 'period.name' }
            ]"
            :data="displayedGroupPeriods"
            :actions="[
                { action: 'remove', text: 'Supprimer', type: 'confirm' }
            ]"
            route="groupPeriods"
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
            groupPeriod: {
                group : null,
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
        createGroupPeriod(user, groupPeriod) {
            if (!groupPeriod.Group_id || !groupPeriod.Period_id) {
                return this.showClientError({ message: 'Tous les champs doivent être remplis.' });
            }

            const index = user.groupPeriods.findIndex(o => (
                o.group.id === groupPeriod.Group_id && o.period.id === groupPeriod.Period_id
            ));

            if (index > -1) {
                return this.showClientError({ message: 'L\'utilisateur est déjà membre du groupe sur cette période.' });
            }

            this.createMultipleRelation({
                obj: {
                    route: 'users',
                    value: user
                },
                relation: {
                    route : 'groupPeriods',
                    fields: groupPeriod
                }
            });
        },
        inputGroupPeriod() {
            const groupPeriod = Object.assign({}, this.groupPeriod);

            Object.keys(this.groupPeriod).map((key) => {
                this.groupPeriod[key] = null;
            });

            if (groupPeriod.group) {
                groupPeriod.Group_id = groupPeriod.group.id;
                delete groupPeriod.group;
            }

            if (groupPeriod.period) {
                groupPeriod.Period_id = groupPeriod.period.id;
                delete groupPeriod.period;
            }

            return groupPeriod;
        }
    },

    computed: {
        ...mapState({
            currentEvent: state => state.app.currentEvent,
            modObject   : state => state.app.modObject
        }),
        ...mapGetters([
            'groupOptions',
            'periodOptions'
        ]),
        displayedGroupPeriods() {
            return (!this.modObject) ? [] : this.modObject.groupPeriods
                .filter(groupPeriod => (groupPeriod.period.Event_id === this.currentEvent.id));
        }
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';
</style>
