<template>
    <div class="groups">
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
                            <th class="mdl-data-table__cell--non-numeric">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="member in members">
                            <td class="mdl-data-table__cell--non-numeric name">{{ member.firstname }} {{ member.lastname }}</td>
                            <td class="mdl-data-table__cell--non-numeric">
                                <mdl-button @click="addToGroup(member)" v-show="!isMember(member)">Ajouter</mdl-button>
                                <mdl-button @click="removeFromGroup(member)" v-show="isMember(member)">Enlever</mdl-button>
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
</template>

<script>
import { get, post, del } from '../lib/fetch';
import { createGroup, updateGroup, removeGroup } from '../store/actions';


export default {
    vuex: {
        getters: {
            groups: state => state.app.groups
        },
        actions: {
            createGroup: createGroup,
            updateGroup: updateGroup,
            removeGroup: removeGroup
        }
    },

    data () {
        return {
            name         : '',
            memberName   : '',
            selectedGroup: {},
            modGroup     : {},
            members      : {}
        };
    },

    methods: {
        goBack() {
            this.selectedGroup = {};
            this.modGroup      = {};
        },
        editGroup(group) {
            this.selectedGroup = group;
            this.modGroup      = JSON.parse(JSON.stringify(group));
        },
        searchMember() {
            if(this.memberName.length >= 2) {
                const embedUsers = encodeURIComponent(JSON.stringify({
                    groups: true
                }));
                const q          = [];

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
                        this.members = result;
                    });
            }
        },
        isMember(member) {
            let isMember = false;
            if(member.groups.length > 0) {
                member.groups.forEach((g, i) => {
                    if(g.id == this.selectedGroup.id) {
                        isMember = true;
                    }
                });
            }
            return isMember;
        },
        addToGroup(member) {
            post(`groups/${this.selectedGroup.id}/users`, {id: member.id})
                .then(result => {
                    let i = 0;
                    for (const m of this.members) {
                        if (m.id === member.id) {
                            break;
                        }

                        ++i;
                    }

                    this.members[i].groups.push(this.selectedGroup);
                });
        },
        removeFromGroup(member) {
            del(`groups/${this.selectedGroup.id}/users/${member.id}`)
                .then(result => {
                    let i = 0;
                    for (const m of this.members) {
                        if (m.id === member.id) {
                            break;
                        }

                        ++i;
                    }


                    let j = 0;
                    for(const g of this.members[i].groups) {
                        if(g.id === this.selectedGroup.id) {
                            break;
                        }

                        ++j;
                    }

                    this.members[i].groups.splice(j, 1);
                });
        }
    },

   computed: {
        inputGroup() {
            const name = this.name;
            this.name  = '';
            return {
                name: name,
            };
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
