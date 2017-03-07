import Vue from 'vue';

Vue.filter('reloadType', type => {
    const types = {
        check: 'Chèque',
        card : 'Carte bleue',
        cash : 'Espèces'
    };

    return types[type];
});
