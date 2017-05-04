<template>
    <div>
        <h5>Liste des catégories</h5>
        <b-table
            :headers="[{ title: 'Catégorie', field: 'name' }]"
            :data="categories"
            :sort="{ field: 'name', order: 'ASC' }"
            :actions="[
                { action: 'edit', text: 'Modifier', raised: true, colored: true },
                { action: 'remove', text: 'Supprimer', type: 'confirm' }
            ]"
            route="categories"
            :paging="10"
            @edit="editCategory"
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
        editCategory(category) {
            this.$router.push(`/categories/edit/${category.id}`);
        }
    },

    computed: {
        ...mapState({
            categories: state => state.objects.categories
        })
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';
</style>
