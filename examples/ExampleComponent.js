import componentHandler from 'o-component-handler';

export default class ExampleComponent {

	constructor(element) {
		this.element_ = element;
		this.init();
	}

	init() {
		if (this.element_) {
			this.element_.addEventListener('click', this.handleClick_.bind(this));
		}
	}

	handleClick_() {
		console.log('ExampleComponent: click');
	}
}

componentHandler.register({
	constructor: ExampleComponent,
	classAsString: 'ExampleComponent',
	cssClass: 'o-example-component'
});
