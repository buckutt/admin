<template>
    <div>
        <h5>Modifier l'équipement {{ modObject.name }}</h5>
        <form @submit.prevent="updateDevice(modObject)">
            <mdl-textfield floating-label="Nom" :value="modObject.name" @input="updateModObject({ field: 'name', value: $event })" required="required" error="Le nom doit contenir au moins un caractère"></mdl-textfield>
            <mdl-select label="Groupe par défaut" id="group-select" v-model="selectedGroup" :options="groupIdsOptions"></mdl-select>

            <h6>Options de l'équipement</h6>
            <b-detailedswitch label="Badgeage avant achat" icon="done_all" :value="modObject.doubleValidation" @input="updateModObject({ field: 'doubleValidation', value: $event })">
                Oblige l'acheteur à badger une première fois, afin de permettre au vendeur de connaître les articles et tarifs disponibles pour celui-ci, ainsi que de connaître son solde ou vérifier son identité, avant de prendre sa commande. Si cette option n'est pas activée, il vous faut définir un groupe par défaut, dont les tarifs vont être utilisés. (si vous n'utilisez pas les groupes dans votre événement, sélectionnez le nom de l'événement).

                <div v-if="!modObject.doubleValidation && defaultGroup">
                    <br />
                    <strong>Groupe dont les tarifs sont affichés par défaut:</strong> {{ defaultGroup.name }}
                </div>
            </b-detailedswitch>

            <b-detailedswitch label="Avertissement alcool" icon="local_drink" :value="modObject.alcohol" @input="updateModObject({ field: 'alcohol', value: $event })">
                Affiche un avertissement lors de la vente d'alcool à un utilisateur lorsque celui-ci a atteint ou dépassé la limite d'unité alcool définie pour l'événement.
            </b-detailedswitch>

            <b-detailedswitch label="Afficher l'image utilisateur" icon="person" :value="modObject.showPicture" @input="updateModObject({ field: 'showPicture', value: $event })">
                Affiche l'image personnelle (avatar) de l'utilisateur ayant badgé, lorsque que le badgeage avant achat est activé.
            </b-detailedswitch>

            <mdl-button colored raised>Modifier</mdl-button>
        </form>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
    data() {
        return {
            selectedGroup: ''
        };
    },

    methods: {
        ...mapActions([
            'updateObject',
            'updateModObject',
            'notify',
            'notifyError'
        ]),
        updateDevice(device) {
            device.defaultGroup = this.selectedGroup;
            this.updateObject({ route: 'devices', value: device })
                .then(() => this.notify({ message: 'L\'équipement a bien été modifié' }))
                .catch(err => this.notifyError({
                    message: 'Une erreur a eu lieu lors de la modification de l\'équipement',
                    full   : err
                }));
        }
    },

    computed: {
        ...mapState({
            modObject: state => state.app.modObject,
            groups   : state => state.objects.groups
        }),
        ...mapGetters([
            'groupIdsOptions'
        ]),
        defaultGroup() {
            return this.groups.find(group => this.selectedGroup === group.id);
        }
    },

    mounted() {
        this.selectedGroup = this.modObject.defaultGroup;
    }
};
</script>
