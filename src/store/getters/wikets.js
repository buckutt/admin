import sortOrder from '../../lib/sortOrder';

export const pointsWikets = (state) => {
    const now              = new Date();
    const points           = state.objects.points;
    const event            = state.app.currentEvent;
    const pointsWiketsList = [];

    points.forEach((point) => {
        if (point.wikets) {
            const lightWikets = point.wikets
                .filter(wiket => (
                    wiket.period.event_id === event.id &&
                    new Date(wiket.period.end) >= now &&
                    wiket.device.id
                ))
                .map(wiket => ({
                    device: wiket.device,
                    period: wiket.period,
                    id    : wiket.id
                }));

            if (lightWikets.length > 0) {
                pointsWiketsList.push({
                    ...point,
                    wikets: lightWikets
                });
            }
        }
    });

    return pointsWiketsList
        .sort((a, b) => sortOrder(a.name, b.name));
};

export const isWiketSelected = (state) => {
    const pathArray = state.route.path.split('/');
    const path      = pathArray[1];
    const wiketId   = state.route.params.id;

    return (path === 'wikets' && wiketId);
};

export const addWiket = (state) => {
    const pathArray = state.route.path.split('/');
    const path      = pathArray[1];
    const action    = pathArray[2];

    return (path === 'wikets' && action === 'add');
};

export const wiketPromotions = (state, getters) => {
    const promotions = state.objects.promotions;

    if (!getters.isWiketSelected) {
        return [];
    }

    const articles = getters.wiketCategories.reduce((a, b) => a.concat(b.articles), []);

    return promotions.filter((promotion) => {
        if (!promotion.sets) {
            return false;
        }

        const toReduce = promotion.sets
            .map((set) => {
                let match = false;
                set.articles.forEach((article) => {
                    if (articles.some(a => a.id === article.id)) {
                        match = true;
                    }
                });
                return match;
            });

        return toReduce.reduce((a, b) => a && b, (toReduce.length > 0));
    });
};

export const wiketCategories = (state, getters) => {
    if (!getters.isWiketSelected) {
        return [];
    }

    const point = state.app.modObject;

    return (point && point.categories) ?
        point.categories.sort((a, b) => sortOrder(a.name, b.name))
        : [];
};

export const wiketTabsArticles = (state, getters) => {
    const now          = new Date();
    const event        = state.app.currentEvent;
    const pointId      = state.route.params.id;
    const tabsArticles = Object.assign([], getters.wiketCategories);
    const prices       = state.objects.prices
        .filter(price => (
            price.period.event_id === event.id &&
            price.point_id === pointId &&
            new Date(price.period.end) >= now
        ));

    return tabsArticles.map((tab) => {
        const allArticles = tab.articles
            .map((article) => {
                const newArticle  = Object.assign({}, article);
                newArticle.prices = prices.filter(price => price.article_id === article.id);
                newArticle.type   = 'article';
                return newArticle;
            })
            .sort((a, b) => sortOrder(a.name, b.name))
            .sort((a, b) => sortOrder(a.prices.length > 0, b.prices.length > 0, 'DESC'));

        const allPromotions = getters.wiketPromotions
            .map((promotion) => {
                const newPromotion  = Object.assign({}, promotion);
                newPromotion.prices = prices.filter(price => price.promotion_id === promotion.id);
                newPromotion.type   = 'promotion';
                return newPromotion;
            })
            .sort((a, b) => sortOrder(a.name, b.name))
            .sort((a, b) => sortOrder(a.prices.length > 0, b.prices.length > 0, 'DESC'));

        return {
            id        : tab.id,
            name      : tab.name,
            articles  : allArticles,
            promotions: allPromotions
        };
    });
};

export const wiketCurrentTab = (state, getters) => {
    const tabId    = state.route.params.category;
    const foundTab = getters.wiketTabsArticles.find(tab => tab.id === tabId);

    if (!foundTab) {
        return {};
    }

    return foundTab;
};

export const selectedWiketItem = (state, getters) => {
    const articleId   = state.route.params.article;
    const promotionId = state.route.params.promotion;
    let bank          = getters.wiketCurrentTab.articles;
    let itemId        = articleId;

    if (promotionId) {
        bank   = getters.wiketCurrentTab.promotions;
        itemId = promotionId;
    }


    const foundItem = (bank) ?
        bank.find(item => item.id === itemId) :
        false;

    if (!foundItem) {
        return {};
    }

    return foundItem;
};
