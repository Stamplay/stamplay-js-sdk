/*! Stamplay v2.1.4 | (c) 2016 Stamplay */// vim:ts=4:sts=4:sw=4:
/*!
 *
 * Copyright 2009-2012 Kris Kowal under the terms of the MIT
 * license found at http://github.com/kriskowal/q/raw/master/LICENSE
 *
 * With parts by Tyler Close
 * Copyright 2007-2009 Tyler Close under the terms of the MIT X license found
 * at http://www.opensource.org/licenses/mit-license.html
 * Forked at ref_send.js version: 2009-05-11
 *
 * With parts by Mark Miller
 * Copyright (C) 2011 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

(function (definition) {
    "use strict";

    // This file will function properly as a <script> tag, or a module
    // using CommonJS and NodeJS or RequireJS module formats.  In
    // Common/Node/RequireJS, the module exports the Q API and when
    // executed as a simple <script>, it creates a Q global instead.

    // Montage Require
    if (typeof bootstrap === "function") {
        bootstrap("promise", definition);

    // CommonJS
    } else if (typeof exports === "object" && typeof module === "object") {
        module.exports = definition();

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
        define(definition);

    // SES (Secure EcmaScript)
    } else if (typeof ses !== "undefined") {
        if (!ses.ok()) {
            return;
        } else {
            ses.makeQ = definition;
        }

    // <script>
    } else if (typeof window !== "undefined" || typeof self !== "undefined") {
        // Prefer window over self for add-on scripts. Use self for
        // non-windowed contexts.
        var global = typeof window !== "undefined" ? window : self;

        // Get the `window` object, save the previous Q global
        // and initialize Q as a global.
        var previousQ = global.Q;
        global.Q = definition();

        // Add a noConflict function so Q can be removed from the
        // global namespace.
        global.Q.noConflict = function () {
            global.Q = previousQ;
            return this;
        };

    } else {
        throw new Error("This environment was not anticipated by Q. Please file a bug.");
    }

})(function () {
"use strict";

var hasStacks = false;
try {
    throw new Error();
} catch (e) {
    hasStacks = !!e.stack;
}

// All code after this point will be filtered from stack traces reported
// by Q.
var qStartingLine = captureLine();
var qFileName;

// shims

// used for fallback in "allResolved"
var noop = function () {};

// Use the fastest possible means to execute a task in a future turn
// of the event loop.
var nextTick =(function () {
    // linked list of tasks (single, with head node)
    var head = {task: void 0, next: null};
    var tail = head;
    var flushing = false;
    var requestTick = void 0;
    var isNodeJS = false;
    // queue for late tasks, used by unhandled rejection tracking
    var laterQueue = [];

    function flush() {
        /* jshint loopfunc: true */
        var task, domain;

        while (head.next) {
            head = head.next;
            task = head.task;
            head.task = void 0;
            domain = head.domain;

            if (domain) {
                head.domain = void 0;
                domain.enter();
            }
            runSingle(task, domain);

        }
        while (laterQueue.length) {
            task = laterQueue.pop();
            runSingle(task);
        }
        flushing = false;
    }
    // runs a single function in the async queue
    function runSingle(task, domain) {
        try {
            task();

        } catch (e) {
            if (isNodeJS) {
                // In node, uncaught exceptions are considered fatal errors.
                // Re-throw them synchronously to interrupt flushing!

                // Ensure continuation if the uncaught exception is suppressed
                // listening "uncaughtException" events (as domains does).
                // Continue in next event to avoid tick recursion.
                if (domain) {
                    domain.exit();
                }
                setTimeout(flush, 0);
                if (domain) {
                    domain.enter();
                }

                throw e;

            } else {
                // In browsers, uncaught exceptions are not fatal.
                // Re-throw them asynchronously to avoid slow-downs.
                setTimeout(function () {
                    throw e;
                }, 0);
            }
        }

        if (domain) {
            domain.exit();
        }
    }

    nextTick = function (task) {
        tail = tail.next = {
            task: task,
            domain: isNodeJS && process.domain,
            next: null
        };

        if (!flushing) {
            flushing = true;
            requestTick();
        }
    };

    if (typeof process === "object" &&
        process.toString() === "[object process]" && process.nextTick) {
        // Ensure Q is in a real Node environment, with a `process.nextTick`.
        // To see through fake Node environments:
        // * Mocha test runner - exposes a `process` global without a `nextTick`
        // * Browserify - exposes a `process.nexTick` function that uses
        //   `setTimeout`. In this case `setImmediate` is preferred because
        //    it is faster. Browserify's `process.toString()` yields
        //   "[object Object]", while in a real Node environment
        //   `process.nextTick()` yields "[object process]".
        isNodeJS = true;

        requestTick = function () {
            process.nextTick(flush);
        };

    } else if (typeof setImmediate === "function") {
        // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
        if (typeof window !== "undefined") {
            requestTick = setImmediate.bind(window, flush);
        } else {
            requestTick = function () {
                setImmediate(flush);
            };
        }

    } else if (typeof MessageChannel !== "undefined") {
        // modern browsers
        // http://www.nonblocking.io/2011/06/windownexttick.html
        var channel = new MessageChannel();
        // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
        // working message ports the first time a page loads.
        channel.port1.onmessage = function () {
            requestTick = requestPortTick;
            channel.port1.onmessage = flush;
            flush();
        };
        var requestPortTick = function () {
            // Opera requires us to provide a message payload, regardless of
            // whether we use it.
            channel.port2.postMessage(0);
        };
        requestTick = function () {
            setTimeout(flush, 0);
            requestPortTick();
        };

    } else {
        // old browsers
        requestTick = function () {
            setTimeout(flush, 0);
        };
    }
    // runs a task after all other tasks have been run
    // this is useful for unhandled rejection tracking that needs to happen
    // after all `then`d tasks have been run.
    nextTick.runAfter = function (task) {
        laterQueue.push(task);
        if (!flushing) {
            flushing = true;
            requestTick();
        }
    };
    return nextTick;
})();

// Attempt to make generics safe in the face of downstream
// modifications.
// There is no situation where this is necessary.
// If you need a security guarantee, these primordials need to be
// deeply frozen anyway, and if you don’t need a security guarantee,
// this is just plain paranoid.
// However, this **might** have the nice side-effect of reducing the size of
// the minified code by reducing x.call() to merely x()
// See Mark Miller’s explanation of what this does.
// http://wiki.ecmascript.org/doku.php?id=conventions:safe_meta_programming
var call = Function.call;
function uncurryThis(f) {
    return function () {
        return call.apply(f, arguments);
    };
}
// This is equivalent, but slower:
// uncurryThis = Function_bind.bind(Function_bind.call);
// http://jsperf.com/uncurrythis

var array_slice = uncurryThis(Array.prototype.slice);

var array_reduce = uncurryThis(
    Array.prototype.reduce || function (callback, basis) {
        var index = 0,
            length = this.length;
        // concerning the initial value, if one is not provided
        if (arguments.length === 1) {
            // seek to the first value in the array, accounting
            // for the possibility that is is a sparse array
            do {
                if (index in this) {
                    basis = this[index++];
                    break;
                }
                if (++index >= length) {
                    throw new TypeError();
                }
            } while (1);
        }
        // reduce
        for (; index < length; index++) {
            // account for the possibility that the array is sparse
            if (index in this) {
                basis = callback(basis, this[index], index);
            }
        }
        return basis;
    }
);

var array_indexOf = uncurryThis(
    Array.prototype.indexOf || function (value) {
        // not a very good shim, but good enough for our one use of it
        for (var i = 0; i < this.length; i++) {
            if (this[i] === value) {
                return i;
            }
        }
        return -1;
    }
);

var array_map = uncurryThis(
    Array.prototype.map || function (callback, thisp) {
        var self = this;
        var collect = [];
        array_reduce(self, function (undefined, value, index) {
            collect.push(callback.call(thisp, value, index, self));
        }, void 0);
        return collect;
    }
);

var object_create = Object.create || function (prototype) {
    function Type() { }
    Type.prototype = prototype;
    return new Type();
};

var object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);

var object_keys = Object.keys || function (object) {
    var keys = [];
    for (var key in object) {
        if (object_hasOwnProperty(object, key)) {
            keys.push(key);
        }
    }
    return keys;
};

var object_toString = uncurryThis(Object.prototype.toString);

function isObject(value) {
    return value === Object(value);
}

// generator related shims

// FIXME: Remove this function once ES6 generators are in SpiderMonkey.
function isStopIteration(exception) {
    return (
        object_toString(exception) === "[object StopIteration]" ||
        exception instanceof QReturnValue
    );
}

// FIXME: Remove this helper and Q.return once ES6 generators are in
// SpiderMonkey.
var QReturnValue;
if (typeof ReturnValue !== "undefined") {
    QReturnValue = ReturnValue;
} else {
    QReturnValue = function (value) {
        this.value = value;
    };
}

// long stack traces

var STACK_JUMP_SEPARATOR = "From previous event:";

function makeStackTraceLong(error, promise) {
    // If possible, transform the error stack trace by removing Node and Q
    // cruft, then concatenating with the stack trace of `promise`. See #57.
    if (hasStacks &&
        promise.stack &&
        typeof error === "object" &&
        error !== null &&
        error.stack &&
        error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1
    ) {
        var stacks = [];
        for (var p = promise; !!p; p = p.source) {
            if (p.stack) {
                stacks.unshift(p.stack);
            }
        }
        stacks.unshift(error.stack);

        var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");
        error.stack = filterStackString(concatedStacks);
    }
}

function filterStackString(stackString) {
    var lines = stackString.split("\n");
    var desiredLines = [];
    for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];

        if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
            desiredLines.push(line);
        }
    }
    return desiredLines.join("\n");
}

function isNodeFrame(stackLine) {
    return stackLine.indexOf("(module.js:") !== -1 ||
           stackLine.indexOf("(node.js:") !== -1;
}

function getFileNameAndLineNumber(stackLine) {
    // Named functions: "at functionName (filename:lineNumber:columnNumber)"
    // In IE10 function name can have spaces ("Anonymous function") O_o
    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
    if (attempt1) {
        return [attempt1[1], Number(attempt1[2])];
    }

    // Anonymous functions: "at filename:lineNumber:columnNumber"
    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
    if (attempt2) {
        return [attempt2[1], Number(attempt2[2])];
    }

    // Firefox style: "function@filename:lineNumber or @filename:lineNumber"
    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
    if (attempt3) {
        return [attempt3[1], Number(attempt3[2])];
    }
}

function isInternalFrame(stackLine) {
    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);

    if (!fileNameAndLineNumber) {
        return false;
    }

    var fileName = fileNameAndLineNumber[0];
    var lineNumber = fileNameAndLineNumber[1];

    return fileName === qFileName &&
        lineNumber >= qStartingLine &&
        lineNumber <= qEndingLine;
}

// discover own file name and line number range for filtering stack
// traces
function captureLine() {
    if (!hasStacks) {
        return;
    }

    try {
        throw new Error();
    } catch (e) {
        var lines = e.stack.split("\n");
        var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
        var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
        if (!fileNameAndLineNumber) {
            return;
        }

        qFileName = fileNameAndLineNumber[0];
        return fileNameAndLineNumber[1];
    }
}

