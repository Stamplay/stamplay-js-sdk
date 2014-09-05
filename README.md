Stamplay JavaScript SDK
===============
[![Build Status](https://travis-ci.org/Stamplay/stamplay-js-sdk.svg?branch=master)](https://travis-ci.org/Stamplay/stamplay-js-sdk)
[![Production version](http://img.shields.io/badge/download-36%20kB-blue.svg)](http://img.shields.io/badge/download-36%20kB-blue.svg)

##Getting Started
Just import the JS SDK in your HTML page and you're ready to go.

```javascript
var user = new Stamplay.User().Model;
var tags = new Stamplay.Cobject('tag').Collection;
var tag;

//Gettings 
user.currentUser()
.then(function(){
  // Populating tags collection with all available data
  return tags.fetch();
})
.then(function(){
  tag = new Stamplay.Cobject('tag').Model;
  tag.set('name', 'javascript');
  return tag.save();
 })
.then(function(){
  tags.add(tag);
});
```

##Available components
This JavaScript SDK expose through the Stamplay object the following components:
 
* [User](#user)
* [Custom Object](#custom-object)

Every component can expose two main classes:

* [Model](#model)
* [Collection](#collection)

#Model
Models are the heart of any JavaScript application, a model keeps the application logic and with the Stamplay model you can easily synchronize the data between client and the Stamplay platform.

The following is a contrived example, but it demonstrates defining a User model, setting an attribute, and saving it in the application. 

```javascript
var registrationData = {
	email : 'user@provider.com',
	password: 'mySecret'
};
var newUser = new Stamplay.User;
newUser.signup(registrationData)
.then(function(){
	// User is now registered
	newUser.set('phoneNumber', '020 123 4567' );
	return newUser.save();
}).then(function(){
	// User is saved server side
	var number = newUser.get('phoneNumber'); // number value is 020 123 4567 
})
```

##Model actions
Some components expose the model actions too.
These methods are a fast way to ```rate```, ```vote``` and ```comment``` a resource. 
Moreover there are two methods for keeping track of the Twitter and Facebook shares.
All these methods return a promise.

```javascript
var tag = new Stamplay.Cobject('tag').Model;
tag.rate(4)
.then(function(){
	var actions = tag.get('actions');
	console.log(actions.ratings); // You can see the ratings, the average rate and the users who rate
});
```

##Model methods

  * <a href="#Model.get"> <code>get()</code></a>
  * <a href="#Model.set"><code>set()</code></a>
  * <a href="#Model.unset"><code>unset</code></a>
  * <a href="#Model.fetch"><code>fetch()</code></a>
  * <a href="#Model.destroy"><code>destroy()</code></a>
  * <a href="#Model.save"><code>save()</code></a>
  * <a href="#Action.vote"><code>vote()</code></a>

###Action methods
  * <a href="#Action.rate"><code>rate()</code></a>
  * <a href="#Action.comment"><code>comment()</code></a>
  * <a href="#Action.twitter_share"><code>twitter_share()</code></a>
  * <a href="#Action.facebook_share"><code>facebook_share()</code></a>
 
-------------------------------------------------------
  
<a name="Model.get"></a>
### get(property)
Returns the value of the property
<a name="Model.set"></a>
### set(property, value)
Sets the value of the property
<a name="Model.unset"></a>
### unset(property)
Delete the property from the object
<a name="Model.fetch"></a>
### fetch(id, queryParameters)
Resets the model's state from the server. Useful if the model has never been populated with data, or if you'd like to ensure that you have the latest server state. 
Refer to the [queryParameters](#query-parameters) documentation. 
<a name="Model.destroy"></a>
###destroy()
Deletes the object from the server by making a DELETE request. If the model is new, false is returned.
<a name="Model.save"></a>
###save(options)
Saves the model to the database. If the model is new a POST request is made, otherwise, unless specified a PUT request is sent.
#### options 
An object with the following properties: 

* patch : default false, if true an HTTP PATCH is sent to the server instead of PUT for updating the model 

##Action methods
<a name="Action.vote"></a>
###vote() 
Vote the resource.
<a name="Action.rate"></a>
###rate(rating)
Rate the resource, only integer values as parameter.
<a name="Action.comment"></a>
###comment(text)
Comment the resource with the text.
<a name="Action.twitter_share"></a>
###twitter_share()
Calls the Twitter share endpoint. Note that this method updates the twitter_share counter but it is not responsible for sharing the resource on Twitter.
<a name="Action.facebook_share"></a>  
###facebook_share
Calls the Facebook share endpoint. Note that this method updates the facebook_share counter but it is not responsible for sharing the resource on Facebook.  

-------------------------------------------------------


# Collection
Collections are sets of models. You can ```fetch``` the collection from the server and a set of Underscore methods.   

##Methods

  * <a href="#Collection.fetch"> <code>fetch()</code></a>
  * <a href="#Collection.remove"><code>remove()</code></a>
  * <a href="#Collection.get"><code>get()</code></a>
  * <a href="#Collection.at"><code>at()</code></a>
  * <a href="#Collection.pop"><code>pop()</code></a>
  * <a href="#Collection.shift"><code>shift()</code></a>
  * <a href="#Collection.add"><code>add()</code></a> 

-------------------------------------------------------

<a name="Collection.fetch"></a>
### fetch(queryParams)
Populate the collection with all the available models. If no [queryParameters](#query-parameters) are passed the collection is populated with the first 20 models ordered by id. 
<a name="Collection.remove"></a>
### remove(id)
Remove the model with the specified id from the collection. 
You can pass an array of ids to remove from the collection. 
<a name="Collection.get"></a>
### get(id)
Get a model from a collection, specified by an id.
<a name="Collection.at"></a>
### at(index)
Get a model from a collection, specified by index. In this moment collection aren't sorted so **at** will still retrieve models in insertion order.
<a name="Collection.pop"></a>
### pop()
Remove and return the last model from a collection, if collection is empty return false. 
<a name="Collection.shift"></a>
### shift()
Remove and return the first model from a collection, if collection is empty return false.
<a name="Collection.add"></a>
### add(model)
Add a model at the end of the collection.

#User
You can create both Model and Collection of a Stamplay.User.

```javascript
var user = new Stamplay.User().Model;
var users = new Stamplay.User().Collection;
```

A Stamplay.User Model instance inherits all the [Model](#model) methods.

```javascript
user.fetch(id)
.then(function(){
	user.set('displayName', 'New display name');
	user.save().then(function(){
		user.get('displayName'); //returns New display name
	});
});
```

A Stamplay.User.Collection instance inherits all the [Collection](#collection) methods.

```javascript
users.fetch()
.then(function(){
	var firstUser = users.at(0);
	firstUser.get('displayName');
})
```

## Model methods
User model has the following additional methods.
###currentUser()
If the user is logged it populates the model with the user's data, otherwise the model is empty. 

```javascript
user.currentUser()
.then(function(){
	user.get('displayName');
})
```
###login()
The login method can be used for logging in with:
* third party services
* local authentication

####Third party services login (service)
You can use this method for logging users with third party services by passing the service as first and only parameter.

```javascript
user.login('facebook')
.then(function(){
	user.get('displayName');
});
```
#####Available services
You can use one of the following as parameter for logging in with third party service:
   
* facebook
* google
* twitter
* dropbox
* linkedin
* instagram
* angellist

#### Local authentication
Authentication with email and password. you can use the login method in this way.

```javascript
user.login('email@provider.com', 'mySecret')
.then(function(){
	user.get('displayName');
});  
```
Note that for this kind of login you have to [register](#signupdata) the user first. 
 
###signup(data)
Register user for local authentication. ```data``` parameter must be an object containing at least ```email``` and ```password``` keys.

```javascript
var registrationData = {
	email : 'user@provider.com',
	password: 'mySecret',
	displayName: 'John Stamplay'
};
user.signup(registrationData)
.then(function(){
	user.get('displayName');
});  
```

###logout()
Redirect the browser to the logout url.

```javascript
user.logout();
```

#Custom Object
You can create both Model and Collection of a Stamplay.Cobject.

Since you can create different custom object models from [Stamplay Editor](https://editor.stamplay.com), you must specify in the constructor the cobjectId of the resource.   

```javascript
var tag = new Stamplay.Cobject('tag').Model;
var tags = new Stamplay.Cobject('tag').Collection;
```

A Stamplay.Cobject Model instance inherits all the [Model](#model) methods.

```javascript
tag.fetch(id)
.then(function(){
	tag.set('description', 'Description');
	return tag.save()
	})
.then(function(){
	tag.get('description'); //returns Description
});
```

A Stamplay.Cobject.Collection instance inherits all the [Collection](#collection) methods.

```javascript
tags.fetch()
.then(function(){
	var firstTag = tags.at(0);
	firstTag.get('description');
});
```
## Model methods
The Stamplay.Cobject.Model inherits all the Action methods.

```javascript
tag.vote()
.then(function(){
	var actions = tag.get('actions');
	console.log(actions.votes); // You can see the number of votes and who has already voted
});
```
# Build
To build a production ready library you need to have NPM and Bower installed and then run those two commands:

```bash
npm install && bower install
grunt build
```

