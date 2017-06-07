<template>
    <div>
        <h5>Créer une catégorie</h5>
        <form @submit.prevent="createCategory(newCategory)">
            <mdl-textfield floating-label="Nom" v-model="newCategory.name" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield>
            <br />
            <mdl-button colored raised>Créer</mdl-button>
        </form>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

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
            'createObject'
        ]),
        createCategory(category) {
            this.createObject({ route: 'categories', value: category });
            this.newCategory = Object.assign({}, categoryPattern);
        }
    }
};
</script>
