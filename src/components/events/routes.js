import Events               from './Events.vue';
import EventsCreate         from './EventsCreate.vue';
import EventsList           from './EventsList.vue';

import EventConf           from './config/EventConf.vue';
import EventConfStart      from './config/EventConfStart.vue';
import EventConfGroups     from './config/EventConfGroups.vue';
import EventConfFundations from './config/EventConfFundations.vue';
import EventConfPeriods    from './config/EventConfPeriods.vue';
import EventConfEnd        from './config/EventConfEnd.vue';

import EventShow           from './event/EventShow.vue';
import EventShowDetails    from './event/EventShowDetails.vue';
import EventEditObject     from './event/EventEditObject.vue';

export default [
    {
        path     : '/events',
        component: Events,
        children : [
            { path: '', component: EventsList },
            { path: 'create', component: EventsCreate }
        ]
    },
    {
        path     : '/events/:id',
        component: EventShow,
        children : [
            { path: '', component: EventShowDetails },
            { path: 'edit', component: EventEditObject }
        ]
    },
    {
        path     : '/events/:id/config',
        component: EventConf,
        children : [
            { path: '', component: EventConfStart },
            { path: 'groups', component: EventConfGroups },
            { path: 'fundations', component: EventConfFundations },
            { path: 'periods', component: EventConfPeriods },
            { path: 'end', component: EventConfEnd }
        ]
    }
];
