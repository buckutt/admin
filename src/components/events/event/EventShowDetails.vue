<template>
    <div>
        <h5>Détails de l'événement</h5>
        <b-list :elements="elements" :columns="2"></b-list>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState({
            focusedEvent: state => state.app.focusedElements[0]
        }),

        elements() {
            return [
                {
                    icon   : 'keyboard_arrow_right',
                    title  : 'Nom',
                    content: this.focusedEvent.name
                },
                {
                    icon   : 'local_drink',
                    title  : 'Unités alcool maximales par participant',
                    content: (this.focusedEvent.maxAlcohol > 0) ?
                        this.focusedEvent.maxAlcohol :
                        'Pas de limite'
                },
                {
                    icon   : 'attach_money',
                    type   : 'price',
                    title  : 'Rechargement minimal',
                    content: this.focusedEvent.minReload
                },
                {
                    icon   : 'attach_money',
                    type   : 'price',
                    title  : 'Solde maximal',
                    content: this.focusedEvent.maxPerAccount
                }
            ];
        }
    }
};
</script>
