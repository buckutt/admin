<template>
    <div class="tile-card-event mdl-card" :class="{ 'mdl-shadow--2dp': !active, 'mdl-shadow--8dp': active }">
        <div class="mdl-card__title mdl-card--expand" @click="selectEvent(event)" @mouseover="active = true" @mouseleave="active = false">
            <h4>
                {{ event.name }}
            </h4>
        </div>
        <div class="mdl-card__actions mdl-card--border">
            <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" @click="editEvent(event)">
                Paramétrer
            </a>
            <div class="mdl-layout-spacer"></div>
            <b-confirm @confirm="deleteEvent(event)">
                <a class="mdl-button mdl-js-button mdl-button--icon">
                    <i class="material-icons">delete</i>
                </a>
            </b-confirm>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        event: {
            type    : Object,
            required: true
        }
    },

    data() {
        return {
            active: false
        };
    },

    methods: {
        selectEvent(event) {
            this.$emit('select', event);
        },
        editEvent(event) {
            this.$emit('edit', event);
        },
        deleteEvent(event) {
            this.$emit('delete', event);
        }
    }
};
</script>

<style>
    .tile-card-event.mdl-card {
        width: 256px;
        height: 256px;
        background: #3E4EB8;
    }

    .tile-card-event > .mdl-card__actions {
        border-color: rgba(255, 255, 255, 0.2);
    }

    .tile-card-event > .mdl-card__title {
        align-items: flex-start;
        cursor: pointer;
    }

    .tile-card-event > .mdl-card__title > h4 {
        margin-top: 0;
    }

    .tile-card-event > .mdl-card__actions {
        display: flex;
        box-sizing: border-box;
        align-items: center;
    }

    .tile-card-event > .mdl-card__actions > .material-icons {
        padding-right: 10px;
    }

    .tile-card-event > .mdl-card__title,
    .tile-card-event > .mdl-card__actions,
    .tile-card-event > .mdl-card__actions > .mdl-button {
        color: #fff;
    }
</style>
