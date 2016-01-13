/* globals  Stamplay, store */

/* 
	Brick : User 
 	GET    '/api/user/VERSION/users'
  GET    '/api/user/VERSION/users/:id'
  POST   '/api/user/VERSION/users'
  PUT    '/api/user/VERSION/users/:id'
  DELETE '/api/user/VERSION/users/:id'
  GET    '/api/user/VERSION/getStatus'
*/

(function (root) {
	/*
		User component : Stamplay.User 
		This class rappresent the User component on Stamplay platform
		It very easy to use: Stamplay.User
	*/
	var  User = {
		brickId:'user',
		resourceId:'users',
		currentUser : function (callbackObject){
			return Stamplay.makeAPromise({
				method: 'GET',
				url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/getStatus'
			}, callbackObject)
		},
		login :function (data, callbackObject) {
			return Stamplay.makeAPromise({
				method: 'POST',
				data: data,
				url: '/auth/' + Stamplay.VERSION + '/local/login',
			}, callbackObject)
		},
		socialLogin: function(provider){
			if(provider){
				var jwt = store.get(window.location.origin + '-jwt');
				if (jwt) {
					// Store temporary cookie to permit user aggregation
				  var date = new Date();
	        date.setTime(date.getTime() + 5 * 60 * 1000);
					document.cookie = 'stamplay.jwt='+jwt+'; expires=' + date.toGMTString() + '; path=/'
				}
				var url = '/auth/' + Stamplay.VERSION + '/' + provider + '/connect';
				var port = (window.location.port) ? ':'+window.location.port : '';
				root.Stamplay.Support.redirect(location.protocol + '//' + document.domain +port+ url);
			}else{
				throw new Error('Stamplay.User.socialLogin needs the service name');
			}
		},
		signup : function (data, callbackObject) {
			return Stamplay.makeAPromise({
				method: 'POST',
				data: data,
				url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/' + this.resourceId
			}, callbackObject)
		},
		logout : function () {
			if (Stamplay.USESTORAGE) {
				store.remove(window.location.origin + '-jwt');
			}
			root.Stamplay.Support.redirect('/auth/' + Stamplay.VERSION + '/logout');
		},
		resetPassword: function(data, callbackObject){
			return Stamplay.makeAPromise({
				method: 'POST',
				data: data,
				url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/users/resetpassword'
			}, callbackObject)
		},
		activities : function (id, callbackObject) {
			return Stamplay.makeAPromise({
				method: 'GET',
				url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/users/'+id+'/activities'
			}, callbackObject)
		},
		following : function (id, callbackObject) {
			return Stamplay.makeAPromise({
				method: 'GET',
				url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/users/'+id+'/following'
			}, callbackObject)
		},
		followedBy : function (id, callbackObject) {
				return Stamplay.makeAPromise({
					method: 'GET',
					url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/users/'+id+'/followed_by'
				}, callbackObject)
		},
		follow : function (id, callbackObject) {
				return Stamplay.makeAPromise({
					method: 'PUT',
					data: {'userId': id},
					url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/users/follow'
				}, callbackObject)
		},
		unfollow : function (id, callbackObject) {
				return Stamplay.makeAPromise({
					method: 'PUT',
					data: {'userId': id},
					url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/users/unfollow'
				}, callbackObject)
		},
		getRoles:function (callbackObject) {
			return Stamplay.makeAPromise({
				method: 'GET',
				url: '/api/user/' + Stamplay.VERSION + '/roles'
			}, callbackObject);
		},
		getRole:function (roleId, callbackObject) {
				return Stamplay.makeAPromise({
					method: 'GET',
					url: '/api/user/' + Stamplay.VERSION + '/roles/'+ roleId
				}, callbackObject);
		}
	}
	_.extend(User, root.Stamplay.BaseComponent(User.brickId, User.resourceId))
	delete User.patch
	User.remove = function(id, callbackObject){
		return Stamplay.makeAPromise({
			method: 'DELETE',
			url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/' + this.resourceId + '/' + id
		},callbackObject).then(function(resp){
			if (Stamplay.USESTORAGE) {
				var jwt = store.get(window.location.origin + '-jwt');
				if (jwt) {
					store.remove(window.location.origin + '-jwt');
				}
			}
		})
	}
	//Added User to Stamplay 
	root.Stamplay.User = User;
})(this);