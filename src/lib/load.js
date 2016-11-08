import {
    fetchPoints,
    fetchDevices,
    fetchPeriods,
    fetchArticles,
    fetchFundations,
    fetchGroups,
    fetchCategories,
    fetchEvents,
    fetchPromotions,
    fetchSets,
    listenChanges
} from '../store/actions';

export function load(store) {
    listenChanges(store, sessionStorage.getItem('token'), [
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
    ]);

    fetchPoints(store);
    fetchDevices(store);
    fetchPeriods(store);
    fetchArticles(store);
    fetchFundations(store);
    fetchGroups(store);
    fetchCategories(store);
    fetchPromotions(store);
    fetchSets(store);
    fetchEvents(store);
}
