<template>
    <div class="b-users">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Utilisateurs</h3>
            <transition name="fade" @before-enter="reset">
                <div v-if="modObject">
                    <h5 class="b--capitalized">Modifier {{ modObject.firstname }} {{ modObject.lastname }}</h5>
                    <form @submit.prevent="updateUser(modObject)">
                        <mdl-textfield floating-label="Nom" :value="modObject.lastname" @input="updateModObject({ field:'lastname', value: $event })" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield>
                        <mdl-textfield floating-label="Prénom" :value="modObject.firstname" @input="updateModObject({ field:'firstname', value: $event })" required="required" error="Le prénom doit contenir au moins un caractère"></mdl-textfield><br />
                        <mdl-textfield floating-label="Surnom" :value="modObject.nickname" @input="updateModObject({ field:'nickname', value: $event })" required="required" error="Le surnom doit contenir au moins un caractère"></mdl-textfield><br />
                        <mdl-textfield floating-label="Mail" :value="modObject.mail" @input="updateModObject({ field:'mail', value: $event })" required="required" pattern="[^@\s]+@[^@\s]+\.[^@\s]+" error="L'adresse mail n'a pas le bon format"></mdl-textfield><br />
                        <mdl-button colored raised>Modifier</mdl-button>
                    </form>
                    <br />
                    <mdl-button @click.native="regenPin(modObject)">Regénérer le code PIN</mdl-button>
                    <mdl-button @click.native="regenPassword(modObject)">Regénérer le mot de passe</mdl-button>
                    <br />
                    <transition name="fade">
                        <p v-show="newPin">Le nouveau code PIN généré est <strong>{{ newPin }}</strong></p>
                    </transition>
                    <transition name="fade">
                        <p v-show="newPassword">Le nouveau mot de passe généré est <strong>{{ newPassword }}</strong></p>
                    </transition>

                    <h5>Identifiants de connexion</h5>
                    <div class="b-responsive-table" v-show="modObject.meansOfLogin">
                        <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                            <thead>
                                <tr>
                                    <th class="mdl-data-table__cell--non-numeric">Type</th>
                                    <th class="mdl-data-table__cell--non-numeric">Contenu</th>
                                    <th class="mdl-data-table__cell--non-numeric">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="meanOfLogin in modObject.meansOfLogin">
                                    <td class="mdl-data-table__cell--non-numeric">{{ meanOfLogin.type }}</td>
                                    <td class="mdl-data-table__cell--non-numeric">{{ meanOfLogin.data }}</td>
                                    <td class="mdl-data-table__cell--non-numeric">
                                        <mdl-button raised accent @click.native="lockMol(meanOfLogin, true)" v-if="!meanOfLogin.blocked">Bloquer</mdl-button>
                                        <mdl-button raised @click.native="lockMol(meanOfLogin, false)" v-if="meanOfLogin.blocked">Débloquer</mdl-button>
                                        <mdl-button raised accent @click.native="$root.confirm() && removeObject({ route: 'meansOfLogin', value: meanOfLogin })">Supprimer</mdl-button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <h5>Droits</h5>
                    <form @submit.prevent="createUserRight(modObject, inputRight())">
                        <mdl-select label="Droit" id="right-select" v-model="userRight.name" :options="rightsList"></mdl-select>
                        <mdl-select label="Point" id="point-select" v-model="userRight.point" :options="pointOptions"></mdl-select>
                        <mdl-select label="Période" id="period-select" v-model="userRight.period" :options="periodOptions"></mdl-select><br />
                        <mdl-button colored raised>Ajouter</mdl-button>
                    </form>
                    <br />
                    <div class="b-responsive-table" v-show="modObject.rights">
                        <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                            <thead>
                                <tr>
                                    <th class="mdl-data-table__cell--non-numeric">Droit</th>
                                    <th class="mdl-data-table__cell--non-numeric">Point</th>
                                    <th class="mdl-data-table__cell--non-numeric">Période</th>
                                    <th class="mdl-data-table__cell--non-numeric">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="right in modObject.rights" v-show="right.period.Event_id == currentEvent.id">
                                    <td class="mdl-data-table__cell--non-numeric b--capitalized">{{ right.name }}</td>
                                    <td class="mdl-data-table__cell--non-numeric" v-if="right.point">{{ right.point.name }}</td>
                                    <td class="mdl-data-table__cell--non-numeric" v-else>Aucun</td>
                                    <td class="mdl-data-table__cell--non-numeric">{{ right.period.name }}</td>
                                    <td class="mdl-data-table__cell--non-numeric">
                                        <mdl-button raised accent @click.native="$root.confirm() && removeObject({ route: 'rights', value: right })">Supprimer</mdl-button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <h5>Groupes</h5>
                    <form @submit.prevent="createGroupPeriod(modObject, inputGroupPeriod())">
                        <mdl-select label="Groupe" id="group-select" v-model="groupPeriod.group" :options="groupOptions"></mdl-select>
                        <mdl-select label="Période" id="period-select-2" v-model="groupPeriod.period" :options="periodOptions"></mdl-select><br />
                        <mdl-button colored raised>Ajouter</mdl-button>
                    </form>
                    <br />
                    <div class="b-responsive-table" v-show="modObject.groupPeriods">
                        <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                            <thead>
                                <tr>
                                    <th class="mdl-data-table__cell--non-numeric">Groupe</th>
                                    <th class="mdl-data-table__cell--non-numeric">Période</th>
                                    <th class="mdl-data-table__cell--non-numeric">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="groupPeriod in modObject.groupPeriods" v-show="groupPeriod.period.Event_id == currentEvent.id">
                                    <td class="mdl-data-table__cell--non-numeric b--capitalized">{{ groupPeriod.group.name }}</td>
                                    <td class="mdl-data-table__cell--non-numeric">{{ groupPeriod.period.name }}</td>
                                    <td class="mdl-data-table__cell--non-numeric">
                                        <mdl-button raised accent @click.native="$root.confirm() && removeObject({ route: 'groupPeriods', value: groupPeriod })">Supprimer</mdl-button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <br />
                    <mdl-button colored raised @click.native="$root.goBack()">Retour</mdl-button>
                </div>
            </transition>
            <transition name="fade" @before-enter="reset">
                <div v-if="!modObject">
                    <h5>Créer un utilisateur</h5>
                    <transition name="fade">
                        <p v-show="newPin">Le code PIN de l'utilisateur est <strong>{{ newPin }}</strong></p>
                    </transition>
                    <transition name="fade">
                        <p v-show="newPassword">Le mot de passe de l'utilisateur est <strong>{{ newPassword }}</strong></p>
                    </transition>
                    <form @submit.prevent="createUserWithMol(inputUser())">
                        <mdl-textfield floating-label="Nom" v-model="newUser.lastname" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield>
                        <mdl-textfield floating-label="Prénom" v-model="newUser.firstname" required="required" error="Le prénom doit contenir au moins un caractère"></mdl-textfield><br />
                        <mdl-textfield floating-label="Surnom" v-model="newUser.nickname" required="required" error="Le surnom doit contenir au moins un caractère"></mdl-textfield><br />
                        <mdl-textfield floating-label="Mail" v-model="newUser.mail" required="required" pattern="[^@\s]+@[^@\s]+\.[^@\s]+" error="L'adresse mail n'a pas le bon format"></mdl-textfield><br />
                        <mdl-button colored raised>Créer</mdl-button>
                    </form>

                    <h5>Rechercher un utilisateur</h5>
                    <form @submit.prevent="searchUsers(userName)">
                        <mdl-textfield floating-label="Prénom" v-model="userName"></mdl-textfield>
                        <mdl-button colored raised>Rechercher</mdl-button>
                    </form>

                    <div class="b-responsive-table" v-show="users.length > 0">
                        <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                            <thead>
                                <tr>
                                    <th class="mdl-data-table__cell--non-numeric">Utilisateur</th>
                                    <th class="mdl-data-table__cell--non-numeric">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="user in users">
                                    <td class="mdl-data-table__cell--non-numeric b--capitalized">{{ user.firstname }} {{ user.lastname }}</td>
                                    <td class="mdl-data-table__cell--non-numeric">
                                        <mdl-button raised colored @click.native="expandUser(user)">Modifier</mdl-button>
                                        <mdl-button raised accent @click.native="$root.confirm() && removeObject({ route: 'users', value: user })">Supprimer</mdl-button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import bcrypt from 'bcryptjs';
