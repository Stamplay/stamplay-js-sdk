/* globals suite,Stamplay,setup,sinon,teardown,test,assert,_ */
suite('Webhook', function () {
  
  var stamplayUrl = 'https://stamplay.stamplayapp.com'

  var webhook;
  var response = {
    name: 'myWebHook',
    webhookId: 'mywebhook'
  };

  setup('Creating a new Webhook', function () {
    webhook =  Stamplay.Webhook('myWebHook');
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
  // test('has the get method', function () {
  //   assert.isFunction(webhook.get, 'get method exists');
  // });

  // test('has the put method', function () {
  //   assert.isFunction(webhook.put, 'put method exists');
  // });

  test('has the post method', function () {
    assert.isFunction(webhook.post, 'post method exists');
  });

  test('that post method will send a post request', function (done) {
    webhook.post( null, function(err, result){done()})
    assert.equal(this.request.method, 'POST');
    assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
    assert.equal(this.request.url, stamplayUrl+'/api/webhook/' + Stamplay.VERSION + '/mywebhook/catch');

    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify(response));

  });

  test('that post method will send a post request with query parameter', function (done) {
    webhook.post(null, function(err, result){
      done();
    }) 
    assert.equal(this.request.method, 'POST');
    assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
    assert.equal(this.request.url, stamplayUrl+'/api/webhook/' + Stamplay.VERSION + '/mywebhook/catch');

    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify(response));
  });

});