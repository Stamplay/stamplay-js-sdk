/* globals  Stamplay,store */
/**
@author Stamplay
@version 2.0
@description an awesome javascript sdk for Stamplay
*/
/* Initizialize library */
(function (root) {
	'use strict';

	/*  Inizialization of Stamplay Object */
	root.Stamplay = root.Stamplay || {};
	/* setting attribute API Version */
	root.Stamplay.VERSION = "v1";
	/* appId */
	root.Stamplay.APPID = "";
	/* baseUrl */
	root.Stamplay.BASEURL = "";
	/* options */
	root.Stamplay.OPTIONS = {};
	/*  check if exist local storage with the support of store.js */
	if (root.localStorage && store.enabled) {
		root.Stamplay.USESTORAGE = true;
	}

	if (getURLParameter('jwt')) {
		if (root.Stamplay.USESTORAGE) {
			store.set(root.location.origin + '-jwt', getURLParameter('jwt'));
		}
	}

	/* init method for setup the base url */
	root.Stamplay.init = function (appId, options) {
		root.Stamplay.BASEURL = 'https://' + appId + '.stamplayapp.com';
		root.Stamplay.APPID = appId;
		root.Stamplay.OPTIONS = options || {};
	}

	root.Stamplay.isString = function (val) {
		return typeof val === 'string' || ((!!val && typeof val === 'object') && Object.prototype.toString
			.call(val) === '[object String]');
	}

	root.Stamplay.isNumber = function (val) {
		return typeof val == 'number' || (!isNaN(parseFloat(val)) && isFinite(val))
	}

	root.Stamplay.isFunction = function (functionToCheck) {
		return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
	}

	root.Stamplay.isObject = function (val) {
		return !!val && (typeof val == 'object');
	}

	root.Stamplay.extend = function (source, obj) {
		var keys = Object.keys(obj),
			i, keyLen = keys.length,
			key;
		for (i = 0; i < keyLen; ++i) {
			key = keys[i];
			source[key] = obj[key];
		}
		return source;
	}

	function getURLParameter(name) {
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(root.location
			.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
	}

}(this));
