import Vue from 'vue';

Vue.filter('reload', type => {
    const types = {
        check: 'Chèque',
        card : 'Carte bleue',
        cash : 'Espèces'
    };

    return types[type];
});
