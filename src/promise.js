/* globals  Stamplay,store,Q */

/* Add function to handle ajax calls, returning a promise
 * Very simple to use: Stamplay.makePromise({options})
 */
(function (root) {

	/* private function for handling this parameters */
	var parseQueryParams = function (options) {
		var keys = Object.keys(options.thisParams);
		for (var i = 0; i < keys.length; i++) {
			var conjunction = (i > 0) ? '&' : '?';
			var key = keys[i];
			options.url = options.url + conjunction + key + '=' + options.thisParams[key];
		}
	};

	/* private function for parse link's header */
	var parseLink = function (parts, link) {
		for (var i = 0; i < parts.length; i++) {
			var section = parts[i].split(';');
			if (section.length != 2) {
				throw new Error("section could not be split on ';'");
			}
			var url = section[0].replace(/<(.*)>/, '$1').trim();
			var name = section[1].replace(/rel="(.*)"/, '$1').trim();
			if (url.indexOf('&sort=') < 0) {
				url += '&sort=-dt_create';
			}
			link[name] = url;
		}
	};

	/* function for handling any calls to Stamplay Platform */
	/* Options parameter is an object  */
	root.Stamplay.makeAPromise = function (options, wantHeaders) {
		/*
			options : {
				method: GET|POST|PUT|DELETE|PATCH
				url: ,
				headers: [{}],
				data: {}
				async: true (default) || false,
				thisParams : {
					page : 1,
					per_page : 10
				}
			} 
		*/
		// parsing this parameter
		if (options.thisParams) {
			parseQueryParams(options);
		}

		var headerStamplay;
		if (root.Stamplay.APPID != "") {
			options.url = root.Stamplay.BASEURL + options.url;
			headerStamplay = root.Stamplay.APPID;
		} else {
			headerStamplay = location.host;
			headerStamplay = headerStamplay.replace(/^www\./, '');
			headerStamplay = headerStamplay.replace(/:[0-9]*$/g, '');
		}

		var deferred = Q.defer(),
			req = new XMLHttpRequest();
		req.open(options.method || 'GET', options.url, options.async || true);
		// Set request headers if provided.
		Object.keys(options.headers || {}).forEach(function (key) {
			req.setRequestHeader(key, options.headers[key]);
		});
		// Default content-Type  
		req.setRequestHeader('Content-Type', 'application/json');

		req.setRequestHeader('stamplay-app', headerStamplay);

		// V1 
		if (Stamplay.USESTORAGE) {
			var jwt = store.get(window.location.origin + '-jwt');
			if (jwt) {
				if (_jwtIsValidTimestamp(jwt)) {
					req.setRequestHeader('x-stamplay-jwt', jwt);
				} else {
					store.remove(window.location.origin + '-jwt');
				}
			}
		}

		req.onreadystatechange = function () {
			if (req.readyState !== 4) {
				return;
			}
			if ([200, 304].indexOf(req.status) === -1) {
				deferred.reject(req);
			} else {

				//parse the JSON response from the server
				var response = JSON.parse(req.responseText);
				_handleJWT(req);
				//where statment doesn't return link in header
				if (wantHeaders && req.getResponseHeader('link')) {
					//parse headers
					var parts = req.getResponseHeader('link').split(',');
					response.pagination = {};
					parseLink(parts, response.pagination);
					response.totalElements = req.getResponseHeader('x-total-elements');
					deferred.resolve(response);
				} else
					deferred.resolve(response);
			}
		};
		req.send(JSON.stringify(options.data) || void 0);
		return deferred.promise;
	};

	/* function to remove attributes from model before send the request to server*/
	root.Stamplay.removeAttributes = function (brick, instance) {
		switch (brick) {
		case 'cobject':
			delete instance.__v;
			delete instance.cobjectId;
			delete instance.actions;
			delete instance.appId;
			delete instance.id;
			break;
		case 'user':
			delete instance._id;
			delete instance.id;
			delete instance.__v;
			break;
		default:
			break;

		}
	};

	function _handleJWT(req) {
		var jwt = req.getResponseHeader('x-stamplay-jwt');
		if (jwt) {
			var decodedJWT = _decodeJWT(jwt);
			if (Stamplay.USESTORAGE) {
				store.set(window.location.origin + '-jwt', jwt);
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
		} catch (e) {

		}
		return {
			header: header,
			claims: claims,
			signature: signature
		};
	}

	/*
	 * Decode base64
	 */

	function _base64Decode(str) {
		if (typeof atob !== "undefined") {
			return atob(str);
		} else {
			return _base64DecodeBackward(str);
		}
	}

	/*
	 * Backward compatibility for IE 8 and IE 9
	 */
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