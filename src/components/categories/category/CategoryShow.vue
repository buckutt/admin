<template>
    <div class="b-categories b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <b-navbar
                :title="title"
                :tabs="[{ route: '', name: 'Détails' }, { route: 'edit', name: 'Édition' }, { route: 'articles', name: 'Articles' }]"
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
            return `Catégorie ${this.modObject.name}`;
        }
    }
};
</script>
