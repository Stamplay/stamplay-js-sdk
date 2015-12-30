/* globals suite,Stamplay,setup,sinon,teardown,test,assert,_ */
suite('Codeblock', function () {

  var codeblock;
  var response = {
    name: 'myCodeblock',
    codeId: 'mycodeblock'
  };

  setup('Creating a new Codeblock', function () {

    codeblock = Stamplay.Codeblock('myCodeblock');
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
  // Codeblock.run()
  test('has the run method', function () {
    assert.isFunction(codeblock.run, 'run method exists');
  });

  /** POST **/
  suite('POST', function () {
    test('that run method without arguments make POST api call without body nor query params (callback)', function (done) {

      codeblock.run(null, null, function(err, response) {
          done();
        })

      assert.equal(this.request.method, 'POST');
      assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
      assert.equal(this.request.url, '/api/codeblock/' + Stamplay.VERSION + '/run/mycodeblock');
      assert.equal(this.request.body, undefined);
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(response));

    });

    test('that run method without arguments make POST api call without body nor query params (promise)', function (done) {

      codeblock.run(null, null).then(function( response) {
          done();
        })

      assert.equal(this.request.method, 'POST');
      assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
      assert.equal(this.request.url, '/api/codeblock/' + Stamplay.VERSION + '/run/mycodeblock');
      assert.equal(this.request.body, undefined);
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(response));

    });

    test('that run method with body make POST api call with body and without query params (callback)', function (done) {
      var body = { b1: 1, b2: 2}
      codeblock.run(body, null, function(err, response) {
        done();
      })

      assert.equal(this.request.method, 'POST');
      assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
      assert.equal(this.request.url, '/api/codeblock/' + Stamplay.VERSION + '/run/mycodeblock');
      assert.equal(this.request.requestBody, JSON.stringify(body));
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(response));

    });

    test('that run method with body make POST api call with body and without query params (promise)', function (done) {
      var body = { b1: 1, b2: 2}
      codeblock.run(body, null).then(function(response) {
        done();
      })

      assert.equal(this.request.method, 'POST');
      assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
      assert.equal(this.request.url, '/api/codeblock/' + Stamplay.VERSION + '/run/mycodeblock');
      assert.equal(this.request.requestBody, JSON.stringify(body));
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(response));

    });

    test('that run method with body make POST api call with body and with query params (callback)', function (done) {
      var body = {
        b1: 1,
        b2: 2
      }

      var queryParams = {
        p1: 1,
        p2: 2
      }

      codeblock.run(body, queryParams, function(err, response) {
        done();
      })
      
      assert.equal(this.request.method, 'POST');
      assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
      assert.equal(this.request.url, '/api/codeblock/' + Stamplay.VERSION + '/run/mycodeblock?p1=1&p2=2');
      assert.equal(this.request.requestBody, JSON.stringify(body));
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(response));

    });

    test('that run method with body make POST api call with body and with query params (promise)', function (done) {
      var body = {
        b1: 1,
        b2: 2
      }

      var queryParams = {
        p1: 1,
        p2: 2
      }

      codeblock.run(body, queryParams).then(function(response) {
        done();
      })
      
      assert.equal(this.request.method, 'POST');
      assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
      assert.equal(this.request.url, '/api/codeblock/' + Stamplay.VERSION + '/run/mycodeblock?p1=1&p2=2');
      assert.equal(this.request.requestBody, JSON.stringify(body));
      this.request.respond(200, {
        "Content-Type": "application/json"
      }, JSON.stringify(response));

    });
  });

  // /** PATCH **/
  // suite.skip('PATCH method', function () {
  //   test('that run method with method arguments make PATCH api call without body nor query params', function (done) {

  //     codeblock.run('PATCH').then(function (response) {
  //       done();
  //     });

  //     assert.equal(this.request.method, 'PATCH');
  //     assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
  //     assert.equal(this.request.url, '/api/codeblock/' + Stamplay.VERSION + '/run/mycodeblock');
  //     assert.equal(this.request.body, undefined);
  //     this.request.respond(200, {
  //       "Content-Type": "application/json"
  //     }, JSON.stringify(response));

  //   });

  //   test('that run method with body make PATCH api call with body and without query params', function (done) {
  //     var body = {
  //       b1: 1,
  //       b2: 2
  //     }

  //     codeblock.run('PATCH', body).then(function (response) {
  //       done();
  //     });

  //     assert.equal(this.request.method, 'PATCH');
  //     assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
  //     assert.equal(this.request.url, '/api/codeblock/' + Stamplay.VERSION + '/run/mycodeblock');
  //     assert.equal(this.request.requestBody, JSON.stringify(body));
  //     this.request.respond(200, {
  //       "Content-Type": "application/json"
  //     }, JSON.stringify(response));

  //   });


  //   test('that run method with body make PATCH api call with body and with query params', function (done) {
  //     var body = {
  //       b1: 1,
  //       b2: 2
  //     }

  //     var queryParams = {
  //       p1: 1,
  //       p2: 2
  //     }

  //     codeblock.run('PATCH', body, queryParams).then(function (response) {
  //       done();
  //     });

  //     assert.equal(this.request.method, 'PATCH');
  //     assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
  //     assert.equal(this.request.url, '/api/codeblock/' + Stamplay.VERSION + '/run/mycodeblock?p1=1&p2=2');
  //     assert.equal(this.request.requestBody, JSON.stringify(body));
  //     this.request.respond(200, {
  //       "Content-Type": "application/json"
  //     }, JSON.stringify(response));

  //   });
  // });

  // /** PUT **/
  // suite.skip('PUT method', function () {
  //   test('that run method with method arguments make PUT api call without body nor query params', function (done) {

  //     codeblock.run('PUT').then(function (response) {
  //       done();
  //     });

  //     assert.equal(this.request.method, 'PUT');
  //     assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
  //     assert.equal(this.request.url, '/api/codeblock/' + Stamplay.VERSION + '/run/mycodeblock');
  //     assert.equal(this.request.body, undefined);
  //     this.request.respond(200, {
  //       "Content-Type": "application/json"
  //     }, JSON.stringify(response));

  //   });

  //   test('that run method with body make PUT api call with body and without query params', function (done) {
  //     var body = {
  //       b1: 1,
  //       b2: 2
  //     }

  //     codeblock.run('PUT', body).then(function (response) {
  //       done();
  //     });

  //     assert.equal(this.request.method, 'PUT');
  //     assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
  //     assert.equal(this.request.url, '/api/codeblock/' + Stamplay.VERSION + '/run/mycodeblock');
  //     assert.equal(this.request.requestBody, JSON.stringify(body));
  //     this.request.respond(200, {
  //       "Content-Type": "application/json"
  //     }, JSON.stringify(response));

  //   });


  //   test('that run method with body make PUT api call with body and with query params', function (done) {
  //     var body = {
  //       b1: 1,
  //       b2: 2
  //     }

  //     var queryParams = {
  //       p1: 1,
  //       p2: 2
  //     }

  //     codeblock.run('PUT', body, queryParams).then(function (response) {
  //       done();
  //     });

  //     assert.equal(this.request.method, 'PUT');
  //     assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
  //     assert.equal(this.request.url, '/api/codeblock/' + Stamplay.VERSION + '/run/mycodeblock?p1=1&p2=2');
  //     assert.equal(this.request.requestBody, JSON.stringify(body));
  //     this.request.respond(200, {
  //       "Content-Type": "application/json"
  //     }, JSON.stringify(response));

  //   });
  // });

  // /** GET **/
  // suite.skip('GET method', function () {

  //   test('that run method with method arguments make GET api call without body nor query params', function (done) {

  //     codeblock.run('GET').then(function (response) {
  //       done();
  //     });

  //     assert.equal(this.request.method, 'GET');
  //     assert.equal(this.request.requestHeaders['Content-Type'], "application/json");
  //     assert.equal(this.request.url, '/api/codeblock/' + Stamplay.VERSION + '/run/mycodeblock');
  //     assert.equal(this.request.body, undefined);
  //     this.request.respond(200, {
  //       "Content-Type": "application/json"
  //     }, JSON.stringify(response));

  //   });

  //   test('that run method with body make GET api call with body (should not send it) and without query params', function (done) {
  //     var body = {
  //       b1: 1,
  //       b2: 2
  //     }

  //     codeblock.run('GET', body).then(function (response) {
  //       done();
  //     });

  //     assert.equal(this.request.method, 'GET');
  //     assert.equal(this.request.requestHeaders['Content-Type'], "application/json");
  //     assert.equal(this.request.url, '/api/codeblock/' + Stamplay.VERSION + '/run/mycodeblock');
  //     assert.equal(this.request.requestBody, undefined);
  //     this.request.respond(200, {
  //       "Content-Type": "application/json"
  //     }, JSON.stringify(response));

  //   });


  //   test('that run method with body make GET api call with body (should not send it) and with query params', function (done) {
  //     var body = {
  //       b1: 1,
  //       b2: 2
  //     }

  //     var queryParams = {
  //       p1: 1,
  //       p2: 2
  //     }

  //     codeblock.run('GET', body, queryParams).then(function (response) {
  //       done();
  //     });

  //     assert.equal(this.request.method, 'GET');
  //     assert.equal(this.request.requestHeaders['Content-Type'], "application/json");
  //     assert.equal(this.request.url, '/api/codeblock/' + Stamplay.VERSION + '/run/mycodeblock?p1=1&p2=2');
  //     assert.equal(this.request.requestBody, undefined);
  //     this.request.respond(200, {
  //       "Content-Type": "application/json"
  //     }, JSON.stringify(response));

  //   });

  //   test('that run method with body make GET api call without body but with query params', function (done) {
  //     var queryParams = {
  //       p1: 1,
  //       p2: 2
  //     }

  //     codeblock.run('GET', null, queryParams).then(function (response) {
  //       done();
  //     });

  //     assert.equal(this.request.method, 'GET');
  //     assert.equal(this.request.requestHeaders['Content-Type'], "application/json");
  //     assert.equal(this.request.url, '/api/codeblock/' + Stamplay.VERSION + '/run/mycodeblock?p1=1&p2=2');
  //     assert.equal(this.request.requestBody, undefined);
  //     this.request.respond(200, {
  //       "Content-Type": "application/json"
  //     }, JSON.stringify(response));

  //   });
  // });

  // /** DELETE **/
  // suite.skip('DELETE method', function () {

  //   test('that run method with method arguments make DELETE api call without body nor query params', function (done) {

  //     codeblock.run('DELETE').then(function (response) {
  //       done();
  //     });

  //     assert.equal(this.request.method, 'DELETE');
  //     assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
  //     assert.equal(this.request.url, '/api/codeblock/' + Stamplay.VERSION + '/run/mycodeblock');
  //     assert.equal(this.request.body, undefined);
  //     this.request.respond(200, {
  //       "Content-Type": "application/json"
  //     }, JSON.stringify(response));

  //   });

  //   test('that run method with body make DELETE api call with body (should not send it) and without query params', function (done) {
  //     var body = {
  //       b1: 1,
  //       b2: 2
  //     }

  //     codeblock.run('DELETE', body).then(function (response) {
  //       done();
  //     });

  //     assert.equal(this.request.method, 'DELETE');
  //     assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
  //     assert.equal(this.request.url, '/api/codeblock/' + Stamplay.VERSION + '/run/mycodeblock');
  //     assert.equal(this.request.requestBody, undefined);
  //     this.request.respond(200, {
  //       "Content-Type": "application/json"
  //     }, JSON.stringify(response));

  //   });


  //   test('that run method with body make DELETE api call with body (should not send it) and with query params', function (done) {
  //     var body = {
  //       b1: 1,
  //       b2: 2
  //     }

  //     var queryParams = {
  //       p1: 1,
  //       p2: 2
  //     }

  //     codeblock.run('DELETE', body, queryParams).then(function (response) {
  //       done();
  //     });

  //     assert.equal(this.request.method, 'DELETE');
  //     assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
  //     assert.equal(this.request.url, '/api/codeblock/' + Stamplay.VERSION + '/run/mycodeblock?p1=1&p2=2');
  //     assert.equal(this.request.requestBody, undefined);
  //     this.request.respond(200, {
  //       "Content-Type": "application/json"
  //     }, JSON.stringify(response));

  //   });

  //   test('that run method with body make DELETE api call without body but with query params', function (done) {
  //     var queryParams = {
  //       p1: 1,
  //       p2: 2
  //     }

  //     codeblock.run('DELETE', null, queryParams).then(function (response) {
  //       done();
  //     });

  //     assert.equal(this.request.method, 'DELETE');
  //     assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
  //     assert.equal(this.request.url, '/api/codeblock/' + Stamplay.VERSION + '/run/mycodeblock?p1=1&p2=2');
  //     assert.equal(this.request.requestBody, undefined);
  //     this.request.respond(200, {
  //       "Content-Type": "application/json"
  //     }, JSON.stringify(response));

  //   });
  // });

});