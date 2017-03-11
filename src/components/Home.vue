<template>
    <div class="b-container" :class="{ 'b-container__display': !isToken }">
        <div class="b-container__login" v-if="!isToken">
            <div class="mdl-card mdl-shadow--2dp">
                <div class="mdl-card__title">
                    <h2 class="mdl-card__title-text">Connexion</h2>
                </div>
                <form @submit.prevent="login(mail, password)">
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
            <div class="b-container__home" v-if="isToken">
                <div class="mdl-card mdl-shadow--2dp">
                    <h3>Bonjour {{ user.firstname }} {{ user.lastname }} !</h3>
                    Stats générales de buckless + proposition de sélection d'événement + help ?
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { post, updateBearer }   from '../lib/fetch';
import { load }                 from '../lib/load';

export default {
    data() {
        const isToken = this.$options.methods.getIsToken();
        const user    = this.$options.methods.getUser();
        return {
            mail    : null,
            password: null,
            isToken,
            user
        };
    },

    methods: {
        ...mapActions([
            'updateLogged'
        ]),
        login(mail, password) {
            post('services/login', { meanOfLogin: 'etuMail', data: mail, password })
                .then((result) => {
                    if (!result.isAPIError) {
                        if (this.isAdmin(result.user)) {
                            sessionStorage.setItem('user', JSON.stringify(result.user));
                            sessionStorage.setItem('token', result.token);
                            this.isToken = true;
                            this.user    = result.user;
                            this.updateLogged(true);
                            updateBearer(result.token);

                            load(this.$router.app.$store);
                        } else {
                            this.$root.$emit('snackfilter', {
                                message: 'Vous n\'êtes pas administrateur.',
                                timeout: 2000
                            });
                        }
                    } else {
                        this.$root.$emit('snackfilter', {
                            message: 'La connexion a échoué.',
                            timeout: 2000
                        });
                    }
                });
        },
        getIsToken() {
            return sessionStorage.hasOwnProperty('token');
        },
        getUser() {
            if (sessionStorage.hasOwnProperty('user')) {
                return JSON.parse(sessionStorage.getItem('user'));
            }
            return {};
        },
        isAdmin(user) {
            let admin = false;
            if (user) {
                user.rights.forEach((right) => {
                    if (right.name === 'admin' && !right.isRemoved
                        && new Date(right.period.start).getTime() <= Date.now()
                        && new Date(right.period.end).getTime() >= Date.now()) {
                        admin = true;
                    }
                });
            }

            return admin;
        }
    },

    computed: {
        ...mapState({
            logged: state => state.global.logged
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
