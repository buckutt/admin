<template>
    <div class="b-fundations">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Fondations</h3>
            <transition name="fade">
                <div v-if="modObject">
                    <h5>Modifier la fondation {{ modObject.name }}:</h5>
                    <form @submit.prevent="updateObject({ route: 'fundations', value: modObject })">
                        <mdl-textfield floating-label="Nom" :value="modObject.name" @input="updateModObject({ field:'name', value: $event })" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield><br />
                        <mdl-button colored raised>Modifier</mdl-button>
                    </form>
                    <br />
                    <mdl-button colored raised @click.native="$root.goBack()">Retour</mdl-button>
                </div>
            </transition>
            <transition name="fade">
                <div v-if="!modObject">
                    <form @submit.prevent="createObject({ route: 'fundations', value: inputFundation() })">
                        <mdl-textfield floating-label="Nom" v-model="newFundation.name" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield>
                        <br />
                        <mdl-button colored raised>Créer</mdl-button>
                    </form>

                    <br />

                    <div class="b-responsive-table">
                        <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                            <thead>
                                <tr>
                                    <th class="mdl-data-table__cell--non-numeric">Fondation</th>
                                    <th class="mdl-data-table__cell--non-numeric">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="fundation in fundations">
                                    <td class="mdl-data-table__cell--non-numeric">{{ fundation.name }}</td>
                                    <td class="mdl-data-table__cell--non-numeric b-actions-cell">
                                        <mdl-button raised colored @click.native="expandFundation(fundation)">Modifier</mdl-button>
                                        <mdl-button raised accent @click.native="$root.confirm() && removeObject({ route: 'fundations', value: fundation })">Supprimer</mdl-button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

const fundationPattern = {
    name: ''
};

export default {
    data() {
        return {
            newFundation: Object.assign({}, fundationPattern)
        };
    },

    methods: {
        ...mapActions([
            'createObject',
            'updateObject',
            'removeObject',
            'expandObject',
            'updateModObject'
        ]),
        expandFundation(fundation) {
            this.$router.push(`/fundations/${fundation.id}`);

            this.expandObject({
                route: 'fundations',
                value: fundation
            });
        },
        inputFundation() {
            const inputFundation = Object.assign({}, this.newFundation);
            this.newFundation    = Object.assign({}, fundationPattern);

            return inputFundation;
        }
    },

    computed: {
        ...mapState({
            fundations: state => state.app.fundations,
            modObject : state => state.app.modObject,
            params    : state => state.route.params
        })
    },

    mounted() {
        if (this.params.id) {
            this.expandFundation({ id: this.params.id });
        }
    }
};
</script>

<style lang="scss">
    @import '../main.scss';

    .b-fundations {
        > div {
            min-height: calc(100% - 40px);
            margin: 20px ((100% - $cardSize) / 2);
            padding: 20px;
            width: $cardSize;

            > h3 {
                margin: 0;
            }

            > select {
                display: inline-block;
                max-width: 150px;
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
