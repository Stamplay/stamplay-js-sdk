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
			})
		}

	};
	var support = new Support();
	// Added Support Object to Stamplay
	root.Stamplay.Support = support;

})(this);