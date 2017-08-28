<template>
    <div>
        <h5>Modifier le point {{ modObject.name }}:</h5>
        <form @submit.prevent="updatePoint(modObject)">
            <mdl-textfield floating-label="Nom" :value="modObject.name" @input="updateModObject({ field:'name', value: $event })" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield><br />
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
        updatePoint(point) {
            this.updateObject({ route: 'points', value: point })
                .then(() => this.notify({ message: 'Le point a bien été modifié' }))
                .catch(err => this.notifyError({
                    message: 'Une erreur a eu lieu lors de la modification du point',
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
