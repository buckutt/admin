<template>
    <div>
        <h5>Liste des équipements</h5>
        <b-table
            :headers="[
                { title: 'Équipement', field: 'name', object: true },
                { title: 'Pré-badgeage', field: 'doubleValidation', type: 'checkbox' },
                { title: 'Alcool', field: 'alcohol', type: 'checkbox' },
                { title: 'Images', field: 'showPicture', type: 'checkbox' }
            ]"
            :data="devices"
            :sort="{ field: 'name', order: 'ASC' }"
            :actions="[
                { action: 'edit', text: 'Modifier' },
                { action: 'remove', text: 'Supprimer', type: 'confirm' }
            ]"
            route="devices"
            :paging="10"
            @edit="editDevice"
            @remove="removeObject">
        </b-table>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    methods: {
        ...mapActions([
            'removeObject'
        ]),
        editDevice(device) {
            this.$router.push(`/devices/${device.id}/edit`);
        }
    },

    computed: {
        ...mapState({
            devices: state => state.objects.devices
        })
    }
};
</script>
