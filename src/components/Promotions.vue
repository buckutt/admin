<template>
    <div class="promotions">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Promotions</h3>
            <div v-show="selectedPromotion.name" transition="fade">
                <h5>Modifier la promotion {{ selectedPromotion.name }}:</h5>
                <form v-on:submit.prevent>
                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input type="text" class="mdl-textfield__input" v-model="modPromotion.name">
                        <label for="nameMod" class="mdl-textfield__label">Nom</label>
                    </div>
                    <br />
                    <input type="submit" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" value="Modifier" @click="updatePromotion(selectedPromotion, modPromotion)">
                </form>
                <br />
                <h5>Prix:</h5>
                <form v-on:submit.prevent>
                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input type="text" class="mdl-textfield__input" v-model="amount">
                        <label for="amount" class="mdl-textfield__label">Montant</label>
                    </div>
                    <select v-model="selectedPoint">
                      <option v-for="point in points" v-bind:value="point">{{ point.name }}</option>
                    </select>
                    <select v-model="selectedFundation">
                      <option v-for="fundation in fundations" v-bind:value="fundation">{{ fundation.name }}</option>
                    </select>
                    <select v-model="selectedGroup">
                      <option v-for="group in groups" v-bind:value="group">{{ group.name }}</option>
                    </select>
                    <select v-model="selectedPeriod">
                      <option v-for="period in periods" v-bind:value="period">{{ period.name }}</option>
                    </select>
                    <input type="submit" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" value="Ajouter" @click="createPromotionPrice(selectedPromotion, inputPrice)">
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
                        <tr v-for="price in detailsPromotion.prices">
                            <td class="mdl-data-table__cell--non-numeric">{{ price.amount }}</td>
                            <td class="mdl-data-table__cell--non-numeric">{{ price.point.name }}</td>
                            <td class="mdl-data-table__cell--non-numeric">{{ price.fundation.name }}</td>
                            <td class="mdl-data-table__cell--non-numeric">{{ price.group.name }}</td>
                            <td class="mdl-data-table__cell--non-numeric">{{ price.period.name }}</td>
                            <td class="mdl-data-table__cell--non-numeric"><button id="show-dialog" type="button" class="mdl-button" @click="deletePrice(price)">Supprimer</button></td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <div class="setsManagement">
                    <div v-show="detailsPromotion.sets.length > 0">
                        <h5>Sets dans la promotion:</h5>
                        <button v-for="set in detailsPromotion.sets" track-by="$index" class="mdl-button" @click="searchSet(set)">{{ set.name }}</button>
                    </div>

                    <h5>Rechercher un set:</h5>
                    <form v-on:submit.prevent>
                        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                            <input type="text" v-model="setName" class="mdl-textfield__input">
                            <label for="setName" class="mdl-textfield__label">Nom</label>
                        </div>
                    </form>

                    <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp" v-show="setName.length > 0 && filteredSets.length > 0">
                        <thead>
                            <tr>
                                <th class="mdl-data-table__cell--non-numeric">Objet</th>
                                <th class="mdl-data-table__cell--non-numeric">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="set in filteredSets">
                                <td class="mdl-data-table__cell--non-numeric name">{{ set.name }}</td>
                                <td class="mdl-data-table__cell--non-numeric">
                                    <button type="button" class="mdl-button" @click="addSetToPromotion(set)">Ajouter</button>
                                    <button type="button" class="mdl-button" @click="removeSetFromPromotion(set)" v-show="isSetInPromotion(set)">Enlever</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="articlesManagement">
                    <div v-show="detailsPromotion.articles.length > 0">
                        <h5>Articles dans la promotion:</h5>
                        <button v-for="article in detailsPromotion.articles" track-by="$index" class="mdl-button" @click="search(article)">{{ article.name }}</button>
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
                                    <button type="button" class="mdl-button" @click="addToPromotion(article)">Ajouter</button>
                                    <button type="button" class="mdl-button" @click="removeFromPromotion(article)" v-show="isInPromotion(article)">Enlever</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <br />
                <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" @click="goBack()">Retour</button>
            </div>
            <div v-show="!selectedPromotion.name" transition="fade">
                <form v-on:submit.prevent>
                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input class="mdl-textfield__input" type="text" id="name" v-model="name">
                        <label class="mdl-textfield__label" for="name">Nom</label>
                    </div>
                    <br>
                    <input type="submit" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" @click="createPromotion(inputPromotion)" value="Créer">
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
                                <button type="button" class="mdl-button" @click="editPromotion(promotion)">Modifier</button>
                                <button type="button" class="mdl-button" @click="removePromotion(promotion)">Supprimer</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import { get, post, put, del } from '../lib/fetch';
