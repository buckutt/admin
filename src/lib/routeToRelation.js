const relations = {
    articles: [
        'prices',
        'prices.fundation',
        'prices.group',
        'prices.period',
        'prices.point'
    ],
    categories: [
        'articles'
    ],
    devices: [
        'defaultGroup',
        'wikets',
        'wikets.point',
        'wikets.period'
    ],
    events: [
        'defaultFundation',
        'defaultGroup',
        'defaultPeriod',
        'periods'
    ],
    groups: [
        'memberships',
        'memberships.user',
        'memberships.period'
    ],
    memberships: [
        'user',
        'group',
        'period'
    ],
    points: [
        'categories',
        'categories.articles',
        'wikets',
        'wikets.device',
        'wikets.period'
    ],
    prices: [
        'fundation',
        'group',
        'period',
        'point',
        'promotion',
        'promotion.sets',
        'promotion.sets.articles',
        'article',
        'article.categories',
        'article.categories.points'
    ],
    promotions: [
        'prices',
        'prices.fundation',
        'prices.group',
        'prices.period',
        'prices.point',
        'sets',
        'sets.articles'
    ],
    rights: [
        'period',
        'point',
        'user'
    ],
    transfers: [
        'sender',
        'reciever'
    ],
    users: [
        'meansOfLogin',
        'rights',
        'rights.period',
        'rights.point',
        'memberships',
        'memberships.period',
        'memberships.group'
    ],
    wikets: [
        'device',
        'period',
        'point'
    ]
};

export default route => ((relations[route]) ? encodeURIComponent(JSON.stringify(relations[route])) : null);
