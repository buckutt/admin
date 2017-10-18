import { post } from '../../lib/fetch';

/**
 * Sets actions
 */

export function createSetWithArticles({ commit, dispatch }, payload) {
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

            return dispatch('updateModObject', {
                newRelation: 'sets',
                value      : {
                    id: result.id,
                    articles
                }
            });
        });
}

export function addArticleToSet({ dispatch, state }, payload) {
    const index = state.app.modObject.sets.findIndex(s => (s.id === payload.set.id));

    dispatch('updateModObject', {
        newRelation: `sets[${index}].articles`,
        value      : payload.article
    });

    return dispatch('createRelation', {
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

export function removeArticleFromSet({ dispatch, state }, payload) {
    const index = state.app.modObject.sets.findIndex(s => (s.id === payload.set.id));

    dispatch('removeModObjectRelation', {
        relation: `sets[${index}].articles`,
        value   : payload.article
    });

    return dispatch('removeRelation', {
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
