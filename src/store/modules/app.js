import lodset from 'lodash.set';
import lodget from 'lodash.get';

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
    events    : [],
    users     : [],
    transfers : [],
    reloads   : [],
    purchases : [],
    modObject : null
};

// mutations
const mutations = {
    CLEARAPPSTORE(state_) {
        Object.keys(state_).forEach((key) => {
            if (Array.isArray(state_[key])) {
                state_[key] = [];
            } else {
                state_[key] = null;
            }
        });
    },
    UPDATEMODOBJECT(state_, modObject) {
        state_.modObject = modObject;
    },
    UPDATEMODOBJECTFIELD(state_, payload) {
        lodset(state_.modObject, payload.field, payload.value);
    },
    ADDMODOBJECTRELATION(state_, payload) {
        lodget(state_.modObject, payload.relation).push(payload.value);
    },
    UPDATEMODOBJECTRELATION(state_, payload) {
        const relations = lodget(state_.modObject, payload.relation);
        const i         = relations.findIndex(o => (o.id === payload.value.id));
        relations[i]    = payload.value;

        lodset(state_.modObject, payload.relation, relations);
    },
    REMOVEMODOBJECTRELATION(state_, payload) {
        const i = lodget(state_.modObject, payload.relation).findIndex(o => (o.id === payload.value.id));

        lodget(state_.modObject, payload.relation).splice(i, 1);
    },
    CLEARMODOBJECT(state_) {
        state_.modObject = null;
    },
    CLEARUSERS(state_) {
        state_.users = [];
    },
    CLEARPURCHASES(state_) {
        state_.purchases = [];
    },
    CLEARTRANSFERS(state_) {
        state_.transfers = [];
    },
    CLEARRELOADS(state_) {
        state_.reloads = [];
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
    ADDUSERS(state_, users) {
        state_.users.push(...users);
    },
    ADDPURCHASES(state_, purchases) {
        state_.purchases.push(...purchases);
    },
    ADDTRANSFERS(state_, transfers) {
        state_.transfers.push(...transfers);
    },
    ADDRELOADS(state_, reloads) {
        state_.reloads.push(...reloads);
    },
    UPDATEPERIOD(state_, period) {
        const i = state_.periods.findIndex(p => (p.id === period.id));

        state_.periods[i] = Object.assign(state_.periods[i], period);
    },
    UPDATEPOINT(state_, point) {
        const i = state_.points.findIndex(p => (p.id === point.id));

        state_.points[i] = Object.assign(state_.points[i], point);
    },
    UPDATEDEVICE(state_, device) {
        const i = state_.devices.findIndex(d => (d.id === device.id));

        state_.devices[i] = Object.assign(state_.devices[i], device);
    },
    UPDATEARTICLE(state_, article) {
        const i = state_.articles.findIndex(a => (a.id === article.id));

        state_.articles[i] = Object.assign(state_.articles[i], article);
    },
    UPDATEFUNDATION(state_, fundation) {
        const i = state_.fundations.findIndex(f => (f.id === fundation.id));

        state_.fundations[i] = Object.assign(state_.fundations[i], fundation);
    },
    UPDATEGROUP(state_, group) {
        const i = state_.groups.findIndex(g => (g.id === group.id));

        state_.groups[i] = Object.assign(state_.groups[i], group);
    },
    UPDATECATEGORY(state_, category) {
        const i = state_.categories.findIndex(c => (c.id === category.id));

        state_.categories[i] = Object.assign(state_.categories[i], category);
    },
    UPDATEPROMOTION(state_, promotion) {
        const i = state_.promotions.findIndex(p => (p.id === promotion.id));

        state_.promotions[i] = Object.assign(state_.promotions[i], promotion);
    },
    UPDATESET(state_, set) {
        const i = state_.sets.findIndex(s => (s.id === set.id));

        state_.sets[i] = Object.assign(state_.sets[i], set);
    },
    UPDATEEVENT(state_, event) {
        const i = state_.events.findIndex(e => (e.id === event.id));

        state_.events[i] = Object.assign(state_.events[i], event);
    },
    UPDATEUSER(state_, user) {
        const i = state_.users.findIndex(u => (u.id === user.id));

        state_.users[i] = Object.assign(state_.users[i], user);
    },
    DELETEPERIOD(state_, period) {
        const i = state_.periods.findIndex(p => (p.id === period.id));

        state_.periods.splice(i, 1);
    },
    DELETEPOINT(state_, point) {
        const i = state_.points.findIndex(p => (p.id === point.id));

        state_.points.splice(i, 1);
    },
    DELETEDEVICE(state_, device) {
        const i = state_.devices.findIndex(d => (d.id === device.id));

        state_.devices.splice(i, 1);
    },
    DELETEARTICLE(state_, article) {
        const i = state_.articles.findIndex(a => (a.id === article.id));

        state_.articles.splice(i, 1);
    },
    DELETEFUNDATION(state_, fundation) {
        const i = state_.fundations.findIndex(f => (f.id === fundation.id));

        state_.fundations.splice(i, 1);
    },
    DELETEGROUP(state_, group) {
        const i = state_.groups.findIndex(g => (g.id === group.id));

        state_.groups.splice(i, 1);
    },
    DELETECATEGORY(state_, category) {
        const i = state_.categories.findIndex(c => (c.id === category.id));

        state_.categories.splice(i, 1);
    },
    DELETEPROMOTION(state_, promotion) {
        const i = state_.promotions.findIndex(p => (p.id === promotion.id));

        state_.promotions.splice(i, 1);
    },
    DELETEEVENT(state_, event) {
        const i = state_.events.findIndex(e => (e.id === event.id));

        state_.events.splice(i, 1);
    },
    DELETESET(state_, set) {
        const i = state_.sets.findIndex(s => (s.id === set.id));

        state_.sets.splice(i, 1);
    },
    DELETEUSER(state_, user) {
        const i = state_.users.findIndex(u => (u.id === user.id));

        state_.users.splice(i, 1);
    }
};

export default {
    state,
    mutations
};
