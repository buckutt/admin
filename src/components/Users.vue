<template>
    <div>
        <div v-if="currentEvent">
            <div class="b-users">
                <div class="mdl-card mdl-shadow--2dp">
                    <h3>Utilisateurs</h3>
                    <transition name="fade">
                        <div v-if="selectedUser.firstname">
                            <h5 class="b--capitalized">Modifier {{ selectedUser.firstname }} {{ selectedUser.lastname }}</h5>
                            <form @submit.prevent="updateUser(selectedUser, modUser)">
                                <mdl-textfield floating-label="Nom" v-model="modUser.lastname"></mdl-textfield>
                                <mdl-textfield floating-label="Prénom" v-model="modUser.firstname"></mdl-textfield><br />
                                <mdl-textfield floating-label="Surnom" v-model="modUser.nickname"></mdl-textfield><br />
                                <mdl-textfield floating-label="Mail" v-model="modUser.mail"></mdl-textfield><br />
                                <mdl-button colored raised>Modifier</mdl-button>
                            </form>
                            <br />
                            <mdl-button @click.native="regenPin(selectedUser)">Regénérer le code PIN</mdl-button>
                            <mdl-button @click.native="regenPassword(selectedUser)">Regénérer le mot de passe</mdl-button>
                            <br />
                            <transition name="fade">
                                <p v-show="newPin">Le nouveau code PIN généré est <strong>{{ newPin }}</strong></p>
                            </transition>
                            <transition name="fade">
                                <p v-show="newPassword">Le nouveau mot de passe généré est <strong>{{ newPassword }}</strong></p>
                            </transition>

                            <h5>Identifiants de connexion</h5>
                            <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp" v-show="detailsUser.meansOfLogin">
                                <thead>
                                    <tr>
                                        <th class="mdl-data-table__cell--non-numeric">Type</th>
                                        <th class="mdl-data-table__cell--non-numeric">Contenu</th>
                                        <th class="mdl-data-table__cell--non-numeric">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="meanOfLogin in detailsUser.meansOfLogin">
                                        <td class="mdl-data-table__cell--non-numeric">{{ meanOfLogin.type }}</td>
                                        <td class="mdl-data-table__cell--non-numeric">{{ meanOfLogin.data }}</td>
                                        <td class="mdl-data-table__cell--non-numeric">
                                            <mdl-button @click.native="deleteMol(meanOfLogin)">Désactiver</mdl-button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <h5>Droits</h5>
                            <form @submit.prevent="createUserRight(selectedUser, inputRight)">
                                <mdl-select label="Droit" id="right-select" v-model="rightChoice" :options="rightsList"></mdl-select>
                                <mdl-select label="Point" id="point-select" v-model="rightPoint" :options="pointOptions"></mdl-select>
                                <mdl-select label="Période" id="period-select" v-model="rightPeriod" :options="periodOptions"></mdl-select><br />
                                <mdl-button colored raised>Ajouter</mdl-button>
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
                                        <td class="mdl-data-table__cell--non-numeric b--capitalized">{{ right.name }}</td>
                                        <td class="mdl-data-table__cell--non-numeric" v-if="right.point">{{ right.point.name }}</td>
                                        <td class="mdl-data-table__cell--non-numeric" v-else>Aucun</td>
                                        <td class="mdl-data-table__cell--non-numeric">{{ right.period.name }}</td>
                                        <td class="mdl-data-table__cell--non-numeric">
                                            <mdl-button @click.native="openModal(right)">Modifier</mdl-button>
                                            <mdl-button @click.native="$root.confirm() && deleteRight(right)">Supprimer</mdl-button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <br />
                            <mdl-button colored raised @click.native="goBack()">Retour</mdl-button>
                        </div>
                    </transition>
                    <transition name="fade">
                        <div v-if="!selectedUser.firstname">
                            <h5>Créer un utilisateur</h5>
                            <transition name="fade">
                                <p v-show="newPin">Le code PIN de l'utilisateur est <strong>{{ newPin }}</strong></p>
                            </transition>
                            <transition name="fade">
                                <p v-show="newPassword">Le mot de passe de l'utilisateur est <strong>{{ newPassword }}</strong></p>
                            </transition>
                            <form @submit.prevent="createUser(inputUser)">
                                <mdl-textfield floating-label="Nom" v-model="lastname"></mdl-textfield>
                                <mdl-textfield floating-label="Prénom" v-model="firstname"></mdl-textfield><br />
                                <mdl-textfield floating-label="Surnom" v-model="nickname"></mdl-textfield><br />
                                <mdl-textfield floating-label="Mail" v-model="mail"></mdl-textfield><br />
                                <mdl-button colored raised>Créer</mdl-button>
                            </form>

                            <h5>Rechercher un utilisateur</h5>
                            <form @submit.prevent="searchUser()">
                                <mdl-textfield floating-label="Prénom" v-model="userName"></mdl-textfield>
                                <mdl-button colored raised>Rechercher</mdl-button>
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
                                        <td class="mdl-data-table__cell--non-numeric b--capitalized">{{ user.firstname }} {{ user.lastname }}</td>
                                        <td class="mdl-data-table__cell--non-numeric">{{ user.nickname }}</td>
                                        <td class="mdl-data-table__cell--non-numeric">{{ user.mail }}</td>
                                        <td class="mdl-data-table__cell--non-numeric">
                                            <mdl-button @click.native="editUser(user)">Modifier</mdl-button>
                                            <mdl-button @click.native="$root.confirm() && deleteUser(user)">Supprimer</mdl-button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </transition>
                </div>
            </div>

            <modal>
                <div class="modal__dialog">
                    <div class="modal__header">
                        <h3>Modifier le droit {{ selectedRight.name }}</h3>
                    </div>
                    <form @submit.prevent="updateRight(selectedRight, editRight)">
                        <div class="modal__body">
                            <mdl-select label="Droit" id="modright-select" v-model="modRight.name" :options="rightsList"></mdl-select><br />
                            <mdl-select label="Point" id="modpoint-select" v-model="modRight.Point_id" :options="pointOptionsIds"></mdl-select><br />
                            <mdl-select label="Période" id="modperiod-select" v-model="modRight.Period_id" :options="periodOptionsIds"></mdl-select><br />
                        </div>
                        <div class="modal__footer">
                            <mdl-button>Valider</mdl-button>
                            <mdl-button @click.native="closeModal()">Annuler</mdl-button>
                        </div>
                    </form>
                </div>
            </modal>
        </div>
        <mdl-snackbar display-on="snackfilter"></mdl-snackbar>
    </div>
