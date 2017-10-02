<template>
    <router-link
        :to="wiket.id"
        append
        class="tile-card-wiket mdl-card"
        :class="{ 'mdl-shadow--2dp': !active, 'mdl-shadow--8dp': active }"
        @mouseover.native="active = true"
        @mouseleave.native="active = false">
        <div class="mdl-card__title mdl-card--expand">
            <h4>
                {{ wiket.point.name }}
            </h4>
        </div>
        <div class="mdl-card__supporting-text">
            Sur les équipements:
            <div v-for="(device, index) in wiket.devices">
                <span>
                    <i class="material-icons">devices</i> {{ device.name }}
                </span>
                <span v-if="currentEvent.config.hasPeriods">
                    <i class="material-icons">alarm</i> {{ device._through.period.name }}
                </span>
                <template v-else-if="device._through.period.id !== currentEvent.DefaultPeriod_id">
                    <mdl-tooltip :target="`wiket_${index}`" class="b--uncapitalize">
                        Une période autre que<br />celle par défaut est utilisée.
                    </mdl-tooltip>
                    <i :id="`wiket_${index}`" class="material-icons">warning</i>
                </template>
            </div>
        </div>
    </router-link>
</template>

<script>
import { mapState } from 'vuex';

export default {
    props: {
        wiket: {
            type    : Object,
            required: true
        }
    },

    data() {
        return {
            active: false
        };
    },

    computed: {
        ...mapState({
            currentEvent: state => state.app.currentEvent
        })
    }
};
</script>

<style>
    .tile-card-wiket.mdl-card {
        display: flex;
        width: 256px;
        height: 256px;
        margin: 10px;
        text-decoration: none;
    }

    .tile-card-wiket > .mdl-card__title {
        align-items: flex-start;
    }

    .tile-card-wiket > .mdl-card__title > h4 {
        margin-top: 0;
    }

    .tile-card-wiket > .mdl-card__supporting-text {
        height: 125px;
        width: 250px;
        overflow-y: overlay;

        & > div {
            display: flex;

            & > span {
                display: flex;
                align-items: center;
                width: 50%;
                flex: auto;

                & > i {
                    margin-right: 5px;
                    font-size: 25px;
                }
            }
        }
    }

    .tile-card-wiket > .mdl-card__title {
        color: #000;
    }
</style>
