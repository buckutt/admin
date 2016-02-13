<template>
    <main>
        <div class="sidebar">
            <h1>Buckutt</h1>
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
                    <a class="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect" v-link="{ path: '/rights' }">
                        <i class="material-icons">people</i>
                        Droits
                    </a>
                </li>
                <li>
                    <a class="mdl-button mdl-button--accent mdl-js-button mdl-js-ripple-effect" v-link="{ path: '/periods' }">
                        <i class="material-icons">alarm</i>
                        Périodes
                    </a>
                </li>
            </ul>
        </div>
        <router-view
            :points="points"
            :devices="devices"
            :periods="periods"
            :articles="articles"></router-view>
    </main>
</template>

<script>
export default {
    data () {
        return {
            points  : [],
            devices : [],
            periods : [],
            articles: [],
        };
    }
}
</script>

<style lang="sass">
    @import '../main.scss';

    .sidebar {
        background: $sidebarBackground;
        float: left;
        height: 100%;
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
    }
</style>
