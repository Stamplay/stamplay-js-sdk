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

  test('has gte method', function(){
    var query = new Stamplay.Query('cobject','tag').greaterThanOrEqual('a',1)
    assert.isObject(query.currentQuery[0].a)
    assert.equal(query.currentQuery[0].a.$gte, 1)
  })

  test('has gt method', function(){
    var query = new Stamplay.Query('cobject','tag').greaterThan('a',2)
    assert.isObject(query.currentQuery[0].a)
    assert.equal(query.currentQuery[0].a.$gt, 2)
  })

  test('has lt method', function(){
    var query = new Stamplay.Query('cobject','tag').lessThan('a',1)
    assert.isObject(query.currentQuery[0].a)
    assert.equal(query.currentQuery[0].a.$lt, 1)
  })

  test('has lte method', function(){
    var query = new Stamplay.Query('cobject','tag').lessThanOrEqual('b',3)
    assert.isObject(query.currentQuery[0].b)
    assert.equal(query.currentQuery[0].b.$lte, 3)
  })

  test('has equalTo method', function(){
    var query = new Stamplay.Query('cobject','tag').equalTo('b','b')
    assert.isObject(query.currentQuery[0])
    assert.equal(query.currentQuery[0].b , 'b')
  })

  test('has exists method', function(){
    var query = new Stamplay.Query('cobject','tag').exists('b')
    assert.isObject(query.currentQuery[0].b)
    assert.equal(query.currentQuery[0].b.$exists, true)
  })

  test('has notExists method', function(){
    var query = new Stamplay.Query('cobject','tag').notExists('b')
    assert.isObject(query.currentQuery[0].b)
    assert.equal(query.currentQuery[0].b.$exists, false)
  })

  test('has or method', function(){
    var a = new Stamplay.Query('cobject','tag').notExists('b')
    var b = new Stamplay.Query('cobject','tag').equalTo('c','c')
    var query = new Stamplay.Query('cobject','tag').or(a,b)
    assert.isArray(query.currentQuery[0].$or)
    assert.equal(query.currentQuery[0].$or[0].b.$exists, false)
    assert.equal(query.currentQuery[0].$or[1].c, 'c')
  })


  test('has exec method', function(){
    assert.isFunction(new Stamplay.Query('cobject','tag').exec)    
  })

  test('exec() equal works', function(){
    var query = new Stamplay.Query('cobject','tag').equalTo('pippo','pippo')
    query.exec().then(function(){})
    assert.equal(this.request.url, '/api/cobject/v0/tag?where={"pippo":"pippo"}');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, '{}');
  })

  test('exec() gte works', function(){
    var query = new Stamplay.Query('cobject','tag').greaterThanOrEqual('a',4)
    query.exec().then(function(){})
    assert.equal(this.request.url, '/api/cobject/v0/tag?where={"a":{"$gte":4}}');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, '{}');
  })

  test('exec() lte works', function(){
    var query = new Stamplay.Query('cobject','tag').lessThanOrEqual('a',2)
    query.exec().then(function(){})
    assert.equal(this.request.url, '/api/cobject/v0/tag?where={"a":{"$lte":2}}');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, '{}');
  })

  test('exec() $exists works', function(){
    var query = new Stamplay.Query('cobject','tag').exists('pippo')
    query.exec().then(function(){})
    assert.equal(this.request.url, '/api/cobject/v0/tag?where={"pippo":{"$exists":true}}');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, '{}');
  })

  test('exec() $or works', function(){
    var query1 = new Stamplay.Query('cobject','tag').notExists('b')
    var query2 = new Stamplay.Query('cobject','tag').equalTo('c','c')
    var query = new Stamplay.Query('cobject','tag').or(query1, query2)
    query.exec().then(function(){})
    assert.equal(this.request.url, '/api/cobject/v0/tag?where={"$or":[{"b":{"$exists":false}},{"c":"c"}]}');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, '{}');
  })

})

