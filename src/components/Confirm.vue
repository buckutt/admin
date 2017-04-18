<template>
    <div>
        <transition name="fade">
            <mdl-button raised accent v-show="!confirm" @click.native="switchConfirm()">
                <slot></slot>
            </mdl-button>
        </transition>
        <transition name="fade">
            <div v-show="confirm">
                <mdl-button raised disabled>
                    <slot></slot> ?
                </mdl-button>
                <mdl-button mini-fab colored @click.native="switchConfirm();func()">
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
        func: {
            type    : [Function, Promise],
            required: true
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
        }
    }
};
</script>
