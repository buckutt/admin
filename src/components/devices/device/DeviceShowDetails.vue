<template>
    <div>
        <h5>Détails de l'équipement</h5>
        <b-list :elements="elements" :columns="3"></b-list>
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
            const elements = [
                {
                    icon   : 'keyboard_arrow_right',
                    title  : 'Nom',
                    content: this.modObject.name
                },
                {
                    icon   : 'perm_device_information',
                    title  : 'Équipement administrateur',
                    content: (this.modObject.isUser) ? 'Oui' : 'Non'
                },
                {
                    icon   : 'security',
                    title  : 'Certificat SSL actif',
                    content: (this.modObject.fingerprint) ? 'Oui' : 'Non'
                }
            ];

            if (!this.modObject.isUser) {
                elements.push(
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
                );
            }

            return elements;
        }
    }
};
</script>
