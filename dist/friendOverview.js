!function(t){var e={};function r(s){if(e[s])return e[s].exports;var o=e[s]={i:s,l:!1,exports:{}};return t[s].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=t,r.c=e,r.d=function(t,e,s){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(r.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(s,o,function(e){return t[e]}.bind(null,o));return s},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=2)}([function(t,e,r){let s;"undefined"!=typeof window?s=window:"undefined"!=typeof self?s=self:(console.warn("Using browser-only version of superagent in non-browser environment"),s=this);const o=r(3),n=r(4),i=r(1),a=r(5),u=r(7);function h(){}const c=e=t.exports=function(t,r){return"function"==typeof r?new e.Request("GET",t).end(r):1==arguments.length?new e.Request("GET",t):new e.Request(t,r)};e.Request=_,c.getXHR=(()=>{if(!(!s.XMLHttpRequest||s.location&&"file:"==s.location.protocol&&s.ActiveXObject))return new XMLHttpRequest;try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(t){}try{return new ActiveXObject("Msxml2.XMLHTTP.6.0")}catch(t){}try{return new ActiveXObject("Msxml2.XMLHTTP.3.0")}catch(t){}try{return new ActiveXObject("Msxml2.XMLHTTP")}catch(t){}throw Error("Browser-only version of superagent could not find XHR")});const p="".trim?t=>t.trim():t=>t.replace(/(^\s*|\s*$)/g,"");function l(t){if(!i(t))return t;const e=[];for(const r in t)d(e,r,t[r]);return e.join("&")}function d(t,e,r){if(null!=r)if(Array.isArray(r))r.forEach(r=>{d(t,e,r)});else if(i(r))for(const s in r)d(t,`${e}[${s}]`,r[s]);else t.push(encodeURIComponent(e)+"="+encodeURIComponent(r));else null===r&&t.push(encodeURIComponent(e))}function f(t){const e={},r=t.split("&");let s,o;for(let t=0,n=r.length;t<n;++t)-1==(o=(s=r[t]).indexOf("="))?e[decodeURIComponent(s)]="":e[decodeURIComponent(s.slice(0,o))]=decodeURIComponent(s.slice(o+1));return e}function y(t){return/[\/+]json($|[^-\w])/.test(t)}function m(t){this.req=t,this.xhr=this.req.xhr,this.text="HEAD"!=this.req.method&&(""===this.xhr.responseType||"text"===this.xhr.responseType)||void 0===this.xhr.responseType?this.xhr.responseText:null,this.statusText=this.req.xhr.statusText;let e=this.xhr.status;1223===e&&(e=204),this._setStatusProperties(e),this.header=this.headers=function(t){const e=t.split(/\r?\n/),r={};let s,o,n,i;for(let t=0,a=e.length;t<a;++t)-1!==(s=(o=e[t]).indexOf(":"))&&(n=o.slice(0,s).toLowerCase(),i=p(o.slice(s+1)),r[n]=i);return r}(this.xhr.getAllResponseHeaders()),this.header["content-type"]=this.xhr.getResponseHeader("content-type"),this._setHeaderProperties(this.header),null===this.text&&t._responseType?this.body=this.xhr.response:this.body="HEAD"!=this.req.method?this._parseBody(this.text?this.text:this.xhr.response):null}function _(t,e){const r=this;this._query=this._query||[],this.method=t,this.url=e,this.header={},this._header={},this.on("end",()=>{let t,e=null,s=null;try{s=new m(r)}catch(t){return(e=new Error("Parser is unable to parse the response")).parse=!0,e.original=t,r.xhr?(e.rawResponse=void 0===r.xhr.responseType?r.xhr.responseText:r.xhr.response,e.status=r.xhr.status?r.xhr.status:null,e.statusCode=e.status):(e.rawResponse=null,e.status=null),r.callback(e)}r.emit("response",s);try{r._isResponseOK(s)||(t=new Error(s.statusText||"Unsuccessful HTTP response"))}catch(e){t=e}t?(t.original=e,t.response=s,t.status=s.status,r.callback(t,s)):r.callback(null,s)})}function b(t,e,r){const s=c("DELETE",t);return"function"==typeof e&&(r=e,e=null),e&&s.send(e),r&&s.end(r),s}c.serializeObject=l,c.parseString=f,c.types={html:"text/html",json:"application/json",xml:"text/xml",urlencoded:"application/x-www-form-urlencoded",form:"application/x-www-form-urlencoded","form-data":"application/x-www-form-urlencoded"},c.serialize={"application/x-www-form-urlencoded":l,"application/json":JSON.stringify},c.parse={"application/x-www-form-urlencoded":f,"application/json":JSON.parse},a(m.prototype),m.prototype._parseBody=function(t){let e=c.parse[this.type];return this.req._parser?this.req._parser(this,t):(!e&&y(this.type)&&(e=c.parse["application/json"]),e&&t&&(t.length||t instanceof Object)?e(t):null)},m.prototype.toError=function(){const t=this.req,e=t.method,r=t.url,s=`cannot ${e} ${r} (${this.status})`,o=new Error(s);return o.status=this.status,o.method=e,o.url=r,o},c.Response=m,o(_.prototype),n(_.prototype),_.prototype.type=function(t){return this.set("Content-Type",c.types[t]||t),this},_.prototype.accept=function(t){return this.set("Accept",c.types[t]||t),this},_.prototype.auth=function(t,e,r){1===arguments.length&&(e=""),"object"==typeof e&&null!==e&&(r=e,e=""),r||(r={type:"function"==typeof btoa?"basic":"auto"});return this._auth(t,e,r,t=>{if("function"==typeof btoa)return btoa(t);throw new Error("Cannot use basic auth, btoa is not a function")})},_.prototype.query=function(t){return"string"!=typeof t&&(t=l(t)),t&&this._query.push(t),this},_.prototype.attach=function(t,e,r){if(e){if(this._data)throw Error("superagent can't mix .send() and .attach()");this._getFormData().append(t,e,r||e.name)}return this},_.prototype._getFormData=function(){return this._formData||(this._formData=new s.FormData),this._formData},_.prototype.callback=function(t,e){if(this._shouldRetry(t,e))return this._retry();const r=this._callback;this.clearTimeout(),t&&(this._maxRetries&&(t.retries=this._retries-1),this.emit("error",t)),r(t,e)},_.prototype.crossDomainError=function(){const t=new Error("Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.");t.crossDomain=!0,t.status=this.status,t.method=this.method,t.url=this.url,this.callback(t)},_.prototype.buffer=_.prototype.ca=_.prototype.agent=function(){return console.warn("This is not supported in browser version of superagent"),this},_.prototype.pipe=_.prototype.write=(()=>{throw Error("Streaming is not supported in browser version of superagent")}),_.prototype._isHost=function(t){return t&&"object"==typeof t&&!Array.isArray(t)&&"[object Object]"!==Object.prototype.toString.call(t)},_.prototype.end=function(t){this._endCalled&&console.warn("Warning: .end() was called twice. This is not supported in superagent"),this._endCalled=!0,this._callback=t||h,this._finalizeQueryString(),this._end()},_.prototype._end=function(){if(this._aborted)return this.callback(Error("The request has been aborted even before .end() was called"));const t=this,e=this.xhr=c.getXHR();let r=this._formData||this._data;this._setTimeouts(),e.onreadystatechange=(()=>{const r=e.readyState;if(r>=2&&t._responseTimeoutTimer&&clearTimeout(t._responseTimeoutTimer),4!=r)return;let s;try{s=e.status}catch(t){s=0}if(!s){if(t.timedout||t._aborted)return;return t.crossDomainError()}t.emit("end")});const s=(e,r)=>{r.total>0&&(r.percent=r.loaded/r.total*100),r.direction=e,t.emit("progress",r)};if(this.hasListeners("progress"))try{e.onprogress=s.bind(null,"download"),e.upload&&(e.upload.onprogress=s.bind(null,"upload"))}catch(t){}try{this.username&&this.password?e.open(this.method,this.url,!0,this.username,this.password):e.open(this.method,this.url,!0)}catch(t){return this.callback(t)}if(this._withCredentials&&(e.withCredentials=!0),!this._formData&&"GET"!=this.method&&"HEAD"!=this.method&&"string"!=typeof r&&!this._isHost(r)){const t=this._header["content-type"];let e=this._serializer||c.serialize[t?t.split(";")[0]:""];!e&&y(t)&&(e=c.serialize["application/json"]),e&&(r=e(r))}for(const t in this.header)null!=this.header[t]&&this.header.hasOwnProperty(t)&&e.setRequestHeader(t,this.header[t]);this._responseType&&(e.responseType=this._responseType),this.emit("request",this),e.send(void 0!==r?r:null)},c.agent=(()=>new u),["GET","POST","OPTIONS","PATCH","PUT","DELETE"].forEach(t=>{u.prototype[t.toLowerCase()]=function(e,r){const s=new c.Request(t,e);return this._setDefaults(s),r&&s.end(r),s}}),u.prototype.del=u.prototype.delete,c.get=((t,e,r)=>{const s=c("GET",t);return"function"==typeof e&&(r=e,e=null),e&&s.query(e),r&&s.end(r),s}),c.head=((t,e,r)=>{const s=c("HEAD",t);return"function"==typeof e&&(r=e,e=null),e&&s.query(e),r&&s.end(r),s}),c.options=((t,e,r)=>{const s=c("OPTIONS",t);return"function"==typeof e&&(r=e,e=null),e&&s.send(e),r&&s.end(r),s}),c.del=b,c.delete=b,c.patch=((t,e,r)=>{const s=c("PATCH",t);return"function"==typeof e&&(r=e,e=null),e&&s.send(e),r&&s.end(r),s}),c.post=((t,e,r)=>{const s=c("POST",t);return"function"==typeof e&&(r=e,e=null),e&&s.send(e),r&&s.end(r),s}),c.put=((t,e,r)=>{const s=c("PUT",t);return"function"==typeof e&&(r=e,e=null),e&&s.send(e),r&&s.end(r),s})},function(t,e,r){"use strict";t.exports=function(t){return null!==t&&"object"==typeof t}},function(t,e,r){"use strict";r.r(e);var s=r(0),o=r.n(s);Vue.component("request-component",{props:["request"],template:'<li class="collection-item"><div><a type="text">{{request.name}}</a><a class="secondary-content blue-text text-darken-1 white small" v-on:click="$emit(\'accept-friend\')"><i class="material-icons">person_add</i></a></div></li>'}),Vue.component("friend-component",{props:["friend"],template:'<li class="collection-item"><div><a type="text">{{friend.name}}</a></div></li>'});new Vue({el:"#overview",data:{friendRequests:[],friends:[],errortext:""},mounted(){this.errortext="",o.a.get("/friend/getFriendRequests").then(t=>{if(console.log(t.body),void 0!==t.body)for(var e=0;e<t.body.length;e++)this.friendRequests.push({name:t.body[e].name,userID:t.body[e].userID})}).catch(t=>{console.log("Error retrieving requests "+t.message)}),o.a.get("/friend/getFriends").then(t=>{if(console.log(t.body),void 0!==t.body)for(var e=0;e<t.body.length;e++)this.friends.push({name:t.body[e].name})}).catch(t=>{console.log("Error retrieving requests "+t.message)})},methods:{acceptFriend:function(t){o.a.post("/friend/acceptFriend").type("json").send({newFriendID:t.userID}).then(t=>{void 0===t.body.msg||(this.errortext=t.body.msg)})}}})},function(t,e,r){function s(t){if(t)return function(t){for(var e in s.prototype)t[e]=s.prototype[e];return t}(t)}t.exports=s,s.prototype.on=s.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+t]=this._callbacks["$"+t]||[]).push(e),this},s.prototype.once=function(t,e){function r(){this.off(t,r),e.apply(this,arguments)}return r.fn=e,this.on(t,r),this},s.prototype.off=s.prototype.removeListener=s.prototype.removeAllListeners=s.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},0==arguments.length)return this._callbacks={},this;var r,s=this._callbacks["$"+t];if(!s)return this;if(1==arguments.length)return delete this._callbacks["$"+t],this;for(var o=0;o<s.length;o++)if((r=s[o])===e||r.fn===e){s.splice(o,1);break}return this},s.prototype.emit=function(t){this._callbacks=this._callbacks||{};var e=[].slice.call(arguments,1),r=this._callbacks["$"+t];if(r)for(var s=0,o=(r=r.slice(0)).length;s<o;++s)r[s].apply(this,e);return this},s.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks["$"+t]||[]},s.prototype.hasListeners=function(t){return!!this.listeners(t).length}},function(t,e,r){"use strict";const s=r(1);function o(t){if(t)return function(t){for(const e in o.prototype)t[e]=o.prototype[e];return t}(t)}t.exports=o,o.prototype.clearTimeout=function(){return clearTimeout(this._timer),clearTimeout(this._responseTimeoutTimer),delete this._timer,delete this._responseTimeoutTimer,this},o.prototype.parse=function(t){return this._parser=t,this},o.prototype.responseType=function(t){return this._responseType=t,this},o.prototype.serialize=function(t){return this._serializer=t,this},o.prototype.timeout=function(t){if(!t||"object"!=typeof t)return this._timeout=t,this._responseTimeout=0,this;for(const e in t)switch(e){case"deadline":this._timeout=t.deadline;break;case"response":this._responseTimeout=t.response;break;default:console.warn("Unknown timeout option",e)}return this},o.prototype.retry=function(t,e){return 0!==arguments.length&&!0!==t||(t=1),t<=0&&(t=0),this._maxRetries=t,this._retries=0,this._retryCallback=e,this};const n=["ECONNRESET","ETIMEDOUT","EADDRINFO","ESOCKETTIMEDOUT"];o.prototype._shouldRetry=function(t,e){if(!this._maxRetries||this._retries++>=this._maxRetries)return!1;if(this._retryCallback)try{const r=this._retryCallback(t,e);if(!0===r)return!0;if(!1===r)return!1}catch(t){console.error(t)}if(e&&e.status&&e.status>=500&&501!=e.status)return!0;if(t){if(t.code&&~n.indexOf(t.code))return!0;if(t.timeout&&"ECONNABORTED"==t.code)return!0;if(t.crossDomain)return!0}return!1},o.prototype._retry=function(){return this.clearTimeout(),this.req&&(this.req=null,this.req=this.request()),this._aborted=!1,this.timedout=!1,this._end()},o.prototype.then=function(t,e){if(!this._fullfilledPromise){const t=this;this._endCalled&&console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises"),this._fullfilledPromise=new Promise((e,r)=>{t.on("error",r),t.end((t,s)=>{t?r(t):e(s)})})}return this._fullfilledPromise.then(t,e)},o.prototype.catch=function(t){return this.then(void 0,t)},o.prototype.use=function(t){return t(this),this},o.prototype.ok=function(t){if("function"!=typeof t)throw Error("Callback required");return this._okCallback=t,this},o.prototype._isResponseOK=function(t){return!!t&&(this._okCallback?this._okCallback(t):t.status>=200&&t.status<300)},o.prototype.get=function(t){return this._header[t.toLowerCase()]},o.prototype.getHeader=o.prototype.get,o.prototype.set=function(t,e){if(s(t)){for(const e in t)this.set(e,t[e]);return this}return this._header[t.toLowerCase()]=e,this.header[t]=e,this},o.prototype.unset=function(t){return delete this._header[t.toLowerCase()],delete this.header[t],this},o.prototype.field=function(t,e){if(null==t)throw new Error(".field(name, val) name can not be empty");if(this._data)throw new Error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()");if(s(t)){for(const e in t)this.field(e,t[e]);return this}if(Array.isArray(e)){for(const r in e)this.field(t,e[r]);return this}if(null==e)throw new Error(".field(name, val) val can not be empty");return"boolean"==typeof e&&(e=""+e),this._getFormData().append(t,e),this},o.prototype.abort=function(){return this._aborted?this:(this._aborted=!0,this.xhr&&this.xhr.abort(),this.req&&this.req.abort(),this.clearTimeout(),this.emit("abort"),this)},o.prototype._auth=function(t,e,r,s){switch(r.type){case"basic":this.set("Authorization",`Basic ${s(`${t}:${e}`)}`);break;case"auto":this.username=t,this.password=e;break;case"bearer":this.set("Authorization",`Bearer ${t}`)}return this},o.prototype.withCredentials=function(t){return null==t&&(t=!0),this._withCredentials=t,this},o.prototype.redirects=function(t){return this._maxRedirects=t,this},o.prototype.maxResponseSize=function(t){if("number"!=typeof t)throw TypeError("Invalid argument");return this._maxResponseSize=t,this},o.prototype.toJSON=function(){return{method:this.method,url:this.url,data:this._data,headers:this._header}},o.prototype.send=function(t){const e=s(t);let r=this._header["content-type"];if(this._formData)throw new Error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()");if(e&&!this._data)Array.isArray(t)?this._data=[]:this._isHost(t)||(this._data={});else if(t&&this._data&&this._isHost(this._data))throw Error("Can't merge these send calls");if(e&&s(this._data))for(const e in t)this._data[e]=t[e];else"string"==typeof t?(r||this.type("form"),r=this._header["content-type"],this._data="application/x-www-form-urlencoded"==r?this._data?`${this._data}&${t}`:t:(this._data||"")+t):this._data=t;return!e||this._isHost(t)?this:(r||this.type("json"),this)},o.prototype.sortQuery=function(t){return this._sort=void 0===t||t,this},o.prototype._finalizeQueryString=function(){const t=this._query.join("&");if(t&&(this.url+=(this.url.indexOf("?")>=0?"&":"?")+t),this._query.length=0,this._sort){const t=this.url.indexOf("?");if(t>=0){const e=this.url.substring(t+1).split("&");"function"==typeof this._sort?e.sort(this._sort):e.sort(),this.url=this.url.substring(0,t)+"?"+e.join("&")}}},o.prototype._appendQueryString=(()=>{console.trace("Unsupported")}),o.prototype._timeoutError=function(t,e,r){if(this._aborted)return;const s=new Error(`${t+e}ms exceeded`);s.timeout=e,s.code="ECONNABORTED",s.errno=r,this.timedout=!0,this.abort(),this.callback(s)},o.prototype._setTimeouts=function(){const t=this;this._timeout&&!this._timer&&(this._timer=setTimeout(()=>{t._timeoutError("Timeout of ",t._timeout,"ETIME")},this._timeout)),this._responseTimeout&&!this._responseTimeoutTimer&&(this._responseTimeoutTimer=setTimeout(()=>{t._timeoutError("Response timeout of ",t._responseTimeout,"ETIMEDOUT")},this._responseTimeout))}},function(t,e,r){"use strict";const s=r(6);function o(t){if(t)return function(t){for(const e in o.prototype)t[e]=o.prototype[e];return t}(t)}t.exports=o,o.prototype.get=function(t){return this.header[t.toLowerCase()]},o.prototype._setHeaderProperties=function(t){const e=t["content-type"]||"";this.type=s.type(e);const r=s.params(e);for(const t in r)this[t]=r[t];this.links={};try{t.link&&(this.links=s.parseLinks(t.link))}catch(t){}},o.prototype._setStatusProperties=function(t){const e=t/100|0;this.status=this.statusCode=t,this.statusType=e,this.info=1==e,this.ok=2==e,this.redirect=3==e,this.clientError=4==e,this.serverError=5==e,this.error=(4==e||5==e)&&this.toError(),this.created=201==t,this.accepted=202==t,this.noContent=204==t,this.badRequest=400==t,this.unauthorized=401==t,this.notAcceptable=406==t,this.forbidden=403==t,this.notFound=404==t,this.unprocessableEntity=422==t}},function(t,e,r){"use strict";e.type=(t=>t.split(/ *; */).shift()),e.params=(t=>t.split(/ *; */).reduce((t,e)=>{const r=e.split(/ *= */),s=r.shift(),o=r.shift();return s&&o&&(t[s]=o),t},{})),e.parseLinks=(t=>t.split(/ *, */).reduce((t,e)=>{const r=e.split(/ *; */),s=r[0].slice(1,-1);return t[r[1].split(/ *= */)[1].slice(1,-1)]=s,t},{})),e.cleanHeader=((t,e)=>(delete t["content-type"],delete t["content-length"],delete t["transfer-encoding"],delete t.host,e&&(delete t.authorization,delete t.cookie),t))},function(t,e){function r(){this._defaults=[]}["use","on","once","set","query","type","accept","auth","withCredentials","sortQuery","retry","ok","redirects","timeout","buffer","serialize","parse","ca","key","pfx","cert"].forEach(t=>{r.prototype[t]=function(...e){return this._defaults.push({fn:t,args:e}),this}}),r.prototype._setDefaults=function(t){this._defaults.forEach(e=>{t[e.fn].apply(t,e.args)})},t.exports=r}]);