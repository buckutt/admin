<template>
    <div>
        <h5>Créer une fondation</h5>
        <form @submit.prevent="createObject({ route: 'fundations', value: inputFundation() })">
            <mdl-textfield floating-label="Nom" v-model="newFundation.name" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield>
            <br />
            <mdl-button colored raised>Créer</mdl-button>
        </form>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

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
            'createObject'
        ]),
        inputFundation() {
            const inputFundation = Object.assign({}, this.newFundation);
            this.newFundation    = Object.assign({}, fundationPattern);

            return inputFundation;
        }
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';
</style>
