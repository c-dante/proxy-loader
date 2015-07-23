'use strict';

var ApiDependency = function(){};

ApiDependency.prototype.doAction = function(path)
{
	return 'I am the real ApiDependency module. Calling: ' + path;
};

// API Dependency is a singleton
module.exports = new ApiDependency();
