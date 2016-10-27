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
import Points     from './components/Points.vue';
import Promotions from './components/Promotions.vue';
import Groups     from './components/Groups.vue';
import Categories from './components/Categories.vue';
import Events     from './components/Events.vue';
import CardBlock  from './components/CardBlock.vue';
import {
    fetchPoints,
    fetchDevices,
    fetchPeriods,
    fetchArticles,
    fetchFundations,
    fetchGroups,
    fetchCategories,
    fetchEvents,
    fetchPromotions,
    fetchSets,
    listenChanges
} from './store/actions';

import store from './store/index';

window.jQuery = jQuery;

const router = new VueRouter();

const App = Vue.extend({
    store,
    components: { Sidebar },
    template  : '<div><Sidebar></Sidebar><router-view></router-view></div>'
});

router.map({
    '/': {
        component: Home
    },
    '/stats': {
        component: Dashboard
    },
    '/devices': {
        component: Devices
    },
    '/items': {
        component: Items
    },
    '/treasury': {
        component: Treasury
    },
    '/purchases': {
        component: Purchases
    },
    '/users': {
        component: Users
    },
    '/groups': {
        component: Groups
    },
    '/categories': {
        component: Categories
    },
    '/periods': {
        component: Periods
    },
    '/points': {
        component: Points
    },
    '/promotions': {
        component: Promotions
    },
    '/events': {
        component: Events
    },
    '/cardBlock': {
        component: CardBlock
    }
});

router.start(App, '#app');

// Restore material components after page change
router.afterEach(() => {
    setTimeout(() => {
        /* global componentHandler */
        componentHandler.upgradeAllRegistered();
    });
});

fetchPoints(router.app.$store);
fetchDevices(router.app.$store);
fetchPeriods(router.app.$store);
fetchArticles(router.app.$store);
fetchFundations(router.app.$store);
fetchGroups(router.app.$store);
fetchCategories(router.app.$store);
fetchPromotions(router.app.$store);
fetchSets(router.app.$store);
fetchEvents(router.app.$store);

listenChanges(router.app.$store, [
    'points',
    'devices',
    'periods',
    'articles',
    'fundations',
    'groups',
    'categories',
    'promotions',
    'sets',
    'events'
]);

window.router = router;
