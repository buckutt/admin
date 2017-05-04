import Promotions            from './Promotions.vue';
import PromotionsCreate      from './PromotionsCreate.vue';
import PromotionsList        from './PromotionsList.vue';
import PromotionsEdit        from './PromotionsEdit.vue';
import PromotionsEditObject  from './PromotionsEditObject.vue';
import PromotionsEditPrices  from './PromotionsEditPrices.vue';
import PromotionsEditContent from './PromotionsEditContent.vue';

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
        path     : '/promotions/edit/:id',
        component: PromotionsEdit,
        children : [
            { path: '', component: PromotionsEditObject },
            { path: 'prices', component: PromotionsEditPrices },
            { path: 'content', component: PromotionsEditContent }
        ]
    }
];
