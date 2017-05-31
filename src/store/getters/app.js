export const logged = state => !!state.app.loggedUser;

export const protectedPeriodsIds = (state) => {
    const periods = [];
    state.objects.events.forEach(event => periods.push(event.DefaultPeriod_id));
    return periods;
};

export const protectedGroupsIds = (state) => {
    const groups = [];
    state.objects.events.forEach(event => groups.push(event.DefaultGroup_id));
    return groups;
};
