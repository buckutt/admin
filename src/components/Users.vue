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
</template>

<script>
import { get, post, put } from '../lib/fetch';

export default {
    data () {
        return {
            firstname   : '',
            lastname    : '',
            nickname    : '',
            mail        : '',
            userName    : '',
            users       : [],
            selectedUser: {},
            modUser     : {}
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
            this.selectedUser = user;
            this.modUser      = JSON.parse(JSON.stringify(user));
            this.searchUser();
        },
        updateUser(user, modUser) {
            put(`users/${user.id}`, modUser)
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
