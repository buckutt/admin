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

import App            from './App.vue';
import Confirm        from './components/Confirm.vue';
import PaginatedTable from './components/PaginatedTable.vue';

import Articles       from './components/articles/Articles.vue';
import ArticlesEdit   from './components/articles/ArticlesEdit.vue';
import Categories     from './components/categories/Categories.vue';
import CategoriesEdit from './components/categories/CategoriesEdit.vue';
import Dashboard      from './components/dashboard/Dashboard.vue';
import Devices        from './components/devices/Devices.vue';
import DevicesEdit    from './components/devices/DevicesEdit.vue';
import Events         from './components/events/Events.vue';
import EventsEdit     from './components/events/EventsEdit.vue';
import Fundations     from './components/fundations/Fundations.vue';
import FundationsEdit from './components/fundations/FundationsEdit.vue';
import Groups         from './components/groups/Groups.vue';
import GroupsEdit     from './components/groups/GroupsEdit.vue';
import Home           from './components/home/Home.vue';
import Logout         from './components/logout/Logout.vue';
import Periods        from './components/periods/Periods.vue';
import PeriodsEdit    from './components/periods/PeriodsEdit.vue';
import Points         from './components/points/Points.vue';
import PointsEdit     from './components/points/PointsEdit.vue';
import Promotions     from './components/promotions/Promotions.vue';
import PromotionsEdit from './components/promotions/PromotionsEdit.vue';
import Purchases      from './components/purchases/Purchases.vue';
import Treasury       from './components/treasury/Treasury.vue';
import Users          from './components/users/Users.vue';
import UsersEdit      from './components/users/UsersEdit.vue';

import store from './store/index';

import '../src/lib/textfield.js';

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(VueMdl);

Vue.component('b-confirm', Confirm);
Vue.component('b-table', PaginatedTable);

window.jQuery = jQuery;

const routes = [
    { path: '/', component: Home },
    { path: '/stats', component: Dashboard },
    { path: '/devices', component: Devices },
    { path: '/devices/edit/:id', component: DevicesEdit },
    { path: '/articles', component: Articles },
    { path: '/articles/edit/:id', component: ArticlesEdit },
    { path: '/treasury', component: Treasury },
    { path: '/purchases', component: Purchases },
    { path: '/users', component: Users },
    { path: '/users/edit/:id', component: UsersEdit },
    { path: '/groups', component: Groups },
    { path: '/groups/edit/:id', component: GroupsEdit },
    { path: '/categories', component: Categories },
    { path: '/categories/edit/:id', component: CategoriesEdit },
    { path: '/periods', component: Periods },
    { path: '/periods/edit/:id', component: PeriodsEdit },
    { path: '/fundations', component: Fundations },
    { path: '/fundations/edit/:id', component: FundationsEdit },
    { path: '/points', component: Points },
    { path: '/points/edit/:id', component: PointsEdit },
    { path: '/promotions', component: Promotions },
    { path: '/promotions/edit/:id', component: PromotionsEdit },
    { path: '/events', component: Events },
    { path: '/events/edit/:id', component: EventsEdit },
    { path: '/logout', component: Logout }
];

const withoutEventRoutes = ['', 'logout', 'events', 'treasury'];

const router = new VueRouter({ routes });

router.beforeEach((route, from, next) => {
    store.dispatch('checkAndCreateNeededRouterData')
        .then(() => {
            const path = route.path.split('/')[1];

            if ((path !== '' && !store.getters.logged)
                || (withoutEventRoutes.indexOf(path) === -1 && !store.state.app.currentEvent)) {
                store.dispatch('clearModObject');
                next('/');
            } else if (route.params.id) {
                store.dispatch('expandObject', {
                    route: path,
                    value: { id: route.params.id }
                })
                .then(() => next())
                .catch(() => next(from.path));
            } else {
                store.dispatch('clearModObject');
                next();
            }
        })
        .catch(() =>
            store.dipatch('showClientError', 'Impossible de récupérer l\'événement, veuillez actualiser la page')
        );
});

const Admin = Vue.extend({
    router,
    store,
    components: { App },
    template  : '<App></App>',
    methods   : {
        goBack() {
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
