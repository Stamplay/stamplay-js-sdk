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
				throw new Error('Stamplay.codeblock(): Invalid HTTP verb: available verbs are GET,POST,PUT,PATCH and DELETE');
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
	//constructor
	function Codeblock(resourceId) {
		var resource = resourceId.replace(/[^\w\s]/gi, '').trim().toLowerCase().replace(/\s+/g, '_');
		var url = '/api/codeblock/' + root.Stamplay.VERSION + '/run/' + resource;
		return {
			run :function (data, queryParams, callbackObject) {
				/*
					args 0
																  ->  POST			no     		no query params   
					args 3 
					method data queryParams -> 	method 		data 			queryParams	
				*/				
				var finalMethod = _parseMethod('POST');
				var finalData = _parseData('POST', data);
				var finalQuery = queryParams;
				return root.Stamplay.makeAPromise({
					method: finalMethod,
					data: finalData,
					url: url,
					thisParams: queryParams
				}, callbackObject);
			}
		}
	}
	//Added Codeblock to Stamplay 
	root.Stamplay.Codeblock = Codeblock;
})(this);