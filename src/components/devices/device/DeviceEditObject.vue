<template>
    <div>
        <h5>Modifier l'équipement {{ modObject.name }}</h5>
        <form @submit.prevent="updateDevice(modObject)">
            <mdl-textfield floating-label="Nom" :value="modObject.name" @input="updateModObject({ field:'name', value: $event })" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield>
            <mdl-textfield floating-label="Intervalle de rafraichissement" :value="modObject.refreshInterval" @input="updateModObject({ field:'refreshInterval', value: $event })"></mdl-textfield>
            <mdl-switch :value="modObject.realtime" @input="updateModObject({ field:'realtime', value: $event })" class="mdl-js-ripple-effect">Temps réel</mdl-switch><br />
            <mdl-switch :value="modObject.doubleValidation" @input="updateModObject({ field:'doubleValidation', value: $event })" class="mdl-js-ripple-effect">Revalidation post-achats</mdl-switch><br />
            <mdl-switch :value="modObject.alcohol" @input="updateModObject({ field:'alcohol', value: $event })" class="mdl-js-ripple-effect">Avertissement alcool</mdl-switch><br />
            <mdl-switch :value="modObject.showCategories" @input="updateModObject({ field:'showCategories', value: $event })" class="mdl-js-ripple-effect">Afficher les catégories</mdl-switch><br />
            <mdl-switch :value="modObject.showPicture" @input="updateModObject({ field:'showPicture', value: $event })" class="mdl-js-ripple-effect">Afficher l'image utilisateur</mdl-switch><br />

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
            'updateModObject',
            'notify',
            'notifyError'
        ]),
        updateDevice(device) {
            this.updateObject({ route: 'devices', value: device })
                .then(this.notify({ message: 'L\'équipement a bien été modifié' }))
                .catch(err => this.notifyError({
                    message: 'Une erreur a eu lieu lors de la modification de l\'équipement',
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
