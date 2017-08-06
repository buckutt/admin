/**
 * Promotions actions
 */

export function addArticleToPromotion({ dispatch }, data) {
    return dispatch('createSimpleRelation', {
        obj1: {
            route: 'promotions',
            value: data.promotion
        },
        obj2: {
            route: 'articles',
            value: data.article
        }
    });
}

export function removeArticleFromPromotion({ dispatch }, data) {
    return dispatch('removeSimpleRelation', {
        obj1: {
            route: 'promotions',
            value: data.promotion
        },
        obj2: {
            route: 'articles',
            value: data.article
        }
    });
}

export function removeSetFromPromotion({ dispatch }, data) {
    dispatch('removeSimpleRelation', {
        obj1: {
            route: 'promotions',
            value: data.promotion
        },
        obj2: {
            route: 'sets',
            value: data.set
        }
    });

    return dispatch('removeObject', { route: 'sets', value: data.set });
}

export function addArticleToStep({ dispatch }, data) {
    const article   = data.article;
    const promotion = data.promotion;
    const step      = data.step;

    if (step.type === 'article') {
        if (step.articles[0].id === article.id) {
            return Promise.reject({ statusText: 'The article is already in this set' });
        }
        dispatch('createSetWithArticles', {
            set: {
                name: promotion.name
            },
            articles: [step.articles[0], article],
            promotion
        });

        return dispatch('removeArticleFromPromotion', { promotion, article: step.articles[0] });
    } else if (step.type === 'set') {
        const articlesIds = step.set.articles.map(a => a.id);

        if (articlesIds.indexOf(article.id) !== -1) {
            return Promise.reject({ statusText: 'The article is already in this set' });
        }

        return dispatch('addArticleToSet', { article, set: step.set });
    }
}

export function removeArticleFromStep({ dispatch }, data) {
    const article   = data.article;
    const promotion = data.promotion;
    const step      = data.step;

    if (step.type === 'article') {
        return dispatch('removeArticleFromPromotion', { promotion, article });
    } else if (step.type === 'set') {
        if (step.set.articles.length > 2) {
            return dispatch('removeArticleFromSet', { article, set: step.set });
        }

        const index       = step.set.articles.findIndex(a => (a.id !== article.id));
        const keptArticle = step.set.articles[index];

        dispatch('removeArticleFromSet', { article, set: step.set });
        dispatch('removeSetFromPromotion', { promotion, set: step.set });
        return dispatch('addArticleToPromotion', { promotion, article: keptArticle });
    }
}
