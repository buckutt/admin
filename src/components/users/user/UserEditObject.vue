<template>
    <div>
        <h5 class="b--capitalized">Modifier {{ modObject.firstname }} {{ modObject.lastname }}</h5>
        <form @submit.prevent="updateUser(modObject)">
            <mdl-textfield floating-label="Nom" :value="modObject.lastname" @input="updateModObject({ field: 'lastname', value: $event })" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield>
            <mdl-textfield floating-label="Prénom" :value="modObject.firstname" @input="updateModObject({ field: 'firstname', value: $event })" required="required" error="Le prénom doit contenir au moins un caractère"></mdl-textfield><br />
            <mdl-textfield floating-label="Surnom" :value="modObject.nickname" @input="updateModObject({ field: 'nickname', value: $event })"></mdl-textfield><br />
            <mdl-textfield floating-label="Mail" :value="modObject.mail" @input="updateModObject({ field: 'mail', value: $event })" required="required" pattern="[^@\s]+@[^@\s]+\.[^@\s]+" error="L'adresse mail n'a pas le bon format"></mdl-textfield><br />
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
    </div>
</template>

<script>
import pick from 'lodash.pick';
import bcrypt from 'bcryptjs';
import { mapState, mapActions } from 'vuex';
import { randString } from '../../../lib/randString';

const randTen = () => Math.floor(Math.random() * 10);

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
            'updateModObject',
            'notify',
            'notifyError'
        ]),

        regenPin(user) {
            this.newPin = `${randTen()}${randTen()}${randTen()}${randTen()}`;

            const modUser = {
                id : user.id,
                pin: bcrypt.hashSync(this.newPin, 10)
            };

            this.updateObject({ route: 'users', value: modUser });
        },
        regenPassword(user) {
            this.newPassword = randString(8);

            const modUser    = {
                id      : user.id,
                password: bcrypt.hashSync(this.newPassword, 10)
            };

            this.updateObject({ route: 'users', value: modUser });
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
                    value: { type: 'etuMail', data: user.mail, user_id: user.id }
                });
            } else {
                existingMol.data = user.mail;
                this.updateObject({
                    route: 'meansOfLogin',
                    value: existingMol
                });
            }

            const fields = ['id', 'lastname', 'firstname', 'nickname', 'mail'];

            this.updateObject({ route: 'users', value: pick(user, fields) })
                .then(() => this.notify({ message: 'L\'utilisateur a bien été modifié' }))
                .catch(err => this.notifyError({
                    message: 'Une erreur a eu lieu lors de la modification de l\'utilisateur',
                    full   : err
                }));
        }
    },

    computed: {
        ...mapState({
            modObject: state => state.app.modObject
        })
    }
};
</script>
