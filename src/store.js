import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
    points    : [],
    devices   : [],
    periods   : [],
    articles  : [],
    fundations: []
};

const mutations = {
    SETPOINTS: function (state, points) {
        state.points.push(...points);
    },
    SETDEVICES: function (state, devices) {
        state.devices.push(...devices);
    },
    SETPERIODS: function (state, periods) {
        state.periods.push(...periods);
    },
    SETARTICLES: function (state, articles) {
        state.articles.push(...articles);
    },
    SETFUNDATIONS: function (state, fundations) {
        state.fundations.push(...fundations);
    }
};

const actions = {
};

export default new Vuex.Store({
    state,
    actions,
    mutations
});
