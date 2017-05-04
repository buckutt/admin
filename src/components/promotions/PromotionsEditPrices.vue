<template>
    <div>
        <h5>Prix de la promotion</h5>
        <form v-on:submit.prevent="createPromotionPrice(modObject, inputPrice())">
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
                { title: 'Montant TTC', field: 'amount', type: 'price' },
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
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';

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
            'showClientError'
        ]),
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
            return (!this.modObject) ? [] : this.modObject.prices
                .filter(price => (price.period.Event_id === this.currentEvent.id));
        }
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';
</style>
