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
                    icon   : 'local_drink',
                    title  : 'Unités alcool maximales par participant',
                    content: (this.modObject.maxAlcohol > 0) ?
                        this.modObject.maxAlcohol :
                        'Pas de limite'
                },
                {
                    icon   : 'attach_money',
                    type   : 'price',
                    title  : 'Rechargement minimal',
                    content: this.modObject.minReload
                },
                {
                    icon   : 'attach_money',
                    type   : 'price',
                    title  : 'Solde maximal',
                    content: this.modObject.maxPerAccount
                }
            ];
        }
    }
};
</script>
