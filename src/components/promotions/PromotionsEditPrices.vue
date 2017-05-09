<template>
    <div>
        <h5>Prix de la promotion</h5>
        <form @submit.prevent="createPromotionPrice(modObject, newPrice)">
            <mdl-textfield floating-label="Montant TTC (centimes)" v-model="newPrice.amount" required="required" pattern="[0-9]+" error="Le montant doit être un entier"></mdl-textfield>
            <mdl-select label="Point" id="point-select" v-model="newPrice.point" :options="pointOptions"></mdl-select>
            <mdl-select label="Fondation" id="fundation-select" v-model="newPrice.fundation" :options="fundationOptions"></mdl-select><br />
            <mdl-select label="Groupe" id="group-select" v-model="newPrice.group" :options="groupOptions"></mdl-select>
            <mdl-select label="Période" id="period-select" v-model="newPrice.period" :options="periodOptions"></mdl-select><br />
            <mdl-button colored raised :disabled="disabledAdd">Ajouter</mdl-button>
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
            'createMultipleRelation'
        ]),
        createPromotionPrice(promotion, price) {
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
                    route: 'promotions',
                    value: promotion
                },
                relation: {
                    route : 'prices',
                    fields: price
                }
            });

            this.newPrice = Object.assign({}, pricePattern);
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
        },
        disabledAdd() {
            return (!this.newPrice.fundation || !this.newPrice.period || !this.newPrice.group || !this.newPrice.point);
        }
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';
</style>
