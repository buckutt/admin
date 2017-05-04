<template>
    <div class="b-groups__members">
        <div>
            <h5>Membres actuels</h5>
            <b-table
                :headers="[
                    { title: 'Utilisateur', field: 'user.fullname', class: 'b--capitalized' },
                    { title: 'Période', field: 'period.name' }
                ]"
                :data="groupUsers"
                :actions="[
                    { action: 'remove', text: 'Supprimer', type: 'confirm' }
                ]"
                route="groupPeriods"
                :paging="5"
                @remove="removeObject">
            </b-table>
        </div>
        <div>
            <h5>Ajouter un membre</h5>
            <div v-if="selectedUser">
                <form @submit.prevent="createGroupPeriod(selectedUser, inputGroupPeriod())">
                    <mdl-textfield floating-label="Nom" :value="selectedUser.fullname" disabled></mdl-textfield><br />
                    <mdl-select label="Periode" id="select-periods" v-model="groupPeriod.period" :options="periodOptions"></mdl-select><br />
                    <mdl-button colored raised >Ajouter</mdl-button>
                </form>
                <br />
                <mdl-button colored raised accent @click.native="clearUser">Retour</mdl-button>
            </div>
            <div v-if="!selectedUser">
                <mdl-textfield floating-label="Prénom" v-model="userName" @input="searchUsers(userName)"></mdl-textfield>
                <b-table
                    :headers="[{ title: 'Utilisateur', field: 'fullname', class: 'b--capitalized' }]"
                    :data="displayedUsers"
                    :sort="{ field: 'firstname', order: 'ASC' }"
                    :actions="[
                        { action: 'select', text: 'Sélectionner', raised: true, colored: true }
                    ]"
                    route="users"
                    :paging="5"
                    @select="selectUser">
                </b-table>
            </div>
        </div>
    </div>
</template>
<script>
import debounce from 'lodash.debounce';
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
    data() {
        return {
            userName    : '',
            selectedUser: null,
            groupPeriod : {
                period: null
            }
        };
    },

    methods: {
        ...mapActions([
            'searchUsers',
            'removeObject',
            'createMultipleRelation',
            'showClientError'
        ]),
        selectUser(user) {
            this.selectedUser = user;
        },
        clearUser() {
            this.selectedUser = null;
        },
        createGroupPeriod(user, groupPeriod) {
            if (!groupPeriod.Period_id) {
                return this.showClientError({ message: 'La période doit être sélectionnée' });
            }

            const index = this.groupUsers.findIndex(o => (
                o.user.id === user.id && o.period.id === groupPeriod.Period_id
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
            const groupPeriod    = Object.assign({}, this.groupPeriod);
            groupPeriod.Group_id = this.modObject.id;
            if (groupPeriod.period) {
                groupPeriod.Period_id = groupPeriod.period.id;
                delete groupPeriod.period;
            }
            this.groupPeriod.period = null;

            return groupPeriod;
        }
    },

    computed: {
        ...mapState({
            users       : state => state.objects.users,
            modObject   : state => state.app.modObject,
            currentEvent: state => state.app.currentEvent
        }),
        ...mapGetters([
            'periodOptions'
        ]),
        groupUsers() {
            const users = [];
            this.modObject.groupPeriods.forEach((groupPeriod) => {
                if (groupPeriod.period.Event_id === this.currentEvent.id) {
                    groupPeriod.users.forEach((user) => {
                        user.fullname = `${user.firstname} ${user.lastname}`;
                        users.push({ id: groupPeriod.id, period: groupPeriod.period, user });
                    });
                }
            });
            return users;
        },
        displayedUsers() {
            return this.users.map((user) => {
                user.fullname = `${user.firstname} ${user.lastname}`;
                return user;
            });
        }
    },

    mounted() {
        const searchUsers = this.searchUsers;
        this.searchUsers  = debounce(name => searchUsers(name), 500);
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';

    .b-groups__members {
        display: flex;
        justify-content: space-between;

        > div {
            width: 49%;
        }
    }
</style>
