<template>
    <div class="groups" v-show="currentEvent">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Groupes</h3>
            <div v-show="selectedGroup.name" transition="fade">
                <h5>Modifier le groupe {{ selectedGroup.name }}:</h5>
                <form v-on:submit.prevent>
                    <mdl-textfield floating-label="Nom" :value.sync="modGroup.name"></mdl-textfield><br />
                    <mdl-button colored raised @click="updateGroup(selectedGroup, modGroup)">Modifier</mdl-button>
                </form>
                <br />

                <h5>Rechercher un membre:</h5>
                <form v-on:submit.prevent>
                    <mdl-textfield floating-label="Prénom" :value.sync="memberName"></mdl-textfield>
                    <mdl-button colored raised @click="searchMember()">Rechercher</mdl-button>
                </form>

                <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp" v-show="members.length > 0">
                    <thead>
                        <tr>
                            <th class="mdl-data-table__cell--non-numeric">Utilisateur</th>
                            <th class="mdl-data-table__cell--non-numeric">Periode</th>
                            <th class="mdl-data-table__cell--non-numeric">Action</th>
                        </tr>
                    </thead>
                    <tbody v-for="member in members">
                        <tr v-for="groupPeriod in member.groupPeriods" v-show="groupPeriod.period.Event_id == currentEvent.id">
                            <td class="mdl-data-table__cell--non-numeric name">{{ member.firstname }} {{ member.lastname }}</td>
                            <td class="mdl-data-table__cell--non-numeric name">{{ groupPeriod.period.name }}</td>
                            <td class="mdl-data-table__cell--non-numeric">
                                <mdl-button @click="removeFromGroup(groupPeriod)">Enlever</mdl-button>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-show="members">
                        <tr>
                            <td class="mdl-data-table__cell--non-numeric name">
                                <mdl-select label="Utilisateur" id="member-select" :value.sync="selectedMember" :options="memberOptions" class="name"></mdl-select>
                            </td>
                            <td class="mdl-data-table__cell--non-numeric">
                                <mdl-select label="Période" id="period-select" :value.sync="selectedPeriod" :options="periodOptions"></mdl-select>
                            </td>
                            <td class="mdl-data-table__cell--non-numeric">
                                <mdl-button @click="addToGroup(selectedMember, inputGroupPeriod)" v-show="selectedMember && selectedPeriod">Ajouter</mdl-button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <mdl-button colored raised @click="goBack()">Retour</mdl-button>
            </div>
            <div v-show="!selectedGroup.name" transition="fade">
                <form v-on:submit.prevent>
                    <mdl-textfield floating-label="Nom" :value.sync="name"></mdl-textfield><br />
                    <mdl-button colored raised @click="createGroup(inputGroup)">Créer</mdl-button>
                </form>

                <br>

                <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                    <thead>
                        <tr>
                            <th class="mdl-data-table__cell--non-numeric">Groupe</th>
                            <th class="mdl-data-table__cell--non-numeric">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="group in groups">
                            <td class="mdl-data-table__cell--non-numeric">{{ group.name }}</td>
                            <td class="mdl-data-table__cell--non-numeric">
                                <mdl-button @click="editGroup(group)">Modifier</mdl-button>
                                <mdl-button @click="removeGroup(group)">Supprimer</mdl-button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <mdl-snackbar display-on="snackfilter"></mdl-snackbar>
</template>

<script>
import { get, post, put } from '../lib/fetch';
import { createGroup, updateGroup, removeGroup } from '../store/actions';


