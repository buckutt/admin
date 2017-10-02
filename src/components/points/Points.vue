<template>
    <div class="b-points b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <b-navbar
                title="Guichets"
                :tabs="[{ route: '/points', name: 'Liste', exact: true }, { route: '/points/create', name: 'Création' }]"
                :inCard="true">
            </b-navbar>
            <router-view></router-view>
        </div>
    </div>
</template>
