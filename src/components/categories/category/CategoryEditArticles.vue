<template>
    <div>
        <div v-if="modObject.articles.length > 0">
            <h5>Articles dans la catégorie:</h5>
            <mdl-button v-for="article in modObject.articles" :key="article.id" @click.native="search(article)">{{ article.name }}</mdl-button>
            <br />
        </div>

        <h5>Rechercher un article:</h5>
        <mdl-textfield floating-label="Nom" v-model="articleName"></mdl-textfield>

        <b-table
            :headers="[{ title: 'Article', field: 'name' }]"
            :data="displayedArticles"
            :filter="{ val: this.articleName, field: 'name' }"
            :sort="{ field: 'name', order: 'ASC' }"
            :actions="[
                { action: 'move', text1: 'Ajouter', text2: 'Enlever', field: 'inCurrentCategory', type: 'reversible' }
            ]"
            route="articles"
            :paging="5"
            @move="moveFromCurrentCategory">
        </b-table>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    data() {
        return {
            articleName: ''
        };
    },

    methods: {
        ...mapActions([
            'createSimpleRelation',
            'removeSimpleRelation'
        ]),
        search(article) {
            this.articleName = article.name;
        },
        isInCurrentCategory(article) {
            const index = this.modObject.articles.findIndex(a => (a.id === article.id));
            return (index !== -1);
        },
        addToCategory(category, article) {
            this.createSimpleRelation({
                obj1: {
                    route: 'categories',
                    value: category
                },
                obj2: {
                    route: 'articles',
                    value: article
                }
            });
        },
        removeFromCategory(category, article) {
            this.removeSimpleRelation({
                obj1: {
                    route: 'categories',
                    value: category
                },
                obj2: {
                    route: 'articles',
                    value: article
                }
            });
        },
        moveFromCurrentCategory(article) {
            if (this.isInCurrentCategory(article)) {
                this.removeFromCategory(this.modObject, article);
            } else {
                this.addToCategory(this.modObject, article);
            }
        }
    },

    computed: {
        ...mapState({
            articles : state => state.objects.articles,
            modObject: state => state.app.modObject
        }),
        displayedArticles() {
            return this.articles.map((article) => {
                article.inCurrentCategory = this.isInCurrentCategory(article);
                return article;
            });
        }
    }
};
</script>
