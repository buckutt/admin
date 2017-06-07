<template>
    <div>
        <h5>Détails du point</h5>
        <b-list :elements="elements"></b-list>

        <h5 v-if="categories.length > 0">Catégories liées au point</h5>
        <b-list :elements="categories" :columns="3"></b-list>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState({
            modObject: state => state.app.modObject
        }),
        elements() {
            return [
                {
                    icon   : 'keyboard_arrow_right',
                    title  : 'Nom',
                    content: this.modObject.name
                }
            ];
        },
        categories() {
            return this.modObject.categories.map(category => ({
                icon   : 'format_list_numbered',
                content: category.name
            }));
        }
    }
};
</script>
