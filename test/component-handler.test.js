/*global describe, it, before, beforeEach*/
'use strict';

var expect = require('expect.js');
var sinon = require('sinon');
var componentHandler = require('../src/js/component-handler');

var helpers = require('./helpers');
var createAndRegisterTestComponent = helpers.createAndRegisterTestComponent;
var createAndAppendComponentDomElement = helpers.createAndAppendComponentDomElement;

describe('componentHandler', function () {

	before(function () {
		window.GlobalComponent = function () {};
	});

	beforeEach(function () {
		document.body.innerHTML = '';
	});

	describe('.upgradeDom(jsClass, cssClass)', function() {

		it('should upgrade all registered components when jsClass and cssClass are undefined', function () {
			var config = createAndRegisterTestComponent(function ComponentTestUpgradeElement() {},
				'ComponentTestUpgradeElement');
			var config2 = createAndRegisterTestComponent(function ComponentTestUpgradeElement() {},
				'ComponentTestUpgradeElement2');
			var el = createAndAppendComponentDomElement(config.cssClass);
			var el2 = createAndAppendComponentDomElement(config2.cssClass);

			componentHandler.upgradeDom();

			expect(el.getAttribute('data-upgraded')).to.be(config.classAsString);
			expect(el2.getAttribute('data-upgraded')).to.be(config2.classAsString);
		});

		it('should upgrade all registered components matching jsClass', function () {
			var config = createAndRegisterTestComponent(function ComponentTestUpgradeElement() {},
				'ComponentTestUpgradeElement');
			var config2 = createAndRegisterTestComponent(function ComponentTestUpgradeElement() {},
				'ComponentTestUpgradeElement2');
			var el = createAndAppendComponentDomElement(config.cssClass);
			var el2 = createAndAppendComponentDomElement(config2.cssClass);

			componentHandler.upgradeDom(config.classAsString);

			expect(el.getAttribute('data-upgraded')).to.be(config.classAsString);
			expect(el2.hasAttribute('data-upgraded')).to.be(false);
		});

		it('should upgrade all registered components matching cssClass', function () {
			var cssClass = 'foo';
			var config = createAndRegisterTestComponent(function ComponentTestUpgradeElement() {},
				'ComponentTestUpgradeElement');
			var el = createAndAppendComponentDomElement(cssClass);
			var el2 = createAndAppendComponentDomElement(cssClass);

			componentHandler.upgradeDom(config.classAsString, cssClass);

			expect(el.getAttribute('data-upgraded')).to.be(config.classAsString);
			expect(el2.getAttribute('data-upgraded')).to.be(config.classAsString);
		});

	});

	describe('.upgradeElement(element, jsClass)', function () {

		it('should upgrade the element with the components specified in the element\'s \'class\' ' +
			'attribute when jsClass is undefined', function () {
			var config = createAndRegisterTestComponent(function ComponentTestUpgradeElement() {},
				'ComponentTestUpgradeElement');
			var el = createAndAppendComponentDomElement(config.cssClass);

			componentHandler.upgradeElement(el);

			expect(el.getAttribute('data-upgraded')).to.be(config.classAsString);
		});

		it('should upgrade the element with the specified component', function () {
			var config = createAndRegisterTestComponent(function ComponentTestUpgradeElement() {},
				'ComponentTestUpgradeElement');
			var el = createAndAppendComponentDomElement(config.cssClass);

			componentHandler.upgradeElement(el, config.classAsString);

			expect(el.getAttribute('data-upgraded')).to.be(config.classAsString);
		});

		it('should upgrade the element once when called multiple times', function () {
			var config = createAndRegisterTestComponent(function ComponentTestUpgradeElement() {},
				'ComponentTestUpgradeElement');
			var el = createAndAppendComponentDomElement(config.cssClass);

			componentHandler.upgradeElement(el, config.classAsString);
			componentHandler.upgradeElement(el, config.classAsString);

			expect(el.getAttribute('data-upgraded')).to.be(config.classAsString);
		});

		it('should upgrade the element that has already been upgraded with a different component', function () {
			var config = createAndRegisterTestComponent(function ComponentTestUpgradeElement() {},
				'ComponentTestUpgradeElement');
			var config2 = createAndRegisterTestComponent(function ComponentTestUpgradeElement() {},
				'ComponentTestUpgradeElement2');
			var el = createAndAppendComponentDomElement(config.cssClass);

			el.classList.add('component-test-upgrade-element-2');

			componentHandler.upgradeElement(el, config.classAsString);
			componentHandler.upgradeElement(el, config2.classAsString);

			expect(el.getAttribute('data-upgraded')).to.be(config.classAsString + ',' + config2.classAsString);
		});

		it('should check for the component in the global scope if it cannot be found in the list ' +
			'of registered components', function () {
			var el = createAndAppendComponentDomElement('global-component');

			componentHandler.upgradeElement(el, 'GlobalComponent');

			expect(el.getAttribute('data-upgraded')).to.be('GlobalComponent');
		});

	});

	describe('.register(config)', function () {

		it('should upgrade the existing DOM', function () {
			function ComponentTestRegister() {}

			var config = {
				constructor: ComponentTestRegister,
				classAsString: 'ComponentTestRegister',
				cssClass: 'component-test-register'
			};

			var el = document.createElement('div');

			el.classList.add(config.cssClass);
			document.body.appendChild(el);

			componentHandler.register(config);

			expect(el.getAttribute('data-upgraded')).to.be(config.classAsString);
		});

	});

	describe('.registerUpgradedCallback(jsClass, callback)', function () {

		it('should register the callback function for the provided jsClass', function () {
			var config = createAndRegisterTestComponent(function ComponentTestUpgradeElement() {},
				'ComponentTestUpgradeElement');
			var el = createAndAppendComponentDomElement(config.cssClass);
			var callback = sinon.spy();

			componentHandler.registerUpgradedCallback(config.classAsString, callback);

			componentHandler.upgradeElement(el, config.classAsString);

			expect(callback.calledOnce).to.be(true);
		});

	});

	describe('.upgradeAllRegistered()', function () {

		it('should upgrade all registered components on the page', function () {
			var config = createAndRegisterTestComponent(function ComponentTestUpgradeElement() {},
				'ComponentTestUpgradeElement');
			var config2 = createAndRegisterTestComponent(function ComponentTestUpgradeElement() {},
				'ComponentTestUpgradeElement2');
			var el = createAndAppendComponentDomElement(config.cssClass);
			var el2 = createAndAppendComponentDomElement(config2.cssClass);

			componentHandler.upgradeAllRegistered();

			expect(el.getAttribute('data-upgraded')).to.be(config.classAsString);
			expect(el2.getAttribute('data-upgraded')).to.be(config2.classAsString);
		});

	});

});
