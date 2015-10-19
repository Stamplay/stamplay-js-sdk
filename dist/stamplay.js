/*! Stamplay v1.3.0 | (c) 2015 The Stamplay Dreamteam *//**
@author Stamplay
@version 1.0
@description an awesome javascript sdk for Stamplay 
*/
/* Initizialize library */
(function (root) {
	
	/*  Inizialization of Stamplay Object */
	root.Stamplay = root.Stamplay || {};
	/* setting attribute API Version */
	root.Stamplay.VERSION = "v1";
	/* Silence Q logging */
	Q.stopUnhandledRejectionTracking();
	/* appId */
	root.Stamplay.APPID = "";
	/* baseUrl */
	root.Stamplay.BASEURL = "";
	/*  check if exist local storage with the support of store.js */
	if (window.localStorage && store.enabled) {
		root.Stamplay.USESTORAGE = true;
	}

	if (getURLParameter('jwt')) {
		if (Stamplay.USESTORAGE) {
			store.set(window.location.origin + '-jwt', getURLParameter('jwt'));
		}
	}

	/* init method for setup the base url */
	root.Stamplay.init = function (appId) {
		root.Stamplay.BASEURL = 'https://' + appId + '.stamplayapp.com';
		root.Stamplay.APPID = appId;
	};

	function getURLParameter(name) {
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
	}

}(this));
/* ---- STAMPLAY JS SDK ---- */
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
/* ---- STAMPLAY JS SDK ---- */
/* 
 * Exspose BaseComponent the super class of all components on Stamplay.
 *  It extends Model and Collection.
 */
