import { get, post, updateBearer } from '../../lib/fetch';
import { isAdmin }                 from '../../lib/isAdmin.js';

/**
 * Sets actions
 */

export function createSetWithArticles({ commit, dispatch, state }, payload) {
    const set       = payload.set;
    const articles  = payload.articles;
    const promotion = payload.promotion;

    return post('sets', set)
        .then((result) => {
            dispatch('checkAndAddObjects', { route: 'sets', objects: [result] });

            post(`sets/${result.id}/promotions/${promotion.id}`)
                .catch((err) => {
                    commit('UPDATEAPIERROR', err);
                });

            articles.forEach((article) => {
                post(`sets/${result.id}/articles/${article.id}`);
            });

            dispatch('updateModObject', {
                newRelation: 'sets',
                value      : {
                    id  : result.id,
                    name: set.name,
                    articles
                }
            });
        });
}

export function addArticleToSet({ commit, dispatch, state }, payload) {
    const index = state.app.modObject.sets.findIndex(s => (s.id === payload.set.id));

    dispatch('updateModObject', {
        newRelation: `sets[${index}].articles`,
        value      : payload.article
    });

    return dispatch('createSimpleRelation', {
        obj1: {
            route: 'sets',
            value: payload.set
        },
        obj2: {
            route: 'articles',
            value: payload.article
        }
    });
}

export function removeArticleFromSet({ commit, dispatch, state }, payload) {
    const index = state.app.modObject.sets.findIndex(s => (s.id === payload.set.id));

    dispatch('removeModObjectRelation', {
        relation: `sets[${index}].articles`,
        value   : payload.article
    });

    return dispatch('removeSimpleRelation', {
        obj1: {
            route: 'sets',
            value: payload.set
        },
        obj2: {
            route: 'articles',
            value: payload.article
        }
    });
}

/**
 * Users actions
 */

export function createUserWithMol({ commit, dispatch, state }, user) {
    let createdUser;

    return post('users', user)
        .then((result) => {
            if (result.mail) {
                post('meansoflogin', { type: 'etuMail', data: result.mail, User_id: result.id });
            }

            dispatch('checkAndAddObjects', { route: 'users', objects: [result] });

            return result;
        })
        .then((newUser) => {
            createdUser = newUser;

            return dispatch('createSimpleRelation', {
                obj1: {
                    route: 'users',
                    value: newUser
                },
                obj2: {
                    route: 'groups',
                    value: state.app.currentEvent.defaultGroup
                },
                through: {
                    obj  : 'period',
                    field: 'Period_id',
                    value: state.app.currentEvent.defaultPeriod
                }
            });
        })
        .then(() => createdUser);
}

export function searchUsers({ commit, dispatch }, name) {
    return get(`services/manager/searchuser?name=${name}`)
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
                    .join('&or[]=');

                return get(`users/search?q=${orQ}&embed=${encodeURIComponent(JSON.stringify(config.relations.users))}`);
            }
            return [];
        })
        .then((results) => {
            commit('CLEAROBJECT', 'users');
            const users = results.map((result) => {
                Object.keys(config.relations.users).forEach((key) => {
                    result[key] = result[key].filter(rel => !rel.isRemoved);
                });

                return result;
            });
            dispatch('checkAndAddObjects', { route: 'users', objects: users });
        });
}

/**
 * Purchases actions
 */

export function getPurchases({ commit, dispatch }, fields) {
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

    return get(`services/treasury/purchases?${qString}`)
        .then((purchases) => {
            commit('CLEAROBJECT', 'purchases');
            const purchasesWT = purchases.map((purchase) => {
                if (!purchase.totalWT) {
                    purchase.totalWT = purchase.totalVAT;
                }

                return purchase;
            });
            dispatch('checkAndAddObjects', { route: 'purchases', objects: purchasesWT });
        });
}

/**
 * Treasury actions
 */

export function getTreasury({ commit, dispatch }, fields) {
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

    return get(`services/treasury/reloads?${qString}`)
        .then((reloads) => {
            commit('CLEAROBJECT', 'reloads');
            dispatch('checkAndAddObjects', { route: 'reloads', objects: reloads });

            const relEmbed = encodeURIComponent(JSON.stringify(config.relations.transfers));

            return get(`transfers/search?q=${orQt}&embed=${relEmbed}`);
        })
        .then((transfers) => {
            commit('CLEAROBJECT', 'transfers');
            dispatch('checkAndAddObjects', { route: 'transfers', objects: transfers.filter(t => !t.isRemoved) });
        });
}

/**
 * Home actions
 */

export function login({ commit, dispatch }, credentials) {
    return post('services/login', credentials)
        .then((result) => {
            if (!isAdmin(result.user)) {
                throw new Error({ status: 401, statusText: 'You are not administrator' });
            }

            sessionStorage.setItem('user', JSON.stringify(result.user));
            sessionStorage.setItem('token', result.token);

            commit('UPDATELOGGEDUSER', result.user);
            updateBearer(result.token);

            dispatch('load');
        });
}
