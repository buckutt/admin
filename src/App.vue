<template>
    <div>
    	<Sidebar></Sidebar>
    	<router-view></router-view>
    	<mdl-snackbar display-on="snackfilter"></mdl-snackbar>
    </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue';

export default {
    components: {
        Sidebar
    }
};
</script>
