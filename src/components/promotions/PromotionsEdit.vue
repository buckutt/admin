<template>
    <div class="b-promotions b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Promotions</h3>
            <h5>Modifier la promotion {{ modObject.name }}:</h5>
            <form @submit.prevent="updateObject({ route: 'promotions', value: modObject })">
                <mdl-textfield floating-label="Nom" :value="modObject.name" @input="updateModObject({ field:'name', value: $event })" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield><br />
                <mdl-button colored raised>Modifier</mdl-button>
            </form>
            <br />
            <h5>Prix:</h5>
            <form v-on:submit.prevent="createPromotionPrice(modObject, inputPrice())">
                <mdl-textfield floating-label="Montant TTC (centimes)" v-model="newPrice.amount" required="required" pattern="[0-9]+" error="Le montant doit être un entier"></mdl-textfield>
                <mdl-select label="Point" id="point-select" v-model="newPrice.point" :options="pointOptions"></mdl-select>
                <mdl-select label="Fondation" id="fundation-select" v-model="newPrice.fundation" :options="fundationOptions"></mdl-select><br />
                <mdl-select label="Groupe" id="group-select" v-model="newPrice.group" :options="groupOptions"></mdl-select>
                <mdl-select label="Période" id="period-select" v-model="newPrice.period" :options="periodOptions"></mdl-select><br />
                <mdl-button colored raised>Ajouter</mdl-button>
            </form>
            <br />
            <b-table
                :headers="[
                    { title: 'Montant TTC', field: 'amount', type: 'price' },
                    { title: 'Point', field: 'point.name' },
                    { title: 'Fondation', field: 'fundation.name' },
                    { title: 'Groupe', field: 'group.name' },
                    { title: 'Période', field: 'period.name' }
                ]"
                :data="displayedPrices"
                :actions="[
                    { action: 'remove', text: 'Supprimer', type: 'confirm' }
                ]"
                route="prices"
                :paging="5"
                @remove="removeObject">
            </b-table>
            <br />
            <div class="b-promotions__contentManager">
                <div>
                    <h5>Contenu de la promotion :</h5>
                    <transition name="fade">
                        <div class="b-responsive-table">
                            <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp" v-if="promotionFormat.length > 0">
                               <thead>
                                    <tr>
                                        <th class="mdl-data-table__cell--non-numeric">Ensemble</th>
                                        <th class="mdl-data-table__cell--non-numeric">Choix possibles</th>
                                        <th class="mdl-data-table__cell--non-numeric" v-show="typeof displayRemove === 'number' || displayChoose">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(set, index) in promotionFormat">
                                        <td class="mdl-data-table__cell--non-numeric">
                                            <strong>{{ index + 1 }}</strong>
                                        </td>
                                        <td class="mdl-data-table__cell--non-numeric">
                                            <transition-group name="fade">
                                                <mdl-button v-for="(article, indexA) in set.articles" :key="index+'_'+indexA" @click.native="chooseArticle(article, index)">{{ article.name }}</mdl-button>
                                            </transition-group>
                                        </td>
                                        <transition name="fade">
                                            <td class="mdl-data-table__cell--non-numeric b--right" v-show="displayChoose">
                                                <mdl-button raised colored @click.native="addChosenArticleToStep(modObject, index)"><i class="material-icons">add</i></mdl-button>
                                            </td>
                                        </transition>
                                        <transition name="fade">
                                            <td class="mdl-data-table__cell--non-numeric b--right" v-show="displayRemove === index">
                                                <mdl-button raised accent @click.native="removeChosenArticleFromStep(modObject, index)"><i class="material-icons">remove</i></mdl-button>
                                            </td>
                                        </transition>
                                        <td v-show="typeof displayRemove === 'number' && displayRemove !== index"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </transition>
                    <transition name="fade">
                        <p v-if="promotionFormat.length == 0">La promotion est vide.</p>
                    </transition>
                </div>
                <div>
                    <h5>Rechercher un article:</h5>
                    <mdl-textfield floating-label="Nom" v-model="articleName"></mdl-textfield>

                    <b-table
                        :headers="[{ title: 'Article', field: 'name' }]"
                        :data="articles"
                        :filter="{ val: this.articleName, field: 'name' }"
                        :sort="{ field: 'name', order: 'ASC' }"
                        :actions="[
                            { action: 'addTo', text: 'Nouvel ensemble', raised: true },
                            { action: 'choose', text: 'Ajouter à un ensemble', raised: true },
                        ]"
                        route="articles"
                        :paging="5"
                        @addTo="addArticleToCurrentPromotion"
                        @choose="chooseStepToAdd">
                    </b-table>
                </div>
            </div>
            <br />
            <mdl-button colored raised @click.native="$root.goBack()">Retour</mdl-button>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';

const pricePattern = {
    amount   : 0,
    period   : null,
    group    : null,
    fundation: null,
    point    : null
};

