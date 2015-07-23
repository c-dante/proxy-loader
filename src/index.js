'use strict';

var _ = require('lodash');

var proxyLoader = function(source)
{
	var extract = /(require\s*\()['"]?([^\)'"]*)['"]?(\))/g;

	var cache = {};

	var x;
	while (x = extract.exec(source))
	{
		cache[x[2]] = {
			prefix: x[1],
			name: x[2],
			postfix: x[3]
		};
	}

	var results = [
		'\'use strict\';',
		'var cache = {'
	];

	var cacheToReuire = _.map(cache, function(value, key)
	{
		return '\'' + key + '\': require(\'' + value.name + '\')';
	}).join(',\n');

	results.push(cacheToReuire);
	results.push('};');

	// The injector function
	function injector(inject)
	{
		var module = {exports: {}};
		var require = function(moduleName)
		{
			if (inject[moduleName])
			{
				return inject[moduleName];
			}

			if (!cache[moduleName])
			{
				throw 'Could not find module: ' + moduleName;
			}
			return cache[moduleName];
		};

		return (function()
		{
			__INJECTION_POINT__

			return module.exports;
		})();
	}

	var injectorBlock = injector.toString().replace('__INJECTION_POINT__', source);

	results.push(injectorBlock);

	var tail = [
		'module.exports = injector;'
	];

	results = results.concat(tail).join('\n');

	return results;
};

module.exports = proxyLoader;
