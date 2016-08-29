/* globals suite,Stamplay,setup,sinon,teardown,test,assert,_ */
suite('Codeblock', function () {

  var stamplayUrl = 'https://stamplay.stamplayapp.com'
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
  // Codeblock.post()
  test('has the run method', function () {
    assert.isFunction(codeblock.run, 'run method exists');
  });

  /** POST **/
  suite('POST', function () {
    test(
      'that run method without arguments make POST api call without body nor query params (callback)',
      function (done) {

        codeblock.post(null, null, function (err, response) {
          done();
        })

        assert.equal(this.request.method, 'POST');
        assert.equal(this.request.requestHeaders['Content-Type'],
          "application/json;charset=utf-8");
        assert.equal(this.request.url, stamplayUrl + '/api/codeblock/' + Stamplay.VERSION +
          '/run/mycodeblock');
        assert.equal(this.request.body, undefined);
        this.request.respond(200, {
          "Content-Type": "application/json"
        }, JSON.stringify(response));

      });

    test(
      'that run method without arguments make POST api call without body nor query params (promise)',
      function (done) {

        codeblock.post(null, null).then(function (response) {
          done();
        })

        assert.equal(this.request.method, 'POST');
        assert.equal(this.request.requestHeaders['Content-Type'],
          "application/json;charset=utf-8");
        assert.equal(this.request.url, stamplayUrl + '/api/codeblock/' + Stamplay.VERSION +
          '/run/mycodeblock');
        assert.equal(this.request.body, undefined);
        this.request.respond(200, {
          "Content-Type": "application/json"
        }, JSON.stringify(response));

      });

    test(
      'that run method with body make POST api call with body and without query params (callback)',
      function (done) {
        var body = {
          b1: 1,
          b2: 2
        }
        codeblock.post(body, null, function (err, response) {
          done();
        })

        assert.equal(this.request.method, 'POST');
        assert.equal(this.request.requestHeaders['Content-Type'],
          "application/json;charset=utf-8");
        assert.equal(this.request.url, stamplayUrl + '/api/codeblock/' + Stamplay.VERSION +
          '/run/mycodeblock');
        assert.equal(this.request.requestBody, JSON.stringify(body));
        this.request.respond(200, {
          "Content-Type": "application/json"
        }, JSON.stringify(response));

      });

    test(
      'that run method with body make POST api call with body and without query params (promise)',
      function (done) {
        var body = {
          b1: 1,
          b2: 2
        }
        codeblock.post(body, null).then(function (response) {
          done();
        })

        assert.equal(this.request.method, 'POST');
        assert.equal(this.request.requestHeaders['Content-Type'],
          "application/json;charset=utf-8");
        assert.equal(this.request.url, stamplayUrl + '/api/codeblock/' + Stamplay.VERSION +
          '/run/mycodeblock');
        assert.equal(this.request.requestBody, JSON.stringify(body));
        this.request.respond(200, {
          "Content-Type": "application/json"
        }, JSON.stringify(response));

      });

    test(
      'that run method with body make POST api call with body and with query params (callback)',
      function (done) {
        var body = {
          b1: 1,
          b2: 2
        }

        var queryParams = {
          p1: 1,
          p2: 2
        }

        codeblock.post(body, queryParams, function (err, response) {
          done();
        })

        assert.equal(this.request.method, 'POST');
        assert.equal(this.request.requestHeaders['Content-Type'],
          "application/json;charset=utf-8");
        assert.equal(this.request.url, stamplayUrl + '/api/codeblock/' + Stamplay.VERSION +
          '/run/mycodeblock?p1=1&p2=2');
        assert.equal(this.request.requestBody, JSON.stringify(body));
        this.request.respond(200, {
          "Content-Type": "application/json"
        }, JSON.stringify(response));

      });

    test(
      'that run method with body make POST api call with body and with query params (promise)',
      function (done) {
        var body = {
          b1: 1,
          b2: 2
        }

        var queryParams = {
          p1: 1,
          p2: 2
        }

        codeblock.post(body, queryParams).then(function (response) {
          done();
        })

        assert.equal(this.request.method, 'POST');
        assert.equal(this.request.requestHeaders['Content-Type'],
          "application/json;charset=utf-8");
        assert.equal(this.request.url, stamplayUrl + '/api/codeblock/' + Stamplay.VERSION +
          '/run/mycodeblock?p1=1&p2=2');
        assert.equal(this.request.requestBody, JSON.stringify(body));
        this.request.respond(200, {
          "Content-Type": "application/json"
        }, JSON.stringify(response));

      });
  });

  /** PATCH **/
  suite('PATCH method', function () {
    test(
      'that run method with method arguments make PATCH api call without body nor query params (promise)',
      function (done) {

        codeblock.patch().then(function (response) {
          done();
        });

        assert.equal(this.request.method, 'PATCH');
        assert.equal(this.request.requestHeaders['Content-Type'],
          "application/json;charset=utf-8");
        assert.equal(this.request.url, stamplayUrl + '/api/codeblock/' + Stamplay.VERSION +
          '/run/mycodeblock');
        assert.equal(this.request.body, undefined);
        this.request.respond(200, {
          "Content-Type": "application/json"
        }, JSON.stringify(response));

      });

    test(
      'that run method with method arguments make PATCH api call without body nor query params (callback)',
      function (done) {

        codeblock.patch(null, null, function (err, response) {
          done();
        });

        assert.equal(this.request.method, 'PATCH');
        assert.equal(this.request.requestHeaders['Content-Type'],
          "application/json;charset=utf-8");
        assert.equal(this.request.url, stamplayUrl + '/api/codeblock/' + Stamplay.VERSION +
          '/run/mycodeblock');
        assert.equal(this.request.body, undefined);
        this.request.respond(200, {
          "Content-Type": "application/json"
        }, JSON.stringify(response));

      });


    test(
      'that run method with body make PATCH api call with body and without query params (promise)',
      function (done) {
        var body = {
          b1: 1,
          b2: 2
        }

        codeblock.patch(body).then(function (response) {
          done();
        });

        assert.equal(this.request.method, 'PATCH');
        assert.equal(this.request.requestHeaders['Content-Type'],
          "application/json;charset=utf-8");
        assert.equal(this.request.url, stamplayUrl + '/api/codeblock/' + Stamplay.VERSION +
          '/run/mycodeblock');
        assert.equal(this.request.requestBody, JSON.stringify(body));
        this.request.respond(200, {
          "Content-Type": "application/json"
        }, JSON.stringify(response));

      });

    test(
      'that run method with body make PATCH api call with body and without query params (callback)',
      function (done) {
        var body = {
          b1: 1,
          b2: 2
        }

        codeblock.patch(body, null, function (response) {
          done();
        });

        assert.equal(this.request.method, 'PATCH');
        assert.equal(this.request.requestHeaders['Content-Type'],
          "application/json;charset=utf-8");
        assert.equal(this.request.url, stamplayUrl + '/api/codeblock/' + Stamplay.VERSION +
          '/run/mycodeblock');
        assert.equal(this.request.requestBody, JSON.stringify(body));
        this.request.respond(200, {
          "Content-Type": "application/json"
        }, JSON.stringify(response));

      });

    test(
      'that run method with body make PATCH api call with body and with query params (promise)',
      function (done) {
        var body = {
          b1: 1,
          b2: 2
        }

        var queryParams = {
          p1: 1,
          p2: 2
        }

        codeblock.patch(body, queryParams).then(function (response) {
          done();
        });

        assert.equal(this.request.method, 'PATCH');
        assert.equal(this.request.requestHeaders['Content-Type'],
          "application/json;charset=utf-8");
        assert.equal(this.request.url, stamplayUrl + '/api/codeblock/' + Stamplay.VERSION +
          '/run/mycodeblock?p1=1&p2=2');
        assert.equal(this.request.requestBody, JSON.stringify(body));
        this.request.respond(200, {
          "Content-Type": "application/json"
        }, JSON.stringify(response));

      });

    test(
      'that run method with body make PATCH api call with body and with query params (callback)',
      function (done) {
        var body = {
          b1: 1,
          b2: 2
        }

        var queryParams = {
          p1: 1,
          p2: 2
        }

        codeblock.patch(body, queryParams, function (response) {
          done();
        });

        assert.equal(this.request.method, 'PATCH');
        assert.equal(this.request.requestHeaders['Content-Type'],
          "application/json;charset=utf-8");
        assert.equal(this.request.url, stamplayUrl + '/api/codeblock/' + Stamplay.VERSION +
          '/run/mycodeblock?p1=1&p2=2');
        assert.equal(this.request.requestBody, JSON.stringify(body));
        this.request.respond(200, {
          "Content-Type": "application/json"
        }, JSON.stringify(response));

      });
  });

  /** PUT **/
  suite('PUT method', function () {
    test(
      'that run method with method arguments make PUT api call without body nor query params (promise)',
      function (done) {

        codeblock.put().then(function (response) {
          done();
        });

        assert.equal(this.request.method, 'PUT');
        assert.equal(this.request.requestHeaders['Content-Type'],
          "application/json;charset=utf-8");
        assert.equal(this.request.url, stamplayUrl + '/api/codeblock/' + Stamplay.VERSION +
          '/run/mycodeblock');
        assert.equal(this.request.body, undefined);
        this.request.respond(200, {
          "Content-Type": "application/json"
        }, JSON.stringify(response));

      });

    test(
      'that run method with method arguments make PUT api call without body nor query params (callback)',
      function (done) {

        codeblock.put(null, null, function (response) {
          done();
        });

        assert.equal(this.request.method, 'PUT');
        assert.equal(this.request.requestHeaders['Content-Type'],
          "application/json;charset=utf-8");
        assert.equal(this.request.url, stamplayUrl + '/api/codeblock/' + Stamplay.VERSION +
          '/run/mycodeblock');
        assert.equal(this.request.body, undefined);
        this.request.respond(200, {
          "Content-Type": "application/json"
        }, JSON.stringify(response));

      });

    test(
      'that run method with body make PUT api call with body and without query params (promise)',
      function (done) {
        var body = {
          b1: 1,
          b2: 2
        }

        codeblock.put(body).then(function (response) {
          done();
        });

        assert.equal(this.request.method, 'PUT');
        assert.equal(this.request.requestHeaders['Content-Type'],
          "application/json;charset=utf-8");
        assert.equal(this.request.url, stamplayUrl + '/api/codeblock/' + Stamplay.VERSION +
          '/run/mycodeblock');
        assert.equal(this.request.requestBody, JSON.stringify(body));
        this.request.respond(200, {
          "Content-Type": "application/json"
        }, JSON.stringify(response));

      });

    test(
      'that run method with body make PUT api call with body and without query params (callback)',
      function (done) {
        var body = {
          b1: 1,
          b2: 2
        }

        codeblock.put(body, null, function (response) {
          done();
        });

        assert.equal(this.request.method, 'PUT');
        assert.equal(this.request.requestHeaders['Content-Type'],
          "application/json;charset=utf-8");
        assert.equal(this.request.url, stamplayUrl + '/api/codeblock/' + Stamplay.VERSION +
          '/run/mycodeblock');
        assert.equal(this.request.requestBody, JSON.stringify(body));
        this.request.respond(200, {
          "Content-Type": "application/json"
        }, JSON.stringify(response));

      });


    test(
      'that run method with body make PUT api call with body and with query params (promise)',
      function (done) {
        var body = {
          b1: 1,
          b2: 2
        }

        var queryParams = {
          p1: 1,
          p2: 2
        }

        codeblock.put(body, queryParams).then(function (response) {
          done();
        });

        assert.equal(this.request.method, 'PUT');
        assert.equal(this.request.requestHeaders['Content-Type'],
          "application/json;charset=utf-8");
        assert.equal(this.request.url, stamplayUrl + '/api/codeblock/' + Stamplay.VERSION +
          '/run/mycodeblock?p1=1&p2=2');
        assert.equal(this.request.requestBody, JSON.stringify(body));
        this.request.respond(200, {
          "Content-Type": "application/json"
        }, JSON.stringify(response));

      });

    test(
      'that run method with body make PUT api call with body and with query params (callback)',
      function (done) {
        var body = {
          b1: 1,
          b2: 2
        }

        var queryParams = {
          p1: 1,
          p2: 2
        }

        codeblock.put(body, queryParams, function (response) {
          done();
        });

        assert.equal(this.request.method, 'PUT');
        assert.equal(this.request.requestHeaders['Content-Type'],
          "application/json;charset=utf-8");
        assert.equal(this.request.url, stamplayUrl + '/api/codeblock/' + Stamplay.VERSION +
          '/run/mycodeblock?p1=1&p2=2');
        assert.equal(this.request.requestBody, JSON.stringify(body));
        this.request.respond(200, {
          "Content-Type": "application/json"
        }, JSON.stringify(response));

      });
  });

  /** GET **/
  suite('GET method', function () {
    test(
      'that run method with method arguments make GET api call without body nor query params (promise)',
      function (done) {

        codeblock.get().then(function (response) {
          done();
        });

        assert.equal(this.request.method, 'GET');
        assert.equal(this.request.requestHeaders['Content-Type'], "application/json");
        assert.equal(this.request.url, stamplayUrl + '/api/codeblock/' + Stamplay.VERSION +
          '/run/mycodeblock');
        assert.equal(this.request.body, undefined);
        this.request.respond(200, {
          "Content-Type": "application/json"
        }, JSON.stringify(response));

      });
    test(
      'that run method with method arguments make GET api call without body nor query params (callback)',
      function (done) {

        codeblock.get(null, function (response) {
          done();
        });

        assert.equal(this.request.method, 'GET');
        assert.equal(this.request.requestHeaders['Content-Type'], "application/json");
        assert.equal(this.request.url, stamplayUrl + '/api/codeblock/' + Stamplay.VERSION +
          '/run/mycodeblock');
        assert.equal(this.request.body, undefined);
        this.request.respond(200, {
          "Content-Type": "application/json"
        }, JSON.stringify(response));

      });

    test('that run method with body make GET api call with query params (promise)',
      function (done) {
        var queryParams = {
          p1: 1,
          p2: 2
        }

        codeblock.get(queryParams).then(function (response) {
          done();
        });

        assert.equal(this.request.method, 'GET');
        assert.equal(this.request.requestHeaders['Content-Type'], "application/json");
        assert.equal(this.request.url, stamplayUrl + '/api/codeblock/' + Stamplay.VERSION +
          '/run/mycodeblock?p1=1&p2=2');
        assert.equal(this.request.requestBody, undefined);
        this.request.respond(200, {
          "Content-Type": "application/json"
        }, JSON.stringify(response));

      });

    test('that run method with body make GET api call with query params (callback)',
      function (done) {
        var queryParams = {
          p1: 1,
          p2: 2
        }

        codeblock.get(queryParams, function (response) {
          done();
        });

        assert.equal(this.request.method, 'GET');
        assert.equal(this.request.requestHeaders['Content-Type'], "application/json");
        assert.equal(this.request.url, stamplayUrl + '/api/codeblock/' + Stamplay.VERSION +
          '/run/mycodeblock?p1=1&p2=2');
        assert.equal(this.request.requestBody, undefined);
        this.request.respond(200, {
          "Content-Type": "application/json"
        }, JSON.stringify(response));

      });
  });

  /** DELETE **/
  suite('DELETE method', function () {

    test(
      'that run method with method arguments make DELETE api call without body nor query params (promise)',
      function (done) {

        codeblock.delete().then(function (response) {
          done();
        });

        assert.equal(this.request.method, 'DELETE');
        assert.equal(this.request.requestHeaders['Content-Type'],
          "application/json;charset=utf-8");
        assert.equal(this.request.url, stamplayUrl + '/api/codeblock/' + Stamplay.VERSION +
          '/run/mycodeblock');
        assert.equal(this.request.body, undefined);
        this.request.respond(200, {
          "Content-Type": "application/json"
        }, JSON.stringify(response));

      });

    test(
      'that run method with method arguments make DELETE api call without body nor query params (callback)',
      function (done) {

        codeblock.delete(null, function (response) {
          done();
        });

        assert.equal(this.request.method, 'DELETE');
        assert.equal(this.request.requestHeaders['Content-Type'],
          "application/json;charset=utf-8");
        assert.equal(this.request.url, stamplayUrl + '/api/codeblock/' + Stamplay.VERSION +
          '/run/mycodeblock');
        assert.equal(this.request.body, undefined);
        this.request.respond(200, {
          "Content-Type": "application/json"
        }, JSON.stringify(response));

      });

    test(
      'that run method with body make DELETE api call with query params (promise)',
      function (done) {
        var queryParams = {
          p1: 1,
          p2: 2
        }

        codeblock.delete(queryParams).then(function (response) {
          done();
        });

        assert.equal(this.request.method, 'DELETE');
        assert.equal(this.request.requestHeaders['Content-Type'],
          "application/json;charset=utf-8");
        assert.equal(this.request.url, stamplayUrl + '/api/codeblock/' + Stamplay.VERSION +
          '/run/mycodeblock?p1=1&p2=2');
        this.request.respond(200, {
          "Content-Type": "application/json"
        }, JSON.stringify(response));

      });

    test(
      'that run method with body make DELETE api call with query params (callback)',
      function (done) {
        var queryParams = {
          p1: 1,
          p2: 2
        }

        codeblock.delete(queryParams, function (response) {
          done();
        });

        assert.equal(this.request.method, 'DELETE');
        assert.equal(this.request.requestHeaders['Content-Type'],
          "application/json;charset=utf-8");
        assert.equal(this.request.url, stamplayUrl + '/api/codeblock/' + Stamplay.VERSION +
          '/run/mycodeblock?p1=1&p2=2');
        this.request.respond(200, {
          "Content-Type": "application/json"
        }, JSON.stringify(response));

      });

  });

});
