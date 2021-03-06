<template>
    <div class="b-treasuryExport">
        <h5>Exporter la trésorerie</h5>
        <form @submit.prevent="exportTreasury()">
            <h6>Filtres</h6>
            <div>
                <b-inputselect label="Point" id="point-select" :options="pointOptionsAll" v-model="fields.point"></b-inputselect>
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
                    class="b--limitsize b--inline"></b-datetime-picker>
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
                    class="b--limitsize b--inline"></b-datetime-picker>
            </div>
            <h6>Options</h6>
            <div class="b-treasuryExport__options">
                <div>
                    <b-inputselect label="Données à exporter" id="data-select" :options="dataChoices" v-model="data"></b-inputselect>
                </div>
                <div>
                    <strong>Format:</strong><br />
                    <mdl-radio checked="checked" val="csv" value="csv">CSV</mdl-radio>
                </div>
            </div>
            <mdl-button colored raised>Exporter</mdl-button>
        </form>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { saveAs }          from 'file-saver';
import { download }        from '../../lib/fetch';
import treasuryQueryString from '../../lib/treasuryQueryString';

const fieldsPattern = {
    point  : null,
    dateIn : null,
    dateOut: null
};

export default {
    data() {
        return {
            fields: Object.assign({}, fieldsPattern),
            data  : 'reloads'
        };
    },

    computed: {
        ...mapGetters([
            'pointOptions'
        ]),

        pointOptionsAll() {
            const points = Object.assign([], this.pointOptions);
            points.unshift({ name: 'Tous', value: null });

            return points;
        },

        dataChoices() {
            return [
                { name: 'Rechargements', value: 'reloads' },
                { name: 'Remboursements', value: 'refunds' }
            ];
        }
    },

    methods: {
        ...mapActions([
            'notify',
            'notifyError'
        ]),

        exportTreasury() {
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

            const qString = treasuryQueryString(inputFields);

            download(`services/treasury/csv/${this.data}?${qString}`)
                .then((result) => {
                    const currentTime =  Math.floor(Date.now() / 1000);
                    this.notify({ message: 'Le téléchargement du document va commencer...' });
                    saveAs(result, `treasury-${this.data}-${currentTime}.csv`);
                })
                .catch(err => this.notifyError({
                    message: 'Une erreur a eu lieu lors de la génération des données',
                    full   : err
                }));
        }
    }
};
</script>

<style>
    .b-treasuryExport__options {
        display: flex;

        & > div {
            margin-right: 15px;
        }
    }
</style>
