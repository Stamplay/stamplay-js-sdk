/* globals  Stamplay */

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
