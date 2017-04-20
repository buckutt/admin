<template>
    <div>
        <transition name="fade">
            <mdl-button raised accent :disabled="confirm" @click.native="switchConfirm()">
                <slot></slot>
            </mdl-button>
        </transition>
        <transition name="fade">
            <div v-show="confirm">
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
