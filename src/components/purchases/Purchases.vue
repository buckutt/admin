<template>
    <div class="b-purchases b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <b-navbar :title="`Achats de ${currentEvent.name}`" :inCard="true"></b-navbar>
            <h4>Recherche</h4>
            <form @submit.prevent="filter()">
                <div>
                    <mdl-select label="Point" id="point-select" v-model="fields.point" :options="pointOptionsAll"></mdl-select>
                    <mdl-select label="Fondation" id="select-fundations" v-model="fields.fundation" :options="fundationOptionsAll" v-if="currentEvent.config.hasFundations"></mdl-select>
                </div>
                <div>
                    <div v-if="currentEvent.config.hasPeriods">
                        Recherche par:<br />
                        <mdl-radio v-model="dateChoice" class="mdl-js-ripple-effect" :val="0">Achats liés à une période en particulier</mdl-radio><br />
                        <mdl-radio v-model="dateChoice" class="mdl-js-ripple-effect" :val="1">Achats compris entre deux dates</mdl-radio>
                    </div>
                    <transition name="fade">
                        <div v-show="dateChoice == 1 || !currentEvent.config.hasPeriods">
                            <b-datetime-picker
                                v-model="fields.dateIn"
                                locale="fr"
                                header-format="DD MMM"
                                cancel="Annuler"
                                next="Suivant"
                                back="Retour"
                                pattern="\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}"
                                error="Le début n'est pas une date"
                                label="Début"
                                class="b--limitsize"></b-datetime-picker>
                            <b-datetime-picker
                                v-model="fields.dateOut"
                                locale="fr"
                                header-format="DD MMM"
                                cancel="Annuler"
                                next="Suivant"
                                back="Retour"
                                pattern="\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}"
                                error="La fin n'est pas une date"
                                label="Fin"
                                class="b--limitsize"></b-datetime-picker>
                        </div>
                    </transition>
                    <transition name="fade">
                        <div v-show="dateChoice == 0 && currentEvent.config.hasPeriods">
                            <mdl-select label="Periode" id="select-periods" v-model="fields.period" :options="periodOptionsAll"></mdl-select>
                        </div>
                    </transition>
                </div>
                <mdl-button colored raised>Rechercher</mdl-button>
            </form>

            <h4>Ventes <span class="small">(total TTC: {{ totalSell | price(true) }}, total HT: {{ totalSellWT | price(true) }})</span></h4>

            <b-table
                :headers="[
                    { title: 'Quantité', field: 'count' },
                    { title: 'Article', field: 'name'},
                    { title: 'Prix unitaire TTC', field: 'price', type: 'price' },
                    { title: 'Total TTC', field: 'totalVAT', type: 'price' },
                    { title: 'Total HT', field: 'totalWT', type: 'price' }
                ]"
                :data="purchases">
            </b-table>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import '../../lib/price';

const fieldsPattern = {
    point    : null,
    fundation: null,
    dateIn   : null,
    dateOut  : null,
    period   : null
};

export default {
    data() {
        return {
            fields    : Object.assign({}, fieldsPattern),
            dateChoice: '0'
        };
    },

    computed: {
        ...mapState({
            purchases   : state => state.objects.purchases,
            currentEvent: state => state.app.currentEvent
        }),
        ...mapGetters([
            'periodOptions',
            'pointOptions',
            'fundationOptions'
        ]),
        totalSell() {
            let sum = 0;

            this.purchases.forEach((purchase) => {
                sum += purchase.totalVAT;
            });

            return sum;
        },
        totalSellWT() {
            let sum = 0;

            this.purchases.forEach((purchase) => {
                sum += purchase.totalWT;
            });

            return sum;
        },
        periodOptionsAll() {
            const periods = Object.assign([], this.periodOptions);
            periods.unshift({ name: 'Toutes', value: null });
            return periods;
        },
        pointOptionsAll() {
            const points = Object.assign([], this.pointOptions);
            points.unshift({ name: 'Tous', value: null });
            return points;
        },
        fundationOptionsAll() {
            const fundations = Object.assign([], this.fundationOptions);
            fundations.unshift({ name: 'Toutes', value: null });
            return fundations;
        }
    },

    methods: {
        ...mapActions([
            'getPurchases',
            'showClientError'
        ]),
        filter() {
            const inputFields = JSON.parse(JSON.stringify(this.fields));
            let isFilled      = false;

            Object.keys(inputFields).forEach((key) => {
                if (inputFields[key]) {
                    isFilled = true;
                }
            });

            if (!isFilled
                || (inputFields.dateIn && !inputFields.dateOut)
                || (!inputFields.dateIn && inputFields.dateOut)) {
                return this.showClientError({ message: 'You need at least one filter.' });
            }

            this.fields       = Object.assign({}, fieldsPattern);
            inputFields.event = this.currentEvent.id;

            this.getPurchases(inputFields);
        }
    }
};
</script>
