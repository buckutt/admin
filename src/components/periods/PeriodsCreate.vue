<template>
    <div>
        <h5>Créer une période</h5>
        <form @submit.prevent="createPeriod(newPeriod)">
            <mdl-textfield floating-label="Nom" v-model="newPeriod.name" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield>
            <br />
            <mdl-textfield floating-label="Début" :value="newPeriod.start | date" @input="updatePeriod('start', convertDate($event))" required="required" pattern="\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}" error="Le début n'est pas une date" ref="dateStart"></mdl-textfield>
            <mdl-textfield floating-label="Fin" :value="newPeriod.end | date" @input="updatePeriod('end', convertDate($event))" required="required" pattern="\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}" error="La fin n'est pas une date" ref="dateEnd"></mdl-textfield>
            <br />
            <mdl-button colored raised>Créer</mdl-button>
        </form>
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
            'createObject'
        ]),
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
        createPeriod(period) {
            period.Event_id = this.currentEvent.id;
            this.createObject({ route: 'periods', value: period });
            this.newPeriod = Object.assign({}, periodPattern);
        }
    },

    computed: {
        ...mapState({
            currentEvent: state => state.app.currentEvent
        })
    },

    mounted() {
        this.picker();
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';
</style>
