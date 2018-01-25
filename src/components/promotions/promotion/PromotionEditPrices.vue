<template>
    <div>
        <h5>Prix de la formule</h5>
        <form @submit.prevent="createPromotionPrice(modObject, newPrice)">
            <mdl-textfield floating-label="Montant TTC (centimes)" v-model="newPrice.amount" required="required" pattern="[0-9]+" error="Le montant doit être un entier"></mdl-textfield>
            <b-inputselect label="Point" id="point-select" :options="pointOptions" v-model="newPrice.point"></b-inputselect>
            <b-inputselect label="Fondation" id="fundation-select" :options="fundationOptions" v-model="newPrice.fundation" v-if="currentEvent.useFundations"></b-inputselect><br />
            <b-inputselect label="Groupe" id="group-select" :options="groupOptions" v-model="newPrice.group" v-if="currentEvent.useGroups"></b-inputselect>
            <b-inputselect label="Période" id="period-select" :options="currentPeriodOptions" :fullOptions="periodOptions" v-model="newPrice.period" v-if="currentEvent.usePeriods"></b-inputselect><br />
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
            'createObject',
            'notify',
            'notifyError'
        ]),

        createPromotionPrice(promotion, price) {
            price.fundation = (this.currentEvent.useFundations)
                ? price.fundation
                : this.currentEvent.defaultFundation;

            price.group = (this.currentEvent.useGroups)
                ? price.group
                : this.currentEvent.defaultGroup;

            price.period = (this.currentEvent.usePeriods)
                ? price.period
                : this.currentEvent.defaultPeriod;

            price.fundation_id = price.fundation.id;
            price.group_id     = price.group.id;
            price.period_id    = price.period.id;
            price.point_id     = price.point.id;
            price.promotion_id = promotion.id;

            delete price.fundation;
            delete price.group;
            delete price.period;
            delete price.point;

            this
                .createObject({
                    route: 'prices',
                    value: price
                })
                .then(() => {
                    this.newPrice = Object.assign({}, pricePattern);
                    this.notify({ message: 'Le prix a bien été ajouté à la formule' });
                })
                .catch(err => this.notifyError({
                    message: 'Le prix n\'a pas pu être ajouté à la formule',
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
            'currentPeriodOptions',
            'pointOptions',
            'fundationOptions'
        ]),

        displayedColumns() {
            const columns = [
                { title: 'Montant TTC', field: 'amount', type: 'price' },
                { title: 'Point', field: 'point.name' }
            ];

            if (this.currentEvent.useFundations) {
                columns.push({ title: 'Fondation', field: 'fundation.name' });
            }

            if (this.currentEvent.useGroups) {
                columns.push({ title: 'Groupe', field: 'group.name' });
            }

            if (this.currentEvent.usePeriods) {
                columns.push({ title: 'Période', field: 'period.name' });
            }

            return columns;
        },

        displayedPrices() {
            return (!this.modObject) ? [] : this.modObject.prices
                .filter(price => price.period.event_id === this.currentEvent.id)
                .map((price) => {
                    if (price.fundation_id !== this.currentEvent.defaultFundation_id
                        && !this.currentEvent.useFundations) {
                        price.warning = 'Une fondation autre que<br />celle par défaut est utilisée.';
                    }

                    if (price.group_id !== this.currentEvent.defaultGroup_id
                        && !this.currentEvent.useGroups) {
                        price.warning = 'Un groupe autre que<br />celui par défaut est utilisé.';
                    }

                    if (price.period_id !== this.currentEvent.defaultPeriod_id
                        && !this.currentEvent.usePeriods) {
                        price.warning = 'Une période autre que<br />celle par défaut est utilisée.';
                    }

                    return price;
                });
        },

        disabledAdd() {
            return ((!this.newPrice.fundation && this.currentEvent.useFundations)
                || (!this.newPrice.period && this.currentEvent.usePeriods)
                || (!this.newPrice.group && this.currentEvent.useGroups)
                || !this.newPrice.point);
        }
    }
};
</script>