(function (root) {

	//method to add underscore function
	var addMethod = function (length, method, attribute) {
		switch (length) {
		case 1:
			return function () {
				return _[method](this[attribute]);
			};
		case 2:
			return function (value) {
				return _[method](this[attribute], value);
			};
		case 3:
			return function (iteratee, context) {
				return _[method](this[attribute], iteratee, context);
			};
		case 4:
			return function (iteratee, defaultVal, context) {
				return _[method](this[attribute], iteratee, defaultVal, context);
			};
		default:
			return function () {
				var args = Array.prototype.slice.call(arguments);
				args.unshift(this[attribute]);
				return _[method].apply(_, args);
			};
		}
	};

	//method to add underscore method to collection or model
	var addUnderscoreMethods = function (Class, methods, attribute) {
		_.each(methods, function (length, method) {
			if (_[method])
				Class[method] = addMethod.call(Class, length, method, attribute);
		});
	};

	/* Action constructor, it takes a instance of BaseComponent */
	function Action() {

		// private function, use for make parametric Promises
		var makeActionPromise = function (action, type) {
			var _this = this;
			if (type) {
				return Stamplay.makeAPromise({
					method: 'PUT',
					data: {
						type: type
					},
					url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/' + this.resourceId + '/' + this.instance._id + '/' + action
				}).then(function (response) {
					_this.instance = response;
				});
			} else {
				return Stamplay.makeAPromise({
					method: 'PUT',
					url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/' + this.resourceId + '/' + this.instance._id + '/' + action
				}).then(function (response) {
					_this.instance = response;
				});
			}
		};

		// upVote function
		// Modifies instance of model and return a promise
		this.upVote = function () {
			return makeActionPromise.call(this, 'vote', 'upvote');
		};

		// upVote function
		// Modifies instance of model and return a promise
		this.downVote = function () {
			return makeActionPromise.call(this, 'vote', 'downvote');
		};

		// rate function, it takes a vote parameter. 
		// Modifies instance of model and return a promise
		this.rate = function (vote) {
			// vote must be integer
			var _this = this;
			if (parseInt(vote)) {
				return Stamplay.makeAPromise({
					method: 'PUT',
					data: {
						rate: vote
					},
					url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/' + this.resourceId + '/' + this.instance._id + '/rate'
				}).then(function (response) {
					_this.instance = response;
				});
			} else {
				throw new Error('vote parameter to rate function must be a integer');
			}
		};

		// comment function, it takes a text parameter. 
		// Modifies instance of model and return a promise
		this.comment = function (text) {
			var _this = this;
			return Stamplay.makeAPromise({
				method: 'PUT',
				data: {
					text: text
				},
				url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/' + this.resourceId + '/' + this.instance._id + '/comment'
			}).then(function (response) {
				_this.instance = response;
			});
		};

		// twitterShare function
		// Modifies instance of model and return a promise
		this.twitterShare = function () {
			return makeActionPromise.call(this, 'twitter_share');
		};

		// facebookShare function
		// Modifies instance of model and return a promise
		this.facebookShare = function () {
			return makeActionPromise.call(this, 'facebook_share');
		};

		// simplest methods for get Actions

		this.getComments = function () {
			return this.get('actions').comments;
		};

		this.getVotes = function (type) {
			if (type && (type === 'up' || type === 'down')) {
				return this.get('actions').votes['users_' + type + 'vote'];
			} else {
				return this.get('actions').votes.users;
			}
		};

		this.getRatings = function () {
			return this.get('actions').ratings.users;
		};

		this.getTwitterShares = function () {
			return this.get('actions').twitter_shares.users;
		};

		this.getFacebookShares = function () {
			return this.get('actions').facebook_shares.users;
		};

	}

	/* Model constructor, it takes brickId, resourceId and hasAction
	 *  If hasAction is true, Model extends Action
	 */
	function Model(brickId, resourceId, hasAction) {

		// Model variable
		// data from server
		this.instance = {};
		// name of baseComponent
		this.brickId = brickId;
		// name of subresource
		this.resourceId = resourceId;

		var modelMethods = {
			keys: 1,
			values: 1,
			pairs: 1,
			invert: 1,
			pick: 0,
			omit: 0,
			chain: 1,
			isEmpty: 1
		};

		// Mix in each Underscore method as a proxy to `Model#attributes`.
		addUnderscoreMethods(this, modelMethods, 'instance');

		// if baseComponent hasAction add some methods to Model 
		if (hasAction) {
			Action.call(this);
		}

		// constructor
		this.constructor = function (instance) {
			this.instance = {};
			var keys = Object.keys(instance);
			for (var i = 0, j = keys.length; i < j; i++) {
				var key = keys[i];
				var value = instance[key];
				this.set(key, value);
			}
			return this;
		};

		// get function, it takes a key 
		// Return the key if exist 
		this.get = function (key) {
			return this.instance[key];
		};

		// set function, it takes the key and the value
		// Set the key to the Model with the value
		this.set = function (key, value) {
				this.instance[key] = value;
			},

			// unset function, it takes  the key
			// Delete the key from Model
			this.unset = function (key) {
				delete this.instance[key];
			},

			// fetch function, it takes _id and thisParams
			//  Modifies instance of model with the response of Stamplay's server
			this.fetch = function (_id, thisParams) {

				thisParams = thisParams || {};
				var _this = this;
				return Stamplay.makeAPromise({
					method: 'GET',
					url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/' + this.resourceId + '/' + _id,
					thisParams: thisParams
				}).then(function (response) {
					_this.instance = response;
				});

			},

			// save function, it takes options
			// Saves Model to Stamplay's db, if the Model already exists an update request is made    
			this.save = function (options) {

				options = options || {};

				var getUpdateMethod = function () {
					return (options.patch) ? 'PATCH' : 'PUT';
				};

				if (!this.instance) {
					return;
				}

				var method = (!this.instance._id) ? 'POST' : getUpdateMethod();

				var url = '/api/' + this.brickId + '/' + Stamplay.VERSION + '/' + this.resourceId;

				if (method === 'PATCH' || method === 'PUT') {
					url = url + '/' + this.get('_id');
					Stamplay.removeAttributes(this.brickId, this.instance);
				}

				var _this = this;
				return Stamplay.makeAPromise({
					method: method,
					url: url,
					data: this.instance
				}).then(function (response) {
					_this.instance = response;
				});
			},

			// destroy function 
			// Delete Model to Stamplay's db
			this.destroy = function () {
				var isUser = (this.brickId === 'user');
				if (this.get('_id')) {

					return Stamplay.makeAPromise({
						method: 'DELETE',
						url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/' + this.resourceId + '/' + this.get('_id')
					}).then(function (response) {

						if (isUser && Stamplay.USESTORAGE) {
							var jwt = store.get(window.location.origin + '-jwt');
							if (jwt) {
								store.remove(window.location.origin + '-jwt');
							}
						}

						return response;

					});

				} else {
					return false;
				}
			};

	}

	/* Collection constructor, it takes brickId, resourceId 
	 */
	function Collection(brickId, resourceId) {

		//Collection variable
		// data from server
		this.instance = [];
			// name of baseComponent
		this.brickId = brickId;
		// name of subresource
		this.resourceId = resourceId;
		//length of Collection
		this.length = this.instance.length;
			//total element 
		this.totalElement = 0;
		//links for pagination
		this.link = {};
		//the fetchParameters
		this.currentQuery = {};

		//method for parsing the currentquery 
		var parseCurrentQuery = function (currentQuery) {
			var query = {};
			for (var key in currentQuery) {
				
				if (key === 'find') {
					for (var attr in currentQuery[key]) {
						query[attr] = currentQuery[key][attr];
					}
				} else if (key === 'limit') {
					query.n = currentQuery[key];
				} else if (key === 'select') {
					query.select = currentQuery[key].join(",");
				} else if (key === 'sort') {
					query.sort = currentQuery[key];
				} else if (key === 'pagination') {
					query.page = currentQuery[key][0];
					query.per_page = currentQuery[key][1];
				}else if (key === 'populate') {
					query.populate = true;
				}else if (key === 'populateOwner') {
					query.populate_owner = true;
				}
			}
			return query;
		};

		//method to compile the params
		this.compile = function () {
			return parseCurrentQuery(this.currentQuery);
		};

		//method to set populate in queryparams
		this.populate = function(){
			this.currentQuery.populate = true;
			return this;
		};

		//method to set populate owner in queryparams
		this.populateOwner = function(){
			this.currentQuery.populateOwner = true;
			return this;
		};

		//method to set the pagination
		this.pagination = function (page, perPage) {
				if (page && perPage) {
					this.currentQuery.pagination = [page, perPage];
				} else {
					throw new Error('Pagination want two parameters');
				}
				return this;
		};
		//method to set an attribute must be equal to given value
		this.equalTo = function (attr, value) {
			if (!this.currentQuery.find){ 
				this.currentQuery.find = {}
			};
			if (typeof attr === "object") {
				for (var key in attr) {
					this.currentQuery.find[key] = attr[key];
				}
			} else {
				this.currentQuery.find[attr] = value;
			}
			return this;
		};
		//method to limit the results of query
		this.limit = function (limit) {
				this.currentQuery.limit = limit;
				return this;
		};
		//method to select only the attrs do you want to see
		this.select = function (attr) {
				if (!this.currentQuery.select)
					this.currentQuery.select = [];
				if (attr instanceof Array){
					for (var i = 0; i < attr.length; i++) {
						this.currentQuery.select.push(attr[i]);
					} 
				}else
					this.currentQuery.select.push(attr);
				return this;
		};
			//method to sort ascending
		this.sortAscending = function (attr) {
			this.currentQuery.sort = attr;
			return this;
		};
			//method to sort descending
		this.sortDescending = function (attr) {
			this.currentQuery.sort = '-' + attr;
			return this;
		};

		var collectionMethods = {
			forEach: 3,
			each: 3,
			map: 3,
			collect: 3,
			reduce: 4,
			foldl: 4,
			inject: 4,
			reduceRight: 4,
			foldr: 4,
			find: 3,
			detect: 3,
			filter: 3,
			reject: 3,
			every: 3,
			all: 3,
			some: 3,
			any: 3,
			include: 2,
			contains: 2,
			invoke: 2,
			max: 3,
			min: 3,
			toArray: 1,
			size: 1,
			first: 3,
			head: 3,
			take: 3,
			initial: 3,
			rest: 3,
			tail: 3,
			drop: 3,
			last: 3,
			without: 0,
			difference: 0,
			indexOf: 3,
			shuffle: 1,
			lastIndexOf: 3,
			isEmpty: 1,
			chain: 1,
			sample: 3,
			partition: 3
		};

		// Mix in each Underscore method as a proxy to `Collection`.
		addUnderscoreMethods(this, collectionMethods, 'instance');

		// get function, it takes _id 
		// Return Model with _id
		this.get = function (_id) {
				for (var i = 0, j = this.instance.length; i < j; i++) {
					if (this.instance[i].get('_id') == _id) {
						return this.instance[i];
					}
				}
			},

			// at function, it takes index
			// Return Model at index 
			this.at = function (index) {
				return this.instance[index];
			},

			// pop function
			// Remove the last Model and return it
			this.pop = function () {
				var last = this.instance[this.instance.length - 1];
				if (this.instance.length != 0) {
					this.remove(last.get('_id'));
					return last;
				} else
					return false;
			},

			// shift function
			// Remove the first Model and return it
			this.shift = function () {
				var first = this.instance[0];
				if (first) {
					this.remove(first.get('_id'));
					return first;
				} else
					return false;
			},

			// add function
			// Add a Model 
			this.add = function (model) {
				if (model instanceof Object && model.brickId == this.brickId && model.get('_id')) {
					if (model.brickId == 'cobject') {
						if (model.resourceId == this.resourceId) {
							this.instance.push(model);
							this.length = this.instance.length;
						}
					} else {
						this.instance.push(model);
						this.length = this.instance.length;
					}
				}
			},

			//return the number of entries on Stamplay's db
			this.count = function () {
				return this.totalElements;
			};

		//set collection with an array of model 
		this.set = function (models) {

			if (models instanceof Array) {
				var _this = this;
				models.forEach(function (singleInstance) {
					if (singleInstance instanceof Object) {
						var instanceModel;
						//cobject has a particular constructor
						if (_this.brickId == 'cobject') {
							instanceModel = new root.Stamplay.Cobject(_this.resourceId);
							instanceModel = instanceModel.Model.constructor(singleInstance);
						} else {
							//capitalize resource for implement dynamic inizialization of model
							var dynamicModel = _this.brickId.charAt(0).toUpperCase() + _this.brickId.slice(1);
							instanceModel = new root.Stamplay[dynamicModel];
							instanceModel = instanceModel.Model.constructor(singleInstance);
						}
						_this.instance.push(instanceModel);
					}
				});
				_this.length = _this.instance.length;
			} else {
				throw new Error('Set method on Collection wants an Array');
			}

		};

		// fetch function, it takes thisParams
		// Return a promise. Modify the instance with the data from Stamplay Server
		this.fetch = function (thisParams) {

				thisParams = thisParams && _.extend(thisParams, this.compile()) || this.compile();
				var _this = this;

				if (_this.brickId === 'cobject') {
					var headers = true;
				}

				return Stamplay.makeAPromise({
					method: 'GET',
					url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/' + this.resourceId,
					thisParams: thisParams
				}, headers).then(function (response) {
					//set two attributes to collection
					if (response.totalElements && response.pagination) {
						_this.totalElements = parseInt(response.totalElements);
						_this.pagination = response.pagination;
					}
					_this.instance = [];
					//iterate on data and instance a new Model with the prototype functions
					response.data.forEach(function (singleInstance) {
						var instanceModel;
						//cobject has a particular constructor
						if (_this.brickId === 'cobject') {
							instanceModel = new root.Stamplay.Cobject(_this.resourceId);
							instanceModel = instanceModel.Model.constructor(singleInstance);
						} else {
							//capitalize resource for implement dynamic inizialization of model
							var dynamicModel = _this.brickId.charAt(0).toUpperCase() + _this.brickId.slice(1);
							instanceModel = new root.Stamplay[dynamicModel];
							instanceModel = instanceModel.Model.constructor(singleInstance);
						}
						_this.instance.push(instanceModel);
					});
					_this.length = _this.instance.length;
				});
			},

			//remove function, it takes a array of id o just one id 
			// Remove Model with _id
			this.remove = function (_id) {

				if (_id instanceof Array) {
					this.instance = _.reject(this.instance, function (model) {
						for (var indexId in _id) {
							if (model.get('_id') == _id[indexId]) {
								return true;
							}
						}
					}, this);
					this.length = this.instance.length;
				} else {
					this.instance = _.reject(this.instance, function (model) {
						if (model.get('_id') == _id) {
							return true;
						}
					}, this);
					this.length = this.instance.length;
				}
			};
	};
	/* BaseComponent constructor, it takes brickId, resourceId and hasAction
	 *  If hasAction is true, Model extends Action
	 */
	function BaseComponent(brickId, resourceId, hasAction) {
		//variable
		this.Model = {};
		this.Collection = {};
		Model.call(this.Model, brickId, resourceId, hasAction);
		Collection.call(this.Collection, brickId, resourceId);
	}

	// Added BaseComponent Object to Stamplay
	root.Stamplay.BaseComponent = BaseComponent;

}(this));
/* ---- STAMPLAY JS SDK ---- */
/* Add Support function to Stamplay
 * it use for handling some functionality
 * very easy to use : Stamplay.Support.redirect('http://stamplay.com')
 */
