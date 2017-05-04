<template>
    <div class="b-periods b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <b-navbar
                title="Périodes"
                :tabs="[{ route: '', name: 'Édition' }]"
                :inCard="true"
                :goBack="true">
            </b-navbar>
            <h5>Modifier la période {{ modObject.name }}:</h5>
            <form @submit.prevent="updateObject({ route: 'periods', value: modObject })">
                <mdl-textfield floating-label="Nom" :value="modObject.name" @input="updateModObject({ field:'name', value: $event })" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield>
                <br />
                <mdl-textfield floating-label="Début" :value="modObject.start | date" @input="updateModObject({ field:'start', value: convertDate($event) })" required="required" pattern="\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}" error="Le début n'est pas une date" ref="dateStart"></mdl-textfield>

                <mdl-textfield floating-label="Fin" :value="modObject.end | date" @input="updateModObject({ field:'end', value: convertDate($event) })" required="required" pattern="\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}" error="La fin n'est pas une date" ref="dateEnd"></mdl-textfield>
                <br />
                <mdl-button colored raised>Modifier</mdl-button>
            </form>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { convertDate } from '../../lib/date';

export default {
    methods: {
        ...mapActions([
            'updateObject',
            'updateModObject'
        ]),
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
        }
    },

    computed: {
        ...mapState({
            currentEvent: state => state.app.currentEvent,
            modObject   : state => state.app.modObject
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
