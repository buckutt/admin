<template>
    <div>
        <h5>Créer une promotion</h5>
        <form @submit.prevent="createPromotion(newPromotion)">
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
        createPromotion(promotion) {
            this.createObject({ route: 'promotions', value: promotion });
            this.newPromotion = Object.assign({}, promotionPattern);
        }
    }
};
</script>
