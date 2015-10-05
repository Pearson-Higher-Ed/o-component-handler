'use strict';

var componentHandler = require('../src/js/component-handler');

function toDashCase(str) {
	return str.replace(/[A-Z]/g, function () { return '-' + arguments[0].toLowerCase() });
}

function lowerCaseFirstChar(str) {
	return str.charAt(0).toLowerCase() + str.slice(1);
}

exports.createTestComponentConfig = function (ctor, classAsString) {
	return {
		constructor: ctor,
		classAsString: classAsString,
		cssClass: toDashCase(lowerCaseFirstChar(classAsString))
	};
};

exports.createAndRegisterTestComponent = function (ctor, classAsString) {
	var config = exports.createTestComponentConfig(ctor, classAsString);

	componentHandler.register(config);

	return config;
};

exports.createAndAppendComponentDomElement = function (cssClasses) {
	if (!Array.isArray(cssClasses)) cssClasses = [cssClasses];

	var el = document.createElement('div');

	cssClasses.forEach(function (cssClass) {
		el.classList.add(cssClass);
	});

	document.body.appendChild(el);

	return el;
};
