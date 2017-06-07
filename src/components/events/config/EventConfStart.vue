<template>
    <div>
        <h3>Départ</h3>
        Cet utilitaire va vous permettre de configurer votre événement afin qu'il réponde le mieux à vos besoins.<br /><br />

        <mdl-button accent raised @click.native="start">Suivant</mdl-button>
    </div>
</template>

<script>
export default {
    methods: {
        start() {
            this.$router.push(`${this.$router.currentRoute.path}/groups`);
        }
    }
};
</script>
