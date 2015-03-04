/**
@author Stamplay
@version 1.0
@description an awesome javascript sdk for Stamplay 
*/

/* Initizialize library */
(function (root) {
	/*  Inizialization of Stamplay Object */
	root.Stamplay = root.Stamplay || {};
	/* setting attribute API Version */
	root.Stamplay.VERSION = "v0";
	/* Silence Q logging*/
	Q.stopUnhandledRejectionTracking();
}(this));

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
	}

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
	}

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

		var deferred = Q.defer(),
			req = new XMLHttpRequest();
		req.open(options.method || 'GET', options.url, options.async || true);
		// Set request headers if provided.
		Object.keys(options.headers || {}).forEach(function (key) {
			req.setRequestHeader(key, options.headers[key]);
		});
		// Default content-Type  
		if (options.method && options.method !== 'DELETE') {
			req.setRequestHeader('Content-Type', 'application/json');
		}
		req.onreadystatechange = function (e) {
			if (req.readyState !== 4) {
				return;
			}
			if ([200, 304].indexOf(req.status) === -1) {
				deferred.reject(req);
			} else {

				//parse the JSON response from the server
				var response = JSON.parse(req.responseText)

				if (wantHeaders) {
					//parse headers
					var parts = req.getResponseHeader('link').split(',');
					response.link = {};
					parseLink(parts, response.link);
					response.totalElement = req.getResponseHeader('x-total-elements')
					deferred.resolve(response);
				} else
					deferred.resolve(response);
			}
		};
		req.send(JSON.stringify(options.data) || void 0);
		return deferred.promise;
	}

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
		default:
			break;

		}
	}
}(this));

/* Add Support function to Stamplay
 * it use for handling some funcctionality
 * very easy to use : Stamplay.Support.redirect('http://stamplay.com')
 */
(function (root) {

	// constructor for Support Object
	function Support() {

		// function to redirect to specified url
		this.redirect = function (url) {
				window.location.href = url;
			},

			// function for check if you have user with a specific email 
			this.validateEmail = function (email) {
				return Stamplay.makeAPromise({
					method: 'POST',
					data: {
						email: email
					},
					url: '/api/auth/' + Stamplay.VERSION + '/validate/email'
				})
			}

	};
	var support = new Support();
	// Added Support Object to Stamplay
	root.Stamplay.Support = support;

})(this);

/* Add Query function to Stamplay
 * it use for handling some funcctionality
 * very easy to use : Stamplay.Query('user').equalTo('name':'john')
 */
(function (root) {
	// constructor for Query Object
	// model is required ever
	function Query(model, instance) {
		this.currentQuery = {};
		this.model = model;
		this.instance = instance;
		//method for parsing the currentquery 
		var parseCurrentQuery = function (currentQuery) {
				var query = {}
				for (var key in currentQuery) {
					if (key == 'find') {
						for (attr in currentQuery[key]) {
							query[attr] = currentQuery[key][attr]
						}
					} else if (key == 'limit') {
						query['n'] = currentQuery[key]
					} else if (key == 'select') {
						query['select'] = currentQuery[key].join(",")
					} else if (key == 'sort') {
						query['sort'] = currentQuery[key]
					}
				}
				return query;
			}
			//method to run the query you make with Query object
		this.exec = function () {
			if (!this.instance)
				this.instance = this.model + 's';
			var thisParams = parseCurrentQuery(this.currentQuery)
			return Stamplay.makeAPromise({
				method: 'GET',
				url: '/api/' + this.model + '/' + Stamplay.VERSION + '/' + this.instance,
				thisParams: thisParams
			}).then(function (response) {
				return response
			})
		};
		//method to set an attribute must be equal to given value
		this.equalTo = function (attr, value) {
			if (!this.currentQuery.find)
				this.currentQuery.find = {}
			if (typeof attr == "object")
				for (key in attr) {
					this.currentQuery.find[key] = attr[key]
				} else
				this.currentQuery.find[attr] = value
			return this;
		};
		//method to limit the results of query
		this.limit = function (limit) {
				this.currentQuery.limit = limit
				return this;
			}
			//method to select only the attrs do you want to see
		this.select = function (attr) {
				if (!this.currentQuery.select)
					this.currentQuery.select = []
				if (attr instanceof Array)
					for (var i = 0; i < attr.length; i++) {
						this.currentQuery.select.push(attr[i])
					} else
					this.currentQuery.select.push(attr)
				return this
			}
			//method to sort ascending
		this.sortAscending = function (attr) {
				this.currentQuery.sort = attr
				return this
			}
			//method to sort descending
		this.sortDescending = function (attr) {
			this.currentQuery.sort = '-' + attr
			return this
		}

	};

	// Added Query Object to Stamplay
	root.Stamplay.Query = Query;

})(this);

