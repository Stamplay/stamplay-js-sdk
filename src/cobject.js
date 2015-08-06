/* globals  Stamplay */

/* Brick : Cobject 
	GET     '/api/cobject/VERSION/:cobjectId 
	GET     '/api/cobject/VERSION/:cobjectId/:id   
	PUT     '/api/cobject/VERSION/:cobjectId/:id   
	PATCH   '/api/cobject/VERSION/:cobjectId/:id 
	POST    '/api/cobject/VERSION/:cobjectId       
	DELETE  '/api/cobject/VERSION/:cobjectId/:id
	PUT			'/api/cobject/VERSION/:cobjectId/:id/rate
	PUT     '/api/cobject/VERSION/:cobjectId/:id/comment
	PUT     '/api/cobject/VERSION/:cobjectId/:id/vote
	PUT     '/api/cobject/VERSION/:cobjectId/:id/facebook_share
	PUT     '/api/cobject/VERSION/:cobjectId/:id/twitter_share 
*/
(function (root) {

	/**
		Custom object component : Stamplay.Cobject 
		This class rappresent the Custom Object component on Stamplay platform
		It very easy to use: Stamplay.Cobject([customObjectid])
	*/

	//constructor
	function Cobject(resourceId) {
		Stamplay.BaseComponent.call(this, 'cobject', resourceId, true);

		this.Collection.findByAttr = function (attr) {
			if(attr){
				var _this = this;
				return Stamplay.makeAPromise({
					method: 'GET',
					url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/' + this.resourceId + '/find/'+attr
				}).then(function (response) {
					if (response.totalElements && response.pagination) {
							_this.totalElements = parseInt(response.totalElements);
							_this.pagination = response.pagination;
						}
						_this.instance = [];
						//iterate on data and instance a new Model with the prototype functions
						response.data.forEach(function (singleInstance) {
							var instanceModel = new root.Stamplay.Cobject(_this.resourceId);
							instanceModel = instanceModel.Model.constructor(singleInstance);
							_this.instance.push(instanceModel);
						});
						_this.length = _this.instance.length;
				});
			}else{
				return Stamplay.Support.errorSender(403, "Missing parameter in findByAttr method");
			}
		}
	}
	//Added Cobject to Stamplay 
	root.Stamplay.Cobject = Cobject;

})(this);