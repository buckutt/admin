<template>
    <div class="b-articles b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Articles</h3>
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
                    <b-uploader :initialImage="modObject.image" :name="modObject.name" @change="updateImage"></b-uploader>
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
            <b-table
                :headers="[
                    { title: 'Montant', field: 'displayedPrice' },
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
            <mdl-button colored raised @click.native="$root.goBack()">Retour</mdl-button>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import { parsePrice } from '../../lib/price';
import ImageUploader  from '../ImageUploader.vue';

const pricePattern = {
    amount   : 0,
    period   : null,
    group    : null,
    fundation: null,
    point    : null
};

export default {
    components: {
        'b-uploader': ImageUploader
    },

    data() {
        return {
            newPrice: Object.assign({}, pricePattern)
        };
    },

    methods: {
        ...mapActions([
            'updateObject',
            'removeObject',
            'createMultipleRelation',
            'updateModObject',
            'showClientError'
        ]),
        updateImage(image) {
            this.updateModObject({ field: 'image', value: image });
            this.updateObject({ route: 'articles', value: this.modObject });
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
            currentEvent: state => state.app.currentEvent,
            modObject   : state => state.app.modObject
        }),
        ...mapGetters([
            'groupOptions',
            'periodOptions',
            'pointOptions',
            'fundationOptions'
        ]),
        displayedPrices() {
            if (!this.modObject) {
                return [];
            }

            return this.modObject.prices.map((price) => {
                if (price.period.Event_id === this.currentEvent.id) {
                    price.wt             = price.amount / (1 + (this.modObject.vat / 100));
                    price.displayedPrice = `${parsePrice(price.amount, true)} TTC`;
                    if (price.amount !== price.wt) {
                        price.displayedPrice += ` (${parsePrice(price.wt, true)} HT)`;
                    }
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

    .b-articles-container {
        display: flex;
        flex-wrap: wrap;

        > div:first-child {
            margin-right: 50px;
        }
    }
</style>
