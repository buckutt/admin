<template>
    <div class="container" :class="{ 'container--login': !isToken }">
        <div class="login" v-show="!isToken">
            <div class="mdl-card mdl-shadow--2dp">
                <div class="mdl-card__title">
                    <h2 class="mdl-card__title-text">Connexion</h2>
                </div>
                <form v-on:submit.prevent>
                    <div class="mdl-card__supporting-text">
                        <mdl-textfield floating-label="Mail" :value.sync="mail"></mdl-textfield><br />
                        <mdl-textfield type="password" floating-label="Mot de passe" :value.sync="password"></mdl-textfield>
                    </div>
                    <div class="mdl-card__actions mdl-card--border">
                        <mdl-button colored @click="login(mail, password)">Connexion</mdl-button>
                    </div>
                </form>
            </div>
        </div>

        <div class="home" v-show="isToken" transition="fade">
            <div class="mdl-card mdl-shadow--2dp">
                <h3>Bonjour {{ user.firstname }} {{ user.lastname }} !</h3>
                Stats générales de buckless + proposition de sélection d'événement + help ?
            </div>
        </div>

        <mdl-snackbar display-on="snackfilter"></mdl-snackbar>
    </div>
</template>

<script>
import { updateLogged }       from '../store/actions';
import { post, updateBearer } from '../lib/fetch';
import { load }               from '../lib/load';

export default {
    vuex: {
        getters: {
            logged: state => state.global.logged
        },
        actions: {
            updateLogged
        }
    },

    data () {
        return {
            mail    : null,
            password: null,
            isToken : this.isToken(),
            user    : this.user()
        };
    },

    methods: {
        login(mail, password) {
            post('services/login', { meanOfLogin: 'etuMail', data: mail, password })
                .then(result => {
                    if (!result.isAPIError) {
                        if(this.isAdmin(result.user)) {
                            sessionStorage.setItem('user', JSON.stringify(result.user));
                            sessionStorage.setItem('token', result.token);
                            this.isToken = true;
                            this.user    = result.user;
                            this.updateLogged(true);
                            updateBearer(result.token);

                            load(this.$route.router.app.$store);
                        } else {
                            const dataAdmin = {
                                message: 'Vous n\'êtes pas administrateur.',
                                timeout: 2000
                            };

                            this.$broadcast('snackfilter', dataAdmin);
                        }
                    } else {
                        const data = {
                            message: 'La connexion a échoué.',
                            timeout: 2000
                        };

                        this.$broadcast('snackfilter', data);
                    }
                });
        },
        isToken() {
            return sessionStorage.hasOwnProperty('token');
        },
        user() {
            if(sessionStorage.hasOwnProperty('user')) {
                return JSON.parse(sessionStorage.getItem('user'));
            }
            return {};
        },
        isAdmin(user) {
            let admin = false;
            user.rights.forEach(right => {
                if (right.name == 'admin' && !right.isRemoved && new Date(right.period.start).getTime() <= Date.now() && new Date(right.period.end).getTime() >= Date.now()) {
                    admin = true;
                }
            });

            return admin;
        }
    }
}
</script>

<style lang="sass">
    @import '../main.scss';

    .container {
        &.container--login {
            margin-left: 0 !important;
            width: 100% !important;
        }

        .mdl-snackbar {
            margin-left: $sidebarWidth / 2;
        }

        .fade-transition {
            transition: opacity .4s ease;
        }

        .fade-enter {
            opacity: 0;
        }

        .fade-leave {
            display: none;
        }

        .width-transition {

        }
    }

    .login {
        > div {
            width: 500px;
            margin: 50px auto;

            .mdl-textfield {
                width: 100%;
            }
        }
    }

    .home {
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
