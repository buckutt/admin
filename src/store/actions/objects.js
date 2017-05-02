import { get, post, put, del } from '../../lib/fetch';

/**
 * App actions
 */

export function clearAppStore({ commit }) {
    commit('CLEARAPPSTORE');
}

export function clearObject({ commit }, route) {
    commit('CLEAROBJECT', route);
}

export function expandObject({ commit, dispatch }, object) {
    let embed = '';
    if (config.relations[object.route]) {
        embed = `?embed=${encodeURIComponent(JSON.stringify(config.relations[object.route]))}`;
    }

    return new Promise((resolve, reject) => {
        get(`${object.route}/${object.value.id}${embed}`).then((result) => {
            if (config.relations[object.route]) {
                Object.keys(config.relations[object.route]).forEach((key) => {
                    result[key] = result[key].filter(rel => !rel.isRemoved);
                });
            }

            dispatch('checkAndUpdateObject', { route: object.route, object: result });
            commit('UPDATEMODOBJECT', result);

            resolve(result);
        })
        .catch((err) => {
            commit('UPDATEAPIERROR', err);
            reject(err);
        });
    });
}

export function checkAndAddObjects({ commit, state }, data) {
    if (state.objects[data.route]) {
        const objectsToAdd = data.objects.map((object) => {
            if (state.objects[data.route].findIndex(o => (o.id === object.id)) === -1) {
                return object;
            }
            return null;
        }).filter(a => a);

        commit('ADDOBJECTS', { route: data.route, objects: objectsToAdd });
    }
}

export function checkAndUpdateObject({ commit, state }, data) {
    if (state.objects[data.route]) {
        const index = state.objects[data.route].findIndex(o => (o.id === data.object.id));
        if (index !== -1) {
            if (state.objects[data.route][index].editedAt !== data.object.editedAt) {
                commit('UPDATEOBJECT', data);
            }
        }
    }
}

export function checkAndDeleteObject({ commit, state }, data) {
    if (state.objects[data.route]) {
        if (state.objects[data.route].findIndex(o => (o.id === data.object.id)) !== -1) {
            commit('DELETEOBJECT', data);
        }
    }
}

export function fetchObjects({ commit, dispatch }, route) {
    get(route.toLowerCase()).then((results) => {
        dispatch('checkAndAddObjects', { route, objects: results });
    })
    .catch((err) => {
        commit('UPDATEAPIERROR', err);
    });
}

export function createObject({ commit, dispatch, state }, object) {
    post(object.route.toLowerCase(), object.value).then((result) => {
        if (state.objects[object.route]) {
            dispatch('checkAndAddObjects', { route: object.route, objects: [result] });
        }

        if (state.app.modObject) {
            if (state.app.modObject[object.route]) {
                dispatch('updateModObject', {
                    newRelation: object.route,
                    value      : result
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
        if (result.isRemoved) {
            dispatch('checkAndDeleteObject', { route: object.route, object: result });
        } else {
            dispatch('checkAndUpdateObject', { route: object.route, object: result });
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
        dispatch('checkAndDeleteObject', { route: object.route, object: result });

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
                    newRelation: relation.obj2.route,
                    value      : relation.obj2.value
                });
            }

            if (relation.obj2.value.id === state.app.modObject.id) {
                dispatch('updateModObject', {
                    newRelation: relation.obj1.route,
                    value      : relation.obj1.value
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
                    newRelation: relation.relation.route,
                    value      : firstObject
                });
            } else if (state.app.modObject[relation.relation.route]) {
                const objectIds = Object.values(firstObject);
                if (objectIds.indexOf(state.app.modObject.id) > -1) {
                    firstObject[relation.obj.route].push(relation.obj.value);
                    dispatch('updateModObject', {
                        newRelation: relation.relation.route,
                        value      : firstObject
                    });
                }
            }

            commit('UPDATENOTIFY', { message: 'L\'objet a bien été créé.' });
        })
        .catch((err) => {
            commit('UPDATEAPIERROR', err);
        });
}