function deprecate(callback, name, alternative) {
    return function () {
        if (typeof console !== "undefined" &&
            typeof console.warn === "function") {
            console.warn(name + " is deprecated, use " + alternative +
                         " instead.", new Error("").stack);
        }
        return callback.apply(callback, arguments);
    };
}

// end of shims
// beginning of real work

/**
 * Constructs a promise for an immediate reference, passes promises through, or
 * coerces promises from different systems.
 * @param value immediate reference or promise
 */
function Q(value) {
    // If the object is already a Promise, return it directly.  This enables
    // the resolve function to both be used to created references from objects,
    // but to tolerably coerce non-promises to promises.
    if (value instanceof Promise) {
        return value;
    }

    // assimilate thenables
    if (isPromiseAlike(value)) {
        return coerce(value);
    } else {
        return fulfill(value);
    }
}
Q.resolve = Q;

/**
 * Performs a task in a future turn of the event loop.
 * @param {Function} task
 */
Q.nextTick = nextTick;

/**
 * Controls whether or not long stack traces will be on
 */
Q.longStackSupport = false;

// enable long stacks if Q_DEBUG is set
if (typeof process === "object" && process && process.env && process.env.Q_DEBUG) {
    Q.longStackSupport = true;
}

/**
 * Constructs a {promise, resolve, reject} object.
 *
 * `resolve` is a callback to invoke with a more resolved value for the
 * promise. To fulfill the promise, invoke `resolve` with any value that is
 * not a thenable. To reject the promise, invoke `resolve` with a rejected
 * thenable, or invoke `reject` with the reason directly. To resolve the
 * promise to another thenable, thus putting it in the same state, invoke
 * `resolve` with that other thenable.
 */
Q.defer = defer;
function defer() {
    // if "messages" is an "Array", that indicates that the promise has not yet
    // been resolved.  If it is "undefined", it has been resolved.  Each
    // element of the messages array is itself an array of complete arguments to
    // forward to the resolved promise.  We coerce the resolution value to a
    // promise using the `resolve` function because it handles both fully
    // non-thenable values and other thenables gracefully.
    var messages = [], progressListeners = [], resolvedPromise;

    var deferred = object_create(defer.prototype);
    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, operands) {
        var args = array_slice(arguments);
        if (messages) {
            messages.push(args);
            if (op === "when" && operands[1]) { // progress operand
                progressListeners.push(operands[1]);
            }
        } else {
            Q.nextTick(function () {
                resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
            });
        }
    };

    // XXX deprecated
    promise.valueOf = function () {
        if (messages) {
            return promise;
        }
        var nearerValue = nearer(resolvedPromise);
        if (isPromise(nearerValue)) {
            resolvedPromise = nearerValue; // shorten chain
        }
        return nearerValue;
    };

    promise.inspect = function () {
        if (!resolvedPromise) {
            return { state: "pending" };
        }
        return resolvedPromise.inspect();
    };

    if (Q.longStackSupport && hasStacks) {
        try {
            throw new Error();
        } catch (e) {
            // NOTE: don't try to use `Error.captureStackTrace` or transfer the
            // accessor around; that causes memory leaks as per GH-111. Just
            // reify the stack trace as a string ASAP.
            //
            // At the same time, cut off the first line; it's always just
            // "[object Promise]\n", as per the `toString`.
            promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1);
        }
    }

    // NOTE: we do the checks for `resolvedPromise` in each method, instead of
    // consolidating them into `become`, since otherwise we'd create new
    // promises with the lines `become(whatever(value))`. See e.g. GH-252.

    function become(newPromise) {
        resolvedPromise = newPromise;
        promise.source = newPromise;

        array_reduce(messages, function (undefined, message) {
            Q.nextTick(function () {
                newPromise.promiseDispatch.apply(newPromise, message);
            });
        }, void 0);

        messages = void 0;
        progressListeners = void 0;
    }

    deferred.promise = promise;
    deferred.resolve = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(Q(value));
    };

    deferred.fulfill = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(fulfill(value));
    };
    deferred.reject = function (reason) {
        if (resolvedPromise) {
            return;
        }

        become(reject(reason));
    };
    deferred.notify = function (progress) {
        if (resolvedPromise) {
            return;
        }

        array_reduce(progressListeners, function (undefined, progressListener) {
            Q.nextTick(function () {
                progressListener(progress);
            });
        }, void 0);
    };

    return deferred;
}

/**
 * Creates a Node-style callback that will resolve or reject the deferred
 * promise.
 * @returns a nodeback
 */
defer.prototype.makeNodeResolver = function () {
    var self = this;
    return function (error, value) {
        if (error) {
            self.reject(error);
        } else if (arguments.length > 2) {
            self.resolve(array_slice(arguments, 1));
        } else {
            self.resolve(value);
        }
    };
};

/**
 * @param resolver {Function} a function that returns nothing and accepts
 * the resolve, reject, and notify functions for a deferred.
 * @returns a promise that may be resolved with the given resolve and reject
 * functions, or rejected by a thrown exception in resolver
 */
Q.Promise = promise; // ES6
Q.promise = promise;
function promise(resolver) {
    if (typeof resolver !== "function") {
        throw new TypeError("resolver must be a function.");
    }
    var deferred = defer();
    try {
        resolver(deferred.resolve, deferred.reject, deferred.notify);
    } catch (reason) {
        deferred.reject(reason);
    }
    return deferred.promise;
}

promise.race = race; // ES6
promise.all = all; // ES6
promise.reject = reject; // ES6
promise.resolve = Q; // ES6

// XXX experimental.  This method is a way to denote that a local value is
// serializable and should be immediately dispatched to a remote upon request,
// instead of passing a reference.
Q.passByCopy = function (object) {
    //freeze(object);
    //passByCopies.set(object, true);
    return object;
};

Promise.prototype.passByCopy = function () {
    //freeze(object);
    //passByCopies.set(object, true);
    return this;
};

/**
 * If two promises eventually fulfill to the same value, promises that value,
 * but otherwise rejects.
 * @param x {Any*}
 * @param y {Any*}
 * @returns {Any*} a promise for x and y if they are the same, but a rejection
 * otherwise.
 *
 */
Q.join = function (x, y) {
    return Q(x).join(y);
};

Promise.prototype.join = function (that) {
    return Q([this, that]).spread(function (x, y) {
        if (x === y) {
            // TODO: "===" should be Object.is or equiv
            return x;
        } else {
            throw new Error("Can't join: not the same: " + x + " " + y);
        }
    });
};

/**
 * Returns a promise for the first of an array of promises to become settled.
 * @param answers {Array[Any*]} promises to race
 * @returns {Any*} the first promise to be settled
 */
Q.race = race;
function race(answerPs) {
    return promise(function (resolve, reject) {
        // Switch to this once we can assume at least ES5
        // answerPs.forEach(function (answerP) {
        //     Q(answerP).then(resolve, reject);
        // });
        // Use this in the meantime
        for (var i = 0, len = answerPs.length; i < len; i++) {
            Q(answerPs[i]).then(resolve, reject);
        }
    });
}

Promise.prototype.race = function () {
    return this.then(Q.race);
};

/**
 * Constructs a Promise with a promise descriptor object and optional fallback
 * function.  The descriptor contains methods like when(rejected), get(name),
 * set(name, value), post(name, args), and delete(name), which all
 * return either a value, a promise for a value, or a rejection.  The fallback
 * accepts the operation name, a resolver, and any further arguments that would
 * have been forwarded to the appropriate method above had a method been
 * provided with the proper name.  The API makes no guarantees about the nature
 * of the returned object, apart from that it is usable whereever promises are
 * bought and sold.
 */
Q.makePromise = Promise;
function Promise(descriptor, fallback, inspect) {
    if (fallback === void 0) {
        fallback = function (op) {
            return reject(new Error(
                "Promise does not support operation: " + op
            ));
        };
    }
    if (inspect === void 0) {
        inspect = function () {
            return {state: "unknown"};
        };
    }

    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, args) {
        var result;
        try {
            if (descriptor[op]) {
                result = descriptor[op].apply(promise, args);
            } else {
                result = fallback.call(promise, op, args);
            }
        } catch (exception) {
            result = reject(exception);
        }
        if (resolve) {
            resolve(result);
        }
    };

    promise.inspect = inspect;

    // XXX deprecated `valueOf` and `exception` support
    if (inspect) {
        var inspected = inspect();
        if (inspected.state === "rejected") {
            promise.exception = inspected.reason;
        }

        promise.valueOf = function () {
            var inspected = inspect();
            if (inspected.state === "pending" ||
                inspected.state === "rejected") {
                return promise;
            }
            return inspected.value;
        };
    }

    return promise;
}

Promise.prototype.toString = function () {
    return "[object Promise]";
};

Promise.prototype.then = function (fulfilled, rejected, progressed) {
    var self = this;
    var deferred = defer();
    var done = false;   // ensure the untrusted promise makes at most a
                        // single call to one of the callbacks

    function _fulfilled(value) {
        try {
            return typeof fulfilled === "function" ? fulfilled(value) : value;
        } catch (exception) {
            return reject(exception);
        }
    }

    function _rejected(exception) {
        if (typeof rejected === "function") {
            makeStackTraceLong(exception, self);
            try {
                return rejected(exception);
            } catch (newException) {
                return reject(newException);
            }
        }
        return reject(exception);
    }

    function _progressed(value) {
        return typeof progressed === "function" ? progressed(value) : value;
    }

    Q.nextTick(function () {
        self.promiseDispatch(function (value) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_fulfilled(value));
        }, "when", [function (exception) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_rejected(exception));
        }]);
    });

    // Progress propagator need to be attached in the current tick.
    self.promiseDispatch(void 0, "when", [void 0, function (value) {
        var newValue;
        var threw = false;
        try {
            newValue = _progressed(value);
        } catch (e) {
            threw = true;
            if (Q.onerror) {
                Q.onerror(e);
            } else {
                throw e;
            }
        }

        if (!threw) {
            deferred.notify(newValue);
        }
    }]);

    return deferred.promise;
};

Q.tap = function (promise, callback) {
    return Q(promise).tap(callback);
};

/**
 * Works almost like "finally", but not called for rejections.
 * Original resolution value is passed through callback unaffected.
 * Callback may return a promise that will be awaited for.
 * @param {Function} callback
 * @returns {Q.Promise}
 * @example
 * doSomething()
 *   .then(...)
 *   .tap(console.log)
 *   .then(...);
 */
Promise.prototype.tap = function (callback) {
    callback = Q(callback);

    return this.then(function (value) {
        return callback.fcall(value).thenResolve(value);
    });
};

/**
 * Registers an observer on a promise.
 *
 * Guarantees:
 *
 * 1. that fulfilled and rejected will be called only once.
 * 2. that either the fulfilled callback or the rejected callback will be
 *    called, but not both.
 * 3. that fulfilled and rejected will not be called in this turn.
 *
 * @param value      promise or immediate reference to observe
 * @param fulfilled  function to be called with the fulfilled value
 * @param rejected   function to be called with the rejection exception
 * @param progressed function to be called on any progress notifications
 * @return promise for the return value from the invoked callback
 */
