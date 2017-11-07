<template>
    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select" ref="textfield">
        <input
            type="text"
            class="mdl-textfield__input"
            :id="id"
            v-model="content"
            @input="changeInput(content)"
            @focus="displayInput = true"
            @blur="displayInput = false"
            @keydown.up.prevent.stop="up()"
            @keydown.down.prevent.stop="down()"
            @keydown.enter.prevent.stop="select(suggestions[activeIndex])"
            @keydown.tab="displayMenu = false"
            ref="input"
            autocomplete="off" />
        <label :for="id">
            <i class="mdl-icon-toggle__label material-icons">keyboard_arrow_down</i>
        </label>
        <label class="mdl-textfield__label" :for="id">{{ label }}</label>
        <transition name="slide-top">
            <ul
                :for="id"
                class="b-completelist mdl-shadow--2dp"
                ref="menu"
                v-if="displayInput || displayMenu"
                @mouseenter="displayMenu = true"
                @mouseout="displayMenu = false">
                <li
                    v-for="(suggestion, index) in suggestions"
                    @click="select(suggestion)"
                    @mouseover="activeIndex = index"
                    class="b-completelist__item"
                    :class="{ 'b-completelist__item-active': (index === activeIndex) }">
                    {{ suggestion.name }}
                </li>
            </ul>
        </transition>
    </div>
</template>

<script>
import fuzzy from 'fuzzy';

export default {
    props: {
        id: {
            type    : String,
            required: true
        },
        label: {
            type    : String,
            required: true
        },
        options: {
            type    : Array,
            required: true
        },
        fullOptions: {
            type    : Array,
            required: false
        },
        value: {
            required: false
        }
    },

    data() {
        return {
            content         : '',
            displayInput    : false,
            displayMenu     : false,
            activeIndex     : 0,
            ignoreNextUpdate: false
        };
    },

    computed: {
        suggestions() {
            return (this.content) ?
                fuzzy
                    .filter(this.content, this.convertOptions(this.database), { extract: el => el.name })
                    .map(d => d.original) :
                this.convertOptions(this.options);
        },
        database() {
            return (this.fullOptions) ? this.fullOptions : this.options;
        }
    },

    methods: {
        select(suggestion) {
            this.$refs.textfield.MaterialTextfield.change(suggestion.name);
            this.$refs.textfield.MaterialTextfield.boundBlurHandler();
            this.$refs.input.blur();
            this.content          = suggestion.name;
            this.displayMenu      = false;
            this.ignoreNextUpdate = true;
            this.$emit('input', suggestion.value);
        },
        changeInput(content) {
            if (this.suggestions.length === 1 && this.suggestions[0].name.toLowerCase() === content.toLowerCase()) {
                return this.select(this.suggestions[0]);
            }

            this.ignoreNextUpdate = true;
            this.$emit('input', undefined);
        },
        convertOptions(options) {
            return options.map(option => (
                (!option.name && !option.value) ? { name: option, value: option } : option
            ));
        },
        down() {
            if (this.activeIndex + 1 >= this.suggestions.length) {
                this.activeIndex = 0;
                return;
            }

            this.activeIndex += 1;
        },
        up() {
            if (this.activeIndex <= 0) {
                this.activeIndex = this.suggestions.length - 1;
                return;
            }

            this.activeIndex -= 1;
        }
    },

    mounted() {
        componentHandler.upgradeElements(this.$el);

        if (this.value) {
            const object = this.suggestions
                .find(suggestion => (JSON.stringify(this.value) === JSON.stringify(suggestion.value)));
            this.select(object);
        }
    },

    watch: {
        value(newValue) {
            if (this.ignoreNextUpdate) {
                this.ignoreNextUpdate = false;
                return;
            }

            const object = this.suggestions
                .find(suggestion => (JSON.stringify(newValue) === JSON.stringify(suggestion.value)));

            if (object) {
                this.select(object);
            } else {
                this.content = newValue;
                this.$refs.textfield.MaterialTextfield.change(newValue);
            }
        }
    }
};
</script>

<style>
    .getmdl-select .mdl-icon-toggle__label {
        float: right;
        margin-top: -30px;
        color: rgba(0, 0, 0, 0.4);
    }
    .getmdl-select.is-focused .mdl-icon-toggle__label {
        color: #3f51b5;
    }

    .b-completelist {
        width: 100%;
        background: white;
        position: absolute;
        z-index: 10;
        margin-top: 0px;
        margin-bottom: 0px;
        list-style: none;
        padding: 0;
        color: black;
        max-height: 300px;
        overflow: auto;
        transition: .2s opacity ease-out,
                    .2s transform ease-out;
    }

    .b-completelist__item {
        display: block;
        position: relative;
        height: 48px;
        line-height: 48px;
        padding-left: 10px;
        cursor: pointer;
        font-size: 16px;
        padding: 0 16px;
    }

    .b-completelist__item-active {
        background: #EEEEEE;
        transition: all 0.1s ease-in-out;
    }

    .slide-top-enter,
    .slide-top-leave-to {
        opacity: 0;
        transform: translateY(-15px) scale(0.8);
        transform-origin: top left;
    }

    .slide-top-leave,
    .slide-top-enter-to {
        opacity: 1;
        transform: translateY(0) scale(1);
        transform-origin: top left;
    }
</style>
