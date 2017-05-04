import Fundations       from './Fundations.vue';
import FundationsCreate from './FundationsCreate.vue';
import FundationsList   from './FundationsList.vue';
import FundationsEdit   from './FundationsEdit.vue';

export default [
    {
        path     : '/fundations',
        component: Fundations,
        children : [
            { path: '', component: FundationsList },
            { path: 'create', component: FundationsCreate }
        ]
    },
    { path: '/fundations/edit/:id', component: FundationsEdit }
];
