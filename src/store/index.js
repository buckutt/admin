import Vue  from 'vue';
import Vuex from 'vuex';

import * as actions from './actions';

import app           from './modules/app';
import cardBlock     from './modules/cardBlock';
import changes       from './modules/changes';
import global        from './modules/global';
import notifications from './modules/notifications';

Vue.use(Vuex);

export default new Vuex.Store({
    actions,
    modules: {
        app,
        cardBlock,
        changes,
        global,
        notifications
    }
});
