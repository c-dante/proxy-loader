'use strict';

define(function(require)
{
	var apiDependency = require('./apiDependency');
	var otherDependency = require('./otherDependency');

	var API = function(base)
	{
		this.path = base;
	};

	API.prototype.makeRequest = function()
	{
		return apiDependency.doAction(this.path);
	};

	API.prototype.otherRequest = function()
	{
		return otherDependency.otherAction(this.path);
	};

	return API;
});
