<template>
    <div class="b-purchases b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <b-navbar
                :title="`Achats de ${currentEvent.name}`"
                :tabs="[{ route: '/purchases', name: 'Afficher', exact: true }, { route: '/purchases/export', name: 'Exporter' }]"
                :inCard="true">
            </b-navbar>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState({
            currentEvent: state => state.app.currentEvent
        })
    }
};
</script>
