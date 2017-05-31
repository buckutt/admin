import lodset from 'lodash.set';
import lodget from 'lodash.get';

const state = {
    modObject        : null,
    currentEvent     : null,
    loggedUser       : null,
    firstLoad        : false,
    lastValidatedStep: 0
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
            relations[i]    = payload.value;
            lodset(state_.modObject, payload.relation, relations);
        }
    },
    REMOVEMODOBJECTRELATION(state_, payload) {
        const i = (payload.through) ?
            lodget(state_.modObject, payload.relation).findIndex(o => (
                o.id === payload.value.id &&
                o._through[payload.through.field] === payload.through.value.id
            )) :
            lodget(state_.modObject, payload.relation).findIndex(o => (o.id === payload.value.id));

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
    UPDATELASTVALIDATEDSTEP(state_, lastValidatedStep) {
        state_.lastValidatedStep = lastValidatedStep;
    }
};

export default {
    state,
    mutations
};
