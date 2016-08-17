/* globals suite,Stamplay,setup,sinon,teardown,test,assert */
/*
	How to run this test
	- Go to the root of the project
	- Launch mocha-phantomjs ./tests/tests.html
*/
suite('User', function () {
  var stamplayUrl = 'https://stamplay.stamplayapp.com'
	var user;
	var onSignup = {
		"_id": 123,
		"__v": 0,
		"displayName": "Abc Def",
		"email": "abc@def.it",
		"dt_update": "2014-09-03T08:34:14.002Z",
		"dt_create": "2014-09-01T08:31:55.832Z",
	}
	var validUser = {
		"user": onSignup
	};
	 var response = {};

	//For each test
	setup('Creating a new User model', function () {

		user = Stamplay.User;
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

	test('has the user custom methods', function () {
		assert.isFunction(user.currentUser, 'user method exists');
		assert.isFunction(user.login, 'login method exists');
		assert.isFunction(user.socialLogin, 'socialLogin  exists');
		assert.isFunction(user.logout, 'logout method exists');
		assert.isFunction(user.signup, 'signup method exists');
		assert.isFunction(user.get, 'get method exists');
		assert.isFunction(user.getById, 'getById method exists');
		assert.isFunction(user.save, 'save method exists');
		assert.isFunction(user.update, 'update method exists');
		assert.isFunction(user.remove, 'remove method exists');
		assert.isUndefined(user.patch, 'patch method not exists')
		assert.isFunction(user.getRoles, 'getRoles method exists');
    assert.isFunction(user.getRole, 'getRole method exists');
    assert.isFunction(user.setRole, 'setRole method exists');
	});

	test('user currentUser method (callback)', function (done) {
		user.currentUser(function(err, result){done()})
		assert.equal(this.request.method, 'GET');
		assert.equal(this.request.url, stamplayUrl+'/api/user/' + Stamplay.VERSION + '/getStatus');
		this.request.respond(200, {
			"Content-Type": "application/json"
		}, JSON.stringify(validUser));
	});

	test('user currentUser method (promise)', function (done) {
		user.currentUser().then(function(resp){done();},function(err){})
		assert.equal(this.request.method, 'GET');
		assert.equal(this.request.url, stamplayUrl+'/api/user/' + Stamplay.VERSION + '/getStatus');
		this.request.respond(200, {
			"Content-Type": "application/json"
		}, JSON.stringify(validUser));
	});

	test('user login method with external services', function () {
		var services = ['facebook', 'google', 'twitter', 'dropbox', 'linkedin', 'instagram', 'angellist', 'github'];
		var arr = [];
		var stub = sinon.stub(Stamplay.Support, "redirect", function (url) {
			var url = url.replace('file://','')
			arr.push(stamplayUrl+url);
		});
		services.forEach(function (service) {
			var url = user.socialLogin(service);
		});
		services.forEach(function (service, i) {
			var url = stamplayUrl+'/auth/' + Stamplay.VERSION + '/' + service + '/connect';
			assert.equal(arr[i], url);
		});
		Stamplay.Support.redirect.restore(); // Unwraps the spy
	});

	test('user login method with Stamplay service (callback)', function (done) {
		user.login({email:'email@email.com', password: 'my_password'},function(err,result){
			assert.equal(result._id, 123);
			done();
		})
		assert.equal(this.request.method, 'POST');
		assert.equal(this.request.url, stamplayUrl+'/auth/' + Stamplay.VERSION + '/local/login');
		this.request.respond(200, {
			"Content-Type": "application/json"
		}, JSON.stringify(onSignup));
	});

	test('user login method with Stamplay service (promise)', function (done) {
		user.login({email:'email@email.com', password: 'my_password'}).then(function(result){
			assert.equal(result._id, 123);
			done();
		})
		assert.equal(this.request.method, 'POST');
		assert.equal(this.request.url, stamplayUrl+'/auth/' + Stamplay.VERSION + '/local/login');
		this.request.respond(200, {
			"Content-Type": "application/json"
		}, JSON.stringify(onSignup));
	});


	test('user signup method with Stamplay service (callback)', function (done) {
		var data = {
			email: 'email@email.com',
			password: 'my_password',
			property: 123
		};
		user.signup(data,function(err,resp){
			assert.equal(resp.email, data.email);
			assert.equal(resp.password, data.password);
			assert.equal(resp.property, data.property);
			done();
		})
		assert.equal(this.request.method, 'POST');
		assert.equal(this.request.url, stamplayUrl+'/api/user/' + Stamplay.VERSION + '/users');
		this.request.respond(200, {
			"Content-Type": "application/json"
		}, JSON.stringify(data));
	});

	test('user signup method with Stamplay service (promise)', function (done) {
		var data = {
			email: 'email@email.com',
			password: 'my_password',
			property: 123
		};

		user.signup(data).then(function(resp){
			assert.equal(resp.email, data.email);
			assert.equal(resp.password, data.password);
			assert.equal(resp.property, data.property);
			done();
		})

		assert.equal(this.request.method, 'POST');
		assert.equal(this.request.url, stamplayUrl+'/api/user/' + Stamplay.VERSION + '/users');
		this.request.respond(200, {
			"Content-Type": "application/json"
		}, JSON.stringify(data));
	});

	test('user logout function', function () {
		var arr = [];
		var stub = sinon.stub(Stamplay.Support, "redirect", function (url) {
			var url = url.replace('file://','')
			arr.push(url);
		});
		store.set(window.location.origin + '-jwt', '12345')
		user.logout();
		Stamplay.Support.redirect.restore(); // Unwraps the spy
		var url = arr[0] || '';
		assert.equal(url, '/auth/' + Stamplay.VERSION + '/logout?jwt=12345');
	});


	test('user logout method with async (callback)', function (done) {
		store.set(window.location.origin + '-jwt', '12345')
		user.logout(true, function(err,result){
			done();
		})
		assert.equal(this.request.method, 'GET');
		assert.equal(this.request.url, stamplayUrl+'/auth/' + Stamplay.VERSION + '/logout?jwt=12345');
		this.request.respond(200, {
			"Content-Type": "application/json"
		},JSON.stringify({}));
	});

	test('user logout method with async (promise)', function (done) {
		store.set(window.location.origin + '-jwt', '12345')
		user.logout(true).then(function(result){
			done();
		})
		assert.equal(this.request.method, 'GET');
		assert.equal(this.request.url, stamplayUrl+'/auth/' + Stamplay.VERSION + '/logout?jwt=12345');
		this.request.respond(200, {
			"Content-Type": "application/json"
		}, JSON.stringify({}));
	});

	test('user resetPassword function (callback)', function (done) {
		var data = {
			email:'a@a.it',
			newPassword:'12234'
		};
		user.resetPassword(data, function(err,result){done();});
		assert.equal(this.request.method, 'POST');
		assert.equal(this.request.url, stamplayUrl+'/api/user/' + Stamplay.VERSION + '/users/resetpassword');
		this.request.respond(200, {
			"Content-Type": "application/json"
		}, JSON.stringify(data));
	});

	test('user resetPassword function (promise)', function (done) {
		var data = {
			email:'a@a.it',
			newPassword:'12234'
		};
		user.resetPassword(data).then(function(result){done();});
		assert.equal(this.request.method, 'POST');
		assert.equal(this.request.url, stamplayUrl+'/api/user/' + Stamplay.VERSION + '/users/resetpassword');
		this.request.respond(200, {
			"Content-Type": "application/json"
		}, JSON.stringify(data));
	});

	test('get method (callback)', function (done) {
		Stamplay.User.get({},function(err,result){
			assert.equal(result._id, 123);
			assert.equal(result.displayName, 'John Stamplay');
			done();
		})
		assert.equal(this.request.url, stamplayUrl+'/api/user/' + Stamplay.VERSION + '/users');
		this.request.respond(200, {
			"Content-Type": "application/json"
		}, '{ "_id": 123, "displayName": "John Stamplay" }');
	});

	test('get method (promise)', function (done) {
		Stamplay.User.get({}).then(function(result){
			assert.equal(result._id, 123);
			assert.equal(result.displayName, 'John Stamplay');
			done();
		})
		assert.equal(this.request.url, stamplayUrl+'/api/user/' + Stamplay.VERSION + '/users');
		this.request.respond(200, {
			"Content-Type": "application/json"
		}, '{ "_id": 123, "displayName": "John Stamplay" }');
	});

	test('getById method (callback)', function (done) {
		Stamplay.User.getById('123',{},function(err,result){
			assert.equal(result._id, 123);
			assert.equal(result.displayName, 'John Stamplay');
			done();
		})
		assert.equal(this.request.url, stamplayUrl+'/api/user/' + Stamplay.VERSION + '/users/123');
		this.request.respond(200, {
			"Content-Type": "application/json"
		}, '{ "_id": 123, "displayName": "John Stamplay" }');
	});

	test('getById method (promise)', function (done) {
		Stamplay.User.getById('123',{}).then(function(result){
			assert.equal(result._id, 123);
			assert.equal(result.displayName, 'John Stamplay');
			done();
		})
		assert.equal(this.request.url, stamplayUrl+'/api/user/' + Stamplay.VERSION + '/users/123');
		this.request.respond(200, {
			"Content-Type": "application/json"
		}, '{ "_id": 123, "displayName": "John Stamplay" }');
	});

	test('update method (callback)', function (done){
		Stamplay.User.update('123',{}, function(err,result){
			assert.equal(result._id, 123);
			assert.equal(result.displayName, 'John Stamplay');
			done();
		})
		assert.equal(this.request.method, 'PUT');
		assert.equal(this.request.url, stamplayUrl+'/api/user/' + Stamplay.VERSION + '/users/123');
		this.request.respond(200, {
			"Content-Type": "application/json"
		}, '{ "_id": 123, "displayName": "John Stamplay" }');
	});

	test('update method (promise)', function (done){
		Stamplay.User.update('123',{}).then(function(result){
			assert.equal(result._id, 123);
			assert.equal(result.displayName, 'John Stamplay');
			done();
		})
		assert.equal(this.request.method, 'PUT');
		assert.equal(this.request.url, stamplayUrl+'/api/user/' + Stamplay.VERSION + '/users/123');
		this.request.respond(200, {
			"Content-Type": "application/json"
		}, '{ "_id": 123, "displayName": "John Stamplay" }');
	});

	test('save method (callback)', function (done) {
		var newUser = {"displayName":"John Stamplay"}
		Stamplay.User.save({"displayName":"John Stamplay"},function(err,result){
			done();
		})
		assert.equal(this.request.method, 'POST');
		assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
		assert.equal(this.request.requestBody, JSON.stringify(newUser));
		assert.equal(this.request.url, stamplayUrl+'/api/user/' + Stamplay.VERSION + '/users');
		this.request.respond(200, {
			"Content-Type": "application/json"
		}, JSON.stringify(newUser));
	});

	test('save method (promise)', function (done) {
		var newUser = {"displayName":"John Stamplay"}
		Stamplay.User.save({"displayName":"John Stamplay"}).then(function(result){
			done();
		})
		assert.equal(this.request.method, 'POST');
		assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
		assert.equal(this.request.requestBody, JSON.stringify(newUser));
		assert.equal(this.request.url, stamplayUrl+'/api/user/' + Stamplay.VERSION + '/users');
		this.request.respond(200, {
			"Content-Type": "application/json"
		}, JSON.stringify(newUser));
	});

	test('remove method (callback)', function (done) {
		Stamplay.User.remove("123123123123123124561223", function(err, result){
			done();
		})
		assert.equal(this.request.method, 'DELETE');
		assert.equal(this.request.url, stamplayUrl+'/api/user/' + Stamplay.VERSION + '/users/123123123123123124561223');
		assert.isUndefined(this.request.requestBody);

		this.request.respond(200, {
			"Content-Type": "application/json"
		}, JSON.stringify({}));
	});

	test('remove method (promise)', function (done) {
		Stamplay.User.remove("123123123123123124561223").then(function(result){
			done();
		})
		assert.equal(this.request.method, 'DELETE');
		assert.equal(this.request.url, stamplayUrl+'/api/user/' + Stamplay.VERSION + '/users/123123123123123124561223');
		assert.isUndefined(this.request.requestBody);
		this.request.respond(200, {
			"Content-Type": "application/json"
		}, JSON.stringify({}));
	});

	test('getRoles method (callback)', function (done) {
    user.getRoles(function(err,result){done()})
    assert.equal(this.request.method, 'GET');
    assert.equal(this.request.requestHeaders['Content-Type'], "application/json");
    assert.equal(this.request.url, stamplayUrl+'/api/user/' + Stamplay.VERSION + '/roles');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify(response));

  });

  test('getRoles method (promise)', function (done) {
    user.getRoles().then(function(result){done()})
    assert.equal(this.request.method, 'GET');
    assert.equal(this.request.requestHeaders['Content-Type'], "application/json");
    assert.equal(this.request.url, stamplayUrl+'/api/user/' + Stamplay.VERSION + '/roles');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify(response));

  });

  test('getRole method (callback)', function (done) {
  	user.getRole('123451234512345123451234', function(err,result){done()})
    assert.equal(this.request.method, 'GET');
    assert.equal(this.request.requestHeaders['Content-Type'], "application/json");
    assert.equal(this.request.url, stamplayUrl+'/api/user/' + Stamplay.VERSION + '/roles/123451234512345123451234');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify(response));
  });

  test('getRole method (promise)', function (done) {
  	user.getRole('123451234512345123451234').then(function(result){done()})
    assert.equal(this.request.method, 'GET');
    assert.equal(this.request.requestHeaders['Content-Type'], "application/json");
    assert.equal(this.request.url, stamplayUrl+'/api/user/' + Stamplay.VERSION + '/roles/123451234512345123451234');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify(response));
  });

  test('setRole method (callback)', function (done) {
  	user.setRole('123451234512345123451234','123456', function(err,result){done()})
    assert.equal(this.request.method, 'PATCH');
    assert.equal(this.request.url, stamplayUrl+'/api/user/' + Stamplay.VERSION + '/users/123451234512345123451234/role');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify(response));
  });

  test('setRole method (promise)', function (done) {
  	user.setRole('123451234512345123451234','123456').then(function(result){done()})
    assert.equal(this.request.method, 'PATCH');
    assert.equal(this.request.url, stamplayUrl+'/api/user/' + Stamplay.VERSION + '/users/123451234512345123451234/role');
    this.request.respond(200, {
      "Content-Type": "application/json"
    }, JSON.stringify(response));
  });

	test('has no action methods', function () {
		var newUser = Stamplay.User;
		assert.isUndefined(newUser.vote);
		assert.isUndefined(newUser.rate);
		assert.isUndefined(newUser.comment);
		assert.isUndefined(newUser.twitterShare);
		assert.isUndefined(newUser.facebookShare);
	});


});
