<template>
    <div>
        <h5 v-if="rights.length > 0">Résumé des droits</h5>
        <template v-for="rightPerPoint in rights">
            <h6 v-if="rightPerPoint.point === 'Aucun'">Droits du partipant</h6>
            <h6 v-else>Droits du participant sur le point {{ rightPerPoint.point }}</h6>
            <b-list :elements="rightPerPoint.rights" :columns="3"></b-list>
        </template>

        <template v-if="!currentEvent.config.hasGroups">
            <h5>Résumé des accès</h5>
            <p v-if="isInDefaultGroup">Cet utilisateur participe à l'événement sélectionné.</p>
            <p v-else>Cet utilisateur ne participe pas à l'événement sélectionné.</p>
        </template>

        <template v-if="currentEvent.config.hasGroups">
            <h5>Résumé des groupes pour l'événement</h5>
            <template v-if="groups.length > 0">
                <b-list :elements="groups" :columns="3"></b-list>
                <p v-if="isInDefaultGroup">
                    Ce participant est dans le groupe par défaut de l'événement.
                </p>
            </template>
            <p v-else>
                Cet utilsateur n'appartient à aucun groupe de l'événement, il ne participe donc pas à l'événement.
            </p>
        </template>
    </div>
</template>

<script>
import groupBy           from 'lodash.groupby';
import { mapState }      from 'vuex';
import { isUserInGroup } from '../../users/user/isUserInGroup';

export default {
    computed: {
        ...mapState({
            modObject   : state => state.app.modObject,
            currentEvent: state => state.app.currentEvent
        }),
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
                    icon : 'assignment_turned_in',
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
        },
        isInDefaultGroup() {
            const group  = this.currentEvent.defaultGroup;
            const period = this.currentEvent.defaultPeriod;

            return isUserInGroup(this.modObject, group, period);
        }
    }
};
</script>
