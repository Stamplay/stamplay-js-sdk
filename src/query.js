/* Add Query and paramsBuilder function to Stamplay
 * it use for handling some funcctionality
 * very easy to use : Stamplay.Query('user').equalTo('name':'john')
 */
(function (root) {
	// constructor for paramsBuilder Object
	function ParamsBuilder() {
		
		this.currentQuery = {};

		//method for parsing the currentquery 
		var parseCurrentQuery = function(currentQuery){
			var query = {}
			for(var key in currentQuery){
				if(key =='find'){
					for(attr in currentQuery[key]){
						query[attr] = currentQuery[key][attr]
					}
				}else if(key=='limit'){
					query['n'] = currentQuery[key]
				}else if(key=='select'){
					query['select'] = currentQuery[key].join(",")
				}else if(key=='sort'){
					query['sort'] = currentQuery[key]
				}
			}
			return query;
		}
		//method to compile the params
		this.compile = function(){
			return parseCurrentQuery(this.currentQuery)
		}
	
		//method to set an attribute must be equal to given value
		this.equalTo = function(attr, value){
			if(!this.currentQuery.find)
				this.currentQuery.find = {}
			if(typeof attr == "object")
				for(key in attr){
					this.currentQuery.find[key] = attr[key] 
				}
			else
				this.currentQuery.find[attr] =  value
			return this;
		};
		//method to limit the results of query
		this.limit = function(limit){
			this.currentQuery.limit = limit 
			return this;
		}
		//method to select only the attrs do you want to see
		this.select = function(attr){
			if(!this.currentQuery.select)
				this.currentQuery.select = []
			if(attr instanceof Array)
				for(var i=0; i<attr.length; i++){
					this.currentQuery.select.push(attr[i]) 
				}
			else
				this.currentQuery.select.push(attr) 
			return this
		}
		//method to sort ascending
		this.sortAscending = function(attr){
			this.currentQuery.sort= attr 
			return this
		}
		//method to sort descending
		this.sortDescending = function(attr){
			this.currentQuery.sort = '-'+attr 
			return this
		}

	};

	// Added Query Object to Stamplay
	root.Stamplay.ParamsBuilder = ParamsBuilder;

})(this);

(function (root) {
	// constructor for Query Object
	// model is required ever
	function Query(model, instance) {
		
		this.model = model;
		this.instance = instance;
		this.currentQuery = [];
		this.executable = '';
	
		this.or = function(){
			var obj = { $or : []}
			for(var i=0; i<arguments.length; i++){
				if(arguments[i] instanceof root.Stamplay.Query)
					obj.$or.push(arguments[i].currentQuery[0])
				else
					throw new Error('Please Or function take only Query object')	
			}
			this.currentQuery.push(obj)
			return this;
		}

		this.greaterThan = function(attr, value){
			var obj = {}
			obj[attr] = {"$gt":value}
			this.currentQuery.push(obj)
			return this
		}	

		this.greaterThanOrEqual = function(attr, value){
			var obj = {}
			obj[attr] = {"$gte":value}
			this.currentQuery.push(obj)
			return this
		}

		this.lessThan = function(attr, value){
			var obj = {}
			obj[attr] = {"$lt":value}
			this.currentQuery.push(obj)
			return this
		}	

		this.lessThanOrEqual = function(attr, value){
			var obj = {}
			obj[attr] = {"$lte":value}
			this.currentQuery.push(obj)
			return this
		}

		this.equalTo = function(attr, value){
			var obj = {}
			obj[attr] = value
			this.currentQuery.push(obj)
			return this
		}

		this.exists = function(attr){
			var obj = {}
			obj[attr] = {"$exists":true}
			this.currentQuery.push(obj)
			return this
		}

		this.notExists = function(attr){
			var obj = {}
			obj[attr] = {"$exists":false}
			this.currentQuery.push(obj)
			return this
		}

		this.exec = function(){
			//build query
			for(var i=0;i<this.currentQuery.length;i++){	
				var partial = JSON.stringify(this.currentQuery[i]);
				partial = partial.substring(1, partial.length-1)
				if(i==0)
					this.executable += partial
				else
					this.executable += ','+partial
			}
			if(!this.instance)
				this.instance = this.model+'s'; 
				var thisParams = this.executable;
			return Stamplay.makeAPromise({
				method: 'GET',
				url: '/api/' + this.model + '/' + Stamplay.VERSION + '/' + this.instance +'?where={'+this.executable+'}' ,
			}).then(function (response) {
				return response.data
			})
		}


	};

	// Added Query Object to Stamplay
	root.Stamplay.Query = Query;

})(this);