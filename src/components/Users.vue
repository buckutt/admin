<template>
    <div v-show="currentEvent">
        <div class="users">
            <div class="mdl-card mdl-shadow--2dp">
                <h3>Utilisateurs</h3>
                <div v-show="selectedUser.firstname" transition="fade">
                    <h5 class="name">Modifier {{ selectedUser.firstname }} {{ selectedUser.lastname }}</h5>
                    <form v-on:submit.prevent>
                        <mdl-textfield floating-label="Nom" :value.sync="modUser.lastname"></mdl-textfield>
                        <mdl-textfield floating-label="Prénom" :value.sync="modUser.firstname"></mdl-textfield><br />
                        <mdl-textfield floating-label="Surnom" :value.sync="modUser.nickname"></mdl-textfield><br />
                        <mdl-textfield floating-label="Mail" :value.sync="modUser.mail"></mdl-textfield><br />
                        <mdl-button colored raised @click="updateUser(selectedUser, modUser)">Modifier</mdl-button>
                    </form>
                    <br />
                    <mdl-button @click="regenPin(selectedUser)">Regénérer le code PIN</mdl-button>
                    <mdl-button @click="regenPassword(selectedUser)">Regénérer le mot de passe</mdl-button>
                    <br />
                    <p v-show="newPin" transition="fade">Le nouveau code PIN généré est <strong>{{ newPin }}</strong></p>
                    <p v-show="newPassword" transition="fade">Le nouveau mot de passe généré est <strong>{{ newPassword }}</strong></p>
                    <h5>Droits</h5>
                    <form v-on:submit.prevent>
                        <mdl-select label="Droit" id="right-select" :value.sync="rightChoice" :options="rightsList"></mdl-select>
                        <mdl-select label="Point" id="point-select" :value.sync="rightPoint" :options="pointOptions"></mdl-select>
                        <mdl-select label="Période" id="period-select" :value.sync="rightPeriod" :options="periodOptions"></mdl-select><br />
                        <mdl-button colored raised @click="createUserRight(selectedUser, inputRight)">Ajouter</mdl-button>
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
                            <tr v-for="right in detailsUser.rights" v-show="right.period.Event_id == currentEvent.id">
                                <td class="mdl-data-table__cell--non-numeric name">{{ right.name }}</td>
                                <td class="mdl-data-table__cell--non-numeric" v-if="right.point">{{ right.point.name }}</td>
                                <td class="mdl-data-table__cell--non-numeric" v-else>Aucun</td>
                                <td class="mdl-data-table__cell--non-numeric">{{ right.period.name }}</td>
                                <td class="mdl-data-table__cell--non-numeric">
                                    <mdl-button @click="openModal(right)">Modifier</mdl-button>
                                    <mdl-button @click="deleteRight(right)">Supprimer</mdl-button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <br />
                    <mdl-button colored raised @click="goBack()">Retour</mdl-button>
                </div>
                <div v-show="!selectedUser.firstname" transition="fade">
                    <h5>Créer un utilisateur</h5>
                    <p v-show="newPin" transition="fade">Le code PIN de l'utilisateur est <strong>{{ newPin }}</strong></p>
                    <p v-show="newPassword" transition="fade">Le mot de passe de l'utilisateur est <strong>{{ newPassword }}</strong></p>
                    <form v-on:submit.prevent>
                        <mdl-textfield floating-label="Nom" :value.sync="lastname"></mdl-textfield>
                        <mdl-textfield floating-label="Prénom" :value.sync="firstname"></mdl-textfield><br />
                        <mdl-textfield floating-label="Surnom" :value.sync="nickname"></mdl-textfield><br />
                        <mdl-textfield floating-label="Mail" :value.sync="mail"></mdl-textfield><br />
                        <mdl-button colored raised @click="createUser(inputUser)">Créer</mdl-button>
                    </form>

                    <h5>Rechercher un utilisateur</h5>
                    <form v-on:submit.prevent>
                        <mdl-textfield floating-label="Prénom" :value.sync="userName"></mdl-textfield>
                        <mdl-button colored raised @click="searchUser()">Rechercher</mdl-button>
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
                                    <mdl-button @click="editUser(user)">Modifier</mdl-button>
                                    <mdl-button @click="deleteUser(user)">Supprimer</mdl-button>
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
                        <mdl-select label="Droit" id="modright-select" :value.sync="modRight.name" :options="rightsList"></mdl-select><br />
                        <mdl-select label="Point" id="modpoint-select" :value.sync="modRight.Point_id" :options="pointOptions"></mdl-select><br />
                        <mdl-select label="Période" id="modperiod-select" :value.sync="modRight.Period_id" :options="periodOptions"></mdl-select><br />
                    </div>
                    <div class="modal__footer">
                        <mdl-button @click="updateRight(selectedRight, editRight)">Valider</mdl-button>
                        <mdl-button @click="closeModal()">Annuler</mdl-button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { get, post, put } from '../lib/fetch';
