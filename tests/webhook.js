suite('Webhook', function () {

  var webhook;

  setup('Creating a new Webhook', function () {

    webhook = new Stamplay.Webhook('myWebHook');

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

  test('has the get method', function () {
    assert.isFunction(webhook.get, 'get method exists');
  });

  test('has the put method', function () {
    assert.isFunction(webhook.put, 'put method exists');
  });

  test('has the post method', function () {
    assert.isFunction(webhook.post, 'post method exists');
  });

  test('has the url property', function () {
    assert.isString(webhook.url, 'url string exists');
    assert.equal(webhook.url, '/api/webhook/v0/mywebhook/catch');
  });

  test('that the url is formatted correctly', function () {
    var w1 = new Stamplay.Webhook('Test_Test');
    assert.equal(w1.url, '/api/webhook/v0/test_test/catch');

    var w2 = new Stamplay.Webhook('a_b-c');
    assert.equal(w1.url, '/api/webhook/v0/a_bc/catch');

  });


});