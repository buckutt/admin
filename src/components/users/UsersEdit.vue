<template>
    <div class="b-users b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <b-navbar
                title="Utilisateurs"
                :tabs="[{ route: '', name: 'Édition' }, { route: 'mol', name: 'Identifiants' }, { route: 'rights', name: 'Droits' }, { route: 'groups', name: 'Groupes' }]"
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
