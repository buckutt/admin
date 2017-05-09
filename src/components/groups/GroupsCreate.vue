<template>
    <div>
        <h5>Créer un groupe </h5>
        <form @submit.prevent="createGroup(newGroup)">
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
        createGroup(group) {
            this.createObject({ route: 'groups', value: group });
            this.newGroup = Object.assign({}, groupPattern);
        }
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';
</style>
