<template>
    <div class="events">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Évenements</h3>
            <div v-show="selectedEvent.name" transition="fade">
                <h5>Modifier l'évenement {{ selectedEvent.name }}:</h5>
                <form v-on:submit.prevent>
                    <mdl-textfield floating-label="Nom" :value.sync="modEvent.name"></mdl-textfield><br />
                    <mdl-button colored raised @click="updateEvent(selectedEvent, modEvent)">Modifier</mdl-button>
                </form>
                <br />
                <h5>Périodes liées</h5>
                <form v-on:submit.prevent>
                    <mdl-select label="Période" id="period-select" :value.sync="selectedPeriod" :options="periodOptions"></mdl-select>
                    <mdl-button colored raised @click="addToEvent(selectedEvent, inputPeriod)">Ajouter</mdl-button>
                </form>
                <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                    <thead>
                        <tr>
                            <th class="mdl-data-table__cell--non-numeric">Période</th>
                            <th class="mdl-data-table__cell--non-numeric">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="period in detailsEvent.periods">
                            <td class="mdl-data-table__cell--non-numeric">{{ period.name }}</td>
                            <td class="mdl-data-table__cell--non-numeric">
                                <mdl-button @click="removeFromEvent(selectedEvent, period)">Supprimer</mdl-button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <mdl-button colored raised @click="goBack()">Retour</mdl-button>
            </div>
            <div v-show="!selectedEvent.name" transition="fade">
                <form v-on:submit.prevent>
                    <mdl-textfield floating-label="Nom" :value.sync="name"></mdl-textfield><br />
                    <mdl-button colored raised @click="createEvent(inputEvent)">Créer</mdl-button>
                </form>
                <br>
                <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp" v-show="events.length > 0">
                    <thead>
                        <tr>
                            <th class="mdl-data-table__cell--non-numeric">Évenement</th>
                            <th class="mdl-data-table__cell--non-numeric">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="event in events">
                            <td class="mdl-data-table__cell--non-numeric">{{ event.name }}</td>
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
            selectedEvent : {},
            modEvent      : {},
            detailsEvent  : {},
            selectedPeriod: {}
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
            this.selectedPeriod = this.$store.state.app.periods[0];

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
        },
        addToEvent(event, period) {
            post(`events/${event.id}/periods`, {id: period.id})
                .then(result => {
                    this.detailsEvent.periods.push(period);
                });
        },
        removeFromEvent(event, period) {
            del(`events/${event.id}/periods/${period.id}`)
                .then(result => {
                    let i = 0;
                    for (const p of this.detailsEvent.periods) {
                        if (p.id === period.id) {
                            break;
                        }

                        ++i;
                    }

                    this.detailsEvent.periods.splice(i, 1);
                });
        }
    },

    computed: {
        inputEvent() {
            const name = this.name;
            this.name  = '';
            return {
                name: name,
            };
        },
        inputPeriod() {
            const period        = this.selectedPeriod;
            this.selectedPeriod = this.$store.state.app.periods[0];
            return period;
        },
        periodOptions() {
            return this.periods.map(period => {
                return { name: period.name, value: period };
            });
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
