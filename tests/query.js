/* globals suite,Stamplay,setup,sinon,teardown,test,assert,_ */
suite('Stamplay Query ', function () {

  var stamplayUrl = 'https://stamplay.stamplayapp.com'

  //For each test
  setup('Stamplay Query', function () {

    this.xhr = sinon.useFakeXMLHttpRequest();
    this.request;
    var _this = this;
    this.xhr.onCreate = function (xhr) {
      _this.request = xhr;
    };
  });

  suite('Property', function(){
    var query = Stamplay.Query('object', 'tag')
    test('has model property', function(){
      assert.equal(query.model, 'object');
    })
    test('has instance property', function(){
      assert.equal(query.instance, 'tag');
    })
    test('has paginationQuery property', function(){
      assert.typeOf(query.paginationQuery, 'String');
    })
    test('has sortQuery property', function(){
      assert.typeOf(query.sortQuery, 'String');
    })
    test('has selectionQuery property', function(){
      assert.typeOf(query.selectionQuery, 'String');
    })
    test('has populateQuery property', function(){
      assert.typeOf(query.populateQuery, 'String');    
    })
    test('has populateOwnerQuery property', function(){
      assert.typeOf(query.populateOwnerQuery, 'String');    
    })
    test('has whereQuery property', function(){
      assert.typeOf(query.whereQuery, 'Array');    
    })
    test('has executable property', function(){
      assert.typeOf(query.executable, 'String');    
    })
  })

  suite('Function', function(){
    test('has between method', function () {
      var query = Stamplay.Query('object', 'tag').between('a', 1, 5);
      assert.isObject(query.whereQuery[0].a);
      assert.equal(query.whereQuery[0].a.$gte, 1);
      assert.equal(query.whereQuery[0].a.$lte, 5);
    });

    test('has gte method', function () {
      var query =  Stamplay.Query('object', 'tag').greaterThanOrEqual('a', 1);
      assert.isObject(query.whereQuery[0].a);
      assert.equal(query.whereQuery[0].a.$gte, 1);
    });

    test('has gt method', function () {
      var query =  Stamplay.Query('object', 'tag').greaterThan('a', 2);
      assert.isObject(query.whereQuery[0].a);
      assert.equal(query.whereQuery[0].a.$gt, 2);
    });

    test('has lt method', function () {
      var query =  Stamplay.Query('object', 'tag').lessThan('a', 1);
      assert.isObject(query.whereQuery[0].a);
      assert.equal(query.whereQuery[0].a.$lt, 1);
    });

    test('has lte method', function () {
      var query =  Stamplay.Query('object', 'tag').lessThanOrEqual('b', 3);
      assert.isObject(query.whereQuery[0].b);
      assert.equal(query.whereQuery[0].b.$lte, 3);
    });

    test('has equalTo method', function () {
      var query =  Stamplay.Query('object', 'tag').equalTo('b', 'b');
      assert.isObject(query.whereQuery[0]);
      assert.equal(query.whereQuery[0].b, 'b');
    });

    test('has notEqualTo method', function () {
      var query =  Stamplay.Query('object', 'tag').notEqualTo('b', 'a');
      assert.isObject(query.whereQuery[0]);
      assert.equal(query.whereQuery[0].b.$ne, 'a');
    });

    test('has sortAscending method', function () {
      var query =  Stamplay.Query('object', 'tag').sortAscending('b');
      assert.equal(query.sortQuery, '&sort=b');
    });

    test('has sortDescending method', function () {
      var query =  Stamplay.Query('object', 'tag').sortDescending('b');
      assert.equal(query.sortQuery, '&sort=-b');
    });

    test('has exists method', function () {
      var query =  Stamplay.Query('object', 'tag').exists('b');
      assert.isObject(query.whereQuery[0].b);
      assert.equal(query.whereQuery[0].b.$exists, true);
    });

    test('has notExists method', function () {
      var query =  Stamplay.Query('object', 'tag').notExists('b');
      assert.isObject(query.whereQuery[0].b);
      assert.equal(query.whereQuery[0].b.$exists, false);
    });

    test('has regex method', function () {
      var query =  Stamplay.Query('object', 'tag').regex('b', '.*a.*', 'i');
      assert.isObject(query.whereQuery[0].b);
      assert.equal(query.whereQuery[0].b.$regex, '.*a.*');
    });

    test('has or method', function () {
      var a =  Stamplay.Query('object', 'tag').notExists('b');
      var b =  Stamplay.Query('object', 'tag').equalTo('c', 'c');
      var query =  Stamplay.Query('object', 'tag').or(a,b)
      assert.isArray(query.whereQuery[0].$or);
      assert.equal(query.whereQuery[0].$or[0].b.$exists, false);
      assert.equal(query.whereQuery[0].$or[1].c, 'c');

      var c =  Stamplay.Query('object', 'tag').notExists('d');
      var d =  Stamplay.Query('object', 'tag').equalTo('e', 'e');
      var queryWithArray =  Stamplay.Query('object', 'tag').or([c, d]);
      assert.isArray(queryWithArray.whereQuery[0].$or);
      assert.equal(queryWithArray.whereQuery[0].$or[0].d.$exists, false);
      assert.equal(queryWithArray.whereQuery[0].$or[1].e, 'e');
    });

    test('has pagination method', function () {
      assert.isFunction( Stamplay.Query('object', 'tag').pagination);
    });

    test('has populate method', function () {
      assert.isFunction( Stamplay.Query('object', 'tag').populate);
    });

    test('has populateOwner method', function () {
      assert.isFunction( Stamplay.Query('object', 'tag').populateOwner);
    });

    test('has select method', function () {
      assert.isFunction( Stamplay.Query('object', 'tag').select);
    });    

    test('has exec method', function () {
      assert.isFunction( Stamplay.Query('object', 'tag').exec);
    });

    test('has near method', function () {
      assert.isFunction( Stamplay.Query('object', 'tag').near);
    });

    test('has nearSphere method', function () {
      assert.isFunction( Stamplay.Query('object', 'tag').near);
    });

    test('has geoIntersects method', function () {
      assert.isFunction( Stamplay.Query('object', 'tag').geoIntersects);
    });

    test('has geoWithinGeometry method', function () {
      assert.isFunction( Stamplay.Query('object', 'tag').geoWithinGeometry);
    });

    test('has geoWithinCenterSphere method', function () {
      assert.isFunction( Stamplay.Query('object', 'tag').geoWithinCenterSphere);
    });

  })

  suite('Exec', function(){
    test('exec() equal works (callback)', function (done) {
      var query =  Stamplay.Query('object', 'tag').equalTo('pippo', 'pippo');
      query.exec(function(err,result){
        done()
      })
      assert.equal(this.request.url, stamplayUrl + '/api/cobject/' + Stamplay.VERSION + '/tag?where={"pippo":"pippo"}');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() equal works (promise)', function (done) {
      var query =  Stamplay.Query('object', 'tag').equalTo('pippo', 'pippo');
      query.exec().then(function(err,result){done()})
      assert.equal(this.request.url, stamplayUrl +'/api/cobject/' + Stamplay.VERSION + '/tag?where={"pippo":"pippo"}');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() notEqualTo works (callback)', function (done) {
      var query =  Stamplay.Query('object', 'tag').notEqualTo('a', 2);
      query.exec(function(err,result){
        done()
      })
      assert.equal(this.request.url, stamplayUrl + '/api/cobject/' + Stamplay.VERSION + '/tag?where={"a":{"$ne":2}}');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() notEqualTo works (promise)', function (done) {
      var query =  Stamplay.Query('object', 'tag').notEqualTo('a', 2);
      query.exec().then(function(err,result){done()})
      assert.equal(this.request.url, stamplayUrl +'/api/cobject/' + Stamplay.VERSION + '/tag?where={"a":{"$ne":2}}');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() gte works (callback)', function (done) {
      var query =  Stamplay.Query('object', 'tag').greaterThanOrEqual('a', 4);
      query.exec(function (err,result) {done()});
      assert.equal(this.request.url, stamplayUrl +'/api/cobject/' + Stamplay.VERSION + '/tag?where={"a":{"$gte":4}}');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() gte works (promise)', function (done) {
      var query =  Stamplay.Query('object', 'tag').greaterThanOrEqual('a', 4);
      query.exec().then(function (result) {done()});
      assert.equal(this.request.url, stamplayUrl +'/api/cobject/' + Stamplay.VERSION + '/tag?where={"a":{"$gte":4}}');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() lte works (callback)', function (done) {
      var query =  Stamplay.Query('object', 'tag').lessThanOrEqual('a', 2);
      query.exec(function (err, result) {done()});
      assert.equal(this.request.url, stamplayUrl +'/api/cobject/' + Stamplay.VERSION + '/tag?where={"a":{"$lte":2}}');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() lte works (promise)', function (done) {
      var query =  Stamplay.Query('object', 'tag').lessThanOrEqual('a', 2);
      query.exec().then(function (result) {done()});
      assert.equal(this.request.url, stamplayUrl +'/api/cobject/' + Stamplay.VERSION + '/tag?where={"a":{"$lte":2}}');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() $exists works (callback)', function (done) {
      var query =  Stamplay.Query('object', 'tag').exists('pippo');
      query.exec(function (err, result) {
        done()
      });
      assert.equal(this.request.url, stamplayUrl +'/api/cobject/' + Stamplay.VERSION + '/tag?where={"pippo":{"$exists":true}}');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() $regex works (promise)', function (done) {
      var query =  Stamplay.Query('object', 'tag').regex('pippo','^a','i');
      query.exec().then(function (result) {
        done()
      });
      assert.equal(this.request.url, stamplayUrl +'/api/cobject/' + Stamplay.VERSION + '/tag?where={"pippo":{"$regex":"^a","$options":"i"}}');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() $regex works (callback)', function (done) {
      var query =  Stamplay.Query('object', 'tag').regex('pippo','^a','i');
      query.exec(function (err, result) {
        done()
      });
      assert.equal(this.request.url, stamplayUrl +'/api/cobject/' + Stamplay.VERSION + '/tag?where={"pippo":{"$regex":"^a","$options":"i"}}');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() $exists works (promise)', function (done) {
      var query =  Stamplay.Query('object', 'tag').exists('pippo');
      query.exec().then(function (result) {
        done()
      });
      assert.equal(this.request.url, stamplayUrl +'/api/cobject/' + Stamplay.VERSION + '/tag?where={"pippo":{"$exists":true}}');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() pagination works (callback)', function (done) {
      var query =  Stamplay.Query('object', 'tag').exists('pippo').pagination(1,2);
      query.exec(function (err, result) {done()});
      assert.equal(this.request.url, stamplayUrl +'/api/cobject/' + Stamplay.VERSION + '/tag?where={"pippo":{"$exists":true}}&page=1&per_page=2');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() pagination works (promise)', function (done) {
      var query =  Stamplay.Query('object', 'tag').exists('pippo').pagination(1,2);
      query.exec().then(function (result) {
        done()
      });
      assert.equal(this.request.url, stamplayUrl +'/api/cobject/' + Stamplay.VERSION + '/tag?where={"pippo":{"$exists":true}}&page=1&per_page=2');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() populate works (callback)', function (done) {
      var query =  Stamplay.Query('object', 'tag').exists('pippo').populate();
      query.exec(function (err, result) {done()});
      assert.equal(this.request.url, stamplayUrl +'/api/cobject/' + Stamplay.VERSION + '/tag?where={"pippo":{"$exists":true}}&populate=true');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() populate works (promise)', function (done) {
      var query =  Stamplay.Query('object', 'tag').exists('pippo').populate();
      query.exec().then(function (result) {
        done()
      });
      assert.equal(this.request.url, stamplayUrl +'/api/cobject/' + Stamplay.VERSION + '/tag?where={"pippo":{"$exists":true}}&populate=true');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() populateOwner works (callback)', function (done) {
      var query =  Stamplay.Query('object', 'tag').exists('pippo').populateOwner();
      query.exec(function (err, result) {done()});
      assert.equal(this.request.url, stamplayUrl +'/api/cobject/' + Stamplay.VERSION + '/tag?where={"pippo":{"$exists":true}}&populate_owner=true');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() populateOwner works (promise)', function (done) {
      var query =  Stamplay.Query('object', 'tag').exists('pippo').populateOwner();
      query.exec().then(function (result) {
        done()
      });
      assert.equal(this.request.url, stamplayUrl +'/api/cobject/' + Stamplay.VERSION + '/tag?where={"pippo":{"$exists":true}}&populate_owner=true');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() select works (callback)', function (done) {
      var query =  Stamplay.Query('object', 'tag').exists('pippo').select('a','b');
      query.exec(function (err, result) {done()});
      assert.equal(this.request.url, stamplayUrl +'/api/cobject/' + Stamplay.VERSION + '/tag?where={"pippo":{"$exists":true}}&select=a,b');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() select works (promise)', function (done) {
      var query =  Stamplay.Query('object', 'tag').exists('pippo').select('a','c');
      query.exec().then(function (result) {
        done()
      });
      assert.equal(this.request.url, stamplayUrl +'/api/cobject/' + Stamplay.VERSION + '/tag?where={"pippo":{"$exists":true}}&select=a,c');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() near works (callback)', function (done) {
      var query =  Stamplay.Query('object', 'tag').near('Point', [1,2], 1, 2);
      query.exec(function (err, result) {done()});
      var urlPath = '/tag?where={"_geolocation":{"$near":{"$geometry":{"type":"Point","coordinates":[1,2]},"$maxDistance":1,"$minDistance":2}}}'
      assert.equal(this.request.url, stamplayUrl +'/api/cobject/' + Stamplay.VERSION + urlPath);
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() near works (promise)', function (done) {
      var query =  Stamplay.Query('object', 'tag').near('Point', [1,2], 1, 2);
      query.exec().then(function (result) {
        done()
      });
      var urlPath = '/tag?where={"_geolocation":{"$near":{"$geometry":{"type":"Point","coordinates":[1,2]},"$maxDistance":1,"$minDistance":2}}}'
      assert.equal(this.request.url, stamplayUrl +'/api/cobject/' + Stamplay.VERSION + urlPath);
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() nearSphere works (callback)', function (done) {
      var query =  Stamplay.Query('object', 'tag').nearSphere('Point', [1,2], 1, 2);
      query.exec(function (err, result) {done()});
      var urlPath = '/tag?where={"_geolocation":{"$nearSphere":{"$geometry":{"type":"Point","coordinates":[1,2]},"$maxDistance":1,"$minDistance":2}}}'
      assert.equal(this.request.url, stamplayUrl +'/api/cobject/' + Stamplay.VERSION + urlPath);
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() nearSphere works (promise)', function (done) {
      var query =  Stamplay.Query('object', 'tag').nearSphere('Point', [1,2], 1, 2);
      query.exec().then(function (result) {
        done()
      });
      var urlPath = '/tag?where={"_geolocation":{"$nearSphere":{"$geometry":{"type":"Point","coordinates":[1,2]},"$maxDistance":1,"$minDistance":2}}}'
      assert.equal(this.request.url, stamplayUrl +'/api/cobject/' + Stamplay.VERSION + urlPath);
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() geoIntersects works (callback)', function (done) {
      var query =  Stamplay.Query('object', 'tag').geoIntersects('Point', [1,2]);
      query.exec(function (err, result) {done()});
      var urlPath = '/tag?where={"_geolocation":{"$geoIntersects":{"$geometry":{"type":"Point","coordinates":[1,2]}}}}'
      assert.equal(this.request.url, stamplayUrl +'/api/cobject/' + Stamplay.VERSION + urlPath);
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() geoIntersects works (promise)', function (done) {
      var query =  Stamplay.Query('object', 'tag').geoIntersects('Point', [1,2]);
      query.exec().then(function (result) {
        done()
      });
      var urlPath = '/tag?where={"_geolocation":{"$geoIntersects":{"$geometry":{"type":"Point","coordinates":[1,2]}}}}'
      assert.equal(this.request.url, stamplayUrl +'/api/cobject/' + Stamplay.VERSION + urlPath);
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() geoWithinGeometry works (callback)', function (done) {
      var query =  Stamplay.Query('object', 'tag').geoWithinGeometry('Point', [1,2]);
      query.exec(function (err, result) {done()});
      var urlPath = '/tag?where={"_geolocation":{"$geoWithin":{"$geometry":{"type":"Point","coordinates":[1,2]}}}}'
      assert.equal(this.request.url, stamplayUrl +'/api/cobject/' + Stamplay.VERSION + urlPath);
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() geoWithinGeometry works (promise)', function (done) {
      var query =  Stamplay.Query('object', 'tag').geoWithinGeometry('Point', [1,2]);
      query.exec().then(function (result) {
        done()
      });
      var urlPath = '/tag?where={"_geolocation":{"$geoWithin":{"$geometry":{"type":"Point","coordinates":[1,2]}}}}'
      assert.equal(this.request.url, stamplayUrl +'/api/cobject/' + Stamplay.VERSION + urlPath);
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });


    test('exec() geoWithinCenterSphere works (callback)', function (done) {
      var query =  Stamplay.Query('object', 'tag').geoWithinCenterSphere([1,2],2);
      query.exec(function (err, result) {done()});
      var urlPath = '/tag?where={"_geolocation":{"$geoWithin":{"$centerSphere":[[1,2],2]}}}'
      assert.equal(this.request.url, stamplayUrl +'/api/cobject/' + Stamplay.VERSION + urlPath);
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() geoWithinCenterSphere works (promise)', function (done) {
      var query =  Stamplay.Query('object', 'tag').geoWithinCenterSphere([1,2],2);
      query.exec().then(function (result) {
        done()
      });
      var urlPath = '/tag?where={"_geolocation":{"$geoWithin":{"$centerSphere":[[1,2],2]}}}'
      assert.equal(this.request.url, stamplayUrl +'/api/cobject/' + Stamplay.VERSION + urlPath);
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() $or works (callback)', function (done) {
      var query1 =  Stamplay.Query('object', 'tag').notExists('b');
      var query2 =  Stamplay.Query('object', 'tag').equalTo('c', 'c');
      var query =  Stamplay.Query('object', 'tag').or(query1, query2);

      query.exec(function (err, result) {done()});
      assert.equal(this.request.url, stamplayUrl +'/api/cobject/' + Stamplay.VERSION + '/tag?where={"$or":[{"b":{"$exists":false}},{"c":"c"}]}');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() $or works (promise)', function (done) {
      var query1 =  Stamplay.Query('object', 'tag').notExists('b');
      var query2 =  Stamplay.Query('object', 'tag').equalTo('c', 'c');
      var query =  Stamplay.Query('object', 'tag').or(query1, query2);

      query.exec().then(function (result) {done()});
      assert.equal(this.request.url, stamplayUrl +'/api/cobject/' + Stamplay.VERSION + '/tag?where={"$or":[{"b":{"$exists":false}},{"c":"c"}]}');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() $or works with array (callback)', function (done) {
      var query1 =  Stamplay.Query('object', 'tag').notExists('b');
      var query2 =  Stamplay.Query('object', 'tag').equalTo('c', 'c');
      var query =  Stamplay.Query('object', 'tag').or([query1, query2]);

      query.exec(function () {done()});
      assert.equal(this.request.url, stamplayUrl +'/api/cobject/' + Stamplay.VERSION + '/tag?where={"$or":[{"b":{"$exists":false}},{"c":"c"}]}');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

    test('exec() $or works with array (promise)', function (done) {
      var query1 =  Stamplay.Query('object', 'tag').notExists('b');
      var query2 =  Stamplay.Query('object', 'tag').equalTo('c', 'c');
      var query =  Stamplay.Query('object', 'tag').or([query1, query2]);

      query.exec().then(function () {done()});
      assert.equal(this.request.url, stamplayUrl +'/api/cobject/' + Stamplay.VERSION + '/tag?where={"$or":[{"b":{"$exists":false}},{"c":"c"}]}');
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, '{}');
    });

  })
})
