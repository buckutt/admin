<template>
    <div>
        <div class="b-devices" v-if="currentEvent">
            <div class="mdl-card mdl-shadow--2dp">
                <h3>Equipements</h3>
                <transition name="fade">
                    <div v-if="selectedDevice.name">
                        <h5>Modifier {{ selectedDevice.name }}</h5>
                        <form @submit.prevent="updateDevice(modDevice)">
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
                                        <mdl-button @click.native="$root.confirm() && removePeriodPoint(periodPoint)">Supprimer</mdl-button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <br />
                        <h5>Génération du certificat SSL</h5>
                        <br />
                        <form v-on:submit.prevent="generateCert(selectedDevice, password)">
                            <mdl-textfield type="password" floating-label="Mot de passe souhaité" v-model="password"></mdl-textfield>
                            <mdl-button colored raised>Générer</mdl-button>
                        </form>
                        <br />
                        <mdl-button colored raised @click.native="goBack()">Retour</mdl-button>
                    </div>
                </transition>
                <transition name="fade">
                    <div v-if="!selectedDevice.name">
                        <form v-on:submit.prevent="createDevice(inputDevice)">
                            <mdl-textfield floating-label="Nom" v-model="name"></mdl-textfield><br />
                            <mdl-button colored raised>Créer</mdl-button>
                        </form>
                        <br />
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
                                        <mdl-button @click.native="$root.confirm() && removeDevice(device)">Supprimer</mdl-button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </transition>
            </div>
        </div>
        <mdl-snackbar display-on="snackfilter"></mdl-snackbar>
    </div>
</template>

<script>
import { get, post, put, download } from '../lib/fetch';
import { mapState, mapActions } from 'vuex';
import { saveAs } from 'file-saver';

export default {
    data () {
        return {
            name          : '',
            password      : '',
            selectedDevice: {},
            modDevice     : {
                realtime        : false,
                doubleValidation: false,
                alcohol         : false,
                showCategories  : false,
                showPicture     : false
            },
            detailsDevice : {},
            selectedPeriod: null,
            selectedPoint : null
        };
    },

    methods: {
        ...mapActions([
            'createDevice',
            'updateDevice',
            'removeDevice'
        ]),
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
            this.selectedPeriod = null;


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
            if (periodPoint.Point_id) {
                const filteredEvents = this.detailsDevice.periodPoints
                    .filter(pP => {
                        if (!pP.point) {
                            return false;
                        }

                        const samePoint = (periodPoint.Point_id == pP.point.id);
                        const overlap   = ((periodPoint.period.start <= pP.period.end) && (periodPoint.period.end >= pP.period.start));

                        return samePoint && overlap;
                    })
                    .map(pP => pP.period.Event_id);

                if (filteredEvents.length > 0) {
                    if (periodPoint.period.Event_id != filteredEvents[0]) {
                        return this.$root.$emit('snackfilter', {
                            message: 'Le point est déjà utilisé par un autre événement sur cette période',
                            timeout: 2000
                        });
                    }
                }
            }

            delete periodPoint.period;

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
        },
        generateCert(device, password) {
            download(`services/certificate?deviceId=${device.id}&password=${password}`)
                .then(result => {
                    saveAs(result, `${device.name}.p12`);
                })
                .catch(e => {
                    this.$root.$emit('snackfilter', {
                        message: 'Le téléchargement du certificat a échoué',
                        timeout: 2000
                    });
                });
        }
    },

    computed: {
        ...mapState({
            devices     : state => state.app.devices,
            points      : state => state.app.points,
            periods     : state => state.app.periods,
            currentEvent: state => state.global.currentEvent
        }),
        inputDevice() {
            const name          = this.name;
            this.name           = '';

            return {
                name,
                fingerprint     : '',
                realtime        : false,
                refreshInterval : 5,
                doubleValidation: false,
                alcohol         : false,
                showCategories  : false,
                showPicture     : false
            };
        },
        inputPeriodPoint() {
            const point         = this.selectedPoint;
            const period        = this.selectedPeriod;
            this.selectedPoint  = null;
            this.selectedPeriod = null;
            if(!point) {
                return {
                    Period_id: period.id
                }
            }
            return {
                Period_id: period.id,
                period   : period,
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

    .b-devices {
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

        & + .mdl-snackbar {
            margin-left: $sidebarWidth / 2;
        }
    }
</style>
