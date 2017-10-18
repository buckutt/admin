<template>
    <div class="b-panel">
        <div class="b-panel__item b-item">
            <div class="b-item__image">
                <img draggable="false" height="100%" width="100%" v-if="selectedWiketItem.type === 'article'" />
                <i class="material-icons" v-else>stars</i>
            </div>
            <div class="b-item__text" ref="name">{{ selectedWiketItem.name }}</div>
        </div>
        <div class="b-panel__prices">
            <h4>Tarifs</h4>
            <div v-for="price in selectedWiketItem.prices">
                <span>
                    <i class="material-icons">attach_money</i> {{ price.amount | price(true) }} TTC
                </span>
                <span v-if="currentEvent.usePeriods">
                    <i class="material-icons">alarm</i> {{ price.period.name }}
                </span>
                <span v-if="currentEvent.useFundations">
                    <i class="material-icons">local_atm</i> {{ price.fundation.name }}
                </span>
                <span v-if="currentEvent.useGroups">
                    <i class="material-icons">group</i> {{ price.group.name }}
                </span>
                <template v-if="generateWarning(price)">
                    <mdl-tooltip :target="price.id" class="b--uncapitalize" v-html="generateWarning(price)"></mdl-tooltip>
                    <i :id="price.id" class="material-icons">warning</i>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { getImage }             from '../../../lib/fetchImages';
import textSize                 from '../../../lib/textSize';
import ClientItem               from './ClientViewer-Item';
import '../../../lib/price';

export default {
    components: {
        'b-clientitem': ClientItem
    },

    props: {
        article: Object
    },

    computed: {
        ...mapState({
            currentEvent: state => state.app.currentEvent
        }),
        ...mapGetters([
            'selectedWiketItem'
        ])
    },

    methods: {
        updateItem() {
            const initialFontSize = 16;

            const $name = this.$refs.name;

            if (!$name) {
                return;
            }

            const size    = textSize(this.selectedWiketItem.name);
            const maxSize = 130;

            $name.style.fontSize = `${initialFontSize}px`;
            if (size > maxSize) {
                $name.style.fontSize = `${initialFontSize * (maxSize / size)}px`;
            }

            if (this.selectedWiketItem.type === 'article') {
                getImage(this.selectedWiketItem.id)
                    .then((image) => {
                        this.$el.querySelector('img').src = image.image;
                    })
                    .catch(() => {
                        this.$el.querySelector('img').src = null;
                    });
            }
        },
        generateWarning(price) {
            let warning;

            if (price.fundation_id !== this.currentEvent.DefaultFundation_id
                && !this.currentEvent.useFundations) {
                warning = 'Une fondation autre que<br />celle par défaut est utilisée.';
            }

            if (price.group_id !== this.currentEvent.DefaultGroup_id
                && !this.currentEvent.useGroups) {
                warning = 'Un groupe autre que<br />celui par défaut est utilisé.';
            }

            if (price.period_id !== this.currentEvent.DefaultPeriod_id
                && !this.currentEvent.usePeriods) {
                warning = 'Une période autre que<br />celle par défaut est utilisée.';
            }

            return warning;
        }
    },

    mounted() {
        this.updateItem();
    },

    updated() {
        this.updateItem();
    }
};
</script>

<style>
    .b-panel {
        display: flex;

        & > .b-panel__item {
            & > .b-item__image {
                & > i {
                    font-size: 150px;
                    cursor: default;
                    color: #5B5B5B;
                }
            }
        }

        & > .b-panel__prices {
            margin-left: 20px;
            margin-top: 10px;

            & > h4 {
                margin: 0px;
                margin-bottom: 5px;
            }

            & > div {
                display: flex;

                & > span {
                    display: flex;
                    align-items: center;
                    width: 130px;

                    & > i {
                        margin-right: 5px;
                        font-size: 25px;
                    }
                }
            }
        }
    }
</style>
