var __wpo = {"assets":{"main":["/Arrow/scripts/bundle.d205e43.js","/Arrow/scripts/modernizr.d205e43.js","/Arrow/"],"additional":[],"optional":["/Arrow/static/logo.d205e43.svg","/Arrow/css/bundle.d205e43.css"]},"externals":[],"hashesMap":{"1ac736ceb5c70240b5a444038dc5134f3c88fba9":"/Arrow/static/logo.d205e43.svg","58e95e60558206ff7f0abf40e67d3ee75f9422e6":"/Arrow/css/bundle.d205e43.css","2c5728905e0d40991c7ff47f85f0bb14b0115f61":"/Arrow/scripts/bundle.d205e43.js","4784b7442edfb28656da065a9b98ed96f0438784":"/Arrow/scripts/modernizr.d205e43.js","cfed05c3d914fcb45eef865811c021096d5262bd":"/Arrow/"},"strategy":"changed","responseStrategy":"cache-first","version":"9/27/2019, 12:18:05 AM","name":"webpack-offline","pluginVersion":"5.0.7","relativePaths":false};

!function(e){var n={};function __webpack_require__(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,__webpack_require__),r.l=!0,r.exports}__webpack_require__.m=e,__webpack_require__.c=n,__webpack_require__.d=function(e,n,t){__webpack_require__.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},__webpack_require__.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},__webpack_require__.t=function(e,n){if(1&n&&(e=__webpack_require__(e)),8&n)return e;if(4&n&&"object"===typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(__webpack_require__.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)__webpack_require__.d(t,r,function(n){return e[n]}.bind(null,r));return t},__webpack_require__.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return __webpack_require__.d(n,"a",n),n},__webpack_require__.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},__webpack_require__.p="/Arrow",__webpack_require__(__webpack_require__.s=0)}([function(e,n,t){"use strict";if(function(){var e=ExtendableEvent.prototype.waitUntil,n=FetchEvent.prototype.respondWith,t=new WeakMap;ExtendableEvent.prototype.waitUntil=function(n){var r=this,o=t.get(r);if(!o)return o=[Promise.resolve(n)],t.set(r,o),e.call(r,Promise.resolve().then(function processPromises(){var e=o.length;return Promise.all(o.map(function(e){return e.catch(function(){})})).then(function(){return o.length!=e?processPromises():(t.delete(r),Promise.all(o))})}));o.push(Promise.resolve(n))},FetchEvent.prototype.respondWith=function(e){return this.waitUntil(e),n.call(this,e)}}(),"undefined"===typeof r)var r=!1;function cachesMatch(e,n){return caches.match(e,{cacheName:n}).then(function(t){return isNotRedirectedResponse(t)?t:fixRedirectedResponse(t).then(function(t){return caches.open(n).then(function(n){return n.put(e,t)}).then(function(){return t})})}).catch(function(){})}function isNotRedirectedResponse(e){return!e||!e.redirected||!e.ok||"opaqueredirect"===e.type}function fixRedirectedResponse(e){return isNotRedirectedResponse(e)?Promise.resolve(e):("body"in e?Promise.resolve(e.body):e.blob()).then(function(n){return new Response(n,{headers:e.headers,status:e.status})})}function logGroup(e,n){console.groupCollapsed("[SW]:",e),n.forEach(function(e){console.log("Asset:",e)}),console.groupEnd()}!function(e,n){var t=n.cacheMaps,o=n.navigationPreload,i=e.strategy,a=e.responseStrategy,c=e.assets,s=e.hashesMap,u=e.externals,f=e.prefetchRequest||{credentials:"same-origin",mode:"cors"},l=e.name,h=e.version,d=l+":"+h,p=l+"$preload",v="__offline_webpack__data";Object.keys(c).forEach(function(e){c[e]=c[e].map(function(e){var n=new URL(e,location);return n.hash="",-1===u.indexOf(e)&&(n.search=""),n.toString()})}),s=Object.keys(s).reduce(function(e,n){var t=new URL(s[n],location);return t.search="",t.hash="",e[n]=t.toString(),e},{}),u=u.map(function(e){var n=new URL(e,location);return n.hash="",n.toString()});var _=[].concat(c.main,c.additional,c.optional);function cacheAssets(n){var t=c[n];return caches.open(d).then(function(r){return addAllNormalized(r,t,{bust:e.version,request:f,failAll:"main"===n})}).then(function(){logGroup("Cached assets: "+n,t)}).catch(function(e){throw console.error(e),e})}function cacheChanged(n){return caches.keys().then(function(e){for(var n=e.length,t=void 0;n--&&0!==(t=e[n]).indexOf(l););if(t){var r=void 0;return caches.open(t).then(function(e){return r=e,e.match(new URL(v,location).toString())}).then(function(e){if(e)return Promise.all([r,r.keys(),e.json()])})}}).then(function(t){if(!t)return cacheAssets(n);var r=t[0],o=t[1],i=t[2],a=i.hashmap,u=i.version;if(!i.hashmap||u===e.version)return cacheAssets(n);var l=Object.keys(a).map(function(e){return a[e]}),h=o.map(function(e){var n=new URL(e.url);return n.search="",n.hash="",n.toString()}),p=c[n],v=[],_=p.filter(function(e){return-1===h.indexOf(e)||-1===l.indexOf(e)});Object.keys(s).forEach(function(e){var n=s[e];if(-1!==p.indexOf(n)&&-1===_.indexOf(n)&&-1===v.indexOf(n)){var t=a[e];t&&-1!==h.indexOf(t)?v.push([t,n]):_.push(n)}}),logGroup("Changed assets: "+n,_),logGroup("Moved assets: "+n,v);var m=Promise.all(v.map(function(e){return r.match(e[0]).then(function(n){return[e[1],n]})}));return caches.open(d).then(function(t){var r=m.then(function(e){return Promise.all(e.map(function(e){return t.put(e[0],e[1])}))});return Promise.all([r,addAllNormalized(t,_,{bust:e.version,request:f,failAll:"main"===n,deleteFirst:"main"!==n})])})})}function deleteObsolete(){return caches.keys().then(function(e){var n=e.map(function(e){if(0===e.indexOf(l)&&0!==e.indexOf(d))return console.log("[SW]:","Delete cache:",e),caches.delete(e)});return Promise.all(n)})}function storeCacheData(){return caches.open(d).then(function(n){var t=new Response(JSON.stringify({version:e.version,hashmap:s}));return n.put(new URL(v,location).toString(),t)})}self.addEventListener("install",function(e){console.log("[SW]:","Install event");var n=void 0;n="changed"===i?cacheChanged("main"):cacheAssets("main"),e.waitUntil(n)}),self.addEventListener("activate",function(e){console.log("[SW]:","Activate event");var n=function(){if(!c.additional.length)return Promise.resolve();r&&console.log("[SW]:","Caching additional");return("changed"===i?cacheChanged("additional"):cacheAssets("additional")).catch(function(e){console.error("[SW]:","Cache section `additional` failed to load")})}();n=(n=(n=n.then(storeCacheData)).then(deleteObsolete)).then(function(){if(self.clients&&self.clients.claim)return self.clients.claim()}),o&&self.registration.navigationPreload&&(n=Promise.all([n,self.registration.navigationPreload.enable()])),e.waitUntil(n)}),self.addEventListener("fetch",function(e){if("GET"===e.request.method&&("only-if-cached"!==e.request.cache||"same-origin"===e.request.mode)){var n=new URL(e.request.url);n.hash="";var i=n.toString();-1===u.indexOf(i)&&(n.search="",i=n.toString());var c=-1!==_.indexOf(i),s=i;if(!c){var f=function(e){var n=e.url,r=new URL(n),o=void 0;o=function(e){return"navigate"===e.mode||e.headers.get("Upgrade-Insecure-Requests")||-1!==(e.headers.get("Accept")||"").indexOf("text/html")}(e)?"navigate":r.origin===location.origin?"same-origin":"cross-origin";for(var i=0;i<t.length;i++){var a=t[i];if(a&&(!a.requestTypes||-1!==a.requestTypes.indexOf(o))){var c=void 0;if((c="function"===typeof a.match?a.match(r,e):n.replace(a.match,a.to))&&c!==n)return c}}}(e.request);f&&(s=f,c=!0)}if(c){var l=void 0;l="network-first"===a?function(e,n,t){return fetchWithPreload(e).then(function(e){if(e.ok)return r&&console.log("[SW]:","URL ["+n+"] from network"),e;throw e}).catch(function(e){return r&&console.log("[SW]:","URL ["+n+"] from cache if possible"),cachesMatch(t,d).then(function(n){if(n)return n;if(e instanceof Response)return e;throw e})})}(e,i,s):function(e,n,t){return function(e){if(o&&"function"===typeof o.map&&e.preloadResponse&&"navigate"===e.request.mode){var n=o.map(new URL(e.request.url),e.request);n&&function(e,n){var t=new URL(e,location),r=n.preloadResponse;m.set(r,{url:t,response:r});var o=function(){return m.has(r)},i=r.then(function(e){if(e&&o()){var n=e.clone();return caches.open(p).then(function(e){if(o())return e.put(t,n).then(function(){if(!o())return caches.open(p).then(function(e){return e.delete(t)})})})}});n.waitUntil(i)}(n,e)}}(e),cachesMatch(t,d).then(function(o){return o?(r&&console.log("[SW]:","URL ["+t+"]("+n+") from cache"),o):fetch(e.request).then(function(o){return o.ok?(r&&console.log("[SW]:","URL ["+n+"] from network"),t===n&&function(){var t=o.clone(),r=caches.open(d).then(function(e){return e.put(n,t)}).then(function(){console.log("[SW]:","Cache asset: "+n)});e.waitUntil(r)}(),o):(r&&console.log("[SW]:","URL ["+n+"] wrong response: ["+o.status+"] "+o.type),o)})})}(e,i,s),e.respondWith(l)}else{if("navigate"===e.request.mode&&!0===o)return void e.respondWith(fetchWithPreload(e));if(o){var h=function(e){var n=new URL(e.request.url);if(self.registration.navigationPreload&&o&&o.test&&o.test(n,e.request)){var t=function(e){if(m){var n=void 0,t=void 0;return m.forEach(function(r,o){r.url.href===e.href&&(n=r.response,t=o)}),n?(m.delete(t),n):void 0}}(n),r=e.request;return t?(e.waitUntil(caches.open(p).then(function(e){return e.delete(r)})),t):cachesMatch(r,p).then(function(n){return n&&e.waitUntil(caches.open(p).then(function(e){return e.delete(r)})),n||fetch(e.request)})}}(e);if(h)return void e.respondWith(h)}}}}),self.addEventListener("message",function(e){var n=e.data;if(n)switch(n.action){case"skipWaiting":self.skipWaiting&&self.skipWaiting()}});var m=new Map;function addAllNormalized(e,n,t){n=n.slice();var r=t.bust,o=!1!==t.failAll,i=!0===t.deleteFirst,a=t.request||{credentials:"omit",mode:"cors"},c=Promise.resolve();return i&&(c=Promise.all(n.map(function(n){return e.delete(n).catch(function(){})}))),Promise.all(n.map(function(e){return r&&(e=function(e,n){var t=-1!==e.indexOf("?");return e+(t?"&":"?")+"__uncache="+encodeURIComponent(n)}(e,r)),fetch(e,a).then(fixRedirectedResponse).then(function(e){return e.ok?{response:e}:{error:!0}},function(){return{error:!0}})})).then(function(t){return o&&t.some(function(e){return e.error})?Promise.reject(new Error("Wrong response status")):(o||(t=t.filter(function(e,t){return!e.error||(n.splice(t,1),!1)})),c.then(function(){var r=t.map(function(t,r){var o=t.response;return e.put(n[r],o)});return Promise.all(r)}))})}function fetchWithPreload(e){return e.preloadResponse&&!0===o?e.preloadResponse.then(function(n){return n||fetch(e.request)}):fetch(e.request)}}(__wpo,{loaders:{},cacheMaps:[{match:function(){return new URL("/",location)},to:null,requestTypes:["navigate"]}],navigationPreload:!1}),e.exports=t(1)},function(e,n){}]);