import { createPromotion, updatePromotion, removePromotion } from '../store/actions';
import fuzzy from 'fuzzy';

export default {
    vuex: {
        getters: {
            promotions: state => state.app.promotions,
            points    : state => state.app.points,
            fundations: state => state.app.fundations,
            periods   : state => state.app.periods,
            groups    : state => state.app.groups,
            articles  : state => state.app.articles,
            sets      : state => state.app.sets
        },
        actions: {
            createPromotion: createPromotion,
            updatePromotion: updatePromotion,
            removePromotion: removePromotion
        }
    },

    data () {
        return {
            name             : '',
            selectedPromotion: {},
            modPromotion     : {},
            detailsPromotion : {},
            amount           : 0,
            selectedPeriod   : {},
            selectedGroup    : {},
            selectedFundation: {},
            selectedPoint    : {},
            articleName      : '',
            setName          : ''
        };
    },

    methods: {
        goBack() {
            this.selectedPromotion = {};
            this.modPromotion      = {};
        },
        search(article) {
            this.articleName = article.name;
        },
        searchSet(set) {
            this.setName = set.name;
        },
        isInPromotion(article) {
            let isInPromotion = false;
            if(this.detailsPromotion.articles.length > 0) {
                this.detailsPromotion.articles.forEach((a, i) => {
                    if(a.id == article.id) {
                        isInPromotion = true;
                    }
                });
            }
            return isInPromotion;
        },
        isSetInPromotion(set) {
            let isInPromotion = false;
            if(this.detailsPromotion.sets.length > 0) {
                this.detailsPromotion.sets.forEach((a, i) => {
                    if(a.id == set.id) {
                        isInPromotion = true;
                    }
                });
            }
            return isInPromotion;
        },
        editPromotion(promotion) {
            this.selectedPromotion = promotion;
            this.modPromotion      = JSON.parse(JSON.stringify(promotion));
            this.selectedPeriod    = this.$store.state.app.periods[0];
            this.selectedGroup     = this.$store.state.app.groups[0];
            this.selectedFundation = this.$store.state.app.fundations[0];
            this.selectedPoint     = this.$store.state.app.points[0];

            const embedPromotions = encodeURIComponent(JSON.stringify({
                prices: {
                    fundation: true,
                    group    : true,
                    period   : true,
                    point    : true
                },
                articles: true,
                sets: true
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
        addToPromotion(article) {
            post(`promotions/${this.selectedPromotion.id}/articles`, {id: article.id})
                .then(result => {
                    this.detailsPromotion.articles.push(article);
                });
        },
        removeFromPromotion(article) {
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
        addSetToPromotion(set) {
            post(`promotions/${this.selectedPromotion.id}/sets`, {id: set.id})
                .then(result => {
                    this.detailsPromotion.sets.push(set);
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
        }
    },

    computed: {
        filteredArticles() {
            let val           = this.articleName;
            let articlesNames = fuzzy.filter(val, this.articles, { extract: el => el.name });
            return articlesNames.map(article => {
                return article.original;
            });
        },
        filteredSets() {
            let val       = this.setName;
            let setsNames = fuzzy.filter(val, this.sets, { extract: el => el.name });
            return setsNames.map(set => {
                return set.original;
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
            const amount            = this.amount;
            const selectedFundation = this.selectedFundation;
            const selectedGroup     = this.selectedGroup;
            const selectedPeriod    = this.selectedPeriod;
            const selectedPoint     = this.selectedPoint;

            return {
                amount      : amount,
                Point_id    : selectedPoint.id,
                Fundation_id: selectedFundation.id,
                Group_id    : selectedGroup.id,
                Period_id   : selectedPeriod.id
            };
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

        .fade-transition {
            transition: opacity .4s ease;
        }

        .fade-enter {
            opacity: 0;
        }

        .fade-leave {
            display: none;
        }

        .articlesManagement {
            display:inline-block;
            width:47%;
        }

        .setsManagement {
            display:inline-block;
            width:47%;
            padding-right:5%;
        }
    }
</style>