Q.when = when;
function when(value, fulfilled, rejected, progressed) {
    return Q(value).then(fulfilled, rejected, progressed);
}

Promise.prototype.thenResolve = function (value) {
    return this.then(function () { return value; });
};

Q.thenResolve = function (promise, value) {
    return Q(promise).thenResolve(value);
};

Promise.prototype.thenReject = function (reason) {
    return this.then(function () { throw reason; });
};

Q.thenReject = function (promise, reason) {
    return Q(promise).thenReject(reason);
};

/**
 * If an object is not a promise, it is as "near" as possible.
 * If a promise is rejected, it is as "near" as possible too.
 * If it’s a fulfilled promise, the fulfillment value is nearer.
 * If it’s a deferred promise and the deferred has been resolved, the
 * resolution is "nearer".
 * @param object
 * @returns most resolved (nearest) form of the object
 */

// XXX should we re-do this?
Q.nearer = nearer;
function nearer(value) {
    if (isPromise(value)) {
        var inspected = value.inspect();
        if (inspected.state === "fulfilled") {
            return inspected.value;
        }
    }
    return value;
}

/**
 * @returns whether the given object is a promise.
 * Otherwise it is a fulfilled value.
 */
Q.isPromise = isPromise;
function isPromise(object) {
    return object instanceof Promise;
}

Q.isPromiseAlike = isPromiseAlike;
function isPromiseAlike(object) {
    return isObject(object) && typeof object.then === "function";
}

/**
 * @returns whether the given object is a pending promise, meaning not
 * fulfilled or rejected.
 */
Q.isPending = isPending;
function isPending(object) {
    return isPromise(object) && object.inspect().state === "pending";
}

Promise.prototype.isPending = function () {
    return this.inspect().state === "pending";
};

/**
 * @returns whether the given object is a value or fulfilled
 * promise.
 */
Q.isFulfilled = isFulfilled;
function isFulfilled(object) {
    return !isPromise(object) || object.inspect().state === "fulfilled";
}

Promise.prototype.isFulfilled = function () {
    return this.inspect().state === "fulfilled";
};

/**
 * @returns whether the given object is a rejected promise.
 */
Q.isRejected = isRejected;
function isRejected(object) {
    return isPromise(object) && object.inspect().state === "rejected";
}

Promise.prototype.isRejected = function () {
    return this.inspect().state === "rejected";
};

//// BEGIN UNHANDLED REJECTION TRACKING

// This promise library consumes exceptions thrown in handlers so they can be
// handled by a subsequent promise.  The exceptions get added to this array when
// they are created, and removed when they are handled.  Note that in ES6 or
// shimmed environments, this would naturally be a `Set`.
var unhandledReasons = [];
var unhandledRejections = [];
var reportedUnhandledRejections = [];
var trackUnhandledRejections = true;

function resetUnhandledRejections() {
    unhandledReasons.length = 0;
    unhandledRejections.length = 0;

    if (!trackUnhandledRejections) {
        trackUnhandledRejections = true;
    }
}

function trackRejection(promise, reason) {
    if (!trackUnhandledRejections) {
        return;
    }
    if (typeof process === "object" && typeof process.emit === "function") {
        Q.nextTick.runAfter(function () {
            if (array_indexOf(unhandledRejections, promise) !== -1) {
                process.emit("unhandledRejection", reason, promise);
                reportedUnhandledRejections.push(promise);
            }
        });
    }

    unhandledRejections.push(promise);
    if (reason && typeof reason.stack !== "undefined") {
        unhandledReasons.push(reason.stack);
    } else {
        unhandledReasons.push("(no stack) " + reason);
    }
}

function untrackRejection(promise) {
    if (!trackUnhandledRejections) {
        return;
    }

    var at = array_indexOf(unhandledRejections, promise);
    if (at !== -1) {
        if (typeof process === "object" && typeof process.emit === "function") {
            Q.nextTick.runAfter(function () {
                var atReport = array_indexOf(reportedUnhandledRejections, promise);
                if (atReport !== -1) {
                    process.emit("rejectionHandled", unhandledReasons[at], promise);
                    reportedUnhandledRejections.splice(atReport, 1);
                }
            });
        }
        unhandledRejections.splice(at, 1);
        unhandledReasons.splice(at, 1);
    }
}

Q.resetUnhandledRejections = resetUnhandledRejections;

Q.getUnhandledReasons = function () {
    // Make a copy so that consumers can't interfere with our internal state.
    return unhandledReasons.slice();
};

Q.stopUnhandledRejectionTracking = function () {
    resetUnhandledRejections();
    trackUnhandledRejections = false;
};

resetUnhandledRejections();

//// END UNHANDLED REJECTION TRACKING

/**
 * Constructs a rejected promise.
 * @param reason value describing the failure
 */
Q.reject = reject;
function reject(reason) {
    var rejection = Promise({
        "when": function (rejected) {
            // note that the error has been handled
            if (rejected) {
                untrackRejection(this);
            }
            return rejected ? rejected(reason) : this;
        }
    }, function fallback() {
        return this;
    }, function inspect() {
        return { state: "rejected", reason: reason };
    });

    // Note that the reason has not been handled.
    trackRejection(rejection, reason);

    return rejection;
}

/**
 * Constructs a fulfilled promise for an immediate reference.
 * @param value immediate reference
 */
Q.fulfill = fulfill;
function fulfill(value) {
    return Promise({
        "when": function () {
            return value;
        },
        "get": function (name) {
            return value[name];
        },
        "set": function (name, rhs) {
            value[name] = rhs;
        },
        "delete": function (name) {
            delete value[name];
        },
        "post": function (name, args) {
            // Mark Miller proposes that post with no name should apply a
            // promised function.
            if (name === null || name === void 0) {
                return value.apply(void 0, args);
            } else {
                return value[name].apply(value, args);
            }
        },
        "apply": function (thisp, args) {
            return value.apply(thisp, args);
        },
        "keys": function () {
            return object_keys(value);
        }
    }, void 0, function inspect() {
        return { state: "fulfilled", value: value };
    });
}

/**
 * Converts thenables to Q promises.
 * @param promise thenable promise
 * @returns a Q promise
 */
function coerce(promise) {
    var deferred = defer();
    Q.nextTick(function () {
        try {
            promise.then(deferred.resolve, deferred.reject, deferred.notify);
        } catch (exception) {
            deferred.reject(exception);
        }
    });
    return deferred.promise;
}

/**
 * Annotates an object such that it will never be
 * transferred away from this process over any promise
 * communication channel.
 * @param object
 * @returns promise a wrapping of that object that
 * additionally responds to the "isDef" message
 * without a rejection.
 */
Q.master = master;
function master(object) {
    return Promise({
        "isDef": function () {}
    }, function fallback(op, args) {
        return dispatch(object, op, args);
    }, function () {
        return Q(object).inspect();
    });
}

/**
 * Spreads the values of a promised array of arguments into the
 * fulfillment callback.
 * @param fulfilled callback that receives variadic arguments from the
 * promised array
 * @param rejected callback that receives the exception if the promise
 * is rejected.
 * @returns a promise for the return value or thrown exception of
 * either callback.
 */
Q.spread = spread;
function spread(value, fulfilled, rejected) {
    return Q(value).spread(fulfilled, rejected);
}

Promise.prototype.spread = function (fulfilled, rejected) {
    return this.all().then(function (array) {
        return fulfilled.apply(void 0, array);
    }, rejected);
};

/**
 * The async function is a decorator for generator functions, turning
 * them into asynchronous generators.  Although generators are only part
 * of the newest ECMAScript 6 drafts, this code does not cause syntax
 * errors in older engines.  This code should continue to work and will
 * in fact improve over time as the language improves.
 *
 * ES6 generators are currently part of V8 version 3.19 with the
 * --harmony-generators runtime flag enabled.  SpiderMonkey has had them
 * for longer, but under an older Python-inspired form.  This function
 * works on both kinds of generators.
 *
 * Decorates a generator function such that:
 *  - it may yield promises
 *  - execution will continue when that promise is fulfilled
 *  - the value of the yield expression will be the fulfilled value
 *  - it returns a promise for the return value (when the generator
 *    stops iterating)
 *  - the decorated function returns a promise for the return value
 *    of the generator or the first rejected promise among those
 *    yielded.
 *  - if an error is thrown in the generator, it propagates through
 *    every following yield until it is caught, or until it escapes
 *    the generator function altogether, and is translated into a
 *    rejection for the promise returned by the decorated generator.
 */
Q.async = async;
function async(makeGenerator) {
    return function () {
        // when verb is "send", arg is a value
        // when verb is "throw", arg is an exception
        function continuer(verb, arg) {
            var result;

            // Until V8 3.19 / Chromium 29 is released, SpiderMonkey is the only
            // engine that has a deployed base of browsers that support generators.
            // However, SM's generators use the Python-inspired semantics of
            // outdated ES6 drafts.  We would like to support ES6, but we'd also
            // like to make it possible to use generators in deployed browsers, so
            // we also support Python-style generators.  At some point we can remove
            // this block.

            if (typeof StopIteration === "undefined") {
                // ES6 Generators
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    return reject(exception);
                }
                if (result.done) {
                    return Q(result.value);
                } else {
                    return when(result.value, callback, errback);
                }
            } else {
                // SpiderMonkey Generators
                // FIXME: Remove this case when SM does ES6 generators.
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    if (isStopIteration(exception)) {
                        return Q(exception.value);
                    } else {
                        return reject(exception);
                    }
                }
                return when(result, callback, errback);
            }
        }
        var generator = makeGenerator.apply(this, arguments);
        var callback = continuer.bind(continuer, "next");
        var errback = continuer.bind(continuer, "throw");
        return callback();
    };
}

/**
 * The spawn function is a small wrapper around async that immediately
 * calls the generator and also ends the promise chain, so that any
 * unhandled errors are thrown instead of forwarded to the error
 * handler. This is useful because it's extremely common to run
 * generators at the top-level to work with libraries.
 */
Q.spawn = spawn;
function spawn(makeGenerator) {
    Q.done(Q.async(makeGenerator)());
}

// FIXME: Remove this interface once ES6 generators are in SpiderMonkey.
/**
 * Throws a ReturnValue exception to stop an asynchronous generator.
 *
 * This interface is a stop-gap measure to support generator return
 * values in older Firefox/SpiderMonkey.  In browsers that support ES6
 * generators like Chromium 29, just use "return" in your generator
 * functions.
 *
 * @param value the return value for the surrounding generator
 * @throws ReturnValue exception with the value.
 * @example
 * // ES6 style
 * Q.async(function* () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      return foo + bar;
 * })
 * // Older SpiderMonkey style
 * Q.async(function () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      Q.return(foo + bar);
 * })
 */
Q["return"] = _return;
function _return(value) {
    throw new QReturnValue(value);
}

/**
 * The promised function decorator ensures that any promise arguments
 * are settled and passed as values (`this` is also settled and passed
 * as a value).  It will also ensure that the result of a function is
 * always a promise.
 *
 * @example
 * var add = Q.promised(function (a, b) {
 *     return a + b;
 * });
 * add(Q(a), Q(B));
 *
 * @param {function} callback The function to decorate
 * @returns {function} a function that has been decorated.
 */
