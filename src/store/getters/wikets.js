import sortOrder from '../../lib/sortOrder';

export const wikets = (state) => {
    const now        = new Date();
    const event      = state.app.currentEvent;
    const points     = state.objects.points;
    const wiketsList = [];

    points.forEach((point) => {
        if (point.devices) {
            const devices = point.devices
                .filter(device => (
                    device._through.period.Event_id === event.id &&
                    new Date(device._through.period.end) >= now
                ));

            if (devices.length > 0) {
                wiketsList.push({
                    id: point.id,
                    point,
                    devices
                });
            }
        }
    });

    return wiketsList;
};

export const wiketCategories = (state) => {
    const pathArray = state.route.path.split('/');
    const path      = pathArray[1];
    const wiketId   = pathArray[2];

    if (path !== 'wikets' || !wiketId) {
        return [];
    }

    const pointDetails = state.objects.points.find(point => point.id === wiketId);

    return (pointDetails.categories) ?
        pointDetails.categories.sort((a, b) => sortOrder(a.name, b.name))
        : [];
};

export const wiketTabsArticles = (state, getters) => {
    const now          = new Date();
    const event        = state.app.currentEvent;
    const articles     = [];
    const promotions   = [];
    const tabsArticles = Object.assign([], getters.wiketCategories);

    state.objects.prices
        .filter(price => (
            price.period.Event_id === event.id &&
            new Date(price.period.end) >= now
        ))
        .forEach((price) => {
            price.articles.forEach((article) => {
                let articleIndex = articles.findIndex(a => article.id === a.id);

                if (articleIndex === -1) {
                    const newArticle  = Object.assign({}, article);
                    newArticle.prices = [];
                    newArticle.type   = 'article';
                    articleIndex      = articles.push(newArticle) - 1;
                }

                articles[articleIndex].prices.push(price);
            });

            price.promotions.forEach((promotion) => {
                let promotionIndex = promotions.findIndex(p => promotion.id === p.id);

                if (promotionIndex === -1) {
                    const newPromotion  = Object.assign({}, promotion);
                    newPromotion.prices = [];
                    newPromotion.type   = 'promotion';
                    promotionIndex      = promotions.push(newPromotion) - 1;
                }

                promotions[promotionIndex].prices.push(price);
            });
        });

    return tabsArticles.map((tab) => {
        const matchReqCategory = category => category.id === tab.id;

        return {
            id      : tab.id,
            name    : tab.name,
            articles: articles
                .filter(article => article.categories.some(matchReqCategory))
                .sort((a, b) => sortOrder(a.name, b.name)),
            promotions: promotions
                .sort((a, b) => sortOrder(a.name, b.name))
        };
    });
};

export const wiketCurrentTab = (state, getters) => {
    const tabId     = state.route.params.category;
    const foundTab  = getters.wiketTabsArticles.find(tab => tab.id === tabId);

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
