import 'material-design-lite/material.min.js';
import 'material-design-lite/material.min.css';
import 'jquery-datetimepicker/build/jquery.datetimepicker.full.min.js';
import 'jquery-datetimepicker/jquery.datetimepicker.css';
import jQuery from 'jquery';

import Vue       from 'vue';
import VueRouter from 'vue-router';
import Vuex      from 'vuex';
import VueMdl    from 'vue-mdl';

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(VueMdl);

import Sidebar    from './components/Sidebar.vue';
import Home       from './components/Home.vue';
import Dashboard  from './components/Dashboard.vue';
import Devices    from './components/Devices.vue';
import Items      from './components/Items.vue';
import Treasury   from './components/Treasury.vue';
import Purchases  from './components/Purchases.vue';
import Users      from './components/Users.vue';
import Periods    from './components/Periods.vue';
import Fundations from './components/Fundations.vue';
import Points     from './components/Points.vue';
import Promotions from './components/Promotions.vue';
import Groups     from './components/Groups.vue';
import Categories from './components/Categories.vue';
import Events     from './components/Events.vue';
import Logout     from './components/Logout.vue';
import CardBlock  from './components/CardBlock.vue';

import { updateLogged } from './store/actions';

import store    from './store/index';
import { load } from './lib/load';

window.jQuery = jQuery;

const routes = [
    {
        path     : '/',
        component: Home
    },
    {
        path     : '/stats',
        component: Dashboard
    },
    {
        path     : '/devices',
        component: Devices
    },
    {
        path     : '/items',
        component: Items
    },
    {
        path     : '/treasury',
        component: Treasury
    },
    {
        path     : '/purchases',
        component: Purchases
    },
    {
        path     : '/users',
        component: Users
    },
    {
        path     : '/groups',
        component: Groups
    },
    {
        path     : '/categories',
        component: Categories
    },
    {
        path     : '/periods',
        component: Periods
    },
    {
        path     : '/fundations',
        component: Fundations
    },
    {
        path     : '/points',
        component: Points
    },
    {
        path     : '/promotions',
        component: Promotions
    },
    {
        path     : '/events',
        component: Events
    },
    {
        path     : '/logout',
        component: Logout
    },
    {
        path     : '/cardBlock',
        component: CardBlock
    }
];

const router = new VueRouter({ routes });

router.beforeEach((route, from, next) => {
    if (route.path !== '/' && !router.app.$store.state.global.logged) {
        next('/');
    } else {
        next();
    }
});

const App = Vue.extend({
    router,
    store,
    components: { Sidebar },
    template  : '<div><Sidebar></Sidebar><router-view></router-view></div>',
    methods   : {
        confirm() {
            return window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?');
        }
    }
});

new App().$mount('#app');

if (sessionStorage.hasOwnProperty('token')) {
    updateLogged(router.app.$store, true);
    load(router.app.$store);
}

window.router = router;
