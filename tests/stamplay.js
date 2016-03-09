/* globals suite,window,test,assert */
suite('Stamplay ', function () {

	suite('Property', function(){
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

		test('exists as Stamplay OPTIONS property', function () {
			assert.typeOf(window.Stamplay.OPTIONS, 'object', 'window.Stamplay.OPTIONS exists');
		});

		if (window.localStorage && store.enabled) {
			test('exists as Stamplay USESTORAGE property', function () {
				assert.typeOf(window.Stamplay.USESTORAGE, 'Boolean', 'window.Stamplay.USESTORAGE exists');
			});
		}
	})

	suite('Function', function(){
		test('exists as Stamplay function called init', function () {
			assert.typeOf(window.Stamplay.init, 'function', 'window.Stamplay.init exists');
		});

		test('exists as Stamplay function called makeAPromise', function () {
			assert.typeOf(window.Stamplay.makeAPromise, 'function', 'window.Stamplay.makeAPromise exists');
		});

		test('init function works fine', function () {		
			window.Stamplay.init('test');
			assert.equal(window.Stamplay.BASEURL, 'https://test.stamplayapp.com');
			assert.equal(window.Stamplay.APPID, 'test' );
			window.Stamplay.init('stamplay');
		});
	})

	suite('Constructor',function(){
		test('expose Support object', function () {
			assert.typeOf(window.Stamplay.Support, 'object', 'window.Stamplay.Support exists');
		});

		test('expose Cobject constructor', function () {
			assert.typeOf(window.Stamplay.Object, 'function', 'window.Stamplay.Object constructor exists');
		});

		test('expose User constructor', function () {
			assert.typeOf(window.Stamplay.User, 'object', 'window.Stamplay.User constructor exists');
		});

		test('expose Webhook constructor', function () {
			assert.typeOf(window.Stamplay.Webhook, 'function', 'window.Stamplay.Webhook constructor exists');
		});

		test('expose Stripe constructor', function () {
			assert.typeOf(window.Stamplay.Stripe, 'object', 'window.Stamplay.Stripe constructor exists');
		});

		test('expose Codeblock constructor', function () {
			assert.typeOf(window.Stamplay.Codeblock, 'function', 'window.Stamplay.Codeblock constructor exists');
		});
	})
	
	
})