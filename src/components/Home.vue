<template>
    <div class="b-container" :class="{ 'b-container__display': !logged }">
        <div class="b-container__login" v-if="!logged">
            <div class="mdl-card mdl-shadow--2dp">
                <div class="mdl-card__title">
                    <h2 class="mdl-card__title-text">Connexion</h2>
                </div>
                <form @submit.prevent="log(mail, password)">
                    <div class="mdl-card__supporting-text">
                        <mdl-textfield floating-label="Mail" v-model="mail"></mdl-textfield><br />
                        <mdl-textfield type="password" floating-label="Mot de passe" v-model="password"></mdl-textfield>
                    </div>
                    <div class="mdl-card__actions mdl-card--border">
                        <mdl-button colored>Connexion</mdl-button>
                    </div>
                </form>
            </div>
        </div>

        <transition name="fade">
            <div class="b-container__home" v-if="logged">
                <div class="mdl-card mdl-shadow--2dp">
                    <h3>Bonjour {{ loggedUser.firstname }} {{ loggedUser.lastname }} !</h3>
                    Stats générales de buckless + proposition de sélection d'événement + help ?
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    data() {
        return {
            mail    : null,
            password: null
        };
    },

    methods: {
        ...mapActions([
            'login'
        ]),
        log(mail, password) {
            this.login({ meanOfLogin: 'etuMail', data: mail, password });
        }
    },

    computed: {
        ...mapState({
            logged    : state => state.app.logged,
            loggedUser: state => state.app.loggedUser
        })
    }
};
</script>

<style lang="scss">
    @import '../main.scss';

    .b-container {
        &.b-container__display {
            margin-left: 0 !important;
            width: 100% !important;
        }

        .mdl-snackbar {
            margin-left: $sidebarWidth / 2;
        }
    }

    .b-container__login {
        > div {
            width: 500px;
            margin: 50px auto;

            .mdl-textfield {
                width: 100%;
            }
        }
    }

    .b-container__home {
        > div {
            min-height: calc(100% - 40px);
            margin: 20px ((100% - $cardSize) / 2);
            padding: 20px;
            width: $cardSize;

            > h3 {
                margin: 0;
            }

            button {
                max-width: 300px;
            }

            table {
                width: 100%;
                white-space: normal;
            }
        }
    }
</style>
