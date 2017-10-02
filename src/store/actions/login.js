import { post, updateBearer } from '../../lib/fetch';
import { isAdmin }            from '../../lib/isAdmin.js';

/**
 * Home actions
 */

export function login({ commit, dispatch }, credentials) {
    return post('services/login', credentials)
        .then((result) => {
            if (!isAdmin(result.user)) {
                return Promise.reject({ statusText: 'You are not administrator' });
            }

            sessionStorage.setItem('user', JSON.stringify(result.user));
            sessionStorage.setItem('token', result.token);

            commit('UPDATELOGGEDUSER', result.user);

            updateBearer(result.token);

            dispatch('load');
        });
}
