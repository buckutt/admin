<template>
    <div class="b--inline">
        <mdl-button raised accent :disabled="disabled" @click.native="$refs.confirm.open">
            <slot></slot>
        </mdl-button>

        <mdl-dialog ref="confirm" title="Suppression">
            <p>Êtes-vous sûr de vouloir effectuer cette action ?</p>
            <template slot="actions">
                <mdl-button primary @click.native="validate">Valider</mdl-button>
                <mdl-button @click.native="$refs.confirm.close">Annuler</mdl-button>
            </template>
        </mdl-dialog>
    </div>
</template>

<script>
export default {
    props: {
        disabled: {
            type    : Boolean,
            required: false
        }
    },

    methods: {
        validate() {
            this.$emit('confirm');
            this.$refs.confirm.close();
        }
    }
};
</script>
