<template>
    <div class="b-wikets b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <b-navbar
                :title="title"
                :tabs="[{ route: 'assign', name: 'Assigner des équipements' }]"
                :inCard="true"
                :goBack="true"
                :level="2">
            </b-navbar>

            <h5>Équipements</h5>
            <form @submit.prevent="createWiket(wiket)">
                <b-inputselect label="Équipement" id="device-select" :options="deviceOptions" v-model="wiket.device"></b-inputselect>
                <b-inputselect label="Période" id="period-select" :options="currentPeriodOptions" :fullOptions="periodOptions" v-model="wiket.period" v-if="currentEvent.usePeriods"></b-inputselect>
                <mdl-button colored raised :disabled="disabledAdd">Ajouter</mdl-button>
            </form>
            <b-table
                :headers="displayedColumns"
                :data="displayedWikets"
                :actions="[
                    { action: 'remove', text: 'Supprimer', type: 'confirm' }
                ]"
                route="wikets"
                :paging="5"
                @remove="removeObject">
            </b-table>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import { isPointUsedByEvent } from './isPointUsedByEvent';

const wiketPattern = {
    device: null,
    period: null,
    point : null
};

export default {
    data() {
        return {
            wiket: Object.assign({}, wiketPattern)
        };
    },

    methods: {
        ...mapActions([
            'createObject',
            'removeObject',
            'notify',
            'notifyError'
        ]),

        createWiket(wiket) {
            wiket.point  = this.modObject;
            wiket.period = (this.currentEvent.usePeriods)
                ? wiket.period
                : this.currentEvent.defaultPeriod;

            if (isPointUsedByEvent(this.modObject.wikets, wiket)) {
                return this.notifyError({
                    message: 'Le guichet est déjà utilisé par un autre événement pendant cette période'
                });
            }

            const newWiket = {
                point_id : wiket.point.id,
                device_id: wiket.device.id
            };

            if (wiket.period) {
                newWiket.period_id = wiket.period.id;
            }

            this
                .createObject({
                    route: 'wikets',
                    value: newWiket
                })
                .then(() => {
                    this.wiket = Object.assign({}, wiketPattern);
                    this.notify({ message: 'L\'équipement a bien été assigné au point' });
                })
                .catch(err => this.notifyError({
                    message: 'L\'équipement n\'a pas pu être assigné au point',
                    full   : err
                }));
        }
    },
    computed: {
        ...mapState({
            currentEvent: state => state.app.currentEvent,
            modObject   : state => state.app.modObject
        }),

        ...mapGetters([
            'periodOptions',
            'currentPeriodOptions',
            'deviceOptions'
        ]),

        title() {
            return `Guichet ${this.modObject.name}`;
        },

        displayedColumns() {
            const columns = [{ title: 'Équipement', field: 'device.name' }];

            if (this.currentEvent.usePeriods) {
                columns.push({ title: 'Période', field: 'period.name' });
            }

            return columns;
        },

        displayedWikets() {
            return (!this.modObject) ? [] : this.modObject.wikets
                .filter(wiket => (wiket.period.event_id === this.currentEvent.id))
                .map((wiket) => {
                    if (wiket.period.id !== this.currentEvent.defaultPeriod_id
                        && !this.currentEvent.usePeriods) {
                        wiket.warning = 'Une période autre que<br />celle par défaut est utilisée.';
                    }

                    return wiket;
                });
        },

        disabledAdd() {
            return (!this.wiket.period && this.currentEvent.usePeriods) || !this.wiket.device;
        }
    }
};
</script>
