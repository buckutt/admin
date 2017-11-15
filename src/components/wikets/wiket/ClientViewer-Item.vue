<template>
    <router-link
        :to="toLink"
        class="b-item"
        :class="{ 'b-item--selected': selected }">
        <div class="b-item__image">
            <img :src="image" draggable="false" height="100%" width="100%" />
        </div>
        <div class="b-item__text" ref="name">{{ article.name }}</div>
        <div class="b-item__grayfilter" v-if="gray">Pas de prix défini</div>
    </router-link>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { getImage } from '../../../lib/fetchImages';
import textSize     from '../../../lib/textSize';

export default {
    props: {
        article: Object
    },

    data() {
        return {
            image: null
        };
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
            return (this.selectedWiketItem.type) ?
                (this.selectedWiketItem.id === this.article.id && this.selectedWiketItem.type === 'article') :
                false;
        },
        gray() {
            return this.article.prices.length === 0;
        },
        toLink() {
            if (!this.params.article && !this.params.promotion) {
                return `${this.fullPath}/article/${this.article.id}`;
            }

            const basePath = this.fullPath
                .split('/')
                .slice(0, -2)
                .join('/');

            return `${basePath}/article/${this.article.id}`;
        }
    },

    mounted() {
        const initialFontSize = 16;

        const $name   = this.$refs.name;
        const size    = textSize(this.article.name);
        const maxSize = 130;

        if (size > maxSize) {
            $name.style.fontSize = `${initialFontSize * (maxSize / size)}px`;
        }

        getImage(this.article.id)
            .then((image) => {
                this.image = image.image;
            })
            .catch(() => {
                this.image = null;
            });
    }
};
</script>
