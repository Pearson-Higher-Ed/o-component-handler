# o-component-handler [![Build Status](https://travis-ci.org/Pearson-Higher-Ed/o-component-handler.svg)](https://travis-ci.org/Pearson-Higher-Ed/o-component-handler)

Handles registration of new Origami components so that DOM upgrades are handled on page load and elements can be upgraded after initial page load.

## Quick start

```js
const componentHandler = require('o-component-handler');

document.addEventListener('DOMContentLoaded', () => {
	componentHandler.upgradeAllRegistered();
});
```

## API

### componentHandler.upgradeAllRegistered()

Upgrades all registered components found in the current DOM.

### componentHandler.upgradeDom(jsClass, cssClass)

Searches existing DOM for elements of the specified component type and upgrades them if they have not already been upgraded.

- jsClass **string**: *Optional*. The programmatic name of the component. For Origami components, this should be the name of the constructor function, e.g. `DropdownMenu`.
- cssClass **string**: *Optional*. The CSS class name. All elements with the matching class name will be upgraded.

### componentHandler.upgradeElement(element, jsClass)

Upgrades a single element.

- element: The DOM element to be upgraded.
- jsClass **string**: *Optional*. The programmatic name of the component. If omitted, the element will be upgraded with all registered components that match the element's `class` attribute.

```html
<div id="example" class="o-example-component"></div>
```

```js
// Upgrade the element with ExampleComponent
componentHandler.upgradeElement(document.getElementById('example'));
```

### componentHandler.registerUpgradedCallback(jsClass, callback)

Allows the consumer to be alerted to any upgrades that are performed for a given component type.

* jsClass **string**: The programmatic name of the component.
* callback **Function**: The function to call when an upgrade occurs.

```js
componentHandler.registerUpgradedCallback('ExampleComponent', () => {
	// The component was upgraded
});

// The registered callback will be executed when `ExampleComponent` is
// upgraded
componentHandler.upgradeDom('ExampleComponent');
```

### componentHandler.register(config)

Registers a class for future use and attempts to upgrade existing DOM. This method should be invoked by the Origami component implementation.

* config **Object**. An object with the following properties:
	* classConstructor **Function**: The component's constructor function.
	* className **string**: The name of the constructor function as a string. This should generally be the normalized version of the Origami module name, e.g. `ExampleComponent` for `o-example-component`.
	* cssClass **string**: The CSS class string, which should be the name of the Origami module, e.g. `o-example-component`.

## Registering a component

Origami components should register themselves with the component handler (see [examples](examples)).

## License

This software is published by Pearson Education under the [MIT license](LICENSE).

