!function(t){var e={};function s(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,s),o.l=!0,o.exports}s.m=t,s.c=e,s.d=function(t,e,r){s.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},s.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s.t=function(t,e){if(1&e&&(t=s(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(s.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)s.d(r,o,function(e){return t[e]}.bind(null,o));return r},s.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="",s(s.s=2)}([function(t,e,s){"use strict";t.exports=function(t){return null!==t&&"object"==typeof t}},function(t,e,s){let r;"undefined"!=typeof window?r=window:"undefined"!=typeof self?r=self:(console.warn("Using browser-only version of superagent in non-browser environment"),r=this);const o=s(3),n=s(4),i=s(0),a=s(5),h=s(7);function u(){}const c=e=t.exports=function(t,s){return"function"==typeof s?new e.Request("GET",t).end(s):1==arguments.length?new e.Request("GET",t):new e.Request(t,s)};e.Request=_,c.getXHR=(()=>{if(!(!r.XMLHttpRequest||r.location&&"file:"==r.location.protocol&&r.ActiveXObject))return new XMLHttpRequest;try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(t){}try{return new ActiveXObject("Msxml2.XMLHTTP.6.0")}catch(t){}try{return new ActiveXObject("Msxml2.XMLHTTP.3.0")}catch(t){}try{return new ActiveXObject("Msxml2.XMLHTTP")}catch(t){}throw Error("Browser-only version of superagent could not find XHR")});const p="".trim?t=>t.trim():t=>t.replace(/(^\s*|\s*$)/g,"");function l(t){if(!i(t))return t;const e=[];for(const s in t)f(e,s,t[s]);return e.join("&")}function f(t,e,s){if(null!=s)if(Array.isArray(s))s.forEach(s=>{f(t,e,s)});else if(i(s))for(const r in s)f(t,`${e}[${r}]`,s[r]);else t.push(encodeURIComponent(e)+"="+encodeURIComponent(s));else null===s&&t.push(encodeURIComponent(e))}function d(t){const e={},s=t.split("&");let r,o;for(let t=0,n=s.length;t<n;++t)-1==(o=(r=s[t]).indexOf("="))?e[decodeURIComponent(r)]="":e[decodeURIComponent(r.slice(0,o))]=decodeURIComponent(r.slice(o+1));return e}function y(t){return/[\/+]json($|[^-\w])/.test(t)}function m(t){this.req=t,this.xhr=this.req.xhr,this.text="HEAD"!=this.req.method&&(""===this.xhr.responseType||"text"===this.xhr.responseType)||void 0===this.xhr.responseType?this.xhr.responseText:null,this.statusText=this.req.xhr.statusText;let e=this.xhr.status;1223===e&&(e=204),this._setStatusProperties(e),this.header=this.headers=function(t){const e=t.split(/\r?\n/),s={};let r,o,n,i;for(let t=0,a=e.length;t<a;++t)-1!==(r=(o=e[t]).indexOf(":"))&&(n=o.slice(0,r).toLowerCase(),i=p(o.slice(r+1)),s[n]=i);return s}(this.xhr.getAllResponseHeaders()),this.header["content-type"]=this.xhr.getResponseHeader("content-type"),this._setHeaderProperties(this.header),null===this.text&&t._responseType?this.body=this.xhr.response:this.body="HEAD"!=this.req.method?this._parseBody(this.text?this.text:this.xhr.response):null}function _(t,e){const s=this;this._query=this._query||[],this.method=t,this.url=e,this.header={},this._header={},this.on("end",()=>{let t,e=null,r=null;try{r=new m(s)}catch(t){return(e=new Error("Parser is unable to parse the response")).parse=!0,e.original=t,s.xhr?(e.rawResponse=void 0===s.xhr.responseType?s.xhr.responseText:s.xhr.response,e.status=s.xhr.status?s.xhr.status:null,e.statusCode=e.status):(e.rawResponse=null,e.status=null),s.callback(e)}s.emit("response",r);try{s._isResponseOK(r)||(t=new Error(r.statusText||"Unsuccessful HTTP response"))}catch(e){t=e}t?(t.original=e,t.response=r,t.status=r.status,s.callback(t,r)):s.callback(null,r)})}function b(t,e,s){const r=c("DELETE",t);return"function"==typeof e&&(s=e,e=null),e&&r.send(e),s&&r.end(s),r}c.serializeObject=l,c.parseString=d,c.types={html:"text/html",json:"application/json",xml:"text/xml",urlencoded:"application/x-www-form-urlencoded",form:"application/x-www-form-urlencoded","form-data":"application/x-www-form-urlencoded"},c.serialize={"application/x-www-form-urlencoded":l,"application/json":JSON.stringify},c.parse={"application/x-www-form-urlencoded":d,"application/json":JSON.parse},a(m.prototype),m.prototype._parseBody=function(t){let e=c.parse[this.type];return this.req._parser?this.req._parser(this,t):(!e&&y(this.type)&&(e=c.parse["application/json"]),e&&t&&(t.length||t instanceof Object)?e(t):null)},m.prototype.toError=function(){const t=this.req,e=t.method,s=t.url,r=`cannot ${e} ${s} (${this.status})`,o=new Error(r);return o.status=this.status,o.method=e,o.url=s,o},c.Response=m,o(_.prototype),n(_.prototype),_.prototype.type=function(t){return this.set("Content-Type",c.types[t]||t),this},_.prototype.accept=function(t){return this.set("Accept",c.types[t]||t),this},_.prototype.auth=function(t,e,s){1===arguments.length&&(e=""),"object"==typeof e&&null!==e&&(s=e,e=""),s||(s={type:"function"==typeof btoa?"basic":"auto"});return this._auth(t,e,s,t=>{if("function"==typeof btoa)return btoa(t);throw new Error("Cannot use basic auth, btoa is not a function")})},_.prototype.query=function(t){return"string"!=typeof t&&(t=l(t)),t&&this._query.push(t),this},_.prototype.attach=function(t,e,s){if(e){if(this._data)throw Error("superagent can't mix .send() and .attach()");this._getFormData().append(t,e,s||e.name)}return this},_.prototype._getFormData=function(){return this._formData||(this._formData=new r.FormData),this._formData},_.prototype.callback=function(t,e){if(this._shouldRetry(t,e))return this._retry();const s=this._callback;this.clearTimeout(),t&&(this._maxRetries&&(t.retries=this._retries-1),this.emit("error",t)),s(t,e)},_.prototype.crossDomainError=function(){const t=new Error("Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.");t.crossDomain=!0,t.status=this.status,t.method=this.method,t.url=this.url,this.callback(t)},_.prototype.buffer=_.prototype.ca=_.prototype.agent=function(){return console.warn("This is not supported in browser version of superagent"),this},_.prototype.pipe=_.prototype.write=(()=>{throw Error("Streaming is not supported in browser version of superagent")}),_.prototype._isHost=function(t){return t&&"object"==typeof t&&!Array.isArray(t)&&"[object Object]"!==Object.prototype.toString.call(t)},_.prototype.end=function(t){this._endCalled&&console.warn("Warning: .end() was called twice. This is not supported in superagent"),this._endCalled=!0,this._callback=t||u,this._finalizeQueryString(),this._end()},_.prototype._end=function(){if(this._aborted)return this.callback(Error("The request has been aborted even before .end() was called"));const t=this,e=this.xhr=c.getXHR();let s=this._formData||this._data;this._setTimeouts(),e.onreadystatechange=(()=>{const s=e.readyState;if(s>=2&&t._responseTimeoutTimer&&clearTimeout(t._responseTimeoutTimer),4!=s)return;let r;try{r=e.status}catch(t){r=0}if(!r){if(t.timedout||t._aborted)return;return t.crossDomainError()}t.emit("end")});const r=(e,s)=>{s.total>0&&(s.percent=s.loaded/s.total*100),s.direction=e,t.emit("progress",s)};if(this.hasListeners("progress"))try{e.onprogress=r.bind(null,"download"),e.upload&&(e.upload.onprogress=r.bind(null,"upload"))}catch(t){}try{this.username&&this.password?e.open(this.method,this.url,!0,this.username,this.password):e.open(this.method,this.url,!0)}catch(t){return this.callback(t)}if(this._withCredentials&&(e.withCredentials=!0),!this._formData&&"GET"!=this.method&&"HEAD"!=this.method&&"string"!=typeof s&&!this._isHost(s)){const t=this._header["content-type"];let e=this._serializer||c.serialize[t?t.split(";")[0]:""];!e&&y(t)&&(e=c.serialize["application/json"]),e&&(s=e(s))}for(const t in this.header)null!=this.header[t]&&this.header.hasOwnProperty(t)&&e.setRequestHeader(t,this.header[t]);this._responseType&&(e.responseType=this._responseType),this.emit("request",this),e.send(void 0!==s?s:null)},c.agent=(()=>new h),["GET","POST","OPTIONS","PATCH","PUT","DELETE"].forEach(t=>{h.prototype[t.toLowerCase()]=function(e,s){const r=new c.Request(t,e);return this._setDefaults(r),s&&r.end(s),r}}),h.prototype.del=h.prototype.delete,c.get=((t,e,s)=>{const r=c("GET",t);return"function"==typeof e&&(s=e,e=null),e&&r.query(e),s&&r.end(s),r}),c.head=((t,e,s)=>{const r=c("HEAD",t);return"function"==typeof e&&(s=e,e=null),e&&r.query(e),s&&r.end(s),r}),c.options=((t,e,s)=>{const r=c("OPTIONS",t);return"function"==typeof e&&(s=e,e=null),e&&r.send(e),s&&r.end(s),r}),c.del=b,c.delete=b,c.patch=((t,e,s)=>{const r=c("PATCH",t);return"function"==typeof e&&(s=e,e=null),e&&r.send(e),s&&r.end(s),r}),c.post=((t,e,s)=>{const r=c("POST",t);return"function"==typeof e&&(s=e,e=null),e&&r.send(e),s&&r.end(s),r}),c.put=((t,e,s)=>{const r=c("PUT",t);return"function"==typeof e&&(s=e,e=null),e&&r.send(e),s&&r.end(s),r})},function(t,e,s){"use strict";s.r(e);var r=s(1),o=s.n(r);Vue.component("conversation-component",{props:["conversation"],template:"<li><a v-on:click=\"$emit('open-conversation')\">{{conversation.groupName}}</a></li>"}),Vue.component("message-component",{props:["message"],template:"<li><a>{{message.from}}: {{message.text}}</a></li>"});new Vue({el:"#chat",data:{conversations:[],messages:[],selectedConversation:"",newMessage:""},mounted(){o.a.get("/chat/getConversations").then(t=>{if(console.log(t.body),void 0!==t.body)for(var e=0;e<t.body.length;e++)this.conversations.push({groupName:t.body[e].groupName,ID:t.body[e]._id,users:t.body[e].users})}).catch(t=>{console.log("Error retrieving requests "+t.message)})},methods:{openConversation:function(t){this.selectedConversation=t,this.messages=[],o.a.get("/chat/getMessages").query({conID:t.ID}).then(t=>{if(console.log(t.body),null!==t.body)for(var e=0;e<t.body.length;e++)this.messages.push({from:t.body[e].from.name,text:t.body[e].text})}).catch(t=>{console.log("Error retrieving messages "+t.message)})},sendMessage:function(){o.a.post("/chat/sendMessage").type("json").send({text:this.newMessage,conversationID:this.selectedConversation.ID}).then(t=>{void 0===t.body.msg&&(this.messages.push({from:t.body.from,text:t.body.text}),this.newMessage="")})}}})},function(t,e,s){function r(t){if(t)return function(t){for(var e in r.prototype)t[e]=r.prototype[e];return t}(t)}t.exports=r,r.prototype.on=r.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+t]=this._callbacks["$"+t]||[]).push(e),this},r.prototype.once=function(t,e){function s(){this.off(t,s),e.apply(this,arguments)}return s.fn=e,this.on(t,s),this},r.prototype.off=r.prototype.removeListener=r.prototype.removeAllListeners=r.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},0==arguments.length)return this._callbacks={},this;var s,r=this._callbacks["$"+t];if(!r)return this;if(1==arguments.length)return delete this._callbacks["$"+t],this;for(var o=0;o<r.length;o++)if((s=r[o])===e||s.fn===e){r.splice(o,1);break}return this},r.prototype.emit=function(t){this._callbacks=this._callbacks||{};var e=[].slice.call(arguments,1),s=this._callbacks["$"+t];if(s)for(var r=0,o=(s=s.slice(0)).length;r<o;++r)s[r].apply(this,e);return this},r.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks["$"+t]||[]},r.prototype.hasListeners=function(t){return!!this.listeners(t).length}},function(t,e,s){"use strict";const r=s(0);function o(t){if(t)return function(t){for(const e in o.prototype)t[e]=o.prototype[e];return t}(t)}t.exports=o,o.prototype.clearTimeout=function(){return clearTimeout(this._timer),clearTimeout(this._responseTimeoutTimer),delete this._timer,delete this._responseTimeoutTimer,this},o.prototype.parse=function(t){return this._parser=t,this},o.prototype.responseType=function(t){return this._responseType=t,this},o.prototype.serialize=function(t){return this._serializer=t,this},o.prototype.timeout=function(t){if(!t||"object"!=typeof t)return this._timeout=t,this._responseTimeout=0,this;for(const e in t)switch(e){case"deadline":this._timeout=t.deadline;break;case"response":this._responseTimeout=t.response;break;default:console.warn("Unknown timeout option",e)}return this},o.prototype.retry=function(t,e){return 0!==arguments.length&&!0!==t||(t=1),t<=0&&(t=0),this._maxRetries=t,this._retries=0,this._retryCallback=e,this};const n=["ECONNRESET","ETIMEDOUT","EADDRINFO","ESOCKETTIMEDOUT"];o.prototype._shouldRetry=function(t,e){if(!this._maxRetries||this._retries++>=this._maxRetries)return!1;if(this._retryCallback)try{const s=this._retryCallback(t,e);if(!0===s)return!0;if(!1===s)return!1}catch(t){console.error(t)}if(e&&e.status&&e.status>=500&&501!=e.status)return!0;if(t){if(t.code&&~n.indexOf(t.code))return!0;if(t.timeout&&"ECONNABORTED"==t.code)return!0;if(t.crossDomain)return!0}return!1},o.prototype._retry=function(){return this.clearTimeout(),this.req&&(this.req=null,this.req=this.request()),this._aborted=!1,this.timedout=!1,this._end()},o.prototype.then=function(t,e){if(!this._fullfilledPromise){const t=this;this._endCalled&&console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises"),this._fullfilledPromise=new Promise((e,s)=>{t.on("error",s),t.end((t,r)=>{t?s(t):e(r)})})}return this._fullfilledPromise.then(t,e)},o.prototype.catch=function(t){return this.then(void 0,t)},o.prototype.use=function(t){return t(this),this},o.prototype.ok=function(t){if("function"!=typeof t)throw Error("Callback required");return this._okCallback=t,this},o.prototype._isResponseOK=function(t){return!!t&&(this._okCallback?this._okCallback(t):t.status>=200&&t.status<300)},o.prototype.get=function(t){return this._header[t.toLowerCase()]},o.prototype.getHeader=o.prototype.get,o.prototype.set=function(t,e){if(r(t)){for(const e in t)this.set(e,t[e]);return this}return this._header[t.toLowerCase()]=e,this.header[t]=e,this},o.prototype.unset=function(t){return delete this._header[t.toLowerCase()],delete this.header[t],this},o.prototype.field=function(t,e){if(null==t)throw new Error(".field(name, val) name can not be empty");if(this._data)throw new Error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()");if(r(t)){for(const e in t)this.field(e,t[e]);return this}if(Array.isArray(e)){for(const s in e)this.field(t,e[s]);return this}if(null==e)throw new Error(".field(name, val) val can not be empty");return"boolean"==typeof e&&(e=""+e),this._getFormData().append(t,e),this},o.prototype.abort=function(){return this._aborted?this:(this._aborted=!0,this.xhr&&this.xhr.abort(),this.req&&this.req.abort(),this.clearTimeout(),this.emit("abort"),this)},o.prototype._auth=function(t,e,s,r){switch(s.type){case"basic":this.set("Authorization",`Basic ${r(`${t}:${e}`)}`);break;case"auto":this.username=t,this.password=e;break;case"bearer":this.set("Authorization",`Bearer ${t}`)}return this},o.prototype.withCredentials=function(t){return null==t&&(t=!0),this._withCredentials=t,this},o.prototype.redirects=function(t){return this._maxRedirects=t,this},o.prototype.maxResponseSize=function(t){if("number"!=typeof t)throw TypeError("Invalid argument");return this._maxResponseSize=t,this},o.prototype.toJSON=function(){return{method:this.method,url:this.url,data:this._data,headers:this._header}},o.prototype.send=function(t){const e=r(t);let s=this._header["content-type"];if(this._formData)throw new Error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()");if(e&&!this._data)Array.isArray(t)?this._data=[]:this._isHost(t)||(this._data={});else if(t&&this._data&&this._isHost(this._data))throw Error("Can't merge these send calls");if(e&&r(this._data))for(const e in t)this._data[e]=t[e];else"string"==typeof t?(s||this.type("form"),s=this._header["content-type"],this._data="application/x-www-form-urlencoded"==s?this._data?`${this._data}&${t}`:t:(this._data||"")+t):this._data=t;return!e||this._isHost(t)?this:(s||this.type("json"),this)},o.prototype.sortQuery=function(t){return this._sort=void 0===t||t,this},o.prototype._finalizeQueryString=function(){const t=this._query.join("&");if(t&&(this.url+=(this.url.indexOf("?")>=0?"&":"?")+t),this._query.length=0,this._sort){const t=this.url.indexOf("?");if(t>=0){const e=this.url.substring(t+1).split("&");"function"==typeof this._sort?e.sort(this._sort):e.sort(),this.url=this.url.substring(0,t)+"?"+e.join("&")}}},o.prototype._appendQueryString=(()=>{console.trace("Unsupported")}),o.prototype._timeoutError=function(t,e,s){if(this._aborted)return;const r=new Error(`${t+e}ms exceeded`);r.timeout=e,r.code="ECONNABORTED",r.errno=s,this.timedout=!0,this.abort(),this.callback(r)},o.prototype._setTimeouts=function(){const t=this;this._timeout&&!this._timer&&(this._timer=setTimeout(()=>{t._timeoutError("Timeout of ",t._timeout,"ETIME")},this._timeout)),this._responseTimeout&&!this._responseTimeoutTimer&&(this._responseTimeoutTimer=setTimeout(()=>{t._timeoutError("Response timeout of ",t._responseTimeout,"ETIMEDOUT")},this._responseTimeout))}},function(t,e,s){"use strict";const r=s(6);function o(t){if(t)return function(t){for(const e in o.prototype)t[e]=o.prototype[e];return t}(t)}t.exports=o,o.prototype.get=function(t){return this.header[t.toLowerCase()]},o.prototype._setHeaderProperties=function(t){const e=t["content-type"]||"";this.type=r.type(e);const s=r.params(e);for(const t in s)this[t]=s[t];this.links={};try{t.link&&(this.links=r.parseLinks(t.link))}catch(t){}},o.prototype._setStatusProperties=function(t){const e=t/100|0;this.status=this.statusCode=t,this.statusType=e,this.info=1==e,this.ok=2==e,this.redirect=3==e,this.clientError=4==e,this.serverError=5==e,this.error=(4==e||5==e)&&this.toError(),this.created=201==t,this.accepted=202==t,this.noContent=204==t,this.badRequest=400==t,this.unauthorized=401==t,this.notAcceptable=406==t,this.forbidden=403==t,this.notFound=404==t,this.unprocessableEntity=422==t}},function(t,e,s){"use strict";e.type=(t=>t.split(/ *; */).shift()),e.params=(t=>t.split(/ *; */).reduce((t,e)=>{const s=e.split(/ *= */),r=s.shift(),o=s.shift();return r&&o&&(t[r]=o),t},{})),e.parseLinks=(t=>t.split(/ *, */).reduce((t,e)=>{const s=e.split(/ *; */),r=s[0].slice(1,-1);return t[s[1].split(/ *= */)[1].slice(1,-1)]=r,t},{})),e.cleanHeader=((t,e)=>(delete t["content-type"],delete t["content-length"],delete t["transfer-encoding"],delete t.host,e&&(delete t.authorization,delete t.cookie),t))},function(t,e){function s(){this._defaults=[]}["use","on","once","set","query","type","accept","auth","withCredentials","sortQuery","retry","ok","redirects","timeout","buffer","serialize","parse","ca","key","pfx","cert"].forEach(t=>{s.prototype[t]=function(...e){return this._defaults.push({fn:t,args:e}),this}}),s.prototype._setDefaults=function(t){this._defaults.forEach(e=>{t[e.fn].apply(t,e.args)})},t.exports=s}]);