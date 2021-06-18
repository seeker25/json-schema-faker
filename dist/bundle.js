/*!
 * JSON Schema $Ref Parser v6.1.0 (February 21st 2019)
 * 
 * https://apidevtools.org/json-schema-ref-parser/
 * 
 * @author  James Messinger (https://jamesmessinger.com)
 * @license MIT
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.$RefParser=f()}})(function(){var define,module,exports;return function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r}()({1:[function(require,module,exports){"use strict";var $Ref=require("./ref"),Pointer=require("./pointer"),url=require("./util/url");function bundle(e,r){var n=[];crawl(e,"schema",e.$refs._root$Ref.path+"#","#",0,n,e.$refs,r),remap(n)}function crawl(e,r,n,t,i,o,f,a){var l=null===r?e:e[r];l&&"object"==typeof l&&($Ref.isAllowed$Ref(l)?inventory$Ref(e,r,n,t,i,o,f,a):Object.keys(l).sort(function(e,r){return"definitions"===e?-1:"definitions"===r?1:e.length-r.length}).forEach(function(e){var r=Pointer.join(n,e),h=Pointer.join(t,e),u=l[e];$Ref.isAllowed$Ref(u)?inventory$Ref(l,e,n,h,i,o,f,a):crawl(l,e,r,h,i,o,f,a)}))}function inventory$Ref(e,r,n,t,i,o,f,a){var l=null===r?e:e[r],h=url.resolve(n,l.$ref),u=f._resolve(h,a),s=Pointer.parse(t).length,c=url.stripHash(u.path),d=url.getHash(u.path),p=c!==f._root$Ref.path,$=$Ref.isExtended$Ref(l);i+=u.indirections;var v=findInInventory(o,e,r);if(v){if(!(s<v.depth||i<v.indirections))return;removeFromInventory(o,v)}o.push({$ref:l,parent:e,key:r,pathFromRoot:t,depth:s,file:c,hash:d,value:u.value,circular:u.circular,extended:$,external:p,indirections:i}),crawl(u.value,null,u.path,t,i+1,o,f,a)}function remap(e){var r,n,t;e.sort(function(e,r){if(e.file!==r.file)return e.file<r.file?-1:1;if(e.hash!==r.hash)return e.hash<r.hash?-1:1;if(e.circular!==r.circular)return e.circular?-1:1;if(e.extended!==r.extended)return e.extended?1:-1;if(e.indirections!==r.indirections)return e.indirections-r.indirections;if(e.depth!==r.depth)return e.depth-r.depth;var n=e.pathFromRoot.lastIndexOf("/definitions"),t=r.pathFromRoot.lastIndexOf("/definitions");return n!==t?t-n:e.pathFromRoot.length-r.pathFromRoot.length}),e.forEach(function(e){e.external?e.file===r&&e.hash===n?e.$ref.$ref=t:e.file===r&&0===e.hash.indexOf(n+"/")?e.$ref.$ref=Pointer.join(t,Pointer.parse(e.hash.replace(n,"#"))):(r=e.file,n=e.hash,t=e.pathFromRoot,e.$ref=e.parent[e.key]=$Ref.dereference(e.$ref,e.value),e.circular&&(e.$ref.$ref=e.pathFromRoot)):e.$ref.$ref=e.hash})}function findInInventory(e,r,n){for(var t=0;t<e.length;t++){var i=e[t];if(i.parent===r&&i.key===n)return i}}function removeFromInventory(e,r){var n=e.indexOf(r);e.splice(n,1)}module.exports=bundle},{"./pointer":11,"./ref":12,"./util/url":18}],2:[function(require,module,exports){"use strict";var $Ref=require("./ref"),Pointer=require("./pointer"),ono=require("ono"),url=require("./util/url");function dereference(e,r){var c=crawl(e.schema,e.$refs._root$Ref.path,"#",[],e.$refs,r);e.$refs.circular=c.circular,e.schema=c.value}function crawl(e,r,c,u,a,f){var i,l={value:e,circular:!1};return e&&"object"==typeof e&&(u.push(e),$Ref.isAllowed$Ref(e,f)?(i=dereference$Ref(e,r,c,u,a,f),l.circular=i.circular,l.value=i.value):Object.keys(e).forEach(function(n){var o=Pointer.join(r,n),t=Pointer.join(c,n),v=e[n],d=!1;$Ref.isAllowed$Ref(v,f)?(d=(i=dereference$Ref(v,o,t,u,a,f)).circular,e[n]=i.value):-1===u.indexOf(v)?(d=(i=crawl(v,o,t,u,a,f)).circular,e[n]=i.value):d=foundCircularReference(o,a,f),l.circular=l.circular||d}),u.pop()),l}function dereference$Ref(e,r,c,u,a,f){var i=url.resolve(r,e.$ref),l=a._resolve(i,f),n=l.circular,o=n||-1!==u.indexOf(l.value);o&&foundCircularReference(r,a,f);var t=$Ref.dereference(e,l.value);if(!o){var v=crawl(t,l.path,c,u,a,f);o=v.circular,t=v.value}return o&&!n&&"ignore"===f.dereference.circular&&(t=e),n&&(t.$ref=c),{circular:o,value:t}}function foundCircularReference(e,r,c){if(r.circular=!0,!c.dereference.circular)throw ono.reference("Circular $ref pointer found at %s",e);return!0}module.exports=dereference},{"./pointer":11,"./ref":12,"./util/url":18,ono:64}],3:[function(require,module,exports){(function(Buffer){"use strict";var Options=require("./options"),$Refs=require("./refs"),parse=require("./parse"),normalizeArgs=require("./normalize-args"),resolveExternal=require("./resolve-external"),bundle=require("./bundle"),dereference=require("./dereference"),url=require("./util/url"),maybe=require("call-me-maybe"),ono=require("ono");function $RefParser(){this.schema=null,this.$refs=new $Refs}module.exports=$RefParser,module.exports.YAML=require("./util/yaml"),$RefParser.parse=function(e,r,t,a){var s=new this;return s.parse.apply(s,arguments)},$RefParser.prototype.parse=function(e,r,t,a){var s,n=normalizeArgs(arguments);if(!n.path&&!n.schema){var o=ono("Expected a file path, URL, or object. Got %s",n.path||n.schema);return maybe(n.callback,Promise.reject(o))}this.schema=null,this.$refs=new $Refs;var i="http";if(url.isFileSystemPath(n.path)&&(n.path=url.fromFileSystemPath(n.path),i="file"),n.path=url.resolve(url.cwd(),n.path),n.schema&&"object"==typeof n.schema){var c=this.$refs._add(n.path);c.value=n.schema,c.pathType=i,s=Promise.resolve(n.schema)}else s=parse(n.path,this.$refs,n.options);var l=this;return s.then(function(e){if(!e||"object"!=typeof e||Buffer.isBuffer(e))throw ono.syntax('"%s" is not a valid JSON Schema',l.$refs._root$Ref.path||e);return l.schema=e,maybe(n.callback,Promise.resolve(l.schema))}).catch(function(e){return maybe(n.callback,Promise.reject(e))})},$RefParser.resolve=function(e,r,t,a){var s=new this;return s.resolve.apply(s,arguments)},$RefParser.prototype.resolve=function(e,r,t,a){var s=this,n=normalizeArgs(arguments);return this.parse(n.path,n.schema,n.options).then(function(){return resolveExternal(s,n.options)}).then(function(){return maybe(n.callback,Promise.resolve(s.$refs))}).catch(function(e){return maybe(n.callback,Promise.reject(e))})},$RefParser.bundle=function(e,r,t,a){var s=new this;return s.bundle.apply(s,arguments)},$RefParser.prototype.bundle=function(e,r,t,a){var s=this,n=normalizeArgs(arguments);return this.resolve(n.path,n.schema,n.options).then(function(){return bundle(s,n.options),maybe(n.callback,Promise.resolve(s.schema))}).catch(function(e){return maybe(n.callback,Promise.reject(e))})},$RefParser.dereference=function(e,r,t,a){var s=new this;return s.dereference.apply(s,arguments)},$RefParser.prototype.dereference=function(e,r,t,a){var s=this,n=normalizeArgs(arguments);return this.resolve(n.path,n.schema,n.options).then(function(){return dereference(s,n.options),maybe(n.callback,Promise.resolve(s.schema))}).catch(function(e){return maybe(n.callback,Promise.reject(e))})}}).call(this,{isBuffer:require("../node_modules/is-buffer/index.js")})},{"../node_modules/is-buffer/index.js":32,"./bundle":1,"./dereference":2,"./normalize-args":4,"./options":5,"./parse":6,"./refs":13,"./resolve-external":14,"./util/url":18,"./util/yaml":19,"call-me-maybe":25,ono:64}],4:[function(require,module,exports){"use strict";var Options=require("./options");function normalizeArgs(o){var t,e,n,r;return"function"==typeof(o=Array.prototype.slice.call(o))[o.length-1]&&(r=o.pop()),"string"==typeof o[0]?(t=o[0],"object"==typeof o[2]?(e=o[1],n=o[2]):(e=void 0,n=o[1])):(t="",e=o[0],n=o[1]),n instanceof Options||(n=new Options(n)),{path:t,schema:e,options:n,callback:r}}module.exports=normalizeArgs},{"./options":5}],5:[function(require,module,exports){"use strict";var jsonParser=require("./parsers/json"),yamlParser=require("./parsers/yaml"),textParser=require("./parsers/text"),binaryParser=require("./parsers/binary"),fileResolver=require("./resolvers/file"),httpResolver=require("./resolvers/http");function $RefParserOptions(e){merge(this,$RefParserOptions.defaults),merge(this,e)}function merge(e,r){if(isMergeable(r))for(var s=Object.keys(r),a=0;a<s.length;a++){var t=s[a],i=r[t],n=e[t];isMergeable(i)?e[t]=merge(n||{},i):void 0!==i&&(e[t]=i)}return e}function isMergeable(e){return e&&"object"==typeof e&&!Array.isArray(e)&&!(e instanceof RegExp)&&!(e instanceof Date)}module.exports=$RefParserOptions,$RefParserOptions.defaults={parse:{json:jsonParser,yaml:yamlParser,text:textParser,binary:binaryParser},resolve:{file:fileResolver,http:httpResolver,external:!0},dereference:{circular:!0}}},{"./parsers/binary":7,"./parsers/json":8,"./parsers/text":9,"./parsers/yaml":10,"./resolvers/file":15,"./resolvers/http":16}],6:[function(require,module,exports){(function(Buffer){"use strict";var ono=require("ono"),url=require("./util/url"),plugins=require("./util/plugins");function parse(r,n,e){try{r=url.stripHash(r);var t=n._add(r),s={url:r,extension:url.getExtension(r)};return readFile(s,e).then(function(r){return t.pathType=r.plugin.name,s.data=r.result,parseFile(s,e)}).then(function(r){return t.value=r.result,r.result})}catch(r){return Promise.reject(r)}}function readFile(r,n){return new Promise(function(e,t){var s=plugins.all(n.resolve);s=plugins.filter(s,"canRead",r),plugins.sort(s),plugins.run(s,"read",r).then(e,function(n){!n||n instanceof SyntaxError?t(ono.syntax('Unable to resolve $ref pointer "%s"',r.url)):t(n)})})}function parseFile(r,n){return new Promise(function(e,t){var s=plugins.all(n.parse),u=plugins.filter(s,"canParse",r),i=u.length>0?u:s;plugins.sort(i),plugins.run(i,"parse",r).then(function(n){!n.plugin.allowEmpty&&isEmpty(n.result)?t(ono.syntax('Error parsing "%s" as %s. \nParsed value is empty',r.url,n.plugin.name)):e(n)},function(n){n?(n=n instanceof Error?n:new Error(n),t(ono.syntax(n,"Error parsing %s",r.url))):t(ono.syntax("Unable to parse %s",r.url))})})}function isEmpty(r){return void 0===r||"object"==typeof r&&0===Object.keys(r).length||"string"==typeof r&&0===r.trim().length||Buffer.isBuffer(r)&&0===r.length}module.exports=parse}).call(this,{isBuffer:require("../node_modules/is-buffer/index.js")})},{"../node_modules/is-buffer/index.js":32,"./util/plugins":17,"./util/url":18,ono:64}],7:[function(require,module,exports){(function(Buffer){"use strict";var BINARY_REGEXP=/\.(jpeg|jpg|gif|png|bmp|ico)$/i;module.exports={order:400,allowEmpty:!0,canParse:function(r){return Buffer.isBuffer(r.data)&&BINARY_REGEXP.test(r.url)},parse:function(r){return Buffer.isBuffer(r.data)?r.data:new Buffer(r.data)}}}).call(this,require("buffer").Buffer)},{buffer:23}],8:[function(require,module,exports){(function(Buffer){"use strict";module.exports={order:100,allowEmpty:!0,canParse:".json",parse:function(r){return new Promise(function(e,t){var n=r.data;Buffer.isBuffer(n)&&(n=n.toString()),"string"==typeof n?0===n.trim().length?e(void 0):e(JSON.parse(n)):e(n)})}}}).call(this,{isBuffer:require("../../node_modules/is-buffer/index.js")})},{"../../node_modules/is-buffer/index.js":32}],9:[function(require,module,exports){(function(Buffer){"use strict";var TEXT_REGEXP=/\.(txt|htm|html|md|xml|js|min|map|css|scss|less|svg)$/i;module.exports={order:300,allowEmpty:!0,encoding:"utf8",canParse:function(t){return("string"==typeof t.data||Buffer.isBuffer(t.data))&&TEXT_REGEXP.test(t.url)},parse:function(t){if("string"==typeof t.data)return t.data;if(Buffer.isBuffer(t.data))return t.data.toString(this.encoding);throw new Error("data is not text")}}}).call(this,{isBuffer:require("../../node_modules/is-buffer/index.js")})},{"../../node_modules/is-buffer/index.js":32}],10:[function(require,module,exports){(function(Buffer){"use strict";var YAML=require("../util/yaml");module.exports={order:200,allowEmpty:!0,canParse:[".yaml",".yml",".json"],parse:function(r){return new Promise(function(e,t){var a=r.data;Buffer.isBuffer(a)&&(a=a.toString()),e("string"==typeof a?YAML.parse(a):a)})}}}).call(this,{isBuffer:require("../../node_modules/is-buffer/index.js")})},{"../../node_modules/is-buffer/index.js":32,"../util/yaml":19}],11:[function(require,module,exports){"use strict";module.exports=Pointer;var $Ref=require("./ref"),url=require("./util/url"),ono=require("ono"),slashes=/\//g,tildes=/~/g,escapedSlash=/~1/g,escapedTilde=/~0/g;function Pointer(e,r,t){this.$ref=e,this.path=r,this.originalPath=t||r,this.value=void 0,this.circular=!1,this.indirections=0}function resolveIf$Ref(e,r){if($Ref.isAllowed$Ref(e.value,r)){var t=url.resolve(e.path,e.value.$ref);if(t!==e.path){var i=e.$ref.$refs._resolve(t,r);return e.indirections+=i.indirections+1,$Ref.isExtended$Ref(e.value)?(e.value=$Ref.dereference(e.value,i.value),!1):(e.$ref=i.$ref,e.path=i.path,e.value=i.value,!0)}e.circular=!0}}function setValue(e,r,t){if(!e.value||"object"!=typeof e.value)throw ono.syntax('Error assigning $ref pointer "%s". \nCannot set "%s" of a non-object.',e.path,r);return"-"===r&&Array.isArray(e.value)?e.value.push(t):e.value[r]=t,t}Pointer.prototype.resolve=function(e,r){var t=Pointer.parse(this.path);this.value=e;for(var i=0;i<t.length;i++){resolveIf$Ref(this,r)&&(this.path=Pointer.join(this.path,t.slice(i)));var s=t[i];if(void 0===this.value[s])throw ono.syntax('Error resolving $ref pointer "%s". \nToken "%s" does not exist.',this.originalPath,s);this.value=this.value[s]}return resolveIf$Ref(this,r),this},Pointer.prototype.set=function(e,r,t){var i,s=Pointer.parse(this.path);if(0===s.length)return this.value=r,r;this.value=e;for(var a=0;a<s.length-1;a++)resolveIf$Ref(this,t),i=s[a],this.value&&void 0!==this.value[i]?this.value=this.value[i]:this.value=setValue(this,i,{});return resolveIf$Ref(this,t),setValue(this,i=s[s.length-1],r),e},Pointer.parse=function(e){var r=url.getHash(e).substr(1);if(!r)return[];r=r.split("/");for(var t=0;t<r.length;t++)r[t]=decodeURIComponent(r[t].replace(escapedSlash,"/").replace(escapedTilde,"~"));if(""!==r[0])throw ono.syntax('Invalid $ref pointer "%s". Pointers must begin with "#/"',r);return r.slice(1)},Pointer.join=function(e,r){-1===e.indexOf("#")&&(e+="#"),r=Array.isArray(r)?r:[r];for(var t=0;t<r.length;t++){var i=r[t];e+="/"+encodeURIComponent(i.replace(tildes,"~0").replace(slashes,"~1"))}return e}},{"./ref":12,"./util/url":18,ono:64}],12:[function(require,module,exports){"use strict";module.exports=$Ref;var Pointer=require("./pointer");function $Ref(){this.path=void 0,this.value=void 0,this.$refs=void 0,this.pathType=void 0}$Ref.prototype.exists=function(e,t){try{return this.resolve(e,t),!0}catch(e){return!1}},$Ref.prototype.get=function(e,t){return this.resolve(e,t).value},$Ref.prototype.resolve=function(e,t,r){return new Pointer(this,e,r).resolve(this.value,t)},$Ref.prototype.set=function(e,t){var r=new Pointer(this,e);this.value=r.set(this.value,t)},$Ref.is$Ref=function(e){return e&&"object"==typeof e&&"string"==typeof e.$ref&&e.$ref.length>0},$Ref.isExternal$Ref=function(e){return $Ref.is$Ref(e)&&"#"!==e.$ref[0]},$Ref.isAllowed$Ref=function(e,t){if($Ref.is$Ref(e)){if("#/"===e.$ref.substr(0,2)||"#"===e.$ref)return!0;if("#"!==e.$ref[0]&&(!t||t.resolve.external))return!0}},$Ref.isExtended$Ref=function(e){return $Ref.is$Ref(e)&&Object.keys(e).length>1},$Ref.dereference=function(e,t){if(t&&"object"==typeof t&&$Ref.isExtended$Ref(e)){var r={};return Object.keys(e).forEach(function(t){"$ref"!==t&&(r[t]=e[t])}),Object.keys(t).forEach(function(e){e in r||(r[e]=t[e])}),r}return t}},{"./pointer":11}],13:[function(require,module,exports){"use strict";var ono=require("ono"),$Ref=require("./ref"),url=require("./util/url");function $Refs(){this.circular=!1,this._$refs={},this._root$Ref=null}function getPaths(e,r){var t=Object.keys(e);return(r=Array.isArray(r[0])?r[0]:Array.prototype.slice.call(r)).length>0&&r[0]&&(t=t.filter(function(t){return-1!==r.indexOf(e[t].pathType)})),t.map(function(r){return{encoded:r,decoded:"file"===e[r].pathType?url.toFileSystemPath(r,!0):r}})}module.exports=$Refs,$Refs.prototype.paths=function(e){return getPaths(this._$refs,arguments).map(function(e){return e.decoded})},$Refs.prototype.values=function(e){var r=this._$refs;return getPaths(r,arguments).reduce(function(e,t){return e[t.decoded]=r[t.encoded].value,e},{})},$Refs.prototype.toJSON=$Refs.prototype.values,$Refs.prototype.exists=function(e,r){try{return this._resolve(e,r),!0}catch(e){return!1}},$Refs.prototype.get=function(e,r){return this._resolve(e,r).value},$Refs.prototype.set=function(e,r){var t=url.resolve(this._root$Ref.path,e),o=url.stripHash(t),s=this._$refs[o];if(!s)throw ono('Error resolving $ref pointer "%s". \n"%s" not found.',e,o);s.set(t,r)},$Refs.prototype._add=function(e){var r=url.stripHash(e),t=new $Ref;return t.path=r,t.$refs=this,this._$refs[r]=t,this._root$Ref=this._root$Ref||t,t},$Refs.prototype._resolve=function(e,r){var t=url.resolve(this._root$Ref.path,e),o=url.stripHash(t),s=this._$refs[o];if(!s)throw ono('Error resolving $ref pointer "%s". \n"%s" not found.',e,o);return s.resolve(t,r,e)},$Refs.prototype._get$Ref=function(e){e=url.resolve(this._root$Ref.path,e);var r=url.stripHash(e);return this._$refs[r]}},{"./ref":12,"./util/url":18,ono:64}],14:[function(require,module,exports){"use strict";var $Ref=require("./ref"),Pointer=require("./pointer"),parse=require("./parse"),url=require("./util/url");function resolveExternal(e,r){if(!r.resolve.external)return Promise.resolve();try{var t=crawl(e.schema,e.$refs._root$Ref.path+"#",e.$refs,r);return Promise.all(t)}catch(e){return Promise.reject(e)}}function crawl(e,r,t,o){var s=[];return e&&"object"==typeof e&&($Ref.isExternal$Ref(e)?s.push(resolve$Ref(e,r,t,o)):Object.keys(e).forEach(function(l){var a=Pointer.join(r,l),n=e[l];$Ref.isExternal$Ref(n)?s.push(resolve$Ref(n,a,t,o)):s=s.concat(crawl(n,a,t,o))})),s}function resolve$Ref(e,r,t,o){var s=url.resolve(r,e.$ref),l=url.stripHash(s);return(e=t._$refs[l])?Promise.resolve(e.value):parse(s,t,o).then(function(e){var r=crawl(e,l+"#",t,o);return Promise.all(r)})}module.exports=resolveExternal},{"./parse":6,"./pointer":11,"./ref":12,"./util/url":18}],15:[function(require,module,exports){"use strict";var fs=require("fs"),ono=require("ono"),url=require("../util/url");module.exports={order:100,canRead:function(r){return url.isFileSystemPath(r.url)},read:function(r){return new Promise(function(e,o){var n;try{n=url.toFileSystemPath(r.url)}catch(e){o(ono.uri(e,"Malformed URI: %s",r.url))}try{fs.readFile(n,function(r,u){r?o(ono(r,'Error opening file "%s"',n)):e(u)})}catch(r){o(ono(r,'Error opening file "%s"',n))}})}}},{"../util/url":18,fs:21,ono:64}],16:[function(require,module,exports){(function(process,Buffer){"use strict";var http=require("http"),https=require("https"),ono=require("ono"),url=require("../util/url");function download(t,o,e){return new Promise(function(r,n){t=url.parse(t),(e=e||[]).push(t.href),get(t,o).then(function(s){if(s.statusCode>=400)throw ono({status:s.statusCode},"HTTP ERROR %d",s.statusCode);if(s.statusCode>=300)if(e.length>o.redirects)n(ono({status:s.statusCode},"Error downloading %s. \nToo many redirects: \n  %s",e[0],e.join(" \n  ")));else{if(!s.headers.location)throw ono({status:s.statusCode},"HTTP %d redirect with no location header",s.statusCode);download(url.resolve(t,s.headers.location),o,e).then(r,n)}else r(s.body||new Buffer(0))}).catch(function(o){n(ono(o,"Error downloading",t.href))})})}function get(t,o){return new Promise(function(e,r){var n=("https:"===t.protocol?https:http).get({hostname:t.hostname,port:t.port,path:t.path,auth:t.auth,protocol:t.protocol,headers:o.headers||{},withCredentials:o.withCredentials});"function"==typeof n.setTimeout&&n.setTimeout(o.timeout),n.on("timeout",function(){n.abort()}),n.on("error",r),n.once("response",function(t){t.body=new Buffer(0),t.on("data",function(o){t.body=Buffer.concat([t.body,new Buffer(o)])}),t.on("error",r),t.on("end",function(){e(t)})})})}module.exports={order:200,headers:null,timeout:5e3,redirects:5,withCredentials:!1,canRead:function(t){return url.isHttp(t.url)},read:function(t){var o=url.parse(t.url);return process.browser&&!o.protocol&&(o.protocol=url.parse(location.href).protocol),download(o,this)}}}).call(this,require("_process"),require("buffer").Buffer)},{"../util/url":18,_process:66,buffer:23,http:80,https:29,ono:64}],17:[function(require,module,exports){"use strict";function getResult(t,n,r,e){var u=t[n];if("function"==typeof u)return u.apply(t,[r,e]);if(!e){if(u instanceof RegExp)return u.test(r.url);if("string"==typeof u)return u===r.extension;if(Array.isArray(u))return-1!==u.indexOf(r.extension)}return u}exports.all=function(t){return Object.keys(t).filter(function(n){return"object"==typeof t[n]}).map(function(n){return t[n].name=n,t[n]})},exports.filter=function(t,n,r){return t.filter(function(t){return!!getResult(t,n,r)})},exports.sort=function(t){return t.forEach(function(t){t.order=t.order||Number.MAX_SAFE_INTEGER}),t.sort(function(t,n){return t.order-n.order})},exports.run=function(t,n,r){var e,u,o=0;return new Promise(function(i,f){function c(){if(!(e=t[o++]))return f(u);try{var i=getResult(e,n,r,s);i&&"function"==typeof i.then?i.then(p,a):void 0!==i&&p(i)}catch(t){a(t)}}function s(t,n){t?a(t):p(n)}function p(t){i({plugin:e,result:t})}function a(t){u=t,c()}c()})}},{}],18:[function(require,module,exports){(function(process){"use strict";var isWindows=/^win/.test(process.platform),forwardSlashPattern=/\//g,protocolPattern=/^(\w{2,}):\/\//i,url=module.exports,urlEncodePatterns=[/\?/g,"%3F",/\#/g,"%23"],urlDecodePatterns=[/\%23/g,"#",/\%24/g,"$",/\%26/g,"&",/\%2C/g,",",/\%40/g,"@"];exports.parse=require("url").parse,exports.resolve=require("url").resolve,exports.cwd=function(){return process.browser?location.href:process.cwd()+"/"},exports.getProtocol=function(r){var e=protocolPattern.exec(r);if(e)return e[1].toLowerCase()},exports.getExtension=function(r){var e=r.lastIndexOf(".");return e>=0?r.substr(e).toLowerCase():""},exports.getHash=function(r){var e=r.indexOf("#");return e>=0?r.substr(e):"#"},exports.stripHash=function(r){var e=r.indexOf("#");return e>=0&&(r=r.substr(0,e)),r},exports.isHttp=function(r){var e=url.getProtocol(r);return"http"===e||"https"===e||void 0===e&&process.browser},exports.isFileSystemPath=function(r){if(process.browser)return!1;var e=url.getProtocol(r);return void 0===e||"file"===e},exports.fromFileSystemPath=function(r){isWindows&&(r=r.replace(/\\/g,"/")),r=encodeURI(r);for(var e=0;e<urlEncodePatterns.length;e+=2)r=r.replace(urlEncodePatterns[e],urlEncodePatterns[e+1]);return r},exports.toFileSystemPath=function(r,e){r=decodeURI(r);for(var t=0;t<urlDecodePatterns.length;t+=2)r=r.replace(urlDecodePatterns[t],urlDecodePatterns[t+1]);var s="file://"===r.substr(0,7).toLowerCase();return s&&(r="/"===r[7]?r.substr(8):r.substr(7),isWindows&&"/"===r[1]&&(r=r[0]+":"+r.substr(1)),e?r="file:///"+r:(s=!1,r=isWindows?r:"/"+r)),isWindows&&!s&&":\\"===(r=r.replace(forwardSlashPattern,"\\")).substr(1,2)&&(r=r[0].toUpperCase()+r.substr(1)),r}}).call(this,require("_process"))},{_process:66,url:87}],19:[function(require,module,exports){"use strict";var yaml=require("js-yaml"),ono=require("ono");module.exports={parse:function(r,e){try{return yaml.safeLoad(r)}catch(r){throw r instanceof Error?r:ono(r,r.message)}},stringify:function(r,e,o){try{var t=("string"==typeof o?o.length:o)||2;return yaml.safeDump(r,{indent:t})}catch(r){throw r instanceof Error?r:ono(r,r.message)}}}},{"js-yaml":34,ono:64}],20:[function(require,module,exports){"use strict";exports.byteLength=byteLength,exports.toByteArray=toByteArray,exports.fromByteArray=fromByteArray;for(var lookup=[],revLookup=[],Arr="undefined"!=typeof Uint8Array?Uint8Array:Array,code="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",i=0,len=code.length;i<len;++i)lookup[i]=code[i],revLookup[code.charCodeAt(i)]=i;function getLens(o){var r=o.length;if(r%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var e=o.indexOf("=");return-1===e&&(e=r),[e,e===r?0:4-e%4]}function byteLength(o){var r=getLens(o),e=r[0],t=r[1];return 3*(e+t)/4-t}function _byteLength(o,r,e){return 3*(r+e)/4-e}function toByteArray(o){for(var r,e=getLens(o),t=e[0],n=e[1],u=new Arr(_byteLength(o,t,n)),p=0,a=n>0?t-4:t,h=0;h<a;h+=4)r=revLookup[o.charCodeAt(h)]<<18|revLookup[o.charCodeAt(h+1)]<<12|revLookup[o.charCodeAt(h+2)]<<6|revLookup[o.charCodeAt(h+3)],u[p++]=r>>16&255,u[p++]=r>>8&255,u[p++]=255&r;return 2===n&&(r=revLookup[o.charCodeAt(h)]<<2|revLookup[o.charCodeAt(h+1)]>>4,u[p++]=255&r),1===n&&(r=revLookup[o.charCodeAt(h)]<<10|revLookup[o.charCodeAt(h+1)]<<4|revLookup[o.charCodeAt(h+2)]>>2,u[p++]=r>>8&255,u[p++]=255&r),u}function tripletToBase64(o){return lookup[o>>18&63]+lookup[o>>12&63]+lookup[o>>6&63]+lookup[63&o]}function encodeChunk(o,r,e){for(var t,n=[],u=r;u<e;u+=3)t=(o[u]<<16&16711680)+(o[u+1]<<8&65280)+(255&o[u+2]),n.push(tripletToBase64(t));return n.join("")}function fromByteArray(o){for(var r,e=o.length,t=e%3,n=[],u=0,p=e-t;u<p;u+=16383)n.push(encodeChunk(o,u,u+16383>p?p:u+16383));return 1===t?(r=o[e-1],n.push(lookup[r>>2]+lookup[r<<4&63]+"==")):2===t&&(r=(o[e-2]<<8)+o[e-1],n.push(lookup[r>>10]+lookup[r>>4&63]+lookup[r<<2&63]+"=")),n.join("")}revLookup["-".charCodeAt(0)]=62,revLookup["_".charCodeAt(0)]=63},{}],21:[function(require,module,exports){},{}],22:[function(require,module,exports){(function(global){
/*! https://mths.be/punycode v1.4.1 by @mathias */
!function(e){var o="object"==typeof exports&&exports&&!exports.nodeType&&exports,n="object"==typeof module&&module&&!module.nodeType&&module,t="object"==typeof global&&global;t.global!==t&&t.window!==t&&t.self!==t||(e=t);var r,u,i=2147483647,f=36,c=1,l=26,s=38,d=700,p=72,a=128,h="-",v=/^xn--/,g=/[^\x20-\x7E]/,w=/[\x2E\u3002\uFF0E\uFF61]/g,x={overflow:"Overflow: input needs wider integers to process","not-basic":"Illegal input >= 0x80 (not a basic code point)","invalid-input":"Invalid input"},b=f-c,y=Math.floor,C=String.fromCharCode;function m(e){throw new RangeError(x[e])}function j(e,o){for(var n=e.length,t=[];n--;)t[n]=o(e[n]);return t}function A(e,o){var n=e.split("@"),t="";return n.length>1&&(t=n[0]+"@",e=n[1]),t+j((e=e.replace(w,".")).split("."),o).join(".")}function I(e){for(var o,n,t=[],r=0,u=e.length;r<u;)(o=e.charCodeAt(r++))>=55296&&o<=56319&&r<u?56320==(64512&(n=e.charCodeAt(r++)))?t.push(((1023&o)<<10)+(1023&n)+65536):(t.push(o),r--):t.push(o);return t}function E(e){return j(e,function(e){var o="";return e>65535&&(o+=C((e-=65536)>>>10&1023|55296),e=56320|1023&e),o+=C(e)}).join("")}function F(e,o){return e+22+75*(e<26)-((0!=o)<<5)}function O(e,o,n){var t=0;for(e=n?y(e/d):e>>1,e+=y(e/o);e>b*l>>1;t+=f)e=y(e/b);return y(t+(b+1)*e/(e+s))}function S(e){var o,n,t,r,u,s,d,v,g,w,x,b=[],C=e.length,j=0,A=a,I=p;for((n=e.lastIndexOf(h))<0&&(n=0),t=0;t<n;++t)e.charCodeAt(t)>=128&&m("not-basic"),b.push(e.charCodeAt(t));for(r=n>0?n+1:0;r<C;){for(u=j,s=1,d=f;r>=C&&m("invalid-input"),((v=(x=e.charCodeAt(r++))-48<10?x-22:x-65<26?x-65:x-97<26?x-97:f)>=f||v>y((i-j)/s))&&m("overflow"),j+=v*s,!(v<(g=d<=I?c:d>=I+l?l:d-I));d+=f)s>y(i/(w=f-g))&&m("overflow"),s*=w;I=O(j-u,o=b.length+1,0==u),y(j/o)>i-A&&m("overflow"),A+=y(j/o),j%=o,b.splice(j++,0,A)}return E(b)}function T(e){var o,n,t,r,u,s,d,v,g,w,x,b,j,A,E,S=[];for(b=(e=I(e)).length,o=a,n=0,u=p,s=0;s<b;++s)(x=e[s])<128&&S.push(C(x));for(t=r=S.length,r&&S.push(h);t<b;){for(d=i,s=0;s<b;++s)(x=e[s])>=o&&x<d&&(d=x);for(d-o>y((i-n)/(j=t+1))&&m("overflow"),n+=(d-o)*j,o=d,s=0;s<b;++s)if((x=e[s])<o&&++n>i&&m("overflow"),x==o){for(v=n,g=f;!(v<(w=g<=u?c:g>=u+l?l:g-u));g+=f)E=v-w,A=f-w,S.push(C(F(w+E%A,0))),v=y(E/A);S.push(C(F(v,0))),u=O(n,j,t==r),n=0,++t}++n,++o}return S.join("")}if(r={version:"1.4.1",ucs2:{decode:I,encode:E},decode:S,encode:T,toASCII:function(e){return A(e,function(e){return g.test(e)?"xn--"+T(e):e})},toUnicode:function(e){return A(e,function(e){return v.test(e)?S(e.slice(4).toLowerCase()):e})}},"function"==typeof define&&"object"==typeof define.amd&&define.amd)define("punycode",function(){return r});else if(o&&n)if(module.exports==o)n.exports=r;else for(u in r)r.hasOwnProperty(u)&&(o[u]=r[u]);else e.punycode=r}(this)}).call(this,typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{}],23:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
"use strict";var base64=require("base64-js"),ieee754=require("ieee754");exports.Buffer=Buffer,exports.SlowBuffer=SlowBuffer,exports.INSPECT_MAX_BYTES=50;var K_MAX_LENGTH=2147483647;function typedArraySupport(){try{var e=new Uint8Array(1);return e.__proto__={__proto__:Uint8Array.prototype,foo:function(){return 42}},42===e.foo()}catch(e){return!1}}function createBuffer(e){if(e>K_MAX_LENGTH)throw new RangeError('The value "'+e+'" is invalid for option "size"');var t=new Uint8Array(e);return t.__proto__=Buffer.prototype,t}function Buffer(e,t,r){if("number"==typeof e){if("string"==typeof t)throw new TypeError('The "string" argument must be of type string. Received type number');return allocUnsafe(e)}return from(e,t,r)}function from(e,t,r){if("string"==typeof e)return fromString(e,t);if(ArrayBuffer.isView(e))return fromArrayLike(e);if(null==e)throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof e);if(isInstance(e,ArrayBuffer)||e&&isInstance(e.buffer,ArrayBuffer))return fromArrayBuffer(e,t,r);if("number"==typeof e)throw new TypeError('The "value" argument must not be of type number. Received type number');var n=e.valueOf&&e.valueOf();if(null!=n&&n!==e)return Buffer.from(n,t,r);var f=fromObject(e);if(f)return f;if("undefined"!=typeof Symbol&&null!=Symbol.toPrimitive&&"function"==typeof e[Symbol.toPrimitive])return Buffer.from(e[Symbol.toPrimitive]("string"),t,r);throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof e)}function assertSize(e){if("number"!=typeof e)throw new TypeError('"size" argument must be of type number');if(e<0)throw new RangeError('The value "'+e+'" is invalid for option "size"')}function alloc(e,t,r){return assertSize(e),e<=0?createBuffer(e):void 0!==t?"string"==typeof r?createBuffer(e).fill(t,r):createBuffer(e).fill(t):createBuffer(e)}function allocUnsafe(e){return assertSize(e),createBuffer(e<0?0:0|checked(e))}function fromString(e,t){if("string"==typeof t&&""!==t||(t="utf8"),!Buffer.isEncoding(t))throw new TypeError("Unknown encoding: "+t);var r=0|byteLength(e,t),n=createBuffer(r),f=n.write(e,t);return f!==r&&(n=n.slice(0,f)),n}function fromArrayLike(e){for(var t=e.length<0?0:0|checked(e.length),r=createBuffer(t),n=0;n<t;n+=1)r[n]=255&e[n];return r}function fromArrayBuffer(e,t,r){if(t<0||e.byteLength<t)throw new RangeError('"offset" is outside of buffer bounds');if(e.byteLength<t+(r||0))throw new RangeError('"length" is outside of buffer bounds');var n;return(n=void 0===t&&void 0===r?new Uint8Array(e):void 0===r?new Uint8Array(e,t):new Uint8Array(e,t,r)).__proto__=Buffer.prototype,n}function fromObject(e){if(Buffer.isBuffer(e)){var t=0|checked(e.length),r=createBuffer(t);return 0===r.length?r:(e.copy(r,0,0,t),r)}return void 0!==e.length?"number"!=typeof e.length||numberIsNaN(e.length)?createBuffer(0):fromArrayLike(e):"Buffer"===e.type&&Array.isArray(e.data)?fromArrayLike(e.data):void 0}function checked(e){if(e>=K_MAX_LENGTH)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+K_MAX_LENGTH.toString(16)+" bytes");return 0|e}function SlowBuffer(e){return+e!=e&&(e=0),Buffer.alloc(+e)}function byteLength(e,t){if(Buffer.isBuffer(e))return e.length;if(ArrayBuffer.isView(e)||isInstance(e,ArrayBuffer))return e.byteLength;if("string"!=typeof e)throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type '+typeof e);var r=e.length,n=arguments.length>2&&!0===arguments[2];if(!n&&0===r)return 0;for(var f=!1;;)switch(t){case"ascii":case"latin1":case"binary":return r;case"utf8":case"utf-8":return utf8ToBytes(e).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*r;case"hex":return r>>>1;case"base64":return base64ToBytes(e).length;default:if(f)return n?-1:utf8ToBytes(e).length;t=(""+t).toLowerCase(),f=!0}}function slowToString(e,t,r){var n=!1;if((void 0===t||t<0)&&(t=0),t>this.length)return"";if((void 0===r||r>this.length)&&(r=this.length),r<=0)return"";if((r>>>=0)<=(t>>>=0))return"";for(e||(e="utf8");;)switch(e){case"hex":return hexSlice(this,t,r);case"utf8":case"utf-8":return utf8Slice(this,t,r);case"ascii":return asciiSlice(this,t,r);case"latin1":case"binary":return latin1Slice(this,t,r);case"base64":return base64Slice(this,t,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return utf16leSlice(this,t,r);default:if(n)throw new TypeError("Unknown encoding: "+e);e=(e+"").toLowerCase(),n=!0}}function swap(e,t,r){var n=e[t];e[t]=e[r],e[r]=n}function bidirectionalIndexOf(e,t,r,n,f){if(0===e.length)return-1;if("string"==typeof r?(n=r,r=0):r>2147483647?r=2147483647:r<-2147483648&&(r=-2147483648),numberIsNaN(r=+r)&&(r=f?0:e.length-1),r<0&&(r=e.length+r),r>=e.length){if(f)return-1;r=e.length-1}else if(r<0){if(!f)return-1;r=0}if("string"==typeof t&&(t=Buffer.from(t,n)),Buffer.isBuffer(t))return 0===t.length?-1:arrayIndexOf(e,t,r,n,f);if("number"==typeof t)return t&=255,"function"==typeof Uint8Array.prototype.indexOf?f?Uint8Array.prototype.indexOf.call(e,t,r):Uint8Array.prototype.lastIndexOf.call(e,t,r):arrayIndexOf(e,[t],r,n,f);throw new TypeError("val must be string, number or Buffer")}function arrayIndexOf(e,t,r,n,f){var i,o=1,u=e.length,s=t.length;if(void 0!==n&&("ucs2"===(n=String(n).toLowerCase())||"ucs-2"===n||"utf16le"===n||"utf-16le"===n)){if(e.length<2||t.length<2)return-1;o=2,u/=2,s/=2,r/=2}function a(e,t){return 1===o?e[t]:e.readUInt16BE(t*o)}if(f){var h=-1;for(i=r;i<u;i++)if(a(e,i)===a(t,-1===h?0:i-h)){if(-1===h&&(h=i),i-h+1===s)return h*o}else-1!==h&&(i-=i-h),h=-1}else for(r+s>u&&(r=u-s),i=r;i>=0;i--){for(var c=!0,l=0;l<s;l++)if(a(e,i+l)!==a(t,l)){c=!1;break}if(c)return i}return-1}function hexWrite(e,t,r,n){r=Number(r)||0;var f=e.length-r;n?(n=Number(n))>f&&(n=f):n=f;var i=t.length;n>i/2&&(n=i/2);for(var o=0;o<n;++o){var u=parseInt(t.substr(2*o,2),16);if(numberIsNaN(u))return o;e[r+o]=u}return o}function utf8Write(e,t,r,n){return blitBuffer(utf8ToBytes(t,e.length-r),e,r,n)}function asciiWrite(e,t,r,n){return blitBuffer(asciiToBytes(t),e,r,n)}function latin1Write(e,t,r,n){return asciiWrite(e,t,r,n)}function base64Write(e,t,r,n){return blitBuffer(base64ToBytes(t),e,r,n)}function ucs2Write(e,t,r,n){return blitBuffer(utf16leToBytes(t,e.length-r),e,r,n)}function base64Slice(e,t,r){return 0===t&&r===e.length?base64.fromByteArray(e):base64.fromByteArray(e.slice(t,r))}function utf8Slice(e,t,r){r=Math.min(e.length,r);for(var n=[],f=t;f<r;){var i,o,u,s,a=e[f],h=null,c=a>239?4:a>223?3:a>191?2:1;if(f+c<=r)switch(c){case 1:a<128&&(h=a);break;case 2:128==(192&(i=e[f+1]))&&(s=(31&a)<<6|63&i)>127&&(h=s);break;case 3:i=e[f+1],o=e[f+2],128==(192&i)&&128==(192&o)&&(s=(15&a)<<12|(63&i)<<6|63&o)>2047&&(s<55296||s>57343)&&(h=s);break;case 4:i=e[f+1],o=e[f+2],u=e[f+3],128==(192&i)&&128==(192&o)&&128==(192&u)&&(s=(15&a)<<18|(63&i)<<12|(63&o)<<6|63&u)>65535&&s<1114112&&(h=s)}null===h?(h=65533,c=1):h>65535&&(h-=65536,n.push(h>>>10&1023|55296),h=56320|1023&h),n.push(h),f+=c}return decodeCodePointsArray(n)}exports.kMaxLength=K_MAX_LENGTH,Buffer.TYPED_ARRAY_SUPPORT=typedArraySupport(),Buffer.TYPED_ARRAY_SUPPORT||"undefined"==typeof console||"function"!=typeof console.error||console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."),Object.defineProperty(Buffer.prototype,"parent",{enumerable:!0,get:function(){if(Buffer.isBuffer(this))return this.buffer}}),Object.defineProperty(Buffer.prototype,"offset",{enumerable:!0,get:function(){if(Buffer.isBuffer(this))return this.byteOffset}}),"undefined"!=typeof Symbol&&null!=Symbol.species&&Buffer[Symbol.species]===Buffer&&Object.defineProperty(Buffer,Symbol.species,{value:null,configurable:!0,enumerable:!1,writable:!1}),Buffer.poolSize=8192,Buffer.from=function(e,t,r){return from(e,t,r)},Buffer.prototype.__proto__=Uint8Array.prototype,Buffer.__proto__=Uint8Array,Buffer.alloc=function(e,t,r){return alloc(e,t,r)},Buffer.allocUnsafe=function(e){return allocUnsafe(e)},Buffer.allocUnsafeSlow=function(e){return allocUnsafe(e)},Buffer.isBuffer=function(e){return null!=e&&!0===e._isBuffer&&e!==Buffer.prototype},Buffer.compare=function(e,t){if(isInstance(e,Uint8Array)&&(e=Buffer.from(e,e.offset,e.byteLength)),isInstance(t,Uint8Array)&&(t=Buffer.from(t,t.offset,t.byteLength)),!Buffer.isBuffer(e)||!Buffer.isBuffer(t))throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(e===t)return 0;for(var r=e.length,n=t.length,f=0,i=Math.min(r,n);f<i;++f)if(e[f]!==t[f]){r=e[f],n=t[f];break}return r<n?-1:n<r?1:0},Buffer.isEncoding=function(e){switch(String(e).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},Buffer.concat=function(e,t){if(!Array.isArray(e))throw new TypeError('"list" argument must be an Array of Buffers');if(0===e.length)return Buffer.alloc(0);var r;if(void 0===t)for(t=0,r=0;r<e.length;++r)t+=e[r].length;var n=Buffer.allocUnsafe(t),f=0;for(r=0;r<e.length;++r){var i=e[r];if(isInstance(i,Uint8Array)&&(i=Buffer.from(i)),!Buffer.isBuffer(i))throw new TypeError('"list" argument must be an Array of Buffers');i.copy(n,f),f+=i.length}return n},Buffer.byteLength=byteLength,Buffer.prototype._isBuffer=!0,Buffer.prototype.swap16=function(){var e=this.length;if(e%2!=0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(var t=0;t<e;t+=2)swap(this,t,t+1);return this},Buffer.prototype.swap32=function(){var e=this.length;if(e%4!=0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(var t=0;t<e;t+=4)swap(this,t,t+3),swap(this,t+1,t+2);return this},Buffer.prototype.swap64=function(){var e=this.length;if(e%8!=0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(var t=0;t<e;t+=8)swap(this,t,t+7),swap(this,t+1,t+6),swap(this,t+2,t+5),swap(this,t+3,t+4);return this},Buffer.prototype.toString=function(){var e=this.length;return 0===e?"":0===arguments.length?utf8Slice(this,0,e):slowToString.apply(this,arguments)},Buffer.prototype.toLocaleString=Buffer.prototype.toString,Buffer.prototype.equals=function(e){if(!Buffer.isBuffer(e))throw new TypeError("Argument must be a Buffer");return this===e||0===Buffer.compare(this,e)},Buffer.prototype.inspect=function(){var e="",t=exports.INSPECT_MAX_BYTES;return e=this.toString("hex",0,t).replace(/(.{2})/g,"$1 ").trim(),this.length>t&&(e+=" ... "),"<Buffer "+e+">"},Buffer.prototype.compare=function(e,t,r,n,f){if(isInstance(e,Uint8Array)&&(e=Buffer.from(e,e.offset,e.byteLength)),!Buffer.isBuffer(e))throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type '+typeof e);if(void 0===t&&(t=0),void 0===r&&(r=e?e.length:0),void 0===n&&(n=0),void 0===f&&(f=this.length),t<0||r>e.length||n<0||f>this.length)throw new RangeError("out of range index");if(n>=f&&t>=r)return 0;if(n>=f)return-1;if(t>=r)return 1;if(this===e)return 0;for(var i=(f>>>=0)-(n>>>=0),o=(r>>>=0)-(t>>>=0),u=Math.min(i,o),s=this.slice(n,f),a=e.slice(t,r),h=0;h<u;++h)if(s[h]!==a[h]){i=s[h],o=a[h];break}return i<o?-1:o<i?1:0},Buffer.prototype.includes=function(e,t,r){return-1!==this.indexOf(e,t,r)},Buffer.prototype.indexOf=function(e,t,r){return bidirectionalIndexOf(this,e,t,r,!0)},Buffer.prototype.lastIndexOf=function(e,t,r){return bidirectionalIndexOf(this,e,t,r,!1)},Buffer.prototype.write=function(e,t,r,n){if(void 0===t)n="utf8",r=this.length,t=0;else if(void 0===r&&"string"==typeof t)n=t,r=this.length,t=0;else{if(!isFinite(t))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");t>>>=0,isFinite(r)?(r>>>=0,void 0===n&&(n="utf8")):(n=r,r=void 0)}var f=this.length-t;if((void 0===r||r>f)&&(r=f),e.length>0&&(r<0||t<0)||t>this.length)throw new RangeError("Attempt to write outside buffer bounds");n||(n="utf8");for(var i=!1;;)switch(n){case"hex":return hexWrite(this,e,t,r);case"utf8":case"utf-8":return utf8Write(this,e,t,r);case"ascii":return asciiWrite(this,e,t,r);case"latin1":case"binary":return latin1Write(this,e,t,r);case"base64":return base64Write(this,e,t,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return ucs2Write(this,e,t,r);default:if(i)throw new TypeError("Unknown encoding: "+n);n=(""+n).toLowerCase(),i=!0}},Buffer.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};var MAX_ARGUMENTS_LENGTH=4096;function decodeCodePointsArray(e){var t=e.length;if(t<=MAX_ARGUMENTS_LENGTH)return String.fromCharCode.apply(String,e);for(var r="",n=0;n<t;)r+=String.fromCharCode.apply(String,e.slice(n,n+=MAX_ARGUMENTS_LENGTH));return r}function asciiSlice(e,t,r){var n="";r=Math.min(e.length,r);for(var f=t;f<r;++f)n+=String.fromCharCode(127&e[f]);return n}function latin1Slice(e,t,r){var n="";r=Math.min(e.length,r);for(var f=t;f<r;++f)n+=String.fromCharCode(e[f]);return n}function hexSlice(e,t,r){var n=e.length;(!t||t<0)&&(t=0),(!r||r<0||r>n)&&(r=n);for(var f="",i=t;i<r;++i)f+=toHex(e[i]);return f}function utf16leSlice(e,t,r){for(var n=e.slice(t,r),f="",i=0;i<n.length;i+=2)f+=String.fromCharCode(n[i]+256*n[i+1]);return f}function checkOffset(e,t,r){if(e%1!=0||e<0)throw new RangeError("offset is not uint");if(e+t>r)throw new RangeError("Trying to access beyond buffer length")}function checkInt(e,t,r,n,f,i){if(!Buffer.isBuffer(e))throw new TypeError('"buffer" argument must be a Buffer instance');if(t>f||t<i)throw new RangeError('"value" argument is out of bounds');if(r+n>e.length)throw new RangeError("Index out of range")}function checkIEEE754(e,t,r,n,f,i){if(r+n>e.length)throw new RangeError("Index out of range");if(r<0)throw new RangeError("Index out of range")}function writeFloat(e,t,r,n,f){return t=+t,r>>>=0,f||checkIEEE754(e,t,r,4,3.4028234663852886e38,-3.4028234663852886e38),ieee754.write(e,t,r,n,23,4),r+4}function writeDouble(e,t,r,n,f){return t=+t,r>>>=0,f||checkIEEE754(e,t,r,8,1.7976931348623157e308,-1.7976931348623157e308),ieee754.write(e,t,r,n,52,8),r+8}Buffer.prototype.slice=function(e,t){var r=this.length;(e=~~e)<0?(e+=r)<0&&(e=0):e>r&&(e=r),(t=void 0===t?r:~~t)<0?(t+=r)<0&&(t=0):t>r&&(t=r),t<e&&(t=e);var n=this.subarray(e,t);return n.__proto__=Buffer.prototype,n},Buffer.prototype.readUIntLE=function(e,t,r){e>>>=0,t>>>=0,r||checkOffset(e,t,this.length);for(var n=this[e],f=1,i=0;++i<t&&(f*=256);)n+=this[e+i]*f;return n},Buffer.prototype.readUIntBE=function(e,t,r){e>>>=0,t>>>=0,r||checkOffset(e,t,this.length);for(var n=this[e+--t],f=1;t>0&&(f*=256);)n+=this[e+--t]*f;return n},Buffer.prototype.readUInt8=function(e,t){return e>>>=0,t||checkOffset(e,1,this.length),this[e]},Buffer.prototype.readUInt16LE=function(e,t){return e>>>=0,t||checkOffset(e,2,this.length),this[e]|this[e+1]<<8},Buffer.prototype.readUInt16BE=function(e,t){return e>>>=0,t||checkOffset(e,2,this.length),this[e]<<8|this[e+1]},Buffer.prototype.readUInt32LE=function(e,t){return e>>>=0,t||checkOffset(e,4,this.length),(this[e]|this[e+1]<<8|this[e+2]<<16)+16777216*this[e+3]},Buffer.prototype.readUInt32BE=function(e,t){return e>>>=0,t||checkOffset(e,4,this.length),16777216*this[e]+(this[e+1]<<16|this[e+2]<<8|this[e+3])},Buffer.prototype.readIntLE=function(e,t,r){e>>>=0,t>>>=0,r||checkOffset(e,t,this.length);for(var n=this[e],f=1,i=0;++i<t&&(f*=256);)n+=this[e+i]*f;return n>=(f*=128)&&(n-=Math.pow(2,8*t)),n},Buffer.prototype.readIntBE=function(e,t,r){e>>>=0,t>>>=0,r||checkOffset(e,t,this.length);for(var n=t,f=1,i=this[e+--n];n>0&&(f*=256);)i+=this[e+--n]*f;return i>=(f*=128)&&(i-=Math.pow(2,8*t)),i},Buffer.prototype.readInt8=function(e,t){return e>>>=0,t||checkOffset(e,1,this.length),128&this[e]?-1*(255-this[e]+1):this[e]},Buffer.prototype.readInt16LE=function(e,t){e>>>=0,t||checkOffset(e,2,this.length);var r=this[e]|this[e+1]<<8;return 32768&r?4294901760|r:r},Buffer.prototype.readInt16BE=function(e,t){e>>>=0,t||checkOffset(e,2,this.length);var r=this[e+1]|this[e]<<8;return 32768&r?4294901760|r:r},Buffer.prototype.readInt32LE=function(e,t){return e>>>=0,t||checkOffset(e,4,this.length),this[e]|this[e+1]<<8|this[e+2]<<16|this[e+3]<<24},Buffer.prototype.readInt32BE=function(e,t){return e>>>=0,t||checkOffset(e,4,this.length),this[e]<<24|this[e+1]<<16|this[e+2]<<8|this[e+3]},Buffer.prototype.readFloatLE=function(e,t){return e>>>=0,t||checkOffset(e,4,this.length),ieee754.read(this,e,!0,23,4)},Buffer.prototype.readFloatBE=function(e,t){return e>>>=0,t||checkOffset(e,4,this.length),ieee754.read(this,e,!1,23,4)},Buffer.prototype.readDoubleLE=function(e,t){return e>>>=0,t||checkOffset(e,8,this.length),ieee754.read(this,e,!0,52,8)},Buffer.prototype.readDoubleBE=function(e,t){return e>>>=0,t||checkOffset(e,8,this.length),ieee754.read(this,e,!1,52,8)},Buffer.prototype.writeUIntLE=function(e,t,r,n){(e=+e,t>>>=0,r>>>=0,n)||checkInt(this,e,t,r,Math.pow(2,8*r)-1,0);var f=1,i=0;for(this[t]=255&e;++i<r&&(f*=256);)this[t+i]=e/f&255;return t+r},Buffer.prototype.writeUIntBE=function(e,t,r,n){(e=+e,t>>>=0,r>>>=0,n)||checkInt(this,e,t,r,Math.pow(2,8*r)-1,0);var f=r-1,i=1;for(this[t+f]=255&e;--f>=0&&(i*=256);)this[t+f]=e/i&255;return t+r},Buffer.prototype.writeUInt8=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,1,255,0),this[t]=255&e,t+1},Buffer.prototype.writeUInt16LE=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,2,65535,0),this[t]=255&e,this[t+1]=e>>>8,t+2},Buffer.prototype.writeUInt16BE=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,2,65535,0),this[t]=e>>>8,this[t+1]=255&e,t+2},Buffer.prototype.writeUInt32LE=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,4,4294967295,0),this[t+3]=e>>>24,this[t+2]=e>>>16,this[t+1]=e>>>8,this[t]=255&e,t+4},Buffer.prototype.writeUInt32BE=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,4,4294967295,0),this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e,t+4},Buffer.prototype.writeIntLE=function(e,t,r,n){if(e=+e,t>>>=0,!n){var f=Math.pow(2,8*r-1);checkInt(this,e,t,r,f-1,-f)}var i=0,o=1,u=0;for(this[t]=255&e;++i<r&&(o*=256);)e<0&&0===u&&0!==this[t+i-1]&&(u=1),this[t+i]=(e/o>>0)-u&255;return t+r},Buffer.prototype.writeIntBE=function(e,t,r,n){if(e=+e,t>>>=0,!n){var f=Math.pow(2,8*r-1);checkInt(this,e,t,r,f-1,-f)}var i=r-1,o=1,u=0;for(this[t+i]=255&e;--i>=0&&(o*=256);)e<0&&0===u&&0!==this[t+i+1]&&(u=1),this[t+i]=(e/o>>0)-u&255;return t+r},Buffer.prototype.writeInt8=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,1,127,-128),e<0&&(e=255+e+1),this[t]=255&e,t+1},Buffer.prototype.writeInt16LE=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,2,32767,-32768),this[t]=255&e,this[t+1]=e>>>8,t+2},Buffer.prototype.writeInt16BE=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,2,32767,-32768),this[t]=e>>>8,this[t+1]=255&e,t+2},Buffer.prototype.writeInt32LE=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,4,2147483647,-2147483648),this[t]=255&e,this[t+1]=e>>>8,this[t+2]=e>>>16,this[t+3]=e>>>24,t+4},Buffer.prototype.writeInt32BE=function(e,t,r){return e=+e,t>>>=0,r||checkInt(this,e,t,4,2147483647,-2147483648),e<0&&(e=4294967295+e+1),this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e,t+4},Buffer.prototype.writeFloatLE=function(e,t,r){return writeFloat(this,e,t,!0,r)},Buffer.prototype.writeFloatBE=function(e,t,r){return writeFloat(this,e,t,!1,r)},Buffer.prototype.writeDoubleLE=function(e,t,r){return writeDouble(this,e,t,!0,r)},Buffer.prototype.writeDoubleBE=function(e,t,r){return writeDouble(this,e,t,!1,r)},Buffer.prototype.copy=function(e,t,r,n){if(!Buffer.isBuffer(e))throw new TypeError("argument should be a Buffer");if(r||(r=0),n||0===n||(n=this.length),t>=e.length&&(t=e.length),t||(t=0),n>0&&n<r&&(n=r),n===r)return 0;if(0===e.length||0===this.length)return 0;if(t<0)throw new RangeError("targetStart out of bounds");if(r<0||r>=this.length)throw new RangeError("Index out of range");if(n<0)throw new RangeError("sourceEnd out of bounds");n>this.length&&(n=this.length),e.length-t<n-r&&(n=e.length-t+r);var f=n-r;if(this===e&&"function"==typeof Uint8Array.prototype.copyWithin)this.copyWithin(t,r,n);else if(this===e&&r<t&&t<n)for(var i=f-1;i>=0;--i)e[i+t]=this[i+r];else Uint8Array.prototype.set.call(e,this.subarray(r,n),t);return f},Buffer.prototype.fill=function(e,t,r,n){if("string"==typeof e){if("string"==typeof t?(n=t,t=0,r=this.length):"string"==typeof r&&(n=r,r=this.length),void 0!==n&&"string"!=typeof n)throw new TypeError("encoding must be a string");if("string"==typeof n&&!Buffer.isEncoding(n))throw new TypeError("Unknown encoding: "+n);if(1===e.length){var f=e.charCodeAt(0);("utf8"===n&&f<128||"latin1"===n)&&(e=f)}}else"number"==typeof e&&(e&=255);if(t<0||this.length<t||this.length<r)throw new RangeError("Out of range index");if(r<=t)return this;var i;if(t>>>=0,r=void 0===r?this.length:r>>>0,e||(e=0),"number"==typeof e)for(i=t;i<r;++i)this[i]=e;else{var o=Buffer.isBuffer(e)?e:Buffer.from(e,n),u=o.length;if(0===u)throw new TypeError('The value "'+e+'" is invalid for argument "value"');for(i=0;i<r-t;++i)this[i+t]=o[i%u]}return this};var INVALID_BASE64_RE=/[^+\/0-9A-Za-z-_]/g;function base64clean(e){if((e=(e=e.split("=")[0]).trim().replace(INVALID_BASE64_RE,"")).length<2)return"";for(;e.length%4!=0;)e+="=";return e}function toHex(e){return e<16?"0"+e.toString(16):e.toString(16)}function utf8ToBytes(e,t){var r;t=t||1/0;for(var n=e.length,f=null,i=[],o=0;o<n;++o){if((r=e.charCodeAt(o))>55295&&r<57344){if(!f){if(r>56319){(t-=3)>-1&&i.push(239,191,189);continue}if(o+1===n){(t-=3)>-1&&i.push(239,191,189);continue}f=r;continue}if(r<56320){(t-=3)>-1&&i.push(239,191,189),f=r;continue}r=65536+(f-55296<<10|r-56320)}else f&&(t-=3)>-1&&i.push(239,191,189);if(f=null,r<128){if((t-=1)<0)break;i.push(r)}else if(r<2048){if((t-=2)<0)break;i.push(r>>6|192,63&r|128)}else if(r<65536){if((t-=3)<0)break;i.push(r>>12|224,r>>6&63|128,63&r|128)}else{if(!(r<1114112))throw new Error("Invalid code point");if((t-=4)<0)break;i.push(r>>18|240,r>>12&63|128,r>>6&63|128,63&r|128)}}return i}function asciiToBytes(e){for(var t=[],r=0;r<e.length;++r)t.push(255&e.charCodeAt(r));return t}function utf16leToBytes(e,t){for(var r,n,f,i=[],o=0;o<e.length&&!((t-=2)<0);++o)n=(r=e.charCodeAt(o))>>8,f=r%256,i.push(f),i.push(n);return i}function base64ToBytes(e){return base64.toByteArray(base64clean(e))}function blitBuffer(e,t,r,n){for(var f=0;f<n&&!(f+r>=t.length||f>=e.length);++f)t[f+r]=e[f];return f}function isInstance(e,t){return e instanceof t||null!=e&&null!=e.constructor&&null!=e.constructor.name&&e.constructor.name===t.name}function numberIsNaN(e){return e!=e}},{"base64-js":20,ieee754:30}],24:[function(require,module,exports){module.exports={100:"Continue",101:"Switching Protocols",102:"Processing",200:"OK",201:"Created",202:"Accepted",203:"Non-Authoritative Information",204:"No Content",205:"Reset Content",206:"Partial Content",207:"Multi-Status",208:"Already Reported",226:"IM Used",300:"Multiple Choices",301:"Moved Permanently",302:"Found",303:"See Other",304:"Not Modified",305:"Use Proxy",307:"Temporary Redirect",308:"Permanent Redirect",400:"Bad Request",401:"Unauthorized",402:"Payment Required",403:"Forbidden",404:"Not Found",405:"Method Not Allowed",406:"Not Acceptable",407:"Proxy Authentication Required",408:"Request Timeout",409:"Conflict",410:"Gone",411:"Length Required",412:"Precondition Failed",413:"Payload Too Large",414:"URI Too Long",415:"Unsupported Media Type",416:"Range Not Satisfiable",417:"Expectation Failed",418:"I'm a teapot",421:"Misdirected Request",422:"Unprocessable Entity",423:"Locked",424:"Failed Dependency",425:"Unordered Collection",426:"Upgrade Required",428:"Precondition Required",429:"Too Many Requests",431:"Request Header Fields Too Large",451:"Unavailable For Legal Reasons",500:"Internal Server Error",501:"Not Implemented",502:"Bad Gateway",503:"Service Unavailable",504:"Gateway Timeout",505:"HTTP Version Not Supported",506:"Variant Also Negotiates",507:"Insufficient Storage",508:"Loop Detected",509:"Bandwidth Limit Exceeded",510:"Not Extended",511:"Network Authentication Required"}},{}],25:[function(require,module,exports){(function(process,global){"use strict";var next=global.process&&process.nextTick||global.setImmediate||function(n){setTimeout(n,0)};module.exports=function(n,t){return n?void t.then(function(t){next(function(){n(null,t)})},function(t){next(function(){n(t)})}):t}}).call(this,require("_process"),typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{_process:66}],26:[function(require,module,exports){(function(Buffer){function isArray(r){return Array.isArray?Array.isArray(r):"[object Array]"===objectToString(r)}function isBoolean(r){return"boolean"==typeof r}function isNull(r){return null===r}function isNullOrUndefined(r){return null==r}function isNumber(r){return"number"==typeof r}function isString(r){return"string"==typeof r}function isSymbol(r){return"symbol"==typeof r}function isUndefined(r){return void 0===r}function isRegExp(r){return"[object RegExp]"===objectToString(r)}function isObject(r){return"object"==typeof r&&null!==r}function isDate(r){return"[object Date]"===objectToString(r)}function isError(r){return"[object Error]"===objectToString(r)||r instanceof Error}function isFunction(r){return"function"==typeof r}function isPrimitive(r){return null===r||"boolean"==typeof r||"number"==typeof r||"string"==typeof r||"symbol"==typeof r||void 0===r}function objectToString(r){return Object.prototype.toString.call(r)}exports.isArray=isArray,exports.isBoolean=isBoolean,exports.isNull=isNull,exports.isNullOrUndefined=isNullOrUndefined,exports.isNumber=isNumber,exports.isString=isString,exports.isSymbol=isSymbol,exports.isUndefined=isUndefined,exports.isRegExp=isRegExp,exports.isObject=isObject,exports.isDate=isDate,exports.isError=isError,exports.isFunction=isFunction,exports.isPrimitive=isPrimitive,exports.isBuffer=Buffer.isBuffer}).call(this,{isBuffer:require("../../is-buffer/index.js")})},{"../../is-buffer/index.js":32}],27:[function(require,module,exports){var objectCreate=Object.create||objectCreatePolyfill,objectKeys=Object.keys||objectKeysPolyfill,bind=Function.prototype.bind||functionBindPolyfill;function EventEmitter(){this._events&&Object.prototype.hasOwnProperty.call(this,"_events")||(this._events=objectCreate(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0}module.exports=EventEmitter,EventEmitter.EventEmitter=EventEmitter,EventEmitter.prototype._events=void 0,EventEmitter.prototype._maxListeners=void 0;var hasDefineProperty,defaultMaxListeners=10;try{var o={};Object.defineProperty&&Object.defineProperty(o,"x",{value:0}),hasDefineProperty=0===o.x}catch(e){hasDefineProperty=!1}function $getMaxListeners(e){return void 0===e._maxListeners?EventEmitter.defaultMaxListeners:e._maxListeners}function emitNone(e,t,n){if(t)e.call(n);else for(var r=e.length,i=arrayClone(e,r),s=0;s<r;++s)i[s].call(n)}function emitOne(e,t,n,r){if(t)e.call(n,r);else for(var i=e.length,s=arrayClone(e,i),o=0;o<i;++o)s[o].call(n,r)}function emitTwo(e,t,n,r,i){if(t)e.call(n,r,i);else for(var s=e.length,o=arrayClone(e,s),a=0;a<s;++a)o[a].call(n,r,i)}function emitThree(e,t,n,r,i,s){if(t)e.call(n,r,i,s);else for(var o=e.length,a=arrayClone(e,o),l=0;l<o;++l)a[l].call(n,r,i,s)}function emitMany(e,t,n,r){if(t)e.apply(n,r);else for(var i=e.length,s=arrayClone(e,i),o=0;o<i;++o)s[o].apply(n,r)}function _addListener(e,t,n,r){var i,s,o;if("function"!=typeof n)throw new TypeError('"listener" argument must be a function');if((s=e._events)?(s.newListener&&(e.emit("newListener",t,n.listener?n.listener:n),s=e._events),o=s[t]):(s=e._events=objectCreate(null),e._eventsCount=0),o){if("function"==typeof o?o=s[t]=r?[n,o]:[o,n]:r?o.unshift(n):o.push(n),!o.warned&&(i=$getMaxListeners(e))&&i>0&&o.length>i){o.warned=!0;var a=new Error("Possible EventEmitter memory leak detected. "+o.length+' "'+String(t)+'" listeners added. Use emitter.setMaxListeners() to increase limit.');a.name="MaxListenersExceededWarning",a.emitter=e,a.type=t,a.count=o.length,"object"==typeof console&&console.warn&&console.warn("%s: %s",a.name,a.message)}}else o=s[t]=n,++e._eventsCount;return e}function onceWrapper(){if(!this.fired)switch(this.target.removeListener(this.type,this.wrapFn),this.fired=!0,arguments.length){case 0:return this.listener.call(this.target);case 1:return this.listener.call(this.target,arguments[0]);case 2:return this.listener.call(this.target,arguments[0],arguments[1]);case 3:return this.listener.call(this.target,arguments[0],arguments[1],arguments[2]);default:for(var e=new Array(arguments.length),t=0;t<e.length;++t)e[t]=arguments[t];this.listener.apply(this.target,e)}}function _onceWrap(e,t,n){var r={fired:!1,wrapFn:void 0,target:e,type:t,listener:n},i=bind.call(onceWrapper,r);return i.listener=n,r.wrapFn=i,i}function _listeners(e,t,n){var r=e._events;if(!r)return[];var i=r[t];return i?"function"==typeof i?n?[i.listener||i]:[i]:n?unwrapListeners(i):arrayClone(i,i.length):[]}function listenerCount(e){var t=this._events;if(t){var n=t[e];if("function"==typeof n)return 1;if(n)return n.length}return 0}function spliceOne(e,t){for(var n=t,r=n+1,i=e.length;r<i;n+=1,r+=1)e[n]=e[r];e.pop()}function arrayClone(e,t){for(var n=new Array(t),r=0;r<t;++r)n[r]=e[r];return n}function unwrapListeners(e){for(var t=new Array(e.length),n=0;n<t.length;++n)t[n]=e[n].listener||e[n];return t}function objectCreatePolyfill(e){var t=function(){};return t.prototype=e,new t}function objectKeysPolyfill(e){var t=[];for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.push(n);return n}function functionBindPolyfill(e){var t=this;return function(){return t.apply(e,arguments)}}hasDefineProperty?Object.defineProperty(EventEmitter,"defaultMaxListeners",{enumerable:!0,get:function(){return defaultMaxListeners},set:function(e){if("number"!=typeof e||e<0||e!=e)throw new TypeError('"defaultMaxListeners" must be a positive number');defaultMaxListeners=e}}):EventEmitter.defaultMaxListeners=defaultMaxListeners,EventEmitter.prototype.setMaxListeners=function(e){if("number"!=typeof e||e<0||isNaN(e))throw new TypeError('"n" argument must be a positive number');return this._maxListeners=e,this},EventEmitter.prototype.getMaxListeners=function(){return $getMaxListeners(this)},EventEmitter.prototype.emit=function(e){var t,n,r,i,s,o,a="error"===e;if(o=this._events)a=a&&null==o.error;else if(!a)return!1;if(a){if(arguments.length>1&&(t=arguments[1]),t instanceof Error)throw t;var l=new Error('Unhandled "error" event. ('+t+")");throw l.context=t,l}if(!(n=o[e]))return!1;var u="function"==typeof n;switch(r=arguments.length){case 1:emitNone(n,u,this);break;case 2:emitOne(n,u,this,arguments[1]);break;case 3:emitTwo(n,u,this,arguments[1],arguments[2]);break;case 4:emitThree(n,u,this,arguments[1],arguments[2],arguments[3]);break;default:for(i=new Array(r-1),s=1;s<r;s++)i[s-1]=arguments[s];emitMany(n,u,this,i)}return!0},EventEmitter.prototype.addListener=function(e,t){return _addListener(this,e,t,!1)},EventEmitter.prototype.on=EventEmitter.prototype.addListener,EventEmitter.prototype.prependListener=function(e,t){return _addListener(this,e,t,!0)},EventEmitter.prototype.once=function(e,t){if("function"!=typeof t)throw new TypeError('"listener" argument must be a function');return this.on(e,_onceWrap(this,e,t)),this},EventEmitter.prototype.prependOnceListener=function(e,t){if("function"!=typeof t)throw new TypeError('"listener" argument must be a function');return this.prependListener(e,_onceWrap(this,e,t)),this},EventEmitter.prototype.removeListener=function(e,t){var n,r,i,s,o;if("function"!=typeof t)throw new TypeError('"listener" argument must be a function');if(!(r=this._events))return this;if(!(n=r[e]))return this;if(n===t||n.listener===t)0==--this._eventsCount?this._events=objectCreate(null):(delete r[e],r.removeListener&&this.emit("removeListener",e,n.listener||t));else if("function"!=typeof n){for(i=-1,s=n.length-1;s>=0;s--)if(n[s]===t||n[s].listener===t){o=n[s].listener,i=s;break}if(i<0)return this;0===i?n.shift():spliceOne(n,i),1===n.length&&(r[e]=n[0]),r.removeListener&&this.emit("removeListener",e,o||t)}return this},EventEmitter.prototype.removeAllListeners=function(e){var t,n,r;if(!(n=this._events))return this;if(!n.removeListener)return 0===arguments.length?(this._events=objectCreate(null),this._eventsCount=0):n[e]&&(0==--this._eventsCount?this._events=objectCreate(null):delete n[e]),this;if(0===arguments.length){var i,s=objectKeys(n);for(r=0;r<s.length;++r)"removeListener"!==(i=s[r])&&this.removeAllListeners(i);return this.removeAllListeners("removeListener"),this._events=objectCreate(null),this._eventsCount=0,this}if("function"==typeof(t=n[e]))this.removeListener(e,t);else if(t)for(r=t.length-1;r>=0;r--)this.removeListener(e,t[r]);return this},EventEmitter.prototype.listeners=function(e){return _listeners(this,e,!0)},EventEmitter.prototype.rawListeners=function(e){return _listeners(this,e,!1)},EventEmitter.listenerCount=function(e,t){return"function"==typeof e.listenerCount?e.listenerCount(t):listenerCount.call(e,t)},EventEmitter.prototype.listenerCount=listenerCount,EventEmitter.prototype.eventNames=function(){return this._eventsCount>0?Reflect.ownKeys(this._events):[]}},{}],28:[function(require,module,exports){function format(e){var r=Array.prototype.slice.call(arguments,1);return r.length&&(e=e.replace(/(%?)(%([jds]))/g,function(e,t,a,n){var s=r.shift();switch(n){case"s":s=""+s;break;case"d":s=Number(s);break;case"j":s=JSON.stringify(s)}return t?(r.unshift(s),e):s})),r.length&&(e+=" "+r.join(" ")),""+(e=e.replace(/%{2,2}/g,"%"))}module.exports=format},{}],29:[function(require,module,exports){var http=require("http"),url=require("url"),https=module.exports;for(var key in http)http.hasOwnProperty(key)&&(https[key]=http[key]);function validateParams(t){if("string"==typeof t&&(t=url.parse(t)),t.protocol||(t.protocol="https:"),"https:"!==t.protocol)throw new Error('Protocol "'+t.protocol+'" not supported. Expected "https:"');return t}https.request=function(t,r){return t=validateParams(t),http.request.call(this,t,r)},https.get=function(t,r){return t=validateParams(t),http.get.call(this,t,r)}},{http:80,url:87}],30:[function(require,module,exports){exports.read=function(a,o,t,r,h){var M,p,w=8*h-r-1,f=(1<<w)-1,e=f>>1,i=-7,N=t?h-1:0,n=t?-1:1,s=a[o+N];for(N+=n,M=s&(1<<-i)-1,s>>=-i,i+=w;i>0;M=256*M+a[o+N],N+=n,i-=8);for(p=M&(1<<-i)-1,M>>=-i,i+=r;i>0;p=256*p+a[o+N],N+=n,i-=8);if(0===M)M=1-e;else{if(M===f)return p?NaN:1/0*(s?-1:1);p+=Math.pow(2,r),M-=e}return(s?-1:1)*p*Math.pow(2,M-r)},exports.write=function(a,o,t,r,h,M){var p,w,f,e=8*M-h-1,i=(1<<e)-1,N=i>>1,n=23===h?Math.pow(2,-24)-Math.pow(2,-77):0,s=r?0:M-1,u=r?1:-1,l=o<0||0===o&&1/o<0?1:0;for(o=Math.abs(o),isNaN(o)||o===1/0?(w=isNaN(o)?1:0,p=i):(p=Math.floor(Math.log(o)/Math.LN2),o*(f=Math.pow(2,-p))<1&&(p--,f*=2),(o+=p+N>=1?n/f:n*Math.pow(2,1-N))*f>=2&&(p++,f/=2),p+N>=i?(w=0,p=i):p+N>=1?(w=(o*f-1)*Math.pow(2,h),p+=N):(w=o*Math.pow(2,N-1)*Math.pow(2,h),p=0));h>=8;a[t+s]=255&w,s+=u,w/=256,h-=8);for(p=p<<h|w,e+=h;e>0;a[t+s]=255&p,s+=u,p/=256,e-=8);a[t+s-u]|=128*l}},{}],31:[function(require,module,exports){"function"==typeof Object.create?module.exports=function(t,e){t.super_=e,t.prototype=Object.create(e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}})}:module.exports=function(t,e){t.super_=e;var o=function(){};o.prototype=e.prototype,t.prototype=new o,t.prototype.constructor=t}},{}],32:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
function isBuffer(f){return!!f.constructor&&"function"==typeof f.constructor.isBuffer&&f.constructor.isBuffer(f)}function isSlowBuffer(f){return"function"==typeof f.readFloatLE&&"function"==typeof f.slice&&isBuffer(f.slice(0,0))}module.exports=function(f){return null!=f&&(isBuffer(f)||isSlowBuffer(f)||!!f._isBuffer)}},{}],33:[function(require,module,exports){var toString={}.toString;module.exports=Array.isArray||function(r){return"[object Array]"==toString.call(r)}},{}],34:[function(require,module,exports){"use strict";var yaml=require("./lib/js-yaml.js");module.exports=yaml},{"./lib/js-yaml.js":35}],35:[function(require,module,exports){"use strict";var loader=require("./js-yaml/loader"),dumper=require("./js-yaml/dumper");function deprecated(e){return function(){throw new Error("Function "+e+" is deprecated and cannot be used.")}}module.exports.Type=require("./js-yaml/type"),module.exports.Schema=require("./js-yaml/schema"),module.exports.FAILSAFE_SCHEMA=require("./js-yaml/schema/failsafe"),module.exports.JSON_SCHEMA=require("./js-yaml/schema/json"),module.exports.CORE_SCHEMA=require("./js-yaml/schema/core"),module.exports.DEFAULT_SAFE_SCHEMA=require("./js-yaml/schema/default_safe"),module.exports.DEFAULT_FULL_SCHEMA=require("./js-yaml/schema/default_full"),module.exports.load=loader.load,module.exports.loadAll=loader.loadAll,module.exports.safeLoad=loader.safeLoad,module.exports.safeLoadAll=loader.safeLoadAll,module.exports.dump=dumper.dump,module.exports.safeDump=dumper.safeDump,module.exports.YAMLException=require("./js-yaml/exception"),module.exports.MINIMAL_SCHEMA=require("./js-yaml/schema/failsafe"),module.exports.SAFE_SCHEMA=require("./js-yaml/schema/default_safe"),module.exports.DEFAULT_SCHEMA=require("./js-yaml/schema/default_full"),module.exports.scan=deprecated("scan"),module.exports.parse=deprecated("parse"),module.exports.compose=deprecated("compose"),module.exports.addConstructor=deprecated("addConstructor")},{"./js-yaml/dumper":37,"./js-yaml/exception":38,"./js-yaml/loader":39,"./js-yaml/schema":41,"./js-yaml/schema/core":42,"./js-yaml/schema/default_full":43,"./js-yaml/schema/default_safe":44,"./js-yaml/schema/failsafe":45,"./js-yaml/schema/json":46,"./js-yaml/type":47}],36:[function(require,module,exports){"use strict";function isNothing(e){return null==e}function isObject(e){return"object"==typeof e&&null!==e}function toArray(e){return Array.isArray(e)?e:isNothing(e)?[]:[e]}function extend(e,t){var r,o,n,i;if(t)for(r=0,o=(i=Object.keys(t)).length;r<o;r+=1)e[n=i[r]]=t[n];return e}function repeat(e,t){var r,o="";for(r=0;r<t;r+=1)o+=e;return o}function isNegativeZero(e){return 0===e&&Number.NEGATIVE_INFINITY===1/e}module.exports.isNothing=isNothing,module.exports.isObject=isObject,module.exports.toArray=toArray,module.exports.repeat=repeat,module.exports.isNegativeZero=isNegativeZero,module.exports.extend=extend},{}],37:[function(require,module,exports){"use strict";var common=require("./common"),YAMLException=require("./exception"),DEFAULT_FULL_SCHEMA=require("./schema/default_full"),DEFAULT_SAFE_SCHEMA=require("./schema/default_safe"),_toString=Object.prototype.toString,_hasOwnProperty=Object.prototype.hasOwnProperty,CHAR_TAB=9,CHAR_LINE_FEED=10,CHAR_SPACE=32,CHAR_EXCLAMATION=33,CHAR_DOUBLE_QUOTE=34,CHAR_SHARP=35,CHAR_PERCENT=37,CHAR_AMPERSAND=38,CHAR_SINGLE_QUOTE=39,CHAR_ASTERISK=42,CHAR_COMMA=44,CHAR_MINUS=45,CHAR_COLON=58,CHAR_GREATER_THAN=62,CHAR_QUESTION=63,CHAR_COMMERCIAL_AT=64,CHAR_LEFT_SQUARE_BRACKET=91,CHAR_RIGHT_SQUARE_BRACKET=93,CHAR_GRAVE_ACCENT=96,CHAR_LEFT_CURLY_BRACKET=123,CHAR_VERTICAL_LINE=124,CHAR_RIGHT_CURLY_BRACKET=125,ESCAPE_SEQUENCES={0:"\\0",7:"\\a",8:"\\b",9:"\\t",10:"\\n",11:"\\v",12:"\\f",13:"\\r",27:"\\e",34:'\\"',92:"\\\\",133:"\\N",160:"\\_",8232:"\\L",8233:"\\P"},DEPRECATED_BOOLEANS_SYNTAX=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"];function compileStyleMap(e,t){var n,i,r,o,a,l,s;if(null===t)return{};for(n={},r=0,o=(i=Object.keys(t)).length;r<o;r+=1)a=i[r],l=String(t[a]),"!!"===a.slice(0,2)&&(a="tag:yaml.org,2002:"+a.slice(2)),(s=e.compiledTypeMap.fallback[a])&&_hasOwnProperty.call(s.styleAliases,l)&&(l=s.styleAliases[l]),n[a]=l;return n}function encodeHex(e){var t,n,i;if(t=e.toString(16).toUpperCase(),e<=255)n="x",i=2;else if(e<=65535)n="u",i=4;else{if(!(e<=4294967295))throw new YAMLException("code point within a string may not be greater than 0xFFFFFFFF");n="U",i=8}return"\\"+n+common.repeat("0",i-t.length)+t}function State(e){this.schema=e.schema||DEFAULT_FULL_SCHEMA,this.indent=Math.max(1,e.indent||2),this.noArrayIndent=e.noArrayIndent||!1,this.skipInvalid=e.skipInvalid||!1,this.flowLevel=common.isNothing(e.flowLevel)?-1:e.flowLevel,this.styleMap=compileStyleMap(this.schema,e.styles||null),this.sortKeys=e.sortKeys||!1,this.lineWidth=e.lineWidth||80,this.noRefs=e.noRefs||!1,this.noCompatMode=e.noCompatMode||!1,this.condenseFlow=e.condenseFlow||!1,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function indentString(e,t){for(var n,i=common.repeat(" ",t),r=0,o=-1,a="",l=e.length;r<l;)-1===(o=e.indexOf("\n",r))?(n=e.slice(r),r=l):(n=e.slice(r,o+1),r=o+1),n.length&&"\n"!==n&&(a+=i),a+=n;return a}function generateNextLine(e,t){return"\n"+common.repeat(" ",e.indent*t)}function testImplicitResolving(e,t){var n,i;for(n=0,i=e.implicitTypes.length;n<i;n+=1)if(e.implicitTypes[n].resolve(t))return!0;return!1}function isWhitespace(e){return e===CHAR_SPACE||e===CHAR_TAB}function isPrintable(e){return 32<=e&&e<=126||161<=e&&e<=55295&&8232!==e&&8233!==e||57344<=e&&e<=65533&&65279!==e||65536<=e&&e<=1114111}function isPlainSafe(e){return isPrintable(e)&&65279!==e&&e!==CHAR_COMMA&&e!==CHAR_LEFT_SQUARE_BRACKET&&e!==CHAR_RIGHT_SQUARE_BRACKET&&e!==CHAR_LEFT_CURLY_BRACKET&&e!==CHAR_RIGHT_CURLY_BRACKET&&e!==CHAR_COLON&&e!==CHAR_SHARP}function isPlainSafeFirst(e){return isPrintable(e)&&65279!==e&&!isWhitespace(e)&&e!==CHAR_MINUS&&e!==CHAR_QUESTION&&e!==CHAR_COLON&&e!==CHAR_COMMA&&e!==CHAR_LEFT_SQUARE_BRACKET&&e!==CHAR_RIGHT_SQUARE_BRACKET&&e!==CHAR_LEFT_CURLY_BRACKET&&e!==CHAR_RIGHT_CURLY_BRACKET&&e!==CHAR_SHARP&&e!==CHAR_AMPERSAND&&e!==CHAR_ASTERISK&&e!==CHAR_EXCLAMATION&&e!==CHAR_VERTICAL_LINE&&e!==CHAR_GREATER_THAN&&e!==CHAR_SINGLE_QUOTE&&e!==CHAR_DOUBLE_QUOTE&&e!==CHAR_PERCENT&&e!==CHAR_COMMERCIAL_AT&&e!==CHAR_GRAVE_ACCENT}function needIndentIndicator(e){return/^\n* /.test(e)}var STYLE_PLAIN=1,STYLE_SINGLE=2,STYLE_LITERAL=3,STYLE_FOLDED=4,STYLE_DOUBLE=5;function chooseScalarStyle(e,t,n,i,r){var o,a,l=!1,s=!1,c=-1!==i,u=-1,d=isPlainSafeFirst(e.charCodeAt(0))&&!isWhitespace(e.charCodeAt(e.length-1));if(t)for(o=0;o<e.length;o++){if(!isPrintable(a=e.charCodeAt(o)))return STYLE_DOUBLE;d=d&&isPlainSafe(a)}else{for(o=0;o<e.length;o++){if((a=e.charCodeAt(o))===CHAR_LINE_FEED)l=!0,c&&(s=s||o-u-1>i&&" "!==e[u+1],u=o);else if(!isPrintable(a))return STYLE_DOUBLE;d=d&&isPlainSafe(a)}s=s||c&&o-u-1>i&&" "!==e[u+1]}return l||s?n>9&&needIndentIndicator(e)?STYLE_DOUBLE:s?STYLE_FOLDED:STYLE_LITERAL:d&&!r(e)?STYLE_PLAIN:STYLE_SINGLE}function writeScalar(e,t,n,i){e.dump=function(){if(0===t.length)return"''";if(!e.noCompatMode&&-1!==DEPRECATED_BOOLEANS_SYNTAX.indexOf(t))return"'"+t+"'";var r=e.indent*Math.max(1,n),o=-1===e.lineWidth?-1:Math.max(Math.min(e.lineWidth,40),e.lineWidth-r),a=i||e.flowLevel>-1&&n>=e.flowLevel;switch(chooseScalarStyle(t,a,e.indent,o,function(t){return testImplicitResolving(e,t)})){case STYLE_PLAIN:return t;case STYLE_SINGLE:return"'"+t.replace(/'/g,"''")+"'";case STYLE_LITERAL:return"|"+blockHeader(t,e.indent)+dropEndingNewline(indentString(t,r));case STYLE_FOLDED:return">"+blockHeader(t,e.indent)+dropEndingNewline(indentString(foldString(t,o),r));case STYLE_DOUBLE:return'"'+escapeString(t,o)+'"';default:throw new YAMLException("impossible error: invalid scalar style")}}()}function blockHeader(e,t){var n=needIndentIndicator(e)?String(t):"",i="\n"===e[e.length-1];return n+(i&&("\n"===e[e.length-2]||"\n"===e)?"+":i?"":"-")+"\n"}function dropEndingNewline(e){return"\n"===e[e.length-1]?e.slice(0,-1):e}function foldString(e,t){for(var n,i,r,o=/(\n+)([^\n]*)/g,a=(n=-1!==(n=e.indexOf("\n"))?n:e.length,o.lastIndex=n,foldLine(e.slice(0,n),t)),l="\n"===e[0]||" "===e[0];r=o.exec(e);){var s=r[1],c=r[2];i=" "===c[0],a+=s+(l||i||""===c?"":"\n")+foldLine(c,t),l=i}return a}function foldLine(e,t){if(""===e||" "===e[0])return e;for(var n,i,r=/ [^ ]/g,o=0,a=0,l=0,s="";n=r.exec(e);)(l=n.index)-o>t&&(i=a>o?a:l,s+="\n"+e.slice(o,i),o=i+1),a=l;return s+="\n",e.length-o>t&&a>o?s+=e.slice(o,a)+"\n"+e.slice(a+1):s+=e.slice(o),s.slice(1)}function escapeString(e){for(var t,n,i,r="",o=0;o<e.length;o++)(t=e.charCodeAt(o))>=55296&&t<=56319&&(n=e.charCodeAt(o+1))>=56320&&n<=57343?(r+=encodeHex(1024*(t-55296)+n-56320+65536),o++):r+=!(i=ESCAPE_SEQUENCES[t])&&isPrintable(t)?e[o]:i||encodeHex(t);return r}function writeFlowSequence(e,t,n){var i,r,o="",a=e.tag;for(i=0,r=n.length;i<r;i+=1)writeNode(e,t,n[i],!1,!1)&&(0!==i&&(o+=","+(e.condenseFlow?"":" ")),o+=e.dump);e.tag=a,e.dump="["+o+"]"}function writeBlockSequence(e,t,n,i){var r,o,a="",l=e.tag;for(r=0,o=n.length;r<o;r+=1)writeNode(e,t+1,n[r],!0,!0)&&(i&&0===r||(a+=generateNextLine(e,t)),e.dump&&CHAR_LINE_FEED===e.dump.charCodeAt(0)?a+="-":a+="- ",a+=e.dump);e.tag=l,e.dump=a||"[]"}function writeFlowMapping(e,t,n){var i,r,o,a,l,s="",c=e.tag,u=Object.keys(n);for(i=0,r=u.length;i<r;i+=1)l=e.condenseFlow?'"':"",0!==i&&(l+=", "),a=n[o=u[i]],writeNode(e,t,o,!1,!1)&&(e.dump.length>1024&&(l+="? "),l+=e.dump+(e.condenseFlow?'"':"")+":"+(e.condenseFlow?"":" "),writeNode(e,t,a,!1,!1)&&(s+=l+=e.dump));e.tag=c,e.dump="{"+s+"}"}function writeBlockMapping(e,t,n,i){var r,o,a,l,s,c,u="",d=e.tag,p=Object.keys(n);if(!0===e.sortKeys)p.sort();else if("function"==typeof e.sortKeys)p.sort(e.sortKeys);else if(e.sortKeys)throw new YAMLException("sortKeys must be a boolean or a function");for(r=0,o=p.length;r<o;r+=1)c="",i&&0===r||(c+=generateNextLine(e,t)),l=n[a=p[r]],writeNode(e,t+1,a,!0,!0,!0)&&((s=null!==e.tag&&"?"!==e.tag||e.dump&&e.dump.length>1024)&&(e.dump&&CHAR_LINE_FEED===e.dump.charCodeAt(0)?c+="?":c+="? "),c+=e.dump,s&&(c+=generateNextLine(e,t)),writeNode(e,t+1,l,!0,s)&&(e.dump&&CHAR_LINE_FEED===e.dump.charCodeAt(0)?c+=":":c+=": ",u+=c+=e.dump));e.tag=d,e.dump=u||"{}"}function detectType(e,t,n){var i,r,o,a,l,s;for(o=0,a=(r=n?e.explicitTypes:e.implicitTypes).length;o<a;o+=1)if(((l=r[o]).instanceOf||l.predicate)&&(!l.instanceOf||"object"==typeof t&&t instanceof l.instanceOf)&&(!l.predicate||l.predicate(t))){if(e.tag=n?l.tag:"?",l.represent){if(s=e.styleMap[l.tag]||l.defaultStyle,"[object Function]"===_toString.call(l.represent))i=l.represent(t,s);else{if(!_hasOwnProperty.call(l.represent,s))throw new YAMLException("!<"+l.tag+'> tag resolver accepts not "'+s+'" style');i=l.represent[s](t,s)}e.dump=i}return!0}return!1}function writeNode(e,t,n,i,r,o){e.tag=null,e.dump=n,detectType(e,n,!1)||detectType(e,n,!0);var a=_toString.call(e.dump);i&&(i=e.flowLevel<0||e.flowLevel>t);var l,s,c="[object Object]"===a||"[object Array]"===a;if(c&&(s=-1!==(l=e.duplicates.indexOf(n))),(null!==e.tag&&"?"!==e.tag||s||2!==e.indent&&t>0)&&(r=!1),s&&e.usedDuplicates[l])e.dump="*ref_"+l;else{if(c&&s&&!e.usedDuplicates[l]&&(e.usedDuplicates[l]=!0),"[object Object]"===a)i&&0!==Object.keys(e.dump).length?(writeBlockMapping(e,t,e.dump,r),s&&(e.dump="&ref_"+l+e.dump)):(writeFlowMapping(e,t,e.dump),s&&(e.dump="&ref_"+l+" "+e.dump));else if("[object Array]"===a){var u=e.noArrayIndent?t-1:t;i&&0!==e.dump.length?(writeBlockSequence(e,u,e.dump,r),s&&(e.dump="&ref_"+l+e.dump)):(writeFlowSequence(e,u,e.dump),s&&(e.dump="&ref_"+l+" "+e.dump))}else{if("[object String]"!==a){if(e.skipInvalid)return!1;throw new YAMLException("unacceptable kind of an object to dump "+a)}"?"!==e.tag&&writeScalar(e,e.dump,t,o)}null!==e.tag&&"?"!==e.tag&&(e.dump="!<"+e.tag+"> "+e.dump)}return!0}function getDuplicateReferences(e,t){var n,i,r=[],o=[];for(inspectNode(e,r,o),n=0,i=o.length;n<i;n+=1)t.duplicates.push(r[o[n]]);t.usedDuplicates=new Array(i)}function inspectNode(e,t,n){var i,r,o;if(null!==e&&"object"==typeof e)if(-1!==(r=t.indexOf(e)))-1===n.indexOf(r)&&n.push(r);else if(t.push(e),Array.isArray(e))for(r=0,o=e.length;r<o;r+=1)inspectNode(e[r],t,n);else for(r=0,o=(i=Object.keys(e)).length;r<o;r+=1)inspectNode(e[i[r]],t,n)}function dump(e,t){var n=new State(t=t||{});return n.noRefs||getDuplicateReferences(e,n),writeNode(n,0,e,!0,!0)?n.dump+"\n":""}function safeDump(e,t){return dump(e,common.extend({schema:DEFAULT_SAFE_SCHEMA},t))}module.exports.dump=dump,module.exports.safeDump=safeDump},{"./common":36,"./exception":38,"./schema/default_full":43,"./schema/default_safe":44}],38:[function(require,module,exports){"use strict";function YAMLException(t,r){Error.call(this),this.name="YAMLException",this.reason=t,this.mark=r,this.message=(this.reason||"(unknown reason)")+(this.mark?" "+this.mark.toString():""),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=(new Error).stack||""}YAMLException.prototype=Object.create(Error.prototype),YAMLException.prototype.constructor=YAMLException,YAMLException.prototype.toString=function(t){var r=this.name+": ";return r+=this.reason||"(unknown reason)",!t&&this.mark&&(r+=" "+this.mark.toString()),r},module.exports=YAMLException},{}],39:[function(require,module,exports){"use strict";var common=require("./common"),YAMLException=require("./exception"),Mark=require("./mark"),DEFAULT_SAFE_SCHEMA=require("./schema/default_safe"),DEFAULT_FULL_SCHEMA=require("./schema/default_full"),_hasOwnProperty=Object.prototype.hasOwnProperty,CONTEXT_FLOW_IN=1,CONTEXT_FLOW_OUT=2,CONTEXT_BLOCK_IN=3,CONTEXT_BLOCK_OUT=4,CHOMPING_CLIP=1,CHOMPING_STRIP=2,CHOMPING_KEEP=3,PATTERN_NON_PRINTABLE=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,PATTERN_NON_ASCII_LINE_BREAKS=/[\x85\u2028\u2029]/,PATTERN_FLOW_INDICATORS=/[,\[\]\{\}]/,PATTERN_TAG_HANDLE=/^(?:!|!!|![a-z\-]+!)$/i,PATTERN_TAG_URI=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function is_EOL(e){return 10===e||13===e}function is_WHITE_SPACE(e){return 9===e||32===e}function is_WS_OR_EOL(e){return 9===e||32===e||10===e||13===e}function is_FLOW_INDICATOR(e){return 44===e||91===e||93===e||123===e||125===e}function fromHexCode(e){var t;return 48<=e&&e<=57?e-48:97<=(t=32|e)&&t<=102?t-97+10:-1}function escapedHexLen(e){return 120===e?2:117===e?4:85===e?8:0}function fromDecimalCode(e){return 48<=e&&e<=57?e-48:-1}function simpleEscapeSequence(e){return 48===e?"\0":97===e?"":98===e?"\b":116===e?"\t":9===e?"\t":110===e?"\n":118===e?"\v":102===e?"\f":114===e?"\r":101===e?"":32===e?" ":34===e?'"':47===e?"/":92===e?"\\":78===e?"":95===e?" ":76===e?"\u2028":80===e?"\u2029":""}function charFromCodepoint(e){return e<=65535?String.fromCharCode(e):String.fromCharCode(55296+(e-65536>>10),56320+(e-65536&1023))}for(var simpleEscapeCheck=new Array(256),simpleEscapeMap=new Array(256),i=0;i<256;i++)simpleEscapeCheck[i]=simpleEscapeSequence(i)?1:0,simpleEscapeMap[i]=simpleEscapeSequence(i);function State(e,t){this.input=e,this.filename=t.filename||null,this.schema=t.schema||DEFAULT_FULL_SCHEMA,this.onWarning=t.onWarning||null,this.legacy=t.legacy||!1,this.json=t.json||!1,this.listener=t.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=e.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.documents=[]}function generateError(e,t){return new YAMLException(t,new Mark(e.filename,e.input,e.position,e.line,e.position-e.lineStart))}function throwError(e,t){throw generateError(e,t)}function throwWarning(e,t){e.onWarning&&e.onWarning.call(null,generateError(e,t))}var directiveHandlers={YAML:function(e,t,n){var i,o,r;null!==e.version&&throwError(e,"duplication of %YAML directive"),1!==n.length&&throwError(e,"YAML directive accepts exactly one argument"),null===(i=/^([0-9]+)\.([0-9]+)$/.exec(n[0]))&&throwError(e,"ill-formed argument of the YAML directive"),o=parseInt(i[1],10),r=parseInt(i[2],10),1!==o&&throwError(e,"unacceptable YAML version of the document"),e.version=n[0],e.checkLineBreaks=r<2,1!==r&&2!==r&&throwWarning(e,"unsupported YAML version of the document")},TAG:function(e,t,n){var i,o;2!==n.length&&throwError(e,"TAG directive accepts exactly two arguments"),i=n[0],o=n[1],PATTERN_TAG_HANDLE.test(i)||throwError(e,"ill-formed tag handle (first argument) of the TAG directive"),_hasOwnProperty.call(e.tagMap,i)&&throwError(e,'there is a previously declared suffix for "'+i+'" tag handle'),PATTERN_TAG_URI.test(o)||throwError(e,"ill-formed tag prefix (second argument) of the TAG directive"),e.tagMap[i]=o}};function captureSegment(e,t,n,i){var o,r,a,s;if(t<n){if(s=e.input.slice(t,n),i)for(o=0,r=s.length;o<r;o+=1)9===(a=s.charCodeAt(o))||32<=a&&a<=1114111||throwError(e,"expected valid JSON character");else PATTERN_NON_PRINTABLE.test(s)&&throwError(e,"the stream contains non-printable characters");e.result+=s}}function mergeMappings(e,t,n,i){var o,r,a,s;for(common.isObject(n)||throwError(e,"cannot merge mappings; the provided source object is unacceptable"),a=0,s=(o=Object.keys(n)).length;a<s;a+=1)r=o[a],_hasOwnProperty.call(t,r)||(t[r]=n[r],i[r]=!0)}function storeMappingPair(e,t,n,i,o,r,a,s){var p,c;if(o=String(o),null===t&&(t={}),"tag:yaml.org,2002:merge"===i)if(Array.isArray(r))for(p=0,c=r.length;p<c;p+=1)mergeMappings(e,t,r[p],n);else mergeMappings(e,t,r,n);else e.json||_hasOwnProperty.call(n,o)||!_hasOwnProperty.call(t,o)||(e.line=a||e.line,e.position=s||e.position,throwError(e,"duplicated mapping key")),t[o]=r,delete n[o];return t}function readLineBreak(e){var t;10===(t=e.input.charCodeAt(e.position))?e.position++:13===t?(e.position++,10===e.input.charCodeAt(e.position)&&e.position++):throwError(e,"a line break is expected"),e.line+=1,e.lineStart=e.position}function skipSeparationSpace(e,t,n){for(var i=0,o=e.input.charCodeAt(e.position);0!==o;){for(;is_WHITE_SPACE(o);)o=e.input.charCodeAt(++e.position);if(t&&35===o)do{o=e.input.charCodeAt(++e.position)}while(10!==o&&13!==o&&0!==o);if(!is_EOL(o))break;for(readLineBreak(e),o=e.input.charCodeAt(e.position),i++,e.lineIndent=0;32===o;)e.lineIndent++,o=e.input.charCodeAt(++e.position)}return-1!==n&&0!==i&&e.lineIndent<n&&throwWarning(e,"deficient indentation"),i}function testDocumentSeparator(e){var t,n=e.position;return!(45!==(t=e.input.charCodeAt(n))&&46!==t||t!==e.input.charCodeAt(n+1)||t!==e.input.charCodeAt(n+2)||(n+=3,0!==(t=e.input.charCodeAt(n))&&!is_WS_OR_EOL(t)))}function writeFoldedLines(e,t){1===t?e.result+=" ":t>1&&(e.result+=common.repeat("\n",t-1))}function readPlainScalar(e,t,n){var i,o,r,a,s,p,c,l,u=e.kind,d=e.result;if(is_WS_OR_EOL(l=e.input.charCodeAt(e.position))||is_FLOW_INDICATOR(l)||35===l||38===l||42===l||33===l||124===l||62===l||39===l||34===l||37===l||64===l||96===l)return!1;if((63===l||45===l)&&(is_WS_OR_EOL(i=e.input.charCodeAt(e.position+1))||n&&is_FLOW_INDICATOR(i)))return!1;for(e.kind="scalar",e.result="",o=r=e.position,a=!1;0!==l;){if(58===l){if(is_WS_OR_EOL(i=e.input.charCodeAt(e.position+1))||n&&is_FLOW_INDICATOR(i))break}else if(35===l){if(is_WS_OR_EOL(e.input.charCodeAt(e.position-1)))break}else{if(e.position===e.lineStart&&testDocumentSeparator(e)||n&&is_FLOW_INDICATOR(l))break;if(is_EOL(l)){if(s=e.line,p=e.lineStart,c=e.lineIndent,skipSeparationSpace(e,!1,-1),e.lineIndent>=t){a=!0,l=e.input.charCodeAt(e.position);continue}e.position=r,e.line=s,e.lineStart=p,e.lineIndent=c;break}}a&&(captureSegment(e,o,r,!1),writeFoldedLines(e,e.line-s),o=r=e.position,a=!1),is_WHITE_SPACE(l)||(r=e.position+1),l=e.input.charCodeAt(++e.position)}return captureSegment(e,o,r,!1),!!e.result||(e.kind=u,e.result=d,!1)}function readSingleQuotedScalar(e,t){var n,i,o;if(39!==(n=e.input.charCodeAt(e.position)))return!1;for(e.kind="scalar",e.result="",e.position++,i=o=e.position;0!==(n=e.input.charCodeAt(e.position));)if(39===n){if(captureSegment(e,i,e.position,!0),39!==(n=e.input.charCodeAt(++e.position)))return!0;i=e.position,e.position++,o=e.position}else is_EOL(n)?(captureSegment(e,i,o,!0),writeFoldedLines(e,skipSeparationSpace(e,!1,t)),i=o=e.position):e.position===e.lineStart&&testDocumentSeparator(e)?throwError(e,"unexpected end of the document within a single quoted scalar"):(e.position++,o=e.position);throwError(e,"unexpected end of the stream within a single quoted scalar")}function readDoubleQuotedScalar(e,t){var n,i,o,r,a,s;if(34!==(s=e.input.charCodeAt(e.position)))return!1;for(e.kind="scalar",e.result="",e.position++,n=i=e.position;0!==(s=e.input.charCodeAt(e.position));){if(34===s)return captureSegment(e,n,e.position,!0),e.position++,!0;if(92===s){if(captureSegment(e,n,e.position,!0),is_EOL(s=e.input.charCodeAt(++e.position)))skipSeparationSpace(e,!1,t);else if(s<256&&simpleEscapeCheck[s])e.result+=simpleEscapeMap[s],e.position++;else if((a=escapedHexLen(s))>0){for(o=a,r=0;o>0;o--)(a=fromHexCode(s=e.input.charCodeAt(++e.position)))>=0?r=(r<<4)+a:throwError(e,"expected hexadecimal character");e.result+=charFromCodepoint(r),e.position++}else throwError(e,"unknown escape sequence");n=i=e.position}else is_EOL(s)?(captureSegment(e,n,i,!0),writeFoldedLines(e,skipSeparationSpace(e,!1,t)),n=i=e.position):e.position===e.lineStart&&testDocumentSeparator(e)?throwError(e,"unexpected end of the document within a double quoted scalar"):(e.position++,i=e.position)}throwError(e,"unexpected end of the stream within a double quoted scalar")}function readFlowCollection(e,t){var n,i,o,r,a,s,p,c,l,u,d=!0,h=e.tag,f=e.anchor,_={};if(91===(u=e.input.charCodeAt(e.position)))o=93,s=!1,i=[];else{if(123!==u)return!1;o=125,s=!0,i={}}for(null!==e.anchor&&(e.anchorMap[e.anchor]=i),u=e.input.charCodeAt(++e.position);0!==u;){if(skipSeparationSpace(e,!0,t),(u=e.input.charCodeAt(e.position))===o)return e.position++,e.tag=h,e.anchor=f,e.kind=s?"mapping":"sequence",e.result=i,!0;d||throwError(e,"missed comma between flow collection entries"),l=null,r=a=!1,63===u&&is_WS_OR_EOL(e.input.charCodeAt(e.position+1))&&(r=a=!0,e.position++,skipSeparationSpace(e,!0,t)),n=e.line,composeNode(e,t,CONTEXT_FLOW_IN,!1,!0),c=e.tag,p=e.result,skipSeparationSpace(e,!0,t),u=e.input.charCodeAt(e.position),!a&&e.line!==n||58!==u||(r=!0,u=e.input.charCodeAt(++e.position),skipSeparationSpace(e,!0,t),composeNode(e,t,CONTEXT_FLOW_IN,!1,!0),l=e.result),s?storeMappingPair(e,i,_,c,p,l):r?i.push(storeMappingPair(e,null,_,c,p,l)):i.push(p),skipSeparationSpace(e,!0,t),44===(u=e.input.charCodeAt(e.position))?(d=!0,u=e.input.charCodeAt(++e.position)):d=!1}throwError(e,"unexpected end of the stream within a flow collection")}function readBlockScalar(e,t){var n,i,o,r,a=CHOMPING_CLIP,s=!1,p=!1,c=t,l=0,u=!1;if(124===(r=e.input.charCodeAt(e.position)))i=!1;else{if(62!==r)return!1;i=!0}for(e.kind="scalar",e.result="";0!==r;)if(43===(r=e.input.charCodeAt(++e.position))||45===r)CHOMPING_CLIP===a?a=43===r?CHOMPING_KEEP:CHOMPING_STRIP:throwError(e,"repeat of a chomping mode identifier");else{if(!((o=fromDecimalCode(r))>=0))break;0===o?throwError(e,"bad explicit indentation width of a block scalar; it cannot be less than one"):p?throwError(e,"repeat of an indentation width identifier"):(c=t+o-1,p=!0)}if(is_WHITE_SPACE(r)){do{r=e.input.charCodeAt(++e.position)}while(is_WHITE_SPACE(r));if(35===r)do{r=e.input.charCodeAt(++e.position)}while(!is_EOL(r)&&0!==r)}for(;0!==r;){for(readLineBreak(e),e.lineIndent=0,r=e.input.charCodeAt(e.position);(!p||e.lineIndent<c)&&32===r;)e.lineIndent++,r=e.input.charCodeAt(++e.position);if(!p&&e.lineIndent>c&&(c=e.lineIndent),is_EOL(r))l++;else{if(e.lineIndent<c){a===CHOMPING_KEEP?e.result+=common.repeat("\n",s?1+l:l):a===CHOMPING_CLIP&&s&&(e.result+="\n");break}for(i?is_WHITE_SPACE(r)?(u=!0,e.result+=common.repeat("\n",s?1+l:l)):u?(u=!1,e.result+=common.repeat("\n",l+1)):0===l?s&&(e.result+=" "):e.result+=common.repeat("\n",l):e.result+=common.repeat("\n",s?1+l:l),s=!0,p=!0,l=0,n=e.position;!is_EOL(r)&&0!==r;)r=e.input.charCodeAt(++e.position);captureSegment(e,n,e.position,!1)}}return!0}function readBlockSequence(e,t){var n,i,o=e.tag,r=e.anchor,a=[],s=!1;for(null!==e.anchor&&(e.anchorMap[e.anchor]=a),i=e.input.charCodeAt(e.position);0!==i&&45===i&&is_WS_OR_EOL(e.input.charCodeAt(e.position+1));)if(s=!0,e.position++,skipSeparationSpace(e,!0,-1)&&e.lineIndent<=t)a.push(null),i=e.input.charCodeAt(e.position);else if(n=e.line,composeNode(e,t,CONTEXT_BLOCK_IN,!1,!0),a.push(e.result),skipSeparationSpace(e,!0,-1),i=e.input.charCodeAt(e.position),(e.line===n||e.lineIndent>t)&&0!==i)throwError(e,"bad indentation of a sequence entry");else if(e.lineIndent<t)break;return!!s&&(e.tag=o,e.anchor=r,e.kind="sequence",e.result=a,!0)}function readBlockMapping(e,t,n){var i,o,r,a,s,p=e.tag,c=e.anchor,l={},u={},d=null,h=null,f=null,_=!1,A=!1;for(null!==e.anchor&&(e.anchorMap[e.anchor]=l),s=e.input.charCodeAt(e.position);0!==s;){if(i=e.input.charCodeAt(e.position+1),r=e.line,a=e.position,63!==s&&58!==s||!is_WS_OR_EOL(i)){if(!composeNode(e,n,CONTEXT_FLOW_OUT,!1,!0))break;if(e.line===r){for(s=e.input.charCodeAt(e.position);is_WHITE_SPACE(s);)s=e.input.charCodeAt(++e.position);if(58===s)is_WS_OR_EOL(s=e.input.charCodeAt(++e.position))||throwError(e,"a whitespace character is expected after the key-value separator within a block mapping"),_&&(storeMappingPair(e,l,u,d,h,null),d=h=f=null),A=!0,_=!1,o=!1,d=e.tag,h=e.result;else{if(!A)return e.tag=p,e.anchor=c,!0;throwError(e,"can not read an implicit mapping pair; a colon is missed")}}else{if(!A)return e.tag=p,e.anchor=c,!0;throwError(e,"can not read a block mapping entry; a multiline key may not be an implicit key")}}else 63===s?(_&&(storeMappingPair(e,l,u,d,h,null),d=h=f=null),A=!0,_=!0,o=!0):_?(_=!1,o=!0):throwError(e,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),e.position+=1,s=i;if((e.line===r||e.lineIndent>t)&&(composeNode(e,t,CONTEXT_BLOCK_OUT,!0,o)&&(_?h=e.result:f=e.result),_||(storeMappingPair(e,l,u,d,h,f,r,a),d=h=f=null),skipSeparationSpace(e,!0,-1),s=e.input.charCodeAt(e.position)),e.lineIndent>t&&0!==s)throwError(e,"bad indentation of a mapping entry");else if(e.lineIndent<t)break}return _&&storeMappingPair(e,l,u,d,h,null),A&&(e.tag=p,e.anchor=c,e.kind="mapping",e.result=l),A}function readTagProperty(e){var t,n,i,o,r=!1,a=!1;if(33!==(o=e.input.charCodeAt(e.position)))return!1;if(null!==e.tag&&throwError(e,"duplication of a tag property"),60===(o=e.input.charCodeAt(++e.position))?(r=!0,o=e.input.charCodeAt(++e.position)):33===o?(a=!0,n="!!",o=e.input.charCodeAt(++e.position)):n="!",t=e.position,r){do{o=e.input.charCodeAt(++e.position)}while(0!==o&&62!==o);e.position<e.length?(i=e.input.slice(t,e.position),o=e.input.charCodeAt(++e.position)):throwError(e,"unexpected end of the stream within a verbatim tag")}else{for(;0!==o&&!is_WS_OR_EOL(o);)33===o&&(a?throwError(e,"tag suffix cannot contain exclamation marks"):(n=e.input.slice(t-1,e.position+1),PATTERN_TAG_HANDLE.test(n)||throwError(e,"named tag handle cannot contain such characters"),a=!0,t=e.position+1)),o=e.input.charCodeAt(++e.position);i=e.input.slice(t,e.position),PATTERN_FLOW_INDICATORS.test(i)&&throwError(e,"tag suffix cannot contain flow indicator characters")}return i&&!PATTERN_TAG_URI.test(i)&&throwError(e,"tag name cannot contain such characters: "+i),r?e.tag=i:_hasOwnProperty.call(e.tagMap,n)?e.tag=e.tagMap[n]+i:"!"===n?e.tag="!"+i:"!!"===n?e.tag="tag:yaml.org,2002:"+i:throwError(e,'undeclared tag handle "'+n+'"'),!0}function readAnchorProperty(e){var t,n;if(38!==(n=e.input.charCodeAt(e.position)))return!1;for(null!==e.anchor&&throwError(e,"duplication of an anchor property"),n=e.input.charCodeAt(++e.position),t=e.position;0!==n&&!is_WS_OR_EOL(n)&&!is_FLOW_INDICATOR(n);)n=e.input.charCodeAt(++e.position);return e.position===t&&throwError(e,"name of an anchor node must contain at least one character"),e.anchor=e.input.slice(t,e.position),!0}function readAlias(e){var t,n,i;if(42!==(i=e.input.charCodeAt(e.position)))return!1;for(i=e.input.charCodeAt(++e.position),t=e.position;0!==i&&!is_WS_OR_EOL(i)&&!is_FLOW_INDICATOR(i);)i=e.input.charCodeAt(++e.position);return e.position===t&&throwError(e,"name of an alias node must contain at least one character"),n=e.input.slice(t,e.position),e.anchorMap.hasOwnProperty(n)||throwError(e,'unidentified alias "'+n+'"'),e.result=e.anchorMap[n],skipSeparationSpace(e,!0,-1),!0}function composeNode(e,t,n,i,o){var r,a,s,p,c,l,u,d,h=1,f=!1,_=!1;if(null!==e.listener&&e.listener("open",e),e.tag=null,e.anchor=null,e.kind=null,e.result=null,r=a=s=CONTEXT_BLOCK_OUT===n||CONTEXT_BLOCK_IN===n,i&&skipSeparationSpace(e,!0,-1)&&(f=!0,e.lineIndent>t?h=1:e.lineIndent===t?h=0:e.lineIndent<t&&(h=-1)),1===h)for(;readTagProperty(e)||readAnchorProperty(e);)skipSeparationSpace(e,!0,-1)?(f=!0,s=r,e.lineIndent>t?h=1:e.lineIndent===t?h=0:e.lineIndent<t&&(h=-1)):s=!1;if(s&&(s=f||o),1!==h&&CONTEXT_BLOCK_OUT!==n||(u=CONTEXT_FLOW_IN===n||CONTEXT_FLOW_OUT===n?t:t+1,d=e.position-e.lineStart,1===h?s&&(readBlockSequence(e,d)||readBlockMapping(e,d,u))||readFlowCollection(e,u)?_=!0:(a&&readBlockScalar(e,u)||readSingleQuotedScalar(e,u)||readDoubleQuotedScalar(e,u)?_=!0:readAlias(e)?(_=!0,null===e.tag&&null===e.anchor||throwError(e,"alias node should not have any properties")):readPlainScalar(e,u,CONTEXT_FLOW_IN===n)&&(_=!0,null===e.tag&&(e.tag="?")),null!==e.anchor&&(e.anchorMap[e.anchor]=e.result)):0===h&&(_=s&&readBlockSequence(e,d))),null!==e.tag&&"!"!==e.tag)if("?"===e.tag){for(p=0,c=e.implicitTypes.length;p<c;p+=1)if((l=e.implicitTypes[p]).resolve(e.result)){e.result=l.construct(e.result),e.tag=l.tag,null!==e.anchor&&(e.anchorMap[e.anchor]=e.result);break}}else _hasOwnProperty.call(e.typeMap[e.kind||"fallback"],e.tag)?(l=e.typeMap[e.kind||"fallback"][e.tag],null!==e.result&&l.kind!==e.kind&&throwError(e,"unacceptable node kind for !<"+e.tag+'> tag; it should be "'+l.kind+'", not "'+e.kind+'"'),l.resolve(e.result)?(e.result=l.construct(e.result),null!==e.anchor&&(e.anchorMap[e.anchor]=e.result)):throwError(e,"cannot resolve a node with !<"+e.tag+"> explicit tag")):throwError(e,"unknown tag !<"+e.tag+">");return null!==e.listener&&e.listener("close",e),null!==e.tag||null!==e.anchor||_}function readDocument(e){var t,n,i,o,r=e.position,a=!1;for(e.version=null,e.checkLineBreaks=e.legacy,e.tagMap={},e.anchorMap={};0!==(o=e.input.charCodeAt(e.position))&&(skipSeparationSpace(e,!0,-1),o=e.input.charCodeAt(e.position),!(e.lineIndent>0||37!==o));){for(a=!0,o=e.input.charCodeAt(++e.position),t=e.position;0!==o&&!is_WS_OR_EOL(o);)o=e.input.charCodeAt(++e.position);for(i=[],(n=e.input.slice(t,e.position)).length<1&&throwError(e,"directive name must not be less than one character in length");0!==o;){for(;is_WHITE_SPACE(o);)o=e.input.charCodeAt(++e.position);if(35===o){do{o=e.input.charCodeAt(++e.position)}while(0!==o&&!is_EOL(o));break}if(is_EOL(o))break;for(t=e.position;0!==o&&!is_WS_OR_EOL(o);)o=e.input.charCodeAt(++e.position);i.push(e.input.slice(t,e.position))}0!==o&&readLineBreak(e),_hasOwnProperty.call(directiveHandlers,n)?directiveHandlers[n](e,n,i):throwWarning(e,'unknown document directive "'+n+'"')}skipSeparationSpace(e,!0,-1),0===e.lineIndent&&45===e.input.charCodeAt(e.position)&&45===e.input.charCodeAt(e.position+1)&&45===e.input.charCodeAt(e.position+2)?(e.position+=3,skipSeparationSpace(e,!0,-1)):a&&throwError(e,"directives end mark is expected"),composeNode(e,e.lineIndent-1,CONTEXT_BLOCK_OUT,!1,!0),skipSeparationSpace(e,!0,-1),e.checkLineBreaks&&PATTERN_NON_ASCII_LINE_BREAKS.test(e.input.slice(r,e.position))&&throwWarning(e,"non-ASCII line breaks are interpreted as content"),e.documents.push(e.result),e.position===e.lineStart&&testDocumentSeparator(e)?46===e.input.charCodeAt(e.position)&&(e.position+=3,skipSeparationSpace(e,!0,-1)):e.position<e.length-1&&throwError(e,"end of the stream or a document separator is expected")}function loadDocuments(e,t){t=t||{},0!==(e=String(e)).length&&(10!==e.charCodeAt(e.length-1)&&13!==e.charCodeAt(e.length-1)&&(e+="\n"),65279===e.charCodeAt(0)&&(e=e.slice(1)));var n=new State(e,t);for(n.input+="\0";32===n.input.charCodeAt(n.position);)n.lineIndent+=1,n.position+=1;for(;n.position<n.length-1;)readDocument(n);return n.documents}function loadAll(e,t,n){var i,o,r=loadDocuments(e,n);if("function"!=typeof t)return r;for(i=0,o=r.length;i<o;i+=1)t(r[i])}function load(e,t){var n=loadDocuments(e,t);if(0!==n.length){if(1===n.length)return n[0];throw new YAMLException("expected a single document in the stream, but found more")}}function safeLoadAll(e,t,n){if("function"!=typeof t)return loadAll(e,common.extend({schema:DEFAULT_SAFE_SCHEMA},n));loadAll(e,t,common.extend({schema:DEFAULT_SAFE_SCHEMA},n))}function safeLoad(e,t){return load(e,common.extend({schema:DEFAULT_SAFE_SCHEMA},t))}module.exports.loadAll=loadAll,module.exports.load=load,module.exports.safeLoadAll=safeLoadAll,module.exports.safeLoad=safeLoad},{"./common":36,"./exception":38,"./mark":40,"./schema/default_full":43,"./schema/default_safe":44}],40:[function(require,module,exports){"use strict";var common=require("./common");function Mark(t,i,n,e,r){this.name=t,this.buffer=i,this.position=n,this.line=e,this.column=r}Mark.prototype.getSnippet=function(t,i){var n,e,r,o,s;if(!this.buffer)return null;for(t=t||4,i=i||75,n="",e=this.position;e>0&&-1==="\0\r\n\u2028\u2029".indexOf(this.buffer.charAt(e-1));)if(e-=1,this.position-e>i/2-1){n=" ... ",e+=5;break}for(r="",o=this.position;o<this.buffer.length&&-1==="\0\r\n\u2028\u2029".indexOf(this.buffer.charAt(o));)if((o+=1)-this.position>i/2-1){r=" ... ",o-=5;break}return s=this.buffer.slice(e,o),common.repeat(" ",t)+n+s+r+"\n"+common.repeat(" ",t+this.position-e+n.length)+"^"},Mark.prototype.toString=function(t){var i,n="";return this.name&&(n+='in "'+this.name+'" '),n+="at line "+(this.line+1)+", column "+(this.column+1),t||(i=this.getSnippet())&&(n+=":\n"+i),n},module.exports=Mark},{"./common":36}],41:[function(require,module,exports){"use strict";var common=require("./common"),YAMLException=require("./exception"),Type=require("./type");function compileList(i,e,t){var c=[];return i.include.forEach(function(i){t=compileList(i,e,t)}),i[e].forEach(function(i){t.forEach(function(e,t){e.tag===i.tag&&e.kind===i.kind&&c.push(t)}),t.push(i)}),t.filter(function(i,e){return-1===c.indexOf(e)})}function compileMap(){var i,e,t={scalar:{},sequence:{},mapping:{},fallback:{}};function c(i){t[i.kind][i.tag]=t.fallback[i.tag]=i}for(i=0,e=arguments.length;i<e;i+=1)arguments[i].forEach(c);return t}function Schema(i){this.include=i.include||[],this.implicit=i.implicit||[],this.explicit=i.explicit||[],this.implicit.forEach(function(i){if(i.loadKind&&"scalar"!==i.loadKind)throw new YAMLException("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.")}),this.compiledImplicit=compileList(this,"implicit",[]),this.compiledExplicit=compileList(this,"explicit",[]),this.compiledTypeMap=compileMap(this.compiledImplicit,this.compiledExplicit)}Schema.DEFAULT=null,Schema.create=function(){var i,e;switch(arguments.length){case 1:i=Schema.DEFAULT,e=arguments[0];break;case 2:i=arguments[0],e=arguments[1];break;default:throw new YAMLException("Wrong number of arguments for Schema.create function")}if(i=common.toArray(i),e=common.toArray(e),!i.every(function(i){return i instanceof Schema}))throw new YAMLException("Specified list of super schemas (or a single Schema object) contains a non-Schema object.");if(!e.every(function(i){return i instanceof Type}))throw new YAMLException("Specified list of YAML types (or a single Type object) contains a non-Type object.");return new Schema({include:i,explicit:e})},module.exports=Schema},{"./common":36,"./exception":38,"./type":47}],42:[function(require,module,exports){"use strict";var Schema=require("../schema");module.exports=new Schema({include:[require("./json")]})},{"../schema":41,"./json":46}],43:[function(require,module,exports){"use strict";var Schema=require("../schema");module.exports=Schema.DEFAULT=new Schema({include:[require("./default_safe")],explicit:[require("../type/js/undefined"),require("../type/js/regexp"),require("../type/js/function")]})},{"../schema":41,"../type/js/function":52,"../type/js/regexp":53,"../type/js/undefined":54,"./default_safe":44}],44:[function(require,module,exports){"use strict";var Schema=require("../schema");module.exports=new Schema({include:[require("./core")],implicit:[require("../type/timestamp"),require("../type/merge")],explicit:[require("../type/binary"),require("../type/omap"),require("../type/pairs"),require("../type/set")]})},{"../schema":41,"../type/binary":48,"../type/merge":56,"../type/omap":58,"../type/pairs":59,"../type/set":61,"../type/timestamp":63,"./core":42}],45:[function(require,module,exports){"use strict";var Schema=require("../schema");module.exports=new Schema({explicit:[require("../type/str"),require("../type/seq"),require("../type/map")]})},{"../schema":41,"../type/map":55,"../type/seq":60,"../type/str":62}],46:[function(require,module,exports){"use strict";var Schema=require("../schema");module.exports=new Schema({include:[require("./failsafe")],implicit:[require("../type/null"),require("../type/bool"),require("../type/int"),require("../type/float")]})},{"../schema":41,"../type/bool":49,"../type/float":50,"../type/int":51,"../type/null":57,"./failsafe":45}],47:[function(require,module,exports){"use strict";var YAMLException=require("./exception"),TYPE_CONSTRUCTOR_OPTIONS=["kind","resolve","construct","instanceOf","predicate","represent","defaultStyle","styleAliases"],YAML_NODE_KINDS=["scalar","sequence","mapping"];function compileStyleAliases(e){var t={};return null!==e&&Object.keys(e).forEach(function(n){e[n].forEach(function(e){t[String(e)]=n})}),t}function Type(e,t){if(t=t||{},Object.keys(t).forEach(function(t){if(-1===TYPE_CONSTRUCTOR_OPTIONS.indexOf(t))throw new YAMLException('Unknown option "'+t+'" is met in definition of "'+e+'" YAML type.')}),this.tag=e,this.kind=t.kind||null,this.resolve=t.resolve||function(){return!0},this.construct=t.construct||function(e){return e},this.instanceOf=t.instanceOf||null,this.predicate=t.predicate||null,this.represent=t.represent||null,this.defaultStyle=t.defaultStyle||null,this.styleAliases=compileStyleAliases(t.styleAliases||null),-1===YAML_NODE_KINDS.indexOf(this.kind))throw new YAMLException('Unknown kind "'+this.kind+'" is specified for "'+e+'" YAML type.')}module.exports=Type},{"./exception":38}],48:[function(require,module,exports){"use strict";var NodeBuffer;try{var _require=require;NodeBuffer=_require("buffer").Buffer}catch(r){}var Type=require("../type"),BASE64_MAP="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";function resolveYamlBinary(r){if(null===r)return!1;var e,n,u=0,f=r.length,t=BASE64_MAP;for(n=0;n<f;n++)if(!((e=t.indexOf(r.charAt(n)))>64)){if(e<0)return!1;u+=6}return u%8==0}function constructYamlBinary(r){var e,n,u=r.replace(/[\r\n=]/g,""),f=u.length,t=BASE64_MAP,a=0,i=[];for(e=0;e<f;e++)e%4==0&&e&&(i.push(a>>16&255),i.push(a>>8&255),i.push(255&a)),a=a<<6|t.indexOf(u.charAt(e));return 0===(n=f%4*6)?(i.push(a>>16&255),i.push(a>>8&255),i.push(255&a)):18===n?(i.push(a>>10&255),i.push(a>>2&255)):12===n&&i.push(a>>4&255),NodeBuffer?NodeBuffer.from?NodeBuffer.from(i):new NodeBuffer(i):i}function representYamlBinary(r){var e,n,u="",f=0,t=r.length,a=BASE64_MAP;for(e=0;e<t;e++)e%3==0&&e&&(u+=a[f>>18&63],u+=a[f>>12&63],u+=a[f>>6&63],u+=a[63&f]),f=(f<<8)+r[e];return 0===(n=t%3)?(u+=a[f>>18&63],u+=a[f>>12&63],u+=a[f>>6&63],u+=a[63&f]):2===n?(u+=a[f>>10&63],u+=a[f>>4&63],u+=a[f<<2&63],u+=a[64]):1===n&&(u+=a[f>>2&63],u+=a[f<<4&63],u+=a[64],u+=a[64]),u}function isBinary(r){return NodeBuffer&&NodeBuffer.isBuffer(r)}module.exports=new Type("tag:yaml.org,2002:binary",{kind:"scalar",resolve:resolveYamlBinary,construct:constructYamlBinary,predicate:isBinary,represent:representYamlBinary})},{"../type":47}],49:[function(require,module,exports){"use strict";var Type=require("../type");function resolveYamlBoolean(e){if(null===e)return!1;var r=e.length;return 4===r&&("true"===e||"True"===e||"TRUE"===e)||5===r&&("false"===e||"False"===e||"FALSE"===e)}function constructYamlBoolean(e){return"true"===e||"True"===e||"TRUE"===e}function isBoolean(e){return"[object Boolean]"===Object.prototype.toString.call(e)}module.exports=new Type("tag:yaml.org,2002:bool",{kind:"scalar",resolve:resolveYamlBoolean,construct:constructYamlBoolean,predicate:isBoolean,represent:{lowercase:function(e){return e?"true":"false"},uppercase:function(e){return e?"TRUE":"FALSE"},camelcase:function(e){return e?"True":"False"}},defaultStyle:"lowercase"})},{"../type":47}],50:[function(require,module,exports){"use strict";var common=require("../common"),Type=require("../type"),YAML_FLOAT_PATTERN=new RegExp("^(?:[-+]?(?:0|[1-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");function resolveYamlFloat(e){return null!==e&&!(!YAML_FLOAT_PATTERN.test(e)||"_"===e[e.length-1])}function constructYamlFloat(e){var r,t,a,n;return t="-"===(r=e.replace(/_/g,"").toLowerCase())[0]?-1:1,n=[],"+-".indexOf(r[0])>=0&&(r=r.slice(1)),".inf"===r?1===t?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:".nan"===r?NaN:r.indexOf(":")>=0?(r.split(":").forEach(function(e){n.unshift(parseFloat(e,10))}),r=0,a=1,n.forEach(function(e){r+=e*a,a*=60}),t*r):t*parseFloat(r,10)}var SCIENTIFIC_WITHOUT_DOT=/^[-+]?[0-9]+e/;function representYamlFloat(e,r){var t;if(isNaN(e))switch(r){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===e)switch(r){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===e)switch(r){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(common.isNegativeZero(e))return"-0.0";return t=e.toString(10),SCIENTIFIC_WITHOUT_DOT.test(t)?t.replace("e",".e"):t}function isFloat(e){return"[object Number]"===Object.prototype.toString.call(e)&&(e%1!=0||common.isNegativeZero(e))}module.exports=new Type("tag:yaml.org,2002:float",{kind:"scalar",resolve:resolveYamlFloat,construct:constructYamlFloat,predicate:isFloat,represent:representYamlFloat,defaultStyle:"lowercase"})},{"../common":36,"../type":47}],51:[function(require,module,exports){"use strict";var common=require("../common"),Type=require("../type");function isHexCode(e){return 48<=e&&e<=57||65<=e&&e<=70||97<=e&&e<=102}function isOctCode(e){return 48<=e&&e<=55}function isDecCode(e){return 48<=e&&e<=57}function resolveYamlInteger(e){if(null===e)return!1;var r,t=e.length,n=0,i=!1;if(!t)return!1;if("-"!==(r=e[n])&&"+"!==r||(r=e[++n]),"0"===r){if(n+1===t)return!0;if("b"===(r=e[++n])){for(n++;n<t;n++)if("_"!==(r=e[n])){if("0"!==r&&"1"!==r)return!1;i=!0}return i&&"_"!==r}if("x"===r){for(n++;n<t;n++)if("_"!==(r=e[n])){if(!isHexCode(e.charCodeAt(n)))return!1;i=!0}return i&&"_"!==r}for(;n<t;n++)if("_"!==(r=e[n])){if(!isOctCode(e.charCodeAt(n)))return!1;i=!0}return i&&"_"!==r}if("_"===r)return!1;for(;n<t;n++)if("_"!==(r=e[n])){if(":"===r)break;if(!isDecCode(e.charCodeAt(n)))return!1;i=!0}return!(!i||"_"===r)&&(":"!==r||/^(:[0-5]?[0-9])+$/.test(e.slice(n)))}function constructYamlInteger(e){var r,t,n=e,i=1,o=[];return-1!==n.indexOf("_")&&(n=n.replace(/_/g,"")),"-"!==(r=n[0])&&"+"!==r||("-"===r&&(i=-1),r=(n=n.slice(1))[0]),"0"===n?0:"0"===r?"b"===n[1]?i*parseInt(n.slice(2),2):"x"===n[1]?i*parseInt(n,16):i*parseInt(n,8):-1!==n.indexOf(":")?(n.split(":").forEach(function(e){o.unshift(parseInt(e,10))}),n=0,t=1,o.forEach(function(e){n+=e*t,t*=60}),i*n):i*parseInt(n,10)}function isInteger(e){return"[object Number]"===Object.prototype.toString.call(e)&&e%1==0&&!common.isNegativeZero(e)}module.exports=new Type("tag:yaml.org,2002:int",{kind:"scalar",resolve:resolveYamlInteger,construct:constructYamlInteger,predicate:isInteger,represent:{binary:function(e){return e>=0?"0b"+e.toString(2):"-0b"+e.toString(2).slice(1)},octal:function(e){return e>=0?"0"+e.toString(8):"-0"+e.toString(8).slice(1)},decimal:function(e){return e.toString(10)},hexadecimal:function(e){return e>=0?"0x"+e.toString(16).toUpperCase():"-0x"+e.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}})},{"../common":36,"../type":47}],52:[function(require,module,exports){"use strict";var esprima;try{var _require=require;esprima=_require("esprima")}catch(e){"undefined"!=typeof window&&(esprima=window.esprima)}var Type=require("../../type");function resolveJavascriptFunction(e){if(null===e)return!1;try{var r="("+e+")",n=esprima.parse(r,{range:!0});return"Program"===n.type&&1===n.body.length&&"ExpressionStatement"===n.body[0].type&&("ArrowFunctionExpression"===n.body[0].expression.type||"FunctionExpression"===n.body[0].expression.type)}catch(e){return!1}}function constructJavascriptFunction(e){var r,n="("+e+")",t=esprima.parse(n,{range:!0}),o=[];if("Program"!==t.type||1!==t.body.length||"ExpressionStatement"!==t.body[0].type||"ArrowFunctionExpression"!==t.body[0].expression.type&&"FunctionExpression"!==t.body[0].expression.type)throw new Error("Failed to resolve function");return t.body[0].expression.params.forEach(function(e){o.push(e.name)}),r=t.body[0].expression.body.range,"BlockStatement"===t.body[0].expression.body.type?new Function(o,n.slice(r[0]+1,r[1]-1)):new Function(o,"return "+n.slice(r[0],r[1]))}function representJavascriptFunction(e){return e.toString()}function isFunction(e){return"[object Function]"===Object.prototype.toString.call(e)}module.exports=new Type("tag:yaml.org,2002:js/function",{kind:"scalar",resolve:resolveJavascriptFunction,construct:constructJavascriptFunction,predicate:isFunction,represent:representJavascriptFunction})},{"../../type":47}],53:[function(require,module,exports){"use strict";var Type=require("../../type");function resolveJavascriptRegExp(e){if(null===e)return!1;if(0===e.length)return!1;var r=e,t=/\/([gim]*)$/.exec(e),n="";if("/"===r[0]){if(t&&(n=t[1]),n.length>3)return!1;if("/"!==r[r.length-n.length-1])return!1}return!0}function constructJavascriptRegExp(e){var r=e,t=/\/([gim]*)$/.exec(e),n="";return"/"===r[0]&&(t&&(n=t[1]),r=r.slice(1,r.length-n.length-1)),new RegExp(r,n)}function representJavascriptRegExp(e){var r="/"+e.source+"/";return e.global&&(r+="g"),e.multiline&&(r+="m"),e.ignoreCase&&(r+="i"),r}function isRegExp(e){return"[object RegExp]"===Object.prototype.toString.call(e)}module.exports=new Type("tag:yaml.org,2002:js/regexp",{kind:"scalar",resolve:resolveJavascriptRegExp,construct:constructJavascriptRegExp,predicate:isRegExp,represent:representJavascriptRegExp})},{"../../type":47}],54:[function(require,module,exports){"use strict";var Type=require("../../type");function resolveJavascriptUndefined(){return!0}function constructJavascriptUndefined(){}function representJavascriptUndefined(){return""}function isUndefined(e){return void 0===e}module.exports=new Type("tag:yaml.org,2002:js/undefined",{kind:"scalar",resolve:resolveJavascriptUndefined,construct:constructJavascriptUndefined,predicate:isUndefined,represent:representJavascriptUndefined})},{"../../type":47}],55:[function(require,module,exports){"use strict";var Type=require("../type");module.exports=new Type("tag:yaml.org,2002:map",{kind:"mapping",construct:function(e){return null!==e?e:{}}})},{"../type":47}],56:[function(require,module,exports){"use strict";var Type=require("../type");function resolveYamlMerge(e){return"<<"===e||null===e}module.exports=new Type("tag:yaml.org,2002:merge",{kind:"scalar",resolve:resolveYamlMerge})},{"../type":47}],57:[function(require,module,exports){"use strict";var Type=require("../type");function resolveYamlNull(l){if(null===l)return!0;var e=l.length;return 1===e&&"~"===l||4===e&&("null"===l||"Null"===l||"NULL"===l)}function constructYamlNull(){return null}function isNull(l){return null===l}module.exports=new Type("tag:yaml.org,2002:null",{kind:"scalar",resolve:resolveYamlNull,construct:constructYamlNull,predicate:isNull,represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"}},defaultStyle:"lowercase"})},{"../type":47}],58:[function(require,module,exports){"use strict";var Type=require("../type"),_hasOwnProperty=Object.prototype.hasOwnProperty,_toString=Object.prototype.toString;function resolveYamlOmap(r){if(null===r)return!0;var t,e,n,o,u,a=[],l=r;for(t=0,e=l.length;t<e;t+=1){if(n=l[t],u=!1,"[object Object]"!==_toString.call(n))return!1;for(o in n)if(_hasOwnProperty.call(n,o)){if(u)return!1;u=!0}if(!u)return!1;if(-1!==a.indexOf(o))return!1;a.push(o)}return!0}function constructYamlOmap(r){return null!==r?r:[]}module.exports=new Type("tag:yaml.org,2002:omap",{kind:"sequence",resolve:resolveYamlOmap,construct:constructYamlOmap})},{"../type":47}],59:[function(require,module,exports){"use strict";var Type=require("../type"),_toString=Object.prototype.toString;function resolveYamlPairs(r){if(null===r)return!0;var e,t,n,l,o,a=r;for(o=new Array(a.length),e=0,t=a.length;e<t;e+=1){if(n=a[e],"[object Object]"!==_toString.call(n))return!1;if(1!==(l=Object.keys(n)).length)return!1;o[e]=[l[0],n[l[0]]]}return!0}function constructYamlPairs(r){if(null===r)return[];var e,t,n,l,o,a=r;for(o=new Array(a.length),e=0,t=a.length;e<t;e+=1)n=a[e],l=Object.keys(n),o[e]=[l[0],n[l[0]]];return o}module.exports=new Type("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:resolveYamlPairs,construct:constructYamlPairs})},{"../type":47}],60:[function(require,module,exports){"use strict";var Type=require("../type");module.exports=new Type("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(e){return null!==e?e:[]}})},{"../type":47}],61:[function(require,module,exports){"use strict";var Type=require("../type"),_hasOwnProperty=Object.prototype.hasOwnProperty;function resolveYamlSet(e){if(null===e)return!0;var r,t=e;for(r in t)if(_hasOwnProperty.call(t,r)&&null!==t[r])return!1;return!0}function constructYamlSet(e){return null!==e?e:{}}module.exports=new Type("tag:yaml.org,2002:set",{kind:"mapping",resolve:resolveYamlSet,construct:constructYamlSet})},{"../type":47}],62:[function(require,module,exports){"use strict";var Type=require("../type");module.exports=new Type("tag:yaml.org,2002:str",{kind:"scalar",construct:function(r){return null!==r?r:""}})},{"../type":47}],63:[function(require,module,exports){"use strict";var Type=require("../type"),YAML_DATE_REGEXP=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),YAML_TIMESTAMP_REGEXP=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function resolveYamlTimestamp(e){return null!==e&&(null!==YAML_DATE_REGEXP.exec(e)||null!==YAML_TIMESTAMP_REGEXP.exec(e))}function constructYamlTimestamp(e){var t,r,n,l,a,m,s,T,i=0,E=null;if(null===(t=YAML_DATE_REGEXP.exec(e))&&(t=YAML_TIMESTAMP_REGEXP.exec(e)),null===t)throw new Error("Date resolve error");if(r=+t[1],n=+t[2]-1,l=+t[3],!t[4])return new Date(Date.UTC(r,n,l));if(a=+t[4],m=+t[5],s=+t[6],t[7]){for(i=t[7].slice(0,3);i.length<3;)i+="0";i=+i}return t[9]&&(E=6e4*(60*+t[10]+ +(t[11]||0)),"-"===t[9]&&(E=-E)),T=new Date(Date.UTC(r,n,l,a,m,s,i)),E&&T.setTime(T.getTime()-E),T}function representYamlTimestamp(e){return e.toISOString()}module.exports=new Type("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:resolveYamlTimestamp,construct:constructYamlTimestamp,instanceOf:Date,represent:representYamlTimestamp})},{"../type":47}],64:[function(require,module,exports){"use strict";var format=require("format-util"),slice=Array.prototype.slice,protectedProperties=["name","message","stack"],errorPrototypeProperties=["name","message","description","number","code","fileName","lineNumber","columnNumber","sourceURL","line","column","stack"];function create(e){return function(r,t,o,n){var a=[],c="";"string"==typeof r?(a=slice.call(arguments),r=t=void 0):"string"==typeof t?(a=slice.call(arguments,1),t=void 0):"string"==typeof o&&(a=slice.call(arguments,2)),a.length>0&&(c=module.exports.formatter.apply(null,a)),r&&r.message&&(c+=(c?" \n":"")+r.message);var i=new e(c);return extendError(i,r),extendToJSON(i),extend(i,t),i}}function extendError(e,r){extendStack(e,r),extend(e,r)}function extendToJSON(e){e.toJSON=errorToJSON,e.inspect=errorToString}function extend(e,r){if(r&&"object"==typeof r)for(var t=Object.keys(r),o=0;o<t.length;o++){var n=t[o];if(!(protectedProperties.indexOf(n)>=0))try{e[n]=r[n]}catch(e){}}}function errorToJSON(){var e={},r=Object.keys(this);r=r.concat(errorPrototypeProperties);for(var t=0;t<r.length;t++){var o=r[t],n=this[o],a=typeof n;"undefined"!==a&&"function"!==a&&(e[o]=n)}return e}function errorToString(){return JSON.stringify(this,null,2).replace(/\\n/g,"\n")}function extendStack(e,r){hasLazyStack(e)?r?lazyJoinStacks(e,r):lazyPopStack(e):e.stack=r?joinStacks(e.stack,r.stack):popStack(e.stack)}function joinStacks(e,r){return(e=popStack(e))&&r?e+"\n\n"+r:e||r}function popStack(e){if(e){var r=e.split("\n");if(r.length<2)return e;for(var t=0;t<r.length;t++){if(r[t].indexOf("onoFactory")>=0)return r.splice(t,1),r.join("\n")}return e}}module.exports=create(Error),module.exports.error=create(Error),module.exports.eval=create(EvalError),module.exports.range=create(RangeError),module.exports.reference=create(ReferenceError),module.exports.syntax=create(SyntaxError),module.exports.type=create(TypeError),module.exports.uri=create(URIError),module.exports.formatter=format;var supportsLazyStack=!(!Object.getOwnPropertyDescriptor||!Object.defineProperty||"undefined"!=typeof navigator&&/Android/.test(navigator.userAgent));function hasLazyStack(e){if(!supportsLazyStack)return!1;var r=Object.getOwnPropertyDescriptor(e,"stack");return!!r&&"function"==typeof r.get}function lazyJoinStacks(e,r){var t=Object.getOwnPropertyDescriptor(e,"stack");Object.defineProperty(e,"stack",{get:function(){return joinStacks(t.get.apply(e),r.stack)},enumerable:!1,configurable:!0})}function lazyPopStack(e){var r=Object.getOwnPropertyDescriptor(e,"stack");Object.defineProperty(e,"stack",{get:function(){return popStack(r.get.apply(e))},enumerable:!1,configurable:!0})}},{"format-util":28}],65:[function(require,module,exports){(function(process){"use strict";function nextTick(e,n,c,r){if("function"!=typeof e)throw new TypeError('"callback" argument must be a function');var s,t,o=arguments.length;switch(o){case 0:case 1:return process.nextTick(e);case 2:return process.nextTick(function(){e.call(null,n)});case 3:return process.nextTick(function(){e.call(null,n,c)});case 4:return process.nextTick(function(){e.call(null,n,c,r)});default:for(s=new Array(o-1),t=0;t<s.length;)s[t++]=arguments[t];return process.nextTick(function(){e.apply(null,s)})}}!process.version||0===process.version.indexOf("v0.")||0===process.version.indexOf("v1.")&&0!==process.version.indexOf("v1.8.")?module.exports={nextTick:nextTick}:module.exports=process}).call(this,require("_process"))},{_process:66}],66:[function(require,module,exports){var cachedSetTimeout,cachedClearTimeout,process=module.exports={};function defaultSetTimout(){throw new Error("setTimeout has not been defined")}function defaultClearTimeout(){throw new Error("clearTimeout has not been defined")}function runTimeout(e){if(cachedSetTimeout===setTimeout)return setTimeout(e,0);if((cachedSetTimeout===defaultSetTimout||!cachedSetTimeout)&&setTimeout)return cachedSetTimeout=setTimeout,setTimeout(e,0);try{return cachedSetTimeout(e,0)}catch(t){try{return cachedSetTimeout.call(null,e,0)}catch(t){return cachedSetTimeout.call(this,e,0)}}}function runClearTimeout(e){if(cachedClearTimeout===clearTimeout)return clearTimeout(e);if((cachedClearTimeout===defaultClearTimeout||!cachedClearTimeout)&&clearTimeout)return cachedClearTimeout=clearTimeout,clearTimeout(e);try{return cachedClearTimeout(e)}catch(t){try{return cachedClearTimeout.call(null,e)}catch(t){return cachedClearTimeout.call(this,e)}}}!function(){try{cachedSetTimeout="function"==typeof setTimeout?setTimeout:defaultSetTimout}catch(e){cachedSetTimeout=defaultSetTimout}try{cachedClearTimeout="function"==typeof clearTimeout?clearTimeout:defaultClearTimeout}catch(e){cachedClearTimeout=defaultClearTimeout}}();var currentQueue,queue=[],draining=!1,queueIndex=-1;function cleanUpNextTick(){draining&&currentQueue&&(draining=!1,currentQueue.length?queue=currentQueue.concat(queue):queueIndex=-1,queue.length&&drainQueue())}function drainQueue(){if(!draining){var e=runTimeout(cleanUpNextTick);draining=!0;for(var t=queue.length;t;){for(currentQueue=queue,queue=[];++queueIndex<t;)currentQueue&&currentQueue[queueIndex].run();queueIndex=-1,t=queue.length}currentQueue=null,draining=!1,runClearTimeout(e)}}function Item(e,t){this.fun=e,this.array=t}function noop(){}process.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)t[r-1]=arguments[r];queue.push(new Item(e,t)),1!==queue.length||draining||runTimeout(drainQueue)},Item.prototype.run=function(){this.fun.apply(null,this.array)},process.title="browser",process.browser=!0,process.env={},process.argv=[],process.version="",process.versions={},process.on=noop,process.addListener=noop,process.once=noop,process.off=noop,process.removeListener=noop,process.removeAllListeners=noop,process.emit=noop,process.prependListener=noop,process.prependOnceListener=noop,process.listeners=function(e){return[]},process.binding=function(e){throw new Error("process.binding is not supported")},process.cwd=function(){return"/"},process.chdir=function(e){throw new Error("process.chdir is not supported")},process.umask=function(){return 0}},{}],67:[function(require,module,exports){"use strict";function hasOwnProperty(r,e){return Object.prototype.hasOwnProperty.call(r,e)}module.exports=function(r,e,t,n){e=e||"&",t=t||"=";var o={};if("string"!=typeof r||0===r.length)return o;var a=/\+/g;r=r.split(e);var s=1e3;n&&"number"==typeof n.maxKeys&&(s=n.maxKeys);var p=r.length;s>0&&p>s&&(p=s);for(var y=0;y<p;++y){var u,c,i,l,f=r[y].replace(a,"%20"),v=f.indexOf(t);v>=0?(u=f.substr(0,v),c=f.substr(v+1)):(u=f,c=""),i=decodeURIComponent(u),l=decodeURIComponent(c),hasOwnProperty(o,i)?isArray(o[i])?o[i].push(l):o[i]=[o[i],l]:o[i]=l}return o};var isArray=Array.isArray||function(r){return"[object Array]"===Object.prototype.toString.call(r)}},{}],68:[function(require,module,exports){"use strict";var stringifyPrimitive=function(r){switch(typeof r){case"string":return r;case"boolean":return r?"true":"false";case"number":return isFinite(r)?r:"";default:return""}};module.exports=function(r,e,t,n){return e=e||"&",t=t||"=",null===r&&(r=void 0),"object"==typeof r?map(objectKeys(r),function(n){var i=encodeURIComponent(stringifyPrimitive(n))+t;return isArray(r[n])?map(r[n],function(r){return i+encodeURIComponent(stringifyPrimitive(r))}).join(e):i+encodeURIComponent(stringifyPrimitive(r[n]))}).join(e):n?encodeURIComponent(stringifyPrimitive(n))+t+encodeURIComponent(stringifyPrimitive(r)):""};var isArray=Array.isArray||function(r){return"[object Array]"===Object.prototype.toString.call(r)};function map(r,e){if(r.map)return r.map(e);for(var t=[],n=0;n<r.length;n++)t.push(e(r[n],n));return t}var objectKeys=Object.keys||function(r){var e=[];for(var t in r)Object.prototype.hasOwnProperty.call(r,t)&&e.push(t);return e}},{}],69:[function(require,module,exports){"use strict";exports.decode=exports.parse=require("./decode"),exports.encode=exports.stringify=require("./encode")},{"./decode":67,"./encode":68}],70:[function(require,module,exports){"use strict";var pna=require("process-nextick-args"),objectKeys=Object.keys||function(e){var t=[];for(var r in e)t.push(r);return t};module.exports=Duplex;var util=require("core-util-is");util.inherits=require("inherits");var Readable=require("./_stream_readable"),Writable=require("./_stream_writable");util.inherits(Duplex,Readable);for(var keys=objectKeys(Writable.prototype),v=0;v<keys.length;v++){var method=keys[v];Duplex.prototype[method]||(Duplex.prototype[method]=Writable.prototype[method])}function Duplex(e){if(!(this instanceof Duplex))return new Duplex(e);Readable.call(this,e),Writable.call(this,e),e&&!1===e.readable&&(this.readable=!1),e&&!1===e.writable&&(this.writable=!1),this.allowHalfOpen=!0,e&&!1===e.allowHalfOpen&&(this.allowHalfOpen=!1),this.once("end",onend)}function onend(){this.allowHalfOpen||this._writableState.ended||pna.nextTick(onEndNT,this)}function onEndNT(e){e.end()}Object.defineProperty(Duplex.prototype,"writableHighWaterMark",{enumerable:!1,get:function(){return this._writableState.highWaterMark}}),Object.defineProperty(Duplex.prototype,"destroyed",{get:function(){return void 0!==this._readableState&&void 0!==this._writableState&&(this._readableState.destroyed&&this._writableState.destroyed)},set:function(e){void 0!==this._readableState&&void 0!==this._writableState&&(this._readableState.destroyed=e,this._writableState.destroyed=e)}}),Duplex.prototype._destroy=function(e,t){this.push(null),this.end(),pna.nextTick(t,e)}},{"./_stream_readable":72,"./_stream_writable":74,"core-util-is":26,inherits:31,"process-nextick-args":65}],71:[function(require,module,exports){"use strict";module.exports=PassThrough;var Transform=require("./_stream_transform"),util=require("core-util-is");function PassThrough(r){if(!(this instanceof PassThrough))return new PassThrough(r);Transform.call(this,r)}util.inherits=require("inherits"),util.inherits(PassThrough,Transform),PassThrough.prototype._transform=function(r,s,i){i(null,r)}},{"./_stream_transform":73,"core-util-is":26,inherits:31}],72:[function(require,module,exports){(function(process,global){"use strict";var pna=require("process-nextick-args");module.exports=Readable;var Duplex,isArray=require("isarray");Readable.ReadableState=ReadableState;var EE=require("events").EventEmitter,EElistenerCount=function(e,t){return e.listeners(t).length},Stream=require("./internal/streams/stream"),Buffer=require("safe-buffer").Buffer,OurUint8Array=global.Uint8Array||function(){};function _uint8ArrayToBuffer(e){return Buffer.from(e)}function _isUint8Array(e){return Buffer.isBuffer(e)||e instanceof OurUint8Array}var util=require("core-util-is");util.inherits=require("inherits");var debugUtil=require("util"),debug=void 0;debug=debugUtil&&debugUtil.debuglog?debugUtil.debuglog("stream"):function(){};var StringDecoder,BufferList=require("./internal/streams/BufferList"),destroyImpl=require("./internal/streams/destroy");util.inherits(Readable,Stream);var kProxyEvents=["error","close","destroy","pause","resume"];function prependListener(e,t,r){if("function"==typeof e.prependListener)return e.prependListener(t,r);e._events&&e._events[t]?isArray(e._events[t])?e._events[t].unshift(r):e._events[t]=[r,e._events[t]]:e.on(t,r)}function ReadableState(e,t){e=e||{};var r=t instanceof(Duplex=Duplex||require("./_stream_duplex"));this.objectMode=!!e.objectMode,r&&(this.objectMode=this.objectMode||!!e.readableObjectMode);var n=e.highWaterMark,a=e.readableHighWaterMark,i=this.objectMode?16:16384;this.highWaterMark=n||0===n?n:r&&(a||0===a)?a:i,this.highWaterMark=Math.floor(this.highWaterMark),this.buffer=new BufferList,this.length=0,this.pipes=null,this.pipesCount=0,this.flowing=null,this.ended=!1,this.endEmitted=!1,this.reading=!1,this.sync=!0,this.needReadable=!1,this.emittedReadable=!1,this.readableListening=!1,this.resumeScheduled=!1,this.destroyed=!1,this.defaultEncoding=e.defaultEncoding||"utf8",this.awaitDrain=0,this.readingMore=!1,this.decoder=null,this.encoding=null,e.encoding&&(StringDecoder||(StringDecoder=require("string_decoder/").StringDecoder),this.decoder=new StringDecoder(e.encoding),this.encoding=e.encoding)}function Readable(e){if(Duplex=Duplex||require("./_stream_duplex"),!(this instanceof Readable))return new Readable(e);this._readableState=new ReadableState(e,this),this.readable=!0,e&&("function"==typeof e.read&&(this._read=e.read),"function"==typeof e.destroy&&(this._destroy=e.destroy)),Stream.call(this)}function readableAddChunk(e,t,r,n,a){var i,d=e._readableState;null===t?(d.reading=!1,onEofChunk(e,d)):(a||(i=chunkInvalid(d,t)),i?e.emit("error",i):d.objectMode||t&&t.length>0?("string"==typeof t||d.objectMode||Object.getPrototypeOf(t)===Buffer.prototype||(t=_uint8ArrayToBuffer(t)),n?d.endEmitted?e.emit("error",new Error("stream.unshift() after end event")):addChunk(e,d,t,!0):d.ended?e.emit("error",new Error("stream.push() after EOF")):(d.reading=!1,d.decoder&&!r?(t=d.decoder.write(t),d.objectMode||0!==t.length?addChunk(e,d,t,!1):maybeReadMore(e,d)):addChunk(e,d,t,!1))):n||(d.reading=!1));return needMoreData(d)}function addChunk(e,t,r,n){t.flowing&&0===t.length&&!t.sync?(e.emit("data",r),e.read(0)):(t.length+=t.objectMode?1:r.length,n?t.buffer.unshift(r):t.buffer.push(r),t.needReadable&&emitReadable(e)),maybeReadMore(e,t)}function chunkInvalid(e,t){var r;return _isUint8Array(t)||"string"==typeof t||void 0===t||e.objectMode||(r=new TypeError("Invalid non-string/buffer chunk")),r}function needMoreData(e){return!e.ended&&(e.needReadable||e.length<e.highWaterMark||0===e.length)}Object.defineProperty(Readable.prototype,"destroyed",{get:function(){return void 0!==this._readableState&&this._readableState.destroyed},set:function(e){this._readableState&&(this._readableState.destroyed=e)}}),Readable.prototype.destroy=destroyImpl.destroy,Readable.prototype._undestroy=destroyImpl.undestroy,Readable.prototype._destroy=function(e,t){this.push(null),t(e)},Readable.prototype.push=function(e,t){var r,n=this._readableState;return n.objectMode?r=!0:"string"==typeof e&&((t=t||n.defaultEncoding)!==n.encoding&&(e=Buffer.from(e,t),t=""),r=!0),readableAddChunk(this,e,t,!1,r)},Readable.prototype.unshift=function(e){return readableAddChunk(this,e,null,!0,!1)},Readable.prototype.isPaused=function(){return!1===this._readableState.flowing},Readable.prototype.setEncoding=function(e){return StringDecoder||(StringDecoder=require("string_decoder/").StringDecoder),this._readableState.decoder=new StringDecoder(e),this._readableState.encoding=e,this};var MAX_HWM=8388608;function computeNewHighWaterMark(e){return e>=MAX_HWM?e=MAX_HWM:(e--,e|=e>>>1,e|=e>>>2,e|=e>>>4,e|=e>>>8,e|=e>>>16,e++),e}function howMuchToRead(e,t){return e<=0||0===t.length&&t.ended?0:t.objectMode?1:e!=e?t.flowing&&t.length?t.buffer.head.data.length:t.length:(e>t.highWaterMark&&(t.highWaterMark=computeNewHighWaterMark(e)),e<=t.length?e:t.ended?t.length:(t.needReadable=!0,0))}function onEofChunk(e,t){if(!t.ended){if(t.decoder){var r=t.decoder.end();r&&r.length&&(t.buffer.push(r),t.length+=t.objectMode?1:r.length)}t.ended=!0,emitReadable(e)}}function emitReadable(e){var t=e._readableState;t.needReadable=!1,t.emittedReadable||(debug("emitReadable",t.flowing),t.emittedReadable=!0,t.sync?pna.nextTick(emitReadable_,e):emitReadable_(e))}function emitReadable_(e){debug("emit readable"),e.emit("readable"),flow(e)}function maybeReadMore(e,t){t.readingMore||(t.readingMore=!0,pna.nextTick(maybeReadMore_,e,t))}function maybeReadMore_(e,t){for(var r=t.length;!t.reading&&!t.flowing&&!t.ended&&t.length<t.highWaterMark&&(debug("maybeReadMore read 0"),e.read(0),r!==t.length);)r=t.length;t.readingMore=!1}function pipeOnDrain(e){return function(){var t=e._readableState;debug("pipeOnDrain",t.awaitDrain),t.awaitDrain&&t.awaitDrain--,0===t.awaitDrain&&EElistenerCount(e,"data")&&(t.flowing=!0,flow(e))}}function nReadingNextTick(e){debug("readable nexttick read 0"),e.read(0)}function resume(e,t){t.resumeScheduled||(t.resumeScheduled=!0,pna.nextTick(resume_,e,t))}function resume_(e,t){t.reading||(debug("resume read 0"),e.read(0)),t.resumeScheduled=!1,t.awaitDrain=0,e.emit("resume"),flow(e),t.flowing&&!t.reading&&e.read(0)}function flow(e){var t=e._readableState;for(debug("flow",t.flowing);t.flowing&&null!==e.read(););}function fromList(e,t){return 0===t.length?null:(t.objectMode?r=t.buffer.shift():!e||e>=t.length?(r=t.decoder?t.buffer.join(""):1===t.buffer.length?t.buffer.head.data:t.buffer.concat(t.length),t.buffer.clear()):r=fromListPartial(e,t.buffer,t.decoder),r);var r}function fromListPartial(e,t,r){var n;return e<t.head.data.length?(n=t.head.data.slice(0,e),t.head.data=t.head.data.slice(e)):n=e===t.head.data.length?t.shift():r?copyFromBufferString(e,t):copyFromBuffer(e,t),n}function copyFromBufferString(e,t){var r=t.head,n=1,a=r.data;for(e-=a.length;r=r.next;){var i=r.data,d=e>i.length?i.length:e;if(d===i.length?a+=i:a+=i.slice(0,e),0===(e-=d)){d===i.length?(++n,r.next?t.head=r.next:t.head=t.tail=null):(t.head=r,r.data=i.slice(d));break}++n}return t.length-=n,a}function copyFromBuffer(e,t){var r=Buffer.allocUnsafe(e),n=t.head,a=1;for(n.data.copy(r),e-=n.data.length;n=n.next;){var i=n.data,d=e>i.length?i.length:e;if(i.copy(r,r.length-e,0,d),0===(e-=d)){d===i.length?(++a,n.next?t.head=n.next:t.head=t.tail=null):(t.head=n,n.data=i.slice(d));break}++a}return t.length-=a,r}function endReadable(e){var t=e._readableState;if(t.length>0)throw new Error('"endReadable()" called on non-empty stream');t.endEmitted||(t.ended=!0,pna.nextTick(endReadableNT,t,e))}function endReadableNT(e,t){e.endEmitted||0!==e.length||(e.endEmitted=!0,t.readable=!1,t.emit("end"))}function indexOf(e,t){for(var r=0,n=e.length;r<n;r++)if(e[r]===t)return r;return-1}Readable.prototype.read=function(e){debug("read",e),e=parseInt(e,10);var t=this._readableState,r=e;if(0!==e&&(t.emittedReadable=!1),0===e&&t.needReadable&&(t.length>=t.highWaterMark||t.ended))return debug("read: emitReadable",t.length,t.ended),0===t.length&&t.ended?endReadable(this):emitReadable(this),null;if(0===(e=howMuchToRead(e,t))&&t.ended)return 0===t.length&&endReadable(this),null;var n,a=t.needReadable;return debug("need readable",a),(0===t.length||t.length-e<t.highWaterMark)&&debug("length less than watermark",a=!0),t.ended||t.reading?debug("reading or ended",a=!1):a&&(debug("do read"),t.reading=!0,t.sync=!0,0===t.length&&(t.needReadable=!0),this._read(t.highWaterMark),t.sync=!1,t.reading||(e=howMuchToRead(r,t))),null===(n=e>0?fromList(e,t):null)?(t.needReadable=!0,e=0):t.length-=e,0===t.length&&(t.ended||(t.needReadable=!0),r!==e&&t.ended&&endReadable(this)),null!==n&&this.emit("data",n),n},Readable.prototype._read=function(e){this.emit("error",new Error("_read() is not implemented"))},Readable.prototype.pipe=function(e,t){var r=this,n=this._readableState;switch(n.pipesCount){case 0:n.pipes=e;break;case 1:n.pipes=[n.pipes,e];break;default:n.pipes.push(e)}n.pipesCount+=1,debug("pipe count=%d opts=%j",n.pipesCount,t);var a=(!t||!1!==t.end)&&e!==process.stdout&&e!==process.stderr?d:b;function i(t,a){debug("onunpipe"),t===r&&a&&!1===a.hasUnpiped&&(a.hasUnpiped=!0,debug("cleanup"),e.removeListener("close",f),e.removeListener("finish",p),e.removeListener("drain",o),e.removeListener("error",h),e.removeListener("unpipe",i),r.removeListener("end",d),r.removeListener("end",b),r.removeListener("data",s),u=!0,!n.awaitDrain||e._writableState&&!e._writableState.needDrain||o())}function d(){debug("onend"),e.end()}n.endEmitted?pna.nextTick(a):r.once("end",a),e.on("unpipe",i);var o=pipeOnDrain(r);e.on("drain",o);var u=!1;var l=!1;function s(t){debug("ondata"),l=!1,!1!==e.write(t)||l||((1===n.pipesCount&&n.pipes===e||n.pipesCount>1&&-1!==indexOf(n.pipes,e))&&!u&&(debug("false write response, pause",r._readableState.awaitDrain),r._readableState.awaitDrain++,l=!0),r.pause())}function h(t){debug("onerror",t),b(),e.removeListener("error",h),0===EElistenerCount(e,"error")&&e.emit("error",t)}function f(){e.removeListener("finish",p),b()}function p(){debug("onfinish"),e.removeListener("close",f),b()}function b(){debug("unpipe"),r.unpipe(e)}return r.on("data",s),prependListener(e,"error",h),e.once("close",f),e.once("finish",p),e.emit("pipe",r),n.flowing||(debug("pipe resume"),r.resume()),e},Readable.prototype.unpipe=function(e){var t=this._readableState,r={hasUnpiped:!1};if(0===t.pipesCount)return this;if(1===t.pipesCount)return e&&e!==t.pipes?this:(e||(e=t.pipes),t.pipes=null,t.pipesCount=0,t.flowing=!1,e&&e.emit("unpipe",this,r),this);if(!e){var n=t.pipes,a=t.pipesCount;t.pipes=null,t.pipesCount=0,t.flowing=!1;for(var i=0;i<a;i++)n[i].emit("unpipe",this,r);return this}var d=indexOf(t.pipes,e);return-1===d?this:(t.pipes.splice(d,1),t.pipesCount-=1,1===t.pipesCount&&(t.pipes=t.pipes[0]),e.emit("unpipe",this,r),this)},Readable.prototype.on=function(e,t){var r=Stream.prototype.on.call(this,e,t);if("data"===e)!1!==this._readableState.flowing&&this.resume();else if("readable"===e){var n=this._readableState;n.endEmitted||n.readableListening||(n.readableListening=n.needReadable=!0,n.emittedReadable=!1,n.reading?n.length&&emitReadable(this):pna.nextTick(nReadingNextTick,this))}return r},Readable.prototype.addListener=Readable.prototype.on,Readable.prototype.resume=function(){var e=this._readableState;return e.flowing||(debug("resume"),e.flowing=!0,resume(this,e)),this},Readable.prototype.pause=function(){return debug("call pause flowing=%j",this._readableState.flowing),!1!==this._readableState.flowing&&(debug("pause"),this._readableState.flowing=!1,this.emit("pause")),this},Readable.prototype.wrap=function(e){var t=this,r=this._readableState,n=!1;for(var a in e.on("end",function(){if(debug("wrapped end"),r.decoder&&!r.ended){var e=r.decoder.end();e&&e.length&&t.push(e)}t.push(null)}),e.on("data",function(a){(debug("wrapped data"),r.decoder&&(a=r.decoder.write(a)),r.objectMode&&null==a)||(r.objectMode||a&&a.length)&&(t.push(a)||(n=!0,e.pause()))}),e)void 0===this[a]&&"function"==typeof e[a]&&(this[a]=function(t){return function(){return e[t].apply(e,arguments)}}(a));for(var i=0;i<kProxyEvents.length;i++)e.on(kProxyEvents[i],this.emit.bind(this,kProxyEvents[i]));return this._read=function(t){debug("wrapped _read",t),n&&(n=!1,e.resume())},this},Object.defineProperty(Readable.prototype,"readableHighWaterMark",{enumerable:!1,get:function(){return this._readableState.highWaterMark}}),Readable._fromList=fromList}).call(this,require("_process"),typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{"./_stream_duplex":70,"./internal/streams/BufferList":75,"./internal/streams/destroy":76,"./internal/streams/stream":77,_process:66,"core-util-is":26,events:27,inherits:31,isarray:33,"process-nextick-args":65,"safe-buffer":79,"string_decoder/":84,util:21}],73:[function(require,module,exports){"use strict";module.exports=Transform;var Duplex=require("./_stream_duplex"),util=require("core-util-is");function afterTransform(r,t){var n=this._transformState;n.transforming=!1;var e=n.writecb;if(!e)return this.emit("error",new Error("write callback called multiple times"));n.writechunk=null,n.writecb=null,null!=t&&this.push(t),e(r);var i=this._readableState;i.reading=!1,(i.needReadable||i.length<i.highWaterMark)&&this._read(i.highWaterMark)}function Transform(r){if(!(this instanceof Transform))return new Transform(r);Duplex.call(this,r),this._transformState={afterTransform:afterTransform.bind(this),needTransform:!1,transforming:!1,writecb:null,writechunk:null,writeencoding:null},this._readableState.needReadable=!0,this._readableState.sync=!1,r&&("function"==typeof r.transform&&(this._transform=r.transform),"function"==typeof r.flush&&(this._flush=r.flush)),this.on("prefinish",prefinish)}function prefinish(){var r=this;"function"==typeof this._flush?this._flush(function(t,n){done(r,t,n)}):done(this,null,null)}function done(r,t,n){if(t)return r.emit("error",t);if(null!=n&&r.push(n),r._writableState.length)throw new Error("Calling transform done when ws.length != 0");if(r._transformState.transforming)throw new Error("Calling transform done when still transforming");return r.push(null)}util.inherits=require("inherits"),util.inherits(Transform,Duplex),Transform.prototype.push=function(r,t){return this._transformState.needTransform=!1,Duplex.prototype.push.call(this,r,t)},Transform.prototype._transform=function(r,t,n){throw new Error("_transform() is not implemented")},Transform.prototype._write=function(r,t,n){var e=this._transformState;if(e.writecb=n,e.writechunk=r,e.writeencoding=t,!e.transforming){var i=this._readableState;(e.needTransform||i.needReadable||i.length<i.highWaterMark)&&this._read(i.highWaterMark)}},Transform.prototype._read=function(r){var t=this._transformState;null!==t.writechunk&&t.writecb&&!t.transforming?(t.transforming=!0,this._transform(t.writechunk,t.writeencoding,t.afterTransform)):t.needTransform=!0},Transform.prototype._destroy=function(r,t){var n=this;Duplex.prototype._destroy.call(this,r,function(r){t(r),n.emit("close")})}},{"./_stream_duplex":70,"core-util-is":26,inherits:31}],74:[function(require,module,exports){(function(process,global,setImmediate){"use strict";var pna=require("process-nextick-args");function WriteReq(e,t,r){this.chunk=e,this.encoding=t,this.callback=r,this.next=null}function CorkedRequest(e){var t=this;this.next=null,this.entry=null,this.finish=function(){onCorkedFinish(t,e)}}module.exports=Writable;var Duplex,asyncWrite=!process.browser&&["v0.10","v0.9."].indexOf(process.version.slice(0,5))>-1?setImmediate:pna.nextTick;Writable.WritableState=WritableState;var util=require("core-util-is");util.inherits=require("inherits");var internalUtil={deprecate:require("util-deprecate")},Stream=require("./internal/streams/stream"),Buffer=require("safe-buffer").Buffer,OurUint8Array=global.Uint8Array||function(){};function _uint8ArrayToBuffer(e){return Buffer.from(e)}function _isUint8Array(e){return Buffer.isBuffer(e)||e instanceof OurUint8Array}var realHasInstance,destroyImpl=require("./internal/streams/destroy");function nop(){}function WritableState(e,t){Duplex=Duplex||require("./_stream_duplex"),e=e||{};var r=t instanceof Duplex;this.objectMode=!!e.objectMode,r&&(this.objectMode=this.objectMode||!!e.writableObjectMode);var i=e.highWaterMark,n=e.writableHighWaterMark,o=this.objectMode?16:16384;this.highWaterMark=i||0===i?i:r&&(n||0===n)?n:o,this.highWaterMark=Math.floor(this.highWaterMark),this.finalCalled=!1,this.needDrain=!1,this.ending=!1,this.ended=!1,this.finished=!1,this.destroyed=!1;var a=!1===e.decodeStrings;this.decodeStrings=!a,this.defaultEncoding=e.defaultEncoding||"utf8",this.length=0,this.writing=!1,this.corked=0,this.sync=!0,this.bufferProcessing=!1,this.onwrite=function(e){onwrite(t,e)},this.writecb=null,this.writelen=0,this.bufferedRequest=null,this.lastBufferedRequest=null,this.pendingcb=0,this.prefinished=!1,this.errorEmitted=!1,this.bufferedRequestCount=0,this.corkedRequestsFree=new CorkedRequest(this)}function Writable(e){if(Duplex=Duplex||require("./_stream_duplex"),!(realHasInstance.call(Writable,this)||this instanceof Duplex))return new Writable(e);this._writableState=new WritableState(e,this),this.writable=!0,e&&("function"==typeof e.write&&(this._write=e.write),"function"==typeof e.writev&&(this._writev=e.writev),"function"==typeof e.destroy&&(this._destroy=e.destroy),"function"==typeof e.final&&(this._final=e.final)),Stream.call(this)}function writeAfterEnd(e,t){var r=new Error("write after end");e.emit("error",r),pna.nextTick(t,r)}function validChunk(e,t,r,i){var n=!0,o=!1;return null===r?o=new TypeError("May not write null values to stream"):"string"==typeof r||void 0===r||t.objectMode||(o=new TypeError("Invalid non-string/buffer chunk")),o&&(e.emit("error",o),pna.nextTick(i,o),n=!1),n}function decodeChunk(e,t,r){return e.objectMode||!1===e.decodeStrings||"string"!=typeof t||(t=Buffer.from(t,r)),t}function writeOrBuffer(e,t,r,i,n,o){if(!r){var a=decodeChunk(t,i,n);i!==a&&(r=!0,n="buffer",i=a)}var s=t.objectMode?1:i.length;t.length+=s;var f=t.length<t.highWaterMark;if(f||(t.needDrain=!0),t.writing||t.corked){var u=t.lastBufferedRequest;t.lastBufferedRequest={chunk:i,encoding:n,isBuf:r,callback:o,next:null},u?u.next=t.lastBufferedRequest:t.bufferedRequest=t.lastBufferedRequest,t.bufferedRequestCount+=1}else doWrite(e,t,!1,s,i,n,o);return f}function doWrite(e,t,r,i,n,o,a){t.writelen=i,t.writecb=a,t.writing=!0,t.sync=!0,r?e._writev(n,t.onwrite):e._write(n,o,t.onwrite),t.sync=!1}function onwriteError(e,t,r,i,n){--t.pendingcb,r?(pna.nextTick(n,i),pna.nextTick(finishMaybe,e,t),e._writableState.errorEmitted=!0,e.emit("error",i)):(n(i),e._writableState.errorEmitted=!0,e.emit("error",i),finishMaybe(e,t))}function onwriteStateUpdate(e){e.writing=!1,e.writecb=null,e.length-=e.writelen,e.writelen=0}function onwrite(e,t){var r=e._writableState,i=r.sync,n=r.writecb;if(onwriteStateUpdate(r),t)onwriteError(e,r,i,t,n);else{var o=needFinish(r);o||r.corked||r.bufferProcessing||!r.bufferedRequest||clearBuffer(e,r),i?asyncWrite(afterWrite,e,r,o,n):afterWrite(e,r,o,n)}}function afterWrite(e,t,r,i){r||onwriteDrain(e,t),t.pendingcb--,i(),finishMaybe(e,t)}function onwriteDrain(e,t){0===t.length&&t.needDrain&&(t.needDrain=!1,e.emit("drain"))}function clearBuffer(e,t){t.bufferProcessing=!0;var r=t.bufferedRequest;if(e._writev&&r&&r.next){var i=t.bufferedRequestCount,n=new Array(i),o=t.corkedRequestsFree;o.entry=r;for(var a=0,s=!0;r;)n[a]=r,r.isBuf||(s=!1),r=r.next,a+=1;n.allBuffers=s,doWrite(e,t,!0,t.length,n,"",o.finish),t.pendingcb++,t.lastBufferedRequest=null,o.next?(t.corkedRequestsFree=o.next,o.next=null):t.corkedRequestsFree=new CorkedRequest(t),t.bufferedRequestCount=0}else{for(;r;){var f=r.chunk,u=r.encoding,l=r.callback;if(doWrite(e,t,!1,t.objectMode?1:f.length,f,u,l),r=r.next,t.bufferedRequestCount--,t.writing)break}null===r&&(t.lastBufferedRequest=null)}t.bufferedRequest=r,t.bufferProcessing=!1}function needFinish(e){return e.ending&&0===e.length&&null===e.bufferedRequest&&!e.finished&&!e.writing}function callFinal(e,t){e._final(function(r){t.pendingcb--,r&&e.emit("error",r),t.prefinished=!0,e.emit("prefinish"),finishMaybe(e,t)})}function prefinish(e,t){t.prefinished||t.finalCalled||("function"==typeof e._final?(t.pendingcb++,t.finalCalled=!0,pna.nextTick(callFinal,e,t)):(t.prefinished=!0,e.emit("prefinish")))}function finishMaybe(e,t){var r=needFinish(t);return r&&(prefinish(e,t),0===t.pendingcb&&(t.finished=!0,e.emit("finish"))),r}function endWritable(e,t,r){t.ending=!0,finishMaybe(e,t),r&&(t.finished?pna.nextTick(r):e.once("finish",r)),t.ended=!0,e.writable=!1}function onCorkedFinish(e,t,r){var i=e.entry;for(e.entry=null;i;){var n=i.callback;t.pendingcb--,n(r),i=i.next}t.corkedRequestsFree?t.corkedRequestsFree.next=e:t.corkedRequestsFree=e}util.inherits(Writable,Stream),WritableState.prototype.getBuffer=function(){for(var e=this.bufferedRequest,t=[];e;)t.push(e),e=e.next;return t},function(){try{Object.defineProperty(WritableState.prototype,"buffer",{get:internalUtil.deprecate(function(){return this.getBuffer()},"_writableState.buffer is deprecated. Use _writableState.getBuffer instead.","DEP0003")})}catch(e){}}(),"function"==typeof Symbol&&Symbol.hasInstance&&"function"==typeof Function.prototype[Symbol.hasInstance]?(realHasInstance=Function.prototype[Symbol.hasInstance],Object.defineProperty(Writable,Symbol.hasInstance,{value:function(e){return!!realHasInstance.call(this,e)||this===Writable&&(e&&e._writableState instanceof WritableState)}})):realHasInstance=function(e){return e instanceof this},Writable.prototype.pipe=function(){this.emit("error",new Error("Cannot pipe, not readable"))},Writable.prototype.write=function(e,t,r){var i=this._writableState,n=!1,o=!i.objectMode&&_isUint8Array(e);return o&&!Buffer.isBuffer(e)&&(e=_uint8ArrayToBuffer(e)),"function"==typeof t&&(r=t,t=null),o?t="buffer":t||(t=i.defaultEncoding),"function"!=typeof r&&(r=nop),i.ended?writeAfterEnd(this,r):(o||validChunk(this,i,e,r))&&(i.pendingcb++,n=writeOrBuffer(this,i,o,e,t,r)),n},Writable.prototype.cork=function(){this._writableState.corked++},Writable.prototype.uncork=function(){var e=this._writableState;e.corked&&(e.corked--,e.writing||e.corked||e.finished||e.bufferProcessing||!e.bufferedRequest||clearBuffer(this,e))},Writable.prototype.setDefaultEncoding=function(e){if("string"==typeof e&&(e=e.toLowerCase()),!(["hex","utf8","utf-8","ascii","binary","base64","ucs2","ucs-2","utf16le","utf-16le","raw"].indexOf((e+"").toLowerCase())>-1))throw new TypeError("Unknown encoding: "+e);return this._writableState.defaultEncoding=e,this},Object.defineProperty(Writable.prototype,"writableHighWaterMark",{enumerable:!1,get:function(){return this._writableState.highWaterMark}}),Writable.prototype._write=function(e,t,r){r(new Error("_write() is not implemented"))},Writable.prototype._writev=null,Writable.prototype.end=function(e,t,r){var i=this._writableState;"function"==typeof e?(r=e,e=null,t=null):"function"==typeof t&&(r=t,t=null),null!=e&&this.write(e,t),i.corked&&(i.corked=1,this.uncork()),i.ending||i.finished||endWritable(this,i,r)},Object.defineProperty(Writable.prototype,"destroyed",{get:function(){return void 0!==this._writableState&&this._writableState.destroyed},set:function(e){this._writableState&&(this._writableState.destroyed=e)}}),Writable.prototype.destroy=destroyImpl.destroy,Writable.prototype._undestroy=destroyImpl.undestroy,Writable.prototype._destroy=function(e,t){this.end(),t(e)}}).call(this,require("_process"),typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{},require("timers").setImmediate)},{"./_stream_duplex":70,"./internal/streams/destroy":76,"./internal/streams/stream":77,_process:66,"core-util-is":26,inherits:31,"process-nextick-args":65,"safe-buffer":79,timers:85,"util-deprecate":89}],75:[function(require,module,exports){"use strict";function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var Buffer=require("safe-buffer").Buffer,util=require("util");function copyBuffer(t,e,i){t.copy(e,i)}module.exports=function(){function t(){_classCallCheck(this,t),this.head=null,this.tail=null,this.length=0}return t.prototype.push=function(t){var e={data:t,next:null};this.length>0?this.tail.next=e:this.head=e,this.tail=e,++this.length},t.prototype.unshift=function(t){var e={data:t,next:this.head};0===this.length&&(this.tail=e),this.head=e,++this.length},t.prototype.shift=function(){if(0!==this.length){var t=this.head.data;return 1===this.length?this.head=this.tail=null:this.head=this.head.next,--this.length,t}},t.prototype.clear=function(){this.head=this.tail=null,this.length=0},t.prototype.join=function(t){if(0===this.length)return"";for(var e=this.head,i=""+e.data;e=e.next;)i+=t+e.data;return i},t.prototype.concat=function(t){if(0===this.length)return Buffer.alloc(0);if(1===this.length)return this.head.data;for(var e=Buffer.allocUnsafe(t>>>0),i=this.head,n=0;i;)copyBuffer(i.data,e,n),n+=i.data.length,i=i.next;return e},t}(),util&&util.inspect&&util.inspect.custom&&(module.exports.prototype[util.inspect.custom]=function(){var t=util.inspect({length:this.length});return this.constructor.name+" "+t})},{"safe-buffer":79,util:21}],76:[function(require,module,exports){"use strict";var pna=require("process-nextick-args");function destroy(t,e){var r=this,a=this._readableState&&this._readableState.destroyed,i=this._writableState&&this._writableState.destroyed;return a||i?(e?e(t):!t||this._writableState&&this._writableState.errorEmitted||pna.nextTick(emitErrorNT,this,t),this):(this._readableState&&(this._readableState.destroyed=!0),this._writableState&&(this._writableState.destroyed=!0),this._destroy(t||null,function(t){!e&&t?(pna.nextTick(emitErrorNT,r,t),r._writableState&&(r._writableState.errorEmitted=!0)):e&&e(t)}),this)}function undestroy(){this._readableState&&(this._readableState.destroyed=!1,this._readableState.reading=!1,this._readableState.ended=!1,this._readableState.endEmitted=!1),this._writableState&&(this._writableState.destroyed=!1,this._writableState.ended=!1,this._writableState.ending=!1,this._writableState.finished=!1,this._writableState.errorEmitted=!1)}function emitErrorNT(t,e){t.emit("error",e)}module.exports={destroy:destroy,undestroy:undestroy}},{"process-nextick-args":65}],77:[function(require,module,exports){module.exports=require("events").EventEmitter},{events:27}],78:[function(require,module,exports){exports=module.exports=require("./lib/_stream_readable.js"),exports.Stream=exports,exports.Readable=exports,exports.Writable=require("./lib/_stream_writable.js"),exports.Duplex=require("./lib/_stream_duplex.js"),exports.Transform=require("./lib/_stream_transform.js"),exports.PassThrough=require("./lib/_stream_passthrough.js")},{"./lib/_stream_duplex.js":70,"./lib/_stream_passthrough.js":71,"./lib/_stream_readable.js":72,"./lib/_stream_transform.js":73,"./lib/_stream_writable.js":74}],79:[function(require,module,exports){var buffer=require("buffer"),Buffer=buffer.Buffer;function copyProps(f,r){for(var e in f)r[e]=f[e]}function SafeBuffer(f,r,e){return Buffer(f,r,e)}Buffer.from&&Buffer.alloc&&Buffer.allocUnsafe&&Buffer.allocUnsafeSlow?module.exports=buffer:(copyProps(buffer,exports),exports.Buffer=SafeBuffer),copyProps(Buffer,SafeBuffer),SafeBuffer.from=function(f,r,e){if("number"==typeof f)throw new TypeError("Argument must not be a number");return Buffer(f,r,e)},SafeBuffer.alloc=function(f,r,e){if("number"!=typeof f)throw new TypeError("Argument must be a number");var u=Buffer(f);return void 0!==r?"string"==typeof e?u.fill(r,e):u.fill(r):u.fill(0),u},SafeBuffer.allocUnsafe=function(f){if("number"!=typeof f)throw new TypeError("Argument must be a number");return Buffer(f)},SafeBuffer.allocUnsafeSlow=function(f){if("number"!=typeof f)throw new TypeError("Argument must be a number");return buffer.SlowBuffer(f)}},{buffer:23}],80:[function(require,module,exports){(function(global){var ClientRequest=require("./lib/request"),response=require("./lib/response"),extend=require("xtend"),statusCodes=require("builtin-status-codes"),url=require("url"),http=exports;http.request=function(e,t){e="string"==typeof e?url.parse(e):extend(e);var r=-1===global.location.protocol.search(/^https?:$/)?"http:":"",s=e.protocol||r,n=e.hostname||e.host,o=e.port,p=e.path||"/";n&&-1!==n.indexOf(":")&&(n="["+n+"]"),e.url=(n?s+"//"+n:"")+(o?":"+o:"")+p,e.method=(e.method||"GET").toUpperCase(),e.headers=e.headers||{};var u=new ClientRequest(e);return t&&u.on("response",t),u},http.get=function(e,t){var r=http.request(e,t);return r.end(),r},http.ClientRequest=ClientRequest,http.IncomingMessage=response.IncomingMessage,http.Agent=function(){},http.Agent.defaultMaxSockets=4,http.globalAgent=new http.Agent,http.STATUS_CODES=statusCodes,http.METHODS=["CHECKOUT","CONNECT","COPY","DELETE","GET","HEAD","LOCK","M-SEARCH","MERGE","MKACTIVITY","MKCOL","MOVE","NOTIFY","OPTIONS","PATCH","POST","PROPFIND","PROPPATCH","PURGE","PUT","REPORT","SEARCH","SUBSCRIBE","TRACE","UNLOCK","UNSUBSCRIBE"]}).call(this,typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{"./lib/request":82,"./lib/response":83,"builtin-status-codes":24,url:87,xtend:90}],81:[function(require,module,exports){(function(global){exports.fetch=isFunction(global.fetch)&&isFunction(global.ReadableStream),exports.writableStream=isFunction(global.WritableStream),exports.abortController=isFunction(global.AbortController),exports.blobConstructor=!1;try{new Blob([new ArrayBuffer(1)]),exports.blobConstructor=!0}catch(r){}var xhr;function getXHR(){if(void 0!==xhr)return xhr;if(global.XMLHttpRequest){xhr=new global.XMLHttpRequest;try{xhr.open("GET",global.XDomainRequest?"/":"https://example.com")}catch(r){xhr=null}}else xhr=null;return xhr}function checkTypeSupport(r){var e=getXHR();if(!e)return!1;try{return e.responseType=r,e.responseType===r}catch(r){}return!1}var haveArrayBuffer=void 0!==global.ArrayBuffer,haveSlice=haveArrayBuffer&&isFunction(global.ArrayBuffer.prototype.slice);function isFunction(r){return"function"==typeof r}exports.arraybuffer=exports.fetch||haveArrayBuffer&&checkTypeSupport("arraybuffer"),exports.msstream=!exports.fetch&&haveSlice&&checkTypeSupport("ms-stream"),exports.mozchunkedarraybuffer=!exports.fetch&&haveArrayBuffer&&checkTypeSupport("moz-chunked-arraybuffer"),exports.overrideMimeType=exports.fetch||!!getXHR()&&isFunction(getXHR().overrideMimeType),exports.vbArray=isFunction(global.VBArray),xhr=null}).call(this,typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{}],82:[function(require,module,exports){(function(process,global,Buffer){var capability=require("./capability"),inherits=require("inherits"),response=require("./response"),stream=require("readable-stream"),toArrayBuffer=require("to-arraybuffer"),IncomingMessage=response.IncomingMessage,rStates=response.readyStates;function decideMode(e,t){return capability.fetch&&t?"fetch":capability.mozchunkedarraybuffer?"moz-chunked-arraybuffer":capability.msstream?"ms-stream":capability.arraybuffer&&e?"arraybuffer":capability.vbArray&&e?"text:vbarray":"text"}var ClientRequest=module.exports=function(e){var t,r=this;stream.Writable.call(r),r._opts=e,r._body=[],r._headers={},e.auth&&r.setHeader("Authorization","Basic "+new Buffer(e.auth).toString("base64")),Object.keys(e.headers).forEach(function(t){r.setHeader(t,e.headers[t])});var o=!0;if("disable-fetch"===e.mode||"requestTimeout"in e&&!capability.abortController)o=!1,t=!0;else if("prefer-streaming"===e.mode)t=!1;else if("allow-wrong-content-type"===e.mode)t=!capability.overrideMimeType;else{if(e.mode&&"default"!==e.mode&&"prefer-fast"!==e.mode)throw new Error("Invalid value for opts.mode");t=!0}r._mode=decideMode(t,o),r._fetchTimer=null,r.on("finish",function(){r._onFinish()})};function statusValid(e){try{var t=e.status;return null!==t&&0!==t}catch(e){return!1}}inherits(ClientRequest,stream.Writable),ClientRequest.prototype.setHeader=function(e,t){var r=e.toLowerCase();-1===unsafeHeaders.indexOf(r)&&(this._headers[r]={name:e,value:t})},ClientRequest.prototype.getHeader=function(e){var t=this._headers[e.toLowerCase()];return t?t.value:null},ClientRequest.prototype.removeHeader=function(e){delete this._headers[e.toLowerCase()]},ClientRequest.prototype._onFinish=function(){var e=this;if(!e._destroyed){var t=e._opts,r=e._headers,o=null;"GET"!==t.method&&"HEAD"!==t.method&&(o=capability.arraybuffer?toArrayBuffer(Buffer.concat(e._body)):capability.blobConstructor?new global.Blob(e._body.map(function(e){return toArrayBuffer(e)}),{type:(r["content-type"]||{}).value||""}):Buffer.concat(e._body).toString());var n=[];if(Object.keys(r).forEach(function(e){var t=r[e].name,o=r[e].value;Array.isArray(o)?o.forEach(function(e){n.push([t,e])}):n.push([t,o])}),"fetch"===e._mode){var i=null;if(capability.abortController){var s=new AbortController;i=s.signal,e._fetchAbortController=s,"requestTimeout"in t&&0!==t.requestTimeout&&(e._fetchTimer=global.setTimeout(function(){e.emit("requestTimeout"),e._fetchAbortController&&e._fetchAbortController.abort()},t.requestTimeout))}global.fetch(e._opts.url,{method:e._opts.method,headers:n,body:o||void 0,mode:"cors",credentials:t.withCredentials?"include":"same-origin",signal:i}).then(function(t){e._fetchResponse=t,e._connect()},function(t){global.clearTimeout(e._fetchTimer),e._destroyed||e.emit("error",t)})}else{var a=e._xhr=new global.XMLHttpRequest;try{a.open(e._opts.method,e._opts.url,!0)}catch(t){return void process.nextTick(function(){e.emit("error",t)})}"responseType"in a&&(a.responseType=e._mode.split(":")[0]),"withCredentials"in a&&(a.withCredentials=!!t.withCredentials),"text"===e._mode&&"overrideMimeType"in a&&a.overrideMimeType("text/plain; charset=x-user-defined"),"requestTimeout"in t&&(a.timeout=t.requestTimeout,a.ontimeout=function(){e.emit("requestTimeout")}),n.forEach(function(e){a.setRequestHeader(e[0],e[1])}),e._response=null,a.onreadystatechange=function(){switch(a.readyState){case rStates.LOADING:case rStates.DONE:e._onXHRProgress()}},"moz-chunked-arraybuffer"===e._mode&&(a.onprogress=function(){e._onXHRProgress()}),a.onerror=function(){e._destroyed||e.emit("error",new Error("XHR error"))};try{a.send(o)}catch(t){return void process.nextTick(function(){e.emit("error",t)})}}}},ClientRequest.prototype._onXHRProgress=function(){statusValid(this._xhr)&&!this._destroyed&&(this._response||this._connect(),this._response._onXHRProgress())},ClientRequest.prototype._connect=function(){var e=this;e._destroyed||(e._response=new IncomingMessage(e._xhr,e._fetchResponse,e._mode,e._fetchTimer),e._response.on("error",function(t){e.emit("error",t)}),e.emit("response",e._response))},ClientRequest.prototype._write=function(e,t,r){this._body.push(e),r()},ClientRequest.prototype.abort=ClientRequest.prototype.destroy=function(){this._destroyed=!0,global.clearTimeout(this._fetchTimer),this._response&&(this._response._destroyed=!0),this._xhr?this._xhr.abort():this._fetchAbortController&&this._fetchAbortController.abort()},ClientRequest.prototype.end=function(e,t,r){"function"==typeof e&&(r=e,e=void 0),stream.Writable.prototype.end.call(this,e,t,r)},ClientRequest.prototype.flushHeaders=function(){},ClientRequest.prototype.setTimeout=function(){},ClientRequest.prototype.setNoDelay=function(){},ClientRequest.prototype.setSocketKeepAlive=function(){};var unsafeHeaders=["accept-charset","accept-encoding","access-control-request-headers","access-control-request-method","connection","content-length","cookie","cookie2","date","dnt","expect","host","keep-alive","origin","referer","te","trailer","transfer-encoding","upgrade","via"]}).call(this,require("_process"),typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{},require("buffer").Buffer)},{"./capability":81,"./response":83,_process:66,buffer:23,inherits:31,"readable-stream":78,"to-arraybuffer":86}],83:[function(require,module,exports){(function(process,global,Buffer){var capability=require("./capability"),inherits=require("inherits"),stream=require("readable-stream"),rStates=exports.readyStates={UNSENT:0,OPENED:1,HEADERS_RECEIVED:2,LOADING:3,DONE:4},IncomingMessage=exports.IncomingMessage=function(e,r,t,a){var s=this;if(stream.Readable.call(s),s._mode=t,s.headers={},s.rawHeaders=[],s.trailers={},s.rawTrailers=[],s.on("end",function(){process.nextTick(function(){s.emit("close")})}),"fetch"===t){if(s._fetchResponse=r,s.url=r.url,s.statusCode=r.status,s.statusMessage=r.statusText,r.headers.forEach(function(e,r){s.headers[r.toLowerCase()]=e,s.rawHeaders.push(r,e)}),capability.writableStream){var o=new WritableStream({write:function(e){return new Promise(function(r,t){s._destroyed?t():s.push(new Buffer(e))?r():s._resumeFetch=r})},close:function(){global.clearTimeout(a),s._destroyed||s.push(null)},abort:function(e){s._destroyed||s.emit("error",e)}});try{return void r.body.pipeTo(o).catch(function(e){global.clearTimeout(a),s._destroyed||s.emit("error",e)})}catch(e){}}var n=r.body.getReader();!function e(){n.read().then(function(r){if(!s._destroyed){if(r.done)return global.clearTimeout(a),void s.push(null);s.push(new Buffer(r.value)),e()}}).catch(function(e){global.clearTimeout(a),s._destroyed||s.emit("error",e)})}()}else{if(s._xhr=e,s._pos=0,s.url=e.responseURL,s.statusCode=e.status,s.statusMessage=e.statusText,e.getAllResponseHeaders().split(/\r?\n/).forEach(function(e){var r=e.match(/^([^:]+):\s*(.*)/);if(r){var t=r[1].toLowerCase();"set-cookie"===t?(void 0===s.headers[t]&&(s.headers[t]=[]),s.headers[t].push(r[2])):void 0!==s.headers[t]?s.headers[t]+=", "+r[2]:s.headers[t]=r[2],s.rawHeaders.push(r[1],r[2])}}),s._charset="x-user-defined",!capability.overrideMimeType){var i=s.rawHeaders["mime-type"];if(i){var u=i.match(/;\s*charset=([^;])(;|$)/);u&&(s._charset=u[1].toLowerCase())}s._charset||(s._charset="utf-8")}}};inherits(IncomingMessage,stream.Readable),IncomingMessage.prototype._read=function(){var e=this._resumeFetch;e&&(this._resumeFetch=null,e())},IncomingMessage.prototype._onXHRProgress=function(){var e=this,r=e._xhr,t=null;switch(e._mode){case"text:vbarray":if(r.readyState!==rStates.DONE)break;try{t=new global.VBArray(r.responseBody).toArray()}catch(e){}if(null!==t){e.push(new Buffer(t));break}case"text":try{t=r.responseText}catch(r){e._mode="text:vbarray";break}if(t.length>e._pos){var a=t.substr(e._pos);if("x-user-defined"===e._charset){for(var s=new Buffer(a.length),o=0;o<a.length;o++)s[o]=255&a.charCodeAt(o);e.push(s)}else e.push(a,e._charset);e._pos=t.length}break;case"arraybuffer":if(r.readyState!==rStates.DONE||!r.response)break;t=r.response,e.push(new Buffer(new Uint8Array(t)));break;case"moz-chunked-arraybuffer":if(t=r.response,r.readyState!==rStates.LOADING||!t)break;e.push(new Buffer(new Uint8Array(t)));break;case"ms-stream":if(t=r.response,r.readyState!==rStates.LOADING)break;var n=new global.MSStreamReader;n.onprogress=function(){n.result.byteLength>e._pos&&(e.push(new Buffer(new Uint8Array(n.result.slice(e._pos)))),e._pos=n.result.byteLength)},n.onload=function(){e.push(null)},n.readAsArrayBuffer(t)}e._xhr.readyState===rStates.DONE&&"ms-stream"!==e._mode&&e.push(null)}}).call(this,require("_process"),typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{},require("buffer").Buffer)},{"./capability":81,_process:66,buffer:23,inherits:31,"readable-stream":78}],84:[function(require,module,exports){"use strict";var Buffer=require("safe-buffer").Buffer,isEncoding=Buffer.isEncoding||function(t){switch((t=""+t)&&t.toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":case"raw":return!0;default:return!1}};function _normalizeEncoding(t){if(!t)return"utf8";for(var e;;)switch(t){case"utf8":case"utf-8":return"utf8";case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return"utf16le";case"latin1":case"binary":return"latin1";case"base64":case"ascii":case"hex":return t;default:if(e)return;t=(""+t).toLowerCase(),e=!0}}function normalizeEncoding(t){var e=_normalizeEncoding(t);if("string"!=typeof e&&(Buffer.isEncoding===isEncoding||!isEncoding(t)))throw new Error("Unknown encoding: "+t);return e||t}function StringDecoder(t){var e;switch(this.encoding=normalizeEncoding(t),this.encoding){case"utf16le":this.text=utf16Text,this.end=utf16End,e=4;break;case"utf8":this.fillLast=utf8FillLast,e=4;break;case"base64":this.text=base64Text,this.end=base64End,e=3;break;default:return this.write=simpleWrite,void(this.end=simpleEnd)}this.lastNeed=0,this.lastTotal=0,this.lastChar=Buffer.allocUnsafe(e)}function utf8CheckByte(t){return t<=127?0:t>>5==6?2:t>>4==14?3:t>>3==30?4:t>>6==2?-1:-2}function utf8CheckIncomplete(t,e,s){var i=e.length-1;if(i<s)return 0;var n=utf8CheckByte(e[i]);return n>=0?(n>0&&(t.lastNeed=n-1),n):--i<s||-2===n?0:(n=utf8CheckByte(e[i]))>=0?(n>0&&(t.lastNeed=n-2),n):--i<s||-2===n?0:(n=utf8CheckByte(e[i]))>=0?(n>0&&(2===n?n=0:t.lastNeed=n-3),n):0}function utf8CheckExtraBytes(t,e,s){if(128!=(192&e[0]))return t.lastNeed=0,"�";if(t.lastNeed>1&&e.length>1){if(128!=(192&e[1]))return t.lastNeed=1,"�";if(t.lastNeed>2&&e.length>2&&128!=(192&e[2]))return t.lastNeed=2,"�"}}function utf8FillLast(t){var e=this.lastTotal-this.lastNeed,s=utf8CheckExtraBytes(this,t,e);return void 0!==s?s:this.lastNeed<=t.length?(t.copy(this.lastChar,e,0,this.lastNeed),this.lastChar.toString(this.encoding,0,this.lastTotal)):(t.copy(this.lastChar,e,0,t.length),void(this.lastNeed-=t.length))}function utf8Text(t,e){var s=utf8CheckIncomplete(this,t,e);if(!this.lastNeed)return t.toString("utf8",e);this.lastTotal=s;var i=t.length-(s-this.lastNeed);return t.copy(this.lastChar,0,i),t.toString("utf8",e,i)}function utf8End(t){var e=t&&t.length?this.write(t):"";return this.lastNeed?e+"�":e}function utf16Text(t,e){if((t.length-e)%2==0){var s=t.toString("utf16le",e);if(s){var i=s.charCodeAt(s.length-1);if(i>=55296&&i<=56319)return this.lastNeed=2,this.lastTotal=4,this.lastChar[0]=t[t.length-2],this.lastChar[1]=t[t.length-1],s.slice(0,-1)}return s}return this.lastNeed=1,this.lastTotal=2,this.lastChar[0]=t[t.length-1],t.toString("utf16le",e,t.length-1)}function utf16End(t){var e=t&&t.length?this.write(t):"";if(this.lastNeed){var s=this.lastTotal-this.lastNeed;return e+this.lastChar.toString("utf16le",0,s)}return e}function base64Text(t,e){var s=(t.length-e)%3;return 0===s?t.toString("base64",e):(this.lastNeed=3-s,this.lastTotal=3,1===s?this.lastChar[0]=t[t.length-1]:(this.lastChar[0]=t[t.length-2],this.lastChar[1]=t[t.length-1]),t.toString("base64",e,t.length-s))}function base64End(t){var e=t&&t.length?this.write(t):"";return this.lastNeed?e+this.lastChar.toString("base64",0,3-this.lastNeed):e}function simpleWrite(t){return t.toString(this.encoding)}function simpleEnd(t){return t&&t.length?this.write(t):""}exports.StringDecoder=StringDecoder,StringDecoder.prototype.write=function(t){if(0===t.length)return"";var e,s;if(this.lastNeed){if(void 0===(e=this.fillLast(t)))return"";s=this.lastNeed,this.lastNeed=0}else s=0;return s<t.length?e?e+this.text(t,s):this.text(t,s):e||""},StringDecoder.prototype.end=utf8End,StringDecoder.prototype.text=utf8Text,StringDecoder.prototype.fillLast=function(t){if(this.lastNeed<=t.length)return t.copy(this.lastChar,this.lastTotal-this.lastNeed,0,this.lastNeed),this.lastChar.toString(this.encoding,0,this.lastTotal);t.copy(this.lastChar,this.lastTotal-this.lastNeed,0,t.length),this.lastNeed-=t.length}},{"safe-buffer":79}],85:[function(require,module,exports){(function(setImmediate,clearImmediate){var nextTick=require("process/browser.js").nextTick,apply=Function.prototype.apply,slice=Array.prototype.slice,immediateIds={},nextImmediateId=0;function Timeout(e,t){this._id=e,this._clearFn=t}exports.setTimeout=function(){return new Timeout(apply.call(setTimeout,window,arguments),clearTimeout)},exports.setInterval=function(){return new Timeout(apply.call(setInterval,window,arguments),clearInterval)},exports.clearTimeout=exports.clearInterval=function(e){e.close()},Timeout.prototype.unref=Timeout.prototype.ref=function(){},Timeout.prototype.close=function(){this._clearFn.call(window,this._id)},exports.enroll=function(e,t){clearTimeout(e._idleTimeoutId),e._idleTimeout=t},exports.unenroll=function(e){clearTimeout(e._idleTimeoutId),e._idleTimeout=-1},exports._unrefActive=exports.active=function(e){clearTimeout(e._idleTimeoutId);var t=e._idleTimeout;t>=0&&(e._idleTimeoutId=setTimeout(function(){e._onTimeout&&e._onTimeout()},t))},exports.setImmediate="function"==typeof setImmediate?setImmediate:function(e){var t=nextImmediateId++,i=!(arguments.length<2)&&slice.call(arguments,1);return immediateIds[t]=!0,nextTick(function(){immediateIds[t]&&(i?e.apply(null,i):e.call(null),exports.clearImmediate(t))}),t},exports.clearImmediate="function"==typeof clearImmediate?clearImmediate:function(e){delete immediateIds[e]}}).call(this,require("timers").setImmediate,require("timers").clearImmediate)},{"process/browser.js":66,timers:85}],86:[function(require,module,exports){var Buffer=require("buffer").Buffer;module.exports=function(e){if(e instanceof Uint8Array){if(0===e.byteOffset&&e.byteLength===e.buffer.byteLength)return e.buffer;if("function"==typeof e.buffer.slice)return e.buffer.slice(e.byteOffset,e.byteOffset+e.byteLength)}if(Buffer.isBuffer(e)){for(var f=new Uint8Array(e.length),r=e.length,t=0;t<r;t++)f[t]=e[t];return f.buffer}throw new Error("Argument must be a Buffer")}},{buffer:23}],87:[function(require,module,exports){"use strict";var punycode=require("punycode"),util=require("./util");function Url(){this.protocol=null,this.slashes=null,this.auth=null,this.host=null,this.port=null,this.hostname=null,this.hash=null,this.search=null,this.query=null,this.pathname=null,this.path=null,this.href=null}exports.parse=urlParse,exports.resolve=urlResolve,exports.resolveObject=urlResolveObject,exports.format=urlFormat,exports.Url=Url;var protocolPattern=/^([a-z0-9.+-]+:)/i,portPattern=/:[0-9]*$/,simplePathPattern=/^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,delims=["<",">",'"',"`"," ","\r","\n","\t"],unwise=["{","}","|","\\","^","`"].concat(delims),autoEscape=["'"].concat(unwise),nonHostChars=["%","/","?",";","#"].concat(autoEscape),hostEndingChars=["/","?","#"],hostnameMaxLen=255,hostnamePartPattern=/^[+a-z0-9A-Z_-]{0,63}$/,hostnamePartStart=/^([+a-z0-9A-Z_-]{0,63})(.*)$/,unsafeProtocol={javascript:!0,"javascript:":!0},hostlessProtocol={javascript:!0,"javascript:":!0},slashedProtocol={http:!0,https:!0,ftp:!0,gopher:!0,file:!0,"http:":!0,"https:":!0,"ftp:":!0,"gopher:":!0,"file:":!0},querystring=require("querystring");function urlParse(t,s,e){if(t&&util.isObject(t)&&t instanceof Url)return t;var h=new Url;return h.parse(t,s,e),h}function urlFormat(t){return util.isString(t)&&(t=urlParse(t)),t instanceof Url?t.format():Url.prototype.format.call(t)}function urlResolve(t,s){return urlParse(t,!1,!0).resolve(s)}function urlResolveObject(t,s){return t?urlParse(t,!1,!0).resolveObject(s):s}Url.prototype.parse=function(t,s,e){if(!util.isString(t))throw new TypeError("Parameter 'url' must be a string, not "+typeof t);var h=t.indexOf("?"),r=-1!==h&&h<t.indexOf("#")?"?":"#",a=t.split(r);a[0]=a[0].replace(/\\/g,"/");var o=t=a.join(r);if(o=o.trim(),!e&&1===t.split("#").length){var n=simplePathPattern.exec(o);if(n)return this.path=o,this.href=o,this.pathname=n[1],n[2]?(this.search=n[2],this.query=s?querystring.parse(this.search.substr(1)):this.search.substr(1)):s&&(this.search="",this.query={}),this}var i=protocolPattern.exec(o);if(i){var l=(i=i[0]).toLowerCase();this.protocol=l,o=o.substr(i.length)}if(e||i||o.match(/^\/\/[^@\/]+@[^@\/]+/)){var u="//"===o.substr(0,2);!u||i&&hostlessProtocol[i]||(o=o.substr(2),this.slashes=!0)}if(!hostlessProtocol[i]&&(u||i&&!slashedProtocol[i])){for(var p,c,f=-1,m=0;m<hostEndingChars.length;m++){-1!==(v=o.indexOf(hostEndingChars[m]))&&(-1===f||v<f)&&(f=v)}-1!==(c=-1===f?o.lastIndexOf("@"):o.lastIndexOf("@",f))&&(p=o.slice(0,c),o=o.slice(c+1),this.auth=decodeURIComponent(p)),f=-1;for(m=0;m<nonHostChars.length;m++){var v;-1!==(v=o.indexOf(nonHostChars[m]))&&(-1===f||v<f)&&(f=v)}-1===f&&(f=o.length),this.host=o.slice(0,f),o=o.slice(f),this.parseHost(),this.hostname=this.hostname||"";var g="["===this.hostname[0]&&"]"===this.hostname[this.hostname.length-1];if(!g)for(var y=this.hostname.split(/\./),P=(m=0,y.length);m<P;m++){var d=y[m];if(d&&!d.match(hostnamePartPattern)){for(var b="",q=0,O=d.length;q<O;q++)d.charCodeAt(q)>127?b+="x":b+=d[q];if(!b.match(hostnamePartPattern)){var j=y.slice(0,m),x=y.slice(m+1),U=d.match(hostnamePartStart);U&&(j.push(U[1]),x.unshift(U[2])),x.length&&(o="/"+x.join(".")+o),this.hostname=j.join(".");break}}}this.hostname.length>hostnameMaxLen?this.hostname="":this.hostname=this.hostname.toLowerCase(),g||(this.hostname=punycode.toASCII(this.hostname));var C=this.port?":"+this.port:"",A=this.hostname||"";this.host=A+C,this.href+=this.host,g&&(this.hostname=this.hostname.substr(1,this.hostname.length-2),"/"!==o[0]&&(o="/"+o))}if(!unsafeProtocol[l])for(m=0,P=autoEscape.length;m<P;m++){var w=autoEscape[m];if(-1!==o.indexOf(w)){var E=encodeURIComponent(w);E===w&&(E=escape(w)),o=o.split(w).join(E)}}var I=o.indexOf("#");-1!==I&&(this.hash=o.substr(I),o=o.slice(0,I));var R=o.indexOf("?");if(-1!==R?(this.search=o.substr(R),this.query=o.substr(R+1),s&&(this.query=querystring.parse(this.query)),o=o.slice(0,R)):s&&(this.search="",this.query={}),o&&(this.pathname=o),slashedProtocol[l]&&this.hostname&&!this.pathname&&(this.pathname="/"),this.pathname||this.search){C=this.pathname||"";var S=this.search||"";this.path=C+S}return this.href=this.format(),this},Url.prototype.format=function(){var t=this.auth||"";t&&(t=(t=encodeURIComponent(t)).replace(/%3A/i,":"),t+="@");var s=this.protocol||"",e=this.pathname||"",h=this.hash||"",r=!1,a="";this.host?r=t+this.host:this.hostname&&(r=t+(-1===this.hostname.indexOf(":")?this.hostname:"["+this.hostname+"]"),this.port&&(r+=":"+this.port)),this.query&&util.isObject(this.query)&&Object.keys(this.query).length&&(a=querystring.stringify(this.query));var o=this.search||a&&"?"+a||"";return s&&":"!==s.substr(-1)&&(s+=":"),this.slashes||(!s||slashedProtocol[s])&&!1!==r?(r="//"+(r||""),e&&"/"!==e.charAt(0)&&(e="/"+e)):r||(r=""),h&&"#"!==h.charAt(0)&&(h="#"+h),o&&"?"!==o.charAt(0)&&(o="?"+o),s+r+(e=e.replace(/[?#]/g,function(t){return encodeURIComponent(t)}))+(o=o.replace("#","%23"))+h},Url.prototype.resolve=function(t){return this.resolveObject(urlParse(t,!1,!0)).format()},Url.prototype.resolveObject=function(t){if(util.isString(t)){var s=new Url;s.parse(t,!1,!0),t=s}for(var e=new Url,h=Object.keys(this),r=0;r<h.length;r++){var a=h[r];e[a]=this[a]}if(e.hash=t.hash,""===t.href)return e.href=e.format(),e;if(t.slashes&&!t.protocol){for(var o=Object.keys(t),n=0;n<o.length;n++){var i=o[n];"protocol"!==i&&(e[i]=t[i])}return slashedProtocol[e.protocol]&&e.hostname&&!e.pathname&&(e.path=e.pathname="/"),e.href=e.format(),e}if(t.protocol&&t.protocol!==e.protocol){if(!slashedProtocol[t.protocol]){for(var l=Object.keys(t),u=0;u<l.length;u++){var p=l[u];e[p]=t[p]}return e.href=e.format(),e}if(e.protocol=t.protocol,t.host||hostlessProtocol[t.protocol])e.pathname=t.pathname;else{for(var c=(t.pathname||"").split("/");c.length&&!(t.host=c.shift()););t.host||(t.host=""),t.hostname||(t.hostname=""),""!==c[0]&&c.unshift(""),c.length<2&&c.unshift(""),e.pathname=c.join("/")}if(e.search=t.search,e.query=t.query,e.host=t.host||"",e.auth=t.auth,e.hostname=t.hostname||t.host,e.port=t.port,e.pathname||e.search){var f=e.pathname||"",m=e.search||"";e.path=f+m}return e.slashes=e.slashes||t.slashes,e.href=e.format(),e}var v=e.pathname&&"/"===e.pathname.charAt(0),g=t.host||t.pathname&&"/"===t.pathname.charAt(0),y=g||v||e.host&&t.pathname,P=y,d=e.pathname&&e.pathname.split("/")||[],b=(c=t.pathname&&t.pathname.split("/")||[],e.protocol&&!slashedProtocol[e.protocol]);if(b&&(e.hostname="",e.port=null,e.host&&(""===d[0]?d[0]=e.host:d.unshift(e.host)),e.host="",t.protocol&&(t.hostname=null,t.port=null,t.host&&(""===c[0]?c[0]=t.host:c.unshift(t.host)),t.host=null),y=y&&(""===c[0]||""===d[0])),g)e.host=t.host||""===t.host?t.host:e.host,e.hostname=t.hostname||""===t.hostname?t.hostname:e.hostname,e.search=t.search,e.query=t.query,d=c;else if(c.length)d||(d=[]),d.pop(),d=d.concat(c),e.search=t.search,e.query=t.query;else if(!util.isNullOrUndefined(t.search)){if(b)e.hostname=e.host=d.shift(),(U=!!(e.host&&e.host.indexOf("@")>0)&&e.host.split("@"))&&(e.auth=U.shift(),e.host=e.hostname=U.shift());return e.search=t.search,e.query=t.query,util.isNull(e.pathname)&&util.isNull(e.search)||(e.path=(e.pathname?e.pathname:"")+(e.search?e.search:"")),e.href=e.format(),e}if(!d.length)return e.pathname=null,e.search?e.path="/"+e.search:e.path=null,e.href=e.format(),e;for(var q=d.slice(-1)[0],O=(e.host||t.host||d.length>1)&&("."===q||".."===q)||""===q,j=0,x=d.length;x>=0;x--)"."===(q=d[x])?d.splice(x,1):".."===q?(d.splice(x,1),j++):j&&(d.splice(x,1),j--);if(!y&&!P)for(;j--;j)d.unshift("..");!y||""===d[0]||d[0]&&"/"===d[0].charAt(0)||d.unshift(""),O&&"/"!==d.join("/").substr(-1)&&d.push("");var U,C=""===d[0]||d[0]&&"/"===d[0].charAt(0);b&&(e.hostname=e.host=C?"":d.length?d.shift():"",(U=!!(e.host&&e.host.indexOf("@")>0)&&e.host.split("@"))&&(e.auth=U.shift(),e.host=e.hostname=U.shift()));return(y=y||e.host&&d.length)&&!C&&d.unshift(""),d.length?e.pathname=d.join("/"):(e.pathname=null,e.path=null),util.isNull(e.pathname)&&util.isNull(e.search)||(e.path=(e.pathname?e.pathname:"")+(e.search?e.search:"")),e.auth=t.auth||e.auth,e.slashes=e.slashes||t.slashes,e.href=e.format(),e},Url.prototype.parseHost=function(){var t=this.host,s=portPattern.exec(t);s&&(":"!==(s=s[0])&&(this.port=s.substr(1)),t=t.substr(0,t.length-s.length)),t&&(this.hostname=t)}},{"./util":88,punycode:22,querystring:69}],88:[function(require,module,exports){"use strict";module.exports={isString:function(n){return"string"==typeof n},isObject:function(n){return"object"==typeof n&&null!==n},isNull:function(n){return null===n},isNullOrUndefined:function(n){return null==n}}},{}],89:[function(require,module,exports){(function(global){function deprecate(r,e){if(config("noDeprecation"))return r;var o=!1;return function(){if(!o){if(config("throwDeprecation"))throw new Error(e);config("traceDeprecation")?console.trace(e):console.warn(e),o=!0}return r.apply(this,arguments)}}function config(r){try{if(!global.localStorage)return!1}catch(r){return!1}var e=global.localStorage[r];return null!=e&&"true"===String(e).toLowerCase()}module.exports=deprecate}).call(this,typeof global!=="undefined"?global:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{})},{}],90:[function(require,module,exports){module.exports=extend;var hasOwnProperty=Object.prototype.hasOwnProperty;function extend(){for(var r={},e=0;e<arguments.length;e++){var t=arguments[e];for(var n in t)hasOwnProperty.call(t,n)&&(r[n]=t[n])}return r}},{}]},{},[3])(3)});
//# sourceMappingURL=ref-parser.min.js.map
//# sourceMappingURL=ref-parser.min.js.map
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t=t||self).JSONPath={})}(this,(function(t){"use strict";function e(t){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function r(t){return(r=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function n(t,e){return(n=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function a(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}function u(t,e,r){return(u=a()?Reflect.construct:function(t,e,r){var a=[null];a.push.apply(a,e);var u=new(Function.bind.apply(t,a));return r&&n(u,r.prototype),u}).apply(null,arguments)}function o(t){var e="function"==typeof Map?new Map:void 0;return(o=function(t){if(null===t||(a=t,-1===Function.toString.call(a).indexOf("[native code]")))return t;var a;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==e){if(e.has(t))return e.get(t);e.set(t,o)}function o(){return u(t,arguments,r(this).constructor)}return o.prototype=Object.create(t.prototype,{constructor:{value:o,enumerable:!1,writable:!0,configurable:!0}}),n(o,t)})(t)}function i(t,e){return!e||"object"!=typeof e&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function c(t){return function(t){if(Array.isArray(t)){for(var e=0,r=new Array(t.length);e<t.length;e++)r[e]=t[e];return r}}(t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}var l=Object.prototype.hasOwnProperty;F.nodeVMSupported=function(){try{return"[object process]"===Object.prototype.toString.call(global.process)}catch(t){return!1}}();var p=F.nodeVMSupported?require("vm"):{runInNewContext:function(t,e){var r=Object.keys(e),n=[];!function(t,e,r){for(var n=t.length,a=0;a<n;a++){r(t[a])&&e.push(t.splice(a--,1)[0])}}(r,n,(function(t){return"function"==typeof e[t]}));var a=r.map((function(t,r){return e[t]}));(t=n.reduce((function(t,r){var n=e[r].toString();return/function/.exec(n)||(n="function "+n),"var "+r+"="+n+";"+t}),"")+t).match(/(["'])use strict\1/)||r.includes("arguments")||(t="var arguments = undefined;"+t);var o=(t=t.replace(/;[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*$/,"")).lastIndexOf(";"),i=o>-1?t.slice(0,o+1)+" return "+t.slice(o+1):" return "+t;return u(Function,c(r).concat([i])).apply(void 0,c(a))}};function s(t,e){return(t=t.slice()).push(e),t}function h(t,e){return(e=e.slice()).unshift(t),e}var f=function(t){function e(t){var n;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),(n=i(this,r(e).call(this,'JSONPath should not be called with "new" (it prevents return of (unwrapped) scalar values)'))).avoidNew=!0,n.value=t,n.name="NewError",n}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&n(t,e)}(e,t),e}(o(Error));function F(t,r,n,a,u){if(!(this instanceof F))try{return new F(t,r,n,a,u)}catch(t){if(!t.avoidNew)throw t;return t.value}"string"==typeof t&&(u=a,a=n,n=r,r=t,t=null);var o=t&&"object"===e(t);if(t=t||{},this.json=t.json||n,this.path=t.path||r,this.resultType=t.resultType&&t.resultType.toLowerCase()||"value",this.flatten=t.flatten||!1,this.wrap=!l.call(t,"wrap")||t.wrap,this.sandbox=t.sandbox||{},this.preventEval=t.preventEval||!1,this.parent=t.parent||null,this.parentProperty=t.parentProperty||null,this.callback=t.callback||a||null,this.otherTypeCallback=t.otherTypeCallback||u||function(){throw new TypeError("You must supply an otherTypeCallback callback option with the @other() operator.")},!1!==t.autostart){var i={path:o?t.path:r};o?"json"in t&&(i.json=t.json):i.json=n;var c=this.evaluate(i);if(!c||"object"!==e(c))throw new f(c);return c}}F.prototype.evaluate=function(t,r,n,a){var u=this,o=this.parent,i=this.parentProperty,c=this.flatten,p=this.wrap;if(this.currResultType=this.resultType,this.currPreventEval=this.preventEval,this.currSandbox=this.sandbox,n=n||this.callback,this.currOtherTypeCallback=a||this.otherTypeCallback,r=r||this.json,(t=t||this.path)&&"object"===e(t)&&!Array.isArray(t)){if(!t.path)throw new TypeError('You must supply a "path" property when providing an object argument to JSONPath.evaluate().');if(!("json"in t))throw new TypeError('You must supply a "json" property when providing an object argument to JSONPath.evaluate().');r=l.call(t,"json")?t.json:r,c=l.call(t,"flatten")?t.flatten:c,this.currResultType=l.call(t,"resultType")?t.resultType:this.currResultType,this.currSandbox=l.call(t,"sandbox")?t.sandbox:this.currSandbox,p=l.call(t,"wrap")?t.wrap:p,this.currPreventEval=l.call(t,"preventEval")?t.preventEval:this.currPreventEval,n=l.call(t,"callback")?t.callback:n,this.currOtherTypeCallback=l.call(t,"otherTypeCallback")?t.otherTypeCallback:this.currOtherTypeCallback,o=l.call(t,"parent")?t.parent:o,i=l.call(t,"parentProperty")?t.parentProperty:i,t=t.path}if(o=o||null,i=i||null,Array.isArray(t)&&(t=F.toPathString(t)),t&&r){this._obj=r;var s=F.toPathArray(t);"$"===s[0]&&s.length>1&&s.shift(),this._hasParentSelector=null;var h=this._trace(s,r,["$"],o,i,n).filter((function(t){return t&&!t.isParentSelector}));return h.length?p||1!==h.length||h[0].hasArrExpr?h.reduce((function(t,e){var r=u._getPreferredOutput(e);return c&&Array.isArray(r)?t=t.concat(r):t.push(r),t}),[]):this._getPreferredOutput(h[0]):p?[]:void 0}},F.prototype._getPreferredOutput=function(t){var e=this.currResultType;switch(e){default:throw new TypeError("Unknown result type");case"all":return t.pointer=F.toPointer(t.path),t.path="string"==typeof t.path?t.path:F.toPathString(t.path),t;case"value":case"parent":case"parentProperty":return t[e];case"path":return F.toPathString(t[e]);case"pointer":return F.toPointer(t.path)}},F.prototype._handleCallback=function(t,e,r){if(e){var n=this._getPreferredOutput(t);t.path="string"==typeof t.path?t.path:F.toPathString(t.path),e(n,r,t)}},F.prototype._trace=function(t,r,n,a,u,o,i,c){var p,f=this;if(!t.length)return p={path:n,value:r,parent:a,parentProperty:u,hasArrExpr:i},this._handleCallback(p,o,"value"),p;var F=t[0],y=t.slice(1),v=[];function b(t){Array.isArray(t)?t.forEach((function(t){v.push(t)})):v.push(t)}if(("string"!=typeof F||c)&&r&&l.call(r,F))b(this._trace(y,r[F],s(n,F),r,F,o,i));else if("*"===F)this._walk(F,y,r,n,a,u,o,(function(t,e,r,n,a,u,o,i){b(f._trace(h(t,r),n,a,u,o,i,!0,!0))}));else if(".."===F)b(this._trace(y,r,n,a,u,o,i)),this._walk(F,y,r,n,a,u,o,(function(t,r,n,a,u,o,i,c){"object"===e(a[t])&&b(f._trace(h(r,n),a[t],s(u,t),a,t,c,!0))}));else{if("^"===F)return this._hasParentSelector=!0,n.length?{path:n.slice(0,-1),expr:y,isParentSelector:!0}:[];if("~"===F)return p={path:s(n,F),value:u,parent:a,parentProperty:null},this._handleCallback(p,o,"property"),p;if("$"===F)b(this._trace(y,r,n,null,null,o,i));else if(/^(\x2D?[0-9]*):(\x2D?[0-9]*):?([0-9]*)$/.test(F))b(this._slice(F,y,r,n,a,u,o));else if(0===F.indexOf("?(")){if(this.currPreventEval)throw new Error("Eval [?(expr)] prevented in JSONPath expression.");this._walk(F,y,r,n,a,u,o,(function(t,e,r,n,a,u,o,i){f._eval(e.replace(/^\?\(((?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*?)\)$/,"$1"),n[t],t,a,u,o)&&b(f._trace(h(t,r),n,a,u,o,i,!0))}))}else if("("===F[0]){if(this.currPreventEval)throw new Error("Eval [(expr)] prevented in JSONPath expression.");b(this._trace(h(this._eval(F,r,n[n.length-1],n.slice(0,-1),a,u),y),r,n,a,u,o,i))}else if("@"===F[0]){var D=!1,d=F.slice(1,-2);switch(d){default:throw new TypeError("Unknown value type "+d);case"scalar":r&&["object","function"].includes(e(r))||(D=!0);break;case"boolean":case"string":case"undefined":case"function":e(r)===d&&(D=!0);break;case"number":e(r)===d&&isFinite(r)&&(D=!0);break;case"nonFinite":"number"!=typeof r||isFinite(r)||(D=!0);break;case"object":r&&e(r)===d&&(D=!0);break;case"array":Array.isArray(r)&&(D=!0);break;case"other":D=this.currOtherTypeCallback(r,n,a,u);break;case"integer":r!==Number(r)||!isFinite(r)||r%1||(D=!0);break;case"null":null===r&&(D=!0)}if(D)return p={path:n,value:r,parent:a,parentProperty:u},this._handleCallback(p,o,"value"),p}else if("`"===F[0]&&r&&l.call(r,F.slice(1))){var g=F.slice(1);b(this._trace(y,r[g],s(n,g),r,g,o,i,!0))}else if(F.includes(",")){var _=F.split(","),w=!0,P=!1,x=void 0;try{for(var S,E=_[Symbol.iterator]();!(w=(S=E.next()).done);w=!0){var j=S.value;b(this._trace(h(j,y),r,n,a,u,o,!0))}}catch(t){P=!0,x=t}finally{try{w||null==E.return||E.return()}finally{if(P)throw x}}}else!c&&r&&l.call(r,F)&&b(this._trace(y,r[F],s(n,F),r,F,o,i,!0))}if(this._hasParentSelector)for(var m=0;m<v.length;m++){var C=v[m];if(C&&C.isParentSelector){var k=f._trace(C.expr,r,C.path,a,u,o,i);if(Array.isArray(k)){v[m]=k[0];for(var A=k.length,O=1;O<A;O++)m++,v.splice(m,0,k[O])}else v[m]=k}}return v},F.prototype._walk=function(t,r,n,a,u,o,i,c){if(Array.isArray(n))for(var p=n.length,s=0;s<p;s++)c(s,t,r,n,a,u,o,i);else if("object"===e(n))for(var h in n)l.call(n,h)&&c(h,t,r,n,a,u,o,i)},F.prototype._slice=function(t,e,r,n,a,u,o){if(Array.isArray(r)){var i=r.length,c=t.split(":"),l=c[2]&&parseInt(c[2])||1,p=c[0]&&parseInt(c[0])||0,s=c[1]&&parseInt(c[1])||i;p=p<0?Math.max(0,p+i):Math.min(i,p),s=s<0?Math.max(0,s+i):Math.min(i,s);for(var f=[],F=p;F<s;F+=l){this._trace(h(F,e),r,n,a,u,o,!0).forEach((function(t){f.push(t)}))}return f}},F.prototype._eval=function(t,e,r,n,a,u){if(!this._obj||!e)return!1;t.includes("@parentProperty")&&(this.currSandbox._$_parentProperty=u,t=t.replace(/@parentProperty/g,"_$_parentProperty")),t.includes("@parent")&&(this.currSandbox._$_parent=a,t=t.replace(/@parent/g,"_$_parent")),t.includes("@property")&&(this.currSandbox._$_property=r,t=t.replace(/@property/g,"_$_property")),t.includes("@path")&&(this.currSandbox._$_path=F.toPathString(n.concat([r])),t=t.replace(/@path/g,"_$_path")),t.includes("@root")&&(this.currSandbox._$_root=this.json,t=t.replace(/@root/g,"_$_root")),t.match(/@([\t-\r \)\.\[\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF])/)&&(this.currSandbox._$_v=e,t=t.replace(/@([\t-\r \)\.\[\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF])/g,"_$_v$1"));try{return p.runInNewContext(t,this.currSandbox)}catch(e){throw console.log(e),new Error("jsonPath: "+e.message+": "+t)}},F.cache={},F.toPathString=function(t){for(var e=t,r=e.length,n="$",a=1;a<r;a++)/^(~|\^|@(?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*?\(\))$/.test(e[a])||(n+=/^[\*0-9]+$/.test(e[a])?"["+e[a]+"]":"['"+e[a]+"']");return n},F.toPointer=function(t){for(var e=t,r=e.length,n="",a=1;a<r;a++)/^(~|\^|@(?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*?\(\))$/.test(e[a])||(n+="/"+e[a].toString().replace(/~/g,"~0").replace(/\//g,"~1"));return n},F.toPathArray=function(t){var e=F.cache;if(e[t])return e[t].concat();var r=[],n=t.replace(/@(?:null|boolean|number|string|integer|undefined|nonFinite|scalar|array|object|function|other)\(\)/g,";$&;").replace(/['\[](\??\((?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*?\))['\]]/g,(function(t,e){return"[#"+(r.push(e)-1)+"]"})).replace(/\['((?:[\0-&\(-\\\^-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*)'\]/g,(function(t,e){return"['"+e.replace(/\./g,"%@%").replace(/~/g,"%%@@%%")+"']"})).replace(/~/g,";~;").replace(/'?\.'?(?!(?:[\0-Z\\-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*\])|\['?/g,";").replace(/%@%/g,".").replace(/%%@@%%/g,"~").replace(/(?:;)?(\^+)(?:;)?/g,(function(t,e){return";"+e.split("").join(";")+";"})).replace(/;;;|;;/g,";..;").replace(/;$|'?\]|'$/g,"").split(";").map((function(t){var e=t.match(/#([0-9]+)/);return e&&e[1]?r[e[1]]:t}));return e[t]=n,e[t]},t.JSONPath=F,Object.defineProperty(t,"__esModule",{value:!0})}));
//# sourceMappingURL=index-umd.min.js.map

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('json-schema-ref-parser'), require('jsonpath-plus')) :
  typeof define === 'function' && define.amd ? define(['json-schema-ref-parser', 'jsonpath-plus'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.JSONSchemaFaker = factory(global.$RefParser, global.jsonpathPlus));
}(this, (function ($RefParser, jsonpathPlus) {
  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var $RefParser__default = /*#__PURE__*/_interopDefaultLegacy($RefParser);

  /**
   * This class defines a registry for custom formats used within JSF.
   */
  var Registry = function Registry() {
    // empty by default
    this.data = {};
  };

  /**
   * Unregisters custom format(s)
   * @param name
   */
  Registry.prototype.unregister = function unregister (name) {
    if (!name) {
      this.data = {};
    } else {
      delete this.data[name];
    }
  };

  /**
   * Registers custom format
   */
  Registry.prototype.register = function register (name, callback) {
    this.data[name] = callback;
  };

  /**
   * Register many formats at one shot
   */
  Registry.prototype.registerMany = function registerMany (formats) {
      var this$1 = this;

    Object.keys(formats).forEach(function (name) {
      this$1.data[name] = formats[name];
    });
  };

  /**
   * Returns element by registry key
   */
  Registry.prototype.get = function get (name) {
    var format = this.data[name];

    return format;
  };

  /**
   * Returns the whole registry content
   */
  Registry.prototype.list = function list () {
    return this.data;
  };

  var defaults = {};

  defaults.defaultInvalidTypeProduct = undefined;
  defaults.defaultRandExpMax = 10;

  defaults.ignoreProperties = [];
  defaults.ignoreMissingRefs = false;
  defaults.failOnInvalidTypes = true;
  defaults.failOnInvalidFormat = true;

  defaults.alwaysFakeOptionals = false;
  defaults.optionalsProbability = null;
  defaults.fixedProbabilities = false;
  defaults.useExamplesValue = false;
  defaults.useDefaultValue = false;
  defaults.requiredOnly = false;

  defaults.minItems = 0;
  defaults.maxItems = null;
  defaults.minLength = 0;
  defaults.maxLength = null;

  defaults.resolveJsonPath = false;
  defaults.reuseProperties = false;
  defaults.fillProperties = true;
  defaults.replaceEmptyByRandomValue = false;

  defaults.random = Math.random;

  defaults.renderTitle = true;
  defaults.renderDescription = true;
  defaults.renderComment = false;

  /**
   * This class defines a registry for custom settings used within JSF.
   */
  var OptionRegistry = /*@__PURE__*/(function (Registry) {
    function OptionRegistry() {
      Registry.call(this);
      this.data = Object.assign({}, defaults);
      this._defaults = defaults;
    }

    if ( Registry ) OptionRegistry.__proto__ = Registry;
    OptionRegistry.prototype = Object.create( Registry && Registry.prototype );
    OptionRegistry.prototype.constructor = OptionRegistry;

    var prototypeAccessors = { defaults: { configurable: true } };

    prototypeAccessors.defaults.get = function () {
      return Object.assign({}, this._defaults);
    };

    Object.defineProperties( OptionRegistry.prototype, prototypeAccessors );

    return OptionRegistry;
  }(Registry));

  // instantiate
  var registry = new OptionRegistry();

  /**
   * Custom option API
   *
   * @param nameOrOptionMap
   * @returns {any}
   */
  function optionAPI(nameOrOptionMap, optionalValue) {
    if (typeof nameOrOptionMap === 'string') {
      if (typeof optionalValue !== 'undefined') {
        return registry.register(nameOrOptionMap, optionalValue);
      }

      return registry.get(nameOrOptionMap);
    }

    return registry.registerMany(nameOrOptionMap);
  }

  optionAPI.getDefaults = function () { return registry.defaults; };

  var ALLOWED_TYPES = ['integer', 'number', 'string', 'boolean'];
  var SCALAR_TYPES = ALLOWED_TYPES.concat(['null']);
  var ALL_TYPES = ['array', 'object'].concat(SCALAR_TYPES);

  var MOST_NEAR_DATETIME = 2524608000000;

  var MIN_INTEGER = -100000000;
  var MAX_INTEGER = 100000000;

  var MIN_NUMBER = -100;
  var MAX_NUMBER = 100;

  var env = {
    ALLOWED_TYPES: ALLOWED_TYPES,
    SCALAR_TYPES: SCALAR_TYPES,
    ALL_TYPES: ALL_TYPES,
    MIN_NUMBER: MIN_NUMBER,
    MAX_NUMBER: MAX_NUMBER,
    MIN_INTEGER: MIN_INTEGER,
    MAX_INTEGER: MAX_INTEGER,
    MOST_NEAR_DATETIME: MOST_NEAR_DATETIME,
  };

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var types = {
    ROOT       : 0,
    GROUP      : 1,
    POSITION   : 2,
    SET        : 3,
    RANGE      : 4,
    REPETITION : 5,
    REFERENCE  : 6,
    CHAR       : 7,
  };

  const INTS = () => [{ type: types.RANGE , from: 48, to: 57 }];

  const WORDS = () => {
    return [
      { type: types.CHAR, value: 95 },
      { type: types.RANGE, from: 97, to: 122 },
      { type: types.RANGE, from: 65, to: 90 }
    ].concat(INTS());
  };

  const WHITESPACE = () => {
    return [
      { type: types.CHAR, value: 9 },
      { type: types.CHAR, value: 10 },
      { type: types.CHAR, value: 11 },
      { type: types.CHAR, value: 12 },
      { type: types.CHAR, value: 13 },
      { type: types.CHAR, value: 32 },
      { type: types.CHAR, value: 160 },
      { type: types.CHAR, value: 5760 },
      { type: types.RANGE, from: 8192, to: 8202 },
      { type: types.CHAR, value: 8232 },
      { type: types.CHAR, value: 8233 },
      { type: types.CHAR, value: 8239 },
      { type: types.CHAR, value: 8287 },
      { type: types.CHAR, value: 12288 },
      { type: types.CHAR, value: 65279 }
    ];
  };

  const NOTANYCHAR = () => {
    return [
      { type: types.CHAR, value: 10 },
      { type: types.CHAR, value: 13 },
      { type: types.CHAR, value: 8232 },
      { type: types.CHAR, value: 8233 },
    ];
  };

  // Predefined class objects.
  var words = () => ({ type: types.SET, set: WORDS(), not: false });
  var notWords = () => ({ type: types.SET, set: WORDS(), not: true });
  var ints = () => ({ type: types.SET, set: INTS(), not: false });
  var notInts = () => ({ type: types.SET, set: INTS(), not: true });
  var whitespace = () => ({ type: types.SET, set: WHITESPACE(), not: false });
  var notWhitespace = () => ({ type: types.SET, set: WHITESPACE(), not: true });
  var anyChar = () => ({ type: types.SET, set: NOTANYCHAR(), not: true });

  var sets = {
  	words: words,
  	notWords: notWords,
  	ints: ints,
  	notInts: notInts,
  	whitespace: whitespace,
  	notWhitespace: notWhitespace,
  	anyChar: anyChar
  };

  var util = createCommonjsModule(function (module, exports) {
  const CTRL = '@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^ ?';
  const SLSH = { '0': 0, 't': 9, 'n': 10, 'v': 11, 'f': 12, 'r': 13 };

  /**
   * Finds character representations in str and convert all to
   * their respective characters
   *
   * @param {String} str
   * @return {String}
   */
  exports.strToChars = function(str) {
    /* jshint maxlen: false */
    var chars_regex = /(\[\\b\])|(\\)?\\(?:u([A-F0-9]{4})|x([A-F0-9]{2})|(0?[0-7]{2})|c([@A-Z[\\\]^?])|([0tnvfr]))/g;
    str = str.replace(chars_regex, function(s, b, lbs, a16, b16, c8, dctrl, eslsh) {
      if (lbs) {
        return s;
      }

      var code = b ? 8 :
        a16   ? parseInt(a16, 16) :
        b16   ? parseInt(b16, 16) :
        c8    ? parseInt(c8,   8) :
        dctrl ? CTRL.indexOf(dctrl) :
        SLSH[eslsh];

      var c = String.fromCharCode(code);

      // Escape special regex characters.
      if (/[[\]{}^$.|?*+()]/.test(c)) {
        c = '\\' + c;
      }

      return c;
    });

    return str;
  };


  /**
   * turns class into tokens
   * reads str until it encounters a ] not preceeded by a \
   *
   * @param {String} str
   * @param {String} regexpStr
   * @return {Array.<Array.<Object>, Number>}
   */
  exports.tokenizeClass = (str, regexpStr) => {
    /* jshint maxlen: false */
    var tokens = [];
    var regexp = /\\(?:(w)|(d)|(s)|(W)|(D)|(S))|((?:(?:\\)(.)|([^\]\\]))-(?:\\)?([^\]]))|(\])|(?:\\)?([^])/g;
    var rs, c;


    while ((rs = regexp.exec(str)) != null) {
      if (rs[1]) {
        tokens.push(sets.words());

      } else if (rs[2]) {
        tokens.push(sets.ints());

      } else if (rs[3]) {
        tokens.push(sets.whitespace());

      } else if (rs[4]) {
        tokens.push(sets.notWords());

      } else if (rs[5]) {
        tokens.push(sets.notInts());

      } else if (rs[6]) {
        tokens.push(sets.notWhitespace());

      } else if (rs[7]) {
        tokens.push({
          type: types.RANGE,
          from: (rs[8] || rs[9]).charCodeAt(0),
          to: rs[10].charCodeAt(0),
        });

      } else if ((c = rs[12])) {
        tokens.push({
          type: types.CHAR,
          value: c.charCodeAt(0),
        });

      } else {
        return [tokens, regexp.lastIndex];
      }
    }

    exports.error(regexpStr, 'Unterminated character class');
  };


  /**
   * Shortcut to throw errors.
   *
   * @param {String} regexp
   * @param {String} msg
   */
  exports.error = (regexp, msg) => {
    throw new SyntaxError('Invalid regular expression: /' + regexp + '/: ' + msg);
  };
  });
  util.strToChars;
  util.tokenizeClass;
  util.error;

  var wordBoundary = () => ({ type: types.POSITION, value: 'b' });
  var nonWordBoundary = () => ({ type: types.POSITION, value: 'B' });
  var begin = () => ({ type: types.POSITION, value: '^' });
  var end = () => ({ type: types.POSITION, value: '$' });

  var positions = {
  	wordBoundary: wordBoundary,
  	nonWordBoundary: nonWordBoundary,
  	begin: begin,
  	end: end
  };

  var lib = (regexpStr) => {
    var i = 0, l, c,
      start = { type: types.ROOT, stack: []},

      // Keep track of last clause/group and stack.
      lastGroup = start,
      last = start.stack,
      groupStack = [];


    var repeatErr = (i) => {
      util.error(regexpStr, `Nothing to repeat at column ${i - 1}`);
    };

    // Decode a few escaped characters.
    var str = util.strToChars(regexpStr);
    l = str.length;

    // Iterate through each character in string.
    while (i < l) {
      c = str[i++];

      switch (c) {
        // Handle escaped characters, inclues a few sets.
        case '\\':
          c = str[i++];

          switch (c) {
            case 'b':
              last.push(positions.wordBoundary());
              break;

            case 'B':
              last.push(positions.nonWordBoundary());
              break;

            case 'w':
              last.push(sets.words());
              break;

            case 'W':
              last.push(sets.notWords());
              break;

            case 'd':
              last.push(sets.ints());
              break;

            case 'D':
              last.push(sets.notInts());
              break;

            case 's':
              last.push(sets.whitespace());
              break;

            case 'S':
              last.push(sets.notWhitespace());
              break;

            default:
              // Check if c is integer.
              // In which case it's a reference.
              if (/\d/.test(c)) {
                last.push({ type: types.REFERENCE, value: parseInt(c, 10) });

              // Escaped character.
              } else {
                last.push({ type: types.CHAR, value: c.charCodeAt(0) });
              }
          }

          break;


        // Positionals.
        case '^':
          last.push(positions.begin());
          break;

        case '$':
          last.push(positions.end());
          break;


        // Handle custom sets.
        case '[':
          // Check if this class is 'anti' i.e. [^abc].
          var not;
          if (str[i] === '^') {
            not = true;
            i++;
          } else {
            not = false;
          }

          // Get all the characters in class.
          var classTokens = util.tokenizeClass(str.slice(i), regexpStr);

          // Increase index by length of class.
          i += classTokens[1];
          last.push({
            type: types.SET,
            set: classTokens[0],
            not,
          });

          break;


        // Class of any character except \n.
        case '.':
          last.push(sets.anyChar());
          break;


        // Push group onto stack.
        case '(':
          // Create group.
          var group = {
            type: types.GROUP,
            stack: [],
            remember: true,
          };

          c = str[i];

          // If if this is a special kind of group.
          if (c === '?') {
            c = str[i + 1];
            i += 2;

            // Match if followed by.
            if (c === '=') {
              group.followedBy = true;

            // Match if not followed by.
            } else if (c === '!') {
              group.notFollowedBy = true;

            } else if (c !== ':') {
              util.error(regexpStr,
                `Invalid group, character '${c}'` +
                ` after '?' at column ${i - 1}`);
            }

            group.remember = false;
          }

          // Insert subgroup into current group stack.
          last.push(group);

          // Remember the current group for when the group closes.
          groupStack.push(lastGroup);

          // Make this new group the current group.
          lastGroup = group;
          last = group.stack;
          break;


        // Pop group out of stack.
        case ')':
          if (groupStack.length === 0) {
            util.error(regexpStr, `Unmatched ) at column ${i - 1}`);
          }
          lastGroup = groupStack.pop();

          // Check if this group has a PIPE.
          // To get back the correct last stack.
          last = lastGroup.options ?
            lastGroup.options[lastGroup.options.length - 1] : lastGroup.stack;
          break;


        // Use pipe character to give more choices.
        case '|':
          // Create array where options are if this is the first PIPE
          // in this clause.
          if (!lastGroup.options) {
            lastGroup.options = [lastGroup.stack];
            delete lastGroup.stack;
          }

          // Create a new stack and add to options for rest of clause.
          var stack = [];
          lastGroup.options.push(stack);
          last = stack;
          break;


        // Repetition.
        // For every repetition, remove last element from last stack
        // then insert back a RANGE object.
        // This design is chosen because there could be more than
        // one repetition symbols in a regex i.e. `a?+{2,3}`.
        case '{':
          var rs = /^(\d+)(,(\d+)?)?\}/.exec(str.slice(i)), min, max;
          if (rs !== null) {
            if (last.length === 0) {
              repeatErr(i);
            }
            min = parseInt(rs[1], 10);
            max = rs[2] ? rs[3] ? parseInt(rs[3], 10) : Infinity : min;
            i += rs[0].length;

            last.push({
              type: types.REPETITION,
              min,
              max,
              value: last.pop(),
            });
          } else {
            last.push({
              type: types.CHAR,
              value: 123,
            });
          }
          break;

        case '?':
          if (last.length === 0) {
            repeatErr(i);
          }
          last.push({
            type: types.REPETITION,
            min: 0,
            max: 1,
            value: last.pop(),
          });
          break;

        case '+':
          if (last.length === 0) {
            repeatErr(i);
          }
          last.push({
            type: types.REPETITION,
            min: 1,
            max: Infinity,
            value: last.pop(),
          });
          break;

        case '*':
          if (last.length === 0) {
            repeatErr(i);
          }
          last.push({
            type: types.REPETITION,
            min: 0,
            max: Infinity,
            value: last.pop(),
          });
          break;


        // Default is a character that is not `\[](){}?+*^$`.
        default:
          last.push({
            type: types.CHAR,
            value: c.charCodeAt(0),
          });
      }

    }

    // Check if any groups have not been closed.
    if (groupStack.length !== 0) {
      util.error(regexpStr, 'Unterminated group');
    }

    return start;
  };

  var types_1 = types;
  lib.types = types_1;

  /* eslint indent: 4 */


  // Private helper class
  class SubRange {
      constructor(low, high) {
          this.low = low;
          this.high = high;
          this.length = 1 + high - low;
      }

      overlaps(range) {
          return !(this.high < range.low || this.low > range.high);
      }

      touches(range) {
          return !(this.high + 1 < range.low || this.low - 1 > range.high);
      }

      // Returns inclusive combination of SubRanges as a SubRange.
      add(range) {
          return new SubRange(
              Math.min(this.low, range.low),
              Math.max(this.high, range.high)
          );
      }

      // Returns subtraction of SubRanges as an array of SubRanges.
      // (There's a case where subtraction divides it in 2)
      subtract(range) {
          if (range.low <= this.low && range.high >= this.high) {
              return [];
          } else if (range.low > this.low && range.high < this.high) {
              return [
                  new SubRange(this.low, range.low - 1),
                  new SubRange(range.high + 1, this.high)
              ];
          } else if (range.low <= this.low) {
              return [new SubRange(range.high + 1, this.high)];
          } else {
              return [new SubRange(this.low, range.low - 1)];
          }
      }

      toString() {
          return this.low == this.high ?
              this.low.toString() : this.low + '-' + this.high;
      }
  }


  class DRange {
      constructor(a, b) {
          this.ranges = [];
          this.length = 0;
          if (a != null) this.add(a, b);
      }

      _update_length() {
          this.length = this.ranges.reduce((previous, range) => {
              return previous + range.length;
          }, 0);
      }

      add(a, b) {
          var _add = (subrange) => {
              var i = 0;
              while (i < this.ranges.length && !subrange.touches(this.ranges[i])) {
                  i++;
              }
              var newRanges = this.ranges.slice(0, i);
              while (i < this.ranges.length && subrange.touches(this.ranges[i])) {
                  subrange = subrange.add(this.ranges[i]);
                  i++;
              }
              newRanges.push(subrange);
              this.ranges = newRanges.concat(this.ranges.slice(i));
              this._update_length();
          };

          if (a instanceof DRange) {
              a.ranges.forEach(_add);
          } else {
              if (b == null) b = a;
              _add(new SubRange(a, b));
          }
          return this;
      }

      subtract(a, b) {
          var _subtract = (subrange) => {
              var i = 0;
              while (i < this.ranges.length && !subrange.overlaps(this.ranges[i])) {
                  i++;
              }
              var newRanges = this.ranges.slice(0, i);
              while (i < this.ranges.length && subrange.overlaps(this.ranges[i])) {
                  newRanges = newRanges.concat(this.ranges[i].subtract(subrange));
                  i++;
              }
              this.ranges = newRanges.concat(this.ranges.slice(i));
              this._update_length();
          };

          if (a instanceof DRange) {
              a.ranges.forEach(_subtract);
          } else {
              if (b == null) b = a;
              _subtract(new SubRange(a, b));
          }
          return this;
      }

      intersect(a, b) {
          var newRanges = [];
          var _intersect = (subrange) => {
              var i = 0;
              while (i < this.ranges.length && !subrange.overlaps(this.ranges[i])) {
                  i++;
              }
              while (i < this.ranges.length && subrange.overlaps(this.ranges[i])) {
                  var low = Math.max(this.ranges[i].low, subrange.low);
                  var high = Math.min(this.ranges[i].high, subrange.high);
                  newRanges.push(new SubRange(low, high));
                  i++;
              }
          };

          if (a instanceof DRange) {
              a.ranges.forEach(_intersect);
          } else {
              if (b == null) b = a;
              _intersect(new SubRange(a, b));
          }
          this.ranges = newRanges;
          this._update_length();
          return this;
      }

      index(index) {
          var i = 0;
          while (i < this.ranges.length && this.ranges[i].length <= index) {
              index -= this.ranges[i].length;
              i++;
          }
          return this.ranges[i].low + index;
      }

      toString() {
          return '[ ' + this.ranges.join(', ') + ' ]';
      }

      clone() {
          return new DRange(this);
      }

      numbers() {
          return this.ranges.reduce((result, subrange) => {
              var i = subrange.low;
              while (i <= subrange.high) {
                  result.push(i);
                  i++;
              }
              return result;
          }, []);
      }

      subranges() {
          return this.ranges.map((subrange) => ({
              low: subrange.low,
              high: subrange.high,
              length: 1 + subrange.high - subrange.low
          }));
      }
  }

  var lib$1 = DRange;

  const types$1  = lib.types;


  var randexp = class RandExp {
    /**
     * @constructor
     * @param {RegExp|String} regexp
     * @param {String} m
     */
    constructor(regexp, m) {
      this._setDefaults(regexp);
      if (regexp instanceof RegExp) {
        this.ignoreCase = regexp.ignoreCase;
        this.multiline = regexp.multiline;
        regexp = regexp.source;

      } else if (typeof regexp === 'string') {
        this.ignoreCase = m && m.indexOf('i') !== -1;
        this.multiline = m && m.indexOf('m') !== -1;
      } else {
        throw new Error('Expected a regexp or string');
      }

      this.tokens = lib(regexp);
    }


    /**
     * Checks if some custom properties have been set for this regexp.
     *
     * @param {RandExp} randexp
     * @param {RegExp} regexp
     */
    _setDefaults(regexp) {
      // When a repetitional token has its max set to Infinite,
      // randexp won't actually generate a random amount between min and Infinite
      // instead it will see Infinite as min + 100.
      this.max = regexp.max != null ? regexp.max :
        RandExp.prototype.max != null ? RandExp.prototype.max : 100;

      // This allows expanding to include additional characters
      // for instance: RandExp.defaultRange.add(0, 65535);
      this.defaultRange = regexp.defaultRange ?
        regexp.defaultRange : this.defaultRange.clone();

      if (regexp.randInt) {
        this.randInt = regexp.randInt;
      }
    }


    /**
     * Generates the random string.
     *
     * @return {String}
     */
    gen() {
      return this._gen(this.tokens, []);
    }


    /**
     * Generate random string modeled after given tokens.
     *
     * @param {Object} token
     * @param {Array.<String>} groups
     * @return {String}
     */
    _gen(token, groups) {
      var stack, str, n, i, l;

      switch (token.type) {
        case types$1.ROOT:
        case types$1.GROUP:
          // Ignore lookaheads for now.
          if (token.followedBy || token.notFollowedBy) { return ''; }

          // Insert placeholder until group string is generated.
          if (token.remember && token.groupNumber === undefined) {
            token.groupNumber = groups.push(null) - 1;
          }

          stack = token.options ?
            this._randSelect(token.options) : token.stack;

          str = '';
          for (i = 0, l = stack.length; i < l; i++) {
            str += this._gen(stack[i], groups);
          }

          if (token.remember) {
            groups[token.groupNumber] = str;
          }
          return str;

        case types$1.POSITION:
          // Do nothing for now.
          return '';

        case types$1.SET:
          var expandedSet = this._expand(token);
          if (!expandedSet.length) { return ''; }
          return String.fromCharCode(this._randSelect(expandedSet));

        case types$1.REPETITION:
          // Randomly generate number between min and max.
          n = this.randInt(token.min,
            token.max === Infinity ? token.min + this.max : token.max);

          str = '';
          for (i = 0; i < n; i++) {
            str += this._gen(token.value, groups);
          }

          return str;

        case types$1.REFERENCE:
          return groups[token.value - 1] || '';

        case types$1.CHAR:
          var code = this.ignoreCase && this._randBool() ?
            this._toOtherCase(token.value) : token.value;
          return String.fromCharCode(code);
      }
    }


    /**
     * If code is alphabetic, converts to other case.
     * If not alphabetic, returns back code.
     *
     * @param {Number} code
     * @return {Number}
     */
    _toOtherCase(code) {
      return code + (97 <= code && code <= 122 ? -32 :
        65 <= code && code <= 90  ?  32 : 0);
    }


    /**
     * Randomly returns a true or false value.
     *
     * @return {Boolean}
     */
    _randBool() {
      return !this.randInt(0, 1);
    }


    /**
     * Randomly selects and returns a value from the array.
     *
     * @param {Array.<Object>} arr
     * @return {Object}
     */
    _randSelect(arr) {
      if (arr instanceof lib$1) {
        return arr.index(this.randInt(0, arr.length - 1));
      }
      return arr[this.randInt(0, arr.length - 1)];
    }


    /**
     * expands a token to a DiscontinuousRange of characters which has a
     * length and an index function (for random selecting)
     *
     * @param {Object} token
     * @return {DiscontinuousRange}
     */
    _expand(token) {
      if (token.type === lib.types.CHAR) {
        return new lib$1(token.value);
      } else if (token.type === lib.types.RANGE) {
        return new lib$1(token.from, token.to);
      } else {
        let drange = new lib$1();
        for (let i = 0; i < token.set.length; i++) {
          let subrange = this._expand(token.set[i]);
          drange.add(subrange);
          if (this.ignoreCase) {
            for (let j = 0; j < subrange.length; j++) {
              let code = subrange.index(j);
              let otherCaseCode = this._toOtherCase(code);
              if (code !== otherCaseCode) {
                drange.add(otherCaseCode);
              }
            }
          }
        }
        if (token.not) {
          return this.defaultRange.clone().subtract(drange);
        } else {
          return this.defaultRange.clone().intersect(drange);
        }
      }
    }


    /**
     * Randomly generates and returns a number between a and b (inclusive).
     *
     * @param {Number} a
     * @param {Number} b
     * @return {Number}
     */
    randInt(a, b) {
      return a + Math.floor(Math.random() * (1 + b - a));
    }


    /**
     * Default range of characters to generate from.
     */
    get defaultRange() {
      return this._range = this._range || new lib$1(32, 126);
    }

    set defaultRange(range) {
      this._range = range;
    }


    /**
     *
     * Enables use of randexp with a shorter call.
     *
     * @param {RegExp|String| regexp}
     * @param {String} m
     * @return {String}
     */
    static randexp(regexp, m) {
      var randexp;
      if(typeof regexp === 'string') {
        regexp = new RegExp(regexp, m);
      }

      if (regexp._randexp === undefined) {
        randexp = new RandExp(regexp, m);
        regexp._randexp = randexp;
      } else {
        randexp = regexp._randexp;
        randexp._setDefaults(regexp);
      }
      return randexp.gen();
    }


    /**
     * Enables sugary /regexp/.gen syntax.
     */
    static sugar() {
      /* eshint freeze:false */
      RegExp.prototype.gen = function() {
        return RandExp.randexp(this);
      };
    }
  };

  function getRandomInteger(min, max) {
    min = typeof min === 'undefined' ? env.MIN_INTEGER : min;
    max = typeof max === 'undefined' ? env.MAX_INTEGER : max;

    return Math.floor(optionAPI('random')() * ((max - min) + 1)) + min;
  }

  function _randexp(value) {
    // set maximum default, see #193
    randexp.prototype.max = optionAPI('defaultRandExpMax');

    // same implementation as the original except using our random
    randexp.prototype.randInt = function (a, b) { return a + Math.floor(optionAPI('random')() * (1 + (b - a))); };

    var re = new randexp(value);

    return re.gen();
  }

  /**
   * Returns random element of a collection
   *
   * @param collection
   * @returns {T}
   */
  function pick(collection) {
    return collection[Math.floor(optionAPI('random')() * collection.length)];
  }

  /**
   * Returns shuffled collection of elements
   *
   * @param collection
   * @returns {T[]}
   */
  function shuffle(collection) {
    var tmp;
    var key;
    var length = collection.length;

    var copy = collection.slice();

    for (; length > 0;) {
      key = Math.floor(optionAPI('random')() * length);
      // swap
      length -= 1;
      tmp = copy[length];
      copy[length] = copy[key];
      copy[key] = tmp;
    }

    return copy;
  }


  /**
   * Returns a random integer between min (inclusive) and max (inclusive)
   * Using Math.round() will give you a non-uniform distribution!
   * @see http://stackoverflow.com/a/1527820/769384
   */
  function getRandom(min, max) {
    return (optionAPI('random')() * (max - min)) + min;
  }

  /**
   * Generates random number according to parameters passed
   *
   * @param min
   * @param max
   * @param defMin
   * @param defMax
   * @param hasPrecision
   * @returns {number}
   */
  function number(min, max, defMin, defMax, hasPrecision) {
    if ( hasPrecision === void 0 ) hasPrecision = false;

    defMin = typeof defMin === 'undefined' ? env.MIN_NUMBER : defMin;
    defMax = typeof defMax === 'undefined' ? env.MAX_NUMBER : defMax;

    min = typeof min === 'undefined' ? defMin : min;
    max = typeof max === 'undefined' ? defMax : max;

    if (max < min) {
      max += min;
    }

    if (hasPrecision) {
      return getRandom(min, max);
    }

    return getRandomInteger(min, max);
  }

  function by(type) {
    switch (type) {
      case 'seconds':
        return number(0, 60) * 60;

      case 'minutes':
        return number(15, 50) * 612;

      case 'hours':
        return number(12, 72) * 36123;

      case 'days':
        return number(7, 30) * 86412345;

      case 'weeks':
        return number(4, 52) * 604812345;

      case 'months':
        return number(2, 13) * 2592012345;

      case 'years':
        return number(1, 20) * 31104012345;
    }
  }

  function date(step) {
    if (step) {
      return by(step);
    }

    var now = new Date();
    var days = number(-1000, env.MOST_NEAR_DATETIME);

    now.setTime(now.getTime() - days);

    return now;
  }

  var random = {
    pick: pick,
    date: date,
    shuffle: shuffle,
    number: number,
    randexp: _randexp,
  };

  function getLocalRef(obj, path) {
    var keyElements = path.replace(/^.*#\//, '').split('/');

    while (keyElements.length) {
      var prop = keyElements.shift();

      if (!obj[prop]) {
        throw new Error(("Prop '" + prop + "' not found in [" + (Object.keys(obj).join(', ')) + "] (" + path + ")"));
      }

      obj = obj[prop];
    }
    return obj;
  }

  /**
   * Returns true/false whether the object parameter has its own properties defined
   *
   * @param obj
   * @param properties
   * @returns {boolean}
   */
  function hasProperties(obj) {
    var properties = [], len = arguments.length - 1;
    while ( len-- > 0 ) properties[ len ] = arguments[ len + 1 ];

    return properties.filter(function (key) {
      return typeof obj[key] !== 'undefined';
    }).length > 0;
  }

  /**
   * Returns typecasted value.
   * External generators (faker, chance, casual) may return data in non-expected formats, such as string, when you might expect an
   * integer. This function is used to force the typecast. This is the base formatter for all result values.
   *
   * @param type
   * @param schema
   * @param callback
   * @returns {any}
   */
  function typecast(type, schema, callback) {
    var params = {};

    // normalize constraints
    switch (type || schema.type) {
      case 'integer':
      case 'number':
        if (typeof schema.minimum !== 'undefined') {
          params.minimum = schema.minimum;
        }

        if (typeof schema.maximum !== 'undefined') {
          params.maximum = schema.maximum;
        }

        if (schema.enum) {
          var min = Math.max(params.minimum || 0, 0);
          var max = Math.min(params.maximum || Infinity, Infinity);

          if (schema.exclusiveMinimum && min === schema.minimum) {
            min += schema.multipleOf || 1;
          }

          if (schema.exclusiveMaximum && max === schema.maximum) {
            max -= schema.multipleOf || 1;
          }

          // discard out-of-bounds enumerations
          if (min || max !== Infinity) {
            schema.enum = schema.enum.filter(function (x) {
              if (x >= min && x <= max) {
                return true;
              }

              return false;
            });
          }
        }

        break;

      case 'string': {
        params.minLength = optionAPI('minLength') || 0;
        params.maxLength = optionAPI('maxLength') || Number.MAX_SAFE_INTEGER;

        if (typeof schema.minLength !== 'undefined') {
          params.minLength = Math.max(params.minLength, schema.minLength);
        }

        if (typeof schema.maxLength !== 'undefined') {
          params.maxLength = Math.min(params.maxLength, schema.maxLength);
        }

        break;
      }
    }

    // execute generator
    var value = callback(params);

    // allow null values to be returned
    if (value === null || value === undefined) {
      return null;
    }

    // normalize output value
    switch (type || schema.type) {
      case 'number':
        value = parseFloat(value);
        break;

      case 'integer':
        value = parseInt(value, 10);
        break;

      case 'boolean':
        value = !!value;
        break;

      case 'string': {
        value = String(value);

        var min$1 = Math.max(params.minLength || 0, 0);
        var max$1 = Math.min(params.maxLength || Infinity, Infinity);

        var prev;

        while (value.length < min$1) {
          prev = value;

          if (!schema.pattern) {
            value += "" + (random.pick([' ', '/', '_', '-', '+', '=', '@', '^'])) + value;
          } else {
            value += random.randexp(schema.pattern);
          }

          // avoid infinite-loops while filling strings, if no changes
          // are made we just break the loop... see #540
          if (value === prev) { break; }
        }

        if (value.length > max$1) {
          value = value.substr(0, max$1);
        }

        switch (schema.format) {
          case 'date-time':
          case 'datetime':
            value = new Date(clampDate(value)).toISOString().replace(/([0-9])0+Z$/, '$1Z');
            break;

          case 'full-date':
          case 'date':
            value = new Date(clampDate(value)).toISOString().substr(0, 10);
            break;

          case 'time':
            value = new Date(("1969-01-01 " + value)).toISOString().substr(11);
            break;
        }
        break;
      }
    }

    return value;
  }

  function merge(a, b) {
    Object.keys(b).forEach(function (key) {
      if (typeof b[key] !== 'object' || b[key] === null) {
        a[key] = b[key];
      } else if (Array.isArray(b[key])) {
        a[key] = a[key] || [];
        // fix #292 - skip duplicated values from merge object (b)
        b[key].forEach(function (value) {
          if (Array.isArray(a[key]) && a[key].indexOf(value) === -1) {
            a[key].push(value);
          }
        });
      } else if (typeof a[key] !== 'object' || a[key] === null || Array.isArray(a[key])) {
        a[key] = merge({}, b[key]);
      } else {
        a[key] = merge(a[key], b[key]);
      }
    });

    return a;
  }

  function clone(obj, cache) {
    if ( cache === void 0 ) cache = new Map();

    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    if (cache.has(obj)) {
      return cache.get(obj);
    }

    if (Array.isArray(obj)) {
      var arr = [];
      cache.set(obj, arr);

      arr.push.apply(arr, obj.map(function (x) { return clone(x, cache); }));
      return arr;
    }

    var clonedObj = {};
    cache.set(obj, clonedObj);

    return Object.keys(obj).reduce(function (prev, cur) {
      prev[cur] = clone(obj[cur], cache);
      return prev;
    }, clonedObj);
  }

  function short(schema) {
    var s = JSON.stringify(schema);
    var l = JSON.stringify(schema, null, 2);

    return s.length > 400 ? ((l.substr(0, 400)) + "...") : l;
  }

  function anyValue() {
    return random.pick([
      false,
      true,
      null,
      -1,
      NaN,
      Math.PI,
      Infinity,
      undefined,
      [],
      {},
      // FIXME: use built-in random?
      Math.random(),
      Math.random().toString(36).substr(2) ]);
  }

  function notValue(schema, parent) {
    var copy = merge({}, parent);

    if (typeof schema.minimum !== 'undefined') {
      copy.maximum = schema.minimum;
      copy.exclusiveMaximum = true;
    }

    if (typeof schema.maximum !== 'undefined') {
      copy.minimum = schema.maximum > copy.maximum ? 0 : schema.maximum;
      copy.exclusiveMinimum = true;
    }

    if (typeof schema.minLength !== 'undefined') {
      copy.maxLength = schema.minLength;
    }

    if (typeof schema.maxLength !== 'undefined') {
      copy.minLength = schema.maxLength > copy.maxLength ? 0 : schema.maxLength;
    }

    if (schema.type) {
      copy.type = random.pick(env.SCALAR_TYPES.filter(function (x) {
        var types = Array.isArray(schema.type) ? schema.type : [schema.type];

        return types.every(function (type) {
          // treat both types as _similar enough_ to be skipped equal
          if (x === 'number' || x === 'integer') {
            return type !== 'number' && type !== 'integer';
          }

          return x !== type;
        });
      }));
    } else if (schema.enum) {
      var value;

      do {
        value = anyValue();
      } while (schema.enum.indexOf(value) !== -1);

      copy.enum = [value];
    }

    if (schema.required && copy.properties) {
      schema.required.forEach(function (prop) {
        delete copy.properties[prop];
      });
    }

    // TODO: explore more scenarios

    return copy;
  }

  function validateValueForSchema(value, schema) {
    var schemaHasMin = schema.minimum !== undefined;
    var schemaHasMax = schema.maximum !== undefined;

    return (
      (schemaHasMin || schemaHasMax)
      && (!schemaHasMin || value >= schema.minimum)
      && (!schemaHasMax || value <= schema.maximum)
    );
  }

  // FIXME: evaluate more constraints?
  function validate(value, schemas) {
    return !schemas.every(function (schema) { return validateValueForSchema(value, schema); });
  }

  function validateValueForOneOf(value, oneOf) {
    var validCount = oneOf.reduce(function (count, schema) { return (count + ((validateValueForSchema(value, schema)) ? 1 : 0)); }, 0);
    return validCount === 1;
  }

  function isKey(prop) {
    return ['enum', 'const', 'default', 'examples', 'required', 'definitions', 'items', 'properties'].includes(prop);
  }

  function omitProps(obj, props) {
    return Object.keys(obj)
      .filter(function (key) { return !props.includes(key); })
      .reduce(function (copy, k) {
        if (Array.isArray(obj[k])) {
          copy[k] = obj[k].slice();
        } else {
          copy[k] = obj[k] instanceof Object
            ? merge({}, obj[k])
            : obj[k];
        }

        return copy;
      }, {});
  }

  function template(value, schema) {
    if (Array.isArray(value)) {
      return value.map(function (x) { return template(x, schema); });
    }

    if (typeof value === 'string') {
      value = value.replace(/#\{([\w.-]+)\}/g, function (_, $1) { return schema[$1]; });
    }

    return value;
  }

  /**
   * Checks if given object is empty (has no properties)
   *
   * @param value
   * @returns {boolean}
   */
  function isEmpty(value) {
    return Object.prototype.toString.call(value) === '[object Object]' && !Object.keys(value).length;
  }

  /**
   * Checks given key is required or if source object was created by a subroutine (already cleaned)
   *
   * @param key
   * @param schema
   * @returns {boolean}
   */
  function shouldClean(key, schema) {
    var isRequired = Array.isArray(schema.required) && schema.required.includes(key);
    var wasCleaned = typeof schema.thunk === 'function' || (schema.additionalProperties && typeof schema.additionalProperties.thunk === 'function');

    return !isRequired && !wasCleaned;
  }

  /**
   * Cleans up the source object removing empty objects and undefined values
   * Will not remove values which are specified as `required`
   *
   * @param obj
   * @param schema
   * @param isArray
   * @returns {any}
   */
  function clean(obj, schema, isArray) {
    if ( isArray === void 0 ) isArray = false;

    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj
        .map(function (value) { return clean(value, schema, true); })
        .filter(function (value) { return typeof value !== 'undefined'; });
    }

    Object.keys(obj).forEach(function (k) {
      if (isEmpty(obj[k])) ; else {
        var value = clean(obj[k], schema);

        if (!isEmpty(value)) {
          obj[k] = value;
        }
      }
      if (typeof obj[k] === 'undefined') {
        delete obj[k];
      }
    });

    if (!Object.keys(obj).length && isArray) {
      return undefined;
    }

    return obj;
  }

  /**
   * Normalize generated date YYYY-MM-DD to not have
   * out of range values
   *
   * @param value
   * @returns {string}
   */
  function clampDate(value) {
    if (value.includes(' ')) {
      return new Date(value).toISOString().substr(0, 10);
    }

    var ref = value.split('T')[0].split('-');
    var year = ref[0];
    var month = ref[1];
    var day = ref[2];

    month = Math.max(1, Math.min(12, month));
    day = Math.max(1, Math.min(31, day));

    return (year + "-" + month + "-" + day);
  }

  var utils = {
    hasProperties: hasProperties,
    getLocalRef: getLocalRef,
    omitProps: omitProps,
    typecast: typecast,
    merge: merge,
    clone: clone,
    short: short,
    notValue: notValue,
    anyValue: anyValue,
    validate: validate,
    validateValueForSchema: validateValueForSchema,
    validateValueForOneOf: validateValueForOneOf,
    isKey: isKey,
    template: template,
    shouldClean: shouldClean,
    clean: clean,
    isEmpty: isEmpty,
    clampDate: clampDate,
  };

  // dynamic proxy for custom generators
  function proxy(gen) {
    return function (value, schema, property, rootSchema) {
      var fn = value;
      var args = [];

      // support for nested object, first-key is the generator
      if (typeof value === 'object') {
        fn = Object.keys(value)[0];

        // treat the given array as arguments,
        if (Array.isArray(value[fn])) {
          // if the generator is expecting arrays they should be nested, e.g. `[[1, 2, 3], true, ...]`
          args = value[fn];
        } else {
          args.push(value[fn]);
        }
      }

      // support for keypaths, e.g. "internet.email"
      var props = fn.split('.');

      // retrieve a fresh dependency
      var ctx = gen();

      while (props.length > 1) {
        ctx = ctx[props.shift()];
      }

      // retrieve last value from context object
      value = typeof ctx === 'object' ? ctx[props[0]] : ctx;

      // invoke dynamic generators
      if (typeof value === 'function') {
        value = value.apply(ctx, args.map(function (x) { return utils.template(x, rootSchema); }));
      }

      // test for pending callbacks
      if (Object.prototype.toString.call(value) === '[object Object]') {
        Object.keys(value).forEach(function (key) {
          if (typeof value[key] === 'function') {
            throw new Error(("Cannot resolve value for '" + property + ": " + fn + "', given: " + value));
          }
        });
      }

      return value;
    };
  }

  /**
   * Container is used to wrap external generators (faker, chance, casual, etc.) and its dependencies.
   *
   * - `jsf.extend('faker')` will enhance or define the given dependency.
   * - `jsf.define('faker')` will provide the "faker" keyword support.
   *
   * RandExp is not longer considered an "extension".
   */
  var Container = function Container() {
    // dynamic requires - handle all dependencies
    // they will NOT be included on the bundle
    this.registry = {};
    this.support = {};
  };

  /**
   * Unregister extensions
   * @param name
   */
  Container.prototype.reset = function reset (name) {
    if (!name) {
      this.registry = {};
      this.support = {};
    } else {
      delete this.registry[name];
      delete this.support[name];
    }
  };

  /**
   * Override dependency given by name
   * @param name
   * @param callback
   */
  Container.prototype.extend = function extend (name, callback) {
      var this$1 = this;

    this.registry[name] = callback(this.registry[name]);

    // built-in proxy (can be overridden)
    if (!this.support[name]) {
      this.support[name] = proxy(function () { return this$1.registry[name]; });
    }
  };

  /**
   * Set keyword support by name
   * @param name
   * @param callback
   */
  Container.prototype.define = function define (name, callback) {
    this.support[name] = callback;
  };

  /**
   * Returns dependency given by name
   * @param name
   * @returns {Dependency}
   */
  Container.prototype.get = function get (name) {
    if (typeof this.registry[name] === 'undefined') {
      throw new ReferenceError(("'" + name + "' dependency doesn't exist."));
    }
    return this.registry[name];
  };

  /**
   * Apply a custom keyword
   * @param schema
   */
  Container.prototype.wrap = function wrap (schema) {
      var this$1 = this;

    if (!('generate' in schema)) {
      var keys = Object.keys(schema);
      var context = {};

      var length = keys.length;

      var loop = function () { // eslint-disable-line
        var fn = keys[length].replace(/^x-/, '');
        var gen = this$1.support[fn];

        if (typeof gen === 'function') {
          Object.defineProperty(schema, 'generate', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: function (rootSchema, key) { return gen.call(context, schema[keys[length]], schema, keys[length], rootSchema, key.slice()); }, // eslint-disable-line
          });
          return 'break';
        }
      };

        while (length--) {
          var returned = loop();

          if ( returned === 'break' ) break;
        }
    }
    return schema;
  };

  // instantiate
  var registry$1 = new Registry();

  /**
   * Custom format API
   *
   * @see https://github.com/json-schema-faker/json-schema-faker#custom-formats
   * @param nameOrFormatMap
   * @param callback
   * @returns {any}
   */
  function formatAPI(nameOrFormatMap, callback) {
    if (typeof nameOrFormatMap === 'undefined') {
      return registry$1.list();
    }

    if (typeof nameOrFormatMap === 'string') {
      if (typeof callback === 'function') {
        registry$1.register(nameOrFormatMap, callback);
      } else if (callback === null || callback === false) {
        registry$1.unregister(nameOrFormatMap);
      } else {
        return registry$1.get(nameOrFormatMap);
      }
    } else {
      registry$1.registerMany(nameOrFormatMap);
    }
  }

  var ParseError = /*@__PURE__*/(function (Error) {
    function ParseError(message, path) {
      Error.call(this);
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }
      this.name = 'ParseError';
      this.message = message;
      this.path = path;
    }

    if ( Error ) ParseError.__proto__ = Error;
    ParseError.prototype = Object.create( Error && Error.prototype );
    ParseError.prototype.constructor = ParseError;

    return ParseError;
  }(Error));

  var inferredProperties = {
    array: [
      'additionalItems',
      'items',
      'maxItems',
      'minItems',
      'uniqueItems' ],
    integer: [
      'exclusiveMaximum',
      'exclusiveMinimum',
      'maximum',
      'minimum',
      'multipleOf' ],
    object: [
      'additionalProperties',
      'dependencies',
      'maxProperties',
      'minProperties',
      'patternProperties',
      'properties',
      'required' ],
    string: [
      'maxLength',
      'minLength',
      'pattern',
      'format' ],
  };

  inferredProperties.number = inferredProperties.integer;

  var subschemaProperties = [
    'additionalItems',
    'items',
    'additionalProperties',
    'dependencies',
    'patternProperties',
    'properties' ];

  /**
   * Iterates through all keys of `obj` and:
   * - checks whether those keys match properties of a given inferred type
   * - makes sure that `obj` is not a subschema; _Do not attempt to infer properties named as subschema containers. The
   * reason for this is that any property name within those containers that matches one of the properties used for
   * inferring missing type values causes the container itself to get processed which leads to invalid output. (Issue 62)_
   *
   * @returns {boolean}
   */
  function matchesType(obj, lastElementInPath, inferredTypeProperties) {
    return Object.keys(obj).filter(function (prop) {
      var isSubschema = subschemaProperties.indexOf(lastElementInPath) > -1;
      var inferredPropertyFound = inferredTypeProperties.indexOf(prop) > -1;

      if (inferredPropertyFound && !isSubschema) {
        return true;
      }

      return false;
    }).length > 0;
  }

  /**
   * Checks whether given `obj` type might be inferred. The mechanism iterates through all inferred types definitions,
   * tries to match allowed properties with properties of given `obj`. Returns type name, if inferred, or null.
   *
   * @returns {string|null}
   */
  function inferType(obj, schemaPath) {
    var keys = Object.keys(inferredProperties);

    for (var i = 0; i < keys.length; i += 1) {
      var typeName = keys[i];
      var lastElementInPath = schemaPath[schemaPath.length - 1];

      if (matchesType(obj, lastElementInPath, inferredProperties[typeName])) {
        return typeName;
      }
    }
  }

  /**
   * Generates randomized boolean value.
   *
   * @returns {boolean}
   */
  function booleanGenerator() {
    return optionAPI('random')() > 0.5;
  }

  var booleanType = booleanGenerator;

  /**
   * Generates null value.
   *
   * @returns {null}
   */
  function nullGenerator() {
    return null;
  }

  var nullType = nullGenerator;

  // TODO provide types
  function unique(path, items, value, sample, resolve, traverseCallback) {
    var tmp = [];
    var seen = [];

    function walk(obj) {
      var json = JSON.stringify(obj);

      if (seen.indexOf(json) === -1) {
        seen.push(json);
        tmp.push(obj);

        return true;
      }

      return false;
    }

    items.forEach(walk);

    // TODO: find a better solution?
    var limit = 100;

    while (tmp.length !== items.length) {
      if (!walk(traverseCallback(value.items || sample, path, resolve))) {
        limit -= 1;
      }

      if (!limit) {
        break;
      }
    }

    return tmp;
  }

  // TODO provide types
  function arrayType(value, path, resolve, traverseCallback) {
    var items = [];

    if (!(value.items || value.additionalItems)) {
      if (utils.hasProperties(value, 'minItems', 'maxItems', 'uniqueItems')) {
        throw new ParseError(("missing items for " + (utils.short(value))), path);
      }
      return items;
    }

    if (Array.isArray(value.items)) {
      return value.items.map(function (item, key) {
        var itemSubpath = path.concat(['items', key]);

        return traverseCallback(item, itemSubpath, resolve);
      });
    }

    var minItems = value.minItems;
    var maxItems = value.maxItems;

    var defaultMinItems = optionAPI('minItems');
    var defaultMaxItems = optionAPI('maxItems');

    if (defaultMinItems) {
      // fix boundaries
      minItems = typeof minItems === 'undefined'
        ? defaultMinItems
        : Math.min(defaultMinItems, minItems);
    }

    if (defaultMaxItems) {
      maxItems = typeof maxItems === 'undefined'
        ? defaultMaxItems
        : Math.min(defaultMaxItems, maxItems);

      // Don't allow user to set max items above our maximum
      if (maxItems && maxItems > defaultMaxItems) {
        maxItems = defaultMaxItems;
      }

      // Don't allow user to set min items above our maximum
      if (minItems && minItems > defaultMaxItems) {
        minItems = maxItems;
      }
    }

    var optionalsProbability = optionAPI('alwaysFakeOptionals') === true ? 1.0 : optionAPI('optionalsProbability');
    var fixedProbabilities = optionAPI('alwaysFakeOptionals') || optionAPI('fixedProbabilities') || false;

    var length = random.number(minItems, maxItems, 1, 5);

    if (optionalsProbability !== null) {
      length = Math.max(fixedProbabilities
        ? Math.round((maxItems || length) * optionalsProbability)
        : Math.abs(random.number(minItems, maxItems) * optionalsProbability), minItems || 0);
    }

    // TODO below looks bad. Should additionalItems be copied as-is?
    var sample = typeof value.additionalItems === 'object' ? value.additionalItems : {};

    for (var current = items.length; current < length; current += 1) {
      var itemSubpath = path.concat(['items', current]);
      var element = traverseCallback(value.items || sample, itemSubpath, resolve);

      items.push(element);
    }

    if (value.contains && length > 0) {
      var idx = random.number(0, length - 1);
      items[idx] = traverseCallback(value.contains, path.concat(["items",idx]), resolve);
    }

    if (value.uniqueItems) {
      return unique(path.concat(['items']), items, value, sample, resolve, traverseCallback);
    }

    return items;
  }

  function numberType(value) {
    var min = typeof value.minimum === 'undefined' ? env.MIN_INTEGER : value.minimum;
    var max = typeof value.maximum === 'undefined' ? env.MAX_INTEGER : value.maximum;

    var multipleOf = value.multipleOf;

    if (multipleOf) {
      max = Math.floor(max / multipleOf) * multipleOf;
      min = Math.ceil(min / multipleOf) * multipleOf;
    }

    if (value.exclusiveMinimum && min === value.minimum) {
      min += multipleOf || 1;
    }

    if (value.exclusiveMaximum && max === value.maximum) {
      max -= multipleOf || 1;
    }

    if (min > max) {
      return NaN;
    }

    if (multipleOf) {
      if (String(multipleOf).indexOf('.') === -1) {
        var base = random.number(Math.floor(min / multipleOf), Math.floor(max / multipleOf)) * multipleOf;

        while (base < min) {
          base += value.multipleOf;
        }

        return base;
      }

      var boundary = (max - min) / multipleOf;

      var num;
      var fix;

      do {
        num = random.number(0, boundary) * multipleOf;
        fix = (num / multipleOf) % 1;
      } while (fix !== 0);

      // FIXME: https://github.com/json-schema-faker/json-schema-faker/issues/379

      return min + num;
    }

    return random.number(min, max, undefined, undefined, true);
  }

  // The `integer` type is just a wrapper for the `number` type. The `number` type
  // returns floating point numbers, and `integer` type truncates the fraction
  // part, leaving the result as an integer.

  function integerType(value) {
    return numberType(Object.assign({ multipleOf: 1 }, value));
  }

  var LIPSUM_WORDS = "Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore\net dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea\ncommodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla\npariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est\nlaborum".split(/\W/);

  /**
   * Generates randomized array of single lorem ipsum words.
   *
   * @param length
   * @returns {Array.<string>}
   */
  function wordsGenerator(length) {
    var words = random.shuffle(LIPSUM_WORDS);

    return words.slice(0, length);
  }

  // fallback generator
  var anyType = { type: env.ALLOWED_TYPES };

  // TODO provide types
  function objectType(value, path, resolve, traverseCallback) {
    var props = {};

    var properties = value.properties || {};
    var patternProperties = value.patternProperties || {};
    var requiredProperties = typeof value.required === 'boolean' ? [] : (value.required || []).slice();
    var allowsAdditional = value.additionalProperties !== false;

    var propertyKeys = Object.keys(properties);
    var patternPropertyKeys = Object.keys(patternProperties);
    var optionalProperties = propertyKeys.concat(patternPropertyKeys).reduce(function (_response, _key) {
      if (requiredProperties.indexOf(_key) === -1) { _response.push(_key); }
      return _response;
    }, []);
    var allProperties = requiredProperties.concat(optionalProperties);

    var additionalProperties = allowsAdditional // eslint-disable-line
      ? (value.additionalProperties === true ? anyType : value.additionalProperties)
      : value.additionalProperties;

    if (!allowsAdditional
      && propertyKeys.length === 0
      && patternPropertyKeys.length === 0
      && utils.hasProperties(value, 'minProperties', 'maxProperties', 'dependencies', 'required')
    ) {
      // just nothing
      return null;
    }

    if (optionAPI('requiredOnly') === true) {
      requiredProperties.forEach(function (key) {
        if (properties[key]) {
          props[key] = properties[key];
        }
      });

      return traverseCallback(props, path.concat(['properties']), resolve, value);
    }

    var optionalsProbability = optionAPI('alwaysFakeOptionals') === true ? 1.0 : optionAPI('optionalsProbability');
    var fixedProbabilities = optionAPI('alwaysFakeOptionals') || optionAPI('fixedProbabilities') || false;
    var ignoreProperties = optionAPI('ignoreProperties') || [];
    var reuseProps = optionAPI('reuseProperties');
    var fillProps = optionAPI('fillProperties');

    var max = value.maxProperties || (allProperties.length + (allowsAdditional ? random.number(1, 5) : 0));

    var min = Math.max(value.minProperties || 0, requiredProperties.length);
    var neededExtras = Math.max(0, allProperties.length - min);

    if (allProperties.length === 1 && !requiredProperties.length) {
      min = Math.max(random.number(fillProps ? 1 : 0, max), min);
    }

    if (optionalsProbability !== null) {
      if (fixedProbabilities === true) {
        neededExtras = Math.round((min - requiredProperties.length) + (optionalsProbability * (allProperties.length - min)));
      } else {
        neededExtras = random.number(min - requiredProperties.length, optionalsProbability * (allProperties.length - min));
      }
    }

    var extraPropertiesRandomOrder = random.shuffle(optionalProperties).slice(0, neededExtras);
    var extraProperties = optionalProperties.filter(function (_item) {
      return extraPropertiesRandomOrder.indexOf(_item) !== -1;
    });

    // properties are read from right-to-left
    var _limit = optionalsProbability !== null || requiredProperties.length === max ? max : random.number(0, max);
    var _props = requiredProperties.concat(random.shuffle(extraProperties).slice(0, _limit)).slice(0, max);
    var _defns = [];

    if (value.dependencies) {
      Object.keys(value.dependencies).forEach(function (prop) {
        var _required = value.dependencies[prop];

        if (_props.indexOf(prop) !== -1) {
          if (Array.isArray(_required)) {
            // property-dependencies
            _required.forEach(function (sub) {
              if (_props.indexOf(sub) === -1) {
                _props.push(sub);
              }
            });
          } else {
            _defns.push(_required);
          }
        }
      });

      // schema-dependencies
      if (_defns.length) {
        delete value.dependencies;

        return traverseCallback({
          allOf: _defns.concat(value),
        }, path.concat(['properties']), resolve, value);
      }
    }

    var skipped = [];

    _props.forEach(function (key) {
      for (var i = 0; i < ignoreProperties.length; i += 1) {
        if ((ignoreProperties[i] instanceof RegExp && ignoreProperties[i].test(key))
          || (typeof ignoreProperties[i] === 'string' && ignoreProperties[i] === key)
          || (typeof ignoreProperties[i] === 'function' && ignoreProperties[i](properties[key], key))) {
          skipped.push(key);
          return;
        }
      }

      if (additionalProperties === false) {
        if (requiredProperties.indexOf(key) !== -1) {
          props[key] = properties[key];
        }
      }

      if (properties[key]) {
        props[key] = properties[key];
      }

      var found;

      // then try patternProperties
      patternPropertyKeys.forEach(function (_key) {
        if (key.match(new RegExp(_key))) {
          found = true;

          if (props[key]) {
            utils.merge(props[key], patternProperties[_key]);
          } else {
            props[random.randexp(key)] = patternProperties[_key];
          }
        }
      });

      if (!found) {
        // try patternProperties again,
        var subschema = patternProperties[key] || additionalProperties;

        // FIXME: allow anyType as fallback when no subschema is given?

        if (subschema && additionalProperties !== false) {
          // otherwise we can use additionalProperties?
          props[patternProperties[key] ? random.randexp(key) : key] = properties[key] || subschema;
        }
      }
    });

    // discard already ignored props if they're not required to be filled...
    var current = Object.keys(props).length + (fillProps ? 0 : skipped.length);

    // generate dynamic suffix for additional props...
    var hash = function (suffix) { return random.randexp(("_?[_a-f\\d]{1,3}" + (suffix ? '\\$?' : ''))); };

    function get(from) {
      var one;

      do {
        if (!from.length) { break; }
        one = from.shift();
      } while (props[one]);

      return one;
    }

    var minProps = min;
    if (allowsAdditional && !requiredProperties.length) {
      minProps = Math.max(optionalsProbability === null || additionalProperties ? random.number(fillProps ? 1 : 0, max) : 0, min);
    }

    while (fillProps) {
      if (!(patternPropertyKeys.length || allowsAdditional)) {
        break;
      }

      if (current >= minProps) {
        break;
      }

      if (allowsAdditional) {
        if (reuseProps && ((propertyKeys.length - current) > minProps)) {
          var count = 0;
          var key = (void 0);

          do {
            count += 1;

            // skip large objects
            if (count > 1000) {
              break;
            }

            key = get(requiredProperties) || random.pick(propertyKeys);
          } while (typeof props[key] !== 'undefined');

          if (typeof props[key] === 'undefined') {
            props[key] = properties[key];
            current += 1;
          }
        } else if (patternPropertyKeys.length && !additionalProperties) {
          var prop = random.pick(patternPropertyKeys);
          var word = random.randexp(prop);

          if (!props[word]) {
            props[word] = patternProperties[prop];
            current += 1;
          }
        } else {
          var word$1 = get(requiredProperties) || (wordsGenerator(1) + hash());

          if (!props[word$1]) {
            props[word$1] = additionalProperties || anyType;
            current += 1;
          }
        }
      }

      for (var i = 0; current < min && i < patternPropertyKeys.length; i += 1) {
        var _key = patternPropertyKeys[i];
        var word$2 = random.randexp(_key);


        if (!props[word$2]) {
          props[word$2] = patternProperties[_key];
          current += 1;
        }
      }
    }

    // fill up-to this value and no more!
    if (requiredProperties.length === 0 && (!allowsAdditional || optionalsProbability === false)) {
      var maximum = random.number(min, max);

      for (; current < maximum;) {
        var word$3 = get(propertyKeys);

        if (word$3) {
          props[word$3] = properties[word$3];
        }

        current += 1;
      }
    }

    return traverseCallback(props, path.concat(['properties']), resolve, value);
  }

  /**
   * Helper function used by thunkGenerator to produce some words for the final result.
   *
   * @returns {string}
   */
  function produce() {
    var length = random.number(1, 5);

    return wordsGenerator(length).join(' ');
  }

  /**
   * Generates randomized concatenated string based on words generator.
   *
   * @returns {string}
   */
  function thunkGenerator(min, max) {
    if ( min === void 0 ) min = 0;
    if ( max === void 0 ) max = 140;

    var _min = Math.max(0, min);
    var _max = random.number(_min, max);

    var result = produce();

    // append until length is reached
    while (result.length < _min) {
      result += produce();
    }

    // cut if needed
    if (result.length > _max) {
      result = result.substr(0, _max);
    }

    return result;
  }

  /**
   * Generates randomized ipv4 address.
   *
   * @returns {string}
   */
  function ipv4Generator() {
    return [0, 0, 0, 0].map(function () {
      return random.number(0, 255);
    }).join('.');
  }

  /**
   * Generates randomized date time ISO format string.
   *
   * @returns {string}
   */
  function dateTimeGenerator() {
    return random.date().toISOString();
  }

  /**
   * Generates randomized date format string.
   *
   * @returns {string}
   */
  function dateGenerator() {
    return dateTimeGenerator().slice(0, 10);
  }

  /**
   * Generates randomized time format string.
   *
   * @returns {string}
   */
  function timeGenerator() {
    return dateTimeGenerator().slice(11);
  }

  var FRAGMENT = '[a-zA-Z][a-zA-Z0-9+-.]*';
  var URI_PATTERN = "https?://{hostname}(?:" + FRAGMENT + ")+";
  var PARAM_PATTERN = '(?:\\?([a-z]{1,7}(=\\w{1,5})?&){0,3})?';

  /**
   * Predefined core formats
   * @type {[key: string]: string}
   */
  var regexps = {
    email: '[a-zA-Z\\d][a-zA-Z\\d-]{1,13}[a-zA-Z\\d]@{hostname}',
    hostname: '[a-zA-Z]{1,33}\\.[a-z]{2,4}',
    ipv6: '[a-f\\d]{4}(:[a-f\\d]{4}){7}',
    uri: URI_PATTERN,
    slug: '[a-zA-Z\\d_-]+',

    // types from draft-0[67] (?)
    'uri-reference': ("" + URI_PATTERN + PARAM_PATTERN),
    'uri-template': URI_PATTERN.replace('(?:', '(?:/\\{[a-z][:a-zA-Z0-9-]*\\}|'),
    'json-pointer': ("(/(?:" + (FRAGMENT.replace(']*', '/]*')) + "|~[01]))+"),

    // some types from https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md#data-types (?)
    uuid: '^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$',
  };

  regexps.iri = regexps['uri-reference'];
  regexps['iri-reference'] = regexps['uri-reference'];

  regexps['idn-email'] = regexps.email;
  regexps['idn-hostname'] = regexps.hostname;

  var ALLOWED_FORMATS = new RegExp(("\\{(" + (Object.keys(regexps).join('|')) + ")\\}"));

  /**
   * Generates randomized string basing on a built-in regex format
   *
   * @param coreFormat
   * @returns {string}
   */
  function coreFormatGenerator(coreFormat) {
    return random.randexp(regexps[coreFormat]).replace(ALLOWED_FORMATS, function (match, key) {
      return random.randexp(regexps[key]);
    });
  }

  function generateFormat(value, invalid) {
    var callback = formatAPI(value.format);

    if (typeof callback === 'function') {
      return callback(value);
    }

    switch (value.format) {
      case 'date-time':
      case 'datetime':
        return dateTimeGenerator();
      case 'date':
        return dateGenerator();
      case 'time':
        return timeGenerator();
      case 'ipv4':
        return ipv4Generator();
      case 'regex':
        // TODO: discuss
        return '.+?';
      case 'email':
      case 'hostname':
      case 'ipv6':
      case 'uri':
      case 'uri-reference':
      case 'iri':
      case 'iri-reference':
      case 'idn-email':
      case 'idn-hostname':
      case 'json-pointer':
      case 'slug':
      case 'uri-template':
      case 'uuid':
        return coreFormatGenerator(value.format);
      default:
        if (typeof callback === 'undefined') {
          if (optionAPI('failOnInvalidFormat')) {
            throw new Error(("unknown registry key " + (utils.short(value.format))));
          } else {
            return invalid();
          }
        }

        throw new Error(("unsupported format '" + (value.format) + "'"));
    }
  }

  function stringType(value) {
    // here we need to force type to fix #467
    var output = utils.typecast('string', value, function (opts) {
      if (value.format) {
        return generateFormat(value, function () { return thunkGenerator(opts.minLength, opts.maxLength); });
      }

      if (value.pattern) {
        return random.randexp(value.pattern);
      }

      return thunkGenerator(opts.minLength, opts.maxLength);
    });

    return output;
  }

  var typeMap = {
    boolean: booleanType,
    null: nullType,
    array: arrayType,
    integer: integerType,
    number: numberType,
    object: objectType,
    string: stringType,
  };

  function getMeta(ref) {
    var comment = ref.$comment;
    var title = ref.title;
    var description = ref.description;

    return Object.entries({ comment: comment, title: title, description: description })
        .filter(function (ref) {
          var value = ref[1];

          return value;
    })
        .reduce(function (memo, ref) {
          var k = ref[0];
          var v = ref[1];

          memo[k] = v;
          return memo;
        }, {});
  }

  // TODO provide types
  function traverse(schema, path, resolve, rootSchema) {
    schema = resolve(schema, null, path);

    if (schema && (schema.oneOf || schema.anyOf || schema.allOf)) {
      schema = resolve(schema, null, path);
    }

    if (!schema) {
      return;
    }

    var context = getMeta(schema);

    // default values has higher precedence
    if (path[path.length - 1] !== 'properties') {
      // example values have highest precedence
      if (optionAPI('useExamplesValue') && Array.isArray(schema.examples)) {
        // include `default` value as example too
        var fixedExamples = schema.examples
          .concat('default' in schema ? [schema.default] : []);

        return { value: utils.typecast(null, schema, function () { return random.pick(fixedExamples); }), context: context };
      }

      if (optionAPI('useDefaultValue') && 'default' in schema) {
        if (schema.default !== '' || !optionAPI('replaceEmptyByRandomValue')) {
          return { value: schema.default, context: context };
        }
      }

      if ('template' in schema) {
        return { value: utils.template(schema.template, rootSchema), context: context };
      }

      if ('const' in schema) {
        return { value: schema.const, context: context };
      }
    }

    if (schema.not && typeof schema.not === 'object') {
      schema = utils.notValue(schema.not, utils.omitProps(schema, ['not']));

      // build new object value from not-schema!
      if (schema.type && schema.type === 'object') {
        var ref = traverse(schema, path.concat(['not']), resolve, rootSchema);
        var value = ref.value;
        var innerContext = ref.context;
        return { value: utils.clean(value, schema, false), context: Object.assign({}, context, {items: innerContext}) };
      }
    }

    // thunks can return sub-schemas
    if (typeof schema.thunk === 'function') {
      // result is already cleaned in thunk
      var ref$1 = traverse(schema.thunk(rootSchema), path, resolve);
      var value$1 = ref$1.value;
      var innerContext$1 = ref$1.context;
      return { value: value$1, context: Object.assign({}, context, {items: innerContext$1}) };
    }

    if (typeof schema.generate === 'function') {
      var retval = utils.typecast(null, schema, function () { return schema.generate(rootSchema, path); });
      var type$1 = retval === null ? 'null' : typeof retval;
      if (type$1 === schema.type
        || (Array.isArray(schema.type) && schema.type.includes(type$1))
        || (type$1 === 'number' && schema.type === 'integer')
        || (Array.isArray(retval) && schema.type === 'array')) {
        return { value: retval, context: context };
      }
    }

    if (typeof schema.pattern === 'string') {
      return { value: utils.typecast('string', schema, function () { return random.randexp(schema.pattern); }), context: context };
    }

    if (Array.isArray(schema.enum)) {
      return { value: utils.typecast(null, schema, function () { return random.pick(schema.enum); }), context: context };
    }

    // short-circuit as we don't plan generate more values!
    if (schema.jsonPath) {
      return { value: schema, context: context };
    }

    // TODO remove the ugly overcome
    var type = schema.type;

    if (Array.isArray(type)) {
      type = random.pick(type);
    } else if (typeof type === 'undefined') {
      // Attempt to infer the type
      type = inferType(schema, path) || type;

      if (type) {
        schema.type = type;
      }
    }

    if (typeof type === 'string') {
      if (!typeMap[type]) {
        if (optionAPI('failOnInvalidTypes')) {
          throw new ParseError(("unknown primitive " + (utils.short(type))), path.concat(['type']));
        } else {
          var value$2 = optionAPI('defaultInvalidTypeProduct');

          if (typeof value$2 === 'string' && typeMap[value$2]) {
            return { value: typeMap[value$2](schema, path, resolve, traverse), context: context };
          }

          return { value: value$2, context: context };
        }
      } else {
        try {
          var innerResult = typeMap[type](schema, path, resolve, traverse);
          if (type === 'array') {
            return {
              value: innerResult.map(function (ref) {
                var value = ref.value;

                return value;
            }),
              context: Object.assign({}, context,
                {items: innerResult.map(function (ref) {
                  var c = ref.context;

                  return c;
            })}),
            };
          } if (type === 'object') {
            return { value: innerResult.value, context: Object.assign({}, context, {items: innerResult.context}) };
          }
          return { value: innerResult, context: context };
        } catch (e) {
          if (typeof e.path === 'undefined') {
            throw new ParseError(e.stack, path);
          }
          throw e;
        }
      }
    }

    var valueCopy = {};
    var contextCopy = Object.assign({}, context);

    if (Array.isArray(schema)) {
      valueCopy = [];
    }

    Object.keys(schema).forEach(function (prop) {
      if (typeof schema[prop] === 'object' && prop !== 'definitions') {
        var ref = traverse(schema[prop], path.concat([prop]), resolve, valueCopy);
        var value = ref.value;
        var innerContext = ref.context;
        valueCopy[prop] = utils.clean(value, schema[prop], false);
        contextCopy[prop] = innerContext;
      } else {
        valueCopy[prop] = schema[prop];
      }
    });

    return { value: valueCopy, context: contextCopy };
  }

  var buildResolveSchema = function (ref) {
    var refs = ref.refs;
    var schema = ref.schema;
    var container = ref.container;
    var refDepthMax = ref.refDepthMax;
    var refDepthMin = ref.refDepthMin;

    var recursiveUtil = {};
    var seenRefs = {};

    var depth = 0;
    var lastRef;
    var lastPath;

    recursiveUtil.resolveSchema = function (sub, index, rootPath) {
      // prevent null sub from default/example null values to throw
      if (sub === null || sub === undefined) {
        return null;
      }

      if (typeof sub.generate === 'function') {
        return sub;
      }

      // cleanup
      var _id = sub.$id || sub.id;

      if (typeof _id === 'string') {
        delete sub.id;
        delete sub.$id;
        delete sub.$schema;
      }

      if (typeof sub.$ref === 'string') {
        var maxDepth = Math.max(refDepthMin, refDepthMax) - 1;

        // increasing depth only for repeated refs seems to be fixing #258
        if (sub.$ref === '#' || seenRefs[sub.$ref] < 0 || (lastRef === sub.$ref && ++depth > maxDepth)) {
          if (sub.$ref !== '#' && lastPath && lastPath.length === rootPath.length) {
            return utils.getLocalRef(schema, sub.$ref);
          }
          delete sub.$ref;
          return sub;
        }

        if (typeof seenRefs[sub.$ref] === 'undefined') {
          seenRefs[sub.$ref] = random.number(refDepthMin, refDepthMax) - 1;
        }

        lastPath = rootPath;
        lastRef = sub.$ref;

        var ref;

        if (sub.$ref.indexOf('#/') === -1) {
          ref = refs[sub.$ref] || null;
        } else {
          ref = utils.getLocalRef(schema, sub.$ref) || null;
        }

        if (typeof ref !== 'undefined') {
          if (!ref && optionAPI('ignoreMissingRefs') !== true) {
            throw new Error(("Reference not found: " + (sub.$ref)));
          }

          seenRefs[sub.$ref] -= 1;
          utils.merge(sub, ref || {});
        }

        // just remove the reference
        delete sub.$ref;
        return sub;
      }

      if (Array.isArray(sub.allOf)) {
        var schemas = sub.allOf;

        delete sub.allOf;

        // this is the only case where all sub-schemas
        // must be resolved before any merge
        schemas.forEach(function (subSchema) {
          var _sub = recursiveUtil.resolveSchema(subSchema, null, rootPath);

          // call given thunks if present
          utils.merge(sub, typeof _sub.thunk === 'function'
            ? _sub.thunk(sub)
            : _sub);
          if (Array.isArray(sub.allOf)) {
            recursiveUtil.resolveSchema(sub, index, rootPath);
          }
        });
      }

      if (Array.isArray(sub.oneOf || sub.anyOf)) {
        var mix = sub.oneOf || sub.anyOf;

        // test every value from the enum against each-oneOf
        // schema, only values that validate once are kept
        if (sub.enum && sub.oneOf) {
          sub.enum = sub.enum.filter(function (x) { return utils.validate(x, mix); });
        }

        return {
          thunk: function thunk(rootSchema) {
            var copy = utils.omitProps(sub, ['anyOf', 'oneOf']);
            var fixed = random.pick(mix);

            utils.merge(copy, fixed);

            // remove additional properties from merged schemas
            mix.forEach(function (omit) {
              if (omit.required && omit !== fixed) {
                omit.required.forEach(function (key) {
                  var includesKey = copy.required && copy.required.includes(key);
                  if (copy.properties && !includesKey) {
                    delete copy.properties[key];
                  }

                  if (rootSchema && rootSchema.properties) {
                    delete rootSchema.properties[key];
                  }
                });
              }
            });

            return copy;
          },
        };
      }

      Object.keys(sub).forEach(function (prop) {
        if ((Array.isArray(sub[prop]) || typeof sub[prop] === 'object') && !utils.isKey(prop)) {
          sub[prop] = recursiveUtil.resolveSchema(sub[prop], prop, rootPath.concat(prop));
        }
      });

      // avoid extra calls on sub-schemas, fixes #458
      if (rootPath) {
        var lastProp = rootPath[rootPath.length - 1];

        if (lastProp === 'properties' || lastProp === 'items') {
          return sub;
        }
      }

      return container.wrap(sub);
    };

    return recursiveUtil;
  };

  function pick$1(data) {
    return Array.isArray(data)
      ? random.pick(data)
      : data;
  }

  function cycle(data, reverse) {
    if (!Array.isArray(data)) {
      return data;
    }

    var value = reverse
      ? data.pop()
      : data.shift();

    if (reverse) {
      data.unshift(value);
    } else {
      data.push(value);
    }

    return value;
  }

  function resolve(obj, data, values, property) {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    if (!values) {
      values = {};
    }

    if (!data) {
      data = obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(function (x) { return resolve(x, data, values, property); });
    }

    if (obj.jsonPath) {
      var params = typeof obj.jsonPath !== 'object'
        ? { path: obj.jsonPath }
        : obj.jsonPath;

      params.group = obj.group || params.group || property;
      params.cycle = obj.cycle || params.cycle || false;
      params.reverse = obj.reverse || params.reverse || false;
      params.count = obj.count || params.count || 1;

      var key = (params.group) + "__" + (params.path);

      if (!values[key]) {
        if (params.count > 1) {
          values[key] = jsonpathPlus.JSONPath(params.path, data).slice(0, params.count);
        } else {
          values[key] = jsonpathPlus.JSONPath(params.path, data);
        }
      }

      if (params.cycle || params.reverse) {
        return cycle(values[key], params.reverse);
      }

      return pick$1(values[key]);
    }

    Object.keys(obj).forEach(function (k) {
      obj[k] = resolve(obj[k], data, values, k);
    });

    return obj;
  }

  // TODO provide types?
  function run(refs, schema, container) {
    if (Object.prototype.toString.call(schema) !== '[object Object]') {
      throw new Error(("Invalid input, expecting object but given " + (typeof schema)));
    }

    var refDepthMin = optionAPI('refDepthMin') || 0;
    var refDepthMax = optionAPI('refDepthMax') || 3;

    try {
      var ref = buildResolveSchema({
        refs: refs,
        schema: schema,
        container: container,
        refDepthMin: refDepthMin,
        refDepthMax: refDepthMax,
      });
      var resolveSchema = ref.resolveSchema;
      var result = traverse(utils.clone(schema), [], resolveSchema);

      if (optionAPI('resolveJsonPath')) {
        return {
          value: resolve(result.value),
          context: result.context,
        };
      }

      return result;
    } catch (e) {
      if (e.path) {
        throw new Error(((e.message) + " in /" + (e.path.join('/'))));
      } else {
        throw e;
      }
    }
  }

  function renderJS(res) {
    return res.value;
  }

  const Char = {
    ANCHOR: '&',
    COMMENT: '#',
    TAG: '!',
    DIRECTIVES_END: '-',
    DOCUMENT_END: '.'
  };
  const Type = {
    ALIAS: 'ALIAS',
    BLANK_LINE: 'BLANK_LINE',
    BLOCK_FOLDED: 'BLOCK_FOLDED',
    BLOCK_LITERAL: 'BLOCK_LITERAL',
    COMMENT: 'COMMENT',
    DIRECTIVE: 'DIRECTIVE',
    DOCUMENT: 'DOCUMENT',
    FLOW_MAP: 'FLOW_MAP',
    FLOW_SEQ: 'FLOW_SEQ',
    MAP: 'MAP',
    MAP_KEY: 'MAP_KEY',
    MAP_VALUE: 'MAP_VALUE',
    PLAIN: 'PLAIN',
    QUOTE_DOUBLE: 'QUOTE_DOUBLE',
    QUOTE_SINGLE: 'QUOTE_SINGLE',
    SEQ: 'SEQ',
    SEQ_ITEM: 'SEQ_ITEM'
  };
  const defaultTagPrefix = 'tag:yaml.org,2002:';
  const defaultTags = {
    MAP: 'tag:yaml.org,2002:map',
    SEQ: 'tag:yaml.org,2002:seq',
    STR: 'tag:yaml.org,2002:str'
  };

  function findLineStarts(src) {
    const ls = [0];
    let offset = src.indexOf('\n');

    while (offset !== -1) {
      offset += 1;
      ls.push(offset);
      offset = src.indexOf('\n', offset);
    }

    return ls;
  }

  function getSrcInfo(cst) {
    let lineStarts, src;

    if (typeof cst === 'string') {
      lineStarts = findLineStarts(cst);
      src = cst;
    } else {
      if (Array.isArray(cst)) cst = cst[0];

      if (cst && cst.context) {
        if (!cst.lineStarts) cst.lineStarts = findLineStarts(cst.context.src);
        lineStarts = cst.lineStarts;
        src = cst.context.src;
      }
    }

    return {
      lineStarts,
      src
    };
  }
  /**
   * @typedef {Object} LinePos - One-indexed position in the source
   * @property {number} line
   * @property {number} col
   */

  /**
   * Determine the line/col position matching a character offset.
   *
   * Accepts a source string or a CST document as the second parameter. With
   * the latter, starting indices for lines are cached in the document as
   * `lineStarts: number[]`.
   *
   * Returns a one-indexed `{ line, col }` location if found, or
   * `undefined` otherwise.
   *
   * @param {number} offset
   * @param {string|Document|Document[]} cst
   * @returns {?LinePos}
   */


  function getLinePos(offset, cst) {
    if (typeof offset !== 'number' || offset < 0) return null;
    const {
      lineStarts,
      src
    } = getSrcInfo(cst);
    if (!lineStarts || !src || offset > src.length) return null;

    for (let i = 0; i < lineStarts.length; ++i) {
      const start = lineStarts[i];

      if (offset < start) {
        return {
          line: i,
          col: offset - lineStarts[i - 1] + 1
        };
      }

      if (offset === start) return {
        line: i + 1,
        col: 1
      };
    }

    const line = lineStarts.length;
    return {
      line,
      col: offset - lineStarts[line - 1] + 1
    };
  }
  /**
   * Get a specified line from the source.
   *
   * Accepts a source string or a CST document as the second parameter. With
   * the latter, starting indices for lines are cached in the document as
   * `lineStarts: number[]`.
   *
   * Returns the line as a string if found, or `null` otherwise.
   *
   * @param {number} line One-indexed line number
   * @param {string|Document|Document[]} cst
   * @returns {?string}
   */

  function getLine(line, cst) {
    const {
      lineStarts,
      src
    } = getSrcInfo(cst);
    if (!lineStarts || !(line >= 1) || line > lineStarts.length) return null;
    const start = lineStarts[line - 1];
    let end = lineStarts[line]; // undefined for last line; that's ok for slice()

    while (end && end > start && src[end - 1] === '\n') --end;

    return src.slice(start, end);
  }
  /**
   * Pretty-print the starting line from the source indicated by the range `pos`
   *
   * Trims output to `maxWidth` chars while keeping the starting column visible,
   * using `…` at either end to indicate dropped characters.
   *
   * Returns a two-line string (or `null`) with `\n` as separator; the second line
   * will hold appropriately indented `^` marks indicating the column range.
   *
   * @param {Object} pos
   * @param {LinePos} pos.start
   * @param {LinePos} [pos.end]
   * @param {string|Document|Document[]*} cst
   * @param {number} [maxWidth=80]
   * @returns {?string}
   */

  function getPrettyContext({
    start,
    end
  }, cst, maxWidth = 80) {
    let src = getLine(start.line, cst);
    if (!src) return null;
    let {
      col
    } = start;

    if (src.length > maxWidth) {
      if (col <= maxWidth - 10) {
        src = src.substr(0, maxWidth - 1) + '…';
      } else {
        const halfWidth = Math.round(maxWidth / 2);
        if (src.length > col + halfWidth) src = src.substr(0, col + halfWidth - 1) + '…';
        col -= src.length - maxWidth;
        src = '…' + src.substr(1 - maxWidth);
      }
    }

    let errLen = 1;
    let errEnd = '';

    if (end) {
      if (end.line === start.line && col + (end.col - start.col) <= maxWidth + 1) {
        errLen = end.col - start.col;
      } else {
        errLen = Math.min(src.length + 1, maxWidth) - col;
        errEnd = '…';
      }
    }

    const offset = col > 1 ? ' '.repeat(col - 1) : '';
    const err = '^'.repeat(errLen);
    return `${src}\n${offset}${err}${errEnd}`;
  }

  class Range {
    static copy(orig) {
      return new Range(orig.start, orig.end);
    }

    constructor(start, end) {
      this.start = start;
      this.end = end || start;
    }

    isEmpty() {
      return typeof this.start !== 'number' || !this.end || this.end <= this.start;
    }
    /**
     * Set `origStart` and `origEnd` to point to the original source range for
     * this node, which may differ due to dropped CR characters.
     *
     * @param {number[]} cr - Positions of dropped CR characters
     * @param {number} offset - Starting index of `cr` from the last call
     * @returns {number} - The next offset, matching the one found for `origStart`
     */


    setOrigRange(cr, offset) {
      const {
        start,
        end
      } = this;

      if (cr.length === 0 || end <= cr[0]) {
        this.origStart = start;
        this.origEnd = end;
        return offset;
      }

      let i = offset;

      while (i < cr.length) {
        if (cr[i] > start) break;else ++i;
      }

      this.origStart = start + i;
      const nextOffset = i;

      while (i < cr.length) {
        // if end was at \n, it should now be at \r
        if (cr[i] >= end) break;else ++i;
      }

      this.origEnd = end + i;
      return nextOffset;
    }

  }

  /** Root class of all nodes */

  class Node {
    static addStringTerminator(src, offset, str) {
      if (str[str.length - 1] === '\n') return str;
      const next = Node.endOfWhiteSpace(src, offset);
      return next >= src.length || src[next] === '\n' ? str + '\n' : str;
    } // ^(---|...)


    static atDocumentBoundary(src, offset, sep) {
      const ch0 = src[offset];
      if (!ch0) return true;
      const prev = src[offset - 1];
      if (prev && prev !== '\n') return false;

      if (sep) {
        if (ch0 !== sep) return false;
      } else {
        if (ch0 !== Char.DIRECTIVES_END && ch0 !== Char.DOCUMENT_END) return false;
      }

      const ch1 = src[offset + 1];
      const ch2 = src[offset + 2];
      if (ch1 !== ch0 || ch2 !== ch0) return false;
      const ch3 = src[offset + 3];
      return !ch3 || ch3 === '\n' || ch3 === '\t' || ch3 === ' ';
    }

    static endOfIdentifier(src, offset) {
      let ch = src[offset];
      const isVerbatim = ch === '<';
      const notOk = isVerbatim ? ['\n', '\t', ' ', '>'] : ['\n', '\t', ' ', '[', ']', '{', '}', ','];

      while (ch && notOk.indexOf(ch) === -1) ch = src[offset += 1];

      if (isVerbatim && ch === '>') offset += 1;
      return offset;
    }

    static endOfIndent(src, offset) {
      let ch = src[offset];

      while (ch === ' ') ch = src[offset += 1];

      return offset;
    }

    static endOfLine(src, offset) {
      let ch = src[offset];

      while (ch && ch !== '\n') ch = src[offset += 1];

      return offset;
    }

    static endOfWhiteSpace(src, offset) {
      let ch = src[offset];

      while (ch === '\t' || ch === ' ') ch = src[offset += 1];

      return offset;
    }

    static startOfLine(src, offset) {
      let ch = src[offset - 1];
      if (ch === '\n') return offset;

      while (ch && ch !== '\n') ch = src[offset -= 1];

      return offset + 1;
    }
    /**
     * End of indentation, or null if the line's indent level is not more
     * than `indent`
     *
     * @param {string} src
     * @param {number} indent
     * @param {number} lineStart
     * @returns {?number}
     */


    static endOfBlockIndent(src, indent, lineStart) {
      const inEnd = Node.endOfIndent(src, lineStart);

      if (inEnd > lineStart + indent) {
        return inEnd;
      } else {
        const wsEnd = Node.endOfWhiteSpace(src, inEnd);
        const ch = src[wsEnd];
        if (!ch || ch === '\n') return wsEnd;
      }

      return null;
    }

    static atBlank(src, offset, endAsBlank) {
      const ch = src[offset];
      return ch === '\n' || ch === '\t' || ch === ' ' || endAsBlank && !ch;
    }

    static nextNodeIsIndented(ch, indentDiff, indicatorAsIndent) {
      if (!ch || indentDiff < 0) return false;
      if (indentDiff > 0) return true;
      return indicatorAsIndent && ch === '-';
    } // should be at line or string end, or at next non-whitespace char


    static normalizeOffset(src, offset) {
      const ch = src[offset];
      return !ch ? offset : ch !== '\n' && src[offset - 1] === '\n' ? offset - 1 : Node.endOfWhiteSpace(src, offset);
    } // fold single newline into space, multiple newlines to N - 1 newlines
    // presumes src[offset] === '\n'


    static foldNewline(src, offset, indent) {
      let inCount = 0;
      let error = false;
      let fold = '';
      let ch = src[offset + 1];

      while (ch === ' ' || ch === '\t' || ch === '\n') {
        switch (ch) {
          case '\n':
            inCount = 0;
            offset += 1;
            fold += '\n';
            break;

          case '\t':
            if (inCount <= indent) error = true;
            offset = Node.endOfWhiteSpace(src, offset + 2) - 1;
            break;

          case ' ':
            inCount += 1;
            offset += 1;
            break;
        }

        ch = src[offset + 1];
      }

      if (!fold) fold = ' ';
      if (ch && inCount <= indent) error = true;
      return {
        fold,
        offset,
        error
      };
    }

    constructor(type, props, context) {
      Object.defineProperty(this, 'context', {
        value: context || null,
        writable: true
      });
      this.error = null;
      this.range = null;
      this.valueRange = null;
      this.props = props || [];
      this.type = type;
      this.value = null;
    }

    getPropValue(idx, key, skipKey) {
      if (!this.context) return null;
      const {
        src
      } = this.context;
      const prop = this.props[idx];
      return prop && src[prop.start] === key ? src.slice(prop.start + (skipKey ? 1 : 0), prop.end) : null;
    }

    get anchor() {
      for (let i = 0; i < this.props.length; ++i) {
        const anchor = this.getPropValue(i, Char.ANCHOR, true);
        if (anchor != null) return anchor;
      }

      return null;
    }

    get comment() {
      const comments = [];

      for (let i = 0; i < this.props.length; ++i) {
        const comment = this.getPropValue(i, Char.COMMENT, true);
        if (comment != null) comments.push(comment);
      }

      return comments.length > 0 ? comments.join('\n') : null;
    }

    commentHasRequiredWhitespace(start) {
      const {
        src
      } = this.context;
      if (this.header && start === this.header.end) return false;
      if (!this.valueRange) return false;
      const {
        end
      } = this.valueRange;
      return start !== end || Node.atBlank(src, end - 1);
    }

    get hasComment() {
      if (this.context) {
        const {
          src
        } = this.context;

        for (let i = 0; i < this.props.length; ++i) {
          if (src[this.props[i].start] === Char.COMMENT) return true;
        }
      }

      return false;
    }

    get hasProps() {
      if (this.context) {
        const {
          src
        } = this.context;

        for (let i = 0; i < this.props.length; ++i) {
          if (src[this.props[i].start] !== Char.COMMENT) return true;
        }
      }

      return false;
    }

    get includesTrailingLines() {
      return false;
    }

    get jsonLike() {
      const jsonLikeTypes = [Type.FLOW_MAP, Type.FLOW_SEQ, Type.QUOTE_DOUBLE, Type.QUOTE_SINGLE];
      return jsonLikeTypes.indexOf(this.type) !== -1;
    }

    get rangeAsLinePos() {
      if (!this.range || !this.context) return undefined;
      const start = getLinePos(this.range.start, this.context.root);
      if (!start) return undefined;
      const end = getLinePos(this.range.end, this.context.root);
      return {
        start,
        end
      };
    }

    get rawValue() {
      if (!this.valueRange || !this.context) return null;
      const {
        start,
        end
      } = this.valueRange;
      return this.context.src.slice(start, end);
    }

    get tag() {
      for (let i = 0; i < this.props.length; ++i) {
        const tag = this.getPropValue(i, Char.TAG, false);

        if (tag != null) {
          if (tag[1] === '<') {
            return {
              verbatim: tag.slice(2, -1)
            };
          } else {
            // eslint-disable-next-line no-unused-vars
            const [_, handle, suffix] = tag.match(/^(.*!)([^!]*)$/);
            return {
              handle,
              suffix
            };
          }
        }
      }

      return null;
    }

    get valueRangeContainsNewline() {
      if (!this.valueRange || !this.context) return false;
      const {
        start,
        end
      } = this.valueRange;
      const {
        src
      } = this.context;

      for (let i = start; i < end; ++i) {
        if (src[i] === '\n') return true;
      }

      return false;
    }

    parseComment(start) {
      const {
        src
      } = this.context;

      if (src[start] === Char.COMMENT) {
        const end = Node.endOfLine(src, start + 1);
        const commentRange = new Range(start, end);
        this.props.push(commentRange);
        return end;
      }

      return start;
    }
    /**
     * Populates the `origStart` and `origEnd` values of all ranges for this
     * node. Extended by child classes to handle descendant nodes.
     *
     * @param {number[]} cr - Positions of dropped CR characters
     * @param {number} offset - Starting index of `cr` from the last call
     * @returns {number} - The next offset, matching the one found for `origStart`
     */


    setOrigRanges(cr, offset) {
      if (this.range) offset = this.range.setOrigRange(cr, offset);
      if (this.valueRange) this.valueRange.setOrigRange(cr, offset);
      this.props.forEach(prop => prop.setOrigRange(cr, offset));
      return offset;
    }

    toString() {
      const {
        context: {
          src
        },
        range,
        value
      } = this;
      if (value != null) return value;
      const str = src.slice(range.start, range.end);
      return Node.addStringTerminator(src, range.end, str);
    }

  }

  class YAMLError extends Error {
    constructor(name, source, message) {
      if (!message || !(source instanceof Node)) throw new Error(`Invalid arguments for new ${name}`);
      super();
      this.name = name;
      this.message = message;
      this.source = source;
    }

    makePretty() {
      if (!this.source) return;
      this.nodeType = this.source.type;
      const cst = this.source.context && this.source.context.root;

      if (typeof this.offset === 'number') {
        this.range = new Range(this.offset, this.offset + 1);
        const start = cst && getLinePos(this.offset, cst);

        if (start) {
          const end = {
            line: start.line,
            col: start.col + 1
          };
          this.linePos = {
            start,
            end
          };
        }

        delete this.offset;
      } else {
        this.range = this.source.range;
        this.linePos = this.source.rangeAsLinePos;
      }

      if (this.linePos) {
        const {
          line,
          col
        } = this.linePos.start;
        this.message += ` at line ${line}, column ${col}`;
        const ctx = cst && getPrettyContext(this.linePos, cst);
        if (ctx) this.message += `:\n\n${ctx}\n`;
      }

      delete this.source;
    }

  }
  class YAMLReferenceError extends YAMLError {
    constructor(source, message) {
      super('YAMLReferenceError', source, message);
    }

  }
  class YAMLSemanticError extends YAMLError {
    constructor(source, message) {
      super('YAMLSemanticError', source, message);
    }

  }
  class YAMLSyntaxError extends YAMLError {
    constructor(source, message) {
      super('YAMLSyntaxError', source, message);
    }

  }
  class YAMLWarning extends YAMLError {
    constructor(source, message) {
      super('YAMLWarning', source, message);
    }

  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  class PlainValue extends Node {
    static endOfLine(src, start, inFlow) {
      let ch = src[start];
      let offset = start;

      while (ch && ch !== '\n') {
        if (inFlow && (ch === '[' || ch === ']' || ch === '{' || ch === '}' || ch === ',')) break;
        const next = src[offset + 1];
        if (ch === ':' && (!next || next === '\n' || next === '\t' || next === ' ' || inFlow && next === ',')) break;
        if ((ch === ' ' || ch === '\t') && next === '#') break;
        offset += 1;
        ch = next;
      }

      return offset;
    }

    get strValue() {
      if (!this.valueRange || !this.context) return null;
      let {
        start,
        end
      } = this.valueRange;
      const {
        src
      } = this.context;
      let ch = src[end - 1];

      while (start < end && (ch === '\n' || ch === '\t' || ch === ' ')) ch = src[--end - 1];

      let str = '';

      for (let i = start; i < end; ++i) {
        const ch = src[i];

        if (ch === '\n') {
          const {
            fold,
            offset
          } = Node.foldNewline(src, i, -1);
          str += fold;
          i = offset;
        } else if (ch === ' ' || ch === '\t') {
          // trim trailing whitespace
          const wsStart = i;
          let next = src[i + 1];

          while (i < end && (next === ' ' || next === '\t')) {
            i += 1;
            next = src[i + 1];
          }

          if (next !== '\n') str += i > wsStart ? src.slice(wsStart, i + 1) : ch;
        } else {
          str += ch;
        }
      }

      const ch0 = src[start];

      switch (ch0) {
        case '\t':
          {
            const msg = 'Plain value cannot start with a tab character';
            const errors = [new YAMLSemanticError(this, msg)];
            return {
              errors,
              str
            };
          }

        case '@':
        case '`':
          {
            const msg = `Plain value cannot start with reserved character ${ch0}`;
            const errors = [new YAMLSemanticError(this, msg)];
            return {
              errors,
              str
            };
          }

        default:
          return str;
      }
    }

    parseBlockValue(start) {
      const {
        indent,
        inFlow,
        src
      } = this.context;
      let offset = start;
      let valueEnd = start;

      for (let ch = src[offset]; ch === '\n'; ch = src[offset]) {
        if (Node.atDocumentBoundary(src, offset + 1)) break;
        const end = Node.endOfBlockIndent(src, indent, offset + 1);
        if (end === null || src[end] === '#') break;

        if (src[end] === '\n') {
          offset = end;
        } else {
          valueEnd = PlainValue.endOfLine(src, end, inFlow);
          offset = valueEnd;
        }
      }

      if (this.valueRange.isEmpty()) this.valueRange.start = start;
      this.valueRange.end = valueEnd;
      return valueEnd;
    }
    /**
     * Parses a plain value from the source
     *
     * Accepted forms are:
     * ```
     * #comment
     *
     * first line
     *
     * first line #comment
     *
     * first line
     * block
     * lines
     *
     * #comment
     * block
     * lines
     * ```
     * where block lines are empty or have an indent level greater than `indent`.
     *
     * @param {ParseContext} context
     * @param {number} start - Index of first character
     * @returns {number} - Index of the character after this scalar, may be `\n`
     */


    parse(context, start) {
      this.context = context;
      const {
        inFlow,
        src
      } = context;
      let offset = start;
      const ch = src[offset];

      if (ch && ch !== '#' && ch !== '\n') {
        offset = PlainValue.endOfLine(src, start, inFlow);
      }

      this.valueRange = new Range(start, offset);
      offset = Node.endOfWhiteSpace(src, offset);
      offset = this.parseComment(offset);

      if (!this.hasComment || this.valueRange.isEmpty()) {
        offset = this.parseBlockValue(offset);
      }

      return offset;
    }

  }

  var Char_1 = Char;
  var Node_1 = Node;
  var PlainValue_1 = PlainValue;
  var Range_1 = Range;
  var Type_1 = Type;
  var YAMLError_1 = YAMLError;
  var YAMLReferenceError_1 = YAMLReferenceError;
  var YAMLSemanticError_1 = YAMLSemanticError;
  var YAMLSyntaxError_1 = YAMLSyntaxError;
  var YAMLWarning_1 = YAMLWarning;
  var _defineProperty_1 = _defineProperty;
  var defaultTagPrefix_1 = defaultTagPrefix;
  var defaultTags_1 = defaultTags;

  var PlainValueEc8e588e = {
  	Char: Char_1,
  	Node: Node_1,
  	PlainValue: PlainValue_1,
  	Range: Range_1,
  	Type: Type_1,
  	YAMLError: YAMLError_1,
  	YAMLReferenceError: YAMLReferenceError_1,
  	YAMLSemanticError: YAMLSemanticError_1,
  	YAMLSyntaxError: YAMLSyntaxError_1,
  	YAMLWarning: YAMLWarning_1,
  	_defineProperty: _defineProperty_1,
  	defaultTagPrefix: defaultTagPrefix_1,
  	defaultTags: defaultTags_1
  };

  class BlankLine extends PlainValueEc8e588e.Node {
    constructor() {
      super(PlainValueEc8e588e.Type.BLANK_LINE);
    }
    /* istanbul ignore next */


    get includesTrailingLines() {
      // This is never called from anywhere, but if it were,
      // this is the value it should return.
      return true;
    }
    /**
     * Parses a blank line from the source
     *
     * @param {ParseContext} context
     * @param {number} start - Index of first \n character
     * @returns {number} - Index of the character after this
     */


    parse(context, start) {
      this.context = context;
      this.range = new PlainValueEc8e588e.Range(start, start + 1);
      return start + 1;
    }

  }

  class CollectionItem extends PlainValueEc8e588e.Node {
    constructor(type, props) {
      super(type, props);
      this.node = null;
    }

    get includesTrailingLines() {
      return !!this.node && this.node.includesTrailingLines;
    }
    /**
     * @param {ParseContext} context
     * @param {number} start - Index of first character
     * @returns {number} - Index of the character after this
     */


    parse(context, start) {
      this.context = context;
      const {
        parseNode,
        src
      } = context;
      let {
        atLineStart,
        lineStart
      } = context;
      if (!atLineStart && this.type === PlainValueEc8e588e.Type.SEQ_ITEM) this.error = new PlainValueEc8e588e.YAMLSemanticError(this, 'Sequence items must not have preceding content on the same line');
      const indent = atLineStart ? start - lineStart : context.indent;
      let offset = PlainValueEc8e588e.Node.endOfWhiteSpace(src, start + 1);
      let ch = src[offset];
      const inlineComment = ch === '#';
      const comments = [];
      let blankLine = null;

      while (ch === '\n' || ch === '#') {
        if (ch === '#') {
          const end = PlainValueEc8e588e.Node.endOfLine(src, offset + 1);
          comments.push(new PlainValueEc8e588e.Range(offset, end));
          offset = end;
        } else {
          atLineStart = true;
          lineStart = offset + 1;
          const wsEnd = PlainValueEc8e588e.Node.endOfWhiteSpace(src, lineStart);

          if (src[wsEnd] === '\n' && comments.length === 0) {
            blankLine = new BlankLine();
            lineStart = blankLine.parse({
              src
            }, lineStart);
          }

          offset = PlainValueEc8e588e.Node.endOfIndent(src, lineStart);
        }

        ch = src[offset];
      }

      if (PlainValueEc8e588e.Node.nextNodeIsIndented(ch, offset - (lineStart + indent), this.type !== PlainValueEc8e588e.Type.SEQ_ITEM)) {
        this.node = parseNode({
          atLineStart,
          inCollection: false,
          indent,
          lineStart,
          parent: this
        }, offset);
      } else if (ch && lineStart > start + 1) {
        offset = lineStart - 1;
      }

      if (this.node) {
        if (blankLine) {
          // Only blank lines preceding non-empty nodes are captured. Note that
          // this means that collection item range start indices do not always
          // increase monotonically. -- eemeli/yaml#126
          const items = context.parent.items || context.parent.contents;
          if (items) items.push(blankLine);
        }

        if (comments.length) Array.prototype.push.apply(this.props, comments);
        offset = this.node.range.end;
      } else {
        if (inlineComment) {
          const c = comments[0];
          this.props.push(c);
          offset = c.end;
        } else {
          offset = PlainValueEc8e588e.Node.endOfLine(src, start + 1);
        }
      }

      const end = this.node ? this.node.valueRange.end : offset;
      this.valueRange = new PlainValueEc8e588e.Range(start, end);
      return offset;
    }

    setOrigRanges(cr, offset) {
      offset = super.setOrigRanges(cr, offset);
      return this.node ? this.node.setOrigRanges(cr, offset) : offset;
    }

    toString() {
      const {
        context: {
          src
        },
        node,
        range,
        value
      } = this;
      if (value != null) return value;
      const str = node ? src.slice(range.start, node.range.start) + String(node) : src.slice(range.start, range.end);
      return PlainValueEc8e588e.Node.addStringTerminator(src, range.end, str);
    }

  }

  class Comment extends PlainValueEc8e588e.Node {
    constructor() {
      super(PlainValueEc8e588e.Type.COMMENT);
    }
    /**
     * Parses a comment line from the source
     *
     * @param {ParseContext} context
     * @param {number} start - Index of first character
     * @returns {number} - Index of the character after this scalar
     */


    parse(context, start) {
      this.context = context;
      const offset = this.parseComment(start);
      this.range = new PlainValueEc8e588e.Range(start, offset);
      return offset;
    }

  }

  function grabCollectionEndComments(node) {
    let cnode = node;

    while (cnode instanceof CollectionItem) cnode = cnode.node;

    if (!(cnode instanceof Collection)) return null;
    const len = cnode.items.length;
    let ci = -1;

    for (let i = len - 1; i >= 0; --i) {
      const n = cnode.items[i];

      if (n.type === PlainValueEc8e588e.Type.COMMENT) {
        // Keep sufficiently indented comments with preceding node
        const {
          indent,
          lineStart
        } = n.context;
        if (indent > 0 && n.range.start >= lineStart + indent) break;
        ci = i;
      } else if (n.type === PlainValueEc8e588e.Type.BLANK_LINE) ci = i;else break;
    }

    if (ci === -1) return null;
    const ca = cnode.items.splice(ci, len - ci);
    const prevEnd = ca[0].range.start;

    while (true) {
      cnode.range.end = prevEnd;
      if (cnode.valueRange && cnode.valueRange.end > prevEnd) cnode.valueRange.end = prevEnd;
      if (cnode === node) break;
      cnode = cnode.context.parent;
    }

    return ca;
  }
  class Collection extends PlainValueEc8e588e.Node {
    static nextContentHasIndent(src, offset, indent) {
      const lineStart = PlainValueEc8e588e.Node.endOfLine(src, offset) + 1;
      offset = PlainValueEc8e588e.Node.endOfWhiteSpace(src, lineStart);
      const ch = src[offset];
      if (!ch) return false;
      if (offset >= lineStart + indent) return true;
      if (ch !== '#' && ch !== '\n') return false;
      return Collection.nextContentHasIndent(src, offset, indent);
    }

    constructor(firstItem) {
      super(firstItem.type === PlainValueEc8e588e.Type.SEQ_ITEM ? PlainValueEc8e588e.Type.SEQ : PlainValueEc8e588e.Type.MAP);

      for (let i = firstItem.props.length - 1; i >= 0; --i) {
        if (firstItem.props[i].start < firstItem.context.lineStart) {
          // props on previous line are assumed by the collection
          this.props = firstItem.props.slice(0, i + 1);
          firstItem.props = firstItem.props.slice(i + 1);
          const itemRange = firstItem.props[0] || firstItem.valueRange;
          firstItem.range.start = itemRange.start;
          break;
        }
      }

      this.items = [firstItem];
      const ec = grabCollectionEndComments(firstItem);
      if (ec) Array.prototype.push.apply(this.items, ec);
    }

    get includesTrailingLines() {
      return this.items.length > 0;
    }
    /**
     * @param {ParseContext} context
     * @param {number} start - Index of first character
     * @returns {number} - Index of the character after this
     */


    parse(context, start) {
      this.context = context;
      const {
        parseNode,
        src
      } = context; // It's easier to recalculate lineStart here rather than tracking down the
      // last context from which to read it -- eemeli/yaml#2

      let lineStart = PlainValueEc8e588e.Node.startOfLine(src, start);
      const firstItem = this.items[0]; // First-item context needs to be correct for later comment handling
      // -- eemeli/yaml#17

      firstItem.context.parent = this;
      this.valueRange = PlainValueEc8e588e.Range.copy(firstItem.valueRange);
      const indent = firstItem.range.start - firstItem.context.lineStart;
      let offset = start;
      offset = PlainValueEc8e588e.Node.normalizeOffset(src, offset);
      let ch = src[offset];
      let atLineStart = PlainValueEc8e588e.Node.endOfWhiteSpace(src, lineStart) === offset;
      let prevIncludesTrailingLines = false;

      while (ch) {
        while (ch === '\n' || ch === '#') {
          if (atLineStart && ch === '\n' && !prevIncludesTrailingLines) {
            const blankLine = new BlankLine();
            offset = blankLine.parse({
              src
            }, offset);
            this.valueRange.end = offset;

            if (offset >= src.length) {
              ch = null;
              break;
            }

            this.items.push(blankLine);
            offset -= 1; // blankLine.parse() consumes terminal newline
          } else if (ch === '#') {
            if (offset < lineStart + indent && !Collection.nextContentHasIndent(src, offset, indent)) {
              return offset;
            }

            const comment = new Comment();
            offset = comment.parse({
              indent,
              lineStart,
              src
            }, offset);
            this.items.push(comment);
            this.valueRange.end = offset;

            if (offset >= src.length) {
              ch = null;
              break;
            }
          }

          lineStart = offset + 1;
          offset = PlainValueEc8e588e.Node.endOfIndent(src, lineStart);

          if (PlainValueEc8e588e.Node.atBlank(src, offset)) {
            const wsEnd = PlainValueEc8e588e.Node.endOfWhiteSpace(src, offset);
            const next = src[wsEnd];

            if (!next || next === '\n' || next === '#') {
              offset = wsEnd;
            }
          }

          ch = src[offset];
          atLineStart = true;
        }

        if (!ch) {
          break;
        }

        if (offset !== lineStart + indent && (atLineStart || ch !== ':')) {
          if (offset < lineStart + indent) {
            if (lineStart > start) offset = lineStart;
            break;
          } else if (!this.error) {
            const msg = 'All collection items must start at the same column';
            this.error = new PlainValueEc8e588e.YAMLSyntaxError(this, msg);
          }
        }

        if (firstItem.type === PlainValueEc8e588e.Type.SEQ_ITEM) {
          if (ch !== '-') {
            if (lineStart > start) offset = lineStart;
            break;
          }
        } else if (ch === '-' && !this.error) {
          // map key may start with -, as long as it's followed by a non-whitespace char
          const next = src[offset + 1];

          if (!next || next === '\n' || next === '\t' || next === ' ') {
            const msg = 'A collection cannot be both a mapping and a sequence';
            this.error = new PlainValueEc8e588e.YAMLSyntaxError(this, msg);
          }
        }

        const node = parseNode({
          atLineStart,
          inCollection: true,
          indent,
          lineStart,
          parent: this
        }, offset);
        if (!node) return offset; // at next document start

        this.items.push(node);
        this.valueRange.end = node.valueRange.end;
        offset = PlainValueEc8e588e.Node.normalizeOffset(src, node.range.end);
        ch = src[offset];
        atLineStart = false;
        prevIncludesTrailingLines = node.includesTrailingLines; // Need to reset lineStart and atLineStart here if preceding node's range
        // has advanced to check the current line's indentation level
        // -- eemeli/yaml#10 & eemeli/yaml#38

        if (ch) {
          let ls = offset - 1;
          let prev = src[ls];

          while (prev === ' ' || prev === '\t') prev = src[--ls];

          if (prev === '\n') {
            lineStart = ls + 1;
            atLineStart = true;
          }
        }

        const ec = grabCollectionEndComments(node);
        if (ec) Array.prototype.push.apply(this.items, ec);
      }

      return offset;
    }

    setOrigRanges(cr, offset) {
      offset = super.setOrigRanges(cr, offset);
      this.items.forEach(node => {
        offset = node.setOrigRanges(cr, offset);
      });
      return offset;
    }

    toString() {
      const {
        context: {
          src
        },
        items,
        range,
        value
      } = this;
      if (value != null) return value;
      let str = src.slice(range.start, items[0].range.start) + String(items[0]);

      for (let i = 1; i < items.length; ++i) {
        const item = items[i];
        const {
          atLineStart,
          indent
        } = item.context;
        if (atLineStart) for (let i = 0; i < indent; ++i) str += ' ';
        str += String(item);
      }

      return PlainValueEc8e588e.Node.addStringTerminator(src, range.end, str);
    }

  }

  class Directive extends PlainValueEc8e588e.Node {
    constructor() {
      super(PlainValueEc8e588e.Type.DIRECTIVE);
      this.name = null;
    }

    get parameters() {
      const raw = this.rawValue;
      return raw ? raw.trim().split(/[ \t]+/) : [];
    }

    parseName(start) {
      const {
        src
      } = this.context;
      let offset = start;
      let ch = src[offset];

      while (ch && ch !== '\n' && ch !== '\t' && ch !== ' ') ch = src[offset += 1];

      this.name = src.slice(start, offset);
      return offset;
    }

    parseParameters(start) {
      const {
        src
      } = this.context;
      let offset = start;
      let ch = src[offset];

      while (ch && ch !== '\n' && ch !== '#') ch = src[offset += 1];

      this.valueRange = new PlainValueEc8e588e.Range(start, offset);
      return offset;
    }

    parse(context, start) {
      this.context = context;
      let offset = this.parseName(start + 1);
      offset = this.parseParameters(offset);
      offset = this.parseComment(offset);
      this.range = new PlainValueEc8e588e.Range(start, offset);
      return offset;
    }

  }

  class Document extends PlainValueEc8e588e.Node {
    static startCommentOrEndBlankLine(src, start) {
      const offset = PlainValueEc8e588e.Node.endOfWhiteSpace(src, start);
      const ch = src[offset];
      return ch === '#' || ch === '\n' ? offset : start;
    }

    constructor() {
      super(PlainValueEc8e588e.Type.DOCUMENT);
      this.directives = null;
      this.contents = null;
      this.directivesEndMarker = null;
      this.documentEndMarker = null;
    }

    parseDirectives(start) {
      const {
        src
      } = this.context;
      this.directives = [];
      let atLineStart = true;
      let hasDirectives = false;
      let offset = start;

      while (!PlainValueEc8e588e.Node.atDocumentBoundary(src, offset, PlainValueEc8e588e.Char.DIRECTIVES_END)) {
        offset = Document.startCommentOrEndBlankLine(src, offset);

        switch (src[offset]) {
          case '\n':
            if (atLineStart) {
              const blankLine = new BlankLine();
              offset = blankLine.parse({
                src
              }, offset);

              if (offset < src.length) {
                this.directives.push(blankLine);
              }
            } else {
              offset += 1;
              atLineStart = true;
            }

            break;

          case '#':
            {
              const comment = new Comment();
              offset = comment.parse({
                src
              }, offset);
              this.directives.push(comment);
              atLineStart = false;
            }
            break;

          case '%':
            {
              const directive = new Directive();
              offset = directive.parse({
                parent: this,
                src
              }, offset);
              this.directives.push(directive);
              hasDirectives = true;
              atLineStart = false;
            }
            break;

          default:
            if (hasDirectives) {
              this.error = new PlainValueEc8e588e.YAMLSemanticError(this, 'Missing directives-end indicator line');
            } else if (this.directives.length > 0) {
              this.contents = this.directives;
              this.directives = [];
            }

            return offset;
        }
      }

      if (src[offset]) {
        this.directivesEndMarker = new PlainValueEc8e588e.Range(offset, offset + 3);
        return offset + 3;
      }

      if (hasDirectives) {
        this.error = new PlainValueEc8e588e.YAMLSemanticError(this, 'Missing directives-end indicator line');
      } else if (this.directives.length > 0) {
        this.contents = this.directives;
        this.directives = [];
      }

      return offset;
    }

    parseContents(start) {
      const {
        parseNode,
        src
      } = this.context;
      if (!this.contents) this.contents = [];
      let lineStart = start;

      while (src[lineStart - 1] === '-') lineStart -= 1;

      let offset = PlainValueEc8e588e.Node.endOfWhiteSpace(src, start);
      let atLineStart = lineStart === start;
      this.valueRange = new PlainValueEc8e588e.Range(offset);

      while (!PlainValueEc8e588e.Node.atDocumentBoundary(src, offset, PlainValueEc8e588e.Char.DOCUMENT_END)) {
        switch (src[offset]) {
          case '\n':
            if (atLineStart) {
              const blankLine = new BlankLine();
              offset = blankLine.parse({
                src
              }, offset);

              if (offset < src.length) {
                this.contents.push(blankLine);
              }
            } else {
              offset += 1;
              atLineStart = true;
            }

            lineStart = offset;
            break;

          case '#':
            {
              const comment = new Comment();
              offset = comment.parse({
                src
              }, offset);
              this.contents.push(comment);
              atLineStart = false;
            }
            break;

          default:
            {
              const iEnd = PlainValueEc8e588e.Node.endOfIndent(src, offset);
              const context = {
                atLineStart,
                indent: -1,
                inFlow: false,
                inCollection: false,
                lineStart,
                parent: this
              };
              const node = parseNode(context, iEnd);
              if (!node) return this.valueRange.end = iEnd; // at next document start

              this.contents.push(node);
              offset = node.range.end;
              atLineStart = false;
              const ec = grabCollectionEndComments(node);
              if (ec) Array.prototype.push.apply(this.contents, ec);
            }
        }

        offset = Document.startCommentOrEndBlankLine(src, offset);
      }

      this.valueRange.end = offset;

      if (src[offset]) {
        this.documentEndMarker = new PlainValueEc8e588e.Range(offset, offset + 3);
        offset += 3;

        if (src[offset]) {
          offset = PlainValueEc8e588e.Node.endOfWhiteSpace(src, offset);

          if (src[offset] === '#') {
            const comment = new Comment();
            offset = comment.parse({
              src
            }, offset);
            this.contents.push(comment);
          }

          switch (src[offset]) {
            case '\n':
              offset += 1;
              break;

            case undefined:
              break;

            default:
              this.error = new PlainValueEc8e588e.YAMLSyntaxError(this, 'Document end marker line cannot have a non-comment suffix');
          }
        }
      }

      return offset;
    }
    /**
     * @param {ParseContext} context
     * @param {number} start - Index of first character
     * @returns {number} - Index of the character after this
     */


    parse(context, start) {
      context.root = this;
      this.context = context;
      const {
        src
      } = context;
      let offset = src.charCodeAt(start) === 0xfeff ? start + 1 : start; // skip BOM

      offset = this.parseDirectives(offset);
      offset = this.parseContents(offset);
      return offset;
    }

    setOrigRanges(cr, offset) {
      offset = super.setOrigRanges(cr, offset);
      this.directives.forEach(node => {
        offset = node.setOrigRanges(cr, offset);
      });
      if (this.directivesEndMarker) offset = this.directivesEndMarker.setOrigRange(cr, offset);
      this.contents.forEach(node => {
        offset = node.setOrigRanges(cr, offset);
      });
      if (this.documentEndMarker) offset = this.documentEndMarker.setOrigRange(cr, offset);
      return offset;
    }

    toString() {
      const {
        contents,
        directives,
        value
      } = this;
      if (value != null) return value;
      let str = directives.join('');

      if (contents.length > 0) {
        if (directives.length > 0 || contents[0].type === PlainValueEc8e588e.Type.COMMENT) str += '---\n';
        str += contents.join('');
      }

      if (str[str.length - 1] !== '\n') str += '\n';
      return str;
    }

  }

  class Alias extends PlainValueEc8e588e.Node {
    /**
     * Parses an *alias from the source
     *
     * @param {ParseContext} context
     * @param {number} start - Index of first character
     * @returns {number} - Index of the character after this scalar
     */
    parse(context, start) {
      this.context = context;
      const {
        src
      } = context;
      let offset = PlainValueEc8e588e.Node.endOfIdentifier(src, start + 1);
      this.valueRange = new PlainValueEc8e588e.Range(start + 1, offset);
      offset = PlainValueEc8e588e.Node.endOfWhiteSpace(src, offset);
      offset = this.parseComment(offset);
      return offset;
    }

  }

  const Chomp = {
    CLIP: 'CLIP',
    KEEP: 'KEEP',
    STRIP: 'STRIP'
  };
  class BlockValue extends PlainValueEc8e588e.Node {
    constructor(type, props) {
      super(type, props);
      this.blockIndent = null;
      this.chomping = Chomp.CLIP;
      this.header = null;
    }

    get includesTrailingLines() {
      return this.chomping === Chomp.KEEP;
    }

    get strValue() {
      if (!this.valueRange || !this.context) return null;
      let {
        start,
        end
      } = this.valueRange;
      const {
        indent,
        src
      } = this.context;
      if (this.valueRange.isEmpty()) return '';
      let lastNewLine = null;
      let ch = src[end - 1];

      while (ch === '\n' || ch === '\t' || ch === ' ') {
        end -= 1;

        if (end <= start) {
          if (this.chomping === Chomp.KEEP) break;else return ''; // probably never happens
        }

        if (ch === '\n') lastNewLine = end;
        ch = src[end - 1];
      }

      let keepStart = end + 1;

      if (lastNewLine) {
        if (this.chomping === Chomp.KEEP) {
          keepStart = lastNewLine;
          end = this.valueRange.end;
        } else {
          end = lastNewLine;
        }
      }

      const bi = indent + this.blockIndent;
      const folded = this.type === PlainValueEc8e588e.Type.BLOCK_FOLDED;
      let atStart = true;
      let str = '';
      let sep = '';
      let prevMoreIndented = false;

      for (let i = start; i < end; ++i) {
        for (let j = 0; j < bi; ++j) {
          if (src[i] !== ' ') break;
          i += 1;
        }

        const ch = src[i];

        if (ch === '\n') {
          if (sep === '\n') str += '\n';else sep = '\n';
        } else {
          const lineEnd = PlainValueEc8e588e.Node.endOfLine(src, i);
          const line = src.slice(i, lineEnd);
          i = lineEnd;

          if (folded && (ch === ' ' || ch === '\t') && i < keepStart) {
            if (sep === ' ') sep = '\n';else if (!prevMoreIndented && !atStart && sep === '\n') sep = '\n\n';
            str += sep + line; //+ ((lineEnd < end && src[lineEnd]) || '')

            sep = lineEnd < end && src[lineEnd] || '';
            prevMoreIndented = true;
          } else {
            str += sep + line;
            sep = folded && i < keepStart ? ' ' : '\n';
            prevMoreIndented = false;
          }

          if (atStart && line !== '') atStart = false;
        }
      }

      return this.chomping === Chomp.STRIP ? str : str + '\n';
    }

    parseBlockHeader(start) {
      const {
        src
      } = this.context;
      let offset = start + 1;
      let bi = '';

      while (true) {
        const ch = src[offset];

        switch (ch) {
          case '-':
            this.chomping = Chomp.STRIP;
            break;

          case '+':
            this.chomping = Chomp.KEEP;
            break;

          case '0':
          case '1':
          case '2':
          case '3':
          case '4':
          case '5':
          case '6':
          case '7':
          case '8':
          case '9':
            bi += ch;
            break;

          default:
            this.blockIndent = Number(bi) || null;
            this.header = new PlainValueEc8e588e.Range(start, offset);
            return offset;
        }

        offset += 1;
      }
    }

    parseBlockValue(start) {
      const {
        indent,
        src
      } = this.context;
      const explicit = !!this.blockIndent;
      let offset = start;
      let valueEnd = start;
      let minBlockIndent = 1;

      for (let ch = src[offset]; ch === '\n'; ch = src[offset]) {
        offset += 1;
        if (PlainValueEc8e588e.Node.atDocumentBoundary(src, offset)) break;
        const end = PlainValueEc8e588e.Node.endOfBlockIndent(src, indent, offset); // should not include tab?

        if (end === null) break;
        const ch = src[end];
        const lineIndent = end - (offset + indent);

        if (!this.blockIndent) {
          // no explicit block indent, none yet detected
          if (src[end] !== '\n') {
            // first line with non-whitespace content
            if (lineIndent < minBlockIndent) {
              const msg = 'Block scalars with more-indented leading empty lines must use an explicit indentation indicator';
              this.error = new PlainValueEc8e588e.YAMLSemanticError(this, msg);
            }

            this.blockIndent = lineIndent;
          } else if (lineIndent > minBlockIndent) {
            // empty line with more whitespace
            minBlockIndent = lineIndent;
          }
        } else if (ch && ch !== '\n' && lineIndent < this.blockIndent) {
          if (src[end] === '#') break;

          if (!this.error) {
            const src = explicit ? 'explicit indentation indicator' : 'first line';
            const msg = `Block scalars must not be less indented than their ${src}`;
            this.error = new PlainValueEc8e588e.YAMLSemanticError(this, msg);
          }
        }

        if (src[end] === '\n') {
          offset = end;
        } else {
          offset = valueEnd = PlainValueEc8e588e.Node.endOfLine(src, end);
        }
      }

      if (this.chomping !== Chomp.KEEP) {
        offset = src[valueEnd] ? valueEnd + 1 : valueEnd;
      }

      this.valueRange = new PlainValueEc8e588e.Range(start + 1, offset);
      return offset;
    }
    /**
     * Parses a block value from the source
     *
     * Accepted forms are:
     * ```
     * BS
     * block
     * lines
     *
     * BS #comment
     * block
     * lines
     * ```
     * where the block style BS matches the regexp `[|>][-+1-9]*` and block lines
     * are empty or have an indent level greater than `indent`.
     *
     * @param {ParseContext} context
     * @param {number} start - Index of first character
     * @returns {number} - Index of the character after this block
     */


    parse(context, start) {
      this.context = context;
      const {
        src
      } = context;
      let offset = this.parseBlockHeader(start);
      offset = PlainValueEc8e588e.Node.endOfWhiteSpace(src, offset);
      offset = this.parseComment(offset);
      offset = this.parseBlockValue(offset);
      return offset;
    }

    setOrigRanges(cr, offset) {
      offset = super.setOrigRanges(cr, offset);
      return this.header ? this.header.setOrigRange(cr, offset) : offset;
    }

  }

  class FlowCollection extends PlainValueEc8e588e.Node {
    constructor(type, props) {
      super(type, props);
      this.items = null;
    }

    prevNodeIsJsonLike(idx = this.items.length) {
      const node = this.items[idx - 1];
      return !!node && (node.jsonLike || node.type === PlainValueEc8e588e.Type.COMMENT && this.prevNodeIsJsonLike(idx - 1));
    }
    /**
     * @param {ParseContext} context
     * @param {number} start - Index of first character
     * @returns {number} - Index of the character after this
     */


    parse(context, start) {
      this.context = context;
      const {
        parseNode,
        src
      } = context;
      let {
        indent,
        lineStart
      } = context;
      let char = src[start]; // { or [

      this.items = [{
        char,
        offset: start
      }];
      let offset = PlainValueEc8e588e.Node.endOfWhiteSpace(src, start + 1);
      char = src[offset];

      while (char && char !== ']' && char !== '}') {
        switch (char) {
          case '\n':
            {
              lineStart = offset + 1;
              const wsEnd = PlainValueEc8e588e.Node.endOfWhiteSpace(src, lineStart);

              if (src[wsEnd] === '\n') {
                const blankLine = new BlankLine();
                lineStart = blankLine.parse({
                  src
                }, lineStart);
                this.items.push(blankLine);
              }

              offset = PlainValueEc8e588e.Node.endOfIndent(src, lineStart);

              if (offset <= lineStart + indent) {
                char = src[offset];

                if (offset < lineStart + indent || char !== ']' && char !== '}') {
                  const msg = 'Insufficient indentation in flow collection';
                  this.error = new PlainValueEc8e588e.YAMLSemanticError(this, msg);
                }
              }
            }
            break;

          case ',':
            {
              this.items.push({
                char,
                offset
              });
              offset += 1;
            }
            break;

          case '#':
            {
              const comment = new Comment();
              offset = comment.parse({
                src
              }, offset);
              this.items.push(comment);
            }
            break;

          case '?':
          case ':':
            {
              const next = src[offset + 1];

              if (next === '\n' || next === '\t' || next === ' ' || next === ',' || // in-flow : after JSON-like key does not need to be followed by whitespace
              char === ':' && this.prevNodeIsJsonLike()) {
                this.items.push({
                  char,
                  offset
                });
                offset += 1;
                break;
              }
            }
          // fallthrough

          default:
            {
              const node = parseNode({
                atLineStart: false,
                inCollection: false,
                inFlow: true,
                indent: -1,
                lineStart,
                parent: this
              }, offset);

              if (!node) {
                // at next document start
                this.valueRange = new PlainValueEc8e588e.Range(start, offset);
                return offset;
              }

              this.items.push(node);
              offset = PlainValueEc8e588e.Node.normalizeOffset(src, node.range.end);
            }
        }

        offset = PlainValueEc8e588e.Node.endOfWhiteSpace(src, offset);
        char = src[offset];
      }

      this.valueRange = new PlainValueEc8e588e.Range(start, offset + 1);

      if (char) {
        this.items.push({
          char,
          offset
        });
        offset = PlainValueEc8e588e.Node.endOfWhiteSpace(src, offset + 1);
        offset = this.parseComment(offset);
      }

      return offset;
    }

    setOrigRanges(cr, offset) {
      offset = super.setOrigRanges(cr, offset);
      this.items.forEach(node => {
        if (node instanceof PlainValueEc8e588e.Node) {
          offset = node.setOrigRanges(cr, offset);
        } else if (cr.length === 0) {
          node.origOffset = node.offset;
        } else {
          let i = offset;

          while (i < cr.length) {
            if (cr[i] > node.offset) break;else ++i;
          }

          node.origOffset = node.offset + i;
          offset = i;
        }
      });
      return offset;
    }

    toString() {
      const {
        context: {
          src
        },
        items,
        range,
        value
      } = this;
      if (value != null) return value;
      const nodes = items.filter(item => item instanceof PlainValueEc8e588e.Node);
      let str = '';
      let prevEnd = range.start;
      nodes.forEach(node => {
        const prefix = src.slice(prevEnd, node.range.start);
        prevEnd = node.range.end;
        str += prefix + String(node);

        if (str[str.length - 1] === '\n' && src[prevEnd - 1] !== '\n' && src[prevEnd] === '\n') {
          // Comment range does not include the terminal newline, but its
          // stringified value does. Without this fix, newlines at comment ends
          // get duplicated.
          prevEnd += 1;
        }
      });
      str += src.slice(prevEnd, range.end);
      return PlainValueEc8e588e.Node.addStringTerminator(src, range.end, str);
    }

  }

  class QuoteDouble extends PlainValueEc8e588e.Node {
    static endOfQuote(src, offset) {
      let ch = src[offset];

      while (ch && ch !== '"') {
        offset += ch === '\\' ? 2 : 1;
        ch = src[offset];
      }

      return offset + 1;
    }
    /**
     * @returns {string | { str: string, errors: YAMLSyntaxError[] }}
     */


    get strValue() {
      if (!this.valueRange || !this.context) return null;
      const errors = [];
      const {
        start,
        end
      } = this.valueRange;
      const {
        indent,
        src
      } = this.context;
      if (src[end - 1] !== '"') errors.push(new PlainValueEc8e588e.YAMLSyntaxError(this, 'Missing closing "quote')); // Using String#replace is too painful with escaped newlines preceded by
      // escaped backslashes; also, this should be faster.

      let str = '';

      for (let i = start + 1; i < end - 1; ++i) {
        const ch = src[i];

        if (ch === '\n') {
          if (PlainValueEc8e588e.Node.atDocumentBoundary(src, i + 1)) errors.push(new PlainValueEc8e588e.YAMLSemanticError(this, 'Document boundary indicators are not allowed within string values'));
          const {
            fold,
            offset,
            error
          } = PlainValueEc8e588e.Node.foldNewline(src, i, indent);
          str += fold;
          i = offset;
          if (error) errors.push(new PlainValueEc8e588e.YAMLSemanticError(this, 'Multi-line double-quoted string needs to be sufficiently indented'));
        } else if (ch === '\\') {
          i += 1;

          switch (src[i]) {
            case '0':
              str += '\0';
              break;
            // null character

            case 'a':
              str += '\x07';
              break;
            // bell character

            case 'b':
              str += '\b';
              break;
            // backspace

            case 'e':
              str += '\x1b';
              break;
            // escape character

            case 'f':
              str += '\f';
              break;
            // form feed

            case 'n':
              str += '\n';
              break;
            // line feed

            case 'r':
              str += '\r';
              break;
            // carriage return

            case 't':
              str += '\t';
              break;
            // horizontal tab

            case 'v':
              str += '\v';
              break;
            // vertical tab

            case 'N':
              str += '\u0085';
              break;
            // Unicode next line

            case '_':
              str += '\u00a0';
              break;
            // Unicode non-breaking space

            case 'L':
              str += '\u2028';
              break;
            // Unicode line separator

            case 'P':
              str += '\u2029';
              break;
            // Unicode paragraph separator

            case ' ':
              str += ' ';
              break;

            case '"':
              str += '"';
              break;

            case '/':
              str += '/';
              break;

            case '\\':
              str += '\\';
              break;

            case '\t':
              str += '\t';
              break;

            case 'x':
              str += this.parseCharCode(i + 1, 2, errors);
              i += 2;
              break;

            case 'u':
              str += this.parseCharCode(i + 1, 4, errors);
              i += 4;
              break;

            case 'U':
              str += this.parseCharCode(i + 1, 8, errors);
              i += 8;
              break;

            case '\n':
              // skip escaped newlines, but still trim the following line
              while (src[i + 1] === ' ' || src[i + 1] === '\t') i += 1;

              break;

            default:
              errors.push(new PlainValueEc8e588e.YAMLSyntaxError(this, `Invalid escape sequence ${src.substr(i - 1, 2)}`));
              str += '\\' + src[i];
          }
        } else if (ch === ' ' || ch === '\t') {
          // trim trailing whitespace
          const wsStart = i;
          let next = src[i + 1];

          while (next === ' ' || next === '\t') {
            i += 1;
            next = src[i + 1];
          }

          if (next !== '\n') str += i > wsStart ? src.slice(wsStart, i + 1) : ch;
        } else {
          str += ch;
        }
      }

      return errors.length > 0 ? {
        errors,
        str
      } : str;
    }

    parseCharCode(offset, length, errors) {
      const {
        src
      } = this.context;
      const cc = src.substr(offset, length);
      const ok = cc.length === length && /^[0-9a-fA-F]+$/.test(cc);
      const code = ok ? parseInt(cc, 16) : NaN;

      if (isNaN(code)) {
        errors.push(new PlainValueEc8e588e.YAMLSyntaxError(this, `Invalid escape sequence ${src.substr(offset - 2, length + 2)}`));
        return src.substr(offset - 2, length + 2);
      }

      return String.fromCodePoint(code);
    }
    /**
     * Parses a "double quoted" value from the source
     *
     * @param {ParseContext} context
     * @param {number} start - Index of first character
     * @returns {number} - Index of the character after this scalar
     */


    parse(context, start) {
      this.context = context;
      const {
        src
      } = context;
      let offset = QuoteDouble.endOfQuote(src, start + 1);
      this.valueRange = new PlainValueEc8e588e.Range(start, offset);
      offset = PlainValueEc8e588e.Node.endOfWhiteSpace(src, offset);
      offset = this.parseComment(offset);
      return offset;
    }

  }

  class QuoteSingle extends PlainValueEc8e588e.Node {
    static endOfQuote(src, offset) {
      let ch = src[offset];

      while (ch) {
        if (ch === "'") {
          if (src[offset + 1] !== "'") break;
          ch = src[offset += 2];
        } else {
          ch = src[offset += 1];
        }
      }

      return offset + 1;
    }
    /**
     * @returns {string | { str: string, errors: YAMLSyntaxError[] }}
     */


    get strValue() {
      if (!this.valueRange || !this.context) return null;
      const errors = [];
      const {
        start,
        end
      } = this.valueRange;
      const {
        indent,
        src
      } = this.context;
      if (src[end - 1] !== "'") errors.push(new PlainValueEc8e588e.YAMLSyntaxError(this, "Missing closing 'quote"));
      let str = '';

      for (let i = start + 1; i < end - 1; ++i) {
        const ch = src[i];

        if (ch === '\n') {
          if (PlainValueEc8e588e.Node.atDocumentBoundary(src, i + 1)) errors.push(new PlainValueEc8e588e.YAMLSemanticError(this, 'Document boundary indicators are not allowed within string values'));
          const {
            fold,
            offset,
            error
          } = PlainValueEc8e588e.Node.foldNewline(src, i, indent);
          str += fold;
          i = offset;
          if (error) errors.push(new PlainValueEc8e588e.YAMLSemanticError(this, 'Multi-line single-quoted string needs to be sufficiently indented'));
        } else if (ch === "'") {
          str += ch;
          i += 1;
          if (src[i] !== "'") errors.push(new PlainValueEc8e588e.YAMLSyntaxError(this, 'Unescaped single quote? This should not happen.'));
        } else if (ch === ' ' || ch === '\t') {
          // trim trailing whitespace
          const wsStart = i;
          let next = src[i + 1];

          while (next === ' ' || next === '\t') {
            i += 1;
            next = src[i + 1];
          }

          if (next !== '\n') str += i > wsStart ? src.slice(wsStart, i + 1) : ch;
        } else {
          str += ch;
        }
      }

      return errors.length > 0 ? {
        errors,
        str
      } : str;
    }
    /**
     * Parses a 'single quoted' value from the source
     *
     * @param {ParseContext} context
     * @param {number} start - Index of first character
     * @returns {number} - Index of the character after this scalar
     */


    parse(context, start) {
      this.context = context;
      const {
        src
      } = context;
      let offset = QuoteSingle.endOfQuote(src, start + 1);
      this.valueRange = new PlainValueEc8e588e.Range(start, offset);
      offset = PlainValueEc8e588e.Node.endOfWhiteSpace(src, offset);
      offset = this.parseComment(offset);
      return offset;
    }

  }

  function createNewNode(type, props) {
    switch (type) {
      case PlainValueEc8e588e.Type.ALIAS:
        return new Alias(type, props);

      case PlainValueEc8e588e.Type.BLOCK_FOLDED:
      case PlainValueEc8e588e.Type.BLOCK_LITERAL:
        return new BlockValue(type, props);

      case PlainValueEc8e588e.Type.FLOW_MAP:
      case PlainValueEc8e588e.Type.FLOW_SEQ:
        return new FlowCollection(type, props);

      case PlainValueEc8e588e.Type.MAP_KEY:
      case PlainValueEc8e588e.Type.MAP_VALUE:
      case PlainValueEc8e588e.Type.SEQ_ITEM:
        return new CollectionItem(type, props);

      case PlainValueEc8e588e.Type.COMMENT:
      case PlainValueEc8e588e.Type.PLAIN:
        return new PlainValueEc8e588e.PlainValue(type, props);

      case PlainValueEc8e588e.Type.QUOTE_DOUBLE:
        return new QuoteDouble(type, props);

      case PlainValueEc8e588e.Type.QUOTE_SINGLE:
        return new QuoteSingle(type, props);

      /* istanbul ignore next */

      default:
        return null;
      // should never happen
    }
  }
  /**
   * @param {boolean} atLineStart - Node starts at beginning of line
   * @param {boolean} inFlow - true if currently in a flow context
   * @param {boolean} inCollection - true if currently in a collection context
   * @param {number} indent - Current level of indentation
   * @param {number} lineStart - Start of the current line
   * @param {Node} parent - The parent of the node
   * @param {string} src - Source of the YAML document
   */


  class ParseContext {
    static parseType(src, offset, inFlow) {
      switch (src[offset]) {
        case '*':
          return PlainValueEc8e588e.Type.ALIAS;

        case '>':
          return PlainValueEc8e588e.Type.BLOCK_FOLDED;

        case '|':
          return PlainValueEc8e588e.Type.BLOCK_LITERAL;

        case '{':
          return PlainValueEc8e588e.Type.FLOW_MAP;

        case '[':
          return PlainValueEc8e588e.Type.FLOW_SEQ;

        case '?':
          return !inFlow && PlainValueEc8e588e.Node.atBlank(src, offset + 1, true) ? PlainValueEc8e588e.Type.MAP_KEY : PlainValueEc8e588e.Type.PLAIN;

        case ':':
          return !inFlow && PlainValueEc8e588e.Node.atBlank(src, offset + 1, true) ? PlainValueEc8e588e.Type.MAP_VALUE : PlainValueEc8e588e.Type.PLAIN;

        case '-':
          return !inFlow && PlainValueEc8e588e.Node.atBlank(src, offset + 1, true) ? PlainValueEc8e588e.Type.SEQ_ITEM : PlainValueEc8e588e.Type.PLAIN;

        case '"':
          return PlainValueEc8e588e.Type.QUOTE_DOUBLE;

        case "'":
          return PlainValueEc8e588e.Type.QUOTE_SINGLE;

        default:
          return PlainValueEc8e588e.Type.PLAIN;
      }
    }

    constructor(orig = {}, {
      atLineStart,
      inCollection,
      inFlow,
      indent,
      lineStart,
      parent
    } = {}) {
      PlainValueEc8e588e._defineProperty(this, "parseNode", (overlay, start) => {
        if (PlainValueEc8e588e.Node.atDocumentBoundary(this.src, start)) return null;
        const context = new ParseContext(this, overlay);
        const {
          props,
          type,
          valueStart
        } = context.parseProps(start);
        const node = createNewNode(type, props);
        let offset = node.parse(context, valueStart);
        node.range = new PlainValueEc8e588e.Range(start, offset);
        /* istanbul ignore if */

        if (offset <= start) {
          // This should never happen, but if it does, let's make sure to at least
          // step one character forward to avoid a busy loop.
          node.error = new Error(`Node#parse consumed no characters`);
          node.error.parseEnd = offset;
          node.error.source = node;
          node.range.end = start + 1;
        }

        if (context.nodeStartsCollection(node)) {
          if (!node.error && !context.atLineStart && context.parent.type === PlainValueEc8e588e.Type.DOCUMENT) {
            node.error = new PlainValueEc8e588e.YAMLSyntaxError(node, 'Block collection must not have preceding content here (e.g. directives-end indicator)');
          }

          const collection = new Collection(node);
          offset = collection.parse(new ParseContext(context), offset);
          collection.range = new PlainValueEc8e588e.Range(start, offset);
          return collection;
        }

        return node;
      });

      this.atLineStart = atLineStart != null ? atLineStart : orig.atLineStart || false;
      this.inCollection = inCollection != null ? inCollection : orig.inCollection || false;
      this.inFlow = inFlow != null ? inFlow : orig.inFlow || false;
      this.indent = indent != null ? indent : orig.indent;
      this.lineStart = lineStart != null ? lineStart : orig.lineStart;
      this.parent = parent != null ? parent : orig.parent || {};
      this.root = orig.root;
      this.src = orig.src;
    }

    nodeStartsCollection(node) {
      const {
        inCollection,
        inFlow,
        src
      } = this;
      if (inCollection || inFlow) return false;
      if (node instanceof CollectionItem) return true; // check for implicit key

      let offset = node.range.end;
      if (src[offset] === '\n' || src[offset - 1] === '\n') return false;
      offset = PlainValueEc8e588e.Node.endOfWhiteSpace(src, offset);
      return src[offset] === ':';
    } // Anchor and tag are before type, which determines the node implementation
    // class; hence this intermediate step.


    parseProps(offset) {
      const {
        inFlow,
        parent,
        src
      } = this;
      const props = [];
      let lineHasProps = false;
      offset = this.atLineStart ? PlainValueEc8e588e.Node.endOfIndent(src, offset) : PlainValueEc8e588e.Node.endOfWhiteSpace(src, offset);
      let ch = src[offset];

      while (ch === PlainValueEc8e588e.Char.ANCHOR || ch === PlainValueEc8e588e.Char.COMMENT || ch === PlainValueEc8e588e.Char.TAG || ch === '\n') {
        if (ch === '\n') {
          let inEnd = offset;
          let lineStart;

          do {
            lineStart = inEnd + 1;
            inEnd = PlainValueEc8e588e.Node.endOfIndent(src, lineStart);
          } while (src[inEnd] === '\n');

          const indentDiff = inEnd - (lineStart + this.indent);
          const noIndicatorAsIndent = parent.type === PlainValueEc8e588e.Type.SEQ_ITEM && parent.context.atLineStart;
          if (src[inEnd] !== '#' && !PlainValueEc8e588e.Node.nextNodeIsIndented(src[inEnd], indentDiff, !noIndicatorAsIndent)) break;
          this.atLineStart = true;
          this.lineStart = lineStart;
          lineHasProps = false;
          offset = inEnd;
        } else if (ch === PlainValueEc8e588e.Char.COMMENT) {
          const end = PlainValueEc8e588e.Node.endOfLine(src, offset + 1);
          props.push(new PlainValueEc8e588e.Range(offset, end));
          offset = end;
        } else {
          let end = PlainValueEc8e588e.Node.endOfIdentifier(src, offset + 1);

          if (ch === PlainValueEc8e588e.Char.TAG && src[end] === ',' && /^[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+,\d\d\d\d(-\d\d){0,2}\/\S/.test(src.slice(offset + 1, end + 13))) {
            // Let's presume we're dealing with a YAML 1.0 domain tag here, rather
            // than an empty but 'foo.bar' private-tagged node in a flow collection
            // followed without whitespace by a plain string starting with a year
            // or date divided by something.
            end = PlainValueEc8e588e.Node.endOfIdentifier(src, end + 5);
          }

          props.push(new PlainValueEc8e588e.Range(offset, end));
          lineHasProps = true;
          offset = PlainValueEc8e588e.Node.endOfWhiteSpace(src, end);
        }

        ch = src[offset];
      } // '- &a : b' has an anchor on an empty node


      if (lineHasProps && ch === ':' && PlainValueEc8e588e.Node.atBlank(src, offset + 1, true)) offset -= 1;
      const type = ParseContext.parseType(src, offset, inFlow);
      return {
        props,
        type,
        valueStart: offset
      };
    }
    /**
     * Parses a node from the source
     * @param {ParseContext} overlay
     * @param {number} start - Index of first non-whitespace character for the node
     * @returns {?Node} - null if at a document boundary
     */


  }

  // Published as 'yaml/parse-cst'
  function parse(src) {
    const cr = [];

    if (src.indexOf('\r') !== -1) {
      src = src.replace(/\r\n?/g, (match, offset) => {
        if (match.length > 1) cr.push(offset);
        return '\n';
      });
    }

    const documents = [];
    let offset = 0;

    do {
      const doc = new Document();
      const context = new ParseContext({
        src
      });
      offset = doc.parse(context, offset);
      documents.push(doc);
    } while (offset < src.length);

    documents.setOrigRanges = () => {
      if (cr.length === 0) return false;

      for (let i = 1; i < cr.length; ++i) cr[i] -= i;

      let crOffset = 0;

      for (let i = 0; i < documents.length; ++i) {
        crOffset = documents[i].setOrigRanges(cr, crOffset);
      }

      cr.splice(0, cr.length);
      return true;
    };

    documents.toString = () => documents.join('...\n');

    return documents;
  }

  var parse_1 = parse;

  var parseCst = {
  	parse: parse_1
  };

  function addCommentBefore(str, indent, comment) {
    if (!comment) return str;
    const cc = comment.replace(/[\s\S]^/gm, `$&${indent}#`);
    return `#${cc}\n${indent}${str}`;
  }
  function addComment(str, indent, comment) {
    return !comment ? str : comment.indexOf('\n') === -1 ? `${str} #${comment}` : `${str}\n` + comment.replace(/^/gm, `${indent || ''}#`);
  }

  class Node$1 {}

  function toJSON(value, arg, ctx) {
    if (Array.isArray(value)) return value.map((v, i) => toJSON(v, String(i), ctx));

    if (value && typeof value.toJSON === 'function') {
      const anchor = ctx && ctx.anchors && ctx.anchors.get(value);
      if (anchor) ctx.onCreate = res => {
        anchor.res = res;
        delete ctx.onCreate;
      };
      const res = value.toJSON(arg, ctx);
      if (anchor && ctx.onCreate) ctx.onCreate(res);
      return res;
    }

    if ((!ctx || !ctx.keep) && typeof value === 'bigint') return Number(value);
    return value;
  }

  class Scalar extends Node$1 {
    constructor(value) {
      super();
      this.value = value;
    }

    toJSON(arg, ctx) {
      return ctx && ctx.keep ? this.value : toJSON(this.value, arg, ctx);
    }

    toString() {
      return String(this.value);
    }

  }

  function collectionFromPath(schema, path, value) {
    let v = value;

    for (let i = path.length - 1; i >= 0; --i) {
      const k = path[i];

      if (Number.isInteger(k) && k >= 0) {
        const a = [];
        a[k] = v;
        v = a;
      } else {
        const o = {};
        Object.defineProperty(o, k, {
          value: v,
          writable: true,
          enumerable: true,
          configurable: true
        });
        v = o;
      }
    }

    return schema.createNode(v, false);
  } // null, undefined, or an empty non-string iterable (e.g. [])


  const isEmptyPath = path => path == null || typeof path === 'object' && path[Symbol.iterator]().next().done;
  class Collection$1 extends Node$1 {
    constructor(schema) {
      super();

      PlainValueEc8e588e._defineProperty(this, "items", []);

      this.schema = schema;
    }

    addIn(path, value) {
      if (isEmptyPath(path)) this.add(value);else {
        const [key, ...rest] = path;
        const node = this.get(key, true);
        if (node instanceof Collection$1) node.addIn(rest, value);else if (node === undefined && this.schema) this.set(key, collectionFromPath(this.schema, rest, value));else throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
      }
    }

    deleteIn([key, ...rest]) {
      if (rest.length === 0) return this.delete(key);
      const node = this.get(key, true);
      if (node instanceof Collection$1) return node.deleteIn(rest);else throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
    }

    getIn([key, ...rest], keepScalar) {
      const node = this.get(key, true);
      if (rest.length === 0) return !keepScalar && node instanceof Scalar ? node.value : node;else return node instanceof Collection$1 ? node.getIn(rest, keepScalar) : undefined;
    }

    hasAllNullValues() {
      return this.items.every(node => {
        if (!node || node.type !== 'PAIR') return false;
        const n = node.value;
        return n == null || n instanceof Scalar && n.value == null && !n.commentBefore && !n.comment && !n.tag;
      });
    }

    hasIn([key, ...rest]) {
      if (rest.length === 0) return this.has(key);
      const node = this.get(key, true);
      return node instanceof Collection$1 ? node.hasIn(rest) : false;
    }

    setIn([key, ...rest], value) {
      if (rest.length === 0) {
        this.set(key, value);
      } else {
        const node = this.get(key, true);
        if (node instanceof Collection$1) node.setIn(rest, value);else if (node === undefined && this.schema) this.set(key, collectionFromPath(this.schema, rest, value));else throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
      }
    } // overridden in implementations

    /* istanbul ignore next */


    toJSON() {
      return null;
    }

    toString(ctx, {
      blockItem,
      flowChars,
      isMap,
      itemIndent
    }, onComment, onChompKeep) {
      const {
        indent,
        indentStep,
        stringify
      } = ctx;
      const inFlow = this.type === PlainValueEc8e588e.Type.FLOW_MAP || this.type === PlainValueEc8e588e.Type.FLOW_SEQ || ctx.inFlow;
      if (inFlow) itemIndent += indentStep;
      const allNullValues = isMap && this.hasAllNullValues();
      ctx = Object.assign({}, ctx, {
        allNullValues,
        indent: itemIndent,
        inFlow,
        type: null
      });
      let chompKeep = false;
      let hasItemWithNewLine = false;
      const nodes = this.items.reduce((nodes, item, i) => {
        let comment;

        if (item) {
          if (!chompKeep && item.spaceBefore) nodes.push({
            type: 'comment',
            str: ''
          });
          if (item.commentBefore) item.commentBefore.match(/^.*$/gm).forEach(line => {
            nodes.push({
              type: 'comment',
              str: `#${line}`
            });
          });
          if (item.comment) comment = item.comment;
          if (inFlow && (!chompKeep && item.spaceBefore || item.commentBefore || item.comment || item.key && (item.key.commentBefore || item.key.comment) || item.value && (item.value.commentBefore || item.value.comment))) hasItemWithNewLine = true;
        }

        chompKeep = false;
        let str = stringify(item, ctx, () => comment = null, () => chompKeep = true);
        if (inFlow && !hasItemWithNewLine && str.includes('\n')) hasItemWithNewLine = true;
        if (inFlow && i < this.items.length - 1) str += ',';
        str = addComment(str, itemIndent, comment);
        if (chompKeep && (comment || inFlow)) chompKeep = false;
        nodes.push({
          type: 'item',
          str
        });
        return nodes;
      }, []);
      let str;

      if (nodes.length === 0) {
        str = flowChars.start + flowChars.end;
      } else if (inFlow) {
        const {
          start,
          end
        } = flowChars;
        const strings = nodes.map(n => n.str);

        if (hasItemWithNewLine || strings.reduce((sum, str) => sum + str.length + 2, 2) > Collection$1.maxFlowStringSingleLineLength) {
          str = start;

          for (const s of strings) {
            str += s ? `\n${indentStep}${indent}${s}` : '\n';
          }

          str += `\n${indent}${end}`;
        } else {
          str = `${start} ${strings.join(' ')} ${end}`;
        }
      } else {
        const strings = nodes.map(blockItem);
        str = strings.shift();

        for (const s of strings) str += s ? `\n${indent}${s}` : '\n';
      }

      if (this.comment) {
        str += '\n' + this.comment.replace(/^/gm, `${indent}#`);
        if (onComment) onComment();
      } else if (chompKeep && onChompKeep) onChompKeep();

      return str;
    }

  }

  PlainValueEc8e588e._defineProperty(Collection$1, "maxFlowStringSingleLineLength", 60);

  function asItemIndex(key) {
    let idx = key instanceof Scalar ? key.value : key;
    if (idx && typeof idx === 'string') idx = Number(idx);
    return Number.isInteger(idx) && idx >= 0 ? idx : null;
  }

  class YAMLSeq extends Collection$1 {
    add(value) {
      this.items.push(value);
    }

    delete(key) {
      const idx = asItemIndex(key);
      if (typeof idx !== 'number') return false;
      const del = this.items.splice(idx, 1);
      return del.length > 0;
    }

    get(key, keepScalar) {
      const idx = asItemIndex(key);
      if (typeof idx !== 'number') return undefined;
      const it = this.items[idx];
      return !keepScalar && it instanceof Scalar ? it.value : it;
    }

    has(key) {
      const idx = asItemIndex(key);
      return typeof idx === 'number' && idx < this.items.length;
    }

    set(key, value) {
      const idx = asItemIndex(key);
      if (typeof idx !== 'number') throw new Error(`Expected a valid index, not ${key}.`);
      this.items[idx] = value;
    }

    toJSON(_, ctx) {
      const seq = [];
      if (ctx && ctx.onCreate) ctx.onCreate(seq);
      let i = 0;

      for (const item of this.items) seq.push(toJSON(item, String(i++), ctx));

      return seq;
    }

    toString(ctx, onComment, onChompKeep) {
      if (!ctx) return JSON.stringify(this);
      return super.toString(ctx, {
        blockItem: n => n.type === 'comment' ? n.str : `- ${n.str}`,
        flowChars: {
          start: '[',
          end: ']'
        },
        isMap: false,
        itemIndent: (ctx.indent || '') + '  '
      }, onComment, onChompKeep);
    }

  }

  const stringifyKey = (key, jsKey, ctx) => {
    if (jsKey === null) return '';
    if (typeof jsKey !== 'object') return String(jsKey);
    if (key instanceof Node$1 && ctx && ctx.doc) return key.toString({
      anchors: Object.create(null),
      doc: ctx.doc,
      indent: '',
      indentStep: ctx.indentStep,
      inFlow: true,
      inStringifyKey: true,
      stringify: ctx.stringify
    });
    return JSON.stringify(jsKey);
  };

  class Pair extends Node$1 {
    constructor(key, value = null) {
      super();
      this.key = key;
      this.value = value;
      this.type = Pair.Type.PAIR;
    }

    get commentBefore() {
      return this.key instanceof Node$1 ? this.key.commentBefore : undefined;
    }

    set commentBefore(cb) {
      if (this.key == null) this.key = new Scalar(null);
      if (this.key instanceof Node$1) this.key.commentBefore = cb;else {
        const msg = 'Pair.commentBefore is an alias for Pair.key.commentBefore. To set it, the key must be a Node.';
        throw new Error(msg);
      }
    }

    addToJSMap(ctx, map) {
      const key = toJSON(this.key, '', ctx);

      if (map instanceof Map) {
        const value = toJSON(this.value, key, ctx);
        map.set(key, value);
      } else if (map instanceof Set) {
        map.add(key);
      } else {
        const stringKey = stringifyKey(this.key, key, ctx);
        const value = toJSON(this.value, stringKey, ctx);
        if (stringKey in map) Object.defineProperty(map, stringKey, {
          value,
          writable: true,
          enumerable: true,
          configurable: true
        });else map[stringKey] = value;
      }

      return map;
    }

    toJSON(_, ctx) {
      const pair = ctx && ctx.mapAsMap ? new Map() : {};
      return this.addToJSMap(ctx, pair);
    }

    toString(ctx, onComment, onChompKeep) {
      if (!ctx || !ctx.doc) return JSON.stringify(this);
      const {
        indent: indentSize,
        indentSeq,
        simpleKeys
      } = ctx.doc.options;
      let {
        key,
        value
      } = this;
      let keyComment = key instanceof Node$1 && key.comment;

      if (simpleKeys) {
        if (keyComment) {
          throw new Error('With simple keys, key nodes cannot have comments');
        }

        if (key instanceof Collection$1) {
          const msg = 'With simple keys, collection cannot be used as a key value';
          throw new Error(msg);
        }
      }

      let explicitKey = !simpleKeys && (!key || keyComment || (key instanceof Node$1 ? key instanceof Collection$1 || key.type === PlainValueEc8e588e.Type.BLOCK_FOLDED || key.type === PlainValueEc8e588e.Type.BLOCK_LITERAL : typeof key === 'object'));
      const {
        doc,
        indent,
        indentStep,
        stringify
      } = ctx;
      ctx = Object.assign({}, ctx, {
        implicitKey: !explicitKey,
        indent: indent + indentStep
      });
      let chompKeep = false;
      let str = stringify(key, ctx, () => keyComment = null, () => chompKeep = true);
      str = addComment(str, ctx.indent, keyComment);

      if (!explicitKey && str.length > 1024) {
        if (simpleKeys) throw new Error('With simple keys, single line scalar must not span more than 1024 characters');
        explicitKey = true;
      }

      if (ctx.allNullValues && !simpleKeys) {
        if (this.comment) {
          str = addComment(str, ctx.indent, this.comment);
          if (onComment) onComment();
        } else if (chompKeep && !keyComment && onChompKeep) onChompKeep();

        return ctx.inFlow && !explicitKey ? str : `? ${str}`;
      }

      str = explicitKey ? `? ${str}\n${indent}:` : `${str}:`;

      if (this.comment) {
        // expected (but not strictly required) to be a single-line comment
        str = addComment(str, ctx.indent, this.comment);
        if (onComment) onComment();
      }

      let vcb = '';
      let valueComment = null;

      if (value instanceof Node$1) {
        if (value.spaceBefore) vcb = '\n';

        if (value.commentBefore) {
          const cs = value.commentBefore.replace(/^/gm, `${ctx.indent}#`);
          vcb += `\n${cs}`;
        }

        valueComment = value.comment;
      } else if (value && typeof value === 'object') {
        value = doc.schema.createNode(value, true);
      }

      ctx.implicitKey = false;
      if (!explicitKey && !this.comment && value instanceof Scalar) ctx.indentAtStart = str.length + 1;
      chompKeep = false;

      if (!indentSeq && indentSize >= 2 && !ctx.inFlow && !explicitKey && value instanceof YAMLSeq && value.type !== PlainValueEc8e588e.Type.FLOW_SEQ && !value.tag && !doc.anchors.getName(value)) {
        // If indentSeq === false, consider '- ' as part of indentation where possible
        ctx.indent = ctx.indent.substr(2);
      }

      const valueStr = stringify(value, ctx, () => valueComment = null, () => chompKeep = true);
      let ws = ' ';

      if (vcb || this.comment) {
        ws = `${vcb}\n${ctx.indent}`;
      } else if (!explicitKey && value instanceof Collection$1) {
        const flow = valueStr[0] === '[' || valueStr[0] === '{';
        if (!flow || valueStr.includes('\n')) ws = `\n${ctx.indent}`;
      } else if (valueStr[0] === '\n') ws = '';

      if (chompKeep && !valueComment && onChompKeep) onChompKeep();
      return addComment(str + ws + valueStr, ctx.indent, valueComment);
    }

  }

  PlainValueEc8e588e._defineProperty(Pair, "Type", {
    PAIR: 'PAIR',
    MERGE_PAIR: 'MERGE_PAIR'
  });

  const getAliasCount = (node, anchors) => {
    if (node instanceof Alias$1) {
      const anchor = anchors.get(node.source);
      return anchor.count * anchor.aliasCount;
    } else if (node instanceof Collection$1) {
      let count = 0;

      for (const item of node.items) {
        const c = getAliasCount(item, anchors);
        if (c > count) count = c;
      }

      return count;
    } else if (node instanceof Pair) {
      const kc = getAliasCount(node.key, anchors);
      const vc = getAliasCount(node.value, anchors);
      return Math.max(kc, vc);
    }

    return 1;
  };

  class Alias$1 extends Node$1 {
    static stringify({
      range,
      source
    }, {
      anchors,
      doc,
      implicitKey,
      inStringifyKey
    }) {
      let anchor = Object.keys(anchors).find(a => anchors[a] === source);
      if (!anchor && inStringifyKey) anchor = doc.anchors.getName(source) || doc.anchors.newName();
      if (anchor) return `*${anchor}${implicitKey ? ' ' : ''}`;
      const msg = doc.anchors.getName(source) ? 'Alias node must be after source node' : 'Source node not found for alias node';
      throw new Error(`${msg} [${range}]`);
    }

    constructor(source) {
      super();
      this.source = source;
      this.type = PlainValueEc8e588e.Type.ALIAS;
    }

    set tag(t) {
      throw new Error('Alias nodes cannot have tags');
    }

    toJSON(arg, ctx) {
      if (!ctx) return toJSON(this.source, arg, ctx);
      const {
        anchors,
        maxAliasCount
      } = ctx;
      const anchor = anchors.get(this.source);
      /* istanbul ignore if */

      if (!anchor || anchor.res === undefined) {
        const msg = 'This should not happen: Alias anchor was not resolved?';
        if (this.cstNode) throw new PlainValueEc8e588e.YAMLReferenceError(this.cstNode, msg);else throw new ReferenceError(msg);
      }

      if (maxAliasCount >= 0) {
        anchor.count += 1;
        if (anchor.aliasCount === 0) anchor.aliasCount = getAliasCount(this.source, anchors);

        if (anchor.count * anchor.aliasCount > maxAliasCount) {
          const msg = 'Excessive alias count indicates a resource exhaustion attack';
          if (this.cstNode) throw new PlainValueEc8e588e.YAMLReferenceError(this.cstNode, msg);else throw new ReferenceError(msg);
        }
      }

      return anchor.res;
    } // Only called when stringifying an alias mapping key while constructing
    // Object output.


    toString(ctx) {
      return Alias$1.stringify(this, ctx);
    }

  }

  PlainValueEc8e588e._defineProperty(Alias$1, "default", true);

  function findPair(items, key) {
    const k = key instanceof Scalar ? key.value : key;

    for (const it of items) {
      if (it instanceof Pair) {
        if (it.key === key || it.key === k) return it;
        if (it.key && it.key.value === k) return it;
      }
    }

    return undefined;
  }
  class YAMLMap extends Collection$1 {
    add(pair, overwrite) {
      if (!pair) pair = new Pair(pair);else if (!(pair instanceof Pair)) pair = new Pair(pair.key || pair, pair.value);
      const prev = findPair(this.items, pair.key);
      const sortEntries = this.schema && this.schema.sortMapEntries;

      if (prev) {
        if (overwrite) prev.value = pair.value;else throw new Error(`Key ${pair.key} already set`);
      } else if (sortEntries) {
        const i = this.items.findIndex(item => sortEntries(pair, item) < 0);
        if (i === -1) this.items.push(pair);else this.items.splice(i, 0, pair);
      } else {
        this.items.push(pair);
      }
    }

    delete(key) {
      const it = findPair(this.items, key);
      if (!it) return false;
      const del = this.items.splice(this.items.indexOf(it), 1);
      return del.length > 0;
    }

    get(key, keepScalar) {
      const it = findPair(this.items, key);
      const node = it && it.value;
      return !keepScalar && node instanceof Scalar ? node.value : node;
    }

    has(key) {
      return !!findPair(this.items, key);
    }

    set(key, value) {
      this.add(new Pair(key, value), true);
    }
    /**
     * @param {*} arg ignored
     * @param {*} ctx Conversion context, originally set in Document#toJSON()
     * @param {Class} Type If set, forces the returned collection type
     * @returns {*} Instance of Type, Map, or Object
     */


    toJSON(_, ctx, Type) {
      const map = Type ? new Type() : ctx && ctx.mapAsMap ? new Map() : {};
      if (ctx && ctx.onCreate) ctx.onCreate(map);

      for (const item of this.items) item.addToJSMap(ctx, map);

      return map;
    }

    toString(ctx, onComment, onChompKeep) {
      if (!ctx) return JSON.stringify(this);

      for (const item of this.items) {
        if (!(item instanceof Pair)) throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
      }

      return super.toString(ctx, {
        blockItem: n => n.str,
        flowChars: {
          start: '{',
          end: '}'
        },
        isMap: true,
        itemIndent: ctx.indent || ''
      }, onComment, onChompKeep);
    }

  }

  const MERGE_KEY = '<<';
  class Merge extends Pair {
    constructor(pair) {
      if (pair instanceof Pair) {
        let seq = pair.value;

        if (!(seq instanceof YAMLSeq)) {
          seq = new YAMLSeq();
          seq.items.push(pair.value);
          seq.range = pair.value.range;
        }

        super(pair.key, seq);
        this.range = pair.range;
      } else {
        super(new Scalar(MERGE_KEY), new YAMLSeq());
      }

      this.type = Pair.Type.MERGE_PAIR;
    } // If the value associated with a merge key is a single mapping node, each of
    // its key/value pairs is inserted into the current mapping, unless the key
    // already exists in it. If the value associated with the merge key is a
    // sequence, then this sequence is expected to contain mapping nodes and each
    // of these nodes is merged in turn according to its order in the sequence.
    // Keys in mapping nodes earlier in the sequence override keys specified in
    // later mapping nodes. -- http://yaml.org/type/merge.html


    addToJSMap(ctx, map) {
      for (const {
        source
      } of this.value.items) {
        if (!(source instanceof YAMLMap)) throw new Error('Merge sources must be maps');
        const srcMap = source.toJSON(null, ctx, Map);

        for (const [key, value] of srcMap) {
          if (map instanceof Map) {
            if (!map.has(key)) map.set(key, value);
          } else if (map instanceof Set) {
            map.add(key);
          } else if (!Object.prototype.hasOwnProperty.call(map, key)) {
            Object.defineProperty(map, key, {
              value,
              writable: true,
              enumerable: true,
              configurable: true
            });
          }
        }
      }

      return map;
    }

    toString(ctx, onComment) {
      const seq = this.value;
      if (seq.items.length > 1) return super.toString(ctx, onComment);
      this.value = seq.items[0];
      const str = super.toString(ctx, onComment);
      this.value = seq;
      return str;
    }

  }

  const binaryOptions = {
    defaultType: PlainValueEc8e588e.Type.BLOCK_LITERAL,
    lineWidth: 76
  };
  const boolOptions = {
    trueStr: 'true',
    falseStr: 'false'
  };
  const intOptions = {
    asBigInt: false
  };
  const nullOptions = {
    nullStr: 'null'
  };
  const strOptions = {
    defaultType: PlainValueEc8e588e.Type.PLAIN,
    doubleQuoted: {
      jsonEncoding: false,
      minMultiLineLength: 40
    },
    fold: {
      lineWidth: 80,
      minContentWidth: 20
    }
  };

  function resolveScalar(str, tags, scalarFallback) {
    for (const {
      format,
      test,
      resolve
    } of tags) {
      if (test) {
        const match = str.match(test);

        if (match) {
          let res = resolve.apply(null, match);
          if (!(res instanceof Scalar)) res = new Scalar(res);
          if (format) res.format = format;
          return res;
        }
      }
    }

    if (scalarFallback) str = scalarFallback(str);
    return new Scalar(str);
  }

  const FOLD_FLOW = 'flow';
  const FOLD_BLOCK = 'block';
  const FOLD_QUOTED = 'quoted'; // presumes i+1 is at the start of a line
  // returns index of last newline in more-indented block

  const consumeMoreIndentedLines = (text, i) => {
    let ch = text[i + 1];

    while (ch === ' ' || ch === '\t') {
      do {
        ch = text[i += 1];
      } while (ch && ch !== '\n');

      ch = text[i + 1];
    }

    return i;
  };
  /**
   * Tries to keep input at up to `lineWidth` characters, splitting only on spaces
   * not followed by newlines or spaces unless `mode` is `'quoted'`. Lines are
   * terminated with `\n` and started with `indent`.
   *
   * @param {string} text
   * @param {string} indent
   * @param {string} [mode='flow'] `'block'` prevents more-indented lines
   *   from being folded; `'quoted'` allows for `\` escapes, including escaped
   *   newlines
   * @param {Object} options
   * @param {number} [options.indentAtStart] Accounts for leading contents on
   *   the first line, defaulting to `indent.length`
   * @param {number} [options.lineWidth=80]
   * @param {number} [options.minContentWidth=20] Allow highly indented lines to
   *   stretch the line width or indent content from the start
   * @param {function} options.onFold Called once if the text is folded
   * @param {function} options.onFold Called once if any line of text exceeds
   *   lineWidth characters
   */


  function foldFlowLines(text, indent, mode, {
    indentAtStart,
    lineWidth = 80,
    minContentWidth = 20,
    onFold,
    onOverflow
  }) {
    if (!lineWidth || lineWidth < 0) return text;
    const endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
    if (text.length <= endStep) return text;
    const folds = [];
    const escapedFolds = {};
    let end = lineWidth - indent.length;

    if (typeof indentAtStart === 'number') {
      if (indentAtStart > lineWidth - Math.max(2, minContentWidth)) folds.push(0);else end = lineWidth - indentAtStart;
    }

    let split = undefined;
    let prev = undefined;
    let overflow = false;
    let i = -1;
    let escStart = -1;
    let escEnd = -1;

    if (mode === FOLD_BLOCK) {
      i = consumeMoreIndentedLines(text, i);
      if (i !== -1) end = i + endStep;
    }

    for (let ch; ch = text[i += 1];) {
      if (mode === FOLD_QUOTED && ch === '\\') {
        escStart = i;

        switch (text[i + 1]) {
          case 'x':
            i += 3;
            break;

          case 'u':
            i += 5;
            break;

          case 'U':
            i += 9;
            break;

          default:
            i += 1;
        }

        escEnd = i;
      }

      if (ch === '\n') {
        if (mode === FOLD_BLOCK) i = consumeMoreIndentedLines(text, i);
        end = i + endStep;
        split = undefined;
      } else {
        if (ch === ' ' && prev && prev !== ' ' && prev !== '\n' && prev !== '\t') {
          // space surrounded by non-space can be replaced with newline + indent
          const next = text[i + 1];
          if (next && next !== ' ' && next !== '\n' && next !== '\t') split = i;
        }

        if (i >= end) {
          if (split) {
            folds.push(split);
            end = split + endStep;
            split = undefined;
          } else if (mode === FOLD_QUOTED) {
            // white-space collected at end may stretch past lineWidth
            while (prev === ' ' || prev === '\t') {
              prev = ch;
              ch = text[i += 1];
              overflow = true;
            } // Account for newline escape, but don't break preceding escape


            const j = i > escEnd + 1 ? i - 2 : escStart - 1; // Bail out if lineWidth & minContentWidth are shorter than an escape string

            if (escapedFolds[j]) return text;
            folds.push(j);
            escapedFolds[j] = true;
            end = j + endStep;
            split = undefined;
          } else {
            overflow = true;
          }
        }
      }

      prev = ch;
    }

    if (overflow && onOverflow) onOverflow();
    if (folds.length === 0) return text;
    if (onFold) onFold();
    let res = text.slice(0, folds[0]);

    for (let i = 0; i < folds.length; ++i) {
      const fold = folds[i];
      const end = folds[i + 1] || text.length;
      if (fold === 0) res = `\n${indent}${text.slice(0, end)}`;else {
        if (mode === FOLD_QUOTED && escapedFolds[fold]) res += `${text[fold]}\\`;
        res += `\n${indent}${text.slice(fold + 1, end)}`;
      }
    }

    return res;
  }

  const getFoldOptions = ({
    indentAtStart
  }) => indentAtStart ? Object.assign({
    indentAtStart
  }, strOptions.fold) : strOptions.fold; // Also checks for lines starting with %, as parsing the output as YAML 1.1 will
  // presume that's starting a new document.


  const containsDocumentMarker = str => /^(%|---|\.\.\.)/m.test(str);

  function lineLengthOverLimit(str, lineWidth, indentLength) {
    if (!lineWidth || lineWidth < 0) return false;
    const limit = lineWidth - indentLength;
    const strLen = str.length;
    if (strLen <= limit) return false;

    for (let i = 0, start = 0; i < strLen; ++i) {
      if (str[i] === '\n') {
        if (i - start > limit) return true;
        start = i + 1;
        if (strLen - start <= limit) return false;
      }
    }

    return true;
  }

  function doubleQuotedString(value, ctx) {
    const {
      implicitKey
    } = ctx;
    const {
      jsonEncoding,
      minMultiLineLength
    } = strOptions.doubleQuoted;
    const json = JSON.stringify(value);
    if (jsonEncoding) return json;
    const indent = ctx.indent || (containsDocumentMarker(value) ? '  ' : '');
    let str = '';
    let start = 0;

    for (let i = 0, ch = json[i]; ch; ch = json[++i]) {
      if (ch === ' ' && json[i + 1] === '\\' && json[i + 2] === 'n') {
        // space before newline needs to be escaped to not be folded
        str += json.slice(start, i) + '\\ ';
        i += 1;
        start = i;
        ch = '\\';
      }

      if (ch === '\\') switch (json[i + 1]) {
        case 'u':
          {
            str += json.slice(start, i);
            const code = json.substr(i + 2, 4);

            switch (code) {
              case '0000':
                str += '\\0';
                break;

              case '0007':
                str += '\\a';
                break;

              case '000b':
                str += '\\v';
                break;

              case '001b':
                str += '\\e';
                break;

              case '0085':
                str += '\\N';
                break;

              case '00a0':
                str += '\\_';
                break;

              case '2028':
                str += '\\L';
                break;

              case '2029':
                str += '\\P';
                break;

              default:
                if (code.substr(0, 2) === '00') str += '\\x' + code.substr(2);else str += json.substr(i, 6);
            }

            i += 5;
            start = i + 1;
          }
          break;

        case 'n':
          if (implicitKey || json[i + 2] === '"' || json.length < minMultiLineLength) {
            i += 1;
          } else {
            // folding will eat first newline
            str += json.slice(start, i) + '\n\n';

            while (json[i + 2] === '\\' && json[i + 3] === 'n' && json[i + 4] !== '"') {
              str += '\n';
              i += 2;
            }

            str += indent; // space after newline needs to be escaped to not be folded

            if (json[i + 2] === ' ') str += '\\';
            i += 1;
            start = i + 1;
          }

          break;

        default:
          i += 1;
      }
    }

    str = start ? str + json.slice(start) : json;
    return implicitKey ? str : foldFlowLines(str, indent, FOLD_QUOTED, getFoldOptions(ctx));
  }

  function singleQuotedString(value, ctx) {
    if (ctx.implicitKey) {
      if (/\n/.test(value)) return doubleQuotedString(value, ctx);
    } else {
      // single quoted string can't have leading or trailing whitespace around newline
      if (/[ \t]\n|\n[ \t]/.test(value)) return doubleQuotedString(value, ctx);
    }

    const indent = ctx.indent || (containsDocumentMarker(value) ? '  ' : '');
    const res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&\n${indent}`) + "'";
    return ctx.implicitKey ? res : foldFlowLines(res, indent, FOLD_FLOW, getFoldOptions(ctx));
  }

  function blockString({
    comment,
    type,
    value
  }, ctx, onComment, onChompKeep) {
    // 1. Block can't end in whitespace unless the last line is non-empty.
    // 2. Strings consisting of only whitespace are best rendered explicitly.
    if (/\n[\t ]+$/.test(value) || /^\s*$/.test(value)) {
      return doubleQuotedString(value, ctx);
    }

    const indent = ctx.indent || (ctx.forceBlockIndent || containsDocumentMarker(value) ? '  ' : '');
    const indentSize = indent ? '2' : '1'; // root is at -1

    const literal = type === PlainValueEc8e588e.Type.BLOCK_FOLDED ? false : type === PlainValueEc8e588e.Type.BLOCK_LITERAL ? true : !lineLengthOverLimit(value, strOptions.fold.lineWidth, indent.length);
    let header = literal ? '|' : '>';
    if (!value) return header + '\n';
    let wsStart = '';
    let wsEnd = '';
    value = value.replace(/[\n\t ]*$/, ws => {
      const n = ws.indexOf('\n');

      if (n === -1) {
        header += '-'; // strip
      } else if (value === ws || n !== ws.length - 1) {
        header += '+'; // keep

        if (onChompKeep) onChompKeep();
      }

      wsEnd = ws.replace(/\n$/, '');
      return '';
    }).replace(/^[\n ]*/, ws => {
      if (ws.indexOf(' ') !== -1) header += indentSize;
      const m = ws.match(/ +$/);

      if (m) {
        wsStart = ws.slice(0, -m[0].length);
        return m[0];
      } else {
        wsStart = ws;
        return '';
      }
    });
    if (wsEnd) wsEnd = wsEnd.replace(/\n+(?!\n|$)/g, `$&${indent}`);
    if (wsStart) wsStart = wsStart.replace(/\n+/g, `$&${indent}`);

    if (comment) {
      header += ' #' + comment.replace(/ ?[\r\n]+/g, ' ');
      if (onComment) onComment();
    }

    if (!value) return `${header}${indentSize}\n${indent}${wsEnd}`;

    if (literal) {
      value = value.replace(/\n+/g, `$&${indent}`);
      return `${header}\n${indent}${wsStart}${value}${wsEnd}`;
    }

    value = value.replace(/\n+/g, '\n$&').replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, '$1$2') // more-indented lines aren't folded
    //         ^ ind.line  ^ empty     ^ capture next empty lines only at end of indent
    .replace(/\n+/g, `$&${indent}`);
    const body = foldFlowLines(`${wsStart}${value}${wsEnd}`, indent, FOLD_BLOCK, strOptions.fold);
    return `${header}\n${indent}${body}`;
  }

  function plainString(item, ctx, onComment, onChompKeep) {
    const {
      comment,
      type,
      value
    } = item;
    const {
      actualString,
      implicitKey,
      indent,
      inFlow
    } = ctx;

    if (implicitKey && /[\n[\]{},]/.test(value) || inFlow && /[[\]{},]/.test(value)) {
      return doubleQuotedString(value, ctx);
    }

    if (!value || /^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value)) {
      // not allowed:
      // - empty string, '-' or '?'
      // - start with an indicator character (except [?:-]) or /[?-] /
      // - '\n ', ': ' or ' \n' anywhere
      // - '#' not preceded by a non-space char
      // - end with ' ' or ':'
      return implicitKey || inFlow || value.indexOf('\n') === -1 ? value.indexOf('"') !== -1 && value.indexOf("'") === -1 ? singleQuotedString(value, ctx) : doubleQuotedString(value, ctx) : blockString(item, ctx, onComment, onChompKeep);
    }

    if (!implicitKey && !inFlow && type !== PlainValueEc8e588e.Type.PLAIN && value.indexOf('\n') !== -1) {
      // Where allowed & type not set explicitly, prefer block style for multiline strings
      return blockString(item, ctx, onComment, onChompKeep);
    }

    if (indent === '' && containsDocumentMarker(value)) {
      ctx.forceBlockIndent = true;
      return blockString(item, ctx, onComment, onChompKeep);
    }

    const str = value.replace(/\n+/g, `$&\n${indent}`); // Verify that output will be parsed as a string, as e.g. plain numbers and
    // booleans get parsed with those types in v1.2 (e.g. '42', 'true' & '0.9e-3'),
    // and others in v1.1.

    if (actualString) {
      const {
        tags
      } = ctx.doc.schema;
      const resolved = resolveScalar(str, tags, tags.scalarFallback).value;
      if (typeof resolved !== 'string') return doubleQuotedString(value, ctx);
    }

    const body = implicitKey ? str : foldFlowLines(str, indent, FOLD_FLOW, getFoldOptions(ctx));

    if (comment && !inFlow && (body.indexOf('\n') !== -1 || comment.indexOf('\n') !== -1)) {
      if (onComment) onComment();
      return addCommentBefore(body, indent, comment);
    }

    return body;
  }

  function stringifyString(item, ctx, onComment, onChompKeep) {
    const {
      defaultType
    } = strOptions;
    const {
      implicitKey,
      inFlow
    } = ctx;
    let {
      type,
      value
    } = item;

    if (typeof value !== 'string') {
      value = String(value);
      item = Object.assign({}, item, {
        value
      });
    }

    const _stringify = _type => {
      switch (_type) {
        case PlainValueEc8e588e.Type.BLOCK_FOLDED:
        case PlainValueEc8e588e.Type.BLOCK_LITERAL:
          return blockString(item, ctx, onComment, onChompKeep);

        case PlainValueEc8e588e.Type.QUOTE_DOUBLE:
          return doubleQuotedString(value, ctx);

        case PlainValueEc8e588e.Type.QUOTE_SINGLE:
          return singleQuotedString(value, ctx);

        case PlainValueEc8e588e.Type.PLAIN:
          return plainString(item, ctx, onComment, onChompKeep);

        default:
          return null;
      }
    };

    if (type !== PlainValueEc8e588e.Type.QUOTE_DOUBLE && /[\x00-\x08\x0b-\x1f\x7f-\x9f]/.test(value)) {
      // force double quotes on control characters
      type = PlainValueEc8e588e.Type.QUOTE_DOUBLE;
    } else if ((implicitKey || inFlow) && (type === PlainValueEc8e588e.Type.BLOCK_FOLDED || type === PlainValueEc8e588e.Type.BLOCK_LITERAL)) {
      // should not happen; blocks are not valid inside flow containers
      type = PlainValueEc8e588e.Type.QUOTE_DOUBLE;
    }

    let res = _stringify(type);

    if (res === null) {
      res = _stringify(defaultType);
      if (res === null) throw new Error(`Unsupported default string type ${defaultType}`);
    }

    return res;
  }

  function stringifyNumber({
    format,
    minFractionDigits,
    tag,
    value
  }) {
    if (typeof value === 'bigint') return String(value);
    if (!isFinite(value)) return isNaN(value) ? '.nan' : value < 0 ? '-.inf' : '.inf';
    let n = JSON.stringify(value);

    if (!format && minFractionDigits && (!tag || tag === 'tag:yaml.org,2002:float') && /^\d/.test(n)) {
      let i = n.indexOf('.');

      if (i < 0) {
        i = n.length;
        n += '.';
      }

      let d = minFractionDigits - (n.length - i - 1);

      while (d-- > 0) n += '0';
    }

    return n;
  }

  function checkFlowCollectionEnd(errors, cst) {
    let char, name;

    switch (cst.type) {
      case PlainValueEc8e588e.Type.FLOW_MAP:
        char = '}';
        name = 'flow map';
        break;

      case PlainValueEc8e588e.Type.FLOW_SEQ:
        char = ']';
        name = 'flow sequence';
        break;

      default:
        errors.push(new PlainValueEc8e588e.YAMLSemanticError(cst, 'Not a flow collection!?'));
        return;
    }

    let lastItem;

    for (let i = cst.items.length - 1; i >= 0; --i) {
      const item = cst.items[i];

      if (!item || item.type !== PlainValueEc8e588e.Type.COMMENT) {
        lastItem = item;
        break;
      }
    }

    if (lastItem && lastItem.char !== char) {
      const msg = `Expected ${name} to end with ${char}`;
      let err;

      if (typeof lastItem.offset === 'number') {
        err = new PlainValueEc8e588e.YAMLSemanticError(cst, msg);
        err.offset = lastItem.offset + 1;
      } else {
        err = new PlainValueEc8e588e.YAMLSemanticError(lastItem, msg);
        if (lastItem.range && lastItem.range.end) err.offset = lastItem.range.end - lastItem.range.start;
      }

      errors.push(err);
    }
  }
  function checkFlowCommentSpace(errors, comment) {
    const prev = comment.context.src[comment.range.start - 1];

    if (prev !== '\n' && prev !== '\t' && prev !== ' ') {
      const msg = 'Comments must be separated from other tokens by white space characters';
      errors.push(new PlainValueEc8e588e.YAMLSemanticError(comment, msg));
    }
  }
  function getLongKeyError(source, key) {
    const sk = String(key);
    const k = sk.substr(0, 8) + '...' + sk.substr(-8);
    return new PlainValueEc8e588e.YAMLSemanticError(source, `The "${k}" key is too long`);
  }
  function resolveComments(collection, comments) {
    for (const {
      afterKey,
      before,
      comment
    } of comments) {
      let item = collection.items[before];

      if (!item) {
        if (comment !== undefined) {
          if (collection.comment) collection.comment += '\n' + comment;else collection.comment = comment;
        }
      } else {
        if (afterKey && item.value) item = item.value;

        if (comment === undefined) {
          if (afterKey || !item.commentBefore) item.spaceBefore = true;
        } else {
          if (item.commentBefore) item.commentBefore += '\n' + comment;else item.commentBefore = comment;
        }
      }
    }
  }

  // on error, will return { str: string, errors: Error[] }
  function resolveString(doc, node) {
    const res = node.strValue;
    if (!res) return '';
    if (typeof res === 'string') return res;
    res.errors.forEach(error => {
      if (!error.source) error.source = node;
      doc.errors.push(error);
    });
    return res.str;
  }

  function resolveTagHandle(doc, node) {
    const {
      handle,
      suffix
    } = node.tag;
    let prefix = doc.tagPrefixes.find(p => p.handle === handle);

    if (!prefix) {
      const dtp = doc.getDefaults().tagPrefixes;
      if (dtp) prefix = dtp.find(p => p.handle === handle);
      if (!prefix) throw new PlainValueEc8e588e.YAMLSemanticError(node, `The ${handle} tag handle is non-default and was not declared.`);
    }

    if (!suffix) throw new PlainValueEc8e588e.YAMLSemanticError(node, `The ${handle} tag has no suffix.`);

    if (handle === '!' && (doc.version || doc.options.version) === '1.0') {
      if (suffix[0] === '^') {
        doc.warnings.push(new PlainValueEc8e588e.YAMLWarning(node, 'YAML 1.0 ^ tag expansion is not supported'));
        return suffix;
      }

      if (/[:/]/.test(suffix)) {
        // word/foo -> tag:word.yaml.org,2002:foo
        const vocab = suffix.match(/^([a-z0-9-]+)\/(.*)/i);
        return vocab ? `tag:${vocab[1]}.yaml.org,2002:${vocab[2]}` : `tag:${suffix}`;
      }
    }

    return prefix.prefix + decodeURIComponent(suffix);
  }

  function resolveTagName(doc, node) {
    const {
      tag,
      type
    } = node;
    let nonSpecific = false;

    if (tag) {
      const {
        handle,
        suffix,
        verbatim
      } = tag;

      if (verbatim) {
        if (verbatim !== '!' && verbatim !== '!!') return verbatim;
        const msg = `Verbatim tags aren't resolved, so ${verbatim} is invalid.`;
        doc.errors.push(new PlainValueEc8e588e.YAMLSemanticError(node, msg));
      } else if (handle === '!' && !suffix) {
        nonSpecific = true;
      } else {
        try {
          return resolveTagHandle(doc, node);
        } catch (error) {
          doc.errors.push(error);
        }
      }
    }

    switch (type) {
      case PlainValueEc8e588e.Type.BLOCK_FOLDED:
      case PlainValueEc8e588e.Type.BLOCK_LITERAL:
      case PlainValueEc8e588e.Type.QUOTE_DOUBLE:
      case PlainValueEc8e588e.Type.QUOTE_SINGLE:
        return PlainValueEc8e588e.defaultTags.STR;

      case PlainValueEc8e588e.Type.FLOW_MAP:
      case PlainValueEc8e588e.Type.MAP:
        return PlainValueEc8e588e.defaultTags.MAP;

      case PlainValueEc8e588e.Type.FLOW_SEQ:
      case PlainValueEc8e588e.Type.SEQ:
        return PlainValueEc8e588e.defaultTags.SEQ;

      case PlainValueEc8e588e.Type.PLAIN:
        return nonSpecific ? PlainValueEc8e588e.defaultTags.STR : null;

      default:
        return null;
    }
  }

  function resolveByTagName(doc, node, tagName) {
    const {
      tags
    } = doc.schema;
    const matchWithTest = [];

    for (const tag of tags) {
      if (tag.tag === tagName) {
        if (tag.test) matchWithTest.push(tag);else {
          const res = tag.resolve(doc, node);
          return res instanceof Collection$1 ? res : new Scalar(res);
        }
      }
    }

    const str = resolveString(doc, node);
    if (typeof str === 'string' && matchWithTest.length > 0) return resolveScalar(str, matchWithTest, tags.scalarFallback);
    return null;
  }

  function getFallbackTagName({
    type
  }) {
    switch (type) {
      case PlainValueEc8e588e.Type.FLOW_MAP:
      case PlainValueEc8e588e.Type.MAP:
        return PlainValueEc8e588e.defaultTags.MAP;

      case PlainValueEc8e588e.Type.FLOW_SEQ:
      case PlainValueEc8e588e.Type.SEQ:
        return PlainValueEc8e588e.defaultTags.SEQ;

      default:
        return PlainValueEc8e588e.defaultTags.STR;
    }
  }

  function resolveTag(doc, node, tagName) {
    try {
      const res = resolveByTagName(doc, node, tagName);

      if (res) {
        if (tagName && node.tag) res.tag = tagName;
        return res;
      }
    } catch (error) {
      /* istanbul ignore if */
      if (!error.source) error.source = node;
      doc.errors.push(error);
      return null;
    }

    try {
      const fallback = getFallbackTagName(node);
      if (!fallback) throw new Error(`The tag ${tagName} is unavailable`);
      const msg = `The tag ${tagName} is unavailable, falling back to ${fallback}`;
      doc.warnings.push(new PlainValueEc8e588e.YAMLWarning(node, msg));
      const res = resolveByTagName(doc, node, fallback);
      res.tag = tagName;
      return res;
    } catch (error) {
      const refError = new PlainValueEc8e588e.YAMLReferenceError(node, error.message);
      refError.stack = error.stack;
      doc.errors.push(refError);
      return null;
    }
  }

  const isCollectionItem = node => {
    if (!node) return false;
    const {
      type
    } = node;
    return type === PlainValueEc8e588e.Type.MAP_KEY || type === PlainValueEc8e588e.Type.MAP_VALUE || type === PlainValueEc8e588e.Type.SEQ_ITEM;
  };

  function resolveNodeProps(errors, node) {
    const comments = {
      before: [],
      after: []
    };
    let hasAnchor = false;
    let hasTag = false;
    const props = isCollectionItem(node.context.parent) ? node.context.parent.props.concat(node.props) : node.props;

    for (const {
      start,
      end
    } of props) {
      switch (node.context.src[start]) {
        case PlainValueEc8e588e.Char.COMMENT:
          {
            if (!node.commentHasRequiredWhitespace(start)) {
              const msg = 'Comments must be separated from other tokens by white space characters';
              errors.push(new PlainValueEc8e588e.YAMLSemanticError(node, msg));
            }

            const {
              header,
              valueRange
            } = node;
            const cc = valueRange && (start > valueRange.start || header && start > header.start) ? comments.after : comments.before;
            cc.push(node.context.src.slice(start + 1, end));
            break;
          }
        // Actual anchor & tag resolution is handled by schema, here we just complain

        case PlainValueEc8e588e.Char.ANCHOR:
          if (hasAnchor) {
            const msg = 'A node can have at most one anchor';
            errors.push(new PlainValueEc8e588e.YAMLSemanticError(node, msg));
          }

          hasAnchor = true;
          break;

        case PlainValueEc8e588e.Char.TAG:
          if (hasTag) {
            const msg = 'A node can have at most one tag';
            errors.push(new PlainValueEc8e588e.YAMLSemanticError(node, msg));
          }

          hasTag = true;
          break;
      }
    }

    return {
      comments,
      hasAnchor,
      hasTag
    };
  }

  function resolveNodeValue(doc, node) {
    const {
      anchors,
      errors,
      schema
    } = doc;

    if (node.type === PlainValueEc8e588e.Type.ALIAS) {
      const name = node.rawValue;
      const src = anchors.getNode(name);

      if (!src) {
        const msg = `Aliased anchor not found: ${name}`;
        errors.push(new PlainValueEc8e588e.YAMLReferenceError(node, msg));
        return null;
      } // Lazy resolution for circular references


      const res = new Alias$1(src);

      anchors._cstAliases.push(res);

      return res;
    }

    const tagName = resolveTagName(doc, node);
    if (tagName) return resolveTag(doc, node, tagName);

    if (node.type !== PlainValueEc8e588e.Type.PLAIN) {
      const msg = `Failed to resolve ${node.type} node here`;
      errors.push(new PlainValueEc8e588e.YAMLSyntaxError(node, msg));
      return null;
    }

    try {
      const str = resolveString(doc, node);
      return resolveScalar(str, schema.tags, schema.tags.scalarFallback);
    } catch (error) {
      if (!error.source) error.source = node;
      errors.push(error);
      return null;
    }
  } // sets node.resolved on success


  function resolveNode(doc, node) {
    if (!node) return null;
    if (node.error) doc.errors.push(node.error);
    const {
      comments,
      hasAnchor,
      hasTag
    } = resolveNodeProps(doc.errors, node);

    if (hasAnchor) {
      const {
        anchors
      } = doc;
      const name = node.anchor;
      const prev = anchors.getNode(name); // At this point, aliases for any preceding node with the same anchor
      // name have already been resolved, so it may safely be renamed.

      if (prev) anchors.map[anchors.newName(name)] = prev; // During parsing, we need to store the CST node in anchors.map as
      // anchors need to be available during resolution to allow for
      // circular references.

      anchors.map[name] = node;
    }

    if (node.type === PlainValueEc8e588e.Type.ALIAS && (hasAnchor || hasTag)) {
      const msg = 'An alias node must not specify any properties';
      doc.errors.push(new PlainValueEc8e588e.YAMLSemanticError(node, msg));
    }

    const res = resolveNodeValue(doc, node);

    if (res) {
      res.range = [node.range.start, node.range.end];
      if (doc.options.keepCstNodes) res.cstNode = node;
      if (doc.options.keepNodeTypes) res.type = node.type;
      const cb = comments.before.join('\n');

      if (cb) {
        res.commentBefore = res.commentBefore ? `${res.commentBefore}\n${cb}` : cb;
      }

      const ca = comments.after.join('\n');
      if (ca) res.comment = res.comment ? `${res.comment}\n${ca}` : ca;
    }

    return node.resolved = res;
  }

  function resolveMap(doc, cst) {
    if (cst.type !== PlainValueEc8e588e.Type.MAP && cst.type !== PlainValueEc8e588e.Type.FLOW_MAP) {
      const msg = `A ${cst.type} node cannot be resolved as a mapping`;
      doc.errors.push(new PlainValueEc8e588e.YAMLSyntaxError(cst, msg));
      return null;
    }

    const {
      comments,
      items
    } = cst.type === PlainValueEc8e588e.Type.FLOW_MAP ? resolveFlowMapItems(doc, cst) : resolveBlockMapItems(doc, cst);
    const map = new YAMLMap();
    map.items = items;
    resolveComments(map, comments);
    let hasCollectionKey = false;

    for (let i = 0; i < items.length; ++i) {
      const {
        key: iKey
      } = items[i];
      if (iKey instanceof Collection$1) hasCollectionKey = true;

      if (doc.schema.merge && iKey && iKey.value === MERGE_KEY) {
        items[i] = new Merge(items[i]);
        const sources = items[i].value.items;
        let error = null;
        sources.some(node => {
          if (node instanceof Alias$1) {
            // During parsing, alias sources are CST nodes; to account for
            // circular references their resolved values can't be used here.
            const {
              type
            } = node.source;
            if (type === PlainValueEc8e588e.Type.MAP || type === PlainValueEc8e588e.Type.FLOW_MAP) return false;
            return error = 'Merge nodes aliases can only point to maps';
          }

          return error = 'Merge nodes can only have Alias nodes as values';
        });
        if (error) doc.errors.push(new PlainValueEc8e588e.YAMLSemanticError(cst, error));
      } else {
        for (let j = i + 1; j < items.length; ++j) {
          const {
            key: jKey
          } = items[j];

          if (iKey === jKey || iKey && jKey && Object.prototype.hasOwnProperty.call(iKey, 'value') && iKey.value === jKey.value) {
            const msg = `Map keys must be unique; "${iKey}" is repeated`;
            doc.errors.push(new PlainValueEc8e588e.YAMLSemanticError(cst, msg));
            break;
          }
        }
      }
    }

    if (hasCollectionKey && !doc.options.mapAsMap) {
      const warn = 'Keys with collection values will be stringified as YAML due to JS Object restrictions. Use mapAsMap: true to avoid this.';
      doc.warnings.push(new PlainValueEc8e588e.YAMLWarning(cst, warn));
    }

    cst.resolved = map;
    return map;
  }

  const valueHasPairComment = ({
    context: {
      lineStart,
      node,
      src
    },
    props
  }) => {
    if (props.length === 0) return false;
    const {
      start
    } = props[0];
    if (node && start > node.valueRange.start) return false;
    if (src[start] !== PlainValueEc8e588e.Char.COMMENT) return false;

    for (let i = lineStart; i < start; ++i) if (src[i] === '\n') return false;

    return true;
  };

  function resolvePairComment(item, pair) {
    if (!valueHasPairComment(item)) return;
    const comment = item.getPropValue(0, PlainValueEc8e588e.Char.COMMENT, true);
    let found = false;
    const cb = pair.value.commentBefore;

    if (cb && cb.startsWith(comment)) {
      pair.value.commentBefore = cb.substr(comment.length + 1);
      found = true;
    } else {
      const cc = pair.value.comment;

      if (!item.node && cc && cc.startsWith(comment)) {
        pair.value.comment = cc.substr(comment.length + 1);
        found = true;
      }
    }

    if (found) pair.comment = comment;
  }

  function resolveBlockMapItems(doc, cst) {
    const comments = [];
    const items = [];
    let key = undefined;
    let keyStart = null;

    for (let i = 0; i < cst.items.length; ++i) {
      const item = cst.items[i];

      switch (item.type) {
        case PlainValueEc8e588e.Type.BLANK_LINE:
          comments.push({
            afterKey: !!key,
            before: items.length
          });
          break;

        case PlainValueEc8e588e.Type.COMMENT:
          comments.push({
            afterKey: !!key,
            before: items.length,
            comment: item.comment
          });
          break;

        case PlainValueEc8e588e.Type.MAP_KEY:
          if (key !== undefined) items.push(new Pair(key));
          if (item.error) doc.errors.push(item.error);
          key = resolveNode(doc, item.node);
          keyStart = null;
          break;

        case PlainValueEc8e588e.Type.MAP_VALUE:
          {
            if (key === undefined) key = null;
            if (item.error) doc.errors.push(item.error);

            if (!item.context.atLineStart && item.node && item.node.type === PlainValueEc8e588e.Type.MAP && !item.node.context.atLineStart) {
              const msg = 'Nested mappings are not allowed in compact mappings';
              doc.errors.push(new PlainValueEc8e588e.YAMLSemanticError(item.node, msg));
            }

            let valueNode = item.node;

            if (!valueNode && item.props.length > 0) {
              // Comments on an empty mapping value need to be preserved, so we
              // need to construct a minimal empty node here to use instead of the
              // missing `item.node`. -- eemeli/yaml#19
              valueNode = new PlainValueEc8e588e.PlainValue(PlainValueEc8e588e.Type.PLAIN, []);
              valueNode.context = {
                parent: item,
                src: item.context.src
              };
              const pos = item.range.start + 1;
              valueNode.range = {
                start: pos,
                end: pos
              };
              valueNode.valueRange = {
                start: pos,
                end: pos
              };

              if (typeof item.range.origStart === 'number') {
                const origPos = item.range.origStart + 1;
                valueNode.range.origStart = valueNode.range.origEnd = origPos;
                valueNode.valueRange.origStart = valueNode.valueRange.origEnd = origPos;
              }
            }

            const pair = new Pair(key, resolveNode(doc, valueNode));
            resolvePairComment(item, pair);
            items.push(pair);

            if (key && typeof keyStart === 'number') {
              if (item.range.start > keyStart + 1024) doc.errors.push(getLongKeyError(cst, key));
            }

            key = undefined;
            keyStart = null;
          }
          break;

        default:
          if (key !== undefined) items.push(new Pair(key));
          key = resolveNode(doc, item);
          keyStart = item.range.start;
          if (item.error) doc.errors.push(item.error);

          next: for (let j = i + 1;; ++j) {
            const nextItem = cst.items[j];

            switch (nextItem && nextItem.type) {
              case PlainValueEc8e588e.Type.BLANK_LINE:
              case PlainValueEc8e588e.Type.COMMENT:
                continue next;

              case PlainValueEc8e588e.Type.MAP_VALUE:
                break next;

              default:
                {
                  const msg = 'Implicit map keys need to be followed by map values';
                  doc.errors.push(new PlainValueEc8e588e.YAMLSemanticError(item, msg));
                  break next;
                }
            }
          }

          if (item.valueRangeContainsNewline) {
            const msg = 'Implicit map keys need to be on a single line';
            doc.errors.push(new PlainValueEc8e588e.YAMLSemanticError(item, msg));
          }

      }
    }

    if (key !== undefined) items.push(new Pair(key));
    return {
      comments,
      items
    };
  }

  function resolveFlowMapItems(doc, cst) {
    const comments = [];
    const items = [];
    let key = undefined;
    let explicitKey = false;
    let next = '{';

    for (let i = 0; i < cst.items.length; ++i) {
      const item = cst.items[i];

      if (typeof item.char === 'string') {
        const {
          char,
          offset
        } = item;

        if (char === '?' && key === undefined && !explicitKey) {
          explicitKey = true;
          next = ':';
          continue;
        }

        if (char === ':') {
          if (key === undefined) key = null;

          if (next === ':') {
            next = ',';
            continue;
          }
        } else {
          if (explicitKey) {
            if (key === undefined && char !== ',') key = null;
            explicitKey = false;
          }

          if (key !== undefined) {
            items.push(new Pair(key));
            key = undefined;

            if (char === ',') {
              next = ':';
              continue;
            }
          }
        }

        if (char === '}') {
          if (i === cst.items.length - 1) continue;
        } else if (char === next) {
          next = ':';
          continue;
        }

        const msg = `Flow map contains an unexpected ${char}`;
        const err = new PlainValueEc8e588e.YAMLSyntaxError(cst, msg);
        err.offset = offset;
        doc.errors.push(err);
      } else if (item.type === PlainValueEc8e588e.Type.BLANK_LINE) {
        comments.push({
          afterKey: !!key,
          before: items.length
        });
      } else if (item.type === PlainValueEc8e588e.Type.COMMENT) {
        checkFlowCommentSpace(doc.errors, item);
        comments.push({
          afterKey: !!key,
          before: items.length,
          comment: item.comment
        });
      } else if (key === undefined) {
        if (next === ',') doc.errors.push(new PlainValueEc8e588e.YAMLSemanticError(item, 'Separator , missing in flow map'));
        key = resolveNode(doc, item);
      } else {
        if (next !== ',') doc.errors.push(new PlainValueEc8e588e.YAMLSemanticError(item, 'Indicator : missing in flow map entry'));
        items.push(new Pair(key, resolveNode(doc, item)));
        key = undefined;
        explicitKey = false;
      }
    }

    checkFlowCollectionEnd(doc.errors, cst);
    if (key !== undefined) items.push(new Pair(key));
    return {
      comments,
      items
    };
  }

  function resolveSeq(doc, cst) {
    if (cst.type !== PlainValueEc8e588e.Type.SEQ && cst.type !== PlainValueEc8e588e.Type.FLOW_SEQ) {
      const msg = `A ${cst.type} node cannot be resolved as a sequence`;
      doc.errors.push(new PlainValueEc8e588e.YAMLSyntaxError(cst, msg));
      return null;
    }

    const {
      comments,
      items
    } = cst.type === PlainValueEc8e588e.Type.FLOW_SEQ ? resolveFlowSeqItems(doc, cst) : resolveBlockSeqItems(doc, cst);
    const seq = new YAMLSeq();
    seq.items = items;
    resolveComments(seq, comments);

    if (!doc.options.mapAsMap && items.some(it => it instanceof Pair && it.key instanceof Collection$1)) {
      const warn = 'Keys with collection values will be stringified as YAML due to JS Object restrictions. Use mapAsMap: true to avoid this.';
      doc.warnings.push(new PlainValueEc8e588e.YAMLWarning(cst, warn));
    }

    cst.resolved = seq;
    return seq;
  }

  function resolveBlockSeqItems(doc, cst) {
    const comments = [];
    const items = [];

    for (let i = 0; i < cst.items.length; ++i) {
      const item = cst.items[i];

      switch (item.type) {
        case PlainValueEc8e588e.Type.BLANK_LINE:
          comments.push({
            before: items.length
          });
          break;

        case PlainValueEc8e588e.Type.COMMENT:
          comments.push({
            comment: item.comment,
            before: items.length
          });
          break;

        case PlainValueEc8e588e.Type.SEQ_ITEM:
          if (item.error) doc.errors.push(item.error);
          items.push(resolveNode(doc, item.node));

          if (item.hasProps) {
            const msg = 'Sequence items cannot have tags or anchors before the - indicator';
            doc.errors.push(new PlainValueEc8e588e.YAMLSemanticError(item, msg));
          }

          break;

        default:
          if (item.error) doc.errors.push(item.error);
          doc.errors.push(new PlainValueEc8e588e.YAMLSyntaxError(item, `Unexpected ${item.type} node in sequence`));
      }
    }

    return {
      comments,
      items
    };
  }

  function resolveFlowSeqItems(doc, cst) {
    const comments = [];
    const items = [];
    let explicitKey = false;
    let key = undefined;
    let keyStart = null;
    let next = '[';
    let prevItem = null;

    for (let i = 0; i < cst.items.length; ++i) {
      const item = cst.items[i];

      if (typeof item.char === 'string') {
        const {
          char,
          offset
        } = item;

        if (char !== ':' && (explicitKey || key !== undefined)) {
          if (explicitKey && key === undefined) key = next ? items.pop() : null;
          items.push(new Pair(key));
          explicitKey = false;
          key = undefined;
          keyStart = null;
        }

        if (char === next) {
          next = null;
        } else if (!next && char === '?') {
          explicitKey = true;
        } else if (next !== '[' && char === ':' && key === undefined) {
          if (next === ',') {
            key = items.pop();

            if (key instanceof Pair) {
              const msg = 'Chaining flow sequence pairs is invalid';
              const err = new PlainValueEc8e588e.YAMLSemanticError(cst, msg);
              err.offset = offset;
              doc.errors.push(err);
            }

            if (!explicitKey && typeof keyStart === 'number') {
              const keyEnd = item.range ? item.range.start : item.offset;
              if (keyEnd > keyStart + 1024) doc.errors.push(getLongKeyError(cst, key));
              const {
                src
              } = prevItem.context;

              for (let i = keyStart; i < keyEnd; ++i) if (src[i] === '\n') {
                const msg = 'Implicit keys of flow sequence pairs need to be on a single line';
                doc.errors.push(new PlainValueEc8e588e.YAMLSemanticError(prevItem, msg));
                break;
              }
            }
          } else {
            key = null;
          }

          keyStart = null;
          explicitKey = false;
          next = null;
        } else if (next === '[' || char !== ']' || i < cst.items.length - 1) {
          const msg = `Flow sequence contains an unexpected ${char}`;
          const err = new PlainValueEc8e588e.YAMLSyntaxError(cst, msg);
          err.offset = offset;
          doc.errors.push(err);
        }
      } else if (item.type === PlainValueEc8e588e.Type.BLANK_LINE) {
        comments.push({
          before: items.length
        });
      } else if (item.type === PlainValueEc8e588e.Type.COMMENT) {
        checkFlowCommentSpace(doc.errors, item);
        comments.push({
          comment: item.comment,
          before: items.length
        });
      } else {
        if (next) {
          const msg = `Expected a ${next} in flow sequence`;
          doc.errors.push(new PlainValueEc8e588e.YAMLSemanticError(item, msg));
        }

        const value = resolveNode(doc, item);

        if (key === undefined) {
          items.push(value);
          prevItem = item;
        } else {
          items.push(new Pair(key, value));
          key = undefined;
        }

        keyStart = item.range.start;
        next = ',';
      }
    }

    checkFlowCollectionEnd(doc.errors, cst);
    if (key !== undefined) items.push(new Pair(key));
    return {
      comments,
      items
    };
  }

  var Alias_1 = Alias$1;
  var Collection_1 = Collection$1;
  var Merge_1 = Merge;
  var Node_1$1 = Node$1;
  var Pair_1 = Pair;
  var Scalar_1 = Scalar;
  var YAMLMap_1 = YAMLMap;
  var YAMLSeq_1 = YAMLSeq;
  var addComment_1 = addComment;
  var binaryOptions_1 = binaryOptions;
  var boolOptions_1 = boolOptions;
  var findPair_1 = findPair;
  var intOptions_1 = intOptions;
  var isEmptyPath_1 = isEmptyPath;
  var nullOptions_1 = nullOptions;
  var resolveMap_1 = resolveMap;
  var resolveNode_1 = resolveNode;
  var resolveSeq_1 = resolveSeq;
  var resolveString_1 = resolveString;
  var strOptions_1 = strOptions;
  var stringifyNumber_1 = stringifyNumber;
  var stringifyString_1 = stringifyString;
  var toJSON_1 = toJSON;

  var resolveSeqD03cb037 = {
  	Alias: Alias_1,
  	Collection: Collection_1,
  	Merge: Merge_1,
  	Node: Node_1$1,
  	Pair: Pair_1,
  	Scalar: Scalar_1,
  	YAMLMap: YAMLMap_1,
  	YAMLSeq: YAMLSeq_1,
  	addComment: addComment_1,
  	binaryOptions: binaryOptions_1,
  	boolOptions: boolOptions_1,
  	findPair: findPair_1,
  	intOptions: intOptions_1,
  	isEmptyPath: isEmptyPath_1,
  	nullOptions: nullOptions_1,
  	resolveMap: resolveMap_1,
  	resolveNode: resolveNode_1,
  	resolveSeq: resolveSeq_1,
  	resolveString: resolveString_1,
  	strOptions: strOptions_1,
  	stringifyNumber: stringifyNumber_1,
  	stringifyString: stringifyString_1,
  	toJSON: toJSON_1
  };

  /* global atob, btoa, Buffer */
  const binary = {
    identify: value => value instanceof Uint8Array,
    // Buffer inherits from Uint8Array
    default: false,
    tag: 'tag:yaml.org,2002:binary',

    /**
     * Returns a Buffer in node and an Uint8Array in browsers
     *
     * To use the resulting buffer as an image, you'll want to do something like:
     *
     *   const blob = new Blob([buffer], { type: 'image/jpeg' })
     *   document.querySelector('#photo').src = URL.createObjectURL(blob)
     */
    resolve: (doc, node) => {
      const src = resolveSeqD03cb037.resolveString(doc, node);

      if (typeof Buffer === 'function') {
        return Buffer.from(src, 'base64');
      } else if (typeof atob === 'function') {
        // On IE 11, atob() can't handle newlines
        const str = atob(src.replace(/[\n\r]/g, ''));
        const buffer = new Uint8Array(str.length);

        for (let i = 0; i < str.length; ++i) buffer[i] = str.charCodeAt(i);

        return buffer;
      } else {
        const msg = 'This environment does not support reading binary tags; either Buffer or atob is required';
        doc.errors.push(new PlainValueEc8e588e.YAMLReferenceError(node, msg));
        return null;
      }
    },
    options: resolveSeqD03cb037.binaryOptions,
    stringify: ({
      comment,
      type,
      value
    }, ctx, onComment, onChompKeep) => {
      let src;

      if (typeof Buffer === 'function') {
        src = value instanceof Buffer ? value.toString('base64') : Buffer.from(value.buffer).toString('base64');
      } else if (typeof btoa === 'function') {
        let s = '';

        for (let i = 0; i < value.length; ++i) s += String.fromCharCode(value[i]);

        src = btoa(s);
      } else {
        throw new Error('This environment does not support writing binary tags; either Buffer or btoa is required');
      }

      if (!type) type = resolveSeqD03cb037.binaryOptions.defaultType;

      if (type === PlainValueEc8e588e.Type.QUOTE_DOUBLE) {
        value = src;
      } else {
        const {
          lineWidth
        } = resolveSeqD03cb037.binaryOptions;
        const n = Math.ceil(src.length / lineWidth);
        const lines = new Array(n);

        for (let i = 0, o = 0; i < n; ++i, o += lineWidth) {
          lines[i] = src.substr(o, lineWidth);
        }

        value = lines.join(type === PlainValueEc8e588e.Type.BLOCK_LITERAL ? '\n' : ' ');
      }

      return resolveSeqD03cb037.stringifyString({
        comment,
        type,
        value
      }, ctx, onComment, onChompKeep);
    }
  };

  function parsePairs(doc, cst) {
    const seq = resolveSeqD03cb037.resolveSeq(doc, cst);

    for (let i = 0; i < seq.items.length; ++i) {
      let item = seq.items[i];
      if (item instanceof resolveSeqD03cb037.Pair) continue;else if (item instanceof resolveSeqD03cb037.YAMLMap) {
        if (item.items.length > 1) {
          const msg = 'Each pair must have its own sequence indicator';
          throw new PlainValueEc8e588e.YAMLSemanticError(cst, msg);
        }

        const pair = item.items[0] || new resolveSeqD03cb037.Pair();
        if (item.commentBefore) pair.commentBefore = pair.commentBefore ? `${item.commentBefore}\n${pair.commentBefore}` : item.commentBefore;
        if (item.comment) pair.comment = pair.comment ? `${item.comment}\n${pair.comment}` : item.comment;
        item = pair;
      }
      seq.items[i] = item instanceof resolveSeqD03cb037.Pair ? item : new resolveSeqD03cb037.Pair(item);
    }

    return seq;
  }
  function createPairs(schema, iterable, ctx) {
    const pairs = new resolveSeqD03cb037.YAMLSeq(schema);
    pairs.tag = 'tag:yaml.org,2002:pairs';

    for (const it of iterable) {
      let key, value;

      if (Array.isArray(it)) {
        if (it.length === 2) {
          key = it[0];
          value = it[1];
        } else throw new TypeError(`Expected [key, value] tuple: ${it}`);
      } else if (it && it instanceof Object) {
        const keys = Object.keys(it);

        if (keys.length === 1) {
          key = keys[0];
          value = it[key];
        } else throw new TypeError(`Expected { key: value } tuple: ${it}`);
      } else {
        key = it;
      }

      const pair = schema.createPair(key, value, ctx);
      pairs.items.push(pair);
    }

    return pairs;
  }
  const pairs = {
    default: false,
    tag: 'tag:yaml.org,2002:pairs',
    resolve: parsePairs,
    createNode: createPairs
  };

  class YAMLOMap extends resolveSeqD03cb037.YAMLSeq {
    constructor() {
      super();

      PlainValueEc8e588e._defineProperty(this, "add", resolveSeqD03cb037.YAMLMap.prototype.add.bind(this));

      PlainValueEc8e588e._defineProperty(this, "delete", resolveSeqD03cb037.YAMLMap.prototype.delete.bind(this));

      PlainValueEc8e588e._defineProperty(this, "get", resolveSeqD03cb037.YAMLMap.prototype.get.bind(this));

      PlainValueEc8e588e._defineProperty(this, "has", resolveSeqD03cb037.YAMLMap.prototype.has.bind(this));

      PlainValueEc8e588e._defineProperty(this, "set", resolveSeqD03cb037.YAMLMap.prototype.set.bind(this));

      this.tag = YAMLOMap.tag;
    }

    toJSON(_, ctx) {
      const map = new Map();
      if (ctx && ctx.onCreate) ctx.onCreate(map);

      for (const pair of this.items) {
        let key, value;

        if (pair instanceof resolveSeqD03cb037.Pair) {
          key = resolveSeqD03cb037.toJSON(pair.key, '', ctx);
          value = resolveSeqD03cb037.toJSON(pair.value, key, ctx);
        } else {
          key = resolveSeqD03cb037.toJSON(pair, '', ctx);
        }

        if (map.has(key)) throw new Error('Ordered maps must not include duplicate keys');
        map.set(key, value);
      }

      return map;
    }

  }

  PlainValueEc8e588e._defineProperty(YAMLOMap, "tag", 'tag:yaml.org,2002:omap');

  function parseOMap(doc, cst) {
    const pairs = parsePairs(doc, cst);
    const seenKeys = [];

    for (const {
      key
    } of pairs.items) {
      if (key instanceof resolveSeqD03cb037.Scalar) {
        if (seenKeys.includes(key.value)) {
          const msg = 'Ordered maps must not include duplicate keys';
          throw new PlainValueEc8e588e.YAMLSemanticError(cst, msg);
        } else {
          seenKeys.push(key.value);
        }
      }
    }

    return Object.assign(new YAMLOMap(), pairs);
  }

  function createOMap(schema, iterable, ctx) {
    const pairs = createPairs(schema, iterable, ctx);
    const omap = new YAMLOMap();
    omap.items = pairs.items;
    return omap;
  }

  const omap = {
    identify: value => value instanceof Map,
    nodeClass: YAMLOMap,
    default: false,
    tag: 'tag:yaml.org,2002:omap',
    resolve: parseOMap,
    createNode: createOMap
  };

  class YAMLSet extends resolveSeqD03cb037.YAMLMap {
    constructor() {
      super();
      this.tag = YAMLSet.tag;
    }

    add(key) {
      const pair = key instanceof resolveSeqD03cb037.Pair ? key : new resolveSeqD03cb037.Pair(key);
      const prev = resolveSeqD03cb037.findPair(this.items, pair.key);
      if (!prev) this.items.push(pair);
    }

    get(key, keepPair) {
      const pair = resolveSeqD03cb037.findPair(this.items, key);
      return !keepPair && pair instanceof resolveSeqD03cb037.Pair ? pair.key instanceof resolveSeqD03cb037.Scalar ? pair.key.value : pair.key : pair;
    }

    set(key, value) {
      if (typeof value !== 'boolean') throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
      const prev = resolveSeqD03cb037.findPair(this.items, key);

      if (prev && !value) {
        this.items.splice(this.items.indexOf(prev), 1);
      } else if (!prev && value) {
        this.items.push(new resolveSeqD03cb037.Pair(key));
      }
    }

    toJSON(_, ctx) {
      return super.toJSON(_, ctx, Set);
    }

    toString(ctx, onComment, onChompKeep) {
      if (!ctx) return JSON.stringify(this);
      if (this.hasAllNullValues()) return super.toString(ctx, onComment, onChompKeep);else throw new Error('Set items must all have null values');
    }

  }

  PlainValueEc8e588e._defineProperty(YAMLSet, "tag", 'tag:yaml.org,2002:set');

  function parseSet(doc, cst) {
    const map = resolveSeqD03cb037.resolveMap(doc, cst);
    if (!map.hasAllNullValues()) throw new PlainValueEc8e588e.YAMLSemanticError(cst, 'Set items must all have null values');
    return Object.assign(new YAMLSet(), map);
  }

  function createSet(schema, iterable, ctx) {
    const set = new YAMLSet();

    for (const value of iterable) set.items.push(schema.createPair(value, null, ctx));

    return set;
  }

  const set = {
    identify: value => value instanceof Set,
    nodeClass: YAMLSet,
    default: false,
    tag: 'tag:yaml.org,2002:set',
    resolve: parseSet,
    createNode: createSet
  };

  const parseSexagesimal = (sign, parts) => {
    const n = parts.split(':').reduce((n, p) => n * 60 + Number(p), 0);
    return sign === '-' ? -n : n;
  }; // hhhh:mm:ss.sss


  const stringifySexagesimal = ({
    value
  }) => {
    if (isNaN(value) || !isFinite(value)) return resolveSeqD03cb037.stringifyNumber(value);
    let sign = '';

    if (value < 0) {
      sign = '-';
      value = Math.abs(value);
    }

    const parts = [value % 60]; // seconds, including ms

    if (value < 60) {
      parts.unshift(0); // at least one : is required
    } else {
      value = Math.round((value - parts[0]) / 60);
      parts.unshift(value % 60); // minutes

      if (value >= 60) {
        value = Math.round((value - parts[0]) / 60);
        parts.unshift(value); // hours
      }
    }

    return sign + parts.map(n => n < 10 ? '0' + String(n) : String(n)).join(':').replace(/000000\d*$/, '') // % 60 may introduce error
    ;
  };

  const intTime = {
    identify: value => typeof value === 'number',
    default: true,
    tag: 'tag:yaml.org,2002:int',
    format: 'TIME',
    test: /^([-+]?)([0-9][0-9_]*(?::[0-5]?[0-9])+)$/,
    resolve: (str, sign, parts) => parseSexagesimal(sign, parts.replace(/_/g, '')),
    stringify: stringifySexagesimal
  };
  const floatTime = {
    identify: value => typeof value === 'number',
    default: true,
    tag: 'tag:yaml.org,2002:float',
    format: 'TIME',
    test: /^([-+]?)([0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*)$/,
    resolve: (str, sign, parts) => parseSexagesimal(sign, parts.replace(/_/g, '')),
    stringify: stringifySexagesimal
  };
  const timestamp = {
    identify: value => value instanceof Date,
    default: true,
    tag: 'tag:yaml.org,2002:timestamp',
    // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
    // may be omitted altogether, resulting in a date format. In such a case, the time part is
    // assumed to be 00:00:00Z (start of day, UTC).
    test: RegExp('^(?:' + '([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})' + // YYYY-Mm-Dd
    '(?:(?:t|T|[ \\t]+)' + // t | T | whitespace
    '([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)' + // Hh:Mm:Ss(.ss)?
    '(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?' + // Z | +5 | -03:30
    ')?' + ')$'),
    resolve: (str, year, month, day, hour, minute, second, millisec, tz) => {
      if (millisec) millisec = (millisec + '00').substr(1, 3);
      let date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec || 0);

      if (tz && tz !== 'Z') {
        let d = parseSexagesimal(tz[0], tz.slice(1));
        if (Math.abs(d) < 30) d *= 60;
        date -= 60000 * d;
      }

      return new Date(date);
    },
    stringify: ({
      value
    }) => value.toISOString().replace(/((T00:00)?:00)?\.000Z$/, '')
  };

  /* global console, process, YAML_SILENCE_DEPRECATION_WARNINGS, YAML_SILENCE_WARNINGS */
  function shouldWarn(deprecation) {
    const env = typeof process !== 'undefined' && process.env || {};

    if (deprecation) {
      if (typeof YAML_SILENCE_DEPRECATION_WARNINGS !== 'undefined') return !YAML_SILENCE_DEPRECATION_WARNINGS;
      return !env.YAML_SILENCE_DEPRECATION_WARNINGS;
    }

    if (typeof YAML_SILENCE_WARNINGS !== 'undefined') return !YAML_SILENCE_WARNINGS;
    return !env.YAML_SILENCE_WARNINGS;
  }

  function warn(warning, type) {
    if (shouldWarn(false)) {
      const emit = typeof process !== 'undefined' && process.emitWarning; // This will throw in Jest if `warning` is an Error instance due to
      // https://github.com/facebook/jest/issues/2549

      if (emit) emit(warning, type);else {
        // eslint-disable-next-line no-console
        console.warn(type ? `${type}: ${warning}` : warning);
      }
    }
  }
  function warnFileDeprecation(filename) {
    if (shouldWarn(true)) {
      const path = filename.replace(/.*yaml[/\\]/i, '').replace(/\.js$/, '').replace(/\\/g, '/');
      warn(`The endpoint 'yaml/${path}' will be removed in a future release.`, 'DeprecationWarning');
    }
  }
  const warned = {};
  function warnOptionDeprecation(name, alternative) {
    if (!warned[name] && shouldWarn(true)) {
      warned[name] = true;
      let msg = `The option '${name}' will be removed in a future release`;
      msg += alternative ? `, use '${alternative}' instead.` : '.';
      warn(msg, 'DeprecationWarning');
    }
  }

  var binary_1 = binary;
  var floatTime_1 = floatTime;
  var intTime_1 = intTime;
  var omap_1 = omap;
  var pairs_1 = pairs;
  var set_1 = set;
  var timestamp_1 = timestamp;
  var warn_1 = warn;
  var warnFileDeprecation_1 = warnFileDeprecation;
  var warnOptionDeprecation_1 = warnOptionDeprecation;

  var warnings1000a372 = {
  	binary: binary_1,
  	floatTime: floatTime_1,
  	intTime: intTime_1,
  	omap: omap_1,
  	pairs: pairs_1,
  	set: set_1,
  	timestamp: timestamp_1,
  	warn: warn_1,
  	warnFileDeprecation: warnFileDeprecation_1,
  	warnOptionDeprecation: warnOptionDeprecation_1
  };

  function createMap(schema, obj, ctx) {
    const map = new resolveSeqD03cb037.YAMLMap(schema);

    if (obj instanceof Map) {
      for (const [key, value] of obj) map.items.push(schema.createPair(key, value, ctx));
    } else if (obj && typeof obj === 'object') {
      for (const key of Object.keys(obj)) map.items.push(schema.createPair(key, obj[key], ctx));
    }

    if (typeof schema.sortMapEntries === 'function') {
      map.items.sort(schema.sortMapEntries);
    }

    return map;
  }

  const map = {
    createNode: createMap,
    default: true,
    nodeClass: resolveSeqD03cb037.YAMLMap,
    tag: 'tag:yaml.org,2002:map',
    resolve: resolveSeqD03cb037.resolveMap
  };

  function createSeq(schema, obj, ctx) {
    const seq = new resolveSeqD03cb037.YAMLSeq(schema);

    if (obj && obj[Symbol.iterator]) {
      for (const it of obj) {
        const v = schema.createNode(it, ctx.wrapScalars, null, ctx);
        seq.items.push(v);
      }
    }

    return seq;
  }

  const seq = {
    createNode: createSeq,
    default: true,
    nodeClass: resolveSeqD03cb037.YAMLSeq,
    tag: 'tag:yaml.org,2002:seq',
    resolve: resolveSeqD03cb037.resolveSeq
  };

  const string = {
    identify: value => typeof value === 'string',
    default: true,
    tag: 'tag:yaml.org,2002:str',
    resolve: resolveSeqD03cb037.resolveString,

    stringify(item, ctx, onComment, onChompKeep) {
      ctx = Object.assign({
        actualString: true
      }, ctx);
      return resolveSeqD03cb037.stringifyString(item, ctx, onComment, onChompKeep);
    },

    options: resolveSeqD03cb037.strOptions
  };

  const failsafe = [map, seq, string];

  /* global BigInt */

  const intIdentify$2 = value => typeof value === 'bigint' || Number.isInteger(value);

  const intResolve$1 = (src, part, radix) => resolveSeqD03cb037.intOptions.asBigInt ? BigInt(src) : parseInt(part, radix);

  function intStringify$1(node, radix, prefix) {
    const {
      value
    } = node;
    if (intIdentify$2(value) && value >= 0) return prefix + value.toString(radix);
    return resolveSeqD03cb037.stringifyNumber(node);
  }

  const nullObj = {
    identify: value => value == null,
    createNode: (schema, value, ctx) => ctx.wrapScalars ? new resolveSeqD03cb037.Scalar(null) : null,
    default: true,
    tag: 'tag:yaml.org,2002:null',
    test: /^(?:~|[Nn]ull|NULL)?$/,
    resolve: () => null,
    options: resolveSeqD03cb037.nullOptions,
    stringify: () => resolveSeqD03cb037.nullOptions.nullStr
  };
  const boolObj = {
    identify: value => typeof value === 'boolean',
    default: true,
    tag: 'tag:yaml.org,2002:bool',
    test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
    resolve: str => str[0] === 't' || str[0] === 'T',
    options: resolveSeqD03cb037.boolOptions,
    stringify: ({
      value
    }) => value ? resolveSeqD03cb037.boolOptions.trueStr : resolveSeqD03cb037.boolOptions.falseStr
  };
  const octObj = {
    identify: value => intIdentify$2(value) && value >= 0,
    default: true,
    tag: 'tag:yaml.org,2002:int',
    format: 'OCT',
    test: /^0o([0-7]+)$/,
    resolve: (str, oct) => intResolve$1(str, oct, 8),
    options: resolveSeqD03cb037.intOptions,
    stringify: node => intStringify$1(node, 8, '0o')
  };
  const intObj = {
    identify: intIdentify$2,
    default: true,
    tag: 'tag:yaml.org,2002:int',
    test: /^[-+]?[0-9]+$/,
    resolve: str => intResolve$1(str, str, 10),
    options: resolveSeqD03cb037.intOptions,
    stringify: resolveSeqD03cb037.stringifyNumber
  };
  const hexObj = {
    identify: value => intIdentify$2(value) && value >= 0,
    default: true,
    tag: 'tag:yaml.org,2002:int',
    format: 'HEX',
    test: /^0x([0-9a-fA-F]+)$/,
    resolve: (str, hex) => intResolve$1(str, hex, 16),
    options: resolveSeqD03cb037.intOptions,
    stringify: node => intStringify$1(node, 16, '0x')
  };
  const nanObj = {
    identify: value => typeof value === 'number',
    default: true,
    tag: 'tag:yaml.org,2002:float',
    test: /^(?:[-+]?\.inf|(\.nan))$/i,
    resolve: (str, nan) => nan ? NaN : str[0] === '-' ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
    stringify: resolveSeqD03cb037.stringifyNumber
  };
  const expObj = {
    identify: value => typeof value === 'number',
    default: true,
    tag: 'tag:yaml.org,2002:float',
    format: 'EXP',
    test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
    resolve: str => parseFloat(str),
    stringify: ({
      value
    }) => Number(value).toExponential()
  };
  const floatObj = {
    identify: value => typeof value === 'number',
    default: true,
    tag: 'tag:yaml.org,2002:float',
    test: /^[-+]?(?:\.([0-9]+)|[0-9]+\.([0-9]*))$/,

    resolve(str, frac1, frac2) {
      const frac = frac1 || frac2;
      const node = new resolveSeqD03cb037.Scalar(parseFloat(str));
      if (frac && frac[frac.length - 1] === '0') node.minFractionDigits = frac.length;
      return node;
    },

    stringify: resolveSeqD03cb037.stringifyNumber
  };
  const core = failsafe.concat([nullObj, boolObj, octObj, intObj, hexObj, nanObj, expObj, floatObj]);

  /* global BigInt */

  const intIdentify$1 = value => typeof value === 'bigint' || Number.isInteger(value);

  const stringifyJSON = ({
    value
  }) => JSON.stringify(value);

  const json = [map, seq, {
    identify: value => typeof value === 'string',
    default: true,
    tag: 'tag:yaml.org,2002:str',
    resolve: resolveSeqD03cb037.resolveString,
    stringify: stringifyJSON
  }, {
    identify: value => value == null,
    createNode: (schema, value, ctx) => ctx.wrapScalars ? new resolveSeqD03cb037.Scalar(null) : null,
    default: true,
    tag: 'tag:yaml.org,2002:null',
    test: /^null$/,
    resolve: () => null,
    stringify: stringifyJSON
  }, {
    identify: value => typeof value === 'boolean',
    default: true,
    tag: 'tag:yaml.org,2002:bool',
    test: /^true|false$/,
    resolve: str => str === 'true',
    stringify: stringifyJSON
  }, {
    identify: intIdentify$1,
    default: true,
    tag: 'tag:yaml.org,2002:int',
    test: /^-?(?:0|[1-9][0-9]*)$/,
    resolve: str => resolveSeqD03cb037.intOptions.asBigInt ? BigInt(str) : parseInt(str, 10),
    stringify: ({
      value
    }) => intIdentify$1(value) ? value.toString() : JSON.stringify(value)
  }, {
    identify: value => typeof value === 'number',
    default: true,
    tag: 'tag:yaml.org,2002:float',
    test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
    resolve: str => parseFloat(str),
    stringify: stringifyJSON
  }];

  json.scalarFallback = str => {
    throw new SyntaxError(`Unresolved plain scalar ${JSON.stringify(str)}`);
  };

  /* global BigInt */

  const boolStringify = ({
    value
  }) => value ? resolveSeqD03cb037.boolOptions.trueStr : resolveSeqD03cb037.boolOptions.falseStr;

  const intIdentify = value => typeof value === 'bigint' || Number.isInteger(value);

  function intResolve(sign, src, radix) {
    let str = src.replace(/_/g, '');

    if (resolveSeqD03cb037.intOptions.asBigInt) {
      switch (radix) {
        case 2:
          str = `0b${str}`;
          break;

        case 8:
          str = `0o${str}`;
          break;

        case 16:
          str = `0x${str}`;
          break;
      }

      const n = BigInt(str);
      return sign === '-' ? BigInt(-1) * n : n;
    }

    const n = parseInt(str, radix);
    return sign === '-' ? -1 * n : n;
  }

  function intStringify(node, radix, prefix) {
    const {
      value
    } = node;

    if (intIdentify(value)) {
      const str = value.toString(radix);
      return value < 0 ? '-' + prefix + str.substr(1) : prefix + str;
    }

    return resolveSeqD03cb037.stringifyNumber(node);
  }

  const yaml11 = failsafe.concat([{
    identify: value => value == null,
    createNode: (schema, value, ctx) => ctx.wrapScalars ? new resolveSeqD03cb037.Scalar(null) : null,
    default: true,
    tag: 'tag:yaml.org,2002:null',
    test: /^(?:~|[Nn]ull|NULL)?$/,
    resolve: () => null,
    options: resolveSeqD03cb037.nullOptions,
    stringify: () => resolveSeqD03cb037.nullOptions.nullStr
  }, {
    identify: value => typeof value === 'boolean',
    default: true,
    tag: 'tag:yaml.org,2002:bool',
    test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
    resolve: () => true,
    options: resolveSeqD03cb037.boolOptions,
    stringify: boolStringify
  }, {
    identify: value => typeof value === 'boolean',
    default: true,
    tag: 'tag:yaml.org,2002:bool',
    test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/i,
    resolve: () => false,
    options: resolveSeqD03cb037.boolOptions,
    stringify: boolStringify
  }, {
    identify: intIdentify,
    default: true,
    tag: 'tag:yaml.org,2002:int',
    format: 'BIN',
    test: /^([-+]?)0b([0-1_]+)$/,
    resolve: (str, sign, bin) => intResolve(sign, bin, 2),
    stringify: node => intStringify(node, 2, '0b')
  }, {
    identify: intIdentify,
    default: true,
    tag: 'tag:yaml.org,2002:int',
    format: 'OCT',
    test: /^([-+]?)0([0-7_]+)$/,
    resolve: (str, sign, oct) => intResolve(sign, oct, 8),
    stringify: node => intStringify(node, 8, '0')
  }, {
    identify: intIdentify,
    default: true,
    tag: 'tag:yaml.org,2002:int',
    test: /^([-+]?)([0-9][0-9_]*)$/,
    resolve: (str, sign, abs) => intResolve(sign, abs, 10),
    stringify: resolveSeqD03cb037.stringifyNumber
  }, {
    identify: intIdentify,
    default: true,
    tag: 'tag:yaml.org,2002:int',
    format: 'HEX',
    test: /^([-+]?)0x([0-9a-fA-F_]+)$/,
    resolve: (str, sign, hex) => intResolve(sign, hex, 16),
    stringify: node => intStringify(node, 16, '0x')
  }, {
    identify: value => typeof value === 'number',
    default: true,
    tag: 'tag:yaml.org,2002:float',
    test: /^(?:[-+]?\.inf|(\.nan))$/i,
    resolve: (str, nan) => nan ? NaN : str[0] === '-' ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
    stringify: resolveSeqD03cb037.stringifyNumber
  }, {
    identify: value => typeof value === 'number',
    default: true,
    tag: 'tag:yaml.org,2002:float',
    format: 'EXP',
    test: /^[-+]?([0-9][0-9_]*)?(\.[0-9_]*)?[eE][-+]?[0-9]+$/,
    resolve: str => parseFloat(str.replace(/_/g, '')),
    stringify: ({
      value
    }) => Number(value).toExponential()
  }, {
    identify: value => typeof value === 'number',
    default: true,
    tag: 'tag:yaml.org,2002:float',
    test: /^[-+]?(?:[0-9][0-9_]*)?\.([0-9_]*)$/,

    resolve(str, frac) {
      const node = new resolveSeqD03cb037.Scalar(parseFloat(str.replace(/_/g, '')));

      if (frac) {
        const f = frac.replace(/_/g, '');
        if (f[f.length - 1] === '0') node.minFractionDigits = f.length;
      }

      return node;
    },

    stringify: resolveSeqD03cb037.stringifyNumber
  }], warnings1000a372.binary, warnings1000a372.omap, warnings1000a372.pairs, warnings1000a372.set, warnings1000a372.intTime, warnings1000a372.floatTime, warnings1000a372.timestamp);

  const schemas = {
    core,
    failsafe,
    json,
    yaml11
  };
  const tags = {
    binary: warnings1000a372.binary,
    bool: boolObj,
    float: floatObj,
    floatExp: expObj,
    floatNaN: nanObj,
    floatTime: warnings1000a372.floatTime,
    int: intObj,
    intHex: hexObj,
    intOct: octObj,
    intTime: warnings1000a372.intTime,
    map,
    null: nullObj,
    omap: warnings1000a372.omap,
    pairs: warnings1000a372.pairs,
    seq,
    set: warnings1000a372.set,
    timestamp: warnings1000a372.timestamp
  };

  function findTagObject(value, tagName, tags) {
    if (tagName) {
      const match = tags.filter(t => t.tag === tagName);
      const tagObj = match.find(t => !t.format) || match[0];
      if (!tagObj) throw new Error(`Tag ${tagName} not found`);
      return tagObj;
    } // TODO: deprecate/remove class check


    return tags.find(t => (t.identify && t.identify(value) || t.class && value instanceof t.class) && !t.format);
  }

  function createNode(value, tagName, ctx) {
    if (value instanceof resolveSeqD03cb037.Node) return value;
    const {
      defaultPrefix,
      onTagObj,
      prevObjects,
      schema,
      wrapScalars
    } = ctx;
    if (tagName && tagName.startsWith('!!')) tagName = defaultPrefix + tagName.slice(2);
    let tagObj = findTagObject(value, tagName, schema.tags);

    if (!tagObj) {
      if (typeof value.toJSON === 'function') value = value.toJSON();
      if (!value || typeof value !== 'object') return wrapScalars ? new resolveSeqD03cb037.Scalar(value) : value;
      tagObj = value instanceof Map ? map : value[Symbol.iterator] ? seq : map;
    }

    if (onTagObj) {
      onTagObj(tagObj);
      delete ctx.onTagObj;
    } // Detect duplicate references to the same object & use Alias nodes for all
    // after first. The `obj` wrapper allows for circular references to resolve.


    const obj = {
      value: undefined,
      node: undefined
    };

    if (value && typeof value === 'object' && prevObjects) {
      const prev = prevObjects.get(value);

      if (prev) {
        const alias = new resolveSeqD03cb037.Alias(prev); // leaves source dirty; must be cleaned by caller

        ctx.aliasNodes.push(alias); // defined along with prevObjects

        return alias;
      }

      obj.value = value;
      prevObjects.set(value, obj);
    }

    obj.node = tagObj.createNode ? tagObj.createNode(ctx.schema, value, ctx) : wrapScalars ? new resolveSeqD03cb037.Scalar(value) : value;
    if (tagName && obj.node instanceof resolveSeqD03cb037.Node) obj.node.tag = tagName;
    return obj.node;
  }

  function getSchemaTags(schemas, knownTags, customTags, schemaId) {
    let tags = schemas[schemaId.replace(/\W/g, '')]; // 'yaml-1.1' -> 'yaml11'

    if (!tags) {
      const keys = Object.keys(schemas).map(key => JSON.stringify(key)).join(', ');
      throw new Error(`Unknown schema "${schemaId}"; use one of ${keys}`);
    }

    if (Array.isArray(customTags)) {
      for (const tag of customTags) tags = tags.concat(tag);
    } else if (typeof customTags === 'function') {
      tags = customTags(tags.slice());
    }

    for (let i = 0; i < tags.length; ++i) {
      const tag = tags[i];

      if (typeof tag === 'string') {
        const tagObj = knownTags[tag];

        if (!tagObj) {
          const keys = Object.keys(knownTags).map(key => JSON.stringify(key)).join(', ');
          throw new Error(`Unknown custom tag "${tag}"; use one of ${keys}`);
        }

        tags[i] = tagObj;
      }
    }

    return tags;
  }

  const sortMapEntriesByKey = (a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0;

  class Schema {
    // TODO: remove in v2
    // TODO: remove in v2
    constructor({
      customTags,
      merge,
      schema,
      sortMapEntries,
      tags: deprecatedCustomTags
    }) {
      this.merge = !!merge;
      this.name = schema;
      this.sortMapEntries = sortMapEntries === true ? sortMapEntriesByKey : sortMapEntries || null;
      if (!customTags && deprecatedCustomTags) warnings1000a372.warnOptionDeprecation('tags', 'customTags');
      this.tags = getSchemaTags(schemas, tags, customTags || deprecatedCustomTags, schema);
    }

    createNode(value, wrapScalars, tagName, ctx) {
      const baseCtx = {
        defaultPrefix: Schema.defaultPrefix,
        schema: this,
        wrapScalars
      };
      const createCtx = ctx ? Object.assign(ctx, baseCtx) : baseCtx;
      return createNode(value, tagName, createCtx);
    }

    createPair(key, value, ctx) {
      if (!ctx) ctx = {
        wrapScalars: true
      };
      const k = this.createNode(key, ctx.wrapScalars, null, ctx);
      const v = this.createNode(value, ctx.wrapScalars, null, ctx);
      return new resolveSeqD03cb037.Pair(k, v);
    }

  }

  PlainValueEc8e588e._defineProperty(Schema, "defaultPrefix", PlainValueEc8e588e.defaultTagPrefix);

  PlainValueEc8e588e._defineProperty(Schema, "defaultTags", PlainValueEc8e588e.defaultTags);

  var Schema_1 = Schema;

  var Schema88e323a7 = {
  	Schema: Schema_1
  };

  const defaultOptions = {
    anchorPrefix: 'a',
    customTags: null,
    indent: 2,
    indentSeq: true,
    keepCstNodes: false,
    keepNodeTypes: true,
    keepBlobsInJSON: true,
    mapAsMap: false,
    maxAliasCount: 100,
    prettyErrors: false,
    // TODO Set true in v2
    simpleKeys: false,
    version: '1.2'
  };
  const scalarOptions = {
    get binary() {
      return resolveSeqD03cb037.binaryOptions;
    },

    set binary(opt) {
      Object.assign(resolveSeqD03cb037.binaryOptions, opt);
    },

    get bool() {
      return resolveSeqD03cb037.boolOptions;
    },

    set bool(opt) {
      Object.assign(resolveSeqD03cb037.boolOptions, opt);
    },

    get int() {
      return resolveSeqD03cb037.intOptions;
    },

    set int(opt) {
      Object.assign(resolveSeqD03cb037.intOptions, opt);
    },

    get null() {
      return resolveSeqD03cb037.nullOptions;
    },

    set null(opt) {
      Object.assign(resolveSeqD03cb037.nullOptions, opt);
    },

    get str() {
      return resolveSeqD03cb037.strOptions;
    },

    set str(opt) {
      Object.assign(resolveSeqD03cb037.strOptions, opt);
    }

  };
  const documentOptions = {
    '1.0': {
      schema: 'yaml-1.1',
      merge: true,
      tagPrefixes: [{
        handle: '!',
        prefix: PlainValueEc8e588e.defaultTagPrefix
      }, {
        handle: '!!',
        prefix: 'tag:private.yaml.org,2002:'
      }]
    },
    1.1: {
      schema: 'yaml-1.1',
      merge: true,
      tagPrefixes: [{
        handle: '!',
        prefix: '!'
      }, {
        handle: '!!',
        prefix: PlainValueEc8e588e.defaultTagPrefix
      }]
    },
    1.2: {
      schema: 'core',
      merge: false,
      tagPrefixes: [{
        handle: '!',
        prefix: '!'
      }, {
        handle: '!!',
        prefix: PlainValueEc8e588e.defaultTagPrefix
      }]
    }
  };

  function stringifyTag(doc, tag) {
    if ((doc.version || doc.options.version) === '1.0') {
      const priv = tag.match(/^tag:private\.yaml\.org,2002:([^:/]+)$/);
      if (priv) return '!' + priv[1];
      const vocab = tag.match(/^tag:([a-zA-Z0-9-]+)\.yaml\.org,2002:(.*)/);
      return vocab ? `!${vocab[1]}/${vocab[2]}` : `!${tag.replace(/^tag:/, '')}`;
    }

    let p = doc.tagPrefixes.find(p => tag.indexOf(p.prefix) === 0);

    if (!p) {
      const dtp = doc.getDefaults().tagPrefixes;
      p = dtp && dtp.find(p => tag.indexOf(p.prefix) === 0);
    }

    if (!p) return tag[0] === '!' ? tag : `!<${tag}>`;
    const suffix = tag.substr(p.prefix.length).replace(/[!,[\]{}]/g, ch => ({
      '!': '%21',
      ',': '%2C',
      '[': '%5B',
      ']': '%5D',
      '{': '%7B',
      '}': '%7D'
    })[ch]);
    return p.handle + suffix;
  }

  function getTagObject(tags, item) {
    if (item instanceof resolveSeqD03cb037.Alias) return resolveSeqD03cb037.Alias;

    if (item.tag) {
      const match = tags.filter(t => t.tag === item.tag);
      if (match.length > 0) return match.find(t => t.format === item.format) || match[0];
    }

    let tagObj, obj;

    if (item instanceof resolveSeqD03cb037.Scalar) {
      obj = item.value; // TODO: deprecate/remove class check

      const match = tags.filter(t => t.identify && t.identify(obj) || t.class && obj instanceof t.class);
      tagObj = match.find(t => t.format === item.format) || match.find(t => !t.format);
    } else {
      obj = item;
      tagObj = tags.find(t => t.nodeClass && obj instanceof t.nodeClass);
    }

    if (!tagObj) {
      const name = obj && obj.constructor ? obj.constructor.name : typeof obj;
      throw new Error(`Tag not resolved for ${name} value`);
    }

    return tagObj;
  } // needs to be called before value stringifier to allow for circular anchor refs


  function stringifyProps(node, tagObj, {
    anchors,
    doc
  }) {
    const props = [];
    const anchor = doc.anchors.getName(node);

    if (anchor) {
      anchors[anchor] = node;
      props.push(`&${anchor}`);
    }

    if (node.tag) {
      props.push(stringifyTag(doc, node.tag));
    } else if (!tagObj.default) {
      props.push(stringifyTag(doc, tagObj.tag));
    }

    return props.join(' ');
  }

  function stringify(item, ctx, onComment, onChompKeep) {
    const {
      anchors,
      schema
    } = ctx.doc;
    let tagObj;

    if (!(item instanceof resolveSeqD03cb037.Node)) {
      const createCtx = {
        aliasNodes: [],
        onTagObj: o => tagObj = o,
        prevObjects: new Map()
      };
      item = schema.createNode(item, true, null, createCtx);

      for (const alias of createCtx.aliasNodes) {
        alias.source = alias.source.node;
        let name = anchors.getName(alias.source);

        if (!name) {
          name = anchors.newName();
          anchors.map[name] = alias.source;
        }
      }
    }

    if (item instanceof resolveSeqD03cb037.Pair) return item.toString(ctx, onComment, onChompKeep);
    if (!tagObj) tagObj = getTagObject(schema.tags, item);
    const props = stringifyProps(item, tagObj, ctx);
    if (props.length > 0) ctx.indentAtStart = (ctx.indentAtStart || 0) + props.length + 1;
    const str = typeof tagObj.stringify === 'function' ? tagObj.stringify(item, ctx, onComment, onChompKeep) : item instanceof resolveSeqD03cb037.Scalar ? resolveSeqD03cb037.stringifyString(item, ctx, onComment, onChompKeep) : item.toString(ctx, onComment, onChompKeep);
    if (!props) return str;
    return item instanceof resolveSeqD03cb037.Scalar || str[0] === '{' || str[0] === '[' ? `${props} ${str}` : `${props}\n${ctx.indent}${str}`;
  }

  class Anchors {
    static validAnchorNode(node) {
      return node instanceof resolveSeqD03cb037.Scalar || node instanceof resolveSeqD03cb037.YAMLSeq || node instanceof resolveSeqD03cb037.YAMLMap;
    }

    constructor(prefix) {
      PlainValueEc8e588e._defineProperty(this, "map", Object.create(null));

      this.prefix = prefix;
    }

    createAlias(node, name) {
      this.setAnchor(node, name);
      return new resolveSeqD03cb037.Alias(node);
    }

    createMergePair(...sources) {
      const merge = new resolveSeqD03cb037.Merge();
      merge.value.items = sources.map(s => {
        if (s instanceof resolveSeqD03cb037.Alias) {
          if (s.source instanceof resolveSeqD03cb037.YAMLMap) return s;
        } else if (s instanceof resolveSeqD03cb037.YAMLMap) {
          return this.createAlias(s);
        }

        throw new Error('Merge sources must be Map nodes or their Aliases');
      });
      return merge;
    }

    getName(node) {
      const {
        map
      } = this;
      return Object.keys(map).find(a => map[a] === node);
    }

    getNames() {
      return Object.keys(this.map);
    }

    getNode(name) {
      return this.map[name];
    }

    newName(prefix) {
      if (!prefix) prefix = this.prefix;
      const names = Object.keys(this.map);

      for (let i = 1; true; ++i) {
        const name = `${prefix}${i}`;
        if (!names.includes(name)) return name;
      }
    } // During parsing, map & aliases contain CST nodes


    resolveNodes() {
      const {
        map,
        _cstAliases
      } = this;
      Object.keys(map).forEach(a => {
        map[a] = map[a].resolved;
      });

      _cstAliases.forEach(a => {
        a.source = a.source.resolved;
      });

      delete this._cstAliases;
    }

    setAnchor(node, name) {
      if (node != null && !Anchors.validAnchorNode(node)) {
        throw new Error('Anchors may only be set for Scalar, Seq and Map nodes');
      }

      if (name && /[\x00-\x19\s,[\]{}]/.test(name)) {
        throw new Error('Anchor names must not contain whitespace or control characters');
      }

      const {
        map
      } = this;
      const prev = node && Object.keys(map).find(a => map[a] === node);

      if (prev) {
        if (!name) {
          return prev;
        } else if (prev !== name) {
          delete map[prev];
          map[name] = node;
        }
      } else {
        if (!name) {
          if (!node) return null;
          name = this.newName();
        }

        map[name] = node;
      }

      return name;
    }

  }

  const visit = (node, tags) => {
    if (node && typeof node === 'object') {
      const {
        tag
      } = node;

      if (node instanceof resolveSeqD03cb037.Collection) {
        if (tag) tags[tag] = true;
        node.items.forEach(n => visit(n, tags));
      } else if (node instanceof resolveSeqD03cb037.Pair) {
        visit(node.key, tags);
        visit(node.value, tags);
      } else if (node instanceof resolveSeqD03cb037.Scalar) {
        if (tag) tags[tag] = true;
      }
    }

    return tags;
  };

  const listTagNames = node => Object.keys(visit(node, {}));

  function parseContents(doc, contents) {
    const comments = {
      before: [],
      after: []
    };
    let body = undefined;
    let spaceBefore = false;

    for (const node of contents) {
      if (node.valueRange) {
        if (body !== undefined) {
          const msg = 'Document contains trailing content not separated by a ... or --- line';
          doc.errors.push(new PlainValueEc8e588e.YAMLSyntaxError(node, msg));
          break;
        }

        const res = resolveSeqD03cb037.resolveNode(doc, node);

        if (spaceBefore) {
          res.spaceBefore = true;
          spaceBefore = false;
        }

        body = res;
      } else if (node.comment !== null) {
        const cc = body === undefined ? comments.before : comments.after;
        cc.push(node.comment);
      } else if (node.type === PlainValueEc8e588e.Type.BLANK_LINE) {
        spaceBefore = true;

        if (body === undefined && comments.before.length > 0 && !doc.commentBefore) {
          // space-separated comments at start are parsed as document comments
          doc.commentBefore = comments.before.join('\n');
          comments.before = [];
        }
      }
    }

    doc.contents = body || null;

    if (!body) {
      doc.comment = comments.before.concat(comments.after).join('\n') || null;
    } else {
      const cb = comments.before.join('\n');

      if (cb) {
        const cbNode = body instanceof resolveSeqD03cb037.Collection && body.items[0] ? body.items[0] : body;
        cbNode.commentBefore = cbNode.commentBefore ? `${cb}\n${cbNode.commentBefore}` : cb;
      }

      doc.comment = comments.after.join('\n') || null;
    }
  }

  function resolveTagDirective({
    tagPrefixes
  }, directive) {
    const [handle, prefix] = directive.parameters;

    if (!handle || !prefix) {
      const msg = 'Insufficient parameters given for %TAG directive';
      throw new PlainValueEc8e588e.YAMLSemanticError(directive, msg);
    }

    if (tagPrefixes.some(p => p.handle === handle)) {
      const msg = 'The %TAG directive must only be given at most once per handle in the same document.';
      throw new PlainValueEc8e588e.YAMLSemanticError(directive, msg);
    }

    return {
      handle,
      prefix
    };
  }

  function resolveYamlDirective(doc, directive) {
    let [version] = directive.parameters;
    if (directive.name === 'YAML:1.0') version = '1.0';

    if (!version) {
      const msg = 'Insufficient parameters given for %YAML directive';
      throw new PlainValueEc8e588e.YAMLSemanticError(directive, msg);
    }

    if (!documentOptions[version]) {
      const v0 = doc.version || doc.options.version;
      const msg = `Document will be parsed as YAML ${v0} rather than YAML ${version}`;
      doc.warnings.push(new PlainValueEc8e588e.YAMLWarning(directive, msg));
    }

    return version;
  }

  function parseDirectives(doc, directives, prevDoc) {
    const directiveComments = [];
    let hasDirectives = false;

    for (const directive of directives) {
      const {
        comment,
        name
      } = directive;

      switch (name) {
        case 'TAG':
          try {
            doc.tagPrefixes.push(resolveTagDirective(doc, directive));
          } catch (error) {
            doc.errors.push(error);
          }

          hasDirectives = true;
          break;

        case 'YAML':
        case 'YAML:1.0':
          if (doc.version) {
            const msg = 'The %YAML directive must only be given at most once per document.';
            doc.errors.push(new PlainValueEc8e588e.YAMLSemanticError(directive, msg));
          }

          try {
            doc.version = resolveYamlDirective(doc, directive);
          } catch (error) {
            doc.errors.push(error);
          }

          hasDirectives = true;
          break;

        default:
          if (name) {
            const msg = `YAML only supports %TAG and %YAML directives, and not %${name}`;
            doc.warnings.push(new PlainValueEc8e588e.YAMLWarning(directive, msg));
          }

      }

      if (comment) directiveComments.push(comment);
    }

    if (prevDoc && !hasDirectives && '1.1' === (doc.version || prevDoc.version || doc.options.version)) {
      const copyTagPrefix = ({
        handle,
        prefix
      }) => ({
        handle,
        prefix
      });

      doc.tagPrefixes = prevDoc.tagPrefixes.map(copyTagPrefix);
      doc.version = prevDoc.version;
    }

    doc.commentBefore = directiveComments.join('\n') || null;
  }

  function assertCollection(contents) {
    if (contents instanceof resolveSeqD03cb037.Collection) return true;
    throw new Error('Expected a YAML collection as document contents');
  }

  class Document$1 {
    constructor(options) {
      this.anchors = new Anchors(options.anchorPrefix);
      this.commentBefore = null;
      this.comment = null;
      this.contents = null;
      this.directivesEndMarker = null;
      this.errors = [];
      this.options = options;
      this.schema = null;
      this.tagPrefixes = [];
      this.version = null;
      this.warnings = [];
    }

    add(value) {
      assertCollection(this.contents);
      return this.contents.add(value);
    }

    addIn(path, value) {
      assertCollection(this.contents);
      this.contents.addIn(path, value);
    }

    delete(key) {
      assertCollection(this.contents);
      return this.contents.delete(key);
    }

    deleteIn(path) {
      if (resolveSeqD03cb037.isEmptyPath(path)) {
        if (this.contents == null) return false;
        this.contents = null;
        return true;
      }

      assertCollection(this.contents);
      return this.contents.deleteIn(path);
    }

    getDefaults() {
      return Document$1.defaults[this.version] || Document$1.defaults[this.options.version] || {};
    }

    get(key, keepScalar) {
      return this.contents instanceof resolveSeqD03cb037.Collection ? this.contents.get(key, keepScalar) : undefined;
    }

    getIn(path, keepScalar) {
      if (resolveSeqD03cb037.isEmptyPath(path)) return !keepScalar && this.contents instanceof resolveSeqD03cb037.Scalar ? this.contents.value : this.contents;
      return this.contents instanceof resolveSeqD03cb037.Collection ? this.contents.getIn(path, keepScalar) : undefined;
    }

    has(key) {
      return this.contents instanceof resolveSeqD03cb037.Collection ? this.contents.has(key) : false;
    }

    hasIn(path) {
      if (resolveSeqD03cb037.isEmptyPath(path)) return this.contents !== undefined;
      return this.contents instanceof resolveSeqD03cb037.Collection ? this.contents.hasIn(path) : false;
    }

    set(key, value) {
      assertCollection(this.contents);
      this.contents.set(key, value);
    }

    setIn(path, value) {
      if (resolveSeqD03cb037.isEmptyPath(path)) this.contents = value;else {
        assertCollection(this.contents);
        this.contents.setIn(path, value);
      }
    }

    setSchema(id, customTags) {
      if (!id && !customTags && this.schema) return;
      if (typeof id === 'number') id = id.toFixed(1);

      if (id === '1.0' || id === '1.1' || id === '1.2') {
        if (this.version) this.version = id;else this.options.version = id;
        delete this.options.schema;
      } else if (id && typeof id === 'string') {
        this.options.schema = id;
      }

      if (Array.isArray(customTags)) this.options.customTags = customTags;
      const opt = Object.assign({}, this.getDefaults(), this.options);
      this.schema = new Schema88e323a7.Schema(opt);
    }

    parse(node, prevDoc) {
      if (this.options.keepCstNodes) this.cstNode = node;
      if (this.options.keepNodeTypes) this.type = 'DOCUMENT';
      const {
        directives = [],
        contents = [],
        directivesEndMarker,
        error,
        valueRange
      } = node;

      if (error) {
        if (!error.source) error.source = this;
        this.errors.push(error);
      }

      parseDirectives(this, directives, prevDoc);
      if (directivesEndMarker) this.directivesEndMarker = true;
      this.range = valueRange ? [valueRange.start, valueRange.end] : null;
      this.setSchema();
      this.anchors._cstAliases = [];
      parseContents(this, contents);
      this.anchors.resolveNodes();

      if (this.options.prettyErrors) {
        for (const error of this.errors) if (error instanceof PlainValueEc8e588e.YAMLError) error.makePretty();

        for (const warn of this.warnings) if (warn instanceof PlainValueEc8e588e.YAMLError) warn.makePretty();
      }

      return this;
    }

    listNonDefaultTags() {
      return listTagNames(this.contents).filter(t => t.indexOf(Schema88e323a7.Schema.defaultPrefix) !== 0);
    }

    setTagPrefix(handle, prefix) {
      if (handle[0] !== '!' || handle[handle.length - 1] !== '!') throw new Error('Handle must start and end with !');

      if (prefix) {
        const prev = this.tagPrefixes.find(p => p.handle === handle);
        if (prev) prev.prefix = prefix;else this.tagPrefixes.push({
          handle,
          prefix
        });
      } else {
        this.tagPrefixes = this.tagPrefixes.filter(p => p.handle !== handle);
      }
    }

    toJSON(arg, onAnchor) {
      const {
        keepBlobsInJSON,
        mapAsMap,
        maxAliasCount
      } = this.options;
      const keep = keepBlobsInJSON && (typeof arg !== 'string' || !(this.contents instanceof resolveSeqD03cb037.Scalar));
      const ctx = {
        doc: this,
        indentStep: '  ',
        keep,
        mapAsMap: keep && !!mapAsMap,
        maxAliasCount,
        stringify // Requiring directly in Pair would create circular dependencies

      };
      const anchorNames = Object.keys(this.anchors.map);
      if (anchorNames.length > 0) ctx.anchors = new Map(anchorNames.map(name => [this.anchors.map[name], {
        alias: [],
        aliasCount: 0,
        count: 1
      }]));
      const res = resolveSeqD03cb037.toJSON(this.contents, arg, ctx);
      if (typeof onAnchor === 'function' && ctx.anchors) for (const {
        count,
        res
      } of ctx.anchors.values()) onAnchor(res, count);
      return res;
    }

    toString() {
      if (this.errors.length > 0) throw new Error('Document with errors cannot be stringified');
      const indentSize = this.options.indent;

      if (!Number.isInteger(indentSize) || indentSize <= 0) {
        const s = JSON.stringify(indentSize);
        throw new Error(`"indent" option must be a positive integer, not ${s}`);
      }

      this.setSchema();
      const lines = [];
      let hasDirectives = false;

      if (this.version) {
        let vd = '%YAML 1.2';

        if (this.schema.name === 'yaml-1.1') {
          if (this.version === '1.0') vd = '%YAML:1.0';else if (this.version === '1.1') vd = '%YAML 1.1';
        }

        lines.push(vd);
        hasDirectives = true;
      }

      const tagNames = this.listNonDefaultTags();
      this.tagPrefixes.forEach(({
        handle,
        prefix
      }) => {
        if (tagNames.some(t => t.indexOf(prefix) === 0)) {
          lines.push(`%TAG ${handle} ${prefix}`);
          hasDirectives = true;
        }
      });
      if (hasDirectives || this.directivesEndMarker) lines.push('---');

      if (this.commentBefore) {
        if (hasDirectives || !this.directivesEndMarker) lines.unshift('');
        lines.unshift(this.commentBefore.replace(/^/gm, '#'));
      }

      const ctx = {
        anchors: Object.create(null),
        doc: this,
        indent: '',
        indentStep: ' '.repeat(indentSize),
        stringify // Requiring directly in nodes would create circular dependencies

      };
      let chompKeep = false;
      let contentComment = null;

      if (this.contents) {
        if (this.contents instanceof resolveSeqD03cb037.Node) {
          if (this.contents.spaceBefore && (hasDirectives || this.directivesEndMarker)) lines.push('');
          if (this.contents.commentBefore) lines.push(this.contents.commentBefore.replace(/^/gm, '#')); // top-level block scalars need to be indented if followed by a comment

          ctx.forceBlockIndent = !!this.comment;
          contentComment = this.contents.comment;
        }

        const onChompKeep = contentComment ? null : () => chompKeep = true;
        const body = stringify(this.contents, ctx, () => contentComment = null, onChompKeep);
        lines.push(resolveSeqD03cb037.addComment(body, '', contentComment));
      } else if (this.contents !== undefined) {
        lines.push(stringify(this.contents, ctx));
      }

      if (this.comment) {
        if ((!chompKeep || contentComment) && lines[lines.length - 1] !== '') lines.push('');
        lines.push(this.comment.replace(/^/gm, '#'));
      }

      return lines.join('\n') + '\n';
    }

  }

  PlainValueEc8e588e._defineProperty(Document$1, "defaults", documentOptions);

  var Document_1 = Document$1;
  var defaultOptions_1 = defaultOptions;
  var scalarOptions_1 = scalarOptions;

  var Document9b4560a1 = {
  	Document: Document_1,
  	defaultOptions: defaultOptions_1,
  	scalarOptions: scalarOptions_1
  };

  function createNode$1(value, wrapScalars = true, tag) {
    if (tag === undefined && typeof wrapScalars === 'string') {
      tag = wrapScalars;
      wrapScalars = true;
    }

    const options = Object.assign({}, Document9b4560a1.Document.defaults[Document9b4560a1.defaultOptions.version], Document9b4560a1.defaultOptions);
    const schema = new Schema88e323a7.Schema(options);
    return schema.createNode(value, wrapScalars, tag);
  }

  class Document$2 extends Document9b4560a1.Document {
    constructor(options) {
      super(Object.assign({}, Document9b4560a1.defaultOptions, options));
    }

  }

  function parseAllDocuments(src, options) {
    const stream = [];
    let prev;

    for (const cstDoc of parseCst.parse(src)) {
      const doc = new Document$2(options);
      doc.parse(cstDoc, prev);
      stream.push(doc);
      prev = doc;
    }

    return stream;
  }

  function parseDocument(src, options) {
    const cst = parseCst.parse(src);
    const doc = new Document$2(options).parse(cst[0]);

    if (cst.length > 1) {
      const errMsg = 'Source contains multiple documents; please use YAML.parseAllDocuments()';
      doc.errors.unshift(new PlainValueEc8e588e.YAMLSemanticError(cst[1], errMsg));
    }

    return doc;
  }

  function parse$1(src, options) {
    const doc = parseDocument(src, options);
    doc.warnings.forEach(warning => warnings1000a372.warn(warning));
    if (doc.errors.length > 0) throw doc.errors[0];
    return doc.toJSON();
  }

  function stringify$1(value, options) {
    const doc = new Document$2(options);
    doc.contents = value;
    return String(doc);
  }

  const YAML = {
    createNode: createNode$1,
    defaultOptions: Document9b4560a1.defaultOptions,
    Document: Document$2,
    parse: parse$1,
    parseAllDocuments,
    parseCST: parseCst.parse,
    parseDocument,
    scalarOptions: Document9b4560a1.scalarOptions,
    stringify: stringify$1
  };

  var YAML_1 = YAML;

  var dist = {
  	YAML: YAML_1
  };

  var yaml = dist.YAML;

  var Alias$2 = resolveSeqD03cb037.Alias;
  var Collection$2 = resolveSeqD03cb037.Collection;
  var Merge$1 = resolveSeqD03cb037.Merge;
  var Node$2 = resolveSeqD03cb037.Node;
  var Pair$1 = resolveSeqD03cb037.Pair;
  var Scalar$1 = resolveSeqD03cb037.Scalar;
  var YAMLMap$1 = resolveSeqD03cb037.YAMLMap;
  var YAMLSeq$1 = resolveSeqD03cb037.YAMLSeq;
  var binaryOptions$1 = resolveSeqD03cb037.binaryOptions;
  var boolOptions$1 = resolveSeqD03cb037.boolOptions;
  var intOptions$1 = resolveSeqD03cb037.intOptions;
  var nullOptions$1 = resolveSeqD03cb037.nullOptions;
  var strOptions$1 = resolveSeqD03cb037.strOptions;
  var Schema_1$1 = Schema88e323a7.Schema;

  var types$2 = {
  	Alias: Alias$2,
  	Collection: Collection$2,
  	Merge: Merge$1,
  	Node: Node$2,
  	Pair: Pair$1,
  	Scalar: Scalar$1,
  	YAMLMap: YAMLMap$1,
  	YAMLSeq: YAMLSeq$1,
  	binaryOptions: binaryOptions$1,
  	boolOptions: boolOptions$1,
  	intOptions: intOptions$1,
  	nullOptions: nullOptions$1,
  	strOptions: strOptions$1,
  	Schema: Schema_1$1
  };

  const YAMLMap$2 = types$2.YAMLMap;
  const YAMLSeq$2 = types$2.YAMLSeq;

  function getIn(obj, path) {
    return path.reduce(function (v, k) { return (k in v ? v[k] : {}); }, obj);
  }

  function addComments(context, path, commentNode, iterNode) {
    if ( iterNode === void 0 ) iterNode = commentNode;

    var ref = getIn(context, path);
    var title = ref.title;
    var description = ref.description;
    var comment = ref.comment;
    var lines = [];

    if (optionAPI('renderTitle') && title) {
      lines.push((" " + title), '');
    }
    if (optionAPI('renderDescription') && description) {
      lines.push((" " + description));
    }
    if (optionAPI('renderComment') && comment) {
      lines.push((" " + comment));
    }

    commentNode.commentBefore = lines.join('\n');

    if (iterNode instanceof YAMLMap$2) {
      iterNode.items.forEach(function (n) {
        addComments(context, path.concat( ['items'], [n.key.value]), n.key, n.value);
      });
    } else if (iterNode instanceof YAMLSeq$2) {
      iterNode.items.forEach(function (n, i) {
        addComments(context, path.concat( ['items'], [i]), n);
      });
    }
  }

  /** Render YAML string from the generated value and context
   *
   * @param value
   * @param context
   * @returns {string}
   */
  function renderYAML(ref) {
    var value = ref.value;
    var context = ref.context;

    var nodes = yaml.createNode(value);

    addComments(context, [], nodes);

    var doc = new yaml.Document();
    doc.contents = nodes;

    return doc.toString();
  }

  var container = new Container();

  function setupKeywords() {
    // safe auto-increment values
    container.define('autoIncrement', function autoIncrement(value, schema) {
      if (!this.offset) {
        var min = schema.minimum || 1;
        var max = min + env.MAX_NUMBER;
        var offset = value.initialOffset || schema.initialOffset;

        this.offset = offset || random.number(min, max);
      }

      if (value === true) {
        return this.offset++; // eslint-disable-line
      }

      return schema;
    });

    // safe-and-sequential dates
    container.define('sequentialDate', function sequentialDate(value, schema) {
      if (!this.now) {
        this.now = random.date();
      }

      if (value) {
        schema = this.now.toISOString();
        value = value === true
          ? 'days'
          : value;

        if (['seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'years'].indexOf(value) === -1) {
          throw new Error(("Unsupported increment by " + (utils.short(value))));
        }

        this.now.setTime(this.now.getTime() + random.date(value));
      }

      return schema;
    });
  }

  function getRefs(refs, schema) {
    var $refs = {};

    if (Array.isArray(refs)) {
      refs.forEach(function (_schema) {
        $refs[_schema.$id || _schema.id] = _schema;
      });
    } else {
      $refs = refs || {};
    }

    function walk(obj) {
      if (!obj || typeof obj !== 'object') { return; }
      if (Array.isArray(obj)) { return obj.forEach(walk); }

      var _id = obj.$id || obj.id;

      if (typeof _id === 'string' && !$refs[_id]) {
        $refs[_id] = obj;
      }

      Object.keys(obj).forEach(function (key) {
        walk(obj[key]);
      });
    }

    walk(refs);
    walk(schema);

    return $refs;
  }

  var jsf = function (schema, refs, cwd) {
    console.log('[json-schema-faker] calling JsonSchemaFaker() is deprecated, call either .generate() or .resolve()');

    if (cwd) {
      console.log('[json-schema-faker] references are only supported by calling .resolve()');
    }

    return jsf.generate(schema, refs);
  };

  jsf.generateWithContext = function (schema, refs) {
    var $refs = getRefs(refs, schema);

    return run($refs, schema, container);
  };

  jsf.generate = function (schema, refs) { return renderJS(
      jsf.generateWithContext(schema, refs)
    ); };

  jsf.generateYAML = function (schema, refs) { return renderYAML(
      jsf.generateWithContext(schema, refs)
    ); };

  jsf.resolveWithContext = function (schema, refs, cwd) {
    if (typeof refs === 'string') {
      cwd = refs;
      refs = {};
    }

    // normalize basedir (browser aware)
    cwd = cwd || (typeof process !== 'undefined' ? process.cwd() : '');
    cwd = (cwd.replace(/\/+$/, '')) + "/";

    var $refs = getRefs(refs, schema);

    // identical setup as json-schema-sequelizer
    var fixedRefs = {
      order: 1,
      canRead: function canRead(file) {
        var key = file.url.replace('/:', ':');

        return $refs[key] || $refs[key.split('/').pop()];
      },
      read: function read(file, callback) {
        try {
          callback(null, this.canRead(file));
        } catch (e) {
          callback(e);
        }
      },
    };

    return $RefParser__default['default']
      .bundle(cwd, schema, {
        resolve: {
          file: { order: 100 },
          http: { order: 200 },
          fixedRefs: fixedRefs,
        },
        dereference: {
          circular: 'ignore',
        },
      }).then(function (sub) { return run($refs, sub, container); })
      .catch(function (e) {
        throw new Error(("Error while resolving schema (" + (e.message) + ")"));
      });
  };

  jsf.resolve = function (schema, refs, cwd) { return jsf.resolveWithContext(schema, refs, cwd).then(renderJS); };

  jsf.resolveYAML = function (schema, refs, cwd) { return jsf.resolveWithContext(schema, refs, cwd).then(renderYAML); };

  setupKeywords();

  jsf.format = formatAPI;
  jsf.option = optionAPI;
  jsf.random = random;

  // returns itself for chaining
  jsf.extend = function (name, cb) {
    container.extend(name, cb);
    return jsf;
  };

  jsf.define = function (name, cb) {
    container.define(name, cb);
    return jsf;
  };

  jsf.reset = function (name) {
    container.reset(name);
    setupKeywords();
    return jsf;
  };

  jsf.locate = function (name) {
    return container.get(name);
  };


  if (typeof VERSION !== 'undefined') {
    jsf.version = VERSION;
  }

  return jsf;

})));
