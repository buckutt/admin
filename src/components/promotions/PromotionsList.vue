<template>
    <div>
        <h5>Liste des formules</h5>
        <b-table
            :headers="[{ title: 'Formule', field: 'name', object: true }]"
            :data="promotions"
            :sort="{ field: 'name', order: 'ASC' }"
            :actions="[
                { action: 'edit', text: 'Modifier' },
                { action: 'remove', text: 'Supprimer', type: 'confirm' }
            ]"
            route="promotions"
            :paging="10"
            @edit="editPromotion"
            @remove="removeObject">
        </b-table>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    methods: {
        ...mapActions([
            'removeObject'
        ]),
        editPromotion(promotion) {
            this.$router.push(`/promotions/${promotion.id}/edit`);
        }
    },

    computed: {
        ...mapState({
            promotions: state => state.objects.promotions
        })
    }
};
</script>
