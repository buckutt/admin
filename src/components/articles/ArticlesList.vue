<template>
    <div>
        <h5>Rechercher un article</h5>
        <mdl-textfield floating-label="Nom" v-model="name"></mdl-textfield>

        <b-table
            :headers="[{ title: 'Article', field: 'name' }]"
            :data="articles"
            :filter="{ val: this.name, field: 'name' }"
            :sort="{ field: 'name', order: 'ASC' }"
            :actions="[
                { action: 'edit', text: 'Modifier', raised: true, colored: true },
                { action: 'remove', text: 'Supprimer', type: 'confirm' }
            ]"
            route="articles"
            :paging="5"
            @edit="editArticle"
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
        editArticle(article) {
            this.$router.push(`/articles/edit/${article.id}`);
        }
    },

    computed: {
        ...mapState({
            articles: state => state.objects.articles
        })
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';
</style>
