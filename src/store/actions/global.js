import { get } from '../../lib/fetch';

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
