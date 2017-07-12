<template>
    <div>
        <h5>Rechercher un utilisateur</h5>
        <mdl-textfield floating-label="Nom/Prénom" v-model="userName" @input="searchUsers(userName)"></mdl-textfield>

        <b-table
            :headers="[{ title: 'Utilisateur', field: 'fullname', class: 'b--capitalized', object: true }]"
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
        const searchUsers = this.searchUsers;
        this.searchUsers  = debounce(name => searchUsers(name), 500);
    }
};
</script>
