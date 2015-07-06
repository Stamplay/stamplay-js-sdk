/* Brick : User 
 	GET    '/api/user/VERSION/users'
  GET    '/api/user/VERSION/users/:id'
  POST   '/api/user/VERSION/users'
  PUT    '/api/user/VERSION/users/:id'
  DELETE '/api/user/VERSION/users/:id'
  GET    '/api/user/VERSION/getStatus'
*/

(function (root) {

	/**
		User component : Stamplay.User 
		This class rappresent the User component on Stamplay platform
		It very easy to use: Stamplay.User()
	*/

	// constructor
	function User() {
			Stamplay.BaseComponent.call(this, 'user', 'users');

			// currentUser function
			// Modifies the instance of User 
			this.Model.currentUser = function () {
					var _this = this;
					return Stamplay.makeAPromise({
						method: 'GET',
						url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/getStatus'
					}).then(function (response) {
						_this.instance = response.user || {};
					});
				},
				// isLoggedfunction
				// return true if user is logged
				this.Model.isLogged = function () {
					if (this.instance._id)
						return true;
					return false;
				}

			// login function, it takes serviceOrEmail and password
			// if exists password parameter, login strategy is local Authentication
			// else the login strategy is service Authentication
			// there are a lot of services : facebook, twitter
			this.Model.login = function (serviceOrEmail, password) {
					var _this = this;

					if (password) {

						var data = {
							email: serviceOrEmail,
							password: password
						};

						return Stamplay.makeAPromise({
							method: 'POST',
							data: data,
							url: '/auth/' + Stamplay.VERSION + '/local/login',
						}).then(function (response) {
							_this.instance = response || {};
						});

					} else {
						var url = '/auth/' + Stamplay.VERSION + '/' + serviceOrEmail + '/connect'
						root.Stamplay.Support.redirect(location.protocol + '//' + document.domain + url);
					}
				},

				// signup function, it takes objcet data
				// If data.email and data.password doesn't exists return error
				// any other attributes in data was save to User  
				this.Model.signup = function (data) {

					if (data.email && data.password) {

						var _this = this;

						return Stamplay.makeAPromise({
							method: 'POST',
							data: data,
							url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/' + this.resourceId
						}).then(function (response) {
							_this.instance = response || {};
						});

					} else {
						throw new Error('Stamplay.User.Model.signup(data) needs that data object has the email and password keys');
					}
				},

				// logout function
				this.Model.logout = function () {
					if (Stamplay.USESTORAGE) {
						store.remove(window.location.origin + '-jwt');
					}
					root.Stamplay.Support.redirect('/auth/' + Stamplay.VERSION + '/logout');
				}

				this.Model.activities = function (id) {
					return Stamplay.makeAPromise({
						method: 'GET',
						url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/users/'+id+'/activities'
					}).then(function (response) {
						return response
					});
				}

				this.Model.following = function (id) {
					return Stamplay.makeAPromise({
						method: 'GET',
						url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/users/'+id+'/following'
					}).then(function (response) {
						return response
					});
				}

				this.Model.followedBy = function (id) {
					return Stamplay.makeAPromise({
						method: 'GET',
						url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/users/'+id+'/followed_by'
					}).then(function (response) {
						return response
					});
				}

				this.Model.follow = function (id) {
					return Stamplay.makeAPromise({
						method: 'PUT',
						data: {'userId': id},
						url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/users/follow'
					}).then(function (response) {
						return response
					});
				}

				this.Model.unfollow = function (id) {
					return Stamplay.makeAPromise({
						method: 'PUT',
						data: {'userId': id},
						url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/users/unfollow'
					}).then(function (response) {
						return response
					});
				}

		}
		//Added User to Stamplay 
	root.Stamplay.User = User;

})(this);