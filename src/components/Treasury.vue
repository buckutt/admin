<template>
    <div class="treasury">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Trésorerie</h3>
            <h4>Recherche</h4>
            <div>
                <mdl-select label="Point" id="point-select" :value.sync="point" :options="pointOptions"></mdl-select>
                <mdl-select label="Fondation" id="select-fundations" :value.sync="fundation" :options="fundationOptions"></mdl-select>
                <mdl-select label="Periode" id="select-periods" :value.sync="period" :options="periodOptions"></mdl-select>
            </div>
            <div>
                <mdl-textfield floating-label="Début" :value.sync="dateIn" pattern="\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}" error="Le début n'est pas une date" id="datein" v-el:datein></mdl-textfield>
                <mdl-textfield floating-label="Fin" :value.sync="dateOut" pattern="\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}" error="La fin n'est pas une date" id="dateout" v-el:dateout></mdl-textfield>
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
                        <td>{{ purchase.price.amount | price true }}</td>
                    </tr>
                </tbody>
            </table>
            <h4>Rechargements <span class="small">(total: {{ totalReload | price true }})</span></h4>
            <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                <thead>
                    <tr>
                        <th class="mdl-data-table__cell--non-numeric">Vendeur</th>
                        <th class="mdl-data-table__cell--non-numeric">Client</th>
                        <th class="mdl-data-table__cell--non-numeric">Moyen</th>
                        <th class="mdl-data-table__cell--non-numeric">Point</th>
                        <th>Montant</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="reload in reloads">
                        <td class="mdl-data-table__cell--non-numeric">{{ reload.seller.firstname }} {{ reload.seller.lastname }}</td>
                        <td class="mdl-data-table__cell--non-numeric">{{ reload.buyer.firstname }} {{ reload.buyer.lastname }}</td>
                        <td class="mdl-data-table__cell--non-numeric">{{ reload.trace }}</td>
                        <td class="mdl-data-table__cell--non-numeric">{{ reload.point.name }}</td>
                        <td>{{ reload.credit | price true }}</td>
                    </tr>
                </tbody>
            </table>
            <h4>Transfers <span class="small">(total: {{ totalTransfer | price true }})</span></h4>
            <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                <thead>
                    <tr>
                        <th class="mdl-data-table__cell--non-numeric">De</th>
                        <th class="mdl-data-table__cell--non-numeric">À</th>
                        <th>Montant</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="transfer in transfers">
                        <td class="mdl-data-table__cell--non-numeric">{{ transfer.sender.firstname }} {{ transfer.sender.lastname }}</td>
                        <td class="mdl-data-table__cell--non-numeric">{{ transfer.reciever.firstname }} {{ transfer.reciever.lastname }}</td>
                        <td>{{ transfer.amount | price true }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <mdl-snackbar display-on="snackfilter"></mdl-snackbar>
</template>

<script>
import price from '../lib/price';
import { parseDate, convertDate } from '../lib/date';
import { get } from '../lib/fetch';
import '../lib/select';

export default {
    vuex: {
        getters: {
            points: state => state.app.points,
            fundations: state => state.app.fundations,
            periods: state => state.app.periods
        }
    },

    data () {
        return {
            point    : '0',
            fundation: '0',
            period   : '0',
            dateIn   : '',
            dateOut  : '',
            purchases: [],
            reloads  : [],
            transfers: []
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
        totalReload() {
            let sum = 0;

            for (const reload of this.reloads) {
                sum += reload.credit;
            }

            return sum;
        },
        totalTransfer() {
            let sum = 0;

            for (const transfer of this.transfers) {
                sum += transfer.amount;
            }

            return sum;
        },
        periodOptions() {
            return this.periods.map(period => {
                return { name: period.name, value: period.id };
            });
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

    watch: {
        period(val) {
            const period = this.periods.filter(p => p.id === val)[0];
            if (!period) {
                this.dateIn  = '';
                this.dateOut = '';

                this.$els.datein.value  = '';
                this.$els.dateout.value = '';

                return;
            }

            this.dateIn  = parseDate(period.start);
            this.dateOut = parseDate(period.end);
        }
    },

    methods: {
        filter () {
            console.log(this.point, this.period, this.fundation);
            const q = [];

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

            const embedReloads = encodeURIComponent(JSON.stringify({
                point : true,
                buyer : true,
                seller: true
            }));

            const embedTransfers = encodeURIComponent(JSON.stringify({
                sender  : true,
                reciever: true
            }));

            get(`purchases/search?q=${orQ}&embed=${embedPurchases}`)
                .then(purchases => {
                    this.purchases = purchases.map(purchase => {
                        purchase.articleName = (purchase.promotion) ? purchase.promotion.name : purchase.articles[0].name;
                        return purchase;
                    });

                    return get(`reloads/search?q=${orQ}&embed=${embedReloads}`);
                })
                .then(reloads => {
                    this.reloads = reloads;

                    return get(`transfers/search?q=${orQ}&embed=${embedTransfers}`);
                })
                .then(transfers => {
                    console.log(transfers);
                    this.transfers = transfers;
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
