// This file tests the contract defined by the interfaces in stamplay.d.ts against the examples provided by the Stamplay docs
// Necessary condition (but not sufficient..) for the definition file to be correct is that these examples can be transpiled to javascript without errors by the TypeScript compiler.

// To run the test, use command "tsc stamplay.tests.ts"

// Note that the below examples are in the same order as they appear on the Stamplay docs website

import * as Stamplay from "./stamplay";

var car = {
    make: "Volkswagen",
    model: "Jetta",
    year: 2013,
    color: "silver",
    top_speed: 140
}

Stamplay.Object("car").save(car)
    .then(function (res) {
        // success
    }, function (err) {
        // error
    })

Stamplay.Object("car").get({})
    .then(function (res) {
        // success
    }, function (err) {
        // error
    })

var credentials = {
    email: "user@provider.com",
    password: "123123"
};

Stamplay.User.signup(credentials)
    .then(function (res) {
        // success
    }, function (err) {
        // error
    })

var credentials = {
    email: "user@provider.com",
    password: "123123"
}

Stamplay.User.login(credentials)
    .then(function (res) {
        // success
    }, function (err) {
        // error
    })

Stamplay.Object("movie").get({
    page: 2,
    per_page: 30
}).then(function (res) {
    // success
}, function (err) {
    // error
})

Stamplay.Object("picture")
    .get({ status: "published" })
    .then(function (res) {
        // success
    }, function (err) {
        // error
    })

Stamplay.Object("movie").get({ sort: "-dt_create" })
    .then(function (res) {
        // success
    }, function (err) {
        // error
    })

Stamplay.Object("movie").get({ select: "dt_create,owner,title" })
    .then(function (res) {
        // success
    }, function (err) {
        // error
    })

Stamplay.Object("movie")
    .get({ populate: true })
    .then(function (res) {
        // success
    }, function (err) {
        // error
    })

Stamplay.Object("movie")
    .get({ where: JSON.stringify({ rating: { $gt: 5 } }) })
    .then(function (res) {
        // success
    }, function (err) {
        // error
    })

var credentials = {
    email: "user@stamplay.com",
    password: "my_password"
}

Stamplay.User.signup(credentials)
    .then(function (res) {
        // success
    }, function (err) {
        // error  
    })

var credentials = {
    email: "user@stamplay.com",
    password: "my_password"
}

Stamplay.User.login(credentials)
    .then(function (res) {
        // success
    }, function (err) {
        // error  
    })

Stamplay.init("APP-ID", {
    isMobile: true,
    absoluteUrl: true,
    autorefreshSocialLogin: false
})

Stamplay.User.socialLogin("facebook")

var emailAndNewPass = {
    email: "user@stamplay.com",
    newPassword: "stamplay_rocks!"
}
Stamplay.User.resetPassword(emailAndNewPass)
    .then(function (res) {
        // success
    }, function (err) {
        // error
    })

//sync
Stamplay.User.logout();

//async
Stamplay.User.logout(true, function (err, res) {

})

Stamplay.User.currentUser()
    .then(function (res) {
        // success
    }, function (err) {
        // error
    })

Stamplay.User.get({ _id: "user_id" })
    .then(function (res) {
        // success
    }, function (err) {
        // error
    })

Stamplay.User.get({})
    .then(function (res) {
        // success
    }, function (err) {
        // error
    })

var query = {
    name: "John",
    age: 30
}

Stamplay.User.get(query)
    .then(function (res) {
        // success
    }, function (err) {
        // error
    })

var updatedInfo = {
    name: "John",
    age: 30
}

Stamplay.User.update("user_id", updatedInfo)
    .then(function (res) {
        // success
    }, function (err) {
        // error
    })

Stamplay.User.remove("user_id")
    .then(function (res) {
        // success
    }, function (err) {
        // error
    })

Stamplay.User.getRoles()
    .then(function (res) {
        // success
    }, function (err) {
        // error
    })

Stamplay.User.getRole("role_Id")
    .then(function (res) {
        // success
    }, function (err) {
        // error
    })

Stamplay.User.setRole("userId", "role_id")
    .then(function (res) {
        // success
    }, function (err) {
        // error
    })

var data = {
    title: "Hello World",
    year: 2016
}

Stamplay.Object("movie").save(data)
    .then(function (res) {
        // success
    }, function (err) {
        // error
    })

