import { get, post, updateBearer } from '../../lib/fetch';
import { isAdmin }                 from '../../lib/isAdmin.js';

/**
 * Sets actions
 */

export function createSetWithArticles({ commit, state }, payload) {
    const set       = payload.set;
    const articles  = payload.articles;
    const promotion = payload.promotion;

    post('sets', set).then((result) => {
        if (state.objects.sets.findIndex(object => (object.id === result.id)) === -1) {
            commit('ADDSETS', [result]);
        }

        post(`sets/${result.id}/promotions`, { id: promotion.id })
            .catch((err) => {
                commit('UPDATEAPIERROR', err);
            });

        articles.forEach((article) => {
            post(`sets/${result.id}/articles`, { id: article.id });
        });

        commit('UPDATENOTIFY', { message: 'L\'objet a bien été créé.' });
    })
    .catch((err) => {
        commit('UPDATEAPIERROR', err);
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
            commit('UPDATENOTIFY', { message: 'L\'objet a bien été créé.' });
        })
        .catch((err) => {
            commit('UPDATEAPIERROR', err);
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
                    .join('&or[]=');

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
        })
        .catch((err) => {
            commit('UPDATEAPIERROR', err);
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
        })
        .catch((err) => {
            commit('UPDATEAPIERROR', err);
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
        })
        .catch((err) => {
            commit('UPDATEAPIERROR', err);
        });
}

/**
 * Home actions
 */

export function login({ commit, dispatch }, credentials) {
    post('services/login', credentials)
        .then((result) => {
            if (isAdmin(result.user)) {
                sessionStorage.setItem('user', JSON.stringify(result.user));
                sessionStorage.setItem('token', result.token);

                commit('UPDATELOGGED', true);
                commit('UPDATELOGGEDUSER', result.user);
                updateBearer(result.token);

                dispatch('load');
            } else {
                commit('UPDATECLIENTERROR', {
                    message: 'Vous n\'êtes pas administrateur.'
                });
            }
        })
        .catch((err) => {
            commit('UPDATEAPIERROR', err);
        });
}
