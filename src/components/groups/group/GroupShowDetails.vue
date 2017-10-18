<template>
    <div>
        <h5>Détails du groupe</h5>
        <b-list :elements="elements"></b-list>

        <h5>Membres du groupe</h5>
        <b-table
            :headers="[{ title: 'Utilisateur', field: 'user.fullname' }]"
            :data="memberships"
            :paging="10">
        </b-table>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState({
            modObject   : state => state.app.modObject,
            currentEvent: state => state.app.currentEvent
        }),
        elements() {
            return [
                {
                    icon   : 'keyboard_arrow_right',
                    title  : 'Nom',
                    content: this.modObject.name
                }
            ];
        },
        memberships() {
            return (!this.modObject) ? [] : this.modObject.memberships
                .filter(membership => (membership.period.event_id === this.currentEvent.id))
                .map((membership) => {
                    membership.user.fullname = `${membership.user.firstname} ${membership.user.lastname}`;
                    return membership;
                });
        }
    }
};
</script>
