import { api }            from '../../../config';
import { get, post, put } from '../../lib/fetch';

/**
 * App actions
 */

export function clearAppStore({ commit }) {
    commit('CLEARAPPSTORE');
}

export function fetchPoints({ commit }) {
    get('points').then(points => {
        commit('ADDPOINTS', points);
    });
}

export function fetchDevices({ commit }) {
    get('devices').then(devices => {
        commit('ADDDEVICES', devices);
    });
}

export function fetchPeriods({ commit }) {
    get('periods').then(periods => {
        commit('ADDPERIODS', periods);
    });
}

export function fetchArticles({ commit }) {
    get('articles').then(articles => {
        commit('ADDARTICLES', articles);
    });
}

export function fetchFundations({ commit }) {
    get('fundations').then(fundations => {
        commit('ADDFUNDATIONS', fundations);
    });
}

export function fetchGroups({ commit }) {
    get('groups').then(groups => {
        commit('ADDGROUPS', groups);
    });
}

export function fetchCategories({ commit }) {
    get('categories').then(categories => {
        commit('ADDCATEGORIES', categories);
    });
}

export function fetchPromotions({ commit }) {
    get('promotions').then(promotions => {
        commit('ADDPROMOTIONS', promotions);
    });
}

export function fetchSets({ commit }) {
    get('sets').then(sets => {
        commit('ADDSETS', sets);
    });
}

export function fetchEvents({ commit }) {
    get('events').then(events => {
        commit('ADDEVENTS', events);
    });
}

/**
 * SSE actions
 */

const modelTocommit = {
    points: {
        add   : 'ADDPOINTS',
        update: 'UPDATEPOINT',
        delete: 'DELETEPOINT'
    },
    devices: {
        add   : 'ADDDEVICES',
        update: 'UPDATEDEVICE',
        delete: 'DELETEDEVICE'
    },
    periods: {
        add   : 'ADDPERIODS',
        update: 'UPDATEPERIOD',
        delete: 'DELETEPERIOD'
    },
    articles: {
        add   : 'ADDARTICLES',
        update: 'UPDATEARTICLE',
        delete: 'DELETEARTICLE'
    },
    fundations: {
        add   : 'ADDFUNDATIONS',
        update: 'UPDATEFUNDATION',
        delete: 'DELETEFUNDATION'
    },
    groups: {
        add   : 'ADDGROUPS',
        update: 'UPDATEGROUP',
        delete: 'DELETEGROUP'
    },
    categories: {
        add   : 'ADDCATEGORIES',
        update: 'UPDATECATEGORY',
        delete: 'DELETECATEGORY'
    },
    promotions: {
        add   : 'ADDPROMOTIONS',
        update: 'UPDATEPROMOTION',
        delete: 'DELETEPROMOTION'
    },
    sets: {
        add   : 'ADDSETS',
        update: 'UPDATESET',
        delete: 'DELETESET'
    },
    events: {
        add   : 'ADDEVENTS',
        update: 'UPDATEEVENT',
        delete: 'DELETEEVENT'
    }
};

export function listenChanges({ commit }, payload) {
    const token        = payload.token;
    const models       = payload.models;
    const modelsString = models.join(',');

    const es = new EventSource(`${api}/changes?models=${modelsString}&authorization=Bearer ${token}`, {
        withCredentials: true
    });

    es.onmessage = function (e) {
        try {
            const data = JSON.parse(e.data);
            switch (data.action) {
                case 'listen':
                    console.log(`Listen to ${data.model} changes`);
                    break;
                case 'create':
                    commit(modelTocommit[data.model].add, [data.doc]);
                    break;
                case 'update':
                    if (data.doc.isRemoved) {
                        commit(modelTocommit[data.model].delete, data.doc);
                    }
                    commit(modelTocommit[data.model].update, data.doc);
                    break;
                case 'delete':
                    commit(modelTocommit[data.model].delete, data.doc);
                    break;
                default:
                    console.log('Unknown event');
                    break;
            }
        } catch (error) {
            console.log(error);
        }
    };
}

/**
 * Periods actions
 */

export function createPeriod({ commit }, period) {
    post('periods', period);
}

export function updatePeriod({ commit }, period) {
    put(`periods/${period.id}`, period);
}

export function removePeriod({ commit }, period) {
    put(`periods/${period.id}`, { isRemoved: true });
}


/**
 * Articles actions
 */

export function createArticle({ commit }, article) {
    post('articles', article);
}

export function updateArticle({ commit }, article) {
    put(`articles/${article.id}`, article);
}

export function removeArticle({ commit }, article) {
    put(`articles/${article.id}`, { isRemoved: true });
}

/**
 * Points actions
 */

export function createPoint({ commit }, point) {
    post('points', point);
}

export function updatePoint({ commit }, point) {
    put(`points/${point.id}`, point);
}

export function removePoint({ commit }, point) {
    put(`points/${point.id}`, { isRemoved: true });
}

/**
 * Devices actions
 */

export function updateDevice({ commit }, device) {
    put(`devices/${device.id}`, device);
}

export function removeDevice({ commit }, device) {
    put(`devices/${device.id}`, { isRemoved: true });
}

/**
 * Groups actions
 */

export function createGroup({ commit }, group) {
    post('groups', group);
}

export function updateGroup({ commit }, group) {
    put(`groups/${group.id}`, group);
}

export function removeGroup({ commit }, group) {
    put(`groups/${group.id}`, { isRemoved: true });
}

/**
 * Categories actions
 */

export function createCategory({ commit }, category) {
    post('categories', category);
}

export function updateCategory({ commit }, category) {
    put(`categories/${category.id}`, category);
}

export function removeCategory({ commit }, category) {
    put(`categories/${category.id}`, { isRemoved: true });
}

/**
 * Promotions actions
 */

export function createPromotion({ commit }, promotion) {
    post('promotions', promotion);
}

export function updatePromotion({ commit }, promotion) {
    put(`promotions/${promotion.id}`, promotion);
}

export function removePromotion({ commit }, promotion) {
    put(`promotions/${promotion.id}`, { isRemoved: true });
}

/**
 * Sets actions
 */

export function createSet({ commit }, set) {
    post('sets', set);
}

export function createSetWithArticles({ commit }, payload) {
    const set       = payload.set;
    const articles  = payload.articles;
    const promotion = payload.promotion;

    post('sets', set).then(result => {
        post(`sets/${result.id}/promotions`, { id: promotion.id });

        articles.forEach(article => {
            post(`sets/${result.id}/articles`, { id: article.id });
        });
    });
}

export function updateSet({ commit }, set) {
    put(`sets/${set.id}`, set);
}

export function removeSet({ commit }, set) {
    put(`sets/${set.id}`, { isRemoved: true });
}

/**
 * Events actions
 */

export function createEvent({ commit }, event) {
    post('events', event);
}

export function updateEvent({ commit }, event) {
    put(`events/${event.id}`, event);
}

export function removeEvent({ commit }, event) {
    put(`events/${event.id}`, { isRemoved: true });
}
