import { get } from '../../lib/fetch';

/**
 * Stats actions
 */

export function fetchTimeserie({ commit }, filters) {
    const q = [];

    q.push(`event=${filters.fields.event.id}`);

    if (filters.fields.promotion) {
        q.push(`promotion=${filters.fields.promotion.id}`);
    }

    if (filters.fields.article) {
        q.push(`article=${filters.fields.article.id}`);
    }

    if (filters.fields.point) {
        q.push(`point=${filters.fields.point.id}`);
    }

    if (filters.fields.fundation) {
        q.push(`fundation=${filters.fields.fundation.id}`);
    }

    if (filters.timefilter.dateIn && filters.timefilter.dateOut) {
        q.push(`dateIn=${filters.timefilter.dateIn.toISOString()}`);
        q.push(`dateOut=${filters.timefilter.dateOut.toISOString()}`);
    }

    const qString = q
        .join('&');

    return get(`services/stats/purchases?${qString}`)
        .then((timeserie) => {
            commit('UPDATETIMESERIE', { name: filters.name, values: timeserie });
        });
}

export function removeTimeserie({ commit }, name) {
    commit('REMOVETIMESERIE', name);
}

export function addCurve({ commit }, curve) {
    commit('ADDCURVE', curve);
}

export function removeCurve({ commit }, curveIndex) {
    commit('DELETECURVE', curveIndex);
}
