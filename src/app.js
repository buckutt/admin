import 'material-design-lite/material.min.js';
import 'material-design-lite/material.min.css';
import 'getmdl-select/getmdl-select.min.js';
import 'getmdl-select/getmdl-select.min.css';
import Chart from 'chart.js/Chart.js';
window.Chart = Chart;

Chart.defaults.global.animation = false;

import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Sidebar from './components/Sidebar.vue';
import Dashboard from './components/Dashboard.vue';
import Devices from './components/Devices.vue';
import Items from './components/Items.vue';
import Treasury from './components/Treasury.vue';
import Rights from './components/Rights.vue';
import Periods from './components/Periods.vue';
import { get } from './lib/fetch';

const router = new VueRouter();

router.map({
    '/': {
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
    '/rights': {
        component: Rights
    },
    '/periods': {
        component: Periods
    }
});

router.start(Sidebar, '#app');

window.Periods = Periods
get('articles').then(articles => router.app.$set('articles', articles));
get('devices').then(devices => router.app.$set('devices', devices));
get('points').then(points => router.app.$set('points', points));

window.router = router;
