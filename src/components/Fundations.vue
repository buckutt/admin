<template>
    <div v-if="currentEvent">
        <div class="b-fundations">
            <div class="mdl-card mdl-shadow--2dp">
                <h3>Fondations</h3>
                <form @submit.prevent="createFundation(inputFundation)">
                    <mdl-textfield floating-label="Nom" v-model="name"></mdl-textfield>
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
                                    <mdl-button raised colored @click.native="openModal(fundation)">Modifier</mdl-button>
                                    <mdl-button raised accent @click.native="$root.confirm() && removeFundation(fundation)">Supprimer</mdl-button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <modal>
            <div class="modal__dialog">
                <div class="modal__header">
                    <h3>Modifier la fondation {{ selectedFundation.name }}</h3>
                </div>
                <form @submit.prevent="updateFundation(editFundation)">
                    <div class="modal__body">
                        <mdl-textfield floating-label="Nom" v-model="modFundation.name"></mdl-textfield>
                    </div>
                    <div class="modal__footer">
                        <mdl-button>Valider</mdl-button>
                        <mdl-button @click.native="closeModal()">Annuler</mdl-button>
                    </div>
                </form>
            </div>
        </modal>
    </div>
</template>

<script>
import Modal    from './Modal.vue';
import { post } from '../lib/fetch';
import { mapState, mapActions } from 'vuex';

export default {
    components: {
        Modal
    },

    data () {
        return {
            name             : '',
            selectedFundation: {},
            modFundation     : {}
        };
    },

    methods: {
        ...mapActions([
            'createFundation',
            'updateFundation',
            'removeFundation',
            'updateEditModal'
        ]),
        openModal(fundation) {
            this.selectedFundation = fundation;
            this.modFundation      = JSON.parse(JSON.stringify(fundation));

            this.updateEditModal(true);
        },
        closeModal() {
            this.updateEditModal(false);
        }
    },

   computed: {
        ...mapState({
            fundations   : state => state.app.fundations,
            currentEvent : state => state.global.currentEvent,
            openEditModal: state => state.global.openEditModal
        }),
        inputFundation() {
            const name = this.name;
            this.name  = '';
            return {
                name: name,
            };
        },
        editFundation() {
            const fundation   = this.modFundation;
            this.modFundation = {};
            this.closeModal();
            return fundation;
        }
    }
}
</script>

<style lang="sass">
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
