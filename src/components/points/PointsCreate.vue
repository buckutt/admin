<template>
    <div>
        <h5>Créer un point</h5>
        <form @submit.prevent="createPoint(newPoint)">
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
        createPoint(point) {
            this.createObject({ route: 'points', value: point });
            this.newPoint = Object.assign({}, pointPattern);
        }
    }
};
</script>
