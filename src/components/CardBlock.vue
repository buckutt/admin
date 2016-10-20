<template>
    <div class="cardblock" v-show="currentEvent">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Blocage de carte</h3>
            <form v-on:submit.prevent>
                <mdl-textfield floating-label="Nom et/ou Prénom" :value.sync="username"></mdl-textfield><br />
                <mdl-button colored raised @click="searchUser(username)">Rechercher</mdl-button>
            </form>

            <ul>
                <li class="mdl-list__item" v-for="user in foundUsers" :id="'lock'+ $index">
                    <span class="mdl-list__item-primary-content">
                        <i class="material-icons mdl-list__item-icon">person</i>

                        {{ user.firstname }}&nbsp;{{ user.lastname }}

                        <ul class="mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect"
                            :for="'lock-' + $index">
                            <li class="mdl-menu__item" v-for="mol in user.meansOfLogin" @click="blockMOL(mol.id, !mol.isRemoved)">
                                <span v-if="mol.isRemoved">Debloquer {{ mol.type }}</span>
                                <span v-if="!mol.isRemoved">Bloquer {{ mol.type }}</span>
                            </li>
                        </ul>
                    </span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { searchUser, blockMOL } from '../store/actions';

export default {
    vuex: {
        getters: {
            foundUsers  : state => state.cardBlock.foundUsers,
            currentEvent: state => state.global.currentEvent
        },
        actions: {
            searchUser: searchUser,
            blockMOL: blockMOL
        }
    },

    data () {
        return {
            username: ''
        };
    }
}
</script>

<style lang="sass">
    @import '../main.scss';

    .cardblock {
        > div {
            min-height: calc(100% - 40px);
            margin: 20px ((100% - $cardSize) / 2);
            overflow-y: auto;
            padding: 20px;
            width: $cardSize;

            form, .mdl-textfield, .mdl-button {
                width: 100%;
            }

            ul {
                padding: 0;
            }

            li {
                background-color: #fff;
                cursor: pointer;
                transition: background-color .3s ease-out;

                &:hover {
                    background-color: #ebebeb;
                }
            }

            .mdl-menu__outline {

            }
        }
    }
</style>
