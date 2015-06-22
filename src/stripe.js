/* Brick : stripe 
 * POST  'api/stripe/VERSION/customers'
 * POST  'api/stripe/VERSION/customers/:userId/cards'
 * POST  'api/stripe/VERSION/cahrges'
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
			if(Stamplay.Support.checkMongoId(userId))
				return Stamplay.makeAPromise({
					method: 'POST',
					data: { 'userId': userId },
					url: this.url+'customers'
				})
			else
				return Stamplay.Support.errorSender(403,"Invalid userId isn't mongoid")
		}

		this.createCreditCard = function(userId, token) {
			if(arguments.length==2){
				if(Stamplay.Support.checkMongoId(userId))
					return Stamplay.makeAPromise({
						method: 'POST',
						data: { 'token': token },
						url: this.url+'customers/'+userId+'/cards'
					})
				else
					return Stamplay.Support.errorSender(403,"Invalid userId isn't mongoid")
			}else{
				return Stamplay.Support.errorSender(403, "Missing parameters in createCreditCard methods")
			}
		}

		this.charge = function(userId, token, amount, currency){
			if(arguments.length==4){
				if(Stamplay.Support.checkMongoId(userId))
					return Stamplay.makeAPromise({
						method: 'POST',
						data: {'userId': userId, 'token': token, 'amount': amount, 'currency': currency },
						url: this.url+'charges'
					})
				else
					return Stamplay.Support.errorSender(403,"Invalid userId isn't mongoid") 
			}else{
				return Stamplay.Support.errorSender(403, "Missing parameters in charge methods")
			}
		}

	}
		//Added Stripe to Stamplay 
	root.Stamplay.Stripe = Stripe;

})(this);