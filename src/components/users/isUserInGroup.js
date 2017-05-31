export function isUserInGroup(user, group, period) {
    if (user.groups.length > 0) {
        const index = user.groups.findIndex(g => (g.id === group.id));
        if (user.groups[index]._through.Period_id === period.id) {
            return true;
        }
    }

    return false;
}
