'use strict';

var proxyLoader = function(source)
{
	if (this && this.cacheable) this.cacheable();
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

	var cacheToRequire = [];
	for (var key in cache)
	{
		var value = cache[key];
		cacheToRequire.push('\'' + key + '\': function(){return require(\'' + value.name + '\');}');
	}

	results.push(cacheToRequire.join(',\n'));
	results.push('};');

	// The injector function
	function injector(inject)
	{
		// Override require
		var require = function(moduleName)
		{
			if (inject && inject[moduleName])
			{
				return inject[moduleName];
			}

			if (!cache[moduleName])
			{
				throw 'Could not find module: ' + moduleName;
			}
			return cache[moduleName]();
		};

		// Global module exporters
		var module = {exports: {}};
		var exports = module.exports;

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
				var result;
				if (moduleDef instanceof Function)
				{
					result = moduleDef(require, module.exports, module);
				}
				else if (moduleDef instanceof Object)
				{
					result = moduleDef;
				}

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

	// Grab the injection block's source and implant the module's source
	var injectorBlock = injector.toString().split('__INJECTION_POINT__').join(source);

	results.push(injectorBlock);

	var tail = [
		'module.exports = injector;'
	];

	return results.concat(tail).join('\n');
};

module.exports = proxyLoader;
