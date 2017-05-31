<template>
    <div class="b-users b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <b-navbar
                title="Utilisateurs"
                :tabs="displayedTabs"
                :inCard="true"
                :goBack="true"
                :level="3">
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
        }),
        displayedTabs() {
            const tabs = [
                { route: '', name: 'Édition' },
                { route: 'mol', name: 'Identifiants' },
                { route: 'rights', name: 'Droits' }
            ];

            if (this.currentEvent.config.hasGroups) {
                tabs.push({ route: 'groups', name: 'Groupes' });
            }

            return tabs;
        }
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';
</style>
