import Points               from './Points.vue';
import PointsCreate         from './PointsCreate.vue';
import PointsList           from './PointsList.vue';
import PointsEdit           from './PointsEdit.vue';
import PointsEditCategories from './PointsEditCategories.vue';
import PointsEditObject     from './PointsEditObject.vue';

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
        path     : '/points/edit/:id',
        component: PointsEdit,
        children : [
            { path: '', component: PointsEditObject },
            { path: 'categories', component: PointsEditCategories }
        ]
    }
];
