<template>
    <div class="b-devices">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Equipements</h3>
            <transition name="fade">
                <div v-if="modObject">
                    <h5>Modifier {{ modObject.name }}</h5>
                    <form @submit.prevent="updateObject({ route: 'devices', value: modObject })">
                        <mdl-textfield floating-label="Nom" :value="modObject.name" @input="updateModObject({ field:'name', value: $event })" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield>
                        <mdl-textfield floating-label="Intervalle de rafraichissement" :value="modObject.refreshInterval" @input="updateModObject({ field:'refreshInterval', value: $event })"></mdl-textfield>
                        <mdl-switch :value="modObject.realtime" @input="updateModObject({ field:'realtime', value: $event })" class="mdl-js-ripple-effect">Temps réel</mdl-switch><br />
                        <mdl-switch :value="modObject.doubleValidation" @input="updateModObject({ field:'doubleValidation', value: $event })" class="mdl-js-ripple-effect">Revalidation post-achats</mdl-switch><br />
                        <mdl-switch :value="modObject.alcohol" @input="updateModObject({ field:'alcohol', value: $event })" class="mdl-js-ripple-effect">Avertissement alcool</mdl-switch><br />
                        <mdl-switch :value="modObject.showCategories" @input="updateModObject({ field:'showCategories', value: $event })" class="mdl-js-ripple-effect">Afficher les catégories</mdl-switch><br />
                        <mdl-switch :value="modObject.showPicture" @input="updateModObject({ field:'showPicture', value: $event })" class="mdl-js-ripple-effect">Afficher l'image utilisateur</mdl-switch><br />

                        <mdl-button colored raised>Modifier</mdl-button>
                    </form>
                    <br />
                    <h5>Assigner l'équipement</h5>
                    <br />
                    <form @submit.prevent="createPeriodPoint(modObject, inputPeriodPoint())">
                        <mdl-select label="Point" id="point-select" v-model="periodPoint.point" :options="pointOptions"></mdl-select>
                        <mdl-select label="Période" id="period-select" v-model="periodPoint.period" :options="periodOptions"></mdl-select>

                        <mdl-button colored raised>Ajouter</mdl-button>
                    </form>
                    <div class="b-responsive-table">
                        <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                            <thead>
                                <tr>
                                    <th class="mdl-data-table__cell--non-numeric">Point</th>
                                    <th class="mdl-data-table__cell--non-numeric">Période</th>
                                    <th class="mdl-data-table__cell--non-numeric">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="periodPoint in modObject.periodPoints" v-show="periodPoint.period.Event_id == currentEvent.id">
                                    <td class="mdl-data-table__cell--non-numeric" v-if="periodPoint.point">{{ periodPoint.point.name }}</td>
                                    <td class="mdl-data-table__cell--non-numeric" v-else>Aucun</td>
                                    <td class="mdl-data-table__cell--non-numeric">{{ periodPoint.period.name }}</td>
                                    <td class="mdl-data-table__cell--non-numeric">
                                        <mdl-button raised accent @click.native="$root.confirm() && removeObject({ route: 'periodPoints', value: periodPoint })">Supprimer</mdl-button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <br />
                    <h5>Génération du certificat SSL</h5>
                    <br />
                    <form v-on:submit.prevent="generateCert(modObject, password)">
                        <mdl-textfield type="password" floating-label="Mot de passe souhaité" v-model="password"></mdl-textfield>
                        <mdl-button colored raised>Générer</mdl-button>
                    </form>
                    <br />
                    <mdl-button colored raised @click.native="$root.goBack()">Retour</mdl-button>
                </div>
            </transition>
            <transition name="fade">
                <div v-if="!modObject">
                    <form v-on:submit.prevent="createObject({ route: 'devices', value: inputDevice() })">
                        <mdl-textfield floating-label="Nom" v-model="newDevice.name" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield><br />
                        <mdl-button colored raised>Créer</mdl-button>
                    </form>
                    <br />
                    <div class="b-responsive-table">
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
                                    <td class="mdl-data-table__cell--non-numeric b-actions-cell">
                                        <mdl-button raised colored @click.native="expandDevice(device)">Modifier</mdl-button>
                                        <mdl-button raised accent @click.native="$root.confirm() && removeObject({ route: 'devices', value: device })">Supprimer</mdl-button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { saveAs }   from 'file-saver';
