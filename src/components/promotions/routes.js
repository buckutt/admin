import Promotions           from './Promotions.vue';
import PromotionsCreate     from './PromotionsCreate.vue';
import PromotionsList       from './PromotionsList.vue';

import PromotionShow        from './promotion/PromotionShow.vue';
import PromotionShowDetails from './promotion/PromotionShowDetails.vue';
import PromotionEditObject  from './promotion/PromotionEditObject.vue';
import PromotionEditPrices  from './promotion/PromotionEditPrices.vue';
import PromotionEditContent from './promotion/PromotionEditContent.vue';

export default [
    {
        path     : '/promotions',
        component: Promotions,
        children : [
            { path: '', component: PromotionsList },
            { path: 'create', component: PromotionsCreate }
        ]
    },
    {
        path     : '/promotions/:id',
        component: PromotionShow,
        children : [
            { path: '', component: PromotionShowDetails },
            { path: 'edit', component: PromotionEditObject },
            { path: 'prices', component: PromotionEditPrices },
            { path: 'content', component: PromotionEditContent }
        ]
    }
];
