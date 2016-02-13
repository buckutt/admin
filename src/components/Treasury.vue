<template>
    <div class="treasury">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Treasury</h3>
            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select">
                <input class="mdl-textfield__input" type="text" id="sample2" value="Tous les points" readonly tabindex="-1">
                <label for="sample2">
                    <i class="mdl-icon-toggle__label material-icons">keyboard_arrow_down</i>
                </label>
                <label for="sample2" class="mdl-textfield__label">Point</label>
                <ul for="sample2" class="mdl-menu mdl-menu--bottom-left mdl-js-menu">
                    <li class="mdl-menu__item">Tous les points</li>
                    <li class="mdl-menu__item" v-for="point in points">{{ point.name }}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import store from '../store';

export default {
    props: ['points']
}
</script>

<style lang="sass">
    @import '../main.scss';

    .treasury {
        > div {
            height: calc(100% - 40px);
            margin: 20px ((100% - $cardSize) / 2);
            padding: 20px;
            width: $cardSize;

            > .mdl-textfield {
                width: $mdlSelectSize;
            }

            > h3 {
                margin: 0;
            }
        }
    }
</style>
