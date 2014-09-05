/*   

	How to run this test
	- Go to the root of the project
	- Launch mocha-phantomjs ./tests/tests.html

*/
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

	test('user login method with Stamplay service', function (done) {

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

	// constructor, get, set, unset tested in cobject.model.js
	// model methods

	test('fetch method', function (done) {

		var newUser = new Stamplay.User().Model;

		newUser.fetch("123").then(function () {
			assert.equal(newUser.get('_id'), 123);
			assert.equal(newUser.get('displayName'), 'John Stamplay');
			done();
		});

		assert.equal(this.request.url, '/api/user/v0/users/123');


		this.request.respond(200, {
			"Content-Type": "application/json"
		}, '{ "_id": 123, "displayName": "John Stamplay" }');

	});

	test('save method POST', function (done) {

		var newUser = new Stamplay.User().Model;
		newUser.set('displayName', 'John Stamplay');

		newUser.save().then(function () {
			done();
		});

		assert.equal(this.request.method, 'POST');
		assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
		assert.equal(this.request.requestBody, JSON.stringify(newUser.instance));
		assert.equal(this.request.url, '/api/user/v0/users');

		this.request.respond(200, {
			"Content-Type": "application/json"
		}, JSON.stringify(newUser.instance));

	});

	test('save method PUT', function (done) {

		var newUser = new Stamplay.User().Model;
		newUser.set('_id', 123);

		newUser.save().then(function () {
			done();
		});

		assert.equal(this.request.method, 'PUT');
		assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
		assert.equal(this.request.requestBody, JSON.stringify(newUser.instance));
		assert.equal(this.request.url, '/api/user/v0/users/123');

		this.request.respond(200, {
			"Content-Type": "application/json"
		}, JSON.stringify(newUser.instance));

	});

	test('save method PATCH', function (done) {

		var newUser = new Stamplay.User().Model;
		newUser.set('_id', 123);

		newUser.save({
			patch: true
		}).then(function () {
			done();
		});

		assert.equal(this.request.method, 'PATCH');
		assert.equal(this.request.requestHeaders['Content-Type'], "application/json;charset=utf-8");
		//Patch should send only changed attributes but right now PATCH = PUT
		assert.equal(this.request.requestBody, JSON.stringify(newUser.instance));
		assert.equal(this.request.url, '/api/user/v0/users/123');

		this.request.respond(200, {
			"Content-Type": "application/json"
		}, JSON.stringify(newUser.instance));

	})

	test('destroy method', function (done) {

		var newUser = new Stamplay.User().Model;
		newUser.set('_id', 123);

		newUser.destroy().then(function () {

			var notDeletable = new Stamplay.User().Model;
			var unableToDestroy = notDeletable.destroy();
			assert.isFalse(unableToDestroy, 'A non saved instance shouldn\'t make the ajax call');
			done();
		});

		assert.equal(this.request.method, 'DELETE');
		assert.equal(this.request.url, '/api/user/v0/users/123');
		//Patch should send only changed attributes but right now PATCH = PUT
		assert.isUndefined(this.request.requestBody);

		this.request.respond(200, {
			"Content-Type": "application/json"
		}, JSON.stringify({}));

	});

	test('has no action methods', function () {
		var newUser = new Stamplay.User().Model;

		assert.isUndefined(newUser.vote);
		assert.isUndefined(newUser.rate);
		assert.isUndefined(newUser.comment);
		assert.isUndefined(newUser.twitterShare);
		assert.isUndefined(newUser.facebookShare);
	});

});