(function (root) {

	// constructor for Support Object
	function Support() {

		// function to redirect to specified url
		this.redirect = function (url) {
			window.location.href = url;
		};

		// function for check if you have user with a specific email 
		this.validateEmail = function (email) {
			return Stamplay.makeAPromise({
				method: 'POST',
				data: {
					email: email
				},
				url: '/api/auth/' + Stamplay.VERSION + '/validate/email'
			});
		};

		this.checkMongoId = function(mongoId){
			var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
			var syntaxValid = (((typeof mongoId) === 'string') && checkForHexRegExp.test(mongoId));
			return syntaxValid;
		};

		this.errorSender = function(status, message){
			var deferred = Q.defer();
			deferred.reject({"status":status, "message":message});
			return deferred.promise;
		};

	}
	var support = new Support();
	// Added Support Object to Stamplay
	root.Stamplay.Support = support;

})(this);
/* ---- STAMPLAY JS SDK ---- */
/* Add Query function to Stamplay
 * it use for handling some funcctionality
 * very easy to use : Stamplay.Query('user').equalTo('name':'john')
 */
(function (root) {
	// constructor for Query Object
	// model is required ever
	function Query(model, instance) {
		
		this.model = model;
		this.instance = instance;
		this.currentQuery = [];
		this.executable = '';
	
		this.or = function(){
			var obj = { $or : []};

			if (arguments[0] instanceof Array) {
				arguments = arguments[0];
			}
			
			for(var i=0; i<arguments.length; i++){
				if(arguments[i] instanceof root.Stamplay.Query)
					obj.$or.push(arguments[i].currentQuery[0]);
				else
					throw new Error('Please Or function take only Query object');	
			}
			this.currentQuery.push(obj);
			return this;
		};

		this.between = function(attr,value1,value2){
			var obj = {};
			obj[attr] = {"$gte":value1, "$lte":value2};
			this.currentQuery.push(obj);
			return this;
		};

		this.greaterThan = function(attr, value){
			var obj = {};
			obj[attr] = {"$gt":value};
			this.currentQuery.push(obj);
			return this;
		};	

		this.greaterThanOrEqual = function(attr, value){
			var obj = {};
			obj[attr] = {"$gte":value};
			this.currentQuery.push(obj);
			return this;
		};

		this.lessThan = function(attr, value){
			var obj = {};
			obj[attr] = {"$lt":value};
			this.currentQuery.push(obj);
			return this;
		};	

		this.lessThanOrEqual = function(attr, value){
			var obj = {};
			obj[attr] = {"$lte":value};
			this.currentQuery.push(obj);
			return this;
		};

		this.equalTo = function(attr, value){
			var obj = {};
			obj[attr] = value;
			this.currentQuery.push(obj);
			return this;
		};

		this.sortAscending = function(value){
			var obj = {
				$sort: {}
			};
			obj.$sort[value] = 1;
			this.currentQuery.push(obj);
			return this;
		};

		this.sortDescending = function(value){
			var obj = {
				$sort: {}
			};
			obj.$sort[value] = -1;
			this.currentQuery.push(obj);
			return this;
		};

		this.exists = function(attr){
			var obj = {};
			obj[attr] = {"$exists":true};
			this.currentQuery.push(obj);
			return this;
		};

		this.notExists = function(attr){
			var obj = {};
			obj[attr] = {"$exists":false};
			this.currentQuery.push(obj);
			return this;
		};

		this.exec = function(){
			//build query
			for(var i=0;i<this.currentQuery.length;i++){	
				var partial = JSON.stringify(this.currentQuery[i]);
				partial = partial.substring(1, partial.length-1);
				if(i===0)
					this.executable += partial;
				else
					this.executable += ','+partial;
			}
			if(!this.instance)
				this.instance = this.model+'s'; 

			return Stamplay.makeAPromise({
				method: 'GET',
				url: '/api/' + this.model + '/' + Stamplay.VERSION + '/' + this.instance +'?where={'+this.executable+'}' ,
			}).then(function (response) {
				return response.data;
			});
		};

	}

	// Added Query Object to Stamplay
	root.Stamplay.Query = Query;

})(this);
/* ---- STAMPLAY JS SDK ---- */
/* Brick : User 
 	GET    '/api/user/VERSION/users'
  GET    '/api/user/VERSION/users/:id'
  POST   '/api/user/VERSION/users'
  PUT    '/api/user/VERSION/users/:id'
  DELETE '/api/user/VERSION/users/:id'
  GET    '/api/user/VERSION/getStatus'
*/

