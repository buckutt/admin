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
    return get(`services/manager/searchuser?name=${name}`)
        .then((results) => {
            dispatch('clearObject', 'users');
            if (results.length > 0) {
                dispatch('checkAndAddObjects', { route: 'users', objects: results });
            }
            return [];
        });
}
