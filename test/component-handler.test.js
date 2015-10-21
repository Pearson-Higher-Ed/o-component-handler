/*global describe, it, before, beforeEach, sinon*/

import expect from 'expect.js';
import componentHandler from '../main';
import {
	createAndRegisterTestComponent,
	createAndAppendComponentDomElement
} from './helpers';

describe('componentHandler', () => {

	before(() => {
		window.GlobalComponent = () => {};
	});

	beforeEach(() => {
		document.body.innerHTML = '';
	});

	describe('.upgradeDom(jsClass, cssClass)', () => {

		it('should upgrade all registered components when jsClass and cssClass are undefined', () => {
			const config = createAndRegisterTestComponent(() => {},
				'ComponentTestUpgradeElement');
			const config2 = createAndRegisterTestComponent(() => {},
				'ComponentTestUpgradeElement2');
			const el = createAndAppendComponentDomElement(config.cssClass);
			const el2 = createAndAppendComponentDomElement(config2.cssClass);

			componentHandler.upgradeDom();

			expect(el.getAttribute('data-upgraded')).to.be(config.classAsString);
			expect(el2.getAttribute('data-upgraded')).to.be(config2.classAsString);
		});

		it('should upgrade all registered components matching jsClass', () => {
			const config = createAndRegisterTestComponent(() => {},
				'ComponentTestUpgradeElement');
			const config2 = createAndRegisterTestComponent(() => {},
				'ComponentTestUpgradeElement2');
			const el = createAndAppendComponentDomElement(config.cssClass);
			const el2 = createAndAppendComponentDomElement(config2.cssClass);

			componentHandler.upgradeDom(config.classAsString);

			expect(el.getAttribute('data-upgraded')).to.be(config.classAsString);
			expect(el2.hasAttribute('data-upgraded')).to.be(false);
		});

		it('should upgrade all registered components matching cssClass', () => {
			const cssClass = 'foo';
			const config = createAndRegisterTestComponent(() => {},
				'ComponentTestUpgradeElement');
			const el = createAndAppendComponentDomElement(cssClass);
			const el2 = createAndAppendComponentDomElement(cssClass);

			componentHandler.upgradeDom(config.classAsString, cssClass);

			expect(el.getAttribute('data-upgraded')).to.be(config.classAsString);
			expect(el2.getAttribute('data-upgraded')).to.be(config.classAsString);
		});

	});

	describe('.upgradeElement(element, jsClass)', () => {

		it('should upgrade the element with the components specified in the element\'s \'class\' ' +
			'attribute when jsClass is undefined', () => {
			const config = createAndRegisterTestComponent(() => {},
				'ComponentTestUpgradeElement');
			const el = createAndAppendComponentDomElement(config.cssClass);

			componentHandler.upgradeElement(el);

			expect(el.getAttribute('data-upgraded')).to.be(config.classAsString);
		});

		it('should upgrade the element with the specified component', () => {
			const config = createAndRegisterTestComponent(() => {},
				'ComponentTestUpgradeElement');
			const el = createAndAppendComponentDomElement(config.cssClass);

			componentHandler.upgradeElement(el, config.classAsString);

			expect(el.getAttribute('data-upgraded')).to.be(config.classAsString);
		});

		it('should upgrade the element once when called multiple times', () => {
			const config = createAndRegisterTestComponent(() => {},
				'ComponentTestUpgradeElement');
			const el = createAndAppendComponentDomElement(config.cssClass);

			componentHandler.upgradeElement(el, config.classAsString);
			componentHandler.upgradeElement(el, config.classAsString);

			expect(el.getAttribute('data-upgraded')).to.be(config.classAsString);
		});

		it('should upgrade the element that has already been upgraded with a different component', () => {
			const config = createAndRegisterTestComponent(() => {},
				'ComponentTestUpgradeElement');
			const config2 = createAndRegisterTestComponent(() => {},
				'ComponentTestUpgradeElement2');
			const el = createAndAppendComponentDomElement(config.cssClass);

			el.classList.add('component-test-upgrade-element-2');

			componentHandler.upgradeElement(el, config.classAsString);
			componentHandler.upgradeElement(el, config2.classAsString);

			expect(el.getAttribute('data-upgraded')).to.be(config.classAsString + ',' + config2.classAsString);
		});

		it('should check for the component in the global scope if it cannot be found in the list ' +
			'of registered components', () => {
			const el = createAndAppendComponentDomElement('global-component');

			componentHandler.upgradeElement(el, 'GlobalComponent');

			expect(el.getAttribute('data-upgraded')).to.be('GlobalComponent');
		});

	});

	describe('.upgradeAllRegistered()', () => {

		it('should upgrade all registered components on the page', () => {
			const config = createAndRegisterTestComponent(() => {},
				'ComponentTestUpgradeElement');
			const config2 = createAndRegisterTestComponent(() => {},
				'ComponentTestUpgradeElement2');
			const el = createAndAppendComponentDomElement(config.cssClass);
			const el2 = createAndAppendComponentDomElement(config2.cssClass);

			componentHandler.upgradeAllRegistered();

			expect(el.getAttribute('data-upgraded')).to.be(config.classAsString);
			expect(el2.getAttribute('data-upgraded')).to.be(config2.classAsString);
		});

	});

	describe('.registerUpgradedCallback(jsClass, callback)', () => {

		it('should register the callback function for the provided jsClass', () => {
			const config = createAndRegisterTestComponent(() => {},
				'ComponentTestUpgradeElement');
			const el = createAndAppendComponentDomElement(config.cssClass);
			const callback = sinon.spy();

			componentHandler.registerUpgradedCallback(config.classAsString, callback);

			componentHandler.upgradeElement(el, config.classAsString);

			expect(callback.calledOnce).to.be(true);
		});

	});

	describe('.getInstance(element, jsClass)', () => {

		it('should return null when jsClass is undefined', () => {
			expect(componentHandler.getInstance(document.body)).to.be(null);
		});

		it('should return null when there is no instance of jsClass', () => {
			expect(componentHandler.getInstance(document.body, 'NoInstance')).to.be(null);
		});

		it('should return the instance', () => {
			function ComponentTestGetInstance() {}

			const config = createAndRegisterTestComponent(ComponentTestGetInstance,
				'ComponentTestGetInstance');
			const el = createAndAppendComponentDomElement(config.cssClass);

			componentHandler.upgradeElement(el, config.classAsString);

			const instance = componentHandler.getInstance(el, config.classAsString);

			expect(instance instanceof ComponentTestGetInstance).to.be(true);
		});

	});

});
