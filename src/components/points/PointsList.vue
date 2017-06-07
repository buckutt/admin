<template>
    <div>
        <h5>Liste des points</h5>
        <b-table
            :headers="[{ title: 'Point', field: 'name', object: true }]"
            :data="points"
            :sort="{ field: 'name', order: 'ASC' }"
            :actions="[
                { action: 'edit', text: 'Modifier' },
                { action: 'remove', text: 'Supprimer', type: 'confirm' }
            ]"
            route="points"
            :paging="10"
            @edit="editPoint"
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
        editPoint(point) {
            this.$router.push(`/points/${point.id}/edit`);
        }
    },

    computed: {
        ...mapState({
            points: state => state.objects.points
        })
    }
};
</script>
