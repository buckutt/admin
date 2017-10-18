<template>
    <div>
        <h5>Modifier le groupe {{ modObject.name }}:</h5>
        <form @submit.prevent="updateGroup(modObject)">
            <mdl-textfield floating-label="Nom" :value="modObject.name" @input="updateModObject({ field: 'name', value: $event })" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield><br />
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
        updateGroup(group) {
            const fields = ['id', 'name'];

            this.updateObject({ route: 'groups', value: pick(group, fields) })
                .then(() => this.notify({ message: 'Le groupe a bien été modifié' }))
                .catch(err => this.notifyError({
                    message: 'Une erreur a eu lieu lors de la modification du groupe',
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
