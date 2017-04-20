<template>
    <div class="b-events">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Évenements</h3>
            <transition name="fade">
                <div v-if="modObject">
                    <h5>Modifier l'évenement {{ modObject.name }}:</h5>
                    <form @submit.prevent="updateObject({ route: 'events', value: modObject })">
                        <mdl-textfield floating-label="Nom" :value="modObject.name" @input="updateModObject({ field:'name', value: $event })"></mdl-textfield required="required" error="Le nom doit contenir au moins un caractère"><br />
                        <mdl-textfield floating-label="Rechargement minimal (en centimes)" :value="modObject.config.minReload" @input="updateModObject({ field:'config.minReload', value: $event })" required="required" pattern="[0-9]+" error="Le montant doit être un entier"></mdl-textfield><br />
                        <mdl-textfield floating-label="Solde maximal (en centimes)" :value="modObject.config.maxPerAccount" @input="updateModObject({ field:'config.maxPerAccount', value: $event })" required="required" pattern="[0-9]+" error="Le montant doit être un entier"></mdl-textfield><br />
                        <mdl-textfield floating-label="Unités alcool maximale/participant" :value="modObject.config.maxAlcohol" @input="updateModObject({ field:'config.maxAlcohol', value: $event })" required="required" pattern="[0-9]+" error="Les unités doivent être un entier"></mdl-textfield><br />
                        <mdl-button colored raised>Modifier</mdl-button>
                    </form>
                    <br />
                    <mdl-button colored raised @click.native="$root.goBack()">Retour</mdl-button>
                </div>
            </transition>
            <transition name="fade">
                <div v-if="!modObject">
                    <form v-on:submit.prevent="createObject({ route: 'events', value: inputEvent() })">
                        <mdl-textfield floating-label="Nom" v-model="newEvent.name" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield><br />
                        <mdl-textfield floating-label="Rechargement minimal (en centimes)" v-model="newEvent.config.minReload" required="required" pattern="[0-9]+" error="Le montant doit être un entier"></mdl-textfield><br />
                        <mdl-textfield floating-label="Solde maximal (en centimes)" v-model="newEvent.config.maxPerAccount" required="required" pattern="[0-9]+" error="Le montant doit être un entier"></mdl-textfield><br />
                        <mdl-textfield floating-label="Unités alcool maximale/participant" v-model="newEvent.config.maxAlcohol" required="required" pattern="[0-9]+" error="Les unités doivent être un entier"></mdl-textfield><br />
                        <mdl-button colored raised>Créer</mdl-button>
                    </form>
                    <br />
                    <div class="b-responsive-table">
                        <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp" v-show="events.length > 0">
                            <thead>
                                <tr>
                                    <th class="mdl-data-table__cell--non-numeric">Évenement</th>
                                    <th class="mdl-data-table__cell--non-numeric">Rechargement minimal</th>
                                    <th class="mdl-data-table__cell--non-numeric">Solde maximal</th>
                                    <th class="mdl-data-table__cell--non-numeric">Alcool maximal</th>
                                    <th class="mdl-data-table__cell--non-numeric">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="event in events">
                                    <td class="mdl-data-table__cell--non-numeric">{{ event.name }}</td>
                                    <td class="mdl-data-table__cell--non-numeric">{{ event.config.minReload | price(true) }}</td>
                                    <td class="mdl-data-table__cell--non-numeric">{{ event.config.maxPerAccount | price(true) }}</td>
                                    <td class="mdl-data-table__cell--non-numeric">{{ event.config.maxAlcohol }}</td>
                                    <td class="mdl-data-table__cell--non-numeric b-actions-cell">
                                        <mdl-button raised colored @click.native="expandEvent(event)">Modifier</mdl-button>
                                        <b-confirm @confirm="removeObject({ route: 'events', value: event })">Supprimer</b-confirm>
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
import '../lib/price';

const eventPattern = {
    name  : '',
    config: {
        minReload    : 0,
        maxPerAccount: 10000,
        maxAlcohol   : 0
    }
};

export default {
    data() {
        return {
            newEvent: Object.assign({}, eventPattern)
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
        expandEvent(event) {
            this.$router.push(`/events/${event.id}`);

            this.expandObject({
                route: 'events',
                value: event
            });
        },
        inputEvent() {
            const inputEvent = Object.assign({}, this.newEvent);
            this.newEvent    = Object.assign({}, eventPattern);

            return inputEvent;
        }
    },

    computed: {
        ...mapState({
            events   : state => state.objects.events,
            modObject: state => state.app.modObject,
            params   : state => state.route.params
        })
    },

    mounted() {
        if (this.params.id) {
            this.expandEvent({ id: this.params.id });
        }
    }
};
</script>

<style lang="scss">
    @import '../main.scss';

    .b-events {
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
