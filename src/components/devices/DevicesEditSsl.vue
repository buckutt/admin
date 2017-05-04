<template>
    <div>
        <h5>Génération du certificat SSL</h5>
        <form v-on:submit.prevent="generateCert(modObject, password)">
            <mdl-textfield type="password" floating-label="Mot de passe souhaité" v-model="password"></mdl-textfield>
            <mdl-button colored raised>Générer</mdl-button>
        </form>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { saveAs }   from 'file-saver';
import { download } from '../../lib/fetch';

export default {
    data() {
        return {
            password: ''
        };
    },

    methods: {
        ...mapActions([
            'showClientError'
        ]),
        generateCert(device, password) {
            download(`services/certificate?deviceId=${device.id}&password=${password}`)
                .then((result) => {
                    saveAs(result, `${device.name}.p12`);
                })
                .catch(() => {
                    this.showClientError({ message: 'Le téléchargement du certificat a échoué' });
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

<style lang="scss">
    @import '../../main.scss';
</style>
