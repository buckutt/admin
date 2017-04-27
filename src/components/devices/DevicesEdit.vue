<template>
    <div class="b-devices b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Equipements</h3>
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
            <b-table
                :headers="[
                    { title: 'Point', field: 'point.name' },
                    { title: 'Période', field: 'period.name' }
                ]"
                :data="displayedPeriodPoints"
                :actions="[
                    { action: 'remove', text: 'Supprimer', type: 'confirm' }
                ]"
                route="periodPoints"
                :paging="5"
                @remove="removeObject">
            </b-table>
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
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import { saveAs }   from 'file-saver';
import { download } from '../../lib/fetch';

export default {
    data() {
        return {
            password   : '',
            periodPoint: {
                point : null,
                period: null
            }
        };
    },

    methods: {
        ...mapActions([
            'updateObject',
            'removeObject',
            'createMultipleRelation',
            'updateModObject',
            'showClientError'
        ]),
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
                        return this.showClientError({
                            message: 'Le point est déjà utilisé par un autre événement sur cette période'
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
                    this.showClientError({ message: 'Le téléchargement du certificat a échoué' });
                });
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
            currentEvent: state => state.app.currentEvent,
            modObject   : state => state.app.modObject
        }),
        ...mapGetters([
            'periodOptions',
            'pointOptions'
        ]),
        displayedPeriodPoints() {
            if (!this.modObject) {
                return [];
            }

            return this.modObject.periodPoints.map((periodPoint) => {
                if (periodPoint.period.Event_id === this.currentEvent.id) {
                    if (!periodPoint.point) {
                        periodPoint.point = { name: 'Aucun' };
                    }
                    return periodPoint;
                }
                return null;
            }).filter(a => a);
        }
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';
</style>
