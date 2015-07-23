'use strict';

var config = {
	resolveLoader: {
		alias: {
			proxy: __dirname + '/src/index.js'
		}
	},
	devtool: 'source-map',
	debug: true,
	context: __dirname + '/build',
	entry: './entry',
	output: {
		filename: '[name].bundle.js',
		path: __dirname + '/bin'
	}
};

module.exports = config;
