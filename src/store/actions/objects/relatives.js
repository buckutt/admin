import cloneDeep       from 'lodash.clonedeep';
import { post, del }   from '../../../lib/fetch';

export function createRelation({ dispatch, state }, relation) {
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

                    dispatch('updateModObject', {
                        newRelation: obj2.route,
                        value      : obj2Clone
                    });
                }

                if (obj2.value.id === state.app.modObject.id) {
                    const obj1Clone = cloneDeep(obj1.value);

                    dispatch('updateModObject', {
                        newRelation: obj1.route,
                        value      : obj1Clone
                    });
                }
            }
        });
}

export function removeRelation({ dispatch, state }, relation) {
    const obj1 = relation.obj1;
    const obj2 = relation.obj2;

    return del(`${obj1.route}/${obj1.value.id}/${obj2.route}/${obj2.value.id}`)
        .then(() => {
            if (obj1.value.id === state.app.modObject.id) {
                dispatch('removeModObjectRelation', {
                    relation: obj2.route,
                    value   : obj2.value
                });
            }

            if (obj2.value.id === state.app.modObject.id) {
                dispatch('removeModObjectRelation', {
                    relation: obj1.route,
                    value   : obj1.value
                });
            }
        });
}
