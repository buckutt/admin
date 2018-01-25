<template>
    <div>
        <h5>Identifiants de connexion</h5>
        <b-table
            :headers="[
                { title: 'Type', field: 'type' },
                { title: 'Contenu', field: 'data'}
            ]"
            :data="modObject.meansOfLogin"
            :actions="[
                { action: 'lock', text1: 'Bloquer', text2: 'Débloquer', field: 'blocked', type: 'reversible' },
                { action: 'remove', text: 'Supprimer', type: 'confirm' }
            ]"
            route="meansOfLogin"
            :paging="10"
            @lock="lockMol"
            @remove="removeObject">
        </b-table>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    methods: {
        ...mapActions([
            'updateObject',
            'removeObject'
        ]),

        lockMol(meanOfLogin) {
            const modMol = {
                id     : meanOfLogin.id,
                blocked: !meanOfLogin.blocked
            };

            this.updateObject({
                route: 'meansOfLogin',
                value: modMol
            });
        }
    },

    computed: {
        ...mapState({
            modObject: state => state.app.modObject
        })
    }
};
</script>
