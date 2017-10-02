import { get }     from '../../../lib/fetch';
import queryString from '../../../lib/queryString';

export function expandObject({ commit, dispatch, state }, object) {
    let embed = '';
    if (config.relations[object.route]) {
        embed = `?embed=${encodeURIComponent(JSON.stringify(config.relations[object.route]))}`;
    }

    return get(`${object.route}/${object.value.id}${embed}`)
        .then((result) => {
            if (config.relations[object.route]) {
                Object.keys(config.relations[object.route]).forEach((key) => {
                    if (Array.isArray(result[key])) {
                        result[key] = result[key].filter(rel => !rel.isRemoved);
                    }
                });
            }

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
    const filters = (data.filters) ? data.filters : [];
    filters.push({
        field: 'isRemoved',
        eq   : false
    });

    return get(`${data.route.toLowerCase()}/search?q[]=${queryString(filters)}`)
        .then((results) => {
            dispatch('checkAndAddObjects', { route: data.route, objects: results });
        });
}

export function fetchObjectsAndRelations({ dispatch }, data) {
    let embed         = '';
    let filtersPrefix = '?q[]=';
    if (config.relations[data.route]) {
        embed         = `?embed=${encodeURIComponent(JSON.stringify(config.relations[data.route]))}`;
        filtersPrefix = '&q[]=';
    }

    const filters = (data.filters) ? data.filters : [];
    filters.push({
        field: 'isRemoved',
        eq   : false
    });

    const andQ = `${filtersPrefix}${queryString(filters)}`;

    return get(`${data.route.toLowerCase()}/search${embed}${andQ}`)
        .then((results) => {
            // TODO = FILTRES POST RÉSULTATS SUR LES RELATIONS - limiter le lag lié au store
            dispatch('checkAndAddObjects', { route: data.route, objects: results });
        });
}
