/**
 * Promotions actions
 */

export function addArticleToPromotion({ dispatch }, data) {
    dispatch('createSimpleRelation', {
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
    dispatch('removeSimpleRelation', {
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

    dispatch('removeObject', { route: 'sets', value: data.set });
}

export function addArticleToStep({ commit, dispatch, state }, data) {
    const article   = data.article;
    const promotion = data.promotion;
    const step      = data.step;

    if (step.type === 'article') {
        if (step.articles[0].id !== article.id) {
            dispatch('createSetWithArticles', {
                set: {
                    name: promotion.name
                },
                articles: [step.articles[0], article],
                promotion
            });

            dispatch('removeArticleFromPromotion', { promotion, article: step.articles[0] });
        } else {
            dispatch('showClientError', { message: 'L\'article est déjà présent dans l\'ensemble.' });
        }
    } else if (step.type === 'set') {
        const articlesIds = step.set.articles.map(a => a.id);

        if (articlesIds.indexOf(article.id) === -1) {
            dispatch('addArticleToSet', { article, set: step.set });
        } else {
            dispatch('showClientError', { message: 'L\'article est déjà présent dans l\'ensemble.' });
        }
    }
}

export function removeArticleFromStep({ commit, dispatch, state }, data) {
    const article   = data.article;
    const promotion = data.promotion;
    const step      = data.step;

    if (step.type === 'article') {
        dispatch('removeArticleFromPromotion', { promotion, article });
    } else if (step.type === 'set') {
        if (step.set.articles.length > 2) {
            dispatch('removeArticleFromSet', { article, set: step.set });
        } else {
            const index       = step.set.articles.findIndex(a => (a.id !== article.id));
            const keptArticle = step.set.articles[index];

            dispatch('removeArticleFromSet', { article, set: step.set });
            dispatch('removeSetFromPromotion', { promotion, set: step.set });
            dispatch('addArticleToPromotion', { promotion, article: keptArticle });
        }
    }
}
