<template>
    <div>
        <h5>Historique des alertes</h5>
        <div class="b-table-search">
            <i class="material-icons">search</i>
            <mdl-textfield floating-label="Contenu" v-model="content"></mdl-textfield>
        </div>

        <b-table
            :headers="[{ title: 'Date d\'envoi', field: 'created_at', type: 'date' }, { title: 'Contenu', field: 'content' }, { title: 'Durée minimale', field: 'minimumViewTime' }]"
            :data="eventAlerts"
            :filter="{ val: this.content, field: 'content' }"
            :sort="{ field: 'created_at', order: 'DESC' }"
            :paging="10">
        </b-table>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    data() {
        return {
            content: ''
        };
    },

    computed: {
        ...mapState({
            currentEvent: state => state.app.currentEvent,
            alerts      : state => state.objects.alerts
        }),

        eventAlerts() {
            return this.alerts
                .filter(alert => (alert.event_id === this.currentEvent.id));
        }
    }
};
</script>
