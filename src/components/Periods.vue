<template>
    <div class="periods">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Périodes</h3>
            <form v-on:submit.prevent>
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input class="mdl-textfield__input" type="text" id="name" v-model="name">
                    <label class="mdl-textfield__label" for="name">Nom</label>
                </div>
                <br>
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input class="mdl-textfield__input" type="text" pattern="\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}" id="dateStart" v-model="dateStart" v-el:createdatestart>
                    <label class="mdl-textfield__label" for="dateStart">Début</label>
                    <span class="mdl-textfield__error">Le début n'est pas une date</span>
                </div>
                <br>
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input class="mdl-textfield__input" type="text" pattern="\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}" id="dateEnd" v-model="dateEnd " v-el:createdateend>
                    <label class="mdl-textfield__label" for="dateEnd">Fin</label>
                    <span class="mdl-textfield__error">La fin n'est pas une date</span>
                </div>
                <br>
                <input type="submit" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" @click="createPeriod(inputPeriod)" value="Créer">
            </form>

            <br>

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
                        <td class="mdl-data-table__cell--non-numeric">
                            <button type="button" class="mdl-button" @click="openModal(period)">Modifier</button>
                            <button type="button" class="mdl-button" @click="removePeriod(period)">Supprimer</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="modal modal__bg" v-modal="openEditModal" v-el:editmodal>
        <div class="modal__dialog">
            <div class="modal__header">
                <h3>Modifier la période {{ selectedPeriod.name }}</h3>
            </div>
            <form v-on:submit.prevent>
                <div class="modal__body">
                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input class="mdl-textfield__input" type="text" id="name" v-model="modPeriod.name">
                        <label class="mdl-textfield__label" for="name">Nom</label>
                    </div>

                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input class="mdl-textfield__input" type="text" pattern="\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}" id="dateStart" v-model="modPeriod.start" v-el:editdatestart>
                        <label class="mdl-textfield__label" for="dateStart">Début</label>
                        <span class="mdl-textfield__error">Le début n'est pas une date</span>
                    </div>

                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input class="mdl-textfield__input" type="text" pattern="\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}" id="dateEnd" v-model="modPeriod.end" v-el:editdateend>
                        <label class="mdl-textfield__label" for="dateEnd">Fin</label>
                        <span class="mdl-textfield__error">La fin n'est pas une date</span>
                    </div>
                </div>
                <div class="modal__footer">
                    <input type="submit" class="mdl-button modal__close" @click="updatePeriod(selectedPeriod, editPeriod)" value="Valider">
                    <button type="button" class="mdl-button modal__close" @click="closeModal()">Annuler</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { post } from '../lib/fetch';
import date, { parseDate, convertDate } from '../lib/date';
import modal from '../lib/modal';
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
            name:           '',
            dateStart:      '',
            dateEnd:        '',
            selectedPeriod: {},
            modPeriod:      {},
            openEditModal:  false
        };
    },

    methods: {
        openModal(period) {
            this.selectedPeriod  = period;
            this.modPeriod       = JSON.parse(JSON.stringify(period));
            this.modPeriod.start = parseDate(this.modPeriod.start);
            this.modPeriod.end   = parseDate(this.modPeriod.end);

            this.openEditModal   = true;
        },
        closeModal() {
            this.openEditModal   = false;
        }
    },

   computed: {
        inputPeriod() {
            const name     = this.name;
            const start    = convertDate(this.dateStart);
            const end      = convertDate(this.dateEnd);
            this.name      = '';
            this.dateStart = '';
            this.dateEnd   = '';
            return {
                name: name,
                start: start,
                end: end
            };
        },
        editPeriod() {
            const period   = this.modPeriod;
            this.modPeriod = {};
            period.start   = convertDate(period.start);
            period.end     = convertDate(period.end);
            this.closeModal();
            return period;
        }
    },

    attached () {
        const $createdateStart = this.$els.createdatestart;
        const $createdateEnd   = this.$els.createdateend;
        const $editdateStart   = this.$els.editdatestart;
        const $editdateEnd     = this.$els.editdateend;

        jQuery([$createdateStart, $createdateEnd, $editdateStart, $editdateEnd]).datetimepicker({
            onChangeDateTime: ct => {
                //this.$data.dateStart = ct;
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
            min-height: calc(100% - 40px);
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
