/* globals  Stamplay */

/* Brick : Codeblock
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
