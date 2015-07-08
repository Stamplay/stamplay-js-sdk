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
	}
	//Added Cobject to Stamplay 
	root.Stamplay.Cobject = Cobject;

})(this);