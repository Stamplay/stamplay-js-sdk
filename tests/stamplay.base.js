suite('Stamplay functions ', function () {

	suite('init',function(){
		test('works fine', function () {		
			assert.equal(window.Stamplay.BASEURL, '')
			assert.equal(window.Stamplay.APPID, '' )
			window.Stamplay.init('test')
			assert.equal(window.Stamplay.BASEURL, 'https://test.stamplayapp.com')
			assert.equal(window.Stamplay.APPID, 'test' )
			window.Stamplay.init('')
		});
	})	

	suite('removeAttributes', function(){
		var instanceCobj;
		var instanceAnother; 
		var	instanceUser;
		
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
			
			instanceUser = {
				__v:0,
				_id:'12123435',
				appId: '1234',
				id:'1234',
				attribute : 'immortal',
				name :'stamplay'
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

		test('user delete attributes', function () {		
			window.Stamplay.removeAttributes('user',instanceUser);
			assert.equal(instanceUser.id, undefined);
			assert.equal(instanceUser._id, undefined);
			assert.equal(instanceUser.__v, undefined);
			assert.equal(instanceUser.attribute, 'immortal');
			assert.equal(instanceUser.name, 'stamplay');
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

})