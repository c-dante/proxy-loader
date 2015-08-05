'use strict';

var chai = require('chai');

// Chai
var expect = chai.expect;

// Proxy loader module
var proxyLoader = require('../src/index');

describe('proxy-loader', function()
{
	// Currently asserts the result has a config object and it contains the corret map.
	describe('Loading a module\'s dependencies into cache', function()
	{
		function extractCache(src)
		{
			var cacheRegex = /var cache = ({[\W\w]*};)\s*function injector/g;

			var res = cacheRegex.exec(src);

			return res && res.length > 1 && res[1];
		}

		it('should work for CommonJS', function(done)
		{
			var factory = proxyLoader(validCommonJs);

			var cacheObjStr = extractCache(factory);

			expect(cacheObjStr).to.include('\'module\':');
			expect(cacheObjStr).to.include('\'otherModule\':');
			expect(cacheObjStr).to.include('\'lodash/map\':');
			expect(cacheObjStr).to.include('\'lodash/delay\':');

			done();
		});

		it('should work for AMD', function(done)
		{
			var factory = proxyLoader(validAMD);

			var cacheObjStr = extractCache(factory);

			expect(cacheObjStr).to.include('\'module\':');
			expect(cacheObjStr).to.include('\'otherModule\':');
			expect(cacheObjStr).to.include('\'lodash/map\':');
			expect(cacheObjStr).to.include('\'lodash/delay\':');

			done();
		});
	});

	describe('Including module source inside factory', function()
	{
		it('should work for CommonJS', function(done)
		{
			var factory = proxyLoader(validCommonJs);

			expect(factory).to.include(validCommonJs);

			done();
		});

		it('should work for AMD', function(done)
		{
			var factory = proxyLoader(validAMD);

			expect(factory).to.include(validAMD);

			done();
		});
	});

	describe('Bugs', function()
	{
		// Old code has string.replace which has special characters
		it('should not break when the srouce code has $ characters', function(done)
		{
			done();
		});
	});

	// Test strings
	var validCommonJs = '\'use strict\'' +
		'var x = require(\'module\'),' +
		'y = require(\'otherModule\');' +
		'var _ = {' +
		'	map: require(\'lodash/map\')' +
		'	delay: require(\'lodash/delay\')' +
		'}' +
		'var valid = \'string($\' + 500 + \')\';' +
		'module.exports = \'string\'';

	var validAMD = '\'use strict\'' +
		'define(function(require, module){' +
		'var x = require(\'module\'),' +
		'y = require(\'otherModule\');' +
		'var _ = {' +
		'	map: require(\'lodash/map\')' +
		'	delay: require(\'lodash/delay\')' +
		'}' +
		'module.exports = \'string\'' +
		'});';
});
