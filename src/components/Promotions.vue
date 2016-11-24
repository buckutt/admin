<template>
    <div>
        <div class="promotions" v-if="currentEvent">
            <div class="mdl-card mdl-shadow--2dp">
                <h3>Promotions</h3>
                <transition name="fade">
                    <div v-if="selectedPromotion.name">
                        <h5>Modifier la promotion {{ selectedPromotion.name }}:</h5>
                        <form @submit.prevent="updatePromotion(modPromotion)">
                            <mdl-textfield floating-label="Nom" v-model="modPromotion.name"></mdl-textfield><br />
                            <mdl-button colored raised>Modifier</mdl-button>
                        </form>
                        <br />
                        <h5>Prix:</h5>
                        <form v-on:submit.prevent="createPromotionPrice(selectedPromotion, inputPrice)">
                            <mdl-textfield floating-label="Montant TTC (centimes)" v-model="amount"></mdl-textfield>
                            <mdl-select label="Point" id="point-select" v-model="selectedPoint" :options="pointOptions"></mdl-select>
                            <mdl-select label="Fondation" id="fundation-select" v-model="selectedFundation" :options="fundationOptions"></mdl-select><br />
                            <mdl-select label="Groupe" id="group-select" v-model="selectedGroup" :options="groupOptions"></mdl-select>
                            <mdl-select label="Période" id="period-select" v-model="selectedPeriod" :options="periodOptions"></mdl-select><br />
                            <mdl-button colored raised>Ajouter</mdl-button>
                        </form>
                        <br />
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
                                <tr v-for="price in detailsPromotion.prices" v-show="price.period.Event_id == currentEvent.id">
                                    <td class="mdl-data-table__cell--non-numeric">{{ price.amount | price(true) }} TTC <span v-if="modPromotion.vat > 0">({{ price.amount/(1+modPromotion.vat/100) | price(true) }} HT)</span></td>
                                    <td class="mdl-data-table__cell--non-numeric">{{ price.point.name }}</td>
                                    <td class="mdl-data-table__cell--non-numeric">{{ price.fundation.name }}</td>
                                    <td class="mdl-data-table__cell--non-numeric">{{ price.group.name }}</td>
                                    <td class="mdl-data-table__cell--non-numeric">{{ price.period.name }}</td>
                                    <td class="mdl-data-table__cell--non-numeric"><mdl-button @click.native="$root.confirm() && deletePrice(price)">Supprimer</mdl-button></td>
                                </tr>
                            </tbody>
                        </table>
                        <br />
                        <div class="promotionContent">
                            <h5>Contenu de la promotion :</h5>
                            <transition name="fade">
                                <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp" v-if="formatPromo.length > 0">
                                   <thead>
                                        <tr>
                                            <th class="mdl-data-table__cell--non-numeric">Ensemble</th>
                                            <th class="mdl-data-table__cell--non-numeric">Choix possibles</th>
                                            <th class="mdl-data-table__cell--non-numeric" v-show="typeof displayRemove === 'number' || displayChoose">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(set, index) in formatPromo">
                                            <td class="mdl-data-table__cell--non-numeric">
                                                <strong>{{ index+1 }}</strong>
                                            </td>
                                            <td class="mdl-data-table__cell--non-numeric">
                                                <transition-group name="fade">
                                                    <mdl-button v-for="(article, indexA) in set.articles" :key="index+'_'+indexA" @click.native="chooseArticle(article, index)">{{ article.name }}</mdl-button>
                                                </transition-group>
                                            </td>
                                            <transition name="fade">
                                                <td class="mdl-data-table__cell--non-numeric right" v-show="displayChoose">
                                                    <mdl-button @click.native="addChosenArticleToStep(index)"><i class="material-icons">add</i></mdl-button>
                                                </td>
                                            </transition>
                                            <transition name="fade">
                                                <td class="mdl-data-table__cell--non-numeric right" v-show="displayRemove === index">
                                                    <mdl-button @click.native="removeChosenArticleFromStep(index)"><i class="material-icons">remove</i></mdl-button>
                                                </td>
                                            </transition>
                                            <td v-show="typeof displayRemove === 'number' && displayRemove !== index"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </transition>
                            <transition name="fade">
                                <p v-if="formatPromo.length == 0">La promotion est vide.</p>
                            </transition>
                        </div>
                        <div class="articlesManagement">
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
                                            <mdl-button @click.native="addArticleToPromotion(article)">Nouvel ensemble</mdl-button>
                                            <mdl-button @click.native="chooseStepToAdd(article)" v-show="formatPromo.length > 0">Ajouter à un ensemble</mdl-button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="clear"></div>
                        <br />
                        <mdl-button colored raised @click.native="goBack()">Retour</mdl-button>
                    </div>
                </transition>
                <transition name="fade">
                    <div v-if="!selectedPromotion.name">
                        <form @submit.prevent="createPromotion(inputPromotion)">
                            <mdl-textfield floating-label="Nom" v-model="name"></mdl-textfield><br />
                            <mdl-button colored raised>Créer</mdl-button>
                        </form>

                        <br>

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
                                    <td class="mdl-data-table__cell--non-numeric">
                                        <mdl-button @click.native="editPromotion(promotion)">Modifier</mdl-button>
                                        <mdl-button @click.native="$root.confirm() && removePromotion(promotion)">Supprimer</mdl-button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </transition>
            </div>
        </div>
        <mdl-snackbar display-on="snackfilter"></mdl-snackbar>
    </div>
