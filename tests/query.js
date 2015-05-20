suite('Stamplay Query ', function () {

  //For each test
  setup('Stamplay Query', function () {
    this.xhr = sinon.useFakeXMLHttpRequest();
    this.request;
    var _this = this;
    this.xhr.onCreate = function (xhr) {
      _this.request = xhr;
    };

  });

  test('has gte method', function () {
    var query = new Stamplay.Query('cobject', 'tag').greaterThanOrEqual('a', 1)
    assert.isObject(query.currentQuery[0].a)
    assert.equal(query.currentQuery[0].a.$gte, 1)
  })

  test('has gt method', function () {
    var query = new Stamplay.Query('cobject', 'tag').greaterThan('a', 2)
    assert.isObject(query.currentQuery[0].a)
    assert.equal(query.currentQuery[0].a.$gt, 2)
  })

  test('has lt method', function () {
    var query = new Stamplay.Query('cobject', 'tag').lessThan('a', 1)
    assert.isObject(query.currentQuery[0].a)
    assert.equal(query.currentQuery[0].a.$lt, 1)
  })

  test('has lte method', function () {
    var query = new Stamplay.Query('cobject', 'tag').lessThanOrEqual('b', 3)
    assert.isObject(query.currentQuery[0].b)
    assert.equal(query.currentQuery[0].b.$lte, 3)
  })

  test('has equalTo method', function () {
    var query = new Stamplay.Query('cobject', 'tag').equalTo('b', 'b')
    assert.isObject(query.currentQuery[0])
    assert.equal(query.currentQuery[0].b, 'b')
  })

  test('has sortAscending method', function () {
    var query = new Stamplay.Query('cobject', 'tag').sortAscending('b')
    assert.isObject(query.currentQuery[0])
    assert.equal(query.currentQuery[0].$sort['b'], 1)
  })

  test('has sortDescending method', function () {
    var query = new Stamplay.Query('cobject', 'tag').sortDescending('b')
    assert.isObject(query.currentQuery[0])
    assert.equal(query.currentQuery[0].$sort['b'], -1)
  })

  test('has exists method', function () {
    var query = new Stamplay.Query('cobject', 'tag').exists('b')
    assert.isObject(query.currentQuery[0].b)
    assert.equal(query.currentQuery[0].b.$exists, true)
  })

  test('has notExists method', function () {
    var query = new Stamplay.Query('cobject', 'tag').notExists('b')
    assert.isObject(query.currentQuery[0].b)
    assert.equal(query.currentQuery[0].b.$exists, false)
  })

  test('has or method', function () {
    var a = new Stamplay.Query('cobject', 'tag').notExists('b')
    var b = new Stamplay.Query('cobject', 'tag').equalTo('c', 'c')
    var query = new Stamplay.Query('cobject', 'tag').or(a, b)
    assert.isArray(query.currentQuery[0].$or)
    assert.equal(query.currentQuery[0].$or[0].b.$exists, false)
    assert.equal(query.currentQuery[0].$or[1].c, 'c')
  })

  test('has exec method', function () {
    assert.isFunction(new Stamplay.Query('cobject', 'tag').exec)
  })

  test('exec() equal works', function () {
    var query = new Stamplay.Query('cobject', 'tag').equalTo('pippo', 'pippo')
    query.exec().then(function () {})
    assert.equal(this.request.url, '/api/cobject/' + Stamplay.VERSION + '/tag?where={"pippo":"pippo"}');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, '{}');
  })

  test('exec() gte works', function () {
    var query = new Stamplay.Query('cobject', 'tag').greaterThanOrEqual('a', 4)
    query.exec().then(function () {})
    assert.equal(this.request.url, '/api/cobject/' + Stamplay.VERSION + '/tag?where={"a":{"$gte":4}}');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, '{}');
  })

  test('exec() lte works', function () {
    var query = new Stamplay.Query('cobject', 'tag').lessThanOrEqual('a', 2)
    query.exec().then(function () {})
    assert.equal(this.request.url, '/api/cobject/' + Stamplay.VERSION + '/tag?where={"a":{"$lte":2}}');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, '{}');
  })

  test('exec() $exists works', function () {
    var query = new Stamplay.Query('cobject', 'tag').exists('pippo')
    query.exec().then(function () {})
    assert.equal(this.request.url, '/api/cobject/' + Stamplay.VERSION + '/tag?where={"pippo":{"$exists":true}}');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, '{}');
  })

  test('exec() $or works', function () {
    var query1 = new Stamplay.Query('cobject', 'tag').notExists('b')
    var query2 = new Stamplay.Query('cobject', 'tag').equalTo('c', 'c')
    var query = new Stamplay.Query('cobject', 'tag').or(query1, query2)
    query.exec().then(function () {})
    assert.equal(this.request.url, '/api/cobject/' + Stamplay.VERSION + '/tag?where={"$or":[{"b":{"$exists":false}},{"c":"c"}]}');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, '{}');
  })

})