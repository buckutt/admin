<template>
    <div class="sidebar">
        <h1>Buckless</h1>
        <ul>
            <li>
                <a class="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect" v-link="{ path: '/' }">
                    <i class="material-icons">insert_chart</i>
                    Accueil
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
                <a class="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect" v-link="{ path: '/treasury' }">
                    <i class="material-icons">attach_money</i>
                    Trésorerie
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
export default {
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
    }

    .sidebar + div {
        float: left;
        height: 100%;
        width: calc(100% - #{$sidebarWidth});
        margin-left: $sidebarWidth;
    }
</style>
