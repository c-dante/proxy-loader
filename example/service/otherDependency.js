'use strict';

define(function(require, exports)
{
	var otherDependency = function(path)
	{
		return 'Origional AMD exports.action. ' + path;
	};

	exports.otherAction = otherDependency;
});
