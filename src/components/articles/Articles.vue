<template>
    <div class="b-articles b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Articles</h3>
            <h5>Ajouter un article</h5>
            <form @submit.prevent="createObject({ route: 'articles', value: inputArticle() })">
                <mdl-textfield floating-label="Nom" v-model="newArticle.name" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield>
                <mdl-button colored raised>Créer</mdl-button>
            </form>

            <h5>Rechercher un article</h5>
            <mdl-textfield floating-label="Nom" v-model="name"></mdl-textfield>

            <b-table
                :headers="[{ title: 'Article', field: 'name' }]"
                :data="articles"
                :filter="{ val: this.name, field: 'name' }"
                :sort="{ field: 'name', order: 'ASC' }"
                :actions="[
                    { action: 'edit', text: 'Modifier', raised: true, colored: true },
                    { action: 'remove', text: 'Supprimer', type: 'confirm' }
                ]"
                route="articles"
                :paging="5"
                @edit="editArticle"
                @remove="removeObject">
            </b-table>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

const articlePattern = {
    name   : '',
    stock  : 0,
    vat    : 0,
    alcohol: 0
};

export default {
    data() {
        return {
            name      : '',
            newArticle: Object.assign({}, articlePattern)
        };
    },

    methods: {
        ...mapActions([
            'createObject',
            'removeObject'
        ]),
        editArticle(article) {
            this.$router.push(`/articles/edit/${article.id}`);
        },
        inputArticle() {
            const inputArticle = Object.assign({}, this.newArticle);
            this.newArticle    = Object.assign({}, articlePattern);
            this.name          = inputArticle.name;

            return inputArticle;
        }
    },

    computed: {
        ...mapState({
            articles: state => state.objects.articles
        })
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';
</style>
