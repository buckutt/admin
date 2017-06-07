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
            <div class="b-container__home b-page" v-if="logged">
                <div class="mdl-card mdl-shadow--2dp">
                    <h3>Bonjour {{ loggedUser.firstname }} {{ loggedUser.lastname }} !</h3>
                    Stats générales de buckless + proposition de sélection d'événement + help ?
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';

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
            loggedUser: state => state.app.loggedUser
        }),
        ...mapGetters([
            'logged'
        ])
    }
};
</script>

<style lang="scss">
    @import '../../variables.scss';

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
</style>
