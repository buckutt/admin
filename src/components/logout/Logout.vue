<template>
    <div>
        Déconnexion en cours...
    </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    methods: {
        ...mapActions([
            'updateLoggedUser',
            'clearAppStore',
            'closeSocket'
        ])
    },

    mounted() {
        sessionStorage.clear();
        this.updateLoggedUser(null);
        this.clearAppStore();
        this.closeSocket();

        this.$router.push('/');
    }
};
</script>
