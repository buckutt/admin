<template>
    <div>
        <h5>Détails du webhook</h5>

        <b-list :elements="elements"></b-list>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState({
            modObject: state => state.app.modObject
        }),
        elements() {
            return [
                {
                    icon   : 'link',
                    title  : 'url',
                    content: this.modObject.url
                }
            ];
        }
    }
};
</script>
