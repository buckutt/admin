export default (route) => {
    const now = new Date();

    const relations = {
        categories: [
            'articles'
        ],
        devices: [
            'defaultGroup'
        ],
        events: [
            'defaultFundation',
            'defaultGroup',
            'defaultPeriod'
        ],
        memberships: [
            {
                embed   : 'period',
                filters : [['end', '>', now]],
                required: true
            },
            {
                embed   : 'group',
                required: true
            }
        ],
        points: [
            'categories',
            'categories.articles',
            'wikets',
            {
                embed   : 'wikets.device',
                required: true
            },
            {
                embed   : 'wikets.period',
                filters : [['end', '>', now]],
                required: true
            },
            {
                embed   : 'wikets.period.event',
                required: true
            }
        ],
        prices: [
            {
                embed   : 'fundation',
                required: true
            },
            {
                embed   : 'group',
                required: true
            },
            {
                embed   : 'period',
                filters : [['end', '>', now]],
                required: true
            },
            {
                embed   : 'point',
                required: true
            }
        ],
        promotions: [
            'sets',
            'sets.articles'
        ],
        rights: [
            {
                embed   : 'period',
                filters : [['end', '>', now]],
                required: true
            },
            'point',
            {
                embed   : 'user',
                required: true
            }
        ],
        transfers: [
            'sender',
            'reciever'
        ],
        users: [
            'meansOfLogin',
            'rights',
            {
                embed   : 'rights.period',
                filters : [['end', '>', now]],
                required: true
            },
            'rights.point',
            'memberships',
            {
                embed   : 'memberships.period',
                filters : [['end', '>', now]],
                required: true
            },
            {
                embed   : 'memberships.group',
                required: true
            }
        ],
        wikets: [
            {
                embed   : 'device',
                required: true
            },
            {
                embed   : 'period',
                filters : [['end', '>', now]],
                required: true
            },
            'point'
        ]
    };

    return ((relations[route]) ? encodeURIComponent(JSON.stringify(relations[route])) : null);
};
