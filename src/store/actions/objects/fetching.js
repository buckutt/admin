import { get }         from '../../../lib/fetch';
import routeToRelation from '../../../lib/routeToRelation';

export function retrieveObject({ dispatch, state }, payload) {
    let embed = '';

    if (routeToRelation(payload.route)) {
        embed = `?embed=${routeToRelation(payload.route)}`;
    }

    return get(`${payload.route}/${payload.id}${embed}`)
        .then((result) => {
            if (payload.route === 'events' && state.app.currentEvent) {
                if (state.app.currentEvent.id === payload.value.id) {
                    dispatch('updateCurrentEvent', result);
                }
            }

            dispatch('checkAndUpdateObjects', { route: payload.route, objects: [result], forceUpdate: true });

            if (result._data) {
                delete result._data;
            }

            return result;
        });
}

export function fetchObjects({ dispatch }, data) {
    return get(data.route.toLowerCase())
        .then((results) => {
            dispatch('checkAndAddObjects', { route: data.route, objects: results });
        });
}

export function fetchObjectsAndRelations({ dispatch }, data) {
    let embed = '';
    if (routeToRelation(data.route)) {
        embed = `?embed=${routeToRelation(data.route)}`;
    }

    return get(`${data.route.toLowerCase()}${embed}`)
        .then((results) => {
            dispatch('checkAndAddObjects', { route: data.route, objects: results });
        });
}
