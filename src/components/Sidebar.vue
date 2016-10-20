<template>
    <div class="sidebar">
        <h1>Buckless</h1>
        <ul class="eventSelector">
            <li>
                <form v-on:submit.prevent>
                    <mdl-select label="Évenement" id="event-select" :value.sync="selectedEvent" :options="eventOptions" v-on:click="changeEvent"></mdl-select>
                </form>
            </li>
            <li>
                <a class="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect" v-link="{ path: '/' }">
                    <i class="material-icons">home</i>
                    Accueil
                </a>
            </li>
            <li>
                <a class="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect" v-link="{ path: '/events' }">
                    <i class="material-icons">cake</i>
                    Évenements
                </a>
            </li>
            <li>
                <a class="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect" v-link="{ path: '/treasury' }">
                    <i class="material-icons">attach_money</i>
                    Trésorerie
                </a>
            </li>
        </ul>
        <ul v-show="currentEvent" transition="fade">
            <li>
                <a class="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect" v-link="{ path: '/stats' }">
                    <i class="material-icons">insert_chart</i>
                    Statistiques
                </a>
            </li>
            <li>
                <a class="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect" v-link="{ path: '/purchases' }">
                    <i class="material-icons">shopping_cart</i>
                    Achats
                </a>
            </li>
            <li>
                <a class="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect" v-link="{ path: '/devices' }">
                    <i class="material-icons">devices</i>
                    Équipements
                </a>
            </li>
            <li>
                <a class="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect" v-link="{ path: '/points' }">
                    <i class="material-icons">location_on</i>
                    Points
                </a>
            </li>
            <li>
                <a class="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect" v-link="{ path: '/periods' }">
                    <i class="material-icons">alarm</i>
                    Périodes
                </a>
            </li>
            <li>
                <a class="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect" v-link="{ path: '/items' }">
                    <i class="material-icons">view_module</i>
                    Articles
                </a>
            </li>
            <li>
                <a class="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect" v-link="{ path: '/promotions' }">
                    <i class="material-icons">stars</i>
                    Promotions
                </a>
            </li>
            <li>
                <a class="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect" v-link="{ path: '/categories' }">
                    <i class="material-icons">format_list_numbered</i>
                    Catégories
                </a>
            </li>
            <li>
                <a class="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect" v-link="{ path: '/users' }">
                    <i class="material-icons">person</i>
                    Utilisateurs
                </a>
            </li>
            <li>
                <a class="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect" v-link="{ path: '/groups' }">
                    <i class="material-icons">group</i>
                    Groupes
                </a>
            </li>
            <li>
                <a class="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect" v-link="{ path: '/cardBlock' }">
                    <i class="material-icons">credit_card</i>
                    Blocage de carte
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
import { updateCurrentEvent } from '../store/actions';
import { get } from '../lib/fetch';

export default {
    vuex: {
        getters: {
            events      : state => state.app.events,
            currentEvent: state => state.global.currentEvent
        },
        actions: {
            updateCurrentEvent: updateCurrentEvent
        }
    },

    data () {
        return {
            selectedEvent: null
        };
    },

    methods: {
        changeEvent() {
            if(this.selectedEvent) {
                if(this.currentEvent) {
                    if(this.selectedEvent.id != this.currentEvent.id) {
                        this.$route.router.go('/stats');
                    }
                }

                const embedEvents = encodeURIComponent(JSON.stringify({
                    periods: true
                }));

                get(`events/${this.selectedEvent.id}?embed=${embedEvents}`)
                    .then(result => {
                        if(result.periods) {
                            result.periods = result.periods.filter(period => {
                                return !period.isRemoved;
                            });
                        }
                        this.updateCurrentEvent(result);
                    });
            }
        }
    },

    computed: {
        eventOptions() {
            return this.events.map(event => {
                return { name: event.name, value: event };
            });
        }
    }
}
</script>

<style lang="sass">
    @import '../main.scss';

    .sidebar {
        background: $sidebarBackground;
        float: left;
        height: 100%;
        position: fixed;
        width: $sidebarWidth;

        > h1 {
            color: $sidebarColor;
            font-size: $sidebarTitleSize;
            font-weight: $sidebarTitleWeight;
            margin: $sidebarTitleMargin;
            text-align: center;
        }

        > ul {
            list-style: none;
            padding-left: 0;

            > li {
                > a {
                    box-sizing: border-box;
                    color: $sidebarColor !important;
                    display: inline-block;
                    height: $sidebarLinkHeight;
                    line-height: $sidebarLinkHeight;
                    padding-left: 10px;
                    text-align: left;
                    text-decoration: none;
                    width: 100%;

                    > i {
                        margin-right: 10px;
                    }
                }
            }

            > li:hover {
                background-color: lighten($sidebarBackground, 10%);
            }
        }

        > .eventSelector {
            > li {
                &:first-child {
                    padding-left: 10px;
                    padding-right: 10px;
                    font-family: 'Roboto', sans-serif;
                    color: $sidebarColor;
                }

                label {
                    color: $sidebarColor !important;
                }

                &:nth-child(4) {
                    margin-bottom: 30px;
                }
            }
        }
    }

    .sidebar + div {
        float: left;
        height: 100%;
        width: calc(100% - #{$sidebarWidth});
        margin-left: $sidebarWidth;
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
</style>
