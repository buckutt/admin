const state = {
    points    : [],
    devices   : [],
    periods   : [],
    articles  : [],
    fundations: []
};

// mutations
const mutations = {
    ADDPOINTS: function (state, points) {
        state.points.push(...points);
    },
    ADDDEVICES: function (state, devices) {
        state.devices.push(...devices);
    },
    ADDPERIODS: function (state, periods) {
        state.periods.push(...periods);
    },
    ADDARTICLES: function (state, articles) {
        state.articles.push(...articles);
    },
    ADDFUNDATIONS: function (state, fundations) {
        state.fundations.push(...fundations);
    }
};

export default {
  state,
  mutations
};
