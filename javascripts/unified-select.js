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

                defineField(unified_select);
                defineDropdown(unified_select);
                defineOptions(unified_select);
                defineGlyph(unified_select);
                defineSelectAttributes(unified_select);
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
    function defineField(unified_select) {

        //Check if select element has any wrapper elements
        var wrapper = unified_select.closest('.unified-select__wrapper');

        if (wrapper.length != 0) {
            return;
        }

        unified_select.wrap('<div class="unified-select__wrapper"></div>');

        wrapper = unified_select.closest('.unified-select__wrapper');

        // Prepend the select field glyph
        wrapper.prepend('<div class="unified-select__glyph-wrapper"></div>');

        // Set the select field that will contain the selected value
        wrapper.prepend('<div class="unified-select__field-wrapper"><div class="unified-select__field"><div class="unified-select__field-value"></div></div></div>');
    }

    // Append the dropdown and add the event listeners for it
    function defineDropdown(unified_select) {
        if (!getOption('dropdown')) {
            return;
        }

        // Disable the tabindex for our select elementso we
        // can't trigger the select element with our keyboard
        unified_select.attr('tabindex', '-1');

        var wrapper = unified_select.closest('.unified-select__wrapper');

        // Set the dropdown panel
        wrapper.append('<div class="unified-select__dropdown"><div class="unified-select__dropdown__panel"></div></div>');

        var field_wrapper = wrapper.find('.unified-select__field-wrapper');

        // Enable support for tabbing the selectbox
        field_wrapper.attr('tabindex', '0');

        // Trigger click event on select field wrapping element
        field_wrapper.on({
            click: function (event) {
                event.preventDefault();

                toggleDropdown(unified_select);
            },
            focus: function() {
                focusSelect(unified_select);
            },
            blur: function() {
                blurSelect(unified_select);
            }
        });

        // Add the dropdown class on the main element to set all necessary styles correctly
        wrapper.addClass('js__unified-select--dropdown-ready');

        // Remove focus & blur events on the select element since we can't select it anymore in combination with the custom dropdown
        unified_select.off('focus blur');
    }

    function openDropdown(unified_select) {
        var wrapper = unified_select.closest('.unified-select__wrapper');

        if (wrapper.length === 0) {
            return;
        }

        wrapper.addClass('js__unified-select--dropdown-active');
    }

    function closeDropdown(unified_select) {
        var wrapper = unified_select.closest('.unified-select__wrapper');

        if (wrapper.length === 0) {
            return;
        }

        wrapper.removeClass('js__unified-select--dropdown-active');
    }

    function toggleDropdown(unified_select) {
        var wrapper = unified_select.closest('.unified-select__wrapper');

        if (wrapper.length === 0) {
            return;
        }

        wrapper.toggleClass('js__unified-select--dropdown-active');
    }

    // Append all know option tags as interactive DOM elements
    function defineOptions(unified_select) {

        if (!getOption('dropdown')) {
            return;
        }

        var wrapper = unified_select.closest('.unified-select__wrapper');
        var options = unified_select.find('option');

        // Abort if we have no options.
        if (options.length === 0) {
            return;
        }

        var dropdown__panel = wrapper.find('.unified-select__dropdown__panel');
        var dropdown__options = dropdown__panel.find('.unified-select__dropdown__options');


        // Check if the generated options have been defined
        // or empty the current previously defined options
        if (dropdown__options.length === 0) {
            dropdown__panel.append('<div class="unified-select__dropdown__options"></div>');

            // Update dropdown__options variable after appending it to it's parent
            dropdown__options = dropdown__panel.find('.unified-select__dropdown__options');
        }
        else {
            dropdown__options.empty();
        }

        // Append each option
        options.each(function(index) {
            var option = $(this);

            // Try to define the label from the label attribute
            var label = option.attr('label');
            // Fallback to the actual option text
            if (typeof label === 'undefined') {
                label = option.text();
            }

            var classes = defineOptionAttributes(option);

            dropdown__options.append('<div class="unified-select__dropdown__option' + classes + '" data-unified-select-option-index="' + index + '">' + label + '</div>');
        });

        // Define options
        var dropdown__option = $('.unified-select__dropdown__option');

        dropdown__option.on({
            click : function(event) {
                var $this = $(this);
                var index = $this.data('unified-select-option-index');

                if(isNaN(parseFloat(index))) {
                    return;
                }

                changeSelectedIndex(unified_select, index);

            }
        });
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
    function defineSelectAttributes(unified_select) {
        var attributes = [
            'autofocus',
            'disabled',
            'multiple',
            'required'
        ];

        var unified_select__wrapper = unified_select.closest('.unified-select__wrapper');

        if (unified_select__wrapper.length == 0) {
            return;
        }

        for (var i = 0; i < attributes.length; i++) {

            if (!unified_select.prop(attributes[i])) {
                continue;
            }

            unified_select__wrapper.addClass('js__unified-select--' + attributes[i]);
        }
    }

    function defineOptionAttributes(option) {
        var attributes = [
            'disabled',
            'selected'
        ];

        var classname = '';

        for (var i = 0; i < attributes.length; i++) {

            if (!option.prop(attributes[i])) {
                continue;
            }

            classname += ' js__unified-select__dropdown__option--' + attributes[i];
        }

        return classname;
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

        // Close the dropdown after change event if we have no multiple attribute defined
        if (!unified_select.prop('multiple')) {
            closeDropdown(unified_select);
        }

        // Set the new index
        unified_select.get(0).selectedIndex = index;

        unified_select.trigger('change');

    }

})(window.jQuery(window), window.jQuery(document), window.jQuery);