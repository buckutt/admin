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
    let limit = '&limit=1000';

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

export function loadUserHistory({ state, dispatch }, user) {
    return get(`services/manager/history?buyer=${user.id}`)
        .then((results) => {
            dispatch('clearObject', 'history');
            if (results.history.length > 0) {
                const depth = state.app.focusedElements
                    .findIndex(element => user.id === element.id);

                dispatch('updateFocusedElement', { depth, field: 'credit', value: results.credit });
                dispatch('checkAndAddObjects', { route: 'history', objects: results.history });
            }
            return [];
        });
}

export function cancelTransaction({ state, dispatch }, payload) {
    const transaction = payload.transaction;
    const user        = payload.user;

    return post('services/cancelTransaction?addPendingCardUpdates', transaction)
        .then(() => {
            const currentTransaction = state.objects.history
                .find(h => h.id === transaction.id);

            const newUserCredit = user.credit - currentTransaction.amount;
            const depth         = state.app.focusedElements
                .findIndex(element => user.id === element.id);

            dispatch('updateFocusedElement', { depth, field: 'credit', value: newUserCredit });

            const canceledTransaction      = { ...currentTransaction };
            canceledTransaction.isCanceled = true;
            canceledTransaction.updated_at = new Date();

            return dispatch('checkAndUpdateObjects', {
                route  : 'history',
                objects: [canceledTransaction]
            });
        });
}