(function (root) {

	/**
		User component : Stamplay.User 
		This class rappresent the User component on Stamplay platform
		It very easy to use: Stamplay.User()
	*/

	// constructor
	function User() {
			Stamplay.BaseComponent.call(this, 'user', 'users');

			// currentUser function
			// Modifies the instance of User 
			this.Model.currentUser = function () {
					var _this = this;
					return Stamplay.makeAPromise({
						method: 'GET',
						url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/getStatus'
					}).then(function (response) {
						_this.instance = response.user || {};
					});
				},
				// isLoggedfunction
				// return true if user is logged
				this.Model.isLogged = function () {
					if (this.instance._id)
						return true;
					return false;
				};

			// login function, it takes serviceOrEmail and password
			// if exists password parameter, login strategy is local Authentication
			// else the login strategy is service Authentication
			// there are a lot of services : facebook, twitter
			this.Model.login = function (serviceOrEmail, password) {
					var _this = this;

					if (password) {

						var data = {
							email: serviceOrEmail,
							password: password
						};

						return Stamplay.makeAPromise({
							method: 'POST',
							data: data,
							url: '/auth/' + Stamplay.VERSION + '/local/login',
						}).then(function (response) {
							_this.instance = response || {};
						});

					} else {
						var jwt = store.get(window.location.origin + '-jwt');
						if (jwt) {
							// Store temporary cookie to permit user aggregation
						  var date = new Date();
			        date.setTime(date.getTime() + 5 * 60 * 1000);
							document.cookie = 'stamplay.jwt='+jwt+'; expires=' + date.toGMTString() + '; path=/'
						}
						var url = '/auth/' + Stamplay.VERSION + '/' + serviceOrEmail + '/connect';
						var port = (window.location.port) ? ':'+window.location.port : '';
						root.Stamplay.Support.redirect(location.protocol + '//' + document.domain +port+ url);
					}
				},

				// signup function, it takes objcet data
				// If data.email and data.password doesn't exists return error
				// any other attributes in data was save to User  
				this.Model.signup = function (data) {

					if (data.email && data.password) {

						var _this = this;

						return Stamplay.makeAPromise({
							method: 'POST',
							data: data,
							url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/' + this.resourceId
						}).then(function (response) {
							_this.instance = response || {};
						});

					} else {
						throw new Error('Stamplay.User.Model.signup(data) needs that data object has the email and password keys');
					}
				},

				// logout function
				this.Model.logout = function () {
					if (Stamplay.USESTORAGE) {
						store.remove(window.location.origin + '-jwt');
					}
					root.Stamplay.Support.redirect('/auth/' + Stamplay.VERSION + '/logout');
				};

				this.Model.resetPassword = function(email, newPassword){
					if(email && newPassword)
						return Stamplay.makeAPromise({
							method: 'POST',
							data: {email: email, newPassword:newPassword },
							url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/users/resetpassword'
						}).then(function (response) {
							return response;
						});
					else
						return Stamplay.Support.errorSender(403, "Missing parameters in resetPassword method");
				};

				this.Model.activities = function (id) {
					return Stamplay.makeAPromise({
						method: 'GET',
						url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/users/'+id+'/activities'
					}).then(function (response) {
						return response;
					});
				};

				this.Model.following = function (id) {
					return Stamplay.makeAPromise({
						method: 'GET',
						url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/users/'+id+'/following'
					}).then(function (response) {
						return response;
					});
				};

				this.Model.followedBy = function (id) {
					return Stamplay.makeAPromise({
						method: 'GET',
						url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/users/'+id+'/followed_by'
					}).then(function (response) {
						return response;
					});
				};

				this.Model.follow = function (id) {
					return Stamplay.makeAPromise({
						method: 'PUT',
						data: {'userId': id},
						url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/users/follow'
					}).then(function (response) {
						return response;
					});
				};

				this.Model.unfollow = function (id) {
					return Stamplay.makeAPromise({
						method: 'PUT',
						data: {'userId': id},
						url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/users/unfollow'
					}).then(function (response) {
						return response;
					});
				};

		}
		//Added User to Stamplay 
	root.Stamplay.User = User;

})(this);
/* ---- STAMPLAY JS SDK ---- */
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

	/**
		Custom object component : Stamplay.Cobject 
		This class rappresent the Custom Object component on Stamplay platform
		It very easy to use: Stamplay.Cobject([customObjectid])
	*/

	//constructor
	function Cobject(resourceId) {
		Stamplay.BaseComponent.call(this, 'cobject', resourceId, true);

		this.Collection.findByAttr = function (attr) {
			if(attr){
				var _this = this;
				return Stamplay.makeAPromise({
					method: 'GET',
					url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/' + this.resourceId + '/find/'+attr
				}).then(function (response) {
					if (response.totalElements && response.pagination) {
							_this.totalElements = parseInt(response.totalElements);
							_this.pagination = response.pagination;
						}
						_this.instance = [];
						//iterate on data and instance a new Model with the prototype functions
						response.data.forEach(function (singleInstance) {
							var instanceModel = new root.Stamplay.Cobject(_this.resourceId);
							instanceModel = instanceModel.Model.constructor(singleInstance);
							_this.instance.push(instanceModel);
						});
						_this.length = _this.instance.length;
				});
			}else{
				return Stamplay.Support.errorSender(403, "Missing parameter in findByAttr method");
			}
		}
	}
	//Added Cobject to Stamplay 
	root.Stamplay.Cobject = Cobject;

})(this);
/* ---- STAMPLAY JS SDK ---- */
/* Brick : Webhook 
 *  POST   '/api/webhook/VERSION/:webhookId/catch'
 */
