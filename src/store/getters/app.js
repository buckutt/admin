export const logged = state => !!state.app.loggedUser;

export const protectedPeriodsIds = (state) => {
    const periods = [];
    state.objects.events.forEach(event => periods.push(event.defaultPeriod_id));
    return periods;
};

export const protectedGroupsIds = (state) => {
    const groups = [];
    state.objects.events.forEach(event => groups.push(event.defaultGroup_id));
    return groups;
};

export const protectedFundationsIds = (state) => {
    const fundations = [];
    state.objects.events.forEach(event => fundations.push(event.defaultFundation_id));
    return fundations;
};
