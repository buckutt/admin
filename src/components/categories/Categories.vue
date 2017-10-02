<template>
    <div class="b-categories b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <b-navbar
                title="Catégories"
                :tabs="[{ route: '/categories', name: 'Liste', exact: true }, { route: '/categories/create', name: 'Création' }]"
                :inCard="true">
            </b-navbar>
            <router-view></router-view>
        </div>
    </div>
</template>
