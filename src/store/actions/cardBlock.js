import { get, put } from '../../lib/fetch';

const q = obj => encodeURIComponent(JSON.stringify(obj));

/**
 * CardBlock actions
 */
export function searchUser({ commit }, name) {
    const qFirstname = {
        field  : 'firstname',
        matches: `.*${name}.*`
    };

    const qLastname = {
        field  : 'lastname',
        matches: `.*${name}.*`
    };

    const e = q({
        meansOfLogin: true
    });

    get(`users/search?q=${q(qFirstname)}&or[]=${q(qLastname)}&embed=${e}`).then(users => {
        commit('SEARCHUSER', users);
    });
}

export function blockMOL({ commit }, payload) {
    const molId          = payload.molId;
    const blockOrRestore = payload.blockOrRestore;

    put(`meansoflogin/${molId}`, { isRemoved: blockOrRestore }).then(() => {
        commit('INVERTMOL', molId);
    });
}
