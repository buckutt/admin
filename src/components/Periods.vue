<template>
    <div v-if="currentEvent">
        <div class="b-periods">
            <div class="mdl-card mdl-shadow--2dp">
                <h3>Périodes de "{{ currentEvent.name }}"</h3>
                <form @submit.prevent="createPeriod(inputPeriod)">
                    <mdl-textfield floating-label="Nom" v-model="name"></mdl-textfield>
                    <br />
                    <mdl-textfield floating-label="Début" v-model="dateStart" pattern="\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}" error="Le début n'est pas une date" id="dateStart" ref="createdatestart"></mdl-textfield>
                    <mdl-textfield floating-label="Fin" v-model="dateEnd" pattern="\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}" error="La fin n'est pas une date" id="dateEnd" ref="createdateend"></mdl-textfield>
                    <br />
                    <mdl-button colored raised>Créer</mdl-button>
                </form>

                <br />

                <div class="b-responsive-table">
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
                            <tr v-for="period in periods" v-show="currentEvent.id == period.Event_id">
                                <td class="mdl-data-table__cell--non-numeric">{{ period.name }}</td>
                                <td class="mdl-data-table__cell--non-numeric">{{ period.start | date }}</td>
                                <td class="mdl-data-table__cell--non-numeric">{{ period.end | date }}</td>
                                <td class="mdl-data-table__cell--non-numeric b-actions-cell">
                                    <mdl-button raised colored @click.native="openModal(period)">Modifier</mdl-button>
                                    <mdl-button raised accent @click.native="$root.confirm() && removePeriod(period)">Supprimer</mdl-button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <modal>
            <div class="modal__dialog">
                <div class="modal__header">
                    <h3>Modifier la période {{ selectedPeriod.name }}</h3>
                </div>
                <form @submit.prevent="updatePeriod(editPeriod)">
                    <div class="modal__body">
                        <mdl-textfield floating-label="Nom" v-model="modPeriod.name"></mdl-textfield>

                        <mdl-textfield floating-label="Début" v-model="modPeriod.start" pattern="\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}" error="Le début n'est pas une date" id="dateStart" ref="editdatestart"></mdl-textfield>

                        <mdl-textfield floating-label="Fin" v-model="modPeriod.end" pattern="\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}" error="La fin n'est pas une date" id="dateEnd" ref="editdateend"></mdl-textfield>
                    </div>
                    <div class="modal__footer">
                        <mdl-button>Valider</mdl-button>
                        <mdl-button @click.native="closeModal()">Annuler</mdl-button>
                    </div>
                </form>
            </div>
        </modal>
    </div>
</template>

<script>
import Modal    from './Modal.vue';
import { post } from '../lib/fetch';
import date, { parseDate, convertDate } from '../lib/date';
import { mapState, mapActions } from 'vuex';


export default {
    components: {
        Modal
    },

    data () {
        return {
            name:           '',
            dateStart:      '',
            dateEnd:        '',
            selectedPeriod: {},
            modPeriod:      {}
        };
    },

    methods: {
        ...mapActions([
            'createPeriod',
            'updatePeriod',
            'removePeriod',
            'updateEditModal'
        ]),
        openModal(period) {
            this.selectedPeriod  = period;
            this.modPeriod       = JSON.parse(JSON.stringify(period));
            const start          = this.modPeriod.start;
            const end            = this.modPeriod.end;
            this.modPeriod.start = parseDate(this.modPeriod.start);
            this.modPeriod.end   = parseDate(this.modPeriod.end);

            this.updateEditModal(true);

            this.$nextTick(() => {
                const $editdateStart   = this.$refs.editdatestart.$el;
                const $editdateEnd     = this.$refs.editdateend.$el;

                jQuery($editdateEnd).datetimepicker({
                    onChangeDateTime: ct => {
                        this.modPeriod.end = parseDate(ct);
                    },
                    format:'d/m/Y H:i'
                });

                jQuery($editdateStart).datetimepicker({
                    onChangeDateTime: ct => {
                        this.modPeriod.start = parseDate(ct);
                    },
                    format:'d/m/Y H:i'
                });
            });
        },
        closeModal() {
            this.updateEditModal(false);
        }
    },

   computed: {
        ...mapState({
            periods      : state => state.app.periods,
            currentEvent : state => state.global.currentEvent,
            openEditModal: state => state.global.openEditModal
        }),
        inputPeriod() {
            const name     = this.name;
            const start    = convertDate(this.dateStart);
            const end      = convertDate(this.dateEnd);
            this.name      = '';
            this.dateStart = '';
            this.dateEnd   = '';
            return {
                name    : name,
                start   : start,
                end     : end,
                Event_id: this.currentEvent.id
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

    mounted () {
        this.$nextTick(() => {
            console.log(this.$refs);
            const $createdateStart = this.$refs.createdatestart.$el;
            const $createdateEnd   = this.$refs.createdateend.$el;

            jQuery($createdateStart).datetimepicker({
                onChangeDateTime: ct => {
                    this.dateStart = parseDate(ct);
                },
                format:'d/m/Y H:i'
            });

            jQuery($createdateEnd).datetimepicker({
                onChangeDateTime: ct => {
                    this.dateEnd = parseDate(ct);
                },
                format:'d/m/Y H:i'
            });
        });
    }
}
</script>

<style lang="sass">
    @import '../main.scss';

    .b-periods {
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
