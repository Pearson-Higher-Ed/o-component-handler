const componentHandler = require('../src/js/component-handler');

function toDashCase(str) {
	return str.replace(/[A-Z]/g, () => '-' + arguments[0].toLowerCase());
}

function lowerCaseFirstChar(str) {
	return str.charAt(0).toLowerCase() + str.slice(1);
}

exports.createTestComponentConfig = (ctor, classAsString) => {
	return {
		constructor: ctor,
		classAsString: classAsString,
		cssClass: toDashCase(lowerCaseFirstChar(classAsString))
	};
};

exports.createAndRegisterTestComponent = (ctor, classAsString) => {
	const config = exports.createTestComponentConfig(ctor, classAsString);

	componentHandler.register(config);

	return config;
};

exports.createAndAppendComponentDomElement = (cssClasses) => {
	if (!Array.isArray(cssClasses)) cssClasses = [cssClasses];

	const el = document.createElement('div');

	cssClasses.forEach((cssClass) => el.classList.add(cssClass));

	document.body.appendChild(el);

	return el;
};
