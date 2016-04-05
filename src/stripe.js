/* globals  Stamplay */
/* Brick : stripe 
 * POST  'api/stripe/VERSION/customers'
 * POST  'api/stripe/VERSION/customers/:userId/cards'
 * POST  'api/stripe/VERSION/charges'
 * POST  'api/stripe/VERSION/customers/:userId/subscriptions'
 * GET   'api/stripe/VERSION/customers/:userId/subscriptions'
 */
(function (root) {
	'use strict';

	/*
		Stripe component : Stamplay.Stripe 
		This class rappresent the Stripe Object component on Stamplay platform
		It very easy to use: Stamplay.Stripe()
	*/
	//constructor
	var Stripe = {
		url : '/api/stripe/' + root.Stamplay.VERSION + '/',
		createCustomer : function (userId, callbackObject) {
			return root.Stamplay.makeAPromise({
				method: 'POST',
				data: {'userId': userId},
				url: this.url + 'customers'
			}, callbackObject);
		},
		createCreditCard : function (userId, token, callbackObject) {
			if (arguments.length >= 2 && (root.Stamplay.isString(arguments[0]) && root.Stamplay.isString(arguments[1]))) {
				return root.Stamplay.makeAPromise({
					method: 'POST',
					data: {'token': token},
					url: this.url + 'customers/' + userId + '/cards'
				}, callbackObject);
			} else {
				throw new Error('Stamplay.Stripe.createCustomer:  missing parameters');
			}
		},
		updateCreditCard : function (userId, token, callbackObject) {
			if (arguments.length >= 2 && (root.Stamplay.isString(arguments[0]) && root.Stamplay.isString(arguments[1]))) {
					return root.Stamplay.makeAPromise({
						method: 'PUT',
						data: {'token': token},
						url: this.url + 'customers/' + userId + '/cards'
					},callbackObject);
			} else {
				throw new Error('Stamplay.Stripe.updateCreditCard:  missing parameters');
			}
		},
		charge : function (userId, token, amount, currency, callbackObject) {
			if (arguments.length >= 4 && (root.Stamplay.isString(arguments[0]) && root.Stamplay.isString(arguments[1]) && root.Stamplay.isNumber(arguments[2]) && root.Stamplay.isString(arguments[3]) )){
				return root.Stamplay.makeAPromise({
					method: 'POST',
					data: {
						'userId': userId,
						'token': token,
						'amount': amount,
						'currency': currency
					},
					url: this.url + 'charges'
				}, callbackObject);
			} else {
				throw new Error('Stamplay.Stripe.charge:  missing or incorrect parameters');
			}
		},
		createSubscription : function (userId, planId, callbackObject) {
			if (arguments.length >= 2 && (root.Stamplay.isString(arguments[0]) && root.Stamplay.isString(arguments[1]))) {
				return root.Stamplay.makeAPromise({
					method: 'POST',
					data: {'planId': planId},
					url: this.url + 'customers/' + userId + '/subscriptions'
				}, callbackObject);
			} else {
				throw new Error('Stamplay.Stripe.createSubscription:  missing parameters');
			}
		},
		getSubscriptions : function (userId, options, callbackObject) {
			if (arguments.length >= 2) {
				return root.Stamplay.makeAPromise({
					method: 'GET',
					url: this.url + 'customers/' + userId + '/subscriptions',
					thisParams: options
				}, callbackObject);
			} else {
				throw new Error('Stamplay.Stripe.getSubscriptions:  missing parameters');
			}
		},
		getSubscription : function (userId, subscriptionId, callbackObject) {
			if (arguments.length >= 2 && (root.Stamplay.isString(arguments[0]) && root.Stamplay.isString(arguments[1]))) {
				return root.Stamplay.makeAPromise({
					method: 'GET',
					url: this.url + 'customers/' + userId + '/subscriptions/' + subscriptionId,
				}, callbackObject);
			} else {
				throw new Error('Stamplay.Stripe.getSubscription:  missing parameters');
			}
		},
		getCreditCard : function (userId, callbackObject) {
			return root.Stamplay.makeAPromise({
				method: 'GET',
				url: this.url + 'customers/' + userId + '/cards',
			}, callbackObject);
		},
		deleteSubscription : function (userId, subscriptionId, options, callbackObject) {
			if (arguments.length >= 3) {
				return root.Stamplay.makeAPromise({
					method: 'DELETE',
					url: this.url + 'customers/' + userId + '/subscriptions/' + subscriptionId,
					data: options
				}, callbackObject);
			} else {
				throw new Error('Stamplay.Stripe.deleteSubscription:  missing parameters');
			}
		},
		updateSubscription : function (userId, subscriptionId, options, callbackObject) {
			if (arguments.length >= 3) {
				return root.Stamplay.makeAPromise({
					method: 'PUT',
					url: this.url + 'customers/' + userId + '/subscriptions/' + subscriptionId,
					data: {
						options: options
					}
				}, callbackObject);
			} else {
				throw new Error('Stamplay.Stripe.updateSubscription:  missing parameters');
			}
		}
	}
	root.Stamplay.Stripe = Stripe;
})(this);