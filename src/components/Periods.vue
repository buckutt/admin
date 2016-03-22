<template>
    <div class="periods">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Périodes</h3>
            <form v-on:submit.prevent>
                <input type="text" v-model="name">
                <input type="text" v-model="dateStart" v-el:datestart pattern="([0-9]{2})\/([0-9]{2})\/([0-9]{4}) ([0-9]{2}):([0-9]{2})">
                <input type="text" v-model="dateEnd " v-el:dateend pattern="([0-9]{2})\/([0-9]{2})\/([0-9]{4}) ([0-9]{2}):([0-9]{2})">
                <input type="submit" @click="createPeriod(inputPeriod)" value="Ok">
            </form>

            <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                <thead>
                    <tr>
                        <th class="mdl-data-table__cell--non-numeric">Période</th>
                        <th class="mdl-data-table__cell--non-numeric">Début</th>
                        <th class="mdl-data-table__cell--non-numeric">Fin</th>
                        <th class="mdl-data-table__cell--non-numeric">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="period in periods">
                        <td class="mdl-data-table__cell--non-numeric">{{ period.name }}</td>
                        <td class="mdl-data-table__cell--non-numeric">{{ period.start | date }}</td>
                        <td class="mdl-data-table__cell--non-numeric">{{ period.end | date }}</td>
                        <td class="mdl-data-table__cell--non-numeric"><button id="show-dialog" type="button" class="mdl-button" @click="openModal(period)">Modifier</button><button id="show-dialog" type="button" class="mdl-button" @click="removePeriod(period)">Supprimer</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <dialog class="mdl-dialog">
    <h4 class="mdl-dialog__title">Modifier la période {{ selectedPeriod.name }}</h4>
    <form v-on:submit.prevent>
        <div class="mdl-dialog__content">
          <p>
                <input type="text" v-model="name"><br />
                <input type="text" v-model="dateStart" pattern="([0-9]{2})\/([0-9]{2})\/([0-9]{4}) ([0-9]{2}):([0-9]{2})"><br />
                <input type="text" v-model="dateEnd" pattern="([0-9]{2})\/([0-9]{2})\/([0-9]{4}) ([0-9]{2}):([0-9]{2})"><br />
          </p>
        </div>
        <div class="mdl-dialog__actions">
          <input type="submit" class="mdl-button" @click="updateAndClose(selectedPeriod, inputPeriod)" value="Valider">
          <button type="button" class="mdl-button close" @click="closeModal()">Annuler</button>
        </div>
    </form>
    </dialog>
</template>

<script>
import { post } from '../lib/fetch';
import date, { parseDate, convertDate } from '../lib/date';
import { createPeriod, updatePeriod, removePeriod } from '../store/actions';


export default {
    vuex: {
        getters: {
            periods: state => state.app.periods
        },
        actions: {
            createPeriod: createPeriod,
            updatePeriod: updatePeriod,
            removePeriod: removePeriod
        }
    },

    data () {
        return {
            name: '',
            dateStart: '',
            dateEnd: '',
            selectedPeriod: ''
        };
    },

    methods: {
        openModal(period) {
            this.$data.selectedPeriod = period;
            this.$data.name = period.name;
            this.$data.dateStart = parseDate(period.start);
            this.$data.dateEnd = parseDate(period.end);
            document.querySelector('dialog').showModal();
        },
        updateAndClose(selectedPeriod, inputPeriod) {
            this.updatePeriod(selectedPeriod, inputPeriod);
            this.closeModal();
        },
        closeModal() {
            document.querySelector('dialog').close();
        }
    },

    computed: {
        inputPeriod() {
            const name = this.$data.name;
            const start = convertDate(this.$data.dateStart);
            const end = convertDate(this.$data.dateEnd);
            this.$data.name = '';
            this.$data.dateStart = '';
            this.$data.dateEnd = '';
            return {
                name: name,
                start: start,
                end: end
            };
        }
    },

    attached () {
        const $dateStart  = this.$els.datestart;
        const $dateEnd = this.$els.dateend;
        jQuery($dateStart).datetimepicker({
            onChangeDateTime: ct => {
                //this.$data.dateStart = ct;
            },
            format:'d/m/Y H:i'
        });
        jQuery($dateEnd).datetimepicker({
            onChangeDateTime: ct => {
                //this.$data.dateEnd = ct;
            },
            format:'d/m/Y H:i'
        });
    }
}
</script>

<style lang="sass">
    @import '../main.scss';

    .periods {
        > div {
            height: calc(100% - 40px);
            margin: 20px ((100% - $cardSize) / 2);
            padding: 20px;
            width: $cardSize;

            > h3 {
                margin: 0;
            }

            > select {
                display: inline-block;
                max-width: 150px;
            }
        }
    }
</style>
