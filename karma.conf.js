/*eslint-env node*/
/*eslint strict:0*/

const BowerPlugin = require('bower-webpack-plugin');
const path = require('path');
const cwd = process.cwd();

module.exports = (config) => {
	'use strict';

	const settings = {

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',


		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['mocha', 'sinon'],


		// list of plugins
		plugins: [
			'karma-coverage',
			'karma-mocha',
			'karma-phantomjs-launcher',
			'karma-sinon',
			'karma-sourcemap-loader',
			'karma-webpack'
		],


		// list of files / patterns to load in the browser
		files: [
			'http://polyfill.webservices.ft.com/v1/polyfill.js?ua=safari/4',
			'test/*.test.js'
		],


		// list of files to exclude
		exclude: [],


		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			'test/*.js': ['webpack', 'sourcemap']
		},


		// webpack preprocessor options
		webpack: {
			quiet: true,
			module: {
				loaders: [
					{
						test: /\.js$/,
						exclude: /node_modules/,
						loaders: [
							// Disables AMD module loading
							'imports?define=>false',
							'babel?optional[]=runtime'
						]
					}
				]
			},
			resolve: {
				root: [path.join(cwd, 'bower_components')]
			},
			plugins: [
				new BowerPlugin({
					includes:  /\.js$/
				})
			],
			devtool: 'inline-source-map'
		},


		// Hide webpack output logging
		webpackMiddleware: {
			noInfo: true
		},


		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['progress'],


		// web server port
		port: 9876,


		// enable / disable colors in the output (reporters and logs)
		colors: true,


		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,


		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,


		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['PhantomJS'],


		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: true

	};

	if (process.env.COVERAGE) {
		const webpackModuleSettings = settings.webpack.module;

		settings.reporters = (settings.reporters || []).concat(['coverage']);

		settings.coverageReporter = {
			dir: 'build/reports/coverage',
			reporters: [
				{ type: 'lcovonly', subdir: '.', file: 'coverage.lcov' },
				{ type: 'html', subdir: 'report-html' }
			]
		};

		webpackModuleSettings.loaders =
			(webpackModuleSettings.loaders || []).concat([
				{
                    test: /\.js$/,
                    // include: path.resolve('src/js/'),
                    exclude: /(test|node_modules|bower_components)/,
                    loader: 'isparta'
                }
			]);
	}

	config.set(settings);
};
