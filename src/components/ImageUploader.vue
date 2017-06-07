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
export default {
    props: {
        name        : String,
        initialImage: {
            type    : String,
            required: false
        }
    },

    data() {
        return {
            image: (this.initialImage) ? this.initialImage : null
        };
    },

    methods: {
        onImageChange(event) {
            const file   = event.target.files[0];
            const reader = new FileReader();

            reader.addEventListener('load', () => {
                this.image = reader.result;
                this.$emit('change', this.image);
            });

            if (file) {
                reader.readAsDataURL(file);
            }
        }
    }
};
</script>

<style lang="scss">
    .b-imageUploader {
        background-image: url('../assets/placeholder.jpg');
        background-repeat: no-repeat;
        width: 150px;
        height: 150px;
        box-shadow: 0 0 2px rgba(#222, 0.25),
                    0 2px 3px rgba(#222, 0.25);
        border-radius: 2px;

        > .b-imageUploader__image {
            position: relative;
            width: 100%;
            height: 100%;
        }

        > .b-imageUploader__add {
            position: relative;
            top: -35px;
            left: 115px;

            > input[type="file"] {
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
