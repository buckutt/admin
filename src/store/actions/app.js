import lodget  from 'lodash.get';
import { get } from '../../lib/fetch';

/**
 * ModObject actions
 */

export function clearModObject({ commit }) {
    commit('CLEARMODOBJECT');
}

export function updateModObject({ commit, state }, payload) {
    if (payload.relation) {
        const index = lodget(state.app.modObject, payload.relation).findIndex(o => (o.id === payload.value.id));

        if (index !== -1) {
            commit('UPDATEMODOBJECTRELATION', payload);
        }
    } else if (payload.newRelation) {
        commit('ADDMODOBJECTRELATION', payload);
    } else {
        commit('UPDATEMODOBJECTFIELD', payload);
    }
}

export function removeModObjectRelation({ commit }, payload) {
    commit('REMOVEMODOBJECTRELATION', payload);
}

/**
 * Event configurator actions
 */

export function resetLastValidatedStep({ commit }) {
    commit('UPDATELASTVALIDATEDSTEP', 0);
}

export function updateLastValidatedStep({ commit, state }, lastValidatedStep) {
    if (state.app.lastValidatedStep < lastValidatedStep) {
        commit('UPDATELASTVALIDATEDSTEP', lastValidatedStep);
    }
}

/**
 * Global actions
 */

export function updateCurrentEvent({ dispatch }, currentEvent) {
    const embedEvents = encodeURIComponent(JSON.stringify(config.relations.events));

    return new Promise((resolve, reject) => {
        get(`events/${currentEvent.id}?embed=${embedEvents}`)
            .then((result) => {
                if (result.periods) {
                    result.periods = result.periods.filter(period => !period.isRemoved);
                }

                return dispatch('changeCurrentEvent', result);
            })
            .then(() => resolve())
            .catch(() => reject());
    });
}

export function changeCurrentEvent({ commit }, currentEvent) {
    return new Promise((resolve) => {
        sessionStorage.setItem('event', JSON.stringify(currentEvent));
        commit('UPDATECURRENTEVENT', currentEvent);
        resolve();
    });
}

export function unselectCurrentEvent({ commit }) {
    sessionStorage.removeItem('event');
    commit('UPDATECURRENTEVENT', null);
}

export function updateLogged({ commit }, logged) {
    commit('UPDATELOGGED', logged);
}

export function updateLoggedUser({ commit }, loggedUser) {
    commit('UPDATELOGGEDUSER', loggedUser);
}

export function updateEditModal({ commit }, openEditModal) {
    commit('UPDATEEDITMODAL', openEditModal);
}

export function load({ dispatch }) {
    const routes = [
        'points',
        'devices',
        'periods',
        'articles',
        'fundations',
        'groups',
        'categories',
        'promotions',
        'sets',
        'events',
        'meansofpayment'
    ];

    dispatch('initSocket', sessionStorage.getItem('token'));

    routes.forEach((route) => {
        dispatch('fetchObjects', route);
    });

    dispatch('registerModels', routes);
}

export function checkAndCreateNeededRouterData({ state, commit, dispatch }) {
    return new Promise((resolve, reject) => {
        if (state.app.firstLoad) {
            resolve();
        } else {
            const actions = [];

            if (sessionStorage.hasOwnProperty('token')) {
                commit('UPDATELOGGEDUSER', JSON.parse(sessionStorage.getItem('user')));
                dispatch('load');
            }

            if (sessionStorage.hasOwnProperty('event')) {
                actions.push(dispatch('updateCurrentEvent', JSON.parse(sessionStorage.getItem('event'))));
            }

            Promise.all(actions)
                .then(() => {
                    commit('UPDATEFIRSTLOAD', true);
                    resolve();
                })
                .catch(() => reject());
        }
    });
}
