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

            this.dateIn  = period.start;
            this.dateOut = period.end;
            console.log(period.start, period.end);

            this.$els.datein.value  = `Début de la période ${period.name}`;
            this.$els.dateout.value = `Fin de la période ${period.name}`;
        }
    },

    methods: {
        filter () {
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
                    ge: this.$data.dateIn,
                    date: true
                }));
            }

            if (this.$data.dateOut !== '') {
                q.push(JSON.stringify({
                    field: 'createdAt',
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
