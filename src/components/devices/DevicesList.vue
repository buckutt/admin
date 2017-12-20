<template>
    <div>
        <h5>Liste des équipements</h5>
        <div class="b-table-search">
            <i class="material-icons">search</i>
            <mdl-textfield floating-label="Nom de l'équipement" v-model="name"></mdl-textfield>
        </div>

        <b-table
            :headers="[
                { title: 'Équipement', field: 'name', object: true },
                { title: 'Pré-badgeage', field: 'doubleValidation', type: 'checkbox' },
                { title: 'Alcool', field: 'alcohol', type: 'checkbox' },
                { title: 'Images', field: 'showPicture', type: 'checkbox' }
            ]"
            :data="devices"
            :filter="{ val: this.name, field: 'name' }"
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
    data() {
        return {
            name: ''
        };
    },

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
