import lodset from 'lodash.set';
import lodget from 'lodash.get';

const state = {
    modObject   : null,
    currentEvent: null,
    loggedUser  : null,
    firstLoad   : false,
    creationData: {}
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
        lodget(state_.modObject, payload.newRelation).push(payload.value);
    },
    UPDATEMODOBJECTRELATION(state_, payload) {
        const relations = lodget(state_.modObject, payload.relation).slice(0);
        const i         = relations.findIndex(o => (o.id === payload.value.id));
        if (i > -1) {
            relations[i] = payload.value;
            lodset(state_.modObject, payload.relation, relations);
        }
    },
    REMOVEMODOBJECTRELATION(state_, payload) {
        const i = lodget(state_.modObject, payload.relation).findIndex(o => (o.id === payload.value.id));

        if (i > -1) {
            lodget(state_.modObject, payload.relation).splice(i, 1);
        }
    },
    CLEARMODOBJECT(state_) {
        state_.modObject = null;
    },
    UPDATECURRENTEVENT(state_, currentEvent) {
        state_.currentEvent = currentEvent;
    },
    UPDATELOGGEDUSER(state_, loggedUser) {
        state_.loggedUser = loggedUser;
    },
    UPDATEFIRSTLOAD(state_, firstLoad) {
        state_.firstLoad = firstLoad;
    },
    UPDATECREATIONDATA(state_, creationData) {
        state_.creationData = creationData;
    }
};

export default {
    state,
    mutations
};
