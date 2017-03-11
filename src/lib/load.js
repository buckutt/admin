import {
    fetchObjects,
    listenChanges
} from '../store/actions';

export function load(store) {
    const models = [
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

    listenChanges(store, {
        token: sessionStorage.getItem('token'),
        models
    });

    models.forEach((model) => {
        fetchObjects(store, model);
    });
}
