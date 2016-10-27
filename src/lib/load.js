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
    fetchSets
} from '../store/actions';

export function load(store) {
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
