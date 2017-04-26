<template>
    <div class="b-purchases">
        <div class="mdl-card mdl-shadow--2dp">
            <h3 v-if="currentEvent">Achats de "{{ currentEvent.name }}"</h3>
            <h4>Recherche</h4>
            <form @submit.prevent="filter()">
                <div>
                    <mdl-select label="Point" id="point-select" v-model="fields.point" :options="pointOptions"></mdl-select>
                    <mdl-select label="Fondation" id="select-fundations" v-model="fields.fundation" :options="fundationOptions"></mdl-select>
                </div>
                <div>
                    Recherche par:<br />
                    <mdl-radio v-model="dateChoice" class="mdl-js-ripple-effect" :val="0">Achats liés à une période en particulier</mdl-radio><br />
                    <mdl-radio v-model="dateChoice" class="mdl-js-ripple-effect" :val="1">Achats compris entre deux dates</mdl-radio>

                    <transition name="fade">
                        <div v-show="dateChoice == 1">
                            <mdl-textfield floating-label="Début" :value="fields.dateIn | date" @input="updateField('dateIn', convertDate($event))" pattern="\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}" error="Le début n'est pas une date" ref="datein"></mdl-textfield>
                            <mdl-textfield floating-label="Fin"  :value="fields.dateOut | date" @input="updateField('dateOut', convertDate($event))" pattern="\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}" error="La fin n'est pas une date" ref="dateout"></mdl-textfield>
                        </div>
                    </transition>
                    <transition name="fade">
                        <div v-show="dateChoice == 0">
                            <mdl-select label="Periode" id="select-periods" v-model="fields.period" :options="periodOptions"></mdl-select>
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
import { mapState, mapActions } from 'vuex';
import '../lib/price';
import { convertDate } from '../lib/date';

const fieldsPattern = {
    point    : null,
    fundation: null,
    dateIn   : '',
    dateOut  : '',
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
            points      : state => state.objects.points,
            fundations  : state => state.objects.fundations,
            periods     : state => state.objects.periods,
            currentEvent: state => state.app.currentEvent
        }),
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
        periodOptions() {
            if (!this.currentEvent) {
                return [];
            }

            const periods = this.periods.map((period) => {
                if (period.Event_id === this.currentEvent.id) {
                    return { name: period.name, value: period.id };
                }
                return null;
            });

            periods.unshift({ name: 'Toutes', value: null });

            return periods.filter(a => a);
        },
        pointOptions() {
            const options = this.points.map(point => ({ name: point.name, value: point.id }));

            options.unshift({ name: 'Tous', value: null });

            return options;
        },
        fundationOptions() {
            const options = this.fundations.map(fundation => ({ name: fundation.name, value: fundation.id }));

            options.unshift({ name: 'Toutes', value: null });

            return options;
        }
    },

    methods: {
        ...mapActions([
            'getPurchases',
            'showClientError'
        ]),
        updateField(field, value) {
            this.fields[field] = value;
        },
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
        },
        convertDate(date) {
            return convertDate(date);
        }
    },

    mounted() {
        this.$nextTick(() => {
            const $dateIn  = this.$refs.datein.$el;
            const $dateOut = this.$refs.dateout.$el;
            window.jQuery($dateIn).datetimepicker({
                onChangeDateTime: (ct) => {
                    this.fields.dateIn = new Date(ct);
                }
            });
            window.jQuery($dateOut).datetimepicker({
                onChangeDateTime: (ct) => {
                    this.fields.dateOut = new Date(ct);
                }
            });
        });
    }
};
</script>

<style lang="scss">
    @import '../main.scss';

    .b-purchases {
        > div {
            min-height: calc(100% - 40px);
            margin: 20px ((100% - $cardSize) / 2);
            overflow-y: hidden;
            padding: 20px;
            width: $cardSize;

            > h3 {
                margin: 0;
            }

            > select {
                display: inline-block;
                max-width: 150px;
            }

            button {
                max-width: 300px;
            }

            table {
                width: 100%;
                white-space: normal;
            }
        }
    }
</style>
