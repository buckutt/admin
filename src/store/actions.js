import { get, post, put, del } from '../lib/fetch';

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

export function createPeriod({ dispatch }, period) {
    post('periods', period).then(periods => {
        dispatch('ADDPERIODS', [period]);
    });
}

export function updatePeriod({ dispatch }, period, data) {
    put(`periods/${period.id}`, data).then(periods => {
        dispatch('UPDATEPERIOD', period, data);
    });
}

export function removePeriod({ dispatch }, period) {
    put(`periods/${period.id}`, {isRemoved: true}).then(periods => {
        dispatch('DELETEPERIOD', period);
    });
}
