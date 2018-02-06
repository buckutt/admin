<template>
    <div class="b-events b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <b-navbar
                :title="title"
                :tabs="[{ route: '', name: 'Détails', exact: true }, { route: 'edit', name: 'Édition' }, { route: 'config', name: 'Configuration' }]"
                :inCard="true"
                :goBack="false"
                :level="2">
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
            focusedEvent: state => state.app.focusedElements[0]
        }),

        title() {
            return `Évenement ${this.focusedEvent.name}`;
        }
    }
};
</script>
