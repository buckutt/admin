<template>
    <div class="b-users b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Utilisateurs</h3>
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
                @edit="editUser"
                @remove="removeObject">
            </b-table>
        </div>
    </div>
</template>

<script>
import bcrypt   from 'bcryptjs';
import debounce from 'lodash.debounce';
import { mapState, mapActions } from 'vuex';
import { randString } from '../../lib/randString';

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
            newUser    : Object.assign({}, userPattern),
            userName   : '',
            newPin     : '',
            newPassword: ''
        };
    },

    methods: {
        ...mapActions([
            'searchUsers',
            'createUserWithMol',
            'removeObject'
        ]),
        editUser(user) {
            this.$router.push(`/users/edit/${user.id}`);
        },
        inputUser() {
            const inputUser = Object.assign({}, this.newUser);
            this.newUser    = Object.assign({}, userPattern);

            const randTen    = () => Math.floor(Math.random() * 10);
            this.newPin      = `${randTen()}${randTen()}${randTen()}${randTen()}`;
            this.newPassword = randString(8);

            inputUser.pin      = bcrypt.hashSync(this.newPin, 10);
            inputUser.password = bcrypt.hashSync(this.newPassword);

            return inputUser;
        }
    },

    computed: {
        ...mapState({
            users: state => state.objects.users
        }),
        displayedUsers() {
            return this.users.map((user) => {
                user.fullname = `${user.firstname} ${user.lastname}`;
                return user;
            });
        }
    },

    mounted() {
        const searchUsers = this.searchUsers;
        this.searchUsers  = debounce(name => searchUsers(name), 500);
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';
</style>
