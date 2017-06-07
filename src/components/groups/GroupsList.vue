<template>
    <div>
        <h5>Liste des groupes</h5>
        <b-table
            :headers="[{ title: 'Groupe', field: 'name', object: true }]"
            :data="groups"
            :sort="{ field: 'name', order: 'ASC' }"
            :actions="[
                { action: 'edit', text: 'Modifier', raised: true, colored: true },
                { action: 'remove', text: 'Supprimer', type: 'confirm', condition: { field: 'id', statement: 'isNotIn', value: protectedGroupsIds } }
            ]"
            route="groups"
            :paging="10"
            @edit="editGroup"
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
        editGroup(group) {
            this.$router.push(`/groups/${group.id}/edit`);
        }
    },

    computed: {
        ...mapState({
            groups: state => state.objects.groups
        }),
        ...mapGetters([
            'protectedGroupsIds'
        ])
    }
};
</script>
