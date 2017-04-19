/**
 * Notifications actions
 */

export function notify({ commit }, message) {
    commit('UPDATENOTIFY', message);
}

export function showApiError({ commit }, apiError) {
    commit('UPDATEAPIERROR', apiError);
}

export function showClientError({ commit }, clientError) {
    commit('UPDATECLIENTERROR', clientError);
}
