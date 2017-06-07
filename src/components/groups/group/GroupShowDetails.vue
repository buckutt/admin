<template>
    <div>
        <h5>Détails du groupe</h5>
        <b-list :elements="elements"></b-list>

        <h5>Membres du groupe</h5>
        <b-table
            :headers="[{ title: 'Utilisateur', field: 'fullname' }]"
            :data="groupUsers"
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
        groupUsers() {
            return (!this.modObject) ? [] : this.modObject.users
                .filter(user => (user._through.period.Event_id === this.currentEvent.id))
                .map((user) => {
                    user.fullname = `${user.firstname} ${user.lastname}`;
                    return user;
                });
        }
    }
};
</script>
