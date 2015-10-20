/*! Stamplay v1.3.1 | (c) 2015 The Stamplay Dreamteam *///     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
(function(){function n(n){function t(t,r,e,u,i,o){for(;i>=0&&o>i;i+=n){var a=u?u[i]:i;e=r(e,t[a],a,t)}return e}return function(r,e,u,i){e=b(e,i,4);var o=!k(r)&&m.keys(r),a=(o||r).length,c=n>0?0:a-1;return arguments.length<3&&(u=r[o?o[c]:c],c+=n),t(r,e,u,o,c,a)}}function t(n){return function(t,r,e){r=x(r,e);for(var u=O(t),i=n>0?0:u-1;i>=0&&u>i;i+=n)if(r(t[i],i,t))return i;return-1}}function r(n,t,r){return function(e,u,i){var o=0,a=O(e);if("number"==typeof i)n>0?o=i>=0?i:Math.max(i+a,o):a=i>=0?Math.min(i+1,a):i+a+1;else if(r&&i&&a)return i=r(e,u),e[i]===u?i:-1;if(u!==u)return i=t(l.call(e,o,a),m.isNaN),i>=0?i+o:-1;for(i=n>0?o:a-1;i>=0&&a>i;i+=n)if(e[i]===u)return i;return-1}}function e(n,t){var r=I.length,e=n.constructor,u=m.isFunction(e)&&e.prototype||a,i="constructor";for(m.has(n,i)&&!m.contains(t,i)&&t.push(i);r--;)i=I[r],i in n&&n[i]!==u[i]&&!m.contains(t,i)&&t.push(i)}var u=this,i=u._,o=Array.prototype,a=Object.prototype,c=Function.prototype,f=o.push,l=o.slice,s=a.toString,p=a.hasOwnProperty,h=Array.isArray,v=Object.keys,g=c.bind,y=Object.create,d=function(){},m=function(n){return n instanceof m?n:this instanceof m?void(this._wrapped=n):new m(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=m),exports._=m):u._=m,m.VERSION="1.8.3";var b=function(n,t,r){if(t===void 0)return n;switch(null==r?3:r){case 1:return function(r){return n.call(t,r)};case 2:return function(r,e){return n.call(t,r,e)};case 3:return function(r,e,u){return n.call(t,r,e,u)};case 4:return function(r,e,u,i){return n.call(t,r,e,u,i)}}return function(){return n.apply(t,arguments)}},x=function(n,t,r){return null==n?m.identity:m.isFunction(n)?b(n,t,r):m.isObject(n)?m.matcher(n):m.property(n)};m.iteratee=function(n,t){return x(n,t,1/0)};var _=function(n,t){return function(r){var e=arguments.length;if(2>e||null==r)return r;for(var u=1;e>u;u++)for(var i=arguments[u],o=n(i),a=o.length,c=0;a>c;c++){var f=o[c];t&&r[f]!==void 0||(r[f]=i[f])}return r}},j=function(n){if(!m.isObject(n))return{};if(y)return y(n);d.prototype=n;var t=new d;return d.prototype=null,t},w=function(n){return function(t){return null==t?void 0:t[n]}},A=Math.pow(2,53)-1,O=w("length"),k=function(n){var t=O(n);return"number"==typeof t&&t>=0&&A>=t};m.each=m.forEach=function(n,t,r){t=b(t,r);var e,u;if(k(n))for(e=0,u=n.length;u>e;e++)t(n[e],e,n);else{var i=m.keys(n);for(e=0,u=i.length;u>e;e++)t(n[i[e]],i[e],n)}return n},m.map=m.collect=function(n,t,r){t=x(t,r);for(var e=!k(n)&&m.keys(n),u=(e||n).length,i=Array(u),o=0;u>o;o++){var a=e?e[o]:o;i[o]=t(n[a],a,n)}return i},m.reduce=m.foldl=m.inject=n(1),m.reduceRight=m.foldr=n(-1),m.find=m.detect=function(n,t,r){var e;return e=k(n)?m.findIndex(n,t,r):m.findKey(n,t,r),e!==void 0&&e!==-1?n[e]:void 0},m.filter=m.select=function(n,t,r){var e=[];return t=x(t,r),m.each(n,function(n,r,u){t(n,r,u)&&e.push(n)}),e},m.reject=function(n,t,r){return m.filter(n,m.negate(x(t)),r)},m.every=m.all=function(n,t,r){t=x(t,r);for(var e=!k(n)&&m.keys(n),u=(e||n).length,i=0;u>i;i++){var o=e?e[i]:i;if(!t(n[o],o,n))return!1}return!0},m.some=m.any=function(n,t,r){t=x(t,r);for(var e=!k(n)&&m.keys(n),u=(e||n).length,i=0;u>i;i++){var o=e?e[i]:i;if(t(n[o],o,n))return!0}return!1},m.contains=m.includes=m.include=function(n,t,r,e){return k(n)||(n=m.values(n)),("number"!=typeof r||e)&&(r=0),m.indexOf(n,t,r)>=0},m.invoke=function(n,t){var r=l.call(arguments,2),e=m.isFunction(t);return m.map(n,function(n){var u=e?t:n[t];return null==u?u:u.apply(n,r)})},m.pluck=function(n,t){return m.map(n,m.property(t))},m.where=function(n,t){return m.filter(n,m.matcher(t))},m.findWhere=function(n,t){return m.find(n,m.matcher(t))},m.max=function(n,t,r){var e,u,i=-1/0,o=-1/0;if(null==t&&null!=n){n=k(n)?n:m.values(n);for(var a=0,c=n.length;c>a;a++)e=n[a],e>i&&(i=e)}else t=x(t,r),m.each(n,function(n,r,e){u=t(n,r,e),(u>o||u===-1/0&&i===-1/0)&&(i=n,o=u)});return i},m.min=function(n,t,r){var e,u,i=1/0,o=1/0;if(null==t&&null!=n){n=k(n)?n:m.values(n);for(var a=0,c=n.length;c>a;a++)e=n[a],i>e&&(i=e)}else t=x(t,r),m.each(n,function(n,r,e){u=t(n,r,e),(o>u||1/0===u&&1/0===i)&&(i=n,o=u)});return i},m.shuffle=function(n){for(var t,r=k(n)?n:m.values(n),e=r.length,u=Array(e),i=0;e>i;i++)t=m.random(0,i),t!==i&&(u[i]=u[t]),u[t]=r[i];return u},m.sample=function(n,t,r){return null==t||r?(k(n)||(n=m.values(n)),n[m.random(n.length-1)]):m.shuffle(n).slice(0,Math.max(0,t))},m.sortBy=function(n,t,r){return t=x(t,r),m.pluck(m.map(n,function(n,r,e){return{value:n,index:r,criteria:t(n,r,e)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index-t.index}),"value")};var F=function(n){return function(t,r,e){var u={};return r=x(r,e),m.each(t,function(e,i){var o=r(e,i,t);n(u,e,o)}),u}};m.groupBy=F(function(n,t,r){m.has(n,r)?n[r].push(t):n[r]=[t]}),m.indexBy=F(function(n,t,r){n[r]=t}),m.countBy=F(function(n,t,r){m.has(n,r)?n[r]++:n[r]=1}),m.toArray=function(n){return n?m.isArray(n)?l.call(n):k(n)?m.map(n,m.identity):m.values(n):[]},m.size=function(n){return null==n?0:k(n)?n.length:m.keys(n).length},m.partition=function(n,t,r){t=x(t,r);var e=[],u=[];return m.each(n,function(n,r,i){(t(n,r,i)?e:u).push(n)}),[e,u]},m.first=m.head=m.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:m.initial(n,n.length-t)},m.initial=function(n,t,r){return l.call(n,0,Math.max(0,n.length-(null==t||r?1:t)))},m.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:m.rest(n,Math.max(0,n.length-t))},m.rest=m.tail=m.drop=function(n,t,r){return l.call(n,null==t||r?1:t)},m.compact=function(n){return m.filter(n,m.identity)};var S=function(n,t,r,e){for(var u=[],i=0,o=e||0,a=O(n);a>o;o++){var c=n[o];if(k(c)&&(m.isArray(c)||m.isArguments(c))){t||(c=S(c,t,r));var f=0,l=c.length;for(u.length+=l;l>f;)u[i++]=c[f++]}else r||(u[i++]=c)}return u};m.flatten=function(n,t){return S(n,t,!1)},m.without=function(n){return m.difference(n,l.call(arguments,1))},m.uniq=m.unique=function(n,t,r,e){m.isBoolean(t)||(e=r,r=t,t=!1),null!=r&&(r=x(r,e));for(var u=[],i=[],o=0,a=O(n);a>o;o++){var c=n[o],f=r?r(c,o,n):c;t?(o&&i===f||u.push(c),i=f):r?m.contains(i,f)||(i.push(f),u.push(c)):m.contains(u,c)||u.push(c)}return u},m.union=function(){return m.uniq(S(arguments,!0,!0))},m.intersection=function(n){for(var t=[],r=arguments.length,e=0,u=O(n);u>e;e++){var i=n[e];if(!m.contains(t,i)){for(var o=1;r>o&&m.contains(arguments[o],i);o++);o===r&&t.push(i)}}return t},m.difference=function(n){var t=S(arguments,!0,!0,1);return m.filter(n,function(n){return!m.contains(t,n)})},m.zip=function(){return m.unzip(arguments)},m.unzip=function(n){for(var t=n&&m.max(n,O).length||0,r=Array(t),e=0;t>e;e++)r[e]=m.pluck(n,e);return r},m.object=function(n,t){for(var r={},e=0,u=O(n);u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},m.findIndex=t(1),m.findLastIndex=t(-1),m.sortedIndex=function(n,t,r,e){r=x(r,e,1);for(var u=r(t),i=0,o=O(n);o>i;){var a=Math.floor((i+o)/2);r(n[a])<u?i=a+1:o=a}return i},m.indexOf=r(1,m.findIndex,m.sortedIndex),m.lastIndexOf=r(-1,m.findLastIndex),m.range=function(n,t,r){null==t&&(t=n||0,n=0),r=r||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=Array(e),i=0;e>i;i++,n+=r)u[i]=n;return u};var E=function(n,t,r,e,u){if(!(e instanceof t))return n.apply(r,u);var i=j(n.prototype),o=n.apply(i,u);return m.isObject(o)?o:i};m.bind=function(n,t){if(g&&n.bind===g)return g.apply(n,l.call(arguments,1));if(!m.isFunction(n))throw new TypeError("Bind must be called on a function");var r=l.call(arguments,2),e=function(){return E(n,e,t,this,r.concat(l.call(arguments)))};return e},m.partial=function(n){var t=l.call(arguments,1),r=function(){for(var e=0,u=t.length,i=Array(u),o=0;u>o;o++)i[o]=t[o]===m?arguments[e++]:t[o];for(;e<arguments.length;)i.push(arguments[e++]);return E(n,r,this,this,i)};return r},m.bindAll=function(n){var t,r,e=arguments.length;if(1>=e)throw new Error("bindAll must be passed function names");for(t=1;e>t;t++)r=arguments[t],n[r]=m.bind(n[r],n);return n},m.memoize=function(n,t){var r=function(e){var u=r.cache,i=""+(t?t.apply(this,arguments):e);return m.has(u,i)||(u[i]=n.apply(this,arguments)),u[i]};return r.cache={},r},m.delay=function(n,t){var r=l.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},m.defer=m.partial(m.delay,m,1),m.throttle=function(n,t,r){var e,u,i,o=null,a=0;r||(r={});var c=function(){a=r.leading===!1?0:m.now(),o=null,i=n.apply(e,u),o||(e=u=null)};return function(){var f=m.now();a||r.leading!==!1||(a=f);var l=t-(f-a);return e=this,u=arguments,0>=l||l>t?(o&&(clearTimeout(o),o=null),a=f,i=n.apply(e,u),o||(e=u=null)):o||r.trailing===!1||(o=setTimeout(c,l)),i}},m.debounce=function(n,t,r){var e,u,i,o,a,c=function(){var f=m.now()-o;t>f&&f>=0?e=setTimeout(c,t-f):(e=null,r||(a=n.apply(i,u),e||(i=u=null)))};return function(){i=this,u=arguments,o=m.now();var f=r&&!e;return e||(e=setTimeout(c,t)),f&&(a=n.apply(i,u),i=u=null),a}},m.wrap=function(n,t){return m.partial(t,n)},m.negate=function(n){return function(){return!n.apply(this,arguments)}},m.compose=function(){var n=arguments,t=n.length-1;return function(){for(var r=t,e=n[t].apply(this,arguments);r--;)e=n[r].call(this,e);return e}},m.after=function(n,t){return function(){return--n<1?t.apply(this,arguments):void 0}},m.before=function(n,t){var r;return function(){return--n>0&&(r=t.apply(this,arguments)),1>=n&&(t=null),r}},m.once=m.partial(m.before,2);var M=!{toString:null}.propertyIsEnumerable("toString"),I=["valueOf","isPrototypeOf","toString","propertyIsEnumerable","hasOwnProperty","toLocaleString"];m.keys=function(n){if(!m.isObject(n))return[];if(v)return v(n);var t=[];for(var r in n)m.has(n,r)&&t.push(r);return M&&e(n,t),t},m.allKeys=function(n){if(!m.isObject(n))return[];var t=[];for(var r in n)t.push(r);return M&&e(n,t),t},m.values=function(n){for(var t=m.keys(n),r=t.length,e=Array(r),u=0;r>u;u++)e[u]=n[t[u]];return e},m.mapObject=function(n,t,r){t=x(t,r);for(var e,u=m.keys(n),i=u.length,o={},a=0;i>a;a++)e=u[a],o[e]=t(n[e],e,n);return o},m.pairs=function(n){for(var t=m.keys(n),r=t.length,e=Array(r),u=0;r>u;u++)e[u]=[t[u],n[t[u]]];return e},m.invert=function(n){for(var t={},r=m.keys(n),e=0,u=r.length;u>e;e++)t[n[r[e]]]=r[e];return t},m.functions=m.methods=function(n){var t=[];for(var r in n)m.isFunction(n[r])&&t.push(r);return t.sort()},m.extend=_(m.allKeys),m.extendOwn=m.assign=_(m.keys),m.findKey=function(n,t,r){t=x(t,r);for(var e,u=m.keys(n),i=0,o=u.length;o>i;i++)if(e=u[i],t(n[e],e,n))return e},m.pick=function(n,t,r){var e,u,i={},o=n;if(null==o)return i;m.isFunction(t)?(u=m.allKeys(o),e=b(t,r)):(u=S(arguments,!1,!1,1),e=function(n,t,r){return t in r},o=Object(o));for(var a=0,c=u.length;c>a;a++){var f=u[a],l=o[f];e(l,f,o)&&(i[f]=l)}return i},m.omit=function(n,t,r){if(m.isFunction(t))t=m.negate(t);else{var e=m.map(S(arguments,!1,!1,1),String);t=function(n,t){return!m.contains(e,t)}}return m.pick(n,t,r)},m.defaults=_(m.allKeys,!0),m.create=function(n,t){var r=j(n);return t&&m.extendOwn(r,t),r},m.clone=function(n){return m.isObject(n)?m.isArray(n)?n.slice():m.extend({},n):n},m.tap=function(n,t){return t(n),n},m.isMatch=function(n,t){var r=m.keys(t),e=r.length;if(null==n)return!e;for(var u=Object(n),i=0;e>i;i++){var o=r[i];if(t[o]!==u[o]||!(o in u))return!1}return!0};var N=function(n,t,r,e){if(n===t)return 0!==n||1/n===1/t;if(null==n||null==t)return n===t;n instanceof m&&(n=n._wrapped),t instanceof m&&(t=t._wrapped);var u=s.call(n);if(u!==s.call(t))return!1;switch(u){case"[object RegExp]":case"[object String]":return""+n==""+t;case"[object Number]":return+n!==+n?+t!==+t:0===+n?1/+n===1/t:+n===+t;case"[object Date]":case"[object Boolean]":return+n===+t}var i="[object Array]"===u;if(!i){if("object"!=typeof n||"object"!=typeof t)return!1;var o=n.constructor,a=t.constructor;if(o!==a&&!(m.isFunction(o)&&o instanceof o&&m.isFunction(a)&&a instanceof a)&&"constructor"in n&&"constructor"in t)return!1}r=r||[],e=e||[];for(var c=r.length;c--;)if(r[c]===n)return e[c]===t;if(r.push(n),e.push(t),i){if(c=n.length,c!==t.length)return!1;for(;c--;)if(!N(n[c],t[c],r,e))return!1}else{var f,l=m.keys(n);if(c=l.length,m.keys(t).length!==c)return!1;for(;c--;)if(f=l[c],!m.has(t,f)||!N(n[f],t[f],r,e))return!1}return r.pop(),e.pop(),!0};m.isEqual=function(n,t){return N(n,t)},m.isEmpty=function(n){return null==n?!0:k(n)&&(m.isArray(n)||m.isString(n)||m.isArguments(n))?0===n.length:0===m.keys(n).length},m.isElement=function(n){return!(!n||1!==n.nodeType)},m.isArray=h||function(n){return"[object Array]"===s.call(n)},m.isObject=function(n){var t=typeof n;return"function"===t||"object"===t&&!!n},m.each(["Arguments","Function","String","Number","Date","RegExp","Error"],function(n){m["is"+n]=function(t){return s.call(t)==="[object "+n+"]"}}),m.isArguments(arguments)||(m.isArguments=function(n){return m.has(n,"callee")}),"function"!=typeof/./&&"object"!=typeof Int8Array&&(m.isFunction=function(n){return"function"==typeof n||!1}),m.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},m.isNaN=function(n){return m.isNumber(n)&&n!==+n},m.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"===s.call(n)},m.isNull=function(n){return null===n},m.isUndefined=function(n){return n===void 0},m.has=function(n,t){return null!=n&&p.call(n,t)},m.noConflict=function(){return u._=i,this},m.identity=function(n){return n},m.constant=function(n){return function(){return n}},m.noop=function(){},m.property=w,m.propertyOf=function(n){return null==n?function(){}:function(t){return n[t]}},m.matcher=m.matches=function(n){return n=m.extendOwn({},n),function(t){return m.isMatch(t,n)}},m.times=function(n,t,r){var e=Array(Math.max(0,n));t=b(t,r,1);for(var u=0;n>u;u++)e[u]=t(u);return e},m.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))},m.now=Date.now||function(){return(new Date).getTime()};var B={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},T=m.invert(B),R=function(n){var t=function(t){return n[t]},r="(?:"+m.keys(n).join("|")+")",e=RegExp(r),u=RegExp(r,"g");return function(n){return n=null==n?"":""+n,e.test(n)?n.replace(u,t):n}};m.escape=R(B),m.unescape=R(T),m.result=function(n,t,r){var e=null==n?void 0:n[t];return e===void 0&&(e=r),m.isFunction(e)?e.call(n):e};var q=0;m.uniqueId=function(n){var t=++q+"";return n?n+t:t},m.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var K=/(.)^/,z={"'":"'","\\":"\\","\r":"r","\n":"n","\u2028":"u2028","\u2029":"u2029"},D=/\\|'|\r|\n|\u2028|\u2029/g,L=function(n){return"\\"+z[n]};m.template=function(n,t,r){!t&&r&&(t=r),t=m.defaults({},t,m.templateSettings);var e=RegExp([(t.escape||K).source,(t.interpolate||K).source,(t.evaluate||K).source].join("|")+"|$","g"),u=0,i="__p+='";n.replace(e,function(t,r,e,o,a){return i+=n.slice(u,a).replace(D,L),u=a+t.length,r?i+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'":e?i+="'+\n((__t=("+e+"))==null?'':__t)+\n'":o&&(i+="';\n"+o+"\n__p+='"),t}),i+="';\n",t.variable||(i="with(obj||{}){\n"+i+"}\n"),i="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+i+"return __p;\n";try{var o=new Function(t.variable||"obj","_",i)}catch(a){throw a.source=i,a}var c=function(n){return o.call(this,n,m)},f=t.variable||"obj";return c.source="function("+f+"){\n"+i+"}",c},m.chain=function(n){var t=m(n);return t._chain=!0,t};var P=function(n,t){return n._chain?m(t).chain():t};m.mixin=function(n){m.each(m.functions(n),function(t){var r=m[t]=n[t];m.prototype[t]=function(){var n=[this._wrapped];return f.apply(n,arguments),P(this,r.apply(m,n))}})},m.mixin(m),m.each(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=o[n];m.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!==n&&"splice"!==n||0!==r.length||delete r[0],P(this,r)}}),m.each(["concat","join","slice"],function(n){var t=o[n];m.prototype[n]=function(){return P(this,t.apply(this._wrapped,arguments))}}),m.prototype.value=function(){return this._wrapped},m.prototype.valueOf=m.prototype.toJSON=m.prototype.value,m.prototype.toString=function(){return""+this._wrapped},"function"==typeof define&&define.amd&&define("underscore",[],function(){return m})}).call(this);
//# sourceMappingURL=underscore-min.map
/* ---- STAMPLAY JS SDK ---- */
// vim:ts=4:sts=4:sw=4:
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

