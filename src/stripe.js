/* globals  Stamplay */
/* Brick : stripe 
 * POST  'api/stripe/VERSION/customers'
 * POST  'api/stripe/VERSION/customers/:userId/cards'
 * POST  'api/stripe/VERSION/charges'
 * POST  'api/stripe/VERSION/customers/:userId/subscriptions'
 * GET   'api/stripe/VERSION/customers/:userId/subscriptions'
 */

(function (root) {

	/*
		Stripe component : Stamplay.Stripe 
		This class rappresent the Stripe Object component on Stamplay platform
		It very easy to use: Stamplay.Stripe()
	*/

	//constructor
	function Stripe() {

		this.url = '/api/stripe/' + Stamplay.VERSION + '/';

		this.createCustomer = function (userId) {
			if (Stamplay.Support.checkMongoId(userId))
				return Stamplay.makeAPromise({
					method: 'POST',
					data: {
						'userId': userId
					},
					url: this.url + 'customers'
				});
			else
				return Stamplay.Support.errorSender(403, "Invalid userId");
		};

		this.createCreditCard = function (userId, token) {
			if (arguments.length == 2) {
				if (Stamplay.Support.checkMongoId(userId))
					return Stamplay.makeAPromise({
						method: 'POST',
						data: {
							'token': token
						},
						url: this.url + 'customers/' + userId + '/cards'
					});
				else
					return Stamplay.Support.errorSender(403, "Invalid userId");
			} else {
				return Stamplay.Support.errorSender(403, "Missing parameters in createCreditCard methods");
			}
		};

		this.updateCreditCard = function (userId, token) {
			if (arguments.length == 2) {
				if (Stamplay.Support.checkMongoId(userId))
					return Stamplay.makeAPromise({
						method: 'PUT',
						data: {
							'token': token
						},
						url: this.url + 'customers/' + userId + '/cards'
					});
				else
					return Stamplay.Support.errorSender(403, "Invalid userId");
			} else {
				return Stamplay.Support.errorSender(403, "Missing parameters in updateCreditCard methods");
			}
		};

		this.charge = function (userId, token, amount, currency) {
			if (arguments.length == 4) {
				if (Stamplay.Support.checkMongoId(userId))
					return Stamplay.makeAPromise({
						method: 'POST',
						data: {
							'userId': userId,
							'token': token,
							'amount': amount,
							'currency': currency
						},
						url: this.url + 'charges'
					});
				else
					return Stamplay.Support.errorSender(403, "Invalid userId");
			} else {
				return Stamplay.Support.errorSender(403, "Missing parameters in charge methods");
			}
		};


		this.createSubscription = function (userId, planId) {
			if (arguments.length === 2) {
				if (Stamplay.Support.checkMongoId(userId)) {
					return Stamplay.makeAPromise({
						method: 'POST',
						data: {
							'planId': planId
						},
						url: this.url + 'customers/' + userId + '/subscriptions'
					});
				} else {
					return Stamplay.Support.errorSender(403, "Invalid userId");
				}
			} else {
				return Stamplay.Support.errorSender(403, "Missing parameters in createSubscription methods");
			}
		};

		this.getSubscriptions = function (userId, options) {
			if (arguments.length >= 1) {
				if (Stamplay.Support.checkMongoId(userId)) {
					return Stamplay.makeAPromise({
						method: 'GET',
						url: this.url + 'customers/' + userId + '/subscriptions',
						thisParams: options
					});
				} else {
					return Stamplay.Support.errorSender(403, "Invalid userId");
				}
			} else {
				return Stamplay.Support.errorSender(403, "Missing parameters in getSubscriptions methods");
			}
		};

		this.getSubscription = function (userId, subscriptionId) {
			if (arguments.length <= 2) {
				if (Stamplay.Support.checkMongoId(userId)) {
					return Stamplay.makeAPromise({
						method: 'GET',
						url: this.url + 'customers/' + userId + '/subscriptions/' + subscriptionId,
					});
				} else {
					return Stamplay.Support.errorSender(403, "Invalid userId");
				}
			} else {
				return Stamplay.Support.errorSender(403, "Missing parameters in getSubscription methods");
			}
		};

		this.getCreditCard = function (userId) {
			if (arguments.length == 1) {
				if (Stamplay.Support.checkMongoId(userId)) {
					return Stamplay.makeAPromise({
						method: 'GET',
						url: this.url + 'customers/' + userId + '/cards',
					});
				} else {
					return Stamplay.Support.errorSender(403, "Invalid userId");
				}
			} else {
				return Stamplay.Support.errorSender(403, "Invalid parameter in getCreditCard method");
			}
		};

		this.deleteSubscription = function (userId, subscriptionId, options) {
			if (arguments.length === 2) {
				if (Stamplay.Support.checkMongoId(userId)) {
					return Stamplay.makeAPromise({
						method: 'DELETE',
						url: this.url + 'customers/' + userId + '/subscriptions/' + subscriptionId,
						data: options || {}
					});
				} else {
					return Stamplay.Support.errorSender(403, "Invalid userId");
				}
			} else {
				return Stamplay.Support.errorSender(403, "Missing parameters in deleteSubscription methods");
			}
		};

		this.updateSubscription = function (userId, subscriptionId, options) {
			if (arguments.length >= 2) {
				if (Stamplay.Support.checkMongoId(userId)) {
					options = options || {};
					return Stamplay.makeAPromise({
						method: 'PUT',
						url: this.url + 'customers/' + userId + '/subscriptions/' + subscriptionId,
						data: {
							options: options
						}
					});
				} else {
					return Stamplay.Support.errorSender(403, "Invalid userId");
				}
			} else {
				return Stamplay.Support.errorSender(403, "Missing parameters in updateSubscription methods");
			}
		};

	}

	root.Stamplay.Stripe = Stripe;

})(this);