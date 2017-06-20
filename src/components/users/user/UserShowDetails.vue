<template>
    <div>
        <h5>Détails de l'utilisateur</h5>
        <p v-if="creationData.pin">Le code PIN de l'utilisateur est <strong>{{ creationData.pin }}</strong></p>
        <p v-if="creationData.password">Le mot de passe de l'utilisateur est <strong>{{ creationData.password }}</strong></p>

        <b-list :elements="elements" :columns="2"></b-list>

        <template v-for="rightPerPoint in rights">
            <h5 v-if="rightPerPoint.point === 'Aucun'">Droits de l'utilisateur</h5>
            <h5 v-else>Droits de l'utilisateur sur le point {{ rightPerPoint.point }}</h5>
            <b-list :elements="rightPerPoint.rights" :columns="3"></b-list>
        </template>

        <template v-if="groups.length > 0 && currentEvent.config.hasGroups">
            <h5>Groupes de l'utilisateur</h5>
            <b-list :elements="groups" :columns="3"></b-list>
        </template>
    </div>
</template>

<script>
import groupBy                  from 'lodash.groupby';
import { mapActions, mapState } from 'vuex';
import { isUserInGroup }        from './isUserInGroup';

export default {
    methods: {
        ...mapActions([
            'updateCreationData'
        ])
    },

    computed: {
        ...mapState({
            modObject   : state => state.app.modObject,
            currentEvent: state => state.app.currentEvent,
            creationData: state => state.app.creationData
        }),
        elements() {
            const baseElements = [
                {
                    icon   : 'person',
                    title  : 'Nom',
                    content: this.modObject.lastname
                },
                {
                    icon   : 'person',
                    title  : 'Prénom',
                    content: this.modObject.firstname
                },
                {
                    icon   : 'person',
                    title  : 'Surnom',
                    content: this.modObject.nickname
                },
                {
                    icon   : 'email',
                    title  : 'Adresse mail',
                    content: this.modObject.mail
                }
            ];

            if (!this.currentEvent.config.hasGroups) {
                const group  = this.currentEvent.defaultGroup;
                const period = this.currentEvent.defaultPeriod;

                baseElements.push({
                    icon   : 'done',
                    title  : 'Accès à l\'évenement',
                    content: isUserInGroup(this.modObject, group, period) ?
                        'Oui' :
                        'Non'
                });
            }

            return baseElements;
        },
        filteredRights() {
            return (!this.modObject) ? [] : this.modObject.rights
                .filter(right => (right.period.Event_id === this.currentEvent.id))
                .map((right) => {
                    if (!right.point) {
                        right.point = { id: '0', name: 'Aucun' };
                    }
                    return right;
                });
        },
        rights() {
            const rights        = [];
            const groupedRights = groupBy(this.filteredRights, 'point.id');

            Object.keys(groupedRights).forEach((key) => {
                const rightPerPoint = { point: groupedRights[key][0].point.name, rights: [] };

                groupedRights[key].forEach(right => rightPerPoint.rights.push({
                    icon : 'grade',
                    title: (this.currentEvent.config.hasPeriods) ?
                       `Période ${right.period.name}` :
                       undefined,
                    content: right.name
                }));

                rights.push(rightPerPoint);
            });

            return rights;
        },
        groups() {
            return (!this.modObject) ? [] : this.modObject.groups
                .filter(group => (group._through.period.Event_id === this.currentEvent.id))
                .map(group => ({
                    icon : 'group',
                    title: (this.currentEvent.config.hasPeriods) ?
                        `Période ${group._through.period.name}` :
                        undefined,
                    content: group.name
                }));
        }
    },

    beforeDestroy() {
        this.updateCreationData({});
    }
};
</script>
