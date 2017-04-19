const state = {
    currentEvent: null,
    logged      : false,
    loggedUser  : null
};

// mutations
const mutations = {
    UPDATECURRENTEVENT(state_, currentEvent) {
        state_.currentEvent = currentEvent;
    },
    UPDATELOGGED(state_, logged) {
        state_.logged = logged;
    },
    UPDATELOGGEDUSER(state_, loggedUser) {
        state_.loggedUser = loggedUser;
    }
};

export default {
    state,
    mutations
};
