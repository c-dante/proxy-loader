'use strict';

console.log('App entry point');

var API = require('./service/api');

// Build a new API
var api = new API('//path');

console.log('- - - CommonJS Module - - -');
console.log(api.makeRequest());
console.log(api.otherRequest());

// Mock the dependency
var mockApiDependency = {
	doAction: function(path)
	{
		return 'I am a mocked dependency. ' + path;
	}
};

var mockOtherDependency = {
	otherAction: function(path)
	{
		return 'I\'m a mocked AMD exports dependency. ' + path;
	}
};

/**
 * CommonJS
 */
console.log('- - - Mocked CommonJS Module - - -');
var ProxyAPIFactory = require('proxy!./service/api');
var ProxyAPI = ProxyAPIFactory({
	'./apiDependency': mockApiDependency
});

var mockedApi = new ProxyAPI('//mockPath');

console.log(ProxyAPIFactory);
console.log(mockedApi.makeRequest());
console.log(mockedApi.otherRequest());

/**
 * AMD, other dependency
 */
console.log('- - - Mocked AMD Module - - -');
var PromiseAMDFactory = require('proxy!./service/amdApi');
var ProxyAmdApi = PromiseAMDFactory({
	'./otherDependency': mockOtherDependency
});

var mockedAmdApi = new ProxyAmdApi('//amdPath');

console.log(mockedAmdApi.makeRequest());
console.log(mockedAmdApi.otherRequest());
