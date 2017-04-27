<template>
    <div class="b-events b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Évenements</h3>
            <form v-on:submit.prevent="createObject({ route: 'events', value: inputEvent() })">
                <mdl-textfield floating-label="Nom" v-model="newEvent.name" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield><br />
                <mdl-textfield floating-label="Rechargement minimal (en centimes)" v-model="newEvent.config.minReload" required="required" pattern="[0-9]+" error="Le montant doit être un entier"></mdl-textfield><br />
                <mdl-textfield floating-label="Solde maximal (en centimes)" v-model="newEvent.config.maxPerAccount" required="required" pattern="[0-9]+" error="Le montant doit être un entier"></mdl-textfield><br />
                <mdl-textfield floating-label="Unités alcool maximale/participant" v-model="newEvent.config.maxAlcohol" required="required" pattern="[0-9]+" error="Les unités doivent être un entier"></mdl-textfield><br />
                <mdl-button colored raised>Créer</mdl-button>
            </form>
            <br />
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
                    { action: 'remove', text: 'Supprimer', type: 'confirm' }
                ]"
                route="events"
                :paging="10"
                @edit="editEvent"
                @remove="removeObject">
            </b-table>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

const eventPattern = {
    name  : '',
    config: {
        minReload    : 0,
        maxPerAccount: 10000,
        maxAlcohol   : 0
    }
};

export default {
    data() {
        return {
            newEvent: Object.assign({}, eventPattern)
        };
    },

    methods: {
        ...mapActions([
            'createObject',
            'removeObject'
        ]),
        editEvent(event) {
            this.$router.push(`/events/edit/${event.id}`);
        },
        inputEvent() {
            const inputEvent = Object.assign({}, this.newEvent);
            this.newEvent    = Object.assign({}, eventPattern);

            return inputEvent;
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
