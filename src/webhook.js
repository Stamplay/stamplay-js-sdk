/* globals  Stamplay */

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

})(this);