import Vue from 'vue';

Vue.directive('stylized', {
    bind () {
        const $el           = jQuery(this.el);
        const $options      = $el.children('option');
        const optionsLength = $options.length;

        const $styledSelect = jQuery('<div class="select-styled"></div>');

        $el.addClass('select-hidden');
        $el.wrap('<div class="select"></div>');
        $el.after($styledSelect);

        $styledSelect.text($el.children('option').eq(0).text());

        const $list = jQuery('<ul/>')
            .addClass('select-options')
            .insertAfter($styledSelect);

        const $listItems = $options.map(function ($option) {
            return jQuery('<li/>', {
                text: this.textContent,
                rel: this.value
            }).appendTo($list);
        });

        $styledSelect.click(function (e) {
            e.stopPropagation();

            jQuery('div.select-styled.active').each(function() {
                jQuery(this).removeClass('active').next('ul.select-options').hide();
            });


            jQuery(this).toggleClass('active').next('ul.select-options').toggle();
        });

        $listItems.click(function (e) {
            e.stopPropagation();
            const $item = jQuery(this);
            $styledSelect.text($item.text()).removeClass('active');
            $el.val($item.attr('rel'));
            $list.hide();
        });
    },

    update (items) {
        if (items && items.length === 0) {
            return;
        }

        const $el           = jQuery(this.el);
        const $list         = $el.next().next().empty();
        const $options      = $el.children('option');
        const optionsLength = $options.length;

        const $listItems = $options.map(function ($option) {
            return jQuery('<li/>', {
                text: this.textContent,
                rel: this.value
            }).appendTo($list);
        });

        setTimeout(() => {
            $list.children('li').click(function (e) {
                e.stopPropagation();
                const $item = jQuery(this);
                $el.next().text($item.text()).removeClass('active');
                $el.val($item.attr('rel'));
                $list.hide();
            });
        });
    }
});
