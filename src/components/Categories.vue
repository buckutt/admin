<template>
    <div class="b-categories">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Catégories</h3>
            <transition name="fade">
                <div v-if="modObject">
                    <h5>Modifier la catégorie {{ modObject.name }}:</h5>
                    <form @submit.prevent="updateObject({ route: 'categories', value: modObject })">
                        <mdl-textfield floating-label="Nom" :value="modObject.name" @input="updateModObject({ field:'name', value: $event })" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield>
                        <br />
                        <mdl-button colored raised>Modifier</mdl-button>
                    </form>
                    <br />

                    <div v-show="modObject.articles">
                        <h5>Articles dans la catégorie:</h5>
                        <mdl-button v-for="article in modObject.articles" :key="article.id" @click.native="search(article)">{{ article.name }}</mdl-button>
                        <br />
                    </div>

                    <h5>Rechercher un article:</h5>
                    <form @submit.prevent>
                        <mdl-textfield floating-label="Nom" v-model="articleName"></mdl-textfield>
                    </form>

                    <div class="b-responsive-table" v-show="articleName.length > 0 && filteredArticles.length > 0">
                        <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                            <thead>
                                <tr>
                                    <th class="mdl-data-table__cell--non-numeric">Objet</th>
                                    <th class="mdl-data-table__cell--non-numeric">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="article in filteredArticles">
                                    <td class="mdl-data-table__cell--non-numeric b--capitalized">{{ article.name }}</td>
                                    <td class="mdl-data-table__cell--non-numeric b-actions-cell">
                                        <mdl-button raised colored @click.native="addToCategory(modObject, article)" v-show="!isInCategory(article)">Ajouter</mdl-button>
                                        <mdl-button raised accent @click.native="removeFromCategory(modObject, article)" v-show="isInCategory(article)">Enlever</mdl-button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <br />
                    <mdl-button colored raised @click.native="$root.goBack()">Retour</mdl-button>
                </div>
            </transition>
            <transition name="fade">
                <div v-if="!modObject">
                    <form @submit.prevent="createObject({ route: 'categories', value: inputCategory() })">
                        <mdl-textfield floating-label="Nom" v-model="newCategory.name" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield>
                        <br />
                        <mdl-button colored raised>Créer</mdl-button>
                    </form>

                    <br />

                    <div class="b-responsive-table">
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
                                        <mdl-button raised colored @click.native="expandCategory(category)">Modifier</mdl-button>
                                        <mdl-button raised accent @click.native="$root.confirm() && removeObject({ route: 'categories', value: category })">Supprimer</mdl-button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import fuzzy from 'fuzzy';

const categoryPattern = {
    name: ''
};

export default {
    data() {
        return {
            newCategory: Object.assign({}, categoryPattern),
            articleName: ''
        };
    },

    methods: {
        ...mapActions([
            'createObject',
            'updateObject',
            'removeObject',
            'createSimpleRelation',
            'removeSimpleRelation',
            'expandObject',
            'updateModObject'
        ]),
        expandCategory(category) {
            this.$router.push(`/categories/${category.id}`);

            this.expandObject({
                route: 'categories',
                value: category
            });
        },
        search(article) {
            this.articleName = article.name;
        },
        isInCategory(article) {
            let isInCategory = false;
            if (this.modObject.articles) {
                if (this.modObject.articles.length > 0) {
                    this.modObject.articles.forEach((a) => {
                        if (a.id === article.id) {
                            isInCategory = true;
                        }
                    });
                }
            }
            return isInCategory;
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
        inputCategory() {
            const inputCategory = Object.assign({}, this.newCategory);
            this.newCategory    = Object.assign({}, categoryPattern);

            return inputCategory;
        }
    },

    computed: {
        ...mapState({
            categories: state => state.app.categories,
            articles  : state => state.app.articles,
            modObject : state => state.app.modObject,
            params    : state => state.route.params
        }),
        filteredArticles() {
            const val           = this.articleName;
            const articlesNames = fuzzy.filter(val, this.articles, { extract: el => el.name });
            return articlesNames.map(article => article.original);
        }
    },

    mounted() {
        if (this.params.id) {
            this.expandCategory({ id: this.params.id });
        }
    }
};
</script>

<style lang="scss">
    @import '../main.scss';

    .b-categories {
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
    }
</style>
