<template>
    <div class="treasury">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Blocage de carte</h3>
            <br>
            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <input class="mdl-textfield__input" type="text" id="username" v-model="username">
                <label class="mdl-textfield__label" for="username">Nom et/ou Prénom</label>
            </div>

            <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" @click="searchUser(username)">
                Rechercher
            </button>

            <ul>
                <li class="mdl-list__item" v-for="user in foundUsers" id="lock-{{ $index }}">
                    <span class="mdl-list__item-primary-content">
                        <i class="material-icons mdl-list__item-icon">person</i>

                        {{ user.firstname }}&nbsp;{{ user.lastname }}

                        <ul class="mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect"
                            for="lock-{{ $index }}">
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
            foundUsers: state => state.cardBlock.foundUsers
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

    .treasury {
        > div {
            .mdl-textfield {
                width: auto;
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
