<template>
    <div>
        <h5>Ajouter un article</h5>
        <form @submit.prevent="createArticle(newArticle)">
            <mdl-textfield floating-label="Nom" v-model="newArticle.name" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield>
            <mdl-button colored raised>Créer</mdl-button>
        </form>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

const articlePattern = {
    name   : '',
    stock  : 0,
    vat    : 0,
    alcohol: 0
};

export default {
    data() {
        return {
            newArticle: Object.assign({}, articlePattern)
        };
    },

    methods: {
        ...mapActions([
            'createObject'
        ]),
        createArticle(article) {
            this.createObject({ route: 'articles', value: article });
            this.newArticle = Object.assign({}, articlePattern);
        }
    }
};
</script>
