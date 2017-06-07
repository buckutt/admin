import Points              from './Points.vue';
import PointsCreate        from './PointsCreate.vue';
import PointsList          from './PointsList.vue';

import PointShow           from './point/PointShow.vue';
import PointShowDetails    from './point/PointShowDetails.vue';
import PointEditObject     from './point/PointEditObject.vue';
import PointEditCategories from './point/PointEditCategories.vue';

export default [
    {
        path     : '/points',
        component: Points,
        children : [
            { path: '', component: PointsList },
            { path: 'create', component: PointsCreate }
        ]
    },
    {
        path     : '/points/:id',
        component: PointShow,
        children : [
            { path: '', component: PointShowDetails },
            { path: 'edit', component: PointEditObject },
            { path: 'categories', component: PointEditCategories }
        ]
    }
];
