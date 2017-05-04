<template>
    <div class="b-periods b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Périodes de "{{ currentEvent.name }}"</h3>
            <form @submit.prevent="createObject({ route: 'periods', value: inputPeriod() })">
                <mdl-textfield floating-label="Nom" v-model="newPeriod.name" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield>
                <br />
                <mdl-textfield floating-label="Début" :value="newPeriod.start | date" @input="updatePeriod('start', convertDate($event))" required="required" pattern="\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}" error="Le début n'est pas une date" ref="dateStart"></mdl-textfield>
                <mdl-textfield floating-label="Fin" :value="newPeriod.end | date" @input="updatePeriod('end', convertDate($event))" required="required" pattern="\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}" error="La fin n'est pas une date" ref="dateEnd"></mdl-textfield>
                <br />
                <mdl-button colored raised>Créer</mdl-button>
            </form>

            <br />

            <b-table
                :headers="[
                    { title: 'Période', field: 'name' },
                    { title: 'Début', field: 'start', type: 'date' },
                    { title: 'Fin', field: 'end', type: 'date'}
                ]"
                :data="displayedPeriods"
                :sort="{ field: 'start', order: 'ASC' }"
                :actions="[
                    { action: 'edit', text: 'Modifier', raised: true, colored: true },
                    { action: 'remove', text: 'Supprimer', type: 'confirm' }
                ]"
                route="periods"
                :paging="10"
                @edit="editPeriod"
                @remove="removeObject">
            </b-table>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { convertDate } from '../../lib/date';

const periodPattern = {
    name : '',
    start: '',
    end  : ''
};

export default {
    data() {
        return {
            newPeriod: Object.assign({}, periodPattern)
        };
    },

    methods: {
        ...mapActions([
            'createObject',
            'removeObject'
        ]),
        editPeriod(period) {
            this.$router.push(`/periods/edit/${period.id}`);
        },
        updatePeriod(field, value) {
            this.newPeriod[field] = value;
        },
        picker() {
            this.$nextTick(() => {
                const $dateStart = this.$refs.dateStart.$el;
                const $dateEnd   = this.$refs.dateEnd.$el;

                window.jQuery($dateStart).datetimepicker({
                    onChangeDateTime: (ct) => {
                        if (this.modObject) {
                            this.updateModObject({ field: 'start', value: new Date(ct) });
                        } else {
                            this.newPeriod.start = new Date(ct);
                        }
                    }
                });

                window.jQuery($dateEnd).datetimepicker({
                    onChangeDateTime: (ct) => {
                        if (this.modObject) {
                            this.updateModObject({ field: 'end', value: new Date(ct) });
                        } else {
                            this.newPeriod.end = new Date(ct);
                        }
                    }
                });
            });
        },
        convertDate(date) {
            return convertDate(date);
        },
        inputPeriod() {
            const inputPeriod    = Object.assign({}, this.newPeriod);
            this.newPeriod       = Object.assign({}, periodPattern);
            inputPeriod.Event_id = this.currentEvent.id;

            return inputPeriod;
        }
    },

    computed: {
        ...mapState({
            currentEvent: state => state.app.currentEvent,
            periods     : state => state.objects.periods
        }),
        displayedPeriods() {
            return this.periods.filter(period => (period.Event_id === this.currentEvent.id));
        }
    },

    mounted() {
        this.picker();
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';
</style>
