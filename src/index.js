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
		// Override require
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

		// Global module exporters
		var module = {exports: {}};

		// A getter that can switch between CommonJS or AMD
		var getResult = function()
		{
			return module.exports;
		};

		var define = function(moduleDef)
		{
			// Update getResult to support AMD
			getResult = function()
			{
				var result = moduleDef(require, module);

				// Support AMD modules which export through module.exports inside a define
				if (!result && module.exports)
				{
					return module.exports;
				}

				return result;
			};

			return getResult;
		};
		define.amd = true;

		// Finally, run the module with the overridden define and module objects.
		return (function()
		{
			__INJECTION_POINT__

			return getResult();
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
