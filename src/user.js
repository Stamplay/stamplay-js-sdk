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
						var popup = root.open(root.Stamplay.BASEURL+url, 'socialLogin', 'left=1,top=1,width=600,height=600')
						popup.addEventListener('loadstart', function (e) {
						var reg = new RegExp('jwt=([A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+=]+)')
						if(e.url.indexOf('jwt=') > -1){
							var jwt = e.url.match(reg)[1]
							store.set(root.location.origin + '-jwt', jwt);
							if(root.Stamplay.OPTIONS.autoRefreshSocialLogin)
								location.reload();
							popup.close();
						}
        	});
				}else{
					var jwt = store.get(root.location.origin + '-jwt');
					if (jwt) {
						// Store temporary cookie to permit user aggregation (multiple social identities)
					  var date = new Date();
		        date.setTime(date.getTime() + 5 * 60 * 1000);
						root.document.cookie = 'stamplay.jwt='+jwt+'; expires=' + date.toGMTString() + '; path=/'
					}
					var port = (root.location.port) ? ':'+root.location.port : '';
					var redirection = location.protocol + '//' + root.document.domain +port+ url
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
			var jwt = store.get(root.location.origin + '-jwt');
			if (root.Stamplay.USESTORAGE)
				store.remove(root.location.origin + '-jwt');
			if(async){
				return root.Stamplay.makeAPromise({
				method: 'GET',
				url: '/auth/' + root.Stamplay.VERSION + '/logout?jwt='+jwt
				}, callbackObject)
			}else{
				var url = '/auth/' + root.Stamplay.VERSION + '/logout?jwt='+jwt;
				var port = (root.location.port) ? ':'+root.location.port : '';
				var redirection = location.protocol + '//' + root.document.domain +port+ url
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
		},
		setRole:function (id, roleId, callbackObject) {
			return root.Stamplay.makeAPromise({
				method: 'PATCH',
				data: {'givenRole': roleId},
				url: '/api/user/' + root.Stamplay.VERSION + '/users/'+ id + '/role'
			}, callbackObject);
		}
	}
	root.Stamplay.extend(User, root.Stamplay.BaseComponent(User.brickId, User.resourceId))
	delete User.patch
	User.remove = function(id, callbackObject){
		return root.Stamplay.makeAPromise({
			method: 'DELETE',
			url: '/api/' + this.brickId + '/' + root.Stamplay.VERSION + '/' + this.resourceId + '/' + id
		},callbackObject).then(function(resp){
			if (root.Stamplay.USESTORAGE) {
				var jwt = store.get(root.location.origin + '-jwt');
				if (jwt) {
					store.remove(root.location.origin + '-jwt');
				}
			}
		})
	}
	//Added User to Stamplay
	root.Stamplay.User = User;
})(this);
