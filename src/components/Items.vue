<template>
    <div>
        <div class="b-articles" v-if="currentEvent">
            <div class="mdl-card mdl-shadow--2dp">
                <h3>Articles</h3>
                <transition name="fade">
                    <div v-if="selectedArticle.name">
                        <h5>Modifier l'article {{ selectedArticle.name }}</h5>
                        <form @submit.prevent="updateArticle(modArticle)">
                            <mdl-textfield floating-label="Nom" v-model="modArticle.name"></mdl-textfield>
                            <mdl-textfield floating-label="Stock" v-model="modArticle.stock"></mdl-textfield><br />
                            <mdl-textfield floating-label="Alcool" v-model="modArticle.alchohol"></mdl-textfield>
                            <mdl-textfield floating-label="TVA" v-model="modArticle.vat"></mdl-textfield><br />
                            <mdl-button colored raised>Modifier</mdl-button>
                        </form>
                        <br />
                        <h5>Prix</h5>
                        <form @submit.prevent="createArticlePrice(selectedArticle, inputPrice)">
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
                                <tr v-for="price in detailsArticle.prices" v-if="price.period.Event_id == currentEvent.id">
                                    <td class="mdl-data-table__cell--non-numeric">{{ price.amount | price(true) }} TTC <span v-if="modArticle.vat > 0">({{ price.amount/(1+modArticle.vat/100) | price(true) }} HT)</span></td>
                                    <td class="mdl-data-table__cell--non-numeric">{{ price.point.name }}</td>
                                    <td class="mdl-data-table__cell--non-numeric">{{ price.fundation.name }}</td>
                                    <td class="mdl-data-table__cell--non-numeric">{{ price.group.name }}</td>
                                    <td class="mdl-data-table__cell--non-numeric">{{ price.period.name }}</td>
                                    <td class="mdl-data-table__cell--non-numeric"><mdl-button @click.native="$root.confirm() && deletePrice(price)">Supprimer</mdl-button></td>
                                </tr>
                            </tbody>
                        </table>
                        <br />
                        <mdl-button colored raised @click.native="goBack()">Retour</mdl-button>
                    </div>
                </transition>
                <transition name="fade">
                    <div v-if="!selectedArticle.name">
                        <h5>Ajouter un article</h5>
                        <form @submit.prevent="createArticle(inputArticle)">
                            <mdl-textfield floating-label="Nom" v-model="nameAdd"></mdl-textfield> <mdl-button colored raised>Créer</mdl-button>
                        </form>

                        <h5>Rechercher un article</h5>
                        <form @submit.prevent>
                            <mdl-textfield floating-label="Nom" v-model="name"></mdl-textfield>
                        </form>

                        <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp" v-show="name.length > 0 && filteredArticles.length > 0">
                            <thead>
                                <tr>
                                    <th class="mdl-data-table__cell--non-numeric">Objet</th>
                                    <th class="mdl-data-table__cell--non-numeric">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="article in filteredArticles">
                                    <td class="mdl-data-table__cell--non-numeric">{{ article.name }}</td>
                                    <td class="mdl-data-table__cell--non-numeric"><mdl-button @click.native="editArticle(article)">Modifier</mdl-button><mdl-button @click.native="$root.confirm() && removeArticle(article)">Supprimer</mdl-button></td>
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
            nameAdd          : '',
            name             : '',
            selectedArticle  : {},
            modArticle       : {},
            detailsArticle   : {},
            selectedPoint    : {},
            amount           : 0,
            selectedPeriod   : null,
            selectedGroup    : null,
            selectedFundation: null,
            selectedPoint    : null
        };
    },

    methods: {
        ...mapActions([
            'createArticle',
            'updateArticle',
            'removeArticle'
        ]),
        editArticle(article) {
            this.selectedArticle   = article;
            this.modArticle        = JSON.parse(JSON.stringify(article));
            this.selectedPeriod    = null;
            this.selectedGroup     = null;
            this.selectedFundation = null;
            this.selectedPoint     = null;

            const embedArticles = encodeURIComponent(JSON.stringify({
                prices: {
                    fundation: true,
                    group    : true,
                    period   : true,
                    point    : true
                }
            }));

            get(`articles/${article.id}?embed=${embedArticles}`)
                .then(result => {
                    result.prices = result.prices.filter(price => {
                        return !price.isRemoved;
                    });
                    this.detailsArticle = result;
                });
        },
        goBack() {
            this.selectedArticle = {};
            this.modArticle      = {};
        },
        createArticlePoint(article, point) {
            post(`articles/${article.id}/points`, {id: point.id})
                .then(result => {
                    this.detailsArticle.points.push(point);
                });
        },
        deleteArticlePoint(article, point) {
            del(`articles/${article.id}/points/${point.id}`)
                .then(result => {
                    let i = 0;
                    for (const p of this.detailsArticle.points) {
                        if (p.id === point.id) {
                            break;
                        }

                        ++i;
                    }

                    this.detailsArticle.points.splice(i, 1);
                });
        },
        deletePrice(price) {
            put(`prices/${price.id}`, {isRemoved: true})
                .then(result => {
                    let i = 0;
                    for (const p of this.detailsArticle.prices) {
                        if (p.id === result.id) {
                            break;
                        }

                        ++i;
                    }

                    this.detailsArticle.prices.splice(i, 1);
                });
        },
        createArticlePrice(article, price) {
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
                    return post(`articles/${article.id}/prices`, {id: result.id});
                })
                .then(result => {
                    this.detailsArticle.prices.push(currentPrice);

                    this.selectedFundation = null;
                    this.selectedGroup     = null;
                    this.selectedPeriod    = null;
                    this.selectedPoint     = null;
                });
        }
    },

    computed: {
        ...mapState({
            articles    : state => state.app.articles,
            points      : state => state.app.points,
            fundations  : state => state.app.fundations,
            periods     : state => state.app.periods,
            groups      : state => state.app.groups,
            currentEvent: state => state.global.currentEvent
        }),
        filteredArticles() {
            let val           = this.name;
            let articlesNames = fuzzy.filter(val, this.articles, { extract: el => el.name });
            return articlesNames.map(article => {
                return article.original;
            });
        },
        inputArticle() {
            const name   = this.nameAdd;
            this.nameAdd = '';
            this.name    = name;
            return {
                name   : name,
                stock  : 0,
                vat    : 0,
                alcohol: 0
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

    .b-articles {
        > div {
            height: calc(100% - 40px);
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

            table {
                width: 100%;
                white-space: normal;
            }
        }

        & + .mdl-snackbar {
            margin-left: $sidebarWidth / 2;
        }
    }
</style>