import { mapState, mapActions } from 'vuex';

const userPattern = {
    firstname: '',
    lastname : '',
    nickname : '',
    mail     : '',
    credit   : 0
};

export default {
    data() {
        return {
            rightsList: ['admin', 'seller', 'reloader'],
            newUser   : Object.assign({}, userPattern),
            userRight : {
                name  : null,
                point : null,
                period: null
            },
            userName   : '',
            newPin     : '',
            newPassword: '',
            groupPeriod: {
                group : null,
                period: null
            }
        };
    },

    methods: {
        ...mapActions([
            'searchUsers',
            'createUserWithMol',
            'createObject',
            'updateObject',
            'removeObject',
            'clearObject',
            'expandObject',
            'createMultipleRelation',
            'updateModObject'
        ]),
        expandUser(user) {
            this.$router.push(`/users/${user.id}`);

            this.expandObject({
                route: 'users',
                value: user
            });
        },
        lockMol(meanOfLogin, blocked) {
            const modMol = {
                id: meanOfLogin.id,
                blocked
            };

            this.updateObject({
                route: 'meansOfLogin',
                value: modMol
            });
        },
        regenPin(user) {
            const randTen = () => Math.floor(Math.random() * 10);
            const pin     = `${randTen()}${randTen()}${randTen()}${randTen()}`;
            this.newPin   = pin;
            const modUser = {
                id      : user.id,
                password: bcrypt.hashSync(pin, 10)
            };

            this.updateObject({
                route: 'users',
                value: modUser
            });
        },
        regenPassword(user) {
            const password   = this.randString(8);
            this.newPassword = password;
            const modUser    = {
                id      : user.id,
                password: bcrypt.hashSync(password, 10)
            };

            this.updateObject({
                route: 'users',
                value: modUser
            });
        },
        updateUser(user) {
            let existingMol = null;

            user.meansOfLogin.forEach((meanOfLogin) => {
                if (meanOfLogin.type === 'etuMail') {
                    existingMol = meanOfLogin;
                }
            });

            if (!existingMol) {
                this.createObject({
                    route: 'meansOfLogin',
                    value: { type: 'etuMail', data: user.mail, User_id: user.id }
                });
            } else {
                existingMol.mail = user.mail;
                this.updateObject({
                    route: 'meansOfLogin',
                    value: existingMol
                });
            }

            this.updateObject({
                route: 'users',
                value: user
            });
        },
        createUserRight(user, right) {
            if (!right.name || !right.Period_id) {
                return this.$root.$emit('snackfilter', {
                    message: 'Tous les champs doivent être remplis.'
                });
            }

            this.createMultipleRelation({
                obj: {
                    route: 'users',
                    value: user
                },
                relation: {
                    route : 'rights',
                    fields: right
                }
            });
        },
        createGroupPeriod(user, groupPeriod) {
            if (!groupPeriod.Group_id || !groupPeriod.Period_id) {
                return this.$root.$emit('snackfilter', {
                    message: 'Tous les champs doivent être remplis.'
                });
            }

            const index = user.groupPeriods.findIndex(o => (
                o.group.id === groupPeriod.Group_id && o.period.id === groupPeriod.Period_id
            ));

            if (index > -1) {
                return this.$root.$emit('snackfilter', {
                    message: 'L\'utilisateur est déjà membre du groupe sur cette période.'
                });
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
        randString(x) {
            let s = '';
            while (s.length < x && x > 0) {
                const r = Math.random();
                s += (r < 0.1 ? Math.floor(r * 100) : String.fromCharCode(Math.floor(r * 26) + (r > 0.5 ? 97 : 65)));
            }
            return s;
        },
        reset() {
            this.newPin = '';
            this.newPassword = '';
        },
        inputUser() {
            const inputUser = Object.assign({}, this.newUser);
            this.newUser    = Object.assign({}, userPattern);

            const randTen    = () => Math.floor(Math.random() * 10);
            this.newPin      = `${randTen()}${randTen()}${randTen()}${randTen()}`;
            this.newPassword = this.randString(8);

            inputUser.pin      = bcrypt.hashSync(this.newPin, 10);
            inputUser.password = bcrypt.hashSync(this.newPassword);

            return inputUser;
        },
        inputRight() {
            const userRight = Object.assign({}, this.userRight);

            Object.keys(this.userRight).map((key) => {
                this.userRight[key] = null;
            });

            if (userRight.point) {
                userRight.Point_id = userRight.point.id;
                delete userRight.point;
            }

            if (userRight.period) {
                userRight.Period_id = userRight.period.id;
                delete userRight.period;
            }

            return userRight;
        },
        inputGroupPeriod() {
            const groupPeriod = Object.assign({}, this.groupPeriod);

            Object.keys(this.groupPeriod).map((key) => {
                this.groupPeriod[key] = null;
            });

            if (groupPeriod.group) {
                groupPeriod.Group_id = groupPeriod.group.id;
                delete groupPeriod.group;
            }

            if (groupPeriod.period) {
                groupPeriod.Period_id = groupPeriod.period.id;
                delete groupPeriod.period;
            }

            return groupPeriod;
        }
    },

    computed: {
        ...mapState({
            users       : state => state.app.users,
            points      : state => state.app.points,
            periods     : state => state.app.periods,
            groups      : state => state.app.groups,
            currentEvent: state => state.global.currentEvent,
            modObject   : state => state.app.modObject,
            params      : state => state.route.params
        }),
        periodOptions() {
            if (!this.currentEvent) {
                return [];
            }

            return this.periods.map((period) => {
                if (period.Event_id === this.currentEvent.id) {
                    return { name: period.name, value: period };
                }
                return null;
            }).filter(a => a);
        },
        pointOptions() {
            const points = this.points.map(point => ({ name: point.name, value: point }));
            points.unshift({ name: 'Aucun', value: null });
            return points;
        },
        groupOptions() {
            return this.groups.map(group => ({ name: group.name, value: group }));
        }
    },

    mounted() {
        this.clearObject('users');

        if (this.params.id) {
            this.expandUser({ id: this.params.id });
        }
    }
};
</script>

<style lang="scss">
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
    }
</style>
