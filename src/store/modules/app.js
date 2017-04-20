import lodset from 'lodash.set';
import lodget from 'lodash.get';

const state = {
    modObject   : null,
    currentEvent: null,
    logged      : false,
    loggedUser  : null
};

// mutations
const mutations = {
    UPDATEMODOBJECT(state_, modObject) {
        state_.modObject = modObject;
    },
    UPDATEMODOBJECTFIELD(state_, payload) {
        lodset(state_.modObject, payload.field, payload.value);
    },
    ADDMODOBJECTRELATION(state_, payload) {
        lodget(state_.modObject, payload.relation).push(payload.value);
    },
    UPDATEMODOBJECTRELATION(state_, payload) {
        const relations = lodget(state_.modObject, payload.relation).slice(0);
        const i         = relations.findIndex(o => (o.id === payload.value.id));
        relations[i]    = payload.value;
        lodset(state_.modObject, payload.relation, relations);
    },
    REMOVEMODOBJECTRELATION(state_, payload) {
        const i = lodget(state_.modObject, payload.relation).findIndex(o => (o.id === payload.value.id));

        lodget(state_.modObject, payload.relation).splice(i, 1);
    },
    CLEARMODOBJECT(state_) {
        state_.modObject = null;
    },
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
