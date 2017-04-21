<template>
    <div class="b-promotions">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Promotions</h3>
            <transition name="fade">
                <div v-if="modObject">
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
                    <div class="b-responsive-table">
                        <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                            <thead>
                                <tr>
                                    <th class="mdl-data-table__cell--non-numeric">Montant</th>
                                    <th class="mdl-data-table__cell--non-numeric">Point</th>
                                    <th class="mdl-data-table__cell--non-numeric">Fondation</th>
                                    <th class="mdl-data-table__cell--non-numeric">Groupe</th>
                                    <th class="mdl-data-table__cell--non-numeric">Période</th>
                                    <th class="mdl-data-table__cell--non-numeric">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="price in modObject.prices" v-show="price.period.Event_id == currentEvent.id">
                                    <td class="mdl-data-table__cell--non-numeric">{{ price.amount | price(true) }} TTC <span v-if="modObject.vat > 0">({{ price.amount/(1+modObject.vat/100) | price(true) }} HT)</span></td>
                                    <td class="mdl-data-table__cell--non-numeric">{{ price.point.name }}</td>
                                    <td class="mdl-data-table__cell--non-numeric">{{ price.fundation.name }}</td>
                                    <td class="mdl-data-table__cell--non-numeric">{{ price.group.name }}</td>
                                    <td class="mdl-data-table__cell--non-numeric">{{ price.period.name }}</td>
                                    <td class="mdl-data-table__cell--non-numeric">
                                        <b-confirm @confirm="removeObject({ route: 'prices', value: price })">Supprimer</b-confirm>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <br />
                    <div class="b-promotions__content">
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
                    <div class="b-promotions__articlesManagement">
                        <h5>Rechercher un article:</h5>
                        <form @submit.prevent>
                            <mdl-textfield floating-label="Nom" v-model="articleName"></mdl-textfield>
                        </form>

                        <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp" v-show="articleName.length > 0 && filteredArticles.length > 0">
                            <thead>
                                <tr>
                                    <th class="mdl-data-table__cell--non-numeric">Article</th>
                                    <th class="mdl-data-table__cell--non-numeric">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="article in filteredArticles">
                                    <td class="mdl-data-table__cell--non-numeric name">{{ article.name }}</td>
                                    <td class="mdl-data-table__cell--non-numeric">
                                        <mdl-button raised @click.native="addArticleToPromotion(modObject, article)">Nouvel ensemble</mdl-button>
                                        <mdl-button raised @click.native="chooseStepToAdd(article)" v-show="promotionFormat.length > 0">Ajouter à un ensemble</mdl-button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="b--clear"></div>
                    <br />
                    <mdl-button colored raised @click.native="$root.goBack()">Retour</mdl-button>
                </div>
            </transition>
            <transition name="fade">
                <div v-if="!modObject">
                    <form @submit.prevent="createObject({ route: 'promotions', value: inputPromotion() })">
                        <mdl-textfield floating-label="Nom" v-model="newPromotion.name"></mdl-textfield><br />
                        <mdl-button colored raised>Créer</mdl-button>
                    </form>

                    <br />

                    <div class="b-responsive-table">
                        <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                            <thead>
                                <tr>
                                    <th class="mdl-data-table__cell--non-numeric">Promotion</th>
                                    <th class="mdl-data-table__cell--non-numeric">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="promotion in promotions">
                                    <td class="mdl-data-table__cell--non-numeric">{{ promotion.name }}</td>
                                    <td class="mdl-data-table__cell--non-numeric b-actions-cell">
                                        <mdl-button raised colored @click.native="expandPromotion(promotion)">Modifier</mdl-button>
                                        <b-confirm @confirm="removeObject({ route: 'promotions', value: promotion })">Supprimer</b-confirm>
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
import '../lib/price';

const promotionPattern = {
    name: ''
};

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
            newPromotion : Object.assign({}, promotionPattern),
            newPrice     : Object.assign({}, pricePattern),
            articleName  : '',
            chosenArticle: {},
            displayChoose: false,
            displayRemove: false
        };
    },

    methods: {
        ...mapActions([
            'createObject',
            'updateObject',
            'removeObject',
            'createSimpleRelation',
            'removeSimpleRelation',
            'createMultipleRelation',
            'createSetWithArticles',
            'addArticleToSet',
            'removeArticleFromSet',
            'expandObject',
            'updateModObject',
            'showClientError'
        ]),
        expandPromotion(promotion) {
            this.$router.push(`/promotions/${promotion.id}`);

            this.displayChoose = false;
            this.displayRemove = false;
            this.chosenArticle = {};

            this.expandObject({
                route: 'promotions',
                value: promotion
            });
        },
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
        inputPromotion() {
            const inputPromotion = Object.assign({}, this.newPromotion);
            this.newPromotion    = Object.assign({}, promotionPattern);

            return inputPromotion;
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
            promotions  : state => state.objects.promotions,
            points      : state => state.objects.points,
            fundations  : state => state.objects.fundations,
            periods     : state => state.objects.periods,
            groups      : state => state.objects.groups,
            articles    : state => state.objects.articles,
            sets        : state => state.objects.sets,
            currentEvent: state => state.app.currentEvent,
            modObject   : state => state.app.modObject,
            params      : state => state.route.params
        }),
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
        filteredArticles() {
            const val           = this.articleName;
            const articlesNames = fuzzy.filter(val, this.articles, { extract: el => el.name });
            return articlesNames.map(article => article.original);
        },
        periodOptions() {
            return this.periods.map((period) => {
                if (period.Event_id === this.currentEvent.id) {
                    return { name: period.name, value: period };
                }
                return null;
            }).filter(a => a);
        },
        pointOptions() {
            return this.points.map(point => ({ name: point.name, value: point }));
        },
        fundationOptions() {
            return this.fundations.map(fundation => ({ name: fundation.name, value: fundation }));
        },
        groupOptions() {
            return this.groups.map(group => ({ name: group.name, value: group }));
        }
    },

    mounted() {
        if (this.params.id) {
            this.expandPromotion({ id: this.params.id });
        }
    }
};
</script>

<style lang="scss">
    @import '../main.scss';

    .b-promotions {
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

        .b-promotions__articlesManagement {
            display:block;
            float:right;
            width:47%;
        }

        .b-promotions__content {
            display:block;
            width:47%;
            float:left;
        }
    }
</style>
