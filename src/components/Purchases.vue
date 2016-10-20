<template>
    <div class="treasury" v-show="currentEvent">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Achats de "{{ currentEvent.name }}"</h3>
            <h4>Recherche</h4>
            <div>
                <mdl-select label="Point" id="point-select" :value.sync="point" :options="pointOptions"></mdl-select>
                <mdl-select label="Fondation" id="select-fundations" :value.sync="fundation" :options="fundationOptions"></mdl-select>
            </div>
            <div>
                Recherche par:<br />
                <mdl-radio :checked.sync="dateChoice" class="mdl-js-ripple-effect" value="0">Achats liés à une période en particulier</mdl-radio><br />
                <mdl-radio :checked.sync="dateChoice" class="mdl-js-ripple-effect" value="1">Achats compris entre deux dates</mdl-radio>

                <div v-show="dateChoice == 1">
                    <mdl-textfield floating-label="Début" :value.sync="dateIn" pattern="\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}" error="Le début n'est pas une date" id="datein" v-el:datein></mdl-textfield>
                    <mdl-textfield floating-label="Fin" :value.sync="dateOut" pattern="\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}" error="La fin n'est pas une date" id="dateout" v-el:dateout></mdl-textfield>
                </div>
                <div v-show="dateChoice == 0">
                    <mdl-select label="Periode" id="select-periods" :value.sync="period" :options="periodOptions"></mdl-select>
                </div>
            </div>
            <mdl-button colored raised @click="filter()">Rechercher</mdl-button>

            <h4>Ventes <span class="small">(total: {{ totalSell | price true }})</span></h4>
            <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                <thead>
                    <tr>
                        <th class="mdl-data-table__cell--non-numeric">Vendeur</th>
                        <th class="mdl-data-table__cell--non-numeric">Client</th>
                        <th class="mdl-data-table__cell--non-numeric">Objet</th>
                        <th class="mdl-data-table__cell--non-numeric">Point</th>
                        <th class="mdl-data-table__cell--non-numeric">Fondation</th>
                        <th>Montant</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="purchase in purchases">
                        <td class="mdl-data-table__cell--non-numeric">{{ purchase.seller.firstname }} {{ purchase.seller.lastname }}</td>
                        <td class="mdl-data-table__cell--non-numeric">{{ purchase.buyer.firstname }} {{ purchase.buyer.lastname }}</td>
                        <td class="mdl-data-table__cell--non-numeric">{{ purchase.articleName }}</td>
                        <td class="mdl-data-table__cell--non-numeric">{{ purchase.point.name }}</td>
                        <td class="mdl-data-table__cell--non-numeric">{{ purchase.price.fundation.name }}</td>
                        <td>{{ purchase.price.amount | price true }} TTC ({{ purchase.vat | price true }} HT)</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <mdl-snackbar display-on="snackfilter"></mdl-snackbar>
</template>

<script>
import Vue from 'vue';
import price from '../lib/price';
import { parseDate, convertDate } from '../lib/date';
import { get } from '../lib/fetch';
import '../lib/select';

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
            point     : '0',
            fundation : '0',
            period    : '0',
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
                sum += purchase.price.amount;
            }

            return sum;
        },
        periodOptions() {
            let periods = this.periods.map(period => {
                if(period.Event_id == this.currentEvent.id) {
                    return { name: period.name, value: period };
                } else {
                    return null;
                }
            });

            return periods.filter(a => a);
        },
        pointOptions() {
            return this.points.map(point => {
                return { name: point.name, value: point.id };
            });
        },
        fundationOptions() {
            return this.fundations.map(fundation => {
                return { name: fundation.name, value: fundation.id };
            });
        }
    },

    methods: {
        calculateWT(purchase) {
            if(purchase.articlesAmount.length > 1) {
                let promises = purchase.articlesAmount.map(article => {
                    return get(`prices/${article.price}`)
                        .then(result => {
                            return {
                                wt   : result.amount/(1+article.vat/100),
                                vat  : 1+article.vat/100,
                                price: result.amount
                            };
                        });
                });

                return Promise.all(promises).then(results => {
                    let totalWT     = 0;
                    let priceWT     = purchase.price.amount;
                    let totalDivide = 0;
                    results.forEach(value => {
                        totalWT += value.wt;
                    });

                    results.forEach(value => {
                        const ratioPrice = value.wt/totalWT;

                        totalDivide += ratioPrice*value.vat;
                    });

                    priceWT = priceWT/totalDivide;
                    return priceWT;
                });
            }
            return Promise.resolve(purchase.price.amount/(1+purchase.articlesAmount[0].vat/100));
        },
        filter () {
            console.log(this.point, this.period, this.fundation);
            const q          = [];
            let filterPeriod = {id: null};

            if (this.$data.point !== '0') {
                q.push(JSON.stringify({
                    field: 'Point_id',
                    eq: this.$data.point
                }));
            }

            if (this.$data.fundation !== '0') {
                q.push(JSON.stringify({
                    field: 'Fundation_id',
                    eq: this.$data.fundation
                }));
            }

            if (this.dateChoice == '1') {
                if (this.$data.dateIn !== '') {
                    q.push(JSON.stringify({
                        field: 'createdAt',
                        ge: convertDate(this.$data.dateIn),
                        date: true
                    }));
                }

                if (this.$data.dateOut !== '') {
                    q.push(JSON.stringify({
                        field: 'createdAt',
                        le: convertDate(this.$data.dateOut),
                        date: true
                    }));
                }
            } else if (this.dateChoice == '0') {
                if(this.$data.period !== '0') {
                    filterPeriod = this.$data.period;

                    // Permet de réduire les résultats à filtrer par la suite
                    q.push(JSON.stringify({
                        field: 'createdAt',
                        ge: filterPeriod.start,
                        date: true
                    }));

                    q.push(JSON.stringify({
                        field: 'createdAt',
                        le: filterPeriod.end,
                        date: true
                    }));
                }
            }

            if (q.length === 0) {
                var data = {
                    message: 'You need at least one filter.',
                    timeout: 2000
                };

                this.$broadcast('snackfilter', data);
                return;
            }

            const orQ = q
                .map(o => encodeURIComponent(o))
                .join('&q[]=');

            const embedPurchases = encodeURIComponent(JSON.stringify({
                articles : true,
                promotion: true,
                price    : {
                    fundation: true
                },
                buyer    : true,
                seller   : true,
                point    : true
            }));

            get(`purchases/search?q=${orQ}&embed=${embedPurchases}`)
                .then(purchases => {
                    const eventPeriodsIds = this.currentEvent.periods.map(period => period.id);
                    purchases = purchases.map(purchase => {
                        if(!filterPeriod.id && eventPeriodsIds.indexOf(purchase.price.Period_id) > -1 || purchase.price.Period_id == filterPeriod.id) {
                            purchase.articleName = (purchase.promotion) ? purchase.promotion.name : purchase.articles[0].name;
                            this.calculateWT(purchase).then(vat => {
                                Vue.set(purchase, 'vat', vat);
                            });
                            return purchase;
                        } else {
                            return null;
                        }
                    });

                    this.purchases = purchases.filter(a => a);
                });
        }
    },

    attached () {
        const $dateIn  = this.$els.datein;
        const $dateOut = this.$els.dateout;
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
    }
}
</script>

<style lang="sass">
    @import '../main.scss';

    .treasury {
        > div {
            min-height: calc(100% - 40px);
            margin: 20px ((100% - $cardSize) / 2);
            overflow-y: auto;
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
