import { get, post, put, del } from '../../lib/fetch';
import { modelTocommit }       from '../../lib/storeUtils.js';

/**
 * App actions
 */

export function clearAppStore({ commit }) {
    commit('CLEARAPPSTORE');
}

export function clearModObject({ commit }) {
    commit('CLEARMODOBJECT');
}

export function updateModObject({ commit }, payload) {
    if (payload.relation) {
        commit('UPDATEMODOBJECTRELATION', payload);
    } else {
        commit('UPDATEMODOBJECTFIELD', payload);
    }
}

export function removeRelation({ commit }, payload) {
    commit('REMOVEMODOBJECTRELATION', payload);
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
    });
}

export function fetchObjects({ commit }, route) {
    get(route.toLowerCase()).then((results) => {
        commit(modelTocommit[route].add, results);
    });
}

export function createObject({ commit, state }, object) {
    post(object.route.toLowerCase(), object.value).then((result) => {
        if (state.app[object.route].findIndex(o => (o.id === result.id)) === -1) {
            commit(modelTocommit[object.route].add, [result]);
        }
    });
}

export function updateObject({ commit, state }, object) {
    put(`${object.route.toLowerCase()}/${object.value.id}`, object.value).then((result) => {
        const index = state.app[object.route].findIndex(o => (o.id === result.id));

        if (index !== -1) {
            if (result.isRemoved) {
                commit(modelTocommit[object.route].delete, result);
            } else if (state.app[object.route][index].editedAt !== result.editedAt) {
                commit(modelTocommit[object.route].update, result);
            }
        }
    });
}

export function removeObject({ commit, state }, object) {
    put(`${object.route.toLowerCase()}/${object.value.id}`, { isRemoved: true }).then((result) => {
        if (state.app[object.route]) {
            if (state.app[object.route].findIndex(o => (o.id === result.id)) !== -1) {
                commit(modelTocommit[object.route].delete, result);
            }
        }

        if (state.app.modObject) {
            if (state.app.modObject[object.route]) {
                removeRelation({ commit }, {
                    relation: object.route,
                    value   : object.value
                });
            }
        }
    });
}

export function createSimpleRelation({ commit, state }, relation) {
    post(`${relation.obj1.route}/${relation.obj1.value.id}/${relation.obj2.route}`, { id: relation.obj2.value.id })
        .then(() => {
            if (relation.obj1.value.id === state.app.modObject.id) {
                updateModObject({ commit }, {
                    relation: relation.obj2.route,
                    value   : relation.obj2.value
                });
            }

            if (relation.obj2.value.id === state.app.modObject.id) {
                updateModObject({ commit }, {
                    relation: relation.obj1.route,
                    value   : relation.obj1.value
                });
            }
        });
}

export function removeSimpleRelation({ commit, state }, relation) {
    del(`${relation.obj1.route}/${relation.obj1.value.id}/${relation.obj2.route}/${relation.obj2.value.id}`)
        .then(() => {
            if (relation.obj1.value.id === state.app.modObject.id) {
                removeRelation({ commit }, {
                    relation: relation.obj2.route,
                    value   : relation.obj2.value
                });
            }

            if (relation.obj2.value.id === state.app.modObject.id) {
                removeRelation({ commit }, {
                    relation: relation.obj1.route,
                    value   : relation.obj1.value
                });
            }
        });
}

export function createMultipleRelation({ commit, state }, relation) {
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
                updateModObject({ commit }, {
                    relation: relation.relation.route,
                    value   : firstObject
                });
            }
        });
}

/**
 * Sets actions
 */

export function createSetWithArticles({ commit, state }, payload) {
    const set       = payload.set;
    const articles  = payload.articles;
    const promotion = payload.promotion;

    post('sets', set).then((result) => {
        if (state.app.sets.findIndex(object => (object.id === result.id)) === -1) {
            commit('ADDSETS', [result]);
        }

        post(`sets/${result.id}/promotions`, { id: promotion.id });

        articles.forEach((article) => {
            post(`sets/${result.id}/articles`, { id: article.id });
        });
    });
}

/**
 * Users actions
 */

export function createUserWithMol({ commit }, user) {
    post('users', user)
        .then((result) => {
            if (result.mail) {
                post('meansoflogin', { type: 'etuMail', data: result.mail, User_id: result.id });
            }

            commit('ADDUSERS', [result]);
        });
}

export function searchUsers({ commit }, name) {
    get(`services/manager/searchuser?name=${name}`)
        .then((results) => {
            if (results.length > 0) {
                const q = [];

                results.forEach((result) => {
                    q.push(JSON.stringify({
                        field: 'id',
                        eq   : result.id
                    }));
                });

                const orQ = q
                    .map(o => encodeURIComponent(o))
                    .join('&q[]=');

                return get(`users/search?q=${orQ}&embed=${encodeURIComponent(JSON.stringify(config.relations.users))}`);
            }
        })
        .then((results) => {
            commit('CLEARUSERS');
            commit('ADDUSERS', results.map((result) => {
                Object.keys(config.relations.users).forEach((key) => {
                    result[key] = result[key].filter(rel => !rel.isRemoved);
                });

                return result;
            }));
        });
}

/**
 * Purchases actions
 */

export function getPurchases({ commit }, fields) {
    const q = [];

    q.push(`event=${fields.event}`);

    if (fields.point) {
        q.push(`point=${fields.point}`);
    }

    if (fields.fundation) {
        q.push(`fundation=${fields.fundation}`);
    }

    if (fields.period) {
        q.push(`period=${fields.period}`);
    } else {
        if (fields.dateIn) {
            q.push(`dateIn=${fields.dateIn}`);
        }

        if (fields.dateOut) {
            q.push(`dateOut=${fields.dateOut}`);
        }
    }

    const qString = q
        .join('&');

    get(`services/treasury/purchases?${qString}`)
        .then((purchases) => {
            commit('CLEARPURCHASES');
            commit('ADDPURCHASES', purchases.map((purchase) => {
                if (!purchase.totalWT) {
                    purchase.totalWT = purchase.totalVAT;
                }

                return purchase;
            }));
        });
}

/**
 * Treasury actions
 */

export function getTreasury({ commit }, fields) {
    const q  = [];
    const qt = [];

    if (fields.point) {
        q.push(`point=${fields.point}`);

        qt.push(JSON.stringify({
            field: 'Point_id',
            eq   : fields.point
        }));
    }

    if (fields.dateIn) {
        q.push(`dateIn=${fields.dateIn}`);

        qt.push(JSON.stringify({
            field: 'createdAt',
            ge   : fields.dateIn,
            date : true
        }));
    }

    if (fields.dateOut) {
        q.push(`dateOut=${fields.dateOut}`);

        qt.push(JSON.stringify({
            field: 'createdAt',
            le   : fields.dateOut,
            date : true
        }));
    }

    const qString = q
        .join('&');

    const orQt = qt
        .map(o => encodeURIComponent(o))
        .join('&q[]=');

    get(`services/treasury/reloads?${qString}`)
        .then((reloads) => {
            commit('CLEARRELOADS');
            commit('ADDRELOADS', reloads);

            const relEmbed = encodeURIComponent(JSON.stringify(config.relations.transfers));

            return get(`transfers/search?q=${orQt}&embed=${relEmbed}`);
        })
        .then((transfers) => {
            commit('CLEARTRANSFERS');
            commit('ADDTRANSFERS', transfers.filter(t => !t.isRemoved));
        });
}
