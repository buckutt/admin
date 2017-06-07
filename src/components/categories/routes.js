import Categories           from './Categories.vue';
import CategoriesCreate     from './CategoriesCreate.vue';
import CategoriesList       from './CategoriesList.vue';

import CategoryShow         from './category/CategoryShow.vue';
import CategoryShowDetails  from './category/CategoryShowDetails.vue';
import CategoryEditObject   from './category/CategoryEditObject.vue';
import CategoryEditArticles from './category/CategoryEditArticles.vue';

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
        path     : '/categories/:id',
        component: CategoryShow,
        children : [
            { path: '', component: CategoryShowDetails },
            { path: 'edit', component: CategoryEditObject },
            { path: 'articles', component: CategoryEditArticles }
        ]
    }
];
