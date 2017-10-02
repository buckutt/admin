import Participants           from './Participants.vue';
import ParticipantsList       from './ParticipantsList.vue';
import ParticipantsStaff      from './ParticipantsStaff.vue';

import ParticipantShow        from './participant/ParticipantShow.vue';
import ParticipantShowDetails from './participant/ParticipantShowDetails.vue';


export default [
    {
        path     : '/participants',
        component: Participants,
        children : [
            { path: '', component: ParticipantsList },
            { path: 'staff', component: ParticipantsStaff }
        ]
    },
    {
        path     : '/participants/:id',
        component: ParticipantShow,
        children : [
            { path: '', component: ParticipantShowDetails }
        ]
    }
];
