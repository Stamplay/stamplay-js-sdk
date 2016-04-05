/* globals  Stamplay, store */

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

}(this));