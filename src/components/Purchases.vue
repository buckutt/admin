<template>
    <div>
        <div class="treasury" v-if="currentEvent">
            <div class="mdl-card mdl-shadow--2dp">
                <h3 v-if="currentEvent">Achats de "{{ currentEvent.name }}"</h3>
                <h4>Recherche</h4>
                <form @submit.prevent="filter()">
                    <div>
                        <mdl-select label="Point" id="point-select" v-model="point" :options="pointOptions"></mdl-select>
                        <mdl-select label="Fondation" id="select-fundations" v-model="fundation" :options="fundationOptions"></mdl-select>
                    </div>
                    <div>
                        Recherche par:<br />
                        <mdl-radio v-model="dateChoice" class="mdl-js-ripple-effect" :val="0">Achats liés à une période en particulier</mdl-radio><br />
                        <mdl-radio v-model="dateChoice" class="mdl-js-ripple-effect" :val="1">Achats compris entre deux dates</mdl-radio>

                        <div v-show="dateChoice == 1">
                            <mdl-textfield floating-label="Début" v-model="dateIn" pattern="\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}" error="Le début n'est pas une date" id="datein" ref="datein"></mdl-textfield>
                            <mdl-textfield floating-label="Fin" v-model="dateOut" pattern="\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}" error="La fin n'est pas une date" id="dateout" ref="dateout"></mdl-textfield>
                        </div>
                        <div v-show="dateChoice == 0">
                            <mdl-select label="Periode" id="select-periods" v-model="period" :options="periodOptions"></mdl-select>
                        </div>
                    </div>
                    <mdl-button colored raised>Rechercher</mdl-button>
                </form>

                <h4>Ventes <span class="small">(total TTC: {{ totalSell | price(true) }}, total HT: {{ totalSellWT | price(true) }})</span></h4>
                <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                    <thead>
                        <tr>
                            <th>Quantité</th>
                            <th class="mdl-data-table__cell--non-numeric">Article</th>
                            <th>Prix unitaire TTC</th>
                            <th>Total TTC</th>
                            <th>Total HT</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="purchase in purchases">
                            <td>{{ purchase.count }}</td>
                            <td class="mdl-data-table__cell--non-numeric">{{ purchase.name }}</td>
                            <td>{{ purchase.price | price(true) }}</td>
                            <td>{{ purchase.totalVAT | price(true) }}</td>
                            <td>{{ purchase.totalWT | price(true) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <mdl-snackbar display-on="snackfilter"></mdl-snackbar>
    </div>
</template>

<script>
import Vue from 'vue';
import price from '../lib/price';
import { parseDate, convertDate } from '../lib/date';
import { get } from '../lib/fetch';

export default {
    vuex: {
        getters: {
            points      : state => state.app.points,
            fundations  : state => state.app.fundations,
            periods     : state => state.app.periods,
            currentEvent: state => state.global.currentEvent
        }
    },

    data () {
        return {
            point     : '',
            fundation : '',
            period    : '',
            dateIn    : '',
            dateOut   : '',
            dateChoice: '0',
            purchases : [],
        };
    },

    computed: {
        totalSell() {
            let sum = 0;

            for (const purchase of this.purchases) {
                sum += purchase.totalVAT;
            }

            return sum;
        },
        totalSellWT() {
            let sum = 0;

            for (const purchase of this.purchases) {
                sum += purchase.totalWT;
            }

            return sum;
        },
        periodOptions() {
            if(!this.currentEvent) {
                return {};
            }

            let periods = this.periods.map(period => {
                if(period.Event_id == this.currentEvent.id) {
                    return { name: period.name, value: period.id };
                } else {
                    return null;
                }
            });

            periods.unshift({ name: 'Toutes', value: '' });

            return periods.filter(a => a);
        },
        pointOptions() {
            let options = this.points.map(point => {
                return { name: point.name, value: point.id };
            });

            options.unshift({ name: 'Tous', value: '' });

            return options;
        },
        fundationOptions() {
            let options = this.fundations.map(fundation => {
                return { name: fundation.name, value: fundation.id };
            });

            options.unshift({ name: 'Toutes', value: '' });

            return options;
        }
    },

    methods: {
        filter () {
            const q = [];

            q.push(`event=${this.currentEvent.id}`)

            if (this.$data.point !== '') {
                q.push(`point=${this.$data.point}`);
            }

            if (this.$data.fundation !== '') {
                q.push(`fundation=${this.$data.fundation}`);
            }

            if (this.dateChoice == '1') {
                if (this.$data.dateIn !== '') {
                    q.push(`dateIn=${convertDate(this.$data.dateIn)}`);
                }

                if (this.$data.dateOut !== '') {
                    q.push(`dateOut=${convertDate(this.$data.dateOut)}`);
                }
            } else if (this.dateChoice == '0') {
                if(this.$data.period !== '0') {
                    q.push(`period=${this.$data.period}`);
                }
            }

            if (q.length === 0) {
                const data = {
                    message: 'You need at least one filter.',
                    timeout: 2000
                };

                this.$root.$emit('snackfilter', data);
                return;
            }

            const qString = q
                .join('&');

            get(`services/treasury/purchases?${qString}`)
                .then(purchases => {
                    this.purchases = purchases.map(purchase => {
                        if (!purchase.totalWT) {
                            purchase.totalWT = purchase.totalVAT;
                        }

                        return purchase;
                    });
                });
        }
    },

    mounted () {
        this.$nextTick(() => {
            const $dateIn  = this.$refs.datein.$el;
            const $dateOut = this.$refs.dateout.$el;
            jQuery($dateIn).datetimepicker({
                onChangeDateTime: ct => {
                    this.$data.dateIn = parseDate(ct);
                },
                format:'d/m/Y H:i'
            });
            jQuery($dateOut).datetimepicker({
                onChangeDateTime: ct => {
                    this.$data.dateOut = parseDate(ct);
                },
                format:'d/m/Y H:i'
            });
        });
    }
}
</script>

<style lang="sass">
    @import '../main.scss';

    .treasury {
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

        & + .mdl-snackbar {
            margin-left: $sidebarWidth / 2;
        }
    }
</style>
