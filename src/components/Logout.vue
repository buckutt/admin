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
            'clearAppStore'
        ])
    },

    computed: {
        ...mapState({
            logged: state => state.global.logged
        })
    },

    mounted () {
        sessionStorage.clear();
        this.updateLogged(false);
        this.clearAppStore();

        this.$router.push('/');
    }
}
</script>