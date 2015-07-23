'use strict';

console.log('App entry point');

var API = require('./service/api');

// Build a new API
var api = new API('//path');

console.log(api.makeRequest());

// Proxy things
var ProxyAPIFactory = require('proxy-loader!./service/api');

var mockApiDependency = {
	doAction: function(path)
	{
		return 'I am a mocked depdency. ' + path;
	}
};

var ProxyAPI = ProxyAPIFactory({
	'./apiDependency': mockApiDependency
});

var mockedApi = new ProxyAPI('//mockpath');

console.log(ProxyAPIFactory);
console.log(mockedApi.makeRequest());