/* Exspose BaseComponent the super class of all components on Stamplay.
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
		}

		// upVote function
		// Modifies instance of model and return a promise
		this.upVote = function () {
			return makeActionPromise.call(this, 'vote', 'upvote')
		};

		// upVote function
		// Modifies instance of model and return a promise
		this.downVote = function () {
			return makeActionPromise.call(this, 'vote', 'downvote')
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
			return makeActionPromise.call(this, 'twitter_share')
		};

		// facebookShare function
		// Modifies instance of model and return a promise
		this.facebookShare = function () {
			return makeActionPromise.call(this, 'facebook_share')
		};

		// simplest methods for get Actions

		this.getComments = function () {
			return this.get('actions').comments;
		};

		this.getVotes = function (type) {
			if (type && (type == 'up' || type == 'down')) {
				return this.get('actions').votes['users_' + type + 'vote'];
			} else {
				return this.get('actions').votes.users;
			}
		};

		this.getRatings = function (type) {
			return this.get('actions').ratings.users
		};

		this.getTwitterShares = function () {
			return this.get('actions').twitter_shares.users
		};

		this.getFacebookShares = function () {
			return this.get('actions').facebook_shares.users
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
			Action.call(this)
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
				}

				if (!this.instance) {
					return;
				}

				var method = (!this.instance._id) ? 'POST' : getUpdateMethod();

				var url = '/api/' + this.brickId + '/' + Stamplay.VERSION + '/' + this.resourceId;

				if (method === 'PATCH' || method === 'PUT') {
					url = url + '/' + this.get('_id');
					Stamplay.removeAttributes(this.brickId, this.instance)
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
				if (this.get('_id')) {

					return Stamplay.makeAPromise({
						method: 'DELETE',
						url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/' + this.resourceId + '/' + this.get('_id')
					});

				} else {

					return false;

				}
			}

	}

	/* Collection constructor, it takes brickId, resourceId 
	 */
	function Collection(brickId, resourceId) {

			//Collection variable
			// data from server
			this.instance = []
				// name of baseComponent
			this.brickId = brickId;
			// name of subresource
			this.resourceId = resourceId;
			//length of Collection
			this.length = this.instance.length
				//total element 
			this.totalElement = 0;
			//links for pagination
			this.link = {};

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
				select: 3,
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
			}

			// Mix in each Underscore method as a proxy to `Collection`.
			addUnderscoreMethods(this, collectionMethods, 'instance');

			// get function, it takes _id 
			// Return Model with _id
			this.get = function (_id) {
					for (var i = 0, j = this.instance.length; i < j; i++) {
						if (this.instance[i].get('_id') == _id) {
							return this.instance[i]
						}
					}
				},

				// at function, it takes index
				// Return Model at index 
				this.at = function (index) {
					return this.instance[index]
				},

				// pop function
				// Remove the last Model and return it
				this.pop = function () {
					var last = this.instance[this.instance.length - 1]
					if (this.instance.length != 0) {
						this.remove(last.get('_id'))
						return last
					} else
						return false
				},

				// shift function
				// Remove the first Model and return it
				this.shift = function () {
					var first = this.instance[0]
					if (first) {
						this.remove(first.get('_id'))
						return first
					} else
						return false;
				},

				// add function
				// Add a Model 
				this.add = function (model) {
					if (model instanceof Object && model.brickId == this.brickId && model.get('_id')) {
						if (model.brickId == 'cobject') {
							if (model.resourceId == this.resourceId) {
								this.instance.push(model)
								this.length = this.instance.length
							}
						} else {
							this.instance.push(model)
							this.length = this.instance.length
						}
					}
				},

				// fetch function, it takes thisParams
				// Return a promise. Modify the instance with the data from Stamplay Server
				this.fetch = function (thisParams, headers) {

					thisParams = thisParams || {};
					var _this = this;

					return Stamplay.makeAPromise({
						method: 'GET',
						url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/' + this.resourceId,
						thisParams: thisParams
					}, headers).then(function (response) {
						//set two attributes to collection
						if (response.totalElement && response.link) {
							_this.totalElement = parseInt(response.totalElement);
							_this.link = response.link;
						}
						_this.instance = [];
						//iterate on data and instance a new Model with the prototype functions
						response.data.forEach(function (singleInstance) {
							var instanceModel;
							//cobject has a particular constructor
							if (_this.brickId == 'cobject') {
								instanceModel = new root.Stamplay.Cobject(_this.resourceId)
								instanceModel = instanceModel.Model.constructor(singleInstance);
							} else {
								//capitalize resource for implement dynamic inizialization of model
								var dynamicModel = _this.brickId.charAt(0).toUpperCase() + _this.brickId.slice(1);
								instanceModel = new root.Stamplay[dynamicModel]
								instanceModel = instanceModel.Model.constructor(singleInstance);
							}
							_this.instance.push(instanceModel);
						})
						_this.length = _this.instance.length
					});
				},

				//remove function, it takes a array of id o just one id 
				// Remove Model with _id
				this.remove = function (_id) {

					if (_id instanceof Array) {
						this.instance = _.reject(this.instance, function (model) {
							for (indexId in _id) {
								if (model.get('_id') == _id[indexId]) {
									return true
								}
							}
						}, this)
						this.length = this.instance.length
					} else {

						this.instance = _.reject(this.instance, function (model) {
							if (model.get('_id') == _id) {
								return true
							}
						}, this)
						this.length = this.instance.length
					}
				}

		}
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

