'use strict';

var expect = require('expect.js');
var url = require('url');
var helpers = require('./helpers');
var sinon = require('sinon');

describe('Strategy', function() {
	describe('creating', function() {
		it('should create strategy', function() {
			var strategy = helpers.createStrategy();
			expect(strategy.name).to.eql('foobar');
		});
	});

	describe('authenteication layout', function() {
		var strategy;

		beforeEach(function() {
			strategy = helpers.createStrategy();
			helpers.passport.use(strategy);
		});

		afterEach(function() {
			helpers.passport.restore();
		});

		it('should redirect', function() {
			var redirectStub = sinon.stub(strategy, 'redirect');
			helpers.passport.authenticate();

			var query = url.parse(redirectStub.firstCall.args[0], true).query;

			expect(query.layout).to.not.be.ok();
			expect(query.response_type).to.eql('code');
		});
	});
});
