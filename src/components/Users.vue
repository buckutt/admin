<template>
    <div class="users">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Utilisateurs</h3>
            <div v-show="selectedUser.firstname" transition="fade">
                <h5 class="name">Modifier {{ selectedUser.firstname }} {{ selectedUser.lastname }}</h5>
                <form v-on:submit.prevent>
                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input class="mdl-textfield__input name" type="text" id="lastname" v-model="modUser.lastname">
                        <label class="mdl-textfield__label" for="lastname">Nom</label>
                    </div>
                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input class="mdl-textfield__input name" type="text" id="firstname" v-model="modUser.firstname">
                        <label class="mdl-textfield__label" for="firstname">Prénom</label>
                    </div>
                    <br />
                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input class="mdl-textfield__input" type="text" id="nickname" v-model="modUser.nickname">
                        <label class="mdl-textfield__label" for="nickname">Surnom</label>
                    </div>
                    <br />
                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input class="mdl-textfield__input" type="text" id="mail" v-model="modUser.mail">
                        <label class="mdl-textfield__label" for="mail">Mail</label>
                    </div>
                    <br>
                    <input type="submit" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" @click="updateUser(selectedUser, modUser)" value="Modifier">
                </form>
                <br />
                <h5>Droits</h5>
                <form v-on:submit.prevent>
                    <select v-model="rightChoice">
                        <option v-bind:value="rightName" v-for="rightName in rightsList">{{ rightName }}</option>
                    </select>
                    <select v-model="rightPoint">
                        <option v-bind:value="null" selected>Aucun</option>
                        <option v-bind:value="point" v-for="point in points">{{ point.name }}</option>
                    </select>
                    <select v-model="rightPeriod">
                        <option v-bind:value="period" v-for="period in periods">{{ period.name }}</option>
                    </select>
                    <input type="submit" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" @click="createUserRight(selectedUser, inputRight)" value="Ajouter">
                </form>
                <br />
                <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp" v-show="detailsUser.rights">
                    <thead>
                        <tr>
                            <th class="mdl-data-table__cell--non-numeric">Droit</th>
                            <th class="mdl-data-table__cell--non-numeric">Point</th>
                            <th class="mdl-data-table__cell--non-numeric">Période</th>
                            <th class="mdl-data-table__cell--non-numeric">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="right in detailsUser.rights">
                            <td class="mdl-data-table__cell--non-numeric name">{{ right.name }}</td>
                            <td class="mdl-data-table__cell--non-numeric" v-if="right.point">{{ right.point.name }}</td>
                            <td class="mdl-data-table__cell--non-numeric" v-else>Aucun</td>
                            <td class="mdl-data-table__cell--non-numeric">{{ right.period.name }}</td>
                            <td class="mdl-data-table__cell--non-numeric">
                                <button type="button" class="mdl-button" @click="openModal(right)">Modifier</button>
                                <button type="button" class="mdl-button" @click="deleteRight(right)">Supprimer</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" @click="goBack()">Retour</button>
            </div>
            <div v-show="!selectedUser.firstname" transition="fade">
                <h5>Créer un utilisateur</h5>
                <form v-on:submit.prevent>
                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input class="mdl-textfield__input" type="text" id="lastname" v-model="lastname">
                        <label class="mdl-textfield__label" for="lastname">Nom</label>
                    </div>
                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input class="mdl-textfield__input" type="text" id="firstname" v-model="firstname">
                        <label class="mdl-textfield__label" for="firstname">Prénom</label>
                    </div>
                    <br />
                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input class="mdl-textfield__input" type="text" id="nickname" v-model="nickname">
                        <label class="mdl-textfield__label" for="nickname">Surnom</label>
                    </div>
                    <br />
                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input class="mdl-textfield__input" type="text" id="mail" v-model="mail">
                        <label class="mdl-textfield__label" for="mail">Mail</label>
                    </div>
                    <br>
                    <input type="submit" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" @click="createUser(inputUser)" value="Créer">
                </form>

                <h5>Rechercher un utilisateur</h5>
                <form v-on:submit.prevent>
                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input type="text" v-model="userName" class="mdl-textfield__input">
                        <label for="userName" class="mdl-textfield__label">Nom</label>
                    </div>
                    <input type="submit" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" value="Rechercher" @click="searchUser()">
                </form>

                <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp" v-show="users.length > 0">
                    <thead>
                        <tr>
                            <th class="mdl-data-table__cell--non-numeric">Utilisateur</th>
                            <th class="mdl-data-table__cell--non-numeric">Surnom</th>
                            <th class="mdl-data-table__cell--non-numeric">Mail</th>
                            <th class="mdl-data-table__cell--non-numeric">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in users">
                            <td class="mdl-data-table__cell--non-numeric name">{{ user.firstname }} {{ user.lastname }}</td>
                            <td class="mdl-data-table__cell--non-numeric">{{ user.nickname }}</td>
                            <td class="mdl-data-table__cell--non-numeric">{{ user.mail }}</td>
                            <td class="mdl-data-table__cell--non-numeric">
                                <button type="button" class="mdl-button" @click="editUser(user)">Modifier</button>
                                <button type="button" class="mdl-button" @click="deleteUser(user)">Supprimer</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="modal modal__bg" v-modal="openEditModal" v-el:editmodal>
        <div class="modal__dialog">
            <div class="modal__header">
                <h3>Modifier le droit {{ selectedRight.name }}</h3>
            </div>
            <form v-on:submit.prevent>
                <div class="modal__body">
                    <select v-model="modRight.name">
                        <option v-bind:value="rightName" v-for="rightName in rightsList">{{ rightName }}</option>
                    </select><br />
                    <select v-model="modRight.point">
                        <option v-bind:value="null" selected>Aucun</option>
                        <option v-bind:value="point" v-for="point in points">{{ point.name }}</option>
                    </select><br />
                    <select v-model="modRight.period">
                        <option v-bind:value="period" v-for="period in periods">{{ period.name }}</option>
                    </select>
                </div>
                <div class="modal__footer">
                    <input type="submit" class="mdl-button modal__close" @click="updateRight(selectedRight, editRight)" value="Valider">
                    <button type="button" class="mdl-button modal__close" @click="closeModal()">Annuler</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { get, post, put } from '../lib/fetch';
