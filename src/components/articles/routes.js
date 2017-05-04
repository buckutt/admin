import Articles           from './Articles.vue';
import ArticlesCreate     from './ArticlesCreate.vue';
import ArticlesEdit       from './ArticlesEdit.vue';
import ArticlesEditObject from './ArticlesEditObject.vue';
import ArticlesEditPrices from './ArticlesEditPrices.vue';
import ArticlesList       from './ArticlesList.vue';

export default [
    {
        path     : '/articles',
        component: Articles,
        children : [
            { path: '', component: ArticlesList },
            { path: 'create', component: ArticlesCreate }
        ]
    },
    {
        path     : '/articles/edit/:id',
        component: ArticlesEdit,
        children : [
            { path: '', component: ArticlesEditObject },
            { path: 'prices', component: ArticlesEditPrices }
        ]
    }
];
