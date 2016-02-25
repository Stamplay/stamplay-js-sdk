  /* globals suite,Stamplay,setup,sinon,teardown,test,assert,stripe,response */

  suite('Stripe', function () {

    var stamplayUrl = 'https://stamplay.stamplayapp.com'

    setup('Creating a new Stripe', function () {

      stripe =  Stamplay.Stripe;
      response = {
        name: 'stripe'
      };
      this.xhr = sinon.useFakeXMLHttpRequest();
      this.request;
      var _this = this;
      this.xhr.onCreate = function (xhr) {
        _this.request = xhr;
      };

    });

    //For each test
    teardown('Tearing down', function () {

      if (this.xhr) {
        this.xhr.restore();
      }

    });

    test('has the createCustomer method', function () {
      assert.isFunction(stripe.createCustomer, 'createCustomer method exists');
    });

    test('has the createCreditCard method', function () {
      assert.isFunction(stripe.createCreditCard, 'createCreditCard method exists');
    });

    test('has the updateCreditCard method', function () {
      assert.isFunction(stripe.updateCreditCard, 'updateCreditCard method exists');
    });

    test('has the charge method', function () {
      assert.isFunction(stripe.charge, 'charge method exists');
    });

    test('has the createSubscription method', function () {
      assert.isFunction(stripe.createSubscription, 'createSubscription method exists');
    });

    test('has the getSubscriptions method', function () {
      assert.isFunction(stripe.getSubscriptions, 'getSubscriptions method exists');
    });

    test('has the getSubscription method', function () {
      assert.isFunction(stripe.getSubscription, 'getSubscription method exists');
    });

    test('has the deleteSubscription method', function () {
      assert.isFunction(stripe.deleteSubscription, 'deleteSubscription method exists');
    });

    test('has the updateSubscription method', function () {
      assert.isFunction(stripe.updateSubscription, 'updateSubscription method exists');
    });

    test('has the getCreditCard method', function () {
      assert.isFunction(stripe.getCreditCard, 'getCreditCard method exists');
    });

    test('createCustomer post request (callback)', function (done) {
      stripe.createCustomer('123451234512345123451234',function(err, response) {
        done();
      })
      assert.equal(this.request.method, 'POST');
      assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
      assert.equal(this.request.url, stamplayUrl+'/api/stripe/' + Stamplay.VERSION + '/customers');

      this.request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(response));
    });

    test('createCustomer post request (promise)', function (done) {
      stripe.createCustomer('123451234512345123451234').then(function(response){
        done();
      })
      assert.equal(this.request.method, 'POST');
      assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
      assert.equal(this.request.url, stamplayUrl+'/api/stripe/' + Stamplay.VERSION + '/customers');

      this.request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(response));
    });

    test('createCreditCard post request (callback)', function (done) {
      stripe.createCreditCard('123451234512345123451234', 'token', function(err, response) {
        done();
      })
      assert.equal(this.request.method, 'POST');
      assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
      assert.equal(this.request.url, stamplayUrl+'/api/stripe/' + Stamplay.VERSION + '/customers/123451234512345123451234/cards');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(response));
    });

    test('createCreditCard post request (promise)', function (done) {
      stripe.createCreditCard('123451234512345123451234', 'token').then(function(response){
        done();
      })
      assert.equal(this.request.method, 'POST');
      assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
      assert.equal(this.request.url, stamplayUrl+'/api/stripe/' + Stamplay.VERSION + '/customers/123451234512345123451234/cards');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(response));
    });

    test('updateCreditCard put request (callback)', function (done) {
      stripe.updateCreditCard('123451234512345123451234', 'token', function(err,response){
        done();
      })
      assert.equal(this.request.method, 'PUT');
      assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
      assert.equal(this.request.url, stamplayUrl+'/api/stripe/' + Stamplay.VERSION + '/customers/123451234512345123451234/cards');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(response));

    });

    test('updateCreditCard put request (promise)', function (done) {
      stripe.updateCreditCard('123451234512345123451234', 'token').then(function(response){
        done();
      })
      assert.equal(this.request.method, 'PUT');
      assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
      assert.equal(this.request.url, stamplayUrl+'/api/stripe/' + Stamplay.VERSION + '/customers/123451234512345123451234/cards');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(response));
    });

    test('charge post request (callback)', function (done) {
      stripe.charge('123451234512345123451234', 'token', 1234, 'EUR', function(err, response) {
        done();
      })
      assert.equal(this.request.method, 'POST');
      assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
      assert.equal(this.request.url, stamplayUrl+'/api/stripe/' + Stamplay.VERSION + '/charges');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(response));

    });

    test('charge post request (promise)', function (done) {
      stripe.charge('123451234512345123451234', 'token', 1234, 'EUR').then(function(response) {
        done();
      })
      assert.equal(this.request.method, 'POST');
      assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
      assert.equal(this.request.url, stamplayUrl+'/api/stripe/' + Stamplay.VERSION + '/charges');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(response));
    });

    test('createSubscription post request (callback)', function (done) {
      stripe.createSubscription('123451234512345123451234', 'planId', function(err, response) {
        done()
      })
      assert.equal(this.request.method, 'POST');
      assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
      assert.equal(this.request.url, stamplayUrl+'/api/stripe/' + Stamplay.VERSION + '/customers/123451234512345123451234/subscriptions');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(response));
    });

    test('createSubscription post request (promise)', function (done) {
      stripe.createSubscription('123451234512345123451234', 'planId').then(function(response) {
        done()
      })
      assert.equal(this.request.method, 'POST');
      assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
      assert.equal(this.request.url, stamplayUrl+'/api/stripe/' + Stamplay.VERSION + '/customers/123451234512345123451234/subscriptions');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(response));
    });
   

    test('getSubscriptions get request no options (callback)', function (done) {
      stripe.getSubscriptions('123451234512345123451234',null, function(err, response) {
        done()})
      assert.equal(this.request.method, 'GET');
      assert.equal(this.request.requestHeaders['Content-Type'], "application/json");
      assert.equal(this.request.url, stamplayUrl+'/api/stripe/' + Stamplay.VERSION + '/customers/123451234512345123451234/subscriptions');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(response));
    });

    test('getSubscriptions get request no options (promise)', function (done) {
      stripe.getSubscriptions('123451234512345123451234', null).then(function(response) {
        done()})
      assert.equal(this.request.method, 'GET');
      assert.equal(this.request.requestHeaders['Content-Type'], "application/json");
      assert.equal(this.request.url, stamplayUrl+'/api/stripe/' + Stamplay.VERSION + '/customers/123451234512345123451234/subscriptions');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(response));
    });

    test('getSubscriptions get request with options (callback)', function (done) {
      stripe.getSubscriptions('123451234512345123451234', {page:1,per_page:2}, function(err, response) {
        done()})
      assert.equal(this.request.method, 'GET');
      assert.equal(this.request.requestHeaders['Content-Type'], "application/json");
      assert.equal(this.request.url, stamplayUrl+'/api/stripe/' + Stamplay.VERSION + '/customers/123451234512345123451234/subscriptions?page=1&per_page=2');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(response));
    });

    test('getSubscriptions get request with options (promise)', function (done) {
      stripe.getSubscriptions('123451234512345123451234', {page:1,per_page:2}).then(function(response) {
        done()
      })
      assert.equal(this.request.method, 'GET');
      assert.equal(this.request.requestHeaders['Content-Type'], "application/json");
      assert.equal(this.request.url, stamplayUrl+'/api/stripe/' + Stamplay.VERSION + '/customers/123451234512345123451234/subscriptions?page=1&per_page=2');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(response));
    });

    test('getSubscription get request (callback)', function (done) {
      stripe.getSubscription('123451234512345123451234', 'subscriptionId', function(err, result){
        done();
      })
      assert.equal(this.request.method, 'GET');
      assert.equal(this.request.requestHeaders['Content-Type'], "application/json");
      assert.equal(this.request.url, stamplayUrl+'/api/stripe/' + Stamplay.VERSION + '/customers/123451234512345123451234/subscriptions/subscriptionId');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(response));
    });

    test('getSubscription get request (promise)', function (done) {
      stripe.getSubscription('123451234512345123451234', 'subscriptionId').then(function(result){
        done();
      })
      assert.equal(this.request.method, 'GET');
      assert.equal(this.request.requestHeaders['Content-Type'], "application/json");
      assert.equal(this.request.url, stamplayUrl+'/api/stripe/' + Stamplay.VERSION + '/customers/123451234512345123451234/subscriptions/subscriptionId');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(response));
    });

    test('deleteSubscription delete request (callback)', function (done) {
      stripe.deleteSubscription('123451234512345123451234', 'subscriptionId', null, function(err, response) {
        done();
      })
      assert.equal(this.request.method, 'DELETE');
      assert.equal(this.request.url, stamplayUrl+'/api/stripe/' + Stamplay.VERSION + '/customers/123451234512345123451234/subscriptions/subscriptionId');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(response));
    });

    test('deleteSubscription delete request (promise)', function (done) {
      stripe.deleteSubscription('123451234512345123451234', 'subscriptionId', null).then(function(response) {
        done();
      })
      assert.equal(this.request.method, 'DELETE');
      assert.equal(this.request.url, stamplayUrl+'/api/stripe/' + Stamplay.VERSION + '/customers/123451234512345123451234/subscriptions/subscriptionId');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(response));
    });

    test('updateSubscription put request (callback)', function (done) {
      stripe.updateSubscription('123451234512345123451234', 'subscriptionId', null, function(err, result){
        done()
      })
      assert.equal(this.request.method, 'PUT');
      assert.equal(this.request.url, stamplayUrl+'/api/stripe/' + Stamplay.VERSION + '/customers/123451234512345123451234/subscriptions/subscriptionId');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(response));
    });

    test('updateSubscription put request (promise)', function (done) {
      stripe.updateSubscription('123451234512345123451234', 'subscriptionId',null).then(function(err, result){
        done()
      })

      assert.equal(this.request.method, 'PUT');
      assert.equal(this.request.url, stamplayUrl+'/api/stripe/' + Stamplay.VERSION + '/customers/123451234512345123451234/subscriptions/subscriptionId');

      this.request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(response));
    });

    test('updateSubscription put request with options (callback)', function (done) {
      var stripeOptions = {
        planId: 'planId'
      };
      var expectedBody = {
        options: stripeOptions
      }
      stripe.updateSubscription('123451234512345123451234', 'subscriptionId', stripeOptions, function(err, result){
        done()
      })
      assert.equal(this.request.method, 'PUT');
      assert.equal(this.request.url, stamplayUrl+'/api/stripe/' + Stamplay.VERSION + '/customers/123451234512345123451234/subscriptions/subscriptionId');
      assert.equal(this.request.requestBody, JSON.stringify(expectedBody));

      this.request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(response));
    });

    test('updateSubscription put request with options (promise)', function (done) {
      var stripeOptions = {
        planId: 'planId'
      };
      var expectedBody = {
        options: stripeOptions
      }
      stripe.updateSubscription('123451234512345123451234', 'subscriptionId', stripeOptions).then(function(result){
        done()
      })
      assert.equal(this.request.method, 'PUT');
      assert.equal(this.request.url, stamplayUrl+'/api/stripe/' + Stamplay.VERSION + '/customers/123451234512345123451234/subscriptions/subscriptionId');
      assert.equal(this.request.requestBody, JSON.stringify(expectedBody));

      this.request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(response));
    });

    test('getCreditCard get request (callback)', function (done) {
      stripe.getCreditCard('123451234512345123451234', function(err, result){done()})

      assert.equal(this.request.method, 'GET');
      assert.equal(this.request.requestHeaders['Content-Type'], "application/json");
      assert.equal(this.request.url, stamplayUrl+'/api/stripe/' + Stamplay.VERSION + '/customers/123451234512345123451234/cards');

      this.request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(response));
    });

    test('getCreditCard get request (promise)', function (done) {
      stripe.getCreditCard('123451234512345123451234').then(function(result){done()})

      assert.equal(this.request.method, 'GET');
      assert.equal(this.request.requestHeaders['Content-Type'], "application/json");
      assert.equal(this.request.url, stamplayUrl+'/api/stripe/' + Stamplay.VERSION + '/customers/123451234512345123451234/cards');

      this.request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(response));

    });

  });