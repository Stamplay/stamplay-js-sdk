<img src="https://editor.stamplay.com/img/logo-robot-no-neck.png" align="left" width="170px" height="160px"/>
<img align="left" width="0" height="160px" hspace="10"/>

> #Stamplay JavaScript SDK

[![Build Status](https://travis-ci.org/Stamplay/stamplay-js-sdk.svg?branch=master)](https://travis-ci.org/Stamplay/stamplay-js-sdk)
[![Production version](http://img.shields.io/badge/download-47%20kB-blue.svg)](https://raw.githubusercontent.com/Stamplay/stamplay-js-sdk/master/dist/stamplay.min.js)
[![Bower version](https://badge.fury.io/bo/stamplay-js-sdk.svg)](http://badge.fury.io/bo/stamplay-js-sdk)
[![Code Climate](https://codeclimate.com/github/Stamplay/stamplay-js-sdk/badges/gpa.svg)](https://codeclimate.com/github/Stamplay/stamplay-js-sdk)

This library  gives you access to the powerful Stamplay cloud platform from your JavaScript app. For more info on Stamplay and its features, see the <a href="https://stamplay.com">website</a> or the JavaScript guide
<br>

##Getting Started
The SDK is available for download on our website or on our CDN. To get started import the library in your project and initialize it by calling `init` function with your `appId`
```HTML
<script src="https://drrjhlchpvi7e.cloudfront.net/libs/stamplay-js-sdk/2.0/stamplay.min.js"></script>
<script> Stamplay.init("APPID"); </script>
```

##How to use it
Register a new user:
```javascript
var data = {
	"email":"john@stamplay.com",
	"password":"john123"
}
Stamplay.User.signup(data, function(error, result){
	//manage the result and the error
})
```
Store data using Objects:
```javascript
var data = {
	"description":"A description",
	"title":"New title"
}
Stamplay.Object('foo').save(data, function(error, result){
	//manage the result and the error
})
```
Skip the callback to get a promise back
```javascript
var data = {
	"description":"A description",
	"title":"New title"
}
Stamplay.Object('foo').save(data).then(function(result){
	//manage the result
},function(error){
	//manage the error
})
```

##Available components
This JavaScript SDK expose the following components:
 
* [User](#user)
	* <a href="#User.save"> <code>save(data, [callback])</code></a>
  * <a href="#User.get"> <code>get(data, [callback])</code></a>
  * <a href="#User.remove"> <code>remove(id, [callback])</code></a>
  * <a href="#User.update"> <code>update(id, data, [callback] )</code></a>
  * <a href="#User.currentUser"> <code>currentUser([callback])</code></a>
  * <a href="#User.login"><code>login(data, [callback])</code></a>
  * <a href="#User.socialLogin"><code>socialLogin(provider)</code></a>
  * <a href="#User.signup"><code>signup(data, [callback])</code></a>
  * <a href="#User.logout"><code>logout()</code></a>
  * <a href="#User.resetPassword"><code>resetPassword(data, [callback])</code></a>
  * <a href="#User.getRoles"><code>getRoles([callback])</code></a>
  * <a href="#User.getRole"><code>getRole(id, [callback])</code></a>
  * <a href="#User.follow"><code>follow(id, [callback])</code></a>
  * <a href="#User.unfollow"><code>unfollow(id, [callback])</code></a>
  * <a href="#User.followedBy"><code>followedBy(id, [callback])</code></a>
  * <a href="#User.following"><code>following(id, [callback])</code></a>
  * <a href="#User.activities"><code>activities(id, [callback])</code></a>
* [Object](#custom-object)
	* <a href="#custom-object.save"> <code>save(data, [callback])</code></a>
	* <a href="#custom-object.get"> <code>get(data, [callback])</code></a>
	* <a href="#custom-object.remove"> <code>remove(id, [callback])</code></a>
	* <a href="#custom-object.update"> <code>update(id, data, [callback])</code></a>
	* <a href="#custom-object.patch"> <code>patch(id, data, [callback])</code></a>
	* <a href="#custom-object.findByCurrentUser"> <code>findByCurrentUser([attr], [callback])</code></a>
	* <a href="#custom-object.upVote"> <code>upVote(id, [callback])</code></a>
	* <a href="#custom-object.downVote"> <code>downVote(id, [callback])</code></a>
	* <a href="#custom-object.rate"> <code>rate(id, rate, [callback])</code></a>
	* <a href="#custom-object.comment"> <code>comment(id, text, [callback])</code></a>
* [Code Block](#codeblock)
	* <a href="#codeblock.run"> <code>run(data, queryParams, [callback])</code></a> 
* [Webhook](#webhook)
	* <a href="#webhook.post"> <code>post(data, [callback])</code></a> 
* [Stripe](#stripe)
	* <a href="#stripe.charge"> <code>charge(userId, token, amount, currency, [callback])</code></a> 
	* <a href="#stripe.createCreditCard"> <code>createCreditCard(userId, token, [callback])</code></a> 
	* <a href="#stripe.createCustomer"> <code>createCustomer(userId, [callback])</code></a> 
	* <a href="#stripe.createSubscription"> <code>createSubscriptionuserId, planId, [callback])</code></a> 
	* <a href="#stripe.deleteSubscription"> <code>deleteSubscription(userId, subscriptionId, options, [callback])</code></a> 
	* <a href="#stripe.getCreditCard"> <code>getCreditCard(userId, [callback])</code></a> 
	* <a href="#stripe.getSubscription"> <code>getSubscription(userId, subscriptionId, [callback])</code></a> 
	* <a href="#stripe.getSubscriptions"> <code>getSubscriptions(userId, options, [callback])</code></a> 
	* <a href="#stripe.updateCreditCard"> <code>updateCreditCard(userId, token, [callback])</code></a> 
	* <a href="#stripe.updateSubscription"> <code>updateSubscription(userId, subscriptionId, options, [callback])</code></a> 

Also this components the sdk have some support objects to help you in common operation:

* [Query](#query)
	* <a href="#query.greaterThan"> <code>greaterThan(attr, value)</code></a> 
	* <a href="#query.greaterThanOrEqual"> <code>greaterThanOrEqual(attr, value)</code></a> 
	* <a href="#query.lessThan"> <code>lessThan(attr, value)</code></a> 
	* <a href="#query.lessThanOrEqual"> <code>lessThanOrEqual(attr, value)</code></a> 
	* <a href="#query.between"> <code>between(attr, value1, value2)</code></a> 
	* <a href="#query.equalTo"> <code>equalTo(attr, value)</code></a> 
	* <a href="#query.exists"> <code>exists(attr)</code></a> 
	* <a href="#query.notExists"> <code>notExists(attr)</code></a> 
	* <a href="#query.sortAscending"> <code>sortAscending(attr)</code></a> 
	* <a href="#query.sortDescending"> <code>sortDescending(attr)</code></a> 
	* <a href="#query.or"> <code>or(query,..)</code></a> 
	* <a href="#query.exec"> <code>exec([callback])</code></a> 


-------------------------------------------------------

# Build
To build a production ready library you need to have NPM and Bower installed and then run those two commands:

```bash
npm install && bower install
grunt build
```
You can also download this project and using all the precompiled files in src folder

# One more thing
Go to [API Reference](https://stamplay.com/docs/jssdk/v2/reference) to see a lot of examples.
Enjoy!
<img align="right" src="https://editor.stamplay.com/img/logo-robot-no-neck.png" height=60>

