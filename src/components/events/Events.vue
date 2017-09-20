<template>
    <div class="b-events b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <b-navbar
                title="Évenements"
                :tabs="[{ route: '/', name: 'Liste' }, { route: '/events/create', name: 'Création' }]"
                :inCard="true">
            </b-navbar>
            <router-view></router-view>
        </div>
    </div>
</template>