suite('Stamplay paramsBuilder ', function () {


  test('has own functions', function(){

    assert.isObject(new Stamplay.ParamsBuilder())
    assert.isFunction(new Stamplay.ParamsBuilder().equalTo)
    assert.isFunction( new Stamplay.ParamsBuilder().limit)
    assert.isFunction( new Stamplay.ParamsBuilder().select)
    assert.isFunction( new Stamplay.ParamsBuilder().sortAscending)  
    assert.isFunction( new Stamplay.ParamsBuilder().sortDescending)  

  })

  test('has the compile method', function(){

    assert.isFunction(new Stamplay.ParamsBuilder().compile)
    var ParamsBuilder = new Stamplay.ParamsBuilder().equalTo('name','pippo').compile()
    assert.equal(ParamsBuilder.name, 'pippo')
    var ParamsBuilder = new Stamplay.ParamsBuilder().equalTo('name','pippo').limit(5).sortAscending('name').compile()
    assert.equal(ParamsBuilder.name, 'pippo')
    assert.equal(ParamsBuilder.n, 5)
    assert.equal(ParamsBuilder.sort, 'name')

  })

  test('has the equalTo method', function(){

    assert.isFunction(new Stamplay.ParamsBuilder().equalTo)
    assert.isObject(new Stamplay.ParamsBuilder().equalTo('a','b'))
    assert.equal(new Stamplay.ParamsBuilder().equalTo('a','b').currentQuery.find.a,'b')
    assert.equal(new Stamplay.ParamsBuilder().equalTo('b','b').currentQuery.find.a, undefined)
    var ParamsBuilder = new Stamplay.ParamsBuilder().equalTo('a','b')
    assert.equal(Object.keys(ParamsBuilder.equalTo('b','c').currentQuery.find).length,2)
    assert.equal(ParamsBuilder.currentQuery.find.b, 'c')
    assert.equal(new Stamplay.ParamsBuilder().equalTo({a:'a',b:'b'}).currentQuery.find.a, 'a')

  })

  test('has the limit method', function(){

    assert.isFunction(new Stamplay.ParamsBuilder().limit)
    assert.isObject(new Stamplay.ParamsBuilder().limit(10))
    assert.equal(new Stamplay.ParamsBuilder().limit(20).currentQuery.limit,20)
    var ParamsBuilder = new Stamplay.ParamsBuilder().limit(30)
    assert.equal(ParamsBuilder.limit(40).currentQuery.limit,40)
    
  })

  test('has the select method', function(){

    assert.isFunction(new Stamplay.ParamsBuilder().select)
    assert.isObject(new Stamplay.ParamsBuilder().select('a'))
    assert.equal(new Stamplay.ParamsBuilder().select('a').currentQuery.select[0],'a')
    assert.equal(new Stamplay.ParamsBuilder().select('b').currentQuery.select[1], undefined)
    var ParamsBuilder = new Stamplay.ParamsBuilder().select('a')
    assert.equal(ParamsBuilder.select('b').currentQuery.select.length,2)
    assert.equal(new Stamplay.ParamsBuilder().select(['a','b']).currentQuery.select.length, 2)

  })

  test('has the sortAscending method', function(){

    assert.isFunction(new Stamplay.ParamsBuilder().sortAscending)
    assert.isObject(new Stamplay.ParamsBuilder().sortAscending('a'))
    assert.equal(new Stamplay.ParamsBuilder().sortAscending('a').currentQuery.sort,'a')
    var ParamsBuilder = new Stamplay.ParamsBuilder().sortAscending('b')
    assert.equal(ParamsBuilder.sortAscending('c').currentQuery.sort,'c')
    
  })

  test('has the sortDescending method', function(){

    assert.isFunction(new Stamplay.ParamsBuilder().sortDescending)
    assert.isObject(new Stamplay.ParamsBuilder().sortDescending('a'))
    assert.equal(new Stamplay.ParamsBuilder().sortDescending('a').currentQuery.sort,'-a')
    var ParamsBuilder = new Stamplay.ParamsBuilder().sortDescending('b')
    assert.equal(ParamsBuilder.sortDescending('c').currentQuery.sort,'-c')
    
  })

  test('has ParamsBuilder pipeline possibility', function(){

    var ParamsBuilder = new Stamplay.ParamsBuilder('cobject','tag').equalTo('a','b')
    assert.isObject(ParamsBuilder)
    assert.equal(ParamsBuilder.currentQuery.find.a, 'b')
    ParamsBuilder = ParamsBuilder.limit(10)
    assert.isObject(ParamsBuilder)
    assert.equal(ParamsBuilder.currentQuery.limit,10)
    ParamsBuilder = ParamsBuilder.select('name')
    assert.isObject(ParamsBuilder)
    assert.equal(ParamsBuilder.currentQuery.select,'name')
    ParamsBuilder = ParamsBuilder.equalTo('name','pippo')
    assert.isObject(ParamsBuilder)
    assert.equal(ParamsBuilder.currentQuery.find.name, 'pippo')

  })

});





