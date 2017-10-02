<template>
    <div class="b-wikets b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <b-navbar title="Points de vente" :inCard="true"></b-navbar>

            <div class="b-wikets__container">
                <b-wiket :wiket="wiket" v-for="wiket in wikets" :key="wiket.point.id"></b-wiket>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import WiketTile from './WiketTile.vue';

export default {
    components: {
        'b-wiket': WiketTile
    },

    methods: {
        ...mapActions([
            'fetchObjectsAndRelations'
        ])
    },

    computed: {
        ...mapGetters([
            'wikets'
        ])
    },

    mounted() {
        this.fetchObjectsAndRelations({ route: 'points' });
    }
};
</script>

<style>
    @import '../../variables.css';

    .b-wikets__container {
        display: flex;
        flex-wrap: wrap;
    }
</style>
