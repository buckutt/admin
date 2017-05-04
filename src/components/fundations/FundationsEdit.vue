<template>
    <div class="b-fundations b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <b-navbar
                title="Fondations"
                :tabs="[{ route: '', name: 'Édition' }]"
                :inCard="true"
                :goBack="true">
            </b-navbar>
            <h5>Modifier la fondation {{ modObject.name }}:</h5>
            <form @submit.prevent="updateObject({ route: 'fundations', value: modObject })">
                <mdl-textfield floating-label="Nom" :value="modObject.name" @input="updateModObject({ field:'name', value: $event })" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield><br />
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
            modObject: state => state.app.modObject
        })
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';
</style>
