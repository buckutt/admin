<template>
    <div class="b-clientviewer">
        <div class="b-clientviewer__panel" v-if="selectedWiketItem.name">
            <b-clientpanel></b-clientpanel>
        </div>
        <div class="b-clientviewer__items">
            <p v-if="!wiketCurrentTab.articles || wiketCurrentTab.articles.length === 0">Aucun article à afficher ici.</p>
            <div class="b-clientviewer__articles">
                <b-clientitem
                    v-for="article in wiketCurrentTab.articles"
                    :article="article"
                    :key="article.id">
                </b-clientitem>
            </div>
            <div class="b-clientviewer__promotions" v-if="displayPromotions">
                <div>
                    <strong>Formules</strong>
                    <i class="material-icons" id="promotitle">info</i>
                    <mdl-tooltip target="promotitle">Seules les formules dont les items sont en vente dans le guichet apparaissent.</mdl-tooltip>
                </div>
                <b-clientpromotion
                    v-for="promotion in wiketCurrentTab.promotions"
                    :promotion="promotion"
                    :key="promotion.id">
                </b-clientpromotion>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters }  from 'vuex';
import ClientItem      from './ClientViewer-Item';
import ClientPanel     from './ClientViewer-Panel';
import ClientPromotion from './ClientViewer-Promotion';

export default {
    components: {
        'b-clientitem'     : ClientItem,
        'b-clientpanel'    : ClientPanel,
        'b-clientpromotion': ClientPromotion
    },

    computed: {
        ...mapGetters([
            'wiketCurrentTab',
            'selectedWiketItem'
        ]),

        displayPromotions() {
            return (this.wiketCurrentTab.promotions)
                ? (this.wiketCurrentTab.promotions.length > 0)
                : false;
        }
    }
};
</script>

<style>
    @import '../../../styles/item.css';

    .b-clientviewer {
        & > .b-clientviewer__panel {
            border-bottom: 1px solid #E0E0E0;
            margin: 0px -20px 10px -20px;
            padding: 0px 20px 10px 20px;
        }

        & > .b-clientviewer__items {
            display: flex;

            & > .b-clientviewer__articles {
                align-content: flex-start;
                box-sizing: border-box;
                display: flex;
                flex-wrap: wrap;
                overflow-y: auto;
                padding: 10px;
                flex: 1;
            }

            & > .b-clientviewer__promotions {
                border-left: 1px solid #E0E0E0;
                display: flex;
                flex-direction: column;
                overflow-y: auto;
                width: 20%;
                margin: -10px 0px -20px 0px;
                padding: 20px 0px 0px 20px;

                & > div:first-child {
                    display: flex;
                    align-items: center;

                    & > i {
                        margin-left: 5px;
                        margin-bottom: 2px;
                    }
                }
            }
        }
    }
</style>
