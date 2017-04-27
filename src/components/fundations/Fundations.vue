<template>
    <div class="b-fundations b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Fondations</h3>
            <form @submit.prevent="createObject({ route: 'fundations', value: inputFundation() })">
                <mdl-textfield floating-label="Nom" v-model="newFundation.name" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield>
                <br />
                <mdl-button colored raised>Créer</mdl-button>
            </form>

            <br />

            <b-table
                :headers="[{ title: 'Fondation', field: 'name' }]"
                :data="fundations"
                :sort="{ field: 'name', order: 'ASC' }"
                :actions="[
                    { action: 'edit', text: 'Modifier', raised: true, colored: true },
                    { action: 'remove', text: 'Supprimer', type: 'confirm' }
                ]"
                route="fundations"
                :paging="10"
                @edit="editFundation"
                @remove="removeObject">
            </b-table>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

const fundationPattern = {
    name: ''
};

export default {
    data() {
        return {
            newFundation: Object.assign({}, fundationPattern)
        };
    },

    methods: {
        ...mapActions([
            'createObject',
            'removeObject'
        ]),
        editFundation(fundation) {
            this.$router.push(`/fundations/edit/${fundation.id}`);
        },
        inputFundation() {
            const inputFundation = Object.assign({}, this.newFundation);
            this.newFundation    = Object.assign({}, fundationPattern);

            return inputFundation;
        }
    },

    computed: {
        ...mapState({
            fundations: state => state.objects.fundations
        })
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';
</style>
