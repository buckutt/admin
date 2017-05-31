<template>
    <div>
        <h3>Fondations</h3>
        Les fondations permettent de répartir l'argent des ventes via le système entre plusieurs comptes virtuels.<br />
        <strong>Exemple:</strong> Si vous avez deux associations sur un même stand, et qu'elles souhaitent toutes les deux vendre leurs articles sur une même borne de vente, il est possible d'assigner les ventes d'une partie des articles à une association, et le reste à l'autre.<br />
        <strong>Note:</strong> Les fondations peuvent-être ré-utilisées d'un événement sur l'autre.

        <h5>Mode</h5>
        <form @submit.prevent="updateEvent(modObject)">
            <mdl-radio :value="hasFundations" class="mdl-js-ripple-effect" val="true" @input="updateModObject({ field: 'config.hasFundations', value: true })">Je souhaite utiliser plusieurs fondations</mdl-radio><br />
            <mdl-radio :value="hasFundations" class="mdl-js-ripple-effect" val="false" @input="updateModObject({ field: 'config.hasFundations', value: false })">Je ne souhaite pas utiliser les fondations</mdl-radio>

            <div v-if="hasFundations === 'true' && fundations.length === 0">
                <h5>Création de la première fondation</h5>
                Il est nécessaire de créer un premiere fondation avant de pouvoir passer à la suite.
                <b-fundationcreator></b-fundationcreator>
            </div>

            <br /><br />
            <mdl-button accent raised v-show="showNext">Enregistrer</mdl-button>
        </form>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import FundationsCreate         from '../fundations/FundationsCreate.vue';

export default {
    components: {
        'b-fundationcreator': FundationsCreate
    },

    methods: {
        ...mapActions([
            'createObject',
            'updateObject',
            'updateModObject',
            'updateLastValidatedStep'
        ]),
        updateEvent(event) {
            if (event.config.hasFundations === null) {
                event.config.hasFundations = false;
            }

            if (event.config.hasFundations === false && !event.DefaultFundation_id) {
                this.createObject({ route: 'fundations', value: { name: event.name } })
                    .then((fundation) => {
                        event.DefaultFundation_id = fundation.id;
                        return this.updateObject({ route: 'events', value: event });
                    })
                    .then(() => this.$router.push(`/events/config/${event.id}/periods`));
            } else {
                this.updateObject({ route: 'events', value: event })
                    .then(() => this.$router.push(`/events/config/${event.id}/periods`));
            }
        }
    },

    computed: {
        ...mapState({
            modObject : state => state.app.modObject,
            fundations: state => state.objects.fundations
        }),
        showNext() {
            if ((this.hasFundations === 'true' && this.fundations.length > 0)
                || this.hasFundations === 'false') {
                return true;
            }
            return false;
        },
        hasFundations() {
            return (this.modObject.config.hasFundations) ? 'true' : 'false';
        }
    },

    mounted() {
        this.updateLastValidatedStep(2);
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';
</style>
