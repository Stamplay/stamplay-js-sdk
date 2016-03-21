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
	'use strict';

	/*
		User component : Stamplay.User 
		This class rappresent the User component on Stamplay platform
		It very easy to use: Stamplay.User
	*/
	
	var  User = {
		brickId:'user',
		resourceId:'users',
		currentUser : function (callbackObject){
			return root.Stamplay.makeAPromise({
				method: 'GET',
				url: '/api/' + this.brickId + '/' + root.Stamplay.VERSION + '/getStatus'
			}, callbackObject)
		},
		login :function (data, callbackObject) {
			return root.Stamplay.makeAPromise({
				method: 'POST',
				data: data,
				url: '/auth/' + root.Stamplay.VERSION + '/local/login'
			}, callbackObject)
		},
		socialLogin: function(provider){
			if(provider){
				var url = '/auth/' + root.Stamplay.VERSION + '/' + provider + '/connect';
				if(root.Stamplay.OPTIONS.isMobile){
						//need an external plugin to work - https://github.com/apache/cordova-plugin-inappbrowser 
						var popup = window.open(root.Stamplay.BASEURL+url, 'socialLogin', 'left=1,top=1,width=600,height=600')
						popup.addEventListener('loadstart', function (e) {
						if(e.url.indexOf('jwt=') > -1){
							var jwt = e.url.split('jwt=')[1]
							store.set(window.location.origin + '-jwt', jwt);
							if(root.Stamplay.OPTIONS.autoRefreshSocialLogin || true)
								location.reload();
							popup.close();
						}
        	});
				}else{
					var jwt = store.get(window.location.origin + '-jwt');
					if (jwt) {
						// Store temporary cookie to permit user aggregation (multiple social identities)
					  var date = new Date();
		        date.setTime(date.getTime() + 5 * 60 * 1000);
						document.cookie = 'stamplay.jwt='+jwt+'; expires=' + date.toGMTString() + '; path=/'
					}
					var port = (window.location.port) ? ':'+window.location.port : '';	
					var redirection = location.protocol + '//' + document.domain +port+ url
					//if you are using sdk on your *personal site*
					//remember to manage the callback url for social login in editor
					if(root.Stamplay.OPTIONS.absoluteUrl){
						redirection = root.Stamplay.BASEURL+url
					}
					root.Stamplay.Support.redirect(redirection);
				}
			}else{
				throw new Error('Stamplay.User.socialLogin needs the service name');
			}
		},
		signup : function (data, callbackObject) {
			return root.Stamplay.makeAPromise({
				method: 'POST',
				data: data,
				url: '/api/' + this.brickId + '/' + root.Stamplay.VERSION + '/' + this.resourceId
			}, callbackObject)
		},
		logout : function (async, callbackObject) {
			if (root.Stamplay.USESTORAGE)
				store.remove(window.location.origin + '-jwt');
			if(async){
				return root.Stamplay.makeAPromise({
				method: 'GET',
				url: '/auth/' + root.Stamplay.VERSION + '/logout'
				}, callbackObject)
			}else{
				var url = '/auth/' + root.Stamplay.VERSION + '/logout';
				var port = (window.location.port) ? ':'+window.location.port : '';	
				var redirection = location.protocol + '//' + document.domain +port+ url
				if(root.Stamplay.OPTIONS.absoluteUrl){
					redirection = root.Stamplay.BASEURL+url
				}
				root.Stamplay.Support.redirect(redirection);
			}
		},
		resetPassword: function(data, callbackObject){
			return root.Stamplay.makeAPromise({
				method: 'POST',
				data: data,
				url: '/api/' + this.brickId + '/' + root.Stamplay.VERSION + '/users/resetpassword'
			}, callbackObject)
		},
		activities : function (id, callbackObject) {
			return root.Stamplay.makeAPromise({
				method: 'GET',
				url: '/api/' + this.brickId + '/' + root.Stamplay.VERSION + '/users/'+id+'/activities'
			}, callbackObject)
		},
		following : function (id, callbackObject) {
			return root.Stamplay.makeAPromise({
				method: 'GET',
				url: '/api/' + this.brickId + '/' + root.Stamplay.VERSION + '/users/'+id+'/following'
			}, callbackObject)
		},
		followedBy : function (id, callbackObject) {
				return root.Stamplay.makeAPromise({
					method: 'GET',
					url: '/api/' + this.brickId + '/' + root.Stamplay.VERSION + '/users/'+id+'/followed_by'
				}, callbackObject)
		},
		follow : function (id, callbackObject) {
				return root.Stamplay.makeAPromise({
					method: 'PUT',
					data: {'userId': id},
					url: '/api/' + this.brickId + '/' + root.Stamplay.VERSION + '/users/follow'
				}, callbackObject)
		},
		unfollow : function (id, callbackObject) {
				return root.Stamplay.makeAPromise({
					method: 'PUT',
					data: {'userId': id},
					url: '/api/' + this.brickId + '/' + root.Stamplay.VERSION + '/users/unfollow'
				}, callbackObject)
		},
		getRoles:function (callbackObject) {
			return root.Stamplay.makeAPromise({
				method: 'GET',
				url: '/api/user/' + root.Stamplay.VERSION + '/roles'
			}, callbackObject);
		},
		getRole:function (roleId, callbackObject) {
				return root.Stamplay.makeAPromise({
					method: 'GET',
					url: '/api/user/' + root.Stamplay.VERSION + '/roles/'+ roleId
				}, callbackObject);
		}
	}
	_.extend(User, root.Stamplay.BaseComponent(User.brickId, User.resourceId))
	delete User.patch
	User.remove = function(id, callbackObject){
		return root.Stamplay.makeAPromise({
			method: 'DELETE',
			url: '/api/' + this.brickId + '/' + root.Stamplay.VERSION + '/' + this.resourceId + '/' + id
		},callbackObject).then(function(resp){
			if (root.Stamplay.USESTORAGE) {
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