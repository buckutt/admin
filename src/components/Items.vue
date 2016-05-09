<template>
    <div class="articles">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Articles</h3>
            <div v-show="selectedArticle.name">
                Modifier l'article {{ selectedArticle.name }}:<br />
                <form v-on:submit.prevent>
                    <label for="nameMod">Nom</label> <input type="text" v-model="modArticle.name"><br />
                    <label for="stock">Stock</label> <input type="text" v-model="modArticle.stock"><br />
                    <label for="alcohol">Alcool</label> <input type="text" v-model="modArticle.alcohol"><br />
                    <label for="vat">TVA</label> <input type="text" v-model="modArticle.vat"><br />
                    <input type="submit" value="Modifier" @click="updateArticle(selectedArticle, modArticle)">
                </form>
                <br />
                Points:
                <form v-on:submit.prevent>
                    <select v-model="selectedPoint">
                      <option v-for="point in points" v-bind:value="point">{{ point.name }}</option>
                    </select>
                    <input type="submit" value="Ajouter" @click="createArticlePoint(selectedArticle, selectedPoint)">
                </form>
                <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                    <thead>
                        <tr>
                            <th class="mdl-data-table__cell--non-numeric">Point</th>
                            <th class="mdl-data-table__cell--non-numeric">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="point in detailsArticle.points">
                            <td class="mdl-data-table__cell--non-numeric">{{ point.name }}</td>
                            <td class="mdl-data-table__cell--non-numeric"><button id="show-dialog" type="button" class="mdl-button" @click="deleteArticlePoint(selectedArticle, point)">Supprimer</button></td>
                        </tr>
                    </tbody>
                </table>
                <br />
                Prices:
                <form v-on:submit.prevent>
                    Montant: <input type="text" v-model="amount">
                    <select v-model="selectedFundation">
                      <option v-for="fundation in fundations" v-bind:value="fundation">{{ fundation.name }}</option>
                    </select>
                    <select v-model="selectedGroup">
                      <option v-for="group in groups" v-bind:value="group">{{ group.name }}</option>
                    </select>
                    <select v-model="selectedPeriod">
                      <option v-for="period in periods" v-bind:value="period">{{ period.name }}</option>
                    </select>
                    <input type="submit" value="Ajouter" @click="createArticlePrice(selectedArticle, inputPrice)">
                </form>

                <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                    <thead>
                        <tr>
                            <th class="mdl-data-table__cell--non-numeric">Montant</th>
                            <th class="mdl-data-table__cell--non-numeric">Fondation</th>
                            <th class="mdl-data-table__cell--non-numeric">Groupe</th>
                            <th class="mdl-data-table__cell--non-numeric">Période</th>
                            <th class="mdl-data-table__cell--non-numeric">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="price in detailsArticle.prices">
                            <td class="mdl-data-table__cell--non-numeric">{{ price.amount }}</td>
                            <td class="mdl-data-table__cell--non-numeric">{{ price.fundation.name }}</td>
                            <td class="mdl-data-table__cell--non-numeric">{{ price.group.name }}</td>
                            <td class="mdl-data-table__cell--non-numeric">{{ price.period.name }}</td>
                            <td class="mdl-data-table__cell--non-numeric"><button id="show-dialog" type="button" class="mdl-button" @click="editPrice(price)">Modifier</button><button id="show-dialog" type="button" class="mdl-button" @click="deletePrice(price)">Supprimer</button></td>
                        </tr>
                    </tbody>
                </table>
                <button @click="goBack()">Retour</button>
            </div>
            <div v-show="!selectedArticle.name">
                Ajouter un article:<br />
                <form v-on:submit.prevent>
                    <input type="text" v-model="nameAdd"> <input type="submit" value="Créer" @click="createArticle(inputArticle)">
                </form>

                Rechercher un article:<br />
                <form v-on:submit.prevent>
                    <input type="text" v-model="name">
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
                            <td class="mdl-data-table__cell--non-numeric"><button id="show-dialog" type="button" class="mdl-button" @click="editArticle(article)">Modifier</button><button id="show-dialog" type="button" class="mdl-button" @click="removeArticle(article)">Supprimer</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="modal modal__bg" v-modal="openEditModal" v-el:editmodal>
        <div class="modal__dialog">
            <div class="modal__header">
                <h3>Modifier le prix</h3>
            </div>
            <form v-on:submit.prevent>
                <div class="modal__body">
                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input class="mdl-textfield__input" type="text" id="name" v-model="modPrice.amount">
                        <label class="mdl-textfield__label" for="name">Montant</label>
                    </div>

                    <select v-model="modPrice.fundation">
                      <option v-for="fundation in fundations" v-bind:value="fundation">{{ fundation.name }}</option>
                    </select>

                    <select v-model="modPrice.group">
                      <option v-for="group in groups" v-bind:value="group">{{ group.name }}</option>
                    </select>

                    <select v-model="modPrice.period">
                      <option v-for="period in periods" v-bind:value="period">{{ period.name }}</option>
                    </select>
                </div>
                <div class="modal__footer">
                    <input type="submit" class="mdl-button modal__close" @click="updatePrice(selectedPrice, modPrice)" value="Valider">
                    <button type="button" class="mdl-button modal__close" @click="closeModal()">Annuler</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { get, post, put, del } from '../lib/fetch';
import { createArticle, updateArticle, removeArticle } from '../store/actions';
import fuzzy from 'fuzzy';
import modal from '../lib/modal';

export default {
    vuex: {
        getters: {
            articles: state => state.app.articles,
            points: state => state.app.points,
            fundations: state => state.app.fundations,
            periods: state => state.app.periods,
            groups: state => state.app.groups
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
            selectedPrice    : {},
            modPrice         : {},
            amount           : 0,
            selectedPeriod   : {},
            selectedGroup    : {},
            selectedFundation: {},
            openEditModal    : false
        };
    },
    methods: {
        editArticle(article) {
            this.selectedArticle = article;
            this.modArticle = JSON.parse(JSON.stringify(article));
            this.selectedPoint = this.$store.state.app.points[0];
            this.selectedPeriod = this.$store.state.app.periods[0];
            this.selectedGroup = this.$store.state.app.groups[0];
            this.selectedFundation = this.$store.state.app.fundations[0];

            const embedArticles = encodeURIComponent(JSON.stringify({
                prices: {
                    fundation: true,
                    group    : true,
                    period   : true
                },
                points: true
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
        editPrice(price) {
            this.selectedPrice = price;
            this.modPrice      = JSON.parse(JSON.stringify(price));
            this.openEditModal = true;
        },
        closeModal() {
            this.openEditModal = false;
        },
        updatePrice(selectedPrice, modPrice) {
            modPrice.Fundation_id = modPrice.fundation.id;
            modPrice.Group_id     = modPrice.group.id;
            modPrice.Period_id    = modPrice.period.id;
            put(`prices/${selectedPrice.id}`, modPrice)
                .then(result => {
                    this.detailsArticle.prices.forEach((p, i) => {
                        if (p.id === result.id) { 
                            this.detailsArticle.prices[i] = Object.assign(this.detailsArticle.prices[i], result);
                        }
                    });
                });
            this.closeModal();
            this.modPrice = {};
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
                period   : true
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
            let articlesNames = fuzzy.filter(val, this.articles, { extract: function(el) { return el.name; }});
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

            return {
                amount      : amount,
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
        }
    }
</style>
