<template>
    <div class="categories">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Catégories</h3>
            <div v-show="selectedCategory.name" transition="fade">
                <h5>Modifier la catégorie {{ selectedCategory.name }}:</h5>
                <form v-on:submit.prevent>
                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input type="text" class="mdl-textfield__input" v-model="modCategory.name">
                        <label for="nameMod" class="mdl-textfield__label">Nom</label>
                    </div>
                    <br />
                    <input type="submit" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" value="Modifier" @click="updateCategory(selectedCategory, modCategory)">
                </form>
                <br />

                <div v-show="detailsCategory.articles">
                    <h5>Articles dans la catégorie:</h5>
                    <button v-for="article in detailsCategory.articles" class="mdl-button" @click="search(article)">{{ article.name }}</button>
                    <br />
                </div>

                <h5>Rechercher un article:</h5>
                <form v-on:submit.prevent>
                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input type="text" v-model="articleName" class="mdl-textfield__input">
                        <label for="articleName" class="mdl-textfield__label">Nom</label>
                    </div>
                </form>

                <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp" v-show="articleName.length > 0 && filteredArticles.length > 0">
                    <thead>
                        <tr>
                            <th class="mdl-data-table__cell--non-numeric">Objet</th>
                            <th class="mdl-data-table__cell--non-numeric">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="article in filteredArticles">
                            <td class="mdl-data-table__cell--non-numeric name">{{ article.name }}</td>
                            <td class="mdl-data-table__cell--non-numeric">
                                <button type="button" class="mdl-button" @click="addToCategory(article)" v-show="!isInCategory(article)">Ajouter</button>
                                <button type="button" class="mdl-button" @click="removeFromCategory(article)" v-show="isInCategory(article)">Enlever</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" @click="goBack()">Retour</button>
            </div>
            <div v-show="!selectedCategory.name" transition="fade">
                <form v-on:submit.prevent>
                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input class="mdl-textfield__input" type="text" id="name" v-model="name">
                        <label class="mdl-textfield__label" for="name">Nom</label>
                    </div>
                    <br>
                    <input type="submit" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" @click="createCategory(inputCategory)" value="Créer">
                </form>

                <br>

                <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                    <thead>
                        <tr>
                            <th class="mdl-data-table__cell--non-numeric">Catégorie</th>
                            <th class="mdl-data-table__cell--non-numeric">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="category in categories">
                            <td class="mdl-data-table__cell--non-numeric">{{ category.name }}</td>
                            <td class="mdl-data-table__cell--non-numeric">
                                <button type="button" class="mdl-button" @click="editCategory(category)">Modifier</button>
                                <button type="button" class="mdl-button" @click="removeCategory(category)">Supprimer</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import { get, post, del } from '../lib/fetch';
import { createCategory, updateCategory, removeCategory } from '../store/actions';
import fuzzy from 'fuzzy';

export default {
    vuex: {
        getters: {
            categories: state => state.app.categories,
            articles  : state => state.app.articles
        },
        actions: {
            createCategory: createCategory,
            updateCategory: updateCategory,
            removeCategory: removeCategory
        }
    },

    data () {
        return {
            name            : '',
            articleName     : '',
            selectedCategory: {},
            detailsCategory : {},
            modCategory     : {}
        };
    },

    methods: {
        goBack() {
            this.selectedCategory = {};
            this.modCategory      = {};
        },
        editCategory(category) {
            this.selectedCategory = category;
            this.modCategory      = JSON.parse(JSON.stringify(category));

            const embedCategories = encodeURIComponent(JSON.stringify({
                articles: true
            }));

            get(`categories/${category.id}?embed=${embedCategories}`)
                .then(result => {
                    result.articles = result.articles.filter(article => {
                        return !article.isRemoved;
                    });
                    this.detailsCategory = result;
                });
        },
        search(article) {
            this.articleName = article.name;
        },
        isInCategory(article) {
            let isInCategory = false;
            if(this.detailsCategory.articles.length > 0) {
                this.detailsCategory.articles.forEach((a, i) => {
                    if(a.id == article.id) {
                        isInCategory = true;
                    }
                });
            }
            return isInCategory;
        },
        addToCategory(article) {
            post(`categories/${this.selectedCategory.id}/articles`, {id: article.id})
                .then(result => {
                    this.detailsCategory.articles.push(article);
                });
        },
        removeFromCategory(article) {
            del(`categories/${this.selectedCategory.id}/articles/${article.id}`)
                .then(result => {
                    let i = 0;
                    for (const a of this.detailsCategory.articles) {
                        if (a.id === article.id) {
                            break;
                        }

                        ++i;
                    }

                    this.detailsCategory.articles.splice(i, 1);
                });
        }
    },

   computed: {
        filteredArticles() {
            let val           = this.articleName;
            let articlesNames = fuzzy.filter(val, this.articles, { extract: el => el.name });
            console.log(articlesNames);
            return articlesNames.map(article => {
                return article.original;
            });
        },
        inputCategory() {
            const name = this.name;
            this.name  = '';
            return {
                name: name,
            };
        }
    }
}
</script>

<style lang="sass">
    @import '../main.scss';

    .categories {
        > div {
            min-height: calc(100% - 40px);
            margin: 20px ((100% - $cardSize) / 2);
            padding: 20px;
            width: $cardSize;

            > h3 {
                margin: 0;
            }

            > select {
                display: inline-block;
                max-width: 150px;
            }

            button {
                max-width: 300px;
            }

            table {
                width: 100%;
                white-space: normal;
            }
        }

        .name {
            text-transform: capitalize;
        }

        .fade-transition {
            transition: opacity .4s ease;
        }

        .fade-enter {
            opacity: 0;
        }

        .fade-leave {
            display: none;
        }
    }
</style>