(function (root) {

	/*
		Webhook component : Stamplay.Webhook 
		This class rappresent the Webhook Object component on Stamplay platform
		It very easy to use: Stamplay.Webhook([WebhookName])
	*/

	//constructor
	function Webhook(resourceId) {

		var resource = resourceId.replace(/[^\w\s]/gi, '').trim().toLowerCase().replace(/\s+/g, '_');

		this.url = '/api/webhook/' + Stamplay.VERSION + '/' + resource + '/catch';

		this.post = function (data, queryParams) {
			return Stamplay.makeAPromise({
				method: 'POST',
				data: data,
				url: this.url,
				thisParams: queryParams
			});
		};

		this.put = function (data, queryParams) {
			return Stamplay.makeAPromise({
				method: 'PUT',
				data: data,
				url: this.url,
				thisParams: queryParams
			});
		};

		this.get = function (queryParams) {
			return Stamplay.makeAPromise({
				method: 'GET',
				url: this.url,
				thisParams: queryParams
			});
		};

	}
	//Added Webhook to Stamplay 
	root.Stamplay.Webhook = Webhook;

})(this);
/* ---- STAMPLAY JS SDK ---- */
/* Brick : stripe 
 * POST  'api/stripe/VERSION/customers'
 * POST  'api/stripe/VERSION/customers/:userId/cards'
 * POST  'api/stripe/VERSION/charges'
 * POST  'api/stripe/VERSION/customers/:userId/subscriptions'
 * GET   'api/stripe/VERSION/customers/:userId/subscriptions'
 */

