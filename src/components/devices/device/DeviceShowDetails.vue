<template>
    <div>
        <h5>Détails de l'équipement</h5>
        <b-list :elements="elements" :columns="2"></b-list>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState({
            modObject: state => state.app.modObject
        }),

        elements() {
            return [
                {
                    icon   : 'keyboard_arrow_right',
                    title  : 'Nom',
                    content: this.modObject.name
                },
                {
                    icon   : 'done_all',
                    title  : 'Badgeage avant achat',
                    content: (this.modObject.doubleValidation) ? 'Activé' : 'Désactivé'
                },
                {
                    icon   : 'local_drink',
                    title  : 'Avertissement alcool',
                    content: (this.modObject.alcohol) ? 'Activé' : 'Désactivé'
                },
                {
                    icon   : 'person',
                    title  : 'Afficher l\'image utilisateur',
                    content: (this.modObject.showPicture) ? 'Activé' : 'Désactivé'
                }
            ];
        }
    }
};
</script>
