<template>
    <div class="b-devices b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Equipements</h3>
            <form v-on:submit.prevent="createObject({ route: 'devices', value: inputDevice() })">
                <mdl-textfield floating-label="Nom" v-model="newDevice.name" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield><br />
                <mdl-button colored raised>Créer</mdl-button>
            </form>
            <br />
            <b-table
                :headers="[
                    { title: 'Équipement', field: 'name' },
                    { title: 'Temps réel', field: 'realtime', type: 'checkbox'},
                    { title: 'Intervalle', field: 'refreshInterval'},
                    { title: 'Revalidation', field: 'doubleValidation', type: 'checkbox'},
                    { title: 'Alcool', field: 'alcohol', type: 'checkbox'},
                    { title: 'Catégories', field: 'showCategories', type: 'checkbox'},
                    { title: 'Images', field: 'showPicture', type: 'checkbox'}
                ]"
                :data="devices"
                :sort="{ field: 'name', order: 'ASC' }"
                :actions="[
                    { action: 'edit', text: 'Modifier', raised: true, colored: true },
                    { action: 'remove', text: 'Supprimer', type: 'confirm' }
                ]"
                route="devices"
                :paging="10"
                @edit="editDevice"
                @remove="removeObject">
            </b-table>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

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
            'createObject',
            'removeObject'
        ]),
        editDevice(device) {
            this.$router.push(`/devices/edit/${device.id}`);
        },
        inputDevice() {
            const inputDevice = Object.assign({}, this.newDevice);
            this.newDevice    = Object.assign({}, devicePattern);

            return inputDevice;
        }
    },

    computed: {
        ...mapState({
            devices: state => state.objects.devices
        })
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';
</style>
