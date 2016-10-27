<template>
    <div>
        Déconnexion en cours...
    </div>
</template>

<script>
import { updateLogged } from '../store/actions';

export default {
    vuex: {
        getters: {
            logged: state => state.global.logged
        },
        actions: {
            updateLogged
        }
    },

    attached () {
        sessionStorage.clear();
        this.updateLogged(false);

        this.$route.router.go('/');
    }
}
</script>