/* ---- STAMPLAY JS SDK ---- */
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

/* ---- STAMPLAY JS SDK ---- */
/**
@author Stamplay
@version 1.0
@description an awesome javascript sdk for Stamplay 
*/
/* Initizialize library */
(function (root) {
	
	/*  Inizialization of Stamplay Object */
	root.Stamplay = root.Stamplay || {};
	/* setting attribute API Version */
	root.Stamplay.VERSION = "v1";
	/* Silence Q logging */
	Q.stopUnhandledRejectionTracking();
	/* appId */
	root.Stamplay.APPID = "";
	/* baseUrl */
	root.Stamplay.BASEURL = "";
	/*  check if exist local storage with the support of store.js */
	if (window.localStorage && store.enabled) {
		root.Stamplay.USESTORAGE = true;
	}

	if (getURLParameter('jwt')) {
		if (Stamplay.USESTORAGE) {
			store.set(window.location.origin + '-jwt', getURLParameter('jwt'));
		}
	}

	/* init method for setup the base url */
	root.Stamplay.init = function (appId) {
		root.Stamplay.BASEURL = 'https://' + appId + '.stamplayapp.com';
		root.Stamplay.APPID = appId;
	};

	function getURLParameter(name) {
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
	}

}(this));
/* ---- STAMPLAY JS SDK ---- */
/* Add function to handle ajax calls, returning a promise
 * Very simple to use: Stamplay.makePromise({options})
 */
