suite('Stamplay Support ', function () {


	//For each test
	setup('Stamplay support', function () {

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


	test('has the redirect method', function () {
		assert.isFunction(Stamplay.Support.redirect);
	});

	test('has the validate mail method', function () {
		assert.isFunction(Stamplay.Support.validateEmail);
	});

});