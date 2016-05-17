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

/**
 * Periods actions
 */

export function createPeriod({ dispatch }, period) {
    post('periods', period).then(result => {
        dispatch('ADDPERIODS', [result]);
    });
}

export function updatePeriod({ dispatch }, period, data) {
    put(`periods/${period.id}`, data).then(() => {
        dispatch('UPDATEPERIOD', period, data);
    });
}

export function removePeriod({ dispatch }, period) {
    put(`periods/${period.id}`, { isRemoved: true }).then(() => {
        dispatch('DELETEPERIOD', period);
    });
}


/**
 * Articles actions
 */

export function createArticle({ dispatch }, article) {
    post('articles', article).then(result => {
        dispatch('ADDARTICLES', [result]);
    });
}

export function updateArticle({ dispatch }, article, data) {
    put(`articles/${article.id}`, data).then(() => {
        dispatch('UPDATEARTICLE', article, data);
    });
}

export function removeArticle({ dispatch }, article) {
    put(`articles/${article.id}`, { isRemoved: true }).then(() => {
        dispatch('DELETEARTICLE', article);
    });
}

/**
 * Points actions
 */

export function createPoint({ dispatch }, point) {
    post('points', point).then(result => {
        dispatch('ADDPOINTS', [result]);
    });
}

export function updatePoint({ dispatch }, point, data) {
    put(`points/${point.id}`, data).then(() => {
        dispatch('UPDATEPOINT', point, data);
    });
}

export function removePoint({ dispatch }, point) {
    put(`points/${point.id}`, { isRemoved: true }).then(() => {
        dispatch('DELETEPOINT', point);
    });
}

/**
 * Devices actions
 */

export function updateDevice({ dispatch }, device, data) {
    put(`devices/${device.id}`, data).then(() => {
        dispatch('UPDATEDEVICE', device, data);
    });
}

export function removeDevice({ dispatch }, device) {
    put(`devices/${device.id}`, { isRemoved: true }).then(() => {
        dispatch('DELETEDEVICE', device);
    });
}

/**
 * Groups actions
 */

export function createGroup({ dispatch }, group) {
    post('groups', group).then(result => {
        dispatch('ADDGROUPS', [result]);
    });
}

export function updateGroup({ dispatch }, group, data) {
    put(`groups/${group.id}`, data).then(() => {
        dispatch('UPDATEGROUP', group, data);
    });
}

export function removeGroup({ dispatch }, group) {
    put(`groups/${group.id}`, { isRemoved: true }).then(() => {
        dispatch('DELETEGROUP', group);
    });
}

/**
 * Categories actions
 */

export function createCategory({ dispatch }, category) {
    post('categories', category).then(result => {
        dispatch('ADDCATEGORIES', [result]);
    });
}

export function updateCategory({ dispatch }, category, data) {
    put(`categories/${category.id}`, data).then(() => {
        dispatch('UPDATECATEGORY', category, data);
    });
}

export function removeCategory({ dispatch }, category) {
    put(`categories/${category.id}`, { isRemoved: true }).then(() => {
        dispatch('DELETECATEGORY', category);
    });
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
