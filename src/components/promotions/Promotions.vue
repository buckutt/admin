<template>
    <div class="b-promotions b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Promotions</h3>
            <form @submit.prevent="createObject({ route: 'promotions', value: inputPromotion() })">
                <mdl-textfield floating-label="Nom" v-model="newPromotion.name"></mdl-textfield><br />
                <mdl-button colored raised>Créer</mdl-button>
            </form>

            <br />

            <b-table
                :headers="[{ title: 'Promotion', field: 'name' }]"
                :data="promotions"
                :sort="{ field: 'name', order: 'ASC' }"
                :actions="[
                    { action: 'edit', text: 'Modifier', raised: true, colored: true },
                    { action: 'remove', text: 'Supprimer', type: 'confirm' }
                ]"
                route="promotions"
                :paging="10"
                @edit="editPromotion"
                @remove="removeObject">
            </b-table>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

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
            'createObject',
            'removeObject'
        ]),
        editPromotion(promotion) {
            this.$router.push(`/promotions/edit/${promotion.id}`);
        },
        inputPromotion() {
            const inputPromotion = Object.assign({}, this.newPromotion);
            this.newPromotion    = Object.assign({}, promotionPattern);

            return inputPromotion;
        }
    },

    computed: {
        ...mapState({
            promotions: state => state.objects.promotions
        })
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';
</style>
