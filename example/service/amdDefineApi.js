'use strict';

define(function(require, module)
{
	var apiDependency = require('./apiDependency');

	var API = function(base)
	{
		this.path = base;
	};

	API.prototype.makeRequest = function()
	{
		return apiDependency.doAction(this.path);
	};

	module.exports = API;
});
