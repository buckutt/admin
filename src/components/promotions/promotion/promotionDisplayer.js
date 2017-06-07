export function promotionDisplayer(promotion) {
    let promotionContent = [];

    if (promotion.articles) {
        promotion.articles
            .filter(article => !article.isRemoved)
            .forEach((article) => {
                if (!promotion.articles.isRemoved) {
                    promotionContent.push({
                        type    : 'article',
                        articles: [article]
                    });
                }
            });
    }

    if (promotion.sets) {
        promotion.sets
            .filter(set => !set.isRemoved)
            .forEach((set) => {
                const sortedArticles = set.articles
                    .filter(article => !article.isRemoved)
                    .sort((a, b) => {
                        if (a.name < b.name) {
                            return -1;
                        }
                        if (a.name > b.name) {
                            return 1;
                        }
                        return 0;
                    });

                if (sortedArticles.length > 0) {
                    promotionContent.push({
                        type    : 'set',
                        set,
                        articles: sortedArticles
                    });
                }
            });
    }

    promotionContent = promotionContent.sort((a, b) => {
        if (a.articles[0].name < b.articles[0].name) {
            return -1;
        }
        if (a.articles[0].name > b.articles[0].name) {
            return 1;
        }
        return 0;
    });

    return promotionContent;
}
