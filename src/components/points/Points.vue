<template>
    <div class="b-points b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <b-navbar
                title="Points"
                :tabs="[{ route: '/points', name: 'Liste' }, { route: '/points/create', name: 'Création' }]"
                :inCard="true">
            </b-navbar>
            <router-view></router-view>
        </div>
    </div>
</template>

<style lang="scss">
    @import '../../main.scss';
</style>
