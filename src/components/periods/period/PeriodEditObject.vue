<template>
    <div>
        <h5>Modifier la période</h5>
        <form @submit.prevent="updatePeriod(modObject)">
            <mdl-textfield floating-label="Nom" :value="modObject.name" @input="updateModObject({ field: 'name', value: $event })" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield>
            <br />
            <span v-if="isPeriodProtected">Il n'est pas possible de modifier le début ainsi que la fin de la période par défaut de l'événement.</span>
            <b-datetime-picker
                :value="new Date(modObject.start)"
                @input="updateModObject({ field: 'start', value: $event })"
                locale="fr"
                header-format="DD MMM"
                cancel="Annuler"
                next="Suivant"
                back="Retour"
                pattern="\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}"
                error="Le début n'est pas une date"
                label="Début"
                class="b--limitsize"
                v-if="!isPeriodProtected"></b-datetime-picker>
            <br />
            <b-datetime-picker
                :value="new Date(modObject.end)"
                @input="updateModObject({ field: 'end', value: $event })"
                locale="fr"
                header-format="DD MMM"
                cancel="Annuler"
                next="Suivant"
                back="Retour"
                pattern="\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}"
                error="La fin n'est pas une date"
                label="Fin"
                class="b--limitsize"
                v-if="!isPeriodProtected"></b-datetime-picker>
            <br />
            <mdl-button colored raised>Modifier</mdl-button>
        </form>
    </div>
</template>

<script>
import pick from 'lodash.pick';
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
    methods: {
        ...mapActions([
            'updateObject',
            'updateModObject',
            'notify',
            'notifyError'
        ]),
        updatePeriod(period) {
            const fields = ['id', 'name', 'start', 'end'];

            this.updateObject({ route: 'periods', value: pick(period, fields) })
                .then(() => this.notify({ message: 'La période a bien été modifiée' }))
                .catch(err => this.notifyError({
                    message: 'Une erreur a eu lieu lors de la modification de la période',
                    full   : err
                }));
        }
    },

    computed: {
        ...mapState({
            modObject: state => state.app.modObject
        }),
        ...mapGetters([
            'protectedPeriodsIds'
        ]),
        isPeriodProtected() {
            return (this.protectedPeriodsIds.indexOf(this.modObject.id) > -1);
        }
    }
};
</script>