</template>

<script>
import Modal from './Modal.vue';
import { get, post, put } from '../lib/fetch';
import bcrypt from 'bcryptjs';
import { mapState, mapActions } from 'vuex';

export default {
    components: {
        Modal
    },

    data () {
        return {
            rightsList   : ['admin', 'seller', 'reloader'],
            firstname    : '',
            lastname     : '',
            nickname     : '',
            mail         : '',
            userName     : '',
            rightChoice  : null,
            rightPoint   : null,
            rightPeriod  : null,
            users        : [],
            selectedUser : {},
            detailsUser  : {},
            modUser      : {},
            selectedRight: {},
            modRight     : {},
            newPin       : '',
            newPassword  : ''
        };
    },

    methods: {
        ...mapActions([
            'updateEditModal'
        ]),
        goBack() {
            this.selectedUser = {};
            this.modUser      = {};
            this.newPin       = '';
            this.newPassword  = '';
        },
        createUser(user) {
            post('users', user)
                .then(result => {
                    if(result.mail) {
                        post('meansoflogin', { type: 'etuMail', data: result.mail, User_id: result.id });
                    }

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
            this.rightChoice = null;
            this.rightPoint  = null;
            this.rightPeriod = null;

            const embedUsers = encodeURIComponent(JSON.stringify({
                meansOfLogin: true,
                rights      : {
                    period: true,
                    point : true
                }
            }));

            get(`users/${user.id}?embed=${embedUsers}`)
                .then(result => {
                    result.rights = result.rights.filter(right => {
                        return !right.isRemoved;
                    });
                    result.meansOfLogin = result.meansOfLogin.filter(meanOfLogin => {
                        return !meanOfLogin.isRemoved;
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
            if(user.mail != modUser.mail) {
                let existingMol = false;

                this.detailsUser.meansOfLogin.forEach(meanOfLogin => {
                    if(meanOfLogin.type == 'etuMail') {
                        existingMol = meanOfLogin.id;
                    }
                });

                if(!existingMol) {
                    post('meansoflogin', { type: 'etuMail', data: modUser.mail, User_id: user.id })
                        .then(result => {
                            this.detailsUser.meansOfLogin.push(result);
                        });
                } else {
                    put(`meansoflogin/${existingMol}`, { data: modUser.mail })
                        .then(result => {
                            this.detailsUser.meansOfLogin = this.detailsUser.meansOfLogin.map(meanOfLogin => {
                                if(meanOfLogin.id == result.id) {
                                    meanOfLogin = result;
                                }

                                return meanOfLogin;
                            });
                        });
                }
            }

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
            if (!right.name || !right.Period_id) {
                const data = {
                    message: 'Tous les champs doivent être remplis.',
                    timeout: 2000
                };

                this.$root.$emit('snackfilter', data);

                return;
            }

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
        deleteMol(meanOfLogin) {
            meanOfLogin.isRemoved = true;
            put(`meansoflogin/${meanOfLogin.id}`, meanOfLogin)
                .then(result => {
                    let i = 0;
                    for(const mol of this.detailsUser.meansOfLogin) {
                        if(mol.id === meanOfLogin.id) {
                            break;
                        }

                        ++i;
                    }

                    this.detailsUser.meansOfLogin.splice(i, 1);
                });
        },
        openModal(right) {
            this.selectedRight = right;
            this.modRight      = JSON.parse(JSON.stringify(right));
            if(this.modRight.point) {
                this.modRight.Point_id  = this.modRight.point.id;
            } else {
                this.modRight.Point_id = null;
            }
            this.modRight.Period_id = this.modRight.period.id;
            delete this.modRight.point;
            delete this.modRight.period;

            this.updateEditModal(true);
        },
        closeModal() {
            this.updateEditModal(false);
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
        ...mapState({
            points       : state => state.app.points,
            periods      : state => state.app.periods,
            currentEvent : state => state.global.currentEvent,
            openEditModal: state => state.global.openEditModal
        }),
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
            this.rightChoice = null;
            this.rightPoint  = null;
            this.rightPeriod = null;
            console.log(point);
            if(!point) {
                return {
                    name     : name,
                    Period_id: period.id
                }
            }
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
        },
        pointOptions() {
            let points = this.points.map(point => {
                return { name: point.name, value: point };
            });
            points.unshift({ name: 'Aucun', value: null });
            return points;
        },
        periodOptionsIds() {
            if(!this.currentEvent) {
                return {};
            }

            let periods = this.periods.map(period => {
                if(period.Event_id == this.currentEvent.id) {
                    return { name: period.name, value: period.id };
                } else {
                    return null;
                }
            });

            return periods.filter(a => a);
        },
        pointOptionsIds() {
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

    .b-users {
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
    }
</style>
