/**
 * Promotions actions
 */

export function addStepToPromotion({ dispatch }, data) {
    return dispatch('createSetWithArticles', {
        set      : {},
        articles : data.articles,
        promotion: data.promotion
    });
}

export function removeSetFromPromotion({ dispatch }, data) {
    return dispatch('removeRelation', {
        obj1: {
            route: 'promotions',
            value: data.promotion
        },
        obj2: {
            route: 'sets',
            value: data.set
        }
    })
        .then(() => dispatch('removeObject', { route: 'sets', value: data.set }));
}

export function addArticleToStep({ dispatch }, data) {
    const article = data.article;
    const step    = data.step;

    const articlesIds = step.set.articles.map(a => a.id);

    if (articlesIds.indexOf(article.id) !== -1) {
        return Promise.reject(new Error('The article is already in this set'));
    }

    return dispatch('addArticleToSet', { article, set: step.set });
}

export function removeArticleFromStep({ dispatch }, data) {
    const article   = data.article;
    const promotion = data.promotion;
    const step      = data.step;

    if (step.set.articles.length > 1) {
        return dispatch('removeArticleFromSet', { article, set: step.set });
    }

    return dispatch('removeArticleFromSet', { article, set: step.set })
        .then(() => dispatch('removeSetFromPromotion', { promotion, set: step.set }));
}
