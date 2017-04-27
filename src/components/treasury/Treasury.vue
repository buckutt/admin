<template>
    <div class="b-treasury b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Trésorerie</h3>
            <h4>Recherche</h4>
            <form @submit.prevent="filter()">
                <div>
                    <mdl-select label="Point" id="point-select" v-model="fields.point" :options="pointOptionsAll"></mdl-select>
                </div>
                <div>
                    <mdl-textfield floating-label="Début" :value="fields.dateIn | date" @input="updateField('dateIn', convertDate($event))" pattern="\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}" error="Le début n'est pas une date" id="datein" ref="datein"></mdl-textfield>
                    <mdl-textfield floating-label="Fin" :value="fields.dateOut | date" @input="updateField('dateOut', convertDate($event))" pattern="\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}" error="La fin n'est pas une date" id="dateout" ref="dateout"></mdl-textfield>
                </div>
                <mdl-button colored raised>Rechercher</mdl-button>
            </form>

            <h4>Rechargements <span class="small">(total: {{ totalReload | price(true) }})</span></h4>
            <b-table
                :headers="[
                    { title: 'Moyen de paiement', field: 'type' },
                    { title: 'Total', field: 'reduction', type: 'price' }
                ]"
                :data="displayedReloads">
            </b-table>

            <h4>Transferts <span class="small">(total: {{ totalTransfer | price(true) }})</span></h4>
            <b-table
                :headers="[
                    { title: 'De', field: 'sender.fullname', class: 'b--capitalized' },
                    { title: 'À', field: 'reciever.fullname', class: 'b--capitalized' },
                    { title: 'Montant', field: 'amount', type: 'price' },
                ]"
                :data="displayedTransfers">
            </b-table>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import '../../lib/price';
import { convertDate } from '../../lib/date';

const fieldsPattern = {
    point  : null,
    dateIn : '',
    dateOut: ''
};

export default {
    data() {
        return {
            fields: Object.assign({}, fieldsPattern)
        };
    },

    computed: {
        ...mapState({
            transfers     : state => state.objects.transfers,
            reloads       : state => state.objects.reloads,
            meansofpayment: state => state.objects.meansofpayment
        }),
        ...mapGetters([
            'pointOptions'
        ]),
        totalReload() {
            let sum = 0;

            this.reloads.forEach((reload) => {
                sum += reload.reduction;
            });

            return sum;
        },
        totalTransfer() {
            let sum = 0;

            this.transfers.forEach((transfer) => {
                sum += transfer.amount;
            });

            return sum;
        },
        pointOptionsAll() {
            const points = this.pointOptions;
            points.unshift({ name: 'Tous', value: null });
            return points;
        },
        displayedReloads() {
            return this.reloads.map((reload) => {
                reload.type = this.slugToName(reload.group);
                return reload;
            });
        },
        displayedTransfers() {
            return this.transfers.map((transfer) => {
                transfer.sender.fullname = `${transfer.sender.firstname} ${transfer.sender.lastname}`;
                transfer.reciever.fullname = `${transfer.reciever.firstname} ${transfer.reciever.lastname}`;
                return transfer;
            });
        }
    },

    methods: {
        ...mapActions([
            'getTreasury',
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

            this.fields = Object.assign({}, fieldsPattern);

            this.getTreasury(inputFields);
        },
        convertDate(date) {
            return convertDate(date);
        },
        slugToName(slug) {
            const index = this.meansofpayment.findIndex(mop => (mop.slug === slug));
            return (index !== -1) ? this.meansofpayment[index].name : slug;
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
    @import '../../main.scss';
</style>
