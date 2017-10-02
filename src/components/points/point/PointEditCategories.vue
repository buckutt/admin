<template>
    <div>
        <h5>Catégories du guichet:</h5>
        <span class="mdl-chip mdl-chip--deletable b--spaces" v-for="category in modObject.categories" :key="category.id">
            <span class="mdl-chip__text">{{ category.name }}</span>
            <b-confirm @confirm="removeFromPoint(modObject, category)" class="b--inline">
                <button class="mdl-chip__action"><i class="material-icons">cancel</i></button>
            </b-confirm>
        </span>
        <p v-if="modObject.categories.length === 0">Aucune pour le moment.</p>

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
            'createSimpleRelation',
            'removeSimpleRelation',
            'notify',
            'notifyError'
        ]),
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
            })
                .then(() => this.notify({ message: 'La catégorie a bien été liée au point' }))
                .catch(err => this.notifyError({
                    message: 'La catégorie n\'a pas pu être liée au point',
                    full   : err
                }));
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
            })
                .then(() => this.notify({ message: 'La catégorie a bien été supprimée du point' }))
                .catch(err => this.notifyError({
                    message: 'La catégorie n\'a pas pu être supprimée du point',
                    full   : err
                }));
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
