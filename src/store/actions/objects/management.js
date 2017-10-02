import { post, put } from '../../../lib/fetch';

/**
 * App actions
 */

export function clearAppStore({ commit }) {
    commit('CLEARAPPSTORE');
}

export function clearObject({ commit }, route) {
    commit('CLEAROBJECT', route);
}

export function checkAndAddObjects({ commit, dispatch, state }, data) {
    if (state.objects[data.route]) {
        const objectsToAdd = data.objects
            .filter(object => (state.objects[data.route].findIndex(o => (o.id === object.id)) === -1));

        if (objectsToAdd.length > 0) {
            commit('ADDOBJECTS', { route: data.route, objects: objectsToAdd });
        }

        dispatch('checkAndUpdateObjects', {
            route  : data.route,
            objects: data.objects
                .filter(object => (state.objects[data.route].findIndex(o => (o.id === object.id)) !== -1)),
            forceUpdate: true
        });
    }
}

export function checkAndUpdateObjects({ commit, state }, data) {
    if (state.objects[data.route]) {
        const objects = data.objects.filter((object) => {
            const foundObject = state.objects[data.route].find(o => (o.id === object.id));
            if (foundObject) {
                return (foundObject.editedAt !== object.editedAt ||
                    (data.forceUpdate && JSON.stringify(foundObject) !== JSON.stringify(object)));
            }

            return false;
        });

        if (objects.length > 0) {
            commit('UPDATEOBJECTS', { route: data.route, objects });
        }
    }
}

export function checkAndDeleteObjects({ commit, dispatch, state }, data) {
    if (state.objects[data.route]) {
        const objects = data.objects
            .filter(object => state.objects[data.route].find(o => (o.id === object.id)));

        if (data.route === 'events' && state.app.currentEvent) {
            if (objects.find(o => state.app.currentEvent.id === o.id)) {
                dispatch('unselectCurrentEvent');
            }
        }

        if (objects.length > 0) {
            commit('DELETEOBJECTS', { route: data.route, objects });
        }
    }
}

export function createObject({ dispatch, state }, object) {
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

export function updateObject({ dispatch, state }, object) {
    return put(`${object.route.toLowerCase()}/${object.value.id}`, object.value).then((result) => {
        if (result.isRemoved) {
            dispatch('checkAndDeleteObjects', { route: object.route, objects: [result] });
        } else {
            dispatch('checkAndUpdateObjects', { route: object.route, objects: [result] });
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

export function removeObject({ dispatch, state }, object) {
    return put(`${object.route.toLowerCase()}/${object.value.id}`, { isRemoved: true }).then((result) => {
        dispatch('checkAndDeleteObjects', { route: object.route, objects: [result] });

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
