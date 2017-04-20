<template>
    <div class="b-points">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Points</h3>
            <transition name="fade">
                <div v-if="modObject">
                    <h5>Modifier le point {{ modObject.name }}:</h5>
                    <form @submit.prevent="updateObject({ route: 'points', value: modObject })">
                        <mdl-textfield floating-label="Nom" :value="modObject.name" @input="updateModObject({ field:'name', value: $event })" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield><br />
                        <mdl-button colored raised>Modifier</mdl-button>
                    </form>
                    <br />
                    <div v-show="modObject.categories">
                        <h5>Catégories du point:</h5>
                        <mdl-button v-for="category in modObject.categories" :key="category.id" @click.native="search(category)">{{ category.name }}</mdl-button>
                        <br />
                    </div>

                    <h5>Rechercher une catégorie:</h5>
                    <form @submit.prevent>
                        <mdl-textfield floating-label="Nom" v-model="categoryName"></mdl-textfield>
                    </form>

                    <div class="b-responsive-table" v-show="categoryName.length > 0 && filteredCategories.length > 0">
                        <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                            <thead>
                                <tr>
                                    <th class="mdl-data-table__cell--non-numeric">Catégorie</th>
                                    <th class="mdl-data-table__cell--non-numeric">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="category in filteredCategories">
                                    <td class="mdl-data-table__cell--non-numeric b--capitalized">{{ category.name }}</td>
                                    <td class="mdl-data-table__cell--non-numeric b-actions-cell">
                                        <mdl-button raised colored @click.native="addToPoint(modObject, category)" v-show="!isInPoint(category)">Ajouter</mdl-button>
                                        <mdl-button raised accent @click.native="removeFromPoint(modObject, category)" v-show="isInPoint(category)">Enlever</mdl-button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <br />
                    <mdl-button colored raised @click.native="$root.goBack()">Retour</mdl-button>
                </div>
            </transition>
            <transition name="fade">
                <div v-if="!modObject">
                    <form @submit.prevent="createObject({ route: 'points', value: inputPoint() })">
                        <mdl-textfield floating-label="Nom" v-model="newPoint.name" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield>
                        <br />
                        <mdl-button colored raised>Créer</mdl-button>
                    </form>

                    <br />

                    <div class="b-responsive-table">
                        <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                            <thead>
                                <tr>
                                    <th class="mdl-data-table__cell--non-numeric">Point</th>
                                    <th class="mdl-data-table__cell--non-numeric">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="point in points">
                                    <td class="mdl-data-table__cell--non-numeric">{{ point.name }}</td>
                                    <td class="mdl-data-table__cell--non-numeric b-actions-cell">
                                        <mdl-button raised colored @click.native="expandPoint(point)">Modifier</mdl-button>
                                        <b-confirm :func="() => { removeObject({ route: 'points', value: point }) }">Supprimer</b-confirm>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import fuzzy from 'fuzzy';

const pointPattern = {
    name: ''
};

export default {
    data() {
        return {
            newPoint    : Object.assign({}, pointPattern),
            categoryName: ''
        };
    },

    methods: {
        ...mapActions([
            'createObject',
            'updateObject',
            'removeObject',
            'createSimpleRelation',
            'removeSimpleRelation',
            'expandObject',
            'updateModObject'
        ]),
        expandPoint(point) {
            this.$router.push(`/points/${point.id}`);

            this.expandObject({
                route: 'points',
                value: point
            });
        },
        search(category) {
            this.categoryName = category.name;
        },
        isInPoint(category) {
            let isInPoint = false;
            if (this.modObject.categories) {
                if (this.modObject.categories.length > 0) {
                    this.modObject.categories.forEach((c) => {
                        if (c.id === category.id) {
                            isInPoint = true;
                        }
                    });
                }
            }
            return isInPoint;
        },
        addToPoint(point, category) {
            this.createSimpleRelation({
                obj1: {
                    route: 'points',
                    value: point
                },
                obj2: {
                    route: 'categories',
                    value: category
                }
            });
        },
        removeFromPoint(point, category) {
            this.removeSimpleRelation({
                obj1: {
                    route: 'points',
                    value: point
                },
                obj2: {
                    route: 'categories',
                    value: category
                }
            });
        },
        inputPoint() {
            const inputPoint = Object.assign({}, this.newPoint);
            this.newPoint    = Object.assign({}, pointPattern);

            return inputPoint;
        }
    },

    computed: {
        ...mapState({
            points    : state => state.objects.points,
            categories: state => state.objects.categories,
            modObject : state => state.app.modObject,
            params    : state => state.route.params
        }),
        filteredCategories() {
            const val           = this.categoryName;
            const categoryNames = fuzzy.filter(val, this.categories, { extract: el => el.name });
            return categoryNames.map(category => category.original);
        }
    },

    mounted() {
        if (this.params.id) {
            this.expandPoint({ id: this.params.id });
        }
    }
};
</script>

<style lang="scss">
    @import '../main.scss';

    .b-points {
        > div {
            min-height: calc(100% - 40px);
            margin: 20px ((100% - $cardSize) / 2);
            padding: 20px;
            width: $cardSize;

            > h3 {
                margin: 0;
            }

            > select {
                display: inline-block;
                max-width: 150px;
            }

            button {
                max-width: 300px;
            }

            table {
                width: 100%;
                white-space: normal;
            }
        }
    }
</style>
