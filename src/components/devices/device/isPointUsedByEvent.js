export function isPointUsedByEvent(wikets, newWiket) {
    const filteredEvents = wikets
        .filter((wiket) => {
            const samePoint = (newWiket.point.id === wiket.point.id);
            const overlap   = ((newWiket.period.start <= wiket.period.end)
                && (newWiket.period.end >= wiket.period.start));

            return samePoint && overlap;
        })
        .map(wiket => wiket.period.event_id);

    if (filteredEvents.length > 0) {
        if (newWiket.period.event_id !== filteredEvents[0]) {
            return true;
        }
    }

    return false;
}
