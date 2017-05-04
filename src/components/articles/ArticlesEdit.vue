<template>
    <div class="b-articles b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <b-navbar
                title="Articles"
                :tabs="[{ route: '', name: 'Édition' }, { route: 'prices', name: 'Prix' }]"
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
