# Stamplay JS SDK Changelog

1.3.1 / 20-10-2015
===================

* Third party logins send authentication information in short duration cookie in order to merge logged user information with third party informations

1.3.0 / 15-10-2015
===================

* Added Codeblock integration
* Webhooks can handle query parameters

1.2.9 / 09-09-2015
===================

* Redirect for social login in local environment now have the port 

1.2.8 / 20-08-2015
===================

* Added stripe.updateCreditCard method 

1.2.7 / 17-08-2015
===================

* Added stripe.getCreditCard method 

1.2.6 / 06-08-2015
===================

* Added code climate
* Added findByAttr method on Custom Object Collection

1.2.5 / 30-07-2015
===================

* Fix fetchParameter(2)

1.2.4 / 30-07-2015
===================

* Fix fetchParameter

1.2.3  / 29-07-2015
===================

* Added resetPassword method on user
* Added populate method for queryParams
* Added populateOwner method for queryParams

1.2.2  / 09-07-2015
===================

* Query.or method accept also array
* Fix

1.2.1  / 09-07-2015
===================

* Added createSubscription method on Stripe
* Added getSubscriptions method on Stripe
* Added getSubscription method on Stripe
* Added deleteSubscription method on Stripe
* Added updateSubscription method on Stripe
* All xhr requests use application/json content type
* When a user is destroyed logs out 

1.2.0  / 26-06-2015
=================

* Added Follow method on User
* Added Unfollow method on User
* Added Activities method on User
* Added Following method on User
* Added FollowedBy method on User


1.1.0  / 22-06-2015
=================

* Added Stripe integration

1.0.0  / 3-06-2015
=================

* Fix bugs
* Improve stability
* Added JWT 

0.0.12  / 21-04-2015
=================

* Added between method on query
* Remove get and put method on webhook

0.0.10  / 20-03-2015
=================

* Added sort method on query

0.0.9 / 
=================

* Fix comment method
* Added header attribute on Collection (see pagination and totalElements obj)
* Added count method
* Modify the return of Query.exec() 
* Added initialization method on collection

0.0.6 / 03-03-2015 
==================

* Added underscore method to Collection and Model, added total element and link to collection for handle the pagination 

0.0.4 / 19-02-2015
==================

* Fix save method on Model Component

0.0.3 / 08-01-2015
==================

* Added Query object to make to easy use query and webHook component 

0.0.2 / 19-09-2014
==================

* Added getComments, getVotes, getRatings functions to Model

0.0.1 / 05-09-2014
==================

* First implementation of Cobject, User
* First implementation of Model and Collection
