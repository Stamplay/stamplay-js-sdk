/* globals suite,Stamplay,setup,sinon,teardown,test,assert */
suite('Stamplay Cobject Collection ', function () {

  var coll_cinstance;
  var i1 = new Stamplay.Cobject('cobjectId').Model;
  i1.instance = {
    "_id": 123,
    "comment": "Hey there"
  };
  var i2 = new Stamplay.Cobject('cobjectId').Model;
  i2.instance = {
    "_id": 124,
    "comment": "Hey there you"
  };
  var i3 = new Stamplay.Cobject('cobjectId').Model;
  i3.instance = {
    "_id": 125,
    "comment": "Hey there you"
  };

  setup('Creating a new Cobject Collection ', function () {

    coll_cinstance = new Stamplay.Cobject('cobjectId').Collection;
    coll_cinstance.add(i1);
    coll_cinstance.add(i2);

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
  })

  test('has the fetch method', function () {
    assert.isFunction(coll_cinstance.fetch, 'fetch method exists');
  });

  test('has the remove method', function () {
    assert.isFunction(coll_cinstance.remove, 'remove method exists');
  });

  test('has the get method', function () {
    assert.isFunction(coll_cinstance.get, 'get method exists');
  });

  test('has the at method', function () {
    assert.isFunction(coll_cinstance.at, 'at method exists');
  });

  test('has the add method', function () {
    assert.isFunction(coll_cinstance.add, 'add method exists');
  });

  test('has the pop method', function () {
    assert.isFunction(coll_cinstance.pop, 'pop method exists');
  });

  test('has the pop method', function () {
    assert.property(coll_cinstance, 'length', 'length is a property');
  });

  test('has the count method', function () {
    assert.isFunction(coll_cinstance.count, 'count method exists');
  });

  test('has the set method', function () {
    assert.isFunction(coll_cinstance.set, 'set method exists');
  });

  test('has the instance property which is an array', function () {
    assert.isArray(coll_cinstance.instance, 'instance property is an array');
    assert.equal(coll_cinstance.instance.length, 2, 'instance property is an array');
  });

  test('set function with no element', function (done) {

    var newCinstance = new Stamplay.Cobject('cobjectId').Collection;

    var array = [];
    newCinstance.set(array);
    assert.isArray(newCinstance.instance);
    assert.equal(newCinstance.instance.length, 0, '0 instances should be present');
    done();
  });

  test('set function with 2 elements', function (done) {

    var newCinstance = new Stamplay.Cobject('cobjectId').Collection;

    var array = [{
      '_id': 123,
      'comment': 'Hey there'
    }, {
      '_id': 124,
      'comment': 'Hey there you'
    }];
    newCinstance.set(array);
    assert.isArray(newCinstance.instance);
    assert.equal(newCinstance.instance.length, 2, 'Two instances should be present');
    assert.equal(newCinstance.instance[0].get('_id'), 123);
    assert.equal(newCinstance.instance[0].get('comment'), 'Hey there');
    assert.equal(newCinstance.instance[1].get('_id'), 124);
    assert.equal(newCinstance.instance[1].get('comment'), 'Hey there you');
    done();
  });

  test('set function with 2 elements, one of this is not an Object', function (done) {

    var newCinstance = new Stamplay.Cobject('cobjectId').Collection;

    var array = [{
      '_id': 123,
      'comment': 'Hey there'
    }, 'a'];
    newCinstance.set(array);
    assert.isArray(newCinstance.instance);
    assert.equal(newCinstance.instance.length, 1, 'One instances should be present');
    assert.equal(newCinstance.instance[0].get('_id'), 123);
    assert.equal(newCinstance.instance[0].get('comment'), 'Hey there');
    done();
  });

  test('fetch function', function (done) {

    var newCinstance = new Stamplay.Cobject('cobjectId').Collection;

    newCinstance.fetch().then(function () {

      assert.isArray(newCinstance.instance);
      assert.equal(newCinstance.instance.length, 2, 'Two instances should be present');

      assert.equal(newCinstance.instance[0].get('_id'), 123);
      assert.equal(newCinstance.instance[0].get('comment'), 'Hey there');

      assert.equal(newCinstance.instance[1].get('_id'), 124);
      assert.equal(newCinstance.instance[1].get('comment'), 'Hey there you');

      done();
    });

    this.request.respond(200, {
      "Content-Type": "application/json",
      "x-total-elements": "2",
      "link": '<https://test.stamplayapp.com/api/cobject/' + Stamplay.VERSION + '/coinstances?page=1&per_page=10&cobjectId=cobjectId>; rel="last",<https://test.stamplayapp.com/api/cobject/' + Stamplay.VERSION + '/coinstances?&cobjectId=cobjectId>; rel="generic"'
    }, '{"data": [{ "_id": 123, "comment": "Hey there" }, { "_id": 124, "comment": "Hey there you" }]}');
  });

  test('fetch function with headers', function (done) {

    var newCinstance = new Stamplay.Cobject('cobjectId').Collection;

    newCinstance.fetch(null,true).then(function () {

      assert.isArray(newCinstance.instance);
      assert.equal(newCinstance.instance.length, 2, 'Two instances should be present');

      assert.equal(newCinstance.instance[0].get('_id'), 123);
      assert.equal(newCinstance.instance[0].get('comment'), 'Hey there');

      assert.equal(newCinstance.instance[1].get('_id'), 124);
      assert.equal(newCinstance.instance[1].get('comment'), 'Hey there you');

      assert.equal(newCinstance.totalElements, 2);
      assert.equal(newCinstance.pagination.generic, 'https://test.stamplayapp.com/api/cobject/v0/coinstances?&cobjectId=cobjectId&sort=-dt_create');
      assert.equal(newCinstance.pagination.last, 'https://test.stamplayapp.com/api/cobject/v0/coinstances?page=1&per_page=10&cobjectId=cobjectId&sort=-dt_create');

      done();
    })

    this.request.respond(200, {
      "Content-Type": "application/json",
      "x-total-elements": "2",
      "link": '<https://test.stamplayapp.com/api/cobject/v0/coinstances?page=1&per_page=10&cobjectId=cobjectId>; rel="last",<https://test.stamplayapp.com/api/cobject/v0/coinstances?&cobjectId=cobjectId>; rel="generic"'
    }, '{"data": [{ "_id": 123, "comment": "Hey there" }, { "_id": 124, "comment": "Hey there you" }]}');
  });

  test('remove function with single _id', function () {
    //Removing a fake instance
    coll_cinstance.remove(1);
    assert.equal(coll_cinstance.instance.length, 2);

    coll_cinstance.remove(null);
    assert.equal(coll_cinstance.instance.length, 2);

    coll_cinstance.remove(undefined);
    assert.equal(coll_cinstance.instance.length, 2);

    //Removing an existing intance
    coll_cinstance.remove(123);
    assert.equal(coll_cinstance.instance.length, 1);
    assert.equal(coll_cinstance.at(0).get('_id'), 124);
  });

  test('remove function with an array of _ids', function () {
    //Removing a fake instance
    coll_cinstance.remove([]);
    assert.equal(coll_cinstance.instance.length, 2);

    coll_cinstance.remove(['a', 'b']);
    assert.equal(coll_cinstance.instance.length, 2);

    coll_cinstance.remove([null, undefined]);
    assert.equal(coll_cinstance.instance.length, 2);

    coll_cinstance.remove([{
      _id: 123
    }, {
      undefined: null
    }]);
    assert.equal(coll_cinstance.instance.length, 2);

    //Removing an existing intance
    coll_cinstance.remove([123, 124]);
    assert.equal(coll_cinstance.instance.length, 0);

    coll_cinstance.add(i1);
    coll_cinstance.add(i2);
    coll_cinstance.add(i3);
    assert.equal(coll_cinstance.length, 3);
    coll_cinstance.remove(123, 125);
    var onlyOne = coll_cinstance.get(124);
    assert.equal(onlyOne.get('_id'), 124);
  });

  test('underscore method exists', function () {

    var collectionMethods = {
      forEach: 3,
      each: 3,
      map: 3,
      collect: 3,
      reduce: 4,
      foldl: 4,
      inject: 4,
      reduceRight: 4,
      foldr: 4,
      find: 3,
      detect: 3,
      filter: 3,
      select: 3,
      reject: 3,
      every: 3,
      all: 3,
      some: 3,
      any: 3,
      include: 2,
      contains: 2,
      invoke: 2,
      max: 3,
      min: 3,
      toArray: 1,
      size: 1,
      first: 3,
      head: 3,
      take: 3,
      initial: 3,
      rest: 3,
      tail: 3,
      drop: 3,
      last: 3,
      without: 0,
      difference: 0,
      indexOf: 3,
      shuffle: 1,
      lastIndexOf: 3,
      isEmpty: 1,
      chain: 1,
      sample: 3,
      partition: 3
    };

    var model = {};
    _.each(collectionMethods, function (length, method) {
      assert.isFunction(coll_cinstance[method], method);
    })

  })

  test('at function', function () {
    var first = coll_cinstance.at(0);
    assert.equal(first.get('_id'), 123);
    var second = coll_cinstance.at(1);
    assert.equal(second.get('_id'), 124);
    var nothingHere = coll_cinstance.at(2);
    assert.isUndefined(nothingHere);
    var nothingHere2 = coll_cinstance.at();
    assert.isUndefined(nothingHere2);
    var nothingHere3 = coll_cinstance.at({
      _id: 123
    });
    assert.isUndefined(nothingHere3);
    assert.equal(coll_cinstance.instance.length, 2);
  });

  test('get function', function () {

    var instanceGet1 = coll_cinstance.get(123);
    assert.equal(instanceGet1.get('_id'), 123);
    var instanceGet2 = coll_cinstance.get(124);
    assert.equal(instanceGet2.get('_id'), 124);
    var instanceGet_wrong_id = coll_cinstance.get('asd');
    assert.isUndefined(instanceGet_wrong_id);
    var instanceGet_undefined_id = coll_cinstance.get();
    assert.isUndefined(instanceGet_undefined_id);
  });

  test('add function', function () {

    var newInstance = new Stamplay.Cobject('cobjectId').Model;
    newInstance.constructor({
      _id: 125,
      comment: 'Comment'
    });
    coll_cinstance.add(newInstance);
    assert.equal(coll_cinstance.instance.length, 3);
    assert.equal(coll_cinstance.at(2).get('_id'), newInstance.get('_id'));

    var notGoodInstance = new Stamplay.Cobject('bad').Model;
    notGoodInstance.constructor({
      _id: 4,
      comment: 'Bad comment'
    });
    coll_cinstance.add(notGoodInstance);
    assert.equal(coll_cinstance.instance.length, 3);

    coll_cinstance.add();
    assert.equal(coll_cinstance.instance.length, 3);
  });

  test('length property', function () {

    assert.isNotFunction(coll_cinstance.length, 'length is not a function');

    var len = coll_cinstance.length;
    assert.equal(len, 2);

    coll_cinstance.add(i3);
    len = coll_cinstance.length;
    assert.equal(len, 3);
  });

  test('pop function', function () {
    // Remove and return the last model from a collection.
    var lastElem = coll_cinstance.pop();

    assert.equal(lastElem.get('_id'), 124);
    assert.equal(coll_cinstance.length, 1);

    lastElem = coll_cinstance.pop();
    assert.equal(lastElem.get('_id'), 123);
    assert.equal(coll_cinstance.length, 0);

    lastElem = coll_cinstance.pop();
    assert.isFalse(lastElem);
    assert.equal(coll_cinstance.length, 0);

    var newCinstance = new Stamplay.Cobject('cobjectId').Collection;
    lastElem = coll_cinstance.pop();
    assert.isFalse(lastElem);
  });

  test('shift function', function () {
    // Remove and return the first model from a collection
    var lastElem = coll_cinstance.shift();
    assert.equal(lastElem.get('_id'), 123);
    assert.equal(coll_cinstance.length, 1);

    lastElem = coll_cinstance.shift();
    assert.equal(lastElem.get('_id'), 124);
    assert.equal(coll_cinstance.length, 0);

    lastElem = coll_cinstance.shift();
    assert.isFalse(lastElem);
    assert.equal(coll_cinstance.length, 0);

    var newCinstance = new Stamplay.Cobject('cobjectId').Collection;
    lastElem = coll_cinstance.shift();
    assert.isFalse(lastElem);
  });

  test('has no action methods', function () {
    assert.isUndefined(coll_cinstance.vote);
    assert.isUndefined(coll_cinstance.rate);
    assert.isUndefined(coll_cinstance.comment);
    assert.isUndefined(coll_cinstance.twitterShare);
    assert.isUndefined(coll_cinstance.facebookShare);
  });


  suite('Stamplay fetchParams builder', function () {


    test('has own functions', function () {

      assert.isObject(new Stamplay.Cobject('cobjectId').Collection);
      var coll = new Stamplay.Cobject('cobjectId').Collection;
      assert.isFunction(coll.equalTo);
      assert.isFunction(coll.limit);
      assert.isFunction(coll.select);
      assert.isFunction(coll.sortAscending);
      assert.isFunction(coll.sortDescending);

    });

    test('has the compile method', function () {

      assert.isFunction(new Stamplay.Cobject('cobjectId').Collection.compile);
      var ParamsBuilder = new Stamplay.Cobject('cobjectId').Collection.equalTo('name', 'pippo').compile();
      assert.equal(ParamsBuilder.name, 'pippo');
      var ParamsBuilder = new Stamplay.Cobject('cobjectId').Collection.equalTo('name', 'pippo').limit(5).sortAscending('name').compile();
      assert.equal(ParamsBuilder.name, 'pippo');
      assert.equal(ParamsBuilder.n, 5);
      assert.equal(ParamsBuilder.sort, 'name');
      var ParamsBuilder = new Stamplay.Cobject('cobjectId').Collection.equalTo('name', 'pippo').limit(5).sortAscending('name').populateOwner().compile();
      assert.equal(ParamsBuilder.name, 'pippo');
      assert.equal(ParamsBuilder.n, 5);
      assert.equal(ParamsBuilder.sort, 'name');
      assert.equal(ParamsBuilder.populate_owner, true);

    });

    test('has the pagination method', function () {

      assert.isFunction(new Stamplay.Cobject('cobjectId').Collection.pagination);
      var ParamsBuilder = new Stamplay.Cobject('cobjectId').Collection.pagination(1, 20).compile();
      assert.equal(ParamsBuilder.page, 1);
      assert.equal(ParamsBuilder.per_page, 20);
    });

    test('has the equalTo method', function () {

      assert.isFunction(new Stamplay.Cobject('cobjectId').Collection.equalTo);
      assert.isObject(new Stamplay.Cobject('cobjectId').Collection.equalTo('a', 'b'));
      assert.equal(new Stamplay.Cobject('cobjectId').Collection.equalTo('a', 'b').currentQuery.find.a, 'b');
      assert.equal(new Stamplay.Cobject('cobjectId').Collection.equalTo('b', 'b').currentQuery.find.a, undefined);
      var ParamsBuilder = new Stamplay.Cobject('cobjectId').Collection.equalTo('a', 'b');
      assert.equal(Object.keys(ParamsBuilder.equalTo('b', 'c').currentQuery.find).length, 2);
      assert.equal(ParamsBuilder.currentQuery.find.b, 'c');
      assert.equal(new Stamplay.Cobject('cobjectId').Collection.equalTo({
        a: 'a',
        b: 'b'
      }).currentQuery.find.a, 'a');

    });

    test('has the limit method', function () {

      assert.isFunction(new Stamplay.Cobject('cobjectId').Collection.limit);
      assert.isObject(new Stamplay.Cobject('cobjectId').Collection.limit(10));
      assert.equal(new Stamplay.Cobject('cobjectId').Collection.limit(20).currentQuery.limit, 20);
      var ParamsBuilder = new Stamplay.Cobject('cobjectId').Collection.limit(30);
      assert.equal(ParamsBuilder.limit(40).currentQuery.limit, 40);

    })

    test('has the select method', function () {

      assert.isFunction(new Stamplay.Cobject('cobjectId').Collection.select);
      assert.isObject(new Stamplay.Cobject('cobjectId').Collection.select('a'));
      assert.equal(new Stamplay.Cobject('cobjectId').Collection.select('a').currentQuery.select[0], 'a');
      assert.equal(new Stamplay.Cobject('cobjectId').Collection.select('b').currentQuery.select[1], undefined);
      var ParamsBuilder = new Stamplay.Cobject('cobjectId').Collection.select('a');
      assert.equal(ParamsBuilder.select('b').currentQuery.select.length, 2);
      assert.equal(new Stamplay.Cobject('cobjectId').Collection.select(['a', 'b']).currentQuery.select.length, 2);

    })

    test('has the sortAscending method', function () {

      assert.isFunction(new Stamplay.Cobject('cobjectId').Collection.sortAscending);
      assert.isObject(new Stamplay.Cobject('cobjectId').Collection.sortAscending('a'));
      assert.equal(new Stamplay.Cobject('cobjectId').Collection.sortAscending('a').currentQuery.sort, 'a');
      var ParamsBuilder = new Stamplay.Cobject('cobjectId').Collection.sortAscending('b');
      assert.equal(ParamsBuilder.sortAscending('c').currentQuery.sort, 'c');

    })

    test('has the sortDescending method', function () {

      assert.isFunction(new Stamplay.Cobject('cobjectId').Collection.sortDescending);
      assert.isObject(new Stamplay.Cobject('cobjectId').Collection.sortDescending('a'));
      assert.equal(new Stamplay.Cobject('cobjectId').Collection.sortDescending('a').currentQuery.sort, '-a');
      var ParamsBuilder = new Stamplay.Cobject('cobjectId').Collection.sortDescending('b');
      assert.equal(ParamsBuilder.sortDescending('c').currentQuery.sort, '-c');

    })

    test('has the populate method', function () {

      assert.isFunction(new Stamplay.Cobject('cobjectId').Collection.populate);
      assert.isObject(new Stamplay.Cobject('cobjectId').Collection.populate());
      assert.equal(new Stamplay.Cobject('cobjectId').Collection.populate().currentQuery.populate, true);
      var ParamsBuilder = new Stamplay.Cobject('cobjectId').Collection.populate();
      assert.equal(ParamsBuilder.populate().currentQuery.populate, true);

    })


    test('has the populateOwner method', function () {

      assert.isFunction(new Stamplay.Cobject('cobjectId').Collection.populateOwner);
      assert.isObject(new Stamplay.Cobject('cobjectId').Collection.populateOwner());
      assert.equal(new Stamplay.Cobject('cobjectId').Collection.populateOwner().currentQuery.populateOwner, true);
      var ParamsBuilder = new Stamplay.Cobject('cobjectId').Collection.populateOwner();
      assert.equal(ParamsBuilder.populateOwner().currentQuery.populateOwner, true);

    })

    test('has fetchParams pipeline possibility', function () {

      var ParamsBuilder = new Stamplay.Cobject('tag').Collection.equalTo('a', 'b');
      assert.isObject(ParamsBuilder);
      assert.equal(ParamsBuilder.currentQuery.find.a, 'b');
      ParamsBuilder = ParamsBuilder.limit(10);
      assert.isObject(ParamsBuilder);
      assert.equal(ParamsBuilder.currentQuery.limit, 10);
      ParamsBuilder = ParamsBuilder.select('name');
      assert.isObject(ParamsBuilder);
      assert.equal(ParamsBuilder.currentQuery.select, 'name');
      ParamsBuilder = ParamsBuilder.equalTo('name', 'pippo');
      assert.isObject(ParamsBuilder);
      assert.equal(ParamsBuilder.currentQuery.find.name, 'pippo');

    })


  });
});