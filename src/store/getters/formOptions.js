export const groupOptions = state => (
    state.objects.groups.map(group => ({ name: group.name, value: group }))
);

export const pointOptions = state => (
    state.objects.points.map(point => ({ name: point.name, value: point }))
);

export const fundationOptions = state => (
    state.objects.fundations.map(fundation => ({ name: fundation.name, value: fundation }))
);

export const eventOptions = state => (
    state.objects.events.map(event => ({ name: event.name, value: event }))
);


export const periodOptions = (state) => {
    if (!state.app.currentEvent) {
        return [];
    }

    return state.objects.periods.map((period) => {
        if (period.Event_id === state.app.currentEvent.id) {
            return { name: period.name, value: period };
        }
        return null;
    }).filter(a => a);
};
