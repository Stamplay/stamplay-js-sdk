/* globals suite,Stamplay,setup,sinon,teardown,test,assert,_ */
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

  suite('Function', function(){
    test('has between method', function () {
      var query = Stamplay.Query('object', 'tag').between('a', 1, 5);
      assert.isObject(query.currentQuery[0].a);
      assert.equal(query.currentQuery[0].a.$gte, 1);
      assert.equal(query.currentQuery[0].a.$lte, 5);
    });

    test('has gte method', function () {
      var query =  Stamplay.Query('object', 'tag').greaterThanOrEqual('a', 1);
      assert.isObject(query.currentQuery[0].a);
      assert.equal(query.currentQuery[0].a.$gte, 1);
    });

    test('has gt method', function () {
      var query =  Stamplay.Query('object', 'tag').greaterThan('a', 2);
      assert.isObject(query.currentQuery[0].a);
      assert.equal(query.currentQuery[0].a.$gt, 2);
    });

    test('has lt method', function () {
      var query =  Stamplay.Query('object', 'tag').lessThan('a', 1);
      assert.isObject(query.currentQuery[0].a);
      assert.equal(query.currentQuery[0].a.$lt, 1);
    });

    test('has lte method', function () {
      var query =  Stamplay.Query('object', 'tag').lessThanOrEqual('b', 3);
      assert.isObject(query.currentQuery[0].b);
      assert.equal(query.currentQuery[0].b.$lte, 3);
    });

    test('has equalTo method', function () {
      var query =  Stamplay.Query('object', 'tag').equalTo('b', 'b');
      assert.isObject(query.currentQuery[0]);
      assert.equal(query.currentQuery[0].b, 'b');
    });

    test('has sortAscending method', function () {
      var query =  Stamplay.Query('object', 'tag').sortAscending('b');
      assert.isObject(query.currentQuery[0]);
      assert.equal(query.currentQuery[0].$sort['b'], 1);
    });

    test('has sortDescending method', function () {
      var query =  Stamplay.Query('object', 'tag').sortDescending('b');
      assert.isObject(query.currentQuery[0]);
      assert.equal(query.currentQuery[0].$sort['b'], -1);
    });

    test('has exists method', function () {
      var query =  Stamplay.Query('object', 'tag').exists('b');
      assert.isObject(query.currentQuery[0].b);
      assert.equal(query.currentQuery[0].b.$exists, true);
    });

    test('has notExists method', function () {
      var query =  Stamplay.Query('object', 'tag').notExists('b');
      assert.isObject(query.currentQuery[0].b);
      assert.equal(query.currentQuery[0].b.$exists, false);
    });

    test('has or method', function () {
      var a =  Stamplay.Query('object', 'tag').notExists('b');
      var b =  Stamplay.Query('object', 'tag').equalTo('c', 'c');
      var query =  Stamplay.Query('object', 'tag').or(a,b)
      assert.isArray(query.currentQuery[0].$or);
      assert.equal(query.currentQuery[0].$or[0].b.$exists, false);
      assert.equal(query.currentQuery[0].$or[1].c, 'c');

      var c =  Stamplay.Query('object', 'tag').notExists('d');
      var d =  Stamplay.Query('object', 'tag').equalTo('e', 'e');
      var queryWithArray =  Stamplay.Query('object', 'tag').or([c, d]);
      assert.isArray(queryWithArray.currentQuery[0].$or);
      assert.equal(queryWithArray.currentQuery[0].$or[0].d.$exists, false);
      assert.equal(queryWithArray.currentQuery[0].$or[1].e, 'e');
    });

    test('has pahination method', function () {
      assert.isFunction( Stamplay.Query('object', 'tag').pagination);
    });

    test('has exec method', function () {
      assert.isFunction( Stamplay.Query('object', 'tag').exec);
    });

  })

  suite('Exec', function(){
    test('exec() equal works (callback)', function (done) {
      var query =  Stamplay.Query('object', 'tag').equalTo('pippo', 'pippo');
      query.exec(function(err,result){
        done()
      })
      assert.equal(this.request.url, '/api/cobject/' + Stamplay.VERSION + '/tag?where={"pippo":"pippo"}');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() equal works (promise)', function (done) {
      var query =  Stamplay.Query('object', 'tag').equalTo('pippo', 'pippo');
      query.exec().then(function(err,result){done()})
      assert.equal(this.request.url, '/api/cobject/' + Stamplay.VERSION + '/tag?where={"pippo":"pippo"}');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() gte works (callback)', function (done) {
      var query =  Stamplay.Query('object', 'tag').greaterThanOrEqual('a', 4);
      query.exec(function (err,result) {done()});
      assert.equal(this.request.url, '/api/cobject/' + Stamplay.VERSION + '/tag?where={"a":{"$gte":4}}');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() gte works (promise)', function (done) {
      var query =  Stamplay.Query('object', 'tag').greaterThanOrEqual('a', 4);
      query.exec().then(function (result) {done()});
      assert.equal(this.request.url, '/api/cobject/' + Stamplay.VERSION + '/tag?where={"a":{"$gte":4}}');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() lte works (callback)', function (done) {
      var query =  Stamplay.Query('object', 'tag').lessThanOrEqual('a', 2);
      query.exec(function (err, result) {done()});
      assert.equal(this.request.url, '/api/cobject/' + Stamplay.VERSION + '/tag?where={"a":{"$lte":2}}');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() lte works (promise)', function (done) {
      var query =  Stamplay.Query('object', 'tag').lessThanOrEqual('a', 2);
      query.exec().then(function (result) {done()});
      assert.equal(this.request.url, '/api/cobject/' + Stamplay.VERSION + '/tag?where={"a":{"$lte":2}}');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() $exists works (promise)', function (done) {
      var query =  Stamplay.Query('object', 'tag').exists('pippo');
      query.exec().then(function (result) {
        done()
      });
      assert.equal(this.request.url, '/api/cobject/' + Stamplay.VERSION + '/tag?where={"pippo":{"$exists":true}}');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() pagination works (callback)', function (done) {
      var query =  Stamplay.Query('object', 'tag').exists('pippo').pagination(1,2);
      query.exec(function (err, result) {done()});
      assert.equal(this.request.url, '/api/cobject/' + Stamplay.VERSION + '/tag?where={"pippo":{"$exists":true}}&page=1&per_page=2');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });


    test('exec() pagination works (promise)', function (done) {
      var query =  Stamplay.Query('object', 'tag').exists('pippo').pagination(1,2);
      query.exec().then(function (result) {
        done()
      });
      assert.equal(this.request.url, '/api/cobject/' + Stamplay.VERSION + '/tag?where={"pippo":{"$exists":true}}&page=1&per_page=2');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() $exists works (callback)', function (done) {
      var query =  Stamplay.Query('object', 'tag').exists('pippo');
      query.exec(function (err, result) {done()});
      assert.equal(this.request.url, '/api/cobject/' + Stamplay.VERSION + '/tag?where={"pippo":{"$exists":true}}');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() $or works (callback)', function (done) {
      var query1 =  Stamplay.Query('object', 'tag').notExists('b');
      var query2 =  Stamplay.Query('object', 'tag').equalTo('c', 'c');
      var query =  Stamplay.Query('object', 'tag').or(query1, query2);

      query.exec(function (err, result) {done()});
      assert.equal(this.request.url, '/api/cobject/' + Stamplay.VERSION + '/tag?where={"$or":[{"b":{"$exists":false}},{"c":"c"}]}');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() $or works (promise)', function (done) {
      var query1 =  Stamplay.Query('object', 'tag').notExists('b');
      var query2 =  Stamplay.Query('object', 'tag').equalTo('c', 'c');
      var query =  Stamplay.Query('object', 'tag').or(query1, query2);

      query.exec().then(function (result) {done()});
      assert.equal(this.request.url, '/api/cobject/' + Stamplay.VERSION + '/tag?where={"$or":[{"b":{"$exists":false}},{"c":"c"}]}');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() $or works with array (callback)', function (done) {
      var query1 =  Stamplay.Query('object', 'tag').notExists('b');
      var query2 =  Stamplay.Query('object', 'tag').equalTo('c', 'c');
      var query =  Stamplay.Query('object', 'tag').or([query1, query2]);

      query.exec(function () {done()});
      assert.equal(this.request.url, '/api/cobject/' + Stamplay.VERSION + '/tag?where={"$or":[{"b":{"$exists":false}},{"c":"c"}]}');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() $or works with array (promise)', function (done) {
      var query1 =  Stamplay.Query('object', 'tag').notExists('b');
      var query2 =  Stamplay.Query('object', 'tag').equalTo('c', 'c');
      var query =  Stamplay.Query('object', 'tag').or([query1, query2]);

      query.exec().then(function () {done()});
      assert.equal(this.request.url, '/api/cobject/' + Stamplay.VERSION + '/tag?where={"$or":[{"b":{"$exists":false}},{"c":"c"}]}');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

  })
})
