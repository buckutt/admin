import 'promise-polyfill';
import 'whatwg-fetch';

import jQuery    from 'jquery';
import Vue       from 'vue';
import VueRouter from 'vue-router';
import Vuex      from 'vuex';
import VueMdl    from 'vue-mdl';
import { sync }  from 'vuex-router-sync';

import 'material-design-lite/material.min.js';
import 'material-design-lite/material.min.css';
import 'jquery-datetimepicker/build/jquery.datetimepicker.full.min.js';
import 'jquery-datetimepicker/jquery.datetimepicker.css';
import './assets/font.css';

import App        from './App.vue';
import Home       from './components/Home.vue';
import Dashboard  from './components/Dashboard.vue';
import Devices    from './components/Devices.vue';
import Articles   from './components/Articles.vue';
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
import Confirm    from './components/Confirm.vue';

import {
    updateLogged,
    updateLoggedUser,
    clearModObject,
    load
} from './store/actions';

import store from './store/index';

import '../src/lib/textfield.js';

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(VueMdl);

Vue.component('b-confirm', Confirm);

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
        path     : '/articles',
        component: Articles
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
    }
];

routes.forEach((route) => {
    routes.push({
        path     : `${route.path}/:id`,
        component: route.component
    });
});

const withoutEventRoutes = ['', 'logout', 'events', 'treasury'];

const router = new VueRouter({ routes });

router.beforeEach((route, from, next) => {
    clearModObject(store);
    const path = route.path.split('/')[1];

    if ((path !== '' && !store.state.app.logged)
        || (withoutEventRoutes.indexOf(path) === -1 && !store.state.app.currentEvent)) {
        next('/');
    } else {
        next();
    }
});

const Admin = Vue.extend({
    router,
    store,
    components: { App },
    template  : '<App></App>',
    methods   : {
        goBack() {
            clearModObject(store);
            router.push(`/${store.state.route.path.split('/')[1]}`);
        }
    }
});

const vueApp = new Admin().$mount('#app');
sync(store, router);

store.subscribe((mutation) => {
    switch (mutation.type) {
        case 'UPDATEAPIERROR':
            vueApp.$root.$emit('snackfilter', {
                message: `[API] ${mutation.payload.statusText}`
            });
            break;
        case 'UPDATECLIENTERROR':
            vueApp.$root.$emit('snackfilter', {
                message: `[CLIENT] ${mutation.payload.message}`
            });
            break;
        case 'UPDATENOTIFY':
            vueApp.$root.$emit('snackfilter', {
                message: mutation.payload.message
            });
            break;
        default:
            break;
    }
});

if (sessionStorage.hasOwnProperty('token')) {
    updateLogged(router.app.$store, true);
    updateLoggedUser(router.app.$store, JSON.parse(sessionStorage.getItem('user')));
    load(router.app.$store);
}
