<template>
    <div class="b-articles">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Articles</h3>
            <transition name="fade">
                <div v-if="modObject">
                    <h5>Modifier l'article {{ modObject.name }}</h5>
                    <form @submit.prevent="updateObject({ route: 'articles', value: modObject })">
                        <mdl-textfield floating-label="Nom" :value="modObject.name" @input="updateModObject({ field:'name', value: $event })"  required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield>
                        <mdl-textfield floating-label="Stock" :value="modObject.stock" @input="updateModObject({ field:'stock', value: $event })"></mdl-textfield><br />
                        <mdl-textfield floating-label="Alcool" :value="modObject.alcohol" @input="updateModObject({ field:'alcohol', value: $event })"></mdl-textfield>
                        <mdl-textfield floating-label="TVA" :value="modObject.vat" @input="updateModObject({ field:'vat', value: $event })"></mdl-textfield><br />
                        <mdl-button colored raised>Modifier</mdl-button>
                    </form>
                    <br />
                    <h5>Prix</h5>
                    <form @submit.prevent="createArticlePrice(modObject, inputPrice)">
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
                                <tr v-for="price in modObject.prices" v-if="price.period.Event_id == currentEvent.id">
                                    <td class="mdl-data-table__cell--non-numeric">{{ price.amount | price(true) }} TTC <span v-if="modObject.vat > 0">({{ price.amount/(1+modObject.vat/100) | price(true) }} HT)</span></td>
                                    <td class="mdl-data-table__cell--non-numeric">{{ price.point.name }}</td>
                                    <td class="mdl-data-table__cell--non-numeric">{{ price.fundation.name }}</td>
                                    <td class="mdl-data-table__cell--non-numeric">{{ price.group.name }}</td>
                                    <td class="mdl-data-table__cell--non-numeric">{{ price.period.name }}</td>
                                    <td class="mdl-data-table__cell--non-numeric"><mdl-button raised accent @click.native="$root.confirm() && removeObject({ route: 'prices', value: price })">Supprimer</mdl-button></td>
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
                    <h5>Ajouter un article</h5>
                    <form @submit.prevent="createObject({ route: 'articles', value: inputArticle })">
                        <mdl-textfield floating-label="Nom" v-model="newArticle.name" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield>
                        <mdl-button colored raised>Créer</mdl-button>
                    </form>

                    <h5>Rechercher un article</h5>
                    <form @submit.prevent>
                        <mdl-textfield floating-label="Nom" v-model="name"></mdl-textfield>
                    </form>

                    <div class="b-responsive-table">
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
                                    <td class="mdl-data-table__cell--non-numeric b-actions-cell">
                                        <mdl-button raised colored @click.native="expandArticle(article)">Modifier</mdl-button>
                                        <mdl-button raised accent @click.native="$root.confirm() && removeObject({ route: 'articles', value: article })">Supprimer</mdl-button></td>
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
import price from '../lib/price';
import { mapState, mapActions } from 'vuex';
import fuzzy from 'fuzzy';

const articlePattern = {
    name   : '',
    stock  : 0,
    vat    : 0,
    alcohol: 0
};

const pricePattern = {
    amount   : 0,
    period   : null,
    group    : null,
    fundation: null,
    point    : null
};

export default {
    data () {
        return {
            name      : '',
            newArticle: JSON.parse(JSON.stringify(articlePattern)),
            newPrice  : JSON.parse(JSON.stringify(pricePattern))
        };
    },

    methods: {
        ...mapActions([
            'createObject',
            'updateObject',
            'removeObject',
            'expandObject',
            'createMultipleRelation',
            'updateModObject'
        ]),
        expandArticle(article) {
            this.$router.push(`/articles/${article.id}`);

            this.expandObject({
                route: 'articles',
                value: article
            });
        },
        createArticlePrice(article, price) {
            if (!price.Fundation_id || !price.Period_id || !price.Group_id || !price.Point_id) {
                return this.$root.$emit('snackfilter', {
                    message: 'Un des champs a mal été renseigné.'
                });
            }

            this.createMultipleRelation({
                obj: {
                    route: 'articles',
                    value: article
                },
                relation: {
                    route : 'prices',
                    fields: price
                }
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
            currentEvent: state => state.global.currentEvent,
            modObject   : state => state.app.modObject,
            params      : state => state.route.params
        }),
        filteredArticles() {
            let val           = this.name;
            let articlesNames = fuzzy.filter(val, this.articles, { extract: el => el.name });
            return articlesNames.map(article => {
                return article.original;
            });
        },
        inputArticle() {
            const inputArticle = JSON.parse(JSON.stringify(this.newArticle));
            this.newArticle    = JSON.parse(JSON.stringify(articlePattern));
            this.name          = inputArticle.name;

            return inputArticle;
        },
        inputPrice() {
            const price   = JSON.parse(JSON.stringify(this.newPrice));
            this.newPrice = JSON.parse(JSON.stringify(pricePattern));

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
        },
        periodOptions() {
            return this.periods.map(period => {
                if (period.Event_id == this.currentEvent.id) {
                    return { name: period.name, value: period };
                } else {
                    return null;
                }
            }).filter(a => a);
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
    },

    mounted() {
        if (this.params.id) {
            this.expandArticle({ id: this.params.id });
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
    }
</style>
