<template>
    <div>
        <h5>Créer un équipement</h5>
        <form @submit.prevent="createDevice(newDevice)">
            <mdl-textfield floating-label="Nom" v-model="newDevice.name" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield><br />
            <mdl-button colored raised>Créer</mdl-button>
        </form>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

const devicePattern = {
    name: ''
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
