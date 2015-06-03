Stamplay JavaScript SDK API v1 
===============
[![Build Status](https://travis-ci.org/Stamplay/stamplay-js-sdk.svg?branch=master)](https://travis-ci.org/Stamplay/stamplay-js-sdk)
[![Production version](http://img.shields.io/badge/download-38%20kB-blue.svg)](https://raw.githubusercontent.com/Stamplay/stamplay-js-sdk/master/dist/stamplay.min.js)
[![Bower version](https://badge.fury.io/bo/stamplay-js-sdk.svg)](http://badge.fury.io/bo/stamplay-js-sdk)

## API v0 support 
If you're using Stamplay API v0 you should use the javascript sdk in the [apis-v0 branch](https://github.com/Stamplay/stamplay-js-sdk/tree/apis-v0) 

##Getting Started
The Stamplay JavaScript SDK provides a JavaScript library making it even easier to access the Stamplay cloud platform. On this initial release the SDK let you work with the most important and flexible components of our platform: `User` , `Custom Objects` and `Webhook`.To enable support for Stamplay-related functions in your web app, you'll need to include `stamplay.min.js` in your app. 
To do this, add the following to the head block of your HTML:

```HTML
<script src="//drrjhlchpvi7e.cloudfront.net/libs/stamplay-js-sdk/1.0.0/stamplay.min.js"></script>
```
To use its functionalities inside browsers, a window scoped variable called `Stamplay` is created.

If you use the SDK on a different domain from *.stamplayapp.com, remember to call this method to initialize the SDK,
it's really IMPORTANT:

```javascript
//APPID is the appid of your app on Stamplay's Editor
Stamplay.init("APPID");
```

Our JavaScript SDK is based on the popular Backbone.js framework. It is compatible with existing Backbone applications with minimal changes on your part. Our goal is to minimize configuration and let you quickly start building your JavaScript and HTML5 app on Stamplay. Here is a simple example of usage:

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

Our JavaScript SDK has just three dependecies one is [Undescore](https://github.com/jashkenas/underscore), [Q](https://github.com/kriskowal/q) and the other is [StoreJs](https://github.com/marcuswestin/store.js). Most of the methods of Stamplay Javascript SDK returns a promise. Promises have a then method, which you can use to get the 'eventual' return value or thrown exception (rejection).

```javascript

var tag = new Stamplay.Cobject('tag').Model;
tag.set('name','stamplay')
tag.save().then(function(){
  //success
  //Stamplay Javascript SDK updates the tag object with the response of the API call    
}, function(err){
  //error
  //Stamplay Javascript SDK returns the request 
});

```  

##Available components
This JavaScript SDK expose through the Stamplay variable the following components:
 
* [User](#user)
* [Custom Object](#custom-object)
* [WebHook](#webhook)

Every component can expose two main classes:

* [Model](#model)
* [Collection](#collection)

Also this components the sdk have some support objects to help you in common operation:

* [Query](#query)

#Model
Models are the heart of any JavaScript application, containing the interactive data as well as a large part of the logic surrounding it: conversions, validations, computed properties, and access control.

The following example shows how to create a new instance of a User model ( models, collections and views work the same way ), add a new attribute, and saving it in the application. 

```javascript
var registrationData = {
  email : 'user@provider.com',
  password: 'mySecret'
};
var newUser = new Stamplay.User().Model;
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

##Model methods

  * <a href="#Model.get"> <code>get()</code></a>
  * <a href="#Model.set"><code>set()</code></a>
  * <a href="#Model.unset"><code>unset</code></a>
  * <a href="#Model.fetch"><code>fetch()</code></a>
  * <a href="#Model.destroy"><code>destroy()</code></a>
  * <a href="#Model.save"><code>save()</code></a>

###Action methods
Some models have built-in social actions and the SDK provides a fast way to ```rate```, ```upvote```, ```downvote``` and ```comment``` a resource. Models with social actions also give you a way to track how many times they have been shared on Twitter and Facebook. All these methods return a promise.

  * <a href="#Action.upVote"><code>upVote()</code></a>
  * <a href="#Action.downVote"><code>downVote()</code></a>
  * <a href="#Action.rate"><code>rate()</code></a>
  * <a href="#Action.comment"><code>comment()</code></a>
  * <a href="#Action.twitterShare"><code>twitterShare()</code></a>
  * <a href="#Action.facebookShare"><code>facebookShare()</code></a>
  * <a href="#Action.getComments"><code>getComments()</code></a>
  * <a href="#Action.getVotes"><code>getVotes()</code></a>
  * <a href="#Action.getRatings"><code>getRatings()</code></a>
  * <a href="#Action.getTwitterShares"><code>getTwitterShares()</code></a>
  * <a href="#Action.getFacebookShares"><code>getFacebookShares()</code></a>

```javascript
var tag = new Stamplay.Cobject('tag').Model;
tag.rate(4)
.then(function(){
  var actions = tag.get('actions');
  console.log(actions.ratings); // You can see the ratings, the average rate and the users who rate
});
```

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
### fetch(id)
Resets the model's state from the server. Useful if the model has never been populated with data, or if you'd like to ensure that you have the latest server state. 
<a name="Model.destroy"></a>
###destroy()
Deletes the object from the server by making a DELETE request. If the model is new, false is returned.
<a name="Model.save"></a>
###save(options)
Saves the model to the database. If the model is new a POST request is made, otherwise, unless specified a PUT request is sent.
#### options 
An object with the following properties: 

* patch : default false, if true an HTTP PATCH is sent to the server instead of PUT for updating the model 

<a name="Action.upVote"></a>
###upVote() 
Vote up the resource.
<a name="Action.downVote"></a>
###downVote() 
Vote down the resource.
<a name="Action.rate"></a>
###rate(rating)
Rate the resource, only integer values as parameter.
<a name="Action.comment"></a>
###comment(text)
Comment the resource with the text.
<a name="Action.twitterShare"></a>
###twitterShare()
Calls the Twitter share endpoint. Note that this method updates the twitter_share counter but it is not responsible for sharing the resource on Twitter.
<a name="Action.facebookShare"></a>  
###facebookShare()
Calls the Facebook share endpoint. Note that this method updates the facebook_share counter but it is not responsible for sharing the resource on Facebook.
<a name="Action.getComments"></a>  
###getComments()
Get all comments of this resource. Return an Array   
<a name="Action.getVotes"></a>  
###getVotes()
Get all userId of voters. If you want the only down vote or up vote, call getVotes('down') or getVotes('up'). Return an Array
<a name="Action.getRatings"></a>  
###getRatings()
Get all Users's ratings. Return an Array
<a name="Action.getTwitterShares"></a>  
###getTwitterShares()
Get all Users's twitter shares. Return an Array
<a name="Action.getFacebookShares"></a>  
###getFacebookShares()
Get all Users's facebook shares. Return an Array


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
### fetch()
Populate the collection with all the available models. If no [FetchParams](#FetchParams) are passed the collection is populated with the first 20 models ordered by id. 
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

-------------------------------------------------------

<a name="FetchParams"></a>
The Collection have some other methods, we call those FetchParams
These help you to create a more flexible and complex fetch object.

##FetchParams

  * <a href="#FetchParams.equalTo"><code>equalTo()</code></a>
  * <a href="#FetchParams.limit"><code>limit()</code></a>
  * <a href="#FetchParams.select"><code>select()</code></a>
  * <a href="#FetchParams.sortAscending"><code>sortAscending()</code></a>
  * <a href="#FetchParams.sortDescending"><code>sortDescending()</code></a>
  * <a href="#FetchParams.pagination"> <code>pagination()</code></a>

-------------------------------------------------------
<a name="FetchParams.equalTo"></a>
### equalTo(attr,value)
This method take two arguments, the attribute equal to the given value.

<a name="FetchParams.limit"></a>
### limit(n)
This method take an argument, the number of maximum results return to you 

<a name="FetchParams.select"></a>
### select('attr')
This method take an argument, the name of attribute you want to select.
If you need more than one argument you can set an array of attributes  

<a name="FetchParams.sortAscending"></a>
### sortAscending('attr')
This method take an argument, the name of attribute you want to sorting

<a name="FetchParams.sortDiscending"></a>
### sortDiscending('attr')
This method take an argument, the name of attribute you want to sorting

<a name="FetchParams.pagination"></a>
### pagination(page, per_page)
This method return the 'per_page' element from the 'page'. 


##Pipeline

If you want create a more complex params you could use all methods, check this example:

```javascript
var coll = new Stamplay.Cobject('tag').Collection
coll.equalTo('name','foo').limit(10).sort('description');
coll.fetch().then(function(){
  //Now coll is a Collection with 10 tags with the name 'foo', sorted by description  
})

```

-------------------------------------------------------

# Query

Query are sets of methods for make easy to use the query filter on Stamplay.
The constructor take two arguments, model and instance.
The first parameter is require, it is the model name of resource like 'user' or 'cobject'.
The second parameter is the name of instance of model. 
For example for a custom object called tag you must write a line of code like this:

```javascript
var query = new Stamplay.Query('cobject','tag') 
```

The following code show you how to use query object:
```javascript
var query = new Stamplay.Query('cobject','tag').equalTo('name','foo')
query.exec().then(function(response){
  //the response of your query 
}) 
```
Please remember to running the query use the method exec(), it returns a promise.

##Methods

  * <a href="#Query.greaterThan"><code>greaterThan()</code></a>
  * <a href="#Query.greaterThanOrEqual"><code>greaterThanOrEqual()</code></a>
  * <a href="#Query.lessThan"><code>lessThan()</code></a>
  * <a href="#Query.lessThanOrEqual"><code>lessThanOrEqual()</code></a>
  * <a href="#Query.between"><code>between()</code></a>
  * <a href="#Query.equalTo"><code>equalTo()</code></a>
  * <a href="#Query.exists"><code>exists()</code></a>
  * <a href="#Query.notExists"><code>notExists()</code></a>
  * <a href="#Query.sortAscending"><code>sortAscending()</code></a>
  * <a href="#Query.sortDescending"><code>sortDescending()</code></a>
  * <a href="#Query.or"><code>or()</code></a>
  * <a href="#Query.exec"> <code>exec()</code></a>

-------------------------------------------------------

<a name="Query.greaterThan"></a>
### greaterThan(attr,value)
This method take two arguments. The query returns all documents that have the attribute greater than the given value.

<a name="Query.greaterThanOrEqual"></a>
### greaterThanOrEqual(attr,value)
This method take two arguments. The query returns all documents that have the attribute greater or equal than the given value.

<a name="Query.lessThan"></a>
### lessThan(attr, value)
This method take two arguments. The query returns all documents that have the attribute less than the given value.

<a name="Query.lessThanOrEqual"></a>
### lessThanOrEqual(attr, value)
This method take two arguments. The query returns all documents that have the attribute less or equal than the given value.

<a name="Query.between"></a>
### between(attr, value1, value2)
This method take three arguments. The query returns all documents that have the attribute between value1 and value2.

<a name="Query.equalTo"></a>
### equalTo(attr,value)
This method take two arguments. The query returns all documents that have the attribute equal to the given value.

<a name="Query.exists"></a>
### exists(attr)
This method take one argument. The query returns all documents that have the attribute.

<a name="Query.notExists"></a>
### notExists(attr)
This method take one argument. The query returns all documents that don't have the attribute.

<a name="Query.sortAscending"></a>
### sortAscending(attr)
This method take one argument. The query returns the documents sorted ascending on attr.

<a name="Query.sortDescending"></a>
### sortDescending(attr)
This method take one argument. The query returns the documents sorted descending on attr.

<a name="Query.or"></a>
### or(query,query,...)
This method take n Stamplay.Query object. The query returns all documents that match at least a query.

<a name="Query.exec"></a>
### exec()
This method runs the query and return a promise

##Pipeline

If you want create a more complex query you could use all methods, check this example:

```javascript
var query = new Stamplay.Query('cobject','tag')
query.equalTo('name','foo').lessThan('value',10).exists('description')
query.exec().then(function(response){
  //the response of your query 
}) 
```


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

## User additional methods

User model has the following additional methods.

  * <a href="#User.currentUser"> <code>currentUser()</code></a>
  * <a href="#User.isLogged"> <code>isLogged()</code></a>
  * <a href="#User.login"><code>login()</code></a>
  * <a href="#User.signup"><code>signup()</code></a>
  * <a href="#User.logout"><code>logout()</code></a>

-------------------------------------------------------

<a name="User.currentUser"></a>
###currentUser()
If the user is logged it populates the model with the user's data, otherwise the model is empty. 

```javascript
user.currentUser()
.then(function(){
  user.get('displayName');
})
```

<a name="User.isLogged"></a>
###isLogged()
The isLogged method return a boolean 
```javascript
var status = user.isLogged();
```
<a name="User.login"></a>
###login()
The login method can be used for logging in with:
* third party services
* Authentication with email and password

####Third party services login (service)
You can use this method for logging users with third party services by passing the service as first and only parameter.
This method make a redirect to login endpoint. It not return a promise!

```javascript
user.login('facebook')
```
#####Available services
You can use one of the following as parameter for logging in with third party service:
   
* Facebook
* Google
* Twitter
* Dropbox
* Linkedin
* Instagram
* Github
* Angel List

#### Authentication with email and password
Authentication with email and password. you can use the login method in this way.

```javascript
user.login('email@provider.com', 'mySecret')
.then(function(){
  user.get('displayName');
});  
```
Note that for this kind of login you have to [register](#signupdata) the user first. 
 <a name="User.signup"></a>
###signup()
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
 <a name="User.logout"></a>
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
## Cobject additional methods
The Stamplay.Cobject.Model inherits all the [Action](#action-methods) methods.

```javascript
tag.vote()
.then(function(){
  var actions = tag.get('actions');
  console.log(actions.votes); // You can see the number of votes and who has already voted
});
```

#Webhook

You cannot create a Model or Collection of a WebHook.

Webhook has the following additional methods.

  * <a href="#Webhook.post"><code>post()</code></a>

-------------------------------------------------------

<a name="Webhook.post"></a>
###Post

It's a simple method to make a POST call to webhook 

```javascript
var webhook = new Stamplay.Webhook('myWebHook2');
var data = { foo: 'bar' }
webhook.post(data).then(function (response) {
  //do what you want with the response
});
```


# Build
To build a production ready library you need to have NPM and Bower installed and then run those two commands:

```bash
npm install && bower install
grunt build
```
# CDN delivery
To load the Stamplay SDK from the Amazon's Cloudfront content distribution network just include the following in your page:

```HTML
<script src="//drrjhlchpvi7e.cloudfront.net/libs/stamplay-js-sdk/0.0.12/stamplay.min.js"></script>
```
