/**
 * Adapted from https://github.com/jasonmayes/mdl-component-design-pattern,
 * written by Jason Mayes.
 */

const registeredComponents_ = [];
const createdComponents_ = [];


/**
* Searches registered components for a class we are interested in using.
* Optionally replaces a match with passed object if specified.
* @param {string} name The name of a class we want to use.
* @param {object} opt_replace Optional object to replace match with.
* @returns {Object | false} The registered component or false.
* @private
*/
function findRegisteredClass_(name, opt_replace) {
	for (let i = 0; i < registeredComponents_.length; i++) {
		if (registeredComponents_[i].className === name) {
			if (opt_replace !== undefined) {
				registeredComponents_[i] = opt_replace;
			}

			return registeredComponents_[i];
		}
	}

	return false;
}


/**
* Searches existing DOM for elements of the specified component type and upgrades them
* if they have not already been upgraded.
* @param {string} jsClass The programatic name of the element class we need
* to create a new instance of.
* @param {string} cssClass The name of the CSS class elements of this type
* will have.
* @returns {undefined} No return.
*/
function upgradeDomInternal(jsClass, cssClass) {
	if (jsClass === undefined && cssClass === undefined) {
		for (let i = 0; i < registeredComponents_.length; i++) {
			upgradeDomInternal(registeredComponents_[i].className,
				registeredComponents_[i].cssClass);
		}
	} else {
		if (cssClass === undefined) {
			const registeredClass = findRegisteredClass_(jsClass);

			if (registeredClass) {
				cssClass = registeredClass.cssClass;
			}
		}

		const elements = document.querySelectorAll('.' + cssClass);

		for (let n = 0; n < elements.length; n++) {
			upgradeElementInternal(elements[n], jsClass);
		}
	}
}


/**
* Upgrades a specific element rather than all in the DOM.
* @param {HTMLElement} element The element we wish to upgrade.
* @param {string} jsClass The name of the class we want to upgrade
* the element to.
* @returns {undefined} No return.
*/
function upgradeElementInternal(element, jsClass) {
	if (jsClass === undefined) {
		for (let i = 0; i < registeredComponents_.length; i++) {
			const elemClasses = element.getAttribute('class').split(' ');

			if (elemClasses.indexOf(registeredComponents_[i].cssClass) >= 0) {
				upgradeElementInternal(element, registeredComponents_[i].className);
			}
		}

		return;
	}

	// Only upgrade elements that have not already been upgraded for the given
	// Class type. This allows you to upgrade an element with multiple classes.
	let dataUpgraded = element.getAttribute('data-upgraded');
	if (dataUpgraded === null || dataUpgraded.indexOf(jsClass) === -1) {
		// Upgrade element.
		if (dataUpgraded === null) {
			dataUpgraded = '';
		} else {
			dataUpgraded += ',';
		}

		element.setAttribute('data-upgraded', dataUpgraded + jsClass);
		const registeredClass = findRegisteredClass_(jsClass);
		if (registeredClass) {
			const Component = registeredClass.classConstructor;
			createdComponents_.push(new Component(element));
			// Call any callbacks the user has registered with this component type.
			registeredClass.callbacks.forEach(function (callback) {
				callback(element);
			});
		} else {
			// If component creator forgot to register, try and see if
			// it is in global scope.
			createdComponents_.push(new window[jsClass](element));
		}
	}
}


/**
* Registers a class for future use and attempts to upgrade existing DOM.
* @param {object} config An object containting:
* {constructor: Constructor, classAsString: string, cssClass: string}
* @returns {undefined} No return.
*/
function registerInternal(config) {
	const newConfig = {
		'classConstructor': config.constructor,
		'className': config.classAsString,
		'cssClass': config.cssClass,
		'callbacks': []
	};

	const found = findRegisteredClass_(config.classAsString, newConfig);

	if (!found) {
		registeredComponents_.push(newConfig);
	}

	upgradeDomInternal(config.classAsString, config.cssClass);
}


/**
* Allows user to be alerted to any upgrades that are performed for a given
* component type
* @param {string} jsClass The class name of the MDL component we wish
* to hook into for any upgrades performed.
* @param {function} callback The function to call upon an upgrade. This
* function should expect 1 parameter - the HTMLElement which got upgraded.
* @returns {undefined} No return.
*/
function registerUpgradedCallbackInternal(jsClass, callback) {
	const regClass = findRegisteredClass_(jsClass);
	if (regClass) {
		regClass.callbacks.push(callback);
	}
}


/**
* Upgrades all registered components found in the current DOM. This is
* automatically called on window load.
* @returns {undefined} No return.
*/
function upgradeAllRegisteredInternal() {
	for (let n = 0; n < registeredComponents_.length; n++) {
		upgradeDomInternal(registeredComponents_[n].className);
	}
}


// Export the public API
module.exports = {
	upgradeDom: upgradeDomInternal,
	upgradeElement: upgradeElementInternal,
	upgradeAllRegistered: upgradeAllRegisteredInternal,
	registerUpgradedCallback: registerUpgradedCallbackInternal,
	register: registerInternal
};
