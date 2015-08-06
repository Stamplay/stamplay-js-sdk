/* globals suite,Stamplay,setup,sinon,teardown,test,assert,_ */
suite('Stamplay Object ', function () {

	test('exists as window property', function () {
		assert.typeOf(window.Stamplay, 'object', 'window.Stamplay exists');
	});

	test('exists as Stamplay VERSION property', function () {
		assert.typeOf(window.Stamplay.VERSION, 'String', 'window.Stamplay.VERSION exists');
	});

	test('exists as Stamplay BASEURL property', function () {
		assert.typeOf(window.Stamplay.BASEURL, 'String', 'window.Stamplay.BASEURL exists');
	});

	test('exists as Stamplay APPID property', function () {
		assert.typeOf(window.Stamplay.APPID, 'String', 'window.Stamplay.APPID exists');
	});

	if(window.localStorage && store.enabled){
		test('exists as Stamplay USESTORAGE property', function () {
			assert.typeOf(window.Stamplay.USESTORAGE, 'Boolean', 'window.Stamplay.USESTORAGE exists');
		});
	}

	test('exists as Stamplay function called init', function () {
		assert.typeOf(window.Stamplay.init, 'function', 'window.Stamplay.init exists');
	});

	test('exists as Stamplay function called removeAttributes', function () {
		assert.typeOf(window.Stamplay.removeAttributes, 'function', 'window.Stamplay.removeAttributes exists');
	});

	test('exists as Stamplay function called makeAPromise', function () {
		assert.typeOf(window.Stamplay.makeAPromise, 'function', 'window.Stamplay.makeAPromise exists');
	});

	test('expose Support object', function () {
		assert.typeOf(window.Stamplay.Support, 'object', 'window.Stamplay.Support exists');
	});

	test('expose Query object', function () {
		assert.typeOf(window.Stamplay.Query, 'function', 'window.Stamplay.Query constructor exists');
	});

	test('expose Cobject constructor', function () {
		assert.typeOf(window.Stamplay.Cobject, 'function', 'window.Stamplay.Cobject constructor exists');
	});

	test('expose User constructor', function () {
		assert.typeOf(window.Stamplay.User, 'function', 'window.Stamplay.User constructor exists');
	});

	test('expose Webhook constructor', function () {
		assert.typeOf(window.Stamplay.Webhook, 'function', 'window.Stamplay.Webhook constructor exists');
	});

	test('expose Stripe constructor', function () {
		assert.typeOf(window.Stamplay.Stripe, 'function', 'window.Stamplay.Stripe constructor exists');
	});
})