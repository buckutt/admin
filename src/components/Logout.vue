<template>
    <div>
        Déconnexion en cours...
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    methods: {
        ...mapActions([
            'updateLogged',
            'updateLoggedUser',
            'clearAppStore',
            'closeSocket'
        ])
    },

    computed: {
        ...mapState({
            logged: state => state.global.logged
        })
    },

    mounted() {
        sessionStorage.clear();
        this.updateLogged(false);
        this.updateLoggedUser(null);
        this.clearAppStore();
        this.closeSocket();

        this.$router.push('/');
    }
};
</script>
