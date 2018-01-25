<template>
    <div>
        <h5>Détails de la période</h5>

        <b-list :elements="elements" :columns="3"></b-list>
    </div>
</template>

<script>
import { mapState }  from 'vuex';
import { parseDate } from '../../../lib/date';

export default {
    computed: {
        ...mapState({
            modObject: state => state.app.modObject
        }),

        elements() {
            return [
                {
                    icon   : 'keyboard_arrow_right',
                    title  : 'Nom',
                    content: this.modObject.name
                },
                {
                    icon   : 'date_range',
                    title  : 'Début',
                    content: parseDate(this.modObject.start)
                },
                {
                    icon   : 'date_range',
                    title  : 'Fin',
                    content: parseDate(this.modObject.end)
                }
            ];
        }
    }
};
</script>
