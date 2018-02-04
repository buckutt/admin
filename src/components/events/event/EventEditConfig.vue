<template>
    <div>
        <h5>Configurer l'évenement</h5>
        Cet utilitaire va vous permettre de configurer votre événement afin qu'il réponde le mieux à vos besoins.<br />
        <form @submit.prevent="updateEvent(focusedEvent)">
            <b-detailedswitch label="Groupes d'utilisateurs" icon="group" :value="focusedEvent.useGroups" @input="updateDeepestFocusedElement({ field: 'useGroups', value: $event })">
                Les groupes d'utilisateurs permettent d'associer des tarifs différents selon l'appartenance d'un client à un groupe.<br />
                <strong>Exemple:</strong> Ils peuvent être pratiques pour interdire la vente d'alcool aux mineurs, ou proposer des prix plus bas aux membres de votre équipe.<br />
                <strong>Note:</strong> Les groupes peuvent-être ré-utilisés d'un événement sur l'autre.

                <div v-if="focusedEvent.useGroups && !focusedEvent.defaultGroup_id">
                    <br />
                    Un groupe par défaut (non supprimable) du nom de l'événement va être automatiquement créé. Ce groupe contiendra tous les utilisateurs créés au sein de l'événement. Il sera réutilisable via d'autres événements.
                </div>
            </b-detailedswitch>

            <b-detailedswitch label="Fondations" icon="local_atm" :value="focusedEvent.useFundations" @input="updateDeepestFocusedElement({ field: 'useFundations', value: $event })">
                Les fondations permettent de répartir l'argent des ventes via le système entre plusieurs comptes virtuels.<br />
                <strong>Exemple:</strong> Si vous avez deux associations sur un même stand, et qu'elles souhaitent toutes les deux vendre leurs articles sur une même borne de vente, il est possible d'assigner les ventes d'une partie des articles à une association, et le reste à l'autre.<br />
                <strong>Note:</strong> Les fondations peuvent-être ré-utilisées d'un événement sur l'autre.

                <div v-if="focusedEvent.useFundations && !focusedEvent.defaultFundation_id">
                    <br />
                    Une fondation par défaut du nom de l'événement va être automatiquement créée. Vous pourrez la modifier par la suite.
                </div>
            </b-detailedswitch>

            <b-detailedswitch label="Périodes" icon="alarm" :value="focusedEvent.usePeriods" @input="updateDeepestFocusedElement({ field: 'usePeriods', value: $event })">
                    Les périodes permettent d'établir des droits, ou des prix sur des laps de temps donnés.<br />
                    <strong>Exemple:</strong> Mettre en place des happy hours sur une certaine durée, donner les droits de vente sur une certaine durée.<br />
                    <strong>Note:</strong> Une période est propre à un événement.

                    <div v-if="focusedEvent.usePeriods && !focusedEvent.defaultPeriod_id">
                        <br />
                        Une période par défaut (non supprimable), d'une durée de 100 ans et du nom de l'événement, va être automatiquement créée pour cet événement. Vous pourrez l'utiliser lorsque vous souhaitez assigner des éléments qui devront durer toute la durée de l'événement.
                    </div>
            </b-detailedswitch>

            <b-detailedswitch label="Mode dégradé" icon="signal_wifi_off" :value="focusedEvent.useCardData" @input="updateDeepestFocusedElement({ field: 'useCardData', value: $event })">
                    Le mode autonome permet à votre événement de pouvoir continuer à utiliser la solution lors d'une perte de réseau, en écrivant sur les cartes ou bracelets de vos utilisateurs. Lors du retour de la connectivité, le système repasse automatiquement en mode normal.<br />
                    <strong>Note 1:</strong> Certaines fonctionnalités, comme les tarifs adaptés aux périodes ou aux groupes, ne seront plus disponible en mode dégradé.<br />
                    <strong>Note 2:</strong> Il vous faut impérativement avoir les droits d'écriture sur les cartes ou bracelets de votre événement.
            </b-detailedswitch>

            <mdl-button colored raised>Configurer</mdl-button>
        </form>
    </div>
</template>

<script>
import pick from 'lodash.pick';
import { mapState, mapActions } from 'vuex';

export default {
    methods: {
        ...mapActions([
            'createObject',
            'updateObject',
            'updateDeepestFocusedElement',
            'expandObject',
            'notify',
            'notifyError'
        ]),

        updateEvent(event) {
            const steps     = [];
            const stepsName = [];

            if ((event.useFundations === false && !event.defaultFundation_id) || this.fundations.length === 0) {
                steps.push(this.createObject({ route: 'fundations', value: { name: event.name } }));
                stepsName.push('fundations');
            }

            if (!event.defaultGroup_id) {
                steps.push(this.createObject({ route: 'groups', value: { name: event.name } }));
                stepsName.push('groups');
            }

            if (!event.defaultPeriod_id) {
                const start     = new Date();
                const end       = new Date(new Date().setFullYear(new Date().getFullYear() + 100));
                const newPeriod = {
                    name    : this.focusedEvent.name,
                    start,
                    end,
                    event_id: this.focusedEvent.id
                };

                steps.push(this.createObject({ route: 'periods', value: newPeriod }));
                stepsName.push('periods');
            }

            Promise.all(steps)
                .then((values) => {
                    const fields = [
                        'id',
                        'useFundations',
                        'usePeriods',
                        'useGroups',
                        'useCardData',
                        'defaultFundation_id',
                        'defaultGroup_id',
                        'defaultPeriod_id'
                    ];

                    values.forEach((value, index) => {
                        switch (stepsName[index]) {
                            case 'fundations':
                                event.defaultFundation_id = value.id;
                                break;
                            case 'groups':
                                event.defaultGroup_id = value.id;
                                break;
                            default:
                                event.defaultPeriod_id = value.id;
                        }
                    });

                    return this.updateObject({ route: 'events', value: pick(event, fields) });
                })
                .then(() => {
                    this.notify({ message: 'L\'événement a bien été configuré' });
                    this.expandObject({ route: 'events', value: this.focusedEvent });
                })
                .catch(err => this.notifyError({
                    message: 'Une erreur a eu lieu lors de la configuration de l\'événement',
                    full   : err
                }));
        }
    },

    computed: {
        ...mapState({
            focusedEvent: state => state.app.focusedElements[0],
            fundations  : state => state.objects.fundations
        })
    }
};
</script>
