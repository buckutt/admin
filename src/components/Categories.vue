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
                        @edit="expandCategory"
                        @remove="removeObject">
                    </b-table>
                </div>
            </transition>
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
        },
        inputCategory() {
            const inputCategory = Object.assign({}, this.newCategory);
            this.newCategory    = Object.assign({}, categoryPattern);

            return inputCategory;
        }
    },

    computed: {
        ...mapState({
            categories: state => state.objects.categories,
            articles  : state => state.objects.articles,
            modObject : state => state.app.modObject,
            params    : state => state.route.params
        }),
        displayedArticles() {
            return this.articles.map((article) => {
                article.inCurrentCategory = this.isInCurrentCategory(article);
                return article;
            });
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
