/**
 * Global actions
 */

export function updateCurrentEvent({ commit }, currentEvent) {
    commit('UPDATECURRENTEVENT', currentEvent);
}

export function updateLogged({ commit }, logged) {
    commit('UPDATELOGGED', logged);
}

export function updateEditModal({ commit }, openEditModal) {
    commit('UPDATEEDITMODAL', openEditModal);
}
