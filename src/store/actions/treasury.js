import { get } from '../../lib/fetch';

/**
 * Purchases actions
 */

export function getPurchases({ commit, dispatch }, fields) {
    const q = [];

    q.push(`event=${fields.event}`);

    if (fields.point) {
        q.push(`point=${fields.point}`);
    }

    if (fields.fundation) {
        q.push(`fundation=${fields.fundation}`);
    }

    if (fields.period) {
        q.push(`period=${fields.period}`);
    } else {
        if (fields.dateIn) {
            q.push(`dateIn=${fields.dateIn}`);
        }

        if (fields.dateOut) {
            q.push(`dateOut=${fields.dateOut}`);
        }
    }

    const qString = q
        .join('&');

    return get(`services/treasury/purchases?${qString}`)
        .then((purchases) => {
            commit('CLEAROBJECT', 'purchases');
            const purchasesWT = purchases.map((purchase) => {
                if (!purchase.totalWT) {
                    purchase.totalWT = purchase.totalVAT;
                }

                return purchase;
            });
            dispatch('checkAndAddObjects', { route: 'purchases', objects: purchasesWT });
        });
}

/**
 * Treasury actions
 */

export function getTreasury({ commit, dispatch }, fields) {
    const q  = [];
    const qt = [];

    if (fields.point) {
        q.push(`point=${fields.point}`);

        qt.push(JSON.stringify({
            field: 'Point_id',
            eq   : fields.point
        }));
    }

    if (fields.dateIn) {
        q.push(`dateIn=${fields.dateIn}`);

        qt.push(JSON.stringify({
            field: 'createdAt',
            ge   : fields.dateIn,
            date : true
        }));
    }

    if (fields.dateOut) {
        q.push(`dateOut=${fields.dateOut}`);

        qt.push(JSON.stringify({
            field: 'createdAt',
            le   : fields.dateOut,
            date : true
        }));
    }

    const qString = q
        .join('&');

    const orQt = qt
        .map(o => encodeURIComponent(o))
        .join('&q[]=');

    return get(`services/treasury/reloads?${qString}`)
        .then((reloads) => {
            commit('CLEAROBJECT', 'reloads');
            dispatch('checkAndAddObjects', { route: 'reloads', objects: reloads });

            return get(`services/treasury/refunds?${qString}`);
        })
        .then((refunds) => {
            commit('CLEAROBJECT', 'refunds');
            dispatch('checkAndAddObjects', { route: 'refunds', objects: refunds });

            const relEmbed = encodeURIComponent(JSON.stringify(config.relations.transfers));

            return get(`transfers/search?q=${orQt}&embed=${relEmbed}`);
        })
        .then((transfers) => {
            commit('CLEAROBJECT', 'transfers');
            dispatch('checkAndAddObjects', { route: 'transfers', objects: transfers.filter(t => !t.isRemoved) });
        });
}
