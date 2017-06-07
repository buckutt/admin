<template>
    <div>
        <h5>Détails de l'article</h5>
        <div class="b-article-top">
            <div class="b-article-preview">
                <img :src="modObject.image" :alt="modObject.name" v-show="modObject.image" class="b-article-preview__image" />
                <div class="b-article-preview__image" v-show="!modObject.image"></div>
            </div>
            <b-list :elements="elements" :columns="2" class="b-article-top__fill"></b-list>
        </div>

        <template v-for="pricePerPoint in prices">
            <h5>Prix de l'article sur le point {{ pricePerPoint.point }}</h5>
            <b-list :elements="pricePerPoint.prices" :columns="3"></b-list>
        </template>
    </div>
</template>

<script>
import groupBy      from 'lodash.groupby';
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState({
            modObject   : state => state.app.modObject,
            currentEvent: state => state.app.currentEvent
        }),
        elements() {
            return [
                {
                    icon   : 'keyboard_arrow_right',
                    title  : 'Nom',
                    content: this.modObject.name
                },
                {
                    icon   : 'local_drink',
                    title  : 'Unités alcool',
                    content: (this.modObject.alcohol > 0) ?
                        this.modObject.alcohol :
                        'Non définie'
                },
                {
                    icon   : 'inbox',
                    title  : 'Stock',
                    content: this.modObject.stock
                },
                {
                    icon   : 'account_balance',
                    title  : 'TVA',
                    content: (this.modObject.vat > 0) ?
                        this.modObject.vat :
                        'Non définie'
                }
            ];
        },
        filteredPrices() {
            return (!this.modObject) ? [] : this.modObject.prices
                .filter(price => (price.period.Event_id === this.currentEvent.id));
        },
        prices() {
            const prices        = [];
            const groupedPrices = groupBy(this.filteredPrices, 'point.id');

            Object.keys(groupedPrices).forEach((key) => {
                const pricePerPoint = { point: groupedPrices[key][0].point.name, prices: [] };

                groupedPrices[key].forEach(price => pricePerPoint.prices.push({
                    icon : 'attach_money',
                    type : 'price',
                    title: (this.currentEvent.config.hasPeriods) ?
                       `Période ${price.period.name}` :
                       undefined,
                    content: price.amount
                }));

                prices.push(pricePerPoint);
            });

            return prices;
        }
    }
};
</script>

<style lang="scss">
    .b-article-top {
        display: flex;
        flex-wrap: wrap;

        .b-article-top__fill {
            flex-grow: 1;
        }
    }

    .b-article-preview {
        background-image: url('../../../assets/placeholder.jpg');
        background-repeat: no-repeat;
        width: 150px;
        height: 150px;
        min-width: 150px;
        min-height: 150px;
        box-shadow: 0 0 2px rgba(#222, 0.25),
                    0 2px 3px rgba(#222, 0.25);
        border-radius: 2px;
        margin-right: 20px;

        > .b-article-preview__image {
            position: relative;
            width: 100%;
            height: 100%;
        }
    }
</style>