(function (root) {

	/*
		Stripe component : Stamplay.Stripe 
		This class rappresent the Stripe Object component on Stamplay platform
		It very easy to use: Stamplay.Stripe()
	*/

	//constructor
	function Stripe() {

		this.url = '/api/stripe/' + Stamplay.VERSION + '/';

		this.createCustomer = function (userId) {
			if (Stamplay.Support.checkMongoId(userId))
				return Stamplay.makeAPromise({
					method: 'POST',
					data: {
						'userId': userId
					},
					url: this.url + 'customers'
				});
			else
				return Stamplay.Support.errorSender(403, "Invalid userId");
		};

		this.createCreditCard = function (userId, token) {
			if (arguments.length == 2) {
				if (Stamplay.Support.checkMongoId(userId))
					return Stamplay.makeAPromise({
						method: 'POST',
						data: {
							'token': token
						},
						url: this.url + 'customers/' + userId + '/cards'
					});
				else
					return Stamplay.Support.errorSender(403, "Invalid userId");
			} else {
				return Stamplay.Support.errorSender(403, "Missing parameters in createCreditCard methods");
			}
		};

		this.updateCreditCard = function (userId, token) {
			if (arguments.length == 2) {
				if (Stamplay.Support.checkMongoId(userId))
					return Stamplay.makeAPromise({
						method: 'PUT',
						data: {
							'token': token
						},
						url: this.url + 'customers/' + userId + '/cards'
					});
				else
					return Stamplay.Support.errorSender(403, "Invalid userId");
			} else {
				return Stamplay.Support.errorSender(403, "Missing parameters in updateCreditCard methods");
			}
		};

		this.charge = function (userId, token, amount, currency) {
			if (arguments.length == 4) {
				if (Stamplay.Support.checkMongoId(userId))
					return Stamplay.makeAPromise({
						method: 'POST',
						data: {
							'userId': userId,
							'token': token,
							'amount': amount,
							'currency': currency
						},
						url: this.url + 'charges'
					});
				else
					return Stamplay.Support.errorSender(403, "Invalid userId");
			} else {
				return Stamplay.Support.errorSender(403, "Missing parameters in charge methods");
			}
		};


		this.createSubscription = function (userId, planId) {
			if (arguments.length === 2) {
				if (Stamplay.Support.checkMongoId(userId)) {
					return Stamplay.makeAPromise({
						method: 'POST',
						data: {
							'planId': planId
						},
						url: this.url + 'customers/' + userId + '/subscriptions'
					});
				} else {
					return Stamplay.Support.errorSender(403, "Invalid userId");
				}
			} else {
				return Stamplay.Support.errorSender(403, "Missing parameters in createSubscription methods");
			}
		};

		this.getSubscriptions = function (userId, options) {
			if (arguments.length >= 1) {
				if (Stamplay.Support.checkMongoId(userId)) {
					return Stamplay.makeAPromise({
						method: 'GET',
						url: this.url + 'customers/' + userId + '/subscriptions',
						thisParams: options
					});
				} else {
					return Stamplay.Support.errorSender(403, "Invalid userId");
				}
			} else {
				return Stamplay.Support.errorSender(403, "Missing parameters in getSubscriptions methods");
			}
		};

		this.getSubscription = function (userId, subscriptionId) {
			if (arguments.length <= 2) {
				if (Stamplay.Support.checkMongoId(userId)) {
					return Stamplay.makeAPromise({
						method: 'GET',
						url: this.url + 'customers/' + userId + '/subscriptions/' + subscriptionId,
					});
				} else {
					return Stamplay.Support.errorSender(403, "Invalid userId");
				}
			} else {
				return Stamplay.Support.errorSender(403, "Missing parameters in getSubscription methods");
			}
		};

		this.getCreditCard = function (userId) {
			if (arguments.length == 1) {
				if (Stamplay.Support.checkMongoId(userId)) {
					return Stamplay.makeAPromise({
						method: 'GET',
						url: this.url + 'customers/' + userId + '/cards',
					});
				} else {
					return Stamplay.Support.errorSender(403, "Invalid userId");
				}
			} else {
				return Stamplay.Support.errorSender(403, "Invalid parameter in getCreditCard method");
			}
		};

		this.deleteSubscription = function (userId, subscriptionId, options) {
			if (arguments.length === 2) {
				if (Stamplay.Support.checkMongoId(userId)) {
					return Stamplay.makeAPromise({
						method: 'DELETE',
						url: this.url + 'customers/' + userId + '/subscriptions/' + subscriptionId,
						data: options || {}
					});
				} else {
					return Stamplay.Support.errorSender(403, "Invalid userId");
				}
			} else {
				return Stamplay.Support.errorSender(403, "Missing parameters in deleteSubscription methods");
			}
		};

		this.updateSubscription = function (userId, subscriptionId, options) {
			if (arguments.length >= 2) {
				if (Stamplay.Support.checkMongoId(userId)) {
					options = options || {};
					return Stamplay.makeAPromise({
						method: 'PUT',
						url: this.url + 'customers/' + userId + '/subscriptions/' + subscriptionId,
						data: {
							options: options
						}
					});
				} else {
					return Stamplay.Support.errorSender(403, "Invalid userId");
				}
			} else {
				return Stamplay.Support.errorSender(403, "Missing parameters in updateSubscription methods");
			}
		};

	}

	root.Stamplay.Stripe = Stripe;

})(this);
/* ---- STAMPLAY JS SDK ---- */
/* Brick : Codeblock 
 *  POST   '/api/codeblock/VERSION/:CodeblockId/catch'
 */
