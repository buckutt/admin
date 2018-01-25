<template>
    <div>
        <h5>Détails de la catégorie</h5>
        <b-list :elements="elements"></b-list>

        <h5 v-if="articles.length > 0">Articles dans la catégorie</h5>
        <b-list :elements="articles" :columns="3"></b-list>
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

        articles() {
            return this.modObject.articles.map(article => ({
                icon   : 'free_breakfast',
                content: article.name
            }));
        }
    }
};
</script>
