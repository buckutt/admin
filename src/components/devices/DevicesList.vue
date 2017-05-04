<template>
    <div>
        <h5>Liste des équipements</h5>
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
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    methods: {
        ...mapActions([
            'removeObject'
        ]),
        editDevice(device) {
            this.$router.push(`/devices/edit/${device.id}`);
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
