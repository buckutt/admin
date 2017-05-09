<template>
    <div>
        <h5>Groupes</h5>
        <form @submit.prevent="createGroupPeriod(modObject, groupPeriod)">
            <mdl-select label="Groupe" id="group-select" v-model="groupPeriod.group" :options="groupOptions"></mdl-select>
            <mdl-select label="Période" id="period-select" v-model="groupPeriod.period" :options="periodOptions"></mdl-select><br />
            <mdl-button colored raised :disabled="disabledAdd">Ajouter</mdl-button>
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

const groupPeriodPattern = {
    group : null,
    period: null
};

export default {
    data() {
        return {
            groupPeriod: Object.assign({}, groupPeriodPattern)
        };
    },

    methods: {
        ...mapActions([
            'removeObject',
            'createMultipleRelation',
            'showClientError'
        ]),
        createGroupPeriod(user, groupPeriod) {
            const index = user.groupPeriods.findIndex(o => (
                o.group.id === groupPeriod.group.id && o.period.id === groupPeriod.period.id
            ));

            if (index > -1) {
                return this.showClientError({ message: 'L\'utilisateur est déjà membre du groupe sur cette période.' });
            }

            groupPeriod.Group_id  = groupPeriod.group.id;
            groupPeriod.Period_id = groupPeriod.period.id;
            delete groupPeriod.group;
            delete groupPeriod.period;

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

            this.groupPeriod = Object.assign({}, groupPeriodPattern);
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
        },
        disabledAdd() {
            return (!this.groupPeriod.group || !this.groupPeriod.period);
        }
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';
</style>
