'use strict';

var _ = require('underscore');
var util = require('util');
var BaseStrategy = require('../lib').Strategy;

exports.passport = {
	use: function(strategy) {
		this._strategy = strategy;

		_(['success', 'fail', 'redirect', 'error', 'pass']).each(function(callback) {
			strategy[callback] = _.noop;
		});
	},
	authenticate: function(options) {
		this._strategy.authenticate({}, options);
	},
	restore: function() {
		this._strategy = null;
	}
};

function Strategy(options, verify) {
	options.authorizationURL = options.authorizationURL ||
		'https://example.com/auth/oauth2/authorize';
	options.tokenURL = options.tokenURL ||
		'https://example.com/auth/oauth2/token';

	BaseStrategy.call(this, options, verify);

	this.name = 'foobar';

	this._profileURL = options.profileURL || 'https://example.com/auth/api/1.0/user';
}

util.inherits(Strategy, BaseStrategy);

var strategyOptions = {
	clientID: '1234',
	clientPublic: '1234',
	clientSecret: '123abcf3213'
};

exports.createStrategy = function(options) {
	options = _(options || {}).defaults(strategyOptions);

	return new Strategy(options, _.noop);
};

