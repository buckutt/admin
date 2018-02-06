import lodget      from 'lodash.get';
import lodset      from 'lodash.set';
import cloneDeep   from 'lodash.clonedeep';
import pathToRoute from '../../../lib/pathToRoute';

/**
 * FocusedElements actions
 */

export function updateDeepestFocusedElement({ state, dispatch }, payload) {
    const depth = state.app.focusedElements.length - 1;
    dispatch('updateFocusedElement', {
        ...payload,
        depth
    });
}

export function updateFocusedElement({ state, dispatch }, payload) {
    const focusedElement = cloneDeep(state.app.focusedElements[payload.depth]);

    // Relation update
    if (payload.relation) {
        const relations = lodget(focusedElement, payload.relation);
        const index     = relations
            .findIndex(o => o.id === payload.value.id);

        if (index !== -1) {
            relations[index] = payload.value;
            lodset(focusedElement, payload.relation, relations);
        }
    } else if (payload.newRelation) {
        lodget(focusedElement, payload.newRelation).push(payload.value);
    } else if (payload.delRelation) {
        console.log(payload.delRelation);
        const index = lodget(focusedElement, payload.delRelation)
            .findIndex(o => o.id === payload.value.id);

        lodget(focusedElement, payload.delRelation).splice(index, 1);
    } else {
        lodset(focusedElement, payload.field, payload.value);
    }

    dispatch('saveFocusedElement', {
        depth: payload.depth,
        value: focusedElement
    });
}

export function saveFocusedElement({ state, commit, dispatch }, payload) {
    commit('UPDATEFOCUSEDELEMENT', payload);

    // Echoes changes to the store (can be redundant if it's called by management functions)
    const params = Object.keys(state.route.params);
    dispatch('checkAndUpdateObjects', {
        forceUpdate: true,
        route      : pathToRoute(params[payload.depth]),
        objects    : [payload.value]
    });

    if (payload.depth > 0) {
        const nextDepth   = payload.depth - 1;
        const nextElement = cloneDeep(state.app.focusedElements[nextDepth]);
        let nextKey;

        Object.keys(nextElement)
            .filter(key => nextElement[key] && (typeof nextElement[key] === 'object'))
            .forEach((key) => {
                if (Array.isArray(nextElement[key])) {
                    const index = nextElement[key]
                        .findIndex(element => element.id === payload.value.id);

                    if (index > -1) {
                        nextKey = `${key}[${index}]`;
                    }
                } else if (nextElement[key].id) {
                    if (nextElement[key].id === payload.value.id) {
                        nextKey = key;
                    }
                }
            });

        if (nextKey) {
            lodset(nextElement, nextKey, payload.value);

            dispatch('saveFocusedElement', {
                depth: nextDepth,
                value: nextElement
            });
        }
    }
}

export function clearFocusedElements({ commit }) {
    commit('CLEARFOCUSEDELEMENTS');
}

export function syncFocusedElement({ dispatch, commit }, payload) {
    return dispatch('retrieveObject', payload)
        .then(result =>
            commit('UPDATEFOCUSEDELEMENT', {
                depth: payload.depth,
                value: result
            }));
}

export function loadFocusedElement({ state, dispatch, commit }, payload) {
    const storedElement = state.objects[payload.route]
        .find(object => payload.id === object.id);

    if (storedElement) {
        commit('UPDATEFOCUSEDELEMENT', {
            depth: payload.depth,
            value: cloneDeep(storedElement)
        });

        dispatch('syncFocusedElement', payload);
        return Promise.resolve(storedElement);
    }

    return dispatch('syncFocusedElement', payload);
}

export function loadFocusedElements({ dispatch, commit }, params) {
    commit('TRIMFOCUSEDELEMENTS', params.length);

    const loadPromises = Object.keys(params)
        .map((key, index) =>
            dispatch('loadFocusedElement', {
                depth: index,
                route: pathToRoute(key),
                id   : params[key]
            }));

    return Promise.all(loadPromises);
}
