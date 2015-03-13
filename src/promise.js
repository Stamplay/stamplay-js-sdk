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
	var parseLink = function(parts, link) {
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
		if(root.Stamplay.APPID != "" ){
			options.url = root.Stamplay.BASEURL + options.url;
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
		
		var headerStamplay = 'localhost';
		if (root.Stamplay.APPID != "") {
			headerStamplay = root.Stamplay.APPID;
		}
		
		req.setRequestHeader('Stamplay-App', headerStamplay);
		
		req.onreadystatechange = function (e) {
			if (req.readyState !== 4) {
				return;
			}
			if ([200, 304].indexOf(req.status) === -1) {
				deferred.reject(req);
			} else {

				//parse the JSON response from the server
				var response =JSON.parse(req.responseText)
					
				if(wantHeaders){
					//parse headers
					var parts = req.getResponseHeader('link').split(',');
					response.pagination = {};
					parseLink(parts, response.pagination);
					response.totalElements = req.getResponseHeader('x-total-elements')
					deferred.resolve(response);
				}else
					deferred.resolve(response);
			}
		};
		req.send(JSON.stringify(options.data) || void 0);
		return deferred.promise;
	}

	/* function to remove attributes from model before send the request to server*/
	root.Stamplay.removeAttributes = function(brick, instance){
		switch (brick){
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
	}
}(this));