<template>
    <div class="b-events b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <b-navbar
                title="Configuration de l'événement"
                :tabs="displayedTabs"
                :inCard="true"
                :level="3">
            </b-navbar>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
    methods: {
        ...mapActions([
            'resetLastValidatedStep'
        ])
    },

    computed: {
        ...mapState({
            lastValidatedStep: state => state.app.lastValidatedStep
        }),
        displayedTabs() {
            const tabs = [
                { route: '', name: 'Départ' },
                { route: 'groups', name: 'Groupes' },
                { route: 'fundations', name: 'Fondations' },
                { route: 'periods', name: 'Périodes' },
                { route: 'end', name: 'Fin' }
            ];

            return tabs.map((tab, index) => {
                if (index > this.lastValidatedStep) {
                    tab.clickable = false;
                }

                return tab;
            });
        }
    },

    mounted() {
        this.resetLastValidatedStep();
    }
};
</script>
