const state = {
    foundUsers: []
};

// mutations
const mutations = {
    SEARCHUSER(state_, users_) {
        state_.foundUsers.length = 0;

        const users = users_.filter(user => !user.isRemoved);

        state_.foundUsers.push(...users);
    },
    INVERTMOL(state_, molId) {
        state_.foundUsers.forEach((user) => {
            user.meansOfLogin.forEach((mol) => {
                if (mol.id === molId) {
                    mol.isRemoved = !mol.isRemoved;
                }
            });
        });
    }
};

export default {
    state,
    mutations
};
