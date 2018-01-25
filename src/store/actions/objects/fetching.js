import { get }         from '../../../lib/fetch';
import routeToRelation from '../../../lib/routeToRelation';

export function expandObject({ commit, dispatch, state }, object) {
    let embed = '';

    if (routeToRelation(object.route)) {
        embed = `?embed=${routeToRelation(object.route)}`;
    }

    return get(`${object.route}/${object.value.id}${embed}`)
        .then((result) => {
            if (object.route === 'events' && state.app.currentEvent) {
                if (state.app.currentEvent.id === object.value.id) {
                    dispatch('updateCurrentEvent', result);
                }
            }

            dispatch('checkAndUpdateObjects', { route: object.route, objects: [result] });

            if (result._data) {
                delete result._data;
            }

            commit('UPDATEMODOBJECT', result);

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
