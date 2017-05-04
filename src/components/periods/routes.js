import Periods       from './Periods.vue';
import PeriodsCreate from './PeriodsCreate.vue';
import PeriodsList   from './PeriodsList.vue';
import PeriodsEdit   from './PeriodsEdit.vue';

export default [
    {
        path     : '/periods',
        component: Periods,
        children : [
            { path: '', component: PeriodsList },
            { path: 'create', component: PeriodsCreate }
        ]
    },
    { path: '/periods/edit/:id', component: PeriodsEdit }
];