Q.promised = promised;
function promised(callback) {
    return function () {
        return spread([this, all(arguments)], function (self, args) {
            return callback.apply(self, args);
        });
    };
}

/**
 * sends a message to a value in a future turn
 * @param object* the recipient
 * @param op the name of the message operation, e.g., "when",
 * @param args further arguments to be forwarded to the operation
 * @returns result {Promise} a promise for the result of the operation
 */
Q.dispatch = dispatch;
function dispatch(object, op, args) {
    return Q(object).dispatch(op, args);
}

Promise.prototype.dispatch = function (op, args) {
    var self = this;
    var deferred = defer();
    Q.nextTick(function () {
        self.promiseDispatch(deferred.resolve, op, args);
    });
    return deferred.promise;
};

/**
 * Gets the value of a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to get
 * @return promise for the property value
 */
Q.get = function (object, key) {
    return Q(object).dispatch("get", [key]);
};

Promise.prototype.get = function (key) {
    return this.dispatch("get", [key]);
};

/**
 * Sets the value of a property in a future turn.
 * @param object    promise or immediate reference for object object
 * @param name      name of property to set
 * @param value     new value of property
 * @return promise for the return value
 */
Q.set = function (object, key, value) {
    return Q(object).dispatch("set", [key, value]);
};

Promise.prototype.set = function (key, value) {
    return this.dispatch("set", [key, value]);
};

/**
 * Deletes a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to delete
 * @return promise for the return value
 */
Q.del = // XXX legacy
Q["delete"] = function (object, key) {
    return Q(object).dispatch("delete", [key]);
};

Promise.prototype.del = // XXX legacy
Promise.prototype["delete"] = function (key) {
    return this.dispatch("delete", [key]);
};

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param value     a value to post, typically an array of
 *                  invocation arguments for promises that
 *                  are ultimately backed with `resolve` values,
 *                  as opposed to those backed with URLs
 *                  wherein the posted value can be any
 *                  JSON serializable object.
 * @return promise for the return value
 */
// bound locally because it is used by other methods
Q.mapply = // XXX As proposed by "Redsandro"
Q.post = function (object, name, args) {
    return Q(object).dispatch("post", [name, args]);
};

Promise.prototype.mapply = // XXX As proposed by "Redsandro"
Promise.prototype.post = function (name, args) {
    return this.dispatch("post", [name, args]);
};

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param ...args   array of invocation arguments
 * @return promise for the return value
 */
Q.send = // XXX Mark Miller's proposed parlance
Q.mcall = // XXX As proposed by "Redsandro"
Q.invoke = function (object, name /*...args*/) {
    return Q(object).dispatch("post", [name, array_slice(arguments, 2)]);
};

Promise.prototype.send = // XXX Mark Miller's proposed parlance
Promise.prototype.mcall = // XXX As proposed by "Redsandro"
Promise.prototype.invoke = function (name /*...args*/) {
    return this.dispatch("post", [name, array_slice(arguments, 1)]);
};

/**
 * Applies the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param args      array of application arguments
 */
Q.fapply = function (object, args) {
    return Q(object).dispatch("apply", [void 0, args]);
};

Promise.prototype.fapply = function (args) {
    return this.dispatch("apply", [void 0, args]);
};

/**
 * Calls the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q["try"] =
Q.fcall = function (object /* ...args*/) {
    return Q(object).dispatch("apply", [void 0, array_slice(arguments, 1)]);
};

Promise.prototype.fcall = function (/*...args*/) {
    return this.dispatch("apply", [void 0, array_slice(arguments)]);
};

/**
 * Binds the promised function, transforming return values into a fulfilled
 * promise and thrown errors into a rejected one.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q.fbind = function (object /*...args*/) {
    var promise = Q(object);
    var args = array_slice(arguments, 1);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};
Promise.prototype.fbind = function (/*...args*/) {
    var promise = this;
    var args = array_slice(arguments);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};

/**
 * Requests the names of the owned properties of a promised
 * object in a future turn.
 * @param object    promise or immediate reference for target object
 * @return promise for the keys of the eventually settled object
 */
Q.keys = function (object) {
    return Q(object).dispatch("keys", []);
};

Promise.prototype.keys = function () {
    return this.dispatch("keys", []);
};

/**
 * Turns an array of promises into a promise for an array.  If any of
 * the promises gets rejected, the whole array is rejected immediately.
 * @param {Array*} an array (or promise for an array) of values (or
 * promises for values)
 * @returns a promise for an array of the corresponding values
 */
// By Mark Miller
// http://wiki.ecmascript.org/doku.php?id=strawman:concurrency&rev=1308776521#allfulfilled
Q.all = all;
function all(promises) {
    return when(promises, function (promises) {
        var pendingCount = 0;
        var deferred = defer();
        array_reduce(promises, function (undefined, promise, index) {
            var snapshot;
            if (
                isPromise(promise) &&
                (snapshot = promise.inspect()).state === "fulfilled"
            ) {
                promises[index] = snapshot.value;
            } else {
                ++pendingCount;
                when(
                    promise,
                    function (value) {
                        promises[index] = value;
                        if (--pendingCount === 0) {
                            deferred.resolve(promises);
                        }
                    },
                    deferred.reject,
                    function (progress) {
                        deferred.notify({ index: index, value: progress });
                    }
                );
            }
        }, void 0);
        if (pendingCount === 0) {
            deferred.resolve(promises);
        }
        return deferred.promise;
    });
}

Promise.prototype.all = function () {
    return all(this);
};

/**
 * Returns the first resolved promise of an array. Prior rejected promises are
 * ignored.  Rejects only if all promises are rejected.
 * @param {Array*} an array containing values or promises for values
 * @returns a promise fulfilled with the value of the first resolved promise,
 * or a rejected promise if all promises are rejected.
 */
Q.any = any;

function any(promises) {
    if (promises.length === 0) {
        return Q.resolve();
    }

    var deferred = Q.defer();
    var pendingCount = 0;
    array_reduce(promises, function (prev, current, index) {
        var promise = promises[index];

        pendingCount++;

        when(promise, onFulfilled, onRejected, onProgress);
        function onFulfilled(result) {
            deferred.resolve(result);
        }
        function onRejected() {
            pendingCount--;
            if (pendingCount === 0) {
                deferred.reject(new Error(
                    "Can't get fulfillment value from any promise, all " +
                    "promises were rejected."
                ));
            }
        }
        function onProgress(progress) {
            deferred.notify({
                index: index,
                value: progress
            });
        }
    }, undefined);

    return deferred.promise;
}

Promise.prototype.any = function () {
    return any(this);
};

/**
 * Waits for all promises to be settled, either fulfilled or
 * rejected.  This is distinct from `all` since that would stop
 * waiting at the first rejection.  The promise returned by
 * `allResolved` will never be rejected.
 * @param promises a promise for an array (or an array) of promises
 * (or values)
 * @return a promise for an array of promises
 */
Q.allResolved = deprecate(allResolved, "allResolved", "allSettled");
function allResolved(promises) {
    return when(promises, function (promises) {
        promises = array_map(promises, Q);
        return when(all(array_map(promises, function (promise) {
            return when(promise, noop, noop);
        })), function () {
            return promises;
        });
    });
}

Promise.prototype.allResolved = function () {
    return allResolved(this);
};

/**
 * @see Promise#allSettled
 */
Q.allSettled = allSettled;
function allSettled(promises) {
    return Q(promises).allSettled();
}

/**
 * Turns an array of promises into a promise for an array of their states (as
 * returned by `inspect`) when they have all settled.
 * @param {Array[Any*]} values an array (or promise for an array) of values (or
 * promises for values)
 * @returns {Array[State]} an array of states for the respective values.
 */
Promise.prototype.allSettled = function () {
    return this.then(function (promises) {
        return all(array_map(promises, function (promise) {
            promise = Q(promise);
            function regardless() {
                return promise.inspect();
            }
            return promise.then(regardless, regardless);
        }));
    });
};

/**
 * Captures the failure of a promise, giving an oportunity to recover
 * with a callback.  If the given promise is fulfilled, the returned
 * promise is fulfilled.
 * @param {Any*} promise for something
 * @param {Function} callback to fulfill the returned promise if the
 * given promise is rejected
 * @returns a promise for the return value of the callback
 */
Q.fail = // XXX legacy
Q["catch"] = function (object, rejected) {
    return Q(object).then(void 0, rejected);
};

Promise.prototype.fail = // XXX legacy
Promise.prototype["catch"] = function (rejected) {
    return this.then(void 0, rejected);
};

/**
 * Attaches a listener that can respond to progress notifications from a
 * promise's originating deferred. This listener receives the exact arguments
 * passed to ``deferred.notify``.
 * @param {Any*} promise for something
 * @param {Function} callback to receive any progress notifications
 * @returns the given promise, unchanged
 */
Q.progress = progress;
function progress(object, progressed) {
    return Q(object).then(void 0, void 0, progressed);
}

Promise.prototype.progress = function (progressed) {
    return this.then(void 0, void 0, progressed);
};

/**
 * Provides an opportunity to observe the settling of a promise,
 * regardless of whether the promise is fulfilled or rejected.  Forwards
 * the resolution to the returned promise when the callback is done.
 * The callback can return a promise to defer completion.
 * @param {Any*} promise
 * @param {Function} callback to observe the resolution of the given
 * promise, takes no arguments.
 * @returns a promise for the resolution of the given promise when
 * ``fin`` is done.
 */
Q.fin = // XXX legacy
Q["finally"] = function (object, callback) {
    return Q(object)["finally"](callback);
};

Promise.prototype.fin = // XXX legacy
Promise.prototype["finally"] = function (callback) {
    callback = Q(callback);
    return this.then(function (value) {
        return callback.fcall().then(function () {
            return value;
        });
    }, function (reason) {
        // TODO attempt to recycle the rejection with "this".
        return callback.fcall().then(function () {
            throw reason;
        });
    });
};

/**
 * Terminates a chain of promises, forcing rejections to be
 * thrown as exceptions.
 * @param {Any*} promise at the end of a chain of promises
 * @returns nothing
 */
Q.done = function (object, fulfilled, rejected, progress) {
    return Q(object).done(fulfilled, rejected, progress);
};

Promise.prototype.done = function (fulfilled, rejected, progress) {
    var onUnhandledError = function (error) {
        // forward to a future turn so that ``when``
        // does not catch it and turn it into a rejection.
        Q.nextTick(function () {
            makeStackTraceLong(error, promise);
            if (Q.onerror) {
                Q.onerror(error);
            } else {
                throw error;
            }
        });
    };

    // Avoid unnecessary `nextTick`ing via an unnecessary `when`.
    var promise = fulfilled || rejected || progress ?
        this.then(fulfilled, rejected, progress) :
        this;

    if (typeof process === "object" && process && process.domain) {
        onUnhandledError = process.domain.bind(onUnhandledError);
    }

    promise.then(void 0, onUnhandledError);
};

/**
 * Causes a promise to be rejected if it does not get fulfilled before
 * some milliseconds time out.
 * @param {Any*} promise
 * @param {Number} milliseconds timeout
 * @param {Any*} custom error message or Error object (optional)
 * @returns a promise for the resolution of the given promise if it is
 * fulfilled before the timeout, otherwise rejected.
 */
