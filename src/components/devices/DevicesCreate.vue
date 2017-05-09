<template>
    <div>
        <h5>Créer un équipement</h5>
        <form @submit.prevent="createObject({ route: 'devices', value: newDevice })">
            <mdl-textfield floating-label="Nom" v-model="newDevice.name" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield><br />
            <mdl-button colored raised>Créer</mdl-button>
        </form>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

const devicePattern = {
    name            : '',
    fingerprint     : '',
    realtime        : false,
    refreshInterval : 5,
    doubleValidation: false,
    alcohol         : false,
    showCategories  : false,
    showPicture     : false
};

export default {
    data() {
        return {
            newDevice: Object.assign({}, devicePattern)
        };
    },

    methods: {
        ...mapActions([
            'createObject'
        ]),
        createDevice(device) {
            this.createObject({ route: 'devices', value: device });
            this.newDevice = Object.assign({}, devicePattern);
        }
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';
</style>
