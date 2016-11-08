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

    mounted () {
        sessionStorage.clear();
        this.updateLogged(false);

        this.$router.push('/');
    }
}
</script>