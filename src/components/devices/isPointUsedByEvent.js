export function isPointUsedByEvent(points, devicePoint) {
    const filteredEvents = points
        .filter((point) => {
            const samePoint = (devicePoint.point.id === point.id);
            const overlap   = ((devicePoint.period.start <= point._through.period.end)
                && (devicePoint.period.end >= point._through.period.start));

            return samePoint && overlap;
        })
        .map(point => point._through.period.Event_id);

    if (filteredEvents.length > 0) {
        if (devicePoint.period.Event_id !== filteredEvents[0]) {
            return true;
        }
    }

    return false;
}
