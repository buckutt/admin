<template>
    <div>
        <h3>Listes des périodes de "{{ currentEvent.name }}"</h3>
        <b-table
            :headers="[
                { title: 'Période', field: 'name', object: true },
                { title: 'Début', field: 'start', type: 'date' },
                { title: 'Fin', field: 'end', type: 'date'}
            ]"
            :data="displayedPeriods"
            :sort="{ field: 'start', order: 'ASC' }"
            :actions="[
                { action: 'edit', text: 'Modifier', raised: true, colored: true, condition: { field: 'id', statement: 'isNotIn', value: protectedPeriodsIds } },
                { action: 'remove', text: 'Supprimer', type: 'confirm', condition: { field: 'id', statement: 'isNotIn', value: protectedPeriodsIds } }
            ]"
            route="periods"
            :paging="10"
            @edit="editPeriod"
            @remove="removeObject">
        </b-table>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
    methods: {
        ...mapActions([
            'removeObject'
        ]),
        editPeriod(period) {
            this.$router.push(`/periods/${period.id}/edit`);
        }
    },

    computed: {
        ...mapState({
            currentEvent: state => state.app.currentEvent,
            periods     : state => state.objects.periods
        }),
        ...mapGetters([
            'protectedPeriodsIds'
        ]),
        displayedPeriods() {
            return this.periods.filter(period => (period.Event_id === this.currentEvent.id));
        }
    }
};
</script>
