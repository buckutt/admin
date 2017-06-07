<template>
    <div>
        <h3>Périodes</h3>
        Les périodes permettent d'établir des droits, ou des prix sur des laps de temps donnés.<br />
        <strong>Exemple:</strong> Mettre en place des happy hours sur une certaine durée, donner les droits de vente sur une certaine durée.<br />
        <strong>Note:</strong> Une période est propre à un événement.

        <h5>Mode</h5>
        <form @submit.prevent="updateEvent(modObject)">
            <mdl-radio :value="hasPeriods" class="mdl-js-ripple-effect" val="true" @input="updateModObject({ field: 'config.hasPeriods', value: true })">Je souhaite utiliser plusieurs périodes</mdl-radio><br />
            <mdl-radio :value="hasPeriods" class="mdl-js-ripple-effect" val="false" @input="updateModObject({ field: 'config.hasPeriods', value: false })">Je ne souhaite pas utiliser les périodes</mdl-radio>

            <div v-if="hasPeriods === 'true' && !modObject.DefaultPeriod_id">
                <br />
                Une période par défaut (non éditable, non supprimable), d'une durée de 100 ans et du nom de l'événement, va être automatiquement créée pour cet événement. Vous pourrez l'utiliser lorsque vous souhaitez assigner des éléments qui devront durer toute la durée de l'événement.
            </div>

            <br /><br />
            <mdl-button accent raised>Enregistrer</mdl-button>
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
            if (event.config.hasPeriods === null) {
                event.config.hasPeriods = false;
            }

            const start     = new Date();
            const end       = new Date().setFullYear(start.getFullYear() + 100);
            const newPeriod = {
                name    : this.modObject.name,
                start,
                end,
                Event_id: this.modObject.id
            };

            if (!event.DefaultPeriod_id) {
                this.createObject({ route: 'periods', value: newPeriod })
                    .then((period) => {
                        event.DefaultPeriod_id = period.id;
                        return this.updateObject({ route: 'events', value: event });
                    })
                    .then(() => this.$router.push(`/events/${event.id}/config/end`));
            } else {
                this.updateObject({ route: 'events', value: event })
                    .then(() => this.$router.push(`/events/${event.id}/config/end`));
            }
        }
    },

    computed: {
        ...mapState({
            modObject: state => state.app.modObject,
            periods  : state => state.objects.periods
        }),
        hasPeriods() {
            return (this.modObject.config.hasPeriods) ? 'true' : 'false';
        }
    },

    mounted() {
        this.updateLastValidatedStep(3);
    }
};
</script>
