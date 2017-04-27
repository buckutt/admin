<template>
    <div class="b-groups b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Groupes</h3>
            <form @submit.prevent="createObject({ route: 'groups', value: inputGroup() })">
                <mdl-textfield floating-label="Nom" v-model="newGroup.name" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield><br />
                <mdl-button colored raised>Créer</mdl-button>
            </form>

            <br />

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
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

const groupPattern = {
    name: ''
};

export default {
    data() {
        return {
            newGroup: Object.assign({}, groupPattern)
        };
    },

    methods: {
        ...mapActions([
            'createObject',
            'removeObject'
        ]),
        editGroup(group) {
            this.$router.push(`/groups/edit/${group.id}`);
        },
        inputGroup() {
            const inputGroup = Object.assign({}, this.newGroup);
            this.newGroup    = Object.assign({}, groupPattern);

            return inputGroup;
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
