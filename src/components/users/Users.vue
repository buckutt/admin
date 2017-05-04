<template>
    <div class="b-users b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <b-navbar
                title="Utilisateurs"
                :tabs="[{ route: '/users', name: 'Liste' }, { route: '/users/create', name: 'Création' }]"
                :inCard="true">
            </b-navbar>
            <router-view></router-view>
        </div>
    </div>
</template>

<style lang="scss">
    @import '../../main.scss';
</style>
