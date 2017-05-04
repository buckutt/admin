<template>
    <div class="b-points b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <b-navbar
                title="Points"
                :tabs="[{ route: '', name: 'Édition' }, { route: 'categories', name: 'Catégories' }]"
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
