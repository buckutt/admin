<template>
    <router-link
        :to="toLink"
        class="b-item"
        :class="{ 'b-item--selected': selected }">
        <div class="b-item__image">
            <img draggable="false" height="100%" width="100%" />
        </div>
        <div class="b-item__text" ref="name">{{ article.name }}</div>
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
                this.$el.querySelector('img').src = image.image;
            })
            .catch(() => {
                this.$el.querySelector('img').src = null;
            });
    }
};
</script>
