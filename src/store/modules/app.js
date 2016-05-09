const state = {
    points    : [],
    devices   : [],
    periods   : [],
    articles  : [],
    fundations: [],
    groups    : []
};

// mutations
const mutations = {
    ADDPOINTS(state_, points) {
        state_.points.push(...points);
    },
    ADDDEVICES(state_, devices) {
        state_.devices.push(...devices);
    },
    ADDPERIODS(state_, periods) {
        state_.periods.push(...periods);
    },
    ADDARTICLES(state_, articles) {
        state_.articles.push(...articles);
    },
    ADDFUNDATIONS(state_, fundations) {
        state_.fundations.push(...fundations);
    },
    ADDGROUPS(state_, groups) {
        state_.groups.push(...groups);
    },
    UPDATEPERIOD(state_, period, data) {
        state_.periods.forEach((p, i) => {
            if (p.id === period.id) {
                state_.periods[i] = Object.assign(state_.periods[i], data);
            }
        });
    },
    UPDATEPOINT(state_, point, data) {
        state_.points.forEach((p, i) => {
            if (p.id === point.id) {
                state_.points[i] = Object.assign(state_.points[i], data);
            }
        });
    },
    UPDATEARTICLE(state_, article, data) {
        state_.articles.forEach((a, i) => {
            if (a.id === article.id) {
                state_.articles[i] = Object.assign(state_.articles[i], data);
            }
        });
    },
    DELETEPERIOD(state_, period) {
        let i = 0;
        for (const p of state_.periods) {
            if (p.id === period.id) {
                break;
            }

            ++i;
        }

        state_.periods.splice(i, 1);
    },
    DELETEPOINT(state_, point) {
        let i = 0;
        for (const p of state_.points) {
            if (p.id === point.id) {
                break;
            }

            ++i;
        }

        state_.points.splice(i, 1);
    },
    DELETEARTICLE(state_, article) {
        let i = 0;
        for (const a of state_.articles) {
            if (a.id === article.id) {
                break;
            }

            ++i;
        }

        state_.articles.splice(i, 1);
    }
};

export default {
    state,
    mutations
};