/* Brick : Cobject 
	GET     '/api/cobject/v0/:cobjectId 
	GET     '/api/cobject/v0/:cobjectId/:id   
	PUT     '/api/cobject/v0/:cobjectId/:id   
	PATCH   '/api/cobject/v0/:cobjectId/:id 
	POST    '/api/cobject/v0/:cobjectId       
	DELETE  '/api/cobject/v0/:cobjectId/:id
	PUT			'/api/cobject/v0/:cobjectId/:id/rate
	PUT     '/api/cobject/v0/:cobjectId/:id/comment
	PUT     '/api/cobject/v0/:cobjectId/:id/vote
	PUT     '/api/cobject/v0/:cobjectId/:id/facebook_share
	PUT     '/api/cobject/v0/:cobjectId/:id/twitter_share 
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
		}
		//Added Cobject to Stamplay 
	root.Stamplay.Cobject = Cobject;

})(this);


/* Brick : User 
 	GET    '/api/user/v0/users'
  GET    '/api/user/v0/users/:id'
  POST   '/api/user/v0/users'
  PUT    '/api/user/v0/users/:id'
  DELETE '/api/user/v0/users/:id'
  GET    '/api/user/v0/getStatus'
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
						return true
					return false
				}

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
						var url = '/auth/' + Stamplay.VERSION + '/' + serviceOrEmail + '/connect'
						root.Stamplay.Support.redirect(location.protocol + '//' + document.domain + url);
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
					root.Stamplay.Support.redirect(location.protocol + '//' + document.domain + '/auth/v0/logout');
				}

		}
		//Added User to Stamplay 
	root.Stamplay.User = User;

})(this);

/* Brick : Webhook 
 */
(function (root) {

	/**
		Webhook component : Stamplay.Webhook 
		This class rappresent the Webhook Object component on Stamplay platform
		It very easy to use: Stamplay.Webhook([WebhookName])
	*/

	//constructor
	function Webhook(resourceId) {

			var resource = resourceId.replace(/[^\w\s]/gi, '').trim().toLowerCase().replace(/\s+/g, '_');

			this.url = '/api/webhook/' + Stamplay.VERSION + '/' + resource + '/catch';

			this.get = function () {
				return Stamplay.makeAPromise({
					method: 'GET',
					url: this.url
				})
			}
			this.put = function (data) {
				return Stamplay.makeAPromise({
					method: 'PUT',
					data: data,
					url: this.url
				})
			}
			this.post = function (data) {
				return Stamplay.makeAPromise({
					method: 'POST',
					data: data,
					url: this.url
				})
			}

		}
		//Added Cobject to Stamplay 
	root.Stamplay.Webhook = Webhook;

})(this);