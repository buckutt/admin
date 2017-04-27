<template>
    <div class="b-points b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Points</h3>
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
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    data() {
        return {
            categoryName: ''
        };
    },

    methods: {
        ...mapActions([
            'updateObject',
            'createSimpleRelation',
            'removeSimpleRelation',
            'updateModObject'
        ]),
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
        }
    },

    computed: {
        ...mapState({
            categories: state => state.objects.categories,
            modObject : state => state.app.modObject
        }),
        displayedCategories() {
            return this.categories.map((category) => {
                category.inCurrentPoint = this.isInCurrentPoint(category);
                return category;
            });
        }
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';
</style>
