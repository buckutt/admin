<template>
    <div class="b-wikets b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <b-navbar title="Points de vente actifs" :inCard="true"></b-navbar>
            <router-link to="/wikets/add" v-if="!addWiket">
                <mdl-button class="mdl-js-ripple-effect" fab accent>
                    <i class="material-icons">add</i>
                </mdl-button>
            </router-link>
            <router-link to="/wikets" v-else>
                <mdl-button class="mdl-js-ripple-effect" fab accent>
                    <i class="material-icons">close</i>
                </mdl-button>
            </router-link>
            <div class="b-wikets__panel" v-if="addWiket">
                <b-wiketpanel></b-wiketpanel>
            </div>
            <div class="b-wikets__container" v-if="pointsWikets.length > 0">
                <b-wiket :point="point" v-for="point in pointsWikets" :key="point.id"></b-wiket>
            </div>
            <span v-else>Aucun point de vente n'est actif pour cet événement.</span>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import WiketTile from './WiketTile.vue';
import WiketPanel from './WiketPanel.vue';

export default {
    components: {
        'b-wiket'     : WiketTile,
        'b-wiketpanel': WiketPanel
    },

    methods: {
        ...mapActions([
            'fetchObjectsAndRelations'
        ])
    },

    computed: {
        ...mapGetters([
            'pointsWikets',
            'addWiket'
        ])
    },

    mounted() {
        this.fetchObjectsAndRelations({ route: 'points' });
    }
};
</script>

<style>
    @import '../../variables.css';

    .b-wikets {
        & > div {
            & > .b-wikets__panel {
                border-bottom: 1px solid #E0E0E0;
                margin: 0px -20px 10px -20px;
                padding: 0px 20px 10px 20px;
            }

            & > .b-wikets__container {
                display: flex;
                flex-wrap: wrap;
            }

            & > span {
                margin-top: 15px;
            }

            & > a {
                width: 56px;
                position: absolute;
                right: 20px;
                top: 35px;
            }
        }
    }
</style>
