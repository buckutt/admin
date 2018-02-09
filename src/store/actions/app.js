import { get }         from '../../lib/fetch';
import routeToRelation from '../../lib/routeToRelation';

/**
 * Global actions
 */

export function updateCurrentEvent({ dispatch }, currentEvent) {
    const embedEvents = routeToRelation('events');

    return get(`events/${currentEvent.id}?embed=${embedEvents}`)
        .then((result) => {
            if (result.periods) {
                result.periods = result.periods.filter(period => !period.isRemoved);
            }

            return dispatch('changeCurrentEvent', result);
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

export function updateLoggedUser({ commit }, loggedUser) {
    commit('UPDATELOGGEDUSER', loggedUser);
}

export function updateCreationData({ commit }, creationData) {
    commit('UPDATECREATIONDATA', creationData);
}

export function load({ state, dispatch }) {
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
        'meansofpayment',
        'webservices',
        'alerts'
    ];

    dispatch('initSocket', sessionStorage.getItem('token'));

    const objectsToFetch = routes.map(route => dispatch('fetchObjects', { route }));

    Promise.all(objectsToFetch)
        .then(() => {
            if (state.objects.events.length === 1) {
                dispatch('updateCurrentEvent', state.objects.events[0]);
            }
        });

    dispatch('registerModels', routes);
}

export function checkAndCreateNeededRouterData({ state, commit, dispatch }) {
    if (state.app.firstLoad) {
        return Promise.resolve();
    }

    const actions = [];

    if (sessionStorage.hasOwnProperty('token')) {
        commit('UPDATELOGGEDUSER', JSON.parse(sessionStorage.getItem('user')));
        dispatch('load');
    }

    if (sessionStorage.hasOwnProperty('event')) {
        actions.push(dispatch('updateCurrentEvent', JSON.parse(sessionStorage.getItem('event'))));
    }

    return Promise.all(actions)
        .then(() => {
            commit('UPDATEFIRSTLOAD', true);
            return Promise.resolve();
        })
        .catch(() => Promise.reject());
}
