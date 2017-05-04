<template>
    <div class="b-categories b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <b-navbar
                title="Catégories"
                :tabs="[{ route: '', name: 'Édition' }, { route: 'articles', name: 'Articles' }]"
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
