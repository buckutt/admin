<template>
    <div>
        <h5>Créer une catégorie</h5>
        <form @submit.prevent="createObject({ route: 'categories', value: inputCategory() })">
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
        inputCategory() {
            const inputCategory = Object.assign({}, this.newCategory);
            this.newCategory    = Object.assign({}, categoryPattern);

            return inputCategory;
        }
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';
</style>
