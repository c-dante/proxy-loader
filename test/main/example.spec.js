'use strict';

var chai = require('chai');

// Chai
var assert = chai.assert;

describe('Example spec', function()
{
	it('Should have been found', function(done)
	{
		assert.ok(1 === 1, 'Identity should be equal');
		done();
	});
});
