import cloneDeep     from 'lodash.clonedeep';
import { post, del } from '../../../lib/fetch';

export function createSimpleRelation({ dispatch, state }, relation) {
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

export function removeSimpleRelation({ dispatch, state }, relation) {
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

export function createMultipleRelation({ dispatch, state }, relation) {
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
