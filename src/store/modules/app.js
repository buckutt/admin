const state = {
    points    : [],
    devices   : [],
    periods   : [],
    articles  : [],
    fundations: []
};

// mutations
const mutations = {
    ADDPOINTS(state, points) {
        state.points.push(...points);
    },
    ADDDEVICES(state, devices) {
        state.devices.push(...devices);
    },
    ADDPERIODS(state, periods) {
        state.periods.push(...periods);
    },
    ADDARTICLES(state, articles) {
        state.articles.push(...articles);
    },
    ADDFUNDATIONS(state, fundations) {
        state.fundations.push(...fundations);
    },
    UPDATEPERIOD(state, period, data) {
        state.periods.forEach((p, i) => {
            if (p.id === period.id) { 
                state.periods[i] = Object.assign(state.periods[i], data);
            }
        });
    },
    DELETEPERIOD(state, period) {
        let i = 0;
        for (const p of state.periods) {
            if (p.id === period.id) {
                break;
            }

            ++i;
        }

        state.periods.splice(i, 1);
    }
};

export default {
  state,
  mutations
};
