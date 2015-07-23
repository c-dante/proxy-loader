'use strict';

var amdNoDeps = require('./amdNoDeps');
var apiDependency = require('./apiDependency');
var otherDependency = require('./otherDependency');

var API = function(base)
{
	console.log('New API base: ' + base + ', amdNoDeps.config: ' + amdNoDeps.config);
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

module.exports = API;