</template>

<script>
import price from '../lib/price';
import { get, post, put, del } from '../lib/fetch';
import { mapState, mapActions } from 'vuex';
import fuzzy from 'fuzzy';

export default {
    data () {
        return {
            name             : '',
            selectedPromotion: {},
            modPromotion     : {},
            detailsPromotion : {},
            amount           : 0,
            selectedPeriod   : null,
            selectedGroup    : null,
            selectedFundation: null,
            selectedPoint    : null,
            articleName      : '',
            displayChoose    : false,
            chosenArticle    : {},
            displayRemove    : false
        };
    },

    methods: {
        ...mapActions([
            'createPromotion',
            'updatePromotion',
            'removePromotion',
            'createSetWithArticles',
            'removeSet'
        ]),
        goBack() {
            this.selectedPromotion = {};
            this.modPromotion      = {};
            this.displayChoose     = false;
            this.displayRemove     = false;
            this.chosenArticle     = {};
        },
        search(article) {
            this.articleName = article.name;
        },
        editPromotion(promotion) {
            this.selectedPromotion = promotion;
            this.modPromotion      = JSON.parse(JSON.stringify(promotion));
            this.selectedPeriod    = null;
            this.selectedGroup     = null;
            this.selectedFundation = null;
            this.selectedPoint     = null;

            const embedPromotions = encodeURIComponent(JSON.stringify({
                prices: {
                    fundation: true,
                    group    : true,
                    period   : true,
                    point    : true
                },
                articles: true,
                sets    : {
                    articles: true
                }
            }));

            get(`promotions/${promotion.id}?embed=${embedPromotions}`)
                .then(result => {
                    result.prices = result.prices.filter(price => {
                        return !price.isRemoved;
                    });
                    this.detailsPromotion = result;
                });
        },
        createPromotionPrice(promotion, price) {
            if (!price.Fundation_id || !price.Period_id || !price.Group_id || !price.Fundation_id) {
                const data = {
                    message: 'Un des champs a mal été renseigné.',
                    timeout: 2000
                };

                return this.$root.$emit('snackfilter', data);
            }

            let currentPrice  = {};
            const embedPrices = encodeURIComponent(JSON.stringify({
                fundation: true,
                group    : true,
                period   : true,
                point    : true
            }));

            post(`prices?embed=${embedPrices}`, price)
                .then(result => {
                    currentPrice = result;
                    return post(`promotions/${promotion.id}/prices`, {id: result.id});
                })
                .then(result => {
                    this.detailsPromotion.prices.push(currentPrice);
                });
        },
        deletePrice(price) {
            put(`prices/${price.id}`, {isRemoved: true})
                .then(result => {
                    let i = 0;
                    for (const p of this.detailsPromotion.prices) {
                        if (p.id === result.id) {
                            break;
                        }

                        ++i;
                    }

                    this.detailsPromotion.prices.splice(i, 1);
                });
        },
        addArticleToPromotion(article) {
            this.displayChoose = false;
            this.chosenArticle = {};

            post(`promotions/${this.selectedPromotion.id}/articles`, {id: article.id})
                .then(result => {
                    this.detailsPromotion.articles.push(article);
                });
        },
        removeArticleFromPromotion(article) {
            del(`promotions/${this.selectedPromotion.id}/articles/${article.id}`)
                .then(result => {
                    let i = 0;
                    for (const a of this.detailsPromotion.articles) {
                        if (a.id === article.id) {
                            break;
                        }

                        ++i;
                    }

                    this.detailsPromotion.articles.splice(i, 1);
                });
        },
        removeSetFromPromotion(set) {
            del(`promotions/${this.selectedPromotion.id}/sets/${set.id}`)
                .then(result => {
                    let i = 0;
                    for (const s of this.detailsPromotion.sets) {
                        if (s.id === set.id) {
                            break;
                        }

                        ++i;
                    }

                    this.detailsPromotion.sets.splice(i, 1);
                });

            this.removeSet(set);
        },
        addArticleToSet(article, set) {
            post(`sets/${set.id}/articles`, {id: article.id})
                .then(result => {
                    this.detailsPromotion.sets.map(setPromo => {
                        if(setPromo.id == set.id) {
                            setPromo.articles.push(article);
                        }

                        return setPromo;
                    });
                });
        },
        removeArticleFromSet(article, set) {
            del(`sets/${set.id}/articles/${article.id}`)
                .then(result => {
                    let i = 0;
                    let j = 0;
                    for (const s of this.detailsPromotion.sets) {
                        if (s.id === set.id) {
                            for (const a of s.articles) {
                                if(a.id === article.id) {
                                    break;
                                }

                                ++i;
                            }

                            this.detailsPromotion.sets[j].articles.splice(i, 1);
                        }
                        ++j;
                    }
                });
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
        addChosenArticleToStep(index) {
            const step = this.formatPromo[index];

            if(step.type == 'article') {
                if(step.articles[0].id != this.chosenArticle.id) {
                    this.createSetWithArticles({
                        set: {
                            name: this.detailsPromotion.name
                        },
                        articles : [step.articles[0], this.chosenArticle],
                        promotion: this.selectedPromotion
                    });

                    this.detailsPromotion.sets.push({
                        name    : this.detailsPromotion.name,
                        articles: [step.articles[0], this.chosenArticle]
                    });

                    this.removeArticleFromPromotion(step.articles[0]);
                } else {
                    const data = {
                        message: 'L\'article est déjà présent dans l\'ensemble.',
                        timeout: 2000
                    };

                    this.$root.$emit('snackfilter', data);
                }
            } else if(step.type == 'set') {
                const articlesIds = step.set.articles.map(article => article.id);

                if(articlesIds.indexOf(this.chosenArticle.id) == -1) {
                    this.addArticleToSet(this.chosenArticle, step.set);
                } else {
                    const data = {
                        message: 'L\'article est déjà présent dans l\'ensemble.',
                        timeout: 2000
                    };

                    this.$root.$emit('snackfilter', data);
                }
            }

            this.displayChoose = false;
            this.chosenArticle = {};
        },
        removeChosenArticleFromStep(index) {
            const step = this.formatPromo[index];

            if(step.type == 'article') {
                this.removeArticleFromPromotion(this.chosenArticle);
            } else if (step.type == 'set') {
                if(step.set.articles.length > 2) {
                    this.removeArticleFromSet(this.chosenArticle, step.set);
                } else {
                    let keptArticle = {};
                    step.set.articles.forEach(article => {
                        if(article.id != this.chosenArticle.id) {
                            keptArticle = article;
                        }
                    });

                    this.removeArticleFromSet(this.chosenArticle, step.set);
                    this.removeSetFromPromotion(step.set);
                    this.addArticleToPromotion(keptArticle);
                }
            }

            this.displayRemove = false;
            this.chosenArticle = {};
        }
    },

    computed: {
        ...mapState({
            promotions  : state => state.app.promotions,
            points      : state => state.app.points,
            fundations  : state => state.app.fundations,
            periods     : state => state.app.periods,
            groups      : state => state.app.groups,
            articles    : state => state.app.articles,
            sets        : state => state.app.sets,
            currentEvent: state => state.global.currentEvent
        }),
        formatPromo() {
            let promotion = [];

            if(this.detailsPromotion.articles) {
                this.detailsPromotion.articles.forEach(article => {
                    promotion.push({
                        type    : 'article',
                        articles: [article]
                    });
                });
            }

            if(this.detailsPromotion.sets) {
                this.detailsPromotion.sets.forEach(set => {
                    const sortedArticles = set.articles.sort((a, b) => {
                        if(a.name < b.name) {
                            return -1;
                        }
                        if(a.name > b.name) {
                            return 1;
                        }
                        return 0;
                    });

                    promotion.push({
                        type    : 'set',
                        set     : set,
                        articles: sortedArticles
                    });
                });
            }

            promotion = promotion.sort((a, b) => {
                if(a.articles[0].name < b.articles[0].name) {
                    return -1;
                }
                if(a.articles[0].name > b.articles[0].name) {
                    return 1;
                }
                return 0;
            });

            return promotion;
        },
        filteredArticles() {
            let val           = this.articleName;
            let articlesNames = fuzzy.filter(val, this.articles, { extract: el => el.name });
            return articlesNames.map(article => {
                return article.original;
            });
        },
        inputPromotion() {
            const name = this.name;
            this.name  = '';
            return {
                name: name
            };
        },
        inputPrice() {
            const price = {
                amount: this.amount
            };

            if (this.selectedFundation) {
                price.Fundation_id = this.selectedFundation.id;
            }
            if (this.selectedGroup) {
                price.Group_id = this.selectedGroup.id;
            }
            if (this.selectedPeriod) {
                price.Period_id = this.selectedPeriod.id;
            }
            if (this.selectedPoint) {
                price.Point_id = this.selectedPoint.id;
            }

            return price;
        },
        periodOptions() {
            let periods = this.periods.map(period => {
                if(period.Event_id == this.currentEvent.id) {
                    return { name: period.name, value: period };
                } else {
                    return null;
                }
            });

            return periods.filter(a => a);
        },
        pointOptions() {
            return this.points.map(point => {
                return { name: point.name, value: point };
            });
        },
        fundationOptions() {
            return this.fundations.map(fundation => {
                return { name: fundation.name, value: fundation };
            });
        },
        groupOptions() {
            return this.groups.map(group => {
                return { name: group.name, value: group };
            });
        }
    }
}
</script>

<style lang="sass">
    @import '../main.scss';

    .promotions {
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

        & + .mdl-snackbar {
            margin-left: $sidebarWidth / 2;
        }

        .articlesManagement {
            display:block;
            float:right;
            width:47%;
        }

        .promotionContent {
            display:block;
            width:47%;
            float:left;
        }

        .clear {
            clear:both;
        }

        .right {
            text-align:right;
        }
    }
</style>
