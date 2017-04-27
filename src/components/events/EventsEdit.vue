<template>
    <div class="b-events b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Évenements</h3>
            <h5>Modifier l'évenement {{ modObject.name }}:</h5>
            <form @submit.prevent="updateObject({ route: 'events', value: modObject })">
                <mdl-textfield floating-label="Nom" :value="modObject.name" @input="updateModObject({ field:'name', value: $event })"></mdl-textfield required="required" error="Le nom doit contenir au moins un caractère"><br />
                <mdl-textfield floating-label="Rechargement minimal (en centimes)" :value="modObject.config.minReload" @input="updateModObject({ field:'config.minReload', value: $event })" required="required" pattern="[0-9]+" error="Le montant doit être un entier"></mdl-textfield><br />
                <mdl-textfield floating-label="Solde maximal (en centimes)" :value="modObject.config.maxPerAccount" @input="updateModObject({ field:'config.maxPerAccount', value: $event })" required="required" pattern="[0-9]+" error="Le montant doit être un entier"></mdl-textfield><br />
                <mdl-textfield floating-label="Unités alcool maximale/participant" :value="modObject.config.maxAlcohol" @input="updateModObject({ field:'config.maxAlcohol', value: $event })" required="required" pattern="[0-9]+" error="Les unités doivent être un entier"></mdl-textfield><br />
                <mdl-button colored raised>Modifier</mdl-button>
            </form>
            <br />
            <mdl-button colored raised @click.native="$root.goBack()">Retour</mdl-button>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    methods: {
        ...mapActions([
            'updateObject',
            'updateModObject'
        ])
    },

    computed: {
        ...mapState({
            modObject: state => state.app.modObject
        })
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';
</style>
