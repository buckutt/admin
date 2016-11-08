import { get, post, put } from '../lib/fetch';

const q = obj => encodeURIComponent(JSON.stringify(obj));

/**
 * App actions
 */

export function fetchPoints({ dispatch }) {
    get('points').then(points => {
        dispatch('ADDPOINTS', points);
    });
}

export function fetchDevices({ dispatch }) {
    get('devices').then(devices => {
        dispatch('ADDDEVICES', devices);
    });
}

export function fetchPeriods({ dispatch }) {
    get('periods').then(periods => {
        dispatch('ADDPERIODS', periods);
    });
}

export function fetchArticles({ dispatch }) {
    get('articles').then(articles => {
        dispatch('ADDARTICLES', articles);
    });
}

export function fetchFundations({ dispatch }) {
    get('fundations').then(fundations => {
        dispatch('ADDFUNDATIONS', fundations);
    });
}

export function fetchGroups({ dispatch }) {
    get('groups').then(groups => {
        dispatch('ADDGROUPS', groups);
    });
}

export function fetchCategories({ dispatch }) {
    get('categories').then(categories => {
        dispatch('ADDCATEGORIES', categories);
    });
}

export function fetchPromotions({ dispatch }) {
    get('promotions').then(promotions => {
        dispatch('ADDPROMOTIONS', promotions);
    });
}

export function fetchSets({ dispatch }) {
    get('sets').then(sets => {
        dispatch('ADDSETS', sets);
    });
}

export function fetchEvents({ dispatch }) {
    get('events').then(events => {
        dispatch('ADDEVENTS', events);
    });
}

/**
 * SSE actions
 */

const modelToDispatch = {
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

export function listenChanges({ dispatch }, token, models) {
    const modelsString = models.join(',');

    const es = new EventSource(`https://localhost:3000/changes?models=${modelsString}&authorization=Bearer ${token}`, {
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
                    dispatch(modelToDispatch[data.model].add, [data.doc]);
                    break;
                case 'update':
                    if (data.doc.isRemoved) {
                        dispatch(modelToDispatch[data.model].delete, data.doc);
                    }
                    dispatch(modelToDispatch[data.model].update, data.from, data.doc);
                    break;
                case 'delete':
                    dispatch(modelToDispatch[data.model].delete, data.doc);
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

export function createPeriod({ dispatch }, period) {
    post('periods', period);
}

export function updatePeriod({ dispatch }, period, data) {
    put(`periods/${period.id}`, data);
}

export function removePeriod({ dispatch }, period) {
    put(`periods/${period.id}`, { isRemoved: true });
}


/**
 * Articles actions
 */

export function createArticle({ dispatch }, article) {
    post('articles', article);
}

export function updateArticle({ dispatch }, article, data) {
    put(`articles/${article.id}`, data);
}

export function removeArticle({ dispatch }, article) {
    put(`articles/${article.id}`, { isRemoved: true });
}

/**
 * Points actions
 */

export function createPoint({ dispatch }, point) {
    post('points', point);
}

export function updatePoint({ dispatch }, point, data) {
    put(`points/${point.id}`, data);
}

export function removePoint({ dispatch }, point) {
    put(`points/${point.id}`, { isRemoved: true });
}

/**
 * Devices actions
 */

export function updateDevice({ dispatch }, device, data) {
    put(`devices/${device.id}`, data);
}

export function removeDevice({ dispatch }, device) {
    put(`devices/${device.id}`, { isRemoved: true });
}

/**
 * Groups actions
 */

export function createGroup({ dispatch }, group) {
    post('groups', group);
}

export function updateGroup({ dispatch }, group, data) {
    put(`groups/${group.id}`, data);
}

export function removeGroup({ dispatch }, group) {
    put(`groups/${group.id}`, { isRemoved: true });
}

/**
 * Categories actions
 */

export function createCategory({ dispatch }, category) {
    post('categories', category);
}

export function updateCategory({ dispatch }, category, data) {
    put(`categories/${category.id}`, data);
}

export function removeCategory({ dispatch }, category) {
    put(`categories/${category.id}`, { isRemoved: true });
}

/**
 * Promotions actions
 */

export function createPromotion({ dispatch }, promotion) {
    post('promotions', promotion);
}

export function updatePromotion({ dispatch }, promotion, data) {
    put(`promotions/${promotion.id}`, data);
}

export function removePromotion({ dispatch }, promotion) {
    put(`promotions/${promotion.id}`, { isRemoved: true });
}

/**
 * Sets actions
 */

export function createSet({ dispatch }, set) {
    post('sets', set);
}

export function createSetWithArticles({ dispatch }, set, articles, promotion) {
    post('sets', set).then(result => {
        post(`sets/${result.id}/promotions`, { id: promotion.id });

        articles.forEach(article => {
            post(`sets/${result.id}/articles`, { id: article.id });
        });
    });
}

export function updateSet({ dispatch }, set, data) {
    put(`sets/${set.id}`, data);
}

export function removeSet({ dispatch }, set) {
    put(`sets/${set.id}`, { isRemoved: true });
}

/**
 * Events actions
 */

export function createEvent({ dispatch }, event) {
    post('events', event);
}

export function updateEvent({ dispatch }, event, data) {
    put(`events/${event.id}`, data);
}

export function removeEvent({ dispatch }, event) {
    put(`events/${event.id}`, { isRemoved: true });
}

/**
 * CardBlock actions
 */
export function searchUser({ dispatch }, name) {
    const qFirstname = {
        field  : 'firstname',
        matches: `.*${name}.*`
    };

    const qLastname = {
        field  : 'lastname',
        matches: `.*${name}.*`
    };

    const e = q({
        meansOfLogin: true
    });

    get(`users/search?q=${q(qFirstname)}&or[]=${q(qLastname)}&embed=${e}`).then(users => {
        dispatch('SEARCHUSER', users);
    });
}

export function blockMOL({ dispatch }, molId, blockOrRestore) {
    put(`meansoflogin/${molId}`, { isRemoved: blockOrRestore }).then(() => {
        dispatch('INVERTMOL', molId);
    });
}

/**
 * Global actions
 */

export function updateCurrentEvent({ dispatch }, currentEvent) {
    dispatch('UPDATECURRENTEVENT', currentEvent);
}

export function updateLogged({ dispatch }, logged) {
    dispatch('UPDATELOGGED', logged);
}

export function updateEditModal({ dispatch }, openEditModal) {
    dispatch('UPDATEEDITMODAL', openEditModal);
}
