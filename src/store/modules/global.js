const state = {
    currentEvent: null,
    logged      : false
};

// mutations
const mutations = {
    UPDATECURRENTEVENT(state_, currentEvent) {
        state_.currentEvent = currentEvent;
    },
    UPDATELOGGED(state_, logged) {
        state_.logged = logged;
    }
};

export default {
    state,
    mutations
};
