import { get, post, put, del } from '../../lib/fetch';
import { modelTocommit }       from '../../lib/storeUtils.js';

/**
 * App actions
 */

export function clearAppStore({ commit }) {
    commit('CLEARAPPSTORE');
}

export function clearObject({ commit }, route) {
    commit(modelTocommit[route].clear);
}

export function expandObject({ commit }, object) {
    let embed = '';
    if (config.relations[object.route]) {
        embed = `?embed=${encodeURIComponent(JSON.stringify(config.relations[object.route]))}`;
    }

    get(`${object.route}/${object.value.id}${embed}`).then((result) => {
        if (config.relations[object.route]) {
            Object.keys(config.relations[object.route]).forEach((key) => {
                result[key] = result[key].filter(rel => !rel.isRemoved);
            });
        }

        commit(modelTocommit[object.route].update, result);
        commit('UPDATEMODOBJECT', result);
    })
    .catch((err) => {
        commit('UPDATEAPIERROR', err);
    });
}

export function fetchObjects({ commit }, route) {
    get(route.toLowerCase()).then((results) => {
        commit(modelTocommit[route].add, results);
    })
    .catch((err) => {
        commit('UPDATEAPIERROR', err);
    });
}

export function createObject({ commit, dispatch, state }, object) {
    post(object.route.toLowerCase(), object.value).then((result) => {
        if (state.objects[object.route]) {
            if (state.objects[object.route].findIndex(o => (o.id === result.id)) === -1) {
                commit(modelTocommit[object.route].add, [result]);
            }
        }

        if (state.app.modObject) {
            if (state.app.modObject[object.route]) {
                dispatch('updateModObject', {
                    relation: object.route,
                    value   : result
                });
            }
        }

        commit('UPDATENOTIFY', { message: 'L\'objet a bien été créé.' });
    })
    .catch((err) => {
        commit('UPDATEAPIERROR', err);
    });
}

export function updateObject({ commit, dispatch, state }, object) {
    put(`${object.route.toLowerCase()}/${object.value.id}`, object.value).then((result) => {
        if (state.objects[object.route]) {
            const index = state.objects[object.route].findIndex(o => (o.id === result.id));

            if (index !== -1) {
                if (result.isRemoved) {
                    commit(modelTocommit[object.route].delete, result);
                } else if (state.objects[object.route][index].editedAt !== result.editedAt) {
                    commit(modelTocommit[object.route].update, result);
                }
            }
        }

        if (state.app.modObject) {
            if (state.app.modObject[object.route]) {
                dispatch('updateModObject', {
                    relation: object.route,
                    value   : result
                });
            }
        }

        commit('UPDATENOTIFY', { message: 'L\'objet a bien été modifié.' });
    })
    .catch((err) => {
        commit('UPDATEAPIERROR', err);
    });
}

export function removeObject({ commit, dispatch, state }, object) {
    put(`${object.route.toLowerCase()}/${object.value.id}`, { isRemoved: true }).then((result) => {
        if (state.objects[object.route]) {
            if (state.objects[object.route].findIndex(o => (o.id === result.id)) !== -1) {
                commit(modelTocommit[object.route].delete, result);
            }
        }

        if (state.app.modObject) {
            if (state.app.modObject[object.route]) {
                dispatch('removeModObjectRelation', {
                    relation: object.route,
                    value   : object.value
                });
            }
        }

        commit('UPDATENOTIFY', { message: 'L\'objet a bien été supprimé.' });
    })
    .catch((err) => {
        commit('UPDATEAPIERROR', err);
    });
}

export function createSimpleRelation({ commit, dispatch, state }, relation) {
    post(`${relation.obj1.route}/${relation.obj1.value.id}/${relation.obj2.route}`, { id: relation.obj2.value.id })
        .then(() => {
            if (relation.obj1.value.id === state.app.modObject.id) {
                dispatch('updateModObject', {
                    relation: relation.obj2.route,
                    value   : relation.obj2.value
                });
            }

            if (relation.obj2.value.id === state.app.modObject.id) {
                dispatch('updateModObject', {
                    relation: relation.obj1.route,
                    value   : relation.obj1.value
                });
            }

            commit('UPDATENOTIFY', { message: 'L\'objet a bien été créé.' });
        })
        .catch((err) => {
            commit('UPDATEAPIERROR', err);
        });
}

export function removeSimpleRelation({ commit, dispatch, state }, relation) {
    del(`${relation.obj1.route}/${relation.obj1.value.id}/${relation.obj2.route}/${relation.obj2.value.id}`)
        .then(() => {
            if (relation.obj1.value.id === state.app.modObject.id) {
                dispatch('removeModObjectRelation', {
                    relation: relation.obj2.route,
                    value   : relation.obj2.value
                });
            }

            if (relation.obj2.value.id === state.app.modObject.id) {
                dispatch('removeModObjectRelation', {
                    relation: relation.obj1.route,
                    value   : relation.obj1.value
                });
            }

            commit('UPDATENOTIFY', { message: 'L\'objet a bien été supprimé.' });
        })
        .catch((err) => {
            commit('UPDATEAPIERROR', err);
        });
}

export function createMultipleRelation({ commit, dispatch, state }, relation) {
    let embed = '';
    if (config.relations[relation.relation.route]) {
        embed = `?embed=${encodeURIComponent(JSON.stringify(config.relations[relation.relation.route]))}`;
    }

    let firstObject  = {};
    post(`${relation.relation.route.toLowerCase()}${embed}`, relation.relation.fields)
        .then((result) => {
            firstObject = result;
            return post(`${relation.obj.route}/${relation.obj.value.id}/${relation.relation.route}`, { id: result.id });
        })
        .then(() => {
            if (relation.obj.value.id === state.app.modObject.id) {
                dispatch('updateModObject', {
                    relation: relation.relation.route,
                    value   : firstObject
                });
            }

            commit('UPDATENOTIFY', { message: 'L\'objet a bien été créé.' });
        })
        .catch((err) => {
            commit('UPDATEAPIERROR', err);
        });
}