import modal from '../lib/modal';

export default {
    vuex: {
        getters: {
            points : state => state.app.points,
            periods: state => state.app.periods
        },
        actions: {
        }
    },

    data () {
        return {
            rightsList   : ['admin', 'seller', 'reloader'],
            firstname    : '',
            lastname     : '',
            nickname     : '',
            mail         : '',
            userName     : '',
            rightChoice  : '',
            rightPoint   : {},
            rightPeriod  : {},
            users        : [],
            selectedUser : {},
            detailsUser  : {},
            modUser      : {},
            selectedRight: {},
            modRight     : {},
            openEditModal: false
        };
    },

    methods: {
        goBack() {
            this.selectedUser = {};
            this.modUser      = {};
        },
        createUser(user) {
            post('users', user)
                .then(result => {
                    this.userName = user.firstname;
                    this.searchUser();
                });
        },
        searchUser() {
            if(this.userName.length >= 2) {
                const q = [];

                q.push(JSON.stringify({
                    field  : 'firstname',
                    matches: `.*${this.userName.toLowerCase()}.*`
                }));

                q.push(JSON.stringify({
                    field  : 'isRemoved',
                    eq     : false
                }));

                const orQ = q
                    .map(o => encodeURIComponent(o))
                    .join('&q[]=');

                get(`users/search?q=${orQ}`)
                    .then(result => {
                        this.users = result;
                    });
            }
        },
        editUser(user) {
            this.rightChoice = this.rightsList[0];
            this.rightPoint  = this.$store.state.app.points[0];
            this.rightPeriod = this.$store.state.app.periods[0];

            const embedUsers = encodeURIComponent(JSON.stringify({
                rights: {
                    period: true,
                    point : true
                }
            }));

            get(`users/${user.id}?embed=${embedUsers}`)
                .then(result => {
                    result.rights = result.rights.filter(right => {
                        return !right.isRemoved;
                    });
                    this.detailsUser = result;
                });

            this.selectedUser = user;
            this.modUser      = JSON.parse(JSON.stringify(user));
            this.searchUser();
        },
        updateUser(user, modUser) {
            const embedRights = encodeURIComponent(JSON.stringify({
                period: true,
                point : true
            }));

            put(`users/${user.id}?embed=${embedRights}`, modUser)
                .then(result => {
                    this.selectedUser = JSON.parse(JSON.stringify(modUser));
                    this.users.forEach((u, i) => {
                        if(u.id == user.id) {
                            this.users[i] = Object.assign(this.users[i], modUser);
                        }
                    });
                });
        },
        deleteUser(user) {
            user.isRemoved = true;
            put(`users/${user.id}`, user)
                .then(result => {
                    let i = 0;
                    for(const u of this.users) {
                        if(u.id === user.id) {
                            break;
                        }

                        ++i;
                    }

                    this.users.splice(i, 1);
                });
        },
        updateRight(selectedRight, modRight) {
            if(modRight.point) {
                modRight.Point_id  = modRight.point.id;
            } else {
                modRight.Point_id = null;
            }
            modRight.Period_id = modRight.period.id;
            put(`rights/${selectedRight.id}`, modRight)
                .then(result => {
                    this.detailsUser.rights.forEach((r, i) => {
                        if (r.id === result.id) {
                            if(!result.point) {
                                result.point = null;
                            }
                            this.detailsUser.rights[i] = Object.assign(this.detailsUser.rights[i], result);
                        }
                    });
                });
            this.closeModal();
            this.modRight = {};
        },
        deleteRight(right) {
            right.isRemoved = true;
            put(`rights/${right.id}`, right)
                .then(result => {
                    let i = 0;
                    for(const r of this.detailsUser.rights) {
                        if(r.id === right.id) {
                            break;
                        }

                        ++i;
                    }

                    this.detailsUser.rights.splice(i, 1);
                });
        },
        createUserRight(user, right) {
            let currentRight  = {};
            const embedRight  = encodeURIComponent(JSON.stringify({
                point : true,
                period: true
            }));

            post(`rights?embed=${embedRight}`, right)
                .then(result => {
                    currentRight = result;
                    return post(`users/${user.id}/rights`, {id: result.id});
                })
                .then(result => {
                    this.detailsUser.rights.push(currentRight);
                });
        },
        openModal(right) {
            this.selectedRight = right;
            this.modRight      = JSON.parse(JSON.stringify(right));

            this.openEditModal = true;
        },
        closeModal() {
            this.openEditModal = false;
        }
    },

   computed: {
        inputUser() {
            const firstname = this.firstname;
            const lastname  = this.lastname;
            const nickname  = this.nickname;
            const mail      = this.mail;
            this.firstname  = '';
            this.lastname   = '';
            this.nickname   = '';
            this.mail       = '';
            return {
                firstname: firstname,
                lastname : lastname,
                nickname : nickname,
                mail     : mail,
                credit   : 0,
                pin      : 'TODO',
                password : 'TODO'
            };
        },
        inputRight() {
            const name       = this.rightChoice;
            const point      = this.rightPoint;
            const period     = this.rightPeriod;
            this.rightChoice = '';
            this.rightPoint  = {};
            this.rightPeriod = {};
            return {
                name     : name,
                Period_id: period.id,
                Point_id : point.id
            }
        },
        editRight() {
            const right   = this.modRight;
            this.modRight = {};
            this.closeModal();
            return right;
        }
    }
}
</script>

<style lang="sass">
    @import '../main.scss';

    .users {
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
