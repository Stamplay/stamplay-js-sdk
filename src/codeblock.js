/* globals  Stamplay */

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