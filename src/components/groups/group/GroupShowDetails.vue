<template>
    <div>
        <h5>Détails du groupe</h5>
        <b-list :elements="elements"></b-list>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState({
            focusedGroup: state => state.app.focusedElements[0]
        }),

        elements() {
            return [
                {
                    icon   : 'keyboard_arrow_right',
                    title  : 'Nom',
                    content: this.focusedGroup.name
                }
            ];
        }
    }
};
</script>
