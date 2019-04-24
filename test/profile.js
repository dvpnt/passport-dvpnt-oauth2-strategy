'use strict';

var sinon = require('sinon');
var InternalOAuthError = require('passport-oauth2').InternalOAuthError;
var url = require('url');
var expect = require('expect.js');
var errors = require('../lib/errors');
var helpers = require('./helpers');

describe('Profile', function() {
	describe('getting', function() {
		var strategy;
		var stub;
		var getStub;
		var clientSecret = '1234';
		var accessToken = 'accesstoken';

		before(function() {
			strategy = helpers.createStrategy({
				clientSecret: clientSecret
			});
			helpers.passport.use(strategy);
		});

		after(function() {
			helpers.passport.restore();
		});

		beforeEach(function() {
			stub = sinon.stub();
			getStub = sinon.stub(strategy._oauth2, 'get');
		});

		afterEach(function() {
			getStub.restore();
		});

		it('check oauth url', function() {
			strategy.userProfile(accessToken, stub);

			expect(getStub.called).to.be.ok();
			var call = getStub.firstCall;
			expect(call.args[1]).to.eql(accessToken);

			var parsedUrl = url.parse(call.args[0], true);
			expect(parsedUrl.host).to.eql('example.com');
			expect(parsedUrl.pathname).to.eql('/auth/api/1.0/user');
		});

		it('try to get with oauth error', function() {
			var errorData = {
				statusCode: 500,
				data: {}
			};

			getStub.yields(errorData);

			strategy.userProfile(accessToken, stub);

			var error = stub.firstCall.args[0];
			expect(error).to.be.a(InternalOAuthError);
			expect(error.message).to.eql('Failed to fetch user profile');
			expect(error.oauthError).to.eql(errorData);
		});

		it('try to get with invalid json', function() {
			getStub.yields(null, 'invalidjson');

			strategy.userProfile(accessToken, stub);

			var error = stub.firstCall.args[0];
			expect(error).to.be.an(errors.InvalidResponse);
		});

		it('check eipsk api error', function() {
			var errorData = {
				error: 'test error'
			};

			getStub.yields(null, JSON.stringify(errorData));
			strategy.userProfile(accessToken, stub);

			var error = stub.firstCall.args[0];
			expect(error).to.be.an(errors.ApiError);
			expect(error.message).to.eql(errorData.error);
		});

		it('check profile parsing', function() {
			var user = {email: 'example@mail.ru'};
			var profileData = {user: user};
			var rawProfile = JSON.stringify(profileData);

			getStub.yields(null, rawProfile);
			strategy.userProfile(accessToken, stub);

			expect(stub.firstCall.args[0]).to.not.be.ok();

			var profile = stub.firstCall.args[1];
			expect(rawProfile).to.eql(profile._raw);
			expect(profileData).to.eql(profile._json);
			expect(profile.provider).to.eql('foobar');
		});
	});
});

