import Events       from './Events.vue';
import EventsCreate from './EventsCreate.vue';
import EventsList   from './EventsList.vue';
import EventsEdit   from './EventsEdit.vue';

export default [
    {
        path     : '/events',
        component: Events,
        children : [
            { path: '', component: EventsList },
            { path: 'create', component: EventsCreate }
        ]
    },
    { path: '/events/edit/:id', component: EventsEdit }
];
