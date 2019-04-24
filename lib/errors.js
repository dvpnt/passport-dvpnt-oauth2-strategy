'use strict';

var util = require('util');

exports.ApiError = ApiError;

function ApiError(params) {
	this.message = params.error;
}

util.inherits(ApiError, Error);

exports.InvalidResponse = InvalidResponse;

function InvalidResponse() {
	this.message = 'Can\'t parse reponse data';
}

util.inherits(InvalidResponse, Error);
