<template>
    <div class="devices" v-if="currentEvent">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Equipements</h3>
            <transition name="fade">
                <div v-if="selectedDevice.name">
                    <h5>Modifier {{ selectedDevice.name }}</h5>
                    <form @submit.prevent="updateDevice(selectedDevice, modDevice)">
                        <mdl-textfield floating-label="Nom" v-model="modDevice.name"></mdl-textfield>
                        <mdl-textfield floating-label="Intervalle de rafraichissement" v-model="modDevice.refreshInterval"></mdl-textfield>
                        <mdl-switch v-model="modDevice.realtime" class="mdl-js-ripple-effect">Temps réel</mdl-switch><br />
                        <mdl-switch v-model="modDevice.doubleValidation" class="mdl-js-ripple-effect">Revalidation post-achats</mdl-switch><br />
                        <mdl-switch v-model="modDevice.alcohol" class="mdl-js-ripple-effect">Avertissement alcool</mdl-switch><br />
                        <mdl-switch v-model="modDevice.showCategories" class="mdl-js-ripple-effect">Afficher les catégories</mdl-switch><br />
                        <mdl-switch v-model="modDevice.showPicture" class="mdl-js-ripple-effect">Afficher l'image utilisateur</mdl-switch><br />

                        <mdl-button colored raised>Modifier</mdl-button>
                    </form>
                    <br />
                    <h5>Assigner l'équipement</h5>
                    <br />
                    <form @submit.prevent="createPeriodPoint(selectedDevice, inputPeriodPoint)">
                        <mdl-select label="Point" id="point-select" v-model="selectedPoint" :options="pointOptions"></mdl-select>
                        <mdl-select label="Période" id="period-select" v-model="selectedPeriod" :options="periodOptions"></mdl-select>

                        <mdl-button colored raised>Ajouter</mdl-button>
                    </form>
                    <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                        <thead>
                            <tr>
                                <th class="mdl-data-table__cell--non-numeric">Point</th>
                                <th class="mdl-data-table__cell--non-numeric">Période</th>
                                <th class="mdl-data-table__cell--non-numeric">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="periodPoint in detailsDevice.periodPoints" v-show="periodPoint.period.Event_id == currentEvent.id">
                                <td class="mdl-data-table__cell--non-numeric" v-if="periodPoint.point">{{ periodPoint.point.name }}</td>
                                <td class="mdl-data-table__cell--non-numeric" v-else>Aucun</td>
                                <td class="mdl-data-table__cell--non-numeric">{{ periodPoint.period.name }}</td>
                                <td class="mdl-data-table__cell--non-numeric">
                                    <mdl-button @click.native="removePeriodPoint(periodPoint)">Supprimer</mdl-button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <br />
                    <mdl-button colored raised @click.native="goBack()">Retour</mdl-button>
                </div>
            </transition>
            <transition name="fade">
                <div v-if="!selectedDevice.name">
                    <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                        <thead>
                            <tr>
                                <th class="mdl-data-table__cell--non-numeric">Equipement</th>
                                <th class="mdl-data-table__cell--non-numeric">Temps réel</th>
                                <th class="mdl-data-table__cell--non-numeric">Intervalle</th>
                                <th class="mdl-data-table__cell--non-numeric">Revalidation</th>
                                <th class="mdl-data-table__cell--non-numeric">Alcool</th>
                                <th class="mdl-data-table__cell--non-numeric">Catégories</th>
                                <th class="mdl-data-table__cell--non-numeric">Image</th>
                                <th class="mdl-data-table__cell--non-numeric">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="device in devices">
                                <td class="mdl-data-table__cell--non-numeric">{{ device.name }}</td>
                                <td class="mdl-data-table__cell--non-numeric">
                                    <mdl-checkbox v-model="device.realtime" disabled></mdl-checkbox>
                                </td>
                                <td class="mdl-data-table__cell--non-numeric">{{ device.refreshInterval }}</td>
                                <td class="mdl-data-table__cell--non-numeric">
                                    <mdl-checkbox v-model="device.doubleValidation" disabled></mdl-checkbox>
                                </td>
                                <td class="mdl-data-table__cell--non-numeric">
                                    <mdl-checkbox v-model="device.alcohol" disabled></mdl-checkbox>
                                </td>
                                <td class="mdl-data-table__cell--non-numeric">
                                    <mdl-checkbox v-model="device.showCategories" disabled></mdl-checkbox>
                                </td>
                                <td class="mdl-data-table__cell--non-numeric">
                                    <mdl-checkbox v-model="device.showPicture" disabled></mdl-checkbox>
                                </td>
                                <td class="mdl-data-table__cell--non-numeric">
                                    <mdl-button @click.native="editDevice(device)">Modifier</mdl-button>
                                    <mdl-button @click.native="removeDevice(device)">Supprimer</mdl-button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import { get, post, put } from '../lib/fetch';
import { updateDevice, removeDevice } from '../store/actions';

export default {
    vuex: {
        getters: {
            devices     : state => state.app.devices,
            points      : state => state.app.points,
            periods     : state => state.app.periods,
            currentEvent: state => state.global.currentEvent
        },
        actions: {
            updateDevice,
            removeDevice
        }
    },

    data () {
        return {
            selectedDevice: {},
            modDevice     : {
                realtime        : false,
                doubleValidation: false,
                alcohol         : false,
                showCategories  : false,
                showPicture     : false
            },
            detailsDevice : {},
            selectedPeriod: {},
            selectedPoint : {}
        };
    },

    methods: {
        goBack() {
            this.selectedDevice = {};
            this.modDevice      = {
                realtime        : false,
                doubleValidation: false,
                alcohol         : false,
                showCategories  : false,
                showPicture     : false
            };
        },
        editDevice(device) {
            this.selectedDevice = device;
            this.modDevice      = JSON.parse(JSON.stringify(device));
            this.selectedPoint  = null;
            this.selectedPeriod = this.$store.state.app.periods[0];


            const embedDevices = encodeURIComponent(JSON.stringify({
                periodPoints: {
                    period: true,
                    point : true
                }
            }));

            get(`devices/${device.id}?embed=${embedDevices}`)
                .then(result => {
                    if(result.periodPoints) {
                        result.periodPoints = result.periodPoints.filter(periodPoint => {
                            return !periodPoint.isRemoved;
                        });
                    }
                    this.detailsDevice = result;
                });
        },
        createPeriodPoint(device, periodPoint) {
            let currentPeriodPoint  = {};
            const embedPeriodPoint  = encodeURIComponent(JSON.stringify({
                point : true,
                period: true
            }));
            post(`periodPoints?embed=${embedPeriodPoint}`, periodPoint)
                .then(result => {
                    currentPeriodPoint = result;
                    return post(`devices/${device.id}/periodPoints`, {id: result.id});
                })
                .then(result => {
                    this.detailsDevice.periodPoints.push(currentPeriodPoint);
                });
        },
        removePeriodPoint(periodPoint) {
            periodPoint.isRemoved = true;
            put(`periodPoints/${periodPoint.id}`, periodPoint)
                .then(result => {
                    let i = 0;
                    for(const p of this.detailsDevice.periodPoints) {
                        if(p.id === periodPoint.id) {
                            break;
                        }
                        ++i;
                    }
                    this.detailsDevice.periodPoints.splice(i, 1);
                });
        }
    },

    computed: {
        inputPeriodPoint() {
            const point         = this.selectedPoint;
            const period        = this.selectedPeriod;
            this.selectedPoint  = null;
            this.selectedPeriod = this.$store.state.app.periods[0];
            if(!point) {
                return {
                    Period_id: period.id
                }
            }
            return {
                Period_id: period.id,
                Point_id : point.id
            }
        },
        periodOptions() {
            let periods = this.periods.map(period => {
                if(period.Event_id == this.currentEvent.id) {
                    return { name: period.name, value: period };
                } else {
                    return null;
                }
            });

            return periods.filter(a => a);
        },
        pointOptions() {
            return this.points.map(point => {
                return { name: point.name, value: point };
            });
        }
    }
}
</script>

<style lang="sass">
    @import '../main.scss';

    .devices {
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
