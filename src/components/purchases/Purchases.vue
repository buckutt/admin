<template>
    <div class="b-purchases b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <b-navbar :title="`Achats de ${currentEvent.name}`" :inCard="true"></b-navbar>
            <h4>Recherche</h4>
            <form @submit.prevent="filter()">
                <div>
                    <b-inputselect label="Point" id="point-select" :options="pointOptionsAll" v-model="fields.point"></b-inputselect>
                    <b-inputselect label="Fondation" id="fundation-select" :options="fundationOptionsAll" v-model="fields.fundation" v-if="currentEvent.config.hasFundations"></b-inputselect>
                </div>
                <div>
                    <div v-if="currentEvent.config.hasPeriods">
                        Recherche par:<br />
                        <mdl-radio v-model="dateChoice" class="mdl-js-ripple-effect" :val="0">Achats liés à une période en particulier</mdl-radio><br />
                        <mdl-radio v-model="dateChoice" class="mdl-js-ripple-effect" :val="1">Achats compris entre deux dates</mdl-radio>
                    </div>
                    <transition name="fade">
                        <div v-show="dateChoice === 1 || !currentEvent.config.hasPeriods">
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
                        <div v-show="dateChoice === 0 && currentEvent.config.hasPeriods">
                            <b-inputselect label="Période" id="period-select" :options="currentPeriodOptionsAll" :fullOptions="periodOptionsAll" v-model="fields.period"></b-inputselect>
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
                    { title: 'Total TTC', field: 'totalTI', type: 'price' },
                    { title: 'Total HT', field: 'totalWT', type: 'price' }
                ]"
                :data="displayedPurchases">
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
            dateChoice: 0
        };
    },

    computed: {
        ...mapState({
            purchases   : state => state.objects.purchases,
            currentEvent: state => state.app.currentEvent
        }),
        ...mapGetters([
            'periodOptions',
            'currentPeriodOptions',
            'pointOptions',
            'fundationOptions'
        ]),
        displayedPurchases() {
            return this.purchases.map((purchase) => {
                purchase.totalWT = purchase.totalTI - purchase.totalVAT;
                return purchase;
            });
        },
        totalSell() {
            let sum = 0;

            this.displayedPurchases.forEach((purchase) => {
                sum += purchase.totalTI;
            });

            return sum;
        },
        totalSellWT() {
            let sum = 0;

            this.displayedPurchases.forEach((purchase) => {
                sum += purchase.totalWT;
            });

            return sum;
        },
        periodOptionsAll() {
            const periods = Object.assign([], this.periodOptions);
            periods.unshift({ name: 'Toutes', value: null });
            return periods;
        },
        currentPeriodOptionsAll() {
            const periods = Object.assign([], this.currentPeriodOptions);
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
            'notify',
            'notifyError'
        ]),
        filter() {
            const inputFields = JSON.parse(JSON.stringify(this.fields));
            let isFilled      = false;

            if (this.dateChoice === 0) {
                delete inputFields.dateIn;
                delete inputFields.dateOut;
            } else {
                delete inputFields.period;
            }

            Object.keys(inputFields).forEach((key) => {
                if (inputFields[key]) {
                    isFilled = true;
                }
            });

            if (!isFilled
                || (inputFields.dateIn && !inputFields.dateOut)
                || (!inputFields.dateIn && inputFields.dateOut)) {
                return this.notifyError({ message: 'Vous devez choisir au moins un filtre' });
            }

            inputFields.event = this.currentEvent;

            this.getPurchases(inputFields)
                .then(() => this.notify({ message: 'Le calcul a été effectué avec succès' }))
                .catch(err => this.notifyError({
                    message: 'Une erreur a eu lieu lors du calcul des achats',
                    full   : err
                }));
        }
    }
};
</script>
