<template>
    <div class="b-groups__members">
        <div>
            <h5>Membres actuels</h5>
            <b-table
                :headers="displayedColumns"
                :data="memberships"
                :actions="[
                    { action: 'remove', text: 'Supprimer', type: 'confirm' }
                ]"
                route="memberships"
                :paging="5"
                @remove="removeObject">
            </b-table>
        </div>
        <div>
            <h5>Ajouter un membre</h5>
            <div v-if="membership.user">
                <form @submit.prevent="addUserToGroup(modObject, membership)">
                    <mdl-textfield floating-label="Nom" :value="membership.user.fullname" disabled></mdl-textfield><br />
                    <b-inputselect label="Période" id="period-select" :options="currentPeriodOptions" :fullOptions="periodOptions" v-model="membership.period"></b-inputselect><br />
                    <mdl-button colored raised :disabled="disabledAdd">Ajouter</mdl-button>
                </form>
                <br />
                <mdl-button colored raised accent @click.native="clearUser">Retour</mdl-button>
            </div>
            <div v-if="!membership.user">
                <mdl-textfield floating-label="Nom/Prénom" v-model="userName" @input="searchUsers(userName)"></mdl-textfield>
                <b-table
                    :headers="[{ title: 'Utilisateur', field: 'fullname', class: 'b--capitalized' }]"
                    :data="displayedUsers"
                    :sort="{ field: 'firstname', order: 'ASC' }"
                    :actions="displayedActions"
                    route="users"
                    :paging="5"
                    @select="selectUser"
                    @add="addUserToCurrentGroup">
                </b-table>
            </div>
        </div>
    </div>
</template>
<script>
import debounce from 'lodash.debounce';
import { mapState, mapActions, mapGetters } from 'vuex';

const membershipPattern = {
    period: null,
    user  : null
};

export default {
    data() {
        return {
            userName  : '',
            membership: Object.assign({}, membershipPattern)
        };
    },

    methods: {
        ...mapActions([
            'searchUsers',
            'createObject',
            'removeObject',
            'notify',
            'notifyError'
        ]),
        selectUser(user) {
            this.membership.user = user;
        },
        clearUser() {
            this.membership.user = null;
        },
        addUserToGroup(group, membership) {
            const index = group.memberships.findIndex(m => (
                m.group.id === group.id && m.period.id === membership.period.id
            ));

            if (index > -1) {
                return this.notifyError({ message: 'L\'utilisateur est déjà membre du groupe sur cette période.' });
            }

            const newMembership = {
                group_id : group.id,
                period_id: membership.period.id,
                user_id  : membership.user.id
            };

            this
                .createObject({
                    route: 'memberships',
                    value: newMembership
                })
                .then(() => this.notify({ message: 'L\'utilisateur a bien été ajouté au groupe' }))
                .catch(err => this.notifyError({
                    message: 'Une erreur a eu lieu lors de la modification de l\'utilisateur',
                    full   : err
                }));

            this.membership = Object.assign({}, membershipPattern);
        },
        addUserToCurrentGroup(user) {
            this.addUserToGroup(this.modObject, {
                period: this.currentEvent.defaultPeriod,
                user
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
            'periodOptions',
            'currentPeriodOptions'
        ]),
        memberships() {
            return (!this.modObject) ? [] : this.modObject.memberships
                .filter(membership => (membership.period.event_id === this.currentEvent.id))
                .map((membership) => {
                    membership.user.fullname = `${membership.user.firstname} ${membership.user.lastname}`;

                    if (membership.period.id !== this.currentEvent.defaultPeriod_id
                        && !this.currentEvent.usePeriods) {
                        membership.warning = 'Une période autre que<br />celle par défaut est utilisée.';
                    }

                    return membership;
                });
        },
        displayedColumns() {
            const columns = [{ title: 'Utilisateur', field: 'user.fullname', class: 'b--capitalized' }];
            if (this.currentEvent.usePeriods) {
                columns.push({ title: 'Période', field: 'period.name' });
            }

            return columns;
        },
        displayedActions() {
            return (this.currentEvent.usePeriods) ?
                [{
                    action : 'select', text   : 'Sélectionner', raised : true, colored: true
                }] :
                [{
                    action : 'add', text   : 'Ajouter', raised : true, colored: true
                }];
        },
        displayedUsers() {
            return this.users.map((user) => {
                user.fullname = `${user.firstname} ${user.lastname}`;
                return user;
            });
        },
        disabledAdd() {
            return !this.membership.period;
        }
    },

    mounted() {
        const searchUsers = this.searchUsers;
        this.searchUsers  = debounce(name => searchUsers(name), 500);
    }
};
</script>

<style>
    .b-groups__members {
        display: flex;
        justify-content: space-between;

        & > div {
            width: 49%;
        }
    }
</style>
