const state = {
    currentEvent: null
};

// mutations
const mutations = {
    UPDATECURRENTEVENT(state_, currentEvent) {
        state_.currentEvent = currentEvent;
    }
};

export default {
    state,
    mutations
};
