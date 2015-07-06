  suite('Stripe', function () {

    setup('Creating a new Stripe', function () {

      stripe = new Stamplay.Stripe();
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


    test('createCustomer post request', function (done) {
      stripe.createCustomer('123451234512345123451234').then(function (response) {
        done();
      });

      assert.equal(this.request.method, 'POST');
      assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
      assert.equal(this.request.url, '/api/stripe/' + Stamplay.VERSION + '/customers');

      this.request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(response));

    });

    test('createCustomer post request invalid mongoid', function (done) {
      stripe.createCustomer('1224').then(function (response) {}, function (err) {
        done();
      });

    });

    test('createCreditCard post request', function (done) {
      stripe.createCreditCard('123451234512345123451234', 'token').then(function (response) {
        done();
      });

      assert.equal(this.request.method, 'POST');
      assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
      assert.equal(this.request.url, '/api/stripe/' + Stamplay.VERSION + '/customers/123451234512345123451234/cards');

      this.request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(response));

    });

    test('createCreditCard post request invalid mongoid', function (done) {
      stripe.createCreditCard('1224', 'token').then(function (response) {}, function (err) {
        done();
      });
    });

    test('createCreditCard post request missing parameters', function (done) {
      stripe.createCreditCard('123451234512345123451234').then(function (response) {}, function (err) {
        done();
      });
    });

    test('charge post request', function (done) {
      stripe.charge('123451234512345123451234', 'token', 1234, 'eur').then(function (response) {
        done();
      });

      assert.equal(this.request.method, 'POST');
      assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
      assert.equal(this.request.url, '/api/stripe/' + Stamplay.VERSION + '/charges');

      this.request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(response));

    });

    test('charge post request invalid mongoid', function (done) {
      stripe.charge('1224', 'token', 1234, 'eur').then(function (response) {}, function (err) {
        done();
      });
    });

    test('charge post request missing parameters', function (done) {
      stripe.charge('123451234512345123451234', 1234, 'eur').then(function (response) {}, function (err) {
        done();
      });
    });

    test('createSubscription post request', function (done) {
      stripe.createSubscription('123451234512345123451234', 'planId').then(function (response) {
        done();
      });

      assert.equal(this.request.method, 'POST');
      assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
      assert.equal(this.request.url, '/api/stripe/' + Stamplay.VERSION + '/customers/123451234512345123451234/subscriptions');

      this.request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(response));

    });

    test('createSubscription post request invalid mongoid', function (done) {
      stripe.createSubscription('1224', 'planId').then(function (response) {}, function (err) {
        done();
      });
    });

    test('createSubscription post request missing parameters', function (done) {
      stripe.createSubscription('123').then(function (response) {}, function (err) {
        done();
      });
    });

    test('getSubscriptions get request', function (done) {
      stripe.getSubscriptions('123451234512345123451234').then(function (response) {
        done();
      });

      assert.equal(this.request.method, 'GET');
      assert.equal(this.request.requestHeaders['Content-Type'], "application/json");
      assert.equal(this.request.url, '/api/stripe/' + Stamplay.VERSION + '/customers/123451234512345123451234/subscriptions');

      this.request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(response));

    });

    test('getSubscriptions get request invalid mongoid', function (done) {
      stripe.getSubscriptions('1224').then(function (response) {}, function (err) {
        done();
      });
    });

    test('getSubscriptions post request missing parameters', function (done) {
      stripe.getSubscriptions().then(function (response) {}, function (err) {
        done();
      });
    });

    test('getSubscription get request', function (done) {
      stripe.getSubscription('123451234512345123451234', 'subscriptionId').then(function (response) {
        done();
      });

      assert.equal(this.request.method, 'GET');
      assert.equal(this.request.requestHeaders['Content-Type'], "application/json");
      assert.equal(this.request.url, '/api/stripe/' + Stamplay.VERSION + '/customers/123451234512345123451234/subscriptions/subscriptionId');

      this.request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(response));

    });

    test('getSubscription get request invalid mongoid', function (done) {
      stripe.getSubscriptions('1224', 'subscriptionId').then(function (response) {}, function (err) {
        done();
      });
    });
    test('getSubscription post request missing parameters', function (done) {
      stripe.getSubscription().then(function (response) {}, function (err) {
        done();
      });
    });

    test('deleteSubscription delete request', function (done) {
      stripe.deleteSubscription('123451234512345123451234', 'subscriptionId').then(function (response) {
        done();
      }, function (err) {
        console.log(err);
      });

      assert.equal(this.request.method, 'DELETE');
      assert.equal(this.request.url, '/api/stripe/' + Stamplay.VERSION + '/customers/123451234512345123451234/subscriptions/subscriptionId');

      this.request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(response));
    });

    test('deleteSubscription delete request invalid mongoid', function (done) {
      stripe.deleteSubscription('1224', 'subscriptionId').then(function (response) {}, function (err) {
        done();
      });
    });

    test('deleteSubscription delete request missing parameters', function (done) {
      stripe.deleteSubscription().then(function (response) {}, function (err) {
        done();
      });
    });

    test('updateSubscription put request', function (done) {
      stripe.updateSubscription('123451234512345123451234', 'subscriptionId').then(function (response) {
        done();
      }, function (err) {
        console.log(err);
      });

      assert.equal(this.request.method, 'PUT');
      assert.equal(this.request.url, '/api/stripe/' + Stamplay.VERSION + '/customers/123451234512345123451234/subscriptions/subscriptionId');

      this.request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(response));
    });

    test('updateSubscription put request with options', function (done) {
      var stripeOptions = {
        planId: 'planId'
      };

      var expectedBody = {
        options: stripeOptions
      };
      stripe.updateSubscription('123451234512345123451234', 'subscriptionId', stripeOptions).then(function (response) {
        done();
      }, function (err) {
        console.log(err);
      });
      assert.equal(this.request.method, 'PUT');
      assert.equal(this.request.url, '/api/stripe/' + Stamplay.VERSION + '/customers/123451234512345123451234/subscriptions/subscriptionId');
      assert.equal(this.request.requestBody, JSON.stringify(expectedBody));

      this.request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(response));
    });

    test('updateSubscription get request invalid mongoid', function (done) {
      stripe.updateSubscription('1224', 'subscriptionId').then(function (response) {}, function (err) {
        done();
      });
    });

    test('updateSubscription post request missing parameters', function (done) {
      stripe.updateSubscription().then(function (response) {}, function (err) {
        done();
      });
    });

  });