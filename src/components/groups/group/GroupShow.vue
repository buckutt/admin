<template>
    <div class="b-groups b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <b-navbar
                :title="title"
                :tabs="[{ route: '', name: 'Détails', exact: true }, { route: 'edit', name: 'Édition' }, { route: 'members', name: 'Membres' }]"
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
            return `Groupe ${this.modObject.name}`;
        }
    }
};
</script>