(function (root) {


	/*
		Codeblock component : Stamplay.Codeblock 
		This class rappresent the Codeblock Object component on Stamplay platform
		Stamplay.Codeblock(codeblockId)
	*/

	//constructor
	function Codeblock(resourceId) {

		var resource = resourceId.replace(/[^\w\s]/gi, '').trim().toLowerCase().replace(/\s+/g, '_');

		this.url = '/api/codeblock/' + Stamplay.VERSION + '/run/' + resource;

		function _parseMethod(method) {
			var result = 'POST';
			if (typeof method === 'string') {
				switch (method) {
				case 'GET':
				case 'POST':
				case 'PUT':
				case 'PATCH':
				case 'DELETE':
					result = method;
					break;
				default:
					return Stamplay.Support.errorSender(403, "Invalid HTTP verb: available verbs are GET,POST,PUT,PATCH and DELETE");
					break;
				}
			}
			return result;
		}

		function _parseData(method, data) {
			var result = (data == null || data == undefined) ? undefined : data;
			switch (method) {
			case 'POST':
			case 'PUT':
			case 'PATCH':
				break;
			default:
				result = undefined;
				break;
			}
			return result;
		}

		this.run = function (data, queryParams) {
			/*
				args 0
															->  	POST			no body		no query params   
				args 3 
				 	method data queryParams -> 	method 		data 			queryParams	
			*/
			var finalMethod = _parseMethod('POST');
			var finalData = _parseData('POST', data);
			var finalQuery = queryParams;

			return Stamplay.makeAPromise({
				method: finalMethod,
				data: finalData,
				url: this.url,
				thisParams: queryParams
			});
		};

	}
	//Added Webhook to Stamplay 
	root.Stamplay.Codeblock = Codeblock;

})(this);