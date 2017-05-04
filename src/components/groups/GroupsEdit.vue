<template>
    <div class="b-groups b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <b-navbar
                title="Groupes"
                :tabs="[{ route: '', name: 'Édition' }, { route: 'members', name: 'Membres' }]"
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
