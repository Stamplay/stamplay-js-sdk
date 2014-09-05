suite('Stamplay User Model ', function () {

	var user;
	var onSignup = {
		"_id": 123,
		"__v": 0,
		"displayName": "Mal Lop",
		"email": "dod91@hotmail.it",
		"dt_update": "2014-09-03T08:34:14.002Z",
		"dt_create": "2014-09-01T08:31:55.832Z",
	}
	var validUser = {
		"user": onSignup
	};

	//For each test
	setup('Creating a new User model', function () {

		user = new Stamplay.User().Model;

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


	test('has the model methods', function () {

		assert.isFunction(user.constructor, 'constructor method exists');
		assert.isFunction(user.get, 'get method exists');
		assert.isFunction(user.set, 'set method exists');
		assert.isFunction(user.unset, 'unset method exists');
		assert.isFunction(user.fetch, 'fetch method exists');
		assert.isFunction(user.save, 'save method exists');
		assert.isFunction(user.destroy, 'destroy method exists');

	});

	test('has the user custom methods', function () {
		assert.isFunction(user.currentUser, 'user status exists');
		assert.isFunction(user.login, 'login status exists');
		assert.isFunction(user.logout, 'logout status exists');
		assert.isFunction(user.signup, 'signup status exists');

	});

	test('has the instance property which is an object', function () {

		assert.isObject(user.instance, 'instance property is an object')

	});

	test('user currentUser method', function (done) {

		user.currentUser().then(function () {
			assert.equal(user.get('_id'), 123);
			done();
		});

		assert.equal(this.request.method, 'GET');
		assert.equal(this.request.url, '/api/user/v0/getStatus');

		this.request.respond(200, {
			"Content-Type": "application/json"
		}, JSON.stringify(validUser));
	});

	test('user login method with external services', function () {
		var services = ['facebook', 'google', 'twitter', 'dropbox', 'linkedin', 'instagram', 'angellist'];

		var arr = [];
		var stub = sinon.stub(Stamplay.Support, "redirect", function (url) {
			arr.push(url);
		});

		services.forEach(function (service) {
			var url = user.login(service);
		});

		services.forEach(function (service, i) {
			var url = '/auth/' + Stamplay.VERSION + '/' + service + '/connect';
			assert.equal(arr[i], location.protocol + '//' + document.domain + url);
		});
		Stamplay.Support.redirect.restore(); // Unwraps the spy

	});

	test('user login method with Stamplay service', function () {

		user.login('email@email.com', 'my_password').then(function () {
			assert.equal(user.get('_id'), 123);
			done();
		});

		assert.equal(this.request.method, 'POST');
		assert.equal(this.request.url, '/auth/v0/local/login');
		this.request.respond(200, {
			"Content-Type": "application/json"
		}, JSON.stringify(onSignup));
	});

	test('user signup method with Stamplay service', function (done) {
		var data = {
			email: 'email@email.com',
			password: 'my_password',
			property: 123
		}

		user.signup(data).then(function () {
			assert.equal(user.get('email'), data.email);
			assert.equal(user.get('password'), data.password);
			assert.equal(user.get('property'), data.property);
			done();
		});

		assert.equal(this.request.method, 'POST');
		assert.equal(this.request.url, '/api/user/v0/users');
		this.request.respond(200, {
			"Content-Type": "application/json"
		}, JSON.stringify(data));
	});

	test('user failed signup because of invalid data throws an error ', function () {
		var spy = sinon.spy(user, "signup");
		try {
			user.signup({})
		} catch (err) {
			assert.isTrue(spy.threw());
		}
	});

	test('user logout function', function () {
		var arr = [];
		var stub = sinon.stub(Stamplay.Support, "redirect", function (url) {
			arr.push(url);
		});

		user.logout();

		Stamplay.Support.redirect.restore(); // Unwraps the spy

		var url = arr[0] || '';
		assert.equal(url, location.protocol + '//' + document.domain + '/auth/v0/logout');
	});

	// test('constructor method', function () {
	// 	var newObject = {
	// 		first: 1,
	// 		second: 2,
	// 		nested_object: {
	// 			first_nested: 1,
	// 			second_nested: 2,
	// 			third_array: [1, 2, 3]
	// 		},
	// 		a_string: 'a string'
	// 	};
	// 	var newCinstance = new Stamplay.Cobject('cobjectId').Model;
	// 	newCinstance.constructor(newObject);

	// 	assert.deepEqual(newCinstance.instance, newObject);

	// 	newCinstance.instance = {};

	// 	newObject = {
	// 		first: {
	// 			nested_first: undefined
	// 		}
	// 	}
	// 	newCinstance.constructor(newObject);

	// 	assert.deepEqual(newCinstance.instance, newObject);

	// });

	// test('get method', function () {

	// 	assert.equal(cinstance.instance.number_property, 5);
	// 	assert.equal(cinstance.instance.string_property, 'a_string');
	// 	assert.deepEqual(cinstance.instance.object_property, object_value);
	// 	assert.deepEqual(cinstance.instance.array_property, array_value);

	// });

	// test('set method', function () {

	// 	cinstance.set('number_property', 2);
	// 	assert.equal(cinstance.instance.number_property, 2);

	// 	cinstance.set('string_property', 'string');
	// 	assert.equal(cinstance.instance.string_property, 'string');

	// 	var new_object_value = {
	// 		p2: 'test'
	// 	};
	// 	cinstance.set('object_property', new_object_value);
	// 	assert.deepEqual(cinstance.instance.object_property, new_object_value);

	// 	var new_array_value = ['a', 'b', 'c'];
	// 	cinstance.set('array_property', new_object_value);
	// 	assert.deepEqual(cinstance.instance.array_property, new_object_value);

	// });

	// test('unset method', function () {

	// 	cinstance.unset('number_property');
	// 	assert.isUndefined(cinstance.instance.number_property, 'After unset number_property doesn\'t exists');

	// 	cinstance.unset('string_property');
	// 	assert.isUndefined(cinstance.instance.string_property, 'After unset string_property doesn\'t exists');

	// 	cinstance.unset('object_property');
	// 	assert.isUndefined(cinstance.instance.object_property, 'After unset object_property doesn\'t exists');

	// 	cinstance.unset('array_property');
	// 	assert.isUndefined(cinstance.instance.array_property, 'After unset array_property doesn\'t exists');

	// });

	// test('fetch method', function (done) {

	// 	var newCinstance = new Stamplay.Cobject('cobjectId').Model;

	// 	newCinstance.fetch("123").then(function () {
	// 		assert.equal(newCinstance.get('_id'), 123);
	// 		assert.equal(newCinstance.get('comment'), 'Hey there');
	// 		done();
	// 	});

	// 	assert.equal(this.request.url, '/api/cobject/v0/cobjectId/123');


	// 	this.request.respond(200, {
	// 		"Content-Type": "application/json"
	// 	}, '{ "_id": 123, "comment": "Hey there" }');

	// });

	// test('save method POST', function () {

	// 	cinstance.save().then(function () {
	// 		assert.equal(cinstance.get('_id'), 123);
	// 		done();
	// 	});

	// 	cinstance.set('_id', 123);

	// 	assert.equal(this.request.method, 'POST');
	// 	assert.equal(this.request.url, '/api/cobject/v0/cobjectId');


	// 	this.request.respond(200, {
	// 		"Content-Type": "application/json"
	// 	}, JSON.stringify(cinstance.instance));

	// });

	// test('save method PUT', function () {

	// 	var oldInstance = new Stamplay.Cobject('cobjectId').Model;
	// 	oldInstance.set('_id', 1);

	// 	oldInstance.save().then(function () {
	// 		assert.equal(oldInstance.get('_id'), 1);
	// 		done();
	// 	});


	// 	assert.equal(this.request.method, 'PUT');
	// 	assert.equal(this.request.requestBody, JSON.stringify(oldInstance.instance));
	// 	assert.equal(this.request.url, '/api/cobject/v0/cobjectId/1');


	// 	this.request.respond(200, {
	// 		"Content-Type": "application/json"
	// 	}, JSON.stringify({
	// 		_id: 1
	// 	}));

	// });

	// test('save method PATCH', function () {

	// 	var oldInstance = new Stamplay.Cobject('cobjectId').Model;
	// 	oldInstance.set('_id', 1);


	// 	oldInstance.save({
	// 		patch: true
	// 	}).then(function () {
	// 		assert.equal(oldInstance.get('_id'), 1);
	// 		done();
	// 	});


	// 	assert.equal(this.request.method, 'PATCH');
	// 	assert.equal(this.request.url, '/api/cobject/v0/cobjectId/1');

	// 	//Patch should send only changed attributes but right now PATCH = PUT
	// 	assert.equal(this.request.requestBody, JSON.stringify(oldInstance.instance));

	// 	this.request.respond(200, {
	// 		"Content-Type": "application/json"
	// 	}, JSON.stringify({
	// 		_id: 1
	// 	}));

	// })

	// test('destroy method', function (done) {
	// 	cinstance.set('_id', 1);
	// 	cinstance.destroy().then(function () {

	// 		var newCinstance = new Stamplay.Cobject('cobjectId').Model;
	// 		var unableToDestroy = newCinstance.destroy();
	// 		assert.isFalse(unableToDestroy, 'A non saved instance shouldn\'t make the ajax call');

	// 		done();
	// 	});


	// 	assert.equal(this.request.method, 'DELETE');
	// 	assert.equal(this.request.url, '/api/cobject/v0/cobjectId/1');
	// 	//Patch should send only changed attributes but right now PATCH = PUT
	// 	assert.isUndefined(this.request.requestBody);

	// 	this.request.respond(200, {
	// 		"Content-Type": "application/json"
	// 	}, '{}');

	// });

});