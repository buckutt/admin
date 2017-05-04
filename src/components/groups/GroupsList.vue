<template>
    <div>
        <h5>Liste des groupes</h5>
        <b-table
            :headers="[{ title: 'Groupe', field: 'name' }]"
            :data="groups"
            :sort="{ field: 'name', order: 'ASC' }"
            :actions="[
                { action: 'edit', text: 'Modifier', raised: true, colored: true },
                { action: 'remove', text: 'Supprimer', type: 'confirm' }
            ]"
            route="groups"
            :paging="10"
            @edit="editGroup"
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
        editGroup(group) {
            this.$router.push(`/groups/edit/${group.id}`);
        }
    },

    computed: {
        ...mapState({
            groups: state => state.objects.groups
        })
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';
</style>
