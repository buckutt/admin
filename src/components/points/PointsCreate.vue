<template>
    <div>
        <h5>Créer un point</h5>
        <form @submit.prevent="createObject({ route: 'points', value: inputPoint() })">
            <mdl-textfield floating-label="Nom" v-model="newPoint.name" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield>
            <br />
            <mdl-button colored raised>Créer</mdl-button>
        </form>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

const pointPattern = {
    name: ''
};

export default {
    data() {
        return {
            newPoint: Object.assign({}, pointPattern)
        };
    },

    methods: {
        ...mapActions([
            'createObject'
        ]),
        inputPoint() {
            const inputPoint = Object.assign({}, this.newPoint);
            this.newPoint    = Object.assign({}, pointPattern);

            return inputPoint;
        }
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';
</style>