import modal from '../lib/modal';
import bcrypt from 'bcryptjs';

export default {
    vuex: {
        getters: {
            points      : state => state.app.points,
            periods     : state => state.app.periods,
            currentEvent: state => state.global.currentEvent
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
            openEditModal: false,
            newPin       : '',
            newPassword  : ''
        };
    },

    methods: {
        goBack() {
            this.selectedUser = {};
            this.modUser      = {};
            this.newPin       = '';
            this.newPassword  = '';
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
            this.newPin      = '';
            this.newPassword = '';
            this.rightChoice = this.rightsList[0];
            this.rightPoint  = null;
            this.rightPeriod = this.$store.state.app.periods[0].id;

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
        regenPin(user) {
            const randTen     = () => Math.floor(Math.random() * 10);
            const pin         = `${randTen()}${randTen()}${randTen()}${randTen()}`;
            const embedRights = encodeURIComponent(JSON.stringify({
                period: true,
                point : true
            }));

            user.pin      = bcrypt.hashSync(pin, 10);
            const modUser = user;
            this.newPin   = pin;

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
        regenPassword(user) {
            const password    = this.randString(8);
            const embedRights = encodeURIComponent(JSON.stringify({
                period: true,
                point : true
            }));

            user.password    = bcrypt.hashSync(password, 10);
            const modUser    = user;
            this.newPassword = password;

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
            const embedRight  = encodeURIComponent(JSON.stringify({
                point : true,
                period: true
            }));

            put(`rights/${selectedRight.id}?embed=${embedRight}`, modRight)
                .then(result => {
                    this.detailsUser.rights.forEach((r, i) => {
                        if (r.id === result.id) {
                            if(!modRight.Point_id) {
                                result.point = null;
                            } else {
                                result.point = this.pointById(modRight.Point_id);
                            }
                            result.period = this.periodById(modRight.Period_id);
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
            this.selectedRight      = right;
            this.modRight           = JSON.parse(JSON.stringify(right));
            if(this.modRight.point) {
                this.modRight.Point_id  = this.modRight.point.id;
            } else {
                this.modRight.Point_id = null;
            }
            this.modRight.Period_id = this.modRight.period.id;
            delete this.modRight.point;
            delete this.modRight.period;

            this.openEditModal = true;
        },
        closeModal() {
            this.openEditModal = false;
        },
        pointById(id) {
            let point = null;
            this.points.forEach((p, i) => {
                if(p.id == id) {
                    point = p;
                }
            });
            return point;
        },
        periodById(id) {
            let period = null;
            this.periods.forEach((p, i) => {
                if(p.id == id) {
                    period = p;
                }
            });
            return period;
        },
        randString(x) {
            let s = '';
            while(s.length < x && x > 0) {
                let r = Math.random();
                s += (r<0.1?Math.floor(r*100):String.fromCharCode(Math.floor(r*26) + (r>0.5?97:65)));
            }
            return s;
        }
    },

   computed: {
        inputUser() {
            const firstname  = this.firstname;
            const lastname   = this.lastname;
            const nickname   = this.nickname;
            const mail       = this.mail;
            const randTen    = () => Math.floor(Math.random() * 10);
            const pin        = `${randTen()}${randTen()}${randTen()}${randTen()}`;
            const password   = this.randString(8);

            this.newPin      = pin;
            this.newPassword = password;

            this.firstname   = '';
            this.lastname    = '';
            this.nickname    = '';
            this.mail        = '';
            return {
                firstname: firstname,
                lastname : lastname,
                nickname : nickname,
                mail     : mail,
                credit   : 0,
                pin      : bcrypt.hashSync(pin, 10),
                password : bcrypt.hashSync(password)
            };
        },
        inputRight() {
            const name       = this.rightChoice;
            const point      = this.rightPoint;
            const period     = this.rightPeriod;
            this.rightChoice = this.rightsList[0];
            this.rightPoint  = null;
            this.rightPeriod = this.$store.state.app.periods[0].id;
            if(!point) {
                return {
                    name     : name,
                    Period_id: period
                }
            }
            return {
                name     : name,
                Period_id: period,
                Point_id : point
            }
        },
        editRight() {
            const right   = this.modRight;
            this.modRight = {};
            this.closeModal();
            return right;
        },
        periodOptions() {
            let periods = this.periods.map(period => {
                if(period.Event_id == this.currentEvent.id) {
                    return { name: period.name, value: period };
                } else {
                    return null;
                }
            });

            return periods.filter(a => a);
        },
        pointOptions() {
            let points = this.points.map(point => {
                return { name: point.name, value: point.id };
            });
            points.unshift({ name: 'Aucun', value: null });
            return points;
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
