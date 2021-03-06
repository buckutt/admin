<template>
    <div>
        <h5>Droits</h5>
        <form @submit.prevent="createUserRight(focusedParticipant, userRight)">
            <b-inputselect label="Droit" id="right-select" :options="rightsList" v-model="userRight.name"></b-inputselect>
            <b-inputselect label="Point" id="point-select" :options="pointOptions" v-model="userRight.point"></b-inputselect>
            <b-inputselect label="Période" id="period-select" :options="currentPeriodOptions" :fullOptions="periodOptions" v-model="userRight.period" v-if="currentEvent.usePeriods"></b-inputselect><br />
            <mdl-button colored raised :disabled="disabledAdd">Ajouter</mdl-button>
        </form>
        <br />
        <b-table
            :headers="displayedColumns"
            :data="displayedRights"
            :actions="[
                { action: 'remove', text: 'Supprimer', type: 'confirm' }
            ]"
            route="rights"
            :paging="10"
            @remove="removeObject">
        </b-table>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';

const userRightPattern = {
    name  : null,
    point : null,
    period: null
};

export default {
    data() {
        return {
            rightsList: ['admin', 'seller', 'reloader', 'assigner'],
            userRight : Object.assign({}, userRightPattern)
        };
    },

    methods: {
        ...mapActions([
            'removeObject',
            'createObject',
            'notify',
            'notifyError'
        ]),

        createUserRight(user, right) {
            right.period = (this.currentEvent.usePeriods)
                ? right.period
                : this.currentEvent.defaultPeriod;

            right.period_id = right.period.id;
            delete right.period;

            if (right.point) {
                right.point_id = right.point.id;
            }

            delete right.point;

            right.user_id = user.id;

            this
                .createObject({
                    route: 'rights',
                    value: right
                })
                .then(() => this.notify({ message: 'Le droit a bien été créé' }))
                .catch(err => this.notifyError({
                    message: 'Une erreur a eu lieu lors de la création du droit',
                    full   : err
                }));

            this.userRight = Object.assign({}, userRightPattern);
        }
    },

    computed: {
        ...mapState({
            currentEvent      : state => state.app.currentEvent,
            focusedParticipant: state => state.app.focusedElements[0]
        }),

        ...mapGetters([
            'periodOptions',
            'currentPeriodOptions',
            'pointOptions'
        ]),

        displayedColumns() {
            const columns = [
                { title: 'Droit', field: 'name' },
                { title: 'Point', field: 'point.name' }
            ];

            if (this.currentEvent.usePeriods) {
                columns.push({ title: 'Période', field: 'period.name' });
            }

            return columns;
        },

        displayedRights() {
            return (this.focusedParticipant.rights || [])
                .filter(right => (right.period.event_id === this.currentEvent.id))
                .map((right) => {
                    if (!right.point) {
                        right.point = { name: 'Aucun' };
                    }

                    if (right.period.id !== this.currentEvent.defaultPeriod_id
                        && !this.currentEvent.usePeriods) {
                        right.warning = 'Une période autre que<br />celle par défaut est utilisée.';
                    }

                    return right;
                });
        },

        disabledAdd() {
            return (!this.userRight.name || (!this.userRight.period && this.currentEvent.usePeriods));
        }
    }
};
</script>
