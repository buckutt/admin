<template>
    <div class="b-treasury b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <b-navbar title="Trésorerie" :inCard="true"></b-navbar>
            <h4>Recherche</h4>
            <form @submit.prevent="filter()">
                <div>
                    <mdl-select label="Point" id="point-select" v-model="fields.point" :options="pointOptionsAll"></mdl-select>
                </div>
                <div>
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

const fieldsPattern = {
    point  : null,
    dateIn : null,
    dateOut: null
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
            const points = Object.assign([], this.pointOptions);
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
            'notify',
            'notifyError'
        ]),
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
                return this.notifyError({ message: 'Vous devez choisir au moins un filtre' });
            }

            this.getTreasury(inputFields)
                .then(this.notify({ message: 'Le calcul a été effectué avec succès' }))
                .catch(err => this.notifyError({
                    message: 'Une erreur a eu lieu lors du calcul de la trésorerie',
                    full   : err
                }));
        },
        slugToName(slug) {
            const index = this.meansofpayment.findIndex(mop => (mop.slug === slug));
            return (index !== -1) ? this.meansofpayment[index].name : slug;
        }
    }
};
</script>
