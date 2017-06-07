<template>
    <div>
        <h3>Fin</h3>
        L'événement est maintenant configuré et utilisable. Vous pouvez revenir sur cet utilitaire à tout moment via le menu <strong>Événements</strong>.
    </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    methods: {
        ...mapActions([
            'updateLastValidatedStep'
        ])
    },

    mounted() {
        this.updateLastValidatedStep(4);
    }
};
</script>
