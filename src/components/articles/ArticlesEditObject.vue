<template>
    <div class="b-articles-container">
        <div>
            <h5>Modifier l'article {{ modObject.name }}</h5>
            <form @submit.prevent="updateObject({ route: 'articles', value: modObject })">
                <mdl-textfield floating-label="Nom" :value="modObject.name" @input="updateModObject({ field:'name', value: $event })"  required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield>
                <mdl-textfield floating-label="Stock" :value="modObject.stock" @input="updateModObject({ field:'stock', value: $event })"></mdl-textfield><br />
                <mdl-textfield floating-label="Alcool" :value="modObject.alcohol" @input="updateModObject({ field:'alcohol', value: $event })"></mdl-textfield>
                <mdl-textfield floating-label="TVA" :value="modObject.vat" @input="updateModObject({ field:'vat', value: $event })"></mdl-textfield><br />
                <mdl-button colored raised>Modifier</mdl-button>
            </form>
        </div>
        <div>
            <h5>Image</h5>
            <b-uploader :initialImage="modObject.image" :name="modObject.name" @change="updateImage"></b-uploader>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ImageUploader  from '../ImageUploader.vue';

export default {
    components: {
        'b-uploader': ImageUploader
    },

    methods: {
        ...mapActions([
            'updateObject',
            'updateModObject'
        ]),
        updateImage(image) {
            this.updateModObject({ field: 'image', value: image });
            this.updateObject({ route: 'articles', value: this.modObject });
        }
    },

    computed: {
        ...mapState({
            modObject: state => state.app.modObject
        })
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';

    .b-articles-container {
        display: flex;
        flex-wrap: wrap;

        > div:first-child {
            margin-right: 50px;
        }
    }
</style>
