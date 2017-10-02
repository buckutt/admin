<template>
    <transition name="slide">
        <div class="b-sidebar" v-show="logged">
            <h1>Buckless</h1>
            <ul>
                <li>
                    <router-link to="/" class="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect">
                        <i class="material-icons">home</i>
                        Accueil
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
                    <li class="b-sidebar__eventDisplayer">
                        Événement<br />
                        <strong>{{ currentEvent.name }}</strong>
                    </li>
                    <li>
                        <router-link to="/stats" class="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect">
                            <i class="material-icons">insert_chart</i>
                            Tableau de bord
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/purchases" class="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect">
                            <i class="material-icons">shopping_cart</i>
                            Achats
                        </router-link>
                    </li>
                    <li v-if="currentEvent.config.hasPeriods">
                        <router-link to="/periods" class="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect">
                            <i class="material-icons">alarm</i>
                            Périodes
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/wikets" class="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect">
                            <i class="material-icons">location_on</i>
                            Points de vente
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/participants" class="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect">
                            <i class="material-icons">nature_people</i>
                            Participants
                        </router-link>
                    </li>
                </ul>
            </transition>
        </div>
    </transition>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { isEventConfigured }    from '../lib/isEventConfigured';

export default {
    computed: {
        ...mapState({
            currentEvent: state => state.app.currentEvent
        }),
        ...mapGetters([
            'logged'
        ]),
        isConfigured() {
            return (this.currentEvent) ? isEventConfigured(this.currentEvent) : false;
        }
    }
};
</script>

<style>
    @import '../variables.css';

    .b-sidebar {
        z-index: 10;
        background: var(--sidebarBackground);
        float: left;
        height: 100%;
        position: fixed;
        width: var(--sidebarWidth);
        overflow-y: auto;

        & > h1 {
            color: var(--sidebarColor);
            background-color: var(--titleBackgroundColor);
            font-size: var(--sidebarTitleSize);
            font-weight: var(--sidebarTitleWeight);
            padding: var(--sidebarTitlePadding);
            margin-top: 0px;
            margin-bottom: 10px;
            text-align: center;
        }

        & > ul {
            list-style: none;
            padding-left: 0;

            & > li {
                & > a {
                    box-sizing: border-box;
                    color: var(--sidebarColor) !important;
                    display: inline-block;
                    height: var(--sidebarLinkHeight);
                    line-height: var(--sidebarLinkHeight);
                    padding-left: 10px;
                    text-align: left;
                    text-decoration: none;
                    width: 100%;

                    & > i {
                        margin-right: 10px;
                    }
                }
            }

            & > li:hover {
                background-color: lighten(var(--sidebarBackground), 10%);
            }

            & > .b-sidebar__eventDisplayer {
                color: var(--sidebarColor) !important;
                text-align: center;
                padding-left: 5px;
                padding-right: 5px;

                & > strong {
                    font-size: 18px;
                }
            }
        }
    }

    .b-sidebar + div + div {
        float: left;
        height: 100%;
        width: calc(100% - var(--sidebarWidth));
        margin-left: var(--sidebarWidth);
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
