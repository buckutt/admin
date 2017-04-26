<template>
    <div class="b-periods">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Périodes de "{{ currentEvent.name }}"</h3>
            <transition name="fade" @after-enter="picker">
                <div v-if="modObject">
                    <h5>Modifier la période {{ modObject.name }}:</h5>
                    <form @submit.prevent="updateObject({ route: 'periods', value: modObject })">
                        <mdl-textfield floating-label="Nom" :value="modObject.name" @input="updateModObject({ field:'name', value: $event })" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield>
                        <br />
                        <mdl-textfield floating-label="Début" :value="modObject.start | date" @input="updateModObject({ field:'start', value: convertDate($event) })" required="required" pattern="\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}" error="Le début n'est pas une date" ref="dateStart"></mdl-textfield>

                        <mdl-textfield floating-label="Fin" :value="modObject.end | date" @input="updateModObject({ field:'end', value: convertDate($event) })" required="required" pattern="\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}" error="La fin n'est pas une date" ref="dateEnd"></mdl-textfield>
                        <br />
                        <mdl-button colored raised>Modifier</mdl-button>
                    </form>
                    <br />
                    <mdl-button colored raised @click.native="$root.goBack()">Retour</mdl-button>
                </div>
            </transition>
            <transition name="fade" @after-enter="picker">
                <div v-if="!modObject">
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
                        @edit="expandPeriod"
                        @remove="removeObject">
                    </b-table>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { convertDate } from '../lib/date';

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
            'updateObject',
            'removeObject',
            'expandObject',
            'updateModObject'
        ]),
        expandPeriod(period) {
            this.$router.push(`/periods/${period.id}`);

            this.expandObject({
                route: 'periods',
                value: period
            });
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
            periods     : state => state.objects.periods,
            currentEvent: state => state.app.currentEvent,
            modObject   : state => state.app.modObject,
            params      : state => state.route.params
        }),
        displayedPeriods() {
            return this.periods.map((period) => {
                if (period.Event_id === this.currentEvent.id) {
                    return period;
                }
                return null;
            }).filter(a => a);
        }
    },

    mounted() {
        this.picker();

        if (this.params.id) {
            this.expandPeriod({ id: this.params.id });
        }
    }
};
</script>

<style lang="scss">
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
