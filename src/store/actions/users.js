import { get, post } from '../../lib/fetch';

/**
 * Users actions
 */

export function createUserWithMol({ dispatch, state }, user) {
    let createdUser;

    return post('users', user)
        .then((result) => {
            if (result.mail) {
                post('meansoflogin', { type: 'etuMail', data: result.mail, user_id: result.id });
            }

            dispatch('checkAndAddObjects', { route: 'users', objects: [result] });

            return result;
        })
        .then((newUser) => {
            createdUser = newUser;

            return dispatch('createObject', {
                route: 'memberships',
                value: {
                    user_id  : createdUser.id,
                    group_id : state.app.currentEvent.defaultGroup_id,
                    period_id: state.app.currentEvent.defaultPeriod_id
                }
            });
        })
        .then(() => createdUser);
}

export function searchUsers({ dispatch }, name) {
    let limit = '';

    if (name.length <= 2) {
        limit = '&limit=10';
    }

    return get(`services/manager/searchuser?name=${name}${limit}`)
        .then((results) => {
            dispatch('clearObject', 'users');
            if (results.length > 0) {
                dispatch('checkAndAddObjects', { route: 'users', objects: results });
            }
            return [];
        });
}

export function loadCurrentUserHistory({ state, dispatch }) {
    return get(`services/manager/history?buyer=${state.app.modObject.id}`)
        .then((results) => {
            dispatch('clearObject', 'history');
            if (results.length > 0) {
                dispatch('checkAndAddObjects', { route: 'history', objects: results });
            }
            return [];
        });
}

export function cancelTransaction({ state, dispatch }, transaction) {
    return post('services/cancelTransaction', transaction)
        .then(() => {
            const currentTransaction = state.objects.history
                .find(h => h.id === transaction.id);

            const canceledTransaction      = { ...currentTransaction };
            canceledTransaction.isCanceled = true;
            canceledTransaction.updated_at = new Date();

            return dispatch('checkAndUpdateObjects', {
                route  : 'history',
                objects: [canceledTransaction]
            });
        });
}
