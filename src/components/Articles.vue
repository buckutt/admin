<template>
    <div class="b-articles">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Articles</h3>
            <transition name="fade" @after-enter="displayImage">
                <div v-if="modObject">
                    <div class="b-articles-container">
                        <div>
                            <h5>Modifier l'article {{ modObject.name }}</h5>
                            <form @submit.prevent="updateObject({ route: 'articles', value: modObject })">
                                <mdl-textfield floating-label="Nom" :value="modObject.name" @input="updateModObject({ field:'name', value: $event })"  required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield>
                                <mdl-textfield floating-label="Stock" :value="modObject.stock" @input="updateModObject({ field:'stock', value: $event })"></mdl-textfield><br />
                                <mdl-textfield floating-label="Alcool" :value="modObject.alcohol" @input="updateModObject({ field:'alcohol', value: $event })"></mdl-textfield>
                                <mdl-textfield floating-label="TVA" :value="modObject.vat" @input="updateModObject({ field:'vat', value: $event })"></mdl-textfield><br />
                                <mdl-button colored raised>Modifier</mdl-button>
                            </form>
                        </div>
                        <div>
                            <h5>Image</h5>
                            <form>
                                <div class="b-articles-container-preview">
                                    <img :src="image" :alt="modObject.name" v-show="image" class="b-articles-container-preview__image" />
                                    <div class="b-articles-container-preview__image" v-show="!image"></div>
                                    <mdl-tooltip target="add-button">Parcourir</mdl-tooltip>
                                    <mdl-button id="add-button" fab colored
                                        class="b-articles-container-preview__add mdl-js-ripple-effect">
                                      <i class="material-icons">attach_file</i>
                                      <input type="file" @change="onImageChange" accept="image/*" />
                                    </mdl-button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <br />
                    <h5>Prix</h5>
                    <form @submit.prevent="createArticlePrice(modObject, inputPrice())">
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
                                    <td class="mdl-data-table__cell--non-numeric">
                                        <b-confirm :func="() => { removeObject({ route: 'prices', value: price }) }">Supprimer</b-confirm>
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
                    <h5>Ajouter un article</h5>
                    <form @submit.prevent="createObject({ route: 'articles', value: inputArticle() })">
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
                                        <b-confirm :func="() => { removeObject({ route: 'articles', value: article }) }">Supprimer</b-confirm>
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
    data() {
        return {
            name      : '',
            image     : '',
            newArticle: Object.assign({}, articlePattern),
            newPrice  : Object.assign({}, pricePattern)
        };
    },

    methods: {
        ...mapActions([
            'createObject',
            'updateObject',
            'removeObject',
            'expandObject',
            'createMultipleRelation',
            'updateModObject',
            'showClientError'
        ]),
        onImageChange(event) {
            const file   = event.target.files[0];
            const reader = new FileReader();
            const vm     = this;

            reader.addEventListener('load', () => {
                vm.image = reader.result;
                vm.updateModObject({ field: 'image', value: reader.result });
                vm.updateObject({ route: 'articles', value: vm.modObject });
            });

            if (file) {
                reader.readAsDataURL(file);
            }
        },
        displayImage() {
            this.image = this.modObject.image;
        },
        expandArticle(article) {
            this.$router.push(`/articles/${article.id}`);
            this.image = '';

            this.expandObject({
                route: 'articles',
                value: article
            });
        },
        createArticlePrice(article, price) {
            if (!price.Fundation_id || !price.Period_id || !price.Group_id || !price.Point_id) {
                return this.showClientError({ message: 'Un des champs a mal été renseigné.' });
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
        },
        inputArticle() {
            const inputArticle = Object.assign({}, this.newArticle);
            this.newArticle    = Object.assign({}, articlePattern);
            this.name          = inputArticle.name;

            return inputArticle;
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
            points      : state => state.objects.points,
            fundations  : state => state.objects.fundations,
            periods     : state => state.objects.periods,
            groups      : state => state.objects.groups,
            currentEvent: state => state.app.currentEvent,
            modObject   : state => state.app.modObject,
            params      : state => state.route.params
        }),
        filteredArticles() {
            const val           = this.name;
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
            this.expandArticle({ id: this.params.id });
        }
    }
};
</script>

<style lang="scss">
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

    .b-articles-container {
        display: flex;
        flex-wrap: wrap;

        > div:first-child {
            margin-right: 50px;
        }

        > div:last-child {
            input[type="file"] {
                cursor: pointer;
                height: 100%;
                right: 0;
                opacity: 0;
                position: absolute;
                top: 0;
                width: 100%;
                z-index: 4;
            }
        }
    }

    .b-articles-container-preview {
        background-image: url('../assets/placeholder.jpg');
        background-repeat: no-repeat;
        width: 150px;
        height: 150px;
        box-shadow: 0 0 2px rgba(#222, 0.25),
                    0 2px 3px rgba(#222, 0.25);
        border-radius: 2px;
    }

    .b-articles-container-preview__image {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .b-articles-container-preview__add {
        position: relative;
        top: -35px;
        left: 115px;
    }
</style>
