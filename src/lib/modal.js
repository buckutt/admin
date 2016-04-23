import Vue from 'vue';

/* global jQuery */

Vue.directive('modal', {
    bind () {
        const $el = jQuery(this.el);
        $el.children('.modal__close').click(() => {
            $el.fadeOut();
        });

        $el.click(() => {
            this.vm.$data[this.expression] = false;
        });

        $el.children().first().click(e => {
            e.stopPropagation();
        });

        $el.css('opacity', 0).hide();
    },

    update (show) {
        const $el = jQuery(this.el);

        if (show === false) {
            $el.css('opacity', 0);
            setTimeout(() => {
                $el.hide();
            }, 300);
        } else {
            $el.show();
            setTimeout(() => {
                $el.css('opacity', 1);
            }, 50);
        }
    }
});
