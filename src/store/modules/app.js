const state = {
    points    : [],
    devices   : [],
    periods   : [],
    articles  : [],
    fundations: []
};

// mutations
const mutations = {
    ADDPOINTS(state, points) {
        state.points.push(...points);
    },
    ADDDEVICES(state, devices) {
        state.devices.push(...devices);
    },
    ADDPERIODS(state, periods) {
        state.periods.push(...periods);
    },
    ADDARTICLES(state, articles) {
        state.articles.push(...articles);
    },
    ADDFUNDATIONS(state, fundations) {
        state.fundations.push(...fundations);
    }
};

export default {
    state,
    mutations
};
