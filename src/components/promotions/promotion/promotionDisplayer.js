import sortOrder from '../../../lib/sortOrder';

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
                    .sort((a, b) => sortOrder(a.name, b.name));

                if (sortedArticles.length > 0) {
                    promotionContent.push({
                        type    : 'set',
                        set,
                        articles: sortedArticles
                    });
                }
            });
    }

    promotionContent = promotionContent.sort((a, b) => sortOrder(a.articles[0].name, b.articles[0].name));

    return promotionContent;
}
