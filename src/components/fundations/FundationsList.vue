<template>
    <div>
        <h5>Liste des fondations</h5>
        <b-table
            :headers="[{ title: 'Fondation', field: 'name', object: true }]"
            :data="fundations"
            :sort="{ field: 'name', order: 'ASC' }"
            :actions="[
                { action: 'edit', text: 'Modifier' },
                { action: 'remove', text: 'Supprimer', type: 'confirm', condition: { field: 'id', statement: 'isNotIn', value: protectedFundationsIds }  }
            ]"
            route="fundations"
            :paging="10"
            @edit="editFundation"
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
        editFundation(fundation) {
            this.$router.push(`/fundations/${fundation.id}/edit`);
        }
    },

    computed: {
        ...mapState({
            fundations: state => state.objects.fundations
        }),
        ...mapGetters([
            'protectedFundationsIds'
        ])
    }
};
</script>
