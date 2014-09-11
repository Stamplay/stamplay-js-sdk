suite('Stamplay Cobject Model ', function () {

  var cinstance;
  var object_value = {
    p1: 'test'
  };
  var array_value = [1, 2, 3, 4];

  //For each test
  setup('Creating a new Cobject model', function () {

    cinstance = new Stamplay.Cobject('cobjectId').Model;
    cinstance.instance.number_property = 5;
    cinstance.instance.string_property = 'a_string';
    cinstance.instance.object_property = object_value;
    cinstance.instance.array_property = array_value;

    this.xhr = sinon.useFakeXMLHttpRequest();
    this.request;
    _this = this;
    this.xhr.onCreate = function (xhr) {
      _this.request = xhr;
    };

  });


  test('fetch method', function (done) {

    var newCinstance = new Stamplay.Cobject('cobjectId').Model;

    newCinstance.fetch("123").then(function () {
      assert.equal(newCinstance.get('_id'), 123);
      assert.equal(newCinstance.get('comment'), 'Hey there');
      done();
    });

    assert.equal(this.request.url, '/api/cobject/v0/cobjectId/123');


    this.request.respond(200, {
      "Content-Type": "application/json"
    }, '{ "_id": 123, "comment": "Hey there" }');

  });

  //For each test
  teardown('Tearing down', function () {
    if (this.xhr) {
      this.xhr.restore();
    }
  })

  test('has the constructor method', function () {
    assert.isFunction(cinstance.constructor, 'constructor method exists');
  });

  test('has the set method', function () {
    assert.isFunction(cinstance.set, 'set method exists');
  });

  test('has the get method', function () {
    assert.isFunction(cinstance.get, 'get method exists');
  });

  test('has the unset method', function () {
    assert.isFunction(cinstance.unset, 'unset method exists');

  });

  test('has the fetch method', function () {
    assert.isFunction(cinstance.fetch, 'fetch method exists');
  });

  test('has the save method', function () {
    assert.isFunction(cinstance.save, 'save method exists');
  });

  test('has the destroy method', function () {
    assert.isFunction(cinstance.destroy, 'destroy method exists');
  });


  test('has the rate method', function () {
    assert.isFunction(cinstance.rate, 'rate method exists');
  });

  test('has the upvote method', function () {
    assert.isFunction(cinstance.upVote, 'upvote method exists');
  });

  test('has the downvote method', function () {
    assert.isFunction(cinstance.downVote, 'downvote method exists');
  });

  test('has the facebookShare method', function () {
    assert.isFunction(cinstance.facebookShare, 'facebookShare method exists');
  });

  test('has the twitterShare method', function () {
    assert.isFunction(cinstance.twitterShare, 'twitterShare method exists');
  });

  test('has the comment method', function () {
    assert.isFunction(cinstance.comment, 'comment method exists');
  });

  test('has the instance property which is an object', function () {
    assert.isObject(cinstance.instance, 'instance property is an object')
  });

  test('constructor method', function () {
    var newObject = {
      first: 1,
      second: 2,
      nested_object: {
        first_nested: 1,
        second_nested: 2,
        third_array: [1, 2, 3]
      },
      a_string: 'a string'
    };
    var newCinstance = new Stamplay.Cobject('cobjectId').Model;
    newCinstance.constructor(newObject);

    assert.deepEqual(newCinstance.instance, newObject);

    newCinstance.instance = {};

    newObject = {
      first: {
        nested_first: undefined
      }
    }
    newCinstance.constructor(newObject);

    assert.deepEqual(newCinstance.instance, newObject);

  });

  test('get method', function () {

    assert.equal(cinstance.get('number_property'), 5);
    assert.equal(cinstance.get('string_property'), 'a_string');
    assert.deepEqual(cinstance.get('object_property'), object_value);
    assert.deepEqual(cinstance.get('array_property'), array_value);

  });

  test('set method', function () {

    cinstance.set('number_property', 2);
    assert.equal(cinstance.instance.number_property, 2);

    cinstance.set('string_property', 'string');
    assert.equal(cinstance.instance.string_property, 'string');

    var new_object_value = {
      p2: 'test'
    };
    cinstance.set('object_property', new_object_value);
    assert.deepEqual(cinstance.instance.object_property, new_object_value);

    var new_array_value = ['a', 'b', 'c'];
    cinstance.set('array_property', new_object_value);
    assert.deepEqual(cinstance.instance.array_property, new_object_value);

  });

  test('unset method', function () {

    cinstance.unset('number_property');
    assert.isUndefined(cinstance.instance.number_property, 'After unset number_property doesn\'t exists');

    cinstance.unset('string_property');
    assert.isUndefined(cinstance.instance.string_property, 'After unset string_property doesn\'t exists');

    cinstance.unset('object_property');
    assert.isUndefined(cinstance.instance.object_property, 'After unset object_property doesn\'t exists');

    cinstance.unset('array_property');
    assert.isUndefined(cinstance.instance.array_property, 'After unset array_property doesn\'t exists');

  });


  test('save method POST', function (done) {

    cinstance.save().then(function () {
      assert.equal(cinstance.get('_id'), 123);
      done();
    });

    cinstance.set('_id', 123);

    assert.equal(this.request.method, 'POST');
    assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
    assert.equal(this.request.url, '/api/cobject/v0/cobjectId');


    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify(cinstance.instance));

  });

  test('save method PUT', function (done) {

    var oldInstance = new Stamplay.Cobject('cobjectId').Model;
    oldInstance.set('_id', 1);

    oldInstance.save().then(function () {
      assert.equal(oldInstance.get('_id'), 1);
      done();
    });


    assert.equal(this.request.method, 'PUT');
    assert.equal(this.request.requestBody, JSON.stringify(oldInstance.instance));
    assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
    assert.equal(this.request.url, '/api/cobject/v0/cobjectId/1');


    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify({
      _id: 1
    }));

  });

  test('save method PATCH', function (done) {

    var oldInstance = new Stamplay.Cobject('cobjectId').Model;
    oldInstance.set('_id', 1);


    oldInstance.save({
      patch: true
    }).then(function () {
      assert.equal(oldInstance.get('_id'), 1);
      done();
    });


    assert.equal(this.request.method, 'PATCH');
    assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
    assert.equal(this.request.url, '/api/cobject/v0/cobjectId/1');

    //Patch should send only changed attributes but right now PATCH = PUT
    assert.equal(this.request.requestBody, JSON.stringify(oldInstance.instance));

    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify({
      _id: 1
    }));

  })

  test('destroy method', function (done) {
    cinstance.set('_id', 1);
    cinstance.destroy().then(function () {

      var newCinstance = new Stamplay.Cobject('cobjectId').Model;
      var unableToDestroy = newCinstance.destroy();
      assert.isFalse(unableToDestroy, 'A non saved instance shouldn\'t make the ajax call');

      done();
    });


    assert.equal(this.request.method, 'DELETE');
    assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
    assert.equal(this.request.url, '/api/cobject/v0/cobjectId/1');

    assert.isUndefined(this.request.requestBody);

    this.request.respond(200, {
      "Content-Type": "application/json"
    }, '{}');

  });

  test.only('upVote method', function (done) {
    cinstance.instance._id = '123';
    cinstance.instance.actions = {
      votes: {
        total: 0,
        users: [],
        users_upvote: [],
        users_downvote: []
      }
    };

    cinstance.upVote().then(function () {
      console.log( cinstance.get('actions') )
      
      assert.equal(cinstance.get('actions').votes.total, 1);
      assert.equal(cinstance.get('actions').votes.users[0], 'userId');
      assert.equal(cinstance.get('actions').votes.users_upvote[0], 'userId');
      done();
    });

    cinstance.instance.actions.votes.total++;
    cinstance.instance.actions.votes.users.push('userId')
    cinstance.instance.actions.votes.users_upvote.push('userId')


    assert.equal(this.request.method, 'PUT');
    assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
    assert.equal(this.request.requestBody, JSON.stringify({type: 'upvote'}));
    assert.equal(this.request.url, '/api/cobject/v0/cobjectId/' + cinstance.get('_id') + '/vote');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify(cinstance));
  });

  test('downVote method', function (done) {
    cinstance.instance._id = '123';
    cinstance.instance.actions = {
      votes: {
        total: 0,
        users: [],
        users_upvote: [],
        users_downvote: []
      }
    };

    cinstance.downVote().then(function () {
      assert.equal(cinstance.get('actions').votes.total, 1);
      assert.equal(cinstance.get('actions').votes.users[0], 'userId');
      assert.equal(cinstance.get('actions').votes.users_downvote[0], 'userId');
      done();
    });

    cinstance.instance.actions.votes.total++;
    cinstance.instance.actions.votes.users.push('userId')
    cinstance.instance.actions.votes.users_downvote.push('userId')


    assert.equal(this.request.method, 'PUT');
    assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
    assert.equal(this.request.requestBody, JSON.stringify({type: 'downvote'}));
    assert.equal(this.request.url, '/api/cobject/v0/cobjectId/' + cinstance.get('_id') + '/vote');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify(cinstance));
  });


  test('rate method', function (done) {
    cinstance.instance._id = '123';
    cinstance.instance.actions = {
      ratings: {
        total: 0,
        avg: 0,
        users: []
      }
    };

    cinstance.rate(1).then(function () {
      assert.equal(cinstance.get('actions').ratings.total, 1);
      assert.equal(cinstance.get('actions').ratings.avg, 1);
      assert.equal(cinstance.get('actions').ratings.users[0], 'userId');
      done();
    });

    cinstance.instance.actions.ratings.total++;
    cinstance.instance.actions.ratings.avg++;
    cinstance.instance.actions.ratings.users.push('userId');

    assert.equal(this.request.method, 'PUT');
    assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
    assert.equal(this.request.requestBody, JSON.stringify({
      rate: 1
    }));

    assert.equal(this.request.url, '/api/cobject/v0/cobjectId/' + cinstance.get('_id') + '/rate');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify(cinstance));
  });

  test('Rate method throws an error if a type different from integer is passed to rate', function () {
    var spy = sinon.spy(cinstance, "rate");
    try {
      cinstance.rate('a');
    } catch (err) {
      assert.isTrue(spy.threw());
    }
  });

  test('Comment method', function (done) {
    cinstance.instance.actions = {
      comments: []
    };


    var text = 'My comment';
    var data = {
      text: text
    }
    cinstance.comment(text).then(function () {
      assert.equal(cinstance.get('actions').comments.length, 1);
      done();
    });

    cinstance.instance.actions = {
      comments: [{
        displayName: 'Display Name',
        text: text
      }]
    };

    assert.equal(this.request.method, 'PUT');
    assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
    assert.equal(this.request.url, '/api/cobject/v0/cobjectId/' + cinstance.get('_id') + '/comment');
    assert.equal(this.request.requestBody, JSON.stringify(data));

    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify(cinstance));
  });

  test('twitterShare method', function (done) {
    cinstance.instance._id = '123';
    cinstance.instance.actions = {
      twitter_shares: {
        total: 0,
        users: []
      }
    };

    cinstance.twitterShare().then(function () {
      assert.equal(cinstance.get('actions').twitter_shares.total, 1);
      assert.equal(cinstance.get('actions').twitter_shares.users[0], 'userId');
      done();
    });

    cinstance.instance.actions.twitter_shares.total++;
    cinstance.instance.actions.twitter_shares.users.push('userId');

    assert.equal(this.request.method, 'PUT');
    assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
    assert.equal(this.request.url, '/api/cobject/v0/cobjectId/' + cinstance.get('_id') + '/twitter_share');

    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify(cinstance));

  });

  test('facebookShare', function (done) {
    cinstance.instance._id = '123';
    cinstance.instance.actions = {
      facebook_shares: {
        total: 0,
        users: []
      }
    };

    cinstance.facebookShare().then(function () {
      assert.equal(cinstance.get('actions').facebook_shares.total, 1);
      assert.equal(cinstance.get('actions').facebook_shares.users[0], 'userId');
      done();
    });

    cinstance.instance.actions.facebook_shares.total++;
    cinstance.instance.actions.facebook_shares.users.push('userId');

    assert.equal(this.request.method, 'PUT');
    assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
    assert.equal(this.request.url, '/api/cobject/v0/cobjectId/' + cinstance.get('_id') + '/facebook_share');

    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify(cinstance));
  })


});