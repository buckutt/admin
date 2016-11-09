<template>
    <div v-if="currentEvent">
        <div class="points">
            <div class="mdl-card mdl-shadow--2dp">
                <h3>Points</h3>
                <form @submit.prevent="createPoint(inputPoint)">
                    <mdl-textfield floating-label="Nom" v-model="name"></mdl-textfield>
                    <br>
                    <mdl-button colored raised>Créer</mdl-button>
                </form>

                <br />

                <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                    <thead>
                        <tr>
                            <th class="mdl-data-table__cell--non-numeric">Point</th>
                            <th class="mdl-data-table__cell--non-numeric">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="point in points">
                            <td class="mdl-data-table__cell--non-numeric">{{ point.name }}</td>
                            <td class="mdl-data-table__cell--non-numeric">
                                <mdl-button @click.native="openModal(point)">Modifier</mdl-button>
                                <mdl-button @click.native="removePoint(point)">Supprimer</mdl-button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <modal>
            <div class="modal__dialog">
                <div class="modal__header">
                    <h3>Modifier le point {{ selectedPoint.name }}</h3>
                </div>
                <form @submit.prevent="updatePoint(editPoint)">
                    <div class="modal__body">
                        <mdl-textfield floating-label="Nom" v-model="modPoint.name"></mdl-textfield>
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
            name:          '',
            selectedPoint: {},
            modPoint:      {}
        };
    },

    methods: {
        ...mapActions([
            'createPoint',
            'updatePoint',
            'removePoint',
            'updateEditModal'
        ]),
        openModal(point) {
            this.selectedPoint = point;
            this.modPoint      = JSON.parse(JSON.stringify(point));

            this.updateEditModal(true);
        },
        closeModal() {
            this.updateEditModal(false);
        }
    },

   computed: {
        ...mapState({
            points       : state => state.app.points,
            currentEvent : state => state.global.currentEvent,
            openEditModal: state => state.global.openEditModal
        }),
        inputPoint() {
            const name = this.name;
            this.name  = '';
            return {
                name: name,
            };
        },
        editPoint() {
            const point   = this.modPoint;
            this.modPoint = {};
            this.closeModal();
            return point;
        }
    }
}
</script>

<style lang="sass">
    @import '../main.scss';

    .points {
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
