'use strict';

var OAuth2Strategy = require('passport-oauth2');
var InternalOAuthError = require('passport-oauth2').InternalOAuthError;
var util = require('util');
var errors = require('./errors');


function Strategy(options, verify) {
	OAuth2Strategy.call(this, options, verify);

	this._oauth2.useAuthorizationHeaderforGET(true);
}

util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.parseProfile = function() {
	return {};
};

Strategy.prototype.userProfile = function(accessToken, done) {
	var self = this;

	this._oauth2.get(self._profileURL, accessToken, function(err, body) {
		if (err) {
			return done(new InternalOAuthError('Failed to fetch user profile', err));
		}

		try {
			var json = JSON.parse(body);
		} catch (e) {
			return done(new errors.InvalidResponse());
		}

		if (json.error) {
			return done(new errors.ApiError(json));
		}

		var resultProfile = self.parseProfile(json);

		resultProfile.provider = self.name;
		resultProfile._raw = body;
		resultProfile._json = json;

		done(null, resultProfile);
	});
};

module.exports = Strategy;
