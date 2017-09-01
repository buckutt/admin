<template>
    <div class="b-imageUploader">
        <img :src="image" :alt="name" v-show="image" class="b-imageUploader__image" />
        <div class="b-imageUploader__image" v-show="!image"></div>
        <mdl-tooltip target="add-button">Parcourir</mdl-tooltip>
        <mdl-button id="add-button" fab colored
            class="b-imageUploader__add mdl-js-ripple-effect">
          <i class="material-icons">attach_file</i>
          <input type="file" @change="onImageChange" accept="image/*" />
        </mdl-button>
    </div>
</template>

<script>
import { getImage, postImage } from '../lib/fetchImages';

export default {
    props: {
        id  : String,
        name: String
    },

    data() {
        return {
            image: null
        };
    },

    methods: {
        onImageChange(event) {
            const file   = event.target.files[0];
            const reader = new FileReader();

            reader.addEventListener('load', () => {
                this.image = reader.result;
                postImage(this.id, this.image)
                    .then(() => this.$emit('change', false))
                    .catch(err => this.$emit('change', err));
            });

            if (file) {
                reader.readAsDataURL(file);
            }
        }
    },

    mounted() {
        getImage(this.id)
            .then((result) => {
                this.image = result.image;
            })
            .catch(() => {
                this.image = null;
            });
    }
};
</script>

<style>
    .b-imageUploader {
        background-image: url('../assets/placeholder.jpg');
        background-repeat: no-repeat;
        width: 150px;
        height: 150px;
        box-shadow: 0 0 2px color(#222 a(0.25)),
                    0 2px 3px color(#222 a(0.25));
        border-radius: 2px;

        & > .b-imageUploader__image {
            position: relative;
            width: 100%;
            height: 100%;
        }

        & > .b-imageUploader__add {
            position: relative;
            top: -35px;
            left: 115px;

            & > input[type="file"] {
                cursor: pointer;
                height: 100%;
                right: 0;
                opacity: 0;
                position: absolute;
                top: 0;
                width: 100%;
                z-index: 4;
            }
        }
    }
</style>
