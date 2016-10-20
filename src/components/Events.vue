<template>
    <div class="events">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Évenements</h3>
            <div v-show="selectedEvent.name" transition="fade">
                <h5>Modifier l'évenement {{ selectedEvent.name }}:</h5>
                <form v-on:submit.prevent>
                    <mdl-textfield floating-label="Nom" :value.sync="modEvent.name"></mdl-textfield><br />
                    <mdl-textfield floating-label="Rechargement minimal (en centimes)" :value.sync="modEvent.config.minReload"></mdl-textfield><br />
                    <mdl-textfield floating-label="Solde maximal (en centimes)" :value.sync="modEvent.config.maxPerAccount"></mdl-textfield><br />
                    <mdl-button colored raised @click="updateEvent(selectedEvent, modEvent)">Modifier</mdl-button>
                </form>
                <br />
                <mdl-button colored raised @click="goBack()">Retour</mdl-button>
            </div>
            <div v-show="!selectedEvent.name" transition="fade">
                <form v-on:submit.prevent>
                    <mdl-textfield floating-label="Nom" :value.sync="name"></mdl-textfield><br />
                    <mdl-textfield floating-label="Rechargement minimal (en centimes)" :value.sync="minReload"></mdl-textfield><br />
                    <mdl-textfield floating-label="Solde maximal (en centimes)" :value.sync="maxPerAccount"></mdl-textfield><br />
                    <mdl-button colored raised @click="createEvent(inputEvent)">Créer</mdl-button>
                </form>
                <br>
                <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp" v-show="events.length > 0">
                    <thead>
                        <tr>
                            <th class="mdl-data-table__cell--non-numeric">Évenement</th>
                            <th class="mdl-data-table__cell--non-numeric">Rechargement minimal</th>
                            <th class="mdl-data-table__cell--non-numeric">Solde maximal</th>
                            <th class="mdl-data-table__cell--non-numeric">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="event in events">
                            <td class="mdl-data-table__cell--non-numeric">{{ event.name }}</td>
                            <td class="mdl-data-table__cell--non-numeric">{{ event.config.minReload | price true }}</td>
                            <td class="mdl-data-table__cell--non-numeric">{{ event.config.maxPerAccount | price true }}</td>
                            <td class="mdl-data-table__cell--non-numeric">
                                <mdl-button @click="editEvent(event)">Modifier</mdl-button>
                                <mdl-button @click="removeEvent(event)">Supprimer</mdl-button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import price from '../lib/price';
import { get, post, del } from '../lib/fetch';
import { createEvent, updateEvent, removeEvent } from '../store/actions';

export default {
    vuex: {
        getters: {
            events : state => state.app.events,
            periods: state => state.app.periods
        },
        actions: {
            createEvent: createEvent,
            updateEvent: updateEvent,
            removeEvent: removeEvent
        }
    },

    data () {
        return {
            name          : '',
            minReload     : 0,
            maxPerAccount : 10000,
            selectedEvent : {},
            modEvent      : {},
            detailsEvent  : {}
        };
    },

    methods: {
        goBack() {
            this.selectedEvent = {};
            this.modEvent      = {};
        },
        editEvent(event) {
            this.selectedEvent  = event;
            this.modEvent       = JSON.parse(JSON.stringify(event));

            const embedEvents = encodeURIComponent(JSON.stringify({
                periods: true
            }));

            get(`events/${event.id}?embed=${embedEvents}`)
                .then(result => {
                    if(result.periods) {
                        result.periods = result.periods.filter(period => {
                            return !period.isRemoved;
                        });
                    }
                    this.detailsEvent = result;
                });
        }
    },

    computed: {
        inputEvent() {
            const name          = this.name;
            const minReload     = this.minReload;
            const maxPerAccount = this.maxPerAccount;
            this.name           = '';
            this.minReload      = 0;
            this.maxPerAccount  = 10000;

            return {
                name: name,
                config: {
                    minReload    : minReload,
                    maxPerAccount: maxPerAccount
                }
            };
        }
    }
}
</script>

<style lang="sass">
    @import '../main.scss';

    .events {
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
