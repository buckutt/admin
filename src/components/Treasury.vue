<template>
    <div class="treasury">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Treasury</h3>
            <h4>Recherche</h4>
            <select v-model="point">
                <option value="0">Tous les points</option>
                <option value="{{ point.id }}" v-for="point in points">{{ point.name }}</option>
            </select>
            <select v-model="fundation">
                <option value="0">Toutes les fondations</option>
                <option value="{{ fundation.id }}" v-for="fundation in fundations">{{ fundation.name }}</option>
            </select>
            <select v-model="period">
                <option value="0">Toutes les périodes</option>
                <option value="{{ period.id }}" v-for="period in periods">{{ period.name }}</option>
            </select>
            <input type="text" v-el:datein>
            <input type="text" v-el:dateout>
            <button @click="filter()">Rechercher</button>
            <h4>Ventes <span class="small">(total: {{ totalSell | price }})</span></h4>
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
                        <td class="mdl-data-table__cell--non-numeric">{{ purchase.article.firstname }}</td>
                        <td class="mdl-data-table__cell--non-numeric">{{ purchase.point.name }}</td>
                        <td class="mdl-data-table__cell--non-numeric">{{ purchase.price }}</td>
                        <td>$2.90</td>
                    </tr>
                </tbody>
            </table>
            <h4>Rechargements <span class="small">(total: {{ totalReload | price }})</span></h4>
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
                    <tr>
                        <td class="mdl-data-table__cell--non-numeric">Acrylic (Transparent)</td>
                        <td class="mdl-data-table__cell--non-numeric">Acrylic (Transparent)</td>
                        <td class="mdl-data-table__cell--non-numeric">Acrylic (Transparent)</td>
                        <td class="mdl-data-table__cell--non-numeric">Acrylic (Transparent)</td>
                        <td>$2.90</td>
                    </tr>
                </tbody>
            </table>
            <h4>Transfers <span class="small">(total: {{ totalTransfer | price }})</span></h4>
            <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                <thead>
                    <tr>
                        <th class="mdl-data-table__cell--non-numeric">De</th>
                        <th class="mdl-data-table__cell--non-numeric">À</th>
                        <th>Montant</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="mdl-data-table__cell--non-numeric">Acrylic (Transparent)</td>
                        <td class="mdl-data-table__cell--non-numeric">Acrylic (Transparent)</td>
                        <td>$2.90</td>
                    </tr>
                    <tr>
                        <td class="mdl-data-table__cell--non-numeric">Acrylic (Transparent)</td>
                        <td class="mdl-data-table__cell--non-numeric">Acrylic (Transparent)</td>
                        <td>$2.90</td>
                    </tr>
                    <tr>
                        <td class="mdl-data-table__cell--non-numeric">Acrylic (Transparent)</td>
                        <td class="mdl-data-table__cell--non-numeric">Acrylic (Transparent)</td>
                        <td>$2.90</td>
                    </tr>
                    <tr>
                        <td class="mdl-data-table__cell--non-numeric">Acrylic (Transparent)</td>
                        <td class="mdl-data-table__cell--non-numeric">Acrylic (Transparent)</td>
                        <td>$2.90</td>
                    </tr>
                    <tr>
                        <td class="mdl-data-table__cell--non-numeric">Acrylic (Transparent)</td>
                        <td class="mdl-data-table__cell--non-numeric">Acrylic (Transparent)</td>
                        <td>$2.90</td>
                    </tr>
                    <tr>
                        <td class="mdl-data-table__cell--non-numeric">Acrylic (Transparent)</td>
                        <td class="mdl-data-table__cell--non-numeric">Acrylic (Transparent)</td>
                        <td>$2.90</td>
                    </tr>
                    <tr>
                        <td class="mdl-data-table__cell--non-numeric">Acrylic (Transparent)</td>
                        <td class="mdl-data-table__cell--non-numeric">Acrylic (Transparent)</td>
                        <td>$2.90</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="mdl-js-snackbar mdl-snackbar" v-el:snackfilter>
        <div class="mdl-snackbar__text">You need at least one filter</div>
        <button class="mdl-snackbar__action" type="button"></button>
    </div>
</template>

<script>
import price from '../lib/price';
import { get } from '../lib/fetch';

export default {
    vuex: {
        getters: {
            points: state => state.points,
            fundations: state => state.fundations,
            periods: state => state.periods
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
            return this.purchases.reduce((a, b) => a.price.amount + b.price.amount, 0)
        },
        totalReload() {
            return this.reloads.reduce((a, b) => a.price.amount + b.price.amount, 0)
        },
        totalTransfer() {
            return this.transfers.reduce((a, b) => a.price.amount + b.price.amount, 0)
        }
    },

    methods: {
        filter () {
            const q = [];

            if (this.$data.point !== '0') {
                q.push(JSON.stringify({
                    field: 'pointId',
                    eq: this.$data.point
                }));
            }

            if (this.$data.fundation !== '0') {
                q.push(JSON.stringify({
                    field: 'fundationId',
                    eq: this.$data.fundation
                }));
            }

            if (this.$data.period !== '0') {
                q.push(JSON.stringify({
                    field: 'periodId',
                    eq: this.$data.period
                }));
            }

            if (this.$data.dateIn !== '') {
                q.push(JSON.stringify({
                    field: 'dateIn',
                    ge: this.$data.dateIn,
                    date: true
                }));
            }

            if (this.$data.dateOut !== '') {
                q.push(JSON.stringify({
                    field: 'dateOut',
                    le: this.$data.dateOut,
                    date: true
                }));
            }

            if (q.length === 0) {
                var data = {
                    message: 'You need at least one filter.',
                    timeout: 20000,
                    actionHandler: () => {
                        this.$els.snackfilter.classList.remove('mdl-snackbar--active');
                        this.$els.snackfilter.setAttribute('aria-hidden', 'false');
                    },
                    actionText: 'Ok'
                };
                this.$els.snackfilter.MaterialSnackbar.showSnackbar(data);
                return;
            }

            const orQ = q
                .map(o => encodeURIComponent(o))
                .join('&q[]=');

            const embed = encodeURIComponent(JSON.stringify({
                articles: true,
                price   : true,
                buyer   : true,
                seller  : true,
                point   : true
            }));

            get(`purchases/search?q=${orQ}&embed=${embed}`)
                .then(purchases => {
                    this.purchases = purchases;
                });
        }
    },

    attached () {
        const $dateIn  = this.$els.datein;
        const $dateOut = this.$els.dateout;
        jQuery($dateIn).datetimepicker({
            onChangeDateTime: ct => {
                this.$data.dateIn = ct;
            }
        });
        jQuery($dateOut).datetimepicker({
            onChangeDateTime: ct => {
                this.$data.dateOut = ct;
            }
        });
    }
}
</script>

<style lang="sass">
    @import '../main.scss';

    .treasury {
        > div {
            height: calc(100% - 40px);
            margin: 20px ((100% - $cardSize) / 2);
            overflow-y: auto;
            padding: 20px;
            width: $cardSize;

            > h3 {
                margin: 0;
            }

            select, input, button {
                min-height: 25px;
            }

            > select {
                display: inline-block;
                max-width: 150px;
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
