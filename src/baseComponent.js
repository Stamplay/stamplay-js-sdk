/* globals  Stamplay, _, store */

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