Stamplay.Object("movie").get({ _id: "object_id" })
    .then(function (res) {
        // success
    }, function (err) {
        // error
    })

Stamplay.Object("movie").get({})
    .then(function (res) {
        // success
    }, function (err) {
        // error
    })

var query2 = {
    year: 1998
}

Stamplay.Object("movie").get(query2)
    .then(function (res) {
        // success
    }, function (err) {
        // error
    })

Stamplay.Object("movie").findByCurrentUser('director')
    .then(function (res) {
        // Success
    }, function (err) {
        // Error
    })

var data2 = {
    "title": "Goodbye World"
}

Stamplay.Object("movie").patch("object_id", data2)
    .then(function (res) {
        // success
    }, function (err) {
        // error
    })

var data3 = {
    "title": "Goodbye World"
}

Stamplay.Object("movie").update("object_id", data3)
    .then(function (res) {
        // success
    }, function (err) {
        // error
    })

Stamplay.Object("movie").remove("object_id")
    .then(function (res) {
        // success
    }, function (err) {
        // error
    })

Stamplay.Object("movie").push("object_id", "characters", "57cf08e362641ca813b1ae6c")
    .then(function (res) {
        // success
    }, function (err) {
        // error
    })

Stamplay.Object("movie").get({ populate: true })
    .then(function (res) {
        // success
    }, function (err) {
        // error
    })

// returns records where the rating is greater than 4
Stamplay.Query('object', 'movie')
    .greaterThan('actions.ratings.total', 4)
    .exec()
    .then(function () {
        // success
    }, function (err) {
        // error
    })

// returns records that were created after January 15, 2015
Stamplay.Query('object', 'movie')
    .greaterThan('dt_create', "2015-01-15T08:00:00.000Z")
    .exec()
    .then(function () {
        // success
    }, function (err) {
        // error
    })

// returns records with a rating of 4 or greater
Stamplay.Query('object', 'movie')
    .greaterThanOrEqual('actions.ratings.total', 4)
    .exec()
    .then(function () {
        // success
    }, function (err) {
        // error
    })

// returns records that were last updated on or after April 11, 2012
Stamplay.Query('object', 'movie')
    .greaterThanOrEqual('dt_update', "2012-04-11T07:00:00.000Z")
    .exec()
    .then(function () {
        // success
    }, function (err) {
        // error
    })


// returns records with a rating of less than 4
Stamplay.Query('object', 'movie')
    .lessThan('actions.ratings.total', 4)
    .exec()
    .then(function () {
        // success
    }, function (err) {
        // error
    })

// returns records that were created before January 15, 2015
Stamplay.Query('object', 'movie')
    .lessThan('actions.ratings.total', 4)
    .exec()
    .then(function () {
        // success
    }, function (err) {
        // error
    })


// returns records with a rating of 4 or less
Stamplay.Query('object', 'movie')
    .lessThanOrEqual('actions.ratings.total', 4)
    .exec()
    .then(function () {
        // success
    }, function (err) {
        // error
    })

// returns records that were last updated on or before April 11, 2012
Stamplay.Query('object', 'movie')
    .lessThanOrEqual('dt_update', "2012-04-11T07:00:00.000Z")
    .exec()
    .then(function () {
        // success
    }, function (err) {
        // error
    })

Stamplay.Query("object", "cobject_id")
    .select("title", "actions.ratings.total")
    .exec()
    .then(function () {
        // success
    }, function (err) {
        // error
    })

// sort by title in ascending order
Stamplay.Query("object", "cobject_id")
    .sortAscending("title")
    .exec()
    .then(function () {
        // success
    }, function (err) {
        // error
    })

// sort by title in descending order
Stamplay.Query("object", "cobject_id")
    .sortDescending("title")
    .exec()
    .then(function () {
        // success
    }, function (err) {
        // error
    })

Stamplay.Query('object', 'question')
    .regex('title', '^Star', 'i')
    .exec()
    .then(function (res) {
        // success
    }, function (err) {
        // error
    })

var ratedFourOrMore = Stamplay.Query("object", "movie");
var titleIsStarWars = Stamplay.Query("object", "movie");

ratedFourOrMore.greaterThanOrEqual("actions.ratings.total", 4);
titleIsStarWars.equalTo("title", "Star Wars");

