import Events               from './Events.vue';
import EventsConf           from './EventsConf.vue';
import EventsConfStart      from './EventsConfStart.vue';
import EventsConfGroups     from './EventsConfGroups.vue';
import EventsConfFundations from './EventsConfFundations.vue';
import EventsConfPeriods    from './EventsConfPeriods.vue';
import EventsConfEnd        from './EventsConfEnd.vue';
import EventsCreate         from './EventsCreate.vue';
import EventsList           from './EventsList.vue';
import EventsEdit           from './EventsEdit.vue';

export default [
    {
        path     : '/events',
        component: Events,
        children : [
            { path: '', component: EventsList },
            { path: 'create', component: EventsCreate }
        ]
    },
    { path: '/events/edit/:id', component: EventsEdit },
    {
        path     : '/events/config/:id',
        component: EventsConf,
        children : [
            { path: '', component: EventsConfStart },
            { path: 'groups', component: EventsConfGroups },
            { path: 'fundations', component: EventsConfFundations },
            { path: 'periods', component: EventsConfPeriods },
            { path: 'end', component: EventsConfEnd }
        ]
    }
];
