/* globals suite,Stamplay,setup,sinon,teardown,test,assert,_ */
suite('Role', function () {

  var role;
  var response = {};

  setup('Creating a new Role', function () {
    role = new Stamplay.Role();
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

  test('has the getRoles method', function () {
    assert.isFunction(role.getRoles, 'getRoles method exists');
  });

   test('has the getRole method', function () {
    assert.isFunction(role.getRole, 'getRole method exists');
  });

  test('has the url property', function () {
    assert.isString(role.url, 'url string exists');
    assert.equal(role.url, '/api/user/' + Stamplay.VERSION + '/roles');
  });

  test('that the url is formatted correctly', function () {
    var r1 = new Stamplay.Role();
    assert.equal(r1.url, '/api/user/' + Stamplay.VERSION + '/roles');
  });

  test('that getRoles method will send a get request', function (done) {

    role.getRoles().then(function (response) {
      done();
    });

    assert.equal(this.request.method, 'GET');
    assert.equal(this.request.requestHeaders['Content-Type'], "application/json");
    assert.equal(this.request.url, '/api/user/' + Stamplay.VERSION + '/roles');

    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify(response));

  });

  test('that getRole method will send', function (done) {

  	role.getRole('123451234512345123451234').then(function (response) {
      done();
    });

    assert.equal(this.request.method, 'GET');
    assert.equal(this.request.requestHeaders['Content-Type'], "application/json");
    assert.equal(this.request.url, '/api/user/' + Stamplay.VERSION + '/roles/123451234512345123451234');

    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify(response));

  });


});