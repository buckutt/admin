const state = {
    apiError   : null,
    clientError: null,
    notify     : null
};

// mutations
const mutations = {
    UPDATEAPIERROR(state_, apiError) {
        state_.apiError = apiError;
    },
    UPDATECLIENTERROR(state_, clientError) {
        state_.clientError = clientError;
    },
    UPDATENOTIFY(state_, notify) {
        state_.notify = notify;
    }
};

export default {
    state,
    mutations
};
