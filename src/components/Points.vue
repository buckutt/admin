<template>
    <div class="points">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Points</h3>
            <form v-on:submit.prevent>
                <mdl-textfield floating-label="Nom" :value.sync="name"></mdl-textfield>
                <br>
                <mdl-button colored raised @click="createPoint(inputPoint)">Créer</mdl-button>
            </form>

            <br>

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
                            <mdl-button @click="openModal(point)">Modifier</mdl-button>
                            <mdl-button @click="removePoint(point)">Supprimer</mdl-button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="modal modal__bg" v-modal="openEditModal" v-el:editmodal>
        <div class="modal__dialog">
            <div class="modal__header">
                <h3>Modifier le point {{ selectedPoint.name }}</h3>
            </div>
            <form v-on:submit.prevent>
                <div class="modal__body">
                    <mdl-textfield floating-label="Nom" :value.sync="modPoint.name"></mdl-textfield>
                </div>
                <div class="modal__footer">
                    <mdl-button @click="updatePoint(selectedPoint,editPoint)">Valider</mdl-button>
                    <mdl-button @click="closeModal()">Annuler</mdl-button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { post } from '../lib/fetch';
import modal from '../lib/modal';
import { createPoint, updatePoint, removePoint } from '../store/actions';


export default {
    vuex: {
        getters: {
            points: state => state.app.points
        },
        actions: {
            createPoint: createPoint,
            updatePoint: updatePoint,
            removePoint: removePoint
        }
    },

    data () {
        return {
            name:          '',
            selectedPoint: {},
            modPoint:      {},
            openEditModal: false
        };
    },

    methods: {
        openModal(point) {
            this.selectedPoint = point;
            this.modPoint      = JSON.parse(JSON.stringify(point));

            this.openEditModal = true;
        },
        closeModal() {
            this.openEditModal = false;
        }
    },

   computed: {
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
