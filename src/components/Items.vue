<template>
    <div class="articles">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Articles</h3>
            <div v-show="selectedArticle.name" transition="fade">
                <h5>Modifier l'article {{ selectedArticle.name }}</h5>
                <form v-on:submit.prevent>
                    <mdl-textfield floating-label="Nom" :value.sync="modArticle.name"></mdl-textfield>
                    <mdl-textfield floating-label="Stock" :value.sync="modArticle.stock"></mdl-textfield><br />
                    <mdl-textfield floating-label="Alcool" :value.sync="modArticle.alchohol"></mdl-textfield>
                    <mdl-textfield floating-label="TVA" :value.sync="modArticle.vat"></mdl-textfield><br />
                    <mdl-button colored raised @click="updateArticle(selectedArticle, modArticle)">Modifier</mdl-button>
                </form>
                <br />
                <h5>Prix</h5>
                <form v-on:submit.prevent>
                    <mdl-textfield floating-label="Montant TTC (centimes)" :value.sync="amount"></mdl-textfield>
                    <mdl-select label="Point" id="point-select" :value.sync="selectedPoint" :options="pointOptions"></mdl-select>
                    <mdl-select label="Fondation" id="fundation-select" :value.sync="selectedFundation" :options="fundationOptions"></mdl-select><br />
                    <mdl-select label="Groupe" id="group-select" :value.sync="selectedGroup" :options="groupOptions"></mdl-select>
                    <mdl-select label="Période" id="period-select" :value.sync="selectedPeriod" :options="periodOptions"></mdl-select><br />
                    <mdl-button colored raised @click="createArticlePrice(selectedArticle, inputPrice)">Ajouter</mdl-button>
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
                        <tr v-for="price in detailsArticle.prices">
                            <td class="mdl-data-table__cell--non-numeric">{{ price.amount | price true }} TTC <span v-show="modArticle.vat > 0">({{ price.amount/(1+modArticle.vat/100) | price true }} HT)</span></td>
                            <td class="mdl-data-table__cell--non-numeric">{{ price.point.name }}</td>
                            <td class="mdl-data-table__cell--non-numeric">{{ price.fundation.name }}</td>
                            <td class="mdl-data-table__cell--non-numeric">{{ price.group.name }}</td>
                            <td class="mdl-data-table__cell--non-numeric">{{ price.period.name }}</td>
                            <td class="mdl-data-table__cell--non-numeric"><mdl-button @click="deletePrice(price)">Supprimer</mdl-button></td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <mdl-button colored raised @click="goBack()">Retour</mdl-button>
            </div>
            <div v-show="!selectedArticle.name" transition="fade">
                <h5>Ajouter un article</h5>
                <form v-on:submit.prevent>
                    <mdl-textfield floating-label="Nom" :value.sync="nameAdd"></mdl-textfield> <mdl-button colored raised @click="createArticle(inputArticle)">Créer</mdl-button>
                </form>

                <h5>Rechercher un article</h5>
                <form v-on:submit.prevent>
                    <mdl-textfield floating-label="Nom" :value.sync="name"></mdl-textfield>
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
                            <td class="mdl-data-table__cell--non-numeric"><mdl-button @click="editArticle(article)">Modifier</mdl-button><mdl-button @click="removeArticle(article)">Supprimer</mdl-button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import price from '../lib/price';
import { get, post, put, del } from '../lib/fetch';
import { createArticle, updateArticle, removeArticle } from '../store/actions';
import fuzzy from 'fuzzy';

export default {
    vuex: {
        getters: {
            articles  : state => state.app.articles,
            points    : state => state.app.points,
            fundations: state => state.app.fundations,
            periods   : state => state.app.periods,
            groups    : state => state.app.groups
        },
        actions: {
            createArticle: createArticle,
            updateArticle: updateArticle,
            removeArticle: removeArticle
        }
    },
    data () {
        return {
            nameAdd          : '',
            name             : '',
            selectedArticle  : {},
            modArticle       : {},
            detailsArticle   : {},
            selectedPoint    : {},
            amount           : 0,
            selectedPeriod   : {},
            selectedGroup    : {},
            selectedFundation: {},
            selectedPoint    : {}
        };
    },
    methods: {
        editArticle(article) {
            this.selectedArticle   = article;
            this.modArticle        = JSON.parse(JSON.stringify(article));
            this.selectedPoint     = this.$store.state.app.points[0];
            this.selectedPeriod    = this.$store.state.app.periods[0];
            this.selectedGroup     = this.$store.state.app.groups[0];
            this.selectedFundation = this.$store.state.app.fundations[0];

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
                });
        }
    },
    computed: {
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
            const amount            = this.amount;
            const selectedFundation = this.selectedFundation;
            const selectedGroup     = this.selectedGroup;
            const selectedPeriod    = this.selectedPeriod;
            const selectedPoint     = this.selectedPoint;

            return {
                amount      : amount,
                Fundation_id: selectedFundation.id,
                Group_id    : selectedGroup.id,
                Period_id   : selectedPeriod.id,
                Point_id    : selectedPoint.id
            };
        },
        periodOptions() {
            return this.periods.map(period => {
                return { name: period.name, value: period };
            });
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

    .articles {
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
