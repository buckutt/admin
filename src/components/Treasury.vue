<template>
    <div class="treasury">
        <div class="mdl-card mdl-shadow--2dp">
            TREASURY
            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select">
                <input class="mdl-textfield__input" type="text" id="point" readonly tab-index="-1" />
                <label class="mdl-textfield__label" for="point">Point</label>
                <ul class="mdl-menu mdl-menu--bottom-left mdl-js-menu" for="point">
                    <li class="mdl-menu__item">Belarus</li>
                    <li class="mdl-menu__item">Russia</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            points: [
                {
                    
                }
            ]
        };
    }
}
</script>

<style lang="sass">
    @import '../main.scss';

    .treasury {
        > div {
            margin: 20px ((100% - $cardSize) / 2);
            padding: 20px;
            width: $cardSize;
        }
    }
</style>
