export function isEventConfigured(event) {
    if (!event) {
        return false;
    }
    if (event.useGroups !== null
        && event.useFundations !== null
        && event.usePeriods !== null) {
        return true;
    }
    return false;
}
