<template>
    <div class="b--inline">
        <transition name="fade">
            <mdl-button raised accent :disabled="confirm || disabled" @click.native="switchConfirm()">
                <slot></slot>
            </mdl-button>
        </transition>
        <transition name="fade">
            <div v-show="confirm" class="b--inline">
                <mdl-button mini-fab colored @click.native="validate()">
                    <i class="material-icons">done</i>
                </mdl-button>
                <mdl-button mini-fab @click.native="switchConfirm()">
                    <i class="material-icons">clear</i>
                </mdl-button>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    props: {
        disabled: {
            type    : Boolean,
            required: false
        }
    },

    data() {
        return {
            confirm: false
        };
    },

    methods: {
        switchConfirm() {
            this.confirm = !this.confirm;
        },

        validate() {
            this.switchConfirm();
            this.$emit('confirm');
        }
    }
};
</script>
