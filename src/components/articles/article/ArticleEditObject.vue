<template>
    <div class="b-articles-container">
        <div>
            <h5>Modifier l'article {{ modObject.name }}</h5>
            <form @submit.prevent="updateArticle(modObject)">
                <mdl-textfield floating-label="Nom" :value="modObject.name" @input="updateModObject({ field: 'name', value: $event })"  required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield>
                <mdl-textfield floating-label="Stock" :value="modObject.stock" @input="updateModObject({ field: 'stock', value: $event })"></mdl-textfield><br />
                <mdl-textfield floating-label="Alcool" :value="modObject.alcohol" @input="updateModObject({ field: 'alcohol', value: $event })"></mdl-textfield>
                <mdl-textfield floating-label="TVA (%, ex: 5.5)" :value="displayedVat" @input="updateModObject({ field: 'vat', value: $event / 100 })"></mdl-textfield><br />
                <mdl-button colored raised>Modifier</mdl-button>
            </form>
        </div>
        <div>
            <h5>Image</h5>
            <b-uploader :id="modObject.id" :name="modObject.name" @change="imageUpdated"></b-uploader>
        </div>
    </div>
</template>

<script>
import pick from 'lodash.pick';
import { mapState, mapActions } from 'vuex';
import ImageUploader from '../../ImageUploader.vue';

export default {
    components: {
        'b-uploader': ImageUploader
    },

    methods: {
        ...mapActions([
            'updateObject',
            'updateModObject',
            'notify',
            'notifyError'
        ]),

        updateArticle(article) {
            const fields = ['id', 'name', 'stock', 'alcohol', 'vat'];

            this.updateObject({ route: 'articles', value: pick(article, fields) })
                .then(() => this.notify({ message: 'L\'article a bien été modifié' }))
                .catch(err => this.notifyError({
                    message: 'Une erreur a eu lieu lors de la modification de l\'article',
                    full   : err
                }));
        },

        imageUpdated(error) {
            if (error) {
                return this.notifyError({ message: 'L\'image de l\'article a bien été modifiée', full: error });
            }

            this.notify({ message: 'L\'image de l\'article a bien été modifiée' });
        }
    },

    computed: {
        ...mapState({
            modObject: state => state.app.modObject
        }),

        displayedVat() {
            return +(this.modObject.vat * 100).toFixed(2);
        }
    }
};
</script>

<style>
    .b-articles-container {
        display: flex;
        flex-wrap: wrap;

        & > div:first-child {
            margin-right: 50px;
        }
    }
</style>