(function (root) {

	/* private function for handling this parameters */
	var parseQueryParams = function (options) {
		var keys = Object.keys(options.thisParams);
		for (var i = 0; i < keys.length; i++) {
			var conjunction = (i > 0) ? '&' : '?';
			var key = keys[i];
			options.url = options.url + conjunction + key + '=' + options.thisParams[key];
		}
	};

	/* private function for parse link's header */
	var parseLink = function (parts, link) {
		for (var i = 0; i < parts.length; i++) {
			var section = parts[i].split(';');
			if (section.length != 2) {
				throw new Error("section could not be split on ';'");
			}
			var url = section[0].replace(/<(.*)>/, '$1').trim();
			var name = section[1].replace(/rel="(.*)"/, '$1').trim();
			if (url.indexOf('&sort=') < 0) {
				url += '&sort=-dt_create';
			}
			link[name] = url;
		}
	};

	/* function for handling any calls to Stamplay Platform */
	/* Options parameter is an object  */
	root.Stamplay.makeAPromise = function (options, wantHeaders) {
		/*
			options : {
				method: GET|POST|PUT|DELETE|PATCH
				url: ,
				headers: [{}],
				data: {}
				async: true (default) || false,
				thisParams : {
					page : 1,
					per_page : 10
				}
			} 
		*/
		// parsing this parameter
		if (options.thisParams) {
			parseQueryParams(options);
		}

		var headerStamplay;
		if (root.Stamplay.APPID != "") {
			options.url = root.Stamplay.BASEURL + options.url;
			headerStamplay = root.Stamplay.APPID;
		} else {
			headerStamplay = location.host;
			headerStamplay = headerStamplay.replace(/^www\./, '');
			headerStamplay = headerStamplay.replace(/:[0-9]*$/g, '');
		}

		var deferred = Q.defer(),
			req = new XMLHttpRequest();
		req.open(options.method || 'GET', options.url, options.async || true);
		// Set request headers if provided.
		Object.keys(options.headers || {}).forEach(function (key) {
			req.setRequestHeader(key, options.headers[key]);
		});
		// Default content-Type  
		req.setRequestHeader('Content-Type', 'application/json');

		req.setRequestHeader('stamplay-app', headerStamplay);

		// V1 
		if (Stamplay.USESTORAGE) {
			var jwt = store.get(window.location.origin + '-jwt');
			if (jwt) {
				if (_jwtIsValidTimestamp(jwt)) {
					req.setRequestHeader('x-stamplay-jwt', jwt);
				} else {
					store.remove(window.location.origin + '-jwt');
				}
			}
		}

		req.onreadystatechange = function () {
			if (req.readyState !== 4) {
				return;
			}
			if ([200, 304].indexOf(req.status) === -1) {
				deferred.reject(req);
			} else {

				//parse the JSON response from the server
				var response = JSON.parse(req.responseText);
				_handleJWT(req);
				//where statment doesn't return link in header
				if (wantHeaders && req.getResponseHeader('link')) {
					//parse headers
					var parts = req.getResponseHeader('link').split(',');
					response.pagination = {};
					parseLink(parts, response.pagination);
					response.totalElements = req.getResponseHeader('x-total-elements');
					deferred.resolve(response);
				} else
					deferred.resolve(response);
			}
		};
		req.send(JSON.stringify(options.data) || void 0);
		return deferred.promise;
	};

	/* function to remove attributes from model before send the request to server*/
	root.Stamplay.removeAttributes = function (brick, instance) {
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

	function _handleJWT(req) {
		var jwt = req.getResponseHeader('x-stamplay-jwt');
		if (jwt) {
			var decodedJWT = _decodeJWT(jwt);
			if (Stamplay.USESTORAGE) {
				store.set(window.location.origin + '-jwt', jwt);
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
		} catch (e) {

		}
		return {
			header: header,
			claims: claims,
			signature: signature
		};
	}

	/*
	 * Decode base64
	 */

	function _base64Decode(str) {
		if (typeof atob !== "undefined") {
			return atob(str);
		} else {
			return _base64DecodeBackward(str);
		}
	}

	/*
	 * Backward compatibility for IE 8 and IE 9
	 */
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
/* ---- STAMPLAY JS SDK ---- */
/* 
 * Exspose BaseComponent the super class of all components on Stamplay.
 *  It extends Model and Collection.
 */
(function (root) {

	//method to add underscore function
	var addMethod = function (length, method, attribute) {
		switch (length) {
		case 1:
			return function () {
				return _[method](this[attribute]);
			};
		case 2:
			return function (value) {
				return _[method](this[attribute], value);
			};
		case 3:
			return function (iteratee, context) {
				return _[method](this[attribute], iteratee, context);
			};
		case 4:
			return function (iteratee, defaultVal, context) {
				return _[method](this[attribute], iteratee, defaultVal, context);
			};
		default:
			return function () {
				var args = Array.prototype.slice.call(arguments);
				args.unshift(this[attribute]);
				return _[method].apply(_, args);
			};
		}
	};

	//method to add underscore method to collection or model
	var addUnderscoreMethods = function (Class, methods, attribute) {
		_.each(methods, function (length, method) {
			if (_[method])
				Class[method] = addMethod.call(Class, length, method, attribute);
		});
	};

	/* Action constructor, it takes a instance of BaseComponent */
	function Action() {

		// private function, use for make parametric Promises
		var makeActionPromise = function (action, type) {
			var _this = this;
			if (type) {
				return Stamplay.makeAPromise({
					method: 'PUT',
					data: {
						type: type
					},
					url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/' + this.resourceId + '/' + this.instance._id + '/' + action
				}).then(function (response) {
					_this.instance = response;
				});
			} else {
				return Stamplay.makeAPromise({
					method: 'PUT',
					url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/' + this.resourceId + '/' + this.instance._id + '/' + action
				}).then(function (response) {
					_this.instance = response;
				});
			}
		};

		// upVote function
		// Modifies instance of model and return a promise
		this.upVote = function () {
			return makeActionPromise.call(this, 'vote', 'upvote');
		};

		// upVote function
		// Modifies instance of model and return a promise
		this.downVote = function () {
			return makeActionPromise.call(this, 'vote', 'downvote');
		};

		// rate function, it takes a vote parameter. 
		// Modifies instance of model and return a promise
		this.rate = function (vote) {
			// vote must be integer
			var _this = this;
			if (parseInt(vote)) {
				return Stamplay.makeAPromise({
					method: 'PUT',
					data: {
						rate: vote
					},
					url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/' + this.resourceId + '/' + this.instance._id + '/rate'
				}).then(function (response) {
					_this.instance = response;
				});
			} else {
				throw new Error('vote parameter to rate function must be a integer');
			}
		};

		// comment function, it takes a text parameter. 
		// Modifies instance of model and return a promise
		this.comment = function (text) {
			var _this = this;
			return Stamplay.makeAPromise({
				method: 'PUT',
				data: {
					text: text
				},
				url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/' + this.resourceId + '/' + this.instance._id + '/comment'
			}).then(function (response) {
				_this.instance = response;
			});
		};

		// twitterShare function
		// Modifies instance of model and return a promise
		this.twitterShare = function () {
			return makeActionPromise.call(this, 'twitter_share');
		};

		// facebookShare function
		// Modifies instance of model and return a promise
		this.facebookShare = function () {
			return makeActionPromise.call(this, 'facebook_share');
		};

		// simplest methods for get Actions

		this.getComments = function () {
			return this.get('actions').comments;
		};

		this.getVotes = function (type) {
			if (type && (type === 'up' || type === 'down')) {
				return this.get('actions').votes['users_' + type + 'vote'];
			} else {
				return this.get('actions').votes.users;
			}
		};

		this.getRatings = function () {
			return this.get('actions').ratings.users;
		};

		this.getTwitterShares = function () {
			return this.get('actions').twitter_shares.users;
		};

		this.getFacebookShares = function () {
			return this.get('actions').facebook_shares.users;
		};

	}

	/* Model constructor, it takes brickId, resourceId and hasAction
	 *  If hasAction is true, Model extends Action
	 */
	function Model(brickId, resourceId, hasAction) {

		// Model variable
		// data from server
		this.instance = {};
		// name of baseComponent
		this.brickId = brickId;
		// name of subresource
		this.resourceId = resourceId;

		var modelMethods = {
			keys: 1,
			values: 1,
			pairs: 1,
			invert: 1,
			pick: 0,
			omit: 0,
			chain: 1,
			isEmpty: 1
		};

		// Mix in each Underscore method as a proxy to `Model#attributes`.
		addUnderscoreMethods(this, modelMethods, 'instance');

		// if baseComponent hasAction add some methods to Model 
		if (hasAction) {
			Action.call(this);
		}

		// constructor
		this.constructor = function (instance) {
			this.instance = {};
			var keys = Object.keys(instance);
			for (var i = 0, j = keys.length; i < j; i++) {
				var key = keys[i];
				var value = instance[key];
				this.set(key, value);
			}
			return this;
		};

		// get function, it takes a key 
		// Return the key if exist 
		this.get = function (key) {
			return this.instance[key];
		};

		// set function, it takes the key and the value
		// Set the key to the Model with the value
		this.set = function (key, value) {
				this.instance[key] = value;
			},

			// unset function, it takes  the key
			// Delete the key from Model
			this.unset = function (key) {
				delete this.instance[key];
			},

			// fetch function, it takes _id and thisParams
			//  Modifies instance of model with the response of Stamplay's server
			this.fetch = function (_id, thisParams) {

				thisParams = thisParams || {};
				var _this = this;
				return Stamplay.makeAPromise({
					method: 'GET',
					url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/' + this.resourceId + '/' + _id,
					thisParams: thisParams
				}).then(function (response) {
					_this.instance = response;
				});

			},

			// save function, it takes options
			// Saves Model to Stamplay's db, if the Model already exists an update request is made    
			this.save = function (options) {

				options = options || {};

				var getUpdateMethod = function () {
					return (options.patch) ? 'PATCH' : 'PUT';
				};

				if (!this.instance) {
					return;
				}

				var method = (!this.instance._id) ? 'POST' : getUpdateMethod();

				var url = '/api/' + this.brickId + '/' + Stamplay.VERSION + '/' + this.resourceId;

				if (method === 'PATCH' || method === 'PUT') {
					url = url + '/' + this.get('_id');
					Stamplay.removeAttributes(this.brickId, this.instance);
				}

				var _this = this;
				return Stamplay.makeAPromise({
					method: method,
					url: url,
					data: this.instance
				}).then(function (response) {
					_this.instance = response;
				});
			},

			// destroy function 
			// Delete Model to Stamplay's db
			this.destroy = function () {
				var isUser = (this.brickId === 'user');
				if (this.get('_id')) {

					return Stamplay.makeAPromise({
						method: 'DELETE',
						url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/' + this.resourceId + '/' + this.get('_id')
					}).then(function (response) {

						if (isUser && Stamplay.USESTORAGE) {
							var jwt = store.get(window.location.origin + '-jwt');
							if (jwt) {
								store.remove(window.location.origin + '-jwt');
							}
						}

						return response;

					});

				} else {
					return false;
				}
			};

	}

	/* Collection constructor, it takes brickId, resourceId 
	 */
	function Collection(brickId, resourceId) {

		//Collection variable
		// data from server
		this.instance = [];
			// name of baseComponent
		this.brickId = brickId;
		// name of subresource
		this.resourceId = resourceId;
		//length of Collection
		this.length = this.instance.length;
			//total element 
		this.totalElement = 0;
		//links for pagination
		this.link = {};
		//the fetchParameters
		this.currentQuery = {};

		//method for parsing the currentquery 
		var parseCurrentQuery = function (currentQuery) {
			var query = {};
			for (var key in currentQuery) {
				
				if (key === 'find') {
					for (var attr in currentQuery[key]) {
						query[attr] = currentQuery[key][attr];
					}
				} else if (key === 'limit') {
					query.n = currentQuery[key];
				} else if (key === 'select') {
					query.select = currentQuery[key].join(",");
				} else if (key === 'sort') {
					query.sort = currentQuery[key];
				} else if (key === 'pagination') {
					query.page = currentQuery[key][0];
					query.per_page = currentQuery[key][1];
				}else if (key === 'populate') {
					query.populate = true;
				}else if (key === 'populateOwner') {
					query.populate_owner = true;
				}
			}
			return query;
		};

		//method to compile the params
		this.compile = function () {
			return parseCurrentQuery(this.currentQuery);
		};

		//method to set populate in queryparams
		this.populate = function(){
			this.currentQuery.populate = true;
			return this;
		};

		//method to set populate owner in queryparams
		this.populateOwner = function(){
			this.currentQuery.populateOwner = true;
			return this;
		};

		//method to set the pagination
		this.pagination = function (page, perPage) {
				if (page && perPage) {
					this.currentQuery.pagination = [page, perPage];
				} else {
					throw new Error('Pagination want two parameters');
				}
				return this;
		};
		//method to set an attribute must be equal to given value
		this.equalTo = function (attr, value) {
			if (!this.currentQuery.find){ 
				this.currentQuery.find = {}
			};
			if (typeof attr === "object") {
				for (var key in attr) {
					this.currentQuery.find[key] = attr[key];
				}
			} else {
				this.currentQuery.find[attr] = value;
			}
			return this;
		};
		//method to limit the results of query
		this.limit = function (limit) {
				this.currentQuery.limit = limit;
				return this;
		};
		//method to select only the attrs do you want to see
		this.select = function (attr) {
				if (!this.currentQuery.select)
					this.currentQuery.select = [];
				if (attr instanceof Array){
					for (var i = 0; i < attr.length; i++) {
						this.currentQuery.select.push(attr[i]);
					} 
				}else
					this.currentQuery.select.push(attr);
				return this;
		};
			//method to sort ascending
		this.sortAscending = function (attr) {
			this.currentQuery.sort = attr;
			return this;
		};
			//method to sort descending
		this.sortDescending = function (attr) {
			this.currentQuery.sort = '-' + attr;
			return this;
		};

		var collectionMethods = {
			forEach: 3,
			each: 3,
			map: 3,
			collect: 3,
			reduce: 4,
			foldl: 4,
			inject: 4,
			reduceRight: 4,
			foldr: 4,
			find: 3,
			detect: 3,
			filter: 3,
			reject: 3,
			every: 3,
			all: 3,
			some: 3,
			any: 3,
			include: 2,
			contains: 2,
			invoke: 2,
			max: 3,
			min: 3,
			toArray: 1,
			size: 1,
			first: 3,
			head: 3,
			take: 3,
			initial: 3,
			rest: 3,
			tail: 3,
			drop: 3,
			last: 3,
			without: 0,
			difference: 0,
			indexOf: 3,
			shuffle: 1,
			lastIndexOf: 3,
			isEmpty: 1,
			chain: 1,
			sample: 3,
			partition: 3
		};

		// Mix in each Underscore method as a proxy to `Collection`.
		addUnderscoreMethods(this, collectionMethods, 'instance');

		// get function, it takes _id 
		// Return Model with _id
		this.get = function (_id) {
				for (var i = 0, j = this.instance.length; i < j; i++) {
					if (this.instance[i].get('_id') == _id) {
						return this.instance[i];
					}
				}
			},

			// at function, it takes index
			// Return Model at index 
			this.at = function (index) {
				return this.instance[index];
			},

			// pop function
			// Remove the last Model and return it
			this.pop = function () {
				var last = this.instance[this.instance.length - 1];
				if (this.instance.length != 0) {
					this.remove(last.get('_id'));
					return last;
				} else
					return false;
			},

			// shift function
			// Remove the first Model and return it
			this.shift = function () {
				var first = this.instance[0];
				if (first) {
					this.remove(first.get('_id'));
					return first;
				} else
					return false;
			},

			// add function
			// Add a Model 
			this.add = function (model) {
				if (model instanceof Object && model.brickId == this.brickId && model.get('_id')) {
					if (model.brickId == 'cobject') {
						if (model.resourceId == this.resourceId) {
							this.instance.push(model);
							this.length = this.instance.length;
						}
					} else {
						this.instance.push(model);
						this.length = this.instance.length;
					}
				}
			},

			//return the number of entries on Stamplay's db
			this.count = function () {
				return this.totalElements;
			};

		//set collection with an array of model 
		this.set = function (models) {

			if (models instanceof Array) {
				var _this = this;
				models.forEach(function (singleInstance) {
					if (singleInstance instanceof Object) {
						var instanceModel;
						//cobject has a particular constructor
						if (_this.brickId == 'cobject') {
							instanceModel = new root.Stamplay.Cobject(_this.resourceId);
							instanceModel = instanceModel.Model.constructor(singleInstance);
						} else {
							//capitalize resource for implement dynamic inizialization of model
							var dynamicModel = _this.brickId.charAt(0).toUpperCase() + _this.brickId.slice(1);
							instanceModel = new root.Stamplay[dynamicModel];
							instanceModel = instanceModel.Model.constructor(singleInstance);
						}
						_this.instance.push(instanceModel);
					}
				});
				_this.length = _this.instance.length;
			} else {
				throw new Error('Set method on Collection wants an Array');
			}

		};

		// fetch function, it takes thisParams
		// Return a promise. Modify the instance with the data from Stamplay Server
		this.fetch = function (thisParams) {

				thisParams = thisParams && _.extend(thisParams, this.compile()) || this.compile();
				var _this = this;

				if (_this.brickId === 'cobject') {
					var headers = true;
				}

				return Stamplay.makeAPromise({
					method: 'GET',
					url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/' + this.resourceId,
					thisParams: thisParams
				}, headers).then(function (response) {
					//set two attributes to collection
					if (response.totalElements && response.pagination) {
						_this.totalElements = parseInt(response.totalElements);
						_this.pagination = response.pagination;
					}
					_this.instance = [];
					//iterate on data and instance a new Model with the prototype functions
					response.data.forEach(function (singleInstance) {
						var instanceModel;
						//cobject has a particular constructor
						if (_this.brickId === 'cobject') {
							instanceModel = new root.Stamplay.Cobject(_this.resourceId);
							instanceModel = instanceModel.Model.constructor(singleInstance);
						} else {
							//capitalize resource for implement dynamic inizialization of model
							var dynamicModel = _this.brickId.charAt(0).toUpperCase() + _this.brickId.slice(1);
							instanceModel = new root.Stamplay[dynamicModel];
							instanceModel = instanceModel.Model.constructor(singleInstance);
						}
						_this.instance.push(instanceModel);
					});
					_this.length = _this.instance.length;
				});
			},

			//remove function, it takes a array of id o just one id 
			// Remove Model with _id
			this.remove = function (_id) {

				if (_id instanceof Array) {
					this.instance = _.reject(this.instance, function (model) {
						for (var indexId in _id) {
							if (model.get('_id') == _id[indexId]) {
								return true;
							}
						}
					}, this);
					this.length = this.instance.length;
				} else {
					this.instance = _.reject(this.instance, function (model) {
						if (model.get('_id') == _id) {
							return true;
						}
					}, this);
					this.length = this.instance.length;
				}
			};
	};
	/* BaseComponent constructor, it takes brickId, resourceId and hasAction
	 *  If hasAction is true, Model extends Action
	 */
	function BaseComponent(brickId, resourceId, hasAction) {
		//variable
		this.Model = {};
		this.Collection = {};
		Model.call(this.Model, brickId, resourceId, hasAction);
		Collection.call(this.Collection, brickId, resourceId);
	}

	// Added BaseComponent Object to Stamplay
	root.Stamplay.BaseComponent = BaseComponent;

}(this));
/* ---- STAMPLAY JS SDK ---- */
/* Add Support function to Stamplay
 * it use for handling some functionality
 * very easy to use : Stamplay.Support.redirect('http://stamplay.com')
 */
(function (root) {

	// constructor for Support Object
	function Support() {

		// function to redirect to specified url
		this.redirect = function (url) {
			window.location.href = url;
		};

		// function for check if you have user with a specific email 
		this.validateEmail = function (email) {
			return Stamplay.makeAPromise({
				method: 'POST',
				data: {
					email: email
				},
				url: '/api/auth/' + Stamplay.VERSION + '/validate/email'
			});
		};

		this.checkMongoId = function(mongoId){
			var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
			var syntaxValid = (((typeof mongoId) === 'string') && checkForHexRegExp.test(mongoId));
			return syntaxValid;
		};

		this.errorSender = function(status, message){
			var deferred = Q.defer();
			deferred.reject({"status":status, "message":message});
			return deferred.promise;
		};

	}
	var support = new Support();
	// Added Support Object to Stamplay
	root.Stamplay.Support = support;

})(this);
/* ---- STAMPLAY JS SDK ---- */
/* Add Query function to Stamplay
 * it use for handling some funcctionality
 * very easy to use : Stamplay.Query('user').equalTo('name':'john')
 */
(function (root) {
	// constructor for Query Object
	// model is required ever
	function Query(model, instance) {
		
		this.model = model;
		this.instance = instance;
		this.currentQuery = [];
		this.executable = '';
	
		this.or = function(){
			var obj = { $or : []};

			if (arguments[0] instanceof Array) {
				arguments = arguments[0];
			}
			
			for(var i=0; i<arguments.length; i++){
				if(arguments[i] instanceof root.Stamplay.Query)
					obj.$or.push(arguments[i].currentQuery[0]);
				else
					throw new Error('Please Or function take only Query object');	
			}
			this.currentQuery.push(obj);
			return this;
		};

		this.between = function(attr,value1,value2){
			var obj = {};
			obj[attr] = {"$gte":value1, "$lte":value2};
			this.currentQuery.push(obj);
			return this;
		};

		this.greaterThan = function(attr, value){
			var obj = {};
			obj[attr] = {"$gt":value};
			this.currentQuery.push(obj);
			return this;
		};	

		this.greaterThanOrEqual = function(attr, value){
			var obj = {};
			obj[attr] = {"$gte":value};
			this.currentQuery.push(obj);
			return this;
		};

		this.lessThan = function(attr, value){
			var obj = {};
			obj[attr] = {"$lt":value};
			this.currentQuery.push(obj);
			return this;
		};	

		this.lessThanOrEqual = function(attr, value){
			var obj = {};
			obj[attr] = {"$lte":value};
			this.currentQuery.push(obj);
			return this;
		};

		this.equalTo = function(attr, value){
			var obj = {};
			obj[attr] = value;
			this.currentQuery.push(obj);
			return this;
		};

		this.sortAscending = function(value){
			var obj = {
				$sort: {}
			};
			obj.$sort[value] = 1;
			this.currentQuery.push(obj);
			return this;
		};

		this.sortDescending = function(value){
			var obj = {
				$sort: {}
			};
			obj.$sort[value] = -1;
			this.currentQuery.push(obj);
			return this;
		};

		this.exists = function(attr){
			var obj = {};
			obj[attr] = {"$exists":true};
			this.currentQuery.push(obj);
			return this;
		};

		this.notExists = function(attr){
			var obj = {};
			obj[attr] = {"$exists":false};
			this.currentQuery.push(obj);
			return this;
		};

		this.exec = function(){
			//build query
			for(var i=0;i<this.currentQuery.length;i++){	
				var partial = JSON.stringify(this.currentQuery[i]);
				partial = partial.substring(1, partial.length-1);
				if(i===0)
					this.executable += partial;
				else
					this.executable += ','+partial;
			}
			if(!this.instance)
				this.instance = this.model+'s'; 

			return Stamplay.makeAPromise({
				method: 'GET',
				url: '/api/' + this.model + '/' + Stamplay.VERSION + '/' + this.instance +'?where={'+this.executable+'}' ,
			}).then(function (response) {
				return response.data;
			});
		};

	}

	// Added Query Object to Stamplay
	root.Stamplay.Query = Query;

})(this);
/* ---- STAMPLAY JS SDK ---- */
/* Brick : User 
 	GET    '/api/user/VERSION/users'
  GET    '/api/user/VERSION/users/:id'
  POST   '/api/user/VERSION/users'
  PUT    '/api/user/VERSION/users/:id'
  DELETE '/api/user/VERSION/users/:id'
  GET    '/api/user/VERSION/getStatus'
*/

(function (root) {

	/**
		User component : Stamplay.User 
		This class rappresent the User component on Stamplay platform
		It very easy to use: Stamplay.User()
	*/

	// constructor
	function User() {
			Stamplay.BaseComponent.call(this, 'user', 'users');

			// currentUser function
			// Modifies the instance of User 
			this.Model.currentUser = function () {
					var _this = this;
					return Stamplay.makeAPromise({
						method: 'GET',
						url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/getStatus'
					}).then(function (response) {
						_this.instance = response.user || {};
					});
				},
				// isLoggedfunction
				// return true if user is logged
				this.Model.isLogged = function () {
					if (this.instance._id)
						return true;
					return false;
				};

			// login function, it takes serviceOrEmail and password
			// if exists password parameter, login strategy is local Authentication
			// else the login strategy is service Authentication
			// there are a lot of services : facebook, twitter
			this.Model.login = function (serviceOrEmail, password) {
					var _this = this;

					if (password) {

						var data = {
							email: serviceOrEmail,
							password: password
						};

						return Stamplay.makeAPromise({
							method: 'POST',
							data: data,
							url: '/auth/' + Stamplay.VERSION + '/local/login',
						}).then(function (response) {
							_this.instance = response || {};
						});

					} else {
						var jwt = store.get(window.location.origin + '-jwt');
						if (jwt) {
							// Store temporary cookie to permit user aggregation
						  var date = new Date();
			        date.setTime(date.getTime() + 5 * 60 * 1000);
							document.cookie = 'stamplay.jwt='+jwt+'; expires=' + date.toGMTString() + '; path=/'
						}
						var url = '/auth/' + Stamplay.VERSION + '/' + serviceOrEmail + '/connect';
						var port = (window.location.port) ? ':'+window.location.port : '';
						root.Stamplay.Support.redirect(location.protocol + '//' + document.domain +port+ url);
					}
				},

				// signup function, it takes objcet data
				// If data.email and data.password doesn't exists return error
				// any other attributes in data was save to User  
				this.Model.signup = function (data) {

					if (data.email && data.password) {

						var _this = this;

						return Stamplay.makeAPromise({
							method: 'POST',
							data: data,
							url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/' + this.resourceId
						}).then(function (response) {
							_this.instance = response || {};
						});

					} else {
						throw new Error('Stamplay.User.Model.signup(data) needs that data object has the email and password keys');
					}
				},

				// logout function
				this.Model.logout = function () {
					if (Stamplay.USESTORAGE) {
						store.remove(window.location.origin + '-jwt');
					}
					root.Stamplay.Support.redirect('/auth/' + Stamplay.VERSION + '/logout');
				};

				this.Model.resetPassword = function(email, newPassword){
					if(email && newPassword)
						return Stamplay.makeAPromise({
							method: 'POST',
							data: {email: email, newPassword:newPassword },
							url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/users/resetpassword'
						}).then(function (response) {
							return response;
						});
					else
						return Stamplay.Support.errorSender(403, "Missing parameters in resetPassword method");
				};

				this.Model.activities = function (id) {
					return Stamplay.makeAPromise({
						method: 'GET',
						url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/users/'+id+'/activities'
					}).then(function (response) {
						return response;
					});
				};

				this.Model.following = function (id) {
					return Stamplay.makeAPromise({
						method: 'GET',
						url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/users/'+id+'/following'
					}).then(function (response) {
						return response;
					});
				};

				this.Model.followedBy = function (id) {
					return Stamplay.makeAPromise({
						method: 'GET',
						url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/users/'+id+'/followed_by'
					}).then(function (response) {
						return response;
					});
				};

				this.Model.follow = function (id) {
					return Stamplay.makeAPromise({
						method: 'PUT',
						data: {'userId': id},
						url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/users/follow'
					}).then(function (response) {
						return response;
					});
				};

				this.Model.unfollow = function (id) {
					return Stamplay.makeAPromise({
						method: 'PUT',
						data: {'userId': id},
						url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/users/unfollow'
					}).then(function (response) {
						return response;
					});
				};

		}
		//Added User to Stamplay 
	root.Stamplay.User = User;

})(this);
/* ---- STAMPLAY JS SDK ---- */
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

	/**
		Custom object component : Stamplay.Cobject 
		This class rappresent the Custom Object component on Stamplay platform
		It very easy to use: Stamplay.Cobject([customObjectid])
	*/

	//constructor
	function Cobject(resourceId) {
		Stamplay.BaseComponent.call(this, 'cobject', resourceId, true);

		this.Collection.findByAttr = function (attr) {
			if(attr){
				var _this = this;
				return Stamplay.makeAPromise({
					method: 'GET',
					url: '/api/' + this.brickId + '/' + Stamplay.VERSION + '/' + this.resourceId + '/find/'+attr
				}).then(function (response) {
					if (response.totalElements && response.pagination) {
							_this.totalElements = parseInt(response.totalElements);
							_this.pagination = response.pagination;
						}
						_this.instance = [];
						//iterate on data and instance a new Model with the prototype functions
						response.data.forEach(function (singleInstance) {
							var instanceModel = new root.Stamplay.Cobject(_this.resourceId);
							instanceModel = instanceModel.Model.constructor(singleInstance);
							_this.instance.push(instanceModel);
						});
						_this.length = _this.instance.length;
				});
			}else{
				return Stamplay.Support.errorSender(403, "Missing parameter in findByAttr method");
			}
		}
	}
	//Added Cobject to Stamplay 
	root.Stamplay.Cobject = Cobject;

})(this);
/* ---- STAMPLAY JS SDK ---- */
/* Brick : Webhook 
 *  POST   '/api/webhook/VERSION/:webhookId/catch'
 */
(function (root) {

	/*
		Webhook component : Stamplay.Webhook 
		This class rappresent the Webhook Object component on Stamplay platform
		It very easy to use: Stamplay.Webhook([WebhookName])
	*/

	//constructor
	function Webhook(resourceId) {

		var resource = resourceId.replace(/[^\w\s]/gi, '').trim().toLowerCase().replace(/\s+/g, '_');

		this.url = '/api/webhook/' + Stamplay.VERSION + '/' + resource + '/catch';

		this.post = function (data, queryParams) {
			return Stamplay.makeAPromise({
				method: 'POST',
				data: data,
				url: this.url,
				thisParams: queryParams
			});
		};

		this.put = function (data, queryParams) {
			return Stamplay.makeAPromise({
				method: 'PUT',
				data: data,
				url: this.url,
				thisParams: queryParams
			});
		};

		this.get = function (queryParams) {
			return Stamplay.makeAPromise({
				method: 'GET',
				url: this.url,
				thisParams: queryParams
			});
		};

	}
	//Added Webhook to Stamplay 
	root.Stamplay.Webhook = Webhook;

})(this);
/* ---- STAMPLAY JS SDK ---- */
/* Brick : stripe 
 * POST  'api/stripe/VERSION/customers'
 * POST  'api/stripe/VERSION/customers/:userId/cards'
 * POST  'api/stripe/VERSION/charges'
 * POST  'api/stripe/VERSION/customers/:userId/subscriptions'
 * GET   'api/stripe/VERSION/customers/:userId/subscriptions'
 */

(function (root) {

	/*
		Stripe component : Stamplay.Stripe 
		This class rappresent the Stripe Object component on Stamplay platform
		It very easy to use: Stamplay.Stripe()
	*/

	//constructor
	function Stripe() {

		this.url = '/api/stripe/' + Stamplay.VERSION + '/';

		this.createCustomer = function (userId) {
			if (Stamplay.Support.checkMongoId(userId))
				return Stamplay.makeAPromise({
					method: 'POST',
					data: {
						'userId': userId
					},
					url: this.url + 'customers'
				});
			else
				return Stamplay.Support.errorSender(403, "Invalid userId");
		};

		this.createCreditCard = function (userId, token) {
			if (arguments.length == 2) {
				if (Stamplay.Support.checkMongoId(userId))
					return Stamplay.makeAPromise({
						method: 'POST',
						data: {
							'token': token
						},
						url: this.url + 'customers/' + userId + '/cards'
					});
				else
					return Stamplay.Support.errorSender(403, "Invalid userId");
			} else {
				return Stamplay.Support.errorSender(403, "Missing parameters in createCreditCard methods");
			}
		};

		this.updateCreditCard = function (userId, token) {
			if (arguments.length == 2) {
				if (Stamplay.Support.checkMongoId(userId))
					return Stamplay.makeAPromise({
						method: 'PUT',
						data: {
							'token': token
						},
						url: this.url + 'customers/' + userId + '/cards'
					});
				else
					return Stamplay.Support.errorSender(403, "Invalid userId");
			} else {
				return Stamplay.Support.errorSender(403, "Missing parameters in updateCreditCard methods");
			}
		};

		this.charge = function (userId, token, amount, currency) {
			if (arguments.length == 4) {
				if (Stamplay.Support.checkMongoId(userId))
					return Stamplay.makeAPromise({
						method: 'POST',
						data: {
							'userId': userId,
							'token': token,
							'amount': amount,
							'currency': currency
						},
						url: this.url + 'charges'
					});
				else
					return Stamplay.Support.errorSender(403, "Invalid userId");
			} else {
				return Stamplay.Support.errorSender(403, "Missing parameters in charge methods");
			}
		};


		this.createSubscription = function (userId, planId) {
			if (arguments.length === 2) {
				if (Stamplay.Support.checkMongoId(userId)) {
					return Stamplay.makeAPromise({
						method: 'POST',
						data: {
							'planId': planId
						},
						url: this.url + 'customers/' + userId + '/subscriptions'
					});
				} else {
					return Stamplay.Support.errorSender(403, "Invalid userId");
				}
			} else {
				return Stamplay.Support.errorSender(403, "Missing parameters in createSubscription methods");
			}
		};

		this.getSubscriptions = function (userId, options) {
			if (arguments.length >= 1) {
				if (Stamplay.Support.checkMongoId(userId)) {
					return Stamplay.makeAPromise({
						method: 'GET',
						url: this.url + 'customers/' + userId + '/subscriptions',
						thisParams: options
					});
				} else {
					return Stamplay.Support.errorSender(403, "Invalid userId");
				}
			} else {
				return Stamplay.Support.errorSender(403, "Missing parameters in getSubscriptions methods");
			}
		};

		this.getSubscription = function (userId, subscriptionId) {
			if (arguments.length <= 2) {
				if (Stamplay.Support.checkMongoId(userId)) {
					return Stamplay.makeAPromise({
						method: 'GET',
						url: this.url + 'customers/' + userId + '/subscriptions/' + subscriptionId,
					});
				} else {
					return Stamplay.Support.errorSender(403, "Invalid userId");
				}
			} else {
				return Stamplay.Support.errorSender(403, "Missing parameters in getSubscription methods");
			}
		};

		this.getCreditCard = function (userId) {
			if (arguments.length == 1) {
				if (Stamplay.Support.checkMongoId(userId)) {
					return Stamplay.makeAPromise({
						method: 'GET',
						url: this.url + 'customers/' + userId + '/cards',
					});
				} else {
					return Stamplay.Support.errorSender(403, "Invalid userId");
				}
			} else {
				return Stamplay.Support.errorSender(403, "Invalid parameter in getCreditCard method");
			}
		};

		this.deleteSubscription = function (userId, subscriptionId, options) {
			if (arguments.length === 2) {
				if (Stamplay.Support.checkMongoId(userId)) {
					return Stamplay.makeAPromise({
						method: 'DELETE',
						url: this.url + 'customers/' + userId + '/subscriptions/' + subscriptionId,
						data: options || {}
					});
				} else {
					return Stamplay.Support.errorSender(403, "Invalid userId");
				}
			} else {
				return Stamplay.Support.errorSender(403, "Missing parameters in deleteSubscription methods");
			}
		};

		this.updateSubscription = function (userId, subscriptionId, options) {
			if (arguments.length >= 2) {
				if (Stamplay.Support.checkMongoId(userId)) {
					options = options || {};
					return Stamplay.makeAPromise({
						method: 'PUT',
						url: this.url + 'customers/' + userId + '/subscriptions/' + subscriptionId,
						data: {
							options: options
						}
					});
				} else {
					return Stamplay.Support.errorSender(403, "Invalid userId");
				}
			} else {
				return Stamplay.Support.errorSender(403, "Missing parameters in updateSubscription methods");
			}
		};

	}

	root.Stamplay.Stripe = Stripe;

})(this);
/* ---- STAMPLAY JS SDK ---- */
/* Brick : Codeblock 
 *  POST   '/api/codeblock/VERSION/:CodeblockId/catch'
 */
(function (root) {


	/*
		Codeblock component : Stamplay.Codeblock 
		This class rappresent the Codeblock Object component on Stamplay platform
		Stamplay.Codeblock(codeblockId)
	*/

	//constructor
	function Codeblock(resourceId) {

		var resource = resourceId.replace(/[^\w\s]/gi, '').trim().toLowerCase().replace(/\s+/g, '_');

		this.url = '/api/codeblock/' + Stamplay.VERSION + '/run/' + resource;

		function _parseMethod(method) {
			var result = 'POST';
			if (typeof method === 'string') {
				switch (method) {
				case 'GET':
				case 'POST':
				case 'PUT':
				case 'PATCH':
				case 'DELETE':
					result = method;
					break;
				default:
					return Stamplay.Support.errorSender(403, "Invalid HTTP verb: available verbs are GET,POST,PUT,PATCH and DELETE");
					break;
				}
			}
			return result;
		}

		function _parseData(method, data) {
			var result = (data == null || data == undefined) ? undefined : data;
			switch (method) {
			case 'POST':
			case 'PUT':
			case 'PATCH':
				break;
			default:
				result = undefined;
				break;
			}
			return result;
		}

		this.run = function (data, queryParams) {
			/*
				args 0
															->  	POST			no body		no query params   
				args 3 
				 	method data queryParams -> 	method 		data 			queryParams	
			*/
			var finalMethod = _parseMethod('POST');
			var finalData = _parseData('POST', data);
			var finalQuery = queryParams;

			return Stamplay.makeAPromise({
				method: finalMethod,
				data: finalData,
				url: this.url,
				thisParams: queryParams
			});
		};

	}
	//Added Webhook to Stamplay 
	root.Stamplay.Codeblock = Codeblock;

})(this);