Q.timeout = function (object, ms, error) {
    return Q(object).timeout(ms, error);
};

Promise.prototype.timeout = function (ms, error) {
    var deferred = defer();
    var timeoutId = setTimeout(function () {
        if (!error || "string" === typeof error) {
            error = new Error(error || "Timed out after " + ms + " ms");
            error.code = "ETIMEDOUT";
        }
        deferred.reject(error);
    }, ms);

    this.then(function (value) {
        clearTimeout(timeoutId);
        deferred.resolve(value);
    }, function (exception) {
        clearTimeout(timeoutId);
        deferred.reject(exception);
    }, deferred.notify);

    return deferred.promise;
};

/**
 * Returns a promise for the given value (or promised value), some
 * milliseconds after it resolved. Passes rejections immediately.
 * @param {Any*} promise
 * @param {Number} milliseconds
 * @returns a promise for the resolution of the given promise after milliseconds
 * time has elapsed since the resolution of the given promise.
 * If the given promise rejects, that is passed immediately.
 */
Q.delay = function (object, timeout) {
    if (timeout === void 0) {
        timeout = object;
        object = void 0;
    }
    return Q(object).delay(timeout);
};

Promise.prototype.delay = function (timeout) {
    return this.then(function (value) {
        var deferred = defer();
        setTimeout(function () {
            deferred.resolve(value);
        }, timeout);
        return deferred.promise;
    });
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided as an array, and returns a promise.
 *
 *      Q.nfapply(FS.readFile, [__filename])
 *      .then(function (content) {
 *      })
 *
 */
Q.nfapply = function (callback, args) {
    return Q(callback).nfapply(args);
};

Promise.prototype.nfapply = function (args) {
    var deferred = defer();
    var nodeArgs = array_slice(args);
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided individually, and returns a promise.
 * @example
 * Q.nfcall(FS.readFile, __filename)
 * .then(function (content) {
 * })
 *
 */
Q.nfcall = function (callback /*...args*/) {
    var args = array_slice(arguments, 1);
    return Q(callback).nfapply(args);
};

Promise.prototype.nfcall = function (/*...args*/) {
    var nodeArgs = array_slice(arguments);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Wraps a NodeJS continuation passing function and returns an equivalent
 * version that returns a promise.
 * @example
 * Q.nfbind(FS.readFile, __filename)("utf-8")
 * .then(console.log)
 * .done()
 */
Q.nfbind =
Q.denodeify = function (callback /*...args*/) {
    var baseArgs = array_slice(arguments, 1);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        Q(callback).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nfbind =
Promise.prototype.denodeify = function (/*...args*/) {
    var args = array_slice(arguments);
    args.unshift(this);
    return Q.denodeify.apply(void 0, args);
};

Q.nbind = function (callback, thisp /*...args*/) {
    var baseArgs = array_slice(arguments, 2);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        function bound() {
            return callback.apply(thisp, arguments);
        }
        Q(bound).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nbind = function (/*thisp, ...args*/) {
    var args = array_slice(arguments, 0);
    args.unshift(this);
    return Q.nbind.apply(void 0, args);
};

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback with a given array of arguments, plus a provided callback.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param {Array} args arguments to pass to the method; the callback
 * will be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nmapply = // XXX As proposed by "Redsandro"
Q.npost = function (object, name, args) {
    return Q(object).npost(name, args);
};

Promise.prototype.nmapply = // XXX As proposed by "Redsandro"
Promise.prototype.npost = function (name, args) {
    var nodeArgs = array_slice(args || []);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback, forwarding the given variadic arguments, plus a provided
 * callback argument.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param ...args arguments to pass to the method; the callback will
 * be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nsend = // XXX Based on Mark Miller's proposed "send"
Q.nmcall = // XXX Based on "Redsandro's" proposal
Q.ninvoke = function (object, name /*...args*/) {
    var nodeArgs = array_slice(arguments, 2);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    Q(object).dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

Promise.prototype.nsend = // XXX Based on Mark Miller's proposed "send"
Promise.prototype.nmcall = // XXX Based on "Redsandro's" proposal
Promise.prototype.ninvoke = function (name /*...args*/) {
    var nodeArgs = array_slice(arguments, 1);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

/**
 * If a function would like to support both Node continuation-passing-style and
 * promise-returning-style, it can end its internal promise chain with
 * `nodeify(nodeback)`, forwarding the optional nodeback argument.  If the user
 * elects to use a nodeback, the result will be sent there.  If they do not
 * pass a nodeback, they will receive the result promise.
 * @param object a result (or a promise for a result)
 * @param {Function} nodeback a Node.js-style callback
 * @returns either the promise or nothing
 */
Q.nodeify = nodeify;
function nodeify(object, nodeback) {
    return Q(object).nodeify(nodeback);
}

Promise.prototype.nodeify = function (nodeback) {
    if (nodeback) {
        this.then(function (value) {
            Q.nextTick(function () {
                nodeback(null, value);
            });
        }, function (error) {
            Q.nextTick(function () {
                nodeback(error);
            });
        });
    } else {
        return this;
    }
};

Q.noConflict = function() {
    throw new Error("Q.noConflict only works when Q is used as a global");
};

// All code before this point will be filtered from stack traces.
var qEndingLine = captureLine();

return Q;

});
;(function(win){
	var store = {},
		doc = win.document,
		localStorageName = 'localStorage',
		scriptTag = 'script',
		storage

	store.disabled = false
	store.version = '1.3.17'
	store.set = function(key, value) {}
	store.get = function(key, defaultVal) {}
	store.has = function(key) { return store.get(key) !== undefined }
	store.remove = function(key) {}
	store.clear = function() {}
	store.transact = function(key, defaultVal, transactionFn) {
		if (transactionFn == null) {
			transactionFn = defaultVal
			defaultVal = null
		}
		if (defaultVal == null) {
			defaultVal = {}
		}
		var val = store.get(key, defaultVal)
		transactionFn(val)
		store.set(key, val)
	}
	store.getAll = function() {}
	store.forEach = function() {}

	store.serialize = function(value) {
		return JSON.stringify(value)
	}
	store.deserialize = function(value) {
		if (typeof value != 'string') { return undefined }
		try { return JSON.parse(value) }
		catch(e) { return value || undefined }
	}

	// Functions to encapsulate questionable FireFox 3.6.13 behavior
	// when about.config::dom.storage.enabled === false
	// See https://github.com/marcuswestin/store.js/issues#issue/13
	function isLocalStorageNameSupported() {
		try { return (localStorageName in win && win[localStorageName]) }
		catch(err) { return false }
	}

	if (isLocalStorageNameSupported()) {
		storage = win[localStorageName]
		store.set = function(key, val) {
			if (val === undefined) { return store.remove(key) }
			storage.setItem(key, store.serialize(val))
			return val
		}
		store.get = function(key, defaultVal) {
			var val = store.deserialize(storage.getItem(key))
			return (val === undefined ? defaultVal : val)
		}
		store.remove = function(key) { storage.removeItem(key) }
		store.clear = function() { storage.clear() }
		store.getAll = function() {
			var ret = {}
			store.forEach(function(key, val) {
				ret[key] = val
			})
			return ret
		}
		store.forEach = function(callback) {
			for (var i=0; i<storage.length; i++) {
				var key = storage.key(i)
				callback(key, store.get(key))
			}
		}
	} else if (doc.documentElement.addBehavior) {
		var storageOwner,
			storageContainer
		// Since #userData storage applies only to specific paths, we need to
		// somehow link our data to a specific path.  We choose /favicon.ico
		// as a pretty safe option, since all browsers already make a request to
		// this URL anyway and being a 404 will not hurt us here.  We wrap an
		// iframe pointing to the favicon in an ActiveXObject(htmlfile) object
		// (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
		// since the iframe access rules appear to allow direct access and
		// manipulation of the document element, even for a 404 page.  This
		// document can be used instead of the current document (which would
		// have been limited to the current path) to perform #userData storage.
		try {
			storageContainer = new ActiveXObject('htmlfile')
			storageContainer.open()
			storageContainer.write('<'+scriptTag+'>document.w=window</'+scriptTag+'><iframe src="/favicon.ico"></iframe>')
			storageContainer.close()
			storageOwner = storageContainer.w.frames[0].document
			storage = storageOwner.createElement('div')
		} catch(e) {
			// somehow ActiveXObject instantiation failed (perhaps some special
			// security settings or otherwse), fall back to per-path storage
			storage = doc.createElement('div')
			storageOwner = doc.body
		}
		var withIEStorage = function(storeFunction) {
			return function() {
				var args = Array.prototype.slice.call(arguments, 0)
				args.unshift(storage)
				// See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
				// and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
				storageOwner.appendChild(storage)
				storage.addBehavior('#default#userData')
				storage.load(localStorageName)
				var result = storeFunction.apply(store, args)
				storageOwner.removeChild(storage)
				return result
			}
		}

		// In IE7, keys cannot start with a digit or contain certain chars.
		// See https://github.com/marcuswestin/store.js/issues/40
		// See https://github.com/marcuswestin/store.js/issues/83
		var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g")
		function ieKeyFix(key) {
			return key.replace(/^d/, '___$&').replace(forbiddenCharsRegex, '___')
		}
		store.set = withIEStorage(function(storage, key, val) {
			key = ieKeyFix(key)
			if (val === undefined) { return store.remove(key) }
			storage.setAttribute(key, store.serialize(val))
			storage.save(localStorageName)
			return val
		})
		store.get = withIEStorage(function(storage, key, defaultVal) {
			key = ieKeyFix(key)
			var val = store.deserialize(storage.getAttribute(key))
			return (val === undefined ? defaultVal : val)
		})
		store.remove = withIEStorage(function(storage, key) {
			key = ieKeyFix(key)
			storage.removeAttribute(key)
			storage.save(localStorageName)
		})
		store.clear = withIEStorage(function(storage) {
			var attributes = storage.XMLDocument.documentElement.attributes
			storage.load(localStorageName)
			for (var i=0, attr; attr=attributes[i]; i++) {
				storage.removeAttribute(attr.name)
			}
			storage.save(localStorageName)
		})
		store.getAll = function(storage) {
			var ret = {}
			store.forEach(function(key, val) {
				ret[key] = val
			})
			return ret
		}
		store.forEach = withIEStorage(function(storage, callback) {
			var attributes = storage.XMLDocument.documentElement.attributes
			for (var i=0, attr; attr=attributes[i]; ++i) {
				callback(attr.name, store.deserialize(storage.getAttribute(attr.name)))
			}
		})
	}

	try {
		var testKey = '__storejs__'
		store.set(testKey, testKey)
		if (store.get(testKey) != testKey) { store.disabled = true }
		store.remove(testKey)
	} catch(e) {
		store.disabled = true
	}
	store.enabled = !store.disabled

	if (typeof module != 'undefined' && module.exports && this.module !== module) { module.exports = store }
	else if (typeof define === 'function' && define.amd) { define(store) }
	else { win.store = store }

})(Function('return this')());
/**
@author Stamplay
@version 2.0
@description an awesome javascript sdk for Stamplay
*/
/* Initizialize library */
(function (root) {
	'use strict';

	/*  Inizialization of Stamplay Object */
	root.Stamplay = root.Stamplay || {};
	/* setting attribute API Version */
	root.Stamplay.VERSION = "v1";
	/* appId */
	root.Stamplay.APPID = "";
	/* baseUrl */
	root.Stamplay.BASEURL = "";
	/* options */
	root.Stamplay.OPTIONS = {};
	/*  check if exist local storage with the support of store.js */
	if (root.localStorage && store.enabled) {
		root.Stamplay.USESTORAGE = true;
	}

	if (getURLParameter('jwt')) {
		if (root.Stamplay.USESTORAGE) {
			store.set(root.location.origin + '-jwt', getURLParameter('jwt'));
		}
	}

	/* init method for setup the base url */
	root.Stamplay.init = function (appId, options) {
		root.Stamplay.BASEURL = 'https://' + appId + '.stamplayapp.com';
		root.Stamplay.APPID = appId;
		root.Stamplay.OPTIONS = options || {};
	}

	root.Stamplay.isString = function (val) {
		return typeof val === 'string' || ((!!val && typeof val === 'object') && Object.prototype.toString
			.call(val) === '[object String]');
	}

	root.Stamplay.isNumber = function (val) {
		return typeof val == 'number' || (!isNaN(parseFloat(val)) && isFinite(val))
	}

	root.Stamplay.isFunction = function (functionToCheck) {
		return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
	}

	root.Stamplay.isObject = function (val) {
		return !!val && (typeof val == 'object');
	}

	root.Stamplay.extend = function (source, obj) {
		var keys = Object.keys(obj),
			i, keyLen = keys.length,
			key;
		for (i = 0; i < keyLen; ++i) {
			key = keys[i];
			source[key] = obj[key];
		}
		return source;
	}

	function getURLParameter(name) {
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(root.location
			.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
	}

}(this));
/* Add function to handle ajax calls, returning a promise
 * Very simple to use: Stamplay.makePromise({options})
 */
(function (root) {
	'use strict';

	/* private function for handling this parameters */
	var parseQueryParams = function (options) {
		var keys = Object.keys(options.thisParams);
		for (var i = 0; i < keys.length; i++) {
			var conjunction = (i > 0) ? '&' : '?';
			var key = keys[i];
			options.url = options.url + conjunction + key + '=' + options.thisParams[key];
		}
	};
	/* function for handling any calls to Stamplay Platform */
	/* Options parameter is an object  */
	root.Stamplay.makeAPromise = function (options, callback) {
		if (options.thisParams) {
			parseQueryParams(options);
		}		
		var headerStamplay = root.Stamplay.APPID;
		if (root.Stamplay.APPID != "") {
			options.url = root.Stamplay.BASEURL + options.url;
		} else {
			headerStamplay = location.host;
			headerStamplay = headerStamplay.replace(/^www\./, '');
			headerStamplay = headerStamplay.replace(/:[0-9]*$/g, '');
		}
		var req = new XMLHttpRequest();
		req.open(options.method || 'GET', options.url, options.async || true);
		_manageHeaders(headerStamplay, req, options)
		var deferred = Q.defer();
		req.onreadystatechange = function () {
			if (req.readyState == 4) {
				if ([200, 304].indexOf(req.status) === -1) {
					deferred.reject({code:req.status, message:req.responseText})
				} else {
					_handleJWT(req);
					deferred.resolve(JSON.parse(req.responseText))
				}
				deferred.promise.nodeify(callback);
			}
		}
		req.send(JSON.stringify(options.data) || void 0);
		return deferred.promise;
	};

	function _manageHeaders(headerStamplay, req, options){
		// Set request headers if provided.
		Object.keys(options.headers || {}).forEach(function (key) {
			req.setRequestHeader(key, options.headers[key]);
		});
		// Default content-Type  
		req.setRequestHeader('Content-Type', 'application/json');
    req.setRequestHeader('Accept', 'application/json, text/plain');
		req.setRequestHeader('stamplay-app', headerStamplay);
		
		// V1 
		if (root.Stamplay.USESTORAGE) {
			var jwt = store.get(root.location.origin + '-jwt');
			if (jwt) {
				if (_jwtIsValidTimestamp(jwt)) {
					req.setRequestHeader('x-stamplay-jwt', jwt);
				} else {
					store.remove(root.location.origin + '-jwt');
				}
			}
		}
	}
	function _handleJWT(req) {
		var jwt = req.getResponseHeader('x-stamplay-jwt');
		if (jwt) {
			var decodedJWT = _decodeJWT(jwt);
			if (root.Stamplay.USESTORAGE) {
				store.set(root.location.origin + '-jwt', jwt);
			}
		}
		return decodedJWT;
	}
	function _decodeJWT(token) {
		var header = {},
				claims = {},
				signature = "";
		try {
			var parts = token.split(".");
			header = JSON.parse(_base64Decode((parts[0] || "{}")));
			claims = JSON.parse(_base64Decode((parts[1] || "{}")));
			signature = parts[2];
		} catch (e) {}
		return {
			header: header,
			claims: claims,
			signature: signature
		};
	}
	/* Decode base64 */
	function _base64Decode(str) {
		if (typeof atob !== "undefined") {
			return atob(str);
		} else {
			return _base64DecodeBackward(str);
		}
	}
	/* Backward compatibility for IE 8 and IE 9 */
	function _base64DecodeBackward(s) {
		var e = {},
			i, b = 0,
			c, x, l = 0,
			a, r = '',
			w = String.fromCharCode,
			L = s.length;
		var A = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		for (i = 0; i < 64; i++) {
			e[A.charAt(i)] = i;
		}
		for (x = 0; x < L; x++) {
			c = e[s.charAt(x)];
			b = (b << 6) + c;
			l += 6;
			while (l >= 8) {
				((a = (b >>> (l -= 8)) & 0xff) || (x < (L - 2))) && (r += w(a));
			}
		}
		return r;
	}
	function _jwtIsValidTimestamp(token) {
		var claims = _decodeJWT(token).claims,
				now = Math.floor((new Date).getTime() / 1E3),
				validSince, validUntil;
		if (typeof claims === "object") {
			if (claims.hasOwnProperty("iat")) {
				validSince = claims.iat;
				/*
				 * We are allowing a grace period of 30 seconds in order to avoid 
				 * premature deletion of the token due to time sync  
				 */
				var thirtySeconds = 30 * 1000;
				var validSinceToDate = new Date(validSince * 1000);
				var dateSince = new Date(validSinceToDate - thirtySeconds);
				validSince = dateSince.getTime() / 1E3;
			}
			if (claims.hasOwnProperty("exp")) {
				validUntil = claims.exp;
			} else {
				validUntil = validSince + 86400;
			}
		}
		return now && validSince && validUntil && now >= validSince && now <= validUntil;
	}

}(this));
/* 
 * Exspose BaseComponent the super class of all components on Stamplay.
 *  It extends Model and Collection.
 */
(function (root) {
	'use strict';

	function BaseComponent(brickId, resourceId) {
		
		var removeAttributes = function (brick, instance) {
			switch (brick) {
			case 'cobject':
				delete instance.__v;
				delete instance.cobjectId;
				delete instance.actions;
				delete instance.appId;
				delete instance.id;
				break;
			case 'user':
				delete instance._id;
				delete instance.id;
				delete instance.__v;
				break;
			default:
				break;
			}
		};

		var buildEndpoint = function(brickId, resourceId, method, id, data, callbackObject){
			var options = {
				method: method,
				url: '/api/' + brickId + '/' + root.Stamplay.VERSION + '/' + resourceId
			}
			if(id)
				options.url= options.url+'/'+id
			if(data && method != 'GET')
				options.data = data
			if(method == 'GET')
				options.thisParams = data;
			return root.Stamplay.makeAPromise(options, callbackObject);
		}

		return {
			brickId : brickId,
			resourceId : resourceId,
			get: function(data, callbackObject){
				return buildEndpoint(this.brickId, this.resourceId, 'GET', false, data, callbackObject)
			},
			getById:function(id, data, callbackObject){
				return buildEndpoint(this.brickId, this.resourceId, 'GET', id, data, callbackObject)
			},
			save : function (data, callbackObject) {
				return buildEndpoint(this.brickId, this.resourceId, 'POST', false, data, callbackObject)
			},
			patch : function(id, data, callbackObject){
				removeAttributes(this.brickId, data);
				return buildEndpoint(this.brickId, this.resourceId, 'PATCH', id, data, callbackObject)
			},
			update: function(id, data, callbackObject){
				removeAttributes(this.brickId, data);
				return buildEndpoint(this.brickId, this.resourceId, 'PUT', id, data, callbackObject)
			},
			remove: function(id, callbackObject){
				return buildEndpoint(this.brickId, this.resourceId, 'DELETE', id, false, callbackObject)
			}
		}
	}
	// Added BaseComponent Object to Stamplay
	root.Stamplay.BaseComponent = BaseComponent;

}(this));/* Add Support function to Stamplay
 * it use for handling some functionality
 * very easy to use : Stamplay.Support.redirect('http://stamplay.com')
 */
(function (root) {
	'use strict';

	// constructor for Support Object
	function Support() {

		// function to redirect to specified url
		this.redirect = function (url) {
			root.location.href = url;
		};

		// function for check if you have user with a specific email 
		this.validateEmail = function (email, callbackObject) {
			return root.Stamplay.makeAPromise({
				method: 'POST',
				data: { email: email },
				url: '/api/auth/' + root.Stamplay.VERSION + '/validate/email'
			}, callbackObject);
		};

	}
	var support = new Support();
	// Added Support Object to Stamplay
	root.Stamplay.Support = support;

})(this);/* Add Query function to Stamplay
 * it use for handling some funcctionality
 * very easy to use : Stamplay.Query('user').equalTo('name':'john')
 */
(function (root) {
	'use strict';

	// constructor for Query Object
	// model is required ever
	function _createGeoQuery(queryOperator, shapeOperator, type, coordinates, maxDistance, minDistance) {
		var obj ={_geolocation:{}}
		obj._geolocation[queryOperator] = {};
		obj._geolocation[queryOperator][shapeOperator] = {type:type, coordinates:coordinates}
		if(maxDistance){
			obj._geolocation[queryOperator].$maxDistance = maxDistance
		}
		if(minDistance){
			obj._geolocation[queryOperator].$minDistance = minDistance	
		}
		return obj;
	}
	
	function _createGeoWithinQuery(shapeOperator, coordinates){
		var obj = {_geolocation:{$geoWithin:{}}}
		obj._geolocation.$geoWithin[shapeOperator] = coordinates
		return obj;
	}

	function Query(model, instance) {
		return {
			
			model : model,
			instance : instance,
			paginationQuery : '',
			sortQuery:'',
			selectionQuery:'',
			populateQuery: '',
			populateOwnerQuery:'',
			whereQuery : [],
			executable : '',

			or : function(){
				var obj = { $or : []};
				var args = arguments;
				if (arguments[0] instanceof Array) {
					args = arguments[0];
				}
				for(var i=0; i<args.length; i++){
					if(args[i].whereQuery)	
						obj.$or.push(args[i].whereQuery[0]);
					else
						throw new Error('Please Or function take only Query object');
				}
				this.whereQuery.push(obj);
				return this
			},

			pagination : function(page, per_page){
				this.paginationQuery = '&page='+page+'&per_page='+per_page;
				return this;
			},

			between : function(attr, value1, value2){
				var obj = {};
				obj[attr] = {"$gte":value1, "$lte":value2};
				this.whereQuery.push(obj);
				return this;
			},

			greaterThan : function(attr, value){
				var obj = {};
				obj[attr] = {"$gt":value};
				this.whereQuery.push(obj);
				return this;
			},	

			greaterThanOrEqual : function(attr, value){
				var obj = {};
				obj[attr] = {"$gte":value};
				this.whereQuery.push(obj);
				return this;
			},

			lessThan : function(attr, value){
				var obj = {};
				obj[attr] = {"$lt":value};
				this.whereQuery.push(obj);
				return this;
			},	

			lessThanOrEqual : function(attr, value){
				var obj = {};
				obj[attr] = {"$lte":value};
				this.whereQuery.push(obj);
				return this;
			},

			equalTo : function(attr, value){
				var obj = {};
				obj[attr] = value;
				this.whereQuery.push(obj);
				return this;
			},

			notEqualTo : function(attr, value){
				var obj = {};
				obj[attr] = {"$ne":value};
				this.whereQuery.push(obj)
				return this;
			},

			sortAscending : function(value){
				this.sortQuery ='&sort='+value
				return this;
			},

			sortDescending : function(value){
				this.sortQuery ='&sort=-'+value
				return this
			},

			exists : function(attr){
				var obj = {};
				obj[attr] = {"$exists":true};
				this.whereQuery.push(obj);
				return this;
			},

			notExists : function(attr){
				var obj = {};
				obj[attr] = {"$exists":false};
				this.whereQuery.push(obj);
				return this;
			},

			regex: function(attr, regex, options){
				var obj = {};
				obj[attr] = {"$regex":regex, "$options": options};
				this.whereQuery.push(obj);
				return this;
			},

			populate: function(){
				this.populateQuery ='&populate=true'
				return this
			},
			
			populateOwner: function(){
				this.populateOwnerQuery ='&populate_owner=true'
				return this
			},

			select: function(){
				this.selectionQuery =  '&select='+ Array.prototype.slice.call(arguments).join(", ").replace(" ",'')
				return this
			},

			near: function(type, coordinates, maxDistance, minDistance){
				var obj = _createGeoQuery("$near", "$geometry", type, coordinates, maxDistance, minDistance)
				this.whereQuery.push(obj);
				return this;
			},

			nearSphere: function(type, coordinates, maxDistance, minDistance){
				var obj = _createGeoQuery("$nearSphere", "$geometry", type, coordinates, maxDistance, minDistance)
				this.whereQuery.push(obj);
				return this;
			},

			geoIntersects: function(type, coordinates){
				var obj = _createGeoQuery("$geoIntersects", "$geometry", type, coordinates)
				this.whereQuery.push(obj);
				return this;
			},

			geoWithinGeometry:function( type, coordinates){
				var obj = _createGeoQuery("$geoWithin", "$geometry", type, coordinates)
				this.whereQuery.push(obj);
				return this;
			},

			geoWithinCenterSphere: function(coordinates, radius){
				var finalParam = [coordinates, radius]
				var obj = _createGeoWithinQuery('$centerSphere',finalParam)
				this.whereQuery.push(obj);
				return this;
			},

			exec : function(callback){
				//build query
				for(var i=0;i<this.whereQuery.length;i++){	
					var partial = JSON.stringify(this.whereQuery[i]);
					partial = partial.substring(1, partial.length-1);
					if(i===0)
						this.executable += partial;
					else
						this.executable += ','+partial;
				}
				
				switch(this.model){
					case 'object':
						this.model = 'cobject'
					break
					default:
						this.instance = 'users'
					break
				}

				var Url = '/api/' + this.model + '/' + root.Stamplay.VERSION + '/' + this.instance 
								+'?where={'+this.executable+'}'+ this.paginationQuery + this.selectionQuery 
								+ this.sortQuery + this.populateQuery + this.populateOwnerQuery

				return root.Stamplay.makeAPromise({
					method: 'GET',
					url:  Url
				},callback)
			}
		}
	}
	// Added Query Object to Stamplay
	root.Stamplay.Query = Query;
})(this);/*
	Brick : User
 	GET    '/api/user/VERSION/users'
  GET    '/api/user/VERSION/users/:id'
  POST   '/api/user/VERSION/users'
  PUT    '/api/user/VERSION/users/:id'
  DELETE '/api/user/VERSION/users/:id'
  GET    '/api/user/VERSION/getStatus'
*/

(function (root) {
	'use strict';

	/*
		User component : Stamplay.User
		This class rappresent the User component on Stamplay platform
		It very easy to use: Stamplay.User
	*/

	var  User = {
		brickId:'user',
		resourceId:'users',
		currentUser : function (callbackObject){
			return root.Stamplay.makeAPromise({
				method: 'GET',
				url: '/api/' + this.brickId + '/' + root.Stamplay.VERSION + '/getStatus'
			}, callbackObject)
		},
		login :function (data, callbackObject) {
			return root.Stamplay.makeAPromise({
				method: 'POST',
				data: data,
				url: '/auth/' + root.Stamplay.VERSION + '/local/login'
			}, callbackObject)
		},
		socialLogin: function(provider){
			if(provider){
				var url = '/auth/' + root.Stamplay.VERSION + '/' + provider + '/connect';
				if(root.Stamplay.OPTIONS.isMobile){
						//need an external plugin to work - https://github.com/apache/cordova-plugin-inappbrowser
						var popup = root.open(root.Stamplay.BASEURL+url, 'socialLogin', 'left=1,top=1,width=600,height=600')
						popup.addEventListener('loadstart', function (e) {
						var reg = new RegExp('jwt=([A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+=]+)')
						if(e.url.indexOf('jwt=') > -1){
							var jwt = e.url.match(reg)[1]
							store.set(root.location.origin + '-jwt', jwt);
							if(root.Stamplay.OPTIONS.autoRefreshSocialLogin)
								location.reload();
							popup.close();
						}
        	});
				}else{
					var jwt = store.get(root.location.origin + '-jwt');
					if (jwt) {
						// Store temporary cookie to permit user aggregation (multiple social identities)
					  var date = new Date();
		        date.setTime(date.getTime() + 5 * 60 * 1000);
						root.document.cookie = 'stamplay.jwt='+jwt+'; expires=' + date.toGMTString() + '; path=/'
					}
					var port = (root.location.port) ? ':'+root.location.port : '';
					var redirection = location.protocol + '//' + root.document.domain +port+ url
					//if you are using sdk on your *personal site*
					//remember to manage the callback url for social login in editor
					if(root.Stamplay.OPTIONS.absoluteUrl){
						redirection = root.Stamplay.BASEURL+url
					}
					root.Stamplay.Support.redirect(redirection);
				}
			}else{
				throw new Error('Stamplay.User.socialLogin needs the service name');
			}
		},
		signup : function (data, callbackObject) {
			return root.Stamplay.makeAPromise({
				method: 'POST',
				data: data,
				url: '/api/' + this.brickId + '/' + root.Stamplay.VERSION + '/' + this.resourceId
			}, callbackObject)
		},
		logout : function (async, callbackObject) {
			var jwt = store.get(root.location.origin + '-jwt');
			if (root.Stamplay.USESTORAGE)
				store.remove(root.location.origin + '-jwt');
			if(async){
				return root.Stamplay.makeAPromise({
				method: 'GET',
				url: '/auth/' + root.Stamplay.VERSION + '/logout?jwt='+jwt
				}, callbackObject)
			}else{
				var url = '/auth/' + root.Stamplay.VERSION + '/logout?jwt='+jwt;
				var port = (root.location.port) ? ':'+root.location.port : '';
				var redirection = location.protocol + '//' + root.document.domain +port+ url
				if(root.Stamplay.OPTIONS.absoluteUrl){
					redirection = root.Stamplay.BASEURL+url
				}
				root.Stamplay.Support.redirect(redirection);
			}
		},
		resetPassword: function(data, callbackObject){
			return root.Stamplay.makeAPromise({
				method: 'POST',
				data: data,
				url: '/api/' + this.brickId + '/' + root.Stamplay.VERSION + '/users/resetpassword'
			}, callbackObject)
		},
		getRoles:function (callbackObject) {
			return root.Stamplay.makeAPromise({
				method: 'GET',
				url: '/api/user/' + root.Stamplay.VERSION + '/roles'
			}, callbackObject);
		},
		getRole:function (roleId, callbackObject) {
			return root.Stamplay.makeAPromise({
				method: 'GET',
				url: '/api/user/' + root.Stamplay.VERSION + '/roles/'+ roleId
			}, callbackObject);
		},
		setRole:function (id, roleId, callbackObject) {
			return root.Stamplay.makeAPromise({
				method: 'PATCH',
				data: {'givenRole': roleId},
				url: '/api/user/' + root.Stamplay.VERSION + '/users/'+ id + '/role'
			}, callbackObject);
		}
	}
	root.Stamplay.extend(User, root.Stamplay.BaseComponent(User.brickId, User.resourceId))
	delete User.patch
	User.remove = function(id, callbackObject){
		return root.Stamplay.makeAPromise({
			method: 'DELETE',
			url: '/api/' + this.brickId + '/' + root.Stamplay.VERSION + '/' + this.resourceId + '/' + id
		},callbackObject).then(function(resp){
			if (root.Stamplay.USESTORAGE) {
				var jwt = store.get(root.location.origin + '-jwt');
				if (jwt) {
					store.remove(root.location.origin + '-jwt');
				}
			}
		})
	}
	//Added User to Stamplay
	root.Stamplay.User = User;
})(this);
/* Brick : Cobject
	GET     '/api/cobject/VERSION/:cobjectId
	GET     '/api/cobject/VERSION/:cobjectId/:id
	PUT     '/api/cobject/VERSION/:cobjectId/:id
	PATCH   '/api/cobject/VERSION/:cobjectId/:id
	POST    '/api/cobject/VERSION/:cobjectId
	DELETE  '/api/cobject/VERSION/:cobjectId/:id
	PUT			'/api/cobject/VERSION/:cobjectId/:id/rate
	PUT     '/api/cobject/VERSION/:cobjectId/:id/comment
	PUT     '/api/cobject/VERSION/:cobjectId/:id/vote
	PUT     '/api/cobject/VERSION/:cobjectId/:id/facebook_share
	PUT     '/api/cobject/VERSION/:cobjectId/:id/twitter_share
*/
(function (root) {
	'use strict';

	/**
		Custom object component : Stamplay.Object
		This class rappresent the Object component on Stamplay platform
		It very easy to use: Stamplay.Object([Objectid])
	*/
	var makeActionPromise = function (id, action, data, callbackObject) {
		return root.Stamplay.makeAPromise({
			method: 'PUT',
			data: (data) ? data : {},
			url: '/api/' + this.brickId + '/' + root.Stamplay.VERSION + '/' + this.resourceId + '/' + id +
				'/' + action
		}, callbackObject)
	};

	var getId = function (resourceId, id) {
		return root.Stamplay.BaseComponent('cobject', resourceId + '/' + id).get()
	};

	var pushId = function (resourceId, id, newData, callbackObject) {
		return root.Stamplay.BaseComponent('cobject', resourceId).patch(id, newData, callbackObject)
	};

	var buildAttr = function (response, attribute, data) {
			var newData = {}
			newData[attribute] = response[attribute] || []
			newData[attribute].push(data)
			return newData
		}
		//constructor
	function Object(resourceId) {
		if (resourceId) {
			return root.Stamplay.extend({
				brickId: 'cobject',
				resourceId: resourceId,
				findByCurrentUser: function (attr, data, callbackObject) {
					var attribute = 'owner';
					var params = {};
					var callback;
					if (arguments.length === 3) {
						attribute = attr;
						params = data;
						callback = callbackObject;
					} else if (arguments.length === 2) {
						if (root.Stamplay.isFunction(arguments[1])) {
							callback = arguments[1];
							attribute = (root.Stamplay.isString(arguments[0])) ? arguments[0] : 'owner';
							params = (root.Stamplay.isObject(arguments[0])) ? arguments[0] : {};
						} else {
							attribute = arguments[0];
							params = arguments[1]
						}
					} else if (arguments.length === 1) {
						if (root.Stamplay.isFunction(arguments[0])) {
							callback = arguments[0];
						} else {
							attribute = (root.Stamplay.isString(arguments[0])) ? arguments[0] : 'owner';
							params = (root.Stamplay.isObject(arguments[0])) ? arguments[0] : {};
						}
					}

					return root.Stamplay.makeAPromise({
						method: 'GET',
						thisParams: params,
						url: '/api/' + this.brickId + '/' + root.Stamplay.VERSION + '/' + this.resourceId +
							'/find/' + attribute
					}, callback)
				},
				upVote: function (id, callbackObject) {
					return makeActionPromise.call(this, id, 'vote', {
						type: 'upvote'
					}, callbackObject);
				},
				downVote: function (id, callbackObject) {
					return makeActionPromise.call(this, id, 'vote', {
						type: 'downvote'
					}, callbackObject);
				},
				rate: function (id, vote, callbackObject) {
					return makeActionPromise.call(this, id, 'rate', {
						rate: vote
					}, callbackObject);
				},
				comment: function (id, text, callbackObject) {
					return makeActionPromise.call(this, id, 'comment', {
						text: text
					}, callbackObject);
				},
				push: function (id, attribute, data, callbackObject) {
					if (callbackObject) {
						return getId(resourceId, id)
							.then(function (response) {
								var newData = buildAttr(response, attribute, data)
								return pushId(resourceId, id, newData, callbackObject)
							}, function (err) {
								callbackObject(err, null)
							}).fail(function (err) {
								callbackObject(err, null)
							})
					} else {
						return getId(resourceId, id)
							.then(function (response) {
								var newData = buildAttr(response, attribute, data)
								return pushId(resourceId, id, newData)
							})
					}

				}
			}, root.Stamplay.BaseComponent('cobject', resourceId))
		} else {
			throw new Error('Stamplay.Object(objecId) needs a objectId');
		}
	}
	//Added Cobject to Stamplay
	root.Stamplay.Object = Object;
})(this);
/* Brick : Webhook 
 *  POST   '/api/webhook/VERSION/:webhookId/catch'
 */
(function (root) {
	'use strict';

	/*
		Webhook component : Stamplay.Webhook 
		This class rappresent the Webhook Object component on Stamplay platform
		It very easy to use: Stamplay.Webhook([WebhookName])
	*/

	//constructor
	function Webhook(resourceId) {
		var resource = resourceId.replace(/[^\w\s]/gi, '').trim().toLowerCase().replace(/\s+/g, '_');
		var url = '/api/webhook/' + root.Stamplay.VERSION + '/' + resource + '/catch';
		return {
			post: function (data, callbackObject) {
				return root.Stamplay.makeAPromise({
					method: 'POST',
					data: data,
					url: url
				}, callbackObject);
			},
			// put: function (data, queryParams, callbackObject) {
			// 	return root.Stamplay.makeAPromise({
			// 		method: 'PUT',
			// 		data: data,
			// 		url: url,
			// 		thisParams: queryParams
			// 	}, callbackObject);
			// },
			// get: function (queryParams, callbackObject) {
			// 	return root.Stamplay.makeAPromise({
			// 		method: 'GET',
			// 		url: url,
			// 		thisParams: queryParams
			// 	}, callbackObject);
			// }
		}
	}
	//Added Webhook to Stamplay 
	root.Stamplay.Webhook = Webhook;

})(this);/* Brick : stripe 
 * POST  'api/stripe/VERSION/customers'
 * POST  'api/stripe/VERSION/customers/:userId/cards'
 * POST  'api/stripe/VERSION/charges'
 * POST  'api/stripe/VERSION/customers/:userId/subscriptions'
 * GET   'api/stripe/VERSION/customers/:userId/subscriptions'
 */
(function (root) {
	'use strict';

	/*
		Stripe component : Stamplay.Stripe 
		This class rappresent the Stripe Object component on Stamplay platform
		It very easy to use: Stamplay.Stripe()
	*/
	//constructor
	var Stripe = {
		url : '/api/stripe/' + root.Stamplay.VERSION + '/',
		createCustomer : function (userId, callbackObject) {
			return root.Stamplay.makeAPromise({
				method: 'POST',
				data: {'userId': userId},
				url: this.url + 'customers'
			}, callbackObject);
		},
		createCreditCard : function (userId, token, callbackObject) {
			if (arguments.length >= 2 && (root.Stamplay.isString(arguments[0]) && root.Stamplay.isString(arguments[1]))) {
				return root.Stamplay.makeAPromise({
					method: 'POST',
					data: {'token': token},
					url: this.url + 'customers/' + userId + '/cards'
				}, callbackObject);
			} else {
				throw new Error('Stamplay.Stripe.createCustomer:  missing parameters');
			}
		},
		updateCreditCard : function (userId, token, callbackObject) {
			if (arguments.length >= 2 && (root.Stamplay.isString(arguments[0]) && root.Stamplay.isString(arguments[1]))) {
					return root.Stamplay.makeAPromise({
						method: 'PUT',
						data: {'token': token},
						url: this.url + 'customers/' + userId + '/cards'
					},callbackObject);
			} else {
				throw new Error('Stamplay.Stripe.updateCreditCard:  missing parameters');
			}
		},
		charge : function (userId, token, amount, currency, callbackObject) {
			if (arguments.length >= 4 && (root.Stamplay.isString(arguments[0]) && root.Stamplay.isString(arguments[1]) && root.Stamplay.isNumber(arguments[2]) && root.Stamplay.isString(arguments[3]) )){
				return root.Stamplay.makeAPromise({
					method: 'POST',
					data: {
						'userId': userId,
						'token': token,
						'amount': amount,
						'currency': currency
					},
					url: this.url + 'charges'
				}, callbackObject);
			} else {
				throw new Error('Stamplay.Stripe.charge:  missing or incorrect parameters');
			}
		},
		createSubscription : function (userId, planId, callbackObject) {
			if (arguments.length >= 2 && (root.Stamplay.isString(arguments[0]) && root.Stamplay.isString(arguments[1]))) {
				return root.Stamplay.makeAPromise({
					method: 'POST',
					data: {'planId': planId},
					url: this.url + 'customers/' + userId + '/subscriptions'
				}, callbackObject);
			} else {
				throw new Error('Stamplay.Stripe.createSubscription:  missing parameters');
			}
		},
		getSubscriptions : function (userId, options, callbackObject) {
			if (arguments.length >= 2) {
				return root.Stamplay.makeAPromise({
					method: 'GET',
					url: this.url + 'customers/' + userId + '/subscriptions',
					thisParams: options
				}, callbackObject);
			} else {
				throw new Error('Stamplay.Stripe.getSubscriptions:  missing parameters');
			}
		},
		getSubscription : function (userId, subscriptionId, callbackObject) {
			if (arguments.length >= 2 && (root.Stamplay.isString(arguments[0]) && root.Stamplay.isString(arguments[1]))) {
				return root.Stamplay.makeAPromise({
					method: 'GET',
					url: this.url + 'customers/' + userId + '/subscriptions/' + subscriptionId,
				}, callbackObject);
			} else {
				throw new Error('Stamplay.Stripe.getSubscription:  missing parameters');
			}
		},
		getCreditCard : function (userId, callbackObject) {
			return root.Stamplay.makeAPromise({
				method: 'GET',
				url: this.url + 'customers/' + userId + '/cards',
			}, callbackObject);
		},
		deleteSubscription : function (userId, subscriptionId, options, callbackObject) {
			if (arguments.length >= 3) {
				return root.Stamplay.makeAPromise({
					method: 'DELETE',
					url: this.url + 'customers/' + userId + '/subscriptions/' + subscriptionId,
					data: options
				}, callbackObject);
			} else {
				throw new Error('Stamplay.Stripe.deleteSubscription:  missing parameters');
			}
		},
		updateSubscription : function (userId, subscriptionId, options, callbackObject) {
			if (arguments.length >= 3) {
				return root.Stamplay.makeAPromise({
					method: 'PUT',
					url: this.url + 'customers/' + userId + '/subscriptions/' + subscriptionId,
					data: {
						options: options
					}
				}, callbackObject);
			} else {
				throw new Error('Stamplay.Stripe.updateSubscription:  missing parameters');
			}
		}
	}
	root.Stamplay.Stripe = Stripe;
})(this);/* Brick : Codeblock
 *  POST   '/api/codeblock/VERSION/:CodeblockId/run'
 */
(function (root) {
	'use strict';
	/*
		Codeblock component : Stamplay.Codeblock
		This class rappresent the Codeblock Object component on Stamplay platform
		Stamplay.Codeblock(codeblockId)
	*/
	function _buildMethod(method, url, data, queryParams, callbackObject) {
		return root.Stamplay.makeAPromise({
			method: method,
			data: data,
			url: url,
			thisParams: queryParams
		}, callbackObject);
	}
	//constructor
	function Codeblock(resourceId) {
		var resource = resourceId.replace(/[^\w\s]/gi, '').trim().toLowerCase().replace(/\s+/g, '_');
		var url = '/api/codeblock/' + root.Stamplay.VERSION + '/run/' + resource;
		return {
			run: function (data, queryParams, callbackObject) {
				return _buildMethod('POST', url, data, queryParams, callbackObject);
			},
			post: function (data, queryParams, callbackObject) {
				return _buildMethod('POST', url, data, queryParams, callbackObject);
			},
			get: function (queryParams, callbackObject) {
				return _buildMethod('GET', url, null, queryParams, callbackObject)
			},
			put: function (data, queryParams, callbackObject) {
				return _buildMethod('PUT', url, data, queryParams, callbackObject)
			},
			patch: function (data, queryParams, callbackObject) {
				return _buildMethod('PATCH', url, data, queryParams, callbackObject)
			},
			delete: function (queryParams, callbackObject) {
				return _buildMethod('DELETE', url, null, queryParams, callbackObject)
			},
		}
	}
	//Added Codeblock to Stamplay
	root.Stamplay.Codeblock = Codeblock;
})(this);
