<template>
    <div class="b-promotions b-page">
        <div class="mdl-card mdl-shadow--2dp">
            <b-navbar
                title="Promotions"
                :tabs="[{ route: '', name: 'Édition' }, { route: 'prices', name: 'Prix' }, { route: 'content', name: 'Contenu' }]"
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
