<template>
    <div>
        <h5>Créer un groupe </h5>
        <form @submit.prevent="createObject({ route: 'groups', value: inputGroup() })">
            <mdl-textfield floating-label="Nom" v-model="newGroup.name" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield><br />
            <mdl-button colored raised>Créer</mdl-button>
        </form>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

const groupPattern = {
    name: ''
};

export default {
    data() {
        return {
            newGroup: Object.assign({}, groupPattern)
        };
    },

    methods: {
        ...mapActions([
            'createObject'
        ]),
        inputGroup() {
            const inputGroup = Object.assign({}, this.newGroup);
            this.newGroup    = Object.assign({}, groupPattern);

            return inputGroup;
        }
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';
</style>
