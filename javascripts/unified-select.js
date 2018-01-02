(function (win, doc, $) {

    var globals = {};

    window.setUnifiedSelect = function(options) {

        if(typeof options != 'object') {
            options = {};
        }

        // append the options
        globals.options = options;

        var unified_selects = $('select.unified-select').not('.js__unified-select--ready');

        if (unified_selects.length === 0) {
            return;
        }

        $(document).on({
            'totem.module.form.unified-select.init': function (event, unified_select) {
                if (unified_select == null) {
                    return;
                }

                defineObjects(unified_select);
                defineGlyph(unified_select);
                defineAttributes(unified_select);
                defineSelectValue(unified_select);
            },
        });

        unified_selects.each(function() {

            var unified_select = $(this);

            $(document).trigger('totem.module.form.unified-select.init', [unified_select]);

            var unified_select__wrapper = unified_select.parent('.unified-select__wrapper');

            unified_select.off('focus blur keyup change').on({
                focus: function () {
                    focusSelect(unified_select)
                },
                blur: function () {
                    blurSelect(unified_select)
                },
                keyup: function () {
                    unified_select.blur().focus();
                },
                change: function () {
                    defineSelectValue(unified_select);
                }
            });

            unified_select__wrapper.addClass('js__unified-select--ready');
        });
    };

    // Return True || False if we have the option
    function getOption(option) {
        try {
            return (globals.options[option] != null);
        } catch (error) {
            return false;
        }
    }

    // Append all elements for the naked select element
    function defineObjects(unified_select) {

        //Check if select element has any wrapper elements
        var wrapper = unified_select.closest('.unified-select__wrapper');

        if (wrapper.length !== 0) {
            return;
        }

        unified_select.wrap('<div class="unified-select__wrapper"></div>');

        wrapper = unified_select.closest('.unified-select__wrapper');

        // Append the select field glyph
        wrapper.prepend('<div class="unified-select__glyph-wrapper"></div>');

        // Set the select field that will contain the selected value
        wrapper.prepend('<div class="unified-select__field-wrapper"><div class="unified-select__field"><div class="unified-select__field-value"></div></div></div>');

    }

    function defineGlyph(unified_select) {

        var glyph = '<span class="unified-select__glyph"></span>';

        if (getOption('glyph')) {
            glyph = '<svg class="glyph unified-select__glyph ' + globals.options.glyph + '" role="img"><use xlink:href="#' + globals.options.glyph + '"></use></svg>';
        }

        var glyph_wrapper = unified_select.siblings('.unified-select__glyph-wrapper');

        glyph_wrapper.append(glyph);
    }

    // Add classnames if the select element has attributes defined
    function defineAttributes(unified_select) {
        var attributes = [
            'autofocus',
            'disabled',
            'multiple',
            'required'
        ];

        for (var i = 0; i < attributes.length; i++) {

            if (!unified_select.prop(attributes[i])) {
                continue;
            }

            var unified_select__wrapper = unified_select.parent('.unified-select__wrapper');

            unified_select__wrapper.addClass('js__unified-select--' + attributes[i]);
        }
    }

    function defineSelectValue(unified_select) {
        var field = unified_select.siblings('.unified-select__field-wrapper').find('.unified-select__field-value');

        if (field.length === 0) {
            return;
        }

        var selected_index = unified_select.get(0).selectedIndex;

        var option = unified_select.find('option').eq(selected_index);

        if (option.length === 0) {
            return;
        }

        // Try to define the label from the label attribute
        var label = option.attr('label');
        // Fallback to the actual option text
        if (typeof label === 'undefined') {
            label = option.text();
        }

        // Set the actual selected value!
        field.html(label);
    }

    function focusSelect(unified_select) {
        var unified_select__wrapper = unified_select.parent('.unified-select__wrapper');

        unified_select__wrapper.addClass('js__unified-select--focus');
    }

    function blurSelect(unified_select) {
        var unified_select__wrapper = unified_select.parent('.unified-select__wrapper');

        unified_select__wrapper.removeClass('js__unified-select--focus');
    }

    function changeSelectedIndex(unified_select, index) {
        // Abort if the current select element is disabled
        if (unified_select.prop('disabled')) {
            return;
        }

        // Abort if our index is not a valid integer
        if(isNaN(parseFloat(index))) {
            return;
        }

        // Check if the new index doesn't match the selectedIndex
        var selected_index = unified_select.get(0).selectedIndex;
        if (selected_index === index) {
            return;
        }

        // Check if the selected option is not disabled
        var selected_option = unified_select.find('option').eq(index);
        if(selected_option.prop('disabled')) {
            return;
        }

        // Set the new index
        unified_select.get(0).selectedIndex = index;

        unified_select.trigger('change');

    }

})(window.jQuery(window), window.jQuery(document), window.jQuery);