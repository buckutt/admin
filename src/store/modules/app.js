const state = {
    points    : [],
    devices   : [],
    periods   : [],
    articles  : [],
    fundations: []
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
    }
};

export default {
    state,
    mutations
};
