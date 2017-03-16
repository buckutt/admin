import {
    fetchObjects,
    registerModels,
    initSocket
} from '../store/actions';

export function load(store) {
    const routes = [
        'points',
        'devices',
        'periods',
        'articles',
        'fundations',
        'groups',
        'categories',
        'promotions',
        'sets',
        'events'
    ];

    initSocket(store, sessionStorage.getItem('token'));

    routes.forEach((route) => {
        fetchObjects(store, route);
    });

    registerModels(store, routes);
}
