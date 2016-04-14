const state = {
    foundUsers: [],
};

// mutations
const mutations = {
    SEARCHUSER(state, users_) {
        state.foundUsers.length = 0;

        const users = users_.filter(user => !user.isRemoved);

        state.foundUsers.push(...users);
    },
    INVERTMOL(state, molId) {
        for (const user of state.foundUsers) {
            for (const mol of user.meansOfLogin) {
                if (mol.id === molId) {
                    mol.isRemoved = !mol.isRemoved;
                }
            }
        }
    }
};

export default {
    state,
    mutations
};
