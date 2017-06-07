<template>
    <div class="b-users b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <b-navbar
                :title="title"
                :tabs="displayedTabs"
                :inCard="true"
                :goBack="true"
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
            modObject   : state => state.app.modObject,
            currentEvent: state => state.app.currentEvent
        }),
        displayedTabs() {
            const tabs = [
                { route: '', name: 'Détails' },
                { route: 'edit', name: 'Édition' },
                { route: 'mol', name: 'Identifiants' },
                { route: 'rights', name: 'Droits' }
            ];

            if (this.currentEvent.config.hasGroups) {
                tabs.push({ route: 'groups', name: 'Groupes' });
            }

            return tabs;
        },
        title() {
            return `Utilisateur ${this.modObject.firstname} ${this.modObject.lastname}`;
        }
    }
};
</script>
