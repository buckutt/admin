<template>
    <div>
        <h5>Modifier l'évenement</h5>
        <form @submit.prevent="updateEvent(modObject)">
            <mdl-textfield floating-label="Nom" :value="modObject.name" @input="updateModObject({ field: 'name', value: $event })"></mdl-textfield required="required" error="Le nom doit contenir au moins un caractère"><br />
            <mdl-textfield floating-label="Rechargement minimal (en centimes)" :value="modObject.minReload" @input="updateModObject({ field: 'minReload', value: $event })" required="required" pattern="[0-9]+" error="Le montant doit être un entier"></mdl-textfield><br />
            <mdl-textfield floating-label="Solde maximal (en centimes)" :value="modObject.maxPerAccount" @input="updateModObject({ field: 'maxPerAccount', value: $event })" required="required" pattern="[0-9]+" error="Le montant doit être un entier"></mdl-textfield><br />
            <mdl-textfield floating-label="Unités alcool maximales/participant" :value="modObject.maxAlcohol" @input="updateModObject({ field: 'maxAlcohol', value: $event })" required="required" pattern="[0-9]+" error="Les unités doivent être un entier"></mdl-textfield><br />
            <mdl-button colored raised>Modifier</mdl-button>
        </form>
    </div>
</template>

<script>
import pick from 'lodash.pick';
import { mapState, mapActions } from 'vuex';

export default {
    methods: {
        ...mapActions([
            'updateObject',
            'updateModObject',
            'notify',
            'notifyError'
        ]),
        updateEvent(event) {
            const fields = ['id', 'name', 'minReload', 'maxPerAccount', 'maxAlcohol'];

            this.updateObject({ route: 'events', value: pick(event, fields) })
                .then(() => this.notify({ message: 'L\'événement a bien été modifié' }))
                .catch(err => this.notifyError({
                    message: 'Une erreur a eu lieu lors de la modification de l\'événement',
                    full   : err
                }));
        }
    },

    computed: {
        ...mapState({
            modObject: state => state.app.modObject
        })
    }
};
</script>
