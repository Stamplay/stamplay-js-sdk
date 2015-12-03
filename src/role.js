/* globals  Stamplay */

/* Brick : Role 
 *  POST   '/api/user/VERSION/roles'
 */
(function (root) {

	/*
		Role component : Stamplay.Role 
		This class rappresent the Role Object component on Stamplay platform
		It very easy to use: Stamplay.Role()
	*/

	//constructor
	function Role() {

		this.url = '/api/user/' + Stamplay.VERSION + '/roles';

		this.getRoles = function () {
			return Stamplay.makeAPromise({
				method: 'GET',
				url: this.url
			});
		};

		this.getRole = function (roleId) {
			if (Stamplay.Support.checkMongoId(roleId))
				return Stamplay.makeAPromise({
					method: 'GET',
					url: this.url + '/'+roleId
				});
			else
				return Stamplay.Support.errorSender(403, "Invalid roleId");
		};

	}
	//Added Role to Stamplay 
	root.Stamplay.Role = Role;

})(this);