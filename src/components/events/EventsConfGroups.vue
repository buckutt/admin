<template>
    <div>
        <h3>Groupes d'utilisateurs</h3>
        Les groupes d'utilisateurs permettent d'associer des tarifs différents selon l'appartenance d'un client à un groupe.<br />
        <strong>Exemple:</strong> Ils peuvent être pratiques pour interdire la vente d'alcool aux mineurs, ou proposer des prix plus bas aux membres de votre équipe.<br />
        <strong>Note:</strong> Les groupes peuvent-être ré-utilisés d'un événement sur l'autre.

        <h5>Mode</h5>
        <form @submit.prevent="updateEvent(modObject)">
            <mdl-radio :value="hasGroups" class="mdl-js-ripple-effect" val="true" @input="updateModObject({ field: 'config.hasGroups', value: true })">Je souhaite utiliser plusieurs groupes</mdl-radio><br />
            <mdl-radio :value="hasGroups" class="mdl-js-ripple-effect" val="false" @input="updateModObject({ field: 'config.hasGroups', value: false })">Je ne souhaite pas utiliser les groupes</mdl-radio>

            <div v-if="hasGroups === 'true' && !modObject.DefaultGroup_id">
                <br />
                Un groupe par défaut (non éditable, non modifiable) du nom de l'événement va être automatiquement créé. Ce groupe contiendra tous les utilisateurs créés au sein de l'événement. Il sera réutilisable via d'autres événements.
            </div>

            <br /><br />
            <mdl-button accent raised v-show="showNext">Enregistrer</mdl-button>
        </form>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
    methods: {
        ...mapActions([
            'createObject',
            'updateObject',
            'updateModObject',
            'updateLastValidatedStep'
        ]),
        updateEvent(event) {
            if (event.config.hasGroups === null) {
                event.config.hasGroups = false;
            }

            if (!event.DefaultGroup_id) {
                this.createObject({ route: 'groups', value: { name: event.name } })
                    .then((group) => {
                        event.DefaultGroup_id = group.id;
                        return this.updateObject({ route: 'events', value: event });
                    })
                    .then(() => this.$router.push(`/events/config/${event.id}/fundations`));
            } else {
                this.updateObject({ route: 'events', value: event })
                    .then(() => this.$router.push(`/events/config/${event.id}/fundations`));
            }
        }
    },

    computed: {
        ...mapState({
            modObject: state => state.app.modObject,
            groups   : state => state.objects.groups
        }),
        showNext() {
            if ((this.hasGroups === 'true' && this.groups.length > 0)
                || this.hasGroups === 'false') {
                return true;
            }
            return false;
        },
        hasGroups() {
            return (this.modObject.config.hasGroups) ? 'true' : 'false';
        }
    },

    mounted() {
        this.updateLastValidatedStep(1);
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';
</style>
