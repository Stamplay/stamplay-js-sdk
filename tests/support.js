/* globals suite,Stamplay,setup,sinon,teardown,test,assert */

suite('Stamplay Support ', function () {
	test('has the redirect method', function () {
		assert.isFunction(Stamplay.Support.redirect);
	});
	test('has the validate mail method', function () {
		assert.isFunction(Stamplay.Support.validateEmail);
	});
});