import { download } from '../lib/fetch';

const devicePattern = {
    name            : '',
    fingerprint     : '',
    realtime        : false,
    refreshInterval : 5,
    doubleValidation: false,
    alcohol         : false,
    showCategories  : false,
    showPicture     : false
};

export default {
    data() {
        return {
            newDevice  : Object.assign({}, devicePattern),
            password   : '',
            periodPoint: {
                point : null,
                period: null
            }
        };
    },

    methods: {
        ...mapActions([
            'createObject',
            'updateObject',
            'removeObject',
            'expandObject',
            'createMultipleRelation',
            'updateModObject'
        ]),
        expandDevice(device) {
            this.$router.push(`/devices/${device.id}`);

            this.expandObject({
                route: 'devices',
                value: device
            });
        },
        createPeriodPoint(device, periodPoint) {
            if (periodPoint.Point_id) {
                const filteredEvents = this.modObject.periodPoints
                    .filter((pP) => {
                        if (!pP.point) {
                            return false;
                        }

                        const samePoint = (periodPoint.Point_id === pP.point.id);
                        const overlap   = ((periodPoint.period.start <= pP.period.end)
                            && (periodPoint.period.end >= pP.period.start));

                        return samePoint && overlap;
                    })
                    .map(pP => pP.period.Event_id);

                if (filteredEvents.length > 0) {
                    if (periodPoint.period.Event_id !== filteredEvents[0]) {
                        return this.$root.$emit('snackfilter', {
                            message: 'Le point est déjà utilisé par un autre événement sur cette période',
                            timeout: 2000
                        });
                    }
                }
            }

            delete periodPoint.period;

            this.createMultipleRelation({
                obj: {
                    route: 'devices',
                    value: device
                },
                relation: {
                    route : 'periodPoints',
                    fields: periodPoint
                }
            });
        },
        generateCert(device, password) {
            download(`services/certificate?deviceId=${device.id}&password=${password}`)
                .then((result) => {
                    saveAs(result, `${device.name}.p12`);
                })
                .catch(() => {
                    this.$root.$emit('snackfilter', {
                        message: 'Le téléchargement du certificat a échoué',
                        timeout: 2000
                    });
                });
        },
        inputDevice() {
            const inputDevice = Object.assign({}, this.newDevice);
            this.newDevice    = Object.assign({}, devicePattern);

            return inputDevice;
        },
        inputPeriodPoint() {
            const periodPoint = Object.assign({}, this.periodPoint);

            Object.keys(this.periodPoint).map((key) => {
                this.periodPoint[key] = null;
            });

            if (periodPoint.point) {
                periodPoint.Point_id = periodPoint.point.id;
                delete periodPoint.point;
            }

            if (periodPoint.period) {
                periodPoint.Period_id = periodPoint.period.id;
            }

            return periodPoint;
        }
    },

    computed: {
        ...mapState({
            devices     : state => state.app.devices,
            points      : state => state.app.points,
            periods     : state => state.app.periods,
            currentEvent: state => state.global.currentEvent,
            modObject   : state => state.app.modObject,
            params      : state => state.route.params
        }),
        periodOptions() {
            return this.periods.map((period) => {
                if (period.Event_id === this.currentEvent.id) {
                    return { name: period.name, value: period };
                }
                return null;
            }).filter(a => a);
        },
        pointOptions() {
            return this.points.map(point => ({ name: point.name, value: point }));
        }
    },

    mounted() {
        if (this.params.id) {
            this.expandDevice({ id: this.params.id });
        }
    }
};
</script>

<style lang="scss">
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
    }
</style>
