/* Brick : Cobject 
	GET     '/api/cobject/v0/:cobjectId 
	GET     '/api/cobject/v0/:cobjectId/:id   
	PUT     '/api/cobject/v0/:cobjectId/:id   
	PATCH   '/api/cobject/v0/:cobjectId/:id 
	POST    '/api/cobject/v0/:cobjectId       
	DELETE  '/api/cobject/v0/:cobjectId/:id
	PUT			'/api/cobject/v0/:cobjectId/:id/rate
	PUT     '/api/cobject/v0/:cobjectId/:id/comment
	PUT     '/api/cobject/v0/:cobjectId/:id/vote
	PUT     '/api/cobject/v0/:cobjectId/:id/facebook_share
	PUT     '/api/cobject/v0/:cobjectId/:id/twitter_share 
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
	}
	//Added Cobject to Stamplay 
	root.Stamplay.Cobject = Cobject;

})(this);