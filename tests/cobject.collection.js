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

  test('has the instance property which is an array', function () {
    assert.isArray(coll_cinstance.instance, 'instance property is an array')
    assert.equal(coll_cinstance.instance.length, 2, 'instance property is an array')
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
      "Content-Type": "application/json"
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

});