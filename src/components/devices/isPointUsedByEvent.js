export function isPointUsedByEvent(periodPoints, periodPoint) {
    const filteredEvents = periodPoints
        .filter((pP) => {
            if (!pP.point) {
                return false;
            }

            const samePoint = (periodPoint.point.id === pP.point.id);
            const overlap   = ((periodPoint.period.start <= pP.period.end)
                && (periodPoint.period.end >= pP.period.start));

            return samePoint && overlap;
        })
        .map(pP => pP.period.Event_id);

    if (filteredEvents.length > 0) {
        if (periodPoint.period.Event_id !== filteredEvents[0]) {
            return true;
        }
    }

    return false;
}
