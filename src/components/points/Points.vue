<template>
    <div class="b-points b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Points</h3>
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
                @edit="editPoint"
                @remove="removeObject">
            </b-table>
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
            newPoint: Object.assign({}, pointPattern)
        };
    },

    methods: {
        ...mapActions([
            'createObject',
            'removeObject'
        ]),
        editPoint(point) {
            this.$router.push(`/points/edit/${point.id}`);
        },
        search(category) {
            this.categoryName = category.name;
        },
        inputPoint() {
            const inputPoint = Object.assign({}, this.newPoint);
            this.newPoint    = Object.assign({}, pointPattern);

            return inputPoint;
        }
    },

    computed: {
        ...mapState({
            points: state => state.objects.points
        })
    }
};
</script>

<style lang="scss">
    @import '../../main.scss';
</style>
