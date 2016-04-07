/* globals  Stamplay,store, Q*/

/* Add function to handle ajax calls, returning a promise
 * Very simple to use: Stamplay.makePromise({options})
 */
(function (root) {
	'use strict';

	/* private function for handling this parameters */
	var parseQueryParams = function (options) {
		var keys = Object.keys(options.thisParams);
		for (var i = 0; i < keys.length; i++) {
			var conjunction = (i > 0) ? '&' : '?';
			var key = keys[i];
			options.url = options.url + conjunction + key + '=' + options.thisParams[key];
		}
	};
	/* function for handling any calls to Stamplay Platform */
	/* Options parameter is an object  */
	root.Stamplay.makeAPromise = function (options, callback) {
		if (options.thisParams) {
			parseQueryParams(options);
		}		
		var headerStamplay = root.Stamplay.APPID;
		if (root.Stamplay.APPID != "") {
			options.url = root.Stamplay.BASEURL + options.url;
		} else {
			headerStamplay = location.host;
			headerStamplay = headerStamplay.replace(/^www\./, '');
			headerStamplay = headerStamplay.replace(/:[0-9]*$/g, '');
		}
		var req = new XMLHttpRequest();
		req.open(options.method || 'GET', options.url, options.async || true);
		_manageHeaders(headerStamplay, req, options)
		var deferred = Q.defer();
		req.onreadystatechange = function () {
			if (req.readyState == 4) {
				if ([200, 304].indexOf(req.status) === -1) {
					deferred.reject({code:req.status, message:req.responseText})
				} else {
					_handleJWT(req);
					deferred.resolve(JSON.parse(req.responseText))
				}
				deferred.promise.nodeify(callback);
			}
		}
		req.send(JSON.stringify(options.data) || void 0);
		return deferred.promise;
	};

	function _manageHeaders(headerStamplay, req, options){
		// Set request headers if provided.
		Object.keys(options.headers || {}).forEach(function (key) {
			req.setRequestHeader(key, options.headers[key]);
		});
		// Default content-Type  
		req.setRequestHeader('Content-Type', 'application/json');
    req.setRequestHeader('Accept', 'application/json, text/plain');
		req.setRequestHeader('stamplay-app', headerStamplay);
		
		// V1 
		if (root.Stamplay.USESTORAGE) {
			var jwt = store.get(root.location.origin + '-jwt');
			if (jwt) {
				if (_jwtIsValidTimestamp(jwt)) {
					req.setRequestHeader('x-stamplay-jwt', jwt);
				} else {
					store.remove(root.location.origin + '-jwt');
				}
			}
		}
	}
	function _handleJWT(req) {
		var jwt = req.getResponseHeader('x-stamplay-jwt');
		if (jwt) {
			var decodedJWT = _decodeJWT(jwt);
			if (root.Stamplay.USESTORAGE) {
				store.set(root.location.origin + '-jwt', jwt);
			}
		}
		return decodedJWT;
	}
	function _decodeJWT(token) {
		var header = {},
				claims = {},
				signature = "";
		try {
			var parts = token.split(".");
			header = JSON.parse(_base64Decode((parts[0] || "{}")));
			claims = JSON.parse(_base64Decode((parts[1] || "{}")));
			signature = parts[2];
		} catch (e) {}
		return {
			header: header,
			claims: claims,
			signature: signature
		};
	}
	/* Decode base64 */
	function _base64Decode(str) {
		if (typeof atob !== "undefined") {
			return atob(str);
		} else {
			return _base64DecodeBackward(str);
		}
	}
	/* Backward compatibility for IE 8 and IE 9 */
	function _base64DecodeBackward(s) {
		var e = {},
			i, b = 0,
			c, x, l = 0,
			a, r = '',
			w = String.fromCharCode,
			L = s.length;
		var A = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		for (i = 0; i < 64; i++) {
			e[A.charAt(i)] = i;
		}
		for (x = 0; x < L; x++) {
			c = e[s.charAt(x)];
			b = (b << 6) + c;
			l += 6;
			while (l >= 8) {
				((a = (b >>> (l -= 8)) & 0xff) || (x < (L - 2))) && (r += w(a));
			}
		}
		return r;
	}
	function _jwtIsValidTimestamp(token) {
		var claims = _decodeJWT(token).claims,
				now = Math.floor((new Date).getTime() / 1E3),
				validSince, validUntil;
		if (typeof claims === "object") {
			if (claims.hasOwnProperty("iat")) {
				validSince = claims.iat;
				/*
				 * We are allowing a grace period of 30 seconds in order to avoid 
				 * premature deletion of the token due to time sync  
				 */
				var thirtySeconds = 30 * 1000;
				var validSinceToDate = new Date(validSince * 1000);
				var dateSince = new Date(validSinceToDate - thirtySeconds);
				validSince = dateSince.getTime() / 1E3;
			}
			if (claims.hasOwnProperty("exp")) {
				validUntil = claims.exp;
			} else {
				validUntil = validSince + 86400;
			}
		}
		return now && validSince && validUntil && now >= validSince && now <= validUntil;
	}

}(this));
