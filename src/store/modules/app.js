const state = {
    points    : [],
    devices   : [],
    periods   : [],
    articles  : [],
    fundations: [],
    groups    : [],
    categories: [],
    promotions: [],
    sets      : [],
    events    : []
};

// mutations
const mutations = {
    CLEARAPPSTORE(state_) {
        Object.keys(state_).forEach(key => {
            state_[key] = [];
        });
    },
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
    ADDPROMOTIONS(state_, promotions) {
        state_.promotions.push(...promotions);
    },
    ADDSETS(state_, sets) {
        state_.sets.push(...sets);
    },
    ADDEVENTS(state_, events) {
        state_.events.push(...events);
    },
    UPDATEPERIOD(state_, period) {
        state_.periods.forEach((p, i) => {
            if (p.id === period.id) {
                state_.periods[i] = Object.assign(state_.periods[i], period);
            }
        });
    },
    UPDATEPOINT(state_, point) {
        state_.points.forEach((p, i) => {
            if (p.id === point.id) {
                state_.points[i] = Object.assign(state_.points[i], point);
            }
        });
    },
    UPDATEDEVICE(state_, device) {
        state_.devices.forEach((d, i) => {
            if (d.id === device.id) {
                state_.devices[i] = Object.assign(state_.devices[i], device);
            }
        });
    },
    UPDATEARTICLE(state_, article) {
        state_.articles.forEach((a, i) => {
            if (a.id === article.id) {
                state_.articles[i] = Object.assign(state_.articles[i], article);
            }
        });
    },
    UPDATEGROUP(state_, group) {
        state_.groups.forEach((g, i) => {
            if (g.id === group.id) {
                state_.groups[i] = Object.assign(state_.groups[i], group);
            }
        });
    },
    UPDATECATEGORY(state_, category) {
        state_.categories.forEach((c, i) => {
            if (c.id === category.id) {
                state_.categories[i] = Object.assign(state_.categories[i], category);
            }
        });
    },
    UPDATEPROMOTION(state_, promotion) {
        state_.promotions.forEach((p, i) => {
            if (p.id === promotion.id) {
                state_.promotions[i] = Object.assign(state_.promotions[i], promotion);
            }
        });
    },
    UPDATESET(state_, set) {
        state_.sets.forEach((s, i) => {
            if (s.id === set.id) {
                state_.sets[i] = Object.assign(state_.sets[i], set);
            }
        });
    },
    UPDATEEVENT(state_, event) {
        state_.events.forEach((e, i) => {
            if (e.id === event.id) {
                state_.events[i] = Object.assign(state_.events[i], event);
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
    DELETEPROMOTION(state_, promotion) {
        let i = 0;
        for (const p of state_.promotions) {
            if (p.id === promotion.id) {
                break;
            }

            ++i;
        }

        state_.promotions.splice(i, 1);
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
    },
    DELETESET(state_, set) {
        let i = 0;
        for (const s of state_.sets) {
            if (s.id === set.id) {
                break;
            }

            ++i;
        }

        state_.sets.splice(i, 1);
    }
};

export default {
    state,
    mutations
};
