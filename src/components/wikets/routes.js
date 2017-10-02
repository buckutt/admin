import Wikets    from './Wikets.vue';
import WiketShow from './wiket/WiketShow.vue';

export default [
    {
        path     : '/wikets',
        component: Wikets
    },
    {
        path     : '/wikets/:id',
        component: WiketShow,
        children : [
            {
                path     : ':category',
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
