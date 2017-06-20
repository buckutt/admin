import cloneDeep               from 'lodash.clonedeep';
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

export function expandObject({ commit, dispatch, state }, object) {
    let embed = '';
    if (config.relations[object.route]) {
        embed = `?embed=${encodeURIComponent(JSON.stringify(config.relations[object.route]))}`;
    }

    return get(`${object.route}/${object.value.id}${embed}`)
        .then((result) => {
            if (config.relations[object.route]) {
                Object.keys(config.relations[object.route]).forEach((key) => {
                    if (Array.isArray(result[key])) {
                        result[key] = result[key].filter(rel => !rel.isRemoved);
                    }
                });
            }

            if (object.route === 'events' && state.app.currentEvent) {
                if (state.app.currentEvent.id === object.value.id) {
                    dispatch('updateCurrentEvent', result);
                }
            }

            dispatch('checkAndUpdateObject', { route: object.route, object: result });
            if (result._data) {
                delete result._data;
            }
            commit('UPDATEMODOBJECT', result);

            return result;
        });
}

export function checkAndAddObjects({ commit, state }, data) {
    if (state.objects[data.route]) {
        const objectsToAdd = data.objects
            .filter(object => (state.objects[data.route].findIndex(o => (o.id === object.id)) === -1));

        commit('ADDOBJECTS', { route: data.route, objects: objectsToAdd });
    }
}

export function checkAndUpdateObject({ commit, dispatch, state }, data) {
    if (state.objects[data.route]) {
        const index = state.objects[data.route].findIndex(o => (o.id === data.object.id));
        if (index !== -1) {
            if (state.objects[data.route][index].editedAt !== data.object.editedAt) {
                commit('UPDATEOBJECT', data);
            }
        }
    }
}

export function checkAndDeleteObject({ commit, dispatch, state }, data) {
    if (state.objects[data.route]) {
        if (state.objects[data.route].findIndex(o => (o.id === data.object.id)) !== -1) {
            if (data.route === 'events' && state.app.currentEvent) {
                if (state.app.currentEvent.id === data.object.id) {
                    dispatch('unselectCurrentEvent');
                }
            }
            commit('DELETEOBJECT', data);
        }
    }
}

export function fetchObjects({ commit, dispatch }, route) {
    return get(route.toLowerCase())
        .then((results) => {
            dispatch('checkAndAddObjects', { route, objects: results });
        });
}

export function createObject({ commit, dispatch, state }, object) {
    return post(object.route.toLowerCase(), object.value).then((result) => {
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

        return result;
    });
}

export function updateObject({ commit, dispatch, state }, object) {
    return put(`${object.route.toLowerCase()}/${object.value.id}`, object.value).then((result) => {
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

        return result;
    });
}

export function removeObject({ commit, dispatch, state }, object) {
    return put(`${object.route.toLowerCase()}/${object.value.id}`, { isRemoved: true }).then((result) => {
        dispatch('checkAndDeleteObject', { route: object.route, object: result });

        if (state.app.modObject) {
            if (state.app.modObject[object.route]) {
                dispatch('removeModObjectRelation', {
                    relation: object.route,
                    value   : object.value
                });
            }
        }

        return result;
    });
}

export function createSimpleRelation({ commit, dispatch, state }, relation) {
    const body = {};
    if (relation.through) {
        body[relation.through.field] = relation.through.value.id;
    }

    const obj1 = relation.obj1;
    const obj2 = relation.obj2;

    return post(`${obj1.route}/${obj1.value.id}/${obj2.route}/${obj2.value.id}`, body)
        .then(() => {
            if (state.app.modObject) {
                if (obj1.value.id === state.app.modObject.id) {
                    const obj2Clone = cloneDeep(obj2.value);
                    if (relation.through) {
                        obj2Clone._through                         = {};
                        obj2Clone._through[relation.through.field] = relation.through.value.id;
                        obj2Clone._through[relation.through.obj]   = relation.through.value;
                    }

                    dispatch('updateModObject', {
                        newRelation: obj2.route,
                        value      : obj2Clone
                    });
                }

                if (obj2.value.id === state.app.modObject.id) {
                    const obj1Clone = cloneDeep(obj1.value);
                    if (relation.through) {
                        obj1Clone._through                         = {};
                        obj1Clone._through[relation.through.field] = relation.through.value.id;
                        obj1Clone._through[relation.through.obj]   = relation.through.value;
                    }

                    dispatch('updateModObject', {
                        newRelation: obj1.route,
                        value      : obj1Clone
                    });
                }
            }
        });
}

export function removeSimpleRelation({ commit, dispatch, state }, relation) {
    let filter = '';
    if (relation.through) {
        const jsonFilter                   = {};
        jsonFilter[relation.through.field] = relation.through.value.id;
        filter                             = `?filter=${encodeURIComponent(JSON.stringify(jsonFilter))}`;
    }

    const obj1 = relation.obj1;
    const obj2 = relation.obj2;

    return del(`${obj1.route}/${obj1.value.id}/${obj2.route}/${obj2.value.id}${filter}`)
        .then(() => {
            if (obj1.value.id === state.app.modObject.id) {
                dispatch('removeModObjectRelation', {
                    relation: obj2.route,
                    value   : obj2.value,
                    through : relation.through
                });
            }

            if (obj2.value.id === state.app.modObject.id) {
                dispatch('removeModObjectRelation', {
                    relation: obj1.route,
                    value   : obj1.value,
                    through : relation.through
                });
            }
        });
}

export function createMultipleRelation({ commit, dispatch, state }, relation) {
    let embed = '';
    if (config.relations[relation.relation.route]) {
        embed = `?embed=${encodeURIComponent(JSON.stringify(config.relations[relation.relation.route]))}`;
    }

    let firstObject  = {};

    return post(`${relation.relation.route.toLowerCase()}${embed}`, relation.relation.fields)
        .then((result) => {
            firstObject = result;
            return post(`${relation.obj.route}/${relation.obj.value.id}/${relation.relation.route}/${result.id}`);
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
        });
}
