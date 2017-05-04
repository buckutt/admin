import Categories             from './Categories.vue';
import CategoriesCreate       from './CategoriesCreate.vue';
import CategoriesList         from './CategoriesList.vue';
import CategoriesEdit         from './CategoriesEdit.vue';
import CategoriesEditObject   from './CategoriesEditObject.vue';
import CategoriesEditArticles from './CategoriesEditArticles.vue';

export default [
    {
        path     : '/categories',
        component: Categories,
        children : [
            { path: '', component: CategoriesList },
            { path: 'create', component: CategoriesCreate }
        ]
    },
    {
        path     : '/categories/edit/:id',
        component: CategoriesEdit,
        children : [
            { path: '', component: CategoriesEditObject },
            { path: 'articles', component: CategoriesEditArticles }
        ]
    }
];
