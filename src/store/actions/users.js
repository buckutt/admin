import { get, post } from '../../lib/fetch';

/**
 * Users actions
 */

export function createUserWithMol({ dispatch, state }, user) {
    let createdUser;

    return post('users', user)
        .then((result) => {
            if (result.mail) {
                post('meansoflogin', { type: 'etuMail', data: result.mail, User_id: result.id });
            }

            dispatch('checkAndAddObjects', { route: 'users', objects: [result] });

            return result;
        })
        .then((newUser) => {
            createdUser = newUser;

            return dispatch('createSimpleRelation', {
                obj1: {
                    route: 'users',
                    value: newUser
                },
                obj2: {
                    route: 'groups',
                    value: state.app.currentEvent.defaultGroup
                },
                through: {
                    obj  : 'period',
                    field: 'Period_id',
                    value: state.app.currentEvent.defaultPeriod
                }
            });
        })
        .then(() => createdUser);
}

export function searchUsers({ commit, dispatch }, name) {
    return get(`services/manager/searchuser?name=${name}`)
        .then((results) => {
            if (results.length > 0) {
                const q = [];

                results.forEach((result) => {
                    q.push(JSON.stringify({
                        field: 'id',
                        eq   : result.id
                    }));
                });

                const orQ = q
                    .map(o => encodeURIComponent(o))
                    .join('&or[]=');

                return get(`users/search?q=${orQ}&embed=${encodeURIComponent(JSON.stringify(config.relations.users))}`);
            }
            return [];
        })
        .then((results) => {
            commit('CLEAROBJECT', 'users');
            const users = results.map((result) => {
                Object.keys(config.relations.users).forEach((key) => {
                    result[key] = result[key].filter(rel => !rel.isRemoved);
                });

                return result;
            });
            dispatch('checkAndAddObjects', { route: 'users', objects: users });
        });
}
