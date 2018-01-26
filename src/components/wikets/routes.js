import Wikets                 from './Wikets.vue';
import WiketAssign            from './assignments/WiketAssign.vue';
import WiketAssignList        from './assignments/WiketAssignList.vue';
import WiketAssignPreferences from './assignments/WiketAssignPreferences.vue';

import WiketShow   from './wiket/WiketShow.vue';

export default [
    {
        path     : '/wikets',
        component: Wikets,
        children : [
            {
                path     : 'add',
                component: Wikets
            }
        ]
    },
    {
        path     : '/wikets/:id/assign',
        component: WiketAssign,
        children : [
            { path: '', component: WiketAssignList },
            { path: 'preferences', component: WiketAssignPreferences }
        ]
    },
    {
        path     : '/wikets/:id',
        component: WiketShow,
        children : [
            {
                path     : 'category/:category',
                component: WiketShow,
                children : [
                    {
                        path     : 'article/:article',
                        component: WiketShow
                    },
                    {
                        path     : 'promotion/:promotion',
                        component: WiketShow
                    }
                ]
            }
        ]
    }
];
