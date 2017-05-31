<template>
    <transition name="slide">
        <div class="b-sidebar" v-show="logged">
            <h1>Buckless</h1>
            <ul class="eventSelector">
                <li>
                    <mdl-select label="Évenement" id="event-select" :value="displayEvent" :options="eventOptions" @input="changeEvent($event)"></mdl-select>
                </li>
                <li>
                    <router-link to="/" class="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect">
                        <i class="material-icons">home</i>
                        Accueil
                    </router-link>
                </li>
                <li>
                    <router-link to="/logout" class="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect">
                        <i class="material-icons">power_settings_new</i>
                        Déconnexion
                    </router-link>
                </li>
                <li>
                    <router-link to="/events" class="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect">
                        <i class="material-icons">cake</i>
                        Évenements
                    </router-link>
                </li>
                <li>
                    <router-link to="/treasury" class="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect">
                        <i class="material-icons">attach_money</i>
                        Trésorerie
                    </router-link>
                </li>
            </ul>
            <transition name="fade">
                <ul v-if="isConfigured">
                    <li>
                        <router-link to="/stats" class="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect">
                            <i class="material-icons">insert_chart</i>
                            Statistiques
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/purchases" class="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect">
                            <i class="material-icons">shopping_cart</i>
                            Achats
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/devices" class="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect">
                            <i class="material-icons">devices</i>
                            Équipements
                        </router-link>
                    </li>
                    <li v-if="currentEvent.config.hasFundations">
                        <router-link to="/fundations" class="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect">
                            <i class="material-icons">local_atm</i>
                            Fondations
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/points" class="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect">
                            <i class="material-icons">location_on</i>
                            Points
                        </router-link>
                    </li>
                    <li v-if="currentEvent.config.hasPeriods">
                        <router-link to="/periods" class="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect">
                            <i class="material-icons">alarm</i>
                            Périodes
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/articles" class="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect">
                            <i class="material-icons">view_module</i>
                            Articles
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/promotions" class="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect">
                            <i class="material-icons">stars</i>
                            Promotions
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/categories" class="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect">
                            <i class="material-icons">format_list_numbered</i>
                            Catégories
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/users" class="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect">
                            <i class="material-icons">person</i>
                            Utilisateurs
                        </router-link>
                    </li>
                    <li v-if="currentEvent.config.hasGroups">
                        <router-link to="/groups" class="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect">
                            <i class="material-icons">group</i>
                            Groupes
                        </router-link>
                    </li>
                </ul>
            </transition>
        </div>
    </transition>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import { isEventConfigured } from '../lib/isEventConfigured';

export default {
    methods: {
        ...mapActions([
            'updateCurrentEvent'
        ]),
        changeEvent(event) {
            if (!event) {
                return;
            }

            if (this.currentEvent) {
                if (event.id === this.currentEvent.id) {
                    return;
                }
            }

            this.updateCurrentEvent(event)
                .then(() => {
                    if (this.isConfigured) {
                        this.$router.push('/stats');
                    } else {
                        this.$router.push(`/events/config/${event.id}`);
                    }
                });
        }
    },

    computed: {
        ...mapState({
            currentEvent: state => state.app.currentEvent
        }),
        ...mapGetters([
            'logged',
            'eventOptions'
        ]),
        displayEvent() {
            if (!this.currentEvent) {
                return '';
            }
            return this.currentEvent.name;
        },
        isConfigured() {
            if (this.currentEvent) {
                return isEventConfigured(this.currentEvent);
            }
            return false;
        }
    }
};
</script>

<style lang="scss">
    @import '../main.scss';

    .b-sidebar {
        background: $sidebarBackground;
        float: left;
        height: 100%;
        position: fixed;
        width: $sidebarWidth;
        overflow-y: auto;

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

                &:nth-child(5) {
                    margin-bottom: 30px;
                }
            }
        }
    }

    .b-sidebar + div {
        float: left;
        height: 100%;
        width: calc(100% - #{$sidebarWidth});
        margin-left: $sidebarWidth;
    }

    .slide-enter-active, .slide-leave-active {
        transition: all .5s ease;
    }

    .slide-enter-active + .b-container, .slide-leave-active + .b-container {
        transition: all .5s ease;
    }

    .slide-enter, .slide-leave-active {
        margin-left: -200px;
    }

    .slide-enter + .b-container, .slide-leave-active + .b-container {
        margin-left: 0;
        width: 100%;
    }
</style>
