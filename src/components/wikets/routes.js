import Wikets      from './Wikets.vue';
import WiketAssign from './wiket/WiketAssign.vue';
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
        component: WiketAssign
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
