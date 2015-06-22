suite('Stripe', function () {

	 setup('Creating a new Stripe', function () {

    stripe = new Stamplay.Stripe();
    response = { name: 'stripe' };
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

  test('createCustomer post request', function(done){
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

  test('createCustomer post request invalid mongoid', function(done){
    stripe.createCustomer('1224').then(function (response) {
    },function(err){
      done();
    });

  });

  test('createCreditCard post request', function(done){
    stripe.createCreditCard('123451234512345123451234','token').then(function (response) {
      done();
    });

    assert.equal(this.request.method, 'POST');
    assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
    assert.equal(this.request.url, '/api/stripe/' + Stamplay.VERSION + '/customers/123451234512345123451234/cards');

    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify(response));

  });

  test('createCreditCard post request invalid mongoid', function(done){
    stripe.createCreditCard('1224', 'token').then(function (response) {
    },function(err){
      done();
    });
  });

  test('createCreditCard post request missing parameters', function(done){
    stripe.createCreditCard('123451234512345123451234' ).then(function (response) {
    },function(err){
      done();
    });
  });

  test('charge post request', function(done){
    stripe.charge('123451234512345123451234','token', 1234, 'eur').then(function (response) {
      done();
    });

    assert.equal(this.request.method, 'POST');
    assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
    assert.equal(this.request.url, '/api/stripe/' + Stamplay.VERSION + '/charges');

    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify(response));

  });

  test('charge post request invalid mongoid', function(done){
    stripe.charge('1224','token', 1234, 'eur').then(function (response) {
    },function(err){
      done();
    });
  });

  test('charge post request missing parameters', function(done){
    stripe.charge('123451234512345123451234', 1234, 'eur').then(function (response) {
    },function(err){
      done();
    });
  });


});