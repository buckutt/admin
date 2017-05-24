<template>
    <div class="b-periods b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <b-navbar
                title="Périodes"
                :tabs="[{ route: '', name: 'Édition' }]"
                :inCard="true"
                :goBack="true">
            </b-navbar>
            <h5>Modifier la période {{ modObject.name }}:</h5>
            <form @submit.prevent="updateObject({ route: 'periods', value: modObject })">
                <mdl-textfield floating-label="Nom" :value="modObject.name" @input="updateModObject({ field:'name', value: $event })" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield>
                <br />
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
                    class="b--limitsize"></b-datetime-picker>
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
                    class="b--limitsize"></b-datetime-picker>
                <br />
                <mdl-button colored raised>Modifier</mdl-button>
            </form>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    methods: {
        ...mapActions([
            'updateObject',
            'updateModObject'
        ])
    },

    computed: {
        ...mapState({
            currentEvent: state => state.app.currentEvent,
            modObject   : state => state.app.modObject
        })
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';
</style>
