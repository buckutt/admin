export function isEventConfigured(event) {
    if (!event) {
        return true;
    }

    if (event.config) {
        if (event.config.hasGroups !== null
            && event.config.hasFundations !== null
            && event.config.hasGroups !== null) {
            return true;
        }
    }
    return false;
}
