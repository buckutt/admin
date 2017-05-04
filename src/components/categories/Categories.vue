<template>
    <div class="b-categories b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <b-navbar
                title="Catégories"
                :tabs="[{ route: '/categories', name: 'Liste' }, { route: '/categories/create', name: 'Création' }]"
                :inCard="true">
            </b-navbar>
            <router-view></router-view>
        </div>
    </div>
</template>

<style lang="scss">
    @import '../../main.scss';
</style>
