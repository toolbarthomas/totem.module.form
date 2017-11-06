# Totem module: Form
Apply base styles to the default form elements:

* text input (including password, number etc)
* radiobutton
* checkbox
* select element (singular)
* textarea


## Installation
Install totem.module.form with [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
$ npm install totem.module.form --save
```

## Snippets
The following snippets can be used for including a form element.

### partials/input.twig

```twig

    /**
    *   Outputs a single base input field (text, password, phone etc..)
    *
    *   @param  string   $label   Outputs a label tag above the included field
    *   @param  string[]|boolean[]   $input_attributes   Outputs each item within the array as html attribute; like type, placeholder & value. Can also ouput boolean attributes when the key value has been defined as true.
    */

    {% include "totem_submodules::totem.module.form/partials/input.twig" with {
        label: "My awesome input element",
        input_attributes: {
            type: "search"
            placeholder: "Placeholders are the best"
        }
    } %}
```
### partials/textarea.twig

```twig

    /**
    *   Outputs a textarea
    *
    *   @param  string   $label   Outputs a label tag above the included textarea
    *   @param  string[]|boolean[]   $input_attributes   Outputs each item within the array as html attribute. Can also ouput boolean attributes when the key value has been defined as true.
    */

    {% include "totem_submodules::totem.module.form/partials/textarea.twig" with {
        label: "My awesome textarea",
        input_attributes: {
            rows: 12
        }
    } %}
```

### partials/radio.twig

```twig

    /**
    *   Outputs a single radio button
    *
    *   @param  string   $label   Outputs a label tag aside the included radio button
    *   @param  string[]|boolean[]   $input_attributes   Outputs each item within the array as html attribute. Can also ouput boolean attributes when the key value has been defined as true.
    */

    {% include "totem_submodules::totem.module.form/partials/radio.twig" with {
        label: "Radio button",
        input_attributes: {
            checked: true
        }
    } %}
```

### partials/radio-group.twig

```twig

    /**
    *   Outputs multiple radio buttons and an optional title for the included radio group
    *
    *   @param  string   $label   Outputs a label tag aside the included radio button
    *   @param  ArrayObject[]   $radios   Define each radio from an array, each array accepts the same parameters defined from partials/radio.twig.
    */

    {% include "totem_submodules::totem.module.form/partials/radio-group.twig" with {
        label: "Checkbox group",
        radios: [
            {
                label: "Radio 1",
                input_attributes: {
                    checked: true
                }
            },
            {
                label: "Radio 2"
            }
        ]
    } %}
```

### partials/checkbox.twig

```twig

    /**
    *   Outputs a single checkbox button
    *
    *   @param  string   $label   Outputs a label tag aside the included checkbox button
    *   @param  string[]|boolean[]   $input_attributes   Outputs each item within the array as html attribute. Can also ouput boolean attributes when the key value has been defined as true.
    */

    {% include "totem_submodules::totem.module.form/partials/checkbox.twig" with {
        label: "Checkbox",
        input_attributes: {
            checked: true
        }
    } %}
```

### partials/checkbox-group.twig

```twig

    /**
    *   Outputs multiple checkboxes and an optional title for the included checkbox group
    *
    *   @param  string   $label   Outputs a label tag aside the included radio button
    *   @param  Array[]   $checkboxes   Define each checkbox from an array, each array accepts the same parameters defined from partials/checkbox.twig.
    */

    {% include "totem_submodules::totem.module.form/partials/checkbox-group.twig" with {
        label: "Checkbox group",
        checkboxes: [
            {
                label: "Checkbox 1",
                input_attributes: {
                    checked: true
                }
            },
            {
                label: "Checkbox 2"
            }
        ]
    } %}
```

## Horizontal Layout
You can define a horizontal layout for some partials. With this option you can place the label & field aside  each other.

```twig

    /**
    *   Outputs a single input field with a horizontal layout
    *
    *   @param  string   $row_class   Set an additional class for the .row element.
    *   @param  string   $label_class Adjust the column class for the label column.
    *   @param  string   $field_class Adjust the column class for the input column.
    */

    {% include "totem_submodules::totem.module.form/partials/input.twig" with {
        label: "My awesome input element",
        horizontal_layout: {
            row_class: "row--middle",
            label_class: "scol12 pcol12 col4",
            field_class: "scol12 pcol12 col8"
        }
    } %}

```