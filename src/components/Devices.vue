<template>
    <div class="devices">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Equipements</h3>
            <div v-show="selectedDevice.name" transition="fade">
                <h5>Modifier {{ selectedDevice.name }}</h5>
                <form v-on:submit.prevent>
                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                        <input class="mdl-textfield__input" type="text" id="name" v-model="modDevice.name">
                        <label class="mdl-textfield__label" for="name">Nom</label>
                    </div>
                    <switch :checked.sync="modDevice.offline">Support hors-ligne</switch><br/>
                    <switch :checked.sync="modDevice.doubleValidation">Revalidation post-achats</switch><br/>
                    <switch :checked.sync="modDevice.alcohol">Avertissement alcool</switch><br/>
                    <switch :checked.sync="modDevice.showCategories">Afficher les catégories</switch><br/>
                    <switch :checked.sync="modDevice.showPicture">Afficher l'image utilisateur</switch><br/>
                    <input type="submit" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" @click="updateDevice(selectedDevice, modDevice)" value="Modifier">
                </form>
                <br />
                <h5>Assigner l'équipement</h5>
                <br />
                <form v-on:submit.prevent>
                    <select v-model="selectedPoint">
                        <option v-bind:value="null" selected>Aucun</option>
                        <option v-bind:value="point" v-for="point in points">{{ point.name }}</option>
                    </select>
                    <select v-model="selectedPeriod">
                        <option v-bind:value="period" v-for="period in periods">{{ period.name }}</option>
                    </select>
                    <input type="submit" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" @click="createPeriodPoint(selectedDevice, inputPeriodPoint)" value="Ajouter">
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
                        <tr v-for="periodPoint in detailsDevice.periodPoints">
                            <td class="mdl-data-table__cell--non-numeric" v-if="periodPoint.point">{{ periodPoint.point.name }}</td>
                            <td class="mdl-data-table__cell--non-numeric" v-else>Aucun</td>
                            <td class="mdl-data-table__cell--non-numeric">{{ periodPoint.period.name }}</td>
                            <td class="mdl-data-table__cell--non-numeric">
                                <button id="show-dialog" type="button" class="mdl-button" @click="removePeriodPoint(periodPoint)">Supprimer</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" @click="goBack()">Retour</button>
            </div>
            <div v-if="!selectedDevice.name" transition="fade">
                <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                    <thead>
                        <tr>
                            <th class="mdl-data-table__cell--non-numeric">Equipement</th>
                            <th class="mdl-data-table__cell--non-numeric">Hors-ligne</th>
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
                                <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect">
                                    <input type="checkbox" class="mdl-checkbox__input" :checked.once="device.offline" disabled>
                                </label>
                            </td>
                            <td class="mdl-data-table__cell--non-numeric">
                                <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect">
                                    <input type="checkbox" class="mdl-checkbox__input" :checked.once="device.doubleValidation" disabled>
                                </label>
                            </td>
                            <td class="mdl-data-table__cell--non-numeric">
                                <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect">
                                    <input type="checkbox" class="mdl-checkbox__input" :checked.once="device.alcohol" disabled>
                                </label>
                            </td>
                            <td class="mdl-data-table__cell--non-numeric">
                                <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect">
                                    <input type="checkbox" class="mdl-checkbox__input" :checked.once="device.showCategories" disabled>
                                </label>
                            </td>
                            <td class="mdl-data-table__cell--non-numeric">
                                <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect">
                                    <input type="checkbox" class="mdl-checkbox__input" :checked.once="device.showPicture" disabled>
                                </label>
                            </td>
                            <td class="mdl-data-table__cell--non-numeric">
                                <button id="show-dialog" type="button" class="mdl-button" @click="editDevice(device)">Modifier</button>
                                <button id="show-dialog" type="button" class="mdl-button" @click="removeDevice(device)">Supprimer</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import { get, post, put } from '../lib/fetch';
import { updateDevice, removeDevice } from '../store/actions';
import Switch from './switch.vue';

export default {
    vuex: {
        getters: {
            devices: state => state.app.devices,
            points : state => state.app.points,
            periods: state => state.app.periods
        },
        actions: {
            updateDevice: updateDevice,
            removeDevice: removeDevice
        }
    },

    data () {
        return {
            name          : '',
            selectedDevice: {},
            modDevice     : {},
            detailsDevice : {},
            selectedPeriod: {},
            selectedPoint : {}
        };
    },

    components: {
        Switch
    },

    methods: {
        goBack() {
            this.selectedDevice = {};
            this.modDevice      = {};
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

        .fade-transition {
            transition: opacity .4s ease;
        }
        .fade-enter {
            opacity: 0;
        }
        .fade-leave {
            display: none;
        }
    }
</style>
