'use strict';

console.log('App entry point');

var API = require('./service/api');

// Build a new API
var api = new API('//path');

console.log(api.makeRequest());

// Mock the dependency
var mockApiDependency = {
	doAction: function(path)
	{
		return 'I am a mocked dependency. ' + path;
	}
};

// Proxy things
var ProxyAPIFactory = require('proxy!./service/api');
var ProxyAPI = ProxyAPIFactory({
	'./apiDependency': mockApiDependency
});

var mockedApi = new ProxyAPI('//mockPath');

console.log(ProxyAPIFactory);
console.log(mockedApi.makeRequest());

// Proxy AMD modules
var PromiseAMDFactory = require('proxy!./service/amdApi');
var ProxyAmdApi = PromiseAMDFactory({
	'./apiDependency': mockApiDependency
});

var mockedAmdApi = new ProxyAmdApi('//amdPath');

console.log(mockedAmdApi.makeRequest());


// AMD with module.exports syntax
var PromiseAMDDefineFactory = require('proxy!./service/amdDefineApi');
var ProxyAmdDefineApi = PromiseAMDDefineFactory({
	'./apiDependency': mockApiDependency
});

var mockedAmdDefineApi = new ProxyAmdDefineApi('//amdDefinePath');

console.log(mockedAmdDefineApi.makeRequest());
