<template>
    <label class="mdl-switch mdl-js-switch mdl-js-ripple-effect"
        :for.once='id'
        :class='{ "is-disabled": disabled, "is-checked": isChecked }'>
        <input class="mdl-switch__input" type='checkbox'
            :value='value'
            :disabled='disabled'
            :id.once='id'
            v-model='checked' />
        <span class="mdl-switch__label">
            <slot></slot>
        </span>

    </label>
</template>

<script>
/* global componentHandler */

export default {
    props: {
        checked: {
            type    : [Array, Boolean, Number],
            required: false,
            twoWay  : true
        },
        disabled: {
            required: false
        },
        value: {
            required: false
        },
        id: String
    },
    computed: {
        isChecked () {
            if (Array.isArray(this.checked)) {
                return this.checked.indexOf(this.value) >= 0;
            } else {
                return this.checked;
            }
        }
    },
    ready () {
        componentHandler.upgradeElements(this.$el);
    }
};
</script>
