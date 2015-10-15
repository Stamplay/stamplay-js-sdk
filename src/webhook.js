/* globals  Stamplay */

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