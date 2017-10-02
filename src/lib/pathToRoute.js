export default (path) => {
    let route = path;

    if (path === 'wikets') {
        route = 'points';
    } else if (path === 'participants') {
        route = 'users';
    }

    return route;
};
