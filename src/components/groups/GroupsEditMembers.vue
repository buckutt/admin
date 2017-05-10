<template>
    <div class="b-groups__members">
        <div>
            <h5>Membres actuels</h5>
            <b-table
                :headers="[
                    { title: 'Utilisateur', field: 'fullname', class: 'b--capitalized' },
                    { title: 'Période', field: '_through.period.name' }
                ]"
                :data="groupUsers"
                :actions="[
                    { action: 'unlink', text: 'Supprimer', type: 'confirm' }
                ]"
                :paging="5"
                @unlink="removeUserFromCurrentGroup">
            </b-table>
        </div>
        <div>
            <h5>Ajouter un membre</h5>
            <div v-if="groupUser.user">
                <form @submit.prevent="addUserToGroup(modObject, groupUser)">
                    <mdl-textfield floating-label="Nom" :value="groupUser.user.fullname" disabled></mdl-textfield><br />
                    <mdl-select label="Periode" id="select-periods" v-model="groupUser.period" :options="periodOptions"></mdl-select><br />
                    <mdl-button colored raised :disabled="disabledAdd">Ajouter</mdl-button>
                </form>
                <br />
                <mdl-button colored raised accent @click.native="clearUser">Retour</mdl-button>
            </div>
            <div v-if="!groupUser.user">
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

const groupUserPattern = {
    period: null,
    user  : null
};

export default {
    data() {
        return {
            userName : '',
            groupUser: Object.assign({}, groupUserPattern)
        };
    },

    methods: {
        ...mapActions([
            'searchUsers',
            'createSimpleRelation',
            'removeSimpleRelation',
            'showClientError'
        ]),
        selectUser(user) {
            this.groupUser.user = user;
        },
        clearUser() {
            this.groupUser.user = null;
        },
        addUserToGroup(group, groupUser) {
            const index = groupUser.user.groups.findIndex(g => (
                g.id === group.id && g._through.period.id === groupUser.period.id
            ));

            if (index > -1) {
                return this.showClientError({ message: 'L\'utilisateur est déjà membre du groupe sur cette période.' });
            }

            this.createSimpleRelation({
                obj1: {
                    route: 'users',
                    value: groupUser.user
                },
                obj2: {
                    route: 'groups',
                    value: group
                },
                through: {
                    obj  : 'period',
                    field: 'Period_id',
                    value: groupUser.period
                }
            });

            this.groupUser = Object.assign({}, groupUserPattern);
        },
        removeUserFromCurrentGroup(user) {
            this.removeUserFromGroup(this.modObject, user);
        },
        removeUserFromGroup(group, user) {
            this.removeSimpleRelation({
                obj1: {
                    route: 'users',
                    value: user
                },
                obj2: {
                    route: 'groups',
                    value: group
                }
            });
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
            return (!this.modObject) ? [] : this.modObject.users
                .filter(user => (user._through.period.Event_id === this.currentEvent.id))
                .map((user) => {
                    user.fullname = `${user.firstname} ${user.lastname}`;
                    return user;
                });
        },
        displayedUsers() {
            return this.users.map((user) => {
                user.fullname = `${user.firstname} ${user.lastname}`;
                return user;
            });
        },
        disabledAdd() {
            return !this.groupUser.period;
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
