<template>
    <div class="b-topbar" v-show="logged">
        <div class="b-topbar__search">
            <mdl-textfield id="search-button" expandable="search" label="Recherche"></mdl-textfield>
        </div>
        <div class="b-topbar__account">
            <div class="b-topbar__admin">
                <router-link to="/account">
                    <i class="material-icons">account_circle</i>
                </router-link>
                <span class="b--capitalized" v-if="logged">{{ loggedUser.firstname }}</span>
            </div>
            <router-link to="/logout">
                <i class="material-icons">power_settings_new</i>
            </router-link>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
    data() {
        return {
            search: ''
        };
    },

    computed: {
        ...mapState({
            loggedUser: state => state.app.loggedUser
        }),
        ...mapGetters([
            'logged'
        ])
    }
};
</script>

<style>
    .b-topbar {
        z-index: 9;
        position: fixed;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        background-color: white;
        height: 86px;
        width: 100%;

        & > .b-topbar__search {
            margin-left: auto;
        }

        & > .b-topbar__account {
            margin-left: 15px;
            padding-right: 23px;
            min-width: 170px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            & > .b-topbar__admin {
                display: flex;
                align-items: center;

                & > span {
                    font-size: 14px;
                    margin-left: 5px;
                    margin-right: 5px;
                }
            }

            & > a, & > .b-topbar__admin > a {
                color: #222;

                & > i {
                    font-size: 40px;
                }
            }
        }
    }
</style>
