import { get, post, put, del } from '../lib/fetch';

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

/**
 * Periods actions
 */

export function createPeriod({ dispatch }, period) {
    post('periods', period).then(periods => {
        dispatch('ADDPERIODS', [period]);
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
