<template>
    <div class="b-treasury">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Trésorerie</h3>
            <h4>Recherche</h4>
            <form @submit.prevent="filter()">
                <div>
                    <mdl-select label="Point" id="point-select" v-model="fields.point" :options="pointOptions"></mdl-select>
                </div>
                <div>
                    <mdl-textfield floating-label="Début" :value="fields.dateIn | date" @input="updateField('dateIn', convertDate($event))" pattern="\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}" error="Le début n'est pas une date" id="datein" ref="datein"></mdl-textfield>
                    <mdl-textfield floating-label="Fin" :value="fields.dateOut | date" @input="updateField('dateOut', convertDate($event))" pattern="\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}" error="La fin n'est pas une date" id="dateout" ref="dateout"></mdl-textfield>
                </div>
                <mdl-button colored raised>Rechercher</mdl-button>
            </form>

            <h4>Rechargements <span class="small">(total: {{ totalReload | price(true) }})</span></h4>
            <div class="b-responsive-table">
                <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                    <thead>
                        <tr>
                            <th class="mdl-data-table__cell--non-numeric">Moyen de paiement</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="reload in reloads">
                            <td class="mdl-data-table__cell--non-numeric">{{ reload.group | reloadType }}</td>
                            <td>{{ reload.reduction | price(true) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h4>Transferts <span class="small">(total: {{ totalTransfer | price(true) }})</span></h4>
            <div class="b-responsive-table">
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
                            <td>{{ transfer.amount | price(true) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import Vue                   from 'vue';
import price                 from '../lib/price';
import reloadType            from '../lib/reloadType';
import date, { convertDate } from '../lib/date';

import { mapState, mapActions } from 'vuex';

const fieldsPattern = {
    point  : null,
    dateIn : '',
    dateOut: ''
};

export default {
    data () {
        return {
            fields: JSON.parse(JSON.stringify(fieldsPattern))
        };
    },

    computed: {
        ...mapState({
            points   : state => state.app.points,
            transfers: state => state.app.transfers,
            reloads  : state => state.app.reloads
        }),
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

            options.unshift({ name: 'Tous', value: null });

            return options;
        }
    },

    methods: {
        ...mapActions([
            'getTreasury'
        ]),
        updateField(field, value) {
            this.fields[field] = value;
        },
        filter () {
            const inputFields = JSON.parse(JSON.stringify(this.fields));
            let isFilled      = false;

            Object.keys(inputFields).forEach(key => {
                if (inputFields[key]) {
                    isFilled = true;
                }
            });

            if (!isFilled
                || (inputFields.dateIn && !inputFields.dateOut)
                || (!inputFields.dateIn && inputFields.dateOut)) {
                return this.$root.$emit('snackfilter', {
                    message: 'You need at least one filter.'
                });
            }

            this.fields = JSON.parse(JSON.stringify(fieldsPattern));

            this.getTreasury(inputFields);
        },
        convertDate(date) {
            return convertDate(date);
        }
    },

    mounted () {
        this.$nextTick(() => {
            const $dateIn  = this.$refs.datein.$el;
            const $dateOut = this.$refs.dateout.$el;
            jQuery($dateIn).datetimepicker({
                onChangeDateTime: ct => {
                    this.fields.dateIn = new Date(ct);
                }
            });
            jQuery($dateOut).datetimepicker({
                onChangeDateTime: ct => {
                    this.fields.dateOut = new Date(ct);
                }
            });
        });
    }
}
</script>

<style lang="sass">
    @import '../main.scss';

    .b-treasury {
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
    }
</style>
