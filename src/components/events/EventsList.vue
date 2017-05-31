<template>
    <div>
        <h5>Liste des événements</h5>
        <b-table
            :headers="[
                { title: 'Évenement', field: 'name' },
                { title: 'Rechargement minimal', field: 'config.minReload', type: 'price' },
                { title: 'Solde maximal', field: 'config.maxPerAccount', type: 'price' },
                { title: 'Alcool maximal', field: 'config.maxAlcohol' }
            ]"
            :data="events"
            :sort="{ field: 'name', order: 'ASC' }"
            :actions="[
                { action: 'edit', text: 'Modifier', raised: true, colored: true },
                { action: 'config', text: 'Configurer', raised: true, colored: true },
                { action: 'remove', text: 'Supprimer', type: 'confirm' }
            ]"
            route="events"
            :paging="10"
            @edit="editEvent"
            @config="configEvent"
            @remove="removeObject">
        </b-table>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    methods: {
        ...mapActions([
            'removeObject'
        ]),
        editEvent(event) {
            this.$router.push(`/events/edit/${event.id}`);
        },
        configEvent(event) {
            this.$router.push(`/events/config/${event.id}`);
        }
    },

    computed: {
        ...mapState({
            events: state => state.objects.events
        })
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';
</style>
