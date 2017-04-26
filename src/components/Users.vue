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
                    <b-table
                        :headers="[
                            { title: 'Type', field: 'type' },
                            { title: 'Contenu', field: 'data'}
                        ]"
                        :data="modObject.meansOfLogin"
                        :actions="[
                            { action: 'lock', text1: 'Bloquer', text2: 'Débloquer', field: 'blocked', type: 'reversible' },
                            { action: 'remove', text: 'Supprimer', type: 'confirm' }
                        ]"
                        route="meansOfLogin"
                        :paging="5"
                        @lock="lockMol"
                        @remove="removeObject">
                    </b-table>
                    <h5>Droits</h5>
                    <form @submit.prevent="createUserRight(modObject, inputRight())">
                        <mdl-select label="Droit" id="right-select" v-model="userRight.name" :options="rightsList"></mdl-select>
                        <mdl-select label="Point" id="point-select" v-model="userRight.point" :options="pointOptions"></mdl-select>
                        <mdl-select label="Période" id="period-select" v-model="userRight.period" :options="periodOptions"></mdl-select><br />
                        <mdl-button colored raised>Ajouter</mdl-button>
                    </form>
                    <br />
                    <b-table
                        :headers="[
                            { title: 'Droit', field: 'name' },
                            { title: 'Point', field: 'point.name'},
                            { title: 'Période', field: 'period.name' }
                        ]"
                        :data="displayedRights"
                        :actions="[
                            { action: 'remove', text: 'Supprimer', type: 'confirm' }
                        ]"
                        route="rights"
                        :paging="5"
                        @remove="removeObject">
                    </b-table>
                    <h5>Groupes</h5>
                    <form @submit.prevent="createGroupPeriod(modObject, inputGroupPeriod())">
                        <mdl-select label="Groupe" id="group-select" v-model="groupPeriod.group" :options="groupOptions"></mdl-select>
                        <mdl-select label="Période" id="period-select-2" v-model="groupPeriod.period" :options="periodOptions"></mdl-select><br />
                        <mdl-button colored raised>Ajouter</mdl-button>
                    </form>
                    <br />
                    <b-table
                        :headers="[
                            { title: 'Groupe', field: 'group.name' },
                            { title: 'Période', field: 'period.name' }
                        ]"
                        :data="displayedGroupPeriods"
                        :actions="[
                            { action: 'remove', text: 'Supprimer', type: 'confirm' }
                        ]"
                        route="groupPeriods"
                        :paging="5"
                        @remove="removeObject">
                    </b-table>
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
                    <mdl-textfield floating-label="Prénom" v-model="userName" @input="searchUsers(userName)"></mdl-textfield>

                    <b-table
                        :headers="[{ title: 'Utilisateur', field: 'fullname', class: 'b--capitalized' }]"
                        :data="displayedUsers"
                        :sort="{ field: 'firstname', order: 'ASC' }"
                        :actions="[
                            { action: 'edit', text: 'Modifier', raised: true, colored: true },
                            { action: 'remove', text: 'Supprimer', type: 'confirm' }
                        ]"
                        route="users"
                        :paging="5"
                        @edit="expandUser"
                        @remove="removeObject">
                    </b-table>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import bcrypt   from 'bcryptjs';
import debounce from 'lodash.debounce';
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
            'updateModObject',
            'showClientError'
        ]),
        expandUser(user) {
            this.$router.push(`/users/${user.id}`);

            this.expandObject({
                route: 'users',
                value: user
            });
        },
        lockMol(meanOfLogin) {
            const modMol = {
                id     : meanOfLogin.id,
                blocked: !meanOfLogin.blocked
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
                id : user.id,
                pin: bcrypt.hashSync(pin, 10)
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
                existingMol.data = user.mail;
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
                return this.showClientError({ message: 'Tous les champs doivent être remplis.' });
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
                return this.showClientError({ message: 'Tous les champs doivent être remplis.' });
            }

            const index = user.groupPeriods.findIndex(o => (
                o.group.id === groupPeriod.Group_id && o.period.id === groupPeriod.Period_id
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
            users       : state => state.objects.users,
            points      : state => state.objects.points,
            periods     : state => state.objects.periods,
            groups      : state => state.objects.groups,
            currentEvent: state => state.app.currentEvent,
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
        },
        displayedUsers() {
            return this.users.map((user) => {
                user.fullname = `${user.firstname} ${user.lastname}`;
                return user;
            });
        },
        displayedRights() {
            if (!this.modObject) {
                return [];
            }

            return this.modObject.rights.map((right) => {
                if (right.period.Event_id === this.currentEvent.id) {
                    if (!right.point) {
                        right.point = { name: 'Aucun' };
                    }
                    return right;
                }
                return null;
            }).filter(a => a);
        },
        displayedGroupPeriods() {
            if (!this.modObject) {
                return [];
            }

            return this.modObject.groupPeriods.map((groupPeriod) => {
                if (groupPeriod.period.Event_id === this.currentEvent.id) {
                    return groupPeriod;
                }
                return null;
            }).filter(a => a);
        }
    },

    mounted() {
        this.clearObject('users');

        if (this.params.id) {
            this.expandUser({ id: this.params.id });
        }

        const searchUsers = this.searchUsers;
        this.searchUsers  = debounce(name => searchUsers(name), 500);
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
