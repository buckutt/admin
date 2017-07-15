<template>
    <div>
        <h5>Modifier la catégorie {{ modObject.name }}:</h5>
        <form @submit.prevent="updateCategory(modObject)">
            <mdl-textfield floating-label="Nom" :value="modObject.name" @input="updateModObject({ field:'name', value: $event })" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield>
            <br />
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
        updateCategory(category) {
            this.updateObject({ route: 'categories', value: category })
                .then(() => this.notify({ message: 'La catégorie a bien été modifiée' }))
                .catch(err => this.notifyError({
                    message: 'Une erreur a eu lieu lors de la modification de la catégorie',
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
