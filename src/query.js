/* globals Stamplay */
/* Add Query function to Stamplay
 * it use for handling some funcctionality
 * very easy to use : Stamplay.Query('user').equalTo('name':'john')
 */
(function (root) {
	// constructor for Query Object
	// model is required ever
	function Query(model, instance) {
		
		this.model = model;
		this.instance = instance;
		this.currentQuery = [];
		this.executable = '';
	
		this.or = function(){
			var obj = { $or : []};

			if (arguments[0] instanceof Array) {
				arguments = arguments[0];
			}
			
			for(var i=0; i<arguments.length; i++){
				if(arguments[i] instanceof root.Stamplay.Query)
					obj.$or.push(arguments[i].currentQuery[0]);
				else
					throw new Error('Please Or function take only Query object');	
			}
			this.currentQuery.push(obj);
			return this;
		};

		this.between = function(attr,value1,value2){
			var obj = {};
			obj[attr] = {"$gte":value1, "$lte":value2};
			this.currentQuery.push(obj);
			return this;
		};

		this.greaterThan = function(attr, value){
			var obj = {};
			obj[attr] = {"$gt":value};
			this.currentQuery.push(obj);
			return this;
		};	

		this.greaterThanOrEqual = function(attr, value){
			var obj = {};
			obj[attr] = {"$gte":value};
			this.currentQuery.push(obj);
			return this;
		};

		this.lessThan = function(attr, value){
			var obj = {};
			obj[attr] = {"$lt":value};
			this.currentQuery.push(obj);
			return this;
		};	

		this.lessThanOrEqual = function(attr, value){
			var obj = {};
			obj[attr] = {"$lte":value};
			this.currentQuery.push(obj);
			return this;
		};

		this.equalTo = function(attr, value){
			var obj = {};
			obj[attr] = value;
			this.currentQuery.push(obj);
			return this;
		};

		this.sortAscending = function(value){
			var obj = {
				$sort: {}
			};
			obj.$sort[value] = 1;
			this.currentQuery.push(obj);
			return this;
		};

		this.sortDescending = function(value){
			var obj = {
				$sort: {}
			};
			obj.$sort[value] = -1;
			this.currentQuery.push(obj);
			return this;
		};

		this.exists = function(attr){
			var obj = {};
			obj[attr] = {"$exists":true};
			this.currentQuery.push(obj);
			return this;
		};

		this.notExists = function(attr){
			var obj = {};
			obj[attr] = {"$exists":false};
			this.currentQuery.push(obj);
			return this;
		};

		this.exec = function(){
			//build query
			for(var i=0;i<this.currentQuery.length;i++){	
				var partial = JSON.stringify(this.currentQuery[i]);
				partial = partial.substring(1, partial.length-1);
				if(i===0)
					this.executable += partial;
				else
					this.executable += ','+partial;
			}
			if(!this.instance)
				this.instance = this.model+'s'; 

			return Stamplay.makeAPromise({
				method: 'GET',
				url: '/api/' + this.model + '/' + Stamplay.VERSION + '/' + this.instance +'?where={'+this.executable+'}' ,
			}).then(function (response) {
				return response.data;
			});
		};

	}

	// Added Query Object to Stamplay
	root.Stamplay.Query = Query;

})(this);