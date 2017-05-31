<template>
    <div>
        <h5>Groupes</h5>
        <form @submit.prevent="addGroupToUser(modObject, groupUser)">
            <mdl-select label="Groupe" id="group-select" v-model="groupUser.group" :options="groupOptions"></mdl-select>
            <mdl-select label="Période" id="period-select" v-model="groupUser.period" :options="periodOptions" v-if="currentEvent.config.hasPeriods"></mdl-select><br />
            <mdl-button colored raised :disabled="disabledAdd">Ajouter</mdl-button>
        </form>
        <br />
        <b-table
            :headers="displayedColumns"
            :data="displayedGroups"
            :actions="[
                { action: 'unlink', text: 'Supprimer', type: 'confirm' }
            ]"
            :paging="10"
            @unlink="removeGroupFromCurrentUser">
        </b-table>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';

const groupUserPattern = {
    group : null,
    period: null
};

export default {
    data() {
        return {
            groupUser: Object.assign({}, groupUserPattern)
        };
    },

    methods: {
        ...mapActions([
            'createSimpleRelation',
            'removeSimpleRelation',
            'showClientError'
        ]),
        addGroupToUser(user, groupUser) {
            groupUser.period = (this.currentEvent.config.hasPeriods) ?
                groupUser.period : this.currentEvent.defaultPeriod;

            const index = user.groups.findIndex(g => (
                g.id === groupUser.group.id && g._through.period.id === groupUser.period.id
            ));

            if (index > -1) {
                return this.showClientError({ message: 'L\'utilisateur est déjà membre du groupe sur cette période.' });
            }

            this.createSimpleRelation({
                obj1: {
                    route: 'users',
                    value: user
                },
                obj2: {
                    route: 'groups',
                    value: groupUser.group
                },
                through: {
                    obj  : 'period',
                    field: 'Period_id',
                    value: groupUser.period
                }
            });

            this.groupUser = Object.assign({}, groupUserPattern);
        },
        removeGroupFromCurrentUser(group) {
            this.removeGroupFromUser(this.modObject, group);
        },
        removeGroupFromUser(user, group) {
            this.removeSimpleRelation({
                obj1: {
                    route: 'users',
                    value: user
                },
                obj2: {
                    route: 'groups',
                    value: group
                },
                through: {
                    obj  : 'period',
                    field: 'Period_id',
                    value: group._through.period
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
            'groupOptions',
            'periodOptions'
        ]),
        displayedColumns() {
            const columns = [{ title: 'Groupe', field: 'name' }];

            if (this.currentEvent.config.hasPeriods) {
                columns.push({ title: 'Période', field: '_through.period.name' });
            }

            return columns;
        },
        displayedGroups() {
            return (!this.modObject) ? [] : this.modObject.groups
                .filter(group => (group._through.period.Event_id === this.currentEvent.id));
        },
        disabledAdd() {
            return (!this.groupUser.group || (!this.groupUser.period && this.currentEvent.config.hasPeriods));
        }
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';
</style>
