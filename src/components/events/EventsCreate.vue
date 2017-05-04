<template>
    <div>
        <h5>Créer un événement</h5>
        <form v-on:submit.prevent="createObject({ route: 'events', value: inputEvent() })">
            <mdl-textfield floating-label="Nom" v-model="newEvent.name" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield><br />
            <mdl-textfield floating-label="Rechargement minimal (en centimes)" v-model="newEvent.config.minReload" required="required" pattern="[0-9]+" error="Le montant doit être un entier"></mdl-textfield><br />
            <mdl-textfield floating-label="Solde maximal (en centimes)" v-model="newEvent.config.maxPerAccount" required="required" pattern="[0-9]+" error="Le montant doit être un entier"></mdl-textfield><br />
            <mdl-textfield floating-label="Unités alcool maximale/participant" v-model="newEvent.config.maxAlcohol" required="required" pattern="[0-9]+" error="Les unités doivent être un entier"></mdl-textfield><br />
            <mdl-button colored raised>Créer</mdl-button>
        </form>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

const eventPattern = {
    name  : '',
    config: {
        minReload    : 0,
        maxPerAccount: 10000,
        maxAlcohol   : 0
    }
};

export default {
    data() {
        return {
            newEvent: Object.assign({}, eventPattern)
        };
    },

    methods: {
        ...mapActions([
            'createObject'
        ]),
        inputEvent() {
            const inputEvent = Object.assign({}, this.newEvent);
            this.newEvent    = Object.assign({}, eventPattern);

            return inputEvent;
        }
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';
</style>
