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

  //For each test
  teardown('Tearing down', function () {
    if (this.xhr) {
        this.xhr.restore();
    }
  });

  test('has own functions', function(){

    assert.isObject(new Stamplay.Query())
    assert.isFunction(new Stamplay.Query().exec)
    assert.isFunction(new Stamplay.Query().equalTo)
    assert.isFunction( new Stamplay.Query().limit)
    assert.isFunction( new Stamplay.Query().select)
    assert.isFunction( new Stamplay.Query().sortAscending)  
    assert.isFunction( new Stamplay.Query().sortDescending)  

  })

  test('has the exec method', function(){

    assert.isFunction(new Stamplay.Query().exec)


    var query = new Stamplay.Query('user')
    query.equalTo('name','pippo').exec().then(function(){})
    assert.equal(this.request.url, null+'/api/user/v0/users?name=pippo');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, '{ "_id": 123, "name": "Pippo" }');

    var query = new Stamplay.Query('user')
    query.equalTo('name','pippo').limit(5).sortAscending('name').exec().then(function(){})
    assert.equal(this.request.url, null+'/api/user/v0/users?name=pippo&n=5&sort=name');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, '{ "_id": 123, "name": "Pippo" }');

    var query = new Stamplay.Query('user')
    query.equalTo('name','pippo').select(['description','name','surname']).sortAscending('name').exec().then(function(){})
    assert.equal(this.request.url, null+'/api/user/v0/users?name=pippo&select=description,name,surname&sort=name');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, '{ "_id": 123, "name": "Pippo", "surname":"paperino", "description":"cartoon"}');

    var query = new Stamplay.Query('cobject','tag')
    query.equalTo('description','pippo').sortAscending('name').limit(5).exec().then(function(){})
    assert.equal(this.request.url, null+'/api/cobject/v0/tag?description=pippo&sort=name&n=5');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, '{ "_id": 123, "description": "Pippo" }');

  })

  test('has the equalTo method', function(){

    assert.isFunction(new Stamplay.Query().equalTo)
    assert.isObject(new Stamplay.Query().equalTo('a','b'))
    assert.equal(new Stamplay.Query().equalTo('a','b').currentQuery.find.a,'b')
    assert.equal(new Stamplay.Query().equalTo('b','b').currentQuery.find.a, undefined)
    var query = new Stamplay.Query().equalTo('a','b')
    assert.equal(Object.keys(query.equalTo('b','c').currentQuery.find).length,2)
    assert.equal(query.currentQuery.find.b, 'c')
    assert.equal(new Stamplay.Query().equalTo({a:'a',b:'b'}).currentQuery.find.a, 'a')

  })

  test('has the limit method', function(){

    assert.isFunction(new Stamplay.Query().limit)
    assert.isObject(new Stamplay.Query().limit(10))
    assert.equal(new Stamplay.Query().limit(20).currentQuery.limit,20)
    var query = new Stamplay.Query().limit(30)
    assert.equal(query.limit(40).currentQuery.limit,40)
    
  })

  test('has the select method', function(){

    assert.isFunction(new Stamplay.Query().select)
    assert.isObject(new Stamplay.Query().select('a'))
    assert.equal(new Stamplay.Query().select('a').currentQuery.select[0],'a')
    assert.equal(new Stamplay.Query().select('b').currentQuery.select[1], undefined)
    var query = new Stamplay.Query().select('a')
    assert.equal(query.select('b').currentQuery.select.length,2)
    assert.equal(new Stamplay.Query().select(['a','b']).currentQuery.select.length, 2)

  })

  test('has the sortAscending method', function(){

    assert.isFunction(new Stamplay.Query().sortAscending)
    assert.isObject(new Stamplay.Query().sortAscending('a'))
    assert.equal(new Stamplay.Query().sortAscending('a').currentQuery.sort,'a')
    var query = new Stamplay.Query().sortAscending('b')
    assert.equal(query.sortAscending('c').currentQuery.sort,'c')
    
  })

  test('has the sortDescending method', function(){

    assert.isFunction(new Stamplay.Query().sortDescending)
    assert.isObject(new Stamplay.Query().sortDescending('a'))
    assert.equal(new Stamplay.Query().sortDescending('a').currentQuery.sort,'-a')
    var query = new Stamplay.Query().sortDescending('b')
    assert.equal(query.sortDescending('c').currentQuery.sort,'-c')
    
  })


  test('has query pipeline possibility', function(){

    var query = new Stamplay.Query('cobject','tag').equalTo('a','b')
    assert.isObject(query)
    assert.equal(query.currentQuery.find.a, 'b')
    query = query.limit(10)
    assert.isObject(query)
    assert.equal(query.currentQuery.limit,10)
    query = query.select('name')
    assert.isObject(query)
    assert.equal(query.currentQuery.select,'name')
    query = query.equalTo('name','pippo')
    assert.isObject(query)
    assert.equal(query.currentQuery.find.name, 'pippo')

  })

});


