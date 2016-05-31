const state = {
    points    : [],
    devices   : [],
    periods   : [],
    articles  : [],
    fundations: [],
    groups    : [],
    categories: [],
    events    : []
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
    ADDCATEGORIES(state_, categories) {
        state_.categories.push(...categories);
    },
    ADDEVENTS(state_, events) {
        state_.events.push(...events);
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
    UPDATEDEVICE(state_, device, data) {
        state_.devices.forEach((d, i) => {
            if (d.id === device.id) {
                state_.devices[i] = Object.assign(state_.devices[i], data);
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
    UPDATEGROUP(state_, group, data) {
        state_.groups.forEach((g, i) => {
            if (g.id === group.id) {
                state_.groups[i] = Object.assign(state_.groups[i], data);
            }
        });
    },
    UPDATECATEGORY(state_, category, data) {
        state_.categories.forEach((c, i) => {
            if (c.id === category.id) {
                state_.categories[i] = Object.assign(state_.categories[i], data);
            }
        });
    },
    UPDATEEVENT(state_, event, data) {
        state_.events.forEach((e, i) => {
            if (e.id === event.id) {
                state_.events[i] = Object.assign(state_.events[i], data);
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
    DELETEDEVICE(state_, device) {
        let i = 0;
        for (const d of state_.devices) {
            if (d.id === device.id) {
                break;
            }

            ++i;
        }

        state_.devices.splice(i, 1);
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
    },
    DELETEGROUP(state_, group) {
        let i = 0;
        for (const g of state_.groups) {
            if (g.id === group.id) {
                break;
            }

            ++i;
        }

        state_.groups.splice(i, 1);
    },
    DELETECATEGORY(state_, category) {
        let i = 0;
        for (const c of state_.categories) {
            if (c.id === category.id) {
                break;
            }

            ++i;
        }

        state_.categories.splice(i, 1);
    },
    DELETEEVENT(state_, event) {
        let i = 0;
        for (const e of state_.events) {
            if (e.id === event.id) {
                break;
            }

            ++i;
        }

        state_.events.splice(i, 1);
    }
};

export default {
    state,
    mutations
};
