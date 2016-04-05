/* globals  Stamplay */

/* Add Support function to Stamplay
 * it use for handling some functionality
 * very easy to use : Stamplay.Support.redirect('http://stamplay.com')
 */
(function (root) {
	'use strict';

	// constructor for Support Object
	function Support() {

		// function to redirect to specified url
		this.redirect = function (url) {
			root.location.href = url;
		};

		// function for check if you have user with a specific email 
		this.validateEmail = function (email, callbackObject) {
			return root.Stamplay.makeAPromise({
				method: 'POST',
				data: { email: email },
				url: '/api/auth/' + root.Stamplay.VERSION + '/validate/email'
			}, callbackObject);
		};

	}
	var support = new Support();
	// Added Support Object to Stamplay
	root.Stamplay.Support = support;

})(this);