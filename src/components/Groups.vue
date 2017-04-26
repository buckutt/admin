<template>
    <div class="b-groups">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Groupes</h3>
            <transition name="fade">
                <div v-if="modObject">
                    <h5>Modifier le groupe {{ modObject.name }}:</h5>
                    <form @submit.prevent="updateObject({ route: 'groups', value: modObject })">
                        <mdl-textfield floating-label="Nom" :value="modObject.name" @input="updateModObject({ field:'name', value: $event })" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield><br />
                        <mdl-button colored raised>Modifier</mdl-button>
                    </form>
                    <br />
                    <mdl-button colored raised @click.native="$root.goBack()">Retour</mdl-button>
                </div>
            </transition>
            <transition name="fade">
                <div v-if="!modObject">
                    <form @submit.prevent="createObject({ route: 'groups', value: inputGroup() })">
                        <mdl-textfield floating-label="Nom" v-model="newGroup.name" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield><br />
                        <mdl-button colored raised>Créer</mdl-button>
                    </form>

                    <br />

                    <b-table
                        :headers="[{ title: 'Groupe', field: 'name' }]"
                        :data="groups"
                        :sort="{ field: 'name', order: 'ASC' }"
                        :actions="[
                            { action: 'edit', text: 'Modifier', raised: true, colored: true },
                            { action: 'remove', text: 'Supprimer', type: 'confirm' }
                        ]"
                        route="groups"
                        :paging="10"
                        @edit="expandGroup"
                        @remove="removeObject">
                    </b-table>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

const groupPattern = {
    name: ''
};

export default {
    data() {
        return {
            newGroup: Object.assign({}, groupPattern)
        };
    },

    methods: {
        ...mapActions([
            'createObject',
            'updateObject',
            'removeObject',
            'expandObject',
            'updateModObject'
        ]),
        expandGroup(group) {
            this.$router.push(`/groups/${group.id}`);

            this.expandObject({
                route: 'groups',
                value: group
            });
        },
        inputGroup() {
            const inputGroup = Object.assign({}, this.newGroup);
            this.newGroup    = Object.assign({}, groupPattern);

            return inputGroup;
        }
    },

    computed: {
        ...mapState({
            groups   : state => state.objects.groups,
            modObject: state => state.app.modObject,
            params   : state => state.route.params
        })
    },

    mounted() {
        if (this.params.id) {
            this.expandGroup({ id: this.params.id });
        }
    }
};
</script>

<style lang="scss">
    @import '../main.scss';

    .b-groups {
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
