<img style="float: left" src="https://editor.stamplay.com/img/logo-robot-no-neck.png" height=60>
Stamplay JavaScript SDK API v1.x 
===============
[![Build Status](https://travis-ci.org/Stamplay/stamplay-js-sdk.svg?branch=master)](https://travis-ci.org/Stamplay/stamplay-js-sdk)
[![Production version](http://img.shields.io/badge/download-52%20kB-blue.svg)](https://raw.githubusercontent.com/Stamplay/stamplay-js-sdk/master/dist/stamplay.min.js)
[![Bower version](https://badge.fury.io/bo/stamplay-js-sdk.svg)](http://badge.fury.io/bo/stamplay-js-sdk)
[![Code Climate](https://codeclimate.com/github/Stamplay/stamplay-js-sdk/badges/gpa.svg)](https://codeclimate.com/github/Stamplay/stamplay-js-sdk)
##Full API Reference
[API Reference](https://stamplay.com/docs/jssdk)

## API v0 support 
If you're using Stamplay API v0 you should use the javascript sdk in the [apis-v0 branch](https://github.com/Stamplay/stamplay-js-sdk/tree/apis-v0) 

##Getting Started
The Stamplay JavaScript SDK provides a JavaScript library making it even easier to access the Stamplay cloud platform. On this initial release the SDK let you work with the most important and flexible components of our platform: `User` , `Custom Objects` , `Webhook` and `Stripe` .To enable support for Stamplay-related functions in your web app, you'll need to include `stamplay.min.js` in your app. 
To do this, add the following to the head block of your HTML:

```HTML
<script src="https://drrjhlchpvi7e.cloudfront.net/libs/stamplay-js-sdk/1.3.1/stamplay.min.js"></script>
```
To use its functionalities inside browsers, a window scoped variable called `Stamplay` is created.

To initialize the SDK make sure to call the `init` function with your appId (not mandatory but highly suggested, mandatory if you're on different domain than *.stamplayapp.com).

```javascript
//APPID is the appId of your app on Stamplay's Editor
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
* [Codeblock](#codeblock)
* [WebHook](#webhook)
* [Stripe](#stripe)

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

  * <code>get()</code>
  * <code>set()</code>
  * <code>unset</code>
  * <code>fetch()</code>
  * <code>destroy()</code>
  * <code>save()</code>

###Action methods
Some models have built-in social actions and the SDK provides a fast way to ```rate```, ```upvote```, ```downvote``` and ```comment``` a resource. Models with social actions also give you a way to track how many times they have been shared on Twitter and Facebook. All these methods return a promise.

  * <code>upVote()</code>
  * <code>downVote()</code>
  * <code>rate()</code>
  * <code>comment()</code>
  * <code>getComments()</code>
  * <code>getVotes()</code>
  * <code>getRatings()</code>

```javascript
var tag = new Stamplay.Cobject('tag').Model;
tag.fetch(validId).then(function(){
  return tag.rate(4)
}).then(function(){
  var actions = tag.get('actions');
  console.log(actions.ratings); // You can see the ratings, the average rate and the users who rated
});
```

-------------------------------------------------------

 
# Collection
Collections are sets of models. You can ```fetch``` the collection from the server and a set of Underscore methods.   

##Methods

  * <code>fetch()</code>
  * <code>remove()</code>
  * <code>get()</code>
  * <code>at()</code>
  * <code>pop()</code>
  * <code>shift()</code>
  * <code>add()</code>

-------------------------------------------------------

<a name="FetchParams"></a>
The Collection has some other methods, we call those FetchParams
These help you to create a more flexible and complex fetch object.

##FetchParams

  * <code>equalTo()</code>
  * <code>limit()</code>
  * <code>select()</code>
  * <code>sortAscending()</code>
  * <code>sortDescending()</code>
  * <code>pagination()</code>
  * <code>populate()</code>
  * <code>populateOwner()</code>


-------------------------------------------------------

##Pipeline

If you want create a more complex params you could use all methods, check this example:

```javascript
var coll = new Stamplay.Cobject('tag').Collection
coll.equalTo('name','foo').limit(10).sortAscending('description');
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

  * <code>greaterThan()</code>
  * <code>greaterThanOrEqual()</code>
  * <code>lessThan()</code>
  * <code>lessThanOrEqual()</code>
  * <code>between()</code>
  * <code>equalTo()</code>
  * <code>exists()</code>
  * <code>notExists()</code>
  * <code>sortAscending()</code>
  * <code>sortDescending()</code>
  * <code>or()</code>
  * <code>exec()</code>
  

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

You can assign both a Model and a Collection to Stamplay.User.

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
  * <a href="#User.resetPassword"><code>resetPassword()</code></a>
  * <a href="#User.follow"><code>follow()</code></a>
  * <a href="#User.unfollow"><code>unfollow()</code></a>
  * <a href="#User.followedBy"><code>followedBy()</code></a>
  * <a href="#User.following"><code>following()</code></a>
  * <a href="#User.activities"><code>activities()</code></a>

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
 <a name="User.resetPassword"></a>
###resetPassword()
Reset the password of User

```javascript
user.resetPassword('john@stamplay.com','1234').then(function(){
  //success callback
})
```
 <a name="User.follow"></a>
###follow()
Create relation between logged user and other user

```javascript
user.follow(_ID_OF_OTHER_USER).then(function(otherUser){
  console.log(otherUser)
});
```
<a name="User.unfollow"></a>
###unfollow()
Delete relation between logged user and other user

```javascript
user.unfollow(_ID_OF_OTHER_USER).then(function(otherUser){
  console.log(otherUser)
});
```

<a name="User.followedBy"></a>
###followedBy()
Return the users that follow the user with the specified userId.

```javascript
user.followedBy(_ID_OF_USER).then(function(users){
  console.log(users)
});
```
<a name="User.following"></a>
###following()
Return the users that the user with the specified userId is following.

```javascript
user.following(_ID_OF_USER).then(function(users){
  console.log(users)
});
```
<a name="User.activities"></a>
###activities()
Return all activities of a user

```javascript
user.activities(_ID_OF_USER).then(function(activities){
  console.log(activities)
});
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
#Codeblock

You cannot create a Model or Collection of a Codeblock.

Codeblock has the following method:

  * <a href="#Codeblock.run"><code>run(body, queryParameters)</code></a>

<a name="Codeblock.run"></a>
###Run

It's a method to make an API call in order to execute a Codeblock.
It takes two arguments : 
  * body : an Object that has to be sent 
  * queryParameters : query parameters

```javascript
var codeblock = new Stamplay.Codeblock('codeblockId');
var body = {
  bodyProp : "bodyProp"
};
var queryParameter = {
  q1 : "q1"
};
codeblock.run(body, queryParameter).then(function (response) {
  //do what you want with the response
});
```

#Webhook

You cannot create a Model or Collection of a WebHook.

Webhook has the following methods:

  * <a href="#Webhook.post"><code>post()</code></a>
  * <a href="#Webhook.put"><code>put()</code></a>
  * <a href="#Webhook.get"><code>get()</code></a>

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
<a name="Webhook.put"></a>
###Put

It's a simple method to make a PUT call to webhook 

```javascript
var webhook = new Stamplay.Webhook('myWebHook2');
var data = { foo: 'bar' }
webhook.put(data).then(function (response) {
  //do what you want with the response
});
```
<a name="Webhook.get"></a>
###Get

It's a simple method to make a GET call to webhook 

```javascript
var webhook = new Stamplay.Webhook('myWebHook2');
webhook.get(data).then(function (response) {
  //do what you want with the response
});
```

#Stripe

You cannot create a Model or Collection of a Stripe.
IMPORTANT: You must import Stripe javascript library if you want use Stripe component [Stripe js](https://stripe.com/docs/stripe.js).
Stripe has the following additional methods.

  * <a href="#Stripe.createCustomer"><code>createCustomer()</code></a>
  * <a href="#Stripe.createCreditCard"><code>createCreditCard()</code></a>
  * <a href="#Stripe.updateCreditCard"><code>updateCreditCard()</code></a>
  * <a href="#Stripe.getCreditCard"><code>getCreditCard()</code></a>
  * <a href="#Stripe.charge"><code>charge()</code></a>
  * <a href="#Stripe.createSubscription"><code>createSubscription()</code></a>
  * <a href="#Stripe.getSubscriptions"><code>getSubscriptions()</code></a>
  * <a href="#Stripe.getSubscription"><code>getSubscription()</code></a>
  * <a href="#Stripe.updateSubscription"><code>updateSubscription()</code></a>
  * <a href="#Stripe.deleteSubscription"><code>deleteSubscription()</code></a>

-------------------------------------------------------

<a name="Stripe.createCustomer"></a>
###createCustomer

It's a simple method to make a POST call to create customer 

```javascript
var stamplayStripe = new Stamplay.Stripe();
stamplayStripe.createCustomer('_ID of user').then(function (response) {
  //do what you want with the response
});
```

<a name="Stripe.createCreditCard"></a>
###createCreditCard

It's a simple method to make a POST call to create CreditCard 

```javascript
var stamplayStripe = new Stamplay.Stripe();
stamplayStripe.createCreditCard('_ID of user', 'TOKEN from stripe js').then(function (response) {
  //do what you want with the response
});
```
<a name="Stripe.updateCreditCard"></a>
###updateCreditCard

It's a simple method to make a PUT call to update user's credit card. 

```javascript
var stamplayStripe = new Stamplay.Stripe();
stamplayStripe.updateCreditCard('_ID of user', 'OKEN from stripe js').then(function (response) {
  //do what you want with the response
});
```
<a name="Stripe.getCreditCard"></a>
###getCreditCard

It's a simple method to make a GET call to get user's credit card. Note that you can get only the credit card of the logged user.

```javascript
var stamplayStripe = new Stamplay.Stripe();
stamplayStripe.getCreditCard('_ID of user').then(function (response) {
  //do what you want with the response
});
```

<a name="Stripe.charge"></a>
###charge

It's a simple method to make a POST call to charge customer 

```javascript
var stamplayStripe = new Stamplay.Stripe();
// Four parameters: id of user, token from stripe, amount of charge , currency 
stamplayStripe.charge('_ID of user', 'TOKEN from stripe js', 3000, 'GBP').then(function (response) {
  //do what you want with the response
});
```

<a name="Stripe.createSubscription"></a>
###createSubscription

It's a simple method to make a POST call to create a subscription. 

```javascript
var stamplayStripe = new Stamplay.Stripe();
// Two parameters: id of user, plan id
stamplayStripe.createSubscription('_ID of user', 'planId').then(function (response) {
  //do what you want with the response
});
```

<a name="Stripe.getSubscriptions"></a>
###getSubscriptions

It's a simple method to make a GET call to get user's subscriptions. 

```javascript
var stamplayStripe = new Stamplay.Stripe();
// Two parameters: id of user, [options]
stamplayStripe.getSubscriptions('_ID of user').then(function (response) {
  //do what you want with the response
});
```

<a name="Stripe.getSubscription"></a>
###getSubscription

It's a simple method to make a GET call to get an user's subscription. 

```javascript
var stamplayStripe = new Stamplay.Stripe();
// Two parameters: id of user, id of the subscription
stamplayStripe.getSubscription('_ID of user','_ID of the subscription').then(function (response) {
  //do what you want with the response
});
```

<a name="Stripe.updateSubscription"></a>
###updateSubscription

It's a simple method to make a PUT call to update an existing user's subscription.
Options are [Stripe's options](https://stripe.com/docs/api/node#update_subscription)

```javascript
var stamplayStripe = new Stamplay.Stripe();
// Three parameters: id of user, id of the subscription, [options]
stamplayStripe.updateSubscription('_ID of user','_ID of the subscription').then(function (response) {
  //do what you want with the response
});
```

<a name="Stripe.deleteSubscription"></a>
###deleteSubscription

It's a simple method to make a DELETE call to remove an existing user's subscription.
Options are [Stripe's options](https://stripe.com/docs/api/node#cancel_subscription)

```javascript
var stamplayStripe = new Stamplay.Stripe();
// Three parameters: id of user, id of the subscription, [options]
stamplayStripe.deleteSubscription('_ID of user','_ID of the subscription').then(function (response) {
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
<script src="https://drrjhlchpvi7e.cloudfront.net/libs/stamplay-js-sdk/1.3.1/stamplay.min.js"></script>
```

# One more thing
Go to [API Reference](https://stamplay.com/docs/jssdk) to see a lot of examples.
Enjoy!
