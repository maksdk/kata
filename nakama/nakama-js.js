/* tslint:disable */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.nakamajs = {}));
}(this, function (exports) { 'use strict';

  (function () {

    var object = (
      // #34: CommonJS
      typeof exports === 'object' && exports !== null &&
      typeof exports.nodeType !== 'number' ?
        exports :
      // #8: web workers
      typeof self != 'undefined' ?
        self :
      // #31: ExtendScript
        $.global
    );

    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    function InvalidCharacterError(message) {
      this.message = message;
    }
    InvalidCharacterError.prototype = new Error;
    InvalidCharacterError.prototype.name = 'InvalidCharacterError';

    // encoder
    // [https://gist.github.com/999166] by [https://github.com/nignag]
    object.btoa || (
    object.btoa = function (input) {
      var str = String(input);
      for (
        // initialize result and counter
        var block, charCode, idx = 0, map = chars, output = '';
        // if the next str index does not exist:
        //   change the mapping table to "="
        //   check if d has no fractional digits
        str.charAt(idx | 0) || (map = '=', idx % 1);
        // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
        output += map.charAt(63 & block >> 8 - idx % 1 * 8)
      ) {
        charCode = str.charCodeAt(idx += 3/4);
        if (charCode > 0xFF) {
          throw new InvalidCharacterError("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
        }
        block = block << 8 | charCode;
      }
      return output;
    });

    // decoder
    // [https://gist.github.com/1020396] by [https://github.com/atk]
    object.atob || (
    object.atob = function (input) {
      var str = String(input).replace(/[=]+$/, ''); // #31: ExtendScript bad parse of /=
      if (str.length % 4 == 1) {
        throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
      }
      for (
        // initialize result and counters
        var bc = 0, bs, buffer, idx = 0, output = '';
        // get next character
        buffer = str.charAt(idx++);
        // character found in table? initialize bit storage and add its ascii value;
        ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
          // and if not first of each 4 characters,
          // convert the first 8 bits to one ascii character
          bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
      ) {
        // try to find character in table (0-63, not found => -1)
        buffer = chars.indexOf(buffer);
      }
      return output;
    });

  }());

  (function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.WHATWGFetch = {})));
  }(window, (function (exports) {
    var support = {
      searchParams: 'URLSearchParams' in self,
      iterable: 'Symbol' in self && 'iterator' in Symbol,
      blob:
        'FileReader' in self &&
        'Blob' in self &&
        (function() {
          try {
            new Blob();
            return true
          } catch (e) {
            return false
          }
        })(),
      formData: 'FormData' in self,
      arrayBuffer: 'ArrayBuffer' in self
    };

    function isDataView(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    }

    if (support.arrayBuffer) {
      var viewClasses = [
        '[object Int8Array]',
        '[object Uint8Array]',
        '[object Uint8ClampedArray]',
        '[object Int16Array]',
        '[object Uint16Array]',
        '[object Int32Array]',
        '[object Uint32Array]',
        '[object Float32Array]',
        '[object Float64Array]'
      ];

      var isArrayBufferView =
        ArrayBuffer.isView ||
        function(obj) {
          return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
        };
    }

    function normalizeName(name) {
      if (typeof name !== 'string') {
        name = String(name);
      }
      if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
        throw new TypeError('Invalid character in header field name')
      }
      return name.toLowerCase()
    }

    function normalizeValue(value) {
      if (typeof value !== 'string') {
        value = String(value);
      }
      return value
    }

    // Build a destructive iterator for the value list
    function iteratorFor(items) {
      var iterator = {
        next: function() {
          var value = items.shift();
          return {done: value === undefined, value: value}
        }
      };

      if (support.iterable) {
        iterator[Symbol.iterator] = function() {
          return iterator
        };
      }

      return iterator
    }

    function Headers(headers) {
      this.map = {};

      if (headers instanceof Headers) {
        headers.forEach(function(value, name) {
          this.append(name, value);
        }, this);
      } else if (Array.isArray(headers)) {
        headers.forEach(function(header) {
          this.append(header[0], header[1]);
        }, this);
      } else if (headers) {
        Object.getOwnPropertyNames(headers).forEach(function(name) {
          this.append(name, headers[name]);
        }, this);
      }
    }

    Headers.prototype.append = function(name, value) {
      name = normalizeName(name);
      value = normalizeValue(value);
      var oldValue = this.map[name];
      this.map[name] = oldValue ? oldValue + ', ' + value : value;
    };

    Headers.prototype['delete'] = function(name) {
      delete this.map[normalizeName(name)];
    };

    Headers.prototype.get = function(name) {
      name = normalizeName(name);
      return this.has(name) ? this.map[name] : null
    };

    Headers.prototype.has = function(name) {
      return this.map.hasOwnProperty(normalizeName(name))
    };

    Headers.prototype.set = function(name, value) {
      this.map[normalizeName(name)] = normalizeValue(value);
    };

    Headers.prototype.forEach = function(callback, thisArg) {
      for (var name in this.map) {
        if (this.map.hasOwnProperty(name)) {
          callback.call(thisArg, this.map[name], name, this);
        }
      }
    };

    Headers.prototype.keys = function() {
      var items = [];
      this.forEach(function(value, name) {
        items.push(name);
      });
      return iteratorFor(items)
    };

    Headers.prototype.values = function() {
      var items = [];
      this.forEach(function(value) {
        items.push(value);
      });
      return iteratorFor(items)
    };

    Headers.prototype.entries = function() {
      var items = [];
      this.forEach(function(value, name) {
        items.push([name, value]);
      });
      return iteratorFor(items)
    };

    if (support.iterable) {
      Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
    }

    function consumed(body) {
      if (body.bodyUsed) {
        return Promise.reject(new TypeError('Already read'))
      }
      body.bodyUsed = true;
    }

    function fileReaderReady(reader) {
      return new Promise(function(resolve, reject) {
        reader.onload = function() {
          resolve(reader.result);
        };
        reader.onerror = function() {
          reject(reader.error);
        };
      })
    }

    function readBlobAsArrayBuffer(blob) {
      var reader = new FileReader();
      var promise = fileReaderReady(reader);
      reader.readAsArrayBuffer(blob);
      return promise
    }

    function readBlobAsText(blob) {
      var reader = new FileReader();
      var promise = fileReaderReady(reader);
      reader.readAsText(blob);
      return promise
    }

    function readArrayBufferAsText(buf) {
      var view = new Uint8Array(buf);
      var chars = new Array(view.length);

      for (var i = 0; i < view.length; i++) {
        chars[i] = String.fromCharCode(view[i]);
      }
      return chars.join('')
    }

    function bufferClone(buf) {
      if (buf.slice) {
        return buf.slice(0)
      } else {
        var view = new Uint8Array(buf.byteLength);
        view.set(new Uint8Array(buf));
        return view.buffer
      }
    }

    function Body() {
      this.bodyUsed = false;

      this._initBody = function(body) {
        this._bodyInit = body;
        if (!body) {
          this._bodyText = '';
        } else if (typeof body === 'string') {
          this._bodyText = body;
        } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
          this._bodyBlob = body;
        } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
          this._bodyFormData = body;
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this._bodyText = body.toString();
        } else if (support.arrayBuffer && support.blob && isDataView(body)) {
          this._bodyArrayBuffer = bufferClone(body.buffer);
          // IE 10-11 can't handle a DataView body.
          this._bodyInit = new Blob([this._bodyArrayBuffer]);
        } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
          this._bodyArrayBuffer = bufferClone(body);
        } else {
          this._bodyText = body = Object.prototype.toString.call(body);
        }

        if (!this.headers.get('content-type')) {
          if (typeof body === 'string') {
            this.headers.set('content-type', 'text/plain;charset=UTF-8');
          } else if (this._bodyBlob && this._bodyBlob.type) {
            this.headers.set('content-type', this._bodyBlob.type);
          } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
            this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
          }
        }
      };

      if (support.blob) {
        this.blob = function() {
          var rejected = consumed(this);
          if (rejected) {
            return rejected
          }

          if (this._bodyBlob) {
            return Promise.resolve(this._bodyBlob)
          } else if (this._bodyArrayBuffer) {
            return Promise.resolve(new Blob([this._bodyArrayBuffer]))
          } else if (this._bodyFormData) {
            throw new Error('could not read FormData body as blob')
          } else {
            return Promise.resolve(new Blob([this._bodyText]))
          }
        };

        this.arrayBuffer = function() {
          if (this._bodyArrayBuffer) {
            return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
          } else {
            return this.blob().then(readBlobAsArrayBuffer)
          }
        };
      }

      this.text = function() {
        var rejected = consumed(this);
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return readBlobAsText(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as text')
        } else {
          return Promise.resolve(this._bodyText)
        }
      };

      if (support.formData) {
        this.formData = function() {
          return this.text().then(decode)
        };
      }

      this.json = function() {
        return this.text().then(JSON.parse)
      };

      return this
    }

    // HTTP methods whose capitalization should be normalized
    var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

    function normalizeMethod(method) {
      var upcased = method.toUpperCase();
      return methods.indexOf(upcased) > -1 ? upcased : method
    }

    function Request(input, options) {
      options = options || {};
      var body = options.body;

      if (input instanceof Request) {
        if (input.bodyUsed) {
          throw new TypeError('Already read')
        }
        this.url = input.url;
        this.credentials = input.credentials;
        if (!options.headers) {
          this.headers = new Headers(input.headers);
        }
        this.method = input.method;
        this.mode = input.mode;
        this.signal = input.signal;
        if (!body && input._bodyInit != null) {
          body = input._bodyInit;
          input.bodyUsed = true;
        }
      } else {
        this.url = String(input);
      }

      this.credentials = options.credentials || this.credentials || 'same-origin';
      if (options.headers || !this.headers) {
        this.headers = new Headers(options.headers);
      }
      this.method = normalizeMethod(options.method || this.method || 'GET');
      this.mode = options.mode || this.mode || null;
      this.signal = options.signal || this.signal;
      this.referrer = null;

      if ((this.method === 'GET' || this.method === 'HEAD') && body) {
        throw new TypeError('Body not allowed for GET or HEAD requests')
      }
      this._initBody(body);
    }

    Request.prototype.clone = function() {
      return new Request(this, {body: this._bodyInit})
    };

    function decode(body) {
      var form = new FormData();
      body
        .trim()
        .split('&')
        .forEach(function(bytes) {
          if (bytes) {
            var split = bytes.split('=');
            var name = split.shift().replace(/\+/g, ' ');
            var value = split.join('=').replace(/\+/g, ' ');
            form.append(decodeURIComponent(name), decodeURIComponent(value));
          }
        });
      return form
    }

    function parseHeaders(rawHeaders) {
      var headers = new Headers();
      // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
      // https://tools.ietf.org/html/rfc7230#section-3.2
      var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
      preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
        var parts = line.split(':');
        var key = parts.shift().trim();
        if (key) {
          var value = parts.join(':').trim();
          headers.append(key, value);
        }
      });
      return headers
    }

    Body.call(Request.prototype);

    function Response(bodyInit, options) {
      if (!options) {
        options = {};
      }

      this.type = 'default';
      this.status = options.status === undefined ? 200 : options.status;
      this.ok = this.status >= 200 && this.status < 300;
      this.statusText = 'statusText' in options ? options.statusText : 'OK';
      this.headers = new Headers(options.headers);
      this.url = options.url || '';
      this._initBody(bodyInit);
    }

    Body.call(Response.prototype);

    Response.prototype.clone = function() {
      return new Response(this._bodyInit, {
        status: this.status,
        statusText: this.statusText,
        headers: new Headers(this.headers),
        url: this.url
      })
    };

    Response.error = function() {
      var response = new Response(null, {status: 0, statusText: ''});
      response.type = 'error';
      return response
    };

    var redirectStatuses = [301, 302, 303, 307, 308];

    Response.redirect = function(url, status) {
      if (redirectStatuses.indexOf(status) === -1) {
        throw new RangeError('Invalid status code')
      }

      return new Response(null, {status: status, headers: {location: url}})
    };

    exports.DOMException = self.DOMException;
    try {
      new exports.DOMException();
    } catch (err) {
      exports.DOMException = function(message, name) {
        this.message = message;
        this.name = name;
        var error = Error(message);
        this.stack = error.stack;
      };
      exports.DOMException.prototype = Object.create(Error.prototype);
      exports.DOMException.prototype.constructor = exports.DOMException;
    }

    function fetch(input, init) {
      return new Promise(function(resolve, reject) {
        var request = new Request(input, init);

        if (request.signal && request.signal.aborted) {
          return reject(new exports.DOMException('Aborted', 'AbortError'))
        }

        var xhr = new XMLHttpRequest();

        function abortXhr() {
          xhr.abort();
        }

        xhr.onload = function() {
          var options = {
            status: xhr.status,
            statusText: xhr.statusText,
            headers: parseHeaders(xhr.getAllResponseHeaders() || '')
          };
          options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
          var body = 'response' in xhr ? xhr.response : xhr.responseText;
          resolve(new Response(body, options));
        };

        xhr.onerror = function() {
          reject(new TypeError('Network request failed'));
        };

        xhr.ontimeout = function() {
          reject(new TypeError('Network request failed'));
        };

        xhr.onabort = function() {
          reject(new exports.DOMException('Aborted', 'AbortError'));
        };

        xhr.open(request.method, request.url, true);

        if (request.credentials === 'include') {
          xhr.withCredentials = true;
        } else if (request.credentials === 'omit') {
          xhr.withCredentials = false;
        }

        if ('responseType' in xhr && support.blob) {
          xhr.responseType = 'blob';
        }

        request.headers.forEach(function(value, name) {
          xhr.setRequestHeader(name, value);
        });

        if (request.signal) {
          request.signal.addEventListener('abort', abortXhr);

          xhr.onreadystatechange = function() {
            // DONE (success or failure)
            if (xhr.readyState === 4) {
              request.signal.removeEventListener('abort', abortXhr);
            }
          };
        }

        xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
      })
    }

    fetch.polyfill = true;

    if (!self.fetch) {
      self.fetch = fetch;
      self.Headers = Headers;
      self.Request = Request;
      self.Response = Response;
    }

    exports.Headers = Headers;
    exports.Request = Request;
    exports.Response = Response;
    exports.fetch = fetch;

    Object.defineProperty(exports, '__esModule', { value: true });

  })));

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */

  var __assign = function() {
      __assign = Object.assign || function __assign(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
      };
      return __assign.apply(this, arguments);
  };

  var BASE_PATH = "http://127.0.0.1:80";
  var NakamaApi = function (configuration) {
      if (configuration === void 0) { configuration = {
          basePath: BASE_PATH,
          bearerToken: "",
          password: "",
          username: "",
          timeoutMs: 5000,
      }; }
      var napi = {
          doFetch: function (urlPath, method, queryParams, body, options) {
              var urlQuery = "?" + Object.keys(queryParams)
                  .map(function (k) {
                  if (queryParams[k] instanceof Array) {
                      return queryParams[k].reduce(function (prev, curr) {
                          return prev + encodeURIComponent(k) + "=" + encodeURIComponent(curr) + "&";
                      }, "");
                  }
                  else {
                      if (queryParams[k] != null) {
                          return encodeURIComponent(k) + "=" + encodeURIComponent(queryParams[k]) + "&";
                      }
                  }
              })
                  .join("");
              var fetchOptions = __assign({ method: method }, options);
              fetchOptions.headers = __assign({}, options.headers);
              if (configuration.bearerToken) {
                  fetchOptions.headers["Authorization"] = "Bearer " + configuration.bearerToken;
              }
              else if (configuration.username) {
                  fetchOptions.headers["Authorization"] = "Basic " + btoa(configuration.username + ":" + configuration.password);
              }
              if (!Object.keys(fetchOptions.headers).includes("Accept")) {
                  fetchOptions.headers["Accept"] = "application/json";
              }
              if (!Object.keys(fetchOptions.headers).includes("Content-Type")) {
                  fetchOptions.headers["Content-Type"] = "application/json";
              }
              Object.keys(fetchOptions.headers).forEach(function (key) {
                  if (!fetchOptions.headers[key]) {
                      delete fetchOptions.headers[key];
                  }
              });
              fetchOptions.body = body;
              return Promise.race([
                  fetch(configuration.basePath + urlPath + urlQuery, fetchOptions).then(function (response) {
                      if (response.status == 204) {
                          return response;
                      }
                      else if (response.status >= 200 && response.status < 300) {
                          return response.json();
                      }
                      else {
                          throw response;
                      }
                  }),
                  new Promise(function (_, reject) {
                      return setTimeout(reject, configuration.timeoutMs, "Request timed out.");
                  }),
              ]);
          },
          authenticateCustom: function (body, create, username, options) {
              if (options === void 0) { options = {}; }
              if (body === null || body === undefined) {
                  throw new Error("'body' is a required parameter but is null or undefined.");
              }
              var urlPath = "/v2/account/authenticate/custom";
              var queryParams = {
                  create: create,
                  username: username,
              };
              var _body = null;
              _body = JSON.stringify(body || {});
              return napi.doFetch(urlPath, "POST", queryParams, _body, options);
          },
          listMatches: function (limit, authoritative, label, minSize, maxSize, query, options) {
              if (options === void 0) { options = {}; }
              var urlPath = "/v2/match";
              var queryParams = {
                  limit: limit,
                  authoritative: authoritative,
                  label: label,
                  min_size: minSize,
                  max_size: maxSize,
                  query: query,
              };
              var _body = null;
              return napi.doFetch(urlPath, "GET", queryParams, _body, options);
          },
          rpcFunc2: function (id, payload, httpKey, options) {
              if (options === void 0) { options = {}; }
              if (id === null || id === undefined) {
                  throw new Error("'id' is a required parameter but is null or undefined.");
              }
              var urlPath = "/v2/rpc/{id}"
                  .replace("{id}", encodeURIComponent(String(id)));
              var queryParams = {
                  payload: payload,
                  http_key: httpKey,
              };
              var _body = null;
              return napi.doFetch(urlPath, "GET", queryParams, _body, options);
          },
          rpcFunc: function (id, body, options) {
              if (options === void 0) { options = {}; }
              if (id === null || id === undefined) {
                  throw new Error("'id' is a required parameter but is null or undefined.");
              }
              if (body === null || body === undefined) {
                  throw new Error("'body' is a required parameter but is null or undefined.");
              }
              var urlPath = "/v2/rpc/{id}"
                  .replace("{id}", encodeURIComponent(String(id)));
              var queryParams = {};
              var _body = null;
              _body = JSON.stringify(body || {});
              return napi.doFetch(urlPath, "POST", queryParams, _body, options);
          },
          readStorageObjects: function (body, options) {
              if (options === void 0) { options = {}; }
              if (body === null || body === undefined) {
                  throw new Error("'body' is a required parameter but is null or undefined.");
              }
              var urlPath = "/v2/storage";
              var queryParams = {};
              var _body = null;
              _body = JSON.stringify(body || {});
              return napi.doFetch(urlPath, "POST", queryParams, _body, options);
          },
          writeStorageObjects: function (body, options) {
              if (options === void 0) { options = {}; }
              if (body === null || body === undefined) {
                  throw new Error("'body' is a required parameter but is null or undefined.");
              }
              var urlPath = "/v2/storage";
              var queryParams = {};
              var _body = null;
              _body = JSON.stringify(body || {});
              return napi.doFetch(urlPath, "PUT", queryParams, _body, options);
          },
          deleteStorageObjects: function (body, options) {
              if (options === void 0) { options = {}; }
              if (body === null || body === undefined) {
                  throw new Error("'body' is a required parameter but is null or undefined.");
              }
              var urlPath = "/v2/storage/delete";
              var queryParams = {};
              var _body = null;
              _body = JSON.stringify(body || {});
              return napi.doFetch(urlPath, "PUT", queryParams, _body, options);
          },
          listStorageObjects: function (collection, userId, limit, cursor, options) {
              if (options === void 0) { options = {}; }
              if (collection === null || collection === undefined) {
                  throw new Error("'collection' is a required parameter but is null or undefined.");
              }
              var urlPath = "/v2/storage/{collection}"
                  .replace("{collection}", encodeURIComponent(String(collection)));
              var queryParams = {
                  user_id: userId,
                  limit: limit,
                  cursor: cursor,
              };
              var _body = null;
              return napi.doFetch(urlPath, "GET", queryParams, _body, options);
          },
      };
      return napi;
  };

  var Session = (function () {
      function Session(token, created_at, expires_at, username, user_id) {
          this.token = token;
          this.created_at = created_at;
          this.expires_at = expires_at;
          this.username = username;
          this.user_id = user_id;
      }
      Session.prototype.isexpired = function (currenttime) {
          return (this.expires_at - currenttime) < 0;
      };
      Session.restore = function (jwt) {
          var createdAt = Math.floor(new Date().getTime() / 1000);
          var parts = jwt.split('.');
          if (parts.length != 3) {
              throw 'jwt is not valid.';
          }
          var decoded = JSON.parse(atob(parts[1]));
          var expiresAt = Math.floor(parseInt(decoded['exp']));
          return new Session(jwt, createdAt, expiresAt, decoded['usn'], decoded['uid']);
      };
      return Session;
  }());

  var DefaultSocket = (function () {
      function DefaultSocket(host, port, useSSL, verbose, sessionRefresher) {
          if (useSSL === void 0) { useSSL = false; }
          if (verbose === void 0) { verbose = false; }
          if (sessionRefresher === void 0) { sessionRefresher = function (s) { return Promise.resolve(s); }; }
          this.host = host;
          this.port = port;
          this.useSSL = useSSL;
          this.verbose = verbose;
          this.sessionRefresher = sessionRefresher;
          this.cIds = {};
          this.nextCid = 1;
      }
      DefaultSocket.prototype.generatecid = function () {
          var cid = this.nextCid.toString();
          ++this.nextCid;
          return cid;
      };
      DefaultSocket.prototype.connect = function (session, createStatus) {
          var _this = this;
          if (createStatus === void 0) { createStatus = false; }
          if (this.socket != undefined) {
              return Promise.resolve(session);
          }
          return this.sessionRefresher(session).then(function (newSession) {
              var scheme = (_this.useSSL) ? "wss://" : "ws://";
              var url = "" + scheme + _this.host + ":" + _this.port + "/ws?lang=en&status=" + encodeURIComponent(createStatus.toString()) + "&token=" + encodeURIComponent(newSession.token);
              var socket = new WebSocket(url);
              _this.socket = socket;
              socket.onclose = function (evt) {
                  _this.ondisconnect(evt);
                  _this.socket = undefined;
              };
              socket.onerror = function (evt) {
                  _this.onerror(evt);
              };
              socket.onmessage = function (evt) {
                  var message = JSON.parse(evt.data);
                  if (_this.verbose && window && window.console) {
                      console.log("Response: %o", message);
                  }
                  if (message.cid == undefined) {
                      if (message.match_data) {
                          message.match_data.data = message.match_data.data != null ? JSON.parse(atob(message.match_data.data)) : null;
                          message.match_data.op_code = parseInt(message.match_data.op_code);
                          _this.onmatchdata(message.match_data);
                      }
                      else if (message.match_presence_event) {
                          _this.onmatchpresence(message.match_presence_event);
                      }
                      else if (message.matchmaker_matched) {
                          _this.onmatchmakermatched(message.matchmaker_matched);
                      }
                      else if (message.stream_presence_event) {
                          _this.onstreampresence(message.stream_presence_event);
                      }
                      else if (message.stream_data) {
                          _this.onstreamdata(message.stream_data);
                      }
                      else {
                          if (_this.verbose && window && window.console) {
                              console.log("Unrecognized message received: %o", message);
                          }
                      }
                  }
                  else {
                      var executor = _this.cIds[message.cid];
                      if (!executor) {
                          if (_this.verbose && window && window.console) {
                              console.error("No promise executor for message: %o", message);
                          }
                          return;
                      }
                      delete _this.cIds[message.cid];
                      if (message.error) {
                          executor.reject(message.error);
                      }
                      else {
                          executor.resolve(message);
                      }
                  }
              };
              return new Promise(function (resolve, reject) {
                  socket.onopen = function (evt) {
                      if (_this.verbose && window && window.console) {
                          console.log(evt);
                      }
                      resolve(newSession);
                  };
                  socket.onerror = function (evt) {
                      reject(evt);
                      socket.close();
                      _this.socket = undefined;
                  };
              });
          });
      };
      DefaultSocket.prototype.disconnect = function (fireDisconnectEvent) {
          if (fireDisconnectEvent === void 0) { fireDisconnectEvent = true; }
          if (this.socket !== undefined) {
              this.socket.close();
          }
          if (fireDisconnectEvent) {
              this.ondisconnect({});
          }
      };
      DefaultSocket.prototype.ondisconnect = function (evt) {
          if (this.verbose && window && window.console) {
              console.log(evt);
          }
      };
      DefaultSocket.prototype.onerror = function (evt) {
          if (this.verbose && window && window.console) {
              console.log(evt);
          }
      };
      DefaultSocket.prototype.onmatchdata = function (matchData) {
          if (this.verbose && window && window.console) {
              console.log(matchData);
          }
      };
      DefaultSocket.prototype.onmatchpresence = function (matchPresence) {
          if (this.verbose && window && window.console) {
              console.log(matchPresence);
          }
      };
      DefaultSocket.prototype.onmatchmakermatched = function (matchmakerMatched) {
          if (this.verbose && window && window.console) {
              console.log(matchmakerMatched);
          }
      };
      DefaultSocket.prototype.onstreampresence = function (streamPresence) {
          if (this.verbose && window && window.console) {
              console.log(streamPresence);
          }
      };
      DefaultSocket.prototype.onstreamdata = function (streamData) {
          if (this.verbose && window && window.console) {
              console.log(streamData);
          }
      };
      DefaultSocket.prototype.send = function (message) {
          var _this = this;
          var m = message;
          return new Promise(function (resolve, reject) {
              if (_this.socket === undefined) {
                  reject("Socket connection has not been established yet.");
              }
              else {
                  if (m.match_data_send) {
                      m.match_data_send.data = btoa(JSON.stringify(m.match_data_send.data));
                      m.match_data_send.op_code = m.match_data_send.op_code.toString();
                      _this.socket.send(JSON.stringify(m));
                      resolve();
                  }
                  else {
                      if (m.channel_message_send) {
                          m.channel_message_send.content = JSON.stringify(m.channel_message_send.content);
                      }
                      else if (m.channel_message_update) {
                          m.channel_message_update.content = JSON.stringify(m.channel_message_update.content);
                      }
                      var cid = _this.generatecid();
                      _this.cIds[cid] = { resolve: resolve, reject: reject };
                      m.cid = cid;
                      _this.socket.send(JSON.stringify(m));
                  }
              }
              if (_this.verbose && window && window.console) {
                  console.log("Sent message: %o", m);
              }
          });
      };
      return DefaultSocket;
  }());

  var DEFAULT_HOST = "127.0.0.1";
  var DEFAULT_SERVER_KEY = "defaultkey";
  var DEFAULT_PORT = "7350";
  var DEFAULT_TIMEOUT_MS = 7000;
  var TEST_TOKEN_URL = "https://auth-integ-service-dot-cognac-prod.appspot.com/get_test_auth_token?";
  var createFromCanvasToken = function (canvasToken) {
      var parts = canvasToken.split('.');
      if (parts.length != 3) {
          throw 'jwt is not valid.';
      }
      var decoded = JSON.parse(atob(parts[1]));
      return new Session(canvasToken, Math.floor(parseInt(decoded['iat'])), Math.floor(parseInt(decoded['exp'])), decoded['sub'], decoded['sub']);
  };
  var AuthMode;
  (function (AuthMode) {
      AuthMode[AuthMode["Snap"] = 0] = "Snap";
      AuthMode[AuthMode["Custom"] = 1] = "Custom";
  })(AuthMode || (AuthMode = {}));
  var Client = (function () {
      function Client(serverkey, host, port, useSSL, timeout) {
          var _this = this;
          if (serverkey === void 0) { serverkey = DEFAULT_SERVER_KEY; }
          if (host === void 0) { host = DEFAULT_HOST; }
          if (port === void 0) { port = DEFAULT_PORT; }
          if (useSSL === void 0) { useSSL = false; }
          if (timeout === void 0) { timeout = DEFAULT_TIMEOUT_MS; }
          this.serverkey = serverkey;
          this.host = host;
          this.port = port;
          this.useSSL = useSSL;
          this.timeout = timeout;
          this.authMode = AuthMode.Custom;
          this.refreshSession = function (session) {
              if (_this.authMode == AuthMode.Snap) {
                  return _this.refreshSnapCanvasToken(session).then(function (newSession) {
                      session.expires_at = newSession.expires_at;
                      session.created_at = newSession.created_at;
                      session.token = newSession.token;
                      return newSession;
                  });
              }
              return Promise.resolve(session);
          };
          this.refreshSnapCanvasToken = function (oldSession) {
              if (oldSession && ((oldSession.expires_at - 10) > Math.floor(Date.now() / 1000))) {
                  return Promise.resolve(oldSession);
              }
              else if (_this.sc && _this.sc.app) {
                  return new Promise(function (resolve, reject) {
                      var sdk = _this.sc;
                      sdk.fetchAuthToken(function (response) {
                            if (response && response.error) {
                                reject(response.error);
                                return;
                            }
                          resolve(createFromCanvasToken(response.token));
                      }, _this);
                  });
              }
              else {
                  return fetch(TEST_TOKEN_URL + ("application_id=" + _this.appId + "&user_id=" + _this.userId + "&session_id=" + _this.sessionId))
                      .then(function (res) { return res.text(); }).then(function (body) { return createFromCanvasToken(body); });
              }
          };
          this.authenticateSnap = function (sc, appId, userId, sessionId) {
              _this.authMode = AuthMode.Snap;
              _this.sc = sc;
              _this.appId = (appId ? appId : _this.appId);
              _this.userId = (userId ? userId : _this.userId);
              _this.sessionId = (sessionId ? sessionId : _this.sessionId);
              return _this.refreshSnapCanvasToken();
          };
          this.createSocket = function (useSSL, verbose) {
              if (useSSL === void 0) { useSSL = false; }
              if (verbose === void 0) { verbose = false; }
              return new DefaultSocket(_this.host, _this.port, useSSL, verbose, _this.refreshSession);
          };
          this.deleteStorageObjects = function (session, request) {
              return _this.refreshSession(session).then(function (newSession) {
                  _this.configuration.bearerToken = (newSession && newSession.token);
                  return _this.apiClient.deleteStorageObjects(request).then(function (response) {
                      return Promise.resolve(response != undefined);
                  });
              });
          };
          this.listMatches = function (session, limit, authoritative, label, minSize, maxSize, query) {
              return _this.refreshSession(session).then(function (newSession) {
                  _this.configuration.bearerToken = (newSession && newSession.token);
                  return _this.apiClient.listMatches(limit, authoritative, label, minSize, maxSize, query);
              });
          };
          this.listStorageObjects = function (session, collection, userId, limit, cursor) {
              return _this.refreshSession(session).then(function (newSession) {
                  _this.configuration.bearerToken = (newSession && newSession.token);
                  return _this.apiClient.listStorageObjects(collection, userId, limit, cursor).then(function (response) {
                      var result = {
                          objects: [],
                          cursor: response.cursor
                      };
                      if (response.objects == null) {
                          return Promise.resolve(result);
                      }
                      response.objects.forEach(function (o) {
                          result.objects.push({
                              collection: o.collection,
                              key: o.key,
                              permission_read: o.permission_read ? Number(o.permission_read) : 0,
                              permission_write: o.permission_write ? Number(o.permission_write) : 0,
                              value: o.value ? JSON.parse(o.value) : undefined,
                              version: o.version,
                              user_id: o.user_id,
                              create_time: o.create_time,
                              update_time: o.update_time
                          });
                      });
                      return Promise.resolve(result);
                  });
              });
          };
          this.readStorageObjects = function (session, request) {
              return _this.refreshSession(session).then(function (newSession) {
                  _this.configuration.bearerToken = (newSession && newSession.token);
                  return _this.apiClient.readStorageObjects(request).then(function (response) {
                      var result = { objects: [] };
                      if (response.objects == null) {
                          return Promise.resolve(result);
                      }
                      response.objects.forEach(function (o) {
                          result.objects.push({
                              collection: o.collection,
                              key: o.key,
                              permission_read: o.permission_read ? Number(o.permission_read) : 0,
                              permission_write: o.permission_write ? Number(o.permission_write) : 0,
                              value: o.value ? JSON.parse(o.value) : undefined,
                              version: o.version,
                              user_id: o.user_id,
                              create_time: o.create_time,
                              update_time: o.update_time
                          });
                      });
                      return Promise.resolve(result);
                  });
              });
          };
          this.rpc = function (session, id, input) {
              return _this.refreshSession(session).then(function (newSession) {
                  _this.configuration.bearerToken = (newSession && newSession.token);
                  return _this.apiClient.rpcFunc(id, JSON.stringify(input)).then(function (response) {
                      return Promise.resolve({
                          id: response.id,
                          payload: (!response.payload) ? undefined : JSON.parse(response.payload)
                      });
                  });
              });
          };
          this.rpcGet = function (id, session, httpKey, input) {
              return _this.refreshSession(session).then(function (newSession) {
                  if (!httpKey || httpKey == "") {
                      _this.configuration.bearerToken = (newSession && newSession.token);
                  }
                  else {
                      _this.configuration.username = undefined;
                      _this.configuration.bearerToken = undefined;
                  }
                  return _this.apiClient.rpcFunc2(id, input && JSON.stringify(input) || "", httpKey)
                      .then(function (response) {
                      _this.configuration.username = _this.serverkey;
                      return Promise.resolve({
                          id: response.id,
                          payload: (!response.payload) ? undefined : JSON.parse(response.payload)
                      });
                  }).catch(function (err) {
                      _this.configuration.username = _this.serverkey;
                      throw err;
                  });
              });
          };
          this.writeStorageObjects = function (session, objects) {
              return _this.refreshSession(session).then(function (newSession) {
                  _this.configuration.bearerToken = (newSession && newSession.token);
                  var request = { objects: [] };
                  objects.forEach(function (o) {
                      request.objects.push({
                          collection: o.collection,
                          key: o.key,
                          permission_read: o.permission_read,
                          permission_write: o.permission_write,
                          value: JSON.stringify(o.value),
                          version: o.version
                      });
                  });
                  return _this.apiClient.writeStorageObjects(request);
              });
          };
          var scheme = (useSSL) ? "https://" : "http://";
          var basePath = "" + scheme + host + ":" + port;
          this.configuration = this.configuration = {
              basePath: basePath,
              username: serverkey,
              password: "",
              timeoutMs: timeout,
          };
          this.apiClient = NakamaApi(this.configuration);
      }
      Client.prototype.authenticateCustom = function (request) {
          var _this = this;
          var urlPath = "/v2/account/authenticate/custom";
          var queryParams = {
              username: request.username,
              create: request.create
          };
          var urlQuery = "?" + Object.keys(queryParams)
              .map(function (k) {
              if (queryParams[k] instanceof Array) {
                  return queryParams[k].reduce(function (prev, curr) {
                      return prev + encodeURIComponent(k) + "=" + encodeURIComponent(curr) + "&";
                  }, "");
              }
              else {
                  if (queryParams[k] != null) {
                      return encodeURIComponent(k) + "=" + encodeURIComponent(queryParams[k]) + "&";
                  }
              }
          })
              .join("");
          var fetchOptions = __assign({ method: "POST" });
          var headers = {
              "Accept": "application/json",
              "Content-Type": "application/json",
          };
          if (this.configuration.username) {
              headers["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
          }
          fetchOptions.headers = __assign({}, headers);
          fetchOptions.body = JSON.stringify({
              id: request.id
          });
          return Promise.race([
              fetch(this.configuration.basePath + urlPath + urlQuery, fetchOptions).then(function (response) {
                  if (response.status >= 200 && response.status < 300) {
                      return response.json();
                  }
                  else {
                      throw response;
                  }
              }),
              new Promise(function (_, reject) {
                  return setTimeout(reject, _this.configuration.timeoutMs, "Request timed out.");
              }),
          ]).then(function (apiSession) {
              return Session.restore(apiSession.token || "");
          });
      };
      return Client;
  }());

  exports.Client = Client;
  exports.Session = Session;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
