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
                    <mdl-textfield floating-label="Nom" v-model="categoryName"></mdl-textfield>

                    <b-table
                        :headers="[{ title: 'Catégorie', field: 'name' }]"
                        :data="displayedCategories"
                        :filter="{ val: this.categoryName, field: 'name' }"
                        :sort="{ field: 'name', order: 'ASC' }"
                        :actions="[
                            { action: 'move', text1: 'Ajouter', text2: 'Enlever', field: 'inCurrentPoint', type: 'reversible' }
                        ]"
                        route="categories"
                        :paging="5"
                        @move="moveFromCurrentPoint">
                    </b-table>
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

                    <b-table
                        :headers="[{ title: 'Point', field: 'name' }]"
                        :data="points"
                        :sort="{ field: 'name', order: 'ASC' }"
                        :actions="[
                            { action: 'edit', text: 'Modifier', raised: true, colored: true },
                            { action: 'remove', text: 'Supprimer', type: 'confirm' }
                        ]"
                        route="points"
                        :paging="10"
                        @edit="expandPoint"
                        @remove="removeObject">
                    </b-table>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

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
        isInCurrentPoint(category) {
            const index = this.modObject.categories.findIndex(c => (c.id === category.id));
            return (index !== -1);
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
        moveFromCurrentPoint(category) {
            if (this.isInCurrentPoint(category)) {
                this.removeFromPoint(this.modObject, category);
            } else {
                this.addToPoint(this.modObject, category);
            }
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
        displayedCategories() {
            return this.categories.map((category) => {
                category.inCurrentPoint = this.isInCurrentPoint(category);
                return category;
            });
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
