/* globals suite,Stamplay,setup,sinon,teardown,test,assert */

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

	test('has the checkMongoId method', function () {
		assert.isFunction(Stamplay.Support.checkMongoId);
	});
	
	test('has the errorSender method', function () {
		assert.isFunction(Stamplay.Support.errorSender);
	});

	test('checkMongoId method', function () {
		assert.equal(true, Stamplay.Support.checkMongoId('123456789123456789123412'))
		assert.equal(true, Stamplay.Support.checkMongoId('99345c7891a345d7891e341f'))
		assert.equal(false, Stamplay.Support.checkMongoId('12345123456789123412'))
		assert.equal(false, Stamplay.Support.checkMongoId('12345678912345678912341r'))
	});

	test('errorSender method', function (done) {
		Stamplay.Support.errorSender(400,'aaa').then(function(){}, function(err){
			assert.equal(400, err.status)
			assert.equal('aaa', err.message)
			done();
		})
	});

});