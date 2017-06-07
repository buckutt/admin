<template>
    <div>
        <h5>Modifier l'évenement</h5>
        <form @submit.prevent="updateObject({ route: 'events', value: modObject })">
            <mdl-textfield floating-label="Nom" :value="modObject.name" @input="updateModObject({ field:'name', value: $event })"></mdl-textfield required="required" error="Le nom doit contenir au moins un caractère"><br />
            <mdl-textfield floating-label="Rechargement minimal (en centimes)" :value="modObject.config.minReload" @input="updateModObject({ field:'config.minReload', value: $event })" required="required" pattern="[0-9]+" error="Le montant doit être un entier"></mdl-textfield><br />
            <mdl-textfield floating-label="Solde maximal (en centimes)" :value="modObject.config.maxPerAccount" @input="updateModObject({ field:'config.maxPerAccount', value: $event })" required="required" pattern="[0-9]+" error="Le montant doit être un entier"></mdl-textfield><br />
            <mdl-textfield floating-label="Unités alcool maximales/participant" :value="modObject.config.maxAlcohol" @input="updateModObject({ field:'config.maxAlcohol', value: $event })" required="required" pattern="[0-9]+" error="Les unités doivent être un entier"></mdl-textfield><br />
            <mdl-button colored raised>Modifier</mdl-button>
        </form>
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
