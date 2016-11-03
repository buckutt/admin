<template>
    <div class="treasury" v-show="logged">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Trésorerie</h3>
            <h4>Recherche</h4>
            <div>
                <mdl-select label="Point" id="point-select" :value.sync="point" :options="pointOptions"></mdl-select>
            </div>
            <div>
                <mdl-textfield floating-label="Début" :value.sync="dateIn" pattern="\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}" error="Le début n'est pas une date" id="datein" v-el:datein></mdl-textfield>
                <mdl-textfield floating-label="Fin" :value.sync="dateOut" pattern="\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}" error="La fin n'est pas une date" id="dateout" v-el:dateout></mdl-textfield>
            </div>
            <mdl-button colored raised @click="filter()">Rechercher</mdl-button>

            <h4>Rechargements <span class="small">(total: {{ totalReload | price true }})</span></h4>
            <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                <thead>
                    <tr>
                        <th class="mdl-data-table__cell--non-numeric">Moyen de paiement</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="reload in reloads">
                        <td class="mdl-data-table__cell--non-numeric">{{ reload.group | reload }}</td>
                        <td>{{ reload.reduction | price true }}</td>
                    </tr>
                </tbody>
            </table>
            <h4>Transferts <span class="small">(total: {{ totalTransfer | price true }})</span></h4>
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
import Vue    from 'vue';
import price  from '../lib/price';
import reload from '../lib/reloadType';

import { parseDate, convertDate } from '../lib/date';
import { get } from '../lib/fetch';

export default {
    vuex: {
        getters: {
            points      : state => state.app.points,
            currentEvent: state => state.global.currentEvent,
            logged      : state => state.global.logged
        }
    },

    data () {
        return {
            point    : '',
            dateIn   : '',
            dateOut  : '',
            reloads  : [],
            transfers: []
        };
    },

    computed: {
        totalReload() {
            let sum = 0;

            for (const reload of this.reloads) {
                sum += reload.reduction;
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
        pointOptions() {
            let options = this.points.map(point => {
                return { name: point.name, value: point.id };
            });

            options.unshift({ name: 'Tous', value: '' });

            return options;
        }
    },

    methods: {
        filter () {
            const q  = [];
            const qt = [];

            if (this.$data.point !== '') {
                q.push(`point=${this.$data.point}`);

                qt.push(JSON.stringify({
                    field: 'Point_id',
                    eq: this.$data.point
                }));
            }

            if (this.$data.dateIn !== '') {
                q.push(`dateIn=${convertDate(this.$data.dateIn)}`);

                qt.push(JSON.stringify({
                    field: 'createdAt',
                    ge: convertDate(this.$data.dateIn),
                    date: true
                }));
            }

            if (this.$data.dateOut !== '') {
                q.push(`dateOut=${convertDate(this.$data.dateOut)}`);

                qt.push(JSON.stringify({
                    field: 'createdAt',
                    le: convertDate(this.$data.dateOut),
                    date: true
                }));
            }

            if (q.length === 0) {
                const data = {
                    message: 'You need at least one filter.',
                    timeout: 2000
                };

                this.$broadcast('snackfilter', data);
                return;
            }

            const qString = q
                .join('&');

            const orQt = qt
                .map(o => encodeURIComponent(o))
                .join('&q[]=');

            const embedTransfers = encodeURIComponent(JSON.stringify({
                sender  : true,
                reciever: true
            }));

            get(`services/treasury/reloads?${qString}`)
                .then(reloads => {
                    this.reloads = reloads;

                    return get(`transfers/search?q=${orQt}&embed=${embedTransfers}`);
                })
                .then(transfers => {
                    this.transfers = transfers.filter(t => !t.isRemoved);
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
