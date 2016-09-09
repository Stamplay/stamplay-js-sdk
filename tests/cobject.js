/* globals suite,Stamplay,setup,sinon,teardown,test,assert,_ */
suite('Cobject ', function () {

  var stamplayUrl = 'https://stamplay.stamplayapp.com'

  var instance;
  var object_value = {
    p1: 'test',
  };
  var array_value = [1, 2, 3, 4];
  //For each test
  setup('Creating a new Cobject model', function () {
    cinstance = Stamplay.Object('cobjectId');
    instance = {}
    instance.number_property = 5;
    instance.string_property = 'a_string';
    instance.object_property = object_value;
    instance.array_property = array_value;
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

  test('has the cobject custom methods', function () {
    assert.isFunction(cinstance.findByCurrentUser, 'findByCurrentUser status exists');
    assert.isFunction(cinstance.upVote, 'upVote status exists');
    assert.isFunction(cinstance.downVote, 'downVote status exists');
    assert.isFunction(cinstance.rate, 'rate status exists');
    assert.isFunction(cinstance.comment, 'comment status exists');
    assert.isFunction(cinstance.get, 'get method exists');
    assert.isFunction(cinstance.getById, 'getById method exists');
    assert.isFunction(cinstance.save, 'save method exists');
    assert.isFunction(cinstance.update, 'update method exists');
    assert.isFunction(cinstance.remove, 'remove method exists');
    assert.isFunction(cinstance.push, 'push method exists');
  });

  test('get method (callback)', function (done) {
    var newCinstance = Stamplay.Object('cobjectId');
    newCinstance.get({}, function (err, resp) {
      assert.equal(resp._id, 123);
      assert.equal(resp.comment, 'Hey there');
      done();
    })
    assert.equal(this.request.url, stamplayUrl + '/api/cobject/' + Stamplay.VERSION +
      '/cobjectId');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, '{ "_id": 123, "comment": "Hey there" }');
  });

  test('get method (promise)', function (done) {
    var newCinstance = Stamplay.Object('cobjectId');
    newCinstance.get({}).then(function (resp) {
      assert.equal(resp._id, 123);
      assert.equal(resp.comment, 'Hey there');
      done();
    }, function () {})
    assert.equal(this.request.url, stamplayUrl + '/api/cobject/' + Stamplay.VERSION +
      '/cobjectId');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, '{ "_id": 123, "comment": "Hey there" }');
  });

  test('getById method (callback)', function (done) {
    var newCinstance = Stamplay.Object('cobjectId');
    newCinstance.getById(123, {}, function (err, resp) {
      assert.equal(resp._id, 123);
      assert.equal(resp.comment, 'Hey there');
      done();
    })
    assert.equal(this.request.url, stamplayUrl + '/api/cobject/' + Stamplay.VERSION +
      '/cobjectId/123');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, '{ "_id": 123, "comment": "Hey there" }');
  });

  test('getById method (promise)', function (done) {
    var newCinstance = Stamplay.Object('cobjectId');
    newCinstance.getById(123, {}).then(function (resp) {
      assert.equal(resp._id, 123);
      assert.equal(resp.comment, 'Hey there');
      done();
    }, function () {})
    assert.equal(this.request.url, stamplayUrl + '/api/cobject/' + Stamplay.VERSION +
      '/cobjectId/123');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, '{ "_id": 123, "comment": "Hey there" }');
  });

  test('save method (callback)', function (done) {
    cinstance.save(instance, function (err, resp) {
      assert.equal(resp._id, 123);
      done()
    })
    instance._id = 123;
    assert.equal(this.request.method, 'POST');
    assert.equal(this.request.requestHeaders['Content-Type'],
      "application/json;charset=utf-8");
    assert.equal(this.request.url, stamplayUrl + '/api/cobject/' + Stamplay.VERSION +
      '/cobjectId');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify(instance));
  });

  test('save method (promise)', function (done) {
    cinstance.save(instance).then(function (resp) {
      assert.equal(resp._id, 123);
      done()
    })
    instance._id = 123;
    assert.equal(this.request.method, 'POST');
    assert.equal(this.request.requestHeaders['Content-Type'],
      "application/json;charset=utf-8");
    assert.equal(this.request.url, stamplayUrl + '/api/cobject/' + Stamplay.VERSION +
      '/cobjectId');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify(instance));
  });

  test('update method (callback)', function (done) {
    var id = 123
    cinstance.update(id, instance, function (err, resp) {
      assert.equal(resp._id, 123);
      done()
    })
    assert.equal(this.request.method, 'PUT');
    assert.equal(this.request.requestBody, JSON.stringify(instance));
    assert.equal(this.request.requestHeaders['Content-Type'],
      "application/json;charset=utf-8");
    assert.equal(this.request.url, stamplayUrl + '/api/cobject/' + Stamplay.VERSION +
      '/cobjectId/123');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify({
      _id: 123
    }));
  });

  test('update method (promise)', function (done) {
    var id = 123
    cinstance.update(id, instance).then(function (resp) {
      assert.equal(resp._id, 123);
      done()
    })
    assert.equal(this.request.method, 'PUT');
    assert.equal(this.request.requestBody, JSON.stringify(instance));
    assert.equal(this.request.requestHeaders['Content-Type'],
      "application/json;charset=utf-8");
    assert.equal(this.request.url, stamplayUrl + '/api/cobject/' + Stamplay.VERSION +
      '/cobjectId/123');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify({
      _id: 123
    }));
  });

  test('patch method (callback)', function (done) {
    var id = 123
    cinstance.patch(id, instance, function (err, resp) {
      assert.equal(resp._id, 123);
      done()
    })
    assert.equal(this.request.method, 'PATCH');
    assert.equal(this.request.requestBody, JSON.stringify(instance));
    assert.equal(this.request.requestHeaders['Content-Type'],
      "application/json;charset=utf-8");
    assert.equal(this.request.url, stamplayUrl + '/api/cobject/' + Stamplay.VERSION +
      '/cobjectId/123');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify({
      _id: 123
    }));
  });

  test('patch method (promise)', function (done) {
    var id = 123
    cinstance.patch(id, instance).then(function (resp) {
      assert.equal(resp._id, 123);
      done()
    })
    assert.equal(this.request.method, 'PATCH');
    assert.equal(this.request.requestBody, JSON.stringify(instance));
    assert.equal(this.request.requestHeaders['Content-Type'],
      "application/json;charset=utf-8");
    assert.equal(this.request.url, stamplayUrl + '/api/cobject/' + Stamplay.VERSION +
      '/cobjectId/123');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify({
      _id: 123
    }));
  });

  test('remove method (callback)', function (done) {
    cinstance.remove(123, function (err, result) {
      done();
    })
    assert.equal(this.request.method, 'DELETE');
    assert.equal(this.request.requestHeaders['Content-Type'],
      "application/json;charset=utf-8");
    assert.equal(this.request.url, stamplayUrl + '/api/cobject/' + Stamplay.VERSION +
      '/cobjectId/123');
    assert.isUndefined(this.request.requestBody);
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, '{}');
  });

  test('remove method (promise)', function (done) {
    cinstance.remove(123).then(function (result) {
      done();
    })
    assert.equal(this.request.method, 'DELETE');
    assert.equal(this.request.requestHeaders['Content-Type'],
      "application/json;charset=utf-8");
    assert.equal(this.request.url, stamplayUrl + '/api/cobject/' + Stamplay.VERSION +
      '/cobjectId/123');
    assert.isUndefined(this.request.requestBody);
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, '{}');
  });

  test('upVote method (callback)', function (done) {

    instance.actions = {
      votes: {
        total: 0,
        users: [],
        users_upvote: [],
        users_downvote: []
      }
    };

    cinstance.upVote('123456789012345678901234', function (err, resp) {
      assert.equal(resp.actions.votes.total, 1);
      assert.equal(resp.actions.votes.users[0], 'userId');
      assert.equal(resp.actions.votes.users_upvote[0], 'userId');
      done();
    })

    instance.actions.votes.total++;
    instance.actions.votes.users.push('userId');
    instance.actions.votes.users_upvote.push('userId');

    assert.equal(this.request.method, 'PUT');
    assert.equal(this.request.requestHeaders['Content-Type'],
      "application/json;charset=utf-8");
    assert.equal(this.request.requestBody, JSON.stringify({
      type: 'upvote'
    }));
    assert.equal(this.request.url, stamplayUrl + '/api/cobject/' + Stamplay.VERSION +
      '/cobjectId/123456789012345678901234/vote');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify(instance));
  });

  test('upVote method (promise)', function (done) {

    instance.actions = {
      votes: {
        total: 0,
        users: [],
        users_upvote: [],
        users_downvote: []
      }
    };

    cinstance.upVote('123456789012345678901234').then(function (resp) {
      assert.equal(resp.actions.votes.total, 1);
      assert.equal(resp.actions.votes.users[0], 'userId');
      assert.equal(resp.actions.votes.users_upvote[0], 'userId');
      done();
    })

    instance.actions.votes.total++;
    instance.actions.votes.users.push('userId');
    instance.actions.votes.users_upvote.push('userId');

    assert.equal(this.request.method, 'PUT');
    assert.equal(this.request.requestHeaders['Content-Type'],
      "application/json;charset=utf-8");
    assert.equal(this.request.requestBody, JSON.stringify({
      type: 'upvote'
    }));
    assert.equal(this.request.url, stamplayUrl + '/api/cobject/' + Stamplay.VERSION +
      '/cobjectId/123456789012345678901234/vote');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify(instance));
  });

  test('downVote method (callback)', function (done) {
    instance.actions = {
      votes: {
        total: 0,
        users: [],
        users_upvote: [],
        users_downvote: []
      }
    };

    cinstance.downVote('123456789012345678901234', function (err, resp) {
      assert.equal(resp.actions.votes.total, 1);
      assert.equal(resp.actions.votes.users[0], 'userId');
      assert.equal(resp.actions.votes.users_downvote[0], 'userId');
      done();
    })

    instance.actions.votes.total++;
    instance.actions.votes.users.push('userId');
    instance.actions.votes.users_downvote.push('userId');

    assert.equal(this.request.method, 'PUT');
    assert.equal(this.request.requestHeaders['Content-Type'],
      "application/json;charset=utf-8");
    assert.equal(this.request.requestBody, JSON.stringify({
      type: 'downvote'
    }));
    assert.equal(this.request.url, stamplayUrl + '/api/cobject/' + Stamplay.VERSION +
      '/cobjectId/123456789012345678901234/vote');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify(instance));
  });

  test('downVote method (promise)', function (done) {
    instance.actions = {
      votes: {
        total: 0,
        users: [],
        users_upvote: [],
        users_downvote: []
      }
    };

    cinstance.downVote('123456789012345678901234').then(function (resp) {
      assert.equal(resp.actions.votes.total, 1);
      assert.equal(resp.actions.votes.users[0], 'userId');
      assert.equal(resp.actions.votes.users_downvote[0], 'userId');
      done();
    })

    instance.actions.votes.total++;
    instance.actions.votes.users.push('userId');
    instance.actions.votes.users_downvote.push('userId');

    assert.equal(this.request.method, 'PUT');
    assert.equal(this.request.requestHeaders['Content-Type'],
      "application/json;charset=utf-8");
    assert.equal(this.request.requestBody, JSON.stringify({
      type: 'downvote'
    }));
    assert.equal(this.request.url, stamplayUrl + '/api/cobject/' + Stamplay.VERSION +
      '/cobjectId/123456789012345678901234/vote');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify(instance));
  });

  test('rate method (callback)', function (done) {
    instance.actions = {
      ratings: {
        total: 0,
        avg: 0,
        users: []
      }
    };

    cinstance.rate('123456789012345678901234', 1, function (err, resp) {
      assert.equal(resp.actions.ratings.total, 1);
      assert.equal(resp.actions.ratings.avg, 1);
      assert.equal(resp.actions.ratings.users[0], 'userId');
      done();
    })

    instance.actions.ratings.total++;
    instance.actions.ratings.avg++;
    instance.actions.ratings.users.push('userId');

    assert.equal(this.request.method, 'PUT');
    assert.equal(this.request.requestHeaders['Content-Type'],
      "application/json;charset=utf-8");
    assert.equal(this.request.requestBody, JSON.stringify({
      rate: 1
    }));
    assert.equal(this.request.url, stamplayUrl + '/api/cobject/' + Stamplay.VERSION +
      '/cobjectId/123456789012345678901234/rate');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify(instance));
  });

  test('rate method (promise)', function (done) {
    instance.actions = {
      ratings: {
        total: 0,
        avg: 0,
        users: []
      }
    };

    cinstance.rate('123456789012345678901234', 1).then(function (resp) {
      assert.equal(resp.actions.ratings.total, 1);
      assert.equal(resp.actions.ratings.avg, 1);
      assert.equal(resp.actions.ratings.users[0], 'userId');
      done();
    })

    instance.actions.ratings.total++;
    instance.actions.ratings.avg++;
    instance.actions.ratings.users.push('userId');

    assert.equal(this.request.method, 'PUT');
    assert.equal(this.request.requestHeaders['Content-Type'],
      "application/json;charset=utf-8");
    assert.equal(this.request.requestBody, JSON.stringify({
      rate: 1
    }));
    assert.equal(this.request.url, stamplayUrl + '/api/cobject/' + Stamplay.VERSION +
      '/cobjectId/123456789012345678901234/rate');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify(instance));
  });

  test('Comment method (callback)', function (done) {
    instance.actions = {
      comments: []
    };
    var text = 'My comment';
    var data = {
      text: text
    };

    cinstance.comment('123456789012345678901234', text, function (err, resp) {
      assert.equal(resp.actions.comments.length, 1);
      done();
    })

    instance.actions = {
      comments: [{
        displayName: 'Display Name',
        text: text
      }]
    };
    assert.equal(this.request.method, 'PUT');
    assert.equal(this.request.requestHeaders['Content-Type'],
      "application/json;charset=utf-8");
    assert.equal(this.request.url, stamplayUrl + '/api/cobject/' + Stamplay.VERSION +
      '/cobjectId/123456789012345678901234/comment');
    assert.equal(this.request.requestBody, JSON.stringify(data));

    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify(instance));
  });

  test('Comment method (promise)', function (done) {
    instance.actions = {
      comments: []
    };
    var text = 'My comment';
    var data = {
      text: text
    };

    cinstance.comment('123456789012345678901234', text).then(function (resp) {
      assert.equal(resp.actions.comments.length, 1);
      done();
    })

    instance.actions = {
      comments: [{
        displayName: 'Display Name',
        text: text
      }]
    };
    assert.equal(this.request.method, 'PUT');
    assert.equal(this.request.requestHeaders['Content-Type'],
      "application/json;charset=utf-8");
    assert.equal(this.request.url, stamplayUrl + '/api/cobject/' + Stamplay.VERSION +
      '/cobjectId/123456789012345678901234/comment');
    assert.equal(this.request.requestBody, JSON.stringify(data));

    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify(instance));
  });

  test('findByCurrentUser with attr method (callback)', function (done) {
    cinstance.findByCurrentUser('pippo', function (err, response) {
      done()
    })
    assert.equal(this.request.method, 'GET');
    assert.equal(this.request.requestHeaders['Content-Type'], "application/json");
    assert.equal(this.request.url, stamplayUrl + '/api/cobject/' + Stamplay.VERSION +
      '/cobjectId/find/pippo');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify({}));
  });

  test('findByCurrentUser with attr method (promise)', function (done) {
    cinstance.findByCurrentUser('pippo').then(function (response) {
      done()
    })
    assert.equal(this.request.method, 'GET');
    assert.equal(this.request.requestHeaders['Content-Type'], "application/json");
    assert.equal(this.request.url, stamplayUrl + '/api/cobject/' + Stamplay.VERSION +
      '/cobjectId/find/pippo');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify({}));
  });

  test('findByCurrentUser with data method (callback)', function (done) {
    cinstance.findByCurrentUser({
      page: 10
    }, function (err, response) {
      done()
    })
    assert.equal(this.request.method, 'GET');
    assert.equal(this.request.requestHeaders['Content-Type'], "application/json");
    assert.equal(this.request.url, stamplayUrl + '/api/cobject/' + Stamplay.VERSION +
      '/cobjectId/find/owner?page=10');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify({}));
  });

  test('findByCurrentUser with data method (promise)', function (done) {
    cinstance.findByCurrentUser({
      page: 10
    }).then(function (response) {
      done()
    })
    assert.equal(this.request.method, 'GET');
    assert.equal(this.request.requestHeaders['Content-Type'], "application/json");
    assert.equal(this.request.url, stamplayUrl + '/api/cobject/' + Stamplay.VERSION +
      '/cobjectId/find/owner?page=10');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify({}));
  });

  test('findByCurrentUser with attr and data method (callback)', function (done) {
    cinstance.findByCurrentUser('pippo', {
      page: 10
    }, function (err, response) {
      done()
    })
    assert.equal(this.request.method, 'GET');
    assert.equal(this.request.requestHeaders['Content-Type'], "application/json");
    assert.equal(this.request.url, stamplayUrl + '/api/cobject/' + Stamplay.VERSION +
      '/cobjectId/find/pippo?page=10');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify({}));
  });

  test('findByCurrentUser with attr and data method (promise)', function (done) {
    cinstance.findByCurrentUser('pippo', {
      page: 10
    }).then(function (response) {
      done()
    })
    assert.equal(this.request.method, 'GET');
    assert.equal(this.request.requestHeaders['Content-Type'], "application/json");
    assert.equal(this.request.url, stamplayUrl + '/api/cobject/' + Stamplay.VERSION +
      '/cobjectId/find/pippo?page=10');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify({}));
  });



  test('findByCurrentUser without params method (callback)', function (done) {
    cinstance.findByCurrentUser(function (err, response) {
      done()
    })
    assert.equal(this.request.method, 'GET');
    assert.equal(this.request.requestHeaders['Content-Type'], "application/json");
    assert.equal(this.request.url, stamplayUrl + '/api/cobject/' + Stamplay.VERSION +
      '/cobjectId/find/owner');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify({}));
  });

  test('findByCurrentUser without params method (promise)', function (done) {
    cinstance.findByCurrentUser().then(function (response) {
      done()
    })
    assert.equal(this.request.method, 'GET');
    assert.equal(this.request.requestHeaders['Content-Type'], "application/json");
    assert.equal(this.request.url, stamplayUrl + '/api/cobject/' + Stamplay.VERSION +
      '/cobjectId/find/owner');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify({}));
  });

});
