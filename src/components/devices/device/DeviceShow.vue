<template>
    <div class="b-devices b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <b-navbar
                :title="title"
                :tabs="[{ route: '', name: 'Détails' }, { route: 'edit', name: 'Édition' }, { route: 'assign', name: 'Assignation' }, { route: 'ssl', name: 'Certificat SSL' }]"
                :inCard="true"
                :goBack="true"
                :level="2">
            </b-navbar>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState({
            modObject: state => state.app.modObject
        }),
        title() {
            return `Équipement ${this.modObject.name}`;
        }
    }
};
</script>
