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
            :sort="{ field: 'end', order: 'DESC' }"
            :actions="[
                { action: 'edit', text: 'Modifier', raised: true, colored: true },
                { action: 'remove', text: 'Supprimer', type: 'confirm', condition: { field: 'id', statement: 'isNotIn', value: protectedPeriodsIds } }
            ]"
            route="periods"
            :paging="10"
            @edit="editPeriod"
            @remove="removeObject">
        </b-table>
        <br />
        <mdl-button accent @click.native="displayOutdated = !displayOutdated">
            <template v-if="!displayOutdated">Afficher</template>
            <template v-else>Masquer</template>
            les anciennes périodes</mdl-button>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
    data() {
        return {
            displayOutdated: false
        };
    },

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
            'protectedPeriodsIds',
            'currentPeriods'
        ]),
        displayedPeriods() {
            const selectedPeriods = (this.displayOutdated) ? this.periods : this.currentPeriods;
            return selectedPeriods.filter(period => (period.Event_id === this.currentEvent.id));
        }
    }
};
</script>