var combinedQuery = Stamplay.Query("object", "movie");
combinedQuery.or(ratedFourOrMore, titleIsStarWars);

combinedQuery.exec()
    .then(function (res) {
        // success
    }, function (err) {
        // error
    })

Stamplay.Query("object", "movie")
    .geoWithinGeometry('Polygon',
    [
        [[-70, 40], [-72, 40], [-72, 50], [-70, 50], [-70, 40]]
    ]).exec()
    .then(function (res) {
        // success
    }, function (err) {
        // error
    })

Stamplay.Query("object", "movie")
    .geoIntersects('Point', [74.0059, 40.7127])
    .exec()
    .then(function (res) {
        // success
    }, function (err) {
        // error
    })

Stamplay.Query("object", "dinners")
    .near('Point', [74.0059, 40.7127], 500)
    .exec()
    .then(function (res) {
        // success
    }, function (err) {
        // error
    })

Stamplay.Query("object", "dinners")
    .nearSphere('Point', [74.0059, 40.7127], 1000)
    .exec()
    .then(function (res) {
        // success
    }, function (err) {
        // error
    })

Stamplay.Object("movie").downVote("object_id")
    .then(function (res) {
        // success
    }, function (err) {
        // error
    })

Stamplay.Object("movie").upVote("object_id")
    .then(function (res) {
        // success
    }, function (err) {
        // error
    })

var txt = "comment text goes here";

Stamplay.Object("movie").comment("object_id", txt)
    .then(function (res) {
        // success
    }, function (err) {
        // error
    })


Stamplay.Object("movie").rate("object_id", 5)
    .then(function (res) {
        // success
    }, function (err) {
        // error
    })

var data4 = { message: "Hello" }
var params = { name: "Stamplay", bar: "foo" }

//Stamplay.Codeblock("codeblock_name").run() sends a POST request by default

Stamplay.Codeblock("codeblock_name").run(data4, params)
    .then(function (err) {
        // success
    }, function (err) {
        // error
    })

var params1 = { name: "Stamplay" }
//GET
Stamplay.Codeblock("codeblock_name").get(params1, function (err, res) {
    // manage the response and the error
})

//POST
var data5 = { bodyparam: "Stamplay" }

Stamplay.Codeblock("codeblock_name").post(data5)
    .then(function (err) {
        // success
    }, function (err) {
        // error
    })

//PUT
Stamplay.Codeblock("codeblock_name").put(data)
    .then(function (err) {
        // success
    }, function (err) {
        // error
    })

//PATCH
Stamplay.Codeblock("codeblock_name").patch(data)
    .then(function (err) {
        // success
    }, function (err) {
        // error
    })

Stamplay.Webhook("webhook_id")
    .post({ name: "Johne" })
    .then(function (res) {
        // success
    }, function (err) {
        // error
    })

Stamplay.Stripe.createCustomer("userId")
    .then(function (res) {
        // success
    },
    function (err) {
        // error
    })

Stamplay.Stripe.getSubscription("userId",
    "subscriptionId")
    .then(function (res) {
        // success
    },
    function (err) {
        // error
    })

Stamplay.Stripe.getSubscriptions("userId",
    { someOption: "value" })
    .then(function (res) {
        // success
    },
    function (err) {
        // error
    })

Stamplay.Stripe.createSubscription("userId",
    "planId")
    .then(function (res) {
        // success
    },
    function (err) {
        // error
    })

Stamplay.Stripe.updateSubscription("userId", "planId",
    { plan: "subscription_one" })
    .then(function (res) {
        // success
    },
    function (err) {
        // error
    })

Stamplay.Stripe.deleteSubscription("userId",
    "planId")
    .then(function (res) {
        // success
    },
    function (err) {
        // error
    })

Stamplay.Stripe.getCreditCard("userId")
    .then(function (res) {
        // success
    },
    function (err) {
        // error
    })

Stamplay.Stripe.createCreditCard("userId",
    "token")
    .then(function (res) {
        // success
    },
    function (err) {
        // error
    })

Stamplay.Stripe.updateCreditCard("userId",
    "token")
    .then(function (res) {
        // success
    },
    function (err) {
        // error
    })

Stamplay.Stripe.charge("userId",
    "token",
    "amount",
    "currency")
    .then(function (res) {
        // Success
    },
    function (err) {
        // Handle Error
    });