/* globals  Stamplay, Q */

/* Add Support function to Stamplay
 * it use for handling some functionality
 * very easy to use : Stamplay.Support.redirect('http://stamplay.com')
 */
(function (root) {

	// constructor for Support Object
	function Support() {

		// function to redirect to specified url
		this.redirect = function (url) {
			window.location.href = url;
		};

		// function for check if you have user with a specific email 
		this.validateEmail = function (email) {
			return Stamplay.makeAPromise({
				method: 'POST',
				data: {
					email: email
				},
				url: '/api/auth/' + Stamplay.VERSION + '/validate/email'
			});
		};

		this.checkMongoId = function(mongoId){
			var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
			var syntaxValid = (((typeof mongoId) === 'string') && checkForHexRegExp.test(mongoId));
			return syntaxValid;
		};

		this.errorSender = function(status, message){
			var deferred = Q.defer();
			deferred.reject({"status":status, "message":message});
			return deferred.promise;
		};

	}
	var support = new Support();
	// Added Support Object to Stamplay
	root.Stamplay.Support = support;

})(this);