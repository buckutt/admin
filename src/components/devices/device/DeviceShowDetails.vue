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
        },
        displayedWikets() {
            return (!this.modObject) ? [] : this.modObject.wikets
                .filter(wiket => (wiket.period.event_id === this.currentEvent.id));
        },
        assignments() {
            return this.displayedWikets.map(wiket => ({
                icon : 'location_on',
                title: (this.currentEvent.usePeriods) ?
                    `Période ${wiket.period.name}` :
                    undefined,
                content: wiket.point.name
            }));
        }
    }
};
</script>
