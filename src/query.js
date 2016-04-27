/* globals Stamplay */
/* Add Query function to Stamplay
 * it use for handling some funcctionality
 * very easy to use : Stamplay.Query('user').equalTo('name':'john')
 */
(function (root) {
	'use strict';

	// constructor for Query Object
	// model is required ever
	function _createGeoQuery(queryOperator, shapeOperator, type, coordinates, maxDistance, minDistance) {
		var obj ={_geolocation:{}}
		obj._geolocation[queryOperator] = {};
		obj._geolocation[queryOperator][shapeOperator] = {type:type, coordinates:coordinates}
		if(maxDistance){
			obj._geolocation[queryOperator].$maxDistance = maxDistance
		}
		if(minDistance){
			obj._geolocation[queryOperator].$minDistance = minDistance	
		}
		return obj;
	}
	
	function _createGeoWithinQuery(shapeOperator, coordinates){
		var obj = {_geolocation:{$geoWithin:{}}}
		obj._geolocation.$geoWithin[shapeOperator] = coordinates
		return obj;
	}

	function Query(model, instance) {
		return {
			
			model : model,
			instance : instance,
			paginationQuery : '',
			sortQuery:'',
			selectionQuery:'',
			populateQuery: '',
			populateOwnerQuery:'',
			whereQuery : [],
			executable : '',

			or : function(){
				var obj = { $or : []};
				var args = arguments;
				if (arguments[0] instanceof Array) {
					args = arguments[0];
				}
				for(var i=0; i<args.length; i++){
					if(args[i].whereQuery)	
						obj.$or.push(args[i].whereQuery[0]);
					else
						throw new Error('Please Or function take only Query object');
				}
				this.whereQuery.push(obj);
				return this
			},

			pagination : function(page, per_page){
				this.paginationQuery = '&page='+page+'&per_page='+per_page;
				return this;
			},

			between : function(attr, value1, value2){
				var obj = {};
				obj[attr] = {"$gte":value1, "$lte":value2};
				this.whereQuery.push(obj);
				return this;
			},

			greaterThan : function(attr, value){
				var obj = {};
				obj[attr] = {"$gt":value};
				this.whereQuery.push(obj);
				return this;
			},	

			greaterThanOrEqual : function(attr, value){
				var obj = {};
				obj[attr] = {"$gte":value};
				this.whereQuery.push(obj);
				return this;
			},

			lessThan : function(attr, value){
				var obj = {};
				obj[attr] = {"$lt":value};
				this.whereQuery.push(obj);
				return this;
			},	

			lessThanOrEqual : function(attr, value){
				var obj = {};
				obj[attr] = {"$lte":value};
				this.whereQuery.push(obj);
				return this;
			},

			equalTo : function(attr, value){
				var obj = {};
				obj[attr] = value;
				this.whereQuery.push(obj);
				return this;
			},

			notEqualTo : function(attr, value){
				var obj = {};
				obj[attr] = {"$ne":value};
				this.whereQuery.push(obj)
				return this;
			},

			sortAscending : function(value){
				this.sortQuery ='&sort='+value
				return this;
			},

			sortDescending : function(value){
				this.sortQuery ='&sort=-'+value
				return this
			},

			exists : function(attr){
				var obj = {};
				obj[attr] = {"$exists":true};
				this.whereQuery.push(obj);
				return this;
			},

			notExists : function(attr){
				var obj = {};
				obj[attr] = {"$exists":false};
				this.whereQuery.push(obj);
				return this;
			},

			regex: function(attr, regex, options){
				var obj = {};
				obj[attr] = {"$regex":regex, "$options": options};
				this.whereQuery.push(obj);
				return this;
			},

			populate: function(){
				this.populateQuery ='&populate=true'
				return this
			},
			
			populateOwner: function(){
				this.populateOwnerQuery ='&populate_owner=true'
				return this
			},

			select: function(){
				this.selectionQuery =  '&select='+ Array.prototype.slice.call(arguments).join(", ").replace(" ",'')
				return this
			},

			near: function(type, coordinates, maxDistance, minDistance){
				var obj = _createGeoQuery("$near", "$geometry", type, coordinates, maxDistance, minDistance)
				this.whereQuery.push(obj);
				return this;
			},

			nearSphere: function(type, coordinates, maxDistance, minDistance){
				var obj = _createGeoQuery("$nearSphere", "$geometry", type, coordinates, maxDistance, minDistance)
				this.whereQuery.push(obj);
				return this;
			},

			geoIntersects: function(type, coordinates){
				var obj = _createGeoQuery("$geoIntersects", "$geometry", type, coordinates)
				this.whereQuery.push(obj);
				return this;
			},

			geoWithinGeometry:function( type, coordinates){
				var obj = _createGeoQuery("$geoWithin", "$geometry", type, coordinates)
				this.whereQuery.push(obj);
				return this;
			},

			geoWithinCenterSphere: function(coordinates, radius){
				var finalParam = [coordinates, radius]
				var obj = _createGeoWithinQuery('$centerSphere',finalParam)
				this.whereQuery.push(obj);
				return this;
			},

			exec : function(callback){
				//build query
				for(var i=0;i<this.whereQuery.length;i++){	
					var partial = JSON.stringify(this.whereQuery[i]);
					partial = partial.substring(1, partial.length-1);
					if(i===0)
						this.executable += partial;
					else
						this.executable += ','+partial;
				}
				
				switch(this.model){
					case 'object':
						this.model = 'cobject'
					break
					default:
						this.instance = 'users'
					break
				}

				var Url = '/api/' + this.model + '/' + root.Stamplay.VERSION + '/' + this.instance 
								+'?where={'+this.executable+'}'+ this.paginationQuery + this.selectionQuery 
								+ this.sortQuery + this.populateQuery + this.populateOwnerQuery

				return root.Stamplay.makeAPromise({
					method: 'GET',
					url:  Url
				},callback)
			}
		}
	}
	// Added Query Object to Stamplay
	root.Stamplay.Query = Query;
})(this);