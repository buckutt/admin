<template>
    <div>
        <div v-show="firstLoad">
            <Sidebar></Sidebar>
            <router-view></router-view>
            <mdl-snackbar display-on="snackfilter"></mdl-snackbar>
        </div>
        <div v-show="!firstLoad" class="spinner"></div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import Sidebar from './components/Sidebar.vue';

export default {
    components: {
        Sidebar
    },

    computed: {
        ...mapState({
            firstLoad: state => state.app.firstLoad
        })
    }
};
</script>

<style lang="scss">
    @import './main.scss';
</style>
