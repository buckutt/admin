<template>
    <div>
        <h5>Créer une promotion</h5>
        <form @submit.prevent="createObject({ route: 'promotions', value: inputPromotion() })">
            <mdl-textfield floating-label="Nom" v-model="newPromotion.name"></mdl-textfield><br />
            <mdl-button colored raised>Créer</mdl-button>
        </form>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

const promotionPattern = {
    name: ''
};

export default {
    data() {
        return {
            newPromotion: Object.assign({}, promotionPattern)
        };
    },

    methods: {
        ...mapActions([
            'createObject'
        ]),
        inputPromotion() {
            const inputPromotion = Object.assign({}, this.newPromotion);
            this.newPromotion    = Object.assign({}, promotionPattern);

            return inputPromotion;
        }
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';
</style>
