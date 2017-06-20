<template>
    <div>
        <h5 class="b--capitalized">Modifier {{ modObject.firstname }} {{ modObject.lastname }}</h5>
        <form @submit.prevent="updateUser(modObject)">
            <mdl-textfield floating-label="Nom" :value="modObject.lastname" @input="updateModObject({ field:'lastname', value: $event })" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield>
            <mdl-textfield floating-label="Prénom" :value="modObject.firstname" @input="updateModObject({ field:'firstname', value: $event })" required="required" error="Le prénom doit contenir au moins un caractère"></mdl-textfield><br />
            <mdl-textfield floating-label="Surnom" :value="modObject.nickname" @input="updateModObject({ field:'nickname', value: $event })" required="required" error="Le surnom doit contenir au moins un caractère"></mdl-textfield><br />
            <mdl-textfield floating-label="Mail" :value="modObject.mail" @input="updateModObject({ field:'mail', value: $event })" required="required" pattern="[^@\s]+@[^@\s]+\.[^@\s]+" error="L'adresse mail n'a pas le bon format"></mdl-textfield><br />
            <mdl-button colored raised>Modifier</mdl-button>
        </form>
        <h5>Sécurité</h5>
        <mdl-button @click.native="regenPin(modObject)">Regénérer le code PIN</mdl-button>
        <mdl-button @click.native="regenPassword(modObject)">Regénérer le mot de passe</mdl-button>
        <transition name="fade">
            <p v-show="newPin">Le nouveau code PIN généré est <strong>{{ newPin }}</strong></p>
        </transition>
        <transition name="fade">
            <p v-show="newPassword">Le nouveau mot de passe généré est <strong>{{ newPassword }}</strong></p>
        </transition>
        <br />
        <div v-if="!currentEvent.config.hasGroups">
            <h5>Accès à l'événement</h5>
            <mdl-button v-if="isUserInGroup(modObject, currentEvent.defaultGroup, currentEvent.defaultPeriod)" @click.native="removeUserFromGroup(modObject, currentEvent.defaultGroup, currentEvent.defaultPeriod)">Interdire {{ modObject.firstname }}</mdl-button>
            <mdl-button v-else @click.native="addUserToGroup(modObject, currentEvent.defaultGroup, currentEvent.defaultPeriod)">Autoriser {{ modObject.firstname }}</mdl-button>
        </div>
    </div>
</template>

<script>
import bcrypt from 'bcryptjs';
import { mapState, mapActions } from 'vuex';
import { randString } from '../../../lib/randString';
import { isUserInGroup } from './isUserInGroup';

export default {
    data() {
        return {
            newPin     : '',
            newPassword: ''
        };
    },

    methods: {
        ...mapActions([
            'createObject',
            'updateObject',
            'createSimpleRelation',
            'removeSimpleRelation',
            'updateModObject',
            'notify',
            'notifyError'
        ]),
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
            const password   = randString(8);
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
            })
                .then(this.notify({ message: 'L\'utilisateur a bien été modifié' }))
                .catch(err => this.notifyError({
                    message: 'Une erreur a eu lieu lors de la modification de l\'utilisateur',
                    full   : err
                }));
        },
        isUserInGroup(user, group, period) {
            return isUserInGroup(user, group, period);
        },
        addUserToGroup(user, group, period) {
            this.createSimpleRelation({
                obj1: {
                    route: 'users',
                    value: user
                },
                obj2: {
                    route: 'groups',
                    value: group
                },
                through: {
                    obj  : 'period',
                    field: 'Period_id',
                    value: period
                }
            })
                .then(this.notify({ message: 'L\'utilisateur a bien été autorisé' }))
                .catch(err => this.notifyError({
                    message: 'Une erreur a eu lieu lors de la modification de l\'utilisateur',
                    full   : err
                }));
        },
        removeUserFromGroup(user, group, period) {
            this.removeSimpleRelation({
                obj1: {
                    route: 'users',
                    value: user
                },
                obj2: {
                    route: 'groups',
                    value: group
                },
                through: {
                    obj  : 'period',
                    field: 'Period_id',
                    value: period
                }
            })
                .then(this.notify({ message: 'L\'utilisateur a bien été interdit' }))
                .catch(err => this.notifyError({
                    message: 'Une erreur a eu lieu lors de la modification de l\'utilisateur',
                    full   : err
                }));
        }
    },

    computed: {
        ...mapState({
            currentEvent: state => state.app.currentEvent,
            modObject   : state => state.app.modObject
        })
    }
};
</script>
