import { get } from '../../lib/fetch';

/**
 * ModObject actions
 */

export function clearModObject({ commit }) {
    commit('CLEARMODOBJECT');
}

export function updateModObject({ commit, state }, payload) {
    if (payload.relation) {
        const index = state.app.modObject[payload.relation].findIndex(o => (o.id === payload.value.id));

        if (index === -1) {
            commit('ADDMODOBJECTRELATION', payload);
        } else {
            commit('UPDATEMODOBJECTRELATION', payload);
        }
    } else {
        commit('UPDATEMODOBJECTFIELD', payload);
    }
}

export function removeModObjectRelation({ commit }, payload) {
    commit('REMOVEMODOBJECTRELATION', payload);
}

/**
 * Global actions
 */

export function updateCurrentEvent({ commit }, currentEvent) {
    const embedEvents = encodeURIComponent(JSON.stringify({
        periods: true
    }));

    get(`events/${currentEvent.id}?embed=${embedEvents}`)
        .then((result) => {
            if (result.periods) {
                result.periods = result.periods.filter(period => !period.isRemoved);
            }
            sessionStorage.setItem('event', JSON.stringify(result));
            commit('UPDATECURRENTEVENT', result);
        });
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
        'events'
    ];

    dispatch('initSocket', sessionStorage.getItem('token'));

    routes.forEach((route) => {
        dispatch('fetchObjects', route);
    });

    dispatch('registerModels', routes);
}
