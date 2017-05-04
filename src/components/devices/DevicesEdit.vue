<template>
    <div class="b-devices b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <b-navbar
                title="Équipements"
                :tabs="[{ route: '', name: 'Édition' }, { route: 'assign', name: 'Assignement' }, { route: 'ssl', name: 'Certificat SSL' }]"
                :inCard="true"
                :goBack="true"
                :level="3">
            </b-navbar>
            <router-view></router-view>
        </div>
    </div>
</template>

<style lang="scss">
    @import '../../main.scss';
</style>