export default {
    vuex: {
        getters: {
            groups      : state => state.app.groups,
            periods     : state => state.app.periods,
            currentEvent: state => state.global.currentEvent
        },
        actions: {
            createGroup: createGroup,
            updateGroup: updateGroup,
            removeGroup: removeGroup
        }
    },

    data () {
        return {
            name          : '',
            memberName    : '',
            selectedGroup : {},
            modGroup      : {},
            members       : [],
            selectedPeriod: null,
            selectedMember: null
        };
    },

    methods: {
        goBack() {
            this.selectedGroup = {};
            this.modGroup      = {};
        },
        editGroup(group) {
            this.selectedGroup  = group;
            this.modGroup       = JSON.parse(JSON.stringify(group));
        },
        searchMember() {
            if(this.memberName.length >= 2) {
                this.selectedPeriod = null;
                this.selectedMember = null;

                const embedUsers = encodeURIComponent(JSON.stringify({
                    groupPeriods: {
                        period: true
                    }
                }));
                const q = [];

                q.push(JSON.stringify({
                    field  : 'firstname',
                    matches: `.*${this.memberName.toLowerCase()}.*`
                }));

                q.push(JSON.stringify({
                    field  : 'isRemoved',
                    eq     : false
                }));

                const orQ = q
                    .map(o => encodeURIComponent(o))
                    .join('&q[]=');

                get(`users/search?q=${orQ}&embed=${embedUsers}`)
                    .then(result => {
                        this.members = result.map(member => {
                            if(member.groupPeriods) {
                                member.groupPeriods = member.groupPeriods.filter(groupPeriod => {
                                    return !groupPeriod.isRemoved;
                                });
                            }

                            return member;
                        });
                        console.log(this.members[1].groupPeriods);
                    });
            }
        },
        addToGroup(user, groupPeriod) {
            let exists = false;

            user.groupPeriods.forEach(gPeriod => {
                if (gPeriod.Period_id == groupPeriod.Period_id && gPeriod.Group_id == gPeriod.Group_id) {
                    exists = true;
                }
            });

            if(!exists) {
                let currentGroupPeriod  = {};
                const embedGroupPeriods = encodeURIComponent(JSON.stringify({
                    period: true
                }));

                post(`groupPeriods?embed=${embedGroupPeriods}`, groupPeriod)
                    .then(result => {
                        currentGroupPeriod = result;
                        return post(`users/${user.id}/groupPeriods`, {id: result.id});
                    })
                    .then(result => {
                        this.members = this.members.map(member => {
                            if (member.id == user.id) {
                                member.groupPeriods.push(currentGroupPeriod);
                            }
                            return member;
                        });
                    });
            } else {
                const data = {
                    message: 'L\'utilisateur appartient déjà au groupe sur cette période.',
                    timeout: 2000
                };

                this.$broadcast('snackfilter', data);
            }
        },
        removeFromGroup(groupPeriod) {
            groupPeriod.isRemoved = true;

            put(`groupPeriods/${groupPeriod.id}`, groupPeriod)
                .then(result => {
                    this.members = this.members.map(member => {
                        let i = 0;
                        for(const g of member.groupPeriods) {
                            if(g.id === groupPeriod.id) {
                                break;
                            }
                            ++i;
                        }
                        member.groupPeriods.splice(i, 1);

                        return member;
                    });
                });
        }
    },

   computed: {
        inputGroupPeriod() {
            const group         = this.selectedGroup;
            const period        = this.selectedPeriod;

            return {
                Period_id: period.id,
                Group_id : group.id
            }
        },
        inputGroup() {
            const name = this.name;
            this.name  = '';
            return {
                name: name,
            };
        },
        memberOptions() {
            let members = this.members.map(member => {
                return { name: `${member.firstname} ${member.lastname}`, value: member };
            });

            return members.filter(a => a);
        },
        periodOptions() {
            if(!this.currentEvent) {
                return {};
            }

            let periods = this.periods.map(period => {
                if(period.Event_id == this.currentEvent.id) {
                    return { name: period.name, value: period };
                } else {
                    return null;
                }
            });

            return periods.filter(a => a);
        }
    }
}
</script>

<style lang="sass">
    @import '../main.scss';

    .groups {
        > div {
            min-height: calc(100% - 40px);
            margin: 20px ((100% - $cardSize) / 2);
            padding: 20px;
            width: $cardSize;

            > h3 {
                margin: 0;
            }

            > select {
                display: inline-block;
                max-width: 150px;
            }

            button {
                max-width: 300px;
            }

            table {
                width: 100%;
                white-space: normal;
            }
        }

        & + .mdl-snackbar {
            margin-left: $sidebarWidth / 2;
        }

        .name {
            text-transform: capitalize;
        }

        .fade-transition {
            transition: opacity .4s ease;
        }

        .fade-enter {
            opacity: 0;
        }

        .fade-leave {
            display: none;
        }
    }
</style>
