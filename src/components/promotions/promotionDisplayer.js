export function promotionDisplayer(promotion) {
    let promotionContent = [];

    if (promotion.articles) {
        promotion.articles.forEach((article) => {
            promotionContent.push({
                type    : 'article',
                articles: [article]
            });
        });
    }

    if (promotion.sets) {
        promotion.sets.forEach((set) => {
            const sortedArticles = set.articles.sort((a, b) => {
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            });

            promotionContent.push({
                type    : 'set',
                set,
                articles: sortedArticles
            });
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
