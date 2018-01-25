<template>
    <router-link
        :to="toLink"
        class="b-promotion"
        :class="{ 'b-promotion--selected': selected, 'b-promotion--gray': gray }">
        <i class="material-icons">stars</i>
        {{ promotion.name }}
    </router-link>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
    props: {
        promotion: Object
    },

    computed: {
        ...mapState({
            fullPath: state => state.route.fullPath,
            params  : state => state.route.params
        }),

        ...mapGetters([
            'selectedWiketItem'
        ]),

        selected() {
            return (this.selectedWiketItem.type)
                ? (this.selectedWiketItem.id === this.promotion.id && this.selectedWiketItem.type === 'promotion')
                : false;
        },

        gray() {
            return this.promotion.prices.length === 0;
        },

        toLink() {
            if (!this.params.article && !this.params.promotion) {
                return `${this.fullPath}/promotion/${this.promotion.id}`;
            }

            const basePath = this.fullPath
                .split('/')
                .slice(0, -2)
                .join('/');

            return `${basePath}/promotion/${this.promotion.id}`;
        }
    }
};
</script>

<style>
    .b-promotion {
        width: 100%;
        display: flex;
        align-items: center;
        text-align: left;
        text-decoration: none;
        padding-left: 10px;
        color: #222 !important;
        text-transform: uppercase;
        padding: 7px 16px;

        &:hover {
            background-color: rgba(158,158,158,.2);
        }

        & > i {
            margin-right: 10px;
        }

        &--gray {
            color: #848281 !important;
        }

        &--selected {
            background: #E1E1E1 !important;
        }
    }
</style>
