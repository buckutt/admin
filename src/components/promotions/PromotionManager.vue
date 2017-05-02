<template>
    <div class="b-promotions__contentManager">
        <div>
            <h5>Contenu de la promotion :</h5>
            <transition name="fade">
                <div class="b-responsive-table">
                    <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp" v-if="displayedPromotion.length > 0">
                       <thead>
                            <tr>
                                <th class="mdl-data-table__cell--non-numeric">Ensemble</th>
                                <th class="mdl-data-table__cell--non-numeric">Choix possibles</th>
                                <th class="mdl-data-table__cell--non-numeric" v-show="typeof displayRemove === 'number' || displayChoose">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(set, index) in displayedPromotion">
                                <td class="mdl-data-table__cell--non-numeric">
                                    <strong>{{ index + 1 }}</strong>
                                </td>
                                <td class="mdl-data-table__cell--non-numeric">
                                    <transition-group name="fade">
                                        <mdl-button v-for="(article, indexA) in set.articles" :key="index+'_'+indexA" @click.native="chooseArticle(article, index)">{{ article.name }}</mdl-button>
                                    </transition-group>
                                </td>
                                <transition name="fade">
                                    <td class="mdl-data-table__cell--non-numeric b--right" v-show="displayChoose">
                                        <mdl-button raised colored @click.native="addChosenArticleToStep(promotion, index)"><i class="material-icons">add</i></mdl-button>
                                    </td>
                                </transition>
                                <transition name="fade">
                                    <td class="mdl-data-table__cell--non-numeric b--right" v-show="displayRemove === index">
                                        <mdl-button raised accent @click.native="removeChosenArticleFromStep(promotion, index)"><i class="material-icons">remove</i></mdl-button>
                                    </td>
                                </transition>
                                <td v-show="typeof displayRemove === 'number' && displayRemove !== index"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </transition>
            <transition name="fade">
                <p v-if="displayedPromotion.length == 0">La promotion est vide.</p>
            </transition>
        </div>
        <div>
            <h5>Rechercher un article:</h5>
            <mdl-textfield floating-label="Nom" v-model="articleName"></mdl-textfield>

            <b-table
                :headers="[{ title: 'Article', field: 'name' }]"
                :data="articles"
                :filter="{ val: this.articleName, field: 'name' }"
                :sort="{ field: 'name', order: 'ASC' }"
                :actions="[
                    { action: 'addTo', text: 'Nouvel ensemble', raised: true },
                    { action: 'choose', text: 'Ajouter à un ensemble', raised: true },
                ]"
                route="articles"
                :paging="5"
                @addTo="addArticleToCurrentPromotion"
                @choose="chooseStepToAdd">
            </b-table>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { promotionDisplayer }   from './promotionDisplayer';

export default {
    props: {
        promotion: Object
    },

    data() {
        return {
            articleName  : '',
            chosenArticle: {},
            displayChoose: false,
            displayRemove: false
        };
    },

    methods: {
        ...mapActions([
            'addArticleToSet',
            'addArticleToPromotion',
            'addArticleToStep',
            'removeArticleFromStep'
        ]),
        addArticleToCurrentPromotion(article) {
            this.addArticleToPromotion({ promotion: this.promotion, article });
            this.displayChoose = false;
            this.chosenArticle = {};
        },
        chooseStepToAdd(article) {
            this.displayRemove = false;
            this.displayChoose = true;
            this.chosenArticle = article;
        },
        chooseArticle(article, index) {
            this.displayChoose = false;
            this.displayRemove = index;
            this.chosenArticle = article;
        },
        addChosenArticleToStep(promotion, index) {
            this.addArticleToStep({
                article: this.chosenArticle,
                step   : this.displayedPromotion[index],
                promotion
            });
            this.displayChoose = false;
            this.chosenArticle = {};
        },
        removeChosenArticleFromStep(promotion, index) {
            this.removeArticleFromStep({
                article: this.chosenArticle,
                step   : this.displayedPromotion[index],
                promotion
            });
            this.displayRemove = false;
            this.chosenArticle = {};
        }
    },

    computed: {
        ...mapState({
            articles: state => state.objects.articles
        }),
        displayedPromotion() {
            return promotionDisplayer(this.promotion);
        }
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';

    .b-promotions__contentManager {
        display: flex;
        justify-content: space-between;

        > div {
            width: 49%;
        }
    }
</style>
