<template>
    <div>
        <h5>Prix de l'article</h5>
        <form @submit.prevent="createArticlePrice(modObject, newPrice)">
            <mdl-textfield floating-label="Montant TTC (centimes)" v-model="newPrice.amount" required="required" pattern="[0-9]+" error="Le montant doit être un entier"></mdl-textfield>
            <mdl-select label="Point" id="point-select" v-model="newPrice.point" :options="pointOptions"></mdl-select>
            <mdl-select label="Fondation" id="fundation-select" v-model="newPrice.fundation" :options="fundationOptions" v-if="currentEvent.config.hasFundations"></mdl-select><br />
            <mdl-select label="Groupe" id="group-select" v-model="newPrice.group" :options="groupOptions" v-if="currentEvent.config.hasGroups"></mdl-select>
            <mdl-select label="Période" id="period-select" v-model="newPrice.period" :options="periodOptions" v-if="currentEvent.config.hasPeriods"></mdl-select><br />
            <mdl-button colored raised :disabled="disabledAdd">Ajouter</mdl-button>
        </form>
        <br />
        <b-table
            :headers="displayedColumns"
            :data="displayedPrices"
            :actions="[
                { action: 'remove', text: 'Supprimer', type: 'confirm' }
            ]"
            route="prices"
            :paging="5"
            @remove="removeObject">
        </b-table>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import { parsePrice } from '../../../lib/price';

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
            newPrice: Object.assign({}, pricePattern)
        };
    },

    methods: {
        ...mapActions([
            'removeObject',
            'createMultipleRelation',
            'notify',
            'notifyError'
        ]),
        createArticlePrice(article, price) {
            price.fundation = (this.currentEvent.config.hasFundations) ?
                price.fundation : this.currentEvent.defaultFundation;
            price.group     = (this.currentEvent.config.hasGroups) ? price.group : this.currentEvent.defaultGroup;
            price.period    = (this.currentEvent.config.hasPeriods) ? price.period : this.currentEvent.defaultPeriod;

            price.Fundation_id = price.fundation.id;
            price.Group_id     = price.group.id;
            price.Period_id    = price.period.id;
            price.Point_id     = price.point.id;
            delete price.fundation;
            delete price.group;
            delete price.period;
            delete price.point;

            this.createMultipleRelation({
                obj: {
                    route: 'articles',
                    value: article
                },
                relation: {
                    route : 'prices',
                    fields: price
                }
            })
                .then(() => {
                    this.newPrice = Object.assign({}, pricePattern);
                    this.notify({ message: 'Le prix a bien été ajouté à l\'article' });
                })
                .catch(err => this.notifyError({
                    message: 'Le prix n\'a pas pu être ajouté à l\'article',
                    full   : err
                }));
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
        displayedColumns() {
            const columns = [
                { title: 'Montant', field: 'displayedPrice' },
                { title: 'Point', field: 'point.name' }
            ];

            if (this.currentEvent.config.hasFundations) {
                columns.push({ title: 'Fondation', field: 'fundation.name' });
            }
            if (this.currentEvent.config.hasGroups) {
                columns.push({ title: 'Groupe', field: 'group.name' });
            }
            if (this.currentEvent.config.hasPeriods) {
                columns.push({ title: 'Période', field: 'period.name' });
            }

            return columns;
        },
        displayedPrices() {
            return (!this.modObject) ? [] : this.modObject.prices
                .filter(price => (price.period.Event_id === this.currentEvent.id))
                .map((price) => {
                    price.wt             = price.amount / (1 + (this.modObject.vat / 100));
                    price.displayedPrice = `${parsePrice(price.amount, true)} TTC`;
                    if (price.amount !== price.wt) {
                        price.displayedPrice += ` (${parsePrice(price.wt, true)} HT)`;
                    }
                    return price;
                });
        },
        disabledAdd() {
            return ((!this.newPrice.fundation && this.currentEvent.config.hasFundations)
                || (!this.newPrice.period && this.currentEvent.config.hasPeriods)
                || (!this.newPrice.group && this.currentEvent.config.hasGroups)
                || !this.newPrice.point);
        }
    }
};
</script>
