<template>
    <div>
        <h5>Articles dans la catégorie:</h5>
        <span class="mdl-chip mdl-chip--deletable b--spaces" v-for="article in modObject.articles" :key="article.id">
            <span class="mdl-chip__text">{{ article.name }}</span>
            <b-confirm @confirm="removeFromCategory(modObject, article)" class="b--inline">
                <button class="mdl-chip__action"><i class="material-icons">cancel</i></button>
            </b-confirm>
        </span>
        <p v-if="modObject.articles.length === 0">Aucun pour le moment.</p>

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
            'createRelation',
            'removeRelation',
            'notify',
            'notifyError'
        ]),
        isInCurrentCategory(article) {
            const index = this.modObject.articles.findIndex(a => (a.id === article.id));
            return (index !== -1);
        },
        addToCategory(category, article) {
            this
                .createRelation({
                    obj1: {
                        route: 'categories',
                        value: category
                    },
                    obj2: {
                        route: 'articles',
                        value: article
                    }
                })
                .then(() => this.notify({ message: 'L\'article a bien été lié à la catégorie' }))
                .catch(err => this.notifyError({
                    message: 'L\'article n\'a pas pu être lié à la catégorie',
                    full   : err
                }));
        },
        removeFromCategory(category, article) {
            this.removeRelation({
                obj1: {
                    route: 'categories',
                    value: category
                },
                obj2: {
                    route: 'articles',
                    value: article
                }
            })
                .then(() => this.notify({ message: 'L\'article a bien été supprimé de la catégorie' }))
                .catch(err => this.notifyError({
                    message: 'L\'article n\'a pas pu être supprimé de la catégorie',
                    full   : err
                }));
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
