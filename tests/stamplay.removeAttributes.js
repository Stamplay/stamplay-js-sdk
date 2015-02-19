suite('Stamplay function removeAttributes ', function () {

	var instanceCobj;
	var instanceAnother
	setup('Create the variables for the test', function(){
		instanceCobj = {
			__v:0,
			cobjectId:'instance',
			actions:{
				fb:'fb',
				tw:'tw',
				comments:[
					{
						text:'a',
						id:1
					}
				],
			},
			appId: '1234',
			id:'1234',
			attribute : 'immortal'
		}
		instanceAnother = {
			__v:0,
			cobjectId:'instance',
			appId: '1234',
			id:'1234',
			attribute : 'immortal'
		}

	})

	test('cobjectId delete attributes', function () {		
		window.Stamplay.removeAttributes('cobject',instanceCobj);
		assert.equal(instanceCobj.id, undefined);
		assert.equal(instanceCobj.cobjectId, undefined);
		assert.equal(instanceCobj.actions, undefined);
		assert.equal(instanceCobj.appId, undefined);
		assert.equal(instanceCobj.__v, undefined);
		assert.equal(instanceCobj.attribute, 'immortal');
	});

	test('Another component delete attributes', function(){
		window.Stamplay.removeAttributes('another',instanceAnother);
		assert.equal(instanceCobj.id, '1234');
		assert.equal(instanceCobj.cobjectId, 'instance');
		assert.equal(instanceCobj.appId, '1234');
		assert.equal(instanceCobj.__v, 0);
		assert.equal(instanceCobj.attribute, 'immortal');
	})

	

})