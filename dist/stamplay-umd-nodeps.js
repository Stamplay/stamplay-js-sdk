(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define('Stamplay', ["Q","store"], function (a0,b1) {
      return (root['Stamplay'] = factory(a0,b1));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("Q"),require("store"));
  } else {
    root['Stamplay'] = factory(Q,store);
  }
}(this, function (Q, store) {

/*! Stamplay v2.1.3 | (c) 2016 Stamplay *//**
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
/* 
 * Exspose BaseComponent the super class of all components on Stamplay.
 *  It extends Model and Collection.
 */
(function (root) {
	'use strict';

	function BaseComponent(brickId, resourceId) {
		
		var removeAttributes = function (brick, instance) {
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

		var buildEndpoint = function(brickId, resourceId, method, id, data, callbackObject){
			var options = {
				method: method,
				url: '/api/' + brickId + '/' + root.Stamplay.VERSION + '/' + resourceId
			}
			if(id)
				options.url= options.url+'/'+id
			if(data && method != 'GET')
				options.data = data
			if(method == 'GET')
				options.thisParams = data;
			return root.Stamplay.makeAPromise(options, callbackObject);
		}

		return {
			brickId : brickId,
			resourceId : resourceId,
			get: function(data, callbackObject){
				return buildEndpoint(this.brickId, this.resourceId, 'GET', false, data, callbackObject)
			},
			getById:function(id, data, callbackObject){
				return buildEndpoint(this.brickId, this.resourceId, 'GET', id, data, callbackObject)
			},
			save : function (data, callbackObject) {
				return buildEndpoint(this.brickId, this.resourceId, 'POST', false, data, callbackObject)
			},
			patch : function(id, data, callbackObject){
				removeAttributes(this.brickId, data);
				return buildEndpoint(this.brickId, this.resourceId, 'PATCH', id, data, callbackObject)
			},
			update: function(id, data, callbackObject){
				removeAttributes(this.brickId, data);
				return buildEndpoint(this.brickId, this.resourceId, 'PUT', id, data, callbackObject)
			},
			remove: function(id, callbackObject){
				return buildEndpoint(this.brickId, this.resourceId, 'DELETE', id, false, callbackObject)
			}
		}
	}
	// Added BaseComponent Object to Stamplay
	root.Stamplay.BaseComponent = BaseComponent;

}(this));/* Add Support function to Stamplay
 * it use for handling some functionality
 * very easy to use : Stamplay.Support.redirect('http://stamplay.com')
 */
(function (root) {
	'use strict';

	// constructor for Support Object
	function Support() {

		// function to redirect to specified url
		this.redirect = function (url) {
			root.location.href = url;
		};

		// function for check if you have user with a specific email 
		this.validateEmail = function (email, callbackObject) {
			return root.Stamplay.makeAPromise({
				method: 'POST',
				data: { email: email },
				url: '/api/auth/' + root.Stamplay.VERSION + '/validate/email'
			}, callbackObject);
		};

	}
	var support = new Support();
	// Added Support Object to Stamplay
	root.Stamplay.Support = support;

})(this);/* Add Query function to Stamplay
 * it use for handling some funcctionality
 * very easy to use : Stamplay.Query('user').equalTo('name':'john')
 */
(function (root) {
	'use strict';

	// constructor for Query Object
	// model is required ever
	function _createGeoQuery(queryOperator, shapeOperator, type, coordinates, maxDistance, minDistance) {
		var obj ={_geolocation:{}}
		obj._geolocation[queryOperator] = {};
		obj._geolocation[queryOperator][shapeOperator] = {type:type, coordinates:coordinates}
		if(maxDistance){
			obj._geolocation[queryOperator].$maxDistance = maxDistance
		}
		if(minDistance){
			obj._geolocation[queryOperator].$minDistance = minDistance	
		}
		return obj;
	}
	
	function _createGeoWithinQuery(shapeOperator, coordinates){
		var obj = {_geolocation:{$geoWithin:{}}}
		obj._geolocation.$geoWithin[shapeOperator] = coordinates
		return obj;
	}

	function Query(model, instance) {
		return {
			
			model : model,
			instance : instance,
			paginationQuery : '',
			sortQuery:'',
			selectionQuery:'',
			populateQuery: '',
			populateOwnerQuery:'',
			whereQuery : [],
			executable : '',

			or : function(){
				var obj = { $or : []};
				var args = arguments;
				if (arguments[0] instanceof Array) {
					args = arguments[0];
				}
				for(var i=0; i<args.length; i++){
					if(args[i].whereQuery)	
						obj.$or.push(args[i].whereQuery[0]);
					else
						throw new Error('Please Or function take only Query object');
				}
				this.whereQuery.push(obj);
				return this
			},

			pagination : function(page, per_page){
				this.paginationQuery = '&page='+page+'&per_page='+per_page;
				return this;
			},

			between : function(attr, value1, value2){
				var obj = {};
				obj[attr] = {"$gte":value1, "$lte":value2};
				this.whereQuery.push(obj);
				return this;
			},

			greaterThan : function(attr, value){
				var obj = {};
				obj[attr] = {"$gt":value};
				this.whereQuery.push(obj);
				return this;
			},	

			greaterThanOrEqual : function(attr, value){
				var obj = {};
				obj[attr] = {"$gte":value};
				this.whereQuery.push(obj);
				return this;
			},

			lessThan : function(attr, value){
				var obj = {};
				obj[attr] = {"$lt":value};
				this.whereQuery.push(obj);
				return this;
			},	

			lessThanOrEqual : function(attr, value){
				var obj = {};
				obj[attr] = {"$lte":value};
				this.whereQuery.push(obj);
				return this;
			},

			equalTo : function(attr, value){
				var obj = {};
				obj[attr] = value;
				this.whereQuery.push(obj);
				return this;
			},

			notEqualTo : function(attr, value){
				var obj = {};
				obj[attr] = {"$ne":value};
				this.whereQuery.push(obj)
				return this;
			},

			sortAscending : function(value){
				this.sortQuery ='&sort='+value
				return this;
			},

			sortDescending : function(value){
				this.sortQuery ='&sort=-'+value
				return this
			},

			exists : function(attr){
				var obj = {};
				obj[attr] = {"$exists":true};
				this.whereQuery.push(obj);
				return this;
			},

			notExists : function(attr){
				var obj = {};
				obj[attr] = {"$exists":false};
				this.whereQuery.push(obj);
				return this;
			},

			regex: function(attr, regex, options){
				var obj = {};
				obj[attr] = {"$regex":regex, "$options": options};
				this.whereQuery.push(obj);
				return this;
			},

			populate: function(){
				this.populateQuery ='&populate=true'
				return this
			},
			
			populateOwner: function(){
				this.populateOwnerQuery ='&populate_owner=true'
				return this
			},

			select: function(){
				this.selectionQuery =  '&select='+ Array.prototype.slice.call(arguments).join(", ").replace(" ",'')
				return this
			},

			near: function(type, coordinates, maxDistance, minDistance){
				var obj = _createGeoQuery("$near", "$geometry", type, coordinates, maxDistance, minDistance)
				this.whereQuery.push(obj);
				return this;
			},

			nearSphere: function(type, coordinates, maxDistance, minDistance){
				var obj = _createGeoQuery("$nearSphere", "$geometry", type, coordinates, maxDistance, minDistance)
				this.whereQuery.push(obj);
				return this;
			},

			geoIntersects: function(type, coordinates){
				var obj = _createGeoQuery("$geoIntersects", "$geometry", type, coordinates)
				this.whereQuery.push(obj);
				return this;
			},

			geoWithinGeometry:function( type, coordinates){
				var obj = _createGeoQuery("$geoWithin", "$geometry", type, coordinates)
				this.whereQuery.push(obj);
				return this;
			},

			geoWithinCenterSphere: function(coordinates, radius){
				var finalParam = [coordinates, radius]
				var obj = _createGeoWithinQuery('$centerSphere',finalParam)
				this.whereQuery.push(obj);
				return this;
			},

			exec : function(callback){
				//build query
				for(var i=0;i<this.whereQuery.length;i++){	
					var partial = JSON.stringify(this.whereQuery[i]);
					partial = partial.substring(1, partial.length-1);
					if(i===0)
						this.executable += partial;
					else
						this.executable += ','+partial;
				}
				
				switch(this.model){
					case 'object':
						this.model = 'cobject'
					break
					default:
						this.instance = 'users'
					break
				}

				var Url = '/api/' + this.model + '/' + root.Stamplay.VERSION + '/' + this.instance 
								+'?where={'+this.executable+'}'+ this.paginationQuery + this.selectionQuery 
								+ this.sortQuery + this.populateQuery + this.populateOwnerQuery

				return root.Stamplay.makeAPromise({
					method: 'GET',
					url:  Url
				},callback)
			}
		}
	}
	// Added Query Object to Stamplay
	root.Stamplay.Query = Query;
})(this);/*
	Brick : User
 	GET    '/api/user/VERSION/users'
  GET    '/api/user/VERSION/users/:id'
  POST   '/api/user/VERSION/users'
  PUT    '/api/user/VERSION/users/:id'
  DELETE '/api/user/VERSION/users/:id'
  GET    '/api/user/VERSION/getStatus'
*/

(function (root) {
	'use strict';

	/*
		User component : Stamplay.User
		This class rappresent the User component on Stamplay platform
		It very easy to use: Stamplay.User
	*/

	var  User = {
		brickId:'user',
		resourceId:'users',
		currentUser : function (callbackObject){
			return root.Stamplay.makeAPromise({
				method: 'GET',
				url: '/api/' + this.brickId + '/' + root.Stamplay.VERSION + '/getStatus'
			}, callbackObject)
		},
		login :function (data, callbackObject) {
			return root.Stamplay.makeAPromise({
				method: 'POST',
				data: data,
				url: '/auth/' + root.Stamplay.VERSION + '/local/login'
			}, callbackObject)
		},
		socialLogin: function(provider){
			if(provider){
				var url = '/auth/' + root.Stamplay.VERSION + '/' + provider + '/connect';
				if(root.Stamplay.OPTIONS.isMobile){
						//need an external plugin to work - https://github.com/apache/cordova-plugin-inappbrowser
						var popup = root.open(root.Stamplay.BASEURL+url, 'socialLogin', 'left=1,top=1,width=600,height=600')
						popup.addEventListener('loadstart', function (e) {
						var reg = new RegExp('jwt=([A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+=]+)')
						if(e.url.indexOf('jwt=') > -1){
							var jwt = e.url.match(reg)[1]
							store.set(root.location.origin + '-jwt', jwt);
							if(root.Stamplay.OPTIONS.autoRefreshSocialLogin)
								location.reload();
							popup.close();
						}
        	});
				}else{
					var jwt = store.get(root.location.origin + '-jwt');
					if (jwt) {
						// Store temporary cookie to permit user aggregation (multiple social identities)
					  var date = new Date();
		        date.setTime(date.getTime() + 5 * 60 * 1000);
						root.document.cookie = 'stamplay.jwt='+jwt+'; expires=' + date.toGMTString() + '; path=/'
					}
					var port = (root.location.port) ? ':'+root.location.port : '';
					var redirection = location.protocol + '//' + root.document.domain +port+ url
					//if you are using sdk on your *personal site*
					//remember to manage the callback url for social login in editor
					if(root.Stamplay.OPTIONS.absoluteUrl){
						redirection = root.Stamplay.BASEURL+url
					}
					root.Stamplay.Support.redirect(redirection);
				}
			}else{
				throw new Error('Stamplay.User.socialLogin needs the service name');
			}
		},
		signup : function (data, callbackObject) {
			return root.Stamplay.makeAPromise({
				method: 'POST',
				data: data,
				url: '/api/' + this.brickId + '/' + root.Stamplay.VERSION + '/' + this.resourceId
			}, callbackObject)
		},
		logout : function (async, callbackObject) {
			var jwt = store.get(root.location.origin + '-jwt');
			if (root.Stamplay.USESTORAGE)
				store.remove(root.location.origin + '-jwt');
			if(async){
				return root.Stamplay.makeAPromise({
				method: 'GET',
				url: '/auth/' + root.Stamplay.VERSION + '/logout?jwt='+jwt
				}, callbackObject)
			}else{
				var url = '/auth/' + root.Stamplay.VERSION + '/logout?jwt='+jwt;
				var port = (root.location.port) ? ':'+root.location.port : '';
				var redirection = location.protocol + '//' + root.document.domain +port+ url
				if(root.Stamplay.OPTIONS.absoluteUrl){
					redirection = root.Stamplay.BASEURL+url
				}
				root.Stamplay.Support.redirect(redirection);
			}
		},
		resetPassword: function(data, callbackObject){
			return root.Stamplay.makeAPromise({
				method: 'POST',
				data: data,
				url: '/api/' + this.brickId + '/' + root.Stamplay.VERSION + '/users/resetpassword'
			}, callbackObject)
		},
		getRoles:function (callbackObject) {
			return root.Stamplay.makeAPromise({
				method: 'GET',
				url: '/api/user/' + root.Stamplay.VERSION + '/roles'
			}, callbackObject);
		},
		getRole:function (roleId, callbackObject) {
			return root.Stamplay.makeAPromise({
				method: 'GET',
				url: '/api/user/' + root.Stamplay.VERSION + '/roles/'+ roleId
			}, callbackObject);
		},
		setRole:function (id, roleId, callbackObject) {
			return root.Stamplay.makeAPromise({
				method: 'PATCH',
				data: {'givenRole': roleId},
				url: '/api/user/' + root.Stamplay.VERSION + '/users/'+ id + '/role'
			}, callbackObject);
		}
	}
	root.Stamplay.extend(User, root.Stamplay.BaseComponent(User.brickId, User.resourceId))
	delete User.patch
	User.remove = function(id, callbackObject){
		return root.Stamplay.makeAPromise({
			method: 'DELETE',
			url: '/api/' + this.brickId + '/' + root.Stamplay.VERSION + '/' + this.resourceId + '/' + id
		},callbackObject).then(function(resp){
			if (root.Stamplay.USESTORAGE) {
				var jwt = store.get(root.location.origin + '-jwt');
				if (jwt) {
					store.remove(root.location.origin + '-jwt');
				}
			}
		})
	}
	//Added User to Stamplay
	root.Stamplay.User = User;
})(this);
/* Brick : Cobject
	GET     '/api/cobject/VERSION/:cobjectId
	GET     '/api/cobject/VERSION/:cobjectId/:id
	PUT     '/api/cobject/VERSION/:cobjectId/:id
	PATCH   '/api/cobject/VERSION/:cobjectId/:id
	POST    '/api/cobject/VERSION/:cobjectId
	DELETE  '/api/cobject/VERSION/:cobjectId/:id
	PUT			'/api/cobject/VERSION/:cobjectId/:id/rate
	PUT     '/api/cobject/VERSION/:cobjectId/:id/comment
	PUT     '/api/cobject/VERSION/:cobjectId/:id/vote
	PUT     '/api/cobject/VERSION/:cobjectId/:id/facebook_share
	PUT     '/api/cobject/VERSION/:cobjectId/:id/twitter_share
*/
(function (root) {
	'use strict';

	/**
		Custom object component : Stamplay.Object
		This class rappresent the Object component on Stamplay platform
		It very easy to use: Stamplay.Object([Objectid])
	*/
	var makeActionPromise = function (id, action, data, callbackObject) {
		return root.Stamplay.makeAPromise({
			method: 'PUT',
			data: (data) ? data : {},
			url: '/api/' + this.brickId + '/' + root.Stamplay.VERSION + '/' + this.resourceId + '/' + id +
				'/' + action
		}, callbackObject)
	};

	var getId = function (resourceId, id) {
		return root.Stamplay.BaseComponent('cobject', resourceId + '/' + id).get()
	};

	var pushId = function (resourceId, id, newData, callbackObject) {
		return root.Stamplay.BaseComponent('cobject', resourceId).patch(id, newData, callbackObject)
	};

	var buildAttr = function (response, attribute, data) {
			var newData = {}
			newData[attribute] = response[attribute] || []
			newData[attribute].push(data)
			return newData
		}
		//constructor
	function Object(resourceId) {
		if (resourceId) {
			return root.Stamplay.extend({
				brickId: 'cobject',
				resourceId: resourceId,
				findByCurrentUser: function (attr, data, callbackObject) {
					var attribute = 'owner';
					var params = {};
					var callback;
					if (arguments.length === 3) {
						attribute = attr;
						params = data;
						callback = callbackObject;
					} else if (arguments.length === 2) {
						if (root.Stamplay.isFunction(arguments[1])) {
							callback = arguments[1];
							attribute = (root.Stamplay.isString(arguments[0])) ? arguments[0] : 'owner';
							params = (root.Stamplay.isObject(arguments[0])) ? arguments[0] : {};
						} else {
							attribute = arguments[0];
							params = arguments[1]
						}
					} else if (arguments.length === 1) {
						if (root.Stamplay.isFunction(arguments[0])) {
							callback = arguments[0];
						} else {
							attribute = (root.Stamplay.isString(arguments[0])) ? arguments[0] : 'owner';
							params = (root.Stamplay.isObject(arguments[0])) ? arguments[0] : {};
						}
					}

					return root.Stamplay.makeAPromise({
						method: 'GET',
						thisParams: params,
						url: '/api/' + this.brickId + '/' + root.Stamplay.VERSION + '/' + this.resourceId +
							'/find/' + attribute
					}, callback)
				},
				upVote: function (id, callbackObject) {
					return makeActionPromise.call(this, id, 'vote', {
						type: 'upvote'
					}, callbackObject);
				},
				downVote: function (id, callbackObject) {
					return makeActionPromise.call(this, id, 'vote', {
						type: 'downvote'
					}, callbackObject);
				},
				rate: function (id, vote, callbackObject) {
					return makeActionPromise.call(this, id, 'rate', {
						rate: vote
					}, callbackObject);
				},
				comment: function (id, text, callbackObject) {
					return makeActionPromise.call(this, id, 'comment', {
						text: text
					}, callbackObject);
				},
				push: function (id, attribute, data, callbackObject) {
					if (callbackObject) {
						return getId(resourceId, id)
							.then(function (response) {
								var newData = buildAttr(response, attribute, data)
								return pushId(resourceId, id, newData, callbackObject)
							}, function (err) {
								callbackObject(err, null)
							}).fail(function (err) {
								callbackObject(err, null)
							})
					} else {
						return getId(resourceId, id)
							.then(function (response) {
								var newData = buildAttr(response, attribute, data)
								return pushId(resourceId, id, newData)
							})
					}

				}
			}, root.Stamplay.BaseComponent('cobject', resourceId))
		} else {
			throw new Error('Stamplay.Object(objecId) needs a objectId');
		}
	}
	//Added Cobject to Stamplay
	root.Stamplay.Object = Object;
})(this);
/* Brick : Webhook 
 *  POST   '/api/webhook/VERSION/:webhookId/catch'
 */
(function (root) {
	'use strict';

	/*
		Webhook component : Stamplay.Webhook 
		This class rappresent the Webhook Object component on Stamplay platform
		It very easy to use: Stamplay.Webhook([WebhookName])
	*/

	//constructor
	function Webhook(resourceId) {
		var resource = resourceId.replace(/[^\w\s]/gi, '').trim().toLowerCase().replace(/\s+/g, '_');
		var url = '/api/webhook/' + root.Stamplay.VERSION + '/' + resource + '/catch';
		return {
			post: function (data, callbackObject) {
				return root.Stamplay.makeAPromise({
					method: 'POST',
					data: data,
					url: url
				}, callbackObject);
			},
			// put: function (data, queryParams, callbackObject) {
			// 	return root.Stamplay.makeAPromise({
			// 		method: 'PUT',
			// 		data: data,
			// 		url: url,
			// 		thisParams: queryParams
			// 	}, callbackObject);
			// },
			// get: function (queryParams, callbackObject) {
			// 	return root.Stamplay.makeAPromise({
			// 		method: 'GET',
			// 		url: url,
			// 		thisParams: queryParams
			// 	}, callbackObject);
			// }
		}
	}
	//Added Webhook to Stamplay 
	root.Stamplay.Webhook = Webhook;

})(this);/* Brick : stripe 
 * POST  'api/stripe/VERSION/customers'
 * POST  'api/stripe/VERSION/customers/:userId/cards'
 * POST  'api/stripe/VERSION/charges'
 * POST  'api/stripe/VERSION/customers/:userId/subscriptions'
 * GET   'api/stripe/VERSION/customers/:userId/subscriptions'
 */
(function (root) {
	'use strict';

	/*
		Stripe component : Stamplay.Stripe 
		This class rappresent the Stripe Object component on Stamplay platform
		It very easy to use: Stamplay.Stripe()
	*/
	//constructor
	var Stripe = {
		url : '/api/stripe/' + root.Stamplay.VERSION + '/',
		createCustomer : function (userId, callbackObject) {
			return root.Stamplay.makeAPromise({
				method: 'POST',
				data: {'userId': userId},
				url: this.url + 'customers'
			}, callbackObject);
		},
		createCreditCard : function (userId, token, callbackObject) {
			if (arguments.length >= 2 && (root.Stamplay.isString(arguments[0]) && root.Stamplay.isString(arguments[1]))) {
				return root.Stamplay.makeAPromise({
					method: 'POST',
					data: {'token': token},
					url: this.url + 'customers/' + userId + '/cards'
				}, callbackObject);
			} else {
				throw new Error('Stamplay.Stripe.createCustomer:  missing parameters');
			}
		},
		updateCreditCard : function (userId, token, callbackObject) {
			if (arguments.length >= 2 && (root.Stamplay.isString(arguments[0]) && root.Stamplay.isString(arguments[1]))) {
					return root.Stamplay.makeAPromise({
						method: 'PUT',
						data: {'token': token},
						url: this.url + 'customers/' + userId + '/cards'
					},callbackObject);
			} else {
				throw new Error('Stamplay.Stripe.updateCreditCard:  missing parameters');
			}
		},
		charge : function (userId, token, amount, currency, callbackObject) {
			if (arguments.length >= 4 && (root.Stamplay.isString(arguments[0]) && root.Stamplay.isString(arguments[1]) && root.Stamplay.isNumber(arguments[2]) && root.Stamplay.isString(arguments[3]) )){
				return root.Stamplay.makeAPromise({
					method: 'POST',
					data: {
						'userId': userId,
						'token': token,
						'amount': amount,
						'currency': currency
					},
					url: this.url + 'charges'
				}, callbackObject);
			} else {
				throw new Error('Stamplay.Stripe.charge:  missing or incorrect parameters');
			}
		},
		createSubscription : function (userId, planId, callbackObject) {
			if (arguments.length >= 2 && (root.Stamplay.isString(arguments[0]) && root.Stamplay.isString(arguments[1]))) {
				return root.Stamplay.makeAPromise({
					method: 'POST',
					data: {'planId': planId},
					url: this.url + 'customers/' + userId + '/subscriptions'
				}, callbackObject);
			} else {
				throw new Error('Stamplay.Stripe.createSubscription:  missing parameters');
			}
		},
		getSubscriptions : function (userId, options, callbackObject) {
			if (arguments.length >= 2) {
				return root.Stamplay.makeAPromise({
					method: 'GET',
					url: this.url + 'customers/' + userId + '/subscriptions',
					thisParams: options
				}, callbackObject);
			} else {
				throw new Error('Stamplay.Stripe.getSubscriptions:  missing parameters');
			}
		},
		getSubscription : function (userId, subscriptionId, callbackObject) {
			if (arguments.length >= 2 && (root.Stamplay.isString(arguments[0]) && root.Stamplay.isString(arguments[1]))) {
				return root.Stamplay.makeAPromise({
					method: 'GET',
					url: this.url + 'customers/' + userId + '/subscriptions/' + subscriptionId,
				}, callbackObject);
			} else {
				throw new Error('Stamplay.Stripe.getSubscription:  missing parameters');
			}
		},
		getCreditCard : function (userId, callbackObject) {
			return root.Stamplay.makeAPromise({
				method: 'GET',
				url: this.url + 'customers/' + userId + '/cards',
			}, callbackObject);
		},
		deleteSubscription : function (userId, subscriptionId, options, callbackObject) {
			if (arguments.length >= 3) {
				return root.Stamplay.makeAPromise({
					method: 'DELETE',
					url: this.url + 'customers/' + userId + '/subscriptions/' + subscriptionId,
					data: options
				}, callbackObject);
			} else {
				throw new Error('Stamplay.Stripe.deleteSubscription:  missing parameters');
			}
		},
		updateSubscription : function (userId, subscriptionId, options, callbackObject) {
			if (arguments.length >= 3) {
				return root.Stamplay.makeAPromise({
					method: 'PUT',
					url: this.url + 'customers/' + userId + '/subscriptions/' + subscriptionId,
					data: {
						options: options
					}
				}, callbackObject);
			} else {
				throw new Error('Stamplay.Stripe.updateSubscription:  missing parameters');
			}
		}
	}
	root.Stamplay.Stripe = Stripe;
})(this);/* Brick : Codeblock
 *  POST   '/api/codeblock/VERSION/:CodeblockId/run'
 */
(function (root) {
	'use strict';
	/*
		Codeblock component : Stamplay.Codeblock
		This class rappresent the Codeblock Object component on Stamplay platform
		Stamplay.Codeblock(codeblockId)
	*/
	function _buildMethod(method, url, data, queryParams, callbackObject) {
		return root.Stamplay.makeAPromise({
			method: method,
			data: data,
			url: url,
			thisParams: queryParams
		}, callbackObject);
	}
	//constructor
	function Codeblock(resourceId) {
		var resource = resourceId.replace(/[^\w\s]/gi, '').trim().toLowerCase().replace(/\s+/g, '_');
		var url = '/api/codeblock/' + root.Stamplay.VERSION + '/run/' + resource;
		return {
			run: function (data, queryParams, callbackObject) {
				return _buildMethod('POST', url, data, queryParams, callbackObject);
			},
			post: function (data, queryParams, callbackObject) {
				return _buildMethod('POST', url, data, queryParams, callbackObject);
			},
			get: function (queryParams, callbackObject) {
				return _buildMethod('GET', url, null, queryParams, callbackObject)
			},
			put: function (data, queryParams, callbackObject) {
				return _buildMethod('PUT', url, data, queryParams, callbackObject)
			},
			patch: function (data, queryParams, callbackObject) {
				return _buildMethod('PATCH', url, data, queryParams, callbackObject)
			},
			delete: function (queryParams, callbackObject) {
				return _buildMethod('DELETE', url, null, queryParams, callbackObject)
			},
		}
	}
	//Added Codeblock to Stamplay
	root.Stamplay.Codeblock = Codeblock;
})(this);

return Stamplay;

}));
