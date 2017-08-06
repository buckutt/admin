<template>
    <div>
        <h5>Prix de la promotion</h5>
        <form @submit.prevent="createPromotionPrice(modObject, newPrice)">
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
        createPromotionPrice(promotion, price) {
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
                    route: 'promotions',
                    value: promotion
                },
                relation: {
                    route : 'prices',
                    fields: price
                }
            })
                .then(() => {
                    this.newPrice = Object.assign({}, pricePattern);
                    this.notify({ message: 'Le prix a bien été ajouté à la promotion' });
                })
                .catch(err => this.notifyError({
                    message: 'Le prix n\'a pas pu être ajouté à la promotion',
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
                { title: 'Montant TTC', field: 'amount', type: 'price' },
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
                    if (price.Fundation_id !== this.currentEvent.DefaultFundation_id
                        && !this.currentEvent.config.hasFundations) {
                        price.warning = 'Une fondation autre que<br />celle par défaut est utilisée.';
                    }

                    if (price.Group_id !== this.currentEvent.DefaultGroup_id
                        && !this.currentEvent.config.hasGroups) {
                        price.warning = 'Un groupe autre que<br />celui par défaut est utilisé.';
                    }

                    if (price.Period_id !== this.currentEvent.DefaultPeriod_id
                        && !this.currentEvent.config.hasPeriods) {
                        price.warning = 'Une période autre que<br />celle par défaut est utilisée.';
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