export default {
    data() {
        return {
            newPrice     : Object.assign({}, pricePattern),
            articleName  : '',
            chosenArticle: {},
            displayChoose: false,
            displayRemove: false
        };
    },

    methods: {
        ...mapActions([
            'updateObject',
            'removeObject',
            'createSimpleRelation',
            'removeSimpleRelation',
            'createMultipleRelation',
            'createSetWithArticles',
            'addArticleToSet',
            'removeArticleFromSet',
            'updateModObject',
            'showClientError'
        ]),
        search(article) {
            this.articleName = article.name;
        },
        createPromotionPrice(promotion, price) {
            if (!price.Fundation_id || !price.Period_id || !price.Group_id || !price.Point_id) {
                return this.showClientError({ message: 'Un des champs a mal été renseigné.' });
            }

            this.createMultipleRelation({
                obj: {
                    route: 'promotions',
                    value: promotion
                },
                relation: {
                    route : 'prices',
                    fields: price
                }
            });
        },
        addArticleToCurrentPromotion(article) {
            this.addArticleToPromotion(this.modObject, article);
        },
        addArticleToPromotion(promotion, article) {
            this.displayChoose = false;
            this.chosenArticle = {};

            this.createSimpleRelation({
                obj1: {
                    route: 'promotions',
                    value: promotion
                },
                obj2: {
                    route: 'articles',
                    value: article
                }
            });
        },
        removeArticleFromPromotion(promotion, article) {
            this.removeSimpleRelation({
                obj1: {
                    route: 'promotions',
                    value: promotion
                },
                obj2: {
                    route: 'articles',
                    value: article
                }
            });
        },
        removeSetFromPromotion(promotion, set) {
            this.removeSimpleRelation({
                obj1: {
                    route: 'promotions',
                    value: promotion
                },
                obj2: {
                    route: 'sets',
                    value: set
                }
            });

            this.removeObject({ route: 'sets', value: set });
        },
        chooseStepToAdd(article) {
            this.displayRemove = false;
            this.displayChoose = true;
            this.chosenArticle = article;
        },
        chooseArticle(article, index) {
            this.displayChoose = false;
            this.displayRemove = index;
            this.chosenArticle = article;
        },
        addChosenArticleToStep(promotion, index) {
            const step = this.promotionFormat[index];

            if (step.type === 'article') {
                if (step.articles[0].id !== this.chosenArticle.id) {
                    this.createSetWithArticles({
                        set: {
                            name: promotion.name
                        },
                        articles: [step.articles[0], this.chosenArticle],
                        promotion
                    });

                    this.removeArticleFromPromotion(promotion, step.articles[0]);
                } else {
                    this.showClientError({ message: 'L\'article est déjà présent dans l\'ensemble.' });
                }
            } else if (step.type === 'set') {
                const articlesIds = step.set.articles.map(article => article.id);

                if (articlesIds.indexOf(this.chosenArticle.id) === -1) {
                    this.addArticleToSet({ article: this.chosenArticle, set: step.set });
                } else {
                    this.showClientError({ message: 'L\'article est déjà présent dans l\'ensemble.' });
                }
            }

            this.displayChoose = false;
            this.chosenArticle = {};
        },
        removeChosenArticleFromStep(promotion, index) {
            const step = this.promotionFormat[index];

            if (step.type === 'article') {
                this.removeArticleFromPromotion(promotion, this.chosenArticle);
            } else if (step.type === 'set') {
                if (step.set.articles.length > 2) {
                    this.removeArticleFromSet({ article: this.chosenArticle, set: step.set });
                } else {
                    let keptArticle = {};
                    step.set.articles.forEach((article) => {
                        if (article.id !== this.chosenArticle.id) {
                            keptArticle = article;
                        }
                    });

                    this.removeArticleFromSet({ article: this.chosenArticle, set: step.set });
                    this.removeSetFromPromotion(promotion, step.set);
                    this.addArticleToPromotion(promotion, keptArticle);
                }
            }

            this.displayRemove = false;
            this.chosenArticle = {};
        },
        inputPrice() {
            const price   = Object.assign({}, this.newPrice);
            this.newPrice = Object.assign({}, pricePattern);

            if (price.fundation) {
                price.Fundation_id = price.fundation.id;
                delete price.fundation;
            }

            if (price.group) {
                price.Group_id = price.group.id;
                delete price.group;
            }

            if (price.period) {
                price.Period_id = price.period.id;
                delete price.period;
            }

            if (price.point) {
                price.Point_id = price.point.id;
                delete price.point;
            }

            return price;
        }
    },

    computed: {
        ...mapState({
            articles    : state => state.objects.articles,
            sets        : state => state.objects.sets,
            currentEvent: state => state.app.currentEvent,
            modObject   : state => state.app.modObject
        }),
        ...mapGetters([
            'groupOptions',
            'periodOptions',
            'pointOptions',
            'fundationOptions'
        ]),
        promotionFormat() {
            let promotion = [];

            if (this.modObject.articles) {
                this.modObject.articles.forEach((article) => {
                    promotion.push({
                        type    : 'article',
                        articles: [article]
                    });
                });
            }

            if (this.modObject.sets) {
                this.modObject.sets.forEach((set) => {
                    const sortedArticles = set.articles.sort((a, b) => {
                        if (a.name < b.name) {
                            return -1;
                        }
                        if (a.name > b.name) {
                            return 1;
                        }
                        return 0;
                    });

                    promotion.push({
                        type    : 'set',
                        set,
                        articles: sortedArticles
                    });
                });
            }

            promotion = promotion.sort((a, b) => {
                if (a.articles[0].name < b.articles[0].name) {
                    return -1;
                }
                if (a.articles[0].name > b.articles[0].name) {
                    return 1;
                }
                return 0;
            });

            return promotion;
        },
        displayedPrices() {
            if (!this.modObject) {
                return [];
            }

            return this.modObject.prices.map((price) => {
                if (price.period.Event_id === this.currentEvent.id) {
                    return price;
                }
                return null;
            }).filter(a => a);
        }
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';

    .b-promotions__contentManager {
        display: flex;
        justify-content: space-between;

        > div {
            width: 49%;
        }
    }
</style>
