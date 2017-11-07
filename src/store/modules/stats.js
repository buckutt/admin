const state = {
    curves    : [],
    timeseries: {}
};

// mutations
const mutations = {
    UPDATETIMESERIE(state_, data) {
        state_.timeseries[data.name] = data.values;
    },
    REMOVETIMESERIE(state_, name) {
        delete state_.timeseries[name];
    },
    ADDCURVE(state_, curve) {
        state_.curves.push(curve);
    },
    DELETECURVE(state_, curveIndex) {
        state_.curves.splice(curveIndex, 1);
    }
};

export default {
    state,
    mutations
};
