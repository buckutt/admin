import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import cardBlock from './modules/cardBlock';
import global from './modules/global';

Vue.use(Vuex);

// Restore mdl after each mutation
const middlewareMDL = {
    onMutation () {
        /* global componentHandler */
        setTimeout(() => componentHandler.upgradeAllRegistered());
    }
};

export default new Vuex.Store({
    modules: {
        app,
        cardBlock,
        global
    },
    middlewares: [ middlewareMDL ]
});
