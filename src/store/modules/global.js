const state = {
    currentEvent : null,
    logged       : false,
    openEditModal: false
};

// mutations
const mutations = {
    UPDATECURRENTEVENT(state_, currentEvent) {
        state_.currentEvent = currentEvent;
    },
    UPDATELOGGED(state_, logged) {
        state_.logged = logged;
    },
    UPDATEEDITMODAL(state_, openEditModal) {
        state_.openEditModal = openEditModal;
    }
};

export default {
    state,
    mutations
};
