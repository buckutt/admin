<template>
    <div class="b-categories b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Catégories</h3>
            <form @submit.prevent="createObject({ route: 'categories', value: inputCategory() })">
                <mdl-textfield floating-label="Nom" v-model="newCategory.name" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield>
                <br />
                <mdl-button colored raised>Créer</mdl-button>
            </form>
            <br />
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
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

const categoryPattern = {
    name: ''
};

export default {
    data() {
        return {
            newCategory: Object.assign({}, categoryPattern)
        };
    },

    methods: {
        ...mapActions([
            'createObject',
            'removeObject'
        ]),
        editCategory(category) {
            this.$router.push(`/categories/edit/${category.id}`);
        },
        inputCategory() {
            const inputCategory = Object.assign({}, this.newCategory);
            this.newCategory    = Object.assign({}, categoryPattern);

            return inputCategory;
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
