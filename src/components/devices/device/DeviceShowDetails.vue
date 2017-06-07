<template>
    <div>
        <h5>Détails de l'équipement</h5>
        <b-list :elements="elements" :columns="2"></b-list>

        <h5 v-if="assignments.length > 0">Points assignés à l'équipement</h5>
        <b-list :elements="assignments" :columns="2"></b-list>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState({
            modObject   : state => state.app.modObject,
            currentEvent: state => state.app.currentEvent
        }),
        elements() {
            return [
                {
                    icon   : 'keyboard_arrow_right',
                    title  : 'Nom',
                    content: this.modObject.name
                },
                {
                    icon   : 'refresh',
                    title  : 'Temps réel',
                    content: (this.modObject.realtime) ?
                        `Activé (intervalle: ${this.modObject.refreshInterval}s)` :
                        'Desactivé'
                },
                {
                    icon   : 'done_all',
                    title  : 'Revalidation post-achats',
                    content: (this.modObject.doubleValidation) ? 'Activé' : 'Désactivé'
                },
                {
                    icon   : 'local_drink',
                    title  : 'Avertissement alcool',
                    content: (this.modObject.alcohol) ? 'Activé' : 'Désactivé'
                },
                {
                    icon   : 'format_list_numbered',
                    title  : 'Affichage des catégories',
                    content: (this.modObject.showCategories) ? 'Activé' : 'Désactivé'
                },
                {
                    icon   : 'person',
                    title  : 'Afficher l\'image utilisateur',
                    content: (this.modObject.showPicture) ? 'Activé' : 'Désactivé'
                }
            ];
        },
        displayedPoints() {
            return (!this.modObject) ? [] : this.modObject.points
                .filter(point => (point._through.period.Event_id === this.currentEvent.id));
        },
        assignments() {
            return this.displayedPoints.map(point => ({
                icon : 'location_on',
                title: (this.currentEvent.config.hasPeriods) ?
                    `Période ${point._through.period.name}` :
                    undefined,
                content: point.name
            }));
        }
    }
};
</script>
