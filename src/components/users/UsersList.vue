<template>
    <div>
        <h5>Liste des utilisateurs</h5>
        <div class="b-table-search">
            <i class="material-icons">search</i>
            <mdl-textfield floating-label="Nom ou Prénom de l'utilisateur" v-model="userName" @input="searchUsers(userName)"></mdl-textfield>
            <i class="material-icons" id="usertip">info</i>
            <mdl-tooltip target="usertip">En dessous de 2 caractères, seuls les 10 premiers résultats sont affichés.</mdl-tooltip>
        </div>

        <b-table
            :headers="[{ title: 'Utilisateur', field: 'fullname', class: 'b--capitalized', object: true }]"
            :data="displayedUsers"
            :sort="{ field: 'firstname', order: 'ASC' }"
            :actions="[
                { action: 'edit', text: 'Modifier', raised: true, colored: true },
                { action: 'remove', text: 'Supprimer', type: 'confirm' }
            ]"
            route="users"
            :paging="10"
            @edit="editUser"
            @remove="removeObject">
        </b-table>
    </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { mapState, mapActions } from 'vuex';

export default {
    data() {
        return {
            userName: ''
        };
    },

    methods: {
        ...mapActions([
            'searchUsers',
            'clearObject',
            'removeObject'
        ]),

        editUser(user) {
            this.$router.push(`/users/${user.id}/edit`);
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
        this.searchUsers('');

        const searchUsers = this.searchUsers;
        this.searchUsers  = debounce(name => searchUsers(name), 500);
    },

    destroyed() {
        this.clearObject('users');
    }
};
</script>
