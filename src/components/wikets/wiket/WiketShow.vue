<template>
    <div class="b-wikets b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <b-navbar
                :title="title"
                :tabs="displayedTabs"
                :inCard="true"
                :goBack="true"
                :level="3">
            </b-navbar>

            <b-clientviewer></b-clientviewer>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import ClientViewer from './ClientViewer';

export default {
    components: {
        'b-clientviewer': ClientViewer
    },

    methods: {
        ...mapActions([
            'fetchObjectsAndRelations'
        ])
    },

    computed: {
        ...mapState({
            modObject: state => state.app.modObject,
            fullPath : state => state.route.fullPath,
            params   : state => state.route.params
        }),

        ...mapGetters([
            'wiketCategories'
        ]),

        title() {
            return `Guichet ${this.modObject.name}`;
        },

        displayedTabs() {
            return this.wiketCategories
                .map(category => ({
                    route: category.id,
                    name : category.name
                }));
        }
    },

    mounted() {
        this.fetchObjectsAndRelations({ route: 'prices' });
        this.fetchObjectsAndRelations({ route: 'promotions' });

        if (!this.params.category && this.displayedTabs[0]) {
            this.$router.push(`${this.fullPath}/category/${this.displayedTabs[0].route}`);
        }
    }
};
</script>
