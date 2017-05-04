<template>
    <div>
        <h5>Liste des promotions</h5>
        <b-table
            :headers="[{ title: 'Promotion', field: 'name' }]"
            :data="promotions"
            :sort="{ field: 'name', order: 'ASC' }"
            :actions="[
                { action: 'edit', text: 'Modifier', raised: true, colored: true },
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
            this.$router.push(`/promotions/edit/${promotion.id}`);
        }
    },

    computed: {
        ...mapState({
            promotions: state => state.objects.promotions
        })
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';
</style>
