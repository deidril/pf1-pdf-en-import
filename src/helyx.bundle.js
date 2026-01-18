var global$1 = (typeof global !== "undefined" ? global :
            typeof self !== "undefined" ? self :
            typeof window !== "undefined" ? window : {});

// shim for using process in browser
// based off https://github.com/defunctzombie/node-process/blob/master/browser.js

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
if (typeof global$1.setTimeout === 'function') {
    cachedSetTimeout = setTimeout;
}
if (typeof global$1.clearTimeout === 'function') {
    cachedClearTimeout = clearTimeout;
}

function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
function nextTick(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new PDFItem(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
}
// v8 likes predictible objects
function PDFItem(fun, array) {
    this.fun = fun;
    this.array = array;
}
PDFItem.prototype.run = function () {
    this.fun.apply(null, this.array);
};
var title = 'browser';
var platform = 'browser';
var browser = true;
var env = {};
var argv = [];
var version = ''; // empty string to avoid regexp issues
var versions = {};
var release = {};
var config = {};

function noop() {}

var on = noop;
var addListener = noop;
var once = noop;
var off = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = noop;

function binding(name) {
    throw new Error('process.binding is not supported');
}

function cwd () { return '/' }
function chdir (dir) {
    throw new Error('process.chdir is not supported');
}function umask() { return 0; }

// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
var performance = global$1.performance || {};
var performanceNow =
  performance.now        ||
  performance.mozNow     ||
  performance.msNow      ||
  performance.oNow       ||
  performance.webkitNow  ||
  function(){ return (new Date()).getTime() };

// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
function hrtime(previousTimestamp){
  var clocktime = performanceNow.call(performance)*1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor((clocktime%1)*1e9);
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds<0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [seconds,nanoseconds]
}

var startTime = new Date();
function uptime() {
  var currentTime = new Date();
  var dif = currentTime - startTime;
  return dif / 1000;
}

var process = {
  nextTick: nextTick,
  title: title,
  browser: browser,
  env: env,
  argv: argv,
  version: version,
  versions: versions,
  on: on,
  addListener: addListener,
  once: once,
  off: off,
  removeListener: removeListener,
  removeAllListeners: removeAllListeners,
  emit: emit,
  binding: binding,
  cwd: cwd,
  chdir: chdir,
  umask: umask,
  hrtime: hrtime,
  platform: platform,
  release: release,
  config: config,
  uptime: uptime
};

var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
var inited = false;
function init () {
  inited = true;
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
  }

  revLookup['-'.charCodeAt(0)] = 62;
  revLookup['_'.charCodeAt(0)] = 63;
}

function toByteArray (b64) {
  if (!inited) {
    init();
  }
  var i, j, l, tmp, placeHolders, arr;
  var len = b64.length;

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;

  // base64 is 4/3 + up to two characters of the original data
  arr = new Arr(len * 3 / 4 - placeHolders);

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len;

  var L = 0;

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)];
    arr[L++] = (tmp >> 16) & 0xFF;
    arr[L++] = (tmp >> 8) & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4);
    arr[L++] = tmp & 0xFF;
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2);
    arr[L++] = (tmp >> 8) & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
    output.push(tripletToBase64(tmp));
  }
  return output.join('')
}

function fromByteArray (uint8) {
  if (!inited) {
    init();
  }
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
  var output = '';
  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    output += lookup[tmp >> 2];
    output += lookup[(tmp << 4) & 0x3F];
    output += '==';
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1]);
    output += lookup[tmp >> 10];
    output += lookup[(tmp >> 4) & 0x3F];
    output += lookup[(tmp << 2) & 0x3F];
    output += '=';
  }

  parts.push(output);

  return parts.join('')
}

function read (buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? (nBytes - 1) : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

function write (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
  var i = isLE ? 0 : (nBytes - 1);
  var d = isLE ? 1 : -1;
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128;
}

var toString = {}.toString;

var isArray = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

var INSPECT_MAX_BYTES = 50;

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global$1.TYPED_ARRAY_SUPPORT !== undefined
  ? global$1.TYPED_ARRAY_SUPPORT
  : true;

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length);
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length);
    }
    that.length = length;
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192; // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype;
  return arr
};

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
};

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype;
  Buffer.__proto__ = Uint8Array;
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size);
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
};

function allocUnsafe (that, size) {
  assertSize(size);
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0;
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
};

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8';
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0;
  that = createBuffer(that, length);

  var actual = that.write(string, encoding);

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual);
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  that = createBuffer(that, length);
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255;
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array);
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset);
  } else {
    array = new Uint8Array(array, byteOffset, length);
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array;
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array);
  }
  return that
}

function fromObject (that, obj) {
  if (internalIsBuffer(obj)) {
    var len = checked(obj.length) | 0;
    that = createBuffer(that, len);

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len);
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}
Buffer.isBuffer = isBuffer;
function internalIsBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
};

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i;
  if (length === undefined) {
    length = 0;
    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }

  var buffer = Buffer.allocUnsafe(length);
  var pos = 0;
  for (i = 0; i < list.length; ++i) {
    var buf = list[i];
    if (!internalIsBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer
};

function byteLength (string, encoding) {
  if (internalIsBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string;
  }

  var len = string.length;
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}
Buffer.byteLength = byteLength;

function slowToString (encoding, start, end) {
  var loweredCase = false;

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0;
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length;
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0;
  start >>>= 0;

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8';

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase();
        loweredCase = true;
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true;

function swap (b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length;
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1);
  }
  return this
};

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length;
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3);
    swap(this, i + 1, i + 2);
  }
  return this
};

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length;
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7);
    swap(this, i + 1, i + 6);
    swap(this, i + 2, i + 5);
    swap(this, i + 3, i + 4);
  }
  return this
};

Buffer.prototype.toString = function toString () {
  var length = this.length | 0;
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
};

Buffer.prototype.equals = function equals (b) {
  if (!internalIsBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
};

Buffer.prototype.inspect = function inspect () {
  var str = '';
  var max = INSPECT_MAX_BYTES;
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
    if (this.length > max) str += ' ... ';
  }
  return '<Buffer ' + str + '>'
};

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!internalIsBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0;
  }
  if (end === undefined) {
    end = target ? target.length : 0;
  }
  if (thisStart === undefined) {
    thisStart = 0;
  }
  if (thisEnd === undefined) {
    thisEnd = this.length;
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;

  if (this === target) return 0

  var x = thisEnd - thisStart;
  var y = end - start;
  var len = Math.min(x, y);

  var thisCopy = this.slice(thisStart, thisEnd);
  var targetCopy = target.slice(start, end);

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
};

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff;
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000;
  }
  byteOffset = +byteOffset;  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1);
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0;
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding);
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (internalIsBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF; // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase();
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i;
  if (dir) {
    var foundIndex = -1;
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i;
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
    for (i = byteOffset; i >= 0; i--) {
      var found = true;
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false;
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
};

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
};

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
};

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed;
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8';
    length = this.length;
    offset = 0;
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset;
    length = this.length;
    offset = 0;
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0;
    if (isFinite(length)) {
      length = length | 0;
      if (encoding === undefined) encoding = 'utf8';
    } else {
      encoding = length;
      length = undefined;
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset;
  if (length === undefined || length > remaining) length = remaining;

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8';

  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
};

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return fromByteArray(buf)
  } else {
    return fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];

  var i = start;
  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1;

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint;

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte;
          }
          break
        case 2:
          secondByte = buf[i + 1];
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint;
            }
          }
          break
        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint;
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD;
      bytesPerSequence = 1;
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000;
      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
      codePoint = 0xDC00 | codePoint & 0x3FF;
    }

    res.push(codePoint);
    i += bytesPerSequence;
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000;

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = '';
  var i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    );
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F);
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i]);
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = '';
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length;
  start = ~~start;
  end = end === undefined ? len : ~~end;

  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else if (start > len) {
    start = len;
  }

  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else if (end > len) {
    end = len;
  }

  if (end < start) end = start;

  var newBuf;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end);
    newBuf.__proto__ = Buffer.prototype;
  } else {
    var sliceLen = end - start;
    newBuf = new Buffer(sliceLen, undefined);
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start];
    }
  }

  return newBuf
};

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  return val
};

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length);
  }

  var val = this[offset + --byteLength];
  var mul = 1;
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul;
  }

  return val
};

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  return this[offset]
};

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] | (this[offset + 1] << 8)
};

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return (this[offset] << 8) | this[offset + 1]
};

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
};

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
};

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var i = byteLength;
  var mul = 1;
  var val = this[offset + --i];
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val
};

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
};

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset] | (this[offset + 1] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset + 1] | (this[offset] << 8);
  return (val & 0x8000) ? val | 0xFFFF0000 : val
};

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
};

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
};

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, true, 23, 4)
};

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return read(this, offset, false, 23, 4)
};

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, true, 52, 8)
};

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return read(this, offset, false, 52, 8)
};

function checkInt (buf, value, offset, ext, max, min) {
  if (!internalIsBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var mul = 1;
  var i = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var i = byteLength - 1;
  var mul = 1;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  this[offset] = (value & 0xff);
  return offset + 1
};

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8;
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2
};

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2
};

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24);
    this[offset + 2] = (value >>> 16);
    this[offset + 1] = (value >>> 8);
    this[offset] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4
};

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4
};

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = 0;
  var mul = 1;
  var sub = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = byteLength - 1;
  var mul = 1;
  var sub = 0;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
  }

  return offset + byteLength
};

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  if (value < 0) value = 0xff + value + 1;
  this[offset] = (value & 0xff);
  return offset + 1
};

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2
};

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8);
    this[offset + 1] = (value & 0xff);
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2
};

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff);
    this[offset + 1] = (value >>> 8);
    this[offset + 2] = (value >>> 16);
    this[offset + 3] = (value >>> 24);
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4
};

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (value < 0) value = 0xffffffff + value + 1;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24);
    this[offset + 1] = (value >>> 16);
    this[offset + 2] = (value >>> 8);
    this[offset + 3] = (value & 0xff);
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4
};

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4);
  }
  write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
};

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
};

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8);
  }
  write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
};

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
};

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start;

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length;
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }

  var len = end - start;
  var i;

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start];
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    );
  }

  return len
};

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === 'string') {
      encoding = end;
      end = this.length;
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0);
      if (code < 256) {
        val = code;
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255;
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0;
  end = end === undefined ? this.length : end >>> 0;

  if (!val) val = 0;

  var i;
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    var bytes = internalIsBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString());
    var len = bytes.length;
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }

  return this
};

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '=';
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i);

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue
        }

        // valid lead
        leadSurrogate = codePoint;

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        leadSurrogate = codePoint;
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
    }

    leadSurrogate = null;

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      );
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo;
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }

  return byteArray
}


function base64ToBytes (str) {
  return toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i];
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}


// the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
function isBuffer(obj) {
  return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj))
}

function isFastBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isFastBuffer(obj.slice(0, 0))
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
}

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var require$$4 = {};

var pdf = createCommonjsModule(function (module, exports) {
/**
 * @licstart The following is the entire license notice for the
 * Javascript code in this page
 *
 * Copyright 2020 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @licend The above is the entire license notice for the
 * Javascript code in this page
 */

(function webpackUniversalModuleDefinition(root, factory) {
	module.exports = factory();
})(commonjsGlobal, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __w_pdfjs_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __w_pdfjs_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__w_pdfjs_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__w_pdfjs_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__w_pdfjs_require__.d = function(exports, name, getter) {
/******/ 		if(!__w_pdfjs_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__w_pdfjs_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__w_pdfjs_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __w_pdfjs_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__w_pdfjs_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __w_pdfjs_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__w_pdfjs_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__w_pdfjs_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__w_pdfjs_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__w_pdfjs_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __w_pdfjs_require__(__w_pdfjs_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __w_pdfjs_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "addLinkAttributes", {
  enumerable: true,
  get: function () {
    return _display_utils.addLinkAttributes;
  }
});
Object.defineProperty(exports, "getFilenameFromUrl", {
  enumerable: true,
  get: function () {
    return _display_utils.getFilenameFromUrl;
  }
});
Object.defineProperty(exports, "LinkTarget", {
  enumerable: true,
  get: function () {
    return _display_utils.LinkTarget;
  }
});
Object.defineProperty(exports, "loadScript", {
  enumerable: true,
  get: function () {
    return _display_utils.loadScript;
  }
});
Object.defineProperty(exports, "PDFDateString", {
  enumerable: true,
  get: function () {
    return _display_utils.PDFDateString;
  }
});
Object.defineProperty(exports, "RenderingCancelledException", {
  enumerable: true,
  get: function () {
    return _display_utils.RenderingCancelledException;
  }
});
Object.defineProperty(exports, "build", {
  enumerable: true,
  get: function () {
    return _api.build;
  }
});
Object.defineProperty(exports, "getDocument", {
  enumerable: true,
  get: function () {
    return _api.getDocument;
  }
});
Object.defineProperty(exports, "LoopbackPort", {
  enumerable: true,
  get: function () {
    return _api.LoopbackPort;
  }
});
Object.defineProperty(exports, "PDFDataRangeTransport", {
  enumerable: true,
  get: function () {
    return _api.PDFDataRangeTransport;
  }
});
Object.defineProperty(exports, "PDFWorker", {
  enumerable: true,
  get: function () {
    return _api.PDFWorker;
  }
});
Object.defineProperty(exports, "version", {
  enumerable: true,
  get: function () {
    return _api.version;
  }
});
Object.defineProperty(exports, "CMapCompressionType", {
  enumerable: true,
  get: function () {
    return _util.CMapCompressionType;
  }
});
Object.defineProperty(exports, "createObjectURL", {
  enumerable: true,
  get: function () {
    return _util.createObjectURL;
  }
});
Object.defineProperty(exports, "createPromiseCapability", {
  enumerable: true,
  get: function () {
    return _util.createPromiseCapability;
  }
});
Object.defineProperty(exports, "createValidAbsoluteUrl", {
  enumerable: true,
  get: function () {
    return _util.createValidAbsoluteUrl;
  }
});
Object.defineProperty(exports, "InvalidPDFException", {
  enumerable: true,
  get: function () {
    return _util.InvalidPDFException;
  }
});
Object.defineProperty(exports, "MissingPDFException", {
  enumerable: true,
  get: function () {
    return _util.MissingPDFException;
  }
});
Object.defineProperty(exports, "OPS", {
  enumerable: true,
  get: function () {
    return _util.OPS;
  }
});
Object.defineProperty(exports, "PasswordResponses", {
  enumerable: true,
  get: function () {
    return _util.PasswordResponses;
  }
});
Object.defineProperty(exports, "PermissionFlag", {
  enumerable: true,
  get: function () {
    return _util.PermissionFlag;
  }
});
Object.defineProperty(exports, "removeNullCharacters", {
  enumerable: true,
  get: function () {
    return _util.removeNullCharacters;
  }
});
Object.defineProperty(exports, "shadow", {
  enumerable: true,
  get: function () {
    return _util.shadow;
  }
});
Object.defineProperty(exports, "UnexpectedResponseException", {
  enumerable: true,
  get: function () {
    return _util.UnexpectedResponseException;
  }
});
Object.defineProperty(exports, "UNSUPPORTED_FEATURES", {
  enumerable: true,
  get: function () {
    return _util.UNSUPPORTED_FEATURES;
  }
});
Object.defineProperty(exports, "Util", {
  enumerable: true,
  get: function () {
    return _util.Util;
  }
});
Object.defineProperty(exports, "VerbosityLevel", {
  enumerable: true,
  get: function () {
    return _util.VerbosityLevel;
  }
});
Object.defineProperty(exports, "AnnotationLayer", {
  enumerable: true,
  get: function () {
    return _annotation_layer.AnnotationLayer;
  }
});
Object.defineProperty(exports, "apiCompatibilityParams", {
  enumerable: true,
  get: function () {
    return _api_compatibility.apiCompatibilityParams;
  }
});
Object.defineProperty(exports, "GlobalWorkerOptions", {
  enumerable: true,
  get: function () {
    return _worker_options.GlobalWorkerOptions;
  }
});
Object.defineProperty(exports, "renderTextLayer", {
  enumerable: true,
  get: function () {
    return _text_layer.renderTextLayer;
  }
});
Object.defineProperty(exports, "SVGGraphics", {
  enumerable: true,
  get: function () {
    return _svg.SVGGraphics;
  }
});

var _display_utils = __w_pdfjs_require__(1);

var _api = __w_pdfjs_require__(5);

var _util = __w_pdfjs_require__(2);

var _annotation_layer = __w_pdfjs_require__(16);

var _api_compatibility = __w_pdfjs_require__(7);

var _worker_options = __w_pdfjs_require__(10);

var _text_layer = __w_pdfjs_require__(17);

var _svg = __w_pdfjs_require__(18);
{
  const {
    isNodeJS
  } = __w_pdfjs_require__(4);

  if (isNodeJS) {
    const PDFNodeStream = __w_pdfjs_require__(19).PDFNodeStream;

    (0, _api.setPDFNetworkStreamFactory)(params => {
      return new PDFNodeStream(params);
    });
  } else {
    const PDFNetworkStream = __w_pdfjs_require__(22).PDFNetworkStream;

    let PDFFetchStream;

    if ((0, _display_utils.isFetchSupported)()) {
      PDFFetchStream = __w_pdfjs_require__(23).PDFFetchStream;
    }

    (0, _api.setPDFNetworkStreamFactory)(params => {
      if (PDFFetchStream && (0, _display_utils.isValidFetchUrl)(params.url)) {
        return new PDFFetchStream(params);
      }

      return new PDFNetworkStream(params);
    });
  }
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __w_pdfjs_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addLinkAttributes = addLinkAttributes;
exports.getFilenameFromUrl = getFilenameFromUrl;
exports.isFetchSupported = isFetchSupported;
exports.isValidFetchUrl = isValidFetchUrl;
exports.loadScript = loadScript;
exports.deprecated = deprecated;
exports.PDFDateString = exports.StatTimer = exports.DOMSVGFactory = exports.DOMCMapReaderFactory = exports.DOMCanvasFactory = exports.DEFAULT_LINK_REL = exports.LinkTarget = exports.RenderingCancelledException = exports.PageViewport = void 0;

var _util = __w_pdfjs_require__(2);

const DEFAULT_LINK_REL = "noopener noreferrer nofollow";
exports.DEFAULT_LINK_REL = DEFAULT_LINK_REL;
const SVG_NS = "http://www.w3.org/2000/svg";

class DOMCanvasFactory {
  create(width, height) {
    if (width <= 0 || height <= 0) {
      throw new Error("Invalid canvas size");
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    return {
      canvas,
      context
    };
  }

  reset(canvasAndContext, width, height) {
    if (!canvasAndContext.canvas) {
      throw new Error("Canvas is not specified");
    }

    if (width <= 0 || height <= 0) {
      throw new Error("Invalid canvas size");
    }

    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  }

  destroy(canvasAndContext) {
    if (!canvasAndContext.canvas) {
      throw new Error("Canvas is not specified");
    }

    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  }

}

exports.DOMCanvasFactory = DOMCanvasFactory;

class DOMCMapReaderFactory {
  constructor({
    baseUrl = null,
    isCompressed = false
  }) {
    this.baseUrl = baseUrl;
    this.isCompressed = isCompressed;
  }

  async fetch({
    name
  }) {
    if (!this.baseUrl) {
      throw new Error('The CMap "baseUrl" parameter must be specified, ensure that ' + 'the "cMapUrl" and "cMapPacked" API parameters are provided.');
    }

    if (!name) {
      throw new Error("CMap name must be specified.");
    }

    const url = this.baseUrl + name + (this.isCompressed ? ".bcmap" : "");
    const compressionType = this.isCompressed ? _util.CMapCompressionType.BINARY : _util.CMapCompressionType.NONE;

    if (isFetchSupported() && isValidFetchUrl(url, document.baseURI)) {
      return fetch(url).then(async response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }

        let cMapData;

        if (this.isCompressed) {
          cMapData = new Uint8Array(await response.arrayBuffer());
        } else {
          cMapData = (0, _util.stringToBytes)(await response.text());
        }

        return {
          cMapData,
          compressionType
        };
      }).catch(reason => {
        throw new Error(`Unable to load ${this.isCompressed ? "binary " : ""}` + `CMap at: ${url}`);
      });
    }

    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open("GET", url, true);

      if (this.isCompressed) {
        request.responseType = "arraybuffer";
      }

      request.onreadystatechange = () => {
        if (request.readyState !== XMLHttpRequest.DONE) {
          return;
        }

        if (request.status === 200 || request.status === 0) {
          let cMapData;

          if (this.isCompressed && request.response) {
            cMapData = new Uint8Array(request.response);
          } else if (!this.isCompressed && request.responseText) {
            cMapData = (0, _util.stringToBytes)(request.responseText);
          }

          if (cMapData) {
            resolve({
              cMapData,
              compressionType
            });
            return;
          }
        }

        reject(new Error(request.statusText));
      };

      request.send(null);
    }).catch(reason => {
      throw new Error(`Unable to load ${this.isCompressed ? "binary " : ""}` + `CMap at: ${url}`);
    });
  }

}

exports.DOMCMapReaderFactory = DOMCMapReaderFactory;

class DOMSVGFactory {
  create(width, height) {
    (0, _util.assert)(width > 0 && height > 0, "Invalid SVG dimensions");
    const svg = document.createElementNS(SVG_NS, "svg:svg");
    svg.setAttribute("version", "1.1");
    svg.setAttribute("width", width + "px");
    svg.setAttribute("height", height + "px");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("viewBox", "0 0 " + width + " " + height);
    return svg;
  }

  createElement(type) {
    (0, _util.assert)(typeof type === "string", "Invalid SVG element type");
    return document.createElementNS(SVG_NS, type);
  }

}

exports.DOMSVGFactory = DOMSVGFactory;

class PageViewport {
  constructor({
    viewBox,
    scale,
    rotation,
    offsetX = 0,
    offsetY = 0,
    dontFlip = false
  }) {
    this.viewBox = viewBox;
    this.scale = scale;
    this.rotation = rotation;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    const centerX = (viewBox[2] + viewBox[0]) / 2;
    const centerY = (viewBox[3] + viewBox[1]) / 2;
    let rotateA, rotateB, rotateC, rotateD;
    rotation = rotation % 360;
    rotation = rotation < 0 ? rotation + 360 : rotation;

    switch (rotation) {
      case 180:
        rotateA = -1;
        rotateB = 0;
        rotateC = 0;
        rotateD = 1;
        break;

      case 90:
        rotateA = 0;
        rotateB = 1;
        rotateC = 1;
        rotateD = 0;
        break;

      case 270:
        rotateA = 0;
        rotateB = -1;
        rotateC = -1;
        rotateD = 0;
        break;

      case 0:
        rotateA = 1;
        rotateB = 0;
        rotateC = 0;
        rotateD = -1;
        break;

      default:
        throw new Error("PageViewport: Invalid rotation, must be a multiple of 90 degrees.");
    }

    if (dontFlip) {
      rotateC = -rotateC;
      rotateD = -rotateD;
    }

    let offsetCanvasX, offsetCanvasY;
    let width, height;

    if (rotateA === 0) {
      offsetCanvasX = Math.abs(centerY - viewBox[1]) * scale + offsetX;
      offsetCanvasY = Math.abs(centerX - viewBox[0]) * scale + offsetY;
      width = Math.abs(viewBox[3] - viewBox[1]) * scale;
      height = Math.abs(viewBox[2] - viewBox[0]) * scale;
    } else {
      offsetCanvasX = Math.abs(centerX - viewBox[0]) * scale + offsetX;
      offsetCanvasY = Math.abs(centerY - viewBox[1]) * scale + offsetY;
      width = Math.abs(viewBox[2] - viewBox[0]) * scale;
      height = Math.abs(viewBox[3] - viewBox[1]) * scale;
    }

    this.transform = [rotateA * scale, rotateB * scale, rotateC * scale, rotateD * scale, offsetCanvasX - rotateA * scale * centerX - rotateC * scale * centerY, offsetCanvasY - rotateB * scale * centerX - rotateD * scale * centerY];
    this.width = width;
    this.height = height;
  }

  clone({
    scale = this.scale,
    rotation = this.rotation,
    offsetX = this.offsetX,
    offsetY = this.offsetY,
    dontFlip = false
  } = {}) {
    return new PageViewport({
      viewBox: this.viewBox.slice(),
      scale,
      rotation,
      offsetX,
      offsetY,
      dontFlip
    });
  }

  convertToViewportPoint(x, y) {
    return _util.Util.applyTransform([x, y], this.transform);
  }

  convertToViewportRectangle(rect) {
    const topLeft = _util.Util.applyTransform([rect[0], rect[1]], this.transform);

    const bottomRight = _util.Util.applyTransform([rect[2], rect[3]], this.transform);

    return [topLeft[0], topLeft[1], bottomRight[0], bottomRight[1]];
  }

  convertToPdfPoint(x, y) {
    return _util.Util.applyInverseTransform([x, y], this.transform);
  }

}

exports.PageViewport = PageViewport;

class RenderingCancelledException extends _util.BaseException {
  constructor(msg, type) {
    super(msg);
    this.type = type;
  }

}

exports.RenderingCancelledException = RenderingCancelledException;
const LinkTarget = {
  NONE: 0,
  SELF: 1,
  BLANK: 2,
  PARENT: 3,
  TOP: 4
};
exports.LinkTarget = LinkTarget;

function addLinkAttributes(link, {
  url,
  target,
  rel,
  enabled = true
} = {}) {
  (0, _util.assert)(url && typeof url === "string", 'addLinkAttributes: A valid "url" parameter must provided.');
  const urlNullRemoved = (0, _util.removeNullCharacters)(url);

  if (enabled) {
    link.href = link.title = urlNullRemoved;
  } else {
    link.href = "";
    link.title = `Disabled: ${urlNullRemoved}`;

    link.onclick = () => {
      return false;
    };
  }

  let targetStr = "";

  switch (target) {
    case LinkTarget.NONE:
      break;

    case LinkTarget.SELF:
      targetStr = "_self";
      break;

    case LinkTarget.BLANK:
      targetStr = "_blank";
      break;

    case LinkTarget.PARENT:
      targetStr = "_parent";
      break;

    case LinkTarget.TOP:
      targetStr = "_top";
      break;
  }

  link.target = targetStr;
  link.rel = typeof rel === "string" ? rel : DEFAULT_LINK_REL;
}

function getFilenameFromUrl(url) {
  const anchor = url.indexOf("#");
  const query = url.indexOf("?");
  const end = Math.min(anchor > 0 ? anchor : url.length, query > 0 ? query : url.length);
  return url.substring(url.lastIndexOf("/", end) + 1, end);
}

class StatTimer {
  constructor() {
    this.started = Object.create(null);
    this.times = [];
  }

  time(name) {
    if (name in this.started) {
      (0, _util.warn)(`Timer is already running for ${name}`);
    }

    this.started[name] = Date.now();
  }

  timeEnd(name) {
    if (!(name in this.started)) {
      (0, _util.warn)(`Timer has not been started for ${name}`);
    }

    this.times.push({
      name,
      start: this.started[name],
      end: Date.now()
    });
    delete this.started[name];
  }

  toString() {
    const outBuf = [];
    let longest = 0;

    for (const time of this.times) {
      const name = time.name;

      if (name.length > longest) {
        longest = name.length;
      }
    }

    for (const time of this.times) {
      const duration = time.end - time.start;
      outBuf.push(`${time.name.padEnd(longest)} ${duration}ms\n`);
    }

    return outBuf.join("");
  }

}

exports.StatTimer = StatTimer;

function isFetchSupported() {
  return typeof fetch !== "undefined" && typeof Response !== "undefined" && "body" in Response.prototype && typeof ReadableStream !== "undefined";
}

function isValidFetchUrl(url, baseUrl) {
  try {
    const {
      protocol
    } = baseUrl ? new URL(url, baseUrl) : new URL(url);
    return protocol === "http:" || protocol === "https:";
  } catch (ex) {
    return false;
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;

    script.onerror = function () {
      reject(new Error(`Cannot load script at: ${script.src}`));
    };

    (document.head || document.documentElement).appendChild(script);
  });
}

function deprecated(details) {
  console.log("Deprecated API usage: " + details);
}

let pdfDateStringRegex;

class PDFDateString {
  static toDateObject(input) {
    if (!input || !(0, _util.isString)(input)) {
      return null;
    }

    if (!pdfDateStringRegex) {
      pdfDateStringRegex = new RegExp("^D:" + "(\\d{4})" + "(\\d{2})?" + "(\\d{2})?" + "(\\d{2})?" + "(\\d{2})?" + "(\\d{2})?" + "([Z|+|-])?" + "(\\d{2})?" + "'?" + "(\\d{2})?" + "'?");
    }

    const matches = pdfDateStringRegex.exec(input);

    if (!matches) {
      return null;
    }

    const year = parseInt(matches[1], 10);
    let month = parseInt(matches[2], 10);
    month = month >= 1 && month <= 12 ? month - 1 : 0;
    let day = parseInt(matches[3], 10);
    day = day >= 1 && day <= 31 ? day : 1;
    let hour = parseInt(matches[4], 10);
    hour = hour >= 0 && hour <= 23 ? hour : 0;
    let minute = parseInt(matches[5], 10);
    minute = minute >= 0 && minute <= 59 ? minute : 0;
    let second = parseInt(matches[6], 10);
    second = second >= 0 && second <= 59 ? second : 0;
    const universalTimeRelation = matches[7] || "Z";
    let offsetHour = parseInt(matches[8], 10);
    offsetHour = offsetHour >= 0 && offsetHour <= 23 ? offsetHour : 0;
    let offsetMinute = parseInt(matches[9], 10) || 0;
    offsetMinute = offsetMinute >= 0 && offsetMinute <= 59 ? offsetMinute : 0;

    if (universalTimeRelation === "-") {
      hour += offsetHour;
      minute += offsetMinute;
    } else if (universalTimeRelation === "+") {
      hour -= offsetHour;
      minute -= offsetMinute;
    }

    return new Date(Date.UTC(year, month, day, hour, minute, second));
  }

}

exports.PDFDateString = PDFDateString;

/***/ }),
/* 2 */
/***/ (function(module, exports, __w_pdfjs_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arrayByteLength = arrayByteLength;
exports.arraysToBytes = arraysToBytes;
exports.assert = assert;
exports.bytesToString = bytesToString;
exports.createPromiseCapability = createPromiseCapability;
exports.getVerbosityLevel = getVerbosityLevel;
exports.info = info;
exports.isArrayBuffer = isArrayBuffer;
exports.isArrayEqual = isArrayEqual;
exports.isBool = isBool;
exports.isEmptyObj = isEmptyObj;
exports.isNum = isNum;
exports.isString = isString;
exports.isSameOrigin = isSameOrigin;
exports.createValidAbsoluteUrl = createValidAbsoluteUrl;
exports.removeNullCharacters = removeNullCharacters;
exports.setVerbosityLevel = setVerbosityLevel;
exports.shadow = shadow;
exports.string32 = string32;
exports.stringToBytes = stringToBytes;
exports.stringToPDFString = stringToPDFString;
exports.stringToUTF8String = stringToUTF8String;
exports.utf8StringToString = utf8StringToString;
exports.warn = warn;
exports.unreachable = unreachable;
exports.IsEvalSupportedCached = exports.IsLittleEndianCached = exports.createObjectURL = exports.FormatError = exports.Util = exports.UnknownErrorException = exports.UnexpectedResponseException = exports.TextRenderingMode = exports.StreamType = exports.PermissionFlag = exports.PasswordResponses = exports.PasswordException = exports.MissingPDFException = exports.InvalidPDFException = exports.AbortException = exports.CMapCompressionType = exports.ImageKind = exports.FontType = exports.AnnotationType = exports.AnnotationStateModelType = exports.AnnotationReviewState = exports.AnnotationReplyType = exports.AnnotationMarkedState = exports.AnnotationFlag = exports.AnnotationFieldFlag = exports.AnnotationBorderStyleType = exports.UNSUPPORTED_FEATURES = exports.VerbosityLevel = exports.OPS = exports.IDENTITY_MATRIX = exports.FONT_IDENTITY_MATRIX = exports.BaseException = void 0;

__w_pdfjs_require__(3);

const IDENTITY_MATRIX = [1, 0, 0, 1, 0, 0];
exports.IDENTITY_MATRIX = IDENTITY_MATRIX;
const FONT_IDENTITY_MATRIX = [0.001, 0, 0, 0.001, 0, 0];
exports.FONT_IDENTITY_MATRIX = FONT_IDENTITY_MATRIX;
const PermissionFlag = {
  PRINT: 0x04,
  MODIFY_CONTENTS: 0x08,
  COPY: 0x10,
  MODIFY_ANNOTATIONS: 0x20,
  FILL_INTERACTIVE_FORMS: 0x100,
  COPY_FOR_ACCESSIBILITY: 0x200,
  ASSEMBLE: 0x400,
  PRINT_HIGH_QUALITY: 0x800
};
exports.PermissionFlag = PermissionFlag;
const TextRenderingMode = {
  FILL: 0,
  STROKE: 1,
  FILL_STROKE: 2,
  INVISIBLE: 3,
  FILL_ADD_TO_PATH: 4,
  STROKE_ADD_TO_PATH: 5,
  FILL_STROKE_ADD_TO_PATH: 6,
  ADD_TO_PATH: 7,
  FILL_STROKE_MASK: 3,
  ADD_TO_PATH_FLAG: 4
};
exports.TextRenderingMode = TextRenderingMode;
const ImageKind = {
  GRAYSCALE_1BPP: 1,
  RGB_24BPP: 2,
  RGBA_32BPP: 3
};
exports.ImageKind = ImageKind;
const AnnotationType = {
  TEXT: 1,
  LINK: 2,
  FREETEXT: 3,
  LINE: 4,
  SQUARE: 5,
  CIRCLE: 6,
  POLYGON: 7,
  POLYLINE: 8,
  HIGHLIGHT: 9,
  UNDERLINE: 10,
  SQUIGGLY: 11,
  STRIKEOUT: 12,
  STAMP: 13,
  CARET: 14,
  INK: 15,
  POPUP: 16,
  FILEATTACHMENT: 17,
  SOUND: 18,
  MOVIE: 19,
  WIDGET: 20,
  SCREEN: 21,
  PRINTERMARK: 22,
  TRAPNET: 23,
  WATERMARK: 24,
  THREED: 25,
  REDACT: 26
};
exports.AnnotationType = AnnotationType;
const AnnotationStateModelType = {
  MARKED: "Marked",
  REVIEW: "Review"
};
exports.AnnotationStateModelType = AnnotationStateModelType;
const AnnotationMarkedState = {
  MARKED: "Marked",
  UNMARKED: "Unmarked"
};
exports.AnnotationMarkedState = AnnotationMarkedState;
const AnnotationReviewState = {
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
  NONE: "None"
};
exports.AnnotationReviewState = AnnotationReviewState;
const AnnotationReplyType = {
  GROUP: "Group",
  REPLY: "R"
};
exports.AnnotationReplyType = AnnotationReplyType;
const AnnotationFlag = {
  INVISIBLE: 0x01,
  HIDDEN: 0x02,
  PRINT: 0x04,
  NOZOOM: 0x08,
  NOROTATE: 0x10,
  NOVIEW: 0x20,
  READONLY: 0x40,
  LOCKED: 0x80,
  TOGGLENOVIEW: 0x100,
  LOCKEDCONTENTS: 0x200
};
exports.AnnotationFlag = AnnotationFlag;
const AnnotationFieldFlag = {
  READONLY: 0x0000001,
  REQUIRED: 0x0000002,
  NOEXPORT: 0x0000004,
  MULTILINE: 0x0001000,
  PASSWORD: 0x0002000,
  NOTOGGLETOOFF: 0x0004000,
  RADIO: 0x0008000,
  PUSHBUTTON: 0x0010000,
  COMBO: 0x0020000,
  EDIT: 0x0040000,
  SORT: 0x0080000,
  FILESELECT: 0x0100000,
  MULTISELECT: 0x0200000,
  DONOTSPELLCHECK: 0x0400000,
  DONOTSCROLL: 0x0800000,
  COMB: 0x1000000,
  RICHTEXT: 0x2000000,
  RADIOSINUNISON: 0x2000000,
  COMMITONSELCHANGE: 0x4000000
};
exports.AnnotationFieldFlag = AnnotationFieldFlag;
const AnnotationBorderStyleType = {
  SOLID: 1,
  DASHED: 2,
  BEVELED: 3,
  INSET: 4,
  UNDERLINE: 5
};
exports.AnnotationBorderStyleType = AnnotationBorderStyleType;
const StreamType = {
  UNKNOWN: "UNKNOWN",
  FLATE: "FLATE",
  LZW: "LZW",
  DCT: "DCT",
  JPX: "JPX",
  JBIG: "JBIG",
  A85: "A85",
  AHX: "AHX",
  CCF: "CCF",
  RLX: "RLX"
};
exports.StreamType = StreamType;
const FontType = {
  UNKNOWN: "UNKNOWN",
  TYPE1: "TYPE1",
  TYPE1C: "TYPE1C",
  CIDFONTTYPE0: "CIDFONTTYPE0",
  CIDFONTTYPE0C: "CIDFONTTYPE0C",
  TRUETYPE: "TRUETYPE",
  CIDFONTTYPE2: "CIDFONTTYPE2",
  TYPE3: "TYPE3",
  OPENTYPE: "OPENTYPE",
  TYPE0: "TYPE0",
  MMTYPE1: "MMTYPE1"
};
exports.FontType = FontType;
const VerbosityLevel = {
  ERRORS: 0,
  WARNINGS: 1,
  INFOS: 5
};
exports.VerbosityLevel = VerbosityLevel;
const CMapCompressionType = {
  NONE: 0,
  BINARY: 1,
  STREAM: 2
};
exports.CMapCompressionType = CMapCompressionType;
const OPS = {
  dependency: 1,
  setLineWidth: 2,
  setLineCap: 3,
  setLineJoin: 4,
  setMiterLimit: 5,
  setDash: 6,
  setRenderingIntent: 7,
  setFlatness: 8,
  setGState: 9,
  save: 10,
  restore: 11,
  transform: 12,
  moveTo: 13,
  lineTo: 14,
  curveTo: 15,
  curveTo2: 16,
  curveTo3: 17,
  closePath: 18,
  rectangle: 19,
  stroke: 20,
  closeStroke: 21,
  fill: 22,
  eoFill: 23,
  fillStroke: 24,
  eoFillStroke: 25,
  closeFillStroke: 26,
  closeEOFillStroke: 27,
  endPath: 28,
  clip: 29,
  eoClip: 30,
  beginText: 31,
  endText: 32,
  setCharSpacing: 33,
  setWordSpacing: 34,
  setHScale: 35,
  setLeading: 36,
  setFont: 37,
  setTextRenderingMode: 38,
  setTextRise: 39,
  moveText: 40,
  setLeadingMoveText: 41,
  setTextMatrix: 42,
  nextLine: 43,
  showText: 44,
  showSpacedText: 45,
  nextLineShowText: 46,
  nextLineSetSpacingShowText: 47,
  setCharWidth: 48,
  setCharWidthAndBounds: 49,
  setStrokeColorSpace: 50,
  setFillColorSpace: 51,
  setStrokeColor: 52,
  setStrokeColorN: 53,
  setFillColor: 54,
  setFillColorN: 55,
  setStrokeGray: 56,
  setFillGray: 57,
  setStrokeRGBColor: 58,
  setFillRGBColor: 59,
  setStrokeCMYKColor: 60,
  setFillCMYKColor: 61,
  shadingFill: 62,
  beginInlineImage: 63,
  beginImageData: 64,
  endInlineImage: 65,
  paintXObject: 66,
  markPoint: 67,
  markPointProps: 68,
  beginMarkedContent: 69,
  beginMarkedContentProps: 70,
  endMarkedContent: 71,
  beginCompat: 72,
  endCompat: 73,
  paintFormXObjectBegin: 74,
  paintFormXObjectEnd: 75,
  beginGroup: 76,
  endGroup: 77,
  beginAnnotations: 78,
  endAnnotations: 79,
  beginAnnotation: 80,
  endAnnotation: 81,
  paintJpegXObject: 82,
  paintImageMaskXObject: 83,
  paintImageMaskXObjectGroup: 84,
  paintImageXObject: 85,
  paintInlineImageXObject: 86,
  paintInlineImageXObjectGroup: 87,
  paintImageXObjectRepeat: 88,
  paintImageMaskXObjectRepeat: 89,
  paintSolidColorImageMask: 90,
  constructPath: 91
};
exports.OPS = OPS;
const UNSUPPORTED_FEATURES = {
  unknown: "unknown",
  forms: "forms",
  javaScript: "javaScript",
  smask: "smask",
  shadingPattern: "shadingPattern",
  font: "font",
  errorTilingPattern: "errorTilingPattern",
  errorExtGState: "errorExtGState",
  errorXObject: "errorXObject",
  errorFontLoadType3: "errorFontLoadType3",
  errorFontState: "errorFontState",
  errorFontMissing: "errorFontMissing",
  errorFontTranslate: "errorFontTranslate",
  errorColorSpace: "errorColorSpace",
  errorOperatorList: "errorOperatorList",
  errorFontToUnicode: "errorFontToUnicode",
  errorFontLoadNative: "errorFontLoadNative",
  errorFontGetPath: "errorFontGetPath"
};
exports.UNSUPPORTED_FEATURES = UNSUPPORTED_FEATURES;
const PasswordResponses = {
  NEED_PASSWORD: 1,
  INCORRECT_PASSWORD: 2
};
exports.PasswordResponses = PasswordResponses;
let verbosity = VerbosityLevel.WARNINGS;

function setVerbosityLevel(level) {
  if (Number.isInteger(level)) {
    verbosity = level;
  }
}

function getVerbosityLevel() {
  return verbosity;
}

function info(msg) {
  if (verbosity >= VerbosityLevel.INFOS) {
    console.log(`Info: ${msg}`);
  }
}

function warn(msg) {
  if (verbosity >= VerbosityLevel.WARNINGS) {
    console.log(`Warning: ${msg}`);
  }
}

function unreachable(msg) {
  throw new Error(msg);
}

function assert(cond, msg) {
  if (!cond) {
    unreachable(msg);
  }
}

function isSameOrigin(baseUrl, otherUrl) {
  let base;

  try {
    base = new URL(baseUrl);

    if (!base.origin || base.origin === "null") {
      return false;
    }
  } catch (e) {
    return false;
  }

  const other = new URL(otherUrl, base);
  return base.origin === other.origin;
}

function _isValidProtocol(url) {
  if (!url) {
    return false;
  }

  switch (url.protocol) {
    case "http:":
    case "https:":
    case "ftp:":
    case "mailto:":
    case "tel:":
      return true;

    default:
      return false;
  }
}

function createValidAbsoluteUrl(url, baseUrl) {
  if (!url) {
    return null;
  }

  try {
    const absoluteUrl = baseUrl ? new URL(url, baseUrl) : new URL(url);

    if (_isValidProtocol(absoluteUrl)) {
      return absoluteUrl;
    }
  } catch (ex) {}

  return null;
}

function shadow(obj, prop, value) {
  Object.defineProperty(obj, prop, {
    value,
    enumerable: true,
    configurable: true,
    writable: false
  });
  return value;
}

const BaseException = function BaseExceptionClosure() {
  function BaseException(message) {
    if (this.constructor === BaseException) {
      unreachable("Cannot initialize BaseException.");
    }

    this.message = message;
    this.name = this.constructor.name;
  }

  BaseException.prototype = new Error();
  BaseException.constructor = BaseException;
  return BaseException;
}();

exports.BaseException = BaseException;

class PasswordException extends BaseException {
  constructor(msg, code) {
    super(msg);
    this.code = code;
  }

}

exports.PasswordException = PasswordException;

class UnknownErrorException extends BaseException {
  constructor(msg, details) {
    super(msg);
    this.details = details;
  }

}

exports.UnknownErrorException = UnknownErrorException;

class InvalidPDFException extends BaseException {}

exports.InvalidPDFException = InvalidPDFException;

class MissingPDFException extends BaseException {}

exports.MissingPDFException = MissingPDFException;

class UnexpectedResponseException extends BaseException {
  constructor(msg, status) {
    super(msg);
    this.status = status;
  }

}

exports.UnexpectedResponseException = UnexpectedResponseException;

class FormatError extends BaseException {}

exports.FormatError = FormatError;

class AbortException extends BaseException {}

exports.AbortException = AbortException;
const NullCharactersRegExp = /\x00/g;

function removeNullCharacters(str) {
  if (typeof str !== "string") {
    warn("The argument for removeNullCharacters must be a string.");
    return str;
  }

  return str.replace(NullCharactersRegExp, "");
}

function bytesToString(bytes) {
  assert(bytes !== null && typeof bytes === "object" && bytes.length !== undefined, "Invalid argument for bytesToString");
  const length = bytes.length;
  const MAX_ARGUMENT_COUNT = 8192;

  if (length < MAX_ARGUMENT_COUNT) {
    return String.fromCharCode.apply(null, bytes);
  }

  const strBuf = [];

  for (let i = 0; i < length; i += MAX_ARGUMENT_COUNT) {
    const chunkEnd = Math.min(i + MAX_ARGUMENT_COUNT, length);
    const chunk = bytes.subarray(i, chunkEnd);
    strBuf.push(String.fromCharCode.apply(null, chunk));
  }

  return strBuf.join("");
}

function stringToBytes(str) {
  assert(typeof str === "string", "Invalid argument for stringToBytes");
  const length = str.length;
  const bytes = new Uint8Array(length);

  for (let i = 0; i < length; ++i) {
    bytes[i] = str.charCodeAt(i) & 0xff;
  }

  return bytes;
}

function arrayByteLength(arr) {
  if (arr.length !== undefined) {
    return arr.length;
  }

  assert(arr.byteLength !== undefined, "arrayByteLength - invalid argument.");
  return arr.byteLength;
}

function arraysToBytes(arr) {
  const length = arr.length;

  if (length === 1 && arr[0] instanceof Uint8Array) {
    return arr[0];
  }

  let resultLength = 0;

  for (let i = 0; i < length; i++) {
    resultLength += arrayByteLength(arr[i]);
  }

  let pos = 0;
  const data = new Uint8Array(resultLength);

  for (let i = 0; i < length; i++) {
    let item = arr[i];

    if (!(item instanceof Uint8Array)) {
      if (typeof item === "string") {
        item = stringToBytes(item);
      } else {
        item = new Uint8Array(item);
      }
    }

    const itemLength = item.byteLength;
    data.set(item, pos);
    pos += itemLength;
  }

  return data;
}

function string32(value) {
  return String.fromCharCode(value >> 24 & 0xff, value >> 16 & 0xff, value >> 8 & 0xff, value & 0xff);
}

function isLittleEndian() {
  const buffer8 = new Uint8Array(4);
  buffer8[0] = 1;
  const view32 = new Uint32Array(buffer8.buffer, 0, 1);
  return view32[0] === 1;
}

const IsLittleEndianCached = {
  get value() {
    return shadow(this, "value", isLittleEndian());
  }

};
exports.IsLittleEndianCached = IsLittleEndianCached;

function isEvalSupported() {
  try {
    new Function("");
    return true;
  } catch (e) {
    return false;
  }
}

const IsEvalSupportedCached = {
  get value() {
    return shadow(this, "value", isEvalSupported());
  }

};
exports.IsEvalSupportedCached = IsEvalSupportedCached;
const rgbBuf = ["rgb(", 0, ",", 0, ",", 0, ")"];

class Util {
  static makeCssRgb(r, g, b) {
    rgbBuf[1] = r;
    rgbBuf[3] = g;
    rgbBuf[5] = b;
    return rgbBuf.join("");
  }

  static transform(m1, m2) {
    return [m1[0] * m2[0] + m1[2] * m2[1], m1[1] * m2[0] + m1[3] * m2[1], m1[0] * m2[2] + m1[2] * m2[3], m1[1] * m2[2] + m1[3] * m2[3], m1[0] * m2[4] + m1[2] * m2[5] + m1[4], m1[1] * m2[4] + m1[3] * m2[5] + m1[5]];
  }

  static applyTransform(p, m) {
    const xt = p[0] * m[0] + p[1] * m[2] + m[4];
    const yt = p[0] * m[1] + p[1] * m[3] + m[5];
    return [xt, yt];
  }

  static applyInverseTransform(p, m) {
    const d = m[0] * m[3] - m[1] * m[2];
    const xt = (p[0] * m[3] - p[1] * m[2] + m[2] * m[5] - m[4] * m[3]) / d;
    const yt = (-p[0] * m[1] + p[1] * m[0] + m[4] * m[1] - m[5] * m[0]) / d;
    return [xt, yt];
  }

  static getAxialAlignedBoundingBox(r, m) {
    const p1 = Util.applyTransform(r, m);
    const p2 = Util.applyTransform(r.slice(2, 4), m);
    const p3 = Util.applyTransform([r[0], r[3]], m);
    const p4 = Util.applyTransform([r[2], r[1]], m);
    return [Math.min(p1[0], p2[0], p3[0], p4[0]), Math.min(p1[1], p2[1], p3[1], p4[1]), Math.max(p1[0], p2[0], p3[0], p4[0]), Math.max(p1[1], p2[1], p3[1], p4[1])];
  }

  static inverseTransform(m) {
    const d = m[0] * m[3] - m[1] * m[2];
    return [m[3] / d, -m[1] / d, -m[2] / d, m[0] / d, (m[2] * m[5] - m[4] * m[3]) / d, (m[4] * m[1] - m[5] * m[0]) / d];
  }

  static apply3dTransform(m, v) {
    return [m[0] * v[0] + m[1] * v[1] + m[2] * v[2], m[3] * v[0] + m[4] * v[1] + m[5] * v[2], m[6] * v[0] + m[7] * v[1] + m[8] * v[2]];
  }

  static singularValueDecompose2dScale(m) {
    const transpose = [m[0], m[2], m[1], m[3]];
    const a = m[0] * transpose[0] + m[1] * transpose[2];
    const b = m[0] * transpose[1] + m[1] * transpose[3];
    const c = m[2] * transpose[0] + m[3] * transpose[2];
    const d = m[2] * transpose[1] + m[3] * transpose[3];
    const first = (a + d) / 2;
    const second = Math.sqrt((a + d) * (a + d) - 4 * (a * d - c * b)) / 2;
    const sx = first + second || 1;
    const sy = first - second || 1;
    return [Math.sqrt(sx), Math.sqrt(sy)];
  }

  static normalizeRect(rect) {
    const r = rect.slice(0);

    if (rect[0] > rect[2]) {
      r[0] = rect[2];
      r[2] = rect[0];
    }

    if (rect[1] > rect[3]) {
      r[1] = rect[3];
      r[3] = rect[1];
    }

    return r;
  }

  static intersect(rect1, rect2) {
    function compare(a, b) {
      return a - b;
    }

    const orderedX = [rect1[0], rect1[2], rect2[0], rect2[2]].sort(compare);
    const orderedY = [rect1[1], rect1[3], rect2[1], rect2[3]].sort(compare);
    const result = [];
    rect1 = Util.normalizeRect(rect1);
    rect2 = Util.normalizeRect(rect2);

    if (orderedX[0] === rect1[0] && orderedX[1] === rect2[0] || orderedX[0] === rect2[0] && orderedX[1] === rect1[0]) {
      result[0] = orderedX[1];
      result[2] = orderedX[2];
    } else {
      return null;
    }

    if (orderedY[0] === rect1[1] && orderedY[1] === rect2[1] || orderedY[0] === rect2[1] && orderedY[1] === rect1[1]) {
      result[1] = orderedY[1];
      result[3] = orderedY[2];
    } else {
      return null;
    }

    return result;
  }

}

exports.Util = Util;
const PDFStringTranslateTable = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x2D8, 0x2C7, 0x2C6, 0x2D9, 0x2DD, 0x2DB, 0x2DA, 0x2DC, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x2022, 0x2020, 0x2021, 0x2026, 0x2014, 0x2013, 0x192, 0x2044, 0x2039, 0x203A, 0x2212, 0x2030, 0x201E, 0x201C, 0x201D, 0x2018, 0x2019, 0x201A, 0x2122, 0xFB01, 0xFB02, 0x141, 0x152, 0x160, 0x178, 0x17D, 0x131, 0x142, 0x153, 0x161, 0x17E, 0, 0x20AC];

function stringToPDFString(str) {
  const length = str.length,
        strBuf = [];

  if (str[0] === "\xFE" && str[1] === "\xFF") {
    for (let i = 2; i < length; i += 2) {
      strBuf.push(String.fromCharCode(str.charCodeAt(i) << 8 | str.charCodeAt(i + 1)));
    }
  } else if (str[0] === "\xFF" && str[1] === "\xFE") {
    for (let i = 2; i < length; i += 2) {
      strBuf.push(String.fromCharCode(str.charCodeAt(i + 1) << 8 | str.charCodeAt(i)));
    }
  } else {
    for (let i = 0; i < length; ++i) {
      const code = PDFStringTranslateTable[str.charCodeAt(i)];
      strBuf.push(code ? String.fromCharCode(code) : str.charAt(i));
    }
  }

  return strBuf.join("");
}

function stringToUTF8String(str) {
  return decodeURIComponent(escape(str));
}

function utf8StringToString(str) {
  return unescape(encodeURIComponent(str));
}

function isEmptyObj(obj) {
  for (const key in obj) {
    return false;
  }

  return true;
}

function isBool(v) {
  return typeof v === "boolean";
}

function isNum(v) {
  return typeof v === "number";
}

function isString(v) {
  return typeof v === "string";
}

function isArrayBuffer(v) {
  return typeof v === "object" && v !== null && v.byteLength !== undefined;
}

function isArrayEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  return arr1.every(function (element, index) {
    return element === arr2[index];
  });
}

function createPromiseCapability() {
  const capability = Object.create(null);
  let isSettled = false;
  Object.defineProperty(capability, "settled", {
    get() {
      return isSettled;
    }

  });
  capability.promise = new Promise(function (resolve, reject) {
    capability.resolve = function (data) {
      isSettled = true;
      resolve(data);
    };

    capability.reject = function (reason) {
      isSettled = true;
      reject(reason);
    };
  });
  return capability;
}

const createObjectURL = function createObjectURLClosure() {
  const digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  return function createObjectURL(data, contentType, forceDataSchema = false) {
    if (!forceDataSchema && URL.createObjectURL) {
      const blob = new Blob([data], {
        type: contentType
      });
      return URL.createObjectURL(blob);
    }

    let buffer = `data:${contentType};base64,`;

    for (let i = 0, ii = data.length; i < ii; i += 3) {
      const b1 = data[i] & 0xff;
      const b2 = data[i + 1] & 0xff;
      const b3 = data[i + 2] & 0xff;
      const d1 = b1 >> 2,
            d2 = (b1 & 3) << 4 | b2 >> 4;
      const d3 = i + 1 < ii ? (b2 & 0xf) << 2 | b3 >> 6 : 64;
      const d4 = i + 2 < ii ? b3 & 0x3f : 64;
      buffer += digits[d1] + digits[d2] + digits[d3] + digits[d4];
    }

    return buffer;
  };
}();

exports.createObjectURL = createObjectURL;

/***/ }),
/* 3 */
/***/ (function(module, exports, __w_pdfjs_require__) {


var _is_node = __w_pdfjs_require__(4);

/***/ }),
/* 4 */
/***/ (function(module, exports, __w_pdfjs_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isNodeJS = void 0;
const isNodeJS = typeof process === "object" && process + "" === "[object process]" && !process.versions.nw && !process.versions.electron;
exports.isNodeJS = isNodeJS;

/***/ }),
/* 5 */
/***/ (function(module, exports, __w_pdfjs_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDocument = getDocument;
exports.setPDFNetworkStreamFactory = setPDFNetworkStreamFactory;
exports.build = exports.version = exports.PDFPageProxy = exports.PDFDocumentProxy = exports.PDFWorker = exports.PDFDataRangeTransport = exports.LoopbackPort = void 0;

var _util = __w_pdfjs_require__(2);

var _display_utils = __w_pdfjs_require__(1);

var _font_loader = __w_pdfjs_require__(6);

var _api_compatibility = __w_pdfjs_require__(7);

var _canvas = __w_pdfjs_require__(8);

var _worker_options = __w_pdfjs_require__(10);

var _is_node = __w_pdfjs_require__(4);

var _message_handler = __w_pdfjs_require__(11);

var _metadata = __w_pdfjs_require__(12);

var _transport_stream = __w_pdfjs_require__(14);

var _webgl = __w_pdfjs_require__(15);

const DEFAULT_RANGE_CHUNK_SIZE = 65536;
const RENDERING_CANCELLED_TIMEOUT = 100;
let createPDFNetworkStream;

function setPDFNetworkStreamFactory(pdfNetworkStreamFactory) {
  createPDFNetworkStream = pdfNetworkStreamFactory;
}

function getDocument(src) {
  const task = new PDFDocumentLoadingTask();
  let source;

  if (typeof src === "string") {
    source = {
      url: src
    };
  } else if ((0, _util.isArrayBuffer)(src)) {
    source = {
      data: src
    };
  } else if (src instanceof PDFDataRangeTransport) {
    source = {
      range: src
    };
  } else {
    if (typeof src !== "object") {
      throw new Error("Invalid parameter in getDocument, " + "need either Uint8Array, string or a parameter object");
    }

    if (!src.url && !src.data && !src.range) {
      throw new Error("Invalid parameter object: need either .data, .range or .url");
    }

    source = src;
  }

  const params = Object.create(null);
  let rangeTransport = null,
      worker = null;

  for (const key in source) {
    if (key === "url" && typeof window !== "undefined") {
      params[key] = new URL(source[key], window.location).href;
      continue;
    } else if (key === "range") {
      rangeTransport = source[key];
      continue;
    } else if (key === "worker") {
      worker = source[key];
      continue;
    } else if (key === "data" && !(source[key] instanceof Uint8Array)) {
      const pdfBytes = source[key];

      if (typeof pdfBytes === "string") {
        params[key] = (0, _util.stringToBytes)(pdfBytes);
      } else if (typeof pdfBytes === "object" && pdfBytes !== null && !isNaN(pdfBytes.length)) {
        params[key] = new Uint8Array(pdfBytes);
      } else if ((0, _util.isArrayBuffer)(pdfBytes)) {
        params[key] = new Uint8Array(pdfBytes);
      } else {
        throw new Error("Invalid PDF binary data: either typed array, " + "string or array-like object is expected in the " + "data property.");
      }

      continue;
    }

    params[key] = source[key];
  }

  params.rangeChunkSize = params.rangeChunkSize || DEFAULT_RANGE_CHUNK_SIZE;
  params.CMapReaderFactory = params.CMapReaderFactory || _display_utils.DOMCMapReaderFactory;
  params.ignoreErrors = params.stopAtErrors !== true;
  params.fontExtraProperties = params.fontExtraProperties === true;
  params.pdfBug = params.pdfBug === true;

  if (!Number.isInteger(params.maxImageSize)) {
    params.maxImageSize = -1;
  }

  if (typeof params.isEvalSupported !== "boolean") {
    params.isEvalSupported = true;
  }

  if (typeof params.disableFontFace !== "boolean") {
    params.disableFontFace = _api_compatibility.apiCompatibilityParams.disableFontFace || false;
  }

  if (typeof params.disableRange !== "boolean") {
    params.disableRange = false;
  }

  if (typeof params.disableStream !== "boolean") {
    params.disableStream = false;
  }

  if (typeof params.disableAutoFetch !== "boolean") {
    params.disableAutoFetch = false;
  }

  (0, _util.setVerbosityLevel)(params.verbosity);

  if (!worker) {
    const workerParams = {
      verbosity: params.verbosity,
      port: _worker_options.GlobalWorkerOptions.workerPort
    };
    worker = workerParams.port ? PDFWorker.fromPort(workerParams) : new PDFWorker(workerParams);
    task._worker = worker;
  }

  const docId = task.docId;
  worker.promise.then(function () {
    if (task.destroyed) {
      throw new Error("Loading aborted");
    }

    const workerIdPromise = _fetchDocument(worker, params, rangeTransport, docId);

    const networkStreamPromise = new Promise(function (resolve) {
      let networkStream;

      if (rangeTransport) {
        networkStream = new _transport_stream.PDFDataTransportStream({
          length: params.length,
          initialData: params.initialData,
          progressiveDone: params.progressiveDone,
          disableRange: params.disableRange,
          disableStream: params.disableStream
        }, rangeTransport);
      } else if (!params.data) {
        networkStream = createPDFNetworkStream({
          url: params.url,
          length: params.length,
          httpHeaders: params.httpHeaders,
          withCredentials: params.withCredentials,
          rangeChunkSize: params.rangeChunkSize,
          disableRange: params.disableRange,
          disableStream: params.disableStream
        });
      }

      resolve(networkStream);
    });
    return Promise.all([workerIdPromise, networkStreamPromise]).then(function ([workerId, networkStream]) {
      if (task.destroyed) {
        throw new Error("Loading aborted");
      }

      const messageHandler = new _message_handler.MessageHandler(docId, workerId, worker.port);
      messageHandler.postMessageTransfers = worker.postMessageTransfers;
      const transport = new WorkerTransport(messageHandler, task, networkStream, params);
      task._transport = transport;
      messageHandler.send("Ready", null);
    });
  }).catch(task._capability.reject);
  return task;
}

function _fetchDocument(worker, source, pdfDataRangeTransport, docId) {
  if (worker.destroyed) {
    return Promise.reject(new Error("Worker was destroyed"));
  }

  if (pdfDataRangeTransport) {
    source.length = pdfDataRangeTransport.length;
    source.initialData = pdfDataRangeTransport.initialData;
    source.progressiveDone = pdfDataRangeTransport.progressiveDone;
  }

  return worker.messageHandler.sendWithPromise("GetDocRequest", {
    docId,
    apiVersion: '2.5.207',
    source: {
      data: source.data,
      url: source.url,
      password: source.password,
      disableAutoFetch: source.disableAutoFetch,
      rangeChunkSize: source.rangeChunkSize,
      length: source.length
    },
    maxImageSize: source.maxImageSize,
    disableFontFace: source.disableFontFace,
    postMessageTransfers: worker.postMessageTransfers,
    docBaseUrl: source.docBaseUrl,
    ignoreErrors: source.ignoreErrors,
    isEvalSupported: source.isEvalSupported,
    fontExtraProperties: source.fontExtraProperties
  }).then(function (workerId) {
    if (worker.destroyed) {
      throw new Error("Worker was destroyed");
    }

    return workerId;
  });
}

const PDFDocumentLoadingTask = function PDFDocumentLoadingTaskClosure() {
  let nextDocumentId = 0;

  class PDFDocumentLoadingTask {
    constructor() {
      this._capability = (0, _util.createPromiseCapability)();
      this._transport = null;
      this._worker = null;
      this.docId = "d" + nextDocumentId++;
      this.destroyed = false;
      this.onPassword = null;
      this.onProgress = null;
      this.onUnsupportedFeature = null;
    }

    get promise() {
      return this._capability.promise;
    }

    destroy() {
      this.destroyed = true;
      const transportDestroyed = !this._transport ? Promise.resolve() : this._transport.destroy();
      return transportDestroyed.then(() => {
        this._transport = null;

        if (this._worker) {
          this._worker.destroy();

          this._worker = null;
        }
      });
    }

  }

  return PDFDocumentLoadingTask;
}();

class PDFDataRangeTransport {
  constructor(length, initialData, progressiveDone = false) {
    this.length = length;
    this.initialData = initialData;
    this.progressiveDone = progressiveDone;
    this._rangeListeners = [];
    this._progressListeners = [];
    this._progressiveReadListeners = [];
    this._progressiveDoneListeners = [];
    this._readyCapability = (0, _util.createPromiseCapability)();
  }

  addRangeListener(listener) {
    this._rangeListeners.push(listener);
  }

  addProgressListener(listener) {
    this._progressListeners.push(listener);
  }

  addProgressiveReadListener(listener) {
    this._progressiveReadListeners.push(listener);
  }

  addProgressiveDoneListener(listener) {
    this._progressiveDoneListeners.push(listener);
  }

  onDataRange(begin, chunk) {
    for (const listener of this._rangeListeners) {
      listener(begin, chunk);
    }
  }

  onDataProgress(loaded, total) {
    this._readyCapability.promise.then(() => {
      for (const listener of this._progressListeners) {
        listener(loaded, total);
      }
    });
  }

  onDataProgressiveRead(chunk) {
    this._readyCapability.promise.then(() => {
      for (const listener of this._progressiveReadListeners) {
        listener(chunk);
      }
    });
  }

  onDataProgressiveDone() {
    this._readyCapability.promise.then(() => {
      for (const listener of this._progressiveDoneListeners) {
        listener();
      }
    });
  }

  transportReady() {
    this._readyCapability.resolve();
  }

  requestDataRange(begin, end) {
    (0, _util.unreachable)("Abstract method PDFDataRangeTransport.requestDataRange");
  }

  abort() {}

}

exports.PDFDataRangeTransport = PDFDataRangeTransport;

class PDFDocumentProxy {
  constructor(pdfInfo, transport) {
    this._pdfInfo = pdfInfo;
    this._transport = transport;
  }

  get numPages() {
    return this._pdfInfo.numPages;
  }

  get fingerprint() {
    return this._pdfInfo.fingerprint;
  }

  getPage(pageNumber) {
    return this._transport.getPage(pageNumber);
  }

  getPageIndex(ref) {
    return this._transport.getPageIndex(ref);
  }

  getDestinations() {
    return this._transport.getDestinations();
  }

  getDestination(id) {
    return this._transport.getDestination(id);
  }

  getPageLabels() {
    return this._transport.getPageLabels();
  }

  getPageLayout() {
    return this._transport.getPageLayout();
  }

  getPageMode() {
    return this._transport.getPageMode();
  }

  getViewerPreferences() {
    return this._transport.getViewerPreferences();
  }

  getOpenAction() {
    return this._transport.getOpenAction();
  }

  getOpenActionDestination() {
    (0, _display_utils.deprecated)("getOpenActionDestination, use getOpenAction instead.");
    return this.getOpenAction().then(function (openAction) {
      return openAction && openAction.dest ? openAction.dest : null;
    });
  }

  getAttachments() {
    return this._transport.getAttachments();
  }

  getJavaScript() {
    return this._transport.getJavaScript();
  }

  getOutline() {
    return this._transport.getOutline();
  }

  getPermissions() {
    return this._transport.getPermissions();
  }

  getMetadata() {
    return this._transport.getMetadata();
  }

  getData() {
    return this._transport.getData();
  }

  getDownloadInfo() {
    return this._transport.downloadInfoCapability.promise;
  }

  getStats() {
    return this._transport.getStats();
  }

  cleanup() {
    return this._transport.startCleanup();
  }

  destroy() {
    return this.loadingTask.destroy();
  }

  get loadingParams() {
    return this._transport.loadingParams;
  }

  get loadingTask() {
    return this._transport.loadingTask;
  }

}

exports.PDFDocumentProxy = PDFDocumentProxy;

class PDFPageProxy {
  constructor(pageIndex, pageInfo, transport, pdfBug = false) {
    this._pageIndex = pageIndex;
    this._pageInfo = pageInfo;
    this._transport = transport;
    this._stats = pdfBug ? new _display_utils.StatTimer() : null;
    this._pdfBug = pdfBug;
    this.commonObjs = transport.commonObjs;
    this.objs = new PDFObjects();
    this.cleanupAfterRender = false;
    this.pendingCleanup = false;
    this.intentStates = Object.create(null);
    this.destroyed = false;
  }

  get pageNumber() {
    return this._pageIndex + 1;
  }

  get rotate() {
    return this._pageInfo.rotate;
  }

  get ref() {
    return this._pageInfo.ref;
  }

  get userUnit() {
    return this._pageInfo.userUnit;
  }

  get view() {
    return this._pageInfo.view;
  }

  getViewport({
    scale,
    rotation = this.rotate,
    offsetX = 0,
    offsetY = 0,
    dontFlip = false
  } = {}) {
    return new _display_utils.PageViewport({
      viewBox: this.view,
      scale,
      rotation,
      offsetX,
      offsetY,
      dontFlip
    });
  }

  getAnnotations({
    intent = null
  } = {}) {
    if (!this.annotationsPromise || this.annotationsIntent !== intent) {
      this.annotationsPromise = this._transport.getAnnotations(this._pageIndex, intent);
      this.annotationsIntent = intent;
    }

    return this.annotationsPromise;
  }

  render({
    canvasContext,
    viewport,
    intent = "display",
    enableWebGL = false,
    renderInteractiveForms = false,
    transform = null,
    imageLayer = null,
    canvasFactory = null,
    background = null
  }) {
    if (this._stats) {
      this._stats.time("Overall");
    }

    const renderingIntent = intent === "print" ? "print" : "display";
    this.pendingCleanup = false;

    if (!this.intentStates[renderingIntent]) {
      this.intentStates[renderingIntent] = Object.create(null);
    }

    const intentState = this.intentStates[renderingIntent];

    if (intentState.streamReaderCancelTimeout) {
      clearTimeout(intentState.streamReaderCancelTimeout);
      intentState.streamReaderCancelTimeout = null;
    }

    const canvasFactoryInstance = canvasFactory || new _display_utils.DOMCanvasFactory();
    const webGLContext = new _webgl.WebGLContext({
      enable: enableWebGL
    });

    if (!intentState.displayReadyCapability) {
      intentState.displayReadyCapability = (0, _util.createPromiseCapability)();
      intentState.operatorList = {
        fnArray: [],
        argsArray: [],
        lastChunk: false
      };

      if (this._stats) {
        this._stats.time("Page Request");
      }

      this._pumpOperatorList({
        pageIndex: this._pageIndex,
        intent: renderingIntent,
        renderInteractiveForms: renderInteractiveForms === true
      });
    }

    const complete = error => {
      const i = intentState.renderTasks.indexOf(internalRenderTask);

      if (i >= 0) {
        intentState.renderTasks.splice(i, 1);
      }

      if (this.cleanupAfterRender || renderingIntent === "print") {
        this.pendingCleanup = true;
      }

      this._tryCleanup();

      if (error) {
        internalRenderTask.capability.reject(error);

        this._abortOperatorList({
          intentState,
          reason: error
        });
      } else {
        internalRenderTask.capability.resolve();
      }

      if (this._stats) {
        this._stats.timeEnd("Rendering");

        this._stats.timeEnd("Overall");
      }
    };

    const internalRenderTask = new InternalRenderTask({
      callback: complete,
      params: {
        canvasContext,
        viewport,
        transform,
        imageLayer,
        background
      },
      objs: this.objs,
      commonObjs: this.commonObjs,
      operatorList: intentState.operatorList,
      pageIndex: this._pageIndex,
      canvasFactory: canvasFactoryInstance,
      webGLContext,
      useRequestAnimationFrame: renderingIntent !== "print",
      pdfBug: this._pdfBug
    });

    if (!intentState.renderTasks) {
      intentState.renderTasks = [];
    }

    intentState.renderTasks.push(internalRenderTask);
    const renderTask = internalRenderTask.task;
    intentState.displayReadyCapability.promise.then(transparency => {
      if (this.pendingCleanup) {
        complete();
        return;
      }

      if (this._stats) {
        this._stats.time("Rendering");
      }

      internalRenderTask.initializeGraphics(transparency);
      internalRenderTask.operatorListChanged();
    }).catch(complete);
    return renderTask;
  }

  getOperatorList() {
    function operatorListChanged() {
      if (intentState.operatorList.lastChunk) {
        intentState.opListReadCapability.resolve(intentState.operatorList);
        const i = intentState.renderTasks.indexOf(opListTask);

        if (i >= 0) {
          intentState.renderTasks.splice(i, 1);
        }
      }
    }

    const renderingIntent = "oplist";

    if (!this.intentStates[renderingIntent]) {
      this.intentStates[renderingIntent] = Object.create(null);
    }

    const intentState = this.intentStates[renderingIntent];
    let opListTask;

    if (!intentState.opListReadCapability) {
      opListTask = {};
      opListTask.operatorListChanged = operatorListChanged;
      intentState.opListReadCapability = (0, _util.createPromiseCapability)();
      intentState.renderTasks = [];
      intentState.renderTasks.push(opListTask);
      intentState.operatorList = {
        fnArray: [],
        argsArray: [],
        lastChunk: false
      };

      if (this._stats) {
        this._stats.time("Page Request");
      }

      this._pumpOperatorList({
        pageIndex: this._pageIndex,
        intent: renderingIntent
      });
    }

    return intentState.opListReadCapability.promise;
  }

  streamTextContent({
    normalizeWhitespace = false,
    disableCombineTextPDFItems = false
  } = {}) {
    const TEXT_CONTENT_CHUNK_SIZE = 100;
    return this._transport.messageHandler.sendWithStream("GetTextContent", {
      pageIndex: this._pageIndex,
      normalizeWhitespace: normalizeWhitespace === true,
      combineTextPDFItems: disableCombineTextPDFItems !== true
    }, {
      highWaterMark: TEXT_CONTENT_CHUNK_SIZE,

      size(textContent) {
        return textContent.items.length;
      }

    });
  }

  getTextContent(params = {}) {
    const readableStream = this.streamTextContent(params);
    return new Promise(function (resolve, reject) {
      function pump() {
        reader.read().then(function ({
          value,
          done
        }) {
          if (done) {
            resolve(textContent);
            return;
          }

          Object.assign(textContent.styles, value.styles);
          textContent.items.push(...value.items);
          pump();
        }, reject);
      }

      const reader = readableStream.getReader();
      const textContent = {
        items: [],
        styles: Object.create(null)
      };
      pump();
    });
  }

  _destroy() {
    this.destroyed = true;
    this._transport.pageCache[this._pageIndex] = null;
    const waitOn = [];
    Object.keys(this.intentStates).forEach(intent => {
      const intentState = this.intentStates[intent];

      this._abortOperatorList({
        intentState,
        reason: new Error("Page was destroyed."),
        force: true
      });

      if (intent === "oplist") {
        return;
      }

      intentState.renderTasks.forEach(function (renderTask) {
        const renderCompleted = renderTask.capability.promise.catch(function () {});
        waitOn.push(renderCompleted);
        renderTask.cancel();
      });
    });
    this.objs.clear();
    this.annotationsPromise = null;
    this.pendingCleanup = false;
    return Promise.all(waitOn);
  }

  cleanup(resetStats = false) {
    this.pendingCleanup = true;
    return this._tryCleanup(resetStats);
  }

  _tryCleanup(resetStats = false) {
    if (!this.pendingCleanup || Object.keys(this.intentStates).some(intent => {
      const intentState = this.intentStates[intent];
      return intentState.renderTasks.length !== 0 || !intentState.operatorList.lastChunk;
    })) {
      return false;
    }

    Object.keys(this.intentStates).forEach(intent => {
      delete this.intentStates[intent];
    });
    this.objs.clear();
    this.annotationsPromise = null;

    if (resetStats && this._stats) {
      this._stats = new _display_utils.StatTimer();
    }

    this.pendingCleanup = false;
    return true;
  }

  _startRenderPage(transparency, intent) {
    const intentState = this.intentStates[intent];

    if (!intentState) {
      return;
    }

    if (this._stats) {
      this._stats.timeEnd("Page Request");
    }

    if (intentState.displayReadyCapability) {
      intentState.displayReadyCapability.resolve(transparency);
    }
  }

  _renderPageChunk(operatorListChunk, intentState) {
    for (let i = 0, ii = operatorListChunk.length; i < ii; i++) {
      intentState.operatorList.fnArray.push(operatorListChunk.fnArray[i]);
      intentState.operatorList.argsArray.push(operatorListChunk.argsArray[i]);
    }

    intentState.operatorList.lastChunk = operatorListChunk.lastChunk;

    for (let i = 0; i < intentState.renderTasks.length; i++) {
      intentState.renderTasks[i].operatorListChanged();
    }

    if (operatorListChunk.lastChunk) {
      this._tryCleanup();
    }
  }

  _pumpOperatorList(args) {
    (0, _util.assert)(args.intent, 'PDFPageProxy._pumpOperatorList: Expected "intent" argument.');

    const readableStream = this._transport.messageHandler.sendWithStream("GetOperatorList", args);

    const reader = readableStream.getReader();
    const intentState = this.intentStates[args.intent];
    intentState.streamReader = reader;

    const pump = () => {
      reader.read().then(({
        value,
        done
      }) => {
        if (done) {
          intentState.streamReader = null;
          return;
        }

        if (this._transport.destroyed) {
          return;
        }

        this._renderPageChunk(value, intentState);

        pump();
      }, reason => {
        intentState.streamReader = null;

        if (this._transport.destroyed) {
          return;
        }

        if (intentState.operatorList) {
          intentState.operatorList.lastChunk = true;

          for (let i = 0; i < intentState.renderTasks.length; i++) {
            intentState.renderTasks[i].operatorListChanged();
          }

          this._tryCleanup();
        }

        if (intentState.displayReadyCapability) {
          intentState.displayReadyCapability.reject(reason);
        } else if (intentState.opListReadCapability) {
          intentState.opListReadCapability.reject(reason);
        } else {
          throw reason;
        }
      });
    };

    pump();
  }

  _abortOperatorList({
    intentState,
    reason,
    force = false
  }) {
    (0, _util.assert)(reason instanceof Error || typeof reason === "object" && reason !== null, 'PDFPageProxy._abortOperatorList: Expected "reason" argument.');

    if (!intentState.streamReader) {
      return;
    }

    if (!force) {
      if (intentState.renderTasks.length !== 0) {
        return;
      }

      if (reason instanceof _display_utils.RenderingCancelledException) {
        intentState.streamReaderCancelTimeout = setTimeout(() => {
          this._abortOperatorList({
            intentState,
            reason,
            force: true
          });

          intentState.streamReaderCancelTimeout = null;
        }, RENDERING_CANCELLED_TIMEOUT);
        return;
      }
    }

    intentState.streamReader.cancel(new _util.AbortException(reason && reason.message));
    intentState.streamReader = null;

    if (this._transport.destroyed) {
      return;
    }

    Object.keys(this.intentStates).some(intent => {
      if (this.intentStates[intent] === intentState) {
        delete this.intentStates[intent];
        return true;
      }

      return false;
    });
    this.cleanup();
  }

  get stats() {
    return this._stats;
  }

}

exports.PDFPageProxy = PDFPageProxy;

class LoopbackPort {
  constructor(defer = true) {
    this._listeners = [];
    this._defer = defer;
    this._deferred = Promise.resolve(undefined);
  }

  postMessage(obj, transfers) {
    function cloneValue(value) {
      if (typeof value !== "object" || value === null) {
        return value;
      }

      if (cloned.has(value)) {
        return cloned.get(value);
      }

      let buffer, result;

      if ((buffer = value.buffer) && (0, _util.isArrayBuffer)(buffer)) {
        const transferable = transfers && transfers.includes(buffer);

        if (transferable) {
          result = new value.constructor(buffer, value.byteOffset, value.byteLength);
        } else {
          result = new value.constructor(value);
        }

        cloned.set(value, result);
        return result;
      }

      result = Array.isArray(value) ? [] : {};
      cloned.set(value, result);

      for (const i in value) {
        let desc,
            p = value;

        while (!(desc = Object.getOwnPropertyDescriptor(p, i))) {
          p = Object.getPrototypeOf(p);
        }

        if (typeof desc.value === "undefined") {
          continue;
        }

        if (typeof desc.value === "function") {
          if (value.hasOwnProperty && value.hasOwnProperty(i)) {
            throw new Error(`LoopbackPort.postMessage - cannot clone: ${value[i]}`);
          }

          continue;
        }

        result[i] = cloneValue(desc.value);
      }

      return result;
    }

    if (!this._defer) {
      this._listeners.forEach(listener => {
        listener.call(this, {
          data: obj
        });
      });

      return;
    }

    const cloned = new WeakMap();
    const e = {
      data: cloneValue(obj)
    };

    this._deferred.then(() => {
      this._listeners.forEach(listener => {
        listener.call(this, e);
      });
    });
  }

  addEventListener(name, listener) {
    this._listeners.push(listener);
  }

  removeEventListener(name, listener) {
    const i = this._listeners.indexOf(listener);

    this._listeners.splice(i, 1);
  }

  terminate() {
    this._listeners.length = 0;
  }

}

exports.LoopbackPort = LoopbackPort;

const PDFWorker = function PDFWorkerClosure() {
  const pdfWorkerPorts = new WeakMap();
  let isWorkerDisabled = false;
  let fallbackWorkerSrc;
  let nextFakeWorkerId = 0;
  let fakeWorkerCapability;

  if (_is_node.isNodeJS && typeof commonjsRequire === "function") {
    isWorkerDisabled = true;
    fallbackWorkerSrc = "./pdf.worker.js";
  } else if (typeof document === "object" && "currentScript" in document) {
    const pdfjsFilePath = document.currentScript && document.currentScript.src;

    if (pdfjsFilePath) {
      fallbackWorkerSrc = pdfjsFilePath.replace(/(\.(?:min\.)?js)(\?.*)?$/i, ".worker$1$2");
    }
  }

  function getWorkerSrc() {
    if (_worker_options.GlobalWorkerOptions.workerSrc) {
      return _worker_options.GlobalWorkerOptions.workerSrc;
    }

    if (typeof fallbackWorkerSrc !== "undefined") {
      if (!_is_node.isNodeJS) {
        (0, _display_utils.deprecated)('No "GlobalWorkerOptions.workerSrc" specified.');
      }

      return fallbackWorkerSrc;
    }

    throw new Error('No "GlobalWorkerOptions.workerSrc" specified.');
  }

  function getMainThreadWorkerMessageHandler() {
    let mainWorkerMessageHandler;

    try {
      mainWorkerMessageHandler = globalThis.pdfjsWorker && globalThis.pdfjsWorker.WorkerMessageHandler;
    } catch (ex) {}

    return mainWorkerMessageHandler || null;
  }

  function setupFakeWorkerGlobal() {
    if (fakeWorkerCapability) {
      return fakeWorkerCapability.promise;
    }

    fakeWorkerCapability = (0, _util.createPromiseCapability)();

    const loader = async function () {
      const mainWorkerMessageHandler = getMainThreadWorkerMessageHandler();

      if (mainWorkerMessageHandler) {
        return mainWorkerMessageHandler;
      }

      if (_is_node.isNodeJS && typeof commonjsRequire === "function") {
        const worker = eval("require")(getWorkerSrc());
        return worker.WorkerMessageHandler;
      }

      await (0, _display_utils.loadScript)(getWorkerSrc());
      return window.pdfjsWorker.WorkerMessageHandler;
    };

    loader().then(fakeWorkerCapability.resolve, fakeWorkerCapability.reject);
    return fakeWorkerCapability.promise;
  }

  function createCDNWrapper(url) {
    const wrapper = "importScripts('" + url + "');";
    return URL.createObjectURL(new Blob([wrapper]));
  }

  class PDFWorker {
    constructor({
      name = null,
      port = null,
      verbosity = (0, _util.getVerbosityLevel)()
    } = {}) {
      if (port && pdfWorkerPorts.has(port)) {
        throw new Error("Cannot use more than one PDFWorker per port");
      }

      this.name = name;
      this.destroyed = false;
      this.postMessageTransfers = true;
      this.verbosity = verbosity;
      this._readyCapability = (0, _util.createPromiseCapability)();
      this._port = null;
      this._webWorker = null;
      this._messageHandler = null;

      if (port) {
        pdfWorkerPorts.set(port, this);

        this._initializeFromPort(port);

        return;
      }

      this._initialize();
    }

    get promise() {
      return this._readyCapability.promise;
    }

    get port() {
      return this._port;
    }

    get messageHandler() {
      return this._messageHandler;
    }

    _initializeFromPort(port) {
      this._port = port;
      this._messageHandler = new _message_handler.MessageHandler("main", "worker", port);

      this._messageHandler.on("ready", function () {});

      this._readyCapability.resolve();
    }

    _initialize() {
      if (typeof Worker !== "undefined" && !isWorkerDisabled && !getMainThreadWorkerMessageHandler()) {
        let workerSrc = getWorkerSrc();

        try {
          if (!(0, _util.isSameOrigin)(window.location.href, workerSrc)) {
            workerSrc = createCDNWrapper(new URL(workerSrc, window.location).href);
          }

          const worker = new Worker(workerSrc);
          const messageHandler = new _message_handler.MessageHandler("main", "worker", worker);

          const terminateEarly = () => {
            worker.removeEventListener("error", onWorkerError);
            messageHandler.destroy();
            worker.terminate();

            if (this.destroyed) {
              this._readyCapability.reject(new Error("Worker was destroyed"));
            } else {
              this._setupFakeWorker();
            }
          };

          const onWorkerError = () => {
            if (!this._webWorker) {
              terminateEarly();
            }
          };

          worker.addEventListener("error", onWorkerError);
          messageHandler.on("test", data => {
            worker.removeEventListener("error", onWorkerError);

            if (this.destroyed) {
              terminateEarly();
              return;
            }

            if (data) {
              this._messageHandler = messageHandler;
              this._port = worker;
              this._webWorker = worker;

              if (!data.supportTransfers) {
                this.postMessageTransfers = false;
              }

              this._readyCapability.resolve();

              messageHandler.send("configure", {
                verbosity: this.verbosity
              });
            } else {
              this._setupFakeWorker();

              messageHandler.destroy();
              worker.terminate();
            }
          });
          messageHandler.on("ready", data => {
            worker.removeEventListener("error", onWorkerError);

            if (this.destroyed) {
              terminateEarly();
              return;
            }

            try {
              sendTest();
            } catch (e) {
              this._setupFakeWorker();
            }
          });

          const sendTest = () => {
            const testObj = new Uint8Array([this.postMessageTransfers ? 255 : 0]);

            try {
              messageHandler.send("test", testObj, [testObj.buffer]);
            } catch (ex) {
              (0, _util.warn)("Cannot use postMessage transfers.");
              testObj[0] = 0;
              messageHandler.send("test", testObj);
            }
          };

          sendTest();
          return;
        } catch (e) {
          (0, _util.info)("The worker has been disabled.");
        }
      }

      this._setupFakeWorker();
    }

    _setupFakeWorker() {
      if (!isWorkerDisabled) {
        (0, _util.warn)("Setting up fake worker.");
        isWorkerDisabled = true;
      }

      setupFakeWorkerGlobal().then(WorkerMessageHandler => {
        if (this.destroyed) {
          this._readyCapability.reject(new Error("Worker was destroyed"));

          return;
        }

        const port = new LoopbackPort();
        this._port = port;
        const id = "fake" + nextFakeWorkerId++;
        const workerHandler = new _message_handler.MessageHandler(id + "_worker", id, port);
        WorkerMessageHandler.setup(workerHandler, port);
        const messageHandler = new _message_handler.MessageHandler(id, id + "_worker", port);
        this._messageHandler = messageHandler;

        this._readyCapability.resolve();

        messageHandler.send("configure", {
          verbosity: this.verbosity
        });
      }).catch(reason => {
        this._readyCapability.reject(new Error(`Setting up fake worker failed: "${reason.message}".`));
      });
    }

    destroy() {
      this.destroyed = true;

      if (this._webWorker) {
        this._webWorker.terminate();

        this._webWorker = null;
      }

      pdfWorkerPorts.delete(this._port);
      this._port = null;

      if (this._messageHandler) {
        this._messageHandler.destroy();

        this._messageHandler = null;
      }
    }

    static fromPort(params) {
      if (!params || !params.port) {
        throw new Error("PDFWorker.fromPort - invalid method signature.");
      }

      if (pdfWorkerPorts.has(params.port)) {
        return pdfWorkerPorts.get(params.port);
      }

      return new PDFWorker(params);
    }

    static getWorkerSrc() {
      return getWorkerSrc();
    }

  }

  return PDFWorker;
}();

exports.PDFWorker = PDFWorker;

class WorkerTransport {
  constructor(messageHandler, loadingTask, networkStream, params) {
    this.messageHandler = messageHandler;
    this.loadingTask = loadingTask;
    this.commonObjs = new PDFObjects();
    this.fontLoader = new _font_loader.FontLoader({
      docId: loadingTask.docId,
      onUnsupportedFeature: this._onUnsupportedFeature.bind(this)
    });
    this._params = params;
    this.CMapReaderFactory = new params.CMapReaderFactory({
      baseUrl: params.cMapUrl,
      isCompressed: params.cMapPacked
    });
    this.destroyed = false;
    this.destroyCapability = null;
    this._passwordCapability = null;
    this._networkStream = networkStream;
    this._fullReader = null;
    this._lastProgress = null;
    this.pageCache = [];
    this.pagePromises = [];
    this.downloadInfoCapability = (0, _util.createPromiseCapability)();
    this.setupMessageHandler();
  }

  destroy() {
    if (this.destroyCapability) {
      return this.destroyCapability.promise;
    }

    this.destroyed = true;
    this.destroyCapability = (0, _util.createPromiseCapability)();

    if (this._passwordCapability) {
      this._passwordCapability.reject(new Error("Worker was destroyed during onPassword callback"));
    }

    const waitOn = [];
    this.pageCache.forEach(function (page) {
      if (page) {
        waitOn.push(page._destroy());
      }
    });
    this.pageCache.length = 0;
    this.pagePromises.length = 0;
    const terminated = this.messageHandler.sendWithPromise("Terminate", null);
    waitOn.push(terminated);
    Promise.all(waitOn).then(() => {
      this.fontLoader.clear();

      if (this._networkStream) {
        this._networkStream.cancelAllRequests(new _util.AbortException("Worker was terminated."));
      }

      if (this.messageHandler) {
        this.messageHandler.destroy();
        this.messageHandler = null;
      }

      this.destroyCapability.resolve();
    }, this.destroyCapability.reject);
    return this.destroyCapability.promise;
  }

  setupMessageHandler() {
    const {
      messageHandler,
      loadingTask
    } = this;
    messageHandler.on("GetReader", (data, sink) => {
      (0, _util.assert)(this._networkStream, "GetReader - no `IPDFStream` instance available.");
      this._fullReader = this._networkStream.getFullReader();

      this._fullReader.onProgress = evt => {
        this._lastProgress = {
          loaded: evt.loaded,
          total: evt.total
        };
      };

      sink.onPull = () => {
        this._fullReader.read().then(function ({
          value,
          done
        }) {
          if (done) {
            sink.close();
            return;
          }

          (0, _util.assert)((0, _util.isArrayBuffer)(value), "GetReader - expected an ArrayBuffer.");
          sink.enqueue(new Uint8Array(value), 1, [value]);
        }).catch(reason => {
          sink.error(reason);
        });
      };

      sink.onCancel = reason => {
        this._fullReader.cancel(reason);
      };
    });
    messageHandler.on("ReaderHeadersReady", data => {
      const headersCapability = (0, _util.createPromiseCapability)();
      const fullReader = this._fullReader;
      fullReader.headersReady.then(() => {
        if (!fullReader.isStreamingSupported || !fullReader.isRangeSupported) {
          if (this._lastProgress && loadingTask.onProgress) {
            loadingTask.onProgress(this._lastProgress);
          }

          fullReader.onProgress = evt => {
            if (loadingTask.onProgress) {
              loadingTask.onProgress({
                loaded: evt.loaded,
                total: evt.total
              });
            }
          };
        }

        headersCapability.resolve({
          isStreamingSupported: fullReader.isStreamingSupported,
          isRangeSupported: fullReader.isRangeSupported,
          contentLength: fullReader.contentLength
        });
      }, headersCapability.reject);
      return headersCapability.promise;
    });
    messageHandler.on("GetRangeReader", (data, sink) => {
      (0, _util.assert)(this._networkStream, "GetRangeReader - no `IPDFStream` instance available.");

      const rangeReader = this._networkStream.getRangeReader(data.begin, data.end);

      if (!rangeReader) {
        sink.close();
        return;
      }

      sink.onPull = () => {
        rangeReader.read().then(function ({
          value,
          done
        }) {
          if (done) {
            sink.close();
            return;
          }

          (0, _util.assert)((0, _util.isArrayBuffer)(value), "GetRangeReader - expected an ArrayBuffer.");
          sink.enqueue(new Uint8Array(value), 1, [value]);
        }).catch(reason => {
          sink.error(reason);
        });
      };

      sink.onCancel = reason => {
        rangeReader.cancel(reason);
      };
    });
    messageHandler.on("GetDoc", ({
      pdfInfo
    }) => {
      this._numPages = pdfInfo.numPages;

      loadingTask._capability.resolve(new PDFDocumentProxy(pdfInfo, this));
    });
    messageHandler.on("DocException", function (ex) {
      let reason;

      switch (ex.name) {
        case "PasswordException":
          reason = new _util.PasswordException(ex.message, ex.code);
          break;

        case "InvalidPDFException":
          reason = new _util.InvalidPDFException(ex.message);
          break;

        case "MissingPDFException":
          reason = new _util.MissingPDFException(ex.message);
          break;

        case "UnexpectedResponseException":
          reason = new _util.UnexpectedResponseException(ex.message, ex.status);
          break;

        case "UnknownErrorException":
          reason = new _util.UnknownErrorException(ex.message, ex.details);
          break;
      }

      loadingTask._capability.reject(reason);
    });
    messageHandler.on("PasswordRequest", exception => {
      this._passwordCapability = (0, _util.createPromiseCapability)();

      if (loadingTask.onPassword) {
        const updatePassword = password => {
          this._passwordCapability.resolve({
            password
          });
        };

        try {
          loadingTask.onPassword(updatePassword, exception.code);
        } catch (ex) {
          this._passwordCapability.reject(ex);
        }
      } else {
        this._passwordCapability.reject(new _util.PasswordException(exception.message, exception.code));
      }

      return this._passwordCapability.promise;
    });
    messageHandler.on("DataLoaded", data => {
      if (loadingTask.onProgress) {
        loadingTask.onProgress({
          loaded: data.length,
          total: data.length
        });
      }

      this.downloadInfoCapability.resolve(data);
    });
    messageHandler.on("StartRenderPage", data => {
      if (this.destroyed) {
        return;
      }

      const page = this.pageCache[data.pageIndex];

      page._startRenderPage(data.transparency, data.intent);
    });
    messageHandler.on("commonobj", data => {
      if (this.destroyed) {
        return;
      }

      const [id, type, exportedData] = data;

      if (this.commonObjs.has(id)) {
        return;
      }

      switch (type) {
        case "Font":
          const params = this._params;

          if ("error" in exportedData) {
            const exportedError = exportedData.error;
            (0, _util.warn)(`Error during font loading: ${exportedError}`);
            this.commonObjs.resolve(id, exportedError);
            break;
          }

          let fontRegistry = null;

          if (params.pdfBug && globalThis.FontInspector && globalThis.FontInspector.enabled) {
            fontRegistry = {
              registerFont(font, url) {
                globalThis.FontInspector.fontAdded(font, url);
              }

            };
          }

          const font = new _font_loader.FontFaceObject(exportedData, {
            isEvalSupported: params.isEvalSupported,
            disableFontFace: params.disableFontFace,
            ignoreErrors: params.ignoreErrors,
            onUnsupportedFeature: this._onUnsupportedFeature.bind(this),
            fontRegistry
          });
          this.fontLoader.bind(font).catch(reason => {
            return messageHandler.sendWithPromise("FontFallback", {
              id
            });
          }).finally(() => {
            if (!params.fontExtraProperties && font.data) {
              font.data = null;
            }

            this.commonObjs.resolve(id, font);
          });
          break;

        case "FontPath":
        case "FontType3Res":
        case "Image":
          this.commonObjs.resolve(id, exportedData);
          break;

        default:
          throw new Error(`Got unknown common object type ${type}`);
      }
    });
    messageHandler.on("obj", data => {
      if (this.destroyed) {
        return undefined;
      }

      const [id, pageIndex, type, imageData] = data;
      const pageProxy = this.pageCache[pageIndex];

      if (pageProxy.objs.has(id)) {
        return undefined;
      }

      switch (type) {
        case "Image":
          pageProxy.objs.resolve(id, imageData);
          const MAX_IMAGE_SIZE_TO_STORE = 8000000;

          if (imageData && "data" in imageData && imageData.data.length > MAX_IMAGE_SIZE_TO_STORE) {
            pageProxy.cleanupAfterRender = true;
          }

          break;

        default:
          throw new Error(`Got unknown object type ${type}`);
      }

      return undefined;
    });
    messageHandler.on("DocProgress", data => {
      if (this.destroyed) {
        return;
      }

      if (loadingTask.onProgress) {
        loadingTask.onProgress({
          loaded: data.loaded,
          total: data.total
        });
      }
    });
    messageHandler.on("UnsupportedFeature", this._onUnsupportedFeature.bind(this));
    messageHandler.on("FetchBuiltInCMap", (data, sink) => {
      if (this.destroyed) {
        sink.error(new Error("Worker was destroyed"));
        return;
      }

      let fetched = false;

      sink.onPull = () => {
        if (fetched) {
          sink.close();
          return;
        }

        fetched = true;
        this.CMapReaderFactory.fetch(data).then(function (builtInCMap) {
          sink.enqueue(builtInCMap, 1, [builtInCMap.cMapData.buffer]);
        }).catch(function (reason) {
          sink.error(reason);
        });
      };
    });
  }

  _onUnsupportedFeature({
    featureId
  }) {
    if (this.destroyed) {
      return;
    }

    if (this.loadingTask.onUnsupportedFeature) {
      this.loadingTask.onUnsupportedFeature(featureId);
    }
  }

  getData() {
    return this.messageHandler.sendWithPromise("GetData", null);
  }

  getPage(pageNumber) {
    if (!Number.isInteger(pageNumber) || pageNumber <= 0 || pageNumber > this._numPages) {
      return Promise.reject(new Error("Invalid page request"));
    }

    const pageIndex = pageNumber - 1;

    if (pageIndex in this.pagePromises) {
      return this.pagePromises[pageIndex];
    }

    const promise = this.messageHandler.sendWithPromise("GetPage", {
      pageIndex
    }).then(pageInfo => {
      if (this.destroyed) {
        throw new Error("Transport destroyed");
      }

      const page = new PDFPageProxy(pageIndex, pageInfo, this, this._params.pdfBug);
      this.pageCache[pageIndex] = page;
      return page;
    });
    this.pagePromises[pageIndex] = promise;
    return promise;
  }

  getPageIndex(ref) {
    return this.messageHandler.sendWithPromise("GetPageIndex", {
      ref
    }).catch(function (reason) {
      return Promise.reject(new Error(reason));
    });
  }

  getAnnotations(pageIndex, intent) {
    return this.messageHandler.sendWithPromise("GetAnnotations", {
      pageIndex,
      intent
    });
  }

  getDestinations() {
    return this.messageHandler.sendWithPromise("GetDestinations", null);
  }

  getDestination(id) {
    if (typeof id !== "string") {
      return Promise.reject(new Error("Invalid destination request."));
    }

    return this.messageHandler.sendWithPromise("GetDestination", {
      id
    });
  }

  getPageLabels() {
    return this.messageHandler.sendWithPromise("GetPageLabels", null);
  }

  getPageLayout() {
    return this.messageHandler.sendWithPromise("GetPageLayout", null);
  }

  getPageMode() {
    return this.messageHandler.sendWithPromise("GetPageMode", null);
  }

  getViewerPreferences() {
    return this.messageHandler.sendWithPromise("GetViewerPreferences", null);
  }

  getOpenAction() {
    return this.messageHandler.sendWithPromise("GetOpenAction", null);
  }

  getAttachments() {
    return this.messageHandler.sendWithPromise("GetAttachments", null);
  }

  getJavaScript() {
    return this.messageHandler.sendWithPromise("GetJavaScript", null);
  }

  getOutline() {
    return this.messageHandler.sendWithPromise("GetOutline", null);
  }

  getPermissions() {
    return this.messageHandler.sendWithPromise("GetPermissions", null);
  }

  getMetadata() {
    return this.messageHandler.sendWithPromise("GetMetadata", null).then(results => {
      return {
        info: results[0],
        metadata: results[1] ? new _metadata.Metadata(results[1]) : null,
        contentDispositionFilename: this._fullReader ? this._fullReader.filename : null
      };
    });
  }

  getStats() {
    return this.messageHandler.sendWithPromise("GetStats", null);
  }

  startCleanup() {
    return this.messageHandler.sendWithPromise("Cleanup", null).then(() => {
      for (let i = 0, ii = this.pageCache.length; i < ii; i++) {
        const page = this.pageCache[i];

        if (page) {
          const cleanupSuccessful = page.cleanup();

          if (!cleanupSuccessful) {
            throw new Error(`startCleanup: Page ${i + 1} is currently rendering.`);
          }
        }
      }

      this.commonObjs.clear();
      this.fontLoader.clear();
    });
  }

  get loadingParams() {
    const params = this._params;
    return (0, _util.shadow)(this, "loadingParams", {
      disableAutoFetch: params.disableAutoFetch,
      disableFontFace: params.disableFontFace
    });
  }

}

class PDFObjects {
  constructor() {
    this._objs = Object.create(null);
  }

  _ensureObj(objId) {
    if (this._objs[objId]) {
      return this._objs[objId];
    }

    return this._objs[objId] = {
      capability: (0, _util.createPromiseCapability)(),
      data: null,
      resolved: false
    };
  }

  get(objId, callback = null) {
    if (callback) {
      this._ensureObj(objId).capability.promise.then(callback);

      return null;
    }

    const obj = this._objs[objId];

    if (!obj || !obj.resolved) {
      throw new Error(`Requesting object that isn't resolved yet ${objId}.`);
    }

    return obj.data;
  }

  has(objId) {
    const obj = this._objs[objId];
    return obj ? obj.resolved : false;
  }

  resolve(objId, data) {
    const obj = this._ensureObj(objId);

    obj.resolved = true;
    obj.data = data;
    obj.capability.resolve(data);
  }

  clear() {
    this._objs = Object.create(null);
  }

}

class RenderTask {
  constructor(internalRenderTask) {
    this._internalRenderTask = internalRenderTask;
    this.onContinue = null;
  }

  get promise() {
    return this._internalRenderTask.capability.promise;
  }

  cancel() {
    this._internalRenderTask.cancel();
  }

}

const InternalRenderTask = function InternalRenderTaskClosure() {
  const canvasInRendering = new WeakSet();

  class InternalRenderTask {
    constructor({
      callback,
      params,
      objs,
      commonObjs,
      operatorList,
      pageIndex,
      canvasFactory,
      webGLContext,
      useRequestAnimationFrame = false,
      pdfBug = false
    }) {
      this.callback = callback;
      this.params = params;
      this.objs = objs;
      this.commonObjs = commonObjs;
      this.operatorListIdx = null;
      this.operatorList = operatorList;
      this._pageIndex = pageIndex;
      this.canvasFactory = canvasFactory;
      this.webGLContext = webGLContext;
      this._pdfBug = pdfBug;
      this.running = false;
      this.graphicsReadyCallback = null;
      this.graphicsReady = false;
      this._useRequestAnimationFrame = useRequestAnimationFrame === true && typeof window !== "undefined";
      this.cancelled = false;
      this.capability = (0, _util.createPromiseCapability)();
      this.task = new RenderTask(this);
      this._continueBound = this._continue.bind(this);
      this._scheduleNextBound = this._scheduleNext.bind(this);
      this._nextBound = this._next.bind(this);
      this._canvas = params.canvasContext.canvas;
    }

    initializeGraphics(transparency = false) {
      if (this.cancelled) {
        return;
      }

      if (this._canvas) {
        if (canvasInRendering.has(this._canvas)) {
          throw new Error("Cannot use the same canvas during multiple render() operations. " + "Use different canvas or ensure previous operations were " + "cancelled or completed.");
        }

        canvasInRendering.add(this._canvas);
      }

      if (this._pdfBug && globalThis.StepperManager && globalThis.StepperManager.enabled) {
        this.stepper = globalThis.StepperManager.create(this._pageIndex);
        this.stepper.init(this.operatorList);
        this.stepper.nextBreakPoint = this.stepper.getNextBreakPoint();
      }

      const {
        canvasContext,
        viewport,
        transform,
        imageLayer,
        background
      } = this.params;
      this.gfx = new _canvas.CanvasGraphics(canvasContext, this.commonObjs, this.objs, this.canvasFactory, this.webGLContext, imageLayer);
      this.gfx.beginDrawing({
        transform,
        viewport,
        transparency,
        background
      });
      this.operatorListIdx = 0;
      this.graphicsReady = true;

      if (this.graphicsReadyCallback) {
        this.graphicsReadyCallback();
      }
    }

    cancel(error = null) {
      this.running = false;
      this.cancelled = true;

      if (this.gfx) {
        this.gfx.endDrawing();
      }

      if (this._canvas) {
        canvasInRendering.delete(this._canvas);
      }

      this.callback(error || new _display_utils.RenderingCancelledException(`Rendering cancelled, page ${this._pageIndex + 1}`, "canvas"));
    }

    operatorListChanged() {
      if (!this.graphicsReady) {
        if (!this.graphicsReadyCallback) {
          this.graphicsReadyCallback = this._continueBound;
        }

        return;
      }

      if (this.stepper) {
        this.stepper.updateOperatorList(this.operatorList);
      }

      if (this.running) {
        return;
      }

      this._continue();
    }

    _continue() {
      this.running = true;

      if (this.cancelled) {
        return;
      }

      if (this.task.onContinue) {
        this.task.onContinue(this._scheduleNextBound);
      } else {
        this._scheduleNext();
      }
    }

    _scheduleNext() {
      if (this._useRequestAnimationFrame) {
        window.requestAnimationFrame(() => {
          this._nextBound().catch(this.cancel.bind(this));
        });
      } else {
        Promise.resolve().then(this._nextBound).catch(this.cancel.bind(this));
      }
    }

    async _next() {
      if (this.cancelled) {
        return;
      }

      this.operatorListIdx = this.gfx.executeOperatorList(this.operatorList, this.operatorListIdx, this._continueBound, this.stepper);

      if (this.operatorListIdx === this.operatorList.argsArray.length) {
        this.running = false;

        if (this.operatorList.lastChunk) {
          this.gfx.endDrawing();

          if (this._canvas) {
            canvasInRendering.delete(this._canvas);
          }

          this.callback();
        }
      }
    }

  }

  return InternalRenderTask;
}();

const version = '2.5.207';
exports.version = version;
const build = '0974d605';
exports.build = build;

/***/ }),
/* 6 */
/***/ (function(module, exports, __w_pdfjs_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FontLoader = exports.FontFaceObject = void 0;

var _util = __w_pdfjs_require__(2);

class BaseFontLoader {
  constructor({
    docId,
    onUnsupportedFeature
  }) {
    if (this.constructor === BaseFontLoader) {
      (0, _util.unreachable)("Cannot initialize BaseFontLoader.");
    }

    this.docId = docId;
    this._onUnsupportedFeature = onUnsupportedFeature;
    this.nativeFontFaces = [];
    this.styleElement = null;
  }

  addNativeFontFace(nativeFontFace) {
    this.nativeFontFaces.push(nativeFontFace);
    document.fonts.add(nativeFontFace);
  }

  insertRule(rule) {
    let styleElement = this.styleElement;

    if (!styleElement) {
      styleElement = this.styleElement = document.createElement("style");
      styleElement.id = `PDFJS_FONT_STYLE_TAG_${this.docId}`;
      document.documentElement.getElementsByTagName("head")[0].appendChild(styleElement);
    }

    const styleSheet = styleElement.sheet;
    styleSheet.insertRule(rule, styleSheet.cssRules.length);
  }

  clear() {
    this.nativeFontFaces.forEach(function (nativeFontFace) {
      document.fonts.delete(nativeFontFace);
    });
    this.nativeFontFaces.length = 0;

    if (this.styleElement) {
      this.styleElement.remove();
      this.styleElement = null;
    }
  }

  async bind(font) {
    if (font.attached || font.missingFile) {
      return;
    }

    font.attached = true;

    if (this.isFontLoadingAPISupported) {
      const nativeFontFace = font.createNativeFontFace();

      if (nativeFontFace) {
        this.addNativeFontFace(nativeFontFace);

        try {
          await nativeFontFace.loaded;
        } catch (ex) {
          this._onUnsupportedFeature({
            featureId: _util.UNSUPPORTED_FEATURES.errorFontLoadNative
          });

          (0, _util.warn)(`Failed to load font '${nativeFontFace.family}': '${ex}'.`);
          font.disableFontFace = true;
          throw ex;
        }
      }

      return;
    }

    const rule = font.createFontFaceRule();

    if (rule) {
      this.insertRule(rule);

      if (this.isSyncFontLoadingSupported) {
        return;
      }

      await new Promise(resolve => {
        const request = this._queueLoadingCallback(resolve);

        this._prepareFontLoadEvent([rule], [font], request);
      });
    }
  }

  _queueLoadingCallback(callback) {
    (0, _util.unreachable)("Abstract method `_queueLoadingCallback`.");
  }

  get isFontLoadingAPISupported() {
    const supported = typeof document !== "undefined" && !!document.fonts;
    return (0, _util.shadow)(this, "isFontLoadingAPISupported", supported);
  }

  get isSyncFontLoadingSupported() {
    (0, _util.unreachable)("Abstract method `isSyncFontLoadingSupported`.");
  }

  get _loadTestFont() {
    (0, _util.unreachable)("Abstract method `_loadTestFont`.");
  }

  _prepareFontLoadEvent(rules, fontsToLoad, request) {
    (0, _util.unreachable)("Abstract method `_prepareFontLoadEvent`.");
  }

}

let FontLoader;
exports.FontLoader = FontLoader;
{
  exports.FontLoader = FontLoader = class GenericFontLoader extends BaseFontLoader {
    constructor(docId) {
      super(docId);
      this.loadingContext = {
        requests: [],
        nextRequestId: 0
      };
      this.loadTestFontId = 0;
    }

    get isSyncFontLoadingSupported() {
      let supported = false;

      if (typeof navigator === "undefined") {
        supported = true;
      } else {
        const m = /Mozilla\/5.0.*?rv:(\d+).*? Gecko/.exec(navigator.userAgent);

        if (m && m[1] >= 14) {
          supported = true;
        }
      }

      return (0, _util.shadow)(this, "isSyncFontLoadingSupported", supported);
    }

    _queueLoadingCallback(callback) {
      function completeRequest() {
        (0, _util.assert)(!request.done, "completeRequest() cannot be called twice.");
        request.done = true;

        while (context.requests.length > 0 && context.requests[0].done) {
          const otherRequest = context.requests.shift();
          setTimeout(otherRequest.callback, 0);
        }
      }

      const context = this.loadingContext;
      const request = {
        id: `pdfjs-font-loading-${context.nextRequestId++}`,
        done: false,
        complete: completeRequest,
        callback
      };
      context.requests.push(request);
      return request;
    }

    get _loadTestFont() {
      const getLoadTestFont = function () {
        return atob("T1RUTwALAIAAAwAwQ0ZGIDHtZg4AAAOYAAAAgUZGVE1lkzZwAAAEHAAAABxHREVGABQA" + "FQAABDgAAAAeT1MvMlYNYwkAAAEgAAAAYGNtYXABDQLUAAACNAAAAUJoZWFk/xVFDQAA" + "ALwAAAA2aGhlYQdkA+oAAAD0AAAAJGhtdHgD6AAAAAAEWAAAAAZtYXhwAAJQAAAAARgA" + "AAAGbmFtZVjmdH4AAAGAAAAAsXBvc3T/hgAzAAADeAAAACAAAQAAAAEAALZRFsRfDzz1" + "AAsD6AAAAADOBOTLAAAAAM4KHDwAAAAAA+gDIQAAAAgAAgAAAAAAAAABAAADIQAAAFoD" + "6AAAAAAD6AABAAAAAAAAAAAAAAAAAAAAAQAAUAAAAgAAAAQD6AH0AAUAAAKKArwAAACM" + "AooCvAAAAeAAMQECAAACAAYJAAAAAAAAAAAAAQAAAAAAAAAAAAAAAFBmRWQAwAAuAC4D" + "IP84AFoDIQAAAAAAAQAAAAAAAAAAACAAIAABAAAADgCuAAEAAAAAAAAAAQAAAAEAAAAA" + "AAEAAQAAAAEAAAAAAAIAAQAAAAEAAAAAAAMAAQAAAAEAAAAAAAQAAQAAAAEAAAAAAAUA" + "AQAAAAEAAAAAAAYAAQAAAAMAAQQJAAAAAgABAAMAAQQJAAEAAgABAAMAAQQJAAIAAgAB" + "AAMAAQQJAAMAAgABAAMAAQQJAAQAAgABAAMAAQQJAAUAAgABAAMAAQQJAAYAAgABWABY" + "AAAAAAAAAwAAAAMAAAAcAAEAAAAAADwAAwABAAAAHAAEACAAAAAEAAQAAQAAAC7//wAA" + "AC7////TAAEAAAAAAAABBgAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" + "AAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" + "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" + "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" + "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" + "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAD/gwAyAAAAAQAAAAAAAAAAAAAAAAAA" + "AAABAAQEAAEBAQJYAAEBASH4DwD4GwHEAvgcA/gXBIwMAYuL+nz5tQXkD5j3CBLnEQAC" + "AQEBIVhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYAAABAQAADwACAQEEE/t3" + "Dov6fAH6fAT+fPp8+nwHDosMCvm1Cvm1DAz6fBQAAAAAAAABAAAAAMmJbzEAAAAAzgTj" + "FQAAAADOBOQpAAEAAAAAAAAADAAUAAQAAAABAAAAAgABAAAAAAAAAAAD6AAAAAAAAA==");
      };

      return (0, _util.shadow)(this, "_loadTestFont", getLoadTestFont());
    }

    _prepareFontLoadEvent(rules, fonts, request) {
      function int32(data, offset) {
        return data.charCodeAt(offset) << 24 | data.charCodeAt(offset + 1) << 16 | data.charCodeAt(offset + 2) << 8 | data.charCodeAt(offset + 3) & 0xff;
      }

      function spliceString(s, offset, remove, insert) {
        const chunk1 = s.substring(0, offset);
        const chunk2 = s.substring(offset + remove);
        return chunk1 + insert + chunk2;
      }

      let i, ii;
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext("2d");
      let called = 0;

      function isFontReady(name, callback) {
        called++;

        if (called > 30) {
          (0, _util.warn)("Load test font never loaded.");
          callback();
          return;
        }

        ctx.font = "30px " + name;
        ctx.fillText(".", 0, 20);
        const imageData = ctx.getImageData(0, 0, 1, 1);

        if (imageData.data[3] > 0) {
          callback();
          return;
        }

        setTimeout(isFontReady.bind(null, name, callback));
      }

      const loadTestFontId = `lt${Date.now()}${this.loadTestFontId++}`;
      let data = this._loadTestFont;
      const COMMENT_OFFSET = 976;
      data = spliceString(data, COMMENT_OFFSET, loadTestFontId.length, loadTestFontId);
      const CFF_CHECKSUM_OFFSET = 16;
      const XXXX_VALUE = 0x58585858;
      let checksum = int32(data, CFF_CHECKSUM_OFFSET);

      for (i = 0, ii = loadTestFontId.length - 3; i < ii; i += 4) {
        checksum = checksum - XXXX_VALUE + int32(loadTestFontId, i) | 0;
      }

      if (i < loadTestFontId.length) {
        checksum = checksum - XXXX_VALUE + int32(loadTestFontId + "XXX", i) | 0;
      }

      data = spliceString(data, CFF_CHECKSUM_OFFSET, 4, (0, _util.string32)(checksum));
      const url = `url(data:font/opentype;base64,${btoa(data)});`;
      const rule = `@font-face {font-family:"${loadTestFontId}";src:${url}}`;
      this.insertRule(rule);
      const names = [];

      for (i = 0, ii = fonts.length; i < ii; i++) {
        names.push(fonts[i].loadedName);
      }

      names.push(loadTestFontId);
      const div = document.createElement("div");
      div.style.visibility = "hidden";
      div.style.width = div.style.height = "10px";
      div.style.position = "absolute";
      div.style.top = div.style.left = "0px";

      for (i = 0, ii = names.length; i < ii; ++i) {
        const span = document.createElement("span");
        span.textContent = "Hi";
        span.style.fontFamily = names[i];
        div.appendChild(span);
      }

      document.body.appendChild(div);
      isFontReady(loadTestFontId, function () {
        document.body.removeChild(div);
        request.complete();
      });
    }

  };
}

class FontFaceObject {
  constructor(translatedData, {
    isEvalSupported = true,
    disableFontFace = false,
    ignoreErrors = false,
    onUnsupportedFeature = null,
    fontRegistry = null
  }) {
    this.compiledGlyphs = Object.create(null);

    for (const i in translatedData) {
      this[i] = translatedData[i];
    }

    this.isEvalSupported = isEvalSupported !== false;
    this.disableFontFace = disableFontFace === true;
    this.ignoreErrors = ignoreErrors === true;
    this._onUnsupportedFeature = onUnsupportedFeature;
    this.fontRegistry = fontRegistry;
  }

  createNativeFontFace() {
    if (!this.data || this.disableFontFace) {
      return null;
    }

    const nativeFontFace = new FontFace(this.loadedName, this.data, {});

    if (this.fontRegistry) {
      this.fontRegistry.registerFont(this);
    }

    return nativeFontFace;
  }

  createFontFaceRule() {
    if (!this.data || this.disableFontFace) {
      return null;
    }

    const data = (0, _util.bytesToString)(new Uint8Array(this.data));
    const url = `url(data:${this.mimetype};base64,${btoa(data)});`;
    const rule = `@font-face {font-family:"${this.loadedName}";src:${url}}`;

    if (this.fontRegistry) {
      this.fontRegistry.registerFont(this, url);
    }

    return rule;
  }

  getPathGenerator(objs, character) {
    if (this.compiledGlyphs[character] !== undefined) {
      return this.compiledGlyphs[character];
    }

    let cmds, current;

    try {
      cmds = objs.get(this.loadedName + "_path_" + character);
    } catch (ex) {
      if (!this.ignoreErrors) {
        throw ex;
      }

      if (this._onUnsupportedFeature) {
        this._onUnsupportedFeature({
          featureId: _util.UNSUPPORTED_FEATURES.errorFontGetPath
        });
      }

      (0, _util.warn)(`getPathGenerator - ignoring character: "${ex}".`);
      return this.compiledGlyphs[character] = function (c, size) {};
    }

    if (this.isEvalSupported && _util.IsEvalSupportedCached.value) {
      let args,
          js = "";

      for (let i = 0, ii = cmds.length; i < ii; i++) {
        current = cmds[i];

        if (current.args !== undefined) {
          args = current.args.join(",");
        } else {
          args = "";
        }

        js += "c." + current.cmd + "(" + args + ");\n";
      }

      return this.compiledGlyphs[character] = new Function("c", "size", js);
    }

    return this.compiledGlyphs[character] = function (c, size) {
      for (let i = 0, ii = cmds.length; i < ii; i++) {
        current = cmds[i];

        if (current.cmd === "scale") {
          current.args = [size, -size];
        }

        c[current.cmd].apply(c, current.args);
      }
    };
  }

}

exports.FontFaceObject = FontFaceObject;

/***/ }),
/* 7 */
/***/ (function(module, exports, __w_pdfjs_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiCompatibilityParams = void 0;

var _is_node = __w_pdfjs_require__(4);

const compatibilityParams = Object.create(null);
{
  (function checkFontFace() {
    if (_is_node.isNodeJS) {
      compatibilityParams.disableFontFace = true;
    }
  })();
}
const apiCompatibilityParams = Object.freeze(compatibilityParams);
exports.apiCompatibilityParams = apiCompatibilityParams;

/***/ }),
/* 8 */
/***/ (function(module, exports, __w_pdfjs_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CanvasGraphics = void 0;

var _util = __w_pdfjs_require__(2);

var _pattern_helper = __w_pdfjs_require__(9);

var MIN_FONT_SIZE = 16;
var MAX_FONT_SIZE = 100;
var MAX_GROUP_SIZE = 4096;
var MIN_WIDTH_FACTOR = 0.65;
var MAX_SIZE_TO_COMPILE = 1000;
var FULL_CHUNK_HEIGHT = 16;

function addContextCurrentTransform(ctx) {
  if (!ctx.mozCurrentTransform) {
    ctx._originalSave = ctx.save;
    ctx._originalRestore = ctx.restore;
    ctx._originalRotate = ctx.rotate;
    ctx._originalScale = ctx.scale;
    ctx._originalTranslate = ctx.translate;
    ctx._originalTransform = ctx.transform;
    ctx._originalSetTransform = ctx.setTransform;
    ctx._transformMatrix = ctx._transformMatrix || [1, 0, 0, 1, 0, 0];
    ctx._transformStack = [];
    Object.defineProperty(ctx, "mozCurrentTransform", {
      get: function getCurrentTransform() {
        return this._transformMatrix;
      }
    });
    Object.defineProperty(ctx, "mozCurrentTransformInverse", {
      get: function getCurrentTransformInverse() {
        var m = this._transformMatrix;
        var a = m[0],
            b = m[1],
            c = m[2],
            d = m[3],
            e = m[4],
            f = m[5];
        var ad_bc = a * d - b * c;
        var bc_ad = b * c - a * d;
        return [d / ad_bc, b / bc_ad, c / bc_ad, a / ad_bc, (d * e - c * f) / bc_ad, (b * e - a * f) / ad_bc];
      }
    });

    ctx.save = function ctxSave() {
      var old = this._transformMatrix;

      this._transformStack.push(old);

      this._transformMatrix = old.slice(0, 6);

      this._originalSave();
    };

    ctx.restore = function ctxRestore() {
      var prev = this._transformStack.pop();

      if (prev) {
        this._transformMatrix = prev;

        this._originalRestore();
      }
    };

    ctx.translate = function ctxTranslate(x, y) {
      var m = this._transformMatrix;
      m[4] = m[0] * x + m[2] * y + m[4];
      m[5] = m[1] * x + m[3] * y + m[5];

      this._originalTranslate(x, y);
    };

    ctx.scale = function ctxScale(x, y) {
      var m = this._transformMatrix;
      m[0] = m[0] * x;
      m[1] = m[1] * x;
      m[2] = m[2] * y;
      m[3] = m[3] * y;

      this._originalScale(x, y);
    };

    ctx.transform = function ctxTransform(a, b, c, d, e, f) {
      var m = this._transformMatrix;
      this._transformMatrix = [m[0] * a + m[2] * b, m[1] * a + m[3] * b, m[0] * c + m[2] * d, m[1] * c + m[3] * d, m[0] * e + m[2] * f + m[4], m[1] * e + m[3] * f + m[5]];

      ctx._originalTransform(a, b, c, d, e, f);
    };

    ctx.setTransform = function ctxSetTransform(a, b, c, d, e, f) {
      this._transformMatrix = [a, b, c, d, e, f];

      ctx._originalSetTransform(a, b, c, d, e, f);
    };

    ctx.rotate = function ctxRotate(angle) {
      var cosValue = Math.cos(angle);
      var sinValue = Math.sin(angle);
      var m = this._transformMatrix;
      this._transformMatrix = [m[0] * cosValue + m[2] * sinValue, m[1] * cosValue + m[3] * sinValue, m[0] * -sinValue + m[2] * cosValue, m[1] * -sinValue + m[3] * cosValue, m[4], m[5]];

      this._originalRotate(angle);
    };
  }
}

var CachedCanvases = function CachedCanvasesClosure() {
  function CachedCanvases(canvasFactory) {
    this.canvasFactory = canvasFactory;
    this.cache = Object.create(null);
  }

  CachedCanvases.prototype = {
    getCanvas: function CachedCanvases_getCanvas(id, width, height, trackTransform) {
      var canvasEntry;

      if (this.cache[id] !== undefined) {
        canvasEntry = this.cache[id];
        this.canvasFactory.reset(canvasEntry, width, height);
        canvasEntry.context.setTransform(1, 0, 0, 1, 0, 0);
      } else {
        canvasEntry = this.canvasFactory.create(width, height);
        this.cache[id] = canvasEntry;
      }

      if (trackTransform) {
        addContextCurrentTransform(canvasEntry.context);
      }

      return canvasEntry;
    },

    clear() {
      for (var id in this.cache) {
        var canvasEntry = this.cache[id];
        this.canvasFactory.destroy(canvasEntry);
        delete this.cache[id];
      }
    }

  };
  return CachedCanvases;
}();

function compileType3Glyph(imgData) {
  var POINT_TO_PROCESS_LIMIT = 1000;
  var width = imgData.width,
      height = imgData.height;
  var i,
      j,
      j0,
      width1 = width + 1;
  var points = new Uint8Array(width1 * (height + 1));
  var POINT_TYPES = new Uint8Array([0, 2, 4, 0, 1, 0, 5, 4, 8, 10, 0, 8, 0, 2, 1, 0]);
  var lineSize = width + 7 & ~7,
      data0 = imgData.data;
  var data = new Uint8Array(lineSize * height),
      pos = 0,
      ii;

  for (i = 0, ii = data0.length; i < ii; i++) {
    var mask = 128,
        elem = data0[i];

    while (mask > 0) {
      data[pos++] = elem & mask ? 0 : 255;
      mask >>= 1;
    }
  }

  var count = 0;
  pos = 0;

  if (data[pos] !== 0) {
    points[0] = 1;
    ++count;
  }

  for (j = 1; j < width; j++) {
    if (data[pos] !== data[pos + 1]) {
      points[j] = data[pos] ? 2 : 1;
      ++count;
    }

    pos++;
  }

  if (data[pos] !== 0) {
    points[j] = 2;
    ++count;
  }

  for (i = 1; i < height; i++) {
    pos = i * lineSize;
    j0 = i * width1;

    if (data[pos - lineSize] !== data[pos]) {
      points[j0] = data[pos] ? 1 : 8;
      ++count;
    }

    var sum = (data[pos] ? 4 : 0) + (data[pos - lineSize] ? 8 : 0);

    for (j = 1; j < width; j++) {
      sum = (sum >> 2) + (data[pos + 1] ? 4 : 0) + (data[pos - lineSize + 1] ? 8 : 0);

      if (POINT_TYPES[sum]) {
        points[j0 + j] = POINT_TYPES[sum];
        ++count;
      }

      pos++;
    }

    if (data[pos - lineSize] !== data[pos]) {
      points[j0 + j] = data[pos] ? 2 : 4;
      ++count;
    }

    if (count > POINT_TO_PROCESS_LIMIT) {
      return null;
    }
  }

  pos = lineSize * (height - 1);
  j0 = i * width1;

  if (data[pos] !== 0) {
    points[j0] = 8;
    ++count;
  }

  for (j = 1; j < width; j++) {
    if (data[pos] !== data[pos + 1]) {
      points[j0 + j] = data[pos] ? 4 : 8;
      ++count;
    }

    pos++;
  }

  if (data[pos] !== 0) {
    points[j0 + j] = 4;
    ++count;
  }

  if (count > POINT_TO_PROCESS_LIMIT) {
    return null;
  }

  var steps = new Int32Array([0, width1, -1, 0, -width1, 0, 0, 0, 1]);
  var outlines = [];

  for (i = 0; count && i <= height; i++) {
    var p = i * width1;
    var end = p + width;

    while (p < end && !points[p]) {
      p++;
    }

    if (p === end) {
      continue;
    }

    var coords = [p % width1, i];
    var type = points[p],
        p0 = p,
        pp;

    do {
      var step = steps[type];

      do {
        p += step;
      } while (!points[p]);

      pp = points[p];

      if (pp !== 5 && pp !== 10) {
        type = pp;
        points[p] = 0;
      } else {
        type = pp & 0x33 * type >> 4;
        points[p] &= type >> 2 | type << 2;
      }

      coords.push(p % width1);
      coords.push(p / width1 | 0);

      if (!points[p]) {
        --count;
      }
    } while (p0 !== p);

    outlines.push(coords);
    --i;
  }

  var drawOutline = function (c) {
    c.save();
    c.scale(1 / width, -1 / height);
    c.translate(0, -height);
    c.beginPath();

    for (let k = 0, kk = outlines.length; k < kk; k++) {
      var o = outlines[k];
      c.moveTo(o[0], o[1]);

      for (let l = 2, ll = o.length; l < ll; l += 2) {
        c.lineTo(o[l], o[l + 1]);
      }
    }

    c.fill();
    c.beginPath();
    c.restore();
  };

  return drawOutline;
}

var CanvasExtraState = function CanvasExtraStateClosure() {
  function CanvasExtraState() {
    this.alphaIsShape = false;
    this.fontSize = 0;
    this.fontSizeScale = 1;
    this.textMatrix = _util.IDENTITY_MATRIX;
    this.textMatrixScale = 1;
    this.fontMatrix = _util.FONT_IDENTITY_MATRIX;
    this.leading = 0;
    this.x = 0;
    this.y = 0;
    this.lineX = 0;
    this.lineY = 0;
    this.charSpacing = 0;
    this.wordSpacing = 0;
    this.textHScale = 1;
    this.textRenderingMode = _util.TextRenderingMode.FILL;
    this.textRise = 0;
    this.fillColor = "#000000";
    this.strokeColor = "#000000";
    this.patternFill = false;
    this.fillAlpha = 1;
    this.strokeAlpha = 1;
    this.lineWidth = 1;
    this.activeSMask = null;
    this.resumeSMaskCtx = null;
  }

  CanvasExtraState.prototype = {
    clone: function CanvasExtraState_clone() {
      return Object.create(this);
    },
    setCurrentPoint: function CanvasExtraState_setCurrentPoint(x, y) {
      this.x = x;
      this.y = y;
    }
  };
  return CanvasExtraState;
}();

var CanvasGraphics = function CanvasGraphicsClosure() {
  var EXECUTION_TIME = 15;
  var EXECUTION_STEPS = 10;

  function CanvasGraphics(canvasCtx, commonObjs, objs, canvasFactory, webGLContext, imageLayer) {
    this.ctx = canvasCtx;
    this.current = new CanvasExtraState();
    this.stateStack = [];
    this.pendingClip = null;
    this.pendingEOFill = false;
    this.res = null;
    this.xobjs = null;
    this.commonObjs = commonObjs;
    this.objs = objs;
    this.canvasFactory = canvasFactory;
    this.webGLContext = webGLContext;
    this.imageLayer = imageLayer;
    this.groupStack = [];
    this.processingType3 = null;
    this.baseTransform = null;
    this.baseTransformStack = [];
    this.groupLevel = 0;
    this.smaskStack = [];
    this.smaskCounter = 0;
    this.tempSMask = null;
    this.cachedCanvases = new CachedCanvases(this.canvasFactory);

    if (canvasCtx) {
      addContextCurrentTransform(canvasCtx);
    }

    this._cachedGetSinglePixelWidth = null;
  }

  function putBinaryImageData(ctx, imgData) {
    if (typeof ImageData !== "undefined" && imgData instanceof ImageData) {
      ctx.putImageData(imgData, 0, 0);
      return;
    }

    var height = imgData.height,
        width = imgData.width;
    var partialChunkHeight = height % FULL_CHUNK_HEIGHT;
    var fullChunks = (height - partialChunkHeight) / FULL_CHUNK_HEIGHT;
    var totalChunks = partialChunkHeight === 0 ? fullChunks : fullChunks + 1;
    var chunkImgData = ctx.createImageData(width, FULL_CHUNK_HEIGHT);
    var srcPos = 0,
        destPos;
    var src = imgData.data;
    var dest = chunkImgData.data;
    var i, j, thisChunkHeight, elemsInThisChunk;

    if (imgData.kind === _util.ImageKind.GRAYSCALE_1BPP) {
      var srcLength = src.byteLength;
      var dest32 = new Uint32Array(dest.buffer, 0, dest.byteLength >> 2);
      var dest32DataLength = dest32.length;
      var fullSrcDiff = width + 7 >> 3;
      var white = 0xffffffff;
      var black = _util.IsLittleEndianCached.value ? 0xff000000 : 0x000000ff;

      for (i = 0; i < totalChunks; i++) {
        thisChunkHeight = i < fullChunks ? FULL_CHUNK_HEIGHT : partialChunkHeight;
        destPos = 0;

        for (j = 0; j < thisChunkHeight; j++) {
          var srcDiff = srcLength - srcPos;
          var k = 0;
          var kEnd = srcDiff > fullSrcDiff ? width : srcDiff * 8 - 7;
          var kEndUnrolled = kEnd & ~7;
          var mask = 0;
          var srcByte = 0;

          for (; k < kEndUnrolled; k += 8) {
            srcByte = src[srcPos++];
            dest32[destPos++] = srcByte & 128 ? white : black;
            dest32[destPos++] = srcByte & 64 ? white : black;
            dest32[destPos++] = srcByte & 32 ? white : black;
            dest32[destPos++] = srcByte & 16 ? white : black;
            dest32[destPos++] = srcByte & 8 ? white : black;
            dest32[destPos++] = srcByte & 4 ? white : black;
            dest32[destPos++] = srcByte & 2 ? white : black;
            dest32[destPos++] = srcByte & 1 ? white : black;
          }

          for (; k < kEnd; k++) {
            if (mask === 0) {
              srcByte = src[srcPos++];
              mask = 128;
            }

            dest32[destPos++] = srcByte & mask ? white : black;
            mask >>= 1;
          }
        }

        while (destPos < dest32DataLength) {
          dest32[destPos++] = 0;
        }

        ctx.putImageData(chunkImgData, 0, i * FULL_CHUNK_HEIGHT);
      }
    } else if (imgData.kind === _util.ImageKind.RGBA_32BPP) {
      j = 0;
      elemsInThisChunk = width * FULL_CHUNK_HEIGHT * 4;

      for (i = 0; i < fullChunks; i++) {
        dest.set(src.subarray(srcPos, srcPos + elemsInThisChunk));
        srcPos += elemsInThisChunk;
        ctx.putImageData(chunkImgData, 0, j);
        j += FULL_CHUNK_HEIGHT;
      }

      if (i < totalChunks) {
        elemsInThisChunk = width * partialChunkHeight * 4;
        dest.set(src.subarray(srcPos, srcPos + elemsInThisChunk));
        ctx.putImageData(chunkImgData, 0, j);
      }
    } else if (imgData.kind === _util.ImageKind.RGB_24BPP) {
      thisChunkHeight = FULL_CHUNK_HEIGHT;
      elemsInThisChunk = width * thisChunkHeight;

      for (i = 0; i < totalChunks; i++) {
        if (i >= fullChunks) {
          thisChunkHeight = partialChunkHeight;
          elemsInThisChunk = width * thisChunkHeight;
        }

        destPos = 0;

        for (j = elemsInThisChunk; j--;) {
          dest[destPos++] = src[srcPos++];
          dest[destPos++] = src[srcPos++];
          dest[destPos++] = src[srcPos++];
          dest[destPos++] = 255;
        }

        ctx.putImageData(chunkImgData, 0, i * FULL_CHUNK_HEIGHT);
      }
    } else {
      throw new Error(`bad image kind: ${imgData.kind}`);
    }
  }

  function putBinaryImageMask(ctx, imgData) {
    var height = imgData.height,
        width = imgData.width;
    var partialChunkHeight = height % FULL_CHUNK_HEIGHT;
    var fullChunks = (height - partialChunkHeight) / FULL_CHUNK_HEIGHT;
    var totalChunks = partialChunkHeight === 0 ? fullChunks : fullChunks + 1;
    var chunkImgData = ctx.createImageData(width, FULL_CHUNK_HEIGHT);
    var srcPos = 0;
    var src = imgData.data;
    var dest = chunkImgData.data;

    for (var i = 0; i < totalChunks; i++) {
      var thisChunkHeight = i < fullChunks ? FULL_CHUNK_HEIGHT : partialChunkHeight;
      var destPos = 3;

      for (var j = 0; j < thisChunkHeight; j++) {
        var mask = 0;

        for (var k = 0; k < width; k++) {
          if (!mask) {
            var elem = src[srcPos++];
            mask = 128;
          }

          dest[destPos] = elem & mask ? 0 : 255;
          destPos += 4;
          mask >>= 1;
        }
      }

      ctx.putImageData(chunkImgData, 0, i * FULL_CHUNK_HEIGHT);
    }
  }

  function copyCtxState(sourceCtx, destCtx) {
    var properties = ["strokeStyle", "fillStyle", "fillRule", "globalAlpha", "lineWidth", "lineCap", "lineJoin", "miterLimit", "globalCompositeOperation", "font"];

    for (var i = 0, ii = properties.length; i < ii; i++) {
      var property = properties[i];

      if (sourceCtx[property] !== undefined) {
        destCtx[property] = sourceCtx[property];
      }
    }

    if (sourceCtx.setLineDash !== undefined) {
      destCtx.setLineDash(sourceCtx.getLineDash());
      destCtx.lineDashOffset = sourceCtx.lineDashOffset;
    }
  }

  function resetCtxToDefault(ctx) {
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#000000";
    ctx.fillRule = "nonzero";
    ctx.globalAlpha = 1;
    ctx.lineWidth = 1;
    ctx.lineCap = "butt";
    ctx.lineJoin = "miter";
    ctx.miterLimit = 10;
    ctx.globalCompositeOperation = "source-over";
    ctx.font = "10px sans-serif";

    if (ctx.setLineDash !== undefined) {
      ctx.setLineDash([]);
      ctx.lineDashOffset = 0;
    }
  }

  function composeSMaskBackdrop(bytes, r0, g0, b0) {
    var length = bytes.length;

    for (var i = 3; i < length; i += 4) {
      var alpha = bytes[i];

      if (alpha === 0) {
        bytes[i - 3] = r0;
        bytes[i - 2] = g0;
        bytes[i - 1] = b0;
      } else if (alpha < 255) {
        var alpha_ = 255 - alpha;
        bytes[i - 3] = bytes[i - 3] * alpha + r0 * alpha_ >> 8;
        bytes[i - 2] = bytes[i - 2] * alpha + g0 * alpha_ >> 8;
        bytes[i - 1] = bytes[i - 1] * alpha + b0 * alpha_ >> 8;
      }
    }
  }

  function composeSMaskAlpha(maskData, layerData, transferMap) {
    var length = maskData.length;
    var scale = 1 / 255;

    for (var i = 3; i < length; i += 4) {
      var alpha = transferMap ? transferMap[maskData[i]] : maskData[i];
      layerData[i] = layerData[i] * alpha * scale | 0;
    }
  }

  function composeSMaskLuminosity(maskData, layerData, transferMap) {
    var length = maskData.length;

    for (var i = 3; i < length; i += 4) {
      var y = maskData[i - 3] * 77 + maskData[i - 2] * 152 + maskData[i - 1] * 28;
      layerData[i] = transferMap ? layerData[i] * transferMap[y >> 8] >> 8 : layerData[i] * y >> 16;
    }
  }

  function genericComposeSMask(maskCtx, layerCtx, width, height, subtype, backdrop, transferMap) {
    var hasBackdrop = !!backdrop;
    var r0 = hasBackdrop ? backdrop[0] : 0;
    var g0 = hasBackdrop ? backdrop[1] : 0;
    var b0 = hasBackdrop ? backdrop[2] : 0;
    var composeFn;

    if (subtype === "Luminosity") {
      composeFn = composeSMaskLuminosity;
    } else {
      composeFn = composeSMaskAlpha;
    }

    var PIXELS_TO_PROCESS = 1048576;
    var chunkSize = Math.min(height, Math.ceil(PIXELS_TO_PROCESS / width));

    for (var row = 0; row < height; row += chunkSize) {
      var chunkHeight = Math.min(chunkSize, height - row);
      var maskData = maskCtx.getImageData(0, row, width, chunkHeight);
      var layerData = layerCtx.getImageData(0, row, width, chunkHeight);

      if (hasBackdrop) {
        composeSMaskBackdrop(maskData.data, r0, g0, b0);
      }

      composeFn(maskData.data, layerData.data, transferMap);
      maskCtx.putImageData(layerData, 0, row);
    }
  }

  function composeSMask(ctx, smask, layerCtx, webGLContext) {
    var mask = smask.canvas;
    var maskCtx = smask.context;
    ctx.setTransform(smask.scaleX, 0, 0, smask.scaleY, smask.offsetX, smask.offsetY);
    var backdrop = smask.backdrop || null;

    if (!smask.transferMap && webGLContext.isEnabled) {
      const composed = webGLContext.composeSMask({
        layer: layerCtx.canvas,
        mask,
        properties: {
          subtype: smask.subtype,
          backdrop
        }
      });
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(composed, smask.offsetX, smask.offsetY);
      return;
    }

    genericComposeSMask(maskCtx, layerCtx, mask.width, mask.height, smask.subtype, backdrop, smask.transferMap);
    ctx.drawImage(mask, 0, 0);
  }

  var LINE_CAP_STYLES = ["butt", "round", "square"];
  var LINE_JOIN_STYLES = ["miter", "round", "bevel"];
  var NORMAL_CLIP = {};
  var EO_CLIP = {};
  CanvasGraphics.prototype = {
    beginDrawing({
      transform,
      viewport,
      transparency = false,
      background = null
    }) {
      var width = this.ctx.canvas.width;
      var height = this.ctx.canvas.height;
      this.ctx.save();
      this.ctx.fillStyle = background || "rgb(255, 255, 255)";
      this.ctx.fillRect(0, 0, width, height);
      this.ctx.restore();

      if (transparency) {
        var transparentCanvas = this.cachedCanvases.getCanvas("transparent", width, height, true);
        this.compositeCtx = this.ctx;
        this.transparentCanvas = transparentCanvas.canvas;
        this.ctx = transparentCanvas.context;
        this.ctx.save();
        this.ctx.transform.apply(this.ctx, this.compositeCtx.mozCurrentTransform);
      }

      this.ctx.save();
      resetCtxToDefault(this.ctx);

      if (transform) {
        this.ctx.transform.apply(this.ctx, transform);
      }

      this.ctx.transform.apply(this.ctx, viewport.transform);
      this.baseTransform = this.ctx.mozCurrentTransform.slice();

      if (this.imageLayer) {
        this.imageLayer.beginLayout();
      }
    },

    executeOperatorList: function CanvasGraphics_executeOperatorList(operatorList, executionStartIdx, continueCallback, stepper) {
      var argsArray = operatorList.argsArray;
      var fnArray = operatorList.fnArray;
      var i = executionStartIdx || 0;
      var argsArrayLen = argsArray.length;

      if (argsArrayLen === i) {
        return i;
      }

      var chunkOperations = argsArrayLen - i > EXECUTION_STEPS && typeof continueCallback === "function";
      var endTime = chunkOperations ? Date.now() + EXECUTION_TIME : 0;
      var steps = 0;
      var commonObjs = this.commonObjs;
      var objs = this.objs;
      var fnId;

      while (true) {
        if (stepper !== undefined && i === stepper.nextBreakPoint) {
          stepper.breakIt(i, continueCallback);
          return i;
        }

        fnId = fnArray[i];

        if (fnId !== _util.OPS.dependency) {
          this[fnId].apply(this, argsArray[i]);
        } else {
          for (const depObjId of argsArray[i]) {
            const objsPool = depObjId.startsWith("g_") ? commonObjs : objs;

            if (!objsPool.has(depObjId)) {
              objsPool.get(depObjId, continueCallback);
              return i;
            }
          }
        }

        i++;

        if (i === argsArrayLen) {
          return i;
        }

        if (chunkOperations && ++steps > EXECUTION_STEPS) {
          if (Date.now() > endTime) {
            continueCallback();
            return i;
          }

          steps = 0;
        }
      }
    },
    endDrawing: function CanvasGraphics_endDrawing() {
      if (this.current.activeSMask !== null) {
        this.endSMaskGroup();
      }

      this.ctx.restore();

      if (this.transparentCanvas) {
        this.ctx = this.compositeCtx;
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.drawImage(this.transparentCanvas, 0, 0);
        this.ctx.restore();
        this.transparentCanvas = null;
      }

      this.cachedCanvases.clear();
      this.webGLContext.clear();

      if (this.imageLayer) {
        this.imageLayer.endLayout();
      }
    },
    setLineWidth: function CanvasGraphics_setLineWidth(width) {
      this.current.lineWidth = width;
      this.ctx.lineWidth = width;
    },
    setLineCap: function CanvasGraphics_setLineCap(style) {
      this.ctx.lineCap = LINE_CAP_STYLES[style];
    },
    setLineJoin: function CanvasGraphics_setLineJoin(style) {
      this.ctx.lineJoin = LINE_JOIN_STYLES[style];
    },
    setMiterLimit: function CanvasGraphics_setMiterLimit(limit) {
      this.ctx.miterLimit = limit;
    },
    setDash: function CanvasGraphics_setDash(dashArray, dashPhase) {
      var ctx = this.ctx;

      if (ctx.setLineDash !== undefined) {
        ctx.setLineDash(dashArray);
        ctx.lineDashOffset = dashPhase;
      }
    },

    setRenderingIntent(intent) {},

    setFlatness(flatness) {},

    setGState: function CanvasGraphics_setGState(states) {
      for (var i = 0, ii = states.length; i < ii; i++) {
        var state = states[i];
        var key = state[0];
        var value = state[1];

        switch (key) {
          case "LW":
            this.setLineWidth(value);
            break;

          case "LC":
            this.setLineCap(value);
            break;

          case "LJ":
            this.setLineJoin(value);
            break;

          case "ML":
            this.setMiterLimit(value);
            break;

          case "D":
            this.setDash(value[0], value[1]);
            break;

          case "RI":
            this.setRenderingIntent(value);
            break;

          case "FL":
            this.setFlatness(value);
            break;

          case "Font":
            this.setFont(value[0], value[1]);
            break;

          case "CA":
            this.current.strokeAlpha = state[1];
            break;

          case "ca":
            this.current.fillAlpha = state[1];
            this.ctx.globalAlpha = state[1];
            break;

          case "BM":
            this.ctx.globalCompositeOperation = value;
            break;

          case "SMask":
            if (this.current.activeSMask) {
              if (this.stateStack.length > 0 && this.stateStack[this.stateStack.length - 1].activeSMask === this.current.activeSMask) {
                this.suspendSMaskGroup();
              } else {
                this.endSMaskGroup();
              }
            }

            this.current.activeSMask = value ? this.tempSMask : null;

            if (this.current.activeSMask) {
              this.beginSMaskGroup();
            }

            this.tempSMask = null;
            break;
        }
      }
    },
    beginSMaskGroup: function CanvasGraphics_beginSMaskGroup() {
      var activeSMask = this.current.activeSMask;
      var drawnWidth = activeSMask.canvas.width;
      var drawnHeight = activeSMask.canvas.height;
      var cacheId = "smaskGroupAt" + this.groupLevel;
      var scratchCanvas = this.cachedCanvases.getCanvas(cacheId, drawnWidth, drawnHeight, true);
      var currentCtx = this.ctx;
      var currentTransform = currentCtx.mozCurrentTransform;
      this.ctx.save();
      var groupCtx = scratchCanvas.context;
      groupCtx.scale(1 / activeSMask.scaleX, 1 / activeSMask.scaleY);
      groupCtx.translate(-activeSMask.offsetX, -activeSMask.offsetY);
      groupCtx.transform.apply(groupCtx, currentTransform);
      activeSMask.startTransformInverse = groupCtx.mozCurrentTransformInverse;
      copyCtxState(currentCtx, groupCtx);
      this.ctx = groupCtx;
      this.setGState([["BM", "source-over"], ["ca", 1], ["CA", 1]]);
      this.groupStack.push(currentCtx);
      this.groupLevel++;
    },
    suspendSMaskGroup: function CanvasGraphics_endSMaskGroup() {
      var groupCtx = this.ctx;
      this.groupLevel--;
      this.ctx = this.groupStack.pop();
      composeSMask(this.ctx, this.current.activeSMask, groupCtx, this.webGLContext);
      this.ctx.restore();
      this.ctx.save();
      copyCtxState(groupCtx, this.ctx);
      this.current.resumeSMaskCtx = groupCtx;

      var deltaTransform = _util.Util.transform(this.current.activeSMask.startTransformInverse, groupCtx.mozCurrentTransform);

      this.ctx.transform.apply(this.ctx, deltaTransform);
      groupCtx.save();
      groupCtx.setTransform(1, 0, 0, 1, 0, 0);
      groupCtx.clearRect(0, 0, groupCtx.canvas.width, groupCtx.canvas.height);
      groupCtx.restore();
    },
    resumeSMaskGroup: function CanvasGraphics_endSMaskGroup() {
      var groupCtx = this.current.resumeSMaskCtx;
      var currentCtx = this.ctx;
      this.ctx = groupCtx;
      this.groupStack.push(currentCtx);
      this.groupLevel++;
    },
    endSMaskGroup: function CanvasGraphics_endSMaskGroup() {
      var groupCtx = this.ctx;
      this.groupLevel--;
      this.ctx = this.groupStack.pop();
      composeSMask(this.ctx, this.current.activeSMask, groupCtx, this.webGLContext);
      this.ctx.restore();
      copyCtxState(groupCtx, this.ctx);

      var deltaTransform = _util.Util.transform(this.current.activeSMask.startTransformInverse, groupCtx.mozCurrentTransform);

      this.ctx.transform.apply(this.ctx, deltaTransform);
    },
    save: function CanvasGraphics_save() {
      this.ctx.save();
      var old = this.current;
      this.stateStack.push(old);
      this.current = old.clone();
      this.current.resumeSMaskCtx = null;
    },
    restore: function CanvasGraphics_restore() {
      if (this.current.resumeSMaskCtx) {
        this.resumeSMaskGroup();
      }

      if (this.current.activeSMask !== null && (this.stateStack.length === 0 || this.stateStack[this.stateStack.length - 1].activeSMask !== this.current.activeSMask)) {
        this.endSMaskGroup();
      }

      if (this.stateStack.length !== 0) {
        this.current = this.stateStack.pop();
        this.ctx.restore();
        this.pendingClip = null;
        this._cachedGetSinglePixelWidth = null;
      }
    },
    transform: function CanvasGraphics_transform(a, b, c, d, e, f) {
      this.ctx.transform(a, b, c, d, e, f);
      this._cachedGetSinglePixelWidth = null;
    },
    constructPath: function CanvasGraphics_constructPath(ops, args) {
      var ctx = this.ctx;
      var current = this.current;
      var x = current.x,
          y = current.y;

      for (var i = 0, j = 0, ii = ops.length; i < ii; i++) {
        switch (ops[i] | 0) {
          case _util.OPS.rectangle:
            x = args[j++];
            y = args[j++];
            var width = args[j++];
            var height = args[j++];

            if (width === 0) {
              width = this.getSinglePixelWidth();
            }

            if (height === 0) {
              height = this.getSinglePixelWidth();
            }

            var xw = x + width;
            var yh = y + height;
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(xw, y);
            this.ctx.lineTo(xw, yh);
            this.ctx.lineTo(x, yh);
            this.ctx.lineTo(x, y);
            this.ctx.closePath();
            break;

          case _util.OPS.moveTo:
            x = args[j++];
            y = args[j++];
            ctx.moveTo(x, y);
            break;

          case _util.OPS.lineTo:
            x = args[j++];
            y = args[j++];
            ctx.lineTo(x, y);
            break;

          case _util.OPS.curveTo:
            x = args[j + 4];
            y = args[j + 5];
            ctx.bezierCurveTo(args[j], args[j + 1], args[j + 2], args[j + 3], x, y);
            j += 6;
            break;

          case _util.OPS.curveTo2:
            ctx.bezierCurveTo(x, y, args[j], args[j + 1], args[j + 2], args[j + 3]);
            x = args[j + 2];
            y = args[j + 3];
            j += 4;
            break;

          case _util.OPS.curveTo3:
            x = args[j + 2];
            y = args[j + 3];
            ctx.bezierCurveTo(args[j], args[j + 1], x, y, x, y);
            j += 4;
            break;

          case _util.OPS.closePath:
            ctx.closePath();
            break;
        }
      }

      current.setCurrentPoint(x, y);
    },
    closePath: function CanvasGraphics_closePath() {
      this.ctx.closePath();
    },
    stroke: function CanvasGraphics_stroke(consumePath) {
      consumePath = typeof consumePath !== "undefined" ? consumePath : true;
      var ctx = this.ctx;
      var strokeColor = this.current.strokeColor;
      ctx.globalAlpha = this.current.strokeAlpha;

      if (strokeColor && strokeColor.hasOwnProperty("type") && strokeColor.type === "Pattern") {
        ctx.save();
        const transform = ctx.mozCurrentTransform;

        const scale = _util.Util.singularValueDecompose2dScale(transform)[0];

        ctx.strokeStyle = strokeColor.getPattern(ctx, this);
        ctx.lineWidth = Math.max(this.getSinglePixelWidth() * MIN_WIDTH_FACTOR, this.current.lineWidth * scale);
        ctx.stroke();
        ctx.restore();
      } else {
        ctx.lineWidth = Math.max(this.getSinglePixelWidth() * MIN_WIDTH_FACTOR, this.current.lineWidth);
        ctx.stroke();
      }

      if (consumePath) {
        this.consumePath();
      }

      ctx.globalAlpha = this.current.fillAlpha;
    },
    closeStroke: function CanvasGraphics_closeStroke() {
      this.closePath();
      this.stroke();
    },
    fill: function CanvasGraphics_fill(consumePath) {
      consumePath = typeof consumePath !== "undefined" ? consumePath : true;
      var ctx = this.ctx;
      var fillColor = this.current.fillColor;
      var isPatternFill = this.current.patternFill;
      var needRestore = false;

      if (isPatternFill) {
        ctx.save();

        if (this.baseTransform) {
          ctx.setTransform.apply(ctx, this.baseTransform);
        }

        ctx.fillStyle = fillColor.getPattern(ctx, this);
        needRestore = true;
      }

      if (this.pendingEOFill) {
        ctx.fill("evenodd");
        this.pendingEOFill = false;
      } else {
        ctx.fill();
      }

      if (needRestore) {
        ctx.restore();
      }

      if (consumePath) {
        this.consumePath();
      }
    },
    eoFill: function CanvasGraphics_eoFill() {
      this.pendingEOFill = true;
      this.fill();
    },
    fillStroke: function CanvasGraphics_fillStroke() {
      this.fill(false);
      this.stroke(false);
      this.consumePath();
    },
    eoFillStroke: function CanvasGraphics_eoFillStroke() {
      this.pendingEOFill = true;
      this.fillStroke();
    },
    closeFillStroke: function CanvasGraphics_closeFillStroke() {
      this.closePath();
      this.fillStroke();
    },
    closeEOFillStroke: function CanvasGraphics_closeEOFillStroke() {
      this.pendingEOFill = true;
      this.closePath();
      this.fillStroke();
    },
    endPath: function CanvasGraphics_endPath() {
      this.consumePath();
    },
    clip: function CanvasGraphics_clip() {
      this.pendingClip = NORMAL_CLIP;
    },
    eoClip: function CanvasGraphics_eoClip() {
      this.pendingClip = EO_CLIP;
    },
    beginText: function CanvasGraphics_beginText() {
      this.current.textMatrix = _util.IDENTITY_MATRIX;
      this.current.textMatrixScale = 1;
      this.current.x = this.current.lineX = 0;
      this.current.y = this.current.lineY = 0;
    },
    endText: function CanvasGraphics_endText() {
      var paths = this.pendingTextPaths;
      var ctx = this.ctx;

      if (paths === undefined) {
        ctx.beginPath();
        return;
      }

      ctx.save();
      ctx.beginPath();

      for (var i = 0; i < paths.length; i++) {
        var path = paths[i];
        ctx.setTransform.apply(ctx, path.transform);
        ctx.translate(path.x, path.y);
        path.addToPath(ctx, path.fontSize);
      }

      ctx.restore();
      ctx.clip();
      ctx.beginPath();
      delete this.pendingTextPaths;
    },
    setCharSpacing: function CanvasGraphics_setCharSpacing(spacing) {
      this.current.charSpacing = spacing;
    },
    setWordSpacing: function CanvasGraphics_setWordSpacing(spacing) {
      this.current.wordSpacing = spacing;
    },
    setHScale: function CanvasGraphics_setHScale(scale) {
      this.current.textHScale = scale / 100;
    },
    setLeading: function CanvasGraphics_setLeading(leading) {
      this.current.leading = -leading;
    },
    setFont: function CanvasGraphics_setFont(fontRefName, size) {
      var fontObj = this.commonObjs.get(fontRefName);
      var current = this.current;

      if (!fontObj) {
        throw new Error(`Can't find font for ${fontRefName}`);
      }

      current.fontMatrix = fontObj.fontMatrix ? fontObj.fontMatrix : _util.FONT_IDENTITY_MATRIX;

      if (current.fontMatrix[0] === 0 || current.fontMatrix[3] === 0) {
        (0, _util.warn)("Invalid font matrix for font " + fontRefName);
      }

      if (size < 0) {
        size = -size;
        current.fontDirection = -1;
      } else {
        current.fontDirection = 1;
      }

      this.current.font = fontObj;
      this.current.fontSize = size;

      if (fontObj.isType3Font) {
        return;
      }

      var name = fontObj.loadedName || "sans-serif";
      let bold = "normal";

      if (fontObj.black) {
        bold = "900";
      } else if (fontObj.bold) {
        bold = "bold";
      }

      var italic = fontObj.italic ? "italic" : "normal";
      var typeface = `"${name}", ${fontObj.fallbackName}`;
      let browserFontSize = size;

      if (size < MIN_FONT_SIZE) {
        browserFontSize = MIN_FONT_SIZE;
      } else if (size > MAX_FONT_SIZE) {
        browserFontSize = MAX_FONT_SIZE;
      }

      this.current.fontSizeScale = size / browserFontSize;
      this.ctx.font = `${italic} ${bold} ${browserFontSize}px ${typeface}`;
    },
    setTextRenderingMode: function CanvasGraphics_setTextRenderingMode(mode) {
      this.current.textRenderingMode = mode;
    },
    setTextRise: function CanvasGraphics_setTextRise(rise) {
      this.current.textRise = rise;
    },
    moveText: function CanvasGraphics_moveText(x, y) {
      this.current.x = this.current.lineX += x;
      this.current.y = this.current.lineY += y;
    },
    setLeadingMoveText: function CanvasGraphics_setLeadingMoveText(x, y) {
      this.setLeading(-y);
      this.moveText(x, y);
    },
    setTextMatrix: function CanvasGraphics_setTextMatrix(a, b, c, d, e, f) {
      this.current.textMatrix = [a, b, c, d, e, f];
      this.current.textMatrixScale = Math.sqrt(a * a + b * b);
      this.current.x = this.current.lineX = 0;
      this.current.y = this.current.lineY = 0;
    },
    nextLine: function CanvasGraphics_nextLine() {
      this.moveText(0, this.current.leading);
    },

    paintChar(character, x, y, patternTransform) {
      var ctx = this.ctx;
      var current = this.current;
      var font = current.font;
      var textRenderingMode = current.textRenderingMode;
      var fontSize = current.fontSize / current.fontSizeScale;
      var fillStrokeMode = textRenderingMode & _util.TextRenderingMode.FILL_STROKE_MASK;
      var isAddToPathSet = !!(textRenderingMode & _util.TextRenderingMode.ADD_TO_PATH_FLAG);
      const patternFill = current.patternFill && !font.missingFile;
      var addToPath;

      if (font.disableFontFace || isAddToPathSet || patternFill) {
        addToPath = font.getPathGenerator(this.commonObjs, character);
      }

      if (font.disableFontFace || patternFill) {
        ctx.save();
        ctx.translate(x, y);
        ctx.beginPath();
        addToPath(ctx, fontSize);

        if (patternTransform) {
          ctx.setTransform.apply(ctx, patternTransform);
        }

        if (fillStrokeMode === _util.TextRenderingMode.FILL || fillStrokeMode === _util.TextRenderingMode.FILL_STROKE) {
          ctx.fill();
        }

        if (fillStrokeMode === _util.TextRenderingMode.STROKE || fillStrokeMode === _util.TextRenderingMode.FILL_STROKE) {
          ctx.stroke();
        }

        ctx.restore();
      } else {
        if (fillStrokeMode === _util.TextRenderingMode.FILL || fillStrokeMode === _util.TextRenderingMode.FILL_STROKE) {
          ctx.fillText(character, x, y);
        }

        if (fillStrokeMode === _util.TextRenderingMode.STROKE || fillStrokeMode === _util.TextRenderingMode.FILL_STROKE) {
          ctx.strokeText(character, x, y);
        }
      }

      if (isAddToPathSet) {
        var paths = this.pendingTextPaths || (this.pendingTextPaths = []);
        paths.push({
          transform: ctx.mozCurrentTransform,
          x,
          y,
          fontSize,
          addToPath
        });
      }
    },

    get isFontSubpixelAAEnabled() {
      const {
        context: ctx
      } = this.cachedCanvases.getCanvas("isFontSubpixelAAEnabled", 10, 10);
      ctx.scale(1.5, 1);
      ctx.fillText("I", 0, 10);
      var data = ctx.getImageData(0, 0, 10, 10).data;
      var enabled = false;

      for (var i = 3; i < data.length; i += 4) {
        if (data[i] > 0 && data[i] < 255) {
          enabled = true;
          break;
        }
      }

      return (0, _util.shadow)(this, "isFontSubpixelAAEnabled", enabled);
    },

    showText: function CanvasGraphics_showText(glyphs) {
      var current = this.current;
      var font = current.font;

      if (font.isType3Font) {
        return this.showType3Text(glyphs);
      }

      var fontSize = current.fontSize;

      if (fontSize === 0) {
        return undefined;
      }

      var ctx = this.ctx;
      var fontSizeScale = current.fontSizeScale;
      var charSpacing = current.charSpacing;
      var wordSpacing = current.wordSpacing;
      var fontDirection = current.fontDirection;
      var textHScale = current.textHScale * fontDirection;
      var glyphsLength = glyphs.length;
      var vertical = font.vertical;
      var spacingDir = vertical ? 1 : -1;
      var defaultVMetrics = font.defaultVMetrics;
      var widthAdvanceScale = fontSize * current.fontMatrix[0];
      var simpleFillText = current.textRenderingMode === _util.TextRenderingMode.FILL && !font.disableFontFace && !current.patternFill;
      ctx.save();
      let patternTransform;

      if (current.patternFill) {
        ctx.save();
        const pattern = current.fillColor.getPattern(ctx, this);
        patternTransform = ctx.mozCurrentTransform;
        ctx.restore();
        ctx.fillStyle = pattern;
      }

      ctx.transform.apply(ctx, current.textMatrix);
      ctx.translate(current.x, current.y + current.textRise);

      if (fontDirection > 0) {
        ctx.scale(textHScale, -1);
      } else {
        ctx.scale(textHScale, 1);
      }

      var lineWidth = current.lineWidth;
      var scale = current.textMatrixScale;

      if (scale === 0 || lineWidth === 0) {
        var fillStrokeMode = current.textRenderingMode & _util.TextRenderingMode.FILL_STROKE_MASK;

        if (fillStrokeMode === _util.TextRenderingMode.STROKE || fillStrokeMode === _util.TextRenderingMode.FILL_STROKE) {
          this._cachedGetSinglePixelWidth = null;
          lineWidth = this.getSinglePixelWidth() * MIN_WIDTH_FACTOR;
        }
      } else {
        lineWidth /= scale;
      }

      if (fontSizeScale !== 1.0) {
        ctx.scale(fontSizeScale, fontSizeScale);
        lineWidth /= fontSizeScale;
      }

      ctx.lineWidth = lineWidth;
      var x = 0,
          i;

      for (i = 0; i < glyphsLength; ++i) {
        var glyph = glyphs[i];

        if ((0, _util.isNum)(glyph)) {
          x += spacingDir * glyph * fontSize / 1000;
          continue;
        }

        var restoreNeeded = false;
        var spacing = (glyph.isSpace ? wordSpacing : 0) + charSpacing;
        var character = glyph.fontChar;
        var accent = glyph.accent;
        var scaledX, scaledY, scaledAccentX, scaledAccentY;
        var width = glyph.width;

        if (vertical) {
          var vmetric, vx, vy;
          vmetric = glyph.vmetric || defaultVMetrics;
          vx = glyph.vmetric ? vmetric[1] : width * 0.5;
          vx = -vx * widthAdvanceScale;
          vy = vmetric[2] * widthAdvanceScale;
          width = vmetric ? -vmetric[0] : width;
          scaledX = vx / fontSizeScale;
          scaledY = (x + vy) / fontSizeScale;
        } else {
          scaledX = x / fontSizeScale;
          scaledY = 0;
        }

        if (font.remeasure && width > 0) {
          var measuredWidth = ctx.measureText(character).width * 1000 / fontSize * fontSizeScale;

          if (width < measuredWidth && this.isFontSubpixelAAEnabled) {
            var characterScaleX = width / measuredWidth;
            restoreNeeded = true;
            ctx.save();
            ctx.scale(characterScaleX, 1);
            scaledX /= characterScaleX;
          } else if (width !== measuredWidth) {
            scaledX += (width - measuredWidth) / 2000 * fontSize / fontSizeScale;
          }
        }

        if (glyph.isInFont || font.missingFile) {
          if (simpleFillText && !accent) {
            ctx.fillText(character, scaledX, scaledY);
          } else {
            this.paintChar(character, scaledX, scaledY, patternTransform);

            if (accent) {
              scaledAccentX = scaledX + accent.offset.x / fontSizeScale;
              scaledAccentY = scaledY - accent.offset.y / fontSizeScale;
              this.paintChar(accent.fontChar, scaledAccentX, scaledAccentY, patternTransform);
            }
          }
        }

        var charWidth;

        if (vertical) {
          charWidth = width * widthAdvanceScale - spacing * fontDirection;
        } else {
          charWidth = width * widthAdvanceScale + spacing * fontDirection;
        }

        x += charWidth;

        if (restoreNeeded) {
          ctx.restore();
        }
      }

      if (vertical) {
        current.y -= x;
      } else {
        current.x += x * textHScale;
      }

      ctx.restore();
    },
    showType3Text: function CanvasGraphics_showType3Text(glyphs) {
      var ctx = this.ctx;
      var current = this.current;
      var font = current.font;
      var fontSize = current.fontSize;
      var fontDirection = current.fontDirection;
      var spacingDir = font.vertical ? 1 : -1;
      var charSpacing = current.charSpacing;
      var wordSpacing = current.wordSpacing;
      var textHScale = current.textHScale * fontDirection;
      var fontMatrix = current.fontMatrix || _util.FONT_IDENTITY_MATRIX;
      var glyphsLength = glyphs.length;
      var isTextInvisible = current.textRenderingMode === _util.TextRenderingMode.INVISIBLE;
      var i, glyph, width, spacingLength;

      if (isTextInvisible || fontSize === 0) {
        return;
      }

      this._cachedGetSinglePixelWidth = null;
      ctx.save();
      ctx.transform.apply(ctx, current.textMatrix);
      ctx.translate(current.x, current.y);
      ctx.scale(textHScale, fontDirection);

      for (i = 0; i < glyphsLength; ++i) {
        glyph = glyphs[i];

        if ((0, _util.isNum)(glyph)) {
          spacingLength = spacingDir * glyph * fontSize / 1000;
          this.ctx.translate(spacingLength, 0);
          current.x += spacingLength * textHScale;
          continue;
        }

        var spacing = (glyph.isSpace ? wordSpacing : 0) + charSpacing;
        var operatorList = font.charProcOperatorList[glyph.operatorListId];

        if (!operatorList) {
          (0, _util.warn)(`Type3 character "${glyph.operatorListId}" is not available.`);
          continue;
        }

        this.processingType3 = glyph;
        this.save();
        ctx.scale(fontSize, fontSize);
        ctx.transform.apply(ctx, fontMatrix);
        this.executeOperatorList(operatorList);
        this.restore();

        var transformed = _util.Util.applyTransform([glyph.width, 0], fontMatrix);

        width = transformed[0] * fontSize + spacing;
        ctx.translate(width, 0);
        current.x += width * textHScale;
      }

      ctx.restore();
      this.processingType3 = null;
    },
    setCharWidth: function CanvasGraphics_setCharWidth(xWidth, yWidth) {},
    setCharWidthAndBounds: function CanvasGraphics_setCharWidthAndBounds(xWidth, yWidth, llx, lly, urx, ury) {
      this.ctx.rect(llx, lly, urx - llx, ury - lly);
      this.clip();
      this.endPath();
    },
    getColorN_Pattern: function CanvasGraphics_getColorN_Pattern(IR) {
      var pattern;

      if (IR[0] === "TilingPattern") {
        var color = IR[1];
        var baseTransform = this.baseTransform || this.ctx.mozCurrentTransform.slice();
        var canvasGraphicsFactory = {
          createCanvasGraphics: ctx => {
            return new CanvasGraphics(ctx, this.commonObjs, this.objs, this.canvasFactory, this.webGLContext);
          }
        };
        pattern = new _pattern_helper.TilingPattern(IR, color, this.ctx, canvasGraphicsFactory, baseTransform);
      } else {
        pattern = (0, _pattern_helper.getShadingPatternFromIR)(IR);
      }

      return pattern;
    },
    setStrokeColorN: function CanvasGraphics_setStrokeColorN() {
      this.current.strokeColor = this.getColorN_Pattern(arguments);
    },
    setFillColorN: function CanvasGraphics_setFillColorN() {
      this.current.fillColor = this.getColorN_Pattern(arguments);
      this.current.patternFill = true;
    },
    setStrokeRGBColor: function CanvasGraphics_setStrokeRGBColor(r, g, b) {
      var color = _util.Util.makeCssRgb(r, g, b);

      this.ctx.strokeStyle = color;
      this.current.strokeColor = color;
    },
    setFillRGBColor: function CanvasGraphics_setFillRGBColor(r, g, b) {
      var color = _util.Util.makeCssRgb(r, g, b);

      this.ctx.fillStyle = color;
      this.current.fillColor = color;
      this.current.patternFill = false;
    },
    shadingFill: function CanvasGraphics_shadingFill(patternIR) {
      var ctx = this.ctx;
      this.save();
      var pattern = (0, _pattern_helper.getShadingPatternFromIR)(patternIR);
      ctx.fillStyle = pattern.getPattern(ctx, this, true);
      var inv = ctx.mozCurrentTransformInverse;

      if (inv) {
        var canvas = ctx.canvas;
        var width = canvas.width;
        var height = canvas.height;

        var bl = _util.Util.applyTransform([0, 0], inv);

        var br = _util.Util.applyTransform([0, height], inv);

        var ul = _util.Util.applyTransform([width, 0], inv);

        var ur = _util.Util.applyTransform([width, height], inv);

        var x0 = Math.min(bl[0], br[0], ul[0], ur[0]);
        var y0 = Math.min(bl[1], br[1], ul[1], ur[1]);
        var x1 = Math.max(bl[0], br[0], ul[0], ur[0]);
        var y1 = Math.max(bl[1], br[1], ul[1], ur[1]);
        this.ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
      } else {
        this.ctx.fillRect(-1e10, -1e10, 2e10, 2e10);
      }

      this.restore();
    },
    beginInlineImage: function CanvasGraphics_beginInlineImage() {
      (0, _util.unreachable)("Should not call beginInlineImage");
    },
    beginImageData: function CanvasGraphics_beginImageData() {
      (0, _util.unreachable)("Should not call beginImageData");
    },
    paintFormXObjectBegin: function CanvasGraphics_paintFormXObjectBegin(matrix, bbox) {
      this.save();
      this.baseTransformStack.push(this.baseTransform);

      if (Array.isArray(matrix) && matrix.length === 6) {
        this.transform.apply(this, matrix);
      }

      this.baseTransform = this.ctx.mozCurrentTransform;

      if (bbox) {
        var width = bbox[2] - bbox[0];
        var height = bbox[3] - bbox[1];
        this.ctx.rect(bbox[0], bbox[1], width, height);
        this.clip();
        this.endPath();
      }
    },
    paintFormXObjectEnd: function CanvasGraphics_paintFormXObjectEnd() {
      this.restore();
      this.baseTransform = this.baseTransformStack.pop();
    },
    beginGroup: function CanvasGraphics_beginGroup(group) {
      this.save();
      var currentCtx = this.ctx;

      if (!group.isolated) {
        (0, _util.info)("TODO: Support non-isolated groups.");
      }

      if (group.knockout) {
        (0, _util.warn)("Knockout groups not supported.");
      }

      var currentTransform = currentCtx.mozCurrentTransform;

      if (group.matrix) {
        currentCtx.transform.apply(currentCtx, group.matrix);
      }

      if (!group.bbox) {
        throw new Error("Bounding box is required.");
      }

      var bounds = _util.Util.getAxialAlignedBoundingBox(group.bbox, currentCtx.mozCurrentTransform);

      var canvasBounds = [0, 0, currentCtx.canvas.width, currentCtx.canvas.height];
      bounds = _util.Util.intersect(bounds, canvasBounds) || [0, 0, 0, 0];
      var offsetX = Math.floor(bounds[0]);
      var offsetY = Math.floor(bounds[1]);
      var drawnWidth = Math.max(Math.ceil(bounds[2]) - offsetX, 1);
      var drawnHeight = Math.max(Math.ceil(bounds[3]) - offsetY, 1);
      var scaleX = 1,
          scaleY = 1;

      if (drawnWidth > MAX_GROUP_SIZE) {
        scaleX = drawnWidth / MAX_GROUP_SIZE;
        drawnWidth = MAX_GROUP_SIZE;
      }

      if (drawnHeight > MAX_GROUP_SIZE) {
        scaleY = drawnHeight / MAX_GROUP_SIZE;
        drawnHeight = MAX_GROUP_SIZE;
      }

      var cacheId = "groupAt" + this.groupLevel;

      if (group.smask) {
        cacheId += "_smask_" + this.smaskCounter++ % 2;
      }

      var scratchCanvas = this.cachedCanvases.getCanvas(cacheId, drawnWidth, drawnHeight, true);
      var groupCtx = scratchCanvas.context;
      groupCtx.scale(1 / scaleX, 1 / scaleY);
      groupCtx.translate(-offsetX, -offsetY);
      groupCtx.transform.apply(groupCtx, currentTransform);

      if (group.smask) {
        this.smaskStack.push({
          canvas: scratchCanvas.canvas,
          context: groupCtx,
          offsetX,
          offsetY,
          scaleX,
          scaleY,
          subtype: group.smask.subtype,
          backdrop: group.smask.backdrop,
          transferMap: group.smask.transferMap || null,
          startTransformInverse: null
        });
      } else {
        currentCtx.setTransform(1, 0, 0, 1, 0, 0);
        currentCtx.translate(offsetX, offsetY);
        currentCtx.scale(scaleX, scaleY);
      }

      copyCtxState(currentCtx, groupCtx);
      this.ctx = groupCtx;
      this.setGState([["BM", "source-over"], ["ca", 1], ["CA", 1]]);
      this.groupStack.push(currentCtx);
      this.groupLevel++;
      this.current.activeSMask = null;
    },
    endGroup: function CanvasGraphics_endGroup(group) {
      this.groupLevel--;
      var groupCtx = this.ctx;
      this.ctx = this.groupStack.pop();

      if (this.ctx.imageSmoothingEnabled !== undefined) {
        this.ctx.imageSmoothingEnabled = false;
      } else {
        this.ctx.mozImageSmoothingEnabled = false;
      }

      if (group.smask) {
        this.tempSMask = this.smaskStack.pop();
      } else {
        this.ctx.drawImage(groupCtx.canvas, 0, 0);
      }

      this.restore();
    },
    beginAnnotations: function CanvasGraphics_beginAnnotations() {
      this.save();

      if (this.baseTransform) {
        this.ctx.setTransform.apply(this.ctx, this.baseTransform);
      }
    },
    endAnnotations: function CanvasGraphics_endAnnotations() {
      this.restore();
    },
    beginAnnotation: function CanvasGraphics_beginAnnotation(rect, transform, matrix) {
      this.save();
      resetCtxToDefault(this.ctx);
      this.current = new CanvasExtraState();

      if (Array.isArray(rect) && rect.length === 4) {
        var width = rect[2] - rect[0];
        var height = rect[3] - rect[1];
        this.ctx.rect(rect[0], rect[1], width, height);
        this.clip();
        this.endPath();
      }

      this.transform.apply(this, transform);
      this.transform.apply(this, matrix);
    },
    endAnnotation: function CanvasGraphics_endAnnotation() {
      this.restore();
    },
    paintImageMaskXObject: function CanvasGraphics_paintImageMaskXObject(img) {
      var ctx = this.ctx;
      var width = img.width,
          height = img.height;
      var fillColor = this.current.fillColor;
      var isPatternFill = this.current.patternFill;
      var glyph = this.processingType3;

      if ( glyph && glyph.compiled === undefined) {
        if (width <= MAX_SIZE_TO_COMPILE && height <= MAX_SIZE_TO_COMPILE) {
          glyph.compiled = compileType3Glyph({
            data: img.data,
            width,
            height
          });
        } else {
          glyph.compiled = null;
        }
      }

      if (glyph && glyph.compiled) {
        glyph.compiled(ctx);
        return;
      }

      var maskCanvas = this.cachedCanvases.getCanvas("maskCanvas", width, height);
      var maskCtx = maskCanvas.context;
      maskCtx.save();
      putBinaryImageMask(maskCtx, img);
      maskCtx.globalCompositeOperation = "source-in";
      maskCtx.fillStyle = isPatternFill ? fillColor.getPattern(maskCtx, this) : fillColor;
      maskCtx.fillRect(0, 0, width, height);
      maskCtx.restore();
      this.paintInlineImageXObject(maskCanvas.canvas);
    },
    paintImageMaskXObjectRepeat: function CanvasGraphics_paintImageMaskXObjectRepeat(imgData, scaleX, scaleY, positions) {
      var width = imgData.width;
      var height = imgData.height;
      var fillColor = this.current.fillColor;
      var isPatternFill = this.current.patternFill;
      var maskCanvas = this.cachedCanvases.getCanvas("maskCanvas", width, height);
      var maskCtx = maskCanvas.context;
      maskCtx.save();
      putBinaryImageMask(maskCtx, imgData);
      maskCtx.globalCompositeOperation = "source-in";
      maskCtx.fillStyle = isPatternFill ? fillColor.getPattern(maskCtx, this) : fillColor;
      maskCtx.fillRect(0, 0, width, height);
      maskCtx.restore();
      var ctx = this.ctx;

      for (var i = 0, ii = positions.length; i < ii; i += 2) {
        ctx.save();
        ctx.transform(scaleX, 0, 0, scaleY, positions[i], positions[i + 1]);
        ctx.scale(1, -1);
        ctx.drawImage(maskCanvas.canvas, 0, 0, width, height, 0, -1, 1, 1);
        ctx.restore();
      }
    },
    paintImageMaskXObjectGroup: function CanvasGraphics_paintImageMaskXObjectGroup(images) {
      var ctx = this.ctx;
      var fillColor = this.current.fillColor;
      var isPatternFill = this.current.patternFill;

      for (var i = 0, ii = images.length; i < ii; i++) {
        var image = images[i];
        var width = image.width,
            height = image.height;
        var maskCanvas = this.cachedCanvases.getCanvas("maskCanvas", width, height);
        var maskCtx = maskCanvas.context;
        maskCtx.save();
        putBinaryImageMask(maskCtx, image);
        maskCtx.globalCompositeOperation = "source-in";
        maskCtx.fillStyle = isPatternFill ? fillColor.getPattern(maskCtx, this) : fillColor;
        maskCtx.fillRect(0, 0, width, height);
        maskCtx.restore();
        ctx.save();
        ctx.transform.apply(ctx, image.transform);
        ctx.scale(1, -1);
        ctx.drawImage(maskCanvas.canvas, 0, 0, width, height, 0, -1, 1, 1);
        ctx.restore();
      }
    },
    paintImageXObject: function CanvasGraphics_paintImageXObject(objId) {
      const imgData = objId.startsWith("g_") ? this.commonObjs.get(objId) : this.objs.get(objId);

      if (!imgData) {
        (0, _util.warn)("Dependent image isn't ready yet");
        return;
      }

      this.paintInlineImageXObject(imgData);
    },
    paintImageXObjectRepeat: function CanvasGraphics_paintImageXObjectRepeat(objId, scaleX, scaleY, positions) {
      const imgData = objId.startsWith("g_") ? this.commonObjs.get(objId) : this.objs.get(objId);

      if (!imgData) {
        (0, _util.warn)("Dependent image isn't ready yet");
        return;
      }

      var width = imgData.width;
      var height = imgData.height;
      var map = [];

      for (var i = 0, ii = positions.length; i < ii; i += 2) {
        map.push({
          transform: [scaleX, 0, 0, scaleY, positions[i], positions[i + 1]],
          x: 0,
          y: 0,
          w: width,
          h: height
        });
      }

      this.paintInlineImageXObjectGroup(imgData, map);
    },
    paintInlineImageXObject: function CanvasGraphics_paintInlineImageXObject(imgData) {
      var width = imgData.width;
      var height = imgData.height;
      var ctx = this.ctx;
      this.save();
      ctx.scale(1 / width, -1 / height);
      var currentTransform = ctx.mozCurrentTransformInverse;
      var a = currentTransform[0],
          b = currentTransform[1];
      var widthScale = Math.max(Math.sqrt(a * a + b * b), 1);
      var c = currentTransform[2],
          d = currentTransform[3];
      var heightScale = Math.max(Math.sqrt(c * c + d * d), 1);
      var imgToPaint, tmpCanvas;

      if (typeof HTMLElement === "function" && imgData instanceof HTMLElement || !imgData.data) {
        imgToPaint = imgData;
      } else {
        tmpCanvas = this.cachedCanvases.getCanvas("inlineImage", width, height);
        var tmpCtx = tmpCanvas.context;
        putBinaryImageData(tmpCtx, imgData);
        imgToPaint = tmpCanvas.canvas;
      }

      var paintWidth = width,
          paintHeight = height;
      var tmpCanvasId = "prescale1";

      while (widthScale > 2 && paintWidth > 1 || heightScale > 2 && paintHeight > 1) {
        var newWidth = paintWidth,
            newHeight = paintHeight;

        if (widthScale > 2 && paintWidth > 1) {
          newWidth = Math.ceil(paintWidth / 2);
          widthScale /= paintWidth / newWidth;
        }

        if (heightScale > 2 && paintHeight > 1) {
          newHeight = Math.ceil(paintHeight / 2);
          heightScale /= paintHeight / newHeight;
        }

        tmpCanvas = this.cachedCanvases.getCanvas(tmpCanvasId, newWidth, newHeight);
        tmpCtx = tmpCanvas.context;
        tmpCtx.clearRect(0, 0, newWidth, newHeight);
        tmpCtx.drawImage(imgToPaint, 0, 0, paintWidth, paintHeight, 0, 0, newWidth, newHeight);
        imgToPaint = tmpCanvas.canvas;
        paintWidth = newWidth;
        paintHeight = newHeight;
        tmpCanvasId = tmpCanvasId === "prescale1" ? "prescale2" : "prescale1";
      }

      ctx.drawImage(imgToPaint, 0, 0, paintWidth, paintHeight, 0, -height, width, height);

      if (this.imageLayer) {
        var position = this.getCanvasPosition(0, -height);
        this.imageLayer.appendImage({
          imgData,
          left: position[0],
          top: position[1],
          width: width / currentTransform[0],
          height: height / currentTransform[3]
        });
      }

      this.restore();
    },
    paintInlineImageXObjectGroup: function CanvasGraphics_paintInlineImageXObjectGroup(imgData, map) {
      var ctx = this.ctx;
      var w = imgData.width;
      var h = imgData.height;
      var tmpCanvas = this.cachedCanvases.getCanvas("inlineImage", w, h);
      var tmpCtx = tmpCanvas.context;
      putBinaryImageData(tmpCtx, imgData);

      for (var i = 0, ii = map.length; i < ii; i++) {
        var entry = map[i];
        ctx.save();
        ctx.transform.apply(ctx, entry.transform);
        ctx.scale(1, -1);
        ctx.drawImage(tmpCanvas.canvas, entry.x, entry.y, entry.w, entry.h, 0, -1, 1, 1);

        if (this.imageLayer) {
          var position = this.getCanvasPosition(entry.x, entry.y);
          this.imageLayer.appendImage({
            imgData,
            left: position[0],
            top: position[1],
            width: w,
            height: h
          });
        }

        ctx.restore();
      }
    },
    paintSolidColorImageMask: function CanvasGraphics_paintSolidColorImageMask() {
      this.ctx.fillRect(0, 0, 1, 1);
    },
    paintXObject: function CanvasGraphics_paintXObject() {
      (0, _util.warn)("Unsupported 'paintXObject' command.");
    },
    markPoint: function CanvasGraphics_markPoint(tag) {},
    markPointProps: function CanvasGraphics_markPointProps(tag, properties) {},
    beginMarkedContent: function CanvasGraphics_beginMarkedContent(tag) {},
    beginMarkedContentProps: function CanvasGraphics_beginMarkedContentProps(tag, properties) {},
    endMarkedContent: function CanvasGraphics_endMarkedContent() {},
    beginCompat: function CanvasGraphics_beginCompat() {},
    endCompat: function CanvasGraphics_endCompat() {},
    consumePath: function CanvasGraphics_consumePath() {
      var ctx = this.ctx;

      if (this.pendingClip) {
        if (this.pendingClip === EO_CLIP) {
          ctx.clip("evenodd");
        } else {
          ctx.clip();
        }

        this.pendingClip = null;
      }

      ctx.beginPath();
    },

    getSinglePixelWidth(scale) {
      if (this._cachedGetSinglePixelWidth === null) {
        const inverse = this.ctx.mozCurrentTransformInverse;
        this._cachedGetSinglePixelWidth = Math.sqrt(Math.max(inverse[0] * inverse[0] + inverse[1] * inverse[1], inverse[2] * inverse[2] + inverse[3] * inverse[3]));
      }

      return this._cachedGetSinglePixelWidth;
    },

    getCanvasPosition: function CanvasGraphics_getCanvasPosition(x, y) {
      var transform = this.ctx.mozCurrentTransform;
      return [transform[0] * x + transform[2] * y + transform[4], transform[1] * x + transform[3] * y + transform[5]];
    }
  };

  for (var op in _util.OPS) {
    CanvasGraphics.prototype[_util.OPS[op]] = CanvasGraphics.prototype[op];
  }

  return CanvasGraphics;
}();

exports.CanvasGraphics = CanvasGraphics;

/***/ }),
/* 9 */
/***/ (function(module, exports, __w_pdfjs_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getShadingPatternFromIR = getShadingPatternFromIR;
exports.TilingPattern = void 0;

var _util = __w_pdfjs_require__(2);

var ShadingIRs = {};

function applyBoundingBox(ctx, bbox) {
  if (!bbox || typeof Path2D === "undefined") {
    return;
  }

  const width = bbox[2] - bbox[0];
  const height = bbox[3] - bbox[1];
  const region = new Path2D();
  region.rect(bbox[0], bbox[1], width, height);
  ctx.clip(region);
}

ShadingIRs.RadialAxial = {
  fromIR: function RadialAxial_fromIR(raw) {
    var type = raw[1];
    var bbox = raw[2];
    var colorStops = raw[3];
    var p0 = raw[4];
    var p1 = raw[5];
    var r0 = raw[6];
    var r1 = raw[7];
    return {
      type: "Pattern",
      getPattern: function RadialAxial_getPattern(ctx) {
        applyBoundingBox(ctx, bbox);
        var grad;

        if (type === "axial") {
          grad = ctx.createLinearGradient(p0[0], p0[1], p1[0], p1[1]);
        } else if (type === "radial") {
          grad = ctx.createRadialGradient(p0[0], p0[1], r0, p1[0], p1[1], r1);
        }

        for (var i = 0, ii = colorStops.length; i < ii; ++i) {
          var c = colorStops[i];
          grad.addColorStop(c[0], c[1]);
        }

        return grad;
      }
    };
  }
};

var createMeshCanvas = function createMeshCanvasClosure() {
  function drawTriangle(data, context, p1, p2, p3, c1, c2, c3) {
    var coords = context.coords,
        colors = context.colors;
    var bytes = data.data,
        rowSize = data.width * 4;
    var tmp;

    if (coords[p1 + 1] > coords[p2 + 1]) {
      tmp = p1;
      p1 = p2;
      p2 = tmp;
      tmp = c1;
      c1 = c2;
      c2 = tmp;
    }

    if (coords[p2 + 1] > coords[p3 + 1]) {
      tmp = p2;
      p2 = p3;
      p3 = tmp;
      tmp = c2;
      c2 = c3;
      c3 = tmp;
    }

    if (coords[p1 + 1] > coords[p2 + 1]) {
      tmp = p1;
      p1 = p2;
      p2 = tmp;
      tmp = c1;
      c1 = c2;
      c2 = tmp;
    }

    var x1 = (coords[p1] + context.offsetX) * context.scaleX;
    var y1 = (coords[p1 + 1] + context.offsetY) * context.scaleY;
    var x2 = (coords[p2] + context.offsetX) * context.scaleX;
    var y2 = (coords[p2 + 1] + context.offsetY) * context.scaleY;
    var x3 = (coords[p3] + context.offsetX) * context.scaleX;
    var y3 = (coords[p3 + 1] + context.offsetY) * context.scaleY;

    if (y1 >= y3) {
      return;
    }

    var c1r = colors[c1],
        c1g = colors[c1 + 1],
        c1b = colors[c1 + 2];
    var c2r = colors[c2],
        c2g = colors[c2 + 1],
        c2b = colors[c2 + 2];
    var c3r = colors[c3],
        c3g = colors[c3 + 1],
        c3b = colors[c3 + 2];
    var minY = Math.round(y1),
        maxY = Math.round(y3);
    var xa, car, cag, cab;
    var xb, cbr, cbg, cbb;

    for (var y = minY; y <= maxY; y++) {
      if (y < y2) {
        let k;

        if (y < y1) {
          k = 0;
        } else if (y1 === y2) {
          k = 1;
        } else {
          k = (y1 - y) / (y1 - y2);
        }

        xa = x1 - (x1 - x2) * k;
        car = c1r - (c1r - c2r) * k;
        cag = c1g - (c1g - c2g) * k;
        cab = c1b - (c1b - c2b) * k;
      } else {
        let k;

        if (y > y3) {
          k = 1;
        } else if (y2 === y3) {
          k = 0;
        } else {
          k = (y2 - y) / (y2 - y3);
        }

        xa = x2 - (x2 - x3) * k;
        car = c2r - (c2r - c3r) * k;
        cag = c2g - (c2g - c3g) * k;
        cab = c2b - (c2b - c3b) * k;
      }

      let k;

      if (y < y1) {
        k = 0;
      } else if (y > y3) {
        k = 1;
      } else {
        k = (y1 - y) / (y1 - y3);
      }

      xb = x1 - (x1 - x3) * k;
      cbr = c1r - (c1r - c3r) * k;
      cbg = c1g - (c1g - c3g) * k;
      cbb = c1b - (c1b - c3b) * k;
      var x1_ = Math.round(Math.min(xa, xb));
      var x2_ = Math.round(Math.max(xa, xb));
      var j = rowSize * y + x1_ * 4;

      for (var x = x1_; x <= x2_; x++) {
        k = (xa - x) / (xa - xb);

        if (k < 0) {
          k = 0;
        } else if (k > 1) {
          k = 1;
        }

        bytes[j++] = car - (car - cbr) * k | 0;
        bytes[j++] = cag - (cag - cbg) * k | 0;
        bytes[j++] = cab - (cab - cbb) * k | 0;
        bytes[j++] = 255;
      }
    }
  }

  function drawFigure(data, figure, context) {
    var ps = figure.coords;
    var cs = figure.colors;
    var i, ii;

    switch (figure.type) {
      case "lattice":
        var verticesPerRow = figure.verticesPerRow;
        var rows = Math.floor(ps.length / verticesPerRow) - 1;
        var cols = verticesPerRow - 1;

        for (i = 0; i < rows; i++) {
          var q = i * verticesPerRow;

          for (var j = 0; j < cols; j++, q++) {
            drawTriangle(data, context, ps[q], ps[q + 1], ps[q + verticesPerRow], cs[q], cs[q + 1], cs[q + verticesPerRow]);
            drawTriangle(data, context, ps[q + verticesPerRow + 1], ps[q + 1], ps[q + verticesPerRow], cs[q + verticesPerRow + 1], cs[q + 1], cs[q + verticesPerRow]);
          }
        }

        break;

      case "triangles":
        for (i = 0, ii = ps.length; i < ii; i += 3) {
          drawTriangle(data, context, ps[i], ps[i + 1], ps[i + 2], cs[i], cs[i + 1], cs[i + 2]);
        }

        break;

      default:
        throw new Error("illegal figure");
    }
  }

  function createMeshCanvas(bounds, combinesScale, coords, colors, figures, backgroundColor, cachedCanvases, webGLContext) {
    var EXPECTED_SCALE = 1.1;
    var MAX_PATTERN_SIZE = 3000;
    var BORDER_SIZE = 2;
    var offsetX = Math.floor(bounds[0]);
    var offsetY = Math.floor(bounds[1]);
    var boundsWidth = Math.ceil(bounds[2]) - offsetX;
    var boundsHeight = Math.ceil(bounds[3]) - offsetY;
    var width = Math.min(Math.ceil(Math.abs(boundsWidth * combinesScale[0] * EXPECTED_SCALE)), MAX_PATTERN_SIZE);
    var height = Math.min(Math.ceil(Math.abs(boundsHeight * combinesScale[1] * EXPECTED_SCALE)), MAX_PATTERN_SIZE);
    var scaleX = boundsWidth / width;
    var scaleY = boundsHeight / height;
    var context = {
      coords,
      colors,
      offsetX: -offsetX,
      offsetY: -offsetY,
      scaleX: 1 / scaleX,
      scaleY: 1 / scaleY
    };
    var paddedWidth = width + BORDER_SIZE * 2;
    var paddedHeight = height + BORDER_SIZE * 2;
    var canvas, tmpCanvas, i, ii;

    if (webGLContext.isEnabled) {
      canvas = webGLContext.drawFigures({
        width,
        height,
        backgroundColor,
        figures,
        context
      });
      tmpCanvas = cachedCanvases.getCanvas("mesh", paddedWidth, paddedHeight, false);
      tmpCanvas.context.drawImage(canvas, BORDER_SIZE, BORDER_SIZE);
      canvas = tmpCanvas.canvas;
    } else {
      tmpCanvas = cachedCanvases.getCanvas("mesh", paddedWidth, paddedHeight, false);
      var tmpCtx = tmpCanvas.context;
      var data = tmpCtx.createImageData(width, height);

      if (backgroundColor) {
        var bytes = data.data;

        for (i = 0, ii = bytes.length; i < ii; i += 4) {
          bytes[i] = backgroundColor[0];
          bytes[i + 1] = backgroundColor[1];
          bytes[i + 2] = backgroundColor[2];
          bytes[i + 3] = 255;
        }
      }

      for (i = 0; i < figures.length; i++) {
        drawFigure(data, figures[i], context);
      }

      tmpCtx.putImageData(data, BORDER_SIZE, BORDER_SIZE);
      canvas = tmpCanvas.canvas;
    }

    return {
      canvas,
      offsetX: offsetX - BORDER_SIZE * scaleX,
      offsetY: offsetY - BORDER_SIZE * scaleY,
      scaleX,
      scaleY
    };
  }

  return createMeshCanvas;
}();

ShadingIRs.Mesh = {
  fromIR: function Mesh_fromIR(raw) {
    var coords = raw[2];
    var colors = raw[3];
    var figures = raw[4];
    var bounds = raw[5];
    var matrix = raw[6];
    var bbox = raw[7];
    var background = raw[8];
    return {
      type: "Pattern",
      getPattern: function Mesh_getPattern(ctx, owner, shadingFill) {
        applyBoundingBox(ctx, bbox);
        var scale;

        if (shadingFill) {
          scale = _util.Util.singularValueDecompose2dScale(ctx.mozCurrentTransform);
        } else {
          scale = _util.Util.singularValueDecompose2dScale(owner.baseTransform);

          if (matrix) {
            var matrixScale = _util.Util.singularValueDecompose2dScale(matrix);

            scale = [scale[0] * matrixScale[0], scale[1] * matrixScale[1]];
          }
        }

        var temporaryPatternCanvas = createMeshCanvas(bounds, scale, coords, colors, figures, shadingFill ? null : background, owner.cachedCanvases, owner.webGLContext);

        if (!shadingFill) {
          ctx.setTransform.apply(ctx, owner.baseTransform);

          if (matrix) {
            ctx.transform.apply(ctx, matrix);
          }
        }

        ctx.translate(temporaryPatternCanvas.offsetX, temporaryPatternCanvas.offsetY);
        ctx.scale(temporaryPatternCanvas.scaleX, temporaryPatternCanvas.scaleY);
        return ctx.createPattern(temporaryPatternCanvas.canvas, "no-repeat");
      }
    };
  }
};
ShadingIRs.Dummy = {
  fromIR: function Dummy_fromIR() {
    return {
      type: "Pattern",
      getPattern: function Dummy_fromIR_getPattern() {
        return "hotpink";
      }
    };
  }
};

function getShadingPatternFromIR(raw) {
  var shadingIR = ShadingIRs[raw[0]];

  if (!shadingIR) {
    throw new Error(`Unknown IR type: ${raw[0]}`);
  }

  return shadingIR.fromIR(raw);
}

var TilingPattern = function TilingPatternClosure() {
  var PaintType = {
    COLORED: 1,
    UNCOLORED: 2
  };
  var MAX_PATTERN_SIZE = 3000;

  function TilingPattern(IR, color, ctx, canvasGraphicsFactory, baseTransform) {
    this.operatorList = IR[2];
    this.matrix = IR[3] || [1, 0, 0, 1, 0, 0];
    this.bbox = IR[4];
    this.xstep = IR[5];
    this.ystep = IR[6];
    this.paintType = IR[7];
    this.tilingType = IR[8];
    this.color = color;
    this.canvasGraphicsFactory = canvasGraphicsFactory;
    this.baseTransform = baseTransform;
    this.type = "Pattern";
    this.ctx = ctx;
  }

  TilingPattern.prototype = {
    createPatternCanvas: function TilinPattern_createPatternCanvas(owner) {
      var operatorList = this.operatorList;
      var bbox = this.bbox;
      var xstep = this.xstep;
      var ystep = this.ystep;
      var paintType = this.paintType;
      var tilingType = this.tilingType;
      var color = this.color;
      var canvasGraphicsFactory = this.canvasGraphicsFactory;
      (0, _util.info)("TilingType: " + tilingType);
      var x0 = bbox[0],
          y0 = bbox[1],
          x1 = bbox[2],
          y1 = bbox[3];

      var matrixScale = _util.Util.singularValueDecompose2dScale(this.matrix);

      var curMatrixScale = _util.Util.singularValueDecompose2dScale(this.baseTransform);

      var combinedScale = [matrixScale[0] * curMatrixScale[0], matrixScale[1] * curMatrixScale[1]];
      var dimx = this.getSizeAndScale(xstep, this.ctx.canvas.width, combinedScale[0]);
      var dimy = this.getSizeAndScale(ystep, this.ctx.canvas.height, combinedScale[1]);
      var tmpCanvas = owner.cachedCanvases.getCanvas("pattern", dimx.size, dimy.size, true);
      var tmpCtx = tmpCanvas.context;
      var graphics = canvasGraphicsFactory.createCanvasGraphics(tmpCtx);
      graphics.groupLevel = owner.groupLevel;
      this.setFillAndStrokeStyleToContext(graphics, paintType, color);
      graphics.transform(dimx.scale, 0, 0, dimy.scale, 0, 0);
      graphics.transform(1, 0, 0, 1, -x0, -y0);
      this.clipBbox(graphics, bbox, x0, y0, x1, y1);
      graphics.executeOperatorList(operatorList);
      this.ctx.transform(1, 0, 0, 1, x0, y0);
      this.ctx.scale(1 / dimx.scale, 1 / dimy.scale);
      return tmpCanvas.canvas;
    },
    getSizeAndScale: function TilingPattern_getSizeAndScale(step, realOutputSize, scale) {
      step = Math.abs(step);
      var maxSize = Math.max(MAX_PATTERN_SIZE, realOutputSize);
      var size = Math.ceil(step * scale);

      if (size >= maxSize) {
        size = maxSize;
      } else {
        scale = size / step;
      }

      return {
        scale,
        size
      };
    },
    clipBbox: function clipBbox(graphics, bbox, x0, y0, x1, y1) {
      if (Array.isArray(bbox) && bbox.length === 4) {
        var bboxWidth = x1 - x0;
        var bboxHeight = y1 - y0;
        graphics.ctx.rect(x0, y0, bboxWidth, bboxHeight);
        graphics.clip();
        graphics.endPath();
      }
    },
    setFillAndStrokeStyleToContext: function setFillAndStrokeStyleToContext(graphics, paintType, color) {
      const context = graphics.ctx,
            current = graphics.current;

      switch (paintType) {
        case PaintType.COLORED:
          var ctx = this.ctx;
          context.fillStyle = ctx.fillStyle;
          context.strokeStyle = ctx.strokeStyle;
          current.fillColor = ctx.fillStyle;
          current.strokeColor = ctx.strokeStyle;
          break;

        case PaintType.UNCOLORED:
          var cssColor = _util.Util.makeCssRgb(color[0], color[1], color[2]);

          context.fillStyle = cssColor;
          context.strokeStyle = cssColor;
          current.fillColor = cssColor;
          current.strokeColor = cssColor;
          break;

        default:
          throw new _util.FormatError(`Unsupported paint type: ${paintType}`);
      }
    },
    getPattern: function TilingPattern_getPattern(ctx, owner) {
      ctx = this.ctx;
      ctx.setTransform.apply(ctx, this.baseTransform);
      ctx.transform.apply(ctx, this.matrix);
      var temporaryPatternCanvas = this.createPatternCanvas(owner);
      return ctx.createPattern(temporaryPatternCanvas, "repeat");
    }
  };
  return TilingPattern;
}();

exports.TilingPattern = TilingPattern;

/***/ }),
/* 10 */
/***/ (function(module, exports, __w_pdfjs_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GlobalWorkerOptions = void 0;
const GlobalWorkerOptions = Object.create(null);
exports.GlobalWorkerOptions = GlobalWorkerOptions;
GlobalWorkerOptions.workerPort = GlobalWorkerOptions.workerPort === undefined ? null : GlobalWorkerOptions.workerPort;
GlobalWorkerOptions.workerSrc = GlobalWorkerOptions.workerSrc === undefined ? "" : GlobalWorkerOptions.workerSrc;

/***/ }),
/* 11 */
/***/ (function(module, exports, __w_pdfjs_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MessageHandler = void 0;

var _util = __w_pdfjs_require__(2);

const CallbackKind = {
  UNKNOWN: 0,
  DATA: 1,
  ERROR: 2
};
const StreamKind = {
  UNKNOWN: 0,
  CANCEL: 1,
  CANCEL_COMPLETE: 2,
  CLOSE: 3,
  ENQUEUE: 4,
  ERROR: 5,
  PULL: 6,
  PULL_COMPLETE: 7,
  START_COMPLETE: 8
};

function wrapReason(reason) {
  if (typeof reason !== "object" || reason === null) {
    return reason;
  }

  switch (reason.name) {
    case "AbortException":
      return new _util.AbortException(reason.message);

    case "MissingPDFException":
      return new _util.MissingPDFException(reason.message);

    case "UnexpectedResponseException":
      return new _util.UnexpectedResponseException(reason.message, reason.status);

    case "UnknownErrorException":
      return new _util.UnknownErrorException(reason.message, reason.details);

    default:
      return new _util.UnknownErrorException(reason.message, reason.toString());
  }
}

class MessageHandler {
  constructor(sourceName, targetName, comObj) {
    this.sourceName = sourceName;
    this.targetName = targetName;
    this.comObj = comObj;
    this.callbackId = 1;
    this.streamId = 1;
    this.postMessageTransfers = true;
    this.streamSinks = Object.create(null);
    this.streamControllers = Object.create(null);
    this.callbackCapabilities = Object.create(null);
    this.actionHandler = Object.create(null);

    this._onComObjOnMessage = event => {
      const data = event.data;

      if (data.targetName !== this.sourceName) {
        return;
      }

      if (data.stream) {
        this._processStreamMessage(data);

        return;
      }

      if (data.callback) {
        const callbackId = data.callbackId;
        const capability = this.callbackCapabilities[callbackId];

        if (!capability) {
          throw new Error(`Cannot resolve callback ${callbackId}`);
        }

        delete this.callbackCapabilities[callbackId];

        if (data.callback === CallbackKind.DATA) {
          capability.resolve(data.data);
        } else if (data.callback === CallbackKind.ERROR) {
          capability.reject(wrapReason(data.reason));
        } else {
          throw new Error("Unexpected callback case");
        }

        return;
      }

      const action = this.actionHandler[data.action];

      if (!action) {
        throw new Error(`Unknown action from worker: ${data.action}`);
      }

      if (data.callbackId) {
        const cbSourceName = this.sourceName;
        const cbTargetName = data.sourceName;
        new Promise(function (resolve) {
          resolve(action(data.data));
        }).then(function (result) {
          comObj.postMessage({
            sourceName: cbSourceName,
            targetName: cbTargetName,
            callback: CallbackKind.DATA,
            callbackId: data.callbackId,
            data: result
          });
        }, function (reason) {
          comObj.postMessage({
            sourceName: cbSourceName,
            targetName: cbTargetName,
            callback: CallbackKind.ERROR,
            callbackId: data.callbackId,
            reason: wrapReason(reason)
          });
        });
        return;
      }

      if (data.streamId) {
        this._createStreamSink(data);

        return;
      }

      action(data.data);
    };

    comObj.addEventListener("message", this._onComObjOnMessage);
  }

  on(actionName, handler) {
    const ah = this.actionHandler;

    if (ah[actionName]) {
      throw new Error(`There is already an actionName called "${actionName}"`);
    }

    ah[actionName] = handler;
  }

  send(actionName, data, transfers) {
    this._postMessage({
      sourceName: this.sourceName,
      targetName: this.targetName,
      action: actionName,
      data
    }, transfers);
  }

  sendWithPromise(actionName, data, transfers) {
    const callbackId = this.callbackId++;
    const capability = (0, _util.createPromiseCapability)();
    this.callbackCapabilities[callbackId] = capability;

    try {
      this._postMessage({
        sourceName: this.sourceName,
        targetName: this.targetName,
        action: actionName,
        callbackId,
        data
      }, transfers);
    } catch (ex) {
      capability.reject(ex);
    }

    return capability.promise;
  }

  sendWithStream(actionName, data, queueingStrategy, transfers) {
    const streamId = this.streamId++;
    const sourceName = this.sourceName;
    const targetName = this.targetName;
    const comObj = this.comObj;
    return new ReadableStream({
      start: controller => {
        const startCapability = (0, _util.createPromiseCapability)();
        this.streamControllers[streamId] = {
          controller,
          startCall: startCapability,
          pullCall: null,
          cancelCall: null,
          isClosed: false
        };

        this._postMessage({
          sourceName,
          targetName,
          action: actionName,
          streamId,
          data,
          desiredSize: controller.desiredSize
        }, transfers);

        return startCapability.promise;
      },
      pull: controller => {
        const pullCapability = (0, _util.createPromiseCapability)();
        this.streamControllers[streamId].pullCall = pullCapability;
        comObj.postMessage({
          sourceName,
          targetName,
          stream: StreamKind.PULL,
          streamId,
          desiredSize: controller.desiredSize
        });
        return pullCapability.promise;
      },
      cancel: reason => {
        (0, _util.assert)(reason instanceof Error, "cancel must have a valid reason");
        const cancelCapability = (0, _util.createPromiseCapability)();
        this.streamControllers[streamId].cancelCall = cancelCapability;
        this.streamControllers[streamId].isClosed = true;
        comObj.postMessage({
          sourceName,
          targetName,
          stream: StreamKind.CANCEL,
          streamId,
          reason: wrapReason(reason)
        });
        return cancelCapability.promise;
      }
    }, queueingStrategy);
  }

  _createStreamSink(data) {
    const self = this;
    const action = this.actionHandler[data.action];
    const streamId = data.streamId;
    const sourceName = this.sourceName;
    const targetName = data.sourceName;
    const comObj = this.comObj;
    const streamSink = {
      enqueue(chunk, size = 1, transfers) {
        if (this.isCancelled) {
          return;
        }

        const lastDesiredSize = this.desiredSize;
        this.desiredSize -= size;

        if (lastDesiredSize > 0 && this.desiredSize <= 0) {
          this.sinkCapability = (0, _util.createPromiseCapability)();
          this.ready = this.sinkCapability.promise;
        }

        self._postMessage({
          sourceName,
          targetName,
          stream: StreamKind.ENQUEUE,
          streamId,
          chunk
        }, transfers);
      },

      close() {
        if (this.isCancelled) {
          return;
        }

        this.isCancelled = true;
        comObj.postMessage({
          sourceName,
          targetName,
          stream: StreamKind.CLOSE,
          streamId
        });
        delete self.streamSinks[streamId];
      },

      error(reason) {
        (0, _util.assert)(reason instanceof Error, "error must have a valid reason");

        if (this.isCancelled) {
          return;
        }

        this.isCancelled = true;
        comObj.postMessage({
          sourceName,
          targetName,
          stream: StreamKind.ERROR,
          streamId,
          reason: wrapReason(reason)
        });
      },

      sinkCapability: (0, _util.createPromiseCapability)(),
      onPull: null,
      onCancel: null,
      isCancelled: false,
      desiredSize: data.desiredSize,
      ready: null
    };
    streamSink.sinkCapability.resolve();
    streamSink.ready = streamSink.sinkCapability.promise;
    this.streamSinks[streamId] = streamSink;
    new Promise(function (resolve) {
      resolve(action(data.data, streamSink));
    }).then(function () {
      comObj.postMessage({
        sourceName,
        targetName,
        stream: StreamKind.START_COMPLETE,
        streamId,
        success: true
      });
    }, function (reason) {
      comObj.postMessage({
        sourceName,
        targetName,
        stream: StreamKind.START_COMPLETE,
        streamId,
        reason: wrapReason(reason)
      });
    });
  }

  _processStreamMessage(data) {
    const streamId = data.streamId;
    const sourceName = this.sourceName;
    const targetName = data.sourceName;
    const comObj = this.comObj;

    switch (data.stream) {
      case StreamKind.START_COMPLETE:
        if (data.success) {
          this.streamControllers[streamId].startCall.resolve();
        } else {
          this.streamControllers[streamId].startCall.reject(wrapReason(data.reason));
        }

        break;

      case StreamKind.PULL_COMPLETE:
        if (data.success) {
          this.streamControllers[streamId].pullCall.resolve();
        } else {
          this.streamControllers[streamId].pullCall.reject(wrapReason(data.reason));
        }

        break;

      case StreamKind.PULL:
        if (!this.streamSinks[streamId]) {
          comObj.postMessage({
            sourceName,
            targetName,
            stream: StreamKind.PULL_COMPLETE,
            streamId,
            success: true
          });
          break;
        }

        if (this.streamSinks[streamId].desiredSize <= 0 && data.desiredSize > 0) {
          this.streamSinks[streamId].sinkCapability.resolve();
        }

        this.streamSinks[streamId].desiredSize = data.desiredSize;
        const {
          onPull
        } = this.streamSinks[data.streamId];
        new Promise(function (resolve) {
          resolve(onPull && onPull());
        }).then(function () {
          comObj.postMessage({
            sourceName,
            targetName,
            stream: StreamKind.PULL_COMPLETE,
            streamId,
            success: true
          });
        }, function (reason) {
          comObj.postMessage({
            sourceName,
            targetName,
            stream: StreamKind.PULL_COMPLETE,
            streamId,
            reason: wrapReason(reason)
          });
        });
        break;

      case StreamKind.ENQUEUE:
        (0, _util.assert)(this.streamControllers[streamId], "enqueue should have stream controller");

        if (this.streamControllers[streamId].isClosed) {
          break;
        }

        this.streamControllers[streamId].controller.enqueue(data.chunk);
        break;

      case StreamKind.CLOSE:
        (0, _util.assert)(this.streamControllers[streamId], "close should have stream controller");

        if (this.streamControllers[streamId].isClosed) {
          break;
        }

        this.streamControllers[streamId].isClosed = true;
        this.streamControllers[streamId].controller.close();

        this._deleteStreamController(streamId);

        break;

      case StreamKind.ERROR:
        (0, _util.assert)(this.streamControllers[streamId], "error should have stream controller");
        this.streamControllers[streamId].controller.error(wrapReason(data.reason));

        this._deleteStreamController(streamId);

        break;

      case StreamKind.CANCEL_COMPLETE:
        if (data.success) {
          this.streamControllers[streamId].cancelCall.resolve();
        } else {
          this.streamControllers[streamId].cancelCall.reject(wrapReason(data.reason));
        }

        this._deleteStreamController(streamId);

        break;

      case StreamKind.CANCEL:
        if (!this.streamSinks[streamId]) {
          break;
        }

        const {
          onCancel
        } = this.streamSinks[data.streamId];
        new Promise(function (resolve) {
          resolve(onCancel && onCancel(wrapReason(data.reason)));
        }).then(function () {
          comObj.postMessage({
            sourceName,
            targetName,
            stream: StreamKind.CANCEL_COMPLETE,
            streamId,
            success: true
          });
        }, function (reason) {
          comObj.postMessage({
            sourceName,
            targetName,
            stream: StreamKind.CANCEL_COMPLETE,
            streamId,
            reason: wrapReason(reason)
          });
        });
        this.streamSinks[streamId].sinkCapability.reject(wrapReason(data.reason));
        this.streamSinks[streamId].isCancelled = true;
        delete this.streamSinks[streamId];
        break;

      default:
        throw new Error("Unexpected stream case");
    }
  }

  async _deleteStreamController(streamId) {
    await Promise.allSettled([this.streamControllers[streamId].startCall, this.streamControllers[streamId].pullCall, this.streamControllers[streamId].cancelCall].map(function (capability) {
      return capability && capability.promise;
    }));
    delete this.streamControllers[streamId];
  }

  _postMessage(message, transfers) {
    if (transfers && this.postMessageTransfers) {
      this.comObj.postMessage(message, transfers);
    } else {
      this.comObj.postMessage(message);
    }
  }

  destroy() {
    this.comObj.removeEventListener("message", this._onComObjOnMessage);
  }

}

exports.MessageHandler = MessageHandler;

/***/ }),
/* 12 */
/***/ (function(module, exports, __w_pdfjs_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Metadata = void 0;

var _util = __w_pdfjs_require__(2);

var _xml_parser = __w_pdfjs_require__(13);

class Metadata {
  constructor(data) {
    (0, _util.assert)(typeof data === "string", "Metadata: input is not a string");
    data = this._repair(data);
    const parser = new _xml_parser.SimpleXMLParser();
    const xmlDocument = parser.parseFromString(data);
    this._metadataMap = new Map();

    if (xmlDocument) {
      this._parse(xmlDocument);
    }
  }

  _repair(data) {
    return data.replace(/^[^<]+/, "").replace(/>\\376\\377([^<]+)/g, function (all, codes) {
      const bytes = codes.replace(/\\([0-3])([0-7])([0-7])/g, function (code, d1, d2, d3) {
        return String.fromCharCode(d1 * 64 + d2 * 8 + d3 * 1);
      }).replace(/&(amp|apos|gt|lt|quot);/g, function (str, name) {
        switch (name) {
          case "amp":
            return "&";

          case "apos":
            return "'";

          case "gt":
            return ">";

          case "lt":
            return "<";

          case "quot":
            return '"';
        }

        throw new Error(`_repair: ${name} isn't defined.`);
      });
      let chars = "";

      for (let i = 0, ii = bytes.length; i < ii; i += 2) {
        const code = bytes.charCodeAt(i) * 256 + bytes.charCodeAt(i + 1);

        if (code >= 32 && code < 127 && code !== 60 && code !== 62 && code !== 38) {
          chars += String.fromCharCode(code);
        } else {
          chars += "&#x" + (0x10000 + code).toString(16).substring(1) + ";";
        }
      }

      return ">" + chars;
    });
  }

  _parse(xmlDocument) {
    let rdf = xmlDocument.documentElement;

    if (rdf.nodeName.toLowerCase() !== "rdf:rdf") {
      rdf = rdf.firstChild;

      while (rdf && rdf.nodeName.toLowerCase() !== "rdf:rdf") {
        rdf = rdf.nextSibling;
      }
    }

    const nodeName = rdf ? rdf.nodeName.toLowerCase() : null;

    if (!rdf || nodeName !== "rdf:rdf" || !rdf.hasChildNodes()) {
      return;
    }

    const children = rdf.childNodes;

    for (let i = 0, ii = children.length; i < ii; i++) {
      const desc = children[i];

      if (desc.nodeName.toLowerCase() !== "rdf:description") {
        continue;
      }

      for (let j = 0, jj = desc.childNodes.length; j < jj; j++) {
        if (desc.childNodes[j].nodeName.toLowerCase() !== "#text") {
          const entry = desc.childNodes[j];
          const name = entry.nodeName.toLowerCase();

          this._metadataMap.set(name, entry.textContent.trim());
        }
      }
    }
  }

  get(name) {
    return this._metadataMap.has(name) ? this._metadataMap.get(name) : null;
  }

  getAll() {
    const obj = Object.create(null);

    for (const [key, value] of this._metadataMap) {
      obj[key] = value;
    }

    return obj;
  }

  has(name) {
    return this._metadataMap.has(name);
  }

}

exports.Metadata = Metadata;

/***/ }),
/* 13 */
/***/ (function(module, exports, __w_pdfjs_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SimpleXMLParser = void 0;
const XMLParserErrorCode = {
  NoError: 0,
  EndOfDocument: -1,
  UnterminatedCdat: -2,
  UnterminatedXmlDeclaration: -3,
  UnterminatedDoctypeDeclaration: -4,
  UnterminatedComment: -5,
  MalformedElement: -6,
  OutOfMemory: -7,
  UnterminatedAttributeValue: -8,
  UnterminatedElement: -9,
  ElementNeverBegun: -10
};

function isWhitespace(s, index) {
  const ch = s[index];
  return ch === " " || ch === "\n" || ch === "\r" || ch === "\t";
}

function isWhitespaceString(s) {
  for (let i = 0, ii = s.length; i < ii; i++) {
    if (!isWhitespace(s, i)) {
      return false;
    }
  }

  return true;
}

class XMLParserBase {
  _resolveEntities(s) {
    return s.replace(/&([^;]+);/g, (all, entity) => {
      if (entity.substring(0, 2) === "#x") {
        return String.fromCharCode(parseInt(entity.substring(2), 16));
      } else if (entity.substring(0, 1) === "#") {
        return String.fromCharCode(parseInt(entity.substring(1), 10));
      }

      switch (entity) {
        case "lt":
          return "<";

        case "gt":
          return ">";

        case "amp":
          return "&";

        case "quot":
          return '"';
      }

      return this.onResolveEntity(entity);
    });
  }

  _parseContent(s, start) {
    const attributes = [];
    let pos = start;

    function skipWs() {
      while (pos < s.length && isWhitespace(s, pos)) {
        ++pos;
      }
    }

    while (pos < s.length && !isWhitespace(s, pos) && s[pos] !== ">" && s[pos] !== "/") {
      ++pos;
    }

    const name = s.substring(start, pos);
    skipWs();

    while (pos < s.length && s[pos] !== ">" && s[pos] !== "/" && s[pos] !== "?") {
      skipWs();
      let attrName = "",
          attrValue = "";

      while (pos < s.length && !isWhitespace(s, pos) && s[pos] !== "=") {
        attrName += s[pos];
        ++pos;
      }

      skipWs();

      if (s[pos] !== "=") {
        return null;
      }

      ++pos;
      skipWs();
      const attrEndChar = s[pos];

      if (attrEndChar !== '"' && attrEndChar !== "'") {
        return null;
      }

      const attrEndIndex = s.indexOf(attrEndChar, ++pos);

      if (attrEndIndex < 0) {
        return null;
      }

      attrValue = s.substring(pos, attrEndIndex);
      attributes.push({
        name: attrName,
        value: this._resolveEntities(attrValue)
      });
      pos = attrEndIndex + 1;
      skipWs();
    }

    return {
      name,
      attributes,
      parsed: pos - start
    };
  }

  _parseProcessingInstruction(s, start) {
    let pos = start;

    function skipWs() {
      while (pos < s.length && isWhitespace(s, pos)) {
        ++pos;
      }
    }

    while (pos < s.length && !isWhitespace(s, pos) && s[pos] !== ">" && s[pos] !== "/") {
      ++pos;
    }

    const name = s.substring(start, pos);
    skipWs();
    const attrStart = pos;

    while (pos < s.length && (s[pos] !== "?" || s[pos + 1] !== ">")) {
      ++pos;
    }

    const value = s.substring(attrStart, pos);
    return {
      name,
      value,
      parsed: pos - start
    };
  }

  parseXml(s) {
    let i = 0;

    while (i < s.length) {
      const ch = s[i];
      let j = i;

      if (ch === "<") {
        ++j;
        const ch2 = s[j];
        let q;

        switch (ch2) {
          case "/":
            ++j;
            q = s.indexOf(">", j);

            if (q < 0) {
              this.onError(XMLParserErrorCode.UnterminatedElement);
              return;
            }

            this.onEndElement(s.substring(j, q));
            j = q + 1;
            break;

          case "?":
            ++j;

            const pi = this._parseProcessingInstruction(s, j);

            if (s.substring(j + pi.parsed, j + pi.parsed + 2) !== "?>") {
              this.onError(XMLParserErrorCode.UnterminatedXmlDeclaration);
              return;
            }

            this.onPi(pi.name, pi.value);
            j += pi.parsed + 2;
            break;

          case "!":
            if (s.substring(j + 1, j + 3) === "--") {
              q = s.indexOf("-->", j + 3);

              if (q < 0) {
                this.onError(XMLParserErrorCode.UnterminatedComment);
                return;
              }

              this.onComment(s.substring(j + 3, q));
              j = q + 3;
            } else if (s.substring(j + 1, j + 8) === "[CDATA[") {
              q = s.indexOf("]]>", j + 8);

              if (q < 0) {
                this.onError(XMLParserErrorCode.UnterminatedCdat);
                return;
              }

              this.onCdata(s.substring(j + 8, q));
              j = q + 3;
            } else if (s.substring(j + 1, j + 8) === "DOCTYPE") {
              const q2 = s.indexOf("[", j + 8);
              let complexDoctype = false;
              q = s.indexOf(">", j + 8);

              if (q < 0) {
                this.onError(XMLParserErrorCode.UnterminatedDoctypeDeclaration);
                return;
              }

              if (q2 > 0 && q > q2) {
                q = s.indexOf("]>", j + 8);

                if (q < 0) {
                  this.onError(XMLParserErrorCode.UnterminatedDoctypeDeclaration);
                  return;
                }

                complexDoctype = true;
              }

              const doctypeContent = s.substring(j + 8, q + (complexDoctype ? 1 : 0));
              this.onDoctype(doctypeContent);
              j = q + (complexDoctype ? 2 : 1);
            } else {
              this.onError(XMLParserErrorCode.MalformedElement);
              return;
            }

            break;

          default:
            const content = this._parseContent(s, j);

            if (content === null) {
              this.onError(XMLParserErrorCode.MalformedElement);
              return;
            }

            let isClosed = false;

            if (s.substring(j + content.parsed, j + content.parsed + 2) === "/>") {
              isClosed = true;
            } else if (s.substring(j + content.parsed, j + content.parsed + 1) !== ">") {
              this.onError(XMLParserErrorCode.UnterminatedElement);
              return;
            }

            this.onBeginElement(content.name, content.attributes, isClosed);
            j += content.parsed + (isClosed ? 2 : 1);
            break;
        }
      } else {
        while (j < s.length && s[j] !== "<") {
          j++;
        }

        const text = s.substring(i, j);
        this.onText(this._resolveEntities(text));
      }

      i = j;
    }
  }

  onResolveEntity(name) {
    return `&${name};`;
  }

  onPi(name, value) {}

  onComment(text) {}

  onCdata(text) {}

  onDoctype(doctypeContent) {}

  onText(text) {}

  onBeginElement(name, attributes, isEmpty) {}

  onEndElement(name) {}

  onError(code) {}

}

class SimpleDOMNode {
  constructor(nodeName, nodeValue) {
    this.nodeName = nodeName;
    this.nodeValue = nodeValue;
    Object.defineProperty(this, "parentNode", {
      value: null,
      writable: true
    });
  }

  get firstChild() {
    return this.childNodes && this.childNodes[0];
  }

  get nextSibling() {
    const childNodes = this.parentNode.childNodes;

    if (!childNodes) {
      return undefined;
    }

    const index = childNodes.indexOf(this);

    if (index === -1) {
      return undefined;
    }

    return childNodes[index + 1];
  }

  get textContent() {
    if (!this.childNodes) {
      return this.nodeValue || "";
    }

    return this.childNodes.map(function (child) {
      return child.textContent;
    }).join("");
  }

  hasChildNodes() {
    return this.childNodes && this.childNodes.length > 0;
  }

}

class SimpleXMLParser extends XMLParserBase {
  constructor() {
    super();
    this._currentFragment = null;
    this._stack = null;
    this._errorCode = XMLParserErrorCode.NoError;
  }

  parseFromString(data) {
    this._currentFragment = [];
    this._stack = [];
    this._errorCode = XMLParserErrorCode.NoError;
    this.parseXml(data);

    if (this._errorCode !== XMLParserErrorCode.NoError) {
      return undefined;
    }

    const [documentElement] = this._currentFragment;

    if (!documentElement) {
      return undefined;
    }

    return {
      documentElement
    };
  }

  onResolveEntity(name) {
    switch (name) {
      case "apos":
        return "'";
    }

    return super.onResolveEntity(name);
  }

  onText(text) {
    if (isWhitespaceString(text)) {
      return;
    }

    const node = new SimpleDOMNode("#text", text);

    this._currentFragment.push(node);
  }

  onCdata(text) {
    const node = new SimpleDOMNode("#text", text);

    this._currentFragment.push(node);
  }

  onBeginElement(name, attributes, isEmpty) {
    const node = new SimpleDOMNode(name);
    node.childNodes = [];

    this._currentFragment.push(node);

    if (isEmpty) {
      return;
    }

    this._stack.push(this._currentFragment);

    this._currentFragment = node.childNodes;
  }

  onEndElement(name) {
    this._currentFragment = this._stack.pop() || [];
    const lastElement = this._currentFragment[this._currentFragment.length - 1];

    if (!lastElement) {
      return;
    }

    for (let i = 0, ii = lastElement.childNodes.length; i < ii; i++) {
      lastElement.childNodes[i].parentNode = lastElement;
    }
  }

  onError(code) {
    this._errorCode = code;
  }

}

exports.SimpleXMLParser = SimpleXMLParser;

/***/ }),
/* 14 */
/***/ (function(module, exports, __w_pdfjs_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PDFDataTransportStream = void 0;

var _util = __w_pdfjs_require__(2);

class PDFDataTransportStream {
  constructor(params, pdfDataRangeTransport) {
    (0, _util.assert)(pdfDataRangeTransport, 'PDFDataTransportStream - missing required "pdfDataRangeTransport" argument.');
    this._queuedChunks = [];
    this._progressiveDone = params.progressiveDone || false;
    const initialData = params.initialData;

    if (initialData && initialData.length > 0) {
      const buffer = new Uint8Array(initialData).buffer;

      this._queuedChunks.push(buffer);
    }

    this._pdfDataRangeTransport = pdfDataRangeTransport;
    this._isStreamingSupported = !params.disableStream;
    this._isRangeSupported = !params.disableRange;
    this._contentLength = params.length;
    this._fullRequestReader = null;
    this._rangeReaders = [];

    this._pdfDataRangeTransport.addRangeListener((begin, chunk) => {
      this._onReceiveData({
        begin,
        chunk
      });
    });

    this._pdfDataRangeTransport.addProgressListener((loaded, total) => {
      this._onProgress({
        loaded,
        total
      });
    });

    this._pdfDataRangeTransport.addProgressiveReadListener(chunk => {
      this._onReceiveData({
        chunk
      });
    });

    this._pdfDataRangeTransport.addProgressiveDoneListener(() => {
      this._onProgressiveDone();
    });

    this._pdfDataRangeTransport.transportReady();
  }

  _onReceiveData(args) {
    const buffer = new Uint8Array(args.chunk).buffer;

    if (args.begin === undefined) {
      if (this._fullRequestReader) {
        this._fullRequestReader._enqueue(buffer);
      } else {
        this._queuedChunks.push(buffer);
      }
    } else {
      const found = this._rangeReaders.some(function (rangeReader) {
        if (rangeReader._begin !== args.begin) {
          return false;
        }

        rangeReader._enqueue(buffer);

        return true;
      });

      (0, _util.assert)(found, "_onReceiveData - no `PDFDataTransportStreamRangeReader` instance found.");
    }
  }

  get _progressiveDataLength() {
    return this._fullRequestReader ? this._fullRequestReader._loaded : 0;
  }

  _onProgress(evt) {
    if (evt.total === undefined) {
      const firstReader = this._rangeReaders[0];

      if (firstReader && firstReader.onProgress) {
        firstReader.onProgress({
          loaded: evt.loaded
        });
      }
    } else {
      const fullReader = this._fullRequestReader;

      if (fullReader && fullReader.onProgress) {
        fullReader.onProgress({
          loaded: evt.loaded,
          total: evt.total
        });
      }
    }
  }

  _onProgressiveDone() {
    if (this._fullRequestReader) {
      this._fullRequestReader.progressiveDone();
    }

    this._progressiveDone = true;
  }

  _removeRangeReader(reader) {
    const i = this._rangeReaders.indexOf(reader);

    if (i >= 0) {
      this._rangeReaders.splice(i, 1);
    }
  }

  getFullReader() {
    (0, _util.assert)(!this._fullRequestReader, "PDFDataTransportStream.getFullReader can only be called once.");
    const queuedChunks = this._queuedChunks;
    this._queuedChunks = null;
    return new PDFDataTransportStreamReader(this, queuedChunks, this._progressiveDone);
  }

  getRangeReader(begin, end) {
    if (end <= this._progressiveDataLength) {
      return null;
    }

    const reader = new PDFDataTransportStreamRangeReader(this, begin, end);

    this._pdfDataRangeTransport.requestDataRange(begin, end);

    this._rangeReaders.push(reader);

    return reader;
  }

  cancelAllRequests(reason) {
    if (this._fullRequestReader) {
      this._fullRequestReader.cancel(reason);
    }

    const readers = this._rangeReaders.slice(0);

    readers.forEach(function (rangeReader) {
      rangeReader.cancel(reason);
    });

    this._pdfDataRangeTransport.abort();
  }

}

exports.PDFDataTransportStream = PDFDataTransportStream;

class PDFDataTransportStreamReader {
  constructor(stream, queuedChunks, progressiveDone = false) {
    this._stream = stream;
    this._done = progressiveDone || false;
    this._filename = null;
    this._queuedChunks = queuedChunks || [];
    this._loaded = 0;

    for (const chunk of this._queuedChunks) {
      this._loaded += chunk.byteLength;
    }

    this._requests = [];
    this._headersReady = Promise.resolve();
    stream._fullRequestReader = this;
    this.onProgress = null;
  }

  _enqueue(chunk) {
    if (this._done) {
      return;
    }

    if (this._requests.length > 0) {
      const requestCapability = this._requests.shift();

      requestCapability.resolve({
        value: chunk,
        done: false
      });
    } else {
      this._queuedChunks.push(chunk);
    }

    this._loaded += chunk.byteLength;
  }

  get headersReady() {
    return this._headersReady;
  }

  get filename() {
    return this._filename;
  }

  get isRangeSupported() {
    return this._stream._isRangeSupported;
  }

  get isStreamingSupported() {
    return this._stream._isStreamingSupported;
  }

  get contentLength() {
    return this._stream._contentLength;
  }

  async read() {
    if (this._queuedChunks.length > 0) {
      const chunk = this._queuedChunks.shift();

      return {
        value: chunk,
        done: false
      };
    }

    if (this._done) {
      return {
        value: undefined,
        done: true
      };
    }

    const requestCapability = (0, _util.createPromiseCapability)();

    this._requests.push(requestCapability);

    return requestCapability.promise;
  }

  cancel(reason) {
    this._done = true;

    this._requests.forEach(function (requestCapability) {
      requestCapability.resolve({
        value: undefined,
        done: true
      });
    });

    this._requests = [];
  }

  progressiveDone() {
    if (this._done) {
      return;
    }

    this._done = true;
  }

}

class PDFDataTransportStreamRangeReader {
  constructor(stream, begin, end) {
    this._stream = stream;
    this._begin = begin;
    this._end = end;
    this._queuedChunk = null;
    this._requests = [];
    this._done = false;
    this.onProgress = null;
  }

  _enqueue(chunk) {
    if (this._done) {
      return;
    }

    if (this._requests.length === 0) {
      this._queuedChunk = chunk;
    } else {
      const requestsCapability = this._requests.shift();

      requestsCapability.resolve({
        value: chunk,
        done: false
      });

      this._requests.forEach(function (requestCapability) {
        requestCapability.resolve({
          value: undefined,
          done: true
        });
      });

      this._requests = [];
    }

    this._done = true;

    this._stream._removeRangeReader(this);
  }

  get isStreamingSupported() {
    return false;
  }

  async read() {
    if (this._queuedChunk) {
      const chunk = this._queuedChunk;
      this._queuedChunk = null;
      return {
        value: chunk,
        done: false
      };
    }

    if (this._done) {
      return {
        value: undefined,
        done: true
      };
    }

    const requestCapability = (0, _util.createPromiseCapability)();

    this._requests.push(requestCapability);

    return requestCapability.promise;
  }

  cancel(reason) {
    this._done = true;

    this._requests.forEach(function (requestCapability) {
      requestCapability.resolve({
        value: undefined,
        done: true
      });
    });

    this._requests = [];

    this._stream._removeRangeReader(this);
  }

}

/***/ }),
/* 15 */
/***/ (function(module, exports, __w_pdfjs_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WebGLContext = void 0;

var _util = __w_pdfjs_require__(2);

class WebGLContext {
  constructor({
    enable = false
  }) {
    this._enabled = enable === true;
  }

  get isEnabled() {
    let enabled = this._enabled;

    if (enabled) {
      enabled = WebGLUtils.tryInitGL();
    }

    return (0, _util.shadow)(this, "isEnabled", enabled);
  }

  composeSMask({
    layer,
    mask,
    properties
  }) {
    return WebGLUtils.composeSMask(layer, mask, properties);
  }

  drawFigures({
    width,
    height,
    backgroundColor,
    figures,
    context
  }) {
    return WebGLUtils.drawFigures(width, height, backgroundColor, figures, context);
  }

  clear() {
    WebGLUtils.cleanup();
  }

}

exports.WebGLContext = WebGLContext;

var WebGLUtils = function WebGLUtilsClosure() {
  function loadShader(gl, code, shaderType) {
    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, code);
    gl.compileShader(shader);
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

    if (!compiled) {
      var errorMsg = gl.getShaderInfoLog(shader);
      throw new Error("Error during shader compilation: " + errorMsg);
    }

    return shader;
  }

  function createVertexShader(gl, code) {
    return loadShader(gl, code, gl.VERTEX_SHADER);
  }

  function createFragmentShader(gl, code) {
    return loadShader(gl, code, gl.FRAGMENT_SHADER);
  }

  function createProgram(gl, shaders) {
    var program = gl.createProgram();

    for (var i = 0, ii = shaders.length; i < ii; ++i) {
      gl.attachShader(program, shaders[i]);
    }

    gl.linkProgram(program);
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);

    if (!linked) {
      var errorMsg = gl.getProgramInfoLog(program);
      throw new Error("Error during program linking: " + errorMsg);
    }

    return program;
  }

  function createTexture(gl, image, textureId) {
    gl.activeTexture(textureId);
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    return texture;
  }

  var currentGL, currentCanvas;

  function generateGL() {
    if (currentGL) {
      return;
    }

    currentCanvas = document.createElement("canvas");
    currentGL = currentCanvas.getContext("webgl", {
      premultipliedalpha: false
    });
  }

  var smaskVertexShaderCode = "\
  attribute vec2 a_position;                                    \
  attribute vec2 a_texCoord;                                    \
                                                                \
  uniform vec2 u_resolution;                                    \
                                                                \
  varying vec2 v_texCoord;                                      \
                                                                \
  void main() {                                                 \
    vec2 clipSpace = (a_position / u_resolution) * 2.0 - 1.0;   \
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);          \
                                                                \
    v_texCoord = a_texCoord;                                    \
  }                                                             ";
  var smaskFragmentShaderCode = "\
  precision mediump float;                                      \
                                                                \
  uniform vec4 u_backdrop;                                      \
  uniform int u_subtype;                                        \
  uniform sampler2D u_image;                                    \
  uniform sampler2D u_mask;                                     \
                                                                \
  varying vec2 v_texCoord;                                      \
                                                                \
  void main() {                                                 \
    vec4 imageColor = texture2D(u_image, v_texCoord);           \
    vec4 maskColor = texture2D(u_mask, v_texCoord);             \
    if (u_backdrop.a > 0.0) {                                   \
      maskColor.rgb = maskColor.rgb * maskColor.a +             \
                      u_backdrop.rgb * (1.0 - maskColor.a);     \
    }                                                           \
    float lum;                                                  \
    if (u_subtype == 0) {                                       \
      lum = maskColor.a;                                        \
    } else {                                                    \
      lum = maskColor.r * 0.3 + maskColor.g * 0.59 +            \
            maskColor.b * 0.11;                                 \
    }                                                           \
    imageColor.a *= lum;                                        \
    imageColor.rgb *= imageColor.a;                             \
    gl_FragColor = imageColor;                                  \
  }                                                             ";
  var smaskCache = null;

  function initSmaskGL() {
    var canvas, gl;
    generateGL();
    canvas = currentCanvas;
    currentCanvas = null;
    gl = currentGL;
    currentGL = null;
    var vertexShader = createVertexShader(gl, smaskVertexShaderCode);
    var fragmentShader = createFragmentShader(gl, smaskFragmentShaderCode);
    var program = createProgram(gl, [vertexShader, fragmentShader]);
    gl.useProgram(program);
    var cache = {};
    cache.gl = gl;
    cache.canvas = canvas;
    cache.resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    cache.positionLocation = gl.getAttribLocation(program, "a_position");
    cache.backdropLocation = gl.getUniformLocation(program, "u_backdrop");
    cache.subtypeLocation = gl.getUniformLocation(program, "u_subtype");
    var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
    var texLayerLocation = gl.getUniformLocation(program, "u_image");
    var texMaskLocation = gl.getUniformLocation(program, "u_mask");
    var texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
    gl.uniform1i(texLayerLocation, 0);
    gl.uniform1i(texMaskLocation, 1);
    smaskCache = cache;
  }

  function composeSMask(layer, mask, properties) {
    var width = layer.width,
        height = layer.height;

    if (!smaskCache) {
      initSmaskGL();
    }

    var cache = smaskCache,
        canvas = cache.canvas,
        gl = cache.gl;
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.uniform2f(cache.resolutionLocation, width, height);

    if (properties.backdrop) {
      gl.uniform4f(cache.resolutionLocation, properties.backdrop[0], properties.backdrop[1], properties.backdrop[2], 1);
    } else {
      gl.uniform4f(cache.resolutionLocation, 0, 0, 0, 0);
    }

    gl.uniform1i(cache.subtypeLocation, properties.subtype === "Luminosity" ? 1 : 0);
    var texture = createTexture(gl, layer, gl.TEXTURE0);
    var maskTexture = createTexture(gl, mask, gl.TEXTURE1);
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, width, 0, 0, height, 0, height, width, 0, width, height]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(cache.positionLocation);
    gl.vertexAttribPointer(cache.positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.flush();
    gl.deleteTexture(texture);
    gl.deleteTexture(maskTexture);
    gl.deleteBuffer(buffer);
    return canvas;
  }

  var figuresVertexShaderCode = "\
  attribute vec2 a_position;                                    \
  attribute vec3 a_color;                                       \
                                                                \
  uniform vec2 u_resolution;                                    \
  uniform vec2 u_scale;                                         \
  uniform vec2 u_offset;                                        \
                                                                \
  varying vec4 v_color;                                         \
                                                                \
  void main() {                                                 \
    vec2 position = (a_position + u_offset) * u_scale;          \
    vec2 clipSpace = (position / u_resolution) * 2.0 - 1.0;     \
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);          \
                                                                \
    v_color = vec4(a_color / 255.0, 1.0);                       \
  }                                                             ";
  var figuresFragmentShaderCode = "\
  precision mediump float;                                      \
                                                                \
  varying vec4 v_color;                                         \
                                                                \
  void main() {                                                 \
    gl_FragColor = v_color;                                     \
  }                                                             ";
  var figuresCache = null;

  function initFiguresGL() {
    var canvas, gl;
    generateGL();
    canvas = currentCanvas;
    currentCanvas = null;
    gl = currentGL;
    currentGL = null;
    var vertexShader = createVertexShader(gl, figuresVertexShaderCode);
    var fragmentShader = createFragmentShader(gl, figuresFragmentShaderCode);
    var program = createProgram(gl, [vertexShader, fragmentShader]);
    gl.useProgram(program);
    var cache = {};
    cache.gl = gl;
    cache.canvas = canvas;
    cache.resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    cache.scaleLocation = gl.getUniformLocation(program, "u_scale");
    cache.offsetLocation = gl.getUniformLocation(program, "u_offset");
    cache.positionLocation = gl.getAttribLocation(program, "a_position");
    cache.colorLocation = gl.getAttribLocation(program, "a_color");
    figuresCache = cache;
  }

  function drawFigures(width, height, backgroundColor, figures, context) {
    if (!figuresCache) {
      initFiguresGL();
    }

    var cache = figuresCache,
        canvas = cache.canvas,
        gl = cache.gl;
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.uniform2f(cache.resolutionLocation, width, height);
    var count = 0;
    var i, ii, rows;

    for (i = 0, ii = figures.length; i < ii; i++) {
      switch (figures[i].type) {
        case "lattice":
          rows = figures[i].coords.length / figures[i].verticesPerRow | 0;
          count += (rows - 1) * (figures[i].verticesPerRow - 1) * 6;
          break;

        case "triangles":
          count += figures[i].coords.length;
          break;
      }
    }

    var coords = new Float32Array(count * 2);
    var colors = new Uint8Array(count * 3);
    var coordsMap = context.coords,
        colorsMap = context.colors;
    var pIndex = 0,
        cIndex = 0;

    for (i = 0, ii = figures.length; i < ii; i++) {
      var figure = figures[i],
          ps = figure.coords,
          cs = figure.colors;

      switch (figure.type) {
        case "lattice":
          var cols = figure.verticesPerRow;
          rows = ps.length / cols | 0;

          for (var row = 1; row < rows; row++) {
            var offset = row * cols + 1;

            for (var col = 1; col < cols; col++, offset++) {
              coords[pIndex] = coordsMap[ps[offset - cols - 1]];
              coords[pIndex + 1] = coordsMap[ps[offset - cols - 1] + 1];
              coords[pIndex + 2] = coordsMap[ps[offset - cols]];
              coords[pIndex + 3] = coordsMap[ps[offset - cols] + 1];
              coords[pIndex + 4] = coordsMap[ps[offset - 1]];
              coords[pIndex + 5] = coordsMap[ps[offset - 1] + 1];
              colors[cIndex] = colorsMap[cs[offset - cols - 1]];
              colors[cIndex + 1] = colorsMap[cs[offset - cols - 1] + 1];
              colors[cIndex + 2] = colorsMap[cs[offset - cols - 1] + 2];
              colors[cIndex + 3] = colorsMap[cs[offset - cols]];
              colors[cIndex + 4] = colorsMap[cs[offset - cols] + 1];
              colors[cIndex + 5] = colorsMap[cs[offset - cols] + 2];
              colors[cIndex + 6] = colorsMap[cs[offset - 1]];
              colors[cIndex + 7] = colorsMap[cs[offset - 1] + 1];
              colors[cIndex + 8] = colorsMap[cs[offset - 1] + 2];
              coords[pIndex + 6] = coords[pIndex + 2];
              coords[pIndex + 7] = coords[pIndex + 3];
              coords[pIndex + 8] = coords[pIndex + 4];
              coords[pIndex + 9] = coords[pIndex + 5];
              coords[pIndex + 10] = coordsMap[ps[offset]];
              coords[pIndex + 11] = coordsMap[ps[offset] + 1];
              colors[cIndex + 9] = colors[cIndex + 3];
              colors[cIndex + 10] = colors[cIndex + 4];
              colors[cIndex + 11] = colors[cIndex + 5];
              colors[cIndex + 12] = colors[cIndex + 6];
              colors[cIndex + 13] = colors[cIndex + 7];
              colors[cIndex + 14] = colors[cIndex + 8];
              colors[cIndex + 15] = colorsMap[cs[offset]];
              colors[cIndex + 16] = colorsMap[cs[offset] + 1];
              colors[cIndex + 17] = colorsMap[cs[offset] + 2];
              pIndex += 12;
              cIndex += 18;
            }
          }

          break;

        case "triangles":
          for (var j = 0, jj = ps.length; j < jj; j++) {
            coords[pIndex] = coordsMap[ps[j]];
            coords[pIndex + 1] = coordsMap[ps[j] + 1];
            colors[cIndex] = colorsMap[cs[j]];
            colors[cIndex + 1] = colorsMap[cs[j] + 1];
            colors[cIndex + 2] = colorsMap[cs[j] + 2];
            pIndex += 2;
            cIndex += 3;
          }

          break;
      }
    }

    if (backgroundColor) {
      gl.clearColor(backgroundColor[0] / 255, backgroundColor[1] / 255, backgroundColor[2] / 255, 1.0);
    } else {
      gl.clearColor(0, 0, 0, 0);
    }

    gl.clear(gl.COLOR_BUFFER_BIT);
    var coordsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, coordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, coords, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(cache.positionLocation);
    gl.vertexAttribPointer(cache.positionLocation, 2, gl.FLOAT, false, 0, 0);
    var colorsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(cache.colorLocation);
    gl.vertexAttribPointer(cache.colorLocation, 3, gl.UNSIGNED_BYTE, false, 0, 0);
    gl.uniform2f(cache.scaleLocation, context.scaleX, context.scaleY);
    gl.uniform2f(cache.offsetLocation, context.offsetX, context.offsetY);
    gl.drawArrays(gl.TRIANGLES, 0, count);
    gl.flush();
    gl.deleteBuffer(coordsBuffer);
    gl.deleteBuffer(colorsBuffer);
    return canvas;
  }

  return {
    tryInitGL() {
      try {
        generateGL();
        return !!currentGL;
      } catch (ex) {}

      return false;
    },

    composeSMask,
    drawFigures,

    cleanup() {
      if (smaskCache && smaskCache.canvas) {
        smaskCache.canvas.width = 0;
        smaskCache.canvas.height = 0;
      }

      if (figuresCache && figuresCache.canvas) {
        figuresCache.canvas.width = 0;
        figuresCache.canvas.height = 0;
      }

      smaskCache = null;
      figuresCache = null;
    }

  };
}();

/***/ }),
/* 16 */
/***/ (function(module, exports, __w_pdfjs_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnnotationLayer = void 0;

var _display_utils = __w_pdfjs_require__(1);

var _util = __w_pdfjs_require__(2);

class AnnotationElementFactory {
  static create(parameters) {
    const subtype = parameters.data.annotationType;

    switch (subtype) {
      case _util.AnnotationType.LINK:
        return new LinkAnnotationElement(parameters);

      case _util.AnnotationType.TEXT:
        return new TextAnnotationElement(parameters);

      case _util.AnnotationType.WIDGET:
        const fieldType = parameters.data.fieldType;

        switch (fieldType) {
          case "Tx":
            return new TextWidgetAnnotationElement(parameters);

          case "Btn":
            if (parameters.data.radioButton) {
              return new RadioButtonWidgetAnnotationElement(parameters);
            } else if (parameters.data.checkBox) {
              return new CheckboxWidgetAnnotationElement(parameters);
            }

            return new PushButtonWidgetAnnotationElement(parameters);

          case "Ch":
            return new ChoiceWidgetAnnotationElement(parameters);
        }

        return new WidgetAnnotationElement(parameters);

      case _util.AnnotationType.POPUP:
        return new PopupAnnotationElement(parameters);

      case _util.AnnotationType.FREETEXT:
        return new FreeTextAnnotationElement(parameters);

      case _util.AnnotationType.LINE:
        return new LineAnnotationElement(parameters);

      case _util.AnnotationType.SQUARE:
        return new SquareAnnotationElement(parameters);

      case _util.AnnotationType.CIRCLE:
        return new CircleAnnotationElement(parameters);

      case _util.AnnotationType.POLYLINE:
        return new PolylineAnnotationElement(parameters);

      case _util.AnnotationType.CARET:
        return new CaretAnnotationElement(parameters);

      case _util.AnnotationType.INK:
        return new InkAnnotationElement(parameters);

      case _util.AnnotationType.POLYGON:
        return new PolygonAnnotationElement(parameters);

      case _util.AnnotationType.HIGHLIGHT:
        return new HighlightAnnotationElement(parameters);

      case _util.AnnotationType.UNDERLINE:
        return new UnderlineAnnotationElement(parameters);

      case _util.AnnotationType.SQUIGGLY:
        return new SquigglyAnnotationElement(parameters);

      case _util.AnnotationType.STRIKEOUT:
        return new StrikeOutAnnotationElement(parameters);

      case _util.AnnotationType.STAMP:
        return new StampAnnotationElement(parameters);

      case _util.AnnotationType.FILEATTACHMENT:
        return new FileAttachmentAnnotationElement(parameters);

      default:
        return new AnnotationElement(parameters);
    }
  }

}

class AnnotationElement {
  constructor(parameters, isRenderable = false, ignoreBorder = false) {
    this.isRenderable = isRenderable;
    this.data = parameters.data;
    this.layer = parameters.layer;
    this.page = parameters.page;
    this.viewport = parameters.viewport;
    this.linkService = parameters.linkService;
    this.downloadManager = parameters.downloadManager;
    this.imageResourcesPath = parameters.imageResourcesPath;
    this.renderInteractiveForms = parameters.renderInteractiveForms;
    this.svgFactory = parameters.svgFactory;

    if (isRenderable) {
      this.container = this._createContainer(ignoreBorder);
    }
  }

  _createContainer(ignoreBorder = false) {
    const data = this.data,
          page = this.page,
          viewport = this.viewport;
    const container = document.createElement("section");
    let width = data.rect[2] - data.rect[0];
    let height = data.rect[3] - data.rect[1];
    container.setAttribute("data-annotation-id", data.id);

    const rect = _util.Util.normalizeRect([data.rect[0], page.view[3] - data.rect[1] + page.view[1], data.rect[2], page.view[3] - data.rect[3] + page.view[1]]);

    container.style.transform = `matrix(${viewport.transform.join(",")})`;
    container.style.transformOrigin = `-${rect[0]}px -${rect[1]}px`;

    if (!ignoreBorder && data.borderStyle.width > 0) {
      container.style.borderWidth = `${data.borderStyle.width}px`;

      if (data.borderStyle.style !== _util.AnnotationBorderStyleType.UNDERLINE) {
        width = width - 2 * data.borderStyle.width;
        height = height - 2 * data.borderStyle.width;
      }

      const horizontalRadius = data.borderStyle.horizontalCornerRadius;
      const verticalRadius = data.borderStyle.verticalCornerRadius;

      if (horizontalRadius > 0 || verticalRadius > 0) {
        const radius = `${horizontalRadius}px / ${verticalRadius}px`;
        container.style.borderRadius = radius;
      }

      switch (data.borderStyle.style) {
        case _util.AnnotationBorderStyleType.SOLID:
          container.style.borderStyle = "solid";
          break;

        case _util.AnnotationBorderStyleType.DASHED:
          container.style.borderStyle = "dashed";
          break;

        case _util.AnnotationBorderStyleType.BEVELED:
          (0, _util.warn)("Unimplemented border style: beveled");
          break;

        case _util.AnnotationBorderStyleType.INSET:
          (0, _util.warn)("Unimplemented border style: inset");
          break;

        case _util.AnnotationBorderStyleType.UNDERLINE:
          container.style.borderBottomStyle = "solid";
          break;

        default:
          break;
      }

      if (data.color) {
        container.style.borderColor = _util.Util.makeCssRgb(data.color[0] | 0, data.color[1] | 0, data.color[2] | 0);
      } else {
        container.style.borderWidth = 0;
      }
    }

    container.style.left = `${rect[0]}px`;
    container.style.top = `${rect[1]}px`;
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
    return container;
  }

  _createPopup(container, trigger, data) {
    if (!trigger) {
      trigger = document.createElement("div");
      trigger.style.height = container.style.height;
      trigger.style.width = container.style.width;
      container.appendChild(trigger);
    }

    const popupElement = new PopupElement({
      container,
      trigger,
      color: data.color,
      title: data.title,
      modificationDate: data.modificationDate,
      contents: data.contents,
      hideWrapper: true
    });
    const popup = popupElement.render();
    popup.style.left = container.style.width;
    container.appendChild(popup);
  }

  render() {
    (0, _util.unreachable)("Abstract method `AnnotationElement.render` called");
  }

}

class LinkAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    const isRenderable = !!(parameters.data.url || parameters.data.dest || parameters.data.action);
    super(parameters, isRenderable);
  }

  render() {
    this.container.className = "linkAnnotation";
    const {
      data,
      linkService
    } = this;
    const link = document.createElement("a");

    if (data.url) {
      (0, _display_utils.addLinkAttributes)(link, {
        url: data.url,
        target: data.newWindow ? _display_utils.LinkTarget.BLANK : linkService.externalLinkTarget,
        rel: linkService.externalLinkRel,
        enabled: linkService.externalLinkEnabled
      });
    } else if (data.action) {
      this._bindNamedAction(link, data.action);
    } else {
      this._bindLink(link, data.dest);
    }

    this.container.appendChild(link);
    return this.container;
  }

  _bindLink(link, destination) {
    link.href = this.linkService.getDestinationHash(destination);

    link.onclick = () => {
      if (destination) {
        this.linkService.navigateTo(destination);
      }

      return false;
    };

    if (destination) {
      link.className = "internalLink";
    }
  }

  _bindNamedAction(link, action) {
    link.href = this.linkService.getAnchorUrl("");

    link.onclick = () => {
      this.linkService.executeNamedAction(action);
      return false;
    };

    link.className = "internalLink";
  }

}

class TextAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
    super(parameters, isRenderable);
  }

  render() {
    this.container.className = "textAnnotation";
    const image = document.createElement("img");
    image.style.height = this.container.style.height;
    image.style.width = this.container.style.width;
    image.src = this.imageResourcesPath + "annotation-" + this.data.name.toLowerCase() + ".svg";
    image.alt = "[{{type}} Annotation]";
    image.dataset.l10nId = "text_annotation_type";
    image.dataset.l10nArgs = JSON.stringify({
      type: this.data.name
    });

    if (!this.data.hasPopup) {
      this._createPopup(this.container, image, this.data);
    }

    this.container.appendChild(image);
    return this.container;
  }

}

class WidgetAnnotationElement extends AnnotationElement {
  render() {
    return this.container;
  }

}

class TextWidgetAnnotationElement extends WidgetAnnotationElement {
  constructor(parameters) {
    const isRenderable = parameters.renderInteractiveForms || !parameters.data.hasAppearance && !!parameters.data.fieldValue;
    super(parameters, isRenderable);
  }

  render() {
    const TEXT_ALIGNMENT = ["left", "center", "right"];
    this.container.className = "textWidgetAnnotation";
    let element = null;

    if (this.renderInteractiveForms) {
      if (this.data.multiLine) {
        element = document.createElement("textarea");
        element.textContent = this.data.fieldValue;
      } else {
        element = document.createElement("input");
        element.type = "text";
        element.setAttribute("value", this.data.fieldValue);
      }

      element.disabled = this.data.readOnly;
      element.name = this.data.fieldName;

      if (this.data.maxLen !== null) {
        element.maxLength = this.data.maxLen;
      }

      if (this.data.comb) {
        const fieldWidth = this.data.rect[2] - this.data.rect[0];
        const combWidth = fieldWidth / this.data.maxLen;
        element.classList.add("comb");
        element.style.letterSpacing = `calc(${combWidth}px - 1ch)`;
      }
    } else {
      element = document.createElement("div");
      element.textContent = this.data.fieldValue;
      element.style.verticalAlign = "middle";
      element.style.display = "table-cell";
      let font = null;

      if (this.data.fontRefName && this.page.commonObjs.has(this.data.fontRefName)) {
        font = this.page.commonObjs.get(this.data.fontRefName);
      }

      this._setTextStyle(element, font);
    }

    if (this.data.textAlignment !== null) {
      element.style.textAlign = TEXT_ALIGNMENT[this.data.textAlignment];
    }

    this.container.appendChild(element);
    return this.container;
  }

  _setTextStyle(element, font) {
    const style = element.style;
    style.fontSize = `${this.data.fontSize}px`;
    style.direction = this.data.fontDirection < 0 ? "rtl" : "ltr";

    if (!font) {
      return;
    }

    let bold = "normal";

    if (font.black) {
      bold = "900";
    } else if (font.bold) {
      bold = "bold";
    }

    style.fontWeight = bold;
    style.fontStyle = font.italic ? "italic" : "normal";
    const fontFamily = font.loadedName ? `"${font.loadedName}", ` : "";
    const fallbackName = font.fallbackName || "Helvetica, sans-serif";
    style.fontFamily = fontFamily + fallbackName;
  }

}

class CheckboxWidgetAnnotationElement extends WidgetAnnotationElement {
  constructor(parameters) {
    super(parameters, parameters.renderInteractiveForms);
  }

  render() {
    this.container.className = "buttonWidgetAnnotation checkBox";
    const element = document.createElement("input");
    element.disabled = this.data.readOnly;
    element.type = "checkbox";
    element.name = this.data.fieldName;

    if (this.data.fieldValue && this.data.fieldValue !== "Off") {
      element.setAttribute("checked", true);
    }

    this.container.appendChild(element);
    return this.container;
  }

}

class RadioButtonWidgetAnnotationElement extends WidgetAnnotationElement {
  constructor(parameters) {
    super(parameters, parameters.renderInteractiveForms);
  }

  render() {
    this.container.className = "buttonWidgetAnnotation radioButton";
    const element = document.createElement("input");
    element.disabled = this.data.readOnly;
    element.type = "radio";
    element.name = this.data.fieldName;

    if (this.data.fieldValue === this.data.buttonValue) {
      element.setAttribute("checked", true);
    }

    this.container.appendChild(element);
    return this.container;
  }

}

class PushButtonWidgetAnnotationElement extends LinkAnnotationElement {
  render() {
    const container = super.render();
    container.className = "buttonWidgetAnnotation pushButton";
    return container;
  }

}

class ChoiceWidgetAnnotationElement extends WidgetAnnotationElement {
  constructor(parameters) {
    super(parameters, parameters.renderInteractiveForms);
  }

  render() {
    this.container.className = "choiceWidgetAnnotation";
    const selectElement = document.createElement("select");
    selectElement.disabled = this.data.readOnly;
    selectElement.name = this.data.fieldName;

    if (!this.data.combo) {
      selectElement.size = this.data.options.length;

      if (this.data.multiSelect) {
        selectElement.multiple = true;
      }
    }

    for (const option of this.data.options) {
      const optionElement = document.createElement("option");
      optionElement.textContent = option.displayValue;
      optionElement.value = option.exportValue;

      if (this.data.fieldValue.includes(option.displayValue)) {
        optionElement.setAttribute("selected", true);
      }

      selectElement.appendChild(optionElement);
    }

    this.container.appendChild(selectElement);
    return this.container;
  }

}

class PopupAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    const isRenderable = !!(parameters.data.title || parameters.data.contents);
    super(parameters, isRenderable);
  }

  render() {
    const IGNORE_TYPES = ["Line", "Square", "Circle", "PolyLine", "Polygon", "Ink"];
    this.container.className = "popupAnnotation";

    if (IGNORE_TYPES.includes(this.data.parentType)) {
      return this.container;
    }

    const selector = `[data-annotation-id="${this.data.parentId}"]`;
    const parentElement = this.layer.querySelector(selector);

    if (!parentElement) {
      return this.container;
    }

    const popup = new PopupElement({
      container: this.container,
      trigger: parentElement,
      color: this.data.color,
      title: this.data.title,
      modificationDate: this.data.modificationDate,
      contents: this.data.contents
    });
    const parentLeft = parseFloat(parentElement.style.left);
    const parentWidth = parseFloat(parentElement.style.width);
    this.container.style.transformOrigin = `-${parentLeft + parentWidth}px -${parentElement.style.top}`;
    this.container.style.left = `${parentLeft + parentWidth}px`;
    this.container.appendChild(popup.render());
    return this.container;
  }

}

class PopupElement {
  constructor(parameters) {
    this.container = parameters.container;
    this.trigger = parameters.trigger;
    this.color = parameters.color;
    this.title = parameters.title;
    this.modificationDate = parameters.modificationDate;
    this.contents = parameters.contents;
    this.hideWrapper = parameters.hideWrapper || false;
    this.pinned = false;
  }

  render() {
    const BACKGROUND_ENLIGHT = 0.7;
    const wrapper = document.createElement("div");
    wrapper.className = "popupWrapper";
    this.hideElement = this.hideWrapper ? wrapper : this.container;
    this.hideElement.setAttribute("hidden", true);
    const popup = document.createElement("div");
    popup.className = "popup";
    const color = this.color;

    if (color) {
      const r = BACKGROUND_ENLIGHT * (255 - color[0]) + color[0];
      const g = BACKGROUND_ENLIGHT * (255 - color[1]) + color[1];
      const b = BACKGROUND_ENLIGHT * (255 - color[2]) + color[2];
      popup.style.backgroundColor = _util.Util.makeCssRgb(r | 0, g | 0, b | 0);
    }

    const title = document.createElement("h1");
    title.textContent = this.title;
    popup.appendChild(title);

    const dateObject = _display_utils.PDFDateString.toDateObject(this.modificationDate);

    if (dateObject) {
      const modificationDate = document.createElement("span");
      modificationDate.textContent = "{{date}}, {{time}}";
      modificationDate.dataset.l10nId = "annotation_date_string";
      modificationDate.dataset.l10nArgs = JSON.stringify({
        date: dateObject.toLocaleDateString(),
        time: dateObject.toLocaleTimeString()
      });
      popup.appendChild(modificationDate);
    }

    const contents = this._formatContents(this.contents);

    popup.appendChild(contents);
    this.trigger.addEventListener("click", this._toggle.bind(this));
    this.trigger.addEventListener("mouseover", this._show.bind(this, false));
    this.trigger.addEventListener("mouseout", this._hide.bind(this, false));
    popup.addEventListener("click", this._hide.bind(this, true));
    wrapper.appendChild(popup);
    return wrapper;
  }

  _formatContents(contents) {
    const p = document.createElement("p");
    const lines = contents.split(/(?:\r\n?|\n)/);

    for (let i = 0, ii = lines.length; i < ii; ++i) {
      const line = lines[i];
      p.appendChild(document.createTextNode(line));

      if (i < ii - 1) {
        p.appendChild(document.createElement("br"));
      }
    }

    return p;
  }

  _toggle() {
    if (this.pinned) {
      this._hide(true);
    } else {
      this._show(true);
    }
  }

  _show(pin = false) {
    if (pin) {
      this.pinned = true;
    }

    if (this.hideElement.hasAttribute("hidden")) {
      this.hideElement.removeAttribute("hidden");
      this.container.style.zIndex += 1;
    }
  }

  _hide(unpin = true) {
    if (unpin) {
      this.pinned = false;
    }

    if (!this.hideElement.hasAttribute("hidden") && !this.pinned) {
      this.hideElement.setAttribute("hidden", true);
      this.container.style.zIndex -= 1;
    }
  }

}

class FreeTextAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
    super(parameters, isRenderable, true);
  }

  render() {
    this.container.className = "freeTextAnnotation";

    if (!this.data.hasPopup) {
      this._createPopup(this.container, null, this.data);
    }

    return this.container;
  }

}

class LineAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
    super(parameters, isRenderable, true);
  }

  render() {
    this.container.className = "lineAnnotation";
    const data = this.data;
    const width = data.rect[2] - data.rect[0];
    const height = data.rect[3] - data.rect[1];
    const svg = this.svgFactory.create(width, height);
    const line = this.svgFactory.createElement("svg:line");
    line.setAttribute("x1", data.rect[2] - data.lineCoordinates[0]);
    line.setAttribute("y1", data.rect[3] - data.lineCoordinates[1]);
    line.setAttribute("x2", data.rect[2] - data.lineCoordinates[2]);
    line.setAttribute("y2", data.rect[3] - data.lineCoordinates[3]);
    line.setAttribute("stroke-width", data.borderStyle.width || 1);
    line.setAttribute("stroke", "transparent");
    svg.appendChild(line);
    this.container.append(svg);

    this._createPopup(this.container, line, data);

    return this.container;
  }

}

class SquareAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
    super(parameters, isRenderable, true);
  }

  render() {
    this.container.className = "squareAnnotation";
    const data = this.data;
    const width = data.rect[2] - data.rect[0];
    const height = data.rect[3] - data.rect[1];
    const svg = this.svgFactory.create(width, height);
    const borderWidth = data.borderStyle.width;
    const square = this.svgFactory.createElement("svg:rect");
    square.setAttribute("x", borderWidth / 2);
    square.setAttribute("y", borderWidth / 2);
    square.setAttribute("width", width - borderWidth);
    square.setAttribute("height", height - borderWidth);
    square.setAttribute("stroke-width", borderWidth || 1);
    square.setAttribute("stroke", "transparent");
    square.setAttribute("fill", "none");
    svg.appendChild(square);
    this.container.append(svg);

    this._createPopup(this.container, square, data);

    return this.container;
  }

}

class CircleAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
    super(parameters, isRenderable, true);
  }

  render() {
    this.container.className = "circleAnnotation";
    const data = this.data;
    const width = data.rect[2] - data.rect[0];
    const height = data.rect[3] - data.rect[1];
    const svg = this.svgFactory.create(width, height);
    const borderWidth = data.borderStyle.width;
    const circle = this.svgFactory.createElement("svg:ellipse");
    circle.setAttribute("cx", width / 2);
    circle.setAttribute("cy", height / 2);
    circle.setAttribute("rx", width / 2 - borderWidth / 2);
    circle.setAttribute("ry", height / 2 - borderWidth / 2);
    circle.setAttribute("stroke-width", borderWidth || 1);
    circle.setAttribute("stroke", "transparent");
    circle.setAttribute("fill", "none");
    svg.appendChild(circle);
    this.container.append(svg);

    this._createPopup(this.container, circle, data);

    return this.container;
  }

}

class PolylineAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
    super(parameters, isRenderable, true);
    this.containerClassName = "polylineAnnotation";
    this.svgElementName = "svg:polyline";
  }

  render() {
    this.container.className = this.containerClassName;
    const data = this.data;
    const width = data.rect[2] - data.rect[0];
    const height = data.rect[3] - data.rect[1];
    const svg = this.svgFactory.create(width, height);
    let points = [];

    for (const coordinate of data.vertices) {
      const x = coordinate.x - data.rect[0];
      const y = data.rect[3] - coordinate.y;
      points.push(x + "," + y);
    }

    points = points.join(" ");
    const polyline = this.svgFactory.createElement(this.svgElementName);
    polyline.setAttribute("points", points);
    polyline.setAttribute("stroke-width", data.borderStyle.width || 1);
    polyline.setAttribute("stroke", "transparent");
    polyline.setAttribute("fill", "none");
    svg.appendChild(polyline);
    this.container.append(svg);

    this._createPopup(this.container, polyline, data);

    return this.container;
  }

}

class PolygonAnnotationElement extends PolylineAnnotationElement {
  constructor(parameters) {
    super(parameters);
    this.containerClassName = "polygonAnnotation";
    this.svgElementName = "svg:polygon";
  }

}

class CaretAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
    super(parameters, isRenderable, true);
  }

  render() {
    this.container.className = "caretAnnotation";

    if (!this.data.hasPopup) {
      this._createPopup(this.container, null, this.data);
    }

    return this.container;
  }

}

class InkAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
    super(parameters, isRenderable, true);
    this.containerClassName = "inkAnnotation";
    this.svgElementName = "svg:polyline";
  }

  render() {
    this.container.className = this.containerClassName;
    const data = this.data;
    const width = data.rect[2] - data.rect[0];
    const height = data.rect[3] - data.rect[1];
    const svg = this.svgFactory.create(width, height);

    for (const inkList of data.inkLists) {
      let points = [];

      for (const coordinate of inkList) {
        const x = coordinate.x - data.rect[0];
        const y = data.rect[3] - coordinate.y;
        points.push(`${x},${y}`);
      }

      points = points.join(" ");
      const polyline = this.svgFactory.createElement(this.svgElementName);
      polyline.setAttribute("points", points);
      polyline.setAttribute("stroke-width", data.borderStyle.width || 1);
      polyline.setAttribute("stroke", "transparent");
      polyline.setAttribute("fill", "none");

      this._createPopup(this.container, polyline, data);

      svg.appendChild(polyline);
    }

    this.container.append(svg);
    return this.container;
  }

}

class HighlightAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
    super(parameters, isRenderable, true);
  }

  render() {
    this.container.className = "highlightAnnotation";

    if (!this.data.hasPopup) {
      this._createPopup(this.container, null, this.data);
    }

    return this.container;
  }

}

class UnderlineAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
    super(parameters, isRenderable, true);
  }

  render() {
    this.container.className = "underlineAnnotation";

    if (!this.data.hasPopup) {
      this._createPopup(this.container, null, this.data);
    }

    return this.container;
  }

}

class SquigglyAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
    super(parameters, isRenderable, true);
  }

  render() {
    this.container.className = "squigglyAnnotation";

    if (!this.data.hasPopup) {
      this._createPopup(this.container, null, this.data);
    }

    return this.container;
  }

}

class StrikeOutAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
    super(parameters, isRenderable, true);
  }

  render() {
    this.container.className = "strikeoutAnnotation";

    if (!this.data.hasPopup) {
      this._createPopup(this.container, null, this.data);
    }

    return this.container;
  }

}

class StampAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    const isRenderable = !!(parameters.data.hasPopup || parameters.data.title || parameters.data.contents);
    super(parameters, isRenderable, true);
  }

  render() {
    this.container.className = "stampAnnotation";

    if (!this.data.hasPopup) {
      this._createPopup(this.container, null, this.data);
    }

    return this.container;
  }

}

class FileAttachmentAnnotationElement extends AnnotationElement {
  constructor(parameters) {
    super(parameters, true);
    const {
      filename,
      content
    } = this.data.file;
    this.filename = (0, _display_utils.getFilenameFromUrl)(filename);
    this.content = content;

    if (this.linkService.eventBus) {
      this.linkService.eventBus.dispatch("fileattachmentannotation", {
        source: this,
        id: (0, _util.stringToPDFString)(filename),
        filename,
        content
      });
    }
  }

  render() {
    this.container.className = "fileAttachmentAnnotation";
    const trigger = document.createElement("div");
    trigger.style.height = this.container.style.height;
    trigger.style.width = this.container.style.width;
    trigger.addEventListener("dblclick", this._download.bind(this));

    if (!this.data.hasPopup && (this.data.title || this.data.contents)) {
      this._createPopup(this.container, trigger, this.data);
    }

    this.container.appendChild(trigger);
    return this.container;
  }

  _download() {
    if (!this.downloadManager) {
      (0, _util.warn)("Download cannot be started due to unavailable download manager");
      return;
    }

    this.downloadManager.downloadData(this.content, this.filename, "");
  }

}

class AnnotationLayer {
  static render(parameters) {
    const sortedAnnotations = [],
          popupAnnotations = [];

    for (const data of parameters.annotations) {
      if (!data) {
        continue;
      }

      if (data.annotationType === _util.AnnotationType.POPUP) {
        popupAnnotations.push(data);
        continue;
      }

      sortedAnnotations.push(data);
    }

    if (popupAnnotations.length) {
      sortedAnnotations.push(...popupAnnotations);
    }

    for (const data of sortedAnnotations) {
      const element = AnnotationElementFactory.create({
        data,
        layer: parameters.div,
        page: parameters.page,
        viewport: parameters.viewport,
        linkService: parameters.linkService,
        downloadManager: parameters.downloadManager,
        imageResourcesPath: parameters.imageResourcesPath || "",
        renderInteractiveForms: parameters.renderInteractiveForms || false,
        svgFactory: new _display_utils.DOMSVGFactory()
      });

      if (element.isRenderable) {
        parameters.div.appendChild(element.render());
      }
    }
  }

  static update(parameters) {
    for (const data of parameters.annotations) {
      const element = parameters.div.querySelector(`[data-annotation-id="${data.id}"]`);

      if (element) {
        element.style.transform = `matrix(${parameters.viewport.transform.join(",")})`;
      }
    }

    parameters.div.removeAttribute("hidden");
  }

}

exports.AnnotationLayer = AnnotationLayer;

/***/ }),
/* 17 */
/***/ (function(module, exports, __w_pdfjs_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderTextLayer = void 0;

var _util = __w_pdfjs_require__(2);

var renderTextLayer = function renderTextLayerClosure() {
  var MAX_TEXT_DIVS_TO_RENDER = 100000;
  var NonWhitespaceRegexp = /\S/;

  function isAllWhitespace(str) {
    return !NonWhitespaceRegexp.test(str);
  }

  function appendText(task, geom, styles) {
    var textDiv = document.createElement("span");
    var textDivProperties = {
      angle: 0,
      canvasWidth: 0,
      isWhitespace: false,
      originalTransform: null,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
      scale: 1
    };

    task._textDivs.push(textDiv);

    if (isAllWhitespace(geom.str)) {
      textDivProperties.isWhitespace = true;

      task._textDivProperties.set(textDiv, textDivProperties);

      return;
    }

    var tx = _util.Util.transform(task._viewport.transform, geom.transform);

    var angle = Math.atan2(tx[1], tx[0]);
    var style = styles[geom.fontName];

    if (style.vertical) {
      angle += Math.PI / 2;
    }

    var fontHeight = Math.sqrt(tx[2] * tx[2] + tx[3] * tx[3]);
    var fontAscent = fontHeight;

    if (style.ascent) {
      fontAscent = style.ascent * fontAscent;
    } else if (style.descent) {
      fontAscent = (1 + style.descent) * fontAscent;
    }

    let left, top;

    if (angle === 0) {
      left = tx[4];
      top = tx[5] - fontAscent;
    } else {
      left = tx[4] + fontAscent * Math.sin(angle);
      top = tx[5] - fontAscent * Math.cos(angle);
    }

    textDiv.style.left = `${left}px`;
    textDiv.style.top = `${top}px`;
    textDiv.style.fontSize = `${fontHeight}px`;
    textDiv.style.fontFamily = style.fontFamily;
    textDiv.textContent = geom.str;

    if (task._fontInspectorEnabled) {
      textDiv.dataset.fontName = geom.fontName;
    }

    if (angle !== 0) {
      textDivProperties.angle = angle * (180 / Math.PI);
    }

    let shouldScaleText = false;

    if (geom.str.length > 1) {
      shouldScaleText = true;
    } else if (geom.transform[0] !== geom.transform[3]) {
      const absScaleX = Math.abs(geom.transform[0]),
            absScaleY = Math.abs(geom.transform[3]);

      if (absScaleX !== absScaleY && Math.max(absScaleX, absScaleY) / Math.min(absScaleX, absScaleY) > 1.5) {
        shouldScaleText = true;
      }
    }

    if (shouldScaleText) {
      if (style.vertical) {
        textDivProperties.canvasWidth = geom.height * task._viewport.scale;
      } else {
        textDivProperties.canvasWidth = geom.width * task._viewport.scale;
      }
    }

    task._textDivProperties.set(textDiv, textDivProperties);

    if (task._textContentStream) {
      task._layoutText(textDiv);
    }

    if (task._enhanceTextSelection) {
      var angleCos = 1,
          angleSin = 0;

      if (angle !== 0) {
        angleCos = Math.cos(angle);
        angleSin = Math.sin(angle);
      }

      var divWidth = (style.vertical ? geom.height : geom.width) * task._viewport.scale;
      var divHeight = fontHeight;
      var m, b;

      if (angle !== 0) {
        m = [angleCos, angleSin, -angleSin, angleCos, left, top];
        b = _util.Util.getAxialAlignedBoundingBox([0, 0, divWidth, divHeight], m);
      } else {
        b = [left, top, left + divWidth, top + divHeight];
      }

      task._bounds.push({
        left: b[0],
        top: b[1],
        right: b[2],
        bottom: b[3],
        div: textDiv,
        size: [divWidth, divHeight],
        m
      });
    }
  }

  function render(task) {
    if (task._canceled) {
      return;
    }

    var textDivs = task._textDivs;
    var capability = task._capability;
    var textDivsLength = textDivs.length;

    if (textDivsLength > MAX_TEXT_DIVS_TO_RENDER) {
      task._renderingDone = true;
      capability.resolve();
      return;
    }

    if (!task._textContentStream) {
      for (var i = 0; i < textDivsLength; i++) {
        task._layoutText(textDivs[i]);
      }
    }

    task._renderingDone = true;
    capability.resolve();
  }

  function findPositiveMin(ts, offset, count) {
    let result = 0;

    for (let i = 0; i < count; i++) {
      const t = ts[offset++];

      if (t > 0) {
        result = result ? Math.min(t, result) : t;
      }
    }

    return result;
  }

  function expand(task) {
    var bounds = task._bounds;
    var viewport = task._viewport;
    var expanded = expandBounds(viewport.width, viewport.height, bounds);

    for (var i = 0; i < expanded.length; i++) {
      var div = bounds[i].div;

      var divProperties = task._textDivProperties.get(div);

      if (divProperties.angle === 0) {
        divProperties.paddingLeft = bounds[i].left - expanded[i].left;
        divProperties.paddingTop = bounds[i].top - expanded[i].top;
        divProperties.paddingRight = expanded[i].right - bounds[i].right;
        divProperties.paddingBottom = expanded[i].bottom - bounds[i].bottom;

        task._textDivProperties.set(div, divProperties);

        continue;
      }

      var e = expanded[i],
          b = bounds[i];
      var m = b.m,
          c = m[0],
          s = m[1];
      var points = [[0, 0], [0, b.size[1]], [b.size[0], 0], b.size];
      var ts = new Float64Array(64);
      points.forEach(function (p, j) {
        var t = _util.Util.applyTransform(p, m);

        ts[j + 0] = c && (e.left - t[0]) / c;
        ts[j + 4] = s && (e.top - t[1]) / s;
        ts[j + 8] = c && (e.right - t[0]) / c;
        ts[j + 12] = s && (e.bottom - t[1]) / s;
        ts[j + 16] = s && (e.left - t[0]) / -s;
        ts[j + 20] = c && (e.top - t[1]) / c;
        ts[j + 24] = s && (e.right - t[0]) / -s;
        ts[j + 28] = c && (e.bottom - t[1]) / c;
        ts[j + 32] = c && (e.left - t[0]) / -c;
        ts[j + 36] = s && (e.top - t[1]) / -s;
        ts[j + 40] = c && (e.right - t[0]) / -c;
        ts[j + 44] = s && (e.bottom - t[1]) / -s;
        ts[j + 48] = s && (e.left - t[0]) / s;
        ts[j + 52] = c && (e.top - t[1]) / -c;
        ts[j + 56] = s && (e.right - t[0]) / s;
        ts[j + 60] = c && (e.bottom - t[1]) / -c;
      });
      var boxScale = 1 + Math.min(Math.abs(c), Math.abs(s));
      divProperties.paddingLeft = findPositiveMin(ts, 32, 16) / boxScale;
      divProperties.paddingTop = findPositiveMin(ts, 48, 16) / boxScale;
      divProperties.paddingRight = findPositiveMin(ts, 0, 16) / boxScale;
      divProperties.paddingBottom = findPositiveMin(ts, 16, 16) / boxScale;

      task._textDivProperties.set(div, divProperties);
    }
  }

  function expandBounds(width, height, boxes) {
    var bounds = boxes.map(function (box, i) {
      return {
        x1: box.left,
        y1: box.top,
        x2: box.right,
        y2: box.bottom,
        index: i,
        x1New: undefined,
        x2New: undefined
      };
    });
    expandBoundsLTR(width, bounds);
    var expanded = new Array(boxes.length);
    bounds.forEach(function (b) {
      var i = b.index;
      expanded[i] = {
        left: b.x1New,
        top: 0,
        right: b.x2New,
        bottom: 0
      };
    });
    boxes.map(function (box, i) {
      var e = expanded[i],
          b = bounds[i];
      b.x1 = box.top;
      b.y1 = width - e.right;
      b.x2 = box.bottom;
      b.y2 = width - e.left;
      b.index = i;
      b.x1New = undefined;
      b.x2New = undefined;
    });
    expandBoundsLTR(height, bounds);
    bounds.forEach(function (b) {
      var i = b.index;
      expanded[i].top = b.x1New;
      expanded[i].bottom = b.x2New;
    });
    return expanded;
  }

  function expandBoundsLTR(width, bounds) {
    bounds.sort(function (a, b) {
      return a.x1 - b.x1 || a.index - b.index;
    });
    var fakeBoundary = {
      x1: -Infinity,
      y1: -Infinity,
      x2: 0,
      y2: Infinity,
      index: -1,
      x1New: 0,
      x2New: 0
    };
    var horizon = [{
      start: -Infinity,
      end: Infinity,
      boundary: fakeBoundary
    }];
    bounds.forEach(function (boundary) {
      var i = 0;

      while (i < horizon.length && horizon[i].end <= boundary.y1) {
        i++;
      }

      var j = horizon.length - 1;

      while (j >= 0 && horizon[j].start >= boundary.y2) {
        j--;
      }

      var horizonPart, affectedBoundary;
      var q,
          k,
          maxXNew = -Infinity;

      for (q = i; q <= j; q++) {
        horizonPart = horizon[q];
        affectedBoundary = horizonPart.boundary;
        var xNew;

        if (affectedBoundary.x2 > boundary.x1) {
          xNew = affectedBoundary.index > boundary.index ? affectedBoundary.x1New : boundary.x1;
        } else if (affectedBoundary.x2New === undefined) {
          xNew = (affectedBoundary.x2 + boundary.x1) / 2;
        } else {
          xNew = affectedBoundary.x2New;
        }

        if (xNew > maxXNew) {
          maxXNew = xNew;
        }
      }

      boundary.x1New = maxXNew;

      for (q = i; q <= j; q++) {
        horizonPart = horizon[q];
        affectedBoundary = horizonPart.boundary;

        if (affectedBoundary.x2New === undefined) {
          if (affectedBoundary.x2 > boundary.x1) {
            if (affectedBoundary.index > boundary.index) {
              affectedBoundary.x2New = affectedBoundary.x2;
            }
          } else {
            affectedBoundary.x2New = maxXNew;
          }
        } else if (affectedBoundary.x2New > maxXNew) {
          affectedBoundary.x2New = Math.max(maxXNew, affectedBoundary.x2);
        }
      }

      var changedHorizon = [],
          lastBoundary = null;

      for (q = i; q <= j; q++) {
        horizonPart = horizon[q];
        affectedBoundary = horizonPart.boundary;
        var useBoundary = affectedBoundary.x2 > boundary.x2 ? affectedBoundary : boundary;

        if (lastBoundary === useBoundary) {
          changedHorizon[changedHorizon.length - 1].end = horizonPart.end;
        } else {
          changedHorizon.push({
            start: horizonPart.start,
            end: horizonPart.end,
            boundary: useBoundary
          });
          lastBoundary = useBoundary;
        }
      }

      if (horizon[i].start < boundary.y1) {
        changedHorizon[0].start = boundary.y1;
        changedHorizon.unshift({
          start: horizon[i].start,
          end: boundary.y1,
          boundary: horizon[i].boundary
        });
      }

      if (boundary.y2 < horizon[j].end) {
        changedHorizon[changedHorizon.length - 1].end = boundary.y2;
        changedHorizon.push({
          start: boundary.y2,
          end: horizon[j].end,
          boundary: horizon[j].boundary
        });
      }

      for (q = i; q <= j; q++) {
        horizonPart = horizon[q];
        affectedBoundary = horizonPart.boundary;

        if (affectedBoundary.x2New !== undefined) {
          continue;
        }

        var used = false;

        for (k = i - 1; !used && k >= 0 && horizon[k].start >= affectedBoundary.y1; k--) {
          used = horizon[k].boundary === affectedBoundary;
        }

        for (k = j + 1; !used && k < horizon.length && horizon[k].end <= affectedBoundary.y2; k++) {
          used = horizon[k].boundary === affectedBoundary;
        }

        for (k = 0; !used && k < changedHorizon.length; k++) {
          used = changedHorizon[k].boundary === affectedBoundary;
        }

        if (!used) {
          affectedBoundary.x2New = maxXNew;
        }
      }

      Array.prototype.splice.apply(horizon, [i, j - i + 1].concat(changedHorizon));
    });
    horizon.forEach(function (horizonPart) {
      var affectedBoundary = horizonPart.boundary;

      if (affectedBoundary.x2New === undefined) {
        affectedBoundary.x2New = Math.max(width, affectedBoundary.x2);
      }
    });
  }

  function TextLayerRenderTask({
    textContent,
    textContentStream,
    container,
    viewport,
    textDivs,
    textContentPDFItemsStr,
    enhanceTextSelection
  }) {
    this._textContent = textContent;
    this._textContentStream = textContentStream;
    this._container = container;
    this._viewport = viewport;
    this._textDivs = textDivs || [];
    this._textContentPDFItemsStr = textContentPDFItemsStr || [];
    this._enhanceTextSelection = !!enhanceTextSelection;
    this._fontInspectorEnabled = !!(globalThis.FontInspector && globalThis.FontInspector.enabled);
    this._reader = null;
    this._layoutTextLastFontSize = null;
    this._layoutTextLastFontFamily = null;
    this._layoutTextCtx = null;
    this._textDivProperties = new WeakMap();
    this._renderingDone = false;
    this._canceled = false;
    this._capability = (0, _util.createPromiseCapability)();
    this._renderTimer = null;
    this._bounds = [];

    this._capability.promise.finally(() => {
      if (this._layoutTextCtx) {
        this._layoutTextCtx.canvas.width = 0;
        this._layoutTextCtx.canvas.height = 0;
        this._layoutTextCtx = null;
      }
    }).catch(() => {});
  }

  TextLayerRenderTask.prototype = {
    get promise() {
      return this._capability.promise;
    },

    cancel: function TextLayer_cancel() {
      this._canceled = true;

      if (this._reader) {
        this._reader.cancel(new _util.AbortException("TextLayer task cancelled."));

        this._reader = null;
      }

      if (this._renderTimer !== null) {
        clearTimeout(this._renderTimer);
        this._renderTimer = null;
      }

      this._capability.reject(new Error("TextLayer task cancelled."));
    },

    _processPDFItems(items, styleCache) {
      for (let i = 0, len = items.length; i < len; i++) {
        this._textContentPDFItemsStr.push(items[i].str);

        appendText(this, items[i], styleCache);
      }
    },

    _layoutText(textDiv) {
      const textDivProperties = this._textDivProperties.get(textDiv);

      if (textDivProperties.isWhitespace) {
        return;
      }

      let transform = "";

      if (textDivProperties.canvasWidth !== 0) {
        const {
          fontSize,
          fontFamily
        } = textDiv.style;

        if (fontSize !== this._layoutTextLastFontSize || fontFamily !== this._layoutTextLastFontFamily) {
          this._layoutTextCtx.font = `${fontSize} ${fontFamily}`;
          this._layoutTextLastFontSize = fontSize;
          this._layoutTextLastFontFamily = fontFamily;
        }

        const {
          width
        } = this._layoutTextCtx.measureText(textDiv.textContent);

        if (width > 0) {
          textDivProperties.scale = textDivProperties.canvasWidth / width;
          transform = `scaleX(${textDivProperties.scale})`;
        }
      }

      if (textDivProperties.angle !== 0) {
        transform = `rotate(${textDivProperties.angle}deg) ${transform}`;
      }

      if (transform.length > 0) {
        if (this._enhanceTextSelection) {
          textDivProperties.originalTransform = transform;
        }

        textDiv.style.transform = transform;
      }

      this._textDivProperties.set(textDiv, textDivProperties);

      this._container.appendChild(textDiv);
    },

    _render: function TextLayer_render(timeout) {
      const capability = (0, _util.createPromiseCapability)();
      let styleCache = Object.create(null);
      const canvas = document.createElement("canvas");
      canvas.mozOpaque = true;
      this._layoutTextCtx = canvas.getContext("2d", {
        alpha: false
      });

      if (this._textContent) {
        const textPDFItems = this._textContent.items;
        const textStyles = this._textContent.styles;

        this._processPDFItems(textPDFItems, textStyles);

        capability.resolve();
      } else if (this._textContentStream) {
        const pump = () => {
          this._reader.read().then(({
            value,
            done
          }) => {
            if (done) {
              capability.resolve();
              return;
            }

            Object.assign(styleCache, value.styles);

            this._processPDFItems(value.items, styleCache);

            pump();
          }, capability.reject);
        };

        this._reader = this._textContentStream.getReader();
        pump();
      } else {
        throw new Error('Neither "textContent" nor "textContentStream"' + " parameters specified.");
      }

      capability.promise.then(() => {
        styleCache = null;

        if (!timeout) {
          render(this);
        } else {
          this._renderTimer = setTimeout(() => {
            render(this);
            this._renderTimer = null;
          }, timeout);
        }
      }, this._capability.reject);
    },
    expandTextDivs: function TextLayer_expandTextDivs(expandDivs) {
      if (!this._enhanceTextSelection || !this._renderingDone) {
        return;
      }

      if (this._bounds !== null) {
        expand(this);
        this._bounds = null;
      }

      const transformBuf = [],
            paddingBuf = [];

      for (var i = 0, ii = this._textDivs.length; i < ii; i++) {
        const div = this._textDivs[i];

        const divProps = this._textDivProperties.get(div);

        if (divProps.isWhitespace) {
          continue;
        }

        if (expandDivs) {
          transformBuf.length = 0;
          paddingBuf.length = 0;

          if (divProps.originalTransform) {
            transformBuf.push(divProps.originalTransform);
          }

          if (divProps.paddingTop > 0) {
            paddingBuf.push(`${divProps.paddingTop}px`);
            transformBuf.push(`translateY(${-divProps.paddingTop}px)`);
          } else {
            paddingBuf.push(0);
          }

          if (divProps.paddingRight > 0) {
            paddingBuf.push(`${divProps.paddingRight / divProps.scale}px`);
          } else {
            paddingBuf.push(0);
          }

          if (divProps.paddingBottom > 0) {
            paddingBuf.push(`${divProps.paddingBottom}px`);
          } else {
            paddingBuf.push(0);
          }

          if (divProps.paddingLeft > 0) {
            paddingBuf.push(`${divProps.paddingLeft / divProps.scale}px`);
            transformBuf.push(`translateX(${-divProps.paddingLeft / divProps.scale}px)`);
          } else {
            paddingBuf.push(0);
          }

          div.style.padding = paddingBuf.join(" ");

          if (transformBuf.length) {
            div.style.transform = transformBuf.join(" ");
          }
        } else {
          div.style.padding = null;
          div.style.transform = divProps.originalTransform;
        }
      }
    }
  };

  function renderTextLayer(renderParameters) {
    var task = new TextLayerRenderTask({
      textContent: renderParameters.textContent,
      textContentStream: renderParameters.textContentStream,
      container: renderParameters.container,
      viewport: renderParameters.viewport,
      textDivs: renderParameters.textDivs,
      textContentPDFItemsStr: renderParameters.textContentPDFItemsStr,
      enhanceTextSelection: renderParameters.enhanceTextSelection
    });

    task._render(renderParameters.timeout);

    return task;
  }

  return renderTextLayer;
}();

exports.renderTextLayer = renderTextLayer;

/***/ }),
/* 18 */
/***/ (function(module, exports, __w_pdfjs_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SVGGraphics = void 0;

var _util = __w_pdfjs_require__(2);

var _display_utils = __w_pdfjs_require__(1);

var _is_node = __w_pdfjs_require__(4);

let SVGGraphics = function () {
  throw new Error("Not implemented: SVGGraphics");
};

exports.SVGGraphics = SVGGraphics;
{
  const SVG_DEFAULTS = {
    fontStyle: "normal",
    fontWeight: "normal",
    fillColor: "#000000"
  };
  const XML_NS = "http://www.w3.org/XML/1998/namespace";
  const XLINK_NS = "http://www.w3.org/1999/xlink";
  const LINE_CAP_STYLES = ["butt", "round", "square"];
  const LINE_JOIN_STYLES = ["miter", "round", "bevel"];

  const convertImgDataToPng = function () {
    const PNG_HEADER = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const CHUNK_WRAPPER_SIZE = 12;
    const crcTable = new Int32Array(256);

    for (let i = 0; i < 256; i++) {
      let c = i;

      for (let h = 0; h < 8; h++) {
        if (c & 1) {
          c = 0xedb88320 ^ c >> 1 & 0x7fffffff;
        } else {
          c = c >> 1 & 0x7fffffff;
        }
      }

      crcTable[i] = c;
    }

    function crc32(data, start, end) {
      let crc = -1;

      for (let i = start; i < end; i++) {
        const a = (crc ^ data[i]) & 0xff;
        const b = crcTable[a];
        crc = crc >>> 8 ^ b;
      }

      return crc ^ -1;
    }

    function writePngChunk(type, body, data, offset) {
      let p = offset;
      const len = body.length;
      data[p] = len >> 24 & 0xff;
      data[p + 1] = len >> 16 & 0xff;
      data[p + 2] = len >> 8 & 0xff;
      data[p + 3] = len & 0xff;
      p += 4;
      data[p] = type.charCodeAt(0) & 0xff;
      data[p + 1] = type.charCodeAt(1) & 0xff;
      data[p + 2] = type.charCodeAt(2) & 0xff;
      data[p + 3] = type.charCodeAt(3) & 0xff;
      p += 4;
      data.set(body, p);
      p += body.length;
      const crc = crc32(data, offset + 4, p);
      data[p] = crc >> 24 & 0xff;
      data[p + 1] = crc >> 16 & 0xff;
      data[p + 2] = crc >> 8 & 0xff;
      data[p + 3] = crc & 0xff;
    }

    function adler32(data, start, end) {
      let a = 1;
      let b = 0;

      for (let i = start; i < end; ++i) {
        a = (a + (data[i] & 0xff)) % 65521;
        b = (b + a) % 65521;
      }

      return b << 16 | a;
    }

    function deflateSync(literals) {
      if (!_is_node.isNodeJS) {
        return deflateSyncUncompressed(literals);
      }

      try {
        let input;

        if (parseInt(process.versions.node) >= 8) {
          input = literals;
        } else {
          input = Buffer.from(literals);
        }

        const output = require$$4.deflateSync(input, {
          level: 9
        });

        return output instanceof Uint8Array ? output : new Uint8Array(output);
      } catch (e) {
        (0, _util.warn)("Not compressing PNG because zlib.deflateSync is unavailable: " + e);
      }

      return deflateSyncUncompressed(literals);
    }

    function deflateSyncUncompressed(literals) {
      let len = literals.length;
      const maxBlockLength = 0xffff;
      const deflateBlocks = Math.ceil(len / maxBlockLength);
      const idat = new Uint8Array(2 + len + deflateBlocks * 5 + 4);
      let pi = 0;
      idat[pi++] = 0x78;
      idat[pi++] = 0x9c;
      let pos = 0;

      while (len > maxBlockLength) {
        idat[pi++] = 0x00;
        idat[pi++] = 0xff;
        idat[pi++] = 0xff;
        idat[pi++] = 0x00;
        idat[pi++] = 0x00;
        idat.set(literals.subarray(pos, pos + maxBlockLength), pi);
        pi += maxBlockLength;
        pos += maxBlockLength;
        len -= maxBlockLength;
      }

      idat[pi++] = 0x01;
      idat[pi++] = len & 0xff;
      idat[pi++] = len >> 8 & 0xff;
      idat[pi++] = ~len & 0xffff & 0xff;
      idat[pi++] = (~len & 0xffff) >> 8 & 0xff;
      idat.set(literals.subarray(pos), pi);
      pi += literals.length - pos;
      const adler = adler32(literals, 0, literals.length);
      idat[pi++] = adler >> 24 & 0xff;
      idat[pi++] = adler >> 16 & 0xff;
      idat[pi++] = adler >> 8 & 0xff;
      idat[pi++] = adler & 0xff;
      return idat;
    }

    function encode(imgData, kind, forceDataSchema, isMask) {
      const width = imgData.width;
      const height = imgData.height;
      let bitDepth, colorType, lineSize;
      const bytes = imgData.data;

      switch (kind) {
        case _util.ImageKind.GRAYSCALE_1BPP:
          colorType = 0;
          bitDepth = 1;
          lineSize = width + 7 >> 3;
          break;

        case _util.ImageKind.RGB_24BPP:
          colorType = 2;
          bitDepth = 8;
          lineSize = width * 3;
          break;

        case _util.ImageKind.RGBA_32BPP:
          colorType = 6;
          bitDepth = 8;
          lineSize = width * 4;
          break;

        default:
          throw new Error("invalid format");
      }

      const literals = new Uint8Array((1 + lineSize) * height);
      let offsetLiterals = 0,
          offsetBytes = 0;

      for (let y = 0; y < height; ++y) {
        literals[offsetLiterals++] = 0;
        literals.set(bytes.subarray(offsetBytes, offsetBytes + lineSize), offsetLiterals);
        offsetBytes += lineSize;
        offsetLiterals += lineSize;
      }

      if (kind === _util.ImageKind.GRAYSCALE_1BPP && isMask) {
        offsetLiterals = 0;

        for (let y = 0; y < height; y++) {
          offsetLiterals++;

          for (let i = 0; i < lineSize; i++) {
            literals[offsetLiterals++] ^= 0xff;
          }
        }
      }

      const ihdr = new Uint8Array([width >> 24 & 0xff, width >> 16 & 0xff, width >> 8 & 0xff, width & 0xff, height >> 24 & 0xff, height >> 16 & 0xff, height >> 8 & 0xff, height & 0xff, bitDepth, colorType, 0x00, 0x00, 0x00]);
      const idat = deflateSync(literals);
      const pngLength = PNG_HEADER.length + CHUNK_WRAPPER_SIZE * 3 + ihdr.length + idat.length;
      const data = new Uint8Array(pngLength);
      let offset = 0;
      data.set(PNG_HEADER, offset);
      offset += PNG_HEADER.length;
      writePngChunk("IHDR", ihdr, data, offset);
      offset += CHUNK_WRAPPER_SIZE + ihdr.length;
      writePngChunk("IDATA", idat, data, offset);
      offset += CHUNK_WRAPPER_SIZE + idat.length;
      writePngChunk("IEND", new Uint8Array(0), data, offset);
      return (0, _util.createObjectURL)(data, "image/png", forceDataSchema);
    }

    return function convertImgDataToPng(imgData, forceDataSchema, isMask) {
      const kind = imgData.kind === undefined ? _util.ImageKind.GRAYSCALE_1BPP : imgData.kind;
      return encode(imgData, kind, forceDataSchema, isMask);
    };
  }();

  class SVGExtraState {
    constructor() {
      this.fontSizeScale = 1;
      this.fontWeight = SVG_DEFAULTS.fontWeight;
      this.fontSize = 0;
      this.textMatrix = _util.IDENTITY_MATRIX;
      this.fontMatrix = _util.FONT_IDENTITY_MATRIX;
      this.leading = 0;
      this.textRenderingMode = _util.TextRenderingMode.FILL;
      this.textMatrixScale = 1;
      this.x = 0;
      this.y = 0;
      this.lineX = 0;
      this.lineY = 0;
      this.charSpacing = 0;
      this.wordSpacing = 0;
      this.textHScale = 1;
      this.textRise = 0;
      this.fillColor = SVG_DEFAULTS.fillColor;
      this.strokeColor = "#000000";
      this.fillAlpha = 1;
      this.strokeAlpha = 1;
      this.lineWidth = 1;
      this.lineJoin = "";
      this.lineCap = "";
      this.miterLimit = 0;
      this.dashArray = [];
      this.dashPhase = 0;
      this.dependencies = [];
      this.activeClipUrl = null;
      this.clipGroup = null;
      this.maskId = "";
    }

    clone() {
      return Object.create(this);
    }

    setCurrentPoint(x, y) {
      this.x = x;
      this.y = y;
    }

  }

  function opListToTree(opList) {
    let opTree = [];
    const tmp = [];

    for (const opListElement of opList) {
      if (opListElement.fn === "save") {
        opTree.push({
          fnId: 92,
          fn: "group",
          items: []
        });
        tmp.push(opTree);
        opTree = opTree[opTree.length - 1].items;
        continue;
      }

      if (opListElement.fn === "restore") {
        opTree = tmp.pop();
      } else {
        opTree.push(opListElement);
      }
    }

    return opTree;
  }

  function pf(value) {
    if (Number.isInteger(value)) {
      return value.toString();
    }

    const s = value.toFixed(10);
    let i = s.length - 1;

    if (s[i] !== "0") {
      return s;
    }

    do {
      i--;
    } while (s[i] === "0");

    return s.substring(0, s[i] === "." ? i : i + 1);
  }

  function pm(m) {
    if (m[4] === 0 && m[5] === 0) {
      if (m[1] === 0 && m[2] === 0) {
        if (m[0] === 1 && m[3] === 1) {
          return "";
        }

        return `scale(${pf(m[0])} ${pf(m[3])})`;
      }

      if (m[0] === m[3] && m[1] === -m[2]) {
        const a = Math.acos(m[0]) * 180 / Math.PI;
        return `rotate(${pf(a)})`;
      }
    } else {
      if (m[0] === 1 && m[1] === 0 && m[2] === 0 && m[3] === 1) {
        return `translate(${pf(m[4])} ${pf(m[5])})`;
      }
    }

    return `matrix(${pf(m[0])} ${pf(m[1])} ${pf(m[2])} ${pf(m[3])} ${pf(m[4])} ` + `${pf(m[5])})`;
  }

  let clipCount = 0;
  let maskCount = 0;
  let shadingCount = 0;
  exports.SVGGraphics = SVGGraphics = class SVGGraphics {
    constructor(commonObjs, objs, forceDataSchema = false) {
      this.svgFactory = new _display_utils.DOMSVGFactory();
      this.current = new SVGExtraState();
      this.transformMatrix = _util.IDENTITY_MATRIX;
      this.transformStack = [];
      this.extraStack = [];
      this.commonObjs = commonObjs;
      this.objs = objs;
      this.pendingClip = null;
      this.pendingEOFill = false;
      this.embedFonts = false;
      this.embeddedFonts = Object.create(null);
      this.cssStyle = null;
      this.forceDataSchema = !!forceDataSchema;
      this._operatorIdMapping = [];

      for (const op in _util.OPS) {
        this._operatorIdMapping[_util.OPS[op]] = op;
      }
    }

    save() {
      this.transformStack.push(this.transformMatrix);
      const old = this.current;
      this.extraStack.push(old);
      this.current = old.clone();
    }

    restore() {
      this.transformMatrix = this.transformStack.pop();
      this.current = this.extraStack.pop();
      this.pendingClip = null;
      this.tgrp = null;
    }

    group(items) {
      this.save();
      this.executeOpTree(items);
      this.restore();
    }

    loadDependencies(operatorList) {
      const fnArray = operatorList.fnArray;
      const argsArray = operatorList.argsArray;

      for (let i = 0, ii = fnArray.length; i < ii; i++) {
        if (fnArray[i] !== _util.OPS.dependency) {
          continue;
        }

        for (const obj of argsArray[i]) {
          const objsPool = obj.startsWith("g_") ? this.commonObjs : this.objs;
          const promise = new Promise(resolve => {
            objsPool.get(obj, resolve);
          });
          this.current.dependencies.push(promise);
        }
      }

      return Promise.all(this.current.dependencies);
    }

    transform(a, b, c, d, e, f) {
      const transformMatrix = [a, b, c, d, e, f];
      this.transformMatrix = _util.Util.transform(this.transformMatrix, transformMatrix);
      this.tgrp = null;
    }

    getSVG(operatorList, viewport) {
      this.viewport = viewport;

      const svgElement = this._initialize(viewport);

      return this.loadDependencies(operatorList).then(() => {
        this.transformMatrix = _util.IDENTITY_MATRIX;
        this.executeOpTree(this.convertOpList(operatorList));
        return svgElement;
      });
    }

    convertOpList(operatorList) {
      const operatorIdMapping = this._operatorIdMapping;
      const argsArray = operatorList.argsArray;
      const fnArray = operatorList.fnArray;
      const opList = [];

      for (let i = 0, ii = fnArray.length; i < ii; i++) {
        const fnId = fnArray[i];
        opList.push({
          fnId,
          fn: operatorIdMapping[fnId],
          args: argsArray[i]
        });
      }

      return opListToTree(opList);
    }

    executeOpTree(opTree) {
      for (const opTreeElement of opTree) {
        const fn = opTreeElement.fn;
        const fnId = opTreeElement.fnId;
        const args = opTreeElement.args;

        switch (fnId | 0) {
          case _util.OPS.beginText:
            this.beginText();
            break;

          case _util.OPS.dependency:
            break;

          case _util.OPS.setLeading:
            this.setLeading(args);
            break;

          case _util.OPS.setLeadingMoveText:
            this.setLeadingMoveText(args[0], args[1]);
            break;

          case _util.OPS.setFont:
            this.setFont(args);
            break;

          case _util.OPS.showText:
            this.showText(args[0]);
            break;

          case _util.OPS.showSpacedText:
            this.showText(args[0]);
            break;

          case _util.OPS.endText:
            this.endText();
            break;

          case _util.OPS.moveText:
            this.moveText(args[0], args[1]);
            break;

          case _util.OPS.setCharSpacing:
            this.setCharSpacing(args[0]);
            break;

          case _util.OPS.setWordSpacing:
            this.setWordSpacing(args[0]);
            break;

          case _util.OPS.setHScale:
            this.setHScale(args[0]);
            break;

          case _util.OPS.setTextMatrix:
            this.setTextMatrix(args[0], args[1], args[2], args[3], args[4], args[5]);
            break;

          case _util.OPS.setTextRise:
            this.setTextRise(args[0]);
            break;

          case _util.OPS.setTextRenderingMode:
            this.setTextRenderingMode(args[0]);
            break;

          case _util.OPS.setLineWidth:
            this.setLineWidth(args[0]);
            break;

          case _util.OPS.setLineJoin:
            this.setLineJoin(args[0]);
            break;

          case _util.OPS.setLineCap:
            this.setLineCap(args[0]);
            break;

          case _util.OPS.setMiterLimit:
            this.setMiterLimit(args[0]);
            break;

          case _util.OPS.setFillRGBColor:
            this.setFillRGBColor(args[0], args[1], args[2]);
            break;

          case _util.OPS.setStrokeRGBColor:
            this.setStrokeRGBColor(args[0], args[1], args[2]);
            break;

          case _util.OPS.setStrokeColorN:
            this.setStrokeColorN(args);
            break;

          case _util.OPS.setFillColorN:
            this.setFillColorN(args);
            break;

          case _util.OPS.shadingFill:
            this.shadingFill(args[0]);
            break;

          case _util.OPS.setDash:
            this.setDash(args[0], args[1]);
            break;

          case _util.OPS.setRenderingIntent:
            this.setRenderingIntent(args[0]);
            break;

          case _util.OPS.setFlatness:
            this.setFlatness(args[0]);
            break;

          case _util.OPS.setGState:
            this.setGState(args[0]);
            break;

          case _util.OPS.fill:
            this.fill();
            break;

          case _util.OPS.eoFill:
            this.eoFill();
            break;

          case _util.OPS.stroke:
            this.stroke();
            break;

          case _util.OPS.fillStroke:
            this.fillStroke();
            break;

          case _util.OPS.eoFillStroke:
            this.eoFillStroke();
            break;

          case _util.OPS.clip:
            this.clip("nonzero");
            break;

          case _util.OPS.eoClip:
            this.clip("evenodd");
            break;

          case _util.OPS.paintSolidColorImageMask:
            this.paintSolidColorImageMask();
            break;

          case _util.OPS.paintImageXObject:
            this.paintImageXObject(args[0]);
            break;

          case _util.OPS.paintInlineImageXObject:
            this.paintInlineImageXObject(args[0]);
            break;

          case _util.OPS.paintImageMaskXObject:
            this.paintImageMaskXObject(args[0]);
            break;

          case _util.OPS.paintFormXObjectBegin:
            this.paintFormXObjectBegin(args[0], args[1]);
            break;

          case _util.OPS.paintFormXObjectEnd:
            this.paintFormXObjectEnd();
            break;

          case _util.OPS.closePath:
            this.closePath();
            break;

          case _util.OPS.closeStroke:
            this.closeStroke();
            break;

          case _util.OPS.closeFillStroke:
            this.closeFillStroke();
            break;

          case _util.OPS.closeEOFillStroke:
            this.closeEOFillStroke();
            break;

          case _util.OPS.nextLine:
            this.nextLine();
            break;

          case _util.OPS.transform:
            this.transform(args[0], args[1], args[2], args[3], args[4], args[5]);
            break;

          case _util.OPS.constructPath:
            this.constructPath(args[0], args[1]);
            break;

          case _util.OPS.endPath:
            this.endPath();
            break;

          case 92:
            this.group(opTreeElement.items);
            break;

          default:
            (0, _util.warn)(`Unimplemented operator ${fn}`);
            break;
        }
      }
    }

    setWordSpacing(wordSpacing) {
      this.current.wordSpacing = wordSpacing;
    }

    setCharSpacing(charSpacing) {
      this.current.charSpacing = charSpacing;
    }

    nextLine() {
      this.moveText(0, this.current.leading);
    }

    setTextMatrix(a, b, c, d, e, f) {
      const current = this.current;
      current.textMatrix = current.lineMatrix = [a, b, c, d, e, f];
      current.textMatrixScale = Math.sqrt(a * a + b * b);
      current.x = current.lineX = 0;
      current.y = current.lineY = 0;
      current.xcoords = [];
      current.ycoords = [];
      current.tspan = this.svgFactory.createElement("svg:tspan");
      current.tspan.setAttributeNS(null, "font-family", current.fontFamily);
      current.tspan.setAttributeNS(null, "font-size", `${pf(current.fontSize)}px`);
      current.tspan.setAttributeNS(null, "y", pf(-current.y));
      current.txtElement = this.svgFactory.createElement("svg:text");
      current.txtElement.appendChild(current.tspan);
    }

    beginText() {
      const current = this.current;
      current.x = current.lineX = 0;
      current.y = current.lineY = 0;
      current.textMatrix = _util.IDENTITY_MATRIX;
      current.lineMatrix = _util.IDENTITY_MATRIX;
      current.textMatrixScale = 1;
      current.tspan = this.svgFactory.createElement("svg:tspan");
      current.txtElement = this.svgFactory.createElement("svg:text");
      current.txtgrp = this.svgFactory.createElement("svg:g");
      current.xcoords = [];
      current.ycoords = [];
    }

    moveText(x, y) {
      const current = this.current;
      current.x = current.lineX += x;
      current.y = current.lineY += y;
      current.xcoords = [];
      current.ycoords = [];
      current.tspan = this.svgFactory.createElement("svg:tspan");
      current.tspan.setAttributeNS(null, "font-family", current.fontFamily);
      current.tspan.setAttributeNS(null, "font-size", `${pf(current.fontSize)}px`);
      current.tspan.setAttributeNS(null, "y", pf(-current.y));
    }

    showText(glyphs) {
      const current = this.current;
      const font = current.font;
      const fontSize = current.fontSize;

      if (fontSize === 0) {
        return;
      }

      const fontSizeScale = current.fontSizeScale;
      const charSpacing = current.charSpacing;
      const wordSpacing = current.wordSpacing;
      const fontDirection = current.fontDirection;
      const textHScale = current.textHScale * fontDirection;
      const vertical = font.vertical;
      const spacingDir = vertical ? 1 : -1;
      const defaultVMetrics = font.defaultVMetrics;
      const widthAdvanceScale = fontSize * current.fontMatrix[0];
      let x = 0;

      for (const glyph of glyphs) {
        if (glyph === null) {
          x += fontDirection * wordSpacing;
          continue;
        } else if ((0, _util.isNum)(glyph)) {
          x += spacingDir * glyph * fontSize / 1000;
          continue;
        }

        const spacing = (glyph.isSpace ? wordSpacing : 0) + charSpacing;
        const character = glyph.fontChar;
        let scaledX, scaledY;
        let width = glyph.width;

        if (vertical) {
          let vx;
          const vmetric = glyph.vmetric || defaultVMetrics;
          vx = glyph.vmetric ? vmetric[1] : width * 0.5;
          vx = -vx * widthAdvanceScale;
          const vy = vmetric[2] * widthAdvanceScale;
          width = vmetric ? -vmetric[0] : width;
          scaledX = vx / fontSizeScale;
          scaledY = (x + vy) / fontSizeScale;
        } else {
          scaledX = x / fontSizeScale;
          scaledY = 0;
        }

        if (glyph.isInFont || font.missingFile) {
          current.xcoords.push(current.x + scaledX);

          if (vertical) {
            current.ycoords.push(-current.y + scaledY);
          }

          current.tspan.textContent += character;
        }

        let charWidth;

        if (vertical) {
          charWidth = width * widthAdvanceScale - spacing * fontDirection;
        } else {
          charWidth = width * widthAdvanceScale + spacing * fontDirection;
        }

        x += charWidth;
      }

      current.tspan.setAttributeNS(null, "x", current.xcoords.map(pf).join(" "));

      if (vertical) {
        current.tspan.setAttributeNS(null, "y", current.ycoords.map(pf).join(" "));
      } else {
        current.tspan.setAttributeNS(null, "y", pf(-current.y));
      }

      if (vertical) {
        current.y -= x;
      } else {
        current.x += x * textHScale;
      }

      current.tspan.setAttributeNS(null, "font-family", current.fontFamily);
      current.tspan.setAttributeNS(null, "font-size", `${pf(current.fontSize)}px`);

      if (current.fontStyle !== SVG_DEFAULTS.fontStyle) {
        current.tspan.setAttributeNS(null, "font-style", current.fontStyle);
      }

      if (current.fontWeight !== SVG_DEFAULTS.fontWeight) {
        current.tspan.setAttributeNS(null, "font-weight", current.fontWeight);
      }

      const fillStrokeMode = current.textRenderingMode & _util.TextRenderingMode.FILL_STROKE_MASK;

      if (fillStrokeMode === _util.TextRenderingMode.FILL || fillStrokeMode === _util.TextRenderingMode.FILL_STROKE) {
        if (current.fillColor !== SVG_DEFAULTS.fillColor) {
          current.tspan.setAttributeNS(null, "fill", current.fillColor);
        }

        if (current.fillAlpha < 1) {
          current.tspan.setAttributeNS(null, "fill-opacity", current.fillAlpha);
        }
      } else if (current.textRenderingMode === _util.TextRenderingMode.ADD_TO_PATH) {
        current.tspan.setAttributeNS(null, "fill", "transparent");
      } else {
        current.tspan.setAttributeNS(null, "fill", "none");
      }

      if (fillStrokeMode === _util.TextRenderingMode.STROKE || fillStrokeMode === _util.TextRenderingMode.FILL_STROKE) {
        const lineWidthScale = 1 / (current.textMatrixScale || 1);

        this._setStrokeAttributes(current.tspan, lineWidthScale);
      }

      let textMatrix = current.textMatrix;

      if (current.textRise !== 0) {
        textMatrix = textMatrix.slice();
        textMatrix[5] += current.textRise;
      }

      current.txtElement.setAttributeNS(null, "transform", `${pm(textMatrix)} scale(${pf(textHScale)}, -1)`);
      current.txtElement.setAttributeNS(XML_NS, "xml:space", "preserve");
      current.txtElement.appendChild(current.tspan);
      current.txtgrp.appendChild(current.txtElement);

      this._ensureTransformGroup().appendChild(current.txtElement);
    }

    setLeadingMoveText(x, y) {
      this.setLeading(-y);
      this.moveText(x, y);
    }

    addFontStyle(fontObj) {
      if (!fontObj.data) {
        throw new Error("addFontStyle: No font data available, " + 'ensure that the "fontExtraProperties" API parameter is set.');
      }

      if (!this.cssStyle) {
        this.cssStyle = this.svgFactory.createElement("svg:style");
        this.cssStyle.setAttributeNS(null, "type", "text/css");
        this.defs.appendChild(this.cssStyle);
      }

      const url = (0, _util.createObjectURL)(fontObj.data, fontObj.mimetype, this.forceDataSchema);
      this.cssStyle.textContent += `@font-face { font-family: "${fontObj.loadedName}";` + ` src: url(${url}); }\n`;
    }

    setFont(details) {
      const current = this.current;
      const fontObj = this.commonObjs.get(details[0]);
      let size = details[1];
      current.font = fontObj;

      if (this.embedFonts && !fontObj.missingFile && !this.embeddedFonts[fontObj.loadedName]) {
        this.addFontStyle(fontObj);
        this.embeddedFonts[fontObj.loadedName] = fontObj;
      }

      current.fontMatrix = fontObj.fontMatrix ? fontObj.fontMatrix : _util.FONT_IDENTITY_MATRIX;
      let bold = "normal";

      if (fontObj.black) {
        bold = "900";
      } else if (fontObj.bold) {
        bold = "bold";
      }

      const italic = fontObj.italic ? "italic" : "normal";

      if (size < 0) {
        size = -size;
        current.fontDirection = -1;
      } else {
        current.fontDirection = 1;
      }

      current.fontSize = size;
      current.fontFamily = fontObj.loadedName;
      current.fontWeight = bold;
      current.fontStyle = italic;
      current.tspan = this.svgFactory.createElement("svg:tspan");
      current.tspan.setAttributeNS(null, "y", pf(-current.y));
      current.xcoords = [];
      current.ycoords = [];
    }

    endText() {
      const current = this.current;

      if (current.textRenderingMode & _util.TextRenderingMode.ADD_TO_PATH_FLAG && current.txtElement && current.txtElement.hasChildNodes()) {
        current.element = current.txtElement;
        this.clip("nonzero");
        this.endPath();
      }
    }

    setLineWidth(width) {
      if (width > 0) {
        this.current.lineWidth = width;
      }
    }

    setLineCap(style) {
      this.current.lineCap = LINE_CAP_STYLES[style];
    }

    setLineJoin(style) {
      this.current.lineJoin = LINE_JOIN_STYLES[style];
    }

    setMiterLimit(limit) {
      this.current.miterLimit = limit;
    }

    setStrokeAlpha(strokeAlpha) {
      this.current.strokeAlpha = strokeAlpha;
    }

    setStrokeRGBColor(r, g, b) {
      this.current.strokeColor = _util.Util.makeCssRgb(r, g, b);
    }

    setFillAlpha(fillAlpha) {
      this.current.fillAlpha = fillAlpha;
    }

    setFillRGBColor(r, g, b) {
      this.current.fillColor = _util.Util.makeCssRgb(r, g, b);
      this.current.tspan = this.svgFactory.createElement("svg:tspan");
      this.current.xcoords = [];
      this.current.ycoords = [];
    }

    setStrokeColorN(args) {
      this.current.strokeColor = this._makeColorN_Pattern(args);
    }

    setFillColorN(args) {
      this.current.fillColor = this._makeColorN_Pattern(args);
    }

    shadingFill(args) {
      const width = this.viewport.width;
      const height = this.viewport.height;

      const inv = _util.Util.inverseTransform(this.transformMatrix);

      const bl = _util.Util.applyTransform([0, 0], inv);

      const br = _util.Util.applyTransform([0, height], inv);

      const ul = _util.Util.applyTransform([width, 0], inv);

      const ur = _util.Util.applyTransform([width, height], inv);

      const x0 = Math.min(bl[0], br[0], ul[0], ur[0]);
      const y0 = Math.min(bl[1], br[1], ul[1], ur[1]);
      const x1 = Math.max(bl[0], br[0], ul[0], ur[0]);
      const y1 = Math.max(bl[1], br[1], ul[1], ur[1]);
      const rect = this.svgFactory.createElement("svg:rect");
      rect.setAttributeNS(null, "x", x0);
      rect.setAttributeNS(null, "y", y0);
      rect.setAttributeNS(null, "width", x1 - x0);
      rect.setAttributeNS(null, "height", y1 - y0);
      rect.setAttributeNS(null, "fill", this._makeShadingPattern(args));

      if (this.current.fillAlpha < 1) {
        rect.setAttributeNS(null, "fill-opacity", this.current.fillAlpha);
      }

      this._ensureTransformGroup().appendChild(rect);
    }

    _makeColorN_Pattern(args) {
      if (args[0] === "TilingPattern") {
        return this._makeTilingPattern(args);
      }

      return this._makeShadingPattern(args);
    }

    _makeTilingPattern(args) {
      const color = args[1];
      const operatorList = args[2];
      const matrix = args[3] || _util.IDENTITY_MATRIX;
      const [x0, y0, x1, y1] = args[4];
      const xstep = args[5];
      const ystep = args[6];
      const paintType = args[7];
      const tilingId = `shading${shadingCount++}`;

      const [tx0, ty0] = _util.Util.applyTransform([x0, y0], matrix);

      const [tx1, ty1] = _util.Util.applyTransform([x1, y1], matrix);

      const [xscale, yscale] = _util.Util.singularValueDecompose2dScale(matrix);

      const txstep = xstep * xscale;
      const tystep = ystep * yscale;
      const tiling = this.svgFactory.createElement("svg:pattern");
      tiling.setAttributeNS(null, "id", tilingId);
      tiling.setAttributeNS(null, "patternUnits", "userSpaceOnUse");
      tiling.setAttributeNS(null, "width", txstep);
      tiling.setAttributeNS(null, "height", tystep);
      tiling.setAttributeNS(null, "x", `${tx0}`);
      tiling.setAttributeNS(null, "y", `${ty0}`);
      const svg = this.svg;
      const transformMatrix = this.transformMatrix;
      const fillColor = this.current.fillColor;
      const strokeColor = this.current.strokeColor;
      const bbox = this.svgFactory.create(tx1 - tx0, ty1 - ty0);
      this.svg = bbox;
      this.transformMatrix = matrix;

      if (paintType === 2) {
        const cssColor = _util.Util.makeCssRgb(...color);

        this.current.fillColor = cssColor;
        this.current.strokeColor = cssColor;
      }

      this.executeOpTree(this.convertOpList(operatorList));
      this.svg = svg;
      this.transformMatrix = transformMatrix;
      this.current.fillColor = fillColor;
      this.current.strokeColor = strokeColor;
      tiling.appendChild(bbox.childNodes[0]);
      this.defs.appendChild(tiling);
      return `url(#${tilingId})`;
    }

    _makeShadingPattern(args) {
      switch (args[0]) {
        case "RadialAxial":
          const shadingId = `shading${shadingCount++}`;
          const colorStops = args[3];
          let gradient;

          switch (args[1]) {
            case "axial":
              const point0 = args[4];
              const point1 = args[5];
              gradient = this.svgFactory.createElement("svg:linearGradient");
              gradient.setAttributeNS(null, "id", shadingId);
              gradient.setAttributeNS(null, "gradientUnits", "userSpaceOnUse");
              gradient.setAttributeNS(null, "x1", point0[0]);
              gradient.setAttributeNS(null, "y1", point0[1]);
              gradient.setAttributeNS(null, "x2", point1[0]);
              gradient.setAttributeNS(null, "y2", point1[1]);
              break;

            case "radial":
              const focalPoint = args[4];
              const circlePoint = args[5];
              const focalRadius = args[6];
              const circleRadius = args[7];
              gradient = this.svgFactory.createElement("svg:radialGradient");
              gradient.setAttributeNS(null, "id", shadingId);
              gradient.setAttributeNS(null, "gradientUnits", "userSpaceOnUse");
              gradient.setAttributeNS(null, "cx", circlePoint[0]);
              gradient.setAttributeNS(null, "cy", circlePoint[1]);
              gradient.setAttributeNS(null, "r", circleRadius);
              gradient.setAttributeNS(null, "fx", focalPoint[0]);
              gradient.setAttributeNS(null, "fy", focalPoint[1]);
              gradient.setAttributeNS(null, "fr", focalRadius);
              break;

            default:
              throw new Error(`Unknown RadialAxial type: ${args[1]}`);
          }

          for (const colorStop of colorStops) {
            const stop = this.svgFactory.createElement("svg:stop");
            stop.setAttributeNS(null, "offset", colorStop[0]);
            stop.setAttributeNS(null, "stop-color", colorStop[1]);
            gradient.appendChild(stop);
          }

          this.defs.appendChild(gradient);
          return `url(#${shadingId})`;

        case "Mesh":
          (0, _util.warn)("Unimplemented pattern Mesh");
          return null;

        case "Dummy":
          return "hotpink";

        default:
          throw new Error(`Unknown IR type: ${args[0]}`);
      }
    }

    setDash(dashArray, dashPhase) {
      this.current.dashArray = dashArray;
      this.current.dashPhase = dashPhase;
    }

    constructPath(ops, args) {
      const current = this.current;
      let x = current.x,
          y = current.y;
      let d = [];
      let j = 0;

      for (const op of ops) {
        switch (op | 0) {
          case _util.OPS.rectangle:
            x = args[j++];
            y = args[j++];
            const width = args[j++];
            const height = args[j++];
            const xw = x + width;
            const yh = y + height;
            d.push("M", pf(x), pf(y), "L", pf(xw), pf(y), "L", pf(xw), pf(yh), "L", pf(x), pf(yh), "Z");
            break;

          case _util.OPS.moveTo:
            x = args[j++];
            y = args[j++];
            d.push("M", pf(x), pf(y));
            break;

          case _util.OPS.lineTo:
            x = args[j++];
            y = args[j++];
            d.push("L", pf(x), pf(y));
            break;

          case _util.OPS.curveTo:
            x = args[j + 4];
            y = args[j + 5];
            d.push("C", pf(args[j]), pf(args[j + 1]), pf(args[j + 2]), pf(args[j + 3]), pf(x), pf(y));
            j += 6;
            break;

          case _util.OPS.curveTo2:
            d.push("C", pf(x), pf(y), pf(args[j]), pf(args[j + 1]), pf(args[j + 2]), pf(args[j + 3]));
            x = args[j + 2];
            y = args[j + 3];
            j += 4;
            break;

          case _util.OPS.curveTo3:
            x = args[j + 2];
            y = args[j + 3];
            d.push("C", pf(args[j]), pf(args[j + 1]), pf(x), pf(y), pf(x), pf(y));
            j += 4;
            break;

          case _util.OPS.closePath:
            d.push("Z");
            break;
        }
      }

      d = d.join(" ");

      if (current.path && ops.length > 0 && ops[0] !== _util.OPS.rectangle && ops[0] !== _util.OPS.moveTo) {
        d = current.path.getAttributeNS(null, "d") + d;
      } else {
        current.path = this.svgFactory.createElement("svg:path");

        this._ensureTransformGroup().appendChild(current.path);
      }

      current.path.setAttributeNS(null, "d", d);
      current.path.setAttributeNS(null, "fill", "none");
      current.element = current.path;
      current.setCurrentPoint(x, y);
    }

    endPath() {
      const current = this.current;
      current.path = null;

      if (!this.pendingClip) {
        return;
      }

      if (!current.element) {
        this.pendingClip = null;
        return;
      }

      const clipId = `clippath${clipCount++}`;
      const clipPath = this.svgFactory.createElement("svg:clipPath");
      clipPath.setAttributeNS(null, "id", clipId);
      clipPath.setAttributeNS(null, "transform", pm(this.transformMatrix));
      const clipElement = current.element.cloneNode(true);

      if (this.pendingClip === "evenodd") {
        clipElement.setAttributeNS(null, "clip-rule", "evenodd");
      } else {
        clipElement.setAttributeNS(null, "clip-rule", "nonzero");
      }

      this.pendingClip = null;
      clipPath.appendChild(clipElement);
      this.defs.appendChild(clipPath);

      if (current.activeClipUrl) {
        current.clipGroup = null;
        this.extraStack.forEach(function (prev) {
          prev.clipGroup = null;
        });
        clipPath.setAttributeNS(null, "clip-path", current.activeClipUrl);
      }

      current.activeClipUrl = `url(#${clipId})`;
      this.tgrp = null;
    }

    clip(type) {
      this.pendingClip = type;
    }

    closePath() {
      const current = this.current;

      if (current.path) {
        const d = `${current.path.getAttributeNS(null, "d")}Z`;
        current.path.setAttributeNS(null, "d", d);
      }
    }

    setLeading(leading) {
      this.current.leading = -leading;
    }

    setTextRise(textRise) {
      this.current.textRise = textRise;
    }

    setTextRenderingMode(textRenderingMode) {
      this.current.textRenderingMode = textRenderingMode;
    }

    setHScale(scale) {
      this.current.textHScale = scale / 100;
    }

    setRenderingIntent(intent) {}

    setFlatness(flatness) {}

    setGState(states) {
      for (const [key, value] of states) {
        switch (key) {
          case "LW":
            this.setLineWidth(value);
            break;

          case "LC":
            this.setLineCap(value);
            break;

          case "LJ":
            this.setLineJoin(value);
            break;

          case "ML":
            this.setMiterLimit(value);
            break;

          case "D":
            this.setDash(value[0], value[1]);
            break;

          case "RI":
            this.setRenderingIntent(value);
            break;

          case "FL":
            this.setFlatness(value);
            break;

          case "Font":
            this.setFont(value);
            break;

          case "CA":
            this.setStrokeAlpha(value);
            break;

          case "ca":
            this.setFillAlpha(value);
            break;

          default:
            (0, _util.warn)(`Unimplemented graphic state operator ${key}`);
            break;
        }
      }
    }

    fill() {
      const current = this.current;

      if (current.element) {
        current.element.setAttributeNS(null, "fill", current.fillColor);
        current.element.setAttributeNS(null, "fill-opacity", current.fillAlpha);
        this.endPath();
      }
    }

    stroke() {
      const current = this.current;

      if (current.element) {
        this._setStrokeAttributes(current.element);

        current.element.setAttributeNS(null, "fill", "none");
        this.endPath();
      }
    }

    _setStrokeAttributes(element, lineWidthScale = 1) {
      const current = this.current;
      let dashArray = current.dashArray;

      if (lineWidthScale !== 1 && dashArray.length > 0) {
        dashArray = dashArray.map(function (value) {
          return lineWidthScale * value;
        });
      }

      element.setAttributeNS(null, "stroke", current.strokeColor);
      element.setAttributeNS(null, "stroke-opacity", current.strokeAlpha);
      element.setAttributeNS(null, "stroke-miterlimit", pf(current.miterLimit));
      element.setAttributeNS(null, "stroke-linecap", current.lineCap);
      element.setAttributeNS(null, "stroke-linejoin", current.lineJoin);
      element.setAttributeNS(null, "stroke-width", pf(lineWidthScale * current.lineWidth) + "px");
      element.setAttributeNS(null, "stroke-dasharray", dashArray.map(pf).join(" "));
      element.setAttributeNS(null, "stroke-dashoffset", pf(lineWidthScale * current.dashPhase) + "px");
    }

    eoFill() {
      if (this.current.element) {
        this.current.element.setAttributeNS(null, "fill-rule", "evenodd");
      }

      this.fill();
    }

    fillStroke() {
      this.stroke();
      this.fill();
    }

    eoFillStroke() {
      if (this.current.element) {
        this.current.element.setAttributeNS(null, "fill-rule", "evenodd");
      }

      this.fillStroke();
    }

    closeStroke() {
      this.closePath();
      this.stroke();
    }

    closeFillStroke() {
      this.closePath();
      this.fillStroke();
    }

    closeEOFillStroke() {
      this.closePath();
      this.eoFillStroke();
    }

    paintSolidColorImageMask() {
      const rect = this.svgFactory.createElement("svg:rect");
      rect.setAttributeNS(null, "x", "0");
      rect.setAttributeNS(null, "y", "0");
      rect.setAttributeNS(null, "width", "1px");
      rect.setAttributeNS(null, "height", "1px");
      rect.setAttributeNS(null, "fill", this.current.fillColor);

      this._ensureTransformGroup().appendChild(rect);
    }

    paintImageXObject(objId) {
      //const imgData = this.objs.get(objId);
      const imgData = objId.startsWith("g_") ? this.commonObjs.get(objId) : this.objs.get(objId);

      if (!imgData) {
        (0, _util.warn)(`Dependent image with object ID ${objId} is not ready yet`);
        return;
      }

      this.paintInlineImageXObject(imgData);
    }

    paintInlineImageXObject(imgData, mask) {
      const width = imgData.width;
      const height = imgData.height;
      const imgSrc = convertImgDataToPng(imgData, this.forceDataSchema, !!mask);
      const cliprect = this.svgFactory.createElement("svg:rect");
      cliprect.setAttributeNS(null, "x", "0");
      cliprect.setAttributeNS(null, "y", "0");
      cliprect.setAttributeNS(null, "width", pf(width));
      cliprect.setAttributeNS(null, "height", pf(height));
      this.current.element = cliprect;
      this.clip("nonzero");
      const imgEl = this.svgFactory.createElement("svg:image");
      imgEl.setAttributeNS(XLINK_NS, "xlink:href", imgSrc);
      imgEl.setAttributeNS(null, "x", "0");
      imgEl.setAttributeNS(null, "y", pf(-height));
      imgEl.setAttributeNS(null, "width", pf(width) + "px");
      imgEl.setAttributeNS(null, "height", pf(height) + "px");
      imgEl.setAttributeNS(null, "transform", `scale(${pf(1 / width)} ${pf(-1 / height)})`);

      if (mask) {
        mask.appendChild(imgEl);
      } else {
        this._ensureTransformGroup().appendChild(imgEl);
      }
    }

    paintImageMaskXObject(imgData) {
      const current = this.current;
      const width = imgData.width;
      const height = imgData.height;
      const fillColor = current.fillColor;
      current.maskId = `mask${maskCount++}`;
      const mask = this.svgFactory.createElement("svg:mask");
      mask.setAttributeNS(null, "id", current.maskId);
      const rect = this.svgFactory.createElement("svg:rect");
      rect.setAttributeNS(null, "x", "0");
      rect.setAttributeNS(null, "y", "0");
      rect.setAttributeNS(null, "width", pf(width));
      rect.setAttributeNS(null, "height", pf(height));
      rect.setAttributeNS(null, "fill", fillColor);
      rect.setAttributeNS(null, "mask", `url(#${current.maskId})`);
      this.defs.appendChild(mask);

      this._ensureTransformGroup().appendChild(rect);

      this.paintInlineImageXObject(imgData, mask);
    }

    paintFormXObjectBegin(matrix, bbox) {
      if (Array.isArray(matrix) && matrix.length === 6) {
        this.transform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
      }

      if (bbox) {
        const width = bbox[2] - bbox[0];
        const height = bbox[3] - bbox[1];
        const cliprect = this.svgFactory.createElement("svg:rect");
        cliprect.setAttributeNS(null, "x", bbox[0]);
        cliprect.setAttributeNS(null, "y", bbox[1]);
        cliprect.setAttributeNS(null, "width", pf(width));
        cliprect.setAttributeNS(null, "height", pf(height));
        this.current.element = cliprect;
        this.clip("nonzero");
        this.endPath();
      }
    }

    paintFormXObjectEnd() {}

    _initialize(viewport) {
      const svg = this.svgFactory.create(viewport.width, viewport.height);
      const definitions = this.svgFactory.createElement("svg:defs");
      svg.appendChild(definitions);
      this.defs = definitions;
      const rootGroup = this.svgFactory.createElement("svg:g");
      rootGroup.setAttributeNS(null, "transform", pm(viewport.transform));
      svg.appendChild(rootGroup);
      this.svg = rootGroup;
      return svg;
    }

    _ensureClipGroup() {
      if (!this.current.clipGroup) {
        const clipGroup = this.svgFactory.createElement("svg:g");
        clipGroup.setAttributeNS(null, "clip-path", this.current.activeClipUrl);
        this.svg.appendChild(clipGroup);
        this.current.clipGroup = clipGroup;
      }

      return this.current.clipGroup;
    }

    _ensureTransformGroup() {
      if (!this.tgrp) {
        this.tgrp = this.svgFactory.createElement("svg:g");
        this.tgrp.setAttributeNS(null, "transform", pm(this.transformMatrix));

        if (this.current.activeClipUrl) {
          this._ensureClipGroup().appendChild(this.tgrp);
        } else {
          this.svg.appendChild(this.tgrp);
        }
      }

      return this.tgrp;
    }

  };
}

/***/ }),
/* 19 */
/***/ (function(module, exports, __w_pdfjs_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PDFNodeStream = void 0;

var _util = __w_pdfjs_require__(2);

var _network_utils = __w_pdfjs_require__(20);

const fs = require$$4;

const http = require$$4;

const https = require$$4;

const url = require$$4;

const fileUriRegex = /^file:\/\/\/[a-zA-Z]:\//;

function parseUrl(sourceUrl) {
  const parsedUrl = url.parse(sourceUrl);

  if (parsedUrl.protocol === "file:" || parsedUrl.host) {
    return parsedUrl;
  }

  if (/^[a-z]:[/\\]/i.test(sourceUrl)) {
    return url.parse(`file:///${sourceUrl}`);
  }

  if (!parsedUrl.host) {
    parsedUrl.protocol = "file:";
  }

  return parsedUrl;
}

class PDFNodeStream {
  constructor(source) {
    this.source = source;
    this.url = parseUrl(source.url);
    this.isHttp = this.url.protocol === "http:" || this.url.protocol === "https:";
    this.isFsUrl = this.url.protocol === "file:";
    this.httpHeaders = this.isHttp && source.httpHeaders || {};
    this._fullRequestReader = null;
    this._rangeRequestReaders = [];
  }

  get _progressiveDataLength() {
    return this._fullRequestReader ? this._fullRequestReader._loaded : 0;
  }

  getFullReader() {
    (0, _util.assert)(!this._fullRequestReader, "PDFNodeStream.getFullReader can only be called once.");
    this._fullRequestReader = this.isFsUrl ? new PDFNodeStreamFsFullReader(this) : new PDFNodeStreamFullReader(this);
    return this._fullRequestReader;
  }

  getRangeReader(start, end) {
    if (end <= this._progressiveDataLength) {
      return null;
    }

    const rangeReader = this.isFsUrl ? new PDFNodeStreamFsRangeReader(this, start, end) : new PDFNodeStreamRangeReader(this, start, end);

    this._rangeRequestReaders.push(rangeReader);

    return rangeReader;
  }

  cancelAllRequests(reason) {
    if (this._fullRequestReader) {
      this._fullRequestReader.cancel(reason);
    }

    const readers = this._rangeRequestReaders.slice(0);

    readers.forEach(function (reader) {
      reader.cancel(reason);
    });
  }

}

exports.PDFNodeStream = PDFNodeStream;

class BaseFullReader {
  constructor(stream) {
    this._url = stream.url;
    this._done = false;
    this._storedError = null;
    this.onProgress = null;
    const source = stream.source;
    this._contentLength = source.length;
    this._loaded = 0;
    this._filename = null;
    this._disableRange = source.disableRange || false;
    this._rangeChunkSize = source.rangeChunkSize;

    if (!this._rangeChunkSize && !this._disableRange) {
      this._disableRange = true;
    }

    this._isStreamingSupported = !source.disableStream;
    this._isRangeSupported = !source.disableRange;
    this._readableStream = null;
    this._readCapability = (0, _util.createPromiseCapability)();
    this._headersCapability = (0, _util.createPromiseCapability)();
  }

  get headersReady() {
    return this._headersCapability.promise;
  }

  get filename() {
    return this._filename;
  }

  get contentLength() {
    return this._contentLength;
  }

  get isRangeSupported() {
    return this._isRangeSupported;
  }

  get isStreamingSupported() {
    return this._isStreamingSupported;
  }

  async read() {
    await this._readCapability.promise;

    if (this._done) {
      return {
        value: undefined,
        done: true
      };
    }

    if (this._storedError) {
      throw this._storedError;
    }

    const chunk = this._readableStream.read();

    if (chunk === null) {
      this._readCapability = (0, _util.createPromiseCapability)();
      return this.read();
    }

    this._loaded += chunk.length;

    if (this.onProgress) {
      this.onProgress({
        loaded: this._loaded,
        total: this._contentLength
      });
    }

    const buffer = new Uint8Array(chunk).buffer;
    return {
      value: buffer,
      done: false
    };
  }

  cancel(reason) {
    if (!this._readableStream) {
      this._error(reason);

      return;
    }

    this._readableStream.destroy(reason);
  }

  _error(reason) {
    this._storedError = reason;

    this._readCapability.resolve();
  }

  _setReadableStream(readableStream) {
    this._readableStream = readableStream;
    readableStream.on("readable", () => {
      this._readCapability.resolve();
    });
    readableStream.on("end", () => {
      readableStream.destroy();
      this._done = true;

      this._readCapability.resolve();
    });
    readableStream.on("error", reason => {
      this._error(reason);
    });

    if (!this._isStreamingSupported && this._isRangeSupported) {
      this._error(new _util.AbortException("streaming is disabled"));
    }

    if (this._storedError) {
      this._readableStream.destroy(this._storedError);
    }
  }

}

class BaseRangeReader {
  constructor(stream) {
    this._url = stream.url;
    this._done = false;
    this._storedError = null;
    this.onProgress = null;
    this._loaded = 0;
    this._readableStream = null;
    this._readCapability = (0, _util.createPromiseCapability)();
    const source = stream.source;
    this._isStreamingSupported = !source.disableStream;
  }

  get isStreamingSupported() {
    return this._isStreamingSupported;
  }

  async read() {
    await this._readCapability.promise;

    if (this._done) {
      return {
        value: undefined,
        done: true
      };
    }

    if (this._storedError) {
      throw this._storedError;
    }

    const chunk = this._readableStream.read();

    if (chunk === null) {
      this._readCapability = (0, _util.createPromiseCapability)();
      return this.read();
    }

    this._loaded += chunk.length;

    if (this.onProgress) {
      this.onProgress({
        loaded: this._loaded
      });
    }

    const buffer = new Uint8Array(chunk).buffer;
    return {
      value: buffer,
      done: false
    };
  }

  cancel(reason) {
    if (!this._readableStream) {
      this._error(reason);

      return;
    }

    this._readableStream.destroy(reason);
  }

  _error(reason) {
    this._storedError = reason;

    this._readCapability.resolve();
  }

  _setReadableStream(readableStream) {
    this._readableStream = readableStream;
    readableStream.on("readable", () => {
      this._readCapability.resolve();
    });
    readableStream.on("end", () => {
      readableStream.destroy();
      this._done = true;

      this._readCapability.resolve();
    });
    readableStream.on("error", reason => {
      this._error(reason);
    });

    if (this._storedError) {
      this._readableStream.destroy(this._storedError);
    }
  }

}

function createRequestOptions(parsedUrl, headers) {
  return {
    protocol: parsedUrl.protocol,
    auth: parsedUrl.auth,
    host: parsedUrl.hostname,
    port: parsedUrl.port,
    path: parsedUrl.path,
    method: "GET",
    headers
  };
}

class PDFNodeStreamFullReader extends BaseFullReader {
  constructor(stream) {
    super(stream);

    const handleResponse = response => {
      if (response.statusCode === 404) {
        const error = new _util.MissingPDFException(`Missing PDF "${this._url}".`);
        this._storedError = error;

        this._headersCapability.reject(error);

        return;
      }

      this._headersCapability.resolve();

      this._setReadableStream(response);

      const getResponseHeader = name => {
        return this._readableStream.headers[name.toLowerCase()];
      };

      const {
        allowRangeRequests,
        suggestedLength
      } = (0, _network_utils.validateRangeRequestCapabilities)({
        getResponseHeader,
        isHttp: stream.isHttp,
        rangeChunkSize: this._rangeChunkSize,
        disableRange: this._disableRange
      });
      this._isRangeSupported = allowRangeRequests;
      this._contentLength = suggestedLength || this._contentLength;
      this._filename = (0, _network_utils.extractFilenameFromHeader)(getResponseHeader);
    };

    this._request = null;

    if (this._url.protocol === "http:") {
      this._request = http.request(createRequestOptions(this._url, stream.httpHeaders), handleResponse);
    } else {
      this._request = https.request(createRequestOptions(this._url, stream.httpHeaders), handleResponse);
    }

    this._request.on("error", reason => {
      this._storedError = reason;

      this._headersCapability.reject(reason);
    });

    this._request.end();
  }

}

class PDFNodeStreamRangeReader extends BaseRangeReader {
  constructor(stream, start, end) {
    super(stream);
    this._httpHeaders = {};

    for (const property in stream.httpHeaders) {
      const value = stream.httpHeaders[property];

      if (typeof value === "undefined") {
        continue;
      }

      this._httpHeaders[property] = value;
    }

    this._httpHeaders.Range = `bytes=${start}-${end - 1}`;

    const handleResponse = response => {
      if (response.statusCode === 404) {
        const error = new _util.MissingPDFException(`Missing PDF "${this._url}".`);
        this._storedError = error;
        return;
      }

      this._setReadableStream(response);
    };

    this._request = null;

    if (this._url.protocol === "http:") {
      this._request = http.request(createRequestOptions(this._url, this._httpHeaders), handleResponse);
    } else {
      this._request = https.request(createRequestOptions(this._url, this._httpHeaders), handleResponse);
    }

    this._request.on("error", reason => {
      this._storedError = reason;
    });

    this._request.end();
  }

}

class PDFNodeStreamFsFullReader extends BaseFullReader {
  constructor(stream) {
    super(stream);
    let path = decodeURIComponent(this._url.path);

    if (fileUriRegex.test(this._url.href)) {
      path = path.replace(/^\//, "");
    }

    fs.lstat(path, (error, stat) => {
      if (error) {
        if (error.code === "ENOENT") {
          error = new _util.MissingPDFException(`Missing PDF "${path}".`);
        }

        this._storedError = error;

        this._headersCapability.reject(error);

        return;
      }

      this._contentLength = stat.size;

      this._setReadableStream(fs.createReadStream(path));

      this._headersCapability.resolve();
    });
  }

}

class PDFNodeStreamFsRangeReader extends BaseRangeReader {
  constructor(stream, start, end) {
    super(stream);
    let path = decodeURIComponent(this._url.path);

    if (fileUriRegex.test(this._url.href)) {
      path = path.replace(/^\//, "");
    }

    this._setReadableStream(fs.createReadStream(path, {
      start,
      end: end - 1
    }));
  }

}

/***/ }),
/* 20 */
/***/ (function(module, exports, __w_pdfjs_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createResponseStatusError = createResponseStatusError;
exports.extractFilenameFromHeader = extractFilenameFromHeader;
exports.validateRangeRequestCapabilities = validateRangeRequestCapabilities;
exports.validateResponseStatus = validateResponseStatus;

var _util = __w_pdfjs_require__(2);

var _content_disposition = __w_pdfjs_require__(21);

function validateRangeRequestCapabilities({
  getResponseHeader,
  isHttp,
  rangeChunkSize,
  disableRange
}) {
  (0, _util.assert)(rangeChunkSize > 0, "Range chunk size must be larger than zero");
  const returnValues = {
    allowRangeRequests: false,
    suggestedLength: undefined
  };
  const length = parseInt(getResponseHeader("Content-Length"), 10);

  if (!Number.isInteger(length)) {
    return returnValues;
  }

  returnValues.suggestedLength = length;

  if (length <= 2 * rangeChunkSize) {
    return returnValues;
  }

  if (disableRange || !isHttp) {
    return returnValues;
  }

  if (getResponseHeader("Accept-Ranges") !== "bytes") {
    return returnValues;
  }

  const contentEncoding = getResponseHeader("Content-Encoding") || "identity";

  if (contentEncoding !== "identity") {
    return returnValues;
  }

  returnValues.allowRangeRequests = true;
  return returnValues;
}

function extractFilenameFromHeader(getResponseHeader) {
  const contentDisposition = getResponseHeader("Content-Disposition");

  if (contentDisposition) {
    let filename = (0, _content_disposition.getFilenameFromContentDispositionHeader)(contentDisposition);

    if (filename.includes("%")) {
      try {
        filename = decodeURIComponent(filename);
      } catch (ex) {}
    }

    if (/\.pdf$/i.test(filename)) {
      return filename;
    }
  }

  return null;
}

function createResponseStatusError(status, url) {
  if (status === 404 || status === 0 && url.startsWith("file:")) {
    return new _util.MissingPDFException('Missing PDF "' + url + '".');
  }

  return new _util.UnexpectedResponseException("Unexpected server response (" + status + ') while retrieving PDF "' + url + '".', status);
}

function validateResponseStatus(status) {
  return status === 200 || status === 206;
}

/***/ }),
/* 21 */
/***/ (function(module, exports, __w_pdfjs_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFilenameFromContentDispositionHeader = getFilenameFromContentDispositionHeader;

function getFilenameFromContentDispositionHeader(contentDisposition) {
  let needsEncodingFixup = true;
  let tmp = toParamRegExp("filename\\*", "i").exec(contentDisposition);

  if (tmp) {
    tmp = tmp[1];
    let filename = rfc2616unquote(tmp);
    filename = unescape(filename);
    filename = rfc5987decode(filename);
    filename = rfc2047decode(filename);
    return fixupEncoding(filename);
  }

  tmp = rfc2231getparam(contentDisposition);

  if (tmp) {
    const filename = rfc2047decode(tmp);
    return fixupEncoding(filename);
  }

  tmp = toParamRegExp("filename", "i").exec(contentDisposition);

  if (tmp) {
    tmp = tmp[1];
    let filename = rfc2616unquote(tmp);
    filename = rfc2047decode(filename);
    return fixupEncoding(filename);
  }

  function toParamRegExp(attributePattern, flags) {
    return new RegExp("(?:^|;)\\s*" + attributePattern + "\\s*=\\s*" + "(" + '[^";\\s][^;\\s]*' + "|" + '"(?:[^"\\\\]|\\\\"?)+"?' + ")", flags);
  }

  function textdecode(encoding, value) {
    if (encoding) {
      if (!/^[\x00-\xFF]+$/.test(value)) {
        return value;
      }

      try {
        const decoder = new TextDecoder(encoding, {
          fatal: true
        });
        const bytes = Array.from(value, function (ch) {
          return ch.charCodeAt(0) & 0xff;
        });
        value = decoder.decode(new Uint8Array(bytes));
        needsEncodingFixup = false;
      } catch (e) {
        if (/^utf-?8$/i.test(encoding)) {
          try {
            value = decodeURIComponent(escape(value));
            needsEncodingFixup = false;
          } catch (err) {}
        }
      }
    }

    return value;
  }

  function fixupEncoding(value) {
    if (needsEncodingFixup && /[\x80-\xff]/.test(value)) {
      value = textdecode("utf-8", value);

      if (needsEncodingFixup) {
        value = textdecode("iso-8859-1", value);
      }
    }

    return value;
  }

  function rfc2231getparam(contentDispositionStr) {
    const matches = [];
    let match;
    const iter = toParamRegExp("filename\\*((?!0\\d)\\d+)(\\*?)", "ig");

    while ((match = iter.exec(contentDispositionStr)) !== null) {
      let [, n, quot, part] = match;
      n = parseInt(n, 10);

      if (n in matches) {
        if (n === 0) {
          break;
        }

        continue;
      }

      matches[n] = [quot, part];
    }

    const parts = [];

    for (let n = 0; n < matches.length; ++n) {
      if (!(n in matches)) {
        break;
      }

      let [quot, part] = matches[n];
      part = rfc2616unquote(part);

      if (quot) {
        part = unescape(part);

        if (n === 0) {
          part = rfc5987decode(part);
        }
      }

      parts.push(part);
    }

    return parts.join("");
  }

  function rfc2616unquote(value) {
    if (value.startsWith('"')) {
      const parts = value.slice(1).split('\\"');

      for (let i = 0; i < parts.length; ++i) {
        const quotindex = parts[i].indexOf('"');

        if (quotindex !== -1) {
          parts[i] = parts[i].slice(0, quotindex);
          parts.length = i + 1;
        }

        parts[i] = parts[i].replace(/\\(.)/g, "$1");
      }

      value = parts.join('"');
    }

    return value;
  }

  function rfc5987decode(extvalue) {
    const encodingend = extvalue.indexOf("'");

    if (encodingend === -1) {
      return extvalue;
    }

    const encoding = extvalue.slice(0, encodingend);
    const langvalue = extvalue.slice(encodingend + 1);
    const value = langvalue.replace(/^[^']*'/, "");
    return textdecode(encoding, value);
  }

  function rfc2047decode(value) {
    if (!value.startsWith("=?") || /[\x00-\x19\x80-\xff]/.test(value)) {
      return value;
    }

    return value.replace(/=\?([\w-]*)\?([QqBb])\?((?:[^?]|\?(?!=))*)\?=/g, function (matches, charset, encoding, text) {
      if (encoding === "q" || encoding === "Q") {
        text = text.replace(/_/g, " ");
        text = text.replace(/=([0-9a-fA-F]{2})/g, function (match, hex) {
          return String.fromCharCode(parseInt(hex, 16));
        });
        return textdecode(charset, text);
      }

      try {
        text = atob(text);
      } catch (e) {}

      return textdecode(charset, text);
    });
  }

  return "";
}

/***/ }),
/* 22 */
/***/ (function(module, exports, __w_pdfjs_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PDFNetworkStream = void 0;

var _util = __w_pdfjs_require__(2);

var _network_utils = __w_pdfjs_require__(20);
const OK_RESPONSE = 200;
const PARTIAL_CONTENT_RESPONSE = 206;

function getArrayBuffer(xhr) {
  const data = xhr.response;

  if (typeof data !== "string") {
    return data;
  }

  const array = (0, _util.stringToBytes)(data);
  return array.buffer;
}

class NetworkManager {
  constructor(url, args) {
    this.url = url;
    args = args || {};
    this.isHttp = /^https?:/i.test(url);
    this.httpHeaders = this.isHttp && args.httpHeaders || {};
    this.withCredentials = args.withCredentials || false;

    this.getXhr = args.getXhr || function NetworkManager_getXhr() {
      return new XMLHttpRequest();
    };

    this.currXhrId = 0;
    this.pendingRequests = Object.create(null);
  }

  requestRange(begin, end, listeners) {
    const args = {
      begin,
      end
    };

    for (const prop in listeners) {
      args[prop] = listeners[prop];
    }

    return this.request(args);
  }

  requestFull(listeners) {
    return this.request(listeners);
  }

  request(args) {
    const xhr = this.getXhr();
    const xhrId = this.currXhrId++;
    const pendingRequest = this.pendingRequests[xhrId] = {
      xhr
    };
    xhr.open("GET", this.url);
    xhr.withCredentials = this.withCredentials;

    for (const property in this.httpHeaders) {
      const value = this.httpHeaders[property];

      if (typeof value === "undefined") {
        continue;
      }

      xhr.setRequestHeader(property, value);
    }

    if (this.isHttp && "begin" in args && "end" in args) {
      xhr.setRequestHeader("Range", `bytes=${args.begin}-${args.end - 1}`);
      pendingRequest.expectedStatus = PARTIAL_CONTENT_RESPONSE;
    } else {
      pendingRequest.expectedStatus = OK_RESPONSE;
    }

    xhr.responseType = "arraybuffer";

    if (args.onError) {
      xhr.onerror = function (evt) {
        args.onError(xhr.status);
      };
    }

    xhr.onreadystatechange = this.onStateChange.bind(this, xhrId);
    xhr.onprogress = this.onProgress.bind(this, xhrId);
    pendingRequest.onHeadersReceived = args.onHeadersReceived;
    pendingRequest.onDone = args.onDone;
    pendingRequest.onError = args.onError;
    pendingRequest.onProgress = args.onProgress;
    xhr.send(null);
    return xhrId;
  }

  onProgress(xhrId, evt) {
    const pendingRequest = this.pendingRequests[xhrId];

    if (!pendingRequest) {
      return;
    }

    if (pendingRequest.onProgress) {
      pendingRequest.onProgress(evt);
    }
  }

  onStateChange(xhrId, evt) {
    const pendingRequest = this.pendingRequests[xhrId];

    if (!pendingRequest) {
      return;
    }

    const xhr = pendingRequest.xhr;

    if (xhr.readyState >= 2 && pendingRequest.onHeadersReceived) {
      pendingRequest.onHeadersReceived();
      delete pendingRequest.onHeadersReceived;
    }

    if (xhr.readyState !== 4) {
      return;
    }

    if (!(xhrId in this.pendingRequests)) {
      return;
    }

    delete this.pendingRequests[xhrId];

    if (xhr.status === 0 && this.isHttp) {
      if (pendingRequest.onError) {
        pendingRequest.onError(xhr.status);
      }

      return;
    }

    const xhrStatus = xhr.status || OK_RESPONSE;
    const ok_response_on_range_request = xhrStatus === OK_RESPONSE && pendingRequest.expectedStatus === PARTIAL_CONTENT_RESPONSE;

    if (!ok_response_on_range_request && xhrStatus !== pendingRequest.expectedStatus) {
      if (pendingRequest.onError) {
        pendingRequest.onError(xhr.status);
      }

      return;
    }

    const chunk = getArrayBuffer(xhr);

    if (xhrStatus === PARTIAL_CONTENT_RESPONSE) {
      const rangeHeader = xhr.getResponseHeader("Content-Range");
      const matches = /bytes (\d+)-(\d+)\/(\d+)/.exec(rangeHeader);
      pendingRequest.onDone({
        begin: parseInt(matches[1], 10),
        chunk
      });
    } else if (chunk) {
      pendingRequest.onDone({
        begin: 0,
        chunk
      });
    } else if (pendingRequest.onError) {
      pendingRequest.onError(xhr.status);
    }
  }

  hasPendingRequests() {
    for (const xhrId in this.pendingRequests) {
      return true;
    }

    return false;
  }

  getRequestXhr(xhrId) {
    return this.pendingRequests[xhrId].xhr;
  }

  isPendingRequest(xhrId) {
    return xhrId in this.pendingRequests;
  }

  abortAllRequests() {
    for (const xhrId in this.pendingRequests) {
      this.abortRequest(xhrId | 0);
    }
  }

  abortRequest(xhrId) {
    const xhr = this.pendingRequests[xhrId].xhr;
    delete this.pendingRequests[xhrId];
    xhr.abort();
  }

}

class PDFNetworkStream {
  constructor(source) {
    this._source = source;
    this._manager = new NetworkManager(source.url, {
      httpHeaders: source.httpHeaders,
      withCredentials: source.withCredentials
    });
    this._rangeChunkSize = source.rangeChunkSize;
    this._fullRequestReader = null;
    this._rangeRequestReaders = [];
  }

  _onRangeRequestReaderClosed(reader) {
    const i = this._rangeRequestReaders.indexOf(reader);

    if (i >= 0) {
      this._rangeRequestReaders.splice(i, 1);
    }
  }

  getFullReader() {
    (0, _util.assert)(!this._fullRequestReader, "PDFNetworkStream.getFullReader can only be called once.");
    this._fullRequestReader = new PDFNetworkStreamFullRequestReader(this._manager, this._source);
    return this._fullRequestReader;
  }

  getRangeReader(begin, end) {
    const reader = new PDFNetworkStreamRangeRequestReader(this._manager, begin, end);
    reader.onClosed = this._onRangeRequestReaderClosed.bind(this);

    this._rangeRequestReaders.push(reader);

    return reader;
  }

  cancelAllRequests(reason) {
    if (this._fullRequestReader) {
      this._fullRequestReader.cancel(reason);
    }

    const readers = this._rangeRequestReaders.slice(0);

    readers.forEach(function (reader) {
      reader.cancel(reason);
    });
  }

}

exports.PDFNetworkStream = PDFNetworkStream;

class PDFNetworkStreamFullRequestReader {
  constructor(manager, source) {
    this._manager = manager;
    const args = {
      onHeadersReceived: this._onHeadersReceived.bind(this),
      onDone: this._onDone.bind(this),
      onError: this._onError.bind(this),
      onProgress: this._onProgress.bind(this)
    };
    this._url = source.url;
    this._fullRequestId = manager.requestFull(args);
    this._headersReceivedCapability = (0, _util.createPromiseCapability)();
    this._disableRange = source.disableRange || false;
    this._contentLength = source.length;
    this._rangeChunkSize = source.rangeChunkSize;

    if (!this._rangeChunkSize && !this._disableRange) {
      this._disableRange = true;
    }

    this._isStreamingSupported = false;
    this._isRangeSupported = false;
    this._cachedChunks = [];
    this._requests = [];
    this._done = false;
    this._storedError = undefined;
    this._filename = null;
    this.onProgress = null;
  }

  _onHeadersReceived() {
    const fullRequestXhrId = this._fullRequestId;

    const fullRequestXhr = this._manager.getRequestXhr(fullRequestXhrId);

    const getResponseHeader = name => {
      return fullRequestXhr.getResponseHeader(name);
    };

    const {
      allowRangeRequests,
      suggestedLength
    } = (0, _network_utils.validateRangeRequestCapabilities)({
      getResponseHeader,
      isHttp: this._manager.isHttp,
      rangeChunkSize: this._rangeChunkSize,
      disableRange: this._disableRange
    });

    if (allowRangeRequests) {
      this._isRangeSupported = true;
    }

    this._contentLength = suggestedLength || this._contentLength;
    this._filename = (0, _network_utils.extractFilenameFromHeader)(getResponseHeader);

    if (this._isRangeSupported) {
      this._manager.abortRequest(fullRequestXhrId);
    }

    this._headersReceivedCapability.resolve();
  }

  _onDone(args) {
    if (args) {
      if (this._requests.length > 0) {
        const requestCapability = this._requests.shift();

        requestCapability.resolve({
          value: args.chunk,
          done: false
        });
      } else {
        this._cachedChunks.push(args.chunk);
      }
    }

    this._done = true;

    if (this._cachedChunks.length > 0) {
      return;
    }

    this._requests.forEach(function (requestCapability) {
      requestCapability.resolve({
        value: undefined,
        done: true
      });
    });

    this._requests = [];
  }

  _onError(status) {
    const url = this._url;
    const exception = (0, _network_utils.createResponseStatusError)(status, url);
    this._storedError = exception;

    this._headersReceivedCapability.reject(exception);

    this._requests.forEach(function (requestCapability) {
      requestCapability.reject(exception);
    });

    this._requests = [];
    this._cachedChunks = [];
  }

  _onProgress(data) {
    if (this.onProgress) {
      this.onProgress({
        loaded: data.loaded,
        total: data.lengthComputable ? data.total : this._contentLength
      });
    }
  }

  get filename() {
    return this._filename;
  }

  get isRangeSupported() {
    return this._isRangeSupported;
  }

  get isStreamingSupported() {
    return this._isStreamingSupported;
  }

  get contentLength() {
    return this._contentLength;
  }

  get headersReady() {
    return this._headersReceivedCapability.promise;
  }

  async read() {
    if (this._storedError) {
      throw this._storedError;
    }

    if (this._cachedChunks.length > 0) {
      const chunk = this._cachedChunks.shift();

      return {
        value: chunk,
        done: false
      };
    }

    if (this._done) {
      return {
        value: undefined,
        done: true
      };
    }

    const requestCapability = (0, _util.createPromiseCapability)();

    this._requests.push(requestCapability);

    return requestCapability.promise;
  }

  cancel(reason) {
    this._done = true;

    this._headersReceivedCapability.reject(reason);

    this._requests.forEach(function (requestCapability) {
      requestCapability.resolve({
        value: undefined,
        done: true
      });
    });

    this._requests = [];

    if (this._manager.isPendingRequest(this._fullRequestId)) {
      this._manager.abortRequest(this._fullRequestId);
    }

    this._fullRequestReader = null;
  }

}

class PDFNetworkStreamRangeRequestReader {
  constructor(manager, begin, end) {
    this._manager = manager;
    const args = {
      onDone: this._onDone.bind(this),
      onProgress: this._onProgress.bind(this)
    };
    this._requestId = manager.requestRange(begin, end, args);
    this._requests = [];
    this._queuedChunk = null;
    this._done = false;
    this.onProgress = null;
    this.onClosed = null;
  }

  _close() {
    if (this.onClosed) {
      this.onClosed(this);
    }
  }

  _onDone(data) {
    const chunk = data.chunk;

    if (this._requests.length > 0) {
      const requestCapability = this._requests.shift();

      requestCapability.resolve({
        value: chunk,
        done: false
      });
    } else {
      this._queuedChunk = chunk;
    }

    this._done = true;

    this._requests.forEach(function (requestCapability) {
      requestCapability.resolve({
        value: undefined,
        done: true
      });
    });

    this._requests = [];

    this._close();
  }

  _onProgress(evt) {
    if (!this.isStreamingSupported && this.onProgress) {
      this.onProgress({
        loaded: evt.loaded
      });
    }
  }

  get isStreamingSupported() {
    return false;
  }

  async read() {
    if (this._queuedChunk !== null) {
      const chunk = this._queuedChunk;
      this._queuedChunk = null;
      return {
        value: chunk,
        done: false
      };
    }

    if (this._done) {
      return {
        value: undefined,
        done: true
      };
    }

    const requestCapability = (0, _util.createPromiseCapability)();

    this._requests.push(requestCapability);

    return requestCapability.promise;
  }

  cancel(reason) {
    this._done = true;

    this._requests.forEach(function (requestCapability) {
      requestCapability.resolve({
        value: undefined,
        done: true
      });
    });

    this._requests = [];

    if (this._manager.isPendingRequest(this._requestId)) {
      this._manager.abortRequest(this._requestId);
    }

    this._close();
  }

}

/***/ }),
/* 23 */
/***/ (function(module, exports, __w_pdfjs_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PDFFetchStream = void 0;

var _util = __w_pdfjs_require__(2);

var _network_utils = __w_pdfjs_require__(20);

function createFetchOptions(headers, withCredentials, abortController) {
  return {
    method: "GET",
    headers,
    signal: abortController && abortController.signal,
    mode: "cors",
    credentials: withCredentials ? "include" : "same-origin",
    redirect: "follow"
  };
}

function createHeaders(httpHeaders) {
  const headers = new Headers();

  for (const property in httpHeaders) {
    const value = httpHeaders[property];

    if (typeof value === "undefined") {
      continue;
    }

    headers.append(property, value);
  }

  return headers;
}

class PDFFetchStream {
  constructor(source) {
    this.source = source;
    this.isHttp = /^https?:/i.test(source.url);
    this.httpHeaders = this.isHttp && source.httpHeaders || {};
    this._fullRequestReader = null;
    this._rangeRequestReaders = [];
  }

  get _progressiveDataLength() {
    return this._fullRequestReader ? this._fullRequestReader._loaded : 0;
  }

  getFullReader() {
    (0, _util.assert)(!this._fullRequestReader, "PDFFetchStream.getFullReader can only be called once.");
    this._fullRequestReader = new PDFFetchStreamReader(this);
    return this._fullRequestReader;
  }

  getRangeReader(begin, end) {
    if (end <= this._progressiveDataLength) {
      return null;
    }

    const reader = new PDFFetchStreamRangeReader(this, begin, end);

    this._rangeRequestReaders.push(reader);

    return reader;
  }

  cancelAllRequests(reason) {
    if (this._fullRequestReader) {
      this._fullRequestReader.cancel(reason);
    }

    const readers = this._rangeRequestReaders.slice(0);

    readers.forEach(function (reader) {
      reader.cancel(reason);
    });
  }

}

exports.PDFFetchStream = PDFFetchStream;

class PDFFetchStreamReader {
  constructor(stream) {
    this._stream = stream;
    this._reader = null;
    this._loaded = 0;
    this._filename = null;
    const source = stream.source;
    this._withCredentials = source.withCredentials || false;
    this._contentLength = source.length;
    this._headersCapability = (0, _util.createPromiseCapability)();
    this._disableRange = source.disableRange || false;
    this._rangeChunkSize = source.rangeChunkSize;

    if (!this._rangeChunkSize && !this._disableRange) {
      this._disableRange = true;
    }

    if (typeof AbortController !== "undefined") {
      this._abortController = new AbortController();
    }

    this._isStreamingSupported = !source.disableStream;
    this._isRangeSupported = !source.disableRange;
    this._headers = createHeaders(this._stream.httpHeaders);
    const url = source.url;
    fetch(url, createFetchOptions(this._headers, this._withCredentials, this._abortController)).then(response => {
      if (!(0, _network_utils.validateResponseStatus)(response.status)) {
        throw (0, _network_utils.createResponseStatusError)(response.status, url);
      }

      this._reader = response.body.getReader();

      this._headersCapability.resolve();

      const getResponseHeader = name => {
        return response.headers.get(name);
      };

      const {
        allowRangeRequests,
        suggestedLength
      } = (0, _network_utils.validateRangeRequestCapabilities)({
        getResponseHeader,
        isHttp: this._stream.isHttp,
        rangeChunkSize: this._rangeChunkSize,
        disableRange: this._disableRange
      });
      this._isRangeSupported = allowRangeRequests;
      this._contentLength = suggestedLength || this._contentLength;
      this._filename = (0, _network_utils.extractFilenameFromHeader)(getResponseHeader);

      if (!this._isStreamingSupported && this._isRangeSupported) {
        this.cancel(new _util.AbortException("Streaming is disabled."));
      }
    }).catch(this._headersCapability.reject);
    this.onProgress = null;
  }

  get headersReady() {
    return this._headersCapability.promise;
  }

  get filename() {
    return this._filename;
  }

  get contentLength() {
    return this._contentLength;
  }

  get isRangeSupported() {
    return this._isRangeSupported;
  }

  get isStreamingSupported() {
    return this._isStreamingSupported;
  }

  async read() {
    await this._headersCapability.promise;
    const {
      value,
      done
    } = await this._reader.read();

    if (done) {
      return {
        value,
        done
      };
    }

    this._loaded += value.byteLength;

    if (this.onProgress) {
      this.onProgress({
        loaded: this._loaded,
        total: this._contentLength
      });
    }

    const buffer = new Uint8Array(value).buffer;
    return {
      value: buffer,
      done: false
    };
  }

  cancel(reason) {
    if (this._reader) {
      this._reader.cancel(reason);
    }

    if (this._abortController) {
      this._abortController.abort();
    }
  }

}

class PDFFetchStreamRangeReader {
  constructor(stream, begin, end) {
    this._stream = stream;
    this._reader = null;
    this._loaded = 0;
    const source = stream.source;
    this._withCredentials = source.withCredentials || false;
    this._readCapability = (0, _util.createPromiseCapability)();
    this._isStreamingSupported = !source.disableStream;

    if (typeof AbortController !== "undefined") {
      this._abortController = new AbortController();
    }

    this._headers = createHeaders(this._stream.httpHeaders);

    this._headers.append("Range", `bytes=${begin}-${end - 1}`);

    const url = source.url;
    fetch(url, createFetchOptions(this._headers, this._withCredentials, this._abortController)).then(response => {
      if (!(0, _network_utils.validateResponseStatus)(response.status)) {
        throw (0, _network_utils.createResponseStatusError)(response.status, url);
      }

      this._readCapability.resolve();

      this._reader = response.body.getReader();
    });
    this.onProgress = null;
  }

  get isStreamingSupported() {
    return this._isStreamingSupported;
  }

  async read() {
    await this._readCapability.promise;
    const {
      value,
      done
    } = await this._reader.read();

    if (done) {
      return {
        value,
        done
      };
    }

    this._loaded += value.byteLength;

    if (this.onProgress) {
      this.onProgress({
        loaded: this._loaded
      });
    }

    const buffer = new Uint8Array(value).buffer;
    return {
      value: buffer,
      done: false
    };
  }

  cancel(reason) {
    if (this._reader) {
      this._reader.cancel(reason);
    }

    if (this._abortController) {
      this._abortController.abort();
    }
  }

}

/***/ })
/******/ ]);
});

});

unwrapExports(pdf);

var pdfjs = pdf;

export default pdfjs;

export class Deidril_COMPENDIUM_ART_API
{

static is_object(value_) 
{
        return (typeof value_ === "object" && value_ !== null);
}

/**
 *
 * @param {object} record An art object
 * @returns {boolean} Whether the object is a valid compendium art object or not
 */
static is_module_art(record) 
{
    return (
        Deidril_COMPENDIUM_ART_API.is_object(record) // Ensure the map is an object
        && Object.values(record).every(
            (packToArt) => Deidril_COMPENDIUM_ART_API.is_object(packToArt) // Ensure each entry is an object with a pack name
                && Object.values(packToArt).every(
                    (art) => Deidril_COMPENDIUM_ART_API.is_object(art) // Ensure each entry within the pack object is an object with an actor or item ID
                        && (
                            // Within a document object, there can be an actor, token or item string. If there is an item string, there must not be a token or actor string
                            (typeof art.actor === "string" || typeof art.token === "string" || typeof art.item === "string")
                            && !((typeof art.actor === "string" || typeof art.token === "string") && typeof art.item === "string")
                            // token can be a file path, or an object containing the file path and the token scale
                            || (isObject(art.token)
                                && typeof art.token.img === "string"
                                && (art.token.scale === undefined || typeof art.token.scale === "number")
                                && art.item === undefined
                            )
                        )
                )
        )
    );

}

/**
 *
 * @param {object|string|null} art Either an art mapping object, or a file path to a JSON.
 * @returns {object|null} An art object, or null
 */
static async get_art_map(art) 
{
    if (!art) {
        return null;
    } else if (Deidril_COMPENDIUM_ART_API.is_module_art(art)) {
        return art;
    } else if (typeof art === "string") {
        // Instead of being in a module.json file, the art map is in a separate JSON file referenced by path
        try {
            const response = await fetch(art);
            if (!response.ok) {
                console.warn(`Starfinder | Failed loading art mapping file at ${art}`);
                return null;
            }
            const map = await response.json();
            const valid = Deidril_COMPENDIUM_ART_API.is_module_art(map);
            if (!valid) console.warn(`Starfinder | Art mapping file at ${art} is invalid.`);
            return valid ? map : null;
        } catch (error) {
            if (error instanceof Error) {
                console.warn(`Starfinder | ${error.message}`);
            }
        }
    }

    return null;
}

static async set_art(moduleArt, moduleKey)
{
    for (const [packName, art] of Object.entries(moduleArt)) {
        const pack = game.packs.get(`sfrpg.${packName}`);
        if (!pack) {
            console.warn(
                `Starfinder | Failed pack lookup from module art registration (${moduleKey}): ${packName}`
            );
            continue;
        }

        const index = pack.indexed ? pack.index : await pack.getIndex();
        for (const [id, paths] of Object.entries(art)) {
            const record = index.get(id); // Find the current document in the index
            if (!record) continue;
            if (paths.actor) {
                record.img = paths.actor; // Set the document's art in the index, which is used by compendium windows
            } else if (paths.item) {
                record.img = paths.item; // Set the document's art in the index, which is used by compendium windows
            }
            game.sfrpg.compendiumArt.map.set(`Compendium.sfrpg.${packName}.${id}`, paths); // Push the document ID and art to the map
        }
    }
}


}
export class Deidril_Foundry_API
{

/**
 * 
 * @param {*} name 
 * @param {*} type 
 * @returns _pack if _pack contains an entity withthis name
**/
static entity_in_compendium(_name, _pack)
{
    for(const [key, value] of _pack.index.entries())
    {
        let match =
            (typeof _name == "string") ? (value.name == _name) 
          : ( (_name instanceof Array) ?  _name.includes(value.name) : false )
        ;
 
        // Check original name if this is a translated pdf with names of entities not yet translated
        const babele_original_name = value.flags?.babele?.originalName;
         match |= ((babele_original_name) && (_name == babele_original_name));
 
        if(match)
        {
            return value._id;
        }
 
    }
    return undefined;
}

/**
 * 
 * Search an entity in all compendiums and return the compendium key
 * 
**/
static search_compendium(_name, _type, _options = {})
{
    let compendium_name = _options?.key;
    for(const [key, value] of game.packs.entries())
    {
        if(value == undefined)
        { continue; }
 
        if(value.metadata == undefined)
        { continue; }
 
        if(value.metadata.type != _type)
        { continue; }

        if((compendium_name != undefined) && (compendium_name != key))
        { continue; }
 
        let id = Deidril_Foundry_API.entity_in_compendium(_name, value);
        if(id != undefined)
        {
            return key;
        }
    }
 
    return undefined;
}

static find_journal(journal_id_, page_id_)
{
    for(const value of game.journal)
    {
        if(value.id == id_)
        { return documents_array_.getDocument(id); }
     
    }
    return undefined;
}
 
     
/**
 * 
 * Search an actor in all conpendium to impot its data
 * 
**/
static async search_in_compendiums(_name, _type, _options = {})
{
    let compendium_name = _options?.key;
    for(const [key, value] of game.packs.entries())
    {
        if(value == undefined)
        { continue; }
 
        if(value.metadata == undefined)
        { continue; }
 
        if(value.metadata.type != _type)
        { continue; }

        if((compendium_name != undefined) && (compendium_name != key))
        { continue; }
 
        let id = Deidril_Foundry_API.entity_in_compendium(_name, value);
        if(id != undefined)
        {
            return value.getDocument(id);
        }
    }
 
    return undefined;
}

}
export class Deidril_GFX_API
{

            
    static FULL_CHUNK_HEIGHT = 16;
    static GRAYSCALE_1BPP= 1; 
    static RGB_24BPP= 2;
    static RGBA_32BPP = 3;

static b64_to_blob(b64Data, contentType, sliceSize) 
{
    contentType = contentType || "";
    sliceSize = sliceSize || 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) 
    {
        var slice = byteCharacters.slice(offset, offset + sliceSize);
        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) 
        { byteNumbers[i] = slice.charCodeAt(i); }

        var byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    
    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
} 

static put_binary_grayscale_1bpp_image_data(ctx, imgData)
{
    var height = imgData.height,
        width = imgData.width;
    var partialChunkHeight = height % Deidril_GFX_API.FULL_CHUNK_HEIGHT;
    var fullChunks = (height - partialChunkHeight) / Deidril_GFX_API.FULL_CHUNK_HEIGHT;
    var totalChunks = partialChunkHeight === 0 ? fullChunks : fullChunks + 1;
    var chunkImgData = ctx.createImageData(width, Deidril_GFX_API.FULL_CHUNK_HEIGHT);
    var srcPos = 0,
        destPos;
    var src = imgData.data;
    var dest = chunkImgData.data;
    var i, j, thisChunkHeight;

    var srcLength = src.byteLength;
    var dest32 = new Uint32Array(dest.buffer, 0, dest.byteLength >> 2);
    var dest32DataLength = dest32.length;
    var fullSrcDiff = width + 7 >> 3;
    var white = 0xffffffff;
    var black = _util.IsLittleEndianCached.value ? 0xff000000 : 0x000000ff;

    for (i = 0; i < totalChunks; i++) 
    {
        thisChunkHeight = i < fullChunks ? Deidril_GFX_API.FULL_CHUNK_HEIGHT : partialChunkHeight;
        destPos = 0;

        for (j = 0; j < thisChunkHeight; j++) 
        {
            var srcDiff = srcLength - srcPos;
            var k = 0;
            var kEnd = srcDiff > fullSrcDiff ? width : srcDiff * 8 - 7;
            var kEndUnrolled = kEnd & ~7;
            var mask = 0;
            var srcByte = 0;

            for (; k < kEndUnrolled; k += 8) 
            {
                srcByte = src[srcPos++];
                dest32[destPos++] = srcByte & 128 ? white : black;
                dest32[destPos++] = srcByte & 64 ? white : black;
                dest32[destPos++] = srcByte & 32 ? white : black;
                dest32[destPos++] = srcByte & 16 ? white : black;
                dest32[destPos++] = srcByte & 8 ? white : black;
                dest32[destPos++] = srcByte & 4 ? white : black;
                dest32[destPos++] = srcByte & 2 ? white : black;
                dest32[destPos++] = srcByte & 1 ? white : black;
            }

            for (; k < kEnd; k++) 
            {
                if (mask === 0) 
                {
                    srcByte = src[srcPos++];
                    mask = 128;
                }

                dest32[destPos++] = srcByte & mask ? white : black;
                mask >>= 1;
            }
        }

        while (destPos < dest32DataLength) 
        { dest32[destPos++] = 0; }

        ctx.putImageData(chunkImgData, 0, i * Deidril_GFX_API.FULL_CHUNK_HEIGHT);
    }        
}

static put_binary_rgb_32bpp_image_data(ctx, imgData)
{
    var height = imgData.height,
        width = imgData.width;
    var partialChunkHeight = height % Deidril_GFX_API.FULL_CHUNK_HEIGHT;
    var fullChunks = (height - partialChunkHeight) / Deidril_GFX_API.FULL_CHUNK_HEIGHT;
    var totalChunks = partialChunkHeight === 0 ? fullChunks : fullChunks + 1;
    var chunkImgData = ctx.createImageData(width, Deidril_GFX_API.FULL_CHUNK_HEIGHT);
    var srcPos = 0;
    var src = imgData.data;
    var dest = chunkImgData.data;
    var i, j, elemsInThisChunk;        

    j = 0;

    elemsInThisChunk = width * Deidril_GFX_API.FULL_CHUNK_HEIGHT * 4;

    for (i = 0; i < fullChunks; i++) 
    {
        dest.set(src.subarray(srcPos, srcPos + elemsInThisChunk));
        srcPos += elemsInThisChunk;
        ctx.putImageData(chunkImgData, 0, j);
        j += Deidril_GFX_API.FULL_CHUNK_HEIGHT;
    }

    if (i < totalChunks) 
    {
        elemsInThisChunk = width * partialChunkHeight * 4;
        dest.set(src.subarray(srcPos, srcPos + elemsInThisChunk));
        ctx.putImageData(chunkImgData, 0, j);
    }        
}

static put_binary_rgb_24bpp_image_data(ctx, imgData)
{
    var height = imgData.height,
        width = imgData.width;
    var partialChunkHeight = height % Deidril_GFX_API.FULL_CHUNK_HEIGHT;
    var fullChunks = (height - partialChunkHeight) / Deidril_GFX_API.FULL_CHUNK_HEIGHT;
    var totalChunks = partialChunkHeight === 0 ? fullChunks : fullChunks + 1;
    var chunkImgData = ctx.createImageData(width, Deidril_GFX_API.FULL_CHUNK_HEIGHT);
    var srcPos = 0, destPos;
    var src = imgData.data;
    var dest = chunkImgData.data;
    var i, j, thisChunkHeight, elemsInThisChunk;      

    thisChunkHeight = Deidril_GFX_API.FULL_CHUNK_HEIGHT;
    elemsInThisChunk = width * thisChunkHeight;

    for (i = 0; i < totalChunks; i++) {
      if (i >= fullChunks) {
        thisChunkHeight = partialChunkHeight;
        elemsInThisChunk = width * thisChunkHeight;
      }

      destPos = 0;

      for (j = elemsInThisChunk; j--;) {
        dest[destPos++] = src[srcPos++];
        dest[destPos++] = src[srcPos++];
        dest[destPos++] = src[srcPos++];
        dest[destPos++] = 255;
      }

      ctx.putImageData(chunkImgData, 0, i * Deidril_GFX_API.FULL_CHUNK_HEIGHT);
    }
    
}


static put_binary_image_data(ctx, imgData) 
{
    if (typeof ImageData !== "undefined" && imgData instanceof ImageData) 
    {
        ctx.putImageData(imgData, 0, 0);
        return;
    }

    if (imgData.kind === Deidril_GFX_API.GRAYSCALE_1BPP) 
    { Deidril_GFX_API.put_binary_grayscale_1bpp_image_data(ctx, imgData); } 
    else if (imgData.kind === Deidril_GFX_API.RGBA_32BPP) 
    { Deidril_GFX_API.put_binary_rgb_32bpp_image_data(ctx, imgData); } 
    else if (imgData.kind === Deidril_GFX_API.RGB_24BPP) 
    { Deidril_GFX_API.put_binary_rgb_24bpp_image_data(ctx, imgData); } 
    else 
    { throw new Error(`bad image kind: ${imgData.kind}`); }
}    

static draw_pdf_image(img, _transformation)
{
    let cn = document.createElement("canvas");
    cn.toDataURL('image/webp').indexOf('data:image/webp');
    cn.style.width = img.width;
    cn.style.height =img.height;
    cn.width = img.width;
    cn.height = img.height;

    let ctx = cn.getContext("2d");
    ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height);

    Deidril_GFX_API.put_binary_image_data(ctx, img.obj);

    if(_transformation)
    {
        const cnr = document.createElement("canvas");
        cnr.toDataURL('image/webp').indexOf('data:image/webp');

        
        const ctxr = cnr.getContext("2d");

        if(_transformation.rotation)
        {

            if(_transformation.rotation == 180)
            {
                cnr.style.width = img.width;
                cnr.style.height =img.height;
                cnr.width = img.width;
                cnr.height = img.height;  
            }
            else
            {
                cnr.style.width = img.height;
                cnr.style.height =img.width;
                cnr.width = img.height;
                cnr.height = img.width;    
            }

            ctxr.clearRect( 0, 0, ctxr.canvas.width, ctxr.canvas.height);

            switch(_transformation.rotation)
            {
                case -90:
                ctxr.rotate(-Math.PI/2);
                ctxr.translate(- img.width,0);
                break;

                case 180:
                ctxr.rotate(Math.PI);
                ctxr.translate(-img.width, -img.height);
                break;

                case 90:
                ctxr.rotate( Math.PI/2 );
                ctxr.translate(0, -img.height);
                break;

                default:
                throw "Unimplemented rotation value";
                break;
            }
        }
        if(_transformation.flip)
        {

            cnr.style.width = img.width;
            cnr.style.height =img.height;
            cnr.width = img.width;
            cnr.height = img.height;    

            ctxr.clearRect( 0, 0, ctxr.canvas.width, ctxr.canvas.height);

            switch(_transformation.flip)
            {
                case 'h': case 'H':
                    ctxr.translate(img.width, 0);
                    ctxr.scale(-1, 1);
                    break;
                case 'v': case 'V':
                    ctxr.translate(0,img.height);
                    ctxr.scale(1,-1);
                    break;    
                default: break;
            }
        }
        ctxr.drawImage(cn, 0,0);

        cn = cnr;
        ctx = ctxr;
     
    }

    return { canvas: cn, context: ctx};
}

static pdf_image_to_blob(img, _transformation)
{
    let drawn = Deidril_GFX_API.draw_pdf_image(img, _transformation);

    var dt = drawn.canvas.toDataURL("image/webp");
    const prefix = "data:image/webp;base64,";
    
    if(dt.startsWith(prefix))
    {
        dt = dt.slice(prefix.length);
        return { image: Deidril_GFX_API.b64_to_blob(dt, "image/webp"), canvas: drawn.canvas, context: drawn.context};
    }
    else return null;
}

static async load_image(filename_)
{
    let img = new Image();
    return new Promise((resolve, reject) => 
    {
        img.onload = () => { resolve(img); };
        img.onerror = e => { reject(e); };
        img.src = filename_;
    });
}

static create_webp_canvas(width_, height_)
{
    const cn = document.createElement("canvas");
    cn.toDataURL('image/webp').indexOf('data:image/webp');
    cn.style.width =  width_;
    cn.style.height = height_;
    cn.width =  width_;
    cn.height = height_;    

    return cn;
}

static image_to_canvas(img_)
{
    const cn = Deidril_GFX_API.create_webp_canvas(img_.width, img_.height);

    const ctx = canvas.getContext('2d');
    ctx.drawimage(img_, 0, 0);

    return cn;
}


}
export class Deidril_I18N_API
{
    static strvalues = new Map();

    static strcodes = new Map();

    static translations = new Map();

    static record_values = false;
    
    static hash(s)
    {
        let h=0;
        for(let i = 0; i < s.length; i++) 
            h = Math.imul(31, h) + s.charCodeAt(i) | 0;

        if(h < 0) { h = (h>>>0); }

        return h.toString(16);
        
    }

    static declare_string(code, value)
    {
        Deidril_I18N_API.strvalues.set(code,value);
    }

    static activate_translations(mode_)
    {
        if(mode_)
        {
            Deidril_I18N_API.translations = new Map();
            Deidril_I18N_API.record_values = mode_;
        }
    }

    static compile_strings()
    {
        Deidril_I18N_API.translations = new Map();
        for( let [key, value] of Deidril_I18N_API.strvalues)
        {
            let code = Deidril_I18N_API.hash(key).toString(16);
            Deidril_I18N_API.translations.set(code, value);
            Deidril_I18N_API.strcodes.set(key,code);
        }
    }

    static split_translations()
    {
        let result = [];

        let currentMap = {};
        let size = 0;

        for( let [key, value] of Deidril_I18N_API.translations)
        {
            currentMap[key] = value;
            size ++;
            if(size >= 15)
            {
                result.push(currentMap);
                currentMap = {};
                size = 0;
            }
        }

        if(size > 0)
        { result.push(currentMap); }

        return result;
    }

    static async read_translation_files(filenames = [])
    {
        for(let f of filenames)
        {
            const content = Deidril_FileSystem_API.file2string(f);

        }
    }
}
export class Deidril_PDFJS_API
{
    static OPS = {
        dependency: 1,
        setLineWidth: 2,
        setLineCap: 3,
        setLineJoin: 4,
        setMiterLimit: 5,
        setDash: 6,
        setRenderingIntent: 7,
        setFlatness: 8,
        setGState: 9,
        save: 10,
        restore: 11,
        transform: 12,
        moveTo: 13,
        lineTo: 14,
        curveTo: 15,
        curveTo2: 16,
        curveTo3: 17,
        closePath: 18,
        rectangle: 19,
        stroke: 20,
        closeStroke: 21,
        fill: 22,
        eoFill: 23,
        fillStroke: 24,
        eoFillStroke: 25,
        closeFillStroke: 26,
        closeEOFillStroke: 27,
        endPath: 28,
        clip: 29,
        eoClip: 30,
        beginText: 31,
        endText: 32,
        setCharSpacing: 33,
        setWordSpacing: 34,
        setHScale: 35,
        setLeading: 36,
        setFont: 37,
        setTextRenderingMode: 38,
        setTextRise: 39,
        moveText: 40,
        setLeadingMoveText: 41,
        setTextMatrix: 42,
        nextLine: 43,
        showText: 44,
        showSpacedText: 45,
        nextLineShowText: 46,
        nextLineSetSpacingShowText: 47,
        setCharWidth: 48,
        setCharWidthAndBounds: 49,
        setStrokeColorSpace: 50,
        setFillColorSpace: 51,
        setStrokeColor: 52,
        setStrokeColorN: 53,
        setFillColor: 54,
        setFillColorN: 55,
        setStrokeGray: 56,
        setFillGray: 57,
        setStrokeRGBColor: 58,
        setFillRGBColor: 59,
        setStrokeCMYKColor: 60,
        setFillCMYKColor: 61,
        shadingFill: 62,
        beginInlineImage: 63,
        beginImageData: 64,
        endInlineImage: 65,
        paintXObject: 66,
        markPoint: 67,
        markPointProps: 68,
        beginMarkedContent: 69,
        beginMarkedContentProps: 70,
        endMarkedContent: 71,
        beginCompat: 72,
        endCompat: 73,
        paintFormXObjectBegin: 74,
        paintFormXObjectEnd: 75,
        beginGroup: 76,
        endGroup: 77,
        beginAnnotations: 78,
        endAnnotations: 79,
        beginAnnotation: 80,
        endAnnotation: 81,
        paintJpegXObject: 82,
        paintImageMaskXObject: 83,
        paintImageMaskXObjectGroup: 84,
        paintImageXObject: 85,
        paintInlineImageXObject: 86,
        paintInlineImageXObjectGroup: 87,
        paintImageXObjectRepeat: 88,
        paintImageMaskXObjectRepeat: 89,
        paintSolidColorImageMask: 90,
        constructPath: 91
      };

    static async load_pdf(_pdfjs, _pdfjs_worker_filename, _filename)
    {
        _pdfjs.GlobalWorkerOptions.workerSrc = _pdfjs_worker_filename;
        console.assert(_filename instanceof ArrayBuffer || typeof _filename == 'string');
        let loadingTask = _pdfjs.getDocument(_filename);
        return loadingTask.promise;
    }

    static async loop_pages(_pdf, _callback_page = null, _callback_done = null) 
    {
        if(!_callback_page)
        {
            if(_callback_done) 
            { return new Promise ( (resolve)  => {  _callback_done(_pdf); resolve(); }); }
            else
            { return new Promise( (resolve) => { resolve(); }); }
        }

        const nb_pages = _pdf._pdfInfo.numPages;
        let promises = [];
        for (let i = 1; i <= nb_pages; i++) 
        { 
            let promise_page = _pdf.getPage(i).then( (page) => { _callback_page(_pdf, page);} )
            promises.push( promise_page );
        };

        return Promise.all(promises).then(() => { _callback_done(); } );
    }

    static log_fns_args(fns, args, filters = null)
    {
        let result = "";
        for(let i = 0; i < args.length; ++ i)
        {           
            let fn = fns[i];
            let arg = args[i];

            if((filters) && (!filters.includes(fn)))
            { continue; }

            for(let p in Deidril_PDFJS_API.OPS) 
            {
                if(Deidril_PDFJS_API.OPS[p] == fn)
                { 
                    result += '<p>#' + i + '{ fn: ' + fn + ', op: "' + p + '"';
                
                    switch(fn)
                    {


                        case 31: break;

                        case 9: case 12: case 40: case 42: case 58: case 91:
                            result += ', args: ' + JSON.stringify(arg);
                            break;
                        case 44: 
                            result += ', text: ['; 
                            let first = true;
                            for(let f of arg[0])
                            {
                                if(first) first = false;
                                else result += ', ';

                                if(f.unicode)
                                { result += '"' + f.unicode + '"'; }
                                else
                                {
                                    console.log("bizarre");
                                }
                            }
                            result += ']';
                            break
                        case 59: 
                          result += ', color: ' + JSON.stringify(arg);
                          break;
                        case 85: 
                           result += ', width:' + arg[1] + ', height:' + arg[2] + ', internalName:' + arg[0];
                           break;  
                        default: break;
                    }
                    result += '}</p>';
                    break; 
                }
            }    
        }

        return result;
    }

    static async log_operators(_page)
    {
        let ops = await _page.getOperatorList();
            
        const fns = ops.fnArray, args = ops.argsArray;
        return this.log_fns_args(fns, args);
    }

    /**
     * 
     * @brief                   Build a log of the objects in the page related to images
     * @param  {PDFPage} page_  PDFLib page object
     * @returns {string}        A readable inventory of the pdf page objects related to images
     * 
     **/
    static async log_images(page_)
    {
        let ops = await page_.getOperatorList();
            
        const fns = ops.fnArray, args = ops.argsArray;
        return this.log_fns_args
        (
            fns, 
            args, 
            [ this.OPS.transform, this.OPS.constructPath, this.OPS.paintImageXObject ] 
        );
    }

    /**
     * 
     * @brief                   Find a pdf page object of type image given its (x,y) position
     * @param {PDFPage} page_   PDFLib page object
     * @param {int}     x_      X position
     * @param {int}     y_      Y position
     * @return {Image}          Image returned, or null if not found
     * 
     **/
    static async get_page_image_at(page_, x_, y_)
    {
        let ops = await _page.getOperatorList();
    }
}


export class Deidril_PF2e
{

static STEPS = [ "BEGINNING", "DEFENSES", "ACTIONS" ];

static fix_creature_statblock(statblocks_)    
{
    let result = [];
    let step = "BEGINNING"

    for(let code of statblocks_)
    {
        let str = Handlebars.compile(code)();
        console.log('[' + str + ']');
        switch(step)
        {
            case "BEGINNING": 
                if(str.startsWith('<p class="helyx-p"><b>AC'))
                {
                    result[result.length-1] = result[result.length-1] + '{{{hr}}}';
                    console.log('PASS TO DEFENSES : ' + result[result.size-1]);
                    step = "DEFENSES";
                }
                break;
            case "DEFENSES":
                if(str.startsWith('<p class="helyx-p"><b>Speed'))
                {
                    result[result.length-1] = result[result.length-1] + '{{{hr}}}';
                    console.log('PASS TO ACTIONS : ' + result[result.size-1]);
                    step = "ACTIONS";
                }
                break;
            default: break;
        }

        result.push(code);
    }

    return result;
}


static fix_block(block_)
{
    switch(block_.type)
    {
        case 'creature' : 
        {
            block_.statblock = Deidril_PF2e.fix_creature_statblock(block_.statblock);
        }
    }
    if(block_.blocks)
    {
        for(let block of block_.blocks)
        {
            Deidril_PF2e.fix_block(block);
        }
    }
}

static fix_journal_entry(entry_)
{
    if(entry_.blocks)
    {
        for(let block of entry_.blocks)
        {
            Deidril_PF2e.fix_block(block);
        }
    }
}
}    
export class Deidril_Log_API
{

/**
 * @brief       Describe, by type of log, if messages must be printed or ignored
 * 
 *          If the value is true, then message of this type are printed
 *          if the value is false, then message of this type are ignored
 *  
 **/       
static FILTER = { debug: true, error: true, report: true };

static PREFIX = 'DEIDRIL';

static ROOT_PATH = '/modules/';

static REPORT = { name: "REPORT", css_1 : 'background: #072; color: #FFFFFF;', css_2 : 'background: #FFFFFF; color: #072;' };
static ERROR = { name: "ERROR", css_1 : 'background: #F00; color: #FFFFFF', css_2 : 'background: #FFFFFF; color: #F00' };
static DEBUG = { name: "DEBUG", css_1 : 'background: #444; color: #FFFFFF', css_2 : 'background: #FFFFFF; color: #444' };

static REPORT_STREAM = "";
static ERROR_STREAM = "";
static DEBUG_STREAM = "";
static ALL_STREAM = "";

static history = [];


/**
    
    @brief                  Get the file location, line number and column number of the calling code.

    @function
    @static
    @param {number} index_  The index of the call in the stack trace to get the location from.
 *
    @returns {file: String, line: Integer, column: Integer}
      An object with the file, line, and column numbers. 

**/
static ioloc(index_)
{
    // Split the stack trace into individual lines
    let stack = new Error().stack.split('\n');

    // Get the line containing the calling code location from the stack trace
    let loc = stack[index_].split(':');


    // Get the line, column, and file indices from the location array
    let line_index = loc.length -2;
    let col_index  = loc.length -1;
    let file_index = loc.length -3;

    // Create the result object with the line, column, and file numbers
    let result = 
    { 
        file : loc[file_index], 
        line: loc[line_index], 
        column: loc[col_index]
    };

    // If '/modules/' appears in the file path, make the file path relative to it
    let i = result.file.indexOf(Deidril_Log_API.ROOT_PATH);
    if(i != -1)
    { result.file = result.file.slice(i); }

    return result;
}


/**
 
    @brief                      Store a log into the log history
    @function
    @static
    @param {String} str_        Message to log.
    @param {Object} config_     Output configuration.
    @param {Object} location_   Source location.

    If the history isn't initialized, nothing is done
**/
static historize(str_, config_, location_)
{
    let history = Deidril_Log_API.history;
    if((history == null) || (history.length == 0)) return;

    let section = history[ history.length -1];

    const entry = { type: config_.name, text: str_, location: location_};
    section.logs.push(entry);
}

/**
 
    @brief      Reset the log history

**/
static reset()
{
    Deidril_Log_API.history = [];
}

static start(section_name_)
{
    Deidril_Log_API.history.push({ name: section_name_, logs: []});
}


/**
    
    @brief                  Log a message with a source location, using a given output configuration.

    @function
    @static
    @param {String} str_        Message to log.
    @param {Object} config_     Output configuration.
    @param {Object} location_   Source location.

**/
static log(str_, config_, location_)
{
    console.log
    ( 
        '%c '
        + Deidril_Log_API.PREFIX 
        + ' (' + config_.name + ')' 
        + ' %c ' 
        + location_.file 
        + ' L' 
        + location_. line
        + ' C'
        + location_.column 
        + ' %c' 
        + str_
        
        , config_.css_1, config_.css_2, config_.css_1
    );    
}

/**
    
    @brief                  Make the log message with a source location, using a given output configuration.

    @function
    @static
    @param {String} str_        Message to log.
    @param {Object} config_     Output configuration.
    @param {Object} location_   Source location.

**/
static message(str_, config_, location_)
{
    return '%c '
        + Deidril_Log_API.PREFIX 
        + ' (' + config_.name + ')' 
        + ' %c ' 
        + location_.file 
        + ' L' 
        + location_. line
        + ' C'
        + location_.column 
        + ' %c' 
        + str_
    ;    
}

static clear()
{
    Deidril_Log_API.REPORT_STREAM = "";
    Deidril_Log_API.ERROR_STREAM = "";
    Deidril_Log_API.DEBUG_STREAM = "";
    Deidril_Log_API.argumentsALL_STREAM = "";
}

static format(str, ioloc, type)
{
   return '<p class="helyx-log-' + type + '">' 
        + '[' + ioloc.file + ':L' + ioloc.line + ',C' + ioloc.column + '] ' 
        + str + '</p>'
    ; 
}

static report(str)
{
    if(!Deidril_Log_API.FILTER.report)
    { return; }

    const ioloc = Deidril_Log_API.ioloc(3);

    Deidril_Log_API.log
    (
        str
        , Deidril_Log_API.REPORT
        , ioloc
    );

    const entry = Deidril_Log_API.format(str,ioloc,'report');
    Deidril_Log_API.REPORT_STREAM += entry;
    Deidril_Log_API.ALL_STREAM += entry;
}

static debug(str) 
{
    if(!Deidril_Log_API.FILTER.debug)
    { return; }

    const ioloc = Deidril_Log_API.ioloc(3);

    Deidril_Log_API.log
    (
        str
        , Deidril_Log_API.DEBUG
        , ioloc
    );

    const entry = Deidril_Log_API.format(str,ioloc,'debug');
    Deidril_Log_API.DEBUG_STREAM += entry;
    Deidril_Log_API.ALL_STREAM += entry;
}

static error(str) 
{
    if(!Deidril_Log_API.FILTER.error)
    { return; }

    const ioloc = Deidril_Log_API.ioloc(3);

    const message = Deidril_Log_API.message ( str, Deidril_Log_API.ERROR, ioloc );
    console.error(message);

    const entry = Deidril_Log_API.format(str,ioloc,'error');
    Deidril_Log_API.ERROR_STREAM += entry;
    Deidril_Log_API.ALL_STREAM += entry;
}

}


export class Deidril_PDF_API
{

static C2_MIDDLE_X = 300;

/** 
 * 
 * @brief                   Filter pdf text block with coordinates outside a bouding box
 * @param {Array} _texts    An array of pdf text block
 * @param {Object} _box     A bounding box { left: xx, right: yy, top: tt, bottom: bb}
 * @returns                 the _texts array without text block outside the box
 * 
 * Note that top > bottom. In a pdf, y coordinate goes form 1000 (top) to 0(bottom) ( for example)
 * 
 * 
**/
static filter_by_bounding_box(_texts, _box)
{
    let result = [];

    if(!_texts) return result;

    for(let i = 0; i < _texts.length; ++i)
    {
        let e = _texts[i];
        if(e.font)
        {
            if(e.font.flags && e.font.flags.skip)
            { continue; }
        }

        if ((e.x < _box.left) || (e.x > _box.right) || (e.y > _box.top) || (e.y < _box.bottom))
        { continue; }

        result.push(e);
    }

    return result;
}

/**
 * @brief                   Split an array of texts into two, based on who use a font with a certain flags
 * @param {*} texts_        Array of text
 * @param {*} flag_         Flag used to split texts
 * @returns                 { flagged: [], others: [] }
 */
static split_by_font_flags(texts_, flag_)
{
    let flaggeds = [];
    let others = [];

    for(let i = 0; i < texts_.length; ++i)
    {
        let e = texts_[i];
        if(e.font)
        {
            if(e.font.flags && e.font.flags[flag_])
            { flaggeds.push(e); }
            else 
            { others.push(e); }
        }
        else 
        { others.push(e); }
    }


    return { flaggeds: flaggeds, others: others};
}

/**
 * 
 * @brief           Compare two pdf blocks, order by y then x
 * @param {PDFBlock} l 
 * @param {PDFBlock} r 
 * @returns 
 */
static compare_pdf_blocks(l,r)
{
    if (l.y != r.y) { return r.y - l.y; }
    return l.x - r.x;
};

/**
 * 
 * @brief           Compare two pdf blocks, order by coloumn, then by y then x
 * @param {PDFBlock} l 
 * @param {PDFBlock} r 
 * @returns 
 *
 *  Assume the col separator is at x == 500
**/
static compare_2col_pdf_blocks(l,r,middle_)
{
    const lcol = (l.x < middle_) ? 1 : 2;
    const rcol = (r.x < middle_) ? 1 : 2;

    l.column = lcol;
    r.column = rcol;

    let result = 0;

    if(lcol != rcol) 
    { result = ((lcol < rcol) ? -1 : 1); }
    else 
    {
        if(l.y == r.y)
        { 
            if(l.x == r.x) 
            { result = ((l.index < r.index) ? -1 : 1); }
            else
            { result = ((l.x < r.x) ? -1 : 1); }
        }
        else 
        { 
            // REMEMBER Y is INVERTED IN PDFS !!!
            result =  ((l.y > r.y) ? -1 : 1); 
        }
    }

    return result;
}

/**
* 
* @brief                    Return true if two pdf indexes are referring to entries on the same page
* @param {Integer} _i1      First index
* @param {Integer} _i2      Second index 
* @returns                  true if indexes are referring entries that are on the same page
*
**/
static are_in_same_page(_i1, _i2)
    {
        let p1 = Math.floor(_i1 / 1000);
        let p2 = Math.floor(_i2 / 1000);
        return (p1 == p2);
    }    

/**
 * @brief                   Concat the field .str of all pdf blocks of an array
 * @param {Array} _pile     An array of PDF block
 * @return {string}         Concatenation of all .str values
 */    
static pile2str(_pile)
{
    let result = "";
    for(let block of _pile)
    { result += block.str ?? ""; }
    return result;
}


/**
 * 
 * @return                          Return the index in the array 'pile' of the block that start at 'text_index_' 
 * @param {Array}   _pile           An array of PDFblock
 * @param {integer} text_index_ 
 * @return                          Index of the found block in the array, -1 if not found
 */
static blockindex(_pile, text_index_)
{
    let reading = 0;
    for(let i = 0; i < _pile.length; ++i)
    {
        if(text_index_ >= reading && text_index_ < (reading + _pile[i].str.length))
        { return i; }

        reading += _pile[i].str.length;
    }

    Deid.Log.error("Failed to find index " + idx + " in pile " + JSON.stringify(_pile));
    throw Exception("Failure");    
}

/**
 * 
* @param {color}  a      A PDF color declaration
* @param {color}  b      Another PDF color declaration
* @return                true if both declarations are the same color
*
**/
static cmp_color(a, b)
{
    if ((!a) && (!b)) return true;
    if ((!a) || (!b)) return false;

    let a_is_string  = (typeof(a) === 'string') || (a instanceof String);
    let b_is_string  = (typeof(b) === 'string') || (b instanceof String);

    let same_color = false;
    if(a_is_string && b_is_string)
    {  same_color = (a == b);  }
    else 
    { same_color = (a["0"] == b["0"]) && (a["1"] == b["1"]) && (a["2"] == b["2"]);  }
    
    return same_color ;
}

/**
 * 
 * @param {font} a 
 * @param {font} b 
 * @returns              true if both font are the same
 */
static cmp_font(a, b)
{
    if((!a) && (!b)) 
    { return true; }

   return (a.name == b.name) && (a.size == b.size) && (Deidril_PDF_API.cmp_color(a.color, b.color));
}

/**
 * @brief               Sub class with static functions to analyse pdf ops args and return them in structured javascript objects
 * 
 */
static OpArgs = class _OP_ARGS 
{
    /**
     * @brief               Return args of op showText as the text to be printed
     * @param {*} _args     arguments of op showText ( #49 )
     * @returns             String to be printed
     */
    static show_text(_args)
    {
        // If args is string
        if(typeof(_args) === 'string' || _args instanceof String)
        { return _args; }

        if(_args instanceof Array)
        { 
            if(_args.length != 1)
            { return undefined; }

            const at0 = _args[0];
            if(at0 instanceof Array)
            {
                const at00 = at0[0];
                if(at00["unicode"])
                {
                    let res = '';
                    for(let def of at0)
                    {
                        if(!def) continue;

                        if(!(def instanceof Object)) continue;

                        if (!def.unicode)
                        { return false; }

                        for(let c of def.unicode.split(''))        
                        { res += c; }
                    }
                    return res;
                }
            }
        }
        
        return undefined;
    }    
} // End of class OpArgs


static convert_color(method_, color_)
{
    switch(method_)
    {
        case "normal": return color_;
        case "none"  : return "none";
        default: return color_;
    }
}

}
export class Deidril_Stringify
{

/**
* 
* @brief                    Stringify an item import
*
**/
static item(item_, tabs_ = 0)
{
    if((!item_) || (typeof item_ !== 'object'))
    {
        throw "Was expecting an item but parameter isn t an object";
    }
    let result = ' '.repeat(tabs_) + '{\n';
    
    result += ' '.repeat(tabs_+4) + '"helyx": ' + Deidril_Stringify.helyx(item_.helyx);
    result += ',\n';

    result += ' '.repeat(tabs_+4) + Deidril_Stringify.str(item_, 'name');
    
    if(item_.img)
    { result +=  ',\n' + ' '.repeat(tabs_+4) + Deidril_Stringify.str(item_, 'img'); }

    if(item_.blocks)
    {
        result += ',\n';
        result += ' '.repeat(tabs_+4) + '"blocks":\n' + ' '.repeat(tabs_+4) + '['
        let first = true;
        for(let i of item_.blocks)
        {
            if(first) first = false; 
            else result +=',';
            result += '\n' + Deidril_Stringify.block(i, tabs_+8);
        }

        result += '\n' + ' '.repeat(tabs_+4) + ']';
    }

    result += '\n' + ' '.repeat(tabs_) + '}';
    return result;
}  

static block(block_, tabs_)
{
    switch(block_.type)
    {
        case 'creature': case 'hazard': return Deidril_Stringify.block_creature(block_, tabs_);
        case 'section': return Deidril_Stringify.block_section(block_, tabs_);

        default: return ' '.repeat(tabs_) + JSON.stringify(block_);
    }
}

static statblock_creature(statblock_, tabs_)
{
    let result = ' '.repeat(tabs_) + '[';
    result += '\n' + ' '.repeat(tabs_+4);
    
    let nbcode = 0, first = true;
    for(const code of statblock_)
    {
        if(first) { first = false; } else  { result += ','; }

        result += '"' + code + '"';

        nbcode ++;

        if((nbcode == 8) || (code.endsWith('{{{hr}}}')))
        { nbcode = 0; result += '\n' + ' '.repeat(tabs_+4); }


    }

    result += '\n' + ' '.repeat(tabs_) + ']';
    return result;
}

static statblock(block_, tabs_)
{
    switch(block_.type)
    {
        case 'creature': return Deidril_Stringify.statblock_creature(block_.statblock, tabs_);
        default: return  JSON.stringify(block_.statblock);
    }
}

static block_creature(block_, tabs_)
{
    let result = ' '.repeat(tabs_) + '{\n';

    // LINE 1
    result +=    ' '.repeat(tabs_+4) + Deidril_Stringify.str(block_, 'type');
    if(block_.actor) result += ', '  + Deidril_Stringify.str(block_, 'actor');
    if(block_.name) result += ', '  + Deidril_Stringify.str(block_, 'name');
    if(block_.amount) result += ', '  + Deidril_Stringify.str(block_, 'amount');
    result += ', "statblock":\n';

    // LINE 2
    result +=  Deidril_Stringify.statblock(block_, tabs_+4);

    if(block_.cr)   result += ',\n' + ' '.repeat(tabs_+4) + Deidril_Stringify.str(block_, 'cr');
    if(block_.tags) result += ',\n' + ' '.repeat(tabs_+4) + Deidril_Stringify.str(block_, 'tags');

    result += '\n' + ' '.repeat(tabs_) + '}';
    
    return result;

}

static block_section(block_, tabs_)
{
    let result = ' '.repeat(tabs_) + '{\n';
    result += ' '.repeat(tabs_+4) + Deidril_Stringify.str(block_, 'type') 
            + ',' + Deidril_Stringify.str(block_, 'section')
            + ',' + Deidril_Stringify.str(block_, 'title')
            + ',\n'; 
    if(block_.image)
    {
        result += ' '.repeat(tabs_+4) + Deidril_Stringify.str(block_, 'image') + ',\n';
    }        

    if (block_.blocks)
    {
        const one_block = (block_.blocks.length == 1);
        const separator = one_block ? "" : "\n";
        const tabs = one_block ? '' : ' '.repeat(tabs_+4);

        result += ' '.repeat(tabs_+4) + '"blocks":' + separator; 

        result += tabs + '[' + separator;

        let first_block = true;

        if(block_.blocks)
        for(const BLOCK of block_.blocks)
        { 
            if(first_block) { first_block = false; }
            else { result += ','; }
            result += separator + Deidril_Stringify.block(BLOCK, (one_block ? 0 : tabs_+8));
            first_block = false;
        }

        result += separator + tabs + ']\n';
    }

    result += ' '.repeat(tabs_) + '}';
    
    return result;
}

static str(ex_, name_)
{
    if(!ex_[name_])
    { return ''; }

    const val = ex_[name_], valtype = foundry.utils.getType(val).toLowerCase();
    if(valtype == 'array')
    {
        let result = 'name_ + ": [';
        let first = true;
        for(let s of val)
        {
            if(first) first = false; 
            else result +=', ';

            result += ":'" + s + "'"
        }

        return result + ']';

    }

    let result = '"' + name_ + '":';
    if(valtype == 'object')
    { result += JSON.stringify(val);}
    else
    { result += '"' + val + '"'; }

    return result;
}

static values(ex_, order_)
{
    let result = '';
    let first = true;
    for(let o of order_)
    { 
        let s = Deidril_Stringify.str(ex_, o); 
        if (s == '') continue;
        
        if(first) first = false; 
        else result +=', ';

        result += s;
    }

    for(let i in ex_)
    {
        if(ex_[i] == undefined) continue;
        if(order_.indexOf(i) != -1) continue;

        let s = Deidril_Stringify.str(ex_, i); 
        if (s == '') continue;
        
        if(first) first = false; 
        else result +=', ';

        result += s;
    }

    return result;
}

static lined_values(ex_, order_, tabs_)
{
    let result = '';
    let first = true;
    for(let o of order_)
    { 
        let s = Deidril_Stringify.str(ex_, o); 
        if (s == '') continue;
        
        result += ' '.repeat(tabs_);

        if(first) 
        { first = false;  result += '  '; }
        else 
        { result +=', '; }

        result += s;
    }

    return result;    
}

static json(ex_, order_)
{
    let result = {};
    for(let o of order_)
    {
        let val = ex_[o];
        if(val)
        {
            result[o] = val;
        }
    }

    return result;
}

static tos(ex_, tabs_ = 0)
{
    return ' '.repeat(tabs_) 
        + '{'  
        + ex_.str(tabs_+4) 
        + '\n' +' '.repeat(tabs_)
        + '}\n'
    ;
}

static inlined(ex_)
{
    return '{ ' + ex_.str(0) +' }';
}

static field(ex_, field_, tabs_)
{
    const val = ex_[field_];

    if(!val) { return ''; }

    let result = ' '.repeat(tabs_) + '"' + field_ + '" :';

    if(val.inlined())
    {
        result += Deidril_Stringify.inlined(val);
    }
    else
    {
        result += '\n' + Deidril_Stringify.tos(val, tabs_); 
    }

    return result;
}

static helyx(ex_)
{
    if((!ex_) || (typeof ex_ !== 'object'))
    {
        return '{ }';
    }    

    return "{ " + Deidril_Stringify.values(ex_, ['type', 'idname', 'target', 'prerequisites']) + " }";
}

}

export class Deidril_FileSystem_API
{

/**
 *
 * typedef ExploreDirectoryOptions 
 * @property {string}  target               Explored directory
 * @property {string}  [source=data]        Active source, for example 'data'
 * @property {string}  [type='*']           Suffixes of Accepted files
 * 
 * @param    {ExploreDirectoryOptions}  options_        Options of the file system exploration
 * @return                                              An array of filenames matching the type
 * 
 */
static async explore(options_ = {})
{
    mergeObject(options_, {source: 'data', type: '*'}, {overwrite:false});    

    const f = new foundry.applications.apps.FilePicker({ activeSource : options_.source, current: options_.target});
    const exploration = await f.constructor.browse(options_.source,options_.target,{});

    let result = [];

    for(const d of exploration.dirs)
    { 
        const new_options = {...options_};
        new_options.target = d;

        result = result.concat(await Deidril_FileSystem_API.explore(new_options)); 
    }

    for(const f of exploration.files)
    {
        if((options_.type == '*') || (f.endsWith(options_.type)))
        {
            result.push(f);
        }
    }

    return result;
}

/**
 *  
 * @param   {string} filename_   File name
 * @returns {string}            Content of the file as a string
 * 
 */
static async file2string(filename_)
{
    let response = await fetch(filename_);
    if (!response.ok) 
    {
        throw new Error("file2string error : Failed to load file " + filename_);
    }
    return await response.text();
}

static dirname(filepath_)
{
    // Assuming filepath_ is an absolute path
    const last_slash_index = filepath_.lastIndexOf('/');
    return (last_slash_index == -1) ? "" : filepath_.substring(0, last_slash_index);
}

static filename(filepath_)
{
    // Assuming filepath_ is an absolute path
    const last_slash_index = filepath_.lastIndexOf('/');
    return (last_slash_index == -1) ? filepath_ : filepath_.substring(last_slash_index);
}

/**
 * 
 * @param    {string}  path_                 File or directory to check
 * @param    {string}  source_='data'        Active source, for example 'data'
 * @return                                   true if path_ points on something
 * 
 */
static async exists(path_, source_ = 'data')
{
    const f = new foundry.applications.apps.FilePicker({ activeSource : source_, current: ""});

    let words = path_.split('/');    
    let current = "";
    for(let i = 0; i < words.length; i++)        
    {        
        let last = (i == words.length-1);
        const word = current + (current == "" ? "" : "/") + words[i];

        if(word == "") continue;

        const exploration = await f.constructor.browse(source_,current,{});

        if(last)
        {
            for(const f of exploration.files)
            {
                if(f == word) return true;
            }
            for(const d of exploration.dirs)
            {
                if(d == word) return true;
            }
            return false;
        }
        else
        { 
            let found = false;
            for(const d of exploration.dirs)
            {
                if(d == word)
                { found = true; break; }
            }
            if(!found) return false;
            current = word;
        }
    }
}

}    
export class Deid
{

// Static log API
static Log = class _Log extends Deidril_Log_API{};
static PDF = class _PDF extends Deidril_PDF_API{};
static JSON = class _JSON extends Deidril_Stringify{};
static PDFJS = class _PDFJS extends Deidril_PDFJS_API{};
static Gfx = class _GFX extends Deidril_GFX_API{};
static Foundry = class _Foundry extends Deidril_Foundry_API{};
static Art = class _Art extends Deidril_COMPENDIUM_ART_API{};
static PF2e = class PF2e_ extends Deidril_PF2e{};
static I18N = class I18N_ extends Deidril_I18N_API{};
static FS = Deidril_FileSystem_API;

static FRENCH_ACCENTS = /[àäâéèëêïîöôüùû]/g ;

static UNCAPITALIZED_WORDS_FR = [ 'de', 'des', 'le', 'la' ];
static UNCAPITALIZED_WORDS_EN = [ 'a', 'at', 'in', 'of', 'the', 'to', 'with' ];

static ROMAN_NUMBERS = [ "II", "III" ];

/************************************************************************************/    
/*                                                                                  */ 
/*            General javascript functions                                          */ 
/*                                                                                  */ 
/************************************************************************************/

/**
 * 
 * @param {Object} source       A javascript object 
 * @param {Object} template     Another javascript object
 * @returns {boolean}           return true if 'source' includes 'template'
 * 
 **/
static match(source, template) 
{

    // Validate input
    const ts = foundry.utils.getType(source);
    const tt = foundry.utils.getType(template);
    if ( (ts !== "Object") || (tt !== "Object")) throw new Error("One of source or template are not Objects!");
      
    // Define recursive filtering function
    const _match = function(s, t) 
    {
        for ( let [k, v] of Object.entries(t) ) 
        {
            let has = s.hasOwnProperty(k);
            if(has == false) return false;

            let x = s[k];
      
            // Case 1 - inner object
            if ( (foundry.utils.getType(v) === "Object") && (foundry.utils.getType(x) === "Object") ) 
            { 
                if( !_match(x, v)) return false; 
            }
      
            // Case 2 - inner key
            else if(x != v)
            { return false; }
                
        }
        return true;
    }
        
    return _match(source, template);
}

/**
 * 
 * @brief                   Return or rebuild an object using the right class  
 * @param {*} jsclass_      Expected object class
 * @param {*} value_        Incoming object
 * @returns                 Return value_ if is an instance of jsclass_, otherwhile create a new instance using value_ as constructor parameter
 * 
 */
static build(jsclass_, value_)
{
    // No source object, we return null
    if(!value_) 
    { return null; }
    
    // The object is already of the right class
    if(value_ instanceof jsclass_) 
    { return value_; }

    // We build a new object of the expected class, using value_ as the constructor parameter
    return new jsclass_(value_);
}

/**
 * 
 * @brief                   Return or rebuild an array of objects using the right class  
 * @param {*} factory_      A function returning the class implemenation from a helyx type name
 * @param {*} values_       An array of object
 * @returns                 Return an array of object, calling build(factory_.get(object.type), object) for each instance
 * 
 */
static build_dynamic_array(factory_, values_)
{
    if(!values_) 
    { return null; }

    let result = [];
    for(let v of values_)
    {
        const jsclass = factory_(v.type);
        result.push(Deid.build(jsclass, v));
    }
    return result;
}

/**
 * 
 * @brief                   Return or rebuild an array of objects using the right class  
 * @param {*} jsclass_      Expected objects class
 * @param {*} values_       An array of object
 * @returns                 Return an array of object, calling build(jsclass_, object) for each instance
 * 
 */
static build_array(jsclass_, values_)
{
    if(!values_) 
    { return null; }

    let result = [];
    for(let v of values_)
    {
        result.push(Deid.build(jsclass_, v));
    }
    return result;
}

static near(a,b,delta)
{
    return (a > b) ? ((a-b) <= delta) : ((b-a) <= delta);
}

/************************************************************************************/    
/*                                                                                  */ 
/*             Compendium functions                                                 */ 
/*                                                                                  */ 
/************************************************************************************/

/**
 * 
 * @param {string} key          Key in the game.packs map of a compendium
 * @param {string} type         Type of content [ OPTIONAL ]
 * @returns                     Compendium found, undefined if not found
 * 
 */
static compendium(key, type)
{
    let res = game.packs.get(key)
    if (res == undefined)
    { return undefined; }


    if ( (type==undefined) || (res.metadata.type == type))
    { return res; }

    return undefined;
}

/**
 * 
 * @param {Map}    pack             Foundry compendium
 * @param {string} entityName       Name displayed for an entity ( journal, actor, item, scene ... )
 * @returns                         Entity found, undefined if not found
 * 
 **/
static searchEntityInCompendium(pack, entityName)
{
    for(const [key, value] of pack.index.entries())
    {
        if(value.name == entityName)
        { return value; }
    }
    return undefined; 
}

/**
 * 
 * @param {string} compendiumKey    Key in the game.packs map of a compendium
 * @param {string} entityName       Name displayed for an entity ( journal, actor, item, scene ... )
 * @param {string} compendiumType   [ OPTIONAL ] Expected entity type
 * @returns                         Id of the entity found, undefined if not found
 * 
 **/
static compendiumEntityId(compendiumKey, entityName, compendiumType = undefined)
{
    let pack = Deid.compendium(compendiumKey, compendiumType);
    if(pack == undefined)
    { return undefined; }

    let entity = Deid.searchEntityInCompendium(pack, entityName);
    return (entity ? entity._id : undefined);
}


/************************************************************************************/    
/*                                                                                  */ 
/*            Directory functions                                                   */ 
/*                                                                                  */ 
/************************************************************************************/

static async mkdir(source, dirname)
{
    try
    {
        await foundry.applications.apps.FilePicker.createDirectory(source, dirname);
        return true;
    } 
    catch(e)
    { return false; }        
}

/************************************************************************************/    
/*                                                                                  */ 
/*            Folder functions                                                      */ 
/*                                                                                  */ 
/************************************************************************************/

/**
 * 
 * @brief               Return a foundry folder, given its name and some options
 * @param {string} name 
 * @param {*} options
 * 
 *  Possible values are options.type : type of data of the folder
 *                      options.root : if true, the folder must not have any parent
 * 
 * @returns             The foundry folder object if found, null if not found
 */
static folder(name, options)
{
    for(const [key, folder] of game.folders.entries())
    {            
        if(folder.name == name)
        {
            if(options.type && (folder.type != options.type) )
            { continue; }

            if(options.root && (folder.parent != null))
            { continue; }

            return folder;
        } 
    };   
    return null;
}

static folderChild(parentId, name)
{
    const f = game.folders.get(parentId);
    if(f)
    {
        for(const child of f.children)
        {
            if(child.folder.name == name)
            { return child; }
        };
    }
    return null;
}

/************************************************************************************/    
/*                                                                                  */ 
/*             Handlebars functions                                                 */ 
/*                                                                                  */ 
/************************************************************************************/

static compile(content)
{
    if(content == undefined)
    { return ""; }

    let template = "";

    if (typeof content == "string")
    { template = content; }
    else if (content instanceof Array)
    { template = content.join(""); }
    else
    { template = "Unsupported content type in Deid.compile"; }

    try
    {
        const result = Handlebars.compile(template)();

        if(Deid.I18N.record_values)
        { Deid.I18N.declare_string(template, result); }

        return result;
    }
    catch(e)
    {
        console.log('Failed to compile ' + content);
        console.log(e);
        return content;
    }
}

/************************************************************************************/    
/*                                                                                  */ 
/*             Foundry modules general functions                                    */ 
/*                                                                                  */ 
/************************************************************************************/

/**
 * 
 *  @brief                      Check module dependencies. Return an array of dependencies not found
 *  @param {Array<string>}      An array with the name of the wanted dependencies
 * @returns                     An array with the name of the not found dependencies
 * 
 **/
static check_dependencies(deps_)
{
    let result = [];

    if(deps_)
    for(let dep of deps_)
    {
        if(game.modules.has(dep) == false)
        { result.push( { name: dep, installed: false, active: false}); }

        const mod = game.modules.get(dep);

        if((mod == null) || (mod.active == false))
        { result.push( { name : dep, installed: true, active: false}); }

    }
    return result;    

}

/************************************************************************************/    
/*                                                                                  */
/*              String functions                                                    */ 
/*                                                                                  */ 
/************************************************************************************/

static is_number(s) 
{
    return !isNaN(s - parseFloat(s));
}

static is_string(s)
{
    return (typeof(s) === 'string') || (s instanceof String);
}

static match_class(object_, class_)
{
    if(class_ == String)
    { return Deid.is_string(object_); }

    if(class_ == null)
    { return object_ == null; }

    return (object_ instanceof class_);
}

static match_classes(object_, classes_)
{
    if(classes_ instanceof Array)
    {
        for(const c of classes_)
        {
            if(Deid.match_class(object_, c))
            { return true; }
        }
    }
    return false;
}

static expect(object_, classes_)
{
    if(!Deid.match_classes(object_, classes_))
    {
        throw Exception("Wrong object class ")
    }
}

/**
 
   @brief                               Replace an indexed sequence in a string
   @param[in] String     _string        String to fix
   @param[in] Integer   _index          Index of the sequence to replace 
   @param[in] String    _replacement    Replacement
   @returns                             The string with the replaced sequence
 
**/
static replace(_string, _index, _replacement) 
{
    return _string.substring(0, _index) + _replacement + _string.substring(_index + _replacement.length);
}

/** 

    @brief                  Reduce all occurences of multiples spaces to a single space
    @param[in] String       String to be fixed
    @returns                Fixed string

**/
static single_space(_string)
{
    while(_string.indexOf('  ') != -1)
    { _string = _string.replace('  ',' '); }
    return _string;
}

static fix_symbols(_string)
{
   _string = _string.replaceAll('…','...');
   return _string;
}

static uncapitalized_words(_language)
{
    switch(_language)
    {
        case 'fr' : return Deid.UNCAPITALIZED_WORDS_FR;
        case 'en' : return Deid.UNCAPITALIZED_WORDS_EN;
        default: return Deid.UNCAPITALIZED_WORDS_EN;
    }
}

static capitalize_word(_word)
{
    return _word.charAt(0).toUpperCase() + _word.substring(1).toLowerCase(); 
}


/**
 * Capitalize the first letter of each word, set all other caracters to lower case
 * 
 * @param {string} str_             String to capitalize
 * @param {string} language_        Language abbrev, to retrieve exceptions to capitalization
 * @returns str with each word turned to lower case except first character to upper case
 * 
 */
static capitalize_words(str_, language_)
{    
    let words = str_.toLowerCase().split((/[ \t]/));
    const exceptions = Deid.uncapitalized_words(language_);

    let last_word = '';
    for (let i = 0; i < words.length; i++) 
    {
        const word = words[i];
        const is_exception = exceptions.includes(word)
                && (i != 0)
                && (last_word.endsWith(']') == false)
                && (last_word.endsWith('.') == false)
        ;
        const is_capitalized = Deid.ROMAN_NUMBERS.includes(word);

        last_word = words[i] = 
            is_capitalized ? word
            : (is_exception ? word : Deid.capitalize_word(word));
    }
    return words.join(' '); 
} 

static singularize_fr_word(_str)
{
    // Remove ending s, only if the word isn't a single s
    if((_str.endsWith('s')) && (_str !='s') && (!_str.endsWith("’s")))
    { return _str.substring(0, _str.length-1); }

    return _str;
}

static singularize_words(_str, _language)
{
    let words = _str.split(' ');
    for (let i = 0; i < words.length; i++) 
    {
        switch(_language)
        {
            case 'en' : words[i] = Deid.singularize_fr_word(words[i]); break;
            case 'fr' : words[i] = Deid.singularize_fr_word(words[i]); break;
        }
    }
    return words.join(' ');
}

/**
 * Returns a string with a code enclosed in square brackets and the rest of the input string concatenated.
 *
 * @param {string} str_ - The input string to be processed.
 * @param {string} symbol_ - The symbol used to split the input string into words. Default is '.'.
 * @param {number} numlen_ - The length of the code to be enclosed in square brackets. Default is 2.
 *
 * @returns {string} The input string with the code enclosed in square brackets and the rest of the string concatenated.
 * 
 * In summary, the sqbrackets() function takes an input string str_ and splits it into words using a specified symbol_ (default is a period). 
 * It then takes the first word as the code and encloses it in square brackets with a length of numlen_ (default is 2). 
 * If the length of the code is less than numlen_ and more than 1, it adds a leading zero to the code. 
 * Finally, it concatenates the remaining words and returns the resulting string with the enclosed code. 
 * If the input string does not contain the specified symbol, it tries to split by '�'. 
 * If it still does not contain the specified symbol, it returns the original string. 
 * 
 */
static sqbrackets(str_, symbol_ = '.', numlen_ = 2) 
{
    let words = str_.split(symbol_);
  
    // If the input string does not contain the specified symbol, split by '�'
    if (words.length == 1) 
    { words = str_.split('�'); }
  
    // If the input string still does not contain the specified symbol, return the original string
    if (words.length == 1) 
    { return str_; }
  
    const first_word = words[0];  

    if(Deid.is_number(first_word))
    { return '[' + first_word + ']' + words.slice(1).join(''); }

    let code = first_word[0];

    // If the length of the code is less than the specified length and more than 1, add leading zeros to the code
    if(first_word.length > 1)
    {
        if (first_word.length < (1 + numlen_))
        { code += '0' + first_word.slice(1); }
        else 
        { code += first_word.slice(1); }
    }
  
    return '[' + code + ']' + words.slice(1).join('');
}
  
/**
 * 
 * @brief           Reformat a filename to use snake case format, without the file suffix
 * @param {*} name  A sentence or a filename
 * @returns         snake case version of name
 * 
 **/
static flatname(name)
{
    if(name.endsWith('.pdf'))
    {
        name = name.slice(0, name.length-4);
    }

    var idx = name.indexOf('/');
    while(idx != -1)
    {
        name = name.slice(idx+1);
        idx = name.indexOf('/');
    }

    return name.toLowerCase().replaceAll(' ','-').replaceAll('\'', '').replaceAll('!', '');
}  

static tos(obj)
{
    return JSON.stringify(obj, null, '\t');
}

static startingValue(str, values)
{
    let lowcased = str.toLowerCase();
    for(let v of values)
    {
        if(str.startsWith(v))
        { return v; }
    }

    return undefined;
}

static itos(integer, minsize)
{
    let s = "" + integer;
    
    if(minsize)
    while(s.length < minsize)
    { s = "0" + s; }

    return s;
}

static remove_spaces(txt) 
{

    if (txt != ' ' && (txt.length > 0)) {
        var firstIsSpace = ((txt.charAt(0) == ' ') ? " " : ""); // If first character is a space, we keep it a space
        txt = firstIsSpace + txt.split(' ').join(''); // Remove space
    } else if (txt == '') {
        txt = ' ';
    }
    return txt;
}

static local_filename(filename_)
{
    let i = filename_.lastIndexOf('/');
    return (i==-1) ? filename_ : filename_.slice(i+1);
}

static strarray_includes(array_, value_)
{
    for(const v of array_)
    {
        if(v === value_) return true;
    }
    return false;
}

/**
 
    @brief                      Add '0' as a prefix until the value has at least the expected size
    @param {Integer} value_     Value to prefix
    @param {Integer} size_      Minimal size
    @return {String}            Return stringified value_ with '0' as a prefix

**/
static fixsize(value_, size_)
{
    let str = "" + value_;
    while(str.length < size_)
    { str = "0" + str; }

    return str;
}

static generate_uuid() 
{ 
    const bytes = new Uint8Array(16); 
    window.crypto.getRandomValues(bytes); 
    bytes[6] = (bytes[6] & 0x0f) | 0x40; 
    
    // Version 4 
    bytes[8] = (bytes[8] & 0x3f) | 0x80; 
    
    // Variant 10 
    
    const hex = Array.from(bytes).map(byte => byte.toString(16).padStart(2, '0')).join(''); 
    return `${hex.substr(0, 8)}-${hex.substr(8, 4)}-${hex.substr(12, 4)}-${hex.substr(16, 4)}-${hex.substr(20)}`; 
}

/************************************************************************************/    
/*                                                                                  */
/*             Load / Upload functions                                              */ 
/*                                                                                  */ 
/************************************************************************************/


/**
 
    @brief Copies a file from a source URL to a destination directory and filename.

    @param {string}     destinationDirectory_       - The destination directory where the file will be copied.
    @param {string}     destinationFilename_        - The destination filename of the copied file.
    @param {string}     sourceFilename_             - The source URL of the file to be copied.

    @returns {Promise} A promise that resolves with the result of the upload operation, or rejects with an error.
    
**/
static async copyfile(destinationDirectory_, destinationFilename_, sourceFilename_)
{
    let response = await fetch(sourceFilename_);
    if (!response.ok) 
    {
        console.error("copyfile error : Failed to load file " + sourceFilename_);
        return null;
    }
    let blob = await response.blob();
    return await Deid.upload(blob, destinationDirectory_, destinationFilename_); 
}

/**
 * 
 * Build the promise that will do the upload of the blob content into file path/filename 
 * 
 * @param {Blob} blob               File content
 * @param {string} path             Target directory
 * @param {string} filename         Filename with suffix
 * @returns {Promise}               Uploading task
 * 
 */
static async _uploader(blob, path, filename)
{
    return new Promise((resolve, reject) => 
    {
        const uploaderOperation = async (blob, path, filename) => 
        {
            const file = new File([blob], filename, { type: blob.type });
            //const result = await DirectoryPicker.uploadToPath(path, file);
            const result = foundry.applications.apps.FilePicker.upload("data", path, file, { }, { notify: false });
            return result;
        };

        uploaderOperation(blob, path, filename)
        .then((result) => { resolve(result.path); })
        .catch((error) => { console.log("error uploading file: ", error); reject(error); })
        ;
    });
}

/**
 * 
 * @param {Blob}   blob                 File content, with blob.type describing the file type                      
 * @param {string} targetDirectory      Target directory 
 * @param {string} baseFilename         Local filename without the file suffix 
 * @returns {??}   ??

**/
static async upload(blob, targetDirectory, baseFilename) 
{

    // prepare filenames
    let filename = baseFilename;
    let ext = blob.type
        .split("/")
        .pop()
        .split(/#|\?|&/)[0]
    ;

    if(blob.type == 'text/plain')
    { ext = 'txt'; }
    if(blob.type == 'application/javascript')
    { ext = 'txt'; }

    // uploading the file
    try 
    {
        var completeFilename = filename + "." + ext;
        let result = await Deid._uploader(blob, targetDirectory, completeFilename, {}, false);
        return result;
    } 
    catch (error) 
    {
        console.log("Image upload error", error);
        //ui.notifications.warn(`Image upload failed. Please check your ddb-importer upload folder setting. ${url}`);
        return null;
    }
}

static async load_included_files(json_)
{
    if(json_.includes == undefined)
    { return json_; }

    for(let file of json_.includes)
    {
        // Load the file content. We don't use promise because files are ordered
        // and we want to add items in the same order than files are listed
        let file_content = await Deid.FS.file2string(file);

        // Trim the file content to detect empty files.
        file_content = file_content.trim();

        if(file_content.length == 0)
        {   Deid.Log.error("Failed to retrieve content of file " + file);
            continue; 
        }

        let complement = JSON.parse(file_content);

        for (const key in complement) 
        {
            if (!(key in json_)) 
            { json_[key] = complement[key]; }
        }
    }

    return json_;
}

static async load_json_files(base_directory_, files_, callback_, options_ = {})
{
    // The default behavior is to include files
    let must_include_files = options_ ? options_.must_include_files : true;

    for( let f of files_)
    {
        let expected_filename = base_directory_ + '/' + f + ".json";

        Deid.Log.report("Loading file " + expected_filename);

        // Load the file content. We don't use promise because files are ordered
        // and we want to add items in the same order than files are listed
        let file_content = await Deid.FS.file2string(expected_filename);

        // Trim the file content to detect empty files.
        file_content = file_content.trim();

        if(file_content.length == 0)
        {   Deid.Log.error("Failed to retrieve content of file " + expected_filename);
            return; 
        }

        let first = file_content.at(0);

        if(first == '{')
        { 
            let json_object = JSON.parse(file_content);
            if(must_include_files)
            { json_object = await Deid.load_included_files(json_object); }
            callback_( { item : json_object, file: f}); 
        }
        else if(first == '[')
        {
            try
            {
                let items = JSON.parse(file_content);
                for( let item of items )
                { 
                    if(must_include_files)
                    { item = await Deid.load_included_files(item); }
                    callback_( { item: item, file: f} ); 
                }
                
            } catch(reason)
            {
                const err = new Error();
                let debuginfos = Deid.debug_json_parse_fail(file_content, err.stack);
                Deid.Log.error("Error reading " + expected_filename + " :\n" + reason + "\n\n" + debuginfos);
                throw reason;
            }
        }
        else
        {
            Deid.Log.error("Wrong json syntax for file " + expected_filename);
        }            

        if(options_.callback_file_loaded)
        {
            options_.callback_file_loaded(f);
        }
    }
}

/************************************************************************************/    
/*                                                                                  */
/*             System functions                                                     */ 
/*                                                                                  */ 
/************************************************************************************/

/**
 * 
 * @brief               Force a thread to wait
 * @param {int} ms      Milli seconds to wait 
 * @returns             A promise
 * 
 * To effectively sleep a thread, the function must be called with await
 *
 **/
static sleep(ms) 
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

/************************************************************************************/    
/*                                                                                  */
/*              Stack functions                                                     */ 
/*                                                                                  */ 
/************************************************************************************/

static debug_json_parse_fail(json_, reason_)
{
    if(reason_.stack)
    {
        const line = reason_.stack.split('\n')[0];
        const infos = line.split('in JSON at position ');
        if(infos.length == 2)
        {
            let index = parseInt(infos[1]);
            if (index < 40) index = 0;
            else index -= 40;
            return line + ' : "' + json_.slice(index, 80); 
        }
        return line;
    }

    return "";
}

}    
export class HelyxComment
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /// @brief      Comment text
    #comment          = null;

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }    

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    get comment()           { return this.#comment; }

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            case 'comment'    : this.#comment = value_; break; 

            default: throw "Unimplemented attribute '" + attribute_ + "' in HelyxComment";
        }
    }     

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined() { return true; }

    write(output_)
    {
        output_.inlined_attributes(this,  ['comment']);
    }      
}

// End of file

export class HelyxTextOptions 
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    ///@brief       If true, log value when applying text options
    #debug = false;

    /// @brief      If true, capitalize all words in the text. 
    /// @example "the quick brown fox" becomes "The Quick Brown Fox"
    #capitalize_all = false;
   
    /// @brief      If true, encapsulate with a <b> bold formatting
    #bold = false;

    /// @brief      If true, parse a text like A.1 into [A01]
    #sqbrackets = false;

    /// @brief      If true, remove '.' or ':' at the end of the text
    #nodot = false;

    /// @brief      If true, remove '.' or ':' at the beginning of the text
    #no_dot_begin = false; 

    /// @brief      If true, singularize the text
    #singularize = false;   

    /// @brief      If true, replace symbols by global glyphs. Is it still used ?
    #glyphs = false;

    /// @brief      If true, encapsulate with a <i> italic formatting
    #italic = false;

    /// @brief      If true, ignore font flags
    #no_font_flags = false;

    /// @brief      If true, pop the last character
    #pop_last_char = false;

    /// @brief      If true, align to the right
    #right = false;

    /// @brief      If true, remove spaces
    #nospace = false;

    /// @brief      If true, encapsulate with a pair of quote " "
    #quote = false;

    /// @brief      If true, transform all the text to upper case
    /// @example "the quick brown fox" becomes "THE QUICK BROWN FOX"
    #upper = false;

    /// @brief      If true, capitalize the first letter of the text
    /// @example "the quick brown fox" becomes "The quick brown fox"
    #capitalize_first = false;

    /// @brief      If true, remove parenthesis ( and ) 
    #no_parenthesis = false;

    /// @brief      If true, add a space in front of the text. Usefull ?
    /// @example "the quick brown fox" becomes " the quick brown fox"
    #spaced = false;

    /// @brief      If true, call the adventure fix symbol function
    #fix = false;

    /// @brief      If true, call text.trim()
    #trim_tabs = false;

    /// @brief      If true, remove numbers between parenthesis at the end of the text
    /// @example "brown fox(2)" becomes "brown fox"
    #remove_numbers = false;

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(flags_ = "")
    {
        this.set(flags_);
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    get capitalize_all()      { return this.#capitalize_all; }
    get bold()                { return this.#bold; }
    get sqbrackets()          { return this.#sqbrackets; }
    get nodot()               { return this.#nodot; }   
    get singularize()         { return this.#singularize; }
    get no_dot_begin()        { return this.#no_dot_begin; }
    get glyphs()              { return this.#glyphs; }
    get italic()              { return this.#italic; }
    get no_font_flags()       { return this.#no_font_flags; }
    get pop_last_char()       { return this.#pop_last_char; }
    get right()               { return this.#right; }
    get nospace()             { return this.#nospace; }
    get quote()               { return this.#quote; }
    get upper()               { return this.#upper; }
    get capitalize_first()    { return this.#capitalize_first; }
    get no_parenthesis()      { return this.#no_parenthesis; }
    get spaced()              { return this.#spaced; }
    get fix()                 { return this.#fix; }
    get trim_tabs()           { return this.#trim_tabs; }
    get remove_numbers()      { return this.#remove_numbers; }
    get debug()               { return this.#debug; }

     /**
     * 
     * @param {*} flags     A string with each character being a flag used to import a pdf section as html
     * @brief  set options object completed by values deduced from flags
     * 
     * 
     * Characters used in flags can be 
     *    a : capitalize all first letter of all words
     *    b : bold
     *    c : reformat name using square brackets
     *    d : remove dot at the end
     *    i : italic
     *    s : remove all spaces
     *    n : ignore fontflags
     *    r : span with align right
     *    u : upper case to all character
     *    t : capitalize first letter : lower case to all character except first letter of first word to uppercase
     *    w : Add a space between each block
     *    y : trim spaces
     *    z : remove numbers at the end : 'hyena (5)' => 'hyena'
     * 
     */   
    set(flags_)
    {
        this.#capitalize_all   |= (flags_.indexOf('a')!= -1);        
        this.#bold             |= (flags_.indexOf('b')!= -1);
        this.#sqbrackets       |= (flags_.indexOf('c')!= -1);
        this.#nodot            |= (flags_.indexOf('d')!= -1); 
        this.#singularize      |= (flags_.indexOf('e')!= -1);
        this.#no_dot_begin     |= (flags_.indexOf('f')!= -1);
        this.#glyphs           |= (flags_.indexOf('g')!= -1);
        this.#italic           |= (flags_.indexOf('i')!= -1);
        this.#no_font_flags    |= (flags_.indexOf('n')!= -1);
        this.#pop_last_char    |= (flags_.indexOf('p')!= -1);
        this.#right            |= (flags_.indexOf('r')!= -1);
        this.#nospace          |= (flags_.indexOf('s')!= -1);
        this.#quote            |= (flags_.indexOf('q')!= -1);
        this.#upper            |= (flags_.indexOf('u')!= -1);
        this.#capitalize_first |= (flags_.indexOf('t')!= -1);
        this.#no_parenthesis   |= (flags_.indexOf('v')!= -1);
        this.#spaced           |= (flags_.indexOf('w')!= -1);
        this.#fix              |= (flags_.indexOf('x')!= -1);
        this.#trim_tabs        |= (flags_.indexOf('y')!= -1);
        this.#remove_numbers   |= (flags_.indexOf('z')!= -1);

        this.#debug            |= (flags_.indexOf('D')!= -1);
    }

    tos()
    {
        let flags = "";
        if(this.#capitalize_all)    flags += "a";
        if(this.#bold)              flags += "b";   
        if(this.#sqbrackets)        flags += "c";
        if(this.#nodot)             flags += "d"; 
        if(this.#singularize)       flags += "e";
        if(this.#no_dot_begin)      flags += "f";
        if(this.#glyphs)            flags += "g";
        if(this.#italic)            flags += "i";
        if(this.#no_font_flags)     flags += "n";
        if(this.#pop_last_char)     flags += "p";
        if(this.#right)             flags += "r";
        if(this.#nospace)           flags += "s";
        if(this.#quote)             flags += "q";
        if(this.#upper)             flags += "u";
        if(this.#capitalize_first)  flags += "t";
        if(this.#no_parenthesis)    flags += "v";
        if(this.#spaced)            flags += "w";
        if(this.#fix)               flags += "x";
        if(this.#trim_tabs)         flags += "y";
        if(this.#remove_numbers)    flags += "z";
        if(this.#debug)             flags += "D";

        return flags;
    }

}    
export class HelyxPdfPosition
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /// @type {number}
    #page = -1; 

    /// @type {number}
    #index = -1;

    /// @type {number}
    #x = NaN;

    /// @type {number}*
    #y = NaN;

    /// @brief      Width of the rectangle
    #width = NaN;

    /// @brief      Height of the rectangle
    #height = NaN;

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Methods
    **/ /** @{ ******************************************************************/    

    is_xy() { return !isNaN(this.#x) && !isNaN(this.#y); } 

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    get page()   { return this.#page;  }
    get index()  { return this.#index; }
    get x()      { return this.#x; }
    get y()      { return this.#y; }
    get width()   { return this.#width;  }
    get height()  { return this.#height; }

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            case 'p': case 'page': this.#page = value_; break;
            case 'index'  : this.#index   = value_; break;
            case 'x' : this.#x = value_; break;
            case 'y' : this.#y = value_; break;
            case 'w' : case 'width': this.#width = value_; break;
            case 'h' : case 'height': this.#height = value_; break;
            default: throw "Unimplemented attribute '" + attribute_ + "' in HelyxPdfPosition";
        }
    }      

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined()    { return true; }

    write(output_)
    {
        let atts = ['page']; 
        if(this.#index >= 0) atts.push('index');
        if(this.is_xy()) atts.push('x', 'y');
        if(!isNaN(this.#width)) atts.push('width');
        if(!isNaN(this.#height)) atts.push('height');
        return output_.inlined_attributes(this,  atts);
    }   

}
export class HelyxFont
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /// @brief      Position of the font, current index
    #position      = null;

    /// @brief      Position of the font, page x y pdf position
    #src            = null;    

    /// @brief      Font flags
    #flags         = null;

    /// @brief     Font roles
    #roles          = null;

    /// @brief     Font glyphs map
    #glyphs          = null;

    /// @brief     Font index ?
    #index          = null;

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }    

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    get position()          { return this.#position; }
    get src()               { return this.#src; }
    get flags()             { return this.#flags; }
    get roles()             { return this.#roles; }
    get glyphs()            { return this.#glyphs; }
    get index()             { return this.#index; }

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            case 'src'    :
                if(value_ instanceof HelyxPdfPosition)
                { this.#src = value_; }
                else    
                { this.#src = Deid.build(HelyxPdfPosition, value_);  }
                break;                
            case 'position'    : this.#position = value_; break;
            case 'flags'       : this.#flags = value_; break; 
            case 'roles'       : this.#roles = value_; break; 
            case 'glyphs'      : this.#glyphs = value_; break; 
            case 'index'       : this.#index = value_; break;

            default: throw "Unimplemented attribute '" + attribute_ + "' in HelyxFont";
        }
    }     

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined() { return true; }

    write(output_)
    {
        output_.field('src',this.#src);
        output_.inlined_attributes(this,  [ 'position','flags', 'roles', 'glyphs', 'index']);
    }       
}
export class HelyxContent 
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /// @brief      Contents
    #contents       = [];

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        if(typeof(data_) === 'string' || data_ instanceof String)
        {

            let contents = HelyxContent.build_contents(data_);
            this.#contents = contents;
            return;
        }

        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }


    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/
    
    get contents      ()          { return this.#contents; }

    set(attribute_, value_)
    {
        switch(attribute_)
        {

            case 'contents' : this.#contents = HelyxContent.build_contents(value_); break;

    
            default: throw "Unimplemented attribute '" + attribute_ + "' in HelyxContent";
        }
    }   

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined() { return true; }

    write(output_)
    {
        throw "Unimplemented write in HelyxContent";
    }       

    tos()
    {
        let res = "";
        for(const content of this.#contents)
        {
            res += content instanceof HelyxContentInstruction ? content.tos() : content;
        }
        return res;
    }
    
    /** @} **/ /*****************************************************************/
    /** \name   Methods
    **/ /** @{ ******************************************************************/    


    /** @} **/ /*****************************************************************/
    /** \name   Static methods
    **/ /** @{ ******************************************************************/    

    static from_raw(value_)
    {
        let parts = value_.split(/(\{\{\{[\s\S]*?\}\}\}|\{\{[\s\S]*?\}\})/g);
        parts = parts.filter(part => part !== '');
        const contents = parts.map(part => {
            const content = new HelyxContentInstruction();
            content.parse(part);
            return content;
        });
        return contents;
    }

    static build_contents(value_)
    {
        if(Deid.is_string(value_)) 
        { return HelyxContent.from_raw(value_); }

        else if(Array.isArray(value_)) 
        { return value_.map(item => HelyxContentInstruction.build(item)); }

        else return [ new HelyxContentInstruction(value_) ];
    }

    static build(value_)
    {
        if(value_ instanceof HelyxContent) return value_;
        else
        {
            let contents = HelyxContent.build_contents(value_);
            return new HelyxContent({contents: contents});
        }
    }

}

export class HelyxContentInstruction
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /// @brief      Operation
    #op             = null;
    
    /// @brief      Flags
    #flags          = null;

    /// @brief      Position in the pdf (page + index or x/y + with + height)
    #src            = null;

    /// @brief      Raw content
    #raw            = null;

    /// @brief      Length 
    #length         = -1;

    /// @brief      From slice
    #from_slice      = -1;

    /// @brief      Slice length
    #slice_length    = -1;

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        if(typeof(data_) === 'string' || data_ instanceof String)
        {
            this.parse(data_);
            return;
        }

        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );

        if(this.#flags == undefined || this.#flags == null)
        { this.#flags = new HelyxTextOptions(); }
    }


    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/
    
    get op      ()          { return this.#op; }
    get flags   ()          { return this.#flags; }    
    get src    ()          { return this.#src; }   
    get position()          { return this.#src; }  
    get raw     ()          { return this.#raw; }

    get length  ()          { return this.#length; }

    get from_slice()        { return this.#from_slice; }
    get slice_length()     { return this.#slice_length; }
    
    set(attribute_, value_)
    {
        switch(attribute_)
        {

            case 'position' : case 'src': 
                if(value_ instanceof HelyxPdfPosition)
                { this.#src = value_; }
                else    
                { this.#src = Deid.build(HelyxPdfPosition, value_);  }
                break;
            case 'op':    this.#op = value_; break;
            case 'raw':   this.#raw = value_; break;
            case 'length' : this.#length = value_; break;

            case 'flags' : this.#flags = new HelyxTextOptions(value_)   ; break;

            case 'from_slice' : this.#from_slice = value_; break;
            case 'slice_length' : this.#slice_length = value_; break;
    
            default: throw "Unimplemented attribute '" + attribute_ + "' in HelyxContentInstruction";
        }
    }   

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined() { return true; }

    write(output_)
    {
        output_.inlined_attributes(this, ['op']);
        output_.field('src',this.#src);

        if(this.#flags)
        {
            let flags_str = this.#flags.tos();
            if(flags_str != "") 
            { output_.attribute('flags', flags_str); }
        }

        let attributes = [];
        if(this.#length > 0) attributes.push('length');
        if(this.#raw != null) attributes.push('raw');

        output_.inlined_attributes(this, attributes);
    }       

    tos()
    {
        if(this.#op == "raw") return this.#raw; 
        if(this.#op == "null") return "";
        let res = "{{{" + this.#op;
        switch(this.#op)
        {
            case 'xlf': case 'pxlf': case 'sbxlf':
                res += " " + this.#src.index + " " + this.#length + " '" + this.#flags.tos() +"'";
                break;
            case 'xf':
                res += " " + this.#src.index + " '" + this.#flags.tos() +"'";
                break;    
            case 'xl': case 'pxl':
                res += " " + this.#src.index + " " + this.#length;
                break;
            case 'xylf': case 'pxylf': case 'sbxylf':
                res += " " + this.#src.page + " " + this.#src.x + " " + this.#src.y + " " + this.#length + " '" + this.#flags.tos() +"'";
                break;  
            case 'xyl': case 'pxyl':
                res += " " + this.#src.page + " " + this.#src.x + " " + this.#src.y + " " + this.#length ;
                break;                      
            case 'slicexlf':
                res += " " + this.#src.index + " " + this.#length + " '" + this.#flags.tos() +"' " + this.#from_slice + " " + this.#slice_length;
                break;           
            case 'slicexylf':
                res += " " + this.#src.page + " " + this.#src.x + " " + this.#src.y + " " + this.#length + " '" + this.#flags.tos() +"' " + this.#from_slice + " " + this.#slice_length;
                break;    
            default:
                throw "Unimplemented content type '" + this.#op + "'";
        }
        res += "}}}";
        return res;
    }
    
    /** @} **/ /*****************************************************************/
    /** \name   Methods
    **/ /** @{ ******************************************************************/    

    is_handlebar(value_) 
    {
        return (
            (value_.startsWith('{{{') && value_.endsWith('}}}')) ||
            (value_.startsWith('{{') && value_.endsWith('}}'))
        );
    }   

    extract_handlebar_content(segment) 
    {
        if (segment.startsWith('{{{') && segment.endsWith('}}}')) {
            return segment.slice(3, -3); // remove {{{ et }}}
        }
        if (segment.startsWith('{{') && segment.endsWith('}}')) {
            return segment.slice(2, -2); // remove {{ et }}
        }
        return segment; // si ce n'est pas un handlebar
    }    

    parse(value_)
    {
        if(this.is_handlebar(value_) == false)
        {
            this.#op = "raw";
            this.#raw = value_;
            return;
        }

        value_ = this.extract_handlebar_content(value_);
        let components = value_.split(' ');
        if(components.length == 0)
        {
            this.#op = "null";
            return;
        }

        switch(components[0])
        {
            case 'xlf': case 'sbxlf':
            {
                if(components.length != 4)
                { throw "Invalid xlf handlebar format: " + value_; }

                this.#op = components[0];
                this.#src = new HelyxPdfPosition({index: parseInt(components[1])});
                this.#length = parseInt(components[2]);
                this.#flags = new HelyxTextOptions(components[3]);
                break;
            }
            case 'xl': case 'pxl':
            {
                if(components.length != 3)
                { throw "Invalid xl handlebar format: '" + value_ + "'"; }
                this.#op = components[0];
                this.#src = new HelyxPdfPosition({index: parseInt(components[1])});
                this.#length = parseInt(components[2]);
                break;
            }
            case 'xf' :
            {
                if(components.length != 3)  
                { throw "Invalid xf handlebar format: " + value_; }
                this.#op = "xf";
                this.#src = new HelyxPdfPosition({index: parseInt(components[1])});
                this.#length = 0;
                this.#flags = new HelyxTextOptions(components[2]);
                break;
            }
            case 'slicexlf' : 
            {
                if(components.length != 6)
                { throw "Invalid slicexlf handlebar format: " + value_; }   
                this.#op = "slicexlf"; 
                this.#src = new HelyxPdfPosition({index: parseInt(components[1])});
                this.#length = parseInt(components[2]);
                this.#flags = new HelyxTextOptions(components[3]);
                this.#from_slice = parseInt(components[4]);
                this.#slice_length = parseInt(components[5]);
                break;
            }
            case 'slicexylf':
            {

                if(components.length != 8)
                { throw "Invalid slicexylf handlebar format: " + value_; }
                this.#op = "slicexylf";
                this.set('src', { page: parseInt(components[1]), x: parseInt(components[2]), y: parseInt(components[3]) });
                this.#length = parseInt(components[4]);
                this.#flags = new HelyxTextOptions(components[5]);
                this.#from_slice = parseInt(components[6]);
                this.#slice_length = parseInt(components[7]);
                break;
            }
            case 'xyl': case 'pxyl':
            {
                if(components.length != 5)
                { throw "Invalid pxyl handlebar format: " + value_; }
                this.#op = components[0];
                this.set('src', { page: parseInt(components[1]), x: parseInt(components[2]), y: parseInt(components[3]) });
                this.#length = parseInt(components[4]);
                this.set('flags', components[5]);
                break;
            }
            case 'xyf':
            {
                if(components.length != 5)
                { throw "Invalid xyf handlebar format: " + value_; }
                this.#op = "xyf";
                this.set('src', { page: parseInt(components[1]), x: parseInt(components[2]), y: parseInt(components[3]) });
                this.#length = 1;
                this.set('flags', components[4]);
                break;
            }
            case 'xylf': case 'sbxylf':
            {
                if(components.length != 6)
                { throw "Invalid xylf handlebar format: " + value_; }
                this.#op = components[0];
                this.set('src', { page: parseInt(components[1]), x: parseInt(components[2]), y: parseInt(components[3]) });
                this.#length = parseInt(components[4]);
                this.set('flags', components[5]);
                break;
            }
            default:
            {
                throw "Unrecognized handlebar operation: " + value_;
            }
        }
    }

    /** @} **/ /*****************************************************************/
    /** \name   Static methods
    **/ /** @{ ******************************************************************/    

    static build(value_)
    {
        if(value_ instanceof HelyxContentInstruction  )
        { return value_; }  
        else
        { return new HelyxContentInstruction(value_); }
    }

}

export class HelyxRectangle
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/
    
    /// @brief      Left position of the rectangle
    #x = -1;

    /// @brief      Top position of the rectangle
    #y = -1;

    /// @brief      Width of the rectangle
    #width = -1;

    /// @brief      Height of the rectangle
    #height = -1;

 
    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    get x()  { return this.#x; }
    get y()  { return this.#y; }
    get width()   { return this.#width;  }
    get height()  { return this.#height; }

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            case 'x': this.#x = value_; break;
            case 'y': this.#y = value_; break;

            case 'w' : case 'width': this.#width = value_; break;
            case 'h' : case 'height': this.#height = value_; break;

            default: throw "Unimplemented attribute '" + attribute_ + "' in HelyxRectangle ";
        }
    }      

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined()    { return true; }

    write(output_)
    {
        return output_.inlined_attributes(this,  ['x', 'y', 'width', 'height']);
    }   

}   
  
export class HelyxSourceSystem
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /** 
     
        @brief      Game system if this source entry  
        
        Could be a game system abbreviation like 'pf1' or 'pf2e'.

        If the value is default, it means it's the same game system than the current world.

    **/
    #system  = "";

    /// @brief Type of the source. Supported values are 'compendium'
    #type = "";
    
    /// @brief      For source of type compendium, id key of the compendium
    #compendium = "";
    
    /// @brief     Name of the source to be searched in a compendium
    #name = "";

    /// @brief      Helyx reference
    #ref = null;

    /// @brief      Template type
    #template = null;

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    get system()     { return this.#system; }
    get type  ()     { return this.#type; }
    get template()   { return this.#template; }
    get compendium() { return this.#compendium; }
    get name()       { return this.#name; }
    get ref()        { return this.#ref; }


    set(attribute_, value_)
    {
        switch(attribute_)
        {
            case 'system': this.#system = value_; break;
            case 'type'  : this.#type   = value_; break;
            case 'template': this.#template = value_; break;
            case 'compendium' : this.#compendium = value_; break;
            case 'name' : this.#name = value_; break;
            case 'ref'  : this.#ref = value_; break;
            default: throw "Unimplemented attribute '" + attribute_ + "' in HelyxSourceSystem ";
        }
    }

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined()    { return true; }

    write(output_)
    {
        return output_.inlined_attributes(this,  [ 'name', 'type', 'template', 'compendium', 'ref']);
    }

}

// End of file

export class HelyxSources
{

    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /*

        \brief      An object with custom field member defined for each supported game system

        Example : { "pf1" : { "type" : "compendium", "name" : "Orc" } }

    */
    #entries = {};

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        this.#entries = {};
        Object.keys(data_).forEach
        (
            key_ => { this.#entries[key_] = new HelyxSourceSystem( data_[key_]); }
        );
        
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    entry(abbrev_) { return this.#entries[abbrev_]; }    

    set(attribute_, value_)
    {
        this.#entries[attribute_] = value_;
    }

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined() { return Object.keys(this.#entries).length <= 1; }

    write(output_)
    {
        Object.keys(this.#entries).forEach
        (
            key_ => { output_.field(key_, this.#entries[key_]);  }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   API
    **/ /** @{ ******************************************************************/

    current_source()
    {
        if(this.#entries.hasOwnProperty(game.system.id) == false)
        { 
            if(this.#entries.hasOwnProperty('default') == false)
            { throw Exception("Sources are missing a declaration for '" + game.system.id + "'"); }
            else { return this.#entries[ 'default' ]; }
        } 

        return this.#entries[ game.system.id ];
    }

}

export class HelyxLink
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /// @brief          Type of entity
    #type               = null;

    /// @brief          Source of the entity
    #sources             = null;
    
    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    get type()       { return this.#type; }
    get sources()    { return this.#sources; }

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            case 'type'     : this.#type = value_; break;
            case 'sources'  : this.#sources = Deid.build(HelyxSources, value_); break;

            default: throw "Unimplemented attribute '" + attribute_ + "' in HelyxSourceSystem ";
        }
    }

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined()    { return true; }

    write(output_)
    {
        output_.inlined_attributes(this,  ['type' ]);
        output_.field('sources', this.#sources);
    }

    /** @} **/ /*****************************************************************/
    /** \name   API
    **/ /** @{ ******************************************************************/    

    compendium(context_)
    {
        const source = this.sources.current_source();
        if(source.type == "compendium")
        { return context_.resolve_compendium( source.compendium ); }

        return null;
    }

    /**
    
        @brief                          Resolve a link using the import context and return a foundry entity (from compendiums)
        @param {HelyxContext} context_  Context of the import
        @retval null                    If failed to resolve the link    
        @return                         Object { source: HelyxSource, compendium_key: String, entity: FoundryEntity } or null

    **/
    resolve(context_)
    { 
        let current_source = this.sources.current_source();
        if(current_source.type == "compendium")
        {
            let key = context_.resolve_compendium( current_source.compendium );
            if(key)
            {
                return { source: current_source, compendium_key : key, entity : context_.compendium_entity_from_name(key, current_source.name) };
            } 

            return null;
        }
        if(current_source.type == "world")
        {
            let entity = null;
            switch(this.type)
            {
                    case 'Item' : entity = context_.item_by_name(game.items, current_source); break;
                    case 'Actor':  entity = context_.item_by_name(game.actors, current_source); break;
                    case 'Scene' : entity = context_.item_by_name(game.scenes, current_source); break;
                    case 'JournalEntry' : entity = context_.item_by_name(game.journal, current_source); break;
                    default: break;
            }
            return { source: current_source, entity : entity };
        }

        Deid.Log.error('Unresolved Link object : ' + JSON.stringify(this));
        return null;        
    }

    tolink(context_, displayed_name_)
    {
        let options = this.resolve(context_);

        if((displayed_name_ == null) || (displayed_name_ == ""))
        {
            if(options.entity)
            { displayed_name_ = options.entity.name; }
        }

        if((options.source.type == "compendium") && (options.entity))
        {
            let result = '@Compendium' + '['+  options.compendium_key + '.' + options.entity._id + ']';
            if(displayed_name_) { result += '{' + displayed_name_ + '}'; }
            return result;
        }
        if(options.source.type == 'world')
        {
            if(options.entity)
            {
                let result = '@UUID[' + this.type + '.' + options.entity._id + ']';
                if(displayed_name_) { result += '{' + displayed_name_ + '}'; }
                return result;
            }
            else
            {
                return Deid.compile("{{{lnk 'actor' '" + options.source.ref + "' }}}");
            }
        }

        return 'ERROR';
        
    }

}    

// End of file

export class HelyxRemplacement
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /// @brief          Text replaced
    #replaced           = null;

    /// @brief          Type of replacement (link, text)
    #type               = null;
    
    /// @brief          If type == link, describe the link
    #link               = null;

    /// @brief          If type == check, describe the check
    #check              = null;

    /// @brief          Additional content displayed between (...)
    #notes              = null;

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    get replaced()   { return this.#replaced; }
    get type()       { return this.#type; }
    get link()       { return this.#link; }
    get check()      { return this.#check; }
    get notes()      { return this.#notes; }

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            case 'replaced'     : this.#replaced = value_; break;
            case 'type'         : this.#type = value_; break;
            case 'link'         : this.#link = Deid.build(HelyxLink, value_); break;
            case 'check'        : this.#check = Deid.build(HelyxCheck, value_); break;
            case 'notes'        : this.#notes = value_; break;

            default: throw "Unimplemented attribute '" + attribute_ + "' in HelyxSourceSystem ";
        }
    }

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined()    { return true; }

    write(output_)
    {
        output_.inlined_attributes(this,  ['type', 'compendium', 'name', 'replaced', 'notes']);

        if(this.type == 'link')
        { output_.field('link', this.#link); }
    }

    /** @} **/ /*****************************************************************/
    /** \name   API
    **/ /** @{ ******************************************************************/    

    replacement(context_, displayed_name_)
    {
        switch(this.#type)
        {
            case 'link' : return this.#link ? this.#link.tolink(context_, displayed_name_) : displayed_name_;
            case 'check' : return this.#check ? this.#check.tocheck(context_, displayed_name_)  : displayed_name_;
            default: return displayed_name_; 
        }
    }

}    
export class HelyxHeaderConditions
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /// @brief          If defined and true, the user must have accepted midjourney content to import this item
    #accept_midjourney_content = null;

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    get accept_midjourney_content()        { return this.#accept_midjourney_content; }

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            case 'accept_midjourney_content': this.#accept_midjourney_content = value_; break;
            default: throw "Unimplemented attribute '" + attribute_ + "' in HelyxHeaderConditions ";
        }
    }     

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined()    { return true; }

    write(output_)
    {
        return output_.inlined_attributes(this,  ['accept_midjourney_content']);
    }    
}
export class HelyxHeader
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /// @brief          Idname of the entity
    #idname             = null;

    /// @brief          Type of entity : actor, item, scene
    #type               = null;

    /// @brief          Subtype, like weapon or treasure for an item
    #subtype            = null;    
    
    /// @brief          Describes how to generate the datas for each game system
    #sources            = null;

    /// @brief          ID of the folder to where the entity is imported
    #target             = null;

    /// @brief          Conditions to import this entity
    #conditions         = null;

    /// @brief          Debug description - must not be imported
    #notes              = null; 

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    get idname()     { return this.#idname; }
    get type  ()     { return this.#type; }
    get subtype()    { return this.#subtype; }
    get sources()    { return this.#sources; }
    get target()     { return this.#target; }
    get conditions() { return this.#conditions; }
    get notes()      { return this.#notes; }

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            case 'idname': this.#idname = value_; break;
            case 'type'  : this.#type   = value_; break;
            case 'subtype'  : this.#subtype   = value_; break;
            case 'sources' : this.#sources = Deid.build(HelyxSources, value_); break;
            case 'target' : this.#target = value_; break;
            case 'conditions' : this.#conditions = Deid.build(HelyxHeaderConditions, value_); break;
            case 'notes' : this.#notes = value_; break;
            default: throw "Unimplemented attribute '" + attribute_ + "' in HelyxHeader ";
        }
    }    

    source(game_system_)
    { return this.#sources ? this.#sources.entry(game_system_) : null; }

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined() { return (this.#sources == null); }

    write(output_)
    {
        output_.inlined_attributes(this,  ['idname', 'type', 'subtype', 'target', 'notes']);
        output_.field('sources',this.#sources);
    }  
}    

// End of file

export class HelyxCheck
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /// @type {string}
    #type = null; 

    /// @type {number}
    #dc = null;

    /// @type {string}
    #show_dc = null;

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    get type()    { return this.#type; }
    get dc()      { return this.#dc; }
    get show_dc() { return this.#show_dc; }

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            case 'type'      : this.#type = value_; break;
            case 'dc'        : this.#dc = value_; break;
            case 'show_dc'   : this.#show_dc = value_; break;

            default: throw "Unimplemented attribute '" + attribute_ + "' in HelyxSourceSystem ";
        }
    }

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined()    { return true; }

    write(output_)
    {
        return output_.inlined_attributes(this,  ['type', 'dc', 'show_dc']);
    }

    /** @} **/ /*****************************************************************/
    /** \name   API
    **/ /** @{ ******************************************************************/    

    tocheck(context_, displayed_name_)
    { 
        let result = '@Check[type:' + this.type
            + ( this.dc ? ( '|dc:' + this.dc ) : '' )
            + ( this.show_dc ? ( '|showDC:' + this.show_dc ) : '' )
            + ']'
            + (displayed_name_ ? ( '{' + displayed_name_ + '}') : '')
        ;
            
        return result;
    }
}    

export class HelyxImageTransformation
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /// @brief          Flip transformation
    #flip = null;

    /// @brief          Rotation transformation
    #rotation = null;

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    get flip()        { return this.#flip; }
    get rotation  ()     { return this.#rotation; }

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            case 'flip': this.#flip = value_; break;
            case 'rotation'  : this.#rotation   = value_; break;
            default: throw "Unimplemented attribute '" + attribute_ + "' in HelyxImageTransformation ";
        }
    }     

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined()    { return true; }

    write(output_)
    {
        return output_.inlined_attributes(this,  ['flip', 'rotation']);
    }  
    
      /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined() { return true ; }

    write(output_)
    {
        output_.inlined_attributes(this,  ['flip','rotation']);
    } 
}
export class HelyxImageReference
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /// @brief          Path to the image source
    #src = null;

    /// @brief          Type of the source : MJ or not defined
    #origin = null;

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    get src()        { return this.#src; }
    get origin  ()     { return this.#origin; }

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            case 'src': this.#src = value_; break;
            case 'origin'  : this.#origin   = value_; break;
            default: throw "Unimplemented attribute '" + attribute_ + "' in HelyxImageReference ";
        }
    }     

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined()    { return true; }

    write(output_)
    {
        return output_.inlined_attributes(this,  ['src', 'origin']);
    }    
}
export class HelyxToken
{

    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /// @brief      Position in the source image of the token area
    #from = null;

    /// @brief      Idname of the token
    #idname = null;

    /// @brief      Target directory
    #target = null;

    /// @brief      Model to use to produce the token
    #model = null;

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    get from()  { return this.#from;  }
    get idname()  { return this.#idname; }
    get target()  { return this.#target; }
    get model()   { return this.#model; }

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            case 'from'    : this.#from =  Deid.build(HelyxRectangle, value_); break;
            case 'idname'  : this.#idname   = value_; break;
            case 'target'  : this.#target = value_; break;
            case 'model'   : this.#model = value_; break;

            default: throw "Unimplemented attribute '" + attribute_ + "' in HelyxToken ";
        }
    }         

}    
export class HelyxTokens
{

    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /*

        \brief  Array of tokens

    */
    #entries = [];

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        this.#entries = {};
        Object.keys(data_).forEach
        (
            key_ => { this.#entries.push( new HelyxSourceSystem( data_[key_])); }
        );
        
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    get entries() { return this.#entries; }    

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined() { return this.#entries.length <= 1; }

    

    write(output_)
    {
        Object.keys(this.#entries).forEach
        (
            key_ => { output_.field(key_, this.#entries[key_]);  }
        );
    }
  
}

export class HelyxImage
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /// @brief              In the case the image has to be imported from the pdf, it describes its position inside
    #pdf = null;

    /// @brief              Idname of the token
    #idname = null;

    /// @brief              Target directory
    #target = null;

    /// @brief              Image transformation
    #transformation = null;

    /// @brief              Array of tokens to be built from this image
    #tokens = [];

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    get pdf     ()          { return this.#pdf; }
    get idname  ()          { return this.#idname; }    
    get target  ()          { return this.#target; }   
    get tokens  ()          { return this.#tokens; }   
    get transformation()    { return this.#transformation; }

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            case 'pdf': this.#pdf = Deid.build(HelyxPdfPosition, value_); break;
            case 'idname': this.#idname = value_; break;

            case 'target' : this.target = value_; break;
            case 'tokens' : this.#tokens =  Deid.build_array(HelyxToken, value_); break;
            case 'transformation' : this.#transformation = Deid.build(HelyxImageTransformation, value_); break;

            default: throw "Unimplemented attribute '" + attribute_ + "' in HelyxImage ";
        }
    }     
    
    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined() { return (!this.#tokens) || (this.#tokens.length == 0) ; }

    write(output_)
    {
        output_.inlined_attributes(this,  ['pdf','idname','target','transformation']);
        output_.field('tokens',this.#tokens);
    } 
}

// End of file

export class HelyxEntity 
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /// @brief      Helyx header. Describe type of entity and how to retrieve it
    #helyx          = null;
    
    /// @brief      Redefinition of the name
    #name           = null;

    /// @brief      Redefinition of the artwork image
    #img            = null;

    /// @brief      Redefinition of the token image
    #token          = null;

    /// @brief      Redefinition of the description
    #description    = null;

    /// @brief      Redefinition of the rarity
    #rarity         = null;

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    get helyx()      { return this.#helyx; }
    get name  ()     { return this.#name; }
    get img()        { return this.#img; }
    get token()      { return this.#token; }
    get description() { return this.#description; }
    get rarity()     { return this.#rarity; }

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            case 'helyx': this.#helyx = Deid.build(HelyxHeader, value_ ); break;
            case 'img' :  this.#img = Deid.build(HelyxImageReference, value_ ); break;
            case 'token' : this.#token = Deid.build(HelyxImageReference, value_ ); break;
            case 'name'  : this.#name   = HelyxContent.build(value_); break;
            case 'description' : this.#description = HelyxContent.build(value_); break;
            case 'rarity' : this.#rarity = value_; break;

            default: throw "Unimplemented attribute '" + attribute_ + "' in HelyxEntity";
        }
    }

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined() { return false; }

    write(output_)
    {
        output_.field('helyx',this.#helyx);
        output_.any('name',this.#name);
        output_.any('description',this.#description);
        output_.field('img', this.#img);
        output_.field('token', this.#token);
        return output_.inlined_attributes(this,  ['rarity']);
    }      
}
export class HelyxJournalBlock 
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /// @brief          Block type
    #type = "undefined";

    /// @replacements
    #replaces = null;

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        // type may be defined in data_
        if(data_.type)
        { this.#type = data_.type; }

        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    get type()      { return this.#type; }
    get replaces()  { return this.#replaces; }
    get is_block()  { return true; }

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            // Type must be set by the constructor
            case 'type': 
            {
                if (this.type != value_)
                { throw "Wrong type '" + value_ + "' in HelyxJournalBlock"; }
                return;
            }
            case 'replaces' : this.#replaces = Deid.build_array(HelyxRemplacement, value_); break;

            default: throw "Unimplemented attribute '" + attribute_ + "' in HelyxJournalBlock";
        }
    }

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined() { return (this.#replaces == null) || (this.#replaces.length == 0); }

    write(output_)
    {
        
    }      
}

// End of file

export class HelyxJournalBlockEntitySheet  extends HelyxJournalBlock
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /// @brief      Helyx idname of the entity. Can be an array of multiple entity idnames
    #ref            = null;

    /// @brief      Direct link to a compendium entity
    #link           = null;

    /// @brief      Name to use, in the case there is no foundry entity
    #name           = null;

    /// @brief      Code to produce the stat block
    #statblock      = null;

    /// @brief      Code to produce the challenge rating
    #cr             = null;

    /// @brief      Amount, if != 1
    #amount         = null;

    /// @brief      Tags / Flags for pathfinder 2 like system
    #tags           = null;

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        super({type: data_.type ?? "entity_sheet"});

        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    get ref()         { return this.#ref; }
    get link()        { return this.#link; }
    get name()        { return this.#name; }  
    get statblock()   { return this.#statblock; }
    get cr()          { return this.#cr; }
    get amount()      { return this.#amount; }
    get tags()        { return this.#tags; }

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            case 'ref'         : this.#ref     = value_; break;
            case 'link'        : this.#link = Deid.build(HelyxLink, value_); break;
            case 'name'        : this.#name       = value_; break;
            case 'statblock'   : this.#statblock  = value_; break;
            case 'cr'          : this.#cr         = value_; break;
            case 'amount'      : this.#amount     = value_; break;
            case 'tags'        : this.#tags       = value_; break;
            default            : super.set(attribute_, value_); break;
        }
    }

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined() { return false; }

    write(output_)
    {
        output_.inlined_attributes(this,  ['type','ref','name','amount','cr']);
        output_.field('link', this.link);
        output_.inlined_attributes(this, ['tags']);
        output_.attributes(this,  ['statblock']);
    }      
}

// End of file

export class HelyxJournalBlockActivity  extends HelyxJournalBlockEntitySheet
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        super({type: "activity" });

        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            default              : super.set(attribute_, value_); break;
        }
    }

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined() { return false; }

    write(output_)
    {
        super.write(output_);
    }      
}

// End of file

export class HelyxJournalBlockBackground  extends HelyxJournalBlockEntitySheet
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        super({type: "background" });

        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            default              : super.set(attribute_, value_); break;
        }
    }

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined() { return false; }

    write(output_)
    {
        super.write(output_);
    }      
}

// End of file
export class HelyxJournalBlockCreature  extends HelyxJournalBlockEntitySheet
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        super({type: "creature" });

        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            default              : super.set(attribute_, value_); break;
        }
    }

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined() { return false; }

    write(output_)
    {
        super.write(output_);
    }      
}

// End of file

export class HelyxJournalBlockDisease  extends HelyxJournalBlockEntitySheet
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        super({type: "disease" });

        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            default              : super.set(attribute_, value_); break;
        }
    }

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined() { return false; }

    write(output_)
    {
        super.write(output_);
    }      
}

// End of file
export class HelyxJournalBlockEquipment  extends HelyxJournalBlockEntitySheet
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        super({type: "equipment" });

        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            default              : super.set(attribute_, value_); break;
        }
    }

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined() { return false; }

    write(output_)
    {
        super.write(output_);
    }      
}

// End of file
export class HelyxJournalBlockFeat  extends HelyxJournalBlockEntitySheet
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        super({type: "feat" });

        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            default              : super.set(attribute_, value_); break;
        }
    }

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined() { return false; }

    write(output_)
    {
        super.write(output_);
    }      
}

// End of file

export class HelyxJournalBlockHazard  extends HelyxJournalBlockEntitySheet
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        super({type: "hazard" });

        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            default              : super.set(attribute_, value_); break;
        }
    }

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined() { return false; }

    write(output_)
    {
        super.write(output_);
    }           
}

// End of file

export class HelyxJournalBlockHTitle  extends HelyxJournalBlock
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /// @brief          Code to generate the page title
    #title              = "";

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        super({type: "h1"});

        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    get title()      { return this.#title; }

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            case 'title'    : this.#title   = value_; break;
            default         : super.set(attribute_, value_); break;
        }
    }

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined() { return true; }

    write(output_)
    {
        output_.inlined_attributes(this,  ['type','title']);
    }        
}

// End of file

export class HelyxJournalBlockInventory  extends HelyxJournalBlock
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /// @brief          Array of items
    #items              = null;

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        super({type: "inventory"});

        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    get items()      { return this.#items; }

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            case 'items'    : this.#items   = Deid.build_array(HelyxRemplacement, value_); break;
            default         : super.set(attribute_, value_); break;
        }
    }    

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined() { return true; }

    write(output_)
    {
        output_.inlined_attributes(this,  ['type']);
        output_.array('items', this.#items, { inlined: false, aligned: true, backtab: false });
    }         
}

export class HelyxJournalBlockJournalTitle  extends HelyxJournalBlock
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /// @brief          Code to generate the page title
    #title              = "";

    /// @brief          Code to generate the page Challenge Rating
    #cr                 = null;

    /// @brief          XP value of the room
    #xp                 = null;

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        super({type: "journal-title"});

        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    get title()      { return this.#title; }
    get cr()         { return this.#cr; }
    get xp()         { return this.#xp; }

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            case 'title'    : this.#title   = value_; break;
            case 'cr'       : this.#cr      = value_; break;
            case 'xp'       : this.#xp      = value_; break;
            default         : super.set(attribute_, value_); break;
        }
    }

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined() { return true; }

    write(output_)
    {
        output_.inlined_attributes(this,  ['type','title','cr', 'xp']);
    }      
}

// End of file

export class HelyxJournalBlockRaw  extends HelyxJournalBlock
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /// @brief          Code to generate the html content
    #content         = [];

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        super({type: data_.type ?? "raw" });

        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    get content()      { return this.#content; }

    get total_length()
    {
        if(this.#content == null) return 0;

        let res = 0;
        for(const p of this.#content) res += p.length;
        return res;
    }

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            case 'content'       : this.#content   = value_; break;
            default              : super.set(attribute_, value_); break;
        }
    }

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined() 
    { 
        const tlen = this.total_length;
        return (super.inlined()) && (tlen < 120); 
    }

    write(output_)
    {
        if(this.inlined())
        {  
            output_.inlined_attributes(this,  ['type','content']); 
        }
        else
        { 
            output_.attributes(this,  ['type','content']); 
        }        
    }      
}

// End of file

export class HelyxJournalBlockSection  extends HelyxJournalBlock
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /// @brief          Code to generate the section title
    #title              = "";

    /// @brief          Type of the section
    #section_type       = "";

    /// @brief          Children blocks
    #blocks             = [];

    /// @brief          Custom image
    #img                = null;

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        super({type: "section"});

        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    get title()      { return this.#title; }
    get section()    { return this.#section_type; }
    get blocks()     { return this.#blocks; }
    get img()        { return this.#img; }

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            case 'title'    : this.#title   = value_; break;
            case 'section'  : this.#section_type = value_; break;
            case 'blocks'   : this.#blocks = Deid.build_dynamic_array(HelyxJournalBlockFactory.class_from_type, value_); break;
            case 'block'    : this.#blocks = Deid.build_dynamic_array(HelyxJournalBlockFactory.class_from_type, [ value_]); break;
            case 'img'      : this.#img = Deid.build(HelyxImageReference, value_ ); break;

            default              : super.set(attribute_, value_); break;
        }
    }

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined() { return false; }

    write(output_)
    {
        output_.inlined_attributes(this,  ['type','section','title']);
        output_.field('img', this.img);

        let are_blocks_inlined = ( this.#blocks.length == 1) && (this.#blocks[0].inlined);
        let is_aligned = are_blocks_inlined ? false : true;
        output_.array('blocks', this.#blocks, { inlined: are_blocks_inlined, aligned: is_aligned, backtab: false });

    }      
}

// End of file

export class HelyxJournalBlockSettlement  extends HelyxJournalBlockEntitySheet
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        super({type: "settlement" });

        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            default              : super.set(attribute_, value_); break;
        }
    }

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined() { return false; }

    write(output_)
    {
        super.write(output_);
    }      
}

// End of file
export class HelyxJournalBlockSpell  extends HelyxJournalBlockEntitySheet
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        super({type: "spell" });

        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            default              : super.set(attribute_, value_); break;
        }
    }

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined() { return false; }

    write(output_)
    {

    }      
}

// End of file

export class HelyxJournalBlockStatBlock  extends HelyxJournalBlock
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /// @brief          Code to generate the paragraphs
    #statblock         = [];

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        super({type: "statblock" });

        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    get statblock()      { return this.#statblock; }

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            case 'statblock'     : this.#statblock   = value_; break;
            default              : super.set(attribute_, value_); break;
        }
    }

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined() { return (super.inlined()) && (this.#statblock.length < 4); }

    write(output_)
    {
        if(this.inlined())
            {  
                output_.inlined_attributes(this,  ['type','statblock']); 
            }
            else
            { 
                output_.attributes(this,  ['type','statblock']); 
            }  
    }      
}

// End of file

export class HelyxJournalBlockTable  extends HelyxJournalBlock
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /// @brief          Number of columns
    #columns            = null;

    /// @brief          For each column, code to produce the header text
    #headers            = [];

    /// @brief          For each lines, content of each columns
    #lines              = [];

    /// @brief          Title of the table
    #title              = null;

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        super({type: "table"});

        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    get columns()      { return this.#columns; }
    get headers()      { return this.#headers; }
    get lines()        { return this.#lines; } 
    get title()        { return this.#title; } 

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            case 'columns'    : this.#columns   = value_; break;
            case 'headers'    : this.#headers   = value_; break;
            case 'lines'      : this.#lines     = value_; break;
            case 'title'      : this.#title     = value_; break;
            default           : super.set(attribute_, value_); break;
        }
    }

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined() { return false; }

    write(output_)
    {
        output_.inlined_attributes(this,  ['type','columns']); 
        output_.attributes(this,  ['headers','lines']); 
    }      
}

// End of file

export class HelyxJournalBlockText  extends HelyxJournalBlock
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /// @brief          Code to generate the paragraphs
    #paragraphs         = [];

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        super({type: data_.type ?? "text" });

        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    get paragraphs()      { return this.#paragraphs; }

    get total_length()
    {
        if(this.#paragraphs == null) return 0;

        let res = 0;
        for(const p of this.#paragraphs) res += p.tos().length;
        return res;
    }

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            case 'paragraphs'    : this.#paragraphs   = value_; break;
            default              : super.set(attribute_, value_); break;
        }
    }

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined() 
    { 
        const tlen = this.total_length;
        return (super.inlined()) && (tlen < 120); 
    }

    write(output_)
    {
        if(this.inlined())
        {  
            output_.inlined_attributes(this,  ['type','paragraphs']); 
        }
        else
        { 
            output_.attributes(this,  ['type','paragraphs']); 
        }        
    }      
}

// End of file

export class HelyxJournalBlockReadSection  extends HelyxJournalBlockText
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        super({type: "read-section"});

        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            default              : super.set(attribute_, value_); break;
        }
    }

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined() { return super.inlined(); }

    write(output_)
    {
        super.write(output_);
    }      
}

// End of file

export class HelyxJournalBlockFactory 
{

    static class_from_type(type_)
    {
        switch(type_)
        {
            case 'journal-title'    : return HelyxJournalBlockJournalTitle;

            case 'h1'               : return HelyxJournalBlockHTitle;

            case 'text'             : return HelyxJournalBlockText;
            case 'read-section'     : return HelyxJournalBlockReadSection;

            case 'statblock'        : return HelyxJournalBlockStatBlock;

            case 'section'          : return HelyxJournalBlockSection;

            case 'raw'              : return HelyxJournalBlockRaw;
            case 'table'            : return HelyxJournalBlockTable;

            case 'creature'         : return HelyxJournalBlockCreature;
            case 'disease'          : return HelyxJournalBlockDisease;
            case 'feat'             : return HelyxJournalBlockFeat;
            case 'hazard'           : return HelyxJournalBlockHazard;
            case 'settlement'       : return HelyxJournalBlockSettlement;
            case 'equipment'        : return HelyxJournalBlockEquipment;
            case 'spell'            : return HelyxJournalBlockSpell;
            case 'activity'         : return HelyxJournalBlockActivity;
            case 'background'       : return HelyxJournalBlockBackground
 
            case 'inventory'        : return HelyxJournalBlockInventory;



            default : throw "Unimplemented block class '" + type_ + "'";
        }
    }
}    

// End of file

export class HelyxSceneBackground
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /// @brief      Source image
    #src            = null;

    /// @brief      Scale X
    #scale_x        = 1;

    /// @brief      Scale Y
    #scale_y        = 1;

    /// @brief      Offset X
    #offset_x       = 0;

    /// @brief      Offset Y
    #offset_y       = 0;

    /// @brief      Rotation
    #rotation       = 0;

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {

        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    get src()           { return this.#src;}
    get scale_x()       { return this.#scale_x; }
    get scale_y()       { return this.#scale_y; }
    get offset_x()      { return this.#offset_x; }
    get offset_y()      { return this.#offset_y; }
    get rotation()      { return this.#rotation; }
    
    set(attribute_, value_)
    {
        switch(attribute_)
        {
            case 'src'         : this.#src = value_; break;
            case 'scale_x'     : this.#scale_x = value_; break;
            case 'scale_y'     : this.#scale_y = value_; break;
            case 'offset_x'    : this.#offset_x = value_; break;
            case 'offset_y'    : this.#offset_y = value_; break;
            case 'rotation'    : this.#rotation = value_; break;

            default: throw "Unimplemented attribute '" + attribute_ + "' in HelyxSceneBackground";
        }
    }

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined() { return true; }

    write(output_)
    {
        return output_.inlined_attributes(this,  ['src','scale_x','scale_y','offset_x','offset_y','rotation']);
    } 

    /** @} **/ /*****************************************************************/
    /** \name   To Foundry Object
    **/ /** @{ ******************************************************************/    

    model(context_)
    { 
        let result = 
        {
            "src": this.#src,
            "scaleX": this.scale_x,
            "scaleY": this.scale_y,
            "offsetX": this.offset_x,
            "offsetY": this.offset_y,
            "rotation": this.rotation
        };
        return result;
    }
}
export class HelyxSceneGrid
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /// @brief      Size of a case
    #size           = 100;

    /// @brief      Grid type
    #type           = 1;

    /// @brief      Grid color
    #color          = "#000000";

    /// @brief      Grid alpha
    #alpha          = 1;

    /// @brief      Distance of a case
    #distance       = 5;

    /// @brief      Unit of distance
    #units          = "ft";

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {

        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    get size()          { return this.#size;}
    get type()          { return this.#type; }
    get color()         { return this.#color; }
    get alpha()         { return this.#alpha; }
    get distance()      { return this.#distance; }
    get units()         { return this.#units; }
    
    set(attribute_, value_)
    {
        switch(attribute_)
        {
            case 'size'         : this.#size = value_; break;
            case 'type'         : this.#type = value_; break;
            case 'color'        : this.#color = value_; break;
            case 'alpha'        : this.#alpha = value_; break;
            case 'distance'     : this.#distance = value_; break;
            case 'units'        : this.#units = value_; break;

            default: throw "Unimplemented attribute '" + attribute_ + "' in HelyxSceneGrid";
        }
    }

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined() { return true; }

    write(output_)
    {
        return output_.inlined_attributes(this,  ['size','type','color','alpha','distance','units']);
    } 

    /** @} **/ /*****************************************************************/
    /** \name   To Foundry Object
    **/ /** @{ ******************************************************************/    

    model(context_)
    { 
        let result = 
        {
            "size": this.#size,
            "type": this.type,
            "color": this.color,
            "alpha": this.alpha,
            "distance": this.distance,
            "units": this.units
        };
        return result;
    }
}
export class HelyxSceneInitial
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /// @brief          X Initial Position of the camera scene
    #x                  = null;


    /// @brief          Y iniial position of the camera scene
    #y                  = null;

    /// @brief          Scale initial position of the camera
    #scale              = null;

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {

        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    get scale()         { return this.#scale;}
    get x()             { return this.#x; }
    get y()             { return this.#y; }
    
    set(attribute_, value_)
    {
        switch(attribute_)
        {
            case 'scale'          : this.#scale = value_; break;
            case 'x'            : this.#x = value_; break;
            case 'y'            : this.#y = value_; break;

            default: throw "Unimplemented attribute '" + attribute_ + "' in HelyxSceneInitial";
        }
    }

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined() { return true; }

    write(output_)
    {
        return output_.inlined_attributes(this,  ['x','y','scale']);
    } 

    /** @} **/ /*****************************************************************/
    /** \name   To Foundry Object
    **/ /** @{ ******************************************************************/    

    model(context_)
    { 
        let result = 
        {
            x  : this.x,
            y : this.y, 
            scale : this.scale

        };
        return result;
    }
}
export class HelyxSceneNote
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /// @brief      Helyx idname of the linked journal entry - may be null
    #journal_entry = null;

    /// @brief      Note text displayed on the scene
    #text           = "";

    /// @brief      X coordonates on the scene
    #x              = null;

    /// @brief      Y coordonates on the scene
    #y              = null;

    /// @brief      Icon. Default value is 'book'
    #icon           = "icons/svg/book.svg";

    /// @brief      Icon size
    #icon_size      = 40; 

    /// @brief      Font family
    #font           = "Signika";

    /// @brief      Font size
    #font_size      = 40;

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {

        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    get journal_entry()     { return this.#journal_entry; }
    get text()              { return this.#text; }

    get x()                 { return this.#x; }
    get y()                 { return this.#y; }

    get icon()              { return this.#icon; }
    get icon_size()         { return this.#icon_size; }
    get font()              { return this.#font; }
    get font_size()         { return this.#font_size; }
    

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            case 'journal_entry' : this.#journal_entry = value_ ; break; 
            case 'text'          : this.#text = value_; break;
            case 'x'             : this.#x = value_ ; break; 
            case 'y'             : this.#y = value_ ; break; 
            case 'icon'          : this.#icon = value_; break;
            case 'icon_size'     : this.#icon_size = value_; break;
            case 'font'          : this.#font = value_; break;
            case 'font_size'     : this.#font_size = value_; break;

            default: throw "Unimplemented attribute '" + attribute_ + "' in HelyxSceneNote";
        }
    }

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined() { return true; }

    write(output_)
    {
        return output_.inlined_attributes(this,  ['journal_entry',  'text', 'x', 'y', 'icon', 'icon_size', 'font', 'font_size']);
    } 

    /** @} **/ /*****************************************************************/
    /** \name   To Foundry Object
    **/ /** @{ ******************************************************************/    

    model(context_)
    { 

        let entry_id = "";
        let page_id  = "";

        const internalEntry = context_.adventure.entries.get(this.journal_entry);
        if (!(internalEntry?._id))
        { 
            Deid.Log.error( "In HelyxSceneNote::model, failed to retrieve note " + this.journal_entry); 
            return;
        }

        if(internalEntry.journal) // This is a page
        {
            entry_id = internalEntry.journal;
            page_id = internalEntry._id;
        }
        else
        { entry_id = internalEntry._id }

        let result =
            {
              "entryId": entry_id,
              "pageId" : page_id,
              "x": this.x,
              "y": this.y,
              "icon": this.icon,
              "iconSize": this.icon_size,
              "iconTint": "",
              "fontFamily": this.font,
              "fontSize": this.font_size,
              "textAnchor": 1,
              "textColor": "#FFFFFF",
              "flags": {},
              "text": Deid.compile(this.text)
            };

        return result;
    }
}
export class HelyxSceneToken
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /// @brief          Reference to the world actor
    #ref                = null;

    /// @brief          X Position of the token in the scene
    #x                  = 0;


    /// @brief          Y position of the token in the scene
    #y                  = 0;

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {

        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    get ref()           { return this.#ref;}
    get x()             { return this.#x; }
    get y()             { return this.#y; }
    
    set(attribute_, value_)
    {
        switch(attribute_)
        {
            case 'ref'          : this.#ref = value_; break;
            case 'x'            : this.#x = value_; break;
            case 'y'            : this.#y = value_; break;

            default: throw "Unimplemented attribute '" + attribute_ + "' in HelyxSceneToken";
        }
    }

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined() { return true; }

    write(output_)
    {
        return output_.inlined_attributes(this,  ['ref','x','y']);
    } 

    /** @} **/ /*****************************************************************/
    /** \name   To Foundry Object
    **/ /** @{ ******************************************************************/    

    model(context_)
    { 
        let result = 
        {

        };
        return result;
    }
}
export class HelyxSceneWall
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /// @brief      Coordonates
    #c              = [0,0,0,0];

    /// @brief      Light
    #light          = 20;

    /// @brief      Move
    #move           = 20;

    /// @brief      Sight
    #sight          = 20;

    /// @brief      Sound
    #sound          = 20;

    /// @brief      Direction
    #dir            = 0;

    /// @brief      Door
    #door           = 0;


    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {

        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    get c()            { return this.#c;}

    get light()         { return this.#light; }
    get move()          { return this.#move; }
    get sight()         { return this.#sight; }
    get sound()         { return this.#sound; }

    get dir()           { return this.#dir; }
    get door()          { return this.#door; }

    
    set(attribute_, value_)
    {
        switch(attribute_)
        {
            case 'c'        : this.#c = value_; break;
            case 'light'    : this.#light = value_; break;
            case 'move'     : this.#move = value_; break;
            case 'sight'    : this.#sight = value_; break;
            case 'sound'    : this.#sound = value_; break;
            case 'dir'      : this.#dir = value_; break;
            case 'door'     : this.#door = value; break;

            default: throw "Unimplemented attribute '" + attribute_ + "' in HelyxSceneWall";
        }
    }

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined() { return true; }

    write(output_)
    {
        return output_.inlined_attributes(this,  ['c','light','move','sight','sound','dir','door']);
    } 

    /** @} **/ /*****************************************************************/
    /** \name   To Foundry Object
    **/ /** @{ ******************************************************************/    

    model(context_)
    { 
        let result = 
        {
            "c": c,
            "light": this.light,
            "move": this.move,
            "sight": this.sight,
            "sound": this.sound,
            "dir": this.dir,
            "door": this.door,
            "ds": 0,
            "flags": {},
            "threshold": {
              "light": null,
              "sight": null,
              "sound": null,
              "attenuation": false
            }
          } 
        return result;
    }
}

// End of file

export class HelyxJournalPage extends HelyxEntity
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /// @brief          Element blocks of the page
    #blocks = [];    

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        super();

        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    get blocks()      { return this.#blocks }

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            case 'blocks' : this.#blocks = Deid.build_dynamic_array(HelyxJournalBlockFactory.class_from_type, value_); break;
            default: super.set(attribute_, value_); break;
        }
    }      

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    write(output_)
    {
        super.write(output_);
        output_.array('blocks', this.#blocks, { inlined: false, aligned: true, backtab: false });
    }     
   
}        

// End of file

export class HelyxJournalEntry extends HelyxEntity
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /// @brief          Pages of the journal
    #pages = [];

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        super();

        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    get pages()      { return this.#pages }

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            case 'pages' : this.#pages = Deid.build_array(HelyxJournalPage, value_); break;
            default: super.set(attribute_, value_); break;
        }
    }      

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    write(output_)
    {
        super.write(output_);
        output_.array('pages', this.#pages, { inlined: false, aligned: true, backtab: true });
    }     
   
}        
export class HelyxActor extends HelyxEntity
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /// @brief          Adjustment of the power of the actor (for pf2e )
    #adjustment         = null;

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        super();

        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    get adjustment()      { return this.#adjustment; }

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            case 'adjustment'  : this.#adjustment   = value_; break;
            default: super.set(attribute_, value_); break;
        }
    }      

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    write(output_)
    {
        super.write(output_);
        output_.inlined_attributes(this, ['adjustment']);
    }     
   
}        
export class HelyxEquipmentSystem
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /// @brief          Price
    #price              = null;

    /// @brief          Potency rune
    #potency_rune      = null;

    /// @brief          Striking rune
    #striking_rune      = null;

    /// @brief          Property runes, array of string
    #properties_rune    = null;

    /// @brief          Resiliency rune
    #resiliency_rune    = null;

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    get price()        { return this.#price; }
    get potency_rune()      { return this.#potency_rune; }
    get striking_rune()     { return this.#striking_rune; }
    get properties_rune()   { return this.#properties_rune; }
    get resiliency_rune()   { return this.#resiliency_rune;}

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            case 'price'    : this.#price = value_; break; 
            case 'potency_rune'  : this.#potency_rune   = value_; break;
            case 'striking_rune' : this.#striking_rune  = value_; break;
            case 'properties_rune' : this.#properties_rune  = value_; break;
            case 'resiliency_rune' : this.#resiliency_rune = value_; break;

            default: throw "Unimplemented attribute '" + attribute_ + "' in HelyxEquipmentSystem";
        }
    }      

    /** @} **/ /*****************************************************************/
    /** \name   API
    **/ /** @{ ******************************************************************/

    // Apply values to an object in a Pf2E system
    apply_pf2e(target_)
    {
        let system = {};
        let runes = {}
        if(this.potency_rune) { runes.potency = this.potency_rune; }
        if(this.striking_rune) { runes.striking = this.striking_rune; }
        if(this.properties_rune) { runes.property = this.properties_rune; }
        if(this.resiliency_rune) { runes.resiliency= this.resiliency_rune}; 

        system.runes = runes;
    
        foundry.utils.mergeObject(target_, system);
    }

    apply(target_)
    {
        this.apply_pf2e(target_);
    }

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined() { return true; }

    write(output_)
    {
        output_.inlined_attributes(this,  ['price','potency_rune','striking_rune','properties_rune','resiliency_rune']);        
    }     
}    
export class HelyxEquipment extends HelyxEntity
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /// @brief          System datas
    #system             = null;

    /// @brief          Price
    #price              = null;

    /// @brief          Weight
    #weight             = null;

    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        super();

        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    get price()       { return this.#price; }
    get system()      { return this.#system; }
    get weight()      { return this.#weight; }

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            case 'system'      : this.#system =  Deid.build(HelyxEquipmentSystem, value_); break;
            case 'price'       : this.#price  =  value_; break;
            case 'weight'      : this.#weight = value_; break;
            default: super.set(attribute_, value_); break;
        }
    }      

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined() { return false; }

    write(output_)
    {
        super.write(output_);
        output_.inlined_attributes(this, ['price','weight']);
        output_.field('system',this.#system);
    }     
}    
export class HelyxScene
{
    /****************************************************************************/
    /** \name   Private data members
    **/ /** @{ ******************************************************************/

    /// @brief          Helyx header
    #helyx              = null;

    /// @brief          Name of the scene
    #name               = null;
    
    /// @brief          Background, HelyxSceneBackground object
    #background         = null;

    /// @brief          Scene width
    #width              = null;

    /// @brief          Scene height
    #height             = null;

    /// @brief          Scene padding
    #padding            = null;

    /// @brief          Initial camera position, HelyxSceneScale object
    #initial            = null

    /// @brief          Background color
    #background_color   = "#999999"

    /// @brief          Grid configuration, HelyxSceneGrid object
    #grid               = null;

    /// @brief          Global light flag
    #global_light       = false;

    /// @brief          Global light threshold
    #global_light_threshold = null;

    /// @brief          Darkness level
    #darkness           = 0;

    /// @brief          Tokens, array of HelyxSceneToken objects
    #tokens             = [];

    /// @brief          Lights array
    #lights             = [];

    /// @brief          Notes array, array of HelyxSceneNote objects
    #notes              = [];

    /// @brief          Wall array, array of HelyxSceneWall objects
    #walls              = [];


    /** @} **/ /*****************************************************************/
    /** \name   Constructors
    **/ /** @{ ******************************************************************/

    constructor(data_ = {})
    {
        Object.keys(data_).forEach
        (
            key_ => { this.set(key_, data_[key_]); }
        );
    }

    /** @} **/ /*****************************************************************/
    /** \name   Getters, setters
    **/ /** @{ ******************************************************************/

    get helyx()      { return this.#helyx; }
    get name()       { return this.#name; }
    get background() { return this.#background; }
    get width()      { return this.#width; }
    get height()     { return this.#height; }
    get padding()    { return this.#padding; }
    get initial()    { return this.#initial; }
    get background_color() { return this.#background_color; }
    get grid()      { return this.#grid; }
    get global_light() { return this.#global_light; }
    get global_light_threshold() { return this.#global_light_threshold; }
    get darkness()   { return this.#darkness; }
    get tokens()     { return this.#tokens; }
    get lights()     { return this.#lights; }
    get notes()      { return this.#notes; }
    get walls()      { return this.#walls; }

    set(attribute_, value_)
    {
        switch(attribute_)
        {
            case 'helyx'        : this.#helyx = Deid.build(HelyxHeader, value_ ); break;
            case 'name'         : this.#name = value_; break;
            case 'background'   : this.#background = Deid.build(HelyxSceneBackground, value_); break;
            case 'width'        : this.#width = value_; break;
            case 'height'       : this.#height = value_; break;
            case 'padding'      : this.#padding = value_; break;
            case 'initial'      : this.#initial = Deid.build(HelyxSceneInitial, value_); break;
            case 'background_color' : this.#background_color = value_; break;
            case 'grid'         : this.#grid = Deid.build(HelyxSceneGrid, value_); break;
            case 'global_light' : this.#global_light = value_; break;
            case 'global_light_threshold' : this.#global_light_threshold = value_; break;
            case 'darkness'     : this.#darkness = value_; break;
            case 'tokens'       : this.#tokens = Deid.build_array(HelyxSceneToken, value_); break;
            case 'lights'       : this.#lights = value_;
            case 'notes'        : this.#notes = Deid.build_array(HelyxSceneNote, value_); break;
            case 'walls'        : this.#walls = Deid.build_array(HelyxSceneWall, value_); break;

            default: throw "Unimplemented attribute '" + attribute_ + "' in HelyxScene ";
        }
    }

    /** @} **/ /*****************************************************************/
    /** \name   Custom Serialization
    **/ /** @{ ******************************************************************/

    inlined()    { return false; }

    write(output_)
    {
    }

    /** @} **/ /*****************************************************************/
    /** \name   API
    **/ /** @{ ******************************************************************/    


}    
export class ImagesImport 
{

// Map of images import, indexed by page number 
#images = new Map();

#negindex = -1;

/**
 
    @brief                  Store an import declaration in the #images map
    @param descriptors_      An image descriptor or an array of image descriptors

**/
declare(descriptor_)
{
    if(!descriptor_) { return; } 

    if(descriptor_ instanceof Array)
    {
        for(let d of descriptor_)
        { this.declare(d); }
    }
    else if(descriptor_.position != null)
    {

        let page_number = descriptor_.position.page,
              index       = descriptor_.position.index;

        if(index == undefined)
        { 
            index = this.#negindex; this.#negindex -= 1; 
            descriptor_.position.index = index;
        }

        if(this.#images.has(page_number) == false)
        { this.#images.set(page_number, new Map()); }

        this.#images.get(page_number).set(index, descriptor_);
        
    }
}

get(position_)
{
    const sub = this.#images.get(position_.page);
    return sub ? sub.get(position_.index) : undefined;
}

page(page_)
{
    return this.#images.get(page_);
}

tos(page)
{
    let html = '';
    let images = this.#images.get(page);
    for(const [index, descriptor] of images)
    {
        html += "<pre>" + JSON.stringify(descriptor) + "</pre>\n";
    }
    return html;    
}

}
export class HelyxPart 
{
    constructor(helyx, data = {}) 
    { 
        this.helyx = helyx || null;        
        this.idname = data.idname || '';
        this.type  = 'undefined';
    }

    get adventure() { return this.helyx.context.adventure; }
    
    get module_name() { return this.helyx.context.module_name; }
    get moduleDirectory() { return this.helyx.config.moduleDirectory; }

    progress() { return this.helyx.progress; }

    adv()         { return this.helyx.adventure; }
    fvt()         { return this.helyx.foundry; }
    sys()         { return this.helyx.sys; }

    config()    { return this.helyx.config; }

    entities()  { return this.helyx.entities; }
    utils()     { return this.helyx.utils; }

    block(_idx) { return this.helyx.pdf.pdf.get(_idx); }


    advance(type, log)
    {
        this.progress().advance(type, log);
        Deid.Log.report(log);
    }

    i18n(entry)
    {
        return game.i18n.localize(entry);
    }

    json()
    { 
        var cache = [];
        return JSON.stringify(this, (key, value) => 
        {
            if(key == 'helyx') return null;

            if (typeof value === 'object' && value !== null) 
            {
                // Duplicate reference found, discard key
                if (cache.includes(value)) return;
        
                // Store value in our collection
                cache.push(value);
            }
            return value;
        });
    }    


    sectionCssStyle(flags) 
    {
        var style = "";
        for (var i = 0; i < flags.length; i++) {
            switch (flags.charAt(i)) {                
                case 'c': style += 'text-align: center;'; break;
                case 'd': style += 'border-top: 1px solid black; border-bottom: 1px solid black;'; break;
                case 'h': style += 'border-bottom: 2px solid black; position: relative; color: black;'; break;
                default: break;
            }
        }
        return style.length ? (' style="' + style + '"') : "";
    }    

    sectionClasses(flags) 
    {
        var classes = "";
        for (var i = 0; i < flags.length; i++) {
            switch (flags.charAt(i)) {
                case 'q': classes += 'secret'; break;
                default: break;
            }
        }
        return classes.length ? (' class="' + classes + '"') : "";
    }

    flagRemoveSpace(txt) 
    {

        if (txt != ' ' && (txt.length > 0)) {
            var firstIsSpace = ((txt.charAt(0) == ' ') ? " " : ""); // If first character is a space, we keep it a space
            txt = firstIsSpace + txt.split(' ').join(''); // Remove space
        } else if (txt == '') {
            txt = ' ';
        }
        return txt;
    }

        /**
     * 
     * @param {*} code 
     * @returns 
     * 
     * content bits format is '@PDFNUMBER,LENGTH,FLAGS' or 'RAW CONTENT'
     * So pdf source is detected by have first letter being '@'
     * In 'code', '@' has been already removed
     * 
     * flags can be 
     *    b : bold
     *    i : italic
     *    s : remove all spaces
     *    t : ignore fontflags
     *    r : span with align right
     * 
     */
    _pdf(from, to, options)
    {

        let str = "";
        for (let i = from; i <= to; i++) 
        {
            const section = this.helyx.pdf.pdf.get(i);

            if(options.debug)
            { Deid.Log.debug('_pdf section ' + i + '= ' + section.str); }

            if (section == undefined) 
            { Deid.Log.error('Failed to retrieve bits ' + i + ' in {from:' + from + ',to:' + to); return " "; }

            if(section.str == '-')
            { continue; }

            const fontFlags = section.font?.flags || {};
            //Deid.Log.debug('Looking for font ' + section.font + ' and got ' + JSON.stringify(fontFlags));

            let txt = section.str;

            if(options.remove_numbers && txt.indexOf('(') != -1)
            { txt = txt.split('(')[0]; }

            if(options.no_parenthesis && txt.indexOf('(') != -1)
            { txt = txt.replace('(','').replace(')',''); }


            if((fontFlags.glyphs) && (section.font.glyphs))
            {
                let glyphs = section.font.glyphs ?? [];
                let trimmed = txt.trim();
                if ((trimmed.length!= 0) && ( glyphs[trimmed]))
                { 
                    txt = glyphs[ trimmed ];
                }
            }

            if(options.nospace)
            { txt = this.flagRemoveSpace(txt); }

            if(options.upper)
            { txt = txt.toUpperCase(); }

            let localBold = (!options.bold && fontFlags.bold && !options.no_font_flags);
            let localItalic = (!options.italic && fontFlags.italic && !options.no_font_flags);

            if (localBold) { txt = '<b>' + txt + '</b>'; }
            if (localItalic) { txt = '<i>' + txt + '</i>'; }

            if((i != from) && (options.spaced))
            { str += ' '; }
            
            str += txt;

        }

        if(options.trim_tabs)
        { str = str.trim(); }

        if(options.nodot)
        {
            let s = str.trim();
            if(s.endsWith('.') || s.endsWith(':'))
            { str = s.slice(0, -1); }
        }    

        if(options.no_dot_begin)
        {
            let s = str.trim();
            if(s.startsWith('.') || s.startsWith(':'))
            { str = s.slice(1); }
        }    

        if(options.capitalize_all)
        { str = Deid.capitalize_words(str, this.adventure.language); }

        if(options.singularize)
        { str = Deid.singularize_words(str, this.adventure.language); }

        if(options.capitalize_first)
        { 
            let phrases = str.split('. ');
            for(let j = 0; j  < phrases.length; j++)
            {
                let p = phrases[j];
                phrases[j] = p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
            }
            str = phrases.join('. ');
        }    

        if(options.sqbrackets)
        { str = Deid.sqbrackets(str); }

        if(options.quote)
        { str = '" ' + str +' " '; }

        if(options.pop_last_char)
        { str = str.slice(0, -1); }

        if(options.right) { str = '<span  class="helyx-pf2-cr" >' + str + '</span>'; }        

        if (options.bold) { str = '<b>' + str + '</b>'; }
        if (options.italic) { str = '<i>' + str + '</i>'; }        

        if(options.fix)
        {
            let fn = this.helyx.adventure.fixes;
            if (fn)
            str = fn(str, from);
        }

        return str;
    }

    /**
     * 
     * @param {*} code 
     * @returns 
     * 
     * content bits format is '@PDFNUMBER,LENGTH,FLAGS' or 'RAW CONTENT'
     * So pdf source is detected by have first letter being '@'
     * In 'code', '@' has been already removed
     * 
     * flags can be 
     *    b : bold
     *    i : italic
     *    s : remove all spaces
     *    n : ignore fontflags
     *    r : span with align right
     * 
     */
     renderPDFContent(code, options= {}) 
     {
        const idx = code.split(',');
        var from = 0, to = 0;
        var flags = "";

        if (idx.length == 0) { return; }

        from = parseInt(idx[0], 10);
        to = from;

        if ((idx.length >= 2) && (idx[1].length != 0)) { to += parseInt(idx[1], 10); }

        if (idx.length >= 3) { flags = idx[2]; }

        let opt = new HelyxTextOptions(flags, options);

        return this._pdf(from, to, opt);
    }    

    _packlink(compendiumKey, entityName)
    {
        let pack = Deid.compendium(compendiumKey);
        if(pack == undefined)
        { return "ERROR pack #" + compendiumKey + " not found "; }

        let etype = pack.metadata.type;
        let entity = Deid.searchEntityInCompendium(pack, entityName);
        if (entity == undefined)
        { return "ERROR entity #" + compendiumKey + "." + entityName + " not found "; }

        let result =  '@Compendium' + '['+  compendiumKey + '.' + entity._id + ']{' + entityName + '}';
        return result;


    }

    _link(_options)
    {
        const options = {..._options};
        const type = options.type.toLowerCase(); 

        switch(type)
        {
            case 'item': options.type = 'Item'; break;
            case 'actor': options.type = 'Actor'; break;
            default: break; 
        }

        const entity = this.helyx.context.item(options);
        if(entity == undefined)
        { 
            Deid.Log.error('Failed to build link : ' + JSON.stringify(options)); 
            return "<span>Failed to resolve link</span>"
        }
        else 
        { 
            const compendium = this.helyx.context.resolve_compendium(options.compendium);
            const is_compendium_entry = compendium ? true : false;
            const source = is_compendium_entry ? 'Compendium' : options.type;
            const name = entity.name;
            const id = (is_compendium_entry ? (compendium.key + '.') : '') + (entity._id ?? entity.id);
            return '@' + source + '[' + id + ']{' + name + '}'; 
        }
    }

    renderLink(code)
    {
        const args = code.split(',');
        if (args.length != 2) 
        { return ""; }

        return this._link( {type: args[0], idname: args[1] });
    }

    /**
     * 
     * @param {*} code 
     * @returns 
     * 
     * 
     * code format is "tag; flags; contents"
     * 
     * flags can be : 
     * 
     *  i : Put all first letters of each word to upper, all other to lower
     *  c : style = centered
     *  d : border up and bottom 1 px
     *  h : 'background-color: black; color: white;'
     * u : Put first letter to upper, all other to lower
     * 
    **/
    renderSection(code, options = {}) 
    {
        const args = code.split(';');
        if (args.length == 0) { return ""; }

        // Rajouter un flag si needed
        // if (args.length == 1) { return '<' + args[0] + '>'; }
        if (args.length == 1) { return args[0]; }

        if (args.length != 3) {
            Deid.Log.error('Failed to parse code ' + code);
            return "";
        }

        var content = "";
        var cssStyle = this.sectionCssStyle(args[1]);
        var cssClasses = this.sectionClasses(args[1]);

        if (args[0].length != 0) { content += '<' + args[0] + cssStyle + cssClasses + '>'; }

        const contents = args[2].split('+');
        var str = "";
        for (const c of contents) {
            if (c.length == 0) continue;

            if (c.charAt(0) == '#') { str += this.renderPDFContent(c.slice(1), options); }
            else if(c.charAt(0) == '@') { str += this.renderLink(c.slice(1)); }
            else { str += c; }
        }

        try {
            const flags = args[1];
            for (var i = 0; i < flags.length; i++) {
                switch (flags.charAt(i)) {
                    case 'i':                        
                        str = str.split(' ').map(i => i[0].toUpperCase() + i.substring(1).toLowerCase()).join(' ');
                        break;
                    case 'u':
                        str = str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(); 
                        break;   
                    default: break;
                }
            }

            content += str;
        }
        catch (e) {
            Deid.Log.error('Failed to render code ' + code + '\n' + JSON.stringify(e));
        }
        if (args[0].length != 0) content += "</" + args[0] + ">\n";
        return content;
    }    


    render(code, options = {})
    {
        const args = code.split('|');
        var str = "";
        for (const c of args) 
        {
            if (c.length == 0) continue;

            str += this.renderSection(c, options);
        }        
        return str;
    }    

    /**
     * 
     * @param {*} name    Name of the folder
     * @param {*} type    Type of the folder
     * @returns           The folder id
    **/
    _getFolderId(name, type)
    {
        var result = null;
        game.folders.forEach(f => 
        {            
            if( (result == null) && (f.name == name) && (f.type == type) )
            {
                result = f._id;   
            }
        });    

        return result;
    }

    getSubFolderId(parentId, name)
    {
        var f = game.folders.get(parentId);
        var result = null;
        if(f)
        {
            f.children.forEach(f =>
            {
                if((result == null) && (f.name == name))
                { result = f._id; }
            });
        }
        return result;
    }

    getTargetFolder(target)
    {
        var folderEntry = this.adv().folder(target);
        if(folderEntry == undefined)
        { 
            Deid.Log.debug('... no journal folder ' + entry.target);
            return null; 
        }

        return game.folders.get(folderEntry._id);
    }

    getTargetFolderId(target)
    {
        var folderEntry = this.adv().folder(target);
        if(folderEntry == undefined)
        { 
            Deid.Log.debug('... no journal folder ' + target);
            return null; 
        }

        return folderEntry._id;
    }

    /**
     * 
     * @param {*} datas
     * 
     * datas is an object with the following format
     * {
     *  name: folder name,
     *  type: VTT folder type, example "JournalEntry"
     *  parent: parent id
     *  sorting: "a" for alphabetic, "m" for manual ( insert oder )
     * }
     * 
    **/
    async createFolder(datas) 
    {
        Deid.Log.debug('createFolder ' + JSON.stringify(datas));
        let f = await Folder.create(datas);
        Deid.Log.debug(' => ' + JSON.stringify(f));
        return f._id;
    }

    async initFolders(folder) 
    {
        folder._id = this.getFolderId(folder.name, folder.type);
        if(folder._id == null)
        {
            folder._id = await this.createFolder({ name: folder.name, type: folder.type, sorting: "m" });
        }  

        for (var f of folder.subfolders) 
        { 
            f._id = this.getSubFolderId(folder._id, f.name);
            if(f._id == null)
            {
                f._id = await this.createFolder({name: f.name, type: folder.type, parent: folder._id, sorting: "m"}); 
            }    
        }

        Deid.Log.debug('initFolders result : ' + JSON.stringify(folder));        
    }

    /**
     * 
     * @param {*} name 
     * @param {*} type 
     * @returns 
     */
    async searchInCompendium(name, pack)
    {
        for(const [key, value] of pack.index.entries())
        {
            let match = (value.name == name);

            // Check original name if this is a translated pdf with names of entities not yet translated
            const babele_original_name = value.flags?.babele?.originalName;
            match |= ((babele_original_name) && (name == babele_original_name));

            if(match)
            {
                return await pack.getDocument(value._id);
            }

        }
        return undefined;
    }

    
    /**
     * 
     * Search an actor in all conpendium to impot its data
     * 
     */
    async searchInCompendiums(name, type)
    {
        for(const [key, value] of game.packs.entries())
        {
            if(value == undefined)
            { continue; }

            if(value.metadata == undefined)
            { continue; }

            if(value.metadata.type != type)
            { continue; }

            Deid.Log.debug('Inspect compendium ' + key);

            var res = await this.searchInCompendium(name, value);
            if(res != undefined)
            {
                return res;
            }
        }

        return undefined;
    } 

    entityIdFromCompendiumKey(compendiumKey, entityName)
    {
        var compendium = Deid.compendium(compendiumKey);
        if(compendium == null)
        { return null; }

        for(const [key, value] of compendium.index.entries())
        {
            //Deid.Log.debug(JSON.stringify(value));
            if(value.name == entityName)
            {
                return value._id;
            }
        }
        return undefined;        
    }
}

export class HelyxFolderAPI
{

/**
* 
* @returns     foundry journal Folder "Helyx", if exists
*
**/
static helyx_folder() 
{
    return Deid.folder("Helyx", { type: "JournalEntry"} );
}


/**
 * @brief           Create the journal folder 'Helyx' if it doesn't exist
 * @retval true     If the folder was created
 * @retval false    If the folder already exist
 * 
**/
static async create_helyx_folder() 
{
    let current = HelyxFolderAPI.helyx_folder();
    if(current != null)
    { return current; }

    return Folder.create({ name: "Helyx", type: "JournalEntry" });
}

/**
 * @brief                   Create and/or return a specific subfolder of Helyx journal folder
 * @param {string} folder   Folder name
 * @return                  Foundry folder object
**/
static async need_helyx_subfolder(_folder_name)
{
    let root_folder = await HelyxFolderAPI.create_helyx_folder()
    
    if(!root_folder)
    { throw("Failed to retrieve helyx"); }

    let child = Deid.folderChild(root_folder._id, _folder_name)
    if (child)
    { return child.folder; }

    return await Folder.create({name:_folder_name, type: "JournalEntry", folder: root_folder._id});  
    
    
}

/**
 * @brief           Retrieve the foundry folder with this name and type
 * @param {string} _name 
 * @param {string} _type 
 * @returns        foundry folder object with this name and type, null if there is no such folder
 **/
static get(_name, _type)
{
    for(const [key, value] of game.folders.entries())
    {            
        if( (value.name == _name) && (value.type == _type) )
        { return value; }
    };   
    return null;
}

/**
 * 
 * @param {*} name    Name of the folder
 * @param {*} type    Type of the folder, Item, Actor, etc ...
 * @returns           The folder id
**/
static id(_name, _type)
{
    const f = HelyxFolderAPI.get(_name, _type);
    return f ? f._id : null;
}


/**
 * @brief           Return a folder's child for a given name
 * @param {Folder} _parent_folder 
 * @param {string} _child_name 
 * @returns folder's child for a given name
 */
static get_child(_parent_folder, _child_name)
{
    let real = game.folders.get(_parent_folder._id);
    for(let c of real.children)
    {
        if(c.folder.name == _child_name) return c;
    }
    return undefined;
}


}    


export class HelyxFileSystemAPI
{

/** 

    @brief          Create a directory in the 'data' directory of foundry
    @param[in]      Directory to create
    @return         Promise

**/
static async mkdir(dir_)
{
    // Directories are created in the foundry 'Data' space
    const source = 'data';

    // Try to detect if there is more than 1 directory to create 
    const directories = dir_.split('/');
    if(directories.length > 1)
    {
        let root_value = '';
        for(let i = 0; i < directories.length-2; i++)
        {
            root_value += (root_value == '' ? '' : '/');
            root_value += directories[i];

            Deid.Log.debug('Create or confirm existence of directory ' + root_value);
            await Deid.mkdir(source, root_value);

        }
    }



    return Deid.mkdir(source, dir_)
    .then( (_created) => 
    {
        if(_created)
        { Deid.Log.report('Created directory ' + dir_); }
        else
        { Deid.Log.debug('Failed to create directory ' + dir_); }       
    }); 
}    

/** 
 
    @brief                  Create a set of sub directory under a parent directory
    @param[in] parent_      Parent directory. Will be located in 'data'
    @param[in] children_    Children directory. Will be located in 'parent_'
    @return    Promises     Promises executing the directories creation

**/
static async create_directories(parent_, children_)
{
    // Directories are created in the foundry 'Data' space
    const source = 'data';
    const prefix = '/helyx/' + parent_;

    // Create generic resources directory
    return HelyxFileSystemAPI.mkdir('helyx')
    .then( () =>
    {
        return HelyxFileSystemAPI.mkdir(prefix);
    }).then( () =>
    {
        let promises = [];
        if(children_)
        for(const d of children_)
        {
            const dirname = prefix + '/' + d;
            promises.push(HelyxFileSystemAPI.mkdir(dirname));
                
        }
       
        return Promise.all(promises);
    });
}

}    
export class HelyxFontAPI
{

static save_fonts(fonts_, name_)    
{
    let result = "[";
    let first = true;
    for (let f of fonts_)
    {
        let value = {...f};
        delete value.desc;

        result += (first ? "": ",\n") + "    " + JSON.stringify(value) + "";
        first = false;
    }
    result +="\n]\n";
    
    let html  = '<pre id="helyx_source">\n' + result + '\n</pre>';

    HelyxFolderAPI.need_helyx_subfolder('FONT ' + name_)
    .then( (m) =>
    {
        JournalEntry.create({ name: 'FONT ' + name_, pages: [ { name: 'FONT ' + name_,  text: {format: 1, content: html}}], folder: m._id });
    });
}
    
}

export class HelyxPdfAPI
{

static page_to_json(_page)
{
    let res = "[";
    if (_page) {
        for (let i = 0; i < _page.length; ++i) {
            let n = _page[i];

            if(i != 0) 
            { res +=','; }

            res += 
                '"' + i + '":\n'
              + '{\n'
              + '    "str" : "' + n.str + '",\n'
              + '    "font" :' + JSON.stringify(n.font_decl) + ',\n'
              + '    "at" : { "x" : ' + n.x + ', "y" : ' + n.y + '}\n'
              + '}' ;
        }
    }
    res += ']\n'
    return res;    
}


}    
export class HelyxSceneTokensAPI
{

static matches(requirement_, filters_)
{
    const value =  filters_[ requirement_.type];
    return value ? (value == requirement_.value) : false;
}

static element_matches(element_, filters_)
{
    if(element_.require == null)
    { return true; }

    for(const req of element_.require)
    {
        if( HelyxSceneTokensAPI.matches(req, filters_) == false)
        { return false; }
    }

    return true;
}

static filter(elements_, filters_)
{
    let result = [];
    for(const elem of elements_)
    {
        if(HelyxSceneTokensAPI.element_matches(elem, filters_))
        {
            result.push(elem);
        }
    }

    return result;
}

static generate_tokens(elements_, filters)
{
    if(elements_ == null) return null;

    let candidates = HelyxSceneTokensAPI.filter(elements_, filters);
    let tokens = [];

    for(let c of candidates)
    {
        for(let a of c.tokens)
        {
            let actor = game.helyx.context.item( { type: "Actor", idname: a.idname } );
            if(actor == null)
            {
                Deid.Log.error('In token generation, failed to retrieve actor #' + a.idname)
            }
            let declaration = 
            {
                name: actor.name
            };

            tokens.push(declaration);
        }
    }

    return tokens;
}

}
export class HelyxActors extends HelyxPart 
{
    constructor(helyx, data = {}) 
    {
        super(helyx);
    }

    importFromCompendium(actor)
    {
        var datas = this.searchInCompendiums(actor.sourceName, "Actor");
        if(datas == undefined)
        {
            Deid.Log.error("Failed to find actor '" + actor.sourceName + "' in compendiums");
            return undefined;
        }
        return datas;        
    }

    getPDF2FoundryName(name)
    {
        if(!name) return undefined;

        name = name.toLowerCase();
        name = name.replaceAll(' ', '-');
        name = name.replaceAll("'","");
        name = name.replaceAll("[\(\)]", "");
        name = name.replaceAll(Deid.FRENCH_ACCENTS, '');

        return name

    }

    async setPDF2FoundryTokenC(model, p2fdir, name)
    {
        let filename = '/pdftofoundry/' + p2fdir + '/' + name + '.actor.webp';
        if( await Deid.FS.exists(filename) )
        {
            model.img = '/pdftofoundry/' + p2fdir + '/' + name + '.actor.webp';
            model.token = { img: '/pdftofoundry/' + p2fdir + '/' + name + '.token.webp'};
            return true;
        }
        else
        { return false; }    
    }

    async getPDF2FoundryTokenB(model, p2fdir, other_names = [])
    {
        let original_name = this.getPDF2FoundryName(model.flags?.babele?.originalName);
        let name = this.getPDF2FoundryName(model.name);
        
        let res = 
               (await this.setPDF2FoundryTokenC(model, p2fdir, original_name)) 
            || (await this.setPDF2FoundryTokenC(model, p2fdir, name)) ;

        if(res)
        { return true; }

        for(let n of other_names)
        {
            let n2 = this.getPDF2FoundryName(n);
           if (await this.setPDF2FoundryTokenC(model, p2fdir, n)) 
           { return true; }
        }   
        
        return false;
    }

    async setPDF2FoundryToken(model, other_names)
    {
        if(model.img == "systems/pf2e/icons/default-icons/npc.svg")
        {
            const raw_source = model.flags?.core?.sourceId;
            if(!raw_source) 
            { return false }

            if(raw_source.startsWith('Compendium.pf2e.pathfinder-bestiary.'))
            { return await this.getPDF2FoundryTokenB(model, 'bestiary1', other_names); }

                        
        }

        return false;
    }

    async import(ex)
    {
        let b = ex.helyx;

        Deid.Log.report('Import actor ' + b.idname);

        let currentEntity = this.entities().find( { idname: b.idname, type: 'Actor'} );
        ex._id = await this.entities().checkExisting(currentEntity);
        if( ex._id != null)
        { 
            ex.finalName = currentEntity.name;
            let message = game.i18n.format("Helyx.Advance.ActorAlreadyImported", {name: currentEntity.name});
            this.advance("item", message);
            return; 
        }

        if(b.source == "compendium")
        {
            // Clone the datas
            let datas = await this.importFromCompendium(b);

            if(datas == null)
            {
                Deid.Log.error("Fail to find actor " + b.sourceName + " in compendiums");
                return;
            }

            let model = { ... datas };
            if(ex.name && ex.name.length != 0)
            { model.name = Deid.compile(ex.name); }
            delete model._id;

            // image
            if(ex.img)
            { model.img = Deid.compile(ex.img); }
            else 
            { 
                let other_names = [ b.sourceName ];
                if(ex.img_name)
                { other_names.push(ex.img_name); }

                //await this.setPDF2FoundryToken(model, other_names); 
            }
            

            // token
            if(ex.token && ex.token.img)
            { 
                model.prototypeToken.texture.src = Deid.compile(ex.token.img);
            }

            model.folder = this.getTargetFolderId(b.target);

            let actor = await Actor.create(model);

            if(ex.token && ex.token.img)
            { 
                await actor.update( { prototypeToken: {texture: {src: Deid.compile(ex.token.img)}}});
            }
            
            ex.finalName = model.name;
            ex._id = actor._id;
            await this.entities().flag(actor, ex.helyx.idname);

            if(ex.adjustment)
            { await actor.applyAdjustment(ex.adjustment); }

            let message = game.i18n.format("Helyx.Advance.ActorImported", {name: ex.finalName});
            this.advance("item", message);

        }
    }    
}        
export class HelyxAdventure extends HelyxPart 
{
    #title = undefined;

    /**
     * fonts definitions is copied because extra datas are added when reading a pdf to replace fonts index by the definition found in the pdf
     */
    get fonts() 
    { 
        if(this._fonts == undefined)
        { this._fonts = foundry.utils.deepClone(this.descriptor.fonts); }
        return this._fonts;
    }    

    get color_assign() { return this.descriptor.color_assign; }
    get content()       { return this.descriptor.content; }
    get contents()      { return this.descriptor.contents; }

    get drm() { return this.descriptor.drm; }
    get dependencies() { return this.descriptor.dependencies; }
    get default_conversions() { return this.descriptor.default_conversions; }

    get fixes() { return this.descriptor.fixes; }

    get ignore_pages() {return this.descriptor.ignore_pages; }
    
    get layout() { return this.descriptor.layout; }
    get midsize() { return this.descriptor.midsize; }


    get resources_directories() { return this.descriptor?.resources_directories; }

    get conversion_entries() { return this.descriptor.conversion_entries; }

    get flags () { return this.descriptor.flags; }
    get folders() { return this.descriptor.folders; }

    get images() { return this.descriptor ? this.descriptor.images : []; }
    get import_order() { return this.descriptor.import_order; }
    get identification() { return this.descriptor.identification; }
    get items() { return this.descriptor.items; }

    get language() {return this.descriptor.language; }

    get summary() { return this.descriptor.summary; }

    get prefix() { return this.descriptor.prefix; }

    get title() { return this.#title ?? this.descriptor.title; }
    get nbPages() { return this.descriptor.nbPages; }

    get system() { return this.descriptor.system; }

    get styles() { return this.descriptor.styles; }


    constructor(helyx, datas) 
    {
        super(helyx, datas);

        this.#title = datas.title ?? this.idname;
        
        this.descriptor = datas.descriptor;
        this.datas_directory = datas.datas_directory;
        this.origin = datas.origin;
        this.shared_resources_directory = datas.shared_resources_directory;
        this.export_directory = datas.export_directory ?? this.idname;
        this.art_map = new Map();
        this.conversions = new Map();
        this.entries = new Map();
    }

    _computeImageDirectory(img)
    {
        img.imgDirectory = "helyx/" + this.export_directory;
        if(img.target) 
        { img.imgDirectory += "/" + img.target; }

        img.saveFilename = img.imgDirectory + "/" + img.idname + ".webp";
    }

    computeImageDirectories()
    {
        this.tokens = new Map();
        for(let i of this.images)
        {
            this._computeImageDirectory(i);

            if(i.tokens)
            {
                for(let t of i.tokens)
                {
                    this._computeImageDirectory(t);
                    this.tokens.set(t.idname, t);
                }
            }
        }
    }

    token(idname)
    {
        return this.tokens.has(idname) ? this.tokens.get(idname)  : undefined;
    }

    addItem(item)
    {
        this.descriptor.import_order.push(item.helyx.idname);
        this.descriptor.items.set( item.helyx.idname, item);
    }

    setItem(item)
    {
        this.descriptor.items.set( item.helyx.idname, item);
    }

    convertable(gameSystem)
    {
        let conversions = this.default_conversions;
        if(!conversions)
        {
            return false;
        }
        return conversions.includes(gameSystem);
    }

    _addConversions(conversions)
    {
        if( !this.conversions.has( game.system.id) )
        { this.conversions.set( game.system.id, new Map()); }

        let dest = this.conversions.get(game.system.id);

        for(let i of conversions)
        {
            dest.set(i.idname, i);
        }

        for(let def of this.conversion_entries)
        {
            if(dest.has(def.idname))
            {
                let e = dest.get(def.idname);
                e.source = def.source;
                e.type = def.type;
            }
            else
            {
                Deid.Log.error("No conversion entry found for " + def.idname);
            }
        }

        for (let i of conversions)
        {
            if( (i.type == "item") || (i.type == "actor") )
            {
                this.addItem(i.conversion);
            }            
        }
    }

    async _getDefaultConversion(system)
    {
        if (this.config().bundled)
        { return; }

        this.conversions.set( game.system.id, new Map());

        let expectedConversionFile = this.datas_directory + '/conversions/' + this.idname + '/' + system + '.json';
        let str = await Deid.FS.file2string(expectedConversionFile);
        this._addConversions(JSON.parse(str));        
    }

    /**
     * @brief           Return the adventure conversion mode
     * 
     * Possible values are :
     * 
     * none: The adventure and the current world use the same system. No conversion needed
     * default: The adventure already have default conversions for the world system.
     * external: A conversion file has been found in /helyx/conversion/adv dir
     * failed: No conversion available
     * 
     * @returns 
     */
    async conversionMode()
    {
        // Is this a conversion ?
        if (game.system.id == this.system)
        { return "none"; }

        if(this.convertable(game.system.id))
        { 
            this._getDefaultConversion(game.system.id);
            return "default"; 
        }
                                    
        let expectedConversionFile = "/helyx/conversions/" + this.idname + "/" + game.system.id + ".json";
        try 
        {
            let str = await Deid.FS.file2string(expectedConversionFile);
            await this._addConversions(JSON.parse(str));

            conversionMode = "external";
        } catch(e)    
        {
            return "failed";
        }        
    }

    item(options)
    {
        let ref = options.ref ?? options.idname;

        if (this.items.has(ref))
        { return this.items.get(ref); }
        else
        { return undefined; }
    }

    css(name)
    {
        if(name in this.css)
        { return this.css[name]; }
        else
        { return ''; }
    }

    identify() 
    { 
        const identity = this.identification;
        if(identity == undefined)
        {  Deid.Log.error('Adventure without identity'); return false; }

        const expected = identity.value;

        Deid.Log.debug('Adventure::identify for ' + this.name);
            
        var txt = this.helyx.pdf.pdf.at(identity.page, identity.block);
        if(txt == undefined)
        { 
            Deid.Log.debug( 'Adventure::identify : model missing entry page ' + identity.page + ' block ' + identity.block);
            return false; 
        }

        Deid.Log.debug('compare \n"' + expected + '" and \n"' + txt.str + '"');

        if(expected.length != txt.str.length)
        {
            Deid.Log.debug('expected length:' + expected.length + ', readed length:' + txt.str.length);
            return false;
        }

        if(expected.localeCompare(txt.str) != 0)
        {                 
            Deid.Log.debug('local compare failed');
            return false; 
        }
        return true;
    }    

    resolve_fonts(_content)
    {
        for(let f of this.fonts)
        {
            if(f.position != 0)
            {
                var p = Math.floor(f.position / 1000);
                var k = f.position % 1000;
                var txt = _content.at(p, k);   
                if(!txt)
                {
                    Deid.Log.error("Font position doesn't match any text " + JSON.stringify(f));
                    continue;
                }
                if(!txt.font_decl)
                {
                    Deid.Log.error("Text without font declaration at " + f.position);
                    txt.font_decl = {};
                }
                f.name = txt.font_decl.name;
                f.size = txt.font_decl.size;
                f.color = txt.font_decl.color;
            }
        }

        let lastFont = null;

        for(let p = 0; p < this.nbPages; p++)
        {
            let page = _content.pages[p];
            if(!page) continue;

            for(let i = 0; i < page.length; i++)
            {
                let b = page[i];
                if(!b) continue;

                // short optimization : there is good chance than the font to find is the font of the last sentence
                if(lastFont)
                {
                    if(Deid.PDF.cmp_font(lastFont, b.font_decl))
                    {
                        b.font = lastFont;
                        continue;
                    }
                }

                b.font = this.fontByDecl(b.font_decl);
                lastFont = b.font;
            }
        }
    }

    fontByDecl(decl)
    {
        for(const f of this.fonts)
        {
            if(Deid.PDF.cmp_font(f, decl))
            { return f ; }
        }
        return null;
    }

    fontFlagsByDecl(decl)
    {        
        let f = this.fontByDecl(decl);
        return f ? (f.flags || {}) : {};
    }

    getEvent(eventName)
    {
        for(const e of this.events)
        {
            if(e.idname == eventName)
            {
                return e;
            }
        }
        return {};
    }

    folder(idname)
    {
        if(this.folders)
        { 
            for(const s of this.folders)
            {
                if(s.idname == idname)
                { return s; }
            }
            return null;

        }
    }

    image(idname)
    {
        if(this.images)
        {
            for(const img of this.images)
            {
                if(img.idname == idname)
                { return img; }
            }
        }
        return null;
    }

    imageEntry(position)
    {
        if(this.images)
        {
            for(const img of this.images)
            {
                if(!img.position) continue;
                
                if((img.position.page == position.page) && (img.position.index == position.index))
                { return img; }
            }
        }
        return null;
    }

    entryFromArray(internalName, arrayItems)
    {
        for(const i of arrayItems)
        {
            if(i.helyx.idname == internalName)
            { return i; }
        }
        return null;
    }       
}


export class HelyxBlocks extends HelyxPart 
{
    constructor(helyx) 
    {
        super(helyx);

        this.blocks = new Map();

        this.declareBlock(new HelyxBlockConversion(helyx));
        this.declareBlock(new HelyxBlockConversions(helyx));
        this.declareBlock(new HelyxBlockCreature(helyx));
        this.declareBlock(new HelyxBlockEquipment(helyx));
        this.declareBlock(new HelyxBlockH1(helyx));
        this.declareBlock(new HelyxBlockInventory(helyx));
        this.declareBlock(new HelyxBlockParagraph(helyx));
        this.declareBlock(new HelyxBlockRaw(helyx));
        this.declareBlock(new HelyxBlockReadSection(helyx));
        this.declareBlock(new HelyxBlockJournalTitle(helyx));
        this.declareBlock(new HelyxBlockRoomSection(helyx));
        this.declareBlock(new HelyxBlockStatblock(helyx));
        this.declareBlock(new HelyxBlockTable(helyx));
    }

    declareBlock(block)
    {
        for(let id of block.blocktypes )
        {
            this.blocks.set(id, block);
        }
    }

    block(id)
    {
        return (this.blocks.has(id) ? this.blocks.get(id) : undefined);
    }

    update(datas_, ex_)
    {
        if(ex_.type == undefined)
        { return; }

        if(this.blocks.has(ex_.type) == undefined)
        { return; }

        let b = this.blocks.get(ex_.type);

        if(!b || !b.update)
        { return; }

        b.update(datas_,ex_);
    }

    render(ex)
    {
        if(ex.type == undefined)
        { return "<span class='helyx-error'>Block without type</span>"; }

        if(this.blocks.has(ex.type) == undefined)
        { return "<span class='helyx-error'>Undefined block type ' + ex.type + '</span>"; }

        let b = this.blocks.get(ex.type);

        if(!b || !b.render)
        { 
            return "<span class='helyx-error'>Unimplemented block type " + ex.type + "</span>";
        }

        let result = b.render(ex);

        if(ex.block)
        { result += this.render(ex.block); }

        if(ex.blocks)
        {
            for(let b of ex.blocks)
            {
                result += this.render(b);
            }
        }

        result += b.close(ex);

        return result;
    }
}
export class HelyxBlockConversion extends HelyxPart
{

    constructor(helyx, data = {}) 
    {
        super(helyx);
    }

    get blocktypes() { return [ "conversion" ]; }

    link_of_conversion(conversion)
    {
        let link = "";
        if(conversion.type == "text")
        {
            link = Deid.compile(conversion.content);
        }
        else
        {
            link = this._link( { type: conversion.type, idname: conversion.idname } )
        }
        return '<tr><td>' + Deid.compile(conversion.converted) + '</td>'
               + '<td>🠖</td>' 
               + '<td>' + link + '</td></tr>'
            ; 
        ;
    }    

    collect_conversion_links(block)
    {
        let reps = block.conversion ? block.conversion : block.conversions;
        if(!reps)
        { return []; }

        if(reps instanceof Array)
        {
            let res = [];
            for(let rep of reps)
            {
                let u = this.link_of_conversion(rep);
                if(u)
                { res.push(u); }
            }
            return res;
        }
        else
        {
            let u = this.link_of_conversion(reps);
            return u ? [ u ] : [] ;
        }
    }    

    render(ex)
    {
        let links = this.collect_conversion_links(ex);
        if(links.length == 0) return "";

        let result =               
            "<div class='helyx-block-conversion'>"
            + "<p class='helyx-p'><b>" 
            + game.i18n.localize("Helyx.PF2Conversion") 
            + "</b></p><div class='helyx-conversions'><table class='helyx-conversion-table'>"
        ;    

        for(let lnk of links) result += " " + lnk;

        result += '</table></div><hr/></div>';
        return result;

    }

    close(ex)
    { return ""; }
}    


export class HelyxBlockConversions extends HelyxPart
{

    constructor(helyx, data = {}) 
    {
        super(helyx);
    }

    get blocktypes() { return [ "conversions" ]; }

    convert_actor(conv)
    {
        let name = Deid.compile(conv.source);
        let res = '<div id="helyx-conversion-' + conv.idname +'">' 
            + '<p>Use ' 
            + Deid.compile("{{{lnk '" + conv.type +"' '" + conv.conversion.helyx.idname + "' }}}")
            + '</p>'
        ;
        
        if(conv.notes)
        {
            res += '<p><em>' + conv.notes + '</em></p>';
        }
        res += '</div>';
        return res;
    }

    convert_text(conv)
    {
        return '<div id="helyx-conversion-' + conv.idname +'">' 
            + '<p>Instead of <em>' + Deid.compile(conv.converted) 
            + '</em>, use ' + Deid.compile(conv.conversion)
            + '</p></div>'
        ;        
    }

    convert_item(conv)
    {
        let name = Deid.compile(conv.source);
        let res = '<div id="helyx-conversion-' + conv.idname +'">' 
            + '<p>Use ' 
            + Deid.compile("{{{lnk '" + conv.type +"' '" + conv.conversion.helyx.idname + "' }}}")
            + '</p>'
        ;
        
        if(conv.notes)
        {
            res += '<p><em>' + conv.notes + '</em></p>';
        }
        res += '</div>';
        return res;
    }

    convert(conv)
    {
        switch(conv.type)
        {
            case 'actor' : return this.convert_actor(conv);
            case 'text'  : return this.convert_text(conv);
            case 'item'  : return this.convert_item(conv);
        }
    }

    render(ex)
    {
        let conversions = this.adventure.conversions;
        if( !conversions )
        {
            return '';
        }

        let conversion_map = conversions.get(game.system.id);

        // If the current game system is the adventure system, and no conversion map, we skip this block
        if((this.adventure.system == game.system.id) && (!conversion_map))
        {
            return '';
        }

        if(!conversion_map)
        {
            return '';
        }

        let result = "<div class='helyx-block-conversions'>";

        for(let id of ex.conversions)
        { 
            if(conversion_map.has(id))
            {
                result += this.convert(conversion_map.get(id)); 
            }
            else
            {
                Deid.Log.error('Can t find conversion ' + id);
            }    
        }

        result += '</div>';
        return result;

    }

    close(ex)
    { return ""; }
}    

/*
, "<div class='helyx-block-encounter'>"
, "<div class='helyx-block-stat-title'>"
, "<div class='helyx-block-stat-title-listing'><h3>Rencontre</h3> {{{helyxlnk 'actor' 'lobster' }}} x4</div>"
, "<div class='div.helyx-block-stat-title-cr'> <h3 class='helyx-block-stat-cr'>{{{xlf 13043 1 'tn'}}}</h3></div>"
, "</div>"
, "<section class='statblock'> "
, "{{{pxl 13045 2}}} {{{pxl 13048 1}}} {{{pxl 13050 1}}} </section>

*/
export class HelyxBlockCreature extends HelyxPart
{

    constructor(helyx, data = {}) 
    {
        super(helyx);
    }
        
    get blocktypes() { return [ "creature", "danger", "hazard","background","settlement","activity","disease","infiltration","chase" ]; }

    _title(ex)
    {
        if(ex.type == "creature") return "Créature";
        if(ex.type == "danger")   return "Danger";
        if(ex.type == "hazard") return "Hazard";
        if(ex.type == "background") return "Background";
        if(ex.type =="activity") return "Activité";
        if(ex.type == "disease") return "Maladie";

        return "!INCONNU!";
    }

    _actors_link(ex)
    {        
        if(ex.ref)
        {
            if (ex.ref instanceof Array)
            { 
                let result = "";
                for(let s of ex.ref)
                { result += Deid.compile("{{{lnk 'actor' '" + s + "' }}}"); }
                return result;
            }

            return  Deid.compile("{{{lnk 'actor' '" + ex.ref + "' }}}");
        }        
        else if(ex.name)
        { 
            let name = Deid.compile(ex.name);
            return '<span class="entity-name">' + name + '</span>';
        }
        else if(ex.conversion)
        {
            let name = Deid.compile(ex.conversion.converted);
            let res = '<div class="helyx-converted" data-conversion="' + ex.conversion.idname + '">' 
                + '<i class="fas fa-magic"></i>'
                + name 
                + '</div>';
            return res;
        }
        else
        { return "ERROR"; }
    }

    _token_icon(ex)
    {
        if(!ex.ref)
        { return ""; }

        let actor = this.helyx.context.item( { type: "Actor", idname: ex.ref } );

        if(!actor)
        { return ""; }

        let result = "<img src='" + actor.prototypeToken.texture.src + "' class='helyx-token-icon' >"
            + "</img>"    
        ;

        return result;
    }

    _amount(ex)
    {
        if (!ex.amount )
        { return ""; }

        let amount = (ex.amount == "[O]") ? "[O]" : ("x" + ex.amount);

        return "<span class='helyx-creature-amount'>" +  amount + "</span>";
    }

    render(ex)
    {
        let result = "<div class='helyx-block-box'>";        
        let style  = 'helyx-' + ex.type;

        result += "<div class='helyx-block-box-title " + style + "'>"; 

        result += "<div class='helyx-block-box-title-listing'>"
                + "<div style='display: flex;'>"
                + this._token_icon(ex)
                + this._actors_link(ex)
                + this._amount(ex)
                + "</div>"
                + (ex.tags ? Deid.compile(ex.tags) : "")
                + "</div>"
         ;
    
        if(ex.cr)
        {
            result += "<div class='helyx-block-box-title-cr'>"
                    + "<span class='helyx-cr'>"
                    + Deid.compile(ex.cr)
                    + "</span>"
                    + "</div>"
            ;

        }

        // End block-block-title
        result += "</div>";

        // Stat block
        result += "<div class='statblock helyx-statblock'>"
                + Deid.compile(ex.statblock)
                + "</div>"
        ;

        // End of div block encounter
        result += "</div>";

        return result;
    
    }    

    close(ex)
    { return ""; }
}    

export class HelyxBlockEquipment extends HelyxPart
{

    constructor(helyx, data = {}) 
    {
        super(helyx);
    }

    get blocktypes() { return [ "equipment", "trap", "feat", "location", "activity", "spell" ]; }

    _title(ex)
    {
        if(ex.type == "equipment") return "Equipement";
        if(ex.type == "trap")   return "Piège";
        if(ex.type == "feat") return "Feat";
        if(ex.type == "location") return "Location";
        if(ex.type == 'activity') return "";
        if(ex.type == 'spell' ) return "";

        return "!INCONNU!";
    }

    _items_link(ex)
    {                
        if(ex.ref)
        {
            if (ex.ref instanceof Object)
            { return this._link(ex.ref); }
            else if (ex.ref instanceof Array)
            { 
                let result = "";
                for(let s of ex.ref)
                { result += this._link(s); }
                return result;
            }

            return  Deid.compile("{{{lnk 'item' '" + ex.equipment + "' }}}");
        }
        else if(ex.link)
        {
            return ex.link.tolink(this.helyx.context, ex.name);
        }
        else if(ex.item)
        {
            return  Deid.compile("{{{lnk 'item' '" + ex.item + "' }}}");
        }
        else if(ex.name)
        { 
            let name = Deid.compile(ex.name);
            return '<span class="equipment-name">' + name + '</span>';
        }
        else
        { return "ERROR"; }
    }

    _token_icon(ex)
    {
        if(!ex.item)
        { return ""; }

        let item = this.helyx.context.item( { type: "Item", idname: ex.item } );

        if(!item)
        { return ""; }

        let result = "<img src='" + item.img + "' class='helyx-token-icon' >"
            + "</img>"    
        ;

        return result;
    }

    _amount(ex)
    {
        if (!ex.amount )
        { return ""; }

        return "<span class='helyx-creature-amount'>" + ("x" + ex.amount) + "</span>";
    }

    render(ex)
    {
        let result = "<div class='helyx-block-box'>";

        const typeclass = 'helyx-' + ex.type, 
              title     = this._title(ex);

        result += "<div class='helyx-block-box-title " + typeclass +"'>";

         result += "<div class='helyx-block-box-title-listing'>"
                + "<div style='display: flex;'>"
                + this._token_icon(ex)
                + this._items_link(ex)
                + this._amount(ex)
                + "</div>"
                + (ex.tags ? Deid.compile(ex.tags) : "")
                + "</div>"
    
        if(ex.cr)
        {
            result += "<div class='helyx-block-box-title-cr'>"
                    + "<span class='helyx-cr'>"
                    + Deid.compile(ex.cr)
                    + "</span>"
                    + "</div>"
            ;

        }

        // End block-encounter-title
        result += "</div>";

        // Stat block
        result += "<section class='statblock helyx-statblock'>"
                + Deid.compile(ex.statblock);
                + "</section>"
        ;

        // End of div block encounter
        result += "</div>";

        return result;
    
    }    

    close(ex)
    { return ""; }
}    

export class HelyxBlockH1 extends HelyxPart
{

    constructor(helyx, data = {}) 
    {
        super(helyx);
    }
    
    get blocktypes() { return [ "h1" ]; }

    render(ex)
    {
        let content = "";

        if (typeof ex.title == "string")
        { content = Deid.compile(ex.title); }
        else if (ex.title instanceof Array)
        { 
            let content = "";
            for(let s of ex.title)
            { content += Deid.compile(s);}
        }

        let result = '<h1  class="helyx-h1" >' + content + '</h1>\n';

        return result;
    }

    close(ex)
    { return ""; }
}    

export class HelyxBlockInventory extends HelyxPart
{

    constructor(helyx, data = {}) 
    {
        super(helyx);
    }

    get blocktypes() { return [ "inventory" ]; }

    render_inv_entry(entry)
    {
        if(entry.type != 'link')
        { return "[undefined/bug]"; }

        let res = entry.link.tolink(this.helyx.context);

        if(entry.notes)
        { res += '<span><i>(' + entry.notes + ')</i></span>'; }

        return res;
    }

    render(ex)
    {
        let title = ex.title ?? "{{{localize 'Helyx.Inventory'}}}";
        let result = 
              "<p class='helyx-p helyx-item-list'><b>" 
            + Deid.compile(title) 
            + "</b> :"
        ;    

        let first = true;

        for(let e of ex.items)
        {
            if(first) { first = false; }
            else { result += ","; }
            result += " " + this.render_inv_entry(e);
        }    

        result += '<hr/></p>';
        return result;

    }

    close(ex)
    { return ""; }
}    


export class HelyxBlockJournalTitle extends HelyxPart
{

    constructor(helyx, data = {}) 
    {
        super(helyx);
    }

    get blocktypes() { return [ "journal-title" ]; }

    update(datas_,ex_)
    {
        const title = (ex_.title ? Deid.compile(ex_.title) : ""),
              cr    = (ex_.cr    ? Deid.compile(ex_.cr)    : ""),
              style = this.adventure.styles?.page_title;

        let merges = { flags: {}};
        merges.flags[ this.module_name ] = {title:{ title: title, cr: cr, css_style: style } };
        
        foundry.utils.mergeObject(datas_, merges);
    }

    render(ex)
    {
        let cr = ex.cr ? Deid.compile(ex.cr) : undefined, 
            xp = ex.xp ? Deid.compile(ex.xp) : undefined,
            result = "";

        if((cr) || (xp))
        {
            result += '<div  class="helyx-room-cr" >';
            if(cr)  { result += '<span>' + cr + '</span>'; }
            if(xp)  { result += '<span>' + xp + '</span>'; }

            result += '</div>';
        }

        return result;
    }

    close(ex)
    { return ""; }
}    


export class HelyxBlockParagraph extends HelyxPart
{

    constructor(helyx, data = {}) 
    {
        super(helyx);
    }
    
    get blocktypes() { return [ "text" ]; }

    _render_paragraph(template)
    {        
        return "<p class='helyx-block-p'>" 
        + Deid.compile(template)
        + "</p>";        
    }

    _content(ex)
    {
        if(typeof ex.paragraph == "string")
        { return this._render_paragraph(ex.paragraph); }

        if (typeof ex.paragraphs == "string")
        { return this._render_paragraph(ex.paragraphs); }
        else if (ex.paragraphs instanceof Array)
        { 
            let result = "";
            for(let s of ex.paragraphs)
            { result += this._render_paragraph(s);}
            return result;
        }

        return "Unsupported content type in block #" + ex.idname;
    }

    _one_replace(ex, content, replacement)
    {

        let replaced = "";
        let new_content = "";

        if (replacement.type == "conversion")
        {
            // No conversion if same system
            if((game.system.id == this.adventure.system))
            { return content; }

            replaced = Deid.compile(replacement.replaced);

            new_content = '<span class="helyx-converted" data-conversion="' + replacement.idname + '">' 
                + '<i class="fas fa-magic"></i>'
                + replaced
                + '</span>'
            ;

        }
        else
        {

            replaced    = replacement.replaced ?? entity.name;
            replaced    = Deid.compile(replaced);
            new_content =  replacement.replacement(this.helyx.context, replaced);

        }

        // Try by exact match
        let idx = content.indexOf(replaced);
        if(idx == -1)
        { idx = content.indexOf(replaced.toLowerCase()); }
        
        if(idx != -1)
        { 
            
            return content.slice(0, idx) + new_content + content.slice(idx+replaced.length);
        }
        
        return content;
    }

    _replace(ex, content)
    {
        if(ex.replaces)
        {
            if(ex.replaces instanceof Array)
            {
                for(let c of ex.replaces)
                { content = this._one_replace(ex, content, c); }
                return content;
            }
            else 
            { return this._one_replace(ex, content, ex.replaces); }    
        }

        return content;
    }

    render(ex)
    {
        let content = this._content(ex);
        return this._replace(ex, content);
    }

    close(ex)
    { return ""; }
}    


export class HelyxBlockRaw extends HelyxPart
{

    constructor(helyx, data = {}) 
    {
        super(helyx);
    }
    
    get blocktypes() { return [ "raw" ]; }

    render(ex)
    {
        if (typeof ex.content == "string")
        { return Deid.compile(ex.content); }
        else if (ex.content instanceof Array)
        { 
            let result = "";
            for(let s of ex.content)
            { result += Deid.compile(s);}
            return result;
        }

        return "Unsupported content type in block #" + ex.idname;
    }

    close(ex)
    { return ""; }
}    


export class HelyxBlockReadSection extends HelyxPart
{

    constructor(helyx, data = {}) 
    {
        super(helyx);
    }

    get blocktypes() { return [ "read-section" ]; }

    _render_paragraph(template)
    {
        return "<p class='helyx-block-p'>" 
        + Deid.compile(template)
        + "</p>";
    }

    render(ex)
    {
        let result = "<div class='helyx-block-read-section'>";

        if(typeof ex.paragraph == "string")
        { result += this._render_paragraph(ex.paragraph); }
        else if (typeof ex.paragraphs == "string")
        { result += this._render_paragraph(ex.paragraphs); }
        else if (ex.paragraphs instanceof Array)
        { 
            for(let s of ex.paragraphs)
            { result += this._render_paragraph(s);}
        }        
        
        result += "</div>";
        return result;

    }

    close(ex)
    { return ""; }
}    


export class HelyxBlockRoomSection extends HelyxPart
{

    constructor(helyx, data = {}) 
    {
        super(helyx);
    }

    get blocktypes() { return [ "section" ]; }

    _icon(extype)
    {
        switch(extype)
        {
            case 'danger' : return 'icons/environment/traps/spike-skull-white-brown.webp';
            case 'hazard' : return 'icons/environment/traps/spike-skull-white-brown.webp';
            case 'encounter' : return "icons/creatures/mammals/humanoid-fox-cat-archer.webp";
            case 'treasure' : return "icons/commodities/currency/coins-stitched-pouch-brown.webp";
            case 'success' : return "icons/skills/social/thumbsup-approval-like.webp";
            case 'failure' : return "icons/skills/movement/arrow-down-pink.webp";
            case 'question' : return "icons/magic/symbols/question-stone-yellow.webp";
            case 'development' : return "icons/sundries/books/book-open-red.webp";
            case 'map' : return "icons/tools/navigation/map-chart-tan.webp";
            case 'secret' : return "icons/tools/scribal/magnifying-glass.webp";
            case 'bylevel': return "icons/weapons/swords/sword-winged-pink.webp";
            case 'peace' : return "icons/skills/social/diplomacy-peace-alliance.webp";
            case 'balance': return "icons/tools/hand/scale-balances-merchant-brown.webp";
            case 'dices': return "icons/sundries/gaming/dice-pair-white-green.webp";
            case 'camp' : return "icons/environment/wilderness/camp-improvised.webp";
            case 'anvil': return "icons/skills/trades/smithing-anvil-silver-red.webp";
            case 'candle': return "icons/sundries/lights/candle-lit-yellow.webp";
            case 'search': return "icons/tools/scribal/magnifying-glass.webp";
            case 'blue-rune' : return "icons/magic/symbols/runes-triangle-blue.webp";
            case 'clock': return "icons/commodities/tech/detonator-timer.webp";
            case 'dream' : return "icons/magic/control/debuff-energy-hold-blue-yellow.webp";

            case 'npc' : return "icons/environment/people/commoner.webp";
            case 'poi' : return "icons/tools/navigation/map-chart-tan.webp";

            case 'skill-arcana' : return "icons/magic/symbols/runes-triangle-blue.webp";
            case 'skill-athletism' : return "icons/skills/melee/unarmed-punch-fist-yellow-red.webp";
            case 'skill-computer' : return Deid.compile("{{{imgsrc 'shared' 'icons/computer.webp'}}}");
            case 'skill-crafting' : return "icons/skills/trades/smithing-anvil-silver-red.webp";
            case 'skill-culture' : return "icons/sundries/books/book-stack.webp";
            case 'skill-diplomacy' : return "icons/skills/social/diplomacy-handshake-yellow.webp";
            case "skill-intimidation" : return "icons/skills/social/intimidation-impressing.webp";
            case "skill-life-science" : return Deid.compile("{{{imgsrc 'shared' 'icons/life-science.webp'}}}");
            case "skill-nature": return "icons/environment/wilderness/tree-ash.webp";
            case "skill-perception": return "icons/magic/perception/eye-ringed-green.webp"
            case "skill-performance" : return "icons/tools/instruments/harp-yellow-teal.webp";
            case "skill-religion" : return "icons/magic/holy/prayer-hands-glowing-yellow.webp";
            case 'skill-society' : return "icons/environment/people/group.webp";
            case "skill-occultism" : return "icons/magic/death/skull-horned-goat-pentagram-red.webp";


            case 'alchemist': return "/systems/pf2e/icons/classes/alchemist.webp";
            case 'barbarian': return "/systems/pf2e/icons/classes/barbarian.webp";
            case 'bard': return "/systems/pf2e/icons/classes/bard.webp";
            case 'champion': return "/systems/pf2e/icons/classes/champion.webp";
            case 'cleric': return "/systems/pf2e/icons/classes/cleric.webp";
            case 'druid': return "/systems/pf2e/icons/classes/druid.webp";
            case 'fighter': return "/systems/pf2e/icons/classes/fighter.webp";
            case 'gunslinger': return "/systems/pf2e/icons/classes/gunslinger.webp";
            case 'inventor': return "/systems/pf2e/icons/classes/inventor.webp";
            case 'investigator': return "/systems/pf2e/icons/classes/investigator.webp";
            case 'magus': return "/systems/pf2e/icons/classes/magus.webp";
            case 'monk': return "/systems/pf2e/icons/classes/monk.webp";
            case 'oracle': return "/systems/pf2e/icons/classes/oracle.webp";
            case 'ranger': return "/systems/pf2e/icons/classes/ranger.webp";
            case 'rogue': return "/systems/pf2e/icons/classes/rogue.webp";
            case 'sorcerer': return "/systems/pf2e/icons/classes/sorcerer.webp";
            case 'summoner': return "/systems/pf2e/icons/classes/summoner.webp";
            case 'swashbuckler': return "/systems/pf2e/icons/classes/swashbuckler.webp";
            case 'witch': return "/systems/pf2e/icons/classes/witch.webp";
            case 'wizard': return "/systems/pf2e/icons/classes/wizard.webp";

            case 'healing' : return "icons/magic/life/ankh-gold-blue.webp";
            case 'darkness': return "icons/magic/unholy/silhouette-evil-horned-giant.webp";

            case 'streamed' : return Deid.compile("{{{imgsrc 'shared' 'icons/online-avatar.webp'}}}");
            case 'starship' : return Deid.compile("{{{imgsrc 'shared' 'icons/starship.webp'}}}");


            default: 
            {
                Deid.Log.error('Unsupported section type ' + extype);
                return '';
            }
        }
    }

    section(ex)
    {
        return ex.subtype ?? (ex.section ?? null);
    }    

    link_of_replacement(replacement)
    {
        if(replacement.by != 'link')
        { return null; }

        return this._link(replacement);
    }

    collect_replacement_links(block)
    {
        let reps = block.replacement ? block.replacement : block.replacements;
        if(!reps)
        { return []; }

        if(reps instanceof Array)
        {
            let res = [];
            for(let rep of reps)
            {
                let u = this.link_of_replacement(rep);
                if(u)
                { res.push(u); }
            }
            return res;
        }
        else
        {
            let u = this.link_of_replacement(reps);
            return u ? [ u ] : [] ;
        }
    }

    collect_block_replacement_links(ex)
    {
        if(ex.block)
        { return this.collect_replacement_links(ex.block); }

        if(ex.blocks)
        {
            if(ex.blocks instanceof Array)
            {
                let res = [];
                for( let b of ex.blocks)
                { res = res.concat(this.collect_replacement_links(b)); }
                return res;
            }
        }

        return [];
    }

    generate_body_intro_treasure_inventory(ex)
    {
        let links = this.collect_block_replacement_links(ex);
        if(links.length == 0) return "";

        let result = 
              "<p class='helyx-p'><b>" 
            + game.i18n.localize("Helyx.Inventory") 
            + "</b> :"
        ;    

        for(let lnk of links) result += " " + lnk;

        result += '</p><hr/>';
        return result;
    }

    link_of_conversion(conversion)
    {
        let link = "";
        if(conversion.type == "text")
        {
            link = Deid.compile(conversion.content);
        }
        else
        {
            link = this._link(conversion)
        }
        return '<tr><td>' + Deid.compile(conversion.converted) + '</td>'
               + '<td>🠖</td>' 
               + '<td>' + link + '</td></tr>'
            ; 
        ;
    }

    collect_conversion_links(block)
    {
        let reps = block.conversion ? block.conversion : block.conversions;
        if(!reps)
        { return []; }

        if(reps instanceof Array)
        {
            let res = [];
            for(let rep of reps)
            {
                let u = this.link_of_conversion(rep);
                if(u)
                { res.push(u); }
            }
            return res;
        }
        else
        {
            let u = this.link_of_conversion(reps);
            return u ? [ u ] : [] ;
        }
    }    

    collect_block_conversion_links(ex)
    {
        if(ex.block)
        { return this.collect_conversion_links(ex.block); }

        if(ex.blocks)
        {
            if(ex.blocks instanceof Array)
            {
                let res = [];
                for( let b of ex.blocks)
                { res = res.concat(this.collect_conversion_links(b)); }
                return res;
            }
        }

        return [];
    }    
    
    generate_body_intro_conversion(ex)
    {
        return "";
        
        let links = this.collect_block_conversion_links(ex);
        if(links.length == 0) return "";

        let result = "<div class='helyx-conversions'>"
            + "<p class='helyx-p'><b>" 
            + game.i18n.localize("Helyx.PF2Conversion") 
            + "</b></p><table class='helyx-conversion-table'>"
        ;    

        for(let lnk of links) result += " " + lnk;

        result += '</table></div><hr/>';
        return result;    
    }        

    generate_body_intro_treasure(ex)
    {
        return this.generate_body_intro_treasure_inventory(ex) 
             + this.generate_body_intro_conversion(ex);
    }

    generate_body_intro(ex)
    {
        switch(this.section(ex))
        {
            case 'treasure' : return this.generate_body_intro_treasure(ex);
            default : return this.generate_body_intro_conversion(ex);
        }
    }

    render(ex)
    {
        let title = ex.title ? Deid.compile(ex.title) : "";
            

        let result = "";
        let sectionType = this.section(ex);

        let block_class = 'helyx-block-section-' + sectionType;

        result += "<div class='helyx-block-section " + block_class + "'>";

        let headerCssClass = 'helyx-header-' + sectionType;

        result += "<div class='helyx-block-section-header " + headerCssClass + "'>";

        if(ex.token)
        {
            let token = Deid.compile(ex.token);

            result += "<div class='helyx-block-section-token'>"
            + "<img src='" + token +"' class='helyx-exploration-token'></img>"
            + "</div>"
        }
        else 
        {
            let image = ex.img ? this.helyx.context.resolve_image(ex.img) : this._icon(sectionType);        

            result += "<div class='helyx-block-section-icon'>"
            + "<img src='" + image +"' class='helyx-exploration-icon'></img>"
            + "</div>"
        }
        let cssclass = "helyx-block-section-" + sectionType;
        result += '<div class="helyx-block-section-title">'
               + '<h3 class="' + cssclass +'" >' + title + ' ';
        
        result += '</h3></div>' ;

        result += "</div>"; // End header

        result += "<div class='helyx-block-section-body'>"

        result += this.generate_body_intro(ex);

        return result;
    }

    close(ex)
    {
        return "</div></div>";
    }
}    

export class HelyxBlockStatblock extends HelyxPart
{

    constructor(helyx, data = {}) 
    {
        super(helyx);
    }

    get blocktypes() { return [ "statblock" ]; }

    render(ex)
    {
        let result = "<div class='helyx-block-box'>";

        result += "<section class='statblock helyx-statblock'>"
                + Deid.compile(ex.statblock)
                + "</section>"
        ;

        result += "</div>";

        return result;

    }

    close(ex)
    { return ""; }
}    

export class HelyxBlockTable extends HelyxPart
{

    constructor(helyx, data = {}) 
    {
        super(helyx);
    }

    get blocktypes() { return [ "table" ]; }

    render(ex)
    {
        let result = "<table class='helyx-table'>"
        
        if(ex.title) 
        { result += "<caption>" + Deid.compile(ex.title) + "</caption>"; }

        result +="<tr>";

        if(ex.headers)
        for(let i = 0; i < ex.columns; ++i)
        {
            result += "<th";
            
            if(ex.column_classes)
            { result += " class='" + ex.column_classes[i] + "'"; }
                        
            result += ">" + Deid.compile(ex.headers[i]) + "</th>"; 
        }
        result += "</tr>";

        for(let i = 0; i < ex.lines.length; ++i)
        {
            result += "<tr>";
            let line = ex.lines[i];
            for(let c = 0; c < ex.columns; ++c)
            {
                result += "<td>" + Deid.compile(line[c]) + "</td>";
            }

            result += "</tr>";
        }

        result += "</table>"
        return result;
    }

    close(ex)
    { return ""; }
}    

export class HelyxConfiguration
{
    constructor() 
    {

        /************************************************************************/ 
        /*                                                                      */
        /*          CONFIGURATION                                               */ 
        /*                                                                      */ 
        /************************************************************************/

        this.moduleName = "helyx-maker-3";

        /*
            The module version must match the version defined in module.json
            It is used to identify content generated by a previous version and replace/erase it

        */    
        this.moduleVersion = "3.53";

        /*
            The module directory must match the relative directory where this module is installed

        */    
        this.moduleDirectory = "modules/helyx-maker-3";   

        /*

            The handlebars template directory

        */
       this.templatesDirectory = this.moduleDirectory + "/templates/exported";

        /*

            Sub directory of '/helyx' where shared resources between pdfs are stored

        */    
        this.resourcesDirectory = "shared";

        /*

            If false, don't extract raw images that doesn't match an image entry

        */    
        this.extractRawImages = true;


        /*
            For dev mode. If true, delete all items without folder
        */
       this.deleteRootItems = true;  
       
       /*
            If false, bypass export of pdf content to memory folder

       */
      this.extractPDFDetails = false;

       /*
            If true, unknow pdfs are imported
        */
        this.acceptUnknowPdf = true;

        /*
            If true, alway reload items
        */    
        this.alwayReloadItems = true;

        /*
            If true, consider items are always loaded
        */
        this.bundled = false;
    };    
}    
export class HelyxBlankAdventure
{
    static title = "Your adventure name";
    static nbPages = 999;
    static identification = { page: 99, block: 99, value: 'Some unique text that will identify your pdf' };
    static directory = "snake-case-name";
    static resourcesDirectories = [ "tokens" ];

    static fonts = 
    [


    ];

    static items = new Map();

    static folders = 
    [ 

    ];     

    static images = 
    [

    ];

    static add(obj)
    {
        HelyxBlankAdventure.imports.set(obj.helyx.idname, obj);
    }

    static itemsFiles = [  ];
}



export class HelyxHandleBars extends HelyxPart 
{
    constructor(helyx) 
    {
        super(helyx);
    }

    read(from, to, options)
    {
        return this.helyx.context.content.read(from, to, options);
    }

    read_content(instruction)
    {
        return this.helyx.context.content.read_content(instruction);
    }

    initHelpers()
    {
        let myself = this;

        Handlebars.registerHelper( "x", function(index)
        {
            let options = new HelyxTextOptions("");
            return myself.read( index, index, options);

        }); 

        Handlebars.registerHelper( "xf", function(from, flags)
        {
            let length = 0;
            let options = new HelyxTextOptions(flags);
            return myself.read( from, from+length, options);

        });

        Handlebars.registerHelper( "xl", function(from, length)
        {
            let options = new HelyxTextOptions("");
            return myself.read( from, from+length, options);

        });     
        
        Handlebars.registerHelper( "xlf", function(from, length, flags)
        {
           let options = new HelyxTextOptions(flags);
           return myself.read( from, from+length, options);

        });      

        Handlebars.registerHelper( "xyl", function(page, x, y, length)
        {           
           let content = new HelyxContentInstruction({op: 'xyl', src:{ page: page, x: x, y: y}, length: length});
           return myself.read_content(content);

        });         

        Handlebars.registerHelper( "pxyl", function(page, x, y, length, flags)
        {           
           let content = new HelyxContentInstruction({op: 'pxyl', src:{ page: page, x: x, y: y}, length: length});
           return myself.read_content(content);

        });              
        
        Handlebars.registerHelper( "xylf", function(page, x, y, length, flags)
        {           
           let content = new HelyxContentInstruction({op: 'xylf', src:{ page: page, x: x, y: y}, length: length, flags: flags});
           return myself.read_content(content);

        }); 

        Handlebars.registerHelper( "pxylf", function(page, x, y, length, flags)
        {           
           let content = new HelyxContentInstruction({op: 'pxylf', src:{ page: page, x: x, y: y}, length: length, flags: flags});
           return myself.read_content(content);

        }); 


        Handlebars.registerHelper( "slicexlf", function(fromBlock, blockLength, flags, fromSlice, sliceLength)
        {
           let options = new HelyxTextOptions(flags);
           let str = myself.read( fromBlock, fromBlock+blockLength, options);
           if(sliceLength)
           { return str.slice(fromSlice, fromSlice+sliceLength); }
           else
           { return str.slice(fromSlice);}

        });         

        Handlebars.registerHelper( "slicexylf", function(page, x, y, blockLength, flags, fromSlice, sliceLength)
        {
           let content = new HelyxContentInstruction({
                op: 'slicexylf', 
                src:{ page: page, x: x, y: y}, 
                length: blockLength, 
                flags: flags,
                from_slice: fromSlice,
                slice_length: sliceLength
            });


           return myself.read_content(content);

        }); 

        Handlebars.registerHelper( "px", function(index)
        {
            let length = 0;
            let options = new HelyxTextOptions("");
            return '<p class="helyx-p" >' + myself.read( index, index, options) + '</p>';

        });    

        Handlebars.registerHelper( "pxf", function(from, flags)
        {
            let length = 0;
            let options = new HelyxTextOptions(flags);
            return '<p class="helyx-p">' + myself.read( from, from+length, options) + '</p>';

        });

        Handlebars.registerHelper( "pxl", function()
        {
            const params = arguments[arguments.length - 1];

            let result  = '<p class="helyx-p">', 
                options = new HelyxTextOptions("")
            ;
            
            for(let i = 0; i < arguments.length - 1; i+=2) 
            {
                const from = arguments[i], length = arguments[i+1];
                result +=myself.read( from, from+length, options);
            }

            result += '</p>';
            return result;

        });      
        
        Handlebars.registerHelper( "pxlf", function(from, length, flags)
        {
            let options = new HelyxTextOptions(flags);
            return '<p class="helyx-p">' + myself.read( from, from+length, options) + '</p>';

        });     
        
        Handlebars.registerHelper( "sbxlf", function(from, length, flags)
        {
            let options = new HelyxTextOptions(flags);
            return '<p class="helyx-stat-block-section-title">' + myself.read( from, from+length, options) + '</p>';

        });       
        
        Handlebars.registerHelper( "sbxylf", function(page, x, y, length, flags)
        {           
           let content = new HelyxContentInstruction({op: 'xylf', src:{ page: page, x: x, y: y}, length: length, flags: flags});
            return '<p class="helyx-stat-block-section-title">' + myself.read_content(content) + '</p>';

        });             

        Handlebars.registerHelper("lnk", function(typeLink, idname)
        {
            return myself._link( { type: typeLink, idname: idname} );
        });

        Handlebars.registerHelper("packlnk", function(compendiumIdname, entryName)
        {
            return myself._packlink(compendiumIdname, entryName);
        });

        Handlebars.registerHelper("word", function(indexPdf, indexWord, flags)
        {
            let options = new HelyxTextOptions(flags ? flags : "");
            let str = myself.read(indexPdf, indexPdf, options);
            let words = str.split(' ');
            if(indexWord < words.length)
            { 
                let w = words.at(indexWord); 
                w = w.trim();
                if(w.endsWith(','))
                { w = w.slice(0, -1); }
                return w;
            }
            else 
            { return "Error"; }
        });

        Handlebars.registerHelper("journal-title", function(titleFrom, titleSize, flags, crFrom, crSize)
        {
            let titleTemplate = '{{{xlf ' + titleFrom + ' ' + titleSize + ' "' + flags + '"}}}';
            
            let crTemplate = crFrom ? ('{{{xlf ' + crFrom + ' ' + crSize + ' "tn"}}}') : '';

            return '<h2 class="helyx-journal-title" >' + Handlebars.compile(titleTemplate)() + ' ' 
                + '<span  class="helyx-room-cr" >'
                + Handlebars.compile(crTemplate)() 
                + '</span></h2>' ;
        });

        Handlebars.registerHelper("imgpath", function(idname)
        {
            let entry = myself.adventure.image(idname);
            if(entry == undefined)
            { return undefined; }

            return entry.saveFilename;
        });

        Handlebars.registerHelper("imgsrc", function(_mode, _param)
        {
            let filename = "";
            switch(_mode)
            {
                case "datas": filename += myself.adventure.datas_directory + "/"; break;
                case "shared" : filename += myself.adventure.shared_resources_directory + "/"; break;
                default: break;
            }

            filename += _param;

            return filename;
        });

        Handlebars.registerHelper("tokenpath", function(idname)
        {
            let entry = myself.adventure.token(idname);
            if(entry == undefined)
            { return undefined; }

            return entry.saveFilename;
        });

        // Ex : {{{skcheck 'seek' 17 'A' 'Perception'}}}
        Handlebars.registerHelper("check", function(action, dc, glyph, name)
        {
            return '@Check[type:' + action + '|dc:' + dc + ']';
            /*
            return '<span data-pf2-action="' + action 
                + '" data-pf2-dc=' + dc 
                +  ' data-pf2-glyph="' + glyph + '"><span data-visibility="gm">DC ' 
                + dc + '</span>' + name + '</span>'
            ; 
            */   
        });

        Handlebars.registerHelper("details",function()
        {
            const options = arguments[arguments.length - 1];

            let result = "<div class='helyx-action-details'>";
            //Skip the last argument.
            for(let i = 0; i < arguments.length - 1; ++i) 
            {
                result += Deid.compile("{{{" + arguments[i] + "}}}");
            }

            result += "</div>"
            return result;
        });

        Handlebars.registerHelper("hr",function()
        {
            return '<hr/>';
        });
    }
}

export class HelyxImporter extends HelyxPart 
{
    constructor(helyx) 
    { 
        super(helyx);

        this.imagesToExport = 0;
        this.imagesExported = 0;
        this.images = new Map();

        this.callbackWhenImportImagesDone = null;
    }

    async _import_image(pdfImage)
    { 
        let infos = this.images.get(pdfImage.name);
        if(infos == null)
        { return; }

        if( (!this.config().extractRawImages) && (infos.export == null))
        { return; }

        pdfImage.imgFilename = infos.imgFilename;
        pdfImage.imgDirectory = infos.imgDirectory;

        await this.helyx.gfx.saveImage(pdfImage, infos);

        infos.done = true;

        if( infos.export )
        { 
            this.imagesExported ++;

            let message = game.i18n.format("Helyx.Advance.ImageImport", {name : pdfImage.imgFilename});
            this.advance("image", message);
            Deid.Log.report("Images exported " + this.imagesExported + "/" + this.imagesToExport);
            if((this.imagesToExport == this.imagesExported) && (this.callbackWhenImportImagesDone))
            { this.callbackWhenImportImagesDone(); }


        }    
    }

    _new_image(infos)
    {
        let imgEntry = this.adventure.imageEntry(infos.position);
        if(imgEntry)
        {
            
            infos.done = false;
            infos.export = imgEntry;

            infos.imgFilename = imgEntry.idname;
            infos.imgDirectory = imgEntry.imgDirectory;

        }   
        else 
        {
            if(!this.config().extractRawImages)
            { return; }

            infos.imgFilename = infos.name + "_p" + infos.position.page + "_i" + infos.position.index; //infos.name;
            infos.imgDirectory = "/helyx/" + this.helyx.reader.adventure.idname ;
        }

        this.images.set(infos.name,infos); 
    }

    async importImages(callbackWhenDone)    
    {
        const myself = this;
        Deid.Log.report('Importing images...');

        this.imagesToExport = this.adventure.images ? this.adventure.images.length : 0;
        this.imagesExported = 0;        
        this.callbackWhenImportImagesDone = callbackWhenDone;

        this.helyx.pages = new Map();

        this.helyx.pdf.loopPage
        (
            this.helyx.pdfobj, 
            async function(pdf, page) 
            { 
                Deid.Log.report(" Begin Images de la page page " + page.pageNumber);
                myself.helyx.pdf.readPageImage
                (
                    page, 
                    function(infos) { myself._new_image(infos); },
                    async function(img) { myself._import_image(img); }
                );  
                myself.advance("image", "Images de la page " + page.pageNumber);               
            }
        ).then(function (){

            Deid.Log.report("Wait all pages are done");

            if(myself.imagesToExport == 0) 
            {
                if (myself.callbackWhenImportImagesDone)
                { myself.callbackWhenImportImagesDone(); }
                else
                { Deid.Log.error("importImages completed but no callback to execute"); }
            }
        });    
    }
}    
    
export class PdfContent {

    constructor(data = {}) {
        this.pages = [];
        this.indexes = [];
        this.nbPages = 0;
        this.images = new Map();
    }

    get source_language() { return game.helyx.context.source_language; }
    get source_fixes()    { return game.helyx.context.source_fixes; }

    set_nb_pages(nbPages) {
        this.nbPages = nbPages;
        for (let i = 1; i <= nbPages; i++) {
            this.pages[i] = [];
            this.indexes[i] = [];
        }
    }

    getNbPages() {
        return this.nbPages;
    }

    page_length(page)
    {
        if (page < 1 || page > this.nbPages) 
        { return 0; }

        return this.pages[page].length;
    }

    add(block)
    {
        this.pages[block.page][block.rank] = block;
        const xy_key = "" + Math.round(block.x) + " " + Math.round(block.y);
        if (this.indexes[block.page][xy_key])
        {
            this.indexes[block.page][xy_key].push(block.rank);
        } else {
            this.indexes[block.page][xy_key] = [block.rank];
        }
    }

    at(page, block) {
        if (page < 1 || page > this.nbPages) 
        { return undefined; }

        var refPage = this.pages[page];
        if (block < 0 || block >= refPage.length) {
            //console.log('at page:', page, ', length:', refPage.length, ', block:', block, ' block undefined');
            return undefined;
        }

        return refPage[block];
    }

    setImage(infos) {
        this.images.set(infos.name, infos);
        //Object.defineProperty(this.images, infos.name, { name: infos.name, width: infos.width, height: infos.height, raw: infos.raw });
    }

    getImage(key) { return this.images.get(key); }

    allImagesDone()
    {
        for(const [k, v] of this.images)
        {
            if(v.done)
            { continue; }

            console.log( 'Image not imported ' + v.name );
            return false;
        }
        return true;
    }

    font(n) {
        var p = Math.floor(n / 1000);
        var k = n % 1000;
        return this.pages[p][k].font;
    }

    block(index) {
        var p = Math.floor(index / 1000);
        var k = index % 1000;
        if (p <= this.pages.length) {
            if (this.pages[p] != null) {
                if (k < this.pages[p].length) { return this.pages[p][k]; }
            }
        }
        return undefined;
    }

    block_xy(page_index_, x_, y_) 
    {
        if (page_index_ < 1 || page_index_ > this.nbPages) 
        { return undefined; }           

        let page_indexes = this.indexes[page_index_], 
            key = "" + x_ + " " + y_;
        if (key in page_indexes) 
        {
            let rank = page_indexes[key];
            return this.pages[page_index_][rank];

        }
        return undefined;
    }

    content_to_html(content_)
    {
        let a = content_.area;
        if(a.is_xy())
        { return Deid.escape_html(content_.raw); }
        else
        { return this.read(a.page, a.index, { trim_tabs: true }); }
    }

    contents_to_html(contents_)
    {
        let res = "";
        for (let i = 0; i < contents_.length; ++i) {
            let content = contents_[i];
            res += this.content_to_html(content);
        }
        return res;
    }

    pageToHTML(page) {
        let res = "";
        if (this.pages[page]) 
        {
            for (let i = 0; i < this.pages[page].length; ++i) 
            {
                let n = this.pages[page][i];
                res += "<p>#" + i + " : [" + n.str + "] {length: " + n.str.length 
                 + ",font: " + JSON.stringify(n.font_decl) 
                 + ",at: (" + n.x + "," + n.y + ")}</p>\n";
            }
        }
        return res;
    }

    texts(pages) {
        var res = "";
        for (const n of pages) {
            var p = Math.floor(n / 1000);
            var k = n % 1000;

            if (p < this.pages.length) {
                if (this.pages[p] != null) {
                    if (k < this.pages[p].length) {
                        res += this.pages[p][k].str;
                    }
                }
            }
        }
        return res;
    }

    textRange(from, to, transformation) {
        var res = "";
        for (let i = from; i <= to; i++) {
            var p = Math.floor(i / 1000);
            var k = i % 1000;

            if (p < this.pages.length) {
                if (this.pages[p] != null) {
                    if (k < this.pages[p].length) {
                        if (transformation) {
                            res += transformation.transform(this.pages[p][k]);
                        } else {
                            res += this.pages[p][k].str
                        }
                    }
                }
            }
        }
        return res;
    }

    read_block(_block_index, _options)
    {
        const block = this.block(_block_index);

        if (block == undefined) 
        { Deid.Log.error('Failed to retrieve bits ' + _block_index); return " "; }

        if(_options == undefined)
        { _options = {}; }

        if(_options.debug)
        { Deid.Log.debug('_pdf block ' + i + '= ' + block.str); }

        if(block.str == '-')
        { return ""; }

        const fontFlags = block.font?.flags || {};
        //Deid.Log.debug('Looking for font ' + block.font + ' and got ' + JSON.stringify(fontFlags));

        let txt = block.str;

        if(_options.remove_numbers && txt.indexOf('(') != -1)
        { txt = txt.split('(')[0]; }


        if((fontFlags.glyphs) && (block.font.glyphs))
        {
            let glyphs = block.font.glyphs ?? [];
            let trimmed = txt.trim();
            if ((trimmed.length!= 0) && ( glyphs[trimmed]))
            { 
                txt = glyphs[ trimmed ];
            }
        }

        if(_options.glyphs)
        {
            const glyphs = this.glyphs;
            for(let i = 0; i < txt.length; ++i)
            {
                let c = "" + txt.charAt(i);
                if(glyphs[c])
                {
                    txt = Deid.replace(txt, i, glyphs[c]);
                }
            }
        }

        if(_options.nospace)
        { txt = Deid.remove_spaces(txt); }

        if(_options.upper)
        { txt = txt.toUpperCase(); }

        let localBold = (!_options.bold && fontFlags.bold && !_options.no_font_flags);
        let localItalic = (!_options.italic && fontFlags.italic && !_options.no_font_flags);
        let localExposant = (fontFlags.exposant && !_options.no_font_flags);

        if (localBold) { txt = '<b>' + txt + '</b>'; }
        if (localItalic) { txt = '<i>' + txt + '</i>'; }
        if(localExposant)  { txt = '<sup>' + txt + '</sup>';}

        return txt;        
    }


    apply_options(str_, options_, from_)
    {
        if(options_.trim_tabs)
        { str_ = str_.trim(); }

        if(options_.nodot)
        {
            let s = str_.trim();
            if(s.endsWith('.') || s.endsWith(':'))
            { str_ = s.slice(0, -1); }
        }    

        if(options_.no_dot_begin)
        {
            let s = str_.trim();
            if(s.startsWith('.') || s.startsWith(':'))
            { str_ = s.slice(1); }
        }    
        
        if(options_.capitalize_all)
        { str_ = Deid.capitalize_words(str_, this.source_language); }
        
        if(options_.singularize)
        { str_= Deid.singularize_words(str_, this.source_language); }
        
        if(options_.capitalize_first)
        { 
            let phrases = str_.split('. ');
            for(let j = 0; j  < phrases.length; j++)
            {
                let p = phrases[j];
                phrases[j] = p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
            }
            str_= phrases.join('. ');
        }    
        
        if(options_.sqbrackets)
        { str_= Deid.sqbrackets(str_); }
        
        if(options_.quote)
        { str_= '" ' + str_+' " '; }
        
        if(options_.pop_last_char)
        { str_= str_.slice(0, -1); }
        
        if(options_.right) { str_= '<span  class="helyx-pf2-cr" >' + str_+ '</span>'; }        
        
        if (options_.bold) { str_= '<b>' + str_+ '</b>'; }
        if (options_.italic) { str_= '<i>' + str_+ '</i>'; }        
        
        if(options_.fix)
        {
            let fn = this.source_fixes;
            if (fn)
            str_= fn(str_, from_);
        }
        
        return str_;
    }

           /**
     * 
     * @param {*} code 
     * @returns 
     * 
     * content bits format is '@PDFNUMBER,LENGTH,FLAGS' or 'RAW CONTENT'
     * So pdf source is detected by have first letter being '@'
     * In 'code', '@' has been already removed
     * 
     * flags can be 
     *    b : bold
     *    i : italic
     *    s : remove all spaces
     *    t : ignore fontflags
     *    r : span with align right
     * 
     */
    read(_from, _to, _options)
    {
    
        let str = "";
        for (let i = _from; i <= _to; i++) 
        {
            if((i != _from) && (_options.spaced))
            { str += ' '; }
                    
            str += this.read_block(i, _options);
        
        }
        
        return this.apply_options(str, _options, _from);
    }

    at_position(position_)
    {
        let str_index = "" + Math.round(position_.x) + " " + Math.round(position_.y);
        let length = 1;

        let str = "";

        let results = this.indexes[position_.page][str_index];
        if(results)
        {
            let index = results[0];
            index += position_.page * 1000;
            return this.block(index);
        }
        else { return null; }
    }

    xy_to_index(position_)
    {
        let str_index = "" + Math.round(position_.x) + " " + Math.round(position_.y);
        let results = this.indexes[position_.page][str_index];
        if(results)
        { return position_.page * 1000 + results[0]; }
        else { return null; }
    }

    read_content_xy(content_) 
    { 
        let length = content_.length;
        if(length == undefined || (length <= 0)) length = 1;

        let str = "";

        let index = this.xy_to_index(content_.position);
        const start_index = index;

        for (let i = 0; i < length; i++, index++) 
        {
            if((i != 0) && (content_.flags.spaced))
            { str += ' '; }
                    
            str += this.read_block(index, content_.flags);
        
        }

        return this.apply_options(str, content_.flags, start_index);
    }

    read_content(content_)
     {
        if(Deid.is_string(content_))
        { return content_; }

        if((content_ instanceof HelyxContentInstruction) == false)
        { content_ = new HelyxContentInstruction(content_); }

        switch(content_.op)
        {
            case 'raw':
            { return this.apply_options(content_.raw, {}, 0); }
            case 'xf':
            { return this.read(content_.src.index, content_.src.index, content_.flags); }
            case 'xlf': case 'xl':
            { return this.read(content_.src.index, content_.src.index + content_.length, content_.flags); }              
            case 'pxl':
            { return  '<p class="helyx-p">' + this.read(content_.src.index, content_.src.index + content_.length, content_.flags) + '</p>'; }   
            case 'xylf': case 'xyf': case 'xyl':
            { return this.read_content_xy(content_); }
            case 'pxyl': case 'pxylf': case 'pxyf':
            { return '<p class="helyx-p">' + this.read_content_xy(content_) + '</p>'; }
            case 'sbxlf':
            { return '<p class="helyx-stat-block-section-title">' + this.read(content_.src.index, content_.src.index + content_.length, content_.flags) + '</p>'; }
            case 'sbxylf':
            { return '<p class="helyx-stat-block-section-title">' + this.read_content_xy(content_) + '</p>'; }            
            case 'slicexlf':
            {
                let str = this.read(content_.src.index, content_.src.index + content_.length, content_.flags);
                if(content_.slice_length != -1)
                { return str.slice(content_.from_slice, content_.from_slice+content_.slice_length); }
                else
                { return str.slice(content_.from_slice);}
            }
            case 'slicexylf':
            {
                let str = this.read_content_xy(content_);
                if(content_.slice_length != -1)
                { return str.slice(content_.from_slice, content_.from_slice+content_.slice_length); }
                else
                { return str.slice(content_.from_slice);}
            }            
            default:
            { throw "Unknow content op " + content_.op; }            
        }
     }
    
    read_contents(contents_)
    {
        if(Deid.is_string(contents_))
        { contents_ = HelyxContent.build_contents(contents_); }

        if(contents_ instanceof HelyxContent)
        { return this.read_contents(contents_.contents); }
    
        if(Array.isArray(contents_) == false)
        { return this.read_content(contents_); }  

        let res = "";
        for(let i = 0; i < contents_.length; ++i)
        {
            res += this.read_content(contents_[i]);
        }
        return res;
    }

    index_to_xy(index_)
    {
        let page = Math.floor(index_ / 1000);
        let k = index_ % 1000;
        
        let ipage = this.indexes[page];
        for(const [key, value] of Object.entries(ipage))
        {
            if(value.includes(k))
            {
                let coords = key.split(' ');
                return { page: page, x: parseInt(coords[0]), y: parseInt(coords[1]) };
            }
        }

        return null;
    }

}
/**
 * Quick and dirty API around the Loading bar.
 * Does not handle conflicts; multiple instances of this class will fight for the same loading bar, but once all but
 * once are completed, the bar should return to normal
 *
 * @category Other
 */
 export class HelyxProgress 
 {

    constructor(steps = 1) {
        this.steps = steps;
        this.counter = 0;
        this.label = "";
        this.byTypes = new Map();
    }

    log()
    {
        let total = 0;
        for(const [k, v] of this.byTypes.entries())
        {
            total += v.length;
            //console.log("Progress #" + k + ": " + v.length + "\n" + JSON.stringify(v));
        }
    }

    advance(type, label) 
    {

        let u = this.byTypes.has(type) ? this.byTypes.get(type) : new Array();
        u.push(label);
        this.byTypes.set(type, u);

        this.counter += 1;
        this.label = label;
        this._updateUI();
    }

    close(label) {
        if (label) {
            this.label = label;
        }
        this.counter = this.steps;
        this._updateUI();
    }

    _updateUI() {
        const $loader = $("#helyx-progress");
        if ($loader.length === 0) return;
        const pct = Math.clamp((100 * this.counter) / this.steps, 0, 100);
        $loader.find("#helyx-progress-comment").text(this.label);        
        $loader.find("#helyx-progress-percent").text(`${this.counter} / ${this.steps}`);
        $loader.css({ display: "block" });
    }
}
export class HelyxFoundryFolders extends HelyxPart 
{
constructor(helyx) 
{ 
    super(helyx);
}
/**
 * 
 * @param {*} name    Name of the folder
 * @param {*} type    Type of the folder, Item, Actor, etc ...
 * @returns           The folder id
**/
id(name, type)
{
    const f = this.get(name.type);
    return f ? f._id : null;
}

get(name, type)
{
    for(const [key, value] of game.folders.entries())
    {            
        if( (value.name == name) && (value.type == type) )
        { return value; }
    };   
    return null;
}

get_child(parent, name)
{
    let real = game.folders.get(parent._id);
    for(let c of real.children)
    {
        if(c.folder.name == name) return c;
    }
    return undefined;
}


/**
 * 
 * @brief     Synchrone creation of a new foundry folder and return the id
 * @param {*} datas foundry VTT data object
 * @returns   return the id of the new folder
 * 
 * datas is an object with the following format
 * {
 *  name: folder name,
 *  type: VTT folder type, example "JournalEntry"
 *  parent: parent id
 *  sorting: "a" for alphabetic, "m" for manual ( insert oder )
 * }
 * 
**/
async create(datas) 
{
    let f = await Folder.create(datas);
    return f._id;
}

async _import_single(datas)
{
    Deid.Log.debug('Create folder #' + datas.idname);

    // Link to parent
    let parentEntry = datas.parent ? this.adv().folder(datas.parent): null;
    datas.parentId = parentEntry ? parentEntry._id : null;
    if((parentEntry == null) && (datas.parent))
    { 
        Deid.Log.error('... failed to find parent folder #' + datas.parent); 
        return;
    }

    // Transfer parent type if needed
    datas.type = datas.type ? datas.type : (parentEntry ? parentEntry.type : null);

    datas.name = Handlebars.compile(datas.name)();

    let current = parentEntry ? this.get_child(parentEntry, datas.name) : this.get(datas.name, datas.type);
    if(current)
    {
        // Memorize current id and type
        datas._id = current.folder ? current.folder._id : current._id;
        let message = game.i18n.format("Helyx.Advance.FolderAlreadyCreated", { name: datas.name});
        this.advance('folder', message);
        
    }
    else
    {

        datas._id = await this.create({name: datas.name, type: datas.type, parent: datas.parentId});   
        let message = game.i18n.format("Helyx.Advance.FolderCreated", {name: datas.name}); 
        this.advance('folder', message);
    }
    
}

/**
 * @brief     Import into foundry an array or a single entry of folders
 * @param {*} datas 
**/
async import(datas) 
{
    if(Array.isArray(datas))
    {   
        for( const entry of datas)
        { await this.import(entry); }
    } 
    else
    { await this._import_single(datas); }     
}

} // End of class
export class HelyxPF2 extends HelyxPart 
{
    constructor(helyx) 
    {
        super(helyx);

    }

    importFromCompendium(item)
    {
        var datas = this.searchInCompendiums(item.sourceName, "Item");
        if(datas == undefined)
        {
            Deid.Log.error("Failed to find item '" + item.sourceName + "' in compendiums");
            return undefined;
        }
        return datas;

    }

    importBackground(template, ex)
    {
        throw "Not implemented";

        let feat = ex.items['02x6c'];
        feat._id = this.entities().find( { name: feat.name, compendium: { key: 'pf2e.feats-srd'}} );

        if(feat._id == null)
        { Deid.Log.error(' Failed to link background to feat ' + feat.name); }
    }

    async importBackgrounds(b)
    {
        
        Deid.Log.debug('Import background entry ' + b.helyx.idname);
        let currentEntity = this.entities().find({ importName: b.helyx.idname, type: 'Item'});
        b._id = await this.entities().checkExisting(currentEntity);
        if( b._id != null)
        { 
            b.finalName = currentEntity.name;
            let message = game.i18n.format("Helyx.Advance.BackgroundAlreadyImported", { name: currentEntity.name});
            this.advance("item", message);
            return; 
        }

        var imported = this.importBackground(b);
        var model = { ... imported };
        model.name = imported.name;
        delete model._id;
        delete model.helyx;
            
        let folderEntry = this.helyx.adventure.folder(b.helyx.target);
        if ((folderEntry == null) || (folderEntry._id == null))
        { Deid.Log.error('Failed to find folder target ' + b.helyx.target); return; }
        model.folder = folderEntry._id;

        let res = await Item.create(model);
        this.entities().flag(res, b.helyx.idname);

        b._id = res._id;
        b.finalName = imported.name;

        let message = game.i18n.format("Helyx.Advance.BackgroundItemCreated", { name: imported.name});
        this.advance("item", message);
        
    }

    async importFeat(ex)
    {

    }

    async importEquipment(ex)
    {
        ex.type="equipment";
    }

    async importTreasure(ex)
    {
        ex.type = "treasure";
    }

    async completeModel(template, ex)
    {

        if(ex.name && ex.name.length != 0)
        { template.name = Deid.compile(ex.name); }

        delete template._id;

        if(!template.system)
        { template.system = {}; }

        if(!template.traits)
        { template.system.traits = {}; }

        if(!template.system.source)
        { template.system.source = {}; }

        if(ex.description)
        { template.system.description = { value: Deid.compile(ex.description)}; }

        if(ex.weight)
        { template.system.weight = { value : ex.weight }; }

        if(ex.price)
        { template.system.price  = { value : ex.price  }; } 

        if(ex.rarity)
        { template.system.traits.rarity = ex.rarity; }

        if(ex.img)
        { template.img = Deid.compile(ex.img); }
        
        if(ex.system)
        { mergeObject(template.system, ex.system); }
    }

    async import(ex)
    {
        if(ex.helyx.subtype == undefined)
        {
            Deid.Log.error("Import item #" + ex.helyx.idname + " without item type ");
            return;
        }

        let currentEntity = this.entities().find({ idname: ex.helyx.idname, type: 'Item'});
        ex._id = await this.entities().checkExisting(currentEntity);
        if( ex._id != null)
        { 
            ex.finalName = currentEntity.name;
            let message = game.i18n.format("Helyx.Advance.ItemAlreadyImported", { name: currentEntity.name });
            this.advance("item", message);
            return; 
        }

        if(ex.helyx.source == "compendium")
        {
            // Clone the datas
            let datas = await this.importFromCompendium(ex.helyx);

            if(datas == null)
            {
                Deid.Log.error("Fail to find item " + ex.helyx.sourceName + " in compendiums");
                return;
            }

            let model = { ... datas };

            model.folder = this.getTargetFolderId(ex.helyx.target);
            this.completeModel(model, ex);

            let res = await Item.create(model);
            ex.finalName = model.name;
            ex._id = res._id;
            await this.entities().flag(res, ex.helyx.idname);
            let message = game.i18n.format("Helyx.Advance.ItemCreated", { name : ex.finalName});
            this.advance("item", message);

            return;

        }        

        let template = { };
        this.completeModel(template, ex);
        
        template.system.source.value = this.adventure.title;        

        switch(ex.helyx.subtype)
        {
            case 'background' : await this.importBackground(template, ex); break; 
            case 'feat'       : await this.importFeat(template); break; 
            case 'equipment'  : await this.importEquipment(template); break; 
            case 'treasure'   : await this.importTreasure(template); break;
            default: 
            {
                Deid.Log.error("Import item #" + ex.helyx.idname + " with unimplemented item type '" + ex.helyx.subtype + "'");
                return;
            }
        }    

        let folderEntry = this.helyx.adventure.folder(ex.helyx.target);
        if ((folderEntry == null) || (folderEntry._id == null))
        { Deid.Log.error('Failed to find folder target ' + ex.helyx.target); return; }
        template.folder = folderEntry._id;

        console.log(JSON.stringify(template));
        let res = await Item.create(template);
        await this.entities().flag(res, ex.helyx.idname);

        ex._id = res._id;
        ex.finalName = res.name;

        let message = game.i18n.format("Helyx.Advance.ItemCreated", { name : ex.finalName});
        this.advance("item", message);
    }

    async importSystemItems(items)
    {
        if(items == null)
        { 
            Deid.Log.debug('... no items ?');
            return; 
        }

        for(const b of items)
        {
            if(b.helyx == null)
            { continue; }

            if(b.helyx.type = "background")
            { await this.importBackgrounds(b); }
            if(b.helyx.type = "treasure" )
            { await this.importTreasure(b); }

        }
    }

    pf2HandlebarsHelpers()
    {
        Handlebars.registerHelper("pf2tags", function( )
        {
            let res = '<section class="helyx-tags"> '
            
            for(let i = 0; i < arguments.length - 1; i +=2)
            {
                let val = arguments[i];
                let color = arguments[i+1];

                let template = '{{xl ' + val + ' 0}}';
                let tagStr = Handlebars.compile(template)();
                res += '<span class="helyx-tag"';
                
                if(color.length)
                { res +=' style="background-color: var(--' + color + ');"'; }

                res += '">' + tagStr + '</span> ';
            }
            res += '</section>';
            return res;
        });
    }

    initGameSystemHandlebarsHelpers()
    {
        this.pf2HandlebarsHelpers();
    }
}    
export class HelyxSystem extends HelyxPart 
{
    constructor(helyx) 
    { 
        super(helyx);
    }

    b64toBlob(b64Data, contentType, sliceSize) 
    {
        contentType = contentType || "";
        sliceSize = sliceSize || 512;
        var byteCharacters = atob(b64Data);
        var byteArrays = [];
    
        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) 
        {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) 
            { byteNumbers[i] = slice.charCodeAt(i); }
    
            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        
        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }    

  
}    
    
    
export class HelyxState 
{
    Status = {
        CLOSED: "CLOSED",
        INITING: "INITING",
        READY: "READY",
        STARTING: "STARTING",
        RUNNING: "RUNNING",
        STOPPING: "STOPPING",
        RELEASING: "RELEASING",
        ERROR: "ERROR"
    };

    #status = this.Status.CLOSED;
    #machine = null;
    #name = "";
    #index = -1;

    constructor(_machine, _options = { })
    {
        this.#machine = _machine;
        this.#status = this.Status.CLOSED;
        this.#name = _options.name;
        this.#index = _options.index;
    }

    get adventure() { return this.context.adventure; }
    get context() { return this.#machine.context; }
    get index() { return this.#index; }

    get name() { return this.#name; }

    status(_status)
    {
        if(_status)
        {
            Deid.Log.report("State #" + this.#name + " move to status " + _status);
            this.#status = _status;
        }
        return this.#status;
    }

    is_running()
    { return this.#status == this.Status.RUNNING; }

    proceed(_index)
    { this.#machine.state(_index); }

    end()
    { this.#machine.end(); }

    advance(_type, _message)
    {
        if(this.context.progress)
        {
            this.context.progress.advance(_type, _message);
            let message = _message + " : " + this.context.progress.counter + "/" + this.context.progress.steps;
            Deid.Log.report(message);
        }
    }

    block(_index)
    {
        return this.context?.block(_index);
    }

    at_position(position_)
    {
        return this.context?.at_position(position_);
    }

    contents(contents_)
    {
        return this.context?.content?.read_contents(contents_);
    }

    error(_reason)
    { 
        this.#status = this.Status.ERROR;
        Deid.Log.error("In state #" + this.#name + " : " + _reason); 
    }

    need_status(_status)
    {
        if(this.#status != _status)
        { throw( "In state #" + this.#name + ", state isn't " + _status); }
    }

    reset_progress(progress_)
    {
        if(this.context.progress)
        { this.context.progress.close(); }

        this.context.progress = progress_;     
    }

    async init() 
    {
        this.need_status( this.Status.CLOSED);
        this.#status = this.Status.INITING;

        let myself = this;

        let result = new Promise
        ( (resolve)  => { myself.do_init(); resolve(); });
        
        result.then (  ()         => { } )
              .catch(  (_reason)  => { myself.error(_reason); } )
        ;

        return result;
    }

    do_init()
    { this.status(this.Status.READY); }

    async start() 
    {
        this.need_status( this.Status.READY);
        this.#status = this.Status.STARTING;

        let myself = this;

        let result = new Promise
        ( (resolve)  => { myself.do_start(); resolve(); });
        
        result.then (  ()         => { } )
              .catch(  (_reason)  => { myself.error(_reason); } )
        ;

        return result;
    }

    do_start()
    { 
        this.status(this.Status.RUNNING);
    }

    async stop() 
    {

        this.need_status( this.Status.RUNNING);
        this.#status = this.Status.STOPPING;

        let myself = this;

        let result = new Promise
        ( (resolve)  => { myself.do_stop(); resolve(); });
        
        result.then (  ()         => { } )
              .catch(  (_reason)  => { myself.error(_reason); } )
        ;

        return result;
    }

    do_stop()
    { 
        this.status(this.Status.READY);
    }  

    async release() 
    {
        this.need_status( this.Status.READY);
        this.#status = this.Status.RELEASING;

        let myself = this;

        let result = new Promise
        ( (resolve)  => { myself.do_release(); resolve(); });
        
        result.then (  ()         => {  } )
              .catch(  (_reason)  => { myself.error(_reason); } )
        ;

        return result;
    }

    do_release()
    { this.status(this.Status.CLOSED); }
}    


export class Hyx
{
// Static log API
static Folder = class _FolderAPI extends HelyxFolderAPI{};
static Font = class _FontAPI extends HelyxFontAPI{};
static Pdf = class _PDFAPI extends HelyxPdfAPI{};
static FileSystem = class _FileSystem extends HelyxFileSystemAPI{};
static SceneTokens = class _SceneTokens extends HelyxSceneTokensAPI{};
}

// End of file
export class HelyxContext
{
    #configuration = {};
    #blocks = {};

    pdf_filename = "";
    import_images = true;
    import_mode = "normal";        // Values are normal or raw
    extract_all_images = false;
    
    pdf = {};
    helyx = {};

    constructor(_configuration = {})
    {
        this.#configuration = {..._configuration};
        this.#blocks = new HelyxBlocks(game.helyx);
    }

    get delete_root_entries () { return this.#configuration.deleteRootItems; }
    get extract_pdf_details () { return this.#configuration.extractPDFDetails; }
    get mode_maker          () { return this.#configuration.modeMaker; }      
    get module_name         () { return this.#configuration.moduleName; }
    get module_directory    () { return this.#configuration.moduleDirectory; }      
    get module_version      () { return this.#configuration.moduleVersion; }
    get templates_directory () { return this.#configuration.templatesDirectory; }

    set_identification(code_)
    {
        Deid.Log.debug('Code identification = ' + code_);
    }

    set_pdf_filename(filename_)
    { this.pdf_filename = filename_; }

    block(_index)
    {
        return this.content?.block(_index);
    }

    at_position(position_)
    {
        return this.content?.at_position(position_);
    }

    async import_single_folder(_datas) 
    {
        Deid.Log.debug('Create folder #' + _datas.idname);

        // Link to parent
        let parentEntry = _datas.parent ? this.adventure.folder(_datas.parent): null;
        _datas.parentId = parentEntry ? parentEntry._id : null;
        if((parentEntry == null) && (_datas.parent))
        { 
            Deid.Log.error('... failed to find parent folder #' + _datas.parent); 
            return '';
        }

        // Transfer parent type if needed
        _datas.type = _datas.type ? _datas.type : (parentEntry ? parentEntry.type : null);

        // Resolve folder name 
        let folder_name = this.content.read_contents(_datas.name);

        let current = parentEntry ? HelyxFolderAPI.get_child(parentEntry, folder_name) : HelyxFolderAPI.get(folder_name, _datas.type);
        if(current)
        {
            // Memorize current id and type
            _datas._id = current.folder ? current.folder._id : current._id;
            let message = game.i18n.format("Helyx.Advance.FolderAlreadyCreated", { name: folder_name});
            return message;
            
        }
        else
        {

            let folder_created = await Folder.create({name: folder_name, type: _datas.type, folder: _datas.parentId})
            
            _datas._id = folder_created._id;
            let message = game.i18n.format("Helyx.Advance.FolderCreated", {name: folder_name}); 
            return message;
        } 
    }       

    item_by_name(_item_map, helyx_)
    {
        let existingEntry = this.adventure.item(helyx_);
        if(existingEntry == null)
        { return null; }

        let ref = helyx_.ref ?? helyx_.idname;


        let expectedFlags = { idname: ref, source: this.adventure.title };

        for(const [key, value] of _item_map.entries())
        {
            let helyxFlags = value.getFlag(this.module_name, 'config');
            if(helyxFlags == null)
            { continue ; }

            if (Deid.match(helyxFlags, expectedFlags))
            { return value;}
        }    

        return null;
    }  

    compendium_entity_from_name(_compendium_key, _entity_name)
    {
        var compendium = Deid.compendium(_compendium_key);
        if(compendium == null)
        { 
            Deid.Log.error('Failed to find compendium ' + _compendium_key);
            return null; 
        }

        for(const [key, value] of compendium.index.entries())
        {            
            if(value.name == _entity_name)
            { return value; }

            if((value.translated) || (value.hasTranslation))
            {
                const original_name = value.flags?.babele?.originalName;
                if(original_name == _entity_name)
                { return value; }
            }
        }
        return undefined;        
    }

    item_link_v3(source_)
    {
        const source = source_.sources [ game.system.id ];
        if(source.type == "compendium")
        {
            const compendium = this.resolve_compendium( source.compendium );
            if(compendium)
            {
                return this.compendium_entity_from_name(compendium, source_.name);
            } 
        }

        Deid.Log.error('Unimplemented options for context::item_link_v3 : ' + JSON.stringify(source_));
        return null;
    }

    item(source_)
    {

        // DEPRECATED
        if(source_.name && source_.compendium)
        {

            const compendium = this.resolve_compendium( {...source_.compendium } );
            if(compendium.key)
            {
                return this.compendium_entity_from_name(compendium.key, source_.name);
            }    
        } 

        if((source_.idname) || (source_.ref)) switch(source_.type)
        {
            case 'Item' : return this.item_by_name(game.items, source_);
            case 'Actor':  return this.item_by_name(game.actors, source_);
            case 'Scene' : return this.item_by_name(game.scenes, source_);
            case 'JournalEntry' : return this.item_by_name(game.journal, source_);
            default: break;
        }

        Deid.Log.error('Unimplemented options for context::item : ' + JSON.stringify(source_));
        return null;

    }

    /**
     *  
     * @param {*} entity     null or an existing foundry entity
     * @returns              null if the current entity doesn't exist or is old
     * @returns             current entity id if it should be kept
     * 
     **/  
    async valid_imported_entity(_entity)
    {
        if(_entity == null)
        { return null; }
     
        let helyxFlags = _entity.getFlag(this.module_name, 'config');
        if(helyxFlags == null)
        { return null; }
     
        // compare entity current version with module version
        let cmpres = this.module_version.localeCompare(helyxFlags.version );
        if(cmpres == 0)
        {
            // Deid.Log.debug('... same version. Skip this entry');
            return _entity._id;
        }
        else if (cmpres < 1)
        {
            // Deid.Log.debug('... newer version. Skip this entry');
            return currentEntry._id;
        }
        else
        {
            // Deid.Log.debug('... older version. Must remove this old entry');
            return new Promise((resolve, reject) => 
            {
                _entity.delete();
                resolve();
            });                   
        }
    }

    async flag_item(_entity, _helyx_idname)
    {
        let myself = this;
        return _entity.setFlag
        (
            myself.module_name, 
            'config', 
            { 
                'idname': _helyx_idname,  
                'version': myself.module_version, 
                'source': myself.adventure.title 
            }
        );
    }

    compile_blocks(datas_,blocks_)
    {
        let result = "";
        for(let b of blocks_)
        { 
            result += this.#blocks.render(b); 
            this.#blocks.update(datas_, b);
        }
        return result;
    }

    compile_content(ex_,datas_)
    {
        if(ex_.img)
        { 
            if(ex_.helyx.type == "PageEntry" )
            { datas_.img = this.resolve_image(ex_.img); return; }

            else if(ex_.helyx.type == "Page" )
            {
                let title_style = this.adventure.styles?.page_title ?? "helyx-journal-title-default";

                let stylename = "", before = "", after = "";
                if (typeof title_style == "string")
                {
                    stylename = title_style;
                } else if (getType(title_style) === "Object")
                {
                    stylename = title_style.css_style;
                    before = title_style?.before;
                    after = title_style?.after;
                }

                let flags = {};
                flags [ this.module_name ] = { title: { 
                    title: datas_.name, 
                    css_style : stylename,
                    before: before,
                    after: after
                }};

                foundry.utils.mergeObject(datas_, {
                    type: "image",
                    image: { caption: datas_.name },
                    src:  this.resolve_image(ex_.img),
                    flags: flags
                });
                return;
            } 
            else return;
        }

        let content = '<div class="helyx-content">\n';
        if(ex_.blocks)
        { content += this.compile_blocks(datas_,ex_.blocks); }
        else if(ex_.content)
        { content += Deid.compile(ex_.content); }
        content += '<div class="helyx-content-notes" style="display:none"></div>';
        content += '</div>';

        if(ex_.helyx.type == "JournalEntry")
        { datas_.content = content; }
        else if(ex_.helyx.type == "Page")
        { 
            datas_.text = { format: 1, content: content, markdown: "" }; 
        } 
    }

    assemble_page(pagedef_)
    {
        let datas = { name: this.content.read_contents(pagedef_.name) };
        this.compile_content(pagedef_, datas);
        
        if(!datas.title) { datas.title = {}; }

        return datas;
    }

    resolve_image(img_)
    {
        if(typeof img_ == "string")
        {  return Deid.compile(img_); }

        if(img_ instanceof Array)
        {
            for(const i of img_)
            {
                let res = this.resolve_image(i);
                if(res != null)
                { return res; }
            }
            return null;
        }

        if(img_ instanceof Object)
        {
            if(img_.origin)
            { 
                // In the case the source is midjourney, the import must have the 'i accept midjourney generated content' flag
                if(img_.origin == "MJ")   
                {
                    if(!this.accept_midjourney_content)
                    { return null; }
                }
            }

            return Deid.compile(img_.src);
        }

        return null;
    }

    check_entry_condition(_conditions)
    {
        // If there is no condition, accept the entry
        if(!_conditions)
        { return true; }
            
        // Refuse the entry if it's a midjourney content and the import should accept MJ assets
        if( (_conditions.accept_midjourney_content) && (!this.accept_midjourney_content))
        { return false; }
        
        // All conditions are fullfilled, accept the entry
        return true;
    }

/**
 
    @brief                          Complete a compendium descriptor with the adventure path if needed
    @param {Object} key_            null or a string
    @retval         null            if descriptor_ is null
    @return                         A clone of descriptor_ with updated informations

**/
resolve_compendium(key_)
{
    switch(true)
    {
        case (key_ == null)          : return null;
        case (Deid.is_string(key_))  : return key_.startsWith('~') ? key_.replace('~', this.adventure.origin) : key_;
        default                      : 
        {
            const message = "In resolve compendium, unimplemented type case for key " + JSON.stringify(key_);
            Deid.Log.error(message);
            throw message;
        }            
    }
}     

/**
 
    @brief          Return an array of all images for a given page
    @param {Integer} page_number_ 
    @return {Array}

**/
images_per_page(page_number_)
{
    let result = [];
    for(let img of this.content.images)
    {
        if(page_number_ == img.position.page)
        { result.push(img); }
    }
    return result;
}


}    


export class HelyxMachine
{
    #context = {};
    #states = new Map();
    #current = null;

    constructor(_context)
    {
        this.#context = _context;
    }

    get context() {return this.#context; }

    async states(_states)
    {
        this.#states = new Map();
        for(let s of _states)
        {
            if(s == null) continue;

            const idx = s.index;

            if(idx == null)
            { Deid.Log.error( "State #" + s.name + " without index"); continue; }

            if(this.#states.has(idx))
            { Deid.Log.error( "Index @" + idx + " already affected to state " + this.#states.get(idx).name); }

            this.#states.set(idx, s);
        }

        let promises = [];
        for(let s of this.#states.values())
        { promises.push(s.init()); }

        return Promise.all(promises);
    }

    state(_index)
    {
        let next     = this.#states.get(_index);
        if(!next)
        {
            Deid.Log.error( "In HelyxMachine::state, state @" + _index + " doesn't exist");
            return;
        }
        const myself = this;

        let work = function()
        {
            myself.#current = next;
            myself.#current.start();
        };

        if(this.#current)
        { this.#current.stop().then( work ); }
        else 
        { work(); }
    }

    #release_all()
    {
        let promises = [];
        for(let s of this.#states.values())
        { 
            if(s == null) continue;
            promises.push(s.release()); 
        }

        return Promise.all(promises);        
    }

    #clear()
    {
        this.#states = new Map(); 
        this.#context = {}; 
        this.#current = {};
    }

    end()
    {
        let myself = this;
        this.#current.stop()
        .then( () => { myself.#release_all().then( () => { myself.#clear(); } )});
    }

}
export class StateImportPdfDialog extends HelyxState 
{
    #dialog = null;
    #import_state = -1;
    #cancel_state = -1;

    constructor(_machine, _options = { })
    {
        super(_machine, _options);
        this.#import_state = _options.import_state ?? -1;
        this.#cancel_state = _options.cancel_state ?? -1;
    }    

    dialog_import()
    {
        if(this.context.mode_maker)
        {
            this.context.import_images      =  $('#helyx-import-images').is(':checked');
            this.context.extract_all_images = $('#helyx-extract-all-images').is(':checked');
        }
        else
        {
            this.context.import_images      = true;
            this.context.extract_all_images = false;
        }  

        this.context.import_mode = "normal";

        this.#dialog.close();
        this.#dialog = null;

        this.proceed( this.#import_state);
    }

    dialog_cancel()
    {
        this.context.progress_dialog = null;
        this.proceed( this.#cancel_state);
    }

    do_start()
    {
        this.context.pdf_filename = "";
        const template = this.context.templates_directory + '/import_settings.hbs';
        return new Promise
        (
            async resolve => 
            {
                this.#dialog = new Dialog
                (
                    {
                        title: game.i18n.localize("Helyx.PDFImport"),
                        content: await foundry.applications.handlebars.renderTemplate(template, {}),
                        buttons: 
                        {
                            import: 
                            {
                                icon:     '<i class="fas fa-file-import"></i>',
                                label:    game.i18n.localize("Helyx.ImportAPDF"),
                                callback: () => { this.dialog_import(); }
                            },
                            cancel: 
                            {
                                icon:     '<i class="fas fa-times"></i>',
                                label:    game.i18n.localize("Helyx.Cancel"),
                                callback: () => { this.dialog_cancel(); }
                            }
                        }
                    }, 
                    { resizable: true, width: 650 }
                );
                this.context.progress_dialog = this.#dialog;

                this.status(this.Status.RUNNING);
                this.#dialog.render(true);
            }
        );
    }
}
export class StateSetupImportDialog extends HelyxState 
{
    #dialog = null;
    #next_state = -1;

    constructor(_machine, _options = { })
    {
        super(_machine, _options);
        this.#next_state = _options.next_state ?? -1;
    }  

    async #setup_import_dialog()
    {
        const   template     = this.context.templates_directory + '/progress.hbs',
        dialog_datas = { pdfFilename : this.context.pdf_filename };

        this.#dialog =  new Dialog
        (
            {
                title: "Helyx - Import",
                content: await foundry.applications.handlebars.renderTemplate(template, dialog_datas),
                buttons: 
                {
                   cancel: 
                   {
                        icon: '<i class="fas fa-times"></i>',
                        label: "Cancel"
                    }
                },
                render: html => Deid.Log.debug("Import dialog created"),
            }, { resizable: false, classes: [ "import-dialog"], width: 400, height: 250 }
        );
        this.context.progress_dialog = this.#dialog;

        this.status(this.Status.RUNNING);
        this.#dialog.render(true);

        this.proceed( this.#next_state); 
    }

    do_start()
    {
        let myself = this;
        return new Promise
        ( 
            function() 
            { 
                myself.#setup_import_dialog(); 
            }
        );
    }
}

// End
export class StateOpenPDF extends HelyxState 
{
    #next_state = -1;

    constructor(_machine, _options = { })
    {
        super(_machine, _options);
        this.#next_state = _options.next_state ?? -1;
    }  

    do_start()
    {
        let myself = this;
        return new Promise
        ( 
            function() 
            { 
                const pdf_worker_filename = myself.context.module_directory + "/src/pdf.worker.js";
                Deid.PDFJS.load_pdf(pdfjs, pdf_worker_filename, myself.context.pdf_filename).then(function (pdf) 
                {

                    // Set the pdf object
                    myself.context.pdf = pdf;

                    // Set the number of pages
                    myself.context.nb_pages = pdf._pdfInfo.numPages;

                    // Create a new content object
                    myself.context.content = new PdfContent; 
                    myself.context.content.set_nb_pages(myself.context.nb_pages);

                    // Next step
                    myself.status(myself.Status.RUNNING);
                    myself.proceed( myself.#next_state);        
                });
            }
        );
    }
}    

// End

export class StateReadPages extends HelyxState 
{
    #next_state = -1;
    #promises = [];
    #final_promise = {};
    #page_readed = 0;

    constructor(_machine, _options = { })
    {
        super(_machine, _options);
        this.#next_state = _options.next_state ?? -1;
    }  

    archive_page(page_, texts_)
    {
        let page_number = page_.pageNumber;
        for (var k = 0, kend = texts_.items.length; k < kend; k++) 
        {
            const block = texts_.items[k];

            let index = (page_number*1000) + k, 
                x = block.transform[4], 
                y = block.transform[5];        

            let entry = 
            {      
                index: index, 
                page: page_number, 
                rank: k, 
                str: block.str, 
                font_decl : { name: block.fontName, size: block.transform[0], color: block.color, desc: block.desc },
                x: x, 
                y: y, 
                direction: block.dir
            }
            this.context.content.add(entry);
        }
    }

    page_text_archived(page_number_)
    {
        Deid.Log.debug( "In state #" + this.name + ", readed page " + page_number_);
        this.#page_readed ++;

        let message = game.i18n.format
        (
            "Helyx.Advance.PageReaded", 
            { current : page_number_, readed : this.#page_readed, total :  this.context.nb_pages }
        );
        this.advance("pages", message);
    }

    async index_page_images(page_)
    {
        const ops = await page_.getOperatorList();
        const fns = ops.fnArray, args = ops.argsArray;  
        let x = -1, y = -1;
        for(let i = 0; i < fns.length; i++)
        {
            const fn =  fns[i];
            const arg = args[i];

            if(fn == Deid.PDF.OPS.transform)
            {
                x = arg[4];
                y = arg[5];
            }

            if(fn == Deid.PDF.OPS.moveTo)
            {
            }

            if ((fn < Deid.PDF.OPS.paintJpegXObject) || (fn > Deid.PDF.OPS.paintSolidColorImageMask))
            { continue; }

            const decl = 
            { 
                position: { page: page_number_, index: i, x:x, y:y }, 
                idname: "raw_p" + page_number_ + "_i" + i,
                target: "",
                
                noprogress: true
            };
            Deid.Log.debug("register image " + JSON.stringify(decl));
            this.context.images.declare(decl);
        }
    }

    read_page(_pdf, _page)
    {
        Deid.Log.debug( "In state #" + this.name + ", reading page " + _page.pageNumber);

        let myself = this;

        // get text content
        let promise = _page.getTextContent().then(function (text_content) 
        {
            if (null != text_content.items) 
            {
                myself.archive_page(_page, text_content);
                myself.page_text_archived( _page.pageNumber);
            }
        });

        // indexes images of the page


        this.#promises.push(promise);
    }

    complete_reading()
    {
        let myself = this;
        this.#final_promise = Promise.all( this.#promises )
            .then( () => { myself.status(myself.Status.RUNNING); myself.proceed( myself.#next_state); } );
    }

    do_start()
    {
        let myself = this;

        this.#promises = [];
        this.#page_readed = 0;

        // Set up the reading progress
        this.reset_progress ( new HelyxProgress(this.context.nb_pages)) ;     
        
        return Deid.PDFJS.loop_pages
        (
            this.context.pdf, 
            function(_pdf, _page) { myself.read_page(_pdf, _page);          }, 
            function()            { myself.complete_reading();    }
        );
    }
}

// End of file

export class StateIdentifyAdventure extends HelyxState 
{
    
#adventure_identified_state = -1;
#unknown_adventure_state = -1;

constructor(_machine, _options = { })
{
    super(_machine, _options);
    this.#adventure_identified_state = _options.adventure_identified_state ?? -1;
    this.#unknown_adventure_state    = _options.unknown_adventure_state ?? -1;
}  

/**
 
    @brief                                  Check if an adventure identification value matches the current pdf content 
    @param {HelyxAdventure} adventure_      An adventure descriptor
    @returns {boolean}                      Return true if the adventure matches 

**/
identify_adventure(adventure_)
{
    const identity = adventure_.identification;

    if(identity == undefined)
    {  Deid.Log.error('Adventure without identity'); return false; }

    const expected = identity.value;

    Deid.Log.debug('Adventure::identify for ' + this.name);

    let txt = "null_txt";

    if(identity.block)
    {
            
        let block1 = this.block(identity.page * 1000 + identity.block);
        txt = ((block1==null) ? "null_txt" : block1.str);
    }
    else if(identity.position)
    {
        Deid.Log.debug('Adventure::identify with position ' + JSON.stringify(identity.position));
        let block1 = this.at_position(identity.position);
        txt = ((block1==null) ? "null_txt" : block1.str);
    }

    Deid.Log.debug('compare \n"' + expected + '" and \n"' + txt + '"');

    if(expected.localeCompare(txt) == 0) 
    { return 1; }

    Deid.Log.debug('local compare failed');
    return 0; 

}

#when_identified(adventure_)
{
    const adventure_datas =  
    { 
        descriptor: adventure_.descriptor, 
        idname: adventure_.idname,
        datas_directory: adventure_.datas_directory, 
        origin : adventure_.origin,
        shared_resources_directory: adventure_.shared_resources_directory, 
        export_directory: adventure_.export_directory
    };
        
    this.context.adventure = new HelyxAdventure(game.helyx, adventure_datas);
    this.context.source_language = adventure_.language;
    this.context.source_fixes = adventure_.fixes;
    this.context.content.glyphs = adventure_.descriptor.glyphs;
}

identify_adventures()
{
    this.status(this.Status.RUNNING);

    for (const a of this.context.adventures) 
    {
        let code_identification = this.identify_adventure(a);
        
        if(code_identification != 0)
        {
           
            this.context.set_identification(code_identification);
            this.#when_identified(a);
            this.proceed( this.#adventure_identified_state );
            return;
        }
    }

    this.proceed( this.#unknown_adventure_state );
}        
    
do_start()
{
    let myself = this;
    return new Promise((resolve) => {myself.identify_adventures(); resolve(); });
}

}

// End

export class StateUnknownAdventure extends HelyxState 
{
    #dialog = null;

    constructor(_machine, _options = { })
    {
        super(_machine, _options);
    }  

    async #setup_unknown_adventure_dialog()
    {
        this.context.progress_dialog.close();
        delete this.context.progress_dialog;

        const   template     = this.context.templates_directory + '/unknowPdf.hbs';
        let dialogDatas = { pdfFilename : this.context.pdf_filename };
        let myself = this;

        this.#dialog =  new Dialog
        ({
                title: "Helyx - Echec",
                content: await foundry.applications.handlebars.renderTemplate(template, dialogDatas),
                buttons: 
                {
                    ok: 
                    {
                        icon: '<i class="fas fa-times"></i>',
                        label: "Ok"
                    }
                },
                render: html => Deid.Log.debug("Unknow pdf dialog created"),
        }, { resizable: false });

        this.status(this.Status.RUNNING);
        this.#dialog.render(true);

        this.end();
    }

    do_start()
    {
        let myself = this;
        return new Promise
        ( 
            function() 
            { 
                myself.#setup_unknown_adventure_dialog(); 
            }
        );
    }
}

export class StateCheckDependencies extends HelyxState 
{
    #next_state = -1;
    #dialog = null;

    constructor(_machine, _options = { })
    {
        super(_machine, _options);
        this.#next_state = _options.next_state ?? -1;
    }  

    #check_dependencies()
    {
        this.context.missing_dependencies = [];

        const global_dependencies = this.context.adventure.dependencies;

        // Check dependencies for the current game system
        if((global_dependencies) && (game.system.id in global_dependencies))
        {
            // Retrieve missing dependencies for the current system
            const current_system_missing_deps = Deid.check_dependencies(global_dependencies[game.system.id]);

            // Add to the list of missing deps 
            this.context.missing_dependencies = this.context.missing_dependencies.concat (current_system_missing_deps);
        }

        this.status(this.Status.RUNNING);
        this.proceed(this.#next_state);
    }

    do_start()
    {
        let myself = this;
        return new Promise ( () => { myself.#check_dependencies(); });
    }    
}    

// End
export class StateCheckConversion extends HelyxState 
{
    #next_state = -1;
    #dialog = null;

    constructor(_machine, _options = { })
    {
        super(_machine, _options);
        this.#next_state = _options.next_state ?? -1;
    }  

    async #no_conversion_found_dialog(_missings)
    {
        this.context.progress_dialog.close();
        delete this.context.progress_dialog;

        const   template     = this.context.templates_directory + '/missingDependencies.hbs';
        let dialogDatas = { adventure: this.adventure, currentSystem: game.system.title };

        this.#dialog = new Dialog
        ({
                    title: game.i18n.localize("Helyx.NoConversionFound"),
                    content: await foundry.applications.handlebars.renderTemplate(template, dialogDatas),
                    buttons: 
                    {
                        generate: 
                        {
                            icon: '<i class="fas fa-file-import"></i>',
                            label: "Générer une conversion",
                            callback: () => 
                            {
                                console.log("Generate");
                            }
                        },
                        cancel: 
                        {
                            icon: '<i class="fas fa-times"></i>',
                            label: game.i18n.localize("Helyx.Cancel")
                        }
                    },
                    render: html => Deid.Log.debug("Missing conversion dialog created"),
        }, { resizable: false });

        this.status(this.Status.RUNNING);
        this.#dialog.render(true);        

        this.end();
    }

    #check_conversion(_conversion_mode)
    {

        if(_conversion_mode == 'failed')
        {
            this.#no_conversion_found_dialog();
            return;
        }

        if(_conversion_mode == 'default')
        {
            console.log("Default conversion");
        }

        if (_conversion_mode == 'external')
        {
            console.log("External conversion");
        }

        this.status(this.Status.RUNNING);
        this.proceed( this.#next_state);
    }

    do_start()
    {
        let myself = this;
        return myself.context.adventure.conversionMode()
               .then( (_conversion_mode) => { myself.#check_conversion(_conversion_mode); })
        ;
    }    
}    

// End
/**
 
    @brief          Load external definitions from json files

**/
export class StateLoadFiles extends HelyxState 
{

#next_state = -1;
#fonts = [];
#images = [];
#scenes_elements = [];
#art_map = [];

constructor(_machine, _options = { })
{
    super(_machine, _options);
    this.#next_state = _options.next_state ?? -1;
}

#font_loaded( font_ )
{ 
    // Fix font position
    if((font_.src) && !(font_.src instanceof HelyxPdfPosition))
    { font_.src = new HelyxPdfPosition(font_.src); }

    // Finx font index
    if(font_.src)
    { font_.position = this.context.content.xy_to_index(font_.src); }

    this.#fonts.push(font_); 
}

async #load_fonts()
{
    const fonts_files = this.adventure.descriptor.fonts_files;
    if(!fonts_files) 
    { return; }

    this.#fonts = [];

    let items_directory = this.adventure.datas_directory + '/items/' + this.adventure.idname ;
    let myself = this;
    await Deid.load_json_files(items_directory, fonts_files, function(entry_) { myself.#font_loaded(entry_.item); });
    this.adventure.descriptor.fonts = this.#fonts;
}

#image_loaded( image_ )
{ this.#images.push(image_); }

async #load_images()
{
    const files = this.adventure.descriptor.images_files;
    if(!files) 
    { return; }

    this.#images = [];

    let items_directory = this.adventure.datas_directory + '/items/' + this.adventure.idname ;
    let myself = this;
    await Deid.load_json_files(items_directory, files, function(entry_) { myself.#image_loaded(entry_.item); });
    this.adventure.descriptor.images = this.#images.filter(img => (img.idname != null));
}

#declare_images()
{
    this.context.images = new ImagesImport();
    this.context.images.declare( this.context.adventure.images );
}

#scene_element_loaded( element_ )
{ this.#scenes_elements.push(element_); }

async #load_scenes_elements()
{
    const files = this.adventure.descriptor.scenes_elements_files;
    if(!files) 
    { return; }

    this.#images = [];

    let items_directory = this.adventure.datas_directory + '/items/' + this.adventure.idname ;
    let myself = this;
    await Deid.load_json_files(items_directory, files, function(entry_) { myself.#scene_element_loaded(entry_.item); });
    this.adventure.descriptor.scenes_elements = this.#scenes_elements;
}

#art_element_loaded( element_ )
{ this.#art_map.push(element_); }

async #load_art_map()
{
    const files = this.adventure.descriptor.art_map_files;
    if(!files)
    { return; }

    this.#art_map = [];
    let items_directory = this.adventure.datas_directory + '/items/' + this.adventure.idname ;
    let myself = this;
    await Deid.load_json_files(items_directory, files, function(entry_) { myself.#art_element_loaded(entry_.item); });
    this.adventure.descriptor.art_map = this.#art_map;

}

async #proceed_next_state()
{
    let myself = this;
    return new Promise( () => { myself.proceed(myself.#next_state); });
}

async #load_files()
{
    this.status(this.Status.RUNNING);

    // We don't load files in bundle mode because they are supposed to be inserted by the bundler
    if (this.adventure.config().bundled)
    {  
        this.#declare_images();
        return this.#proceed_next_state(); 
    }

    // If force reload, ignore previous loading
    if(this.adventure.config().alwayReloadItems)
    { 
        Deid.Log.report("Reset adventure items");
        this.adventure.descriptor.alreadyLoaded = false;
    }

    // detect previous loading. If true, don't reload
    const already_loaded = this.adventure.descriptor.alreadyLoaded || false;

    if(already_loaded)
    {  return this.#proceed_next_state(); }

    await this.#load_fonts();
    await this.#load_images();
    this.#declare_images();
    await this.#load_scenes_elements();
    await this.#load_art_map();

    return this.#proceed_next_state();
}


/**
 
    @brief              Implement HelyxState.do_start
    @returns Promise    Promise to execute

**/
do_start()
{
    let myself = this;
    return new Promise((resolve) => {myself.#load_files(); resolve(); });
}

}
export class StateLoadItems extends HelyxState 
{
    #next_state = -1;

    constructor(_machine, _options = { })
    {
        super(_machine, _options);
        this.#next_state = _options.next_state ?? -1;
    }  

    add_item(adventure_, entry_)
    {
        let bundled = adventure_.config().bundled;
        if(entry_.helyx)
        { 
            switch(entry_.helyx.type)
            {
                case 'Actor' : entry_ = new HelyxActor(entry_); break;
                case 'Item'  : entry_ = new HelyxEquipment(entry_); break;
                case 'JournalEntry' : entry_ = new HelyxJournalEntry(entry_); break;
                case 'Scene' : break;
                default: 
                {
                    Deid.Log.error("Unsupported item type for entry " + entry_.helyx.type);
                    break;
                }
            }

            if(bundled)
            { adventure_.setItem(entry_); }
            else
            { adventure_.addItem(entry_); }
        }
    }

    build_bundled_item(adventure_)
    {
        for( let item of adventure_.descriptor.items.values() )
        {
            this.add_item(adventure_, item);
        }
    }

    async #load_items()
    {
        this.status(this.Status.RUNNING);
        let adv = this.context.adventure, myself = this;

        if (adv.config().bundled)
        {  return new Promise( () => { myself.build_bundled_item(adv); myself.proceed(myself.#next_state); }); }

        if(adv.config().alwayReloadItems)
        { 
            Deid.Log.report("Reset adventure items");
            adv.descriptor.alreadyLoaded = false; adv.descriptor.items = new Map(); 
        }

        let alreadyLoaded = adv.descriptor.alreadyLoaded || false;

        if(alreadyLoaded)
        {  return new Promise( () => { myself.proceed(myself.#next_state); }); }

        // Reset order
        adv.descriptor.import_order = [];

        let items_directory = adv.datas_directory + '/items/' + adv.idname ;
        await Deid.load_json_files
        (
            items_directory, adv.descriptor.itemsFiles, 
            function(entry_) 
            { 
                if(entry_.item?.helyx) { myself.add_item(adv, entry_.item); }
            }
        );

        adv.descriptor.alreadyLoaded = true;
        myself.proceed(myself.#next_state); 

    }

    do_start()
    {
        let myself = this;
        return new Promise((resolve) => {myself.#load_items(); resolve(); });
    }    
}    

// End
export class StatePreImport extends HelyxState 
{
    #next_state = -1;
    #dialog = null;

    constructor(_machine, _options = { })
    {
        super(_machine, _options);
        this.#next_state = _options.next_state ?? -1;
    }  

    #steps()
    {
        let adv = this.context.adventure;
        let nbPages = this.context.nb_pages ?? 0;
        let nbPagesCount = (this.context.nb_pages && this.context.extract_pdf_details) ? nbPages : 0;
        let nbFolders = adv.folders ? adv.folders.length : 0;

        // Number of step to extract raw images. If not skiped and flagged to import, equal to the number of pages
        let nbPagesImages =  this.context.extract_all_images ? nbPages : 0;
        let nbImages  = this.context.import_images ? (adv.images ? adv.images.length : 0) : 0;

        let nbItems = adv.items ? adv.items.size : 0;

        let nbArt = adv.descriptor.art_map ? adv.descriptor.art_map.length : 0;
        if(nbArt >  0) nbArt ++;

        // Page are preloaded now
        Deid.Log.report('Nb Pages ' + nbPagesCount);
        Deid.Log.report('Nb folders ' + nbFolders);
        Deid.Log.report('Nb Pages images ' + nbPagesImages );
        Deid.Log.report('Nb images ' + nbImages);
        Deid.Log.report('Nb items ' + nbItems);
        Deid.Log.report('Nb art map ' + nbArt);

        return nbPagesCount + nbFolders + nbPagesImages + nbImages + nbItems + nbArt;
    }

    #prepare()
    {
        this.status(this.Status.RUNNING);
        let adv = this.context.adventure, myself = this;
        adv.resolve_fonts(this.context.content);
        adv.computeImageDirectories();

        let nbSteps = this.#steps();
        Deid.Log.report('There is ' + nbSteps + ' steps');
        this.context.progress = new HelyxProgress( nbSteps );
        $('#helyx-pdf-name').text( adv.title );

        this.proceed(this.#next_state);
    }

    do_start()
    {
        let myself = this;
        return new Promise ( () => { myself.#prepare(); });
    }    
}    

// End
export class StateImportFolders extends HelyxState 
{
    #next_state = -1;

    constructor(_machine, _options = { })
    {
        super(_machine, _options);
        this.#next_state = _options.next_state ?? -1;
    }  

    async #import_entries(_entries)
    {
        if(Array.isArray(_entries))
        {   
            let promises = [];
            
            for( const entry of _entries)
            { await this.#import_entries(entry); }

            return Promise.all(promises);
        } 
        else
        { 
            return this.context.import_single_folder(_entries)
            .then( (_message_result) => { if (_message_result) this.advance('folder', _message_result); });
        }
    }

    async #import_folders()
    {
        this.status(this.Status.RUNNING);
        let datas = this.context.adventure.folders;
        let myself = this;


        return this.#import_entries(datas)
        .then( () => { myself.proceed(myself.#next_state);} );  
    }

    do_start()
    {
        return this.#import_folders();
    }    
}    

// End
export class StateImportImages extends HelyxState 
{
    static RINGS = 
    {
        "red_sfrpg" : { "filename" : "{{{imgsrc 'shared' 'rings/red_sfrpg.png'}}}", "width": 727, "deltay": 58, "deltax": 58, "type": "CIRCLE" },
        "green_sfrpg" : { "filename" : "{{{imgsrc 'shared' 'rings/green_sfrpg.png'}}}", "width": 727, "deltay": 58, "deltax": 58, "type": "CIRCLE" },
        "green_bamboo" : { "filename" :"{{{imgsrc 'shared' 'rings/green_bamboo.png'}}}", "width": 855, "deltay": 85, "deltax": 85, "type": "CIRCLE" },
        "red_evil" : { "filename" : "{{{imgsrc 'shared' 'rings/red_evil.png'}}}", "width": 811, "deltay": 111, "deltax": 109, "type": "CIRCLE" },
        "green_marble" : { "filename" : "{{{imgsrc 'shared' 'rings/green_marble.png'}}}", "width": 811, "deltay": 111, "deltax": 109, "type": "CIRCLE" },
        "starship_hexa_frame" : 
        {  
            type: "HEXA", filename : "{{{imgsrc 'shared' 'rings/sfrpg_hexa_frame.png'}}}", 
            width: 1024, map_width: 750,
            deltay: 150, deltax: 135, radius: 450, 
        }
    };



    #next_state = -1;

    // If true, the pdf is well formed and i don't need to extract all image from all pages, 
    // only pages with images i want
    #skip_pages_without_images = false;

    constructor(_machine, _options = { })
    {
        super(_machine, _options);
        this.#next_state = _options.next_state ?? -1;
    }  

    async #create_directories()
    {
        // Directories are created in the foundry 'Data' space
        const adv    = this.context.adventure;

        // Create adventure main resources directory
        if(!adv.idname)
        { 
            Deid.Log.error("Adventure #" + adv.title + " without main resources directory");
            return this.end();
        }  

        let promises = await Hyx.FileSystem.create_directories(adv.export_directory, adv.resources_directories);
       
        if (this.context.extract_raw_images)
        {
            let raw_images_directory = "/helyx/" + adv.export_directory;
            promises.push(Hyx.FileSystem.mkdir(raw_images_directory));
        }

        return Promise.all(promises);        
    }

    #new_image(infos)
    {
        if(this.is_running() == false )
        { return; }

        let imgEntry = this.adventure.imageEntry(infos.position);
        if(imgEntry)
        {
            infos.done = false;
            infos.export = imgEntry;

            infos.imgFilename = imgEntry.idname;
            infos.imgDirectory = imgEntry.imgDirectory;

        }   
        else 
        {
            if(!this.context.extract_all_images)
            { return; }

            this.context.nb_images_to_export ++;

            infos.idname = "raw_p" + infos.position.page + "_i" + infos.position.index;
            infos.imgFilename =  infos.idname; //infos.name;
            infos.imgDirectory = "/helyx/" + this.adventure.export_directory ;
            infos.saveFilename = infos.imgDirectory + "/" + infos.imgFilename + ".webp";
        }

        this.images.set(infos.name,infos); 
    }

    async save_blob_image(_blob, infos)
    {                
        let drawn = Deidril_GFX_API.draw_pdf_image(img);

        var dt = drawn.canvas.toDataURL("image/webp");
        const prefix = "data:image/webp;base64,";
        
        if(dt.startsWith(prefix))
        {
            dt = dt.slice(prefix.length);
            var bloub = Deidril_GFX_API.b64toBlob(dt, "image/webp");
            return Deid.upload(bloub, img.imgDirectory, img.imgFilename);
        }
        else return true;

    }

    #image_imported(_infos)
    {
        this.context._nb_images_exported ++;

        let message = game.i18n.format("Helyx.Advance.ImageImport", {name : _infos.imgFilename});

        if(!_infos.noprogress)
        { this.advance("image", message); }

        Deid.Log.report(
            "Images exported " + this.context._nb_images_exported + "/" 
            + this.context.nb_images_to_export + " in " + _infos.imgFilename + " from " + JSON.stringify(_infos.position)
        );
    }

    #create_mask(context_, token_entry_)
    {
        const mask = document.createElement("canvas");
        mask.toDataURL('image/webp').indexOf('data:image/webp');
        mask.style.width = token_entry_.w;
        mask.style.height = token_entry_.h;
        mask.width = token_entry_.w;
        mask.height = token_entry_.h;

        const ctxMask = mask.getContext("2d");

        try 
        {
            const source = context_.getImageData(token_entry_.x, token_entry_.y, token_entry_.w, token_entry_.h);
            ctxMask.putImageData(source, 0, 0);
        }
        catch(e)    
        {
            Deid.Log.error('Failed to build token ' + token_entry_.idname);
            throw e;
        }

        // Set xor operation
        ctxMask.globalCompositeOperation = 'xor';

        return { mask: mask, context: ctxMask};
    }

    #draw_mask(ring_, ctx_, deltax_, deltay_)
    {
        if(ring_.type == "CIRCLE")
        {
            ctx_.beginPath();
            ctx_.arc( deltax_ + ring_.width/2, deltay_+ring_.width/2, ring_.width/2, 0, 2*Math.PI);
            ctx_.clip();
        }
        else if(ring_.type == "HEXA")
        {
            ctx_.beginPath();
            const x = (ring_.width/2);
            const y = (ring_.width/2); 
            const r = ring_.radius;
            const a = 2 * Math.PI / 6;
            for (var i = 0; i < 6; i++) 
            {
                ctx_.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
              }
            ctx_.clip();
        }
    }

    async #save_custom_ring(context_, token_entry_)
    {
        const ring = StateImportImages.RINGS[ token_entry_.model];
        if(ring == null) return;

        const ring_width  = ring.width ?? (token_entry_.w / 15);
        const ring_map_width = ring.map_width ?? ring_width;

        const resolved_filename = Deid.compile(ring.filename);
        let ring_img = null;
        
        try { ring_img = await Deid.Gfx.load_image(resolved_filename); }
        catch(error) { Deid.Log.error('Failed to load image ' + resolved_filename); throw error; }

        const cn = document.createElement("canvas");
        cn.toDataURL('image/webp').indexOf('data:image/webp');
        cn.style.width = ring_img.width;
        cn.style.height = ring_img.height;
        cn.width = ring_img.width;
        cn.height = ring_img.height;

        const ctx = cn.getContext("2d");
        let mask_object = this.#create_mask(context_, token_entry_);
        let mask = mask_object.mask, mask_context = mask_object.context;

        //ctx.beginPath();
        //ctx.arc(cn.width/2, cn.height/2, cn.width/2, 0, 2*Math.PI);
        //ctx.clip();

        const ringmask = document.createElement("canvas");
        ringmask.toDataURL('image/webp').indexOf('data:image/webp');
        ringmask.style.width = cn.width;
        ringmask.style.height = cn.height;
        ringmask.width = cn.width;
        ringmask.height = cn.height;

        ctx.drawImage(ring_img, 0, 0, cn.width, cn.height);

        const deltax = ring.deltax ?? 0, 
        deltay = ring.deltay ?? 0;

        if(token_entry_.background)
        {
            ctx.fillStyle = token_entry_.background;
            ctx.fill();

            this.#draw_mask(ring, ctx, deltax, deltay);
        }
        else 
        {
            this.#draw_mask(ring, ctx, deltax, deltay);

            ctx.fillStyle = "white";
            ctx.fill();
        }

        ctx.drawImage(mask, deltax, deltay, ring_map_width, ring_map_width);
        ctx.drawImage(ring_img, 0, 0, cn.width, cn.height);
        //ctx.strokeRect(ring_width, ring_width, mask.width, mask.height);

        return cn;
    }

    #save_rect_part(context_, token_entry_)
    {
        const cn = document.createElement("canvas");
        cn.toDataURL('image/webp').indexOf('data:image/webp');
        cn.style.width = token_entry_.w ;
        cn.style.height = token_entry_.h ;
        cn.width = token_entry_.w ;
        cn.height = token_entry_.h ;

        const ctx = cn.getContext("2d");
        let mask_object = this.#create_mask(context_, token_entry_);
        let mask = mask_object.mask, mask_context = mask_object.context;

        if(token_entry_.background)
        {
            ctx.fillStyle = token_entry_.background;
            ctx.fillRect(0, 0, cn.width, cn.height);
            ctx.fill();
        }

        ctx.drawImage(mask, 0, 0);

        return cn;
    }

    #save_colored_ring(context_, token_entry_)
    {
        const ring_width = token_entry_.w / 15;
        const cn = document.createElement("canvas");
        cn.toDataURL('image/webp').indexOf('data:image/webp');
        cn.style.width = token_entry_.w ;
        cn.style.height = token_entry_.h ;
        cn.width = token_entry_.w ;
        cn.height = token_entry_.h ;

        const ctx = cn.getContext("2d");
        let mask_object = this.#create_mask(context_, token_entry_);
        let mask = mask_object.mask, mask_context = mask_object.context;

        ctx.beginPath();
        ctx.arc(cn.width/2, cn.height/2, cn.width/2, 0, 2*Math.PI);
        ctx.clip();

        ctx.fillStyle = "white";
        ctx.fill();

        ctx.drawImage(mask, 0, 0);

        ctx.lineWidth = ring_width;
        ctx.strokeStyle = token_entry_.color ?? "green";
        ctx.stroke();

        return cn;
    }

    #resolve_token_type(token_entry_)
    {
        if(token_entry_.shape && token_entry_.shape == "rect")      return 'rectangle';
        if(token_entry_.model) return 'custom_ring';

        return 'colored_ring';

    }

    async #save_part(context_, token_entry_)
    {
        const token_type = this.#resolve_token_type(token_entry_);

        let target = null;
        switch(token_type)
        {
            case 'rectangle' : target = this.#save_rect_part(context_, token_entry_); break;
            case 'colored_ring' : target = this.#save_colored_ring(context_, token_entry_);  break;
            case 'custom_ring' : target = await this.#save_custom_ring(context_, token_entry_); break;
            default: return;
        }

        var dt = target.toDataURL("image/webp");
        const prefix = "data:image/webp;base64,";
        
        if(dt.startsWith(prefix))
        {
            dt = dt.slice(prefix.length);
            var bloub = Deid.Gfx.b64_to_blob(dt, "image/webp");
            await Deid.upload(bloub, token_entry_.imgDirectory, token_entry_.idname);
        }  
    }


    async #import_image(pdfImage)
    { 
        let infos = this.images.get(pdfImage.name);
        let myself = this;
        
        if(infos == null)
        { return; }

        if( (!this.context.extract_all_images) && (infos.export == null))
        {
            return; 
        }

        pdfImage.imgFilename = infos.imgFilename;
        pdfImage.imgDirectory = infos.imgDirectory;

        let transformation = infos.export?.transformation;

        let drawn = Deid.Gfx.pdf_image_to_blob(pdfImage, transformation);
        if(drawn?.image)
        {

            await Deid.upload(drawn.image, pdfImage.imgDirectory, pdfImage.imgFilename)

            if(infos && infos.export && infos.export.tokens)
            {
                for(let token of infos.export.tokens)
                {
                    await this.#save_part(drawn.context, token);
                }
            }
            myself.#image_imported(infos);

        }
        
        
        return infos; 
    }

    async #obj(page_, name_)
    {
        const obj = page_.objs._objs[name_];
        let result = null;

        if( (obj) && (obj.resolved))
        { 
            result = obj.data;
            if(result instanceof Promise)
            { 
                result = await result.then( img => { result = img; });
            }
        }
        else 
        {
            Deid.Log.report("Can't retrieve datas of img " + name_);
        }
        return result;
    }

    async #do_import_image(image_, page_, args_, fns_)
    {
        let infos = { name: "", width: 0, height: 0, raw : "" };
        infos.name = args_[0];
        infos.width = args_[1];
        infos.height = args_[2];
        infos.imageType = fns_; 
        infos.position = image_.position;
        infos.noprogress = image_.noprogress;

        if(infos.name.length)
        {
            this.#new_image(infos);
            this.context.content.setImage(infos); 
        }

        if(!infos.imgFilename) return;

        let exportedImg = this.context.content.getImage(args_[0]);
        exportedImg.obj = await this.#obj(page_, args_[0]); 
        if(exportedImg.obj == null) return;

        exportedImg.position = infos.position;

        await this.#import_image(exportedImg);
    }

    #image_match(images_, x_, y_, w_, h_)
    {
        x_ = Math.round(x_);
        y_ = Math.round(y_);

       for(let img of images_)
        {
            let pos = img.position;
            
            if(x_ != Math.round(pos.x) || y_ != Math.round(pos.y))
            { continue; }

            if((pos.width) && (pos.height))
            {
                if((pos.width != NaN) && (pos.height != NaN) && (w_ != pos.width) && (h_ != pos.height))
                { continue; }
            }

            return img;
        }

        return null;
    }

    async #list_page_images(page_number_, page_, ops_)
    {
        // Deid.Log.debug("list images of page " + _page.pageNumber);
        const fns = ops_.fnArray, args = ops_.argsArray;     

        let images = this.context.images.page(page_number_);
        if(images == undefined)
        { return; }

        let images_per_position = [];

        for(let img of images.values())
        {
            let position = img.position; 
            if((position.x) && (position.y) && (position.x != NaN) && (position.y != NaN))
            {
                images_per_position.push(img);
                continue;
            }
            
            let i = img.position.index;
            let arg = args[i];     

            if(arg == null)
            { 
                Deid.Log.error( "There is no args for " + JSON.stringify(img));
                continue; 
            }

            if ((fns[i] < pdfjs.OPS.paintJpegXObject) || (fns[i] >= 91))
            {
                Deid.Log.error( "Position doesn t match an image object " + JSON.stringify(img));
                continue; 
            }

            await this.#do_import_image(img, page_, arg, fns[i]);
         
        };

        if(images_per_position.length == 0) return;
        
        let x = -1, y = -1;
        for(let i = 0; i < fns.length; i++)
        {
            const fn =  fns[i];
            const arg = args[i];

            if(fn == pdfjs.OPS.transform)
            {
                x = arg[4];
                y = arg[5];
                continue;
            }

            if(fn == pdfjs.OPS.moveTo)
            {
                // Deid.Log.debug("move to " + JSON.stringify(arg));
            }

            if ((fn < pdfjs.OPS.paintJpegXObject) || (fn >= 91))
            { continue; }

            let img = this.#image_match(images_per_position, x, y, arg[1], arg[2]);
            if(img == null) continue;

            if((img.position.skip) && (img.position.skip != 0))
            { img.position.skip --; continue; }

            await this.#do_import_image(img, page_, arg, fn);

        }
    }

    #all_image_readed()
    { 
        return true; 
    }

    async #external_image_tokens(entry_)
    {
        if(entry_.tokens)
        {
            let img = null;
            try { img = await Deid.Gfx.load_image(entry_.imgFilename); }
            catch(error) { Deid.Log.error('Failed to load image ' + entry_.imgFilename); throw error; }

            var canvas = document.createElement('canvas');
            // Set the dimensions of the canvas to match the image
            canvas.width = img.width;
            canvas.height = img.height;
          
            // Get the 2D context of the canvas
            var ctx = canvas.getContext('2d');
            
            // Draw the image onto the canvas
            ctx.drawImage(img, 0, 0);

            for(let token of entry_.tokens)
            {
                await this.#save_part(ctx, token);
            }

        }
    }

    async #copy_external_images()
    {
        const pdf_directory = this.context.pdf_filename.split("/").slice(0,-1).join("/");

        for(let img of this.adventure.images)
        {
            if(img.position == null) continue;

            if(img.position.filename == undefined)
            { continue; }

            if(img.position.filename.at(0) == '{')
            {
                img.imgFilename = Deid.compile(img.position.filename);
            }
            else
            {
                img.imgFilename = pdf_directory + "/" + img.position.filename;
            }

            let result = await Deid.copyfile(img.imgDirectory, img.idname, img.imgFilename);
            if(result)
            { 
                await this.#external_image_tokens(img);
                this.#image_imported(img); 
            }
            else 
            { Deid.Log.error("Failed to copy image " + img.imgFilename); }
        }
    }

    async #build_image(image_)
    {
        const cn = Deid.Gfx.create_webp_canvas(image_.size.width, image_.size.height);
        for(const e of image_.elements)
        {
            let entry = this.adventure.image(e.source.idname);
            if(entry == undefined)
            { 
                Deid.Log.error("Failed to retrieve image element " + JSON.toString(e)); 
                continue;
            }

            let sub_image = await Deid.Gfx.load_image(entry.saveFilename);

            const ctx = cn.getContext("2d");
            ctx.drawImage(sub_image, e.position.x, e.position.y, sub_image.width, sub_image.height);
            
        }

        var dt = cn.toDataURL("image/webp");
        const prefix = "data:image/webp;base64,";
        
        if(dt.startsWith(prefix))
        {
            dt = dt.slice(prefix.length);
            var bloub = Deid.Gfx.b64_to_blob(dt, "image/webp");
            await Deid.upload(bloub, image_.imgDirectory, image_.idname);

            const message = game.i18n.format("Helyx.Advance.ImageImport", {name : image_.idname});
            this.advance("image", message);
        }  
    }

    async #build_images()
    {
        let adv = this.context.adventure, myself = this;
        for(let img of adv.images)
        {
            if((img.size != null) && (img.position == null))
            {
                await this.#build_image(img);
            }
        }
    }

    async #import_images()
    {
        let adv = this.context.adventure, myself = this;
        
        this.context.nb_images_to_export = adv.images ? adv.images.length : 0;
        this.context._nb_images_exported = 0;        

        const pdf = this.context.pdf;

        

        const nb_pages = pdf._pdfInfo.numPages;
        for (let i = 1; i <= nb_pages; i++) 
        { 

            // Skip page without registered images ?
            if(this.#skip_pages_without_images)
            {
                let images = this.context.images.page(i);
                if((images == undefined) || (images.length == 0))
                { 
                    Deid.Log.debug("No images on page " + i);
                    continue; 
                }
            }

            Deid.Log.debug("import images of page " + i);
            const page = await pdf.getPage(i);
            const ops  = await page.getOperatorList();
            await this.#list_page_images(i, page, ops);
            Deid.Log.debug("import images of page " + i + " completed");

            // Stop looping page if we are done with images
            if(this.is_running() == false)
            { break; }
        };

        this.#all_image_readed(); 
    }


    async #run()
    {
        let adv = this.context.adventure, myself = this;
        this.images = this.context.content.images = new Map();

        this.context.nb_images_to_export = adv.images ? adv.images.length : 0;        
        this.context._nb_images_exported = 0;   

        this.#skip_pages_without_images = this.adventure.flags ? this.adventure.flags.skip_pages_without_images : false;

        this.status(this.Status.RUNNING);

        // Handle case there is no images to extract, and the extract all image option is false
        if((this.context.extract_all_images == false) && (this.context.nb_images_to_export == 0))
        { return new Promise( () => { myself.proceed(myself.#next_state);}); }

        // Handle case the option to skip images is enabled
        if(!this.context.import_images)
        { return new Promise( () => { myself.proceed(myself.#next_state);}); }

        // Normal flow
        await this.#create_directories();
        
        await this.#copy_external_images();
        await this.#import_images();
        await this.#build_images();

        this.proceed(this.#next_state);
    
    }

    do_start()
    {
        return this.#run();
    }    
}        
export class StateImportItems extends HelyxState 
{

#next_state = -1;

constructor(_machine, _options = { })
{
    super(_machine, _options);
    this.#next_state = _options.next_state ?? -1;

}  

/**
 
    @brief                  Import a foundry entity from a compendium using a generic import declaration
    @param {HelyxEntity}                       Entity to import
    @param {HelyxSourceSystem} source_         Helyx declaration of the item to import
    @param {String} entity_type_  Type of the foundry entity ( Actor, Journal, Scene, etc ...)
    @returns                 null if entity not found or the imported entity as an object, if found
  
**/
async #import_from_compendium(item_, source_, entity_type_)
{
    let compendium = this.context.resolve_compendium(source_.compendium);

    // Clone the datas
    let source = await Deid.Foundry.search_in_compendiums(source_.name, entity_type_, { key: compendium});
    if(!source)
    {
        Deid.Log.error("Failed to find " + entity_type_ +" #" + item_.helyx.idname + " in compendiums");
        return null;
    }
    return this.#generic_model(source.toCompendium(null,{}), item_);
}

    async #update_journal_entry(_entry, _entity)
    {
        this.adventure.entries.set(_entry.helyx.idname, _entry);
        if(_entry.pages)
        {
            for(let i = 0; i < _entry.pages.length; ++i)
            {
                let p = _entry.pages[i];
                this.adventure.entries.set(p.helyx.idname, p);
                p._id = _entity._source.pages[i]._id;
                p.journal = _entry.id;
            }

        }

        let message = game.i18n.format("Helyx.Advance.JournalAlreadyImported", { name: _entity.name});
        this.advance("item", message);
        return true; 
    }

    async #update_actor_entry(_entry, _entity)
    {
        this.adventure.entries.set(_entry.helyx.idname, _entry);
        _entry.finalName = _entity.name;
        let message = game.i18n.format("Helyx.Advance.ActorAlreadyImported", {name: _entity.name});
        this.advance("item", message);
        return true; 
    }

    async #update_item_entry(_entry, _entity)
    {
        this.adventure.entries.set(_entry.helyx.idname, _entry);
        _entry.finalName = _entity.name;
        let message = game.i18n.format("Helyx.Advance.ItemAlreadyImported", {name: _entity.name});
        this.advance("item", message);
        return true; 
    }

    async #update_scene_entry(_entry, _entity)
    {
        this.adventure.entries.set(_entry.helyx.idname, _entry);
        _entry.finalName = _entity.name;
        let message = game.i18n.format("Helyx.Advance.SceneAlreadyImported", {name: _entity.name});
        this.advance("item", message);
        return true; 
    }    

    async #update_entry(_entry, _entity)
    {
        switch(_entry.helyx.type)
        {
            case 'JournalEntry' : return await this.#update_journal_entry(_entry, _entity);
            case 'Actor' : return await this.#update_actor_entry(_entry, _entity);
            case 'Item' : return await this.#update_item_entry(_entry, _entity);
            case 'Scene' : return await this.#update_scene_entry(_entry, _entity);
            default: break;
        }

        return true;
    }

    async #import_journal(_item)
    {
        let name = this.contents(_item.name);

        if(_item.helyx.idnum)
        {  name = Deid.itos(_item.helyx.idnum, 3) + name; }

        let datas = {name: name };
        if(_item.helyx.type == "JournalEntry")
        {
            let folderEntry = this.adventure.folder(_item.helyx.target);
            if (folderEntry == null) 
            {
                Deid.Log.error('No journal folder with idname ' + _item.helyx.target );
                return false;
            }     
            datas.folder = folderEntry._id; 
        }

        if(_item.pages)
        {
            datas.pages = [];
            for(const p of _item.pages)
            {
                datas.pages.push(this.context.assemble_page(p));
            }
        }
        else 
        { this.context.compile_content(_item, datas); }

        let res = await JournalEntry.create(datas);
  

        _item._id = res._id;
        this.adventure.entries.set(_item.helyx.idname, _item);
        if(_item.pages)
        {
            for(let i = 0; i < _item.pages.length; ++i)
            {
                let p = _item.pages[i];
                this.adventure.entries.set(p.helyx.idname, p);
                p._id = res._source.pages[i]._id;
                p.journal = _item._id;

                let page = res.collections.pages.get(p._id);
                await this.context.flag_item(page, p.helyx.idname);
            }

        }
        await this.context.flag_item(res, _item.helyx.idname); 
        let message = game.i18n.format("Helyx.Advance.JournalImported", { name: name });
        this.advance("item", message);
    
        return res;
    }

    #generic_pf2e_model(_model, _item)
    {
        if(_item.token)
        {
            if(_item.helyx.type == "Actor")
            {
                foundry.utils.mergeObject
                (
                    _model.prototypeToken, 
                    { 
                        flags:
                        {
                            pf2e: { autoscale: !1 }
                        }
                    }
                );
            }
        }
    }

    #generic_model(_model, _item)
    {
        if(_item.name && _item.name.length != 0 && (false == Array.isArray(_item.name)))
        { _model.name = this.contents(_item.name); }
        delete _model._id;

        // image
        if(_item.img)
        { 
            const img_resolved = this.context.resolve_image(_item.img);
            if(img_resolved)
            {
                _model.img = img_resolved; 
            }
        }
        else 
        { 
            let other_names = [ _item.helyx.sourceName ];
            if(_item.img_name)
            { other_names.push(_item.img_name); }

            //await this.setPDF2FoundryToken(model, other_names); 
        }
        

        // token
        if(_item.token)
        { 
            const img_resolved = this.context.resolve_image(_item.token);
            if(img_resolved)
            {
                _model.prototypeToken.texture.src = img_resolved;
            }
            if(_item.width)
            {
                _model.prototypeToken.width = _item.width;
            }
            if(_item.height)
            {
                _model.prototypeToken.height = _item.height;
            }
        }

        let folderEntry = this.adventure.folder(_item.helyx.target);
        if (folderEntry == null) 
        {
            Deid.Log.error('No ' + _item.helyx.type + ' folder with idname ' + _item.helyx.target );
            return false;
        }     
        _model.folder = folderEntry._id; 

        switch(game.system.id)
        {
            case 'pf2e' : this.#generic_pf2e_model(_model, _item); break;
            default: break;
        }
        return _model;
    }

    async #complete_import(_imported, _item)
    {
        
        _item.finalName = _imported.name;
        _item._id = _imported._id;

        if( _item.token )
        { 
            const img_resolved = this.context.resolve_image(_item.token);
            let update = {};
            if(img_resolved)
            {
                update.prototypeToken = {texture: {src: img_resolved}};
            }
            if(_item.width)
            {
                update.prototypeToken.width = _item.width;
            }
            if(_item.height)
            {
                update.prototypeToken.height = _item.height;
            }
            
            await _imported.update(update) ; 
            
        }

        if(_item.adjustment)
        { await _imported.applyAdjustment(_item.adjustment); }
        
        await this.context.flag_item(_imported, _item.helyx.idname); 
    }

    #complete_actor_model(_model, _item)
    {
        if(_item.alignment)
        {
            mergeObject(_model, {system: {details: {alignment: { value: _item.alignment}}}});
        }
        if(_item.traits)
        {
            _model.system.traits.value = _item.traits;
        }
        if(_item.adjustment)
        {
            _model.system.adjustment = _item.adjustment;
        }
        // Fix for starfinder : report the name if there is a name override in the actor entry 
        if((game.system.id == 'sfrpg') && (_item.name != null))
        {
            _model.prototypeToken.name = this.contents(_item.name);
        }
    }

    async #import_actor(_item)
    {
        const source = _item.helyx.source(game.system.id);
        if(source.type == "compendium")
        {
            let model = await this.#import_from_compendium(_item, source, 'Actor');
            this.#complete_actor_model(model, _item);
            let imported = await Actor.implementation.create(model);
            //await imported.prepareBaseData();
            await this.#complete_import(imported, _item);

            let message = game.i18n.format("Helyx.Advance.ActorImported", {name: _item.finalName});
            this.advance("item", message);
        }
    }

    #complete_item_model(template, ex)
    {

        if(ex.name && ex.name.length != 0)
        { template.name = this.contents(ex.name); }

        delete template._id;

        if(!template.system)
        { template.system = {}; }

        if(!template.traits)
        { template.system.traits = {}; }

        if(!template.system.source)
        { template.system.source = {}; }

        if(ex.description)
        { template.system.description = { value: this.contents(ex.description)}; }

        if(ex.weight)
        { template.system.bulk = { value : ex.weight }; }

        if(ex.price)
        {   
            let p = ex.price;
            let cp = p % 10;  p -= cp; p /= 10; 
            let sp = p % 10;  p -= sp; p /= 10; 
            let gp = p % 10; p -= gp; p /= 10;
            let pp = p; 

            template.system.price  =  { value: { pp: pp, gp: gp, sp: sp, cp : cp}} ; 
        } 

        if(ex.rarity)
        { template.system.traits.rarity = ex.rarity; }

        if(ex.img)
        { 
            const image_resolved = this.context.resolve_image(ex.img);
            if(image_resolved)
            {
                template.img = image_resolved; 
            }
        }

        if(template.system.identification)
        if(template.system.identification.identified)
        {
            template.system.identification.identified.name = template.name;
        }
        
        if(ex.system)
        { ex.system.apply(template.system); }
    }

    async #import_background(template, ex)
    {
        throw "Not implemented";

        let feat = ex.items['02x6c'];
        feat._id = this.entities().find( { name: feat.name, compendium: { key: 'pf2e.feats-srd'}} );

        if(feat._id == null)
        { Deid.Log.error(' Failed to link background to feat ' + feat.name); }
    }

    async #import_feat(ex)
    {

    }

    async #import_equipment(ex)
    {
        ex.type="equipment";
    }

    async #import_treasure(ex)
    {
        ex.type = "treasure";
    }

    async #import_item(_item)
    {
        const source = _item.helyx.source(game.system.id);
        if(source.type == "compendium")
        {
            let model = await this.#import_from_compendium(_item, source, 'Item');
            this.#complete_item_model(model, _item);
            let imported = await Item.create(model);
            await imported.prepareBaseData();
            await this.#complete_import(imported, _item);
    
            let message = game.i18n.format("Helyx.Advance.ItemCreated", {name: _item.finalName});
            this.advance("item", message);

            return;
        }


        let template = { };
        this.#generic_model(template, _item);
        this.#complete_item_model(template, _item);
        
        template.system.source.value = this.adventure.title;        

        switch(source.template)
        {
            case 'background' : await this.#import_background(template, _item); break; 
            case 'feat'       : await this.#import_feat(template); break; 
            case 'equipment'  : await this.#import_equipment(template); break; 
            case 'treasure'   : await this.#import_treasure(template); break;
            default: 
            {
                Deid.Log.error("Import item #" + _item.helyx.idname + " with unimplemented item type '" + _item.helyx.subtype + "'");
                return;
            }
        }    


        let imported = await Item.create(template);
        await this.#complete_import(imported, _item);

        let message = game.i18n.format("Helyx.Advance.ItemCreated", { name : _item.finalName});
        this.advance("item", message);
    }

    #resolve_scene_note(note_)
    {
        if(!note_.helyx) 
        {
            if(note_.flags.helyx)
            { note_.helyx = note_.flags.helyx; }

            if(note_.helyx == null)
            {
                Deid.Log.error( "In resolveSceneNote, note without helyx " + JSON.stringify(note_));
                return;
            }
        }

        const internalEntry = this.adventure.entries.get(note_.helyx.idname);
        if (!(internalEntry?._id))
        { 
            Deid.Log.error( "In resolveSceneNote, failed to retrieve note " + JSON.stringify(note_)); 
            return;
        }

        if(internalEntry.journal) // This is a page
        {
            note_.entryId = internalEntry.journal;
            note_.pageId = internalEntry._id;
        }
        else
        { note_.entryId = internalEntry._id }

        // Replace note text in the case it's pdf content 
        note_.text = this.contents(note_.text);
    }

    async #import_tokens(scene_, entry_)
    {
        if(entry_.tokens == null)
        { return; }

        const tokensAreHidden = entry_.tokensAreHidden ?? true;

        for(let tok of entry_.tokens)
        {
            // 1. Retrieve the actor item
            let options = { type: 'Actor', idname: tok.helyx.idname };
            const entity = this.context.item(options);
            if(entity == null)
            { Deid.Log.error( "Failed to import token  #" + tok.helyx.idname); }
            let actor = game.actors.get(entity.id);

            // 2. Create the token from the actor
            let token = await actor.getTokenDocument({x: tok.helyx.x, y: tok.helyx.y, hidden: tokensAreHidden});

            // Fix for starfinder : report the name if there is a name override in the actor entry 
            if((game.system.id == 'sfrpg') && (actor.name != null))
            {
                token.name = this.contents(actor.name);
            }

            // 3. Create the token
            await token.constructor.create(token, {parent: scene_});
        }

    }

    async #import_scene(entry_)
    {
        let model = {};

        if (entry_.helyx.source == "compendium")
        { 
            model = await this.#import_from_compendium(entry_, 'Scene'); 
            model.notes = entry_.notes ?? [];
        } 
        else 
        { 
            model = { ... entry_ };
            model.name = this.contents(entry_.name);
            this.#generic_model(model, entry_);
        }

        for(const note of model.notes)
        { this.#resolve_scene_note(note); } 
        
        if(model.drawings)
        for(let drawn of model.drawings)
        {
            drawn.text = this.contents(drawn.text);
        }

        delete model._id;
        delete model.helyx;
        model.tokens = [];


        for(const note of model.notes)
        { delete note.idname; } 
        
        const elements = this.adventure.descriptor.scenes_elements;

        if(elements)
        {
            let tokens = Hyx.SceneTokens.generate_tokens
            (
                elements,
                { idname: entry_.helyx.idname, img: entry_.background.src }
            )
        };

        if(!game.scenes.active ) 
        { model.active = true; }

        let res = await Scene.create(model);

        res.createThumbnail().then(data => {
            res.update({thumb: data.thumb}, {diff: false});
        });

        if(model.active)
        { await canvas.draw(); }

        await this.#complete_import(res, entry_);

        if(this.context.accept_tokens_on_maps)
        { await this.#import_tokens(res, entry_); }

        let message = game.i18n.format("Helyx.Advance.SceneImported", { name: res.name});
        this.advance("scene", message);
    }

    async #import_entry_step3(_item)
    {
        switch(_item.helyx.type)
        {
            case 'Item' : return await this.#import_item(_item); 
            case 'Actor':  return await this.#import_actor(_item); 
            case 'Scene' : return await this.#import_scene(_item);
            case 'JournalEntry' : return await this.#import_journal(_item);
            default: return true;
        }
    }


    async #import_entry(_item)
    {
        let key = _item.helyx.idname;

        if (this.imported.has(key))
        { return true; }

        if(!this.context.check_entry_condition(_item.helyx.conditions))
        { return true; }

        // Case we are in a bundled adventure, in this case we resolve includes files

        if(_item.includes != null)
        { _item = await Deid.load_included_files(_item); }            
        

        if(_item.helyx.prerequisites)
        {
            for(let prereqIdname of _item.helyx.prerequisites)
            {
                if(this.imported.has(prereqIdname))
                { continue; }

                if(!this.adventure.items.has(prereqIdname))
                { 
                    Deid.Log.error("In item #" + key + ", unknow prerequisite #" + prereqIdname);
                    return false;
                }

                let prereq_item = this.adventure.items.get(prereqIdname);
                await this.#import_entry(prereq_item);
            }
        }

        Deid.Log.report( 'Import of #' + key);

        const current_entity = this.context.item( { idname: _item.helyx.idname, type: _item.helyx.type} );
        let id = await this.context.valid_imported_entity(current_entity)
        _item.id = id; 
        if(id) await this.#update_entry(_item, current_entity);
        else await this.#import_entry_step3(_item);
    }

    #log_import_order()
    {
        const order = this.adventure.import_order;
        for(let i = 0; i < this.adventure.import_order.length; i++)
        {
            console.log("#" + i + " " + order[i]);
        }
    }

    async #import_entries()
    {
        this.imported = new Map();
        // this.#log_import_order();
        
        for(let i of this.adventure.import_order)
        { 
            // Item are imported one by one to avoid to handle prerequisites through pending promises
            let itm = this.adventure.items.get(i);
            await this.#import_entry(itm);
        }    
    }

    do_start()
    {
        let myself = this;
        return new Promise( () => 
        { 
            myself.status(this.Status.RUNNING);
            myself.#import_entries().then( () => 
            {
                myself.proceed( myself.#next_state);
            });
        });
    }    
}        
export class StateColorizeText extends HelyxState 
{
    #next_state = -1;
    #color_assigner = "normal";

    constructor(_machine, _options = { })
    {
        super(_machine, _options);
        this.#next_state = _options.next_state ?? -1;
    }  

    #font_by_decl(_decl)
    {
        for(const f of this.adventure.fonts)
        {
            if(Deid.PDF.cmp_font(f, _decl))
            { return f ; }
        }
        return null;
    }

    #colorize_text()
    {
        this.status(this.Status.RUNNING);

        this.#color_assigner = this.adventure.color_assign ?? "normal";

        let nb_pages = this.context.nb_pages;
        let content = this.context.adventure.content;

        let from_page = (content ? content.from : 1), to_page = (content ? content.to : nb_pages);

        for(const font of this.adventure.fonts)
        {
            if(font.flags == null)
            { font.flags = { }; }

            if(font.roles == null)
            { font.roles = []; }

            const block = this.block(font.position);
            if(!block) { continue; } 

            font.name = block.font_decl.name;
            font.size = block.font_decl.size;
            font.desc = block.font_decl.desc;

            font.color =  Deid.PDF.convert_color(this.#color_assigner, block.font_decl.color);

            if(block.roles && block.roles.includes('WATERMARKS'))
            {
                font.flags.skip = true;
                font.roles.push("watermark");
            }
        }

        for(let pagenum = from_page; pagenum <= to_page; ++pagenum)
        { 
            let page = this.context.content.pages[pagenum];        
            if(!page)
            {
                Deid.Log.error('Failed to retrieve page ' + pagenum);
                continue;
            }
            
            for(let blocknum = 0; blocknum < page.length; ++blocknum)
            {
                let block = page[blocknum];
                block.font_decl.color = Deid.PDF.convert_color(this.#color_assigner,block.font_decl.color);

                if(block.font == null)
                {
    
                    block.font = this.#font_by_decl( block.font_decl);
                    if(block.font == null)
                    {
                        let new_font = 
                        { 
                            unknow: true, 
                            position: block.index, 
                            name: block.font_decl.name, 
                            size: block.font_decl.size, 
                            desc: block.font_decl.desc,
                            color: Deid.PDF.convert_color(this.#color_assigner,block.font_decl.color), 
                            flags: { }, 
                            roles: [] 
                        };

                        if(block.roles && block.roles.includes('WATERMARKS'))
                        {
                            new_font.flags.skip = true;
                            new_font.roles.push("watermark");
                        }
                        
                        block.font = new_font;
                        this.adventure.fonts.push(new_font);
                    }
                }
            }
        }
        
        this.proceed(this.#next_state);
    }

    do_start()
    {
        let myself = this;
        return new Promise ( () => { myself.#colorize_text(); });
    }
}

export class StateImportOptionsDialog extends HelyxState 
{
    #dialog = null;
    #next_state = -1;

    constructor(_machine, _options = { })
    {
        super(_machine, _options);
        this.#next_state = _options.next_state ?? -1;
    }  

    dialog_import()
    {

        this.context.accept_midjourney_content =  $('#helyx-accept-midjourney-content').is(':checked');
        Deid.Log.report( 'midjourney content used : ' + this.context.accept_midjourney_content);

        this.#dialog.close();
        this.#dialog = null;

        this.proceed( this.#next_state);
    }


    #show_dialog()
    {
        const template = this.context.templates_directory + '/import_options.hbs';
        return new Promise
        (
            async resolve => 
            {
                this.#dialog = new Dialog
                (
                    {
                        title: game.i18n.localize("Helyx.PDFImport"),
                        content: await foundry.applications.handlebars.renderTemplate(template, {}),
                        buttons: 
                        {
                            ok: 
                            {
                                icon:     '<i class="fas fa-file-import"></i>',
                                label:    game.i18n.localize("Helyx.ImportAPDF"),
                                callback: () => { this.dialog_import(); }
                            }
                        }
                    }, 
                    { resizable: true }
                );

                this.status(this.Status.RUNNING);
                this.#dialog.render(true);
            }
        );
    }

    do_start()
    {
        // No use of midjourney content without acceptation
        this.context.accept_midjourney_content = false ;

        const adventure_flags = this.context.adventure.flags;
        if((!adventure_flags) || (!adventure_flags.midjourney_content))
        {
            this.status(this.Status.RUNNING);
            this.proceed( this.#next_state);
            return;
        }
        
        this.#show_dialog();
    }

}

export class StateCompletion extends HelyxState 
{

    constructor(_machine, _options = { })
    {
        super(_machine, _options);
    }  

    #complete()
    {
        this.status(this.Status.RUNNING);
        this.context.progress.log();
        
        if(this.context.progress_dialog)
        { this.context.progress_dialog ._element.find(".cancel").text("Ok"); }

        this.end();
    }

    do_start()
    {
        let myself = this;
        return new Promise( () => { myself.#complete(); });

    }
}
export class StateAdventureSummary extends HelyxState 
{
    #dialog = null;
    #next_state = -1;
    #cancel_state = -1;

    constructor(_machine, _options = { })
    {
        super(_machine, _options);
        this.#next_state = _options.next_state ?? -1;
        this.#cancel_state = _options.cancel_state ?? -1;
    }  

    dialog_import()
    {

        this.context.accept_midjourney_content =  $('#helyx-accept-midjourney-content').is(':checked');
        Deid.Log.report( 'midjourney content used : ' + this.context.accept_midjourney_content);

        this.context.accept_deidril_maps =  $('#helyx-accept-deidril-maps').is(':checked');
        Deid.Log.report( 'Deidril maps used : ' + this.context.accept_deidril_maps);

        this.context.accept_tokens_on_maps = $('#helyx-accept-tokens-on-maps').is(':checked');
        Deid.Log.report( 'Tokens on maps used : ' + this.context.accept_tokens_on_maps);

        this.#dialog.close();
        this.#dialog = null;

        this.proceed( this.#next_state);
    }

    dialog_cancel()
    {
        this.#dialog.close();
        this.#dialog = null;

        if(this.context.progress_dialog)
        {
            this.context.progress_dialog.close();
            this.context.progress_dialog = null;
        }
        this.proceed( this.#cancel_state);
    }

    #complete_cover_data(summary)
    {
        let cover = summary.cover;

        if(cover)
        {
            let cover_image = this.context.adventure.image(cover.image);

            if((cover_image) && (cover_image.width))
            {
                let y = cover.y * 600 / cover_image.width;
                cover.css_x = "-" + cover.x + "px";
                cover.css_y = "-" + y + "px";

                let height = cover_image.height * 600 / cover_image.width;
                cover.css_size = "600px " + height + "px";
            }
        }
    }

    #complete_summary_texts()
    {
        let summary = foundry.utils.deepClone(this.context.summary);
        summary.summary = HelyxContent.build (summary.summary);
        summary.summary_html = this.context.content.read_contents (summary.summary);
        summary.title = summary.title ? HelyxContent.build (summary.title) : HelyxContent.build (this.adventure.title);
        summary.title = this.context.content.read_contents(summary.title);
        return summary;
    }

    #complete_summary_options(summary)
    {
        const adventure_flags = this.context.adventure.flags ?? {};
        summary.options = 
        { 
            midjourney_content : adventure_flags.midjourney_content ? "normal" : "none" ,
            midjourney_content_description : adventure_flags.midjourney_content_description ?? "",
            deidril_maps : adventure_flags.deidril_maps ? "normal" : "none" ,
            tokens_on_maps : adventure_flags.tokens_on_maps ? "normal" : "none"
        };
    }

    #dialog_missing_dependencies()
    {
        const template = this.context.templates_directory + '/missing_dependencies.hbs';
        let summary = this.#complete_summary_texts(this.context.summary);
        this.#complete_cover_data(summary);
        this.#complete_summary_options(summary);
        summary.missing_dependencies = this.context.missing_dependencies;

        return new Promise
        (
            async resolve => 
            {
                this.#dialog = new Dialog
                (
                    {
                        title: game.i18n.localize("Helyx.PDFImport"),
                        content: await foundry.applications.handlebars.renderTemplate(template, summary),
                        buttons: 
                        {
                            cancel: 
                            {
                                icon:     '<i class="fas fa-times"></i>',
                                label:    game.i18n.localize("Helyx.Cancel"),
                                callback: () => { this.dialog_cancel(); }
                            }
                        }
                    }, 
                    { resizable: true, width: 800 }
                );

                this.status(this.Status.RUNNING);
                this.#dialog.render(true);
            }
        );
    }

    #dialog_import()
    {
        const template = this.context.templates_directory + '/summary.hbs';
        let summary = this.#complete_summary_texts(this.context.summary);
        this.#complete_cover_data(summary);
        this.#complete_summary_options(summary);

        return new Promise
        (
            async resolve => 
            {
                this.#dialog = new Dialog
                (
                    {
                        title: game.i18n.localize("Helyx.PDFImport"),
                        content: await foundry.applications.handlebars.renderTemplate(template, summary),
                        buttons: 
                        {
                            import: 
                            {
                                icon:     '<i class="fas fa-file-import"></i>',
                                label:    game.i18n.localize("Helyx.Import"),
                                callback: () => { this.dialog_import(); }
                            },
                            cancel: 
                            {
                                icon:     '<i class="fas fa-times"></i>',
                                label:    game.i18n.localize("Helyx.Cancel"),
                                callback: () => { this.dialog_cancel(); }
                            }
                        }
                    }, 
                    { resizable: true, width: 800 }
                );

                this.status(this.Status.RUNNING);
                this.#dialog.render(true);
            }
        );
    }

    do_start()
    {
        if((this.context.missing_dependencies) && (this.context.missing_dependencies.length > 0))
        { this.#dialog_missing_dependencies(); }
        else 
        { this.#dialog_import(); }
    }    
}    
export class StateReadySummary extends HelyxState 
{
    #next_state = -1;
    #cover_details = {};

    constructor(_machine, _options = { })
    {
        super(_machine, _options);
        this.#next_state = _options.next_state ?? -1;
    }  

    async #import_image(image_)
    { 
        let transformation = image_.export?.transformation;

        let drawn = Deid.Gfx.pdf_image_to_blob(image_, transformation);
        if(drawn?.image)
        {

            this.adventure._computeImageDirectory(image_);
            await Deid.upload(drawn.image, image_.imgDirectory, image_.idname)
            
            this.context.summary.cover.filename = image_.imgDirectory + '/' + image_.idname + '.webp' ;
        }
        

    }

    async #import_cover_by_index(page_, ops_)
    {    
        const fns = ops_.fnArray, args = ops_.argsArray; 
        let idx = this.#cover_details.position.index; 

        let arg = args[idx];
        let details = this.#cover_details;

        //Not a JPEG resource:
        if ((fns[idx] >= pdfjs.OPS.paintJpegXObject) && (fns[idx] < 91))
        { 
            details.name = arg[0];
            details.width = arg[1];
            details.height = arg[2];
            details.imageType = fns[idx]; 
 
            let img = await page_.objs._ensureObj(arg[0]).capability.promise;
            details.obj = img;    
            await this.#import_image(details);   
        }

        this.proceed( this.#next_state);
    }

    async #import_cover_by_position(page_, ops_)
    {    
        const fns = ops_.fnArray, args = ops_.argsArray; 
        let details = this.#cover_details;
        let pos = details.position;
        let x = -1, y = -1;
        for(let i = 0; i < fns.length; i++)
        {
            const fn =  fns[i];
            const arg = args[i];

            if(fn == pdfjs.OPS.transform)
            {
                x = arg[4];
                y = arg[5];
                Deid.Log.debug("transform to " + JSON.stringify(arg));
                continue;
            }

            if(fn == pdfjs.OPS.moveTo)
            {
                Deid.Log.debug("move to " + JSON.stringify(arg));
            }

            if ((fn < pdfjs.OPS.paintJpegXObject) || (fn >= 91))
            { continue; }

            if(Math.round(x) != Math.round(pos.x) || Math.round(y) != Math.round(pos.y))
            { continue; }

            if((pos.width) && (pos.height))
            {
                if((pos.width != NaN) && (pos.height != NaN) && (arg[1] != pos.width) && (arg[2] != pos.height))
                { continue; }
            }
            else
            {
                pos.width = arg[1];
                pos.height = arg[2];
            }

            details.name = arg[0];
            details.width = arg[1];
            details.height = arg[2];
            details.imageType = fn; 
    
            let img = await page_.objs._ensureObj(arg[0]).capability.promise;
            details.obj = img;    
            await this.#import_image(details);             
        }
        
        // image not found
        this.proceed( this.#next_state);      
    }

    async #import_cover_ops(page_, ops_)
    {

        let position = this.#cover_details.position; 
        if((position.x) && (position.y) && (position.x != NaN) && (position.y != NaN))
        { this.#import_cover_by_position(page_, ops_); }
        else if(position.index != -1)
        { this.#import_cover_by_index(page_, ops_); }
        else 
        { this.proceed( this.#next_state); }


    }

    async #import_cover_page(pdf_, page_)
    {
        let myself = this;
    
        await page_.getOperatorList()
            .then( (ops_) => { myself.#import_cover_ops(page_, ops_) ;} );
    }

    async #import_cover()
    {
        const cover_decl = this.adventure.summary?.cover;

        if( cover_decl == null )
        { this.proceed( this.#next_state); return; }

        this.#cover_details = this.adventure.image(cover_decl.image);

        let myself = this;
        const page_number = this.#cover_details?.position?.page;

        if(page_number != null)
        {

            await this.context.pdf.getPage(page_number)
              .then(  (page) => { myself.#import_cover_page(this.context.pdf, page);} ); 
        }
        else 
        { this.proceed( this.#next_state); }

    }

    async #create_directories()
    {
        // Directories are created in the foundry 'Data' space
        const adv    = this.context.adventure;

        // Create adventure main resources directory
        if(!adv.idname)
        { 
            Deid.Log.error("Adventure #" + adv.title + " without main resources directory");
            return this.end();
        }  

        return Hyx.FileSystem.create_directories(adv.idname, adv.resources_directories);

    }

    do_start()
    {
        let myself = this;
        return new Promise( () => 
        { 
            myself.status(this.Status.RUNNING);
            this.context.summary = {...this.adventure.summary };
            myself.#create_directories().then ( ()=> { myself.#import_cover(); });
        });
    } 

}


export class StateCompendiumArt extends HelyxState 
{

#next_state = -1;

constructor(_machine, _options = { })
{
    super(_machine, _options);
    this.#next_state = _options.next_state ?? -1;
}  

#type_keyword(type_)
{
    switch(type_)
    {
        case 'Actor': return 'actor';
        case 'Item' : return 'item';
        default: return 'null';
    }
}

async #find_source(entry_, pack_name_)
{
    if(entry_.name != null)
    {
        return await Deid.Foundry.search_in_compendiums(entry_.name, entry_.type, { key: pack_name_ });
    }

    if(entry_.names != null)
    {
        for(const name of entry_.names)
        {
            let res =  await Deid.Foundry.search_in_compendiums(name, entry_.type, { key: pack_name_ });
            if(res)
            {
                return res;
            }
        }
    }

    return null;
}

async #generate_art_map()
{
    let raw_art_map = this.adventure.descriptor.art_map;
    
    if((!raw_art_map) || (raw_art_map.length == 0)) 
    { return undefined; }

    const actor_directory = '/helyx/' + this.adventure.export_directory + '/actors/';

    let arts = {};
    for(const entry of raw_art_map)
    {
        if(entry.ignore)
        { 
            this.advance("art", "Ignore art mapping for " + entry.name);
            continue; 
        }

        // Resolve the pack name
        const pack_name = this.context.resolve_compendium(entry.pack);

        // Retrieve the compendium entity
        const source = await this.#find_source(entry, pack_name);

        if(!source)
        {
            Deid.Log.error("Failed to resolve art entry" + JSON.stringify(entry));
            continue;
        }

        const main_art_filename  = actor_directory + entry.actor + '.webp';
        const token_art_filename = actor_directory + entry.token + '.webp';
        
        let art = {};
        art[ this.#type_keyword(entry.type) ] = main_art_filename;
        art[ 'token' ] =  token_art_filename;

        let index_pack = pack_name.replace('sfrpg.','');

        if(!arts[index_pack])
        { arts[index_pack] = {}; }
        
        arts [index_pack] [source.id ] = art;

        this.advance("art", "Generated art mapping for " + entry.name);
    }

    return arts;
}

async #generate_art_map_file()
{
    const art_map = await this.#generate_art_map();
    if((art_map == undefined) || (art_map.length == 0))
    {
        Deid.Log.report("No art map defined for this pdf");
        return;
    }

    const exported_art_map_filename = this.adventure.idname + '_art-map';
    const exported_art_map = JSON.stringify(art_map, null, "\t");

    const blob = new Blob([exported_art_map], {type: "application/json"} )

    await Deid.upload(blob, '/helyx', exported_art_map_filename); 
    Deid.Log.report("Art map generated into '/helyx/" + exported_art_map_filename);

    await game.sfrpg.compendiumArt.refresh();
    this.advance("art", "Refreshed global art mapping");
}

do_start()
{
    let myself = this;
    return new Promise( () => 
    { 
        myself.status(this.Status.RUNNING);
        myself.#generate_art_map_file().then( () => 
        {
            myself.proceed( myself.#next_state);
        });
    });
}   

}
export class HelyxCryptOfTheEverflame
{
    static idname = "crypt-of-the-everflame";
    static title = "Crypt Of The Everflame";
    static prefix = "pf1en_cote";
    static nbPages = 36;
    static identification = {position : { page:3, x: 97, y: 351}, value: 'Crypt of the Everflame' };

    static resources_directories = [ "actors", "scenes", "items", "assets"]; 
    static drm = "PAIZO" ; 
    static dependencies = {};
    static system = "pf1";
    static content = { from: 5, to: 33};
    static language="en";
    static color_assign = "reader";
    static flags = { midjourney_content: true, tokens_on_maps: true };

    static summary = 
    {
        title: '{{xylf 3 97 351 0 "any"}}',
        cover: { image: "cover", x: 0, y: 320, width: 1259, height: 678 },
        summary: "{{{pxyl 36 84 521 8}}} {{{pxyl 36 93 417 7}}} {{{pxyl 36 93 365 6}}}"
    };

    static glyphs = 
    {
      '0' : 't',
      '1' : 'i',
      '2' : 'p',
      '4' : 'd',
      '5' : 'b',
      '6' : 'h',
      '7' : 'w',
      '8' : 'f',
      '9' : 'y',
      '!' : 'r',
      '-' : 'a',
      "'" : 'o',
      '(' : 'l',
      '*' : 'e',
      ',' : 'm',
      '.' : 'n',
      '#' : 's',
      '+' : 'u',
      '/' : 'k',
      ':' : 'g',

      'i' : '1',
      'm' : ',',
      't' : '0'
    };

    static import_order = [ "pf1en_cote_orc", "pf1en_cote_wolf", "pf1en_cote_human-skeleton", "pf1en_cote_human-plague-zombie", "pf1en_cote_giant-bombardier-beetle", "pf1en_cote_shadow", "pf1en_cote_bloody-skeleton", "pf1en_cote_giant-frog", "pf1en_cote_bat-swarm", "pf1en_cote_the-golem", "pf1en_cote_skeletal-knight", "pf1en_cote_roldare", "pf1en_cote_jonark-uptal", "pf1en_cote_vygar-anravis", "pf1en_cote_pit-trap", "pf1en_cote_pillar-of-arrows", "pf1en_cote_pool-of-fear", "pf1en_cote_bull-rush-trap", "pf1en_cote_kassen-s-blades", "pf1en_cote_cover", "pf1en_cote_intro", "pf1en_cote_p1", "pf1en_cote_p2", "pf1en_cote_p3", "pf1en_cote_apx1", "pf1en_cote_ogl", "pf1en_cote_town", "pf1en_cote_trail", "pf1en_cote_level1", "pf1en_cote_lower-level"];
    static items = new Map([[ "pf1en_cote_orc" ,{
	"helyx": {
		"idname": "pf1en_cote_orc",
		"type": "Actor",
		"target": "pf1en_cote_bestiary",
		"sources": {
			"pf1": {
				"name": "Orc",
				"type": "compendium",
				"compendium": "~.deid-crypt-of-the-everflame-actors"
			}
		}
	},
	"img": {
		"src": "{{{imgsrc 'shared' 'images/orcs/brute-orc_001.actor.webp'}}}",
		"origin": "MJ"
	},
	"token": {
		"src": "{{{imgsrc 'shared' 'images/orcs/brute-orc_001.token.webp'}}}",
		"origin": "MJ"
	}
}]
,[ "pf1en_cote_wolf" ,{
	"helyx": {
		"idname": "pf1en_cote_wolf",
		"type": "Actor",
		"target": "pf1en_cote_bestiary",
		"sources": {
			"pf1": {
				"name": "Wolf",
				"type": "compendium",
				"compendium": "~.deid-crypt-of-the-everflame-actors"
			}
		}
	},
	"img": {
		"src": "{{{imgsrc 'shared' 'images/wolves/wolf_00.actor.webp'}}}",
		"origin": "MJ"
	},
	"token": {
		"src": "{{{imgsrc 'shared' 'images/wolves/wolf_00.token.webp'}}}",
		"origin": "MJ"
	}
}]
,[ "pf1en_cote_human-skeleton" ,{
	"helyx": {
		"idname": "pf1en_cote_human-skeleton",
		"type": "Actor",
		"target": "pf1en_cote_bestiary",
		"sources": {
			"pf1": {
				"name": "Human Skeleton",
				"type": "compendium",
				"compendium": "~.deid-crypt-of-the-everflame-actors"
			}
		}
	},
	"img": {
		"src": "{{{imgsrc 'shared' 'images/skeletons/human-skeleton_001.actor.webp'}}}",
		"origin": "MJ"
	},
	"token": {
		"src": "{{{imgsrc 'shared' 'images/skeletons/human-skeleton_001.token.webp'}}}",
		"origin": "MJ"
	}
}]
,[ "pf1en_cote_human-plague-zombie" ,{
	"helyx": {
		"idname": "pf1en_cote_human-plague-zombie",
		"type": "Actor",
		"target": "pf1en_cote_bestiary",
		"sources": {
			"pf1": {
				"name": "Human Plague Zombie",
				"type": "compendium",
				"compendium": "~.deid-crypt-of-the-everflame-actors"
			}
		}
	},
	"img": {
		"src": "{{{imgpath 'plague-zombie.actor'}}}"
	},
	"token": {
		"src": "{{{tokenpath 'plague-zombie.token'}}}"
	}
}]
,[ "pf1en_cote_giant-bombardier-beetle" ,{
	"helyx": {
		"idname": "pf1en_cote_giant-bombardier-beetle",
		"type": "Actor",
		"target": "pf1en_cote_bestiary",
		"sources": {
			"pf1": {
				"name": "Giant Bombardier Beetle",
				"type": "compendium",
				"compendium": "~.deid-crypt-of-the-everflame-actors"
			}
		}
	},
	"img": {
		"src": "{{{imgsrc 'shared' 'images/beetles/giant-bombardier-beetle_001.actor.webp'}}}",
		"origin": "MJ"
	},
	"token": {
		"src": "{{{imgsrc 'shared' 'images/beetles/giant-bombardier-beetle_001.token.webp'}}}",
		"origin": "MJ"
	}
}]
,[ "pf1en_cote_shadow" ,{
	"helyx": {
		"idname": "pf1en_cote_shadow",
		"type": "Actor",
		"target": "pf1en_cote_bestiary",
		"sources": {
			"pf1": {
				"name": "Shadow",
				"type": "compendium",
				"compendium": "~.deid-crypt-of-the-everflame-actors"
			}
		}
	},
	"img": {
		"src": "{{{imgsrc 'shared' 'images/shadows/shadow_02.actor.webp'}}}",
		"origin": "MJ"
	},
	"token": {
		"src": "{{{imgsrc 'shared' 'images/shadows/shadow_02.token.webp'}}}",
		"origin": "MJ"
	}
}]
,[ "pf1en_cote_bloody-skeleton" ,{
	"helyx": {
		"idname": "pf1en_cote_bloody-skeleton",
		"type": "Actor",
		"target": "pf1en_cote_bestiary",
		"sources": {
			"pf1": {
				"name": "Human Bloody Skeleton",
				"type": "compendium",
				"compendium": "~.deid-crypt-of-the-everflame-actors"
			}
		}
	},
	"img": {
		"src": "{{{imgpath 'bloody-skeleton.actor'}}}"
	},
	"token": {
		"src": "{{{tokenpath 'bloody-skeleton.token'}}}"
	}
}]
,[ "pf1en_cote_giant-frog" ,{
	"helyx": {
		"idname": "pf1en_cote_giant-frog",
		"type": "Actor",
		"target": "pf1en_cote_bestiary",
		"sources": {
			"pf1": {
				"name": "Giant Frog",
				"type": "compendium",
				"compendium": "~.deid-crypt-of-the-everflame-actors"
			}
		}
	},
	"img": {
		"src": "{{{imgpath 'giant-frog.actor'}}}"
	},
	"token": {
		"src": "{{{tokenpath 'giant-frog.token'}}}"
	}
}]
,[ "pf1en_cote_bat-swarm" ,{
	"helyx": {
		"idname": "pf1en_cote_bat-swarm",
		"type": "Actor",
		"target": "pf1en_cote_bestiary",
		"sources": {
			"pf1": {
				"name": "Bat Swarm",
				"type": "compendium",
				"compendium": "~.deid-crypt-of-the-everflame-actors"
			}
		}
	},
	"img": {
		"src": "{{{imgsrc 'shared' 'images/bats/bat-swarm_00.actor.webp'}}}",
		"origin": "MJ"
	},
	"token": {
		"src": "{{{imgsrc 'shared' 'images/bats/bat-swarm_00.token.webp'}}}",
		"origin": "MJ"
	}
}]
,[ "pf1en_cote_the-golem" ,{
	"helyx": {
		"idname": "pf1en_cote_the-golem",
		"type": "Actor",
		"target": "pf1en_cote_bestiary",
		"sources": {
			"pf1": {
				"name": "The Golem",
				"type": "compendium",
				"compendium": "~.deid-crypt-of-the-everflame-actors"
			}
		}
	},
	"name": "{{{xylf 16 319 255 6 'agn'}}}",
	"img": {
		"src": "{{{imgpath 'wood-statue.actor'}}}"
	},
	"token": {
		"src": "{{{tokenpath 'wood-statue.token'}}}"
	}
}]
,[ "pf1en_cote_skeletal-knight" ,{
	"helyx": {
		"idname": "pf1en_cote_skeletal-knight",
		"type": "Actor",
		"target": "pf1en_cote_bestiary",
		"sources": {
			"pf1": {
				"name": "Skeletal Knight",
				"type": "compendium",
				"compendium": "~.deid-crypt-of-the-everflame-actors"
			}
		}
	},
	"name": "{{{xylf 26 337 471 2 'gnt'}}}",
	"img": {
		"src": "{{{imgpath 'skeletal-knight.actor'}}}"
	},
	"token": {
		"src": "{{{tokenpath 'skeletal-knight.token'}}}"
	}
}]
,[ "pf1en_cote_roldare" ,{
	"helyx": {
		"idname": "pf1en_cote_roldare",
		"type": "Actor",
		"target": "pf1en_cote_npcs",
		"sources": {
			"pf1": {
				"name": "Villager",
				"type": "compendium",
				"compendium": "~.deid-crypt-of-the-everflame-actors"
			}
		}
	},
	"name": "{{{xylf 12 277 438 5 'an'}}}",
	"img": {
		"src": "{{{imgpath 'villager.actor'}}}"
	},
	"token": {
		"src": "{{{tokenpath 'villager.token'}}}"
	}
}]
,[ "pf1en_cote_jonark-uptal" ,{
	"helyx": {
		"idname": "pf1en_cote_jonark-uptal",
		"type": "Actor",
		"target": "pf1en_cote_npcs",
		"sources": {
			"pf1": {
				"name": "Jonark Uptal",
				"type": "compendium",
				"compendium": "~.deid-crypt-of-the-everflame-actors"
			}
		}
	},
	"img": {
		"src": "{{{imgpath 'jonark-uptal.actor'}}}"
	},
	"token": {
		"src": "{{{tokenpath 'jonark-uptal.token'}}}"
	}
}]
,[ "pf1en_cote_vygar-anravis" ,{
	"helyx": {
		"idname": "pf1en_cote_vygar-anravis",
		"type": "Actor",
		"target": "pf1en_cote_npcs",
		"sources": {
			"pf1": {
				"name": "Cygar Anravis",
				"type": "compendium",
				"compendium": "~.deid-crypt-of-the-everflame-actors"
			}
		}
	},
	"img": {
		"src": "{{{imgpath 'cygar.actor'}}}"
	},
	"token": {
		"src": "{{{tokenpath 'cygar.token'}}}"
	}
}]
,[ "pf1en_cote_pit-trap" ,{
	"helyx": {
		"idname": "pf1en_cote_pit-trap",
		"type": "Actor",
		"target": "pf1en_cote_traps",
		"sources": {
			"pf1": {
				"name": "Pit Trap",
				"type": "compendium",
				"compendium": "~.deid-crypt-of-the-everflame-actors"
			}
		}
	}
}]
,[ "pf1en_cote_pillar-of-arrows" ,{
	"helyx": {
		"idname": "pf1en_cote_pillar-of-arrows",
		"type": "Actor",
		"target": "pf1en_cote_traps",
		"sources": {
			"pf1": {
				"name": "Pillar of 1,000 Arrows",
				"type": "compendium",
				"compendium": "~.deid-crypt-of-the-everflame-actors"
			}
		}
	}
}]
,[ "pf1en_cote_pool-of-fear" ,{
	"helyx": {
		"idname": "pf1en_cote_pool-of-fear",
		"type": "Actor",
		"target": "pf1en_cote_traps",
		"sources": {
			"pf1": {
				"name": "Pool of Fear",
				"type": "compendium",
				"compendium": "~.deid-crypt-of-the-everflame-actors"
			}
		}
	}
}]
,[ "pf1en_cote_bull-rush-trap" ,{
	"helyx": {
		"idname": "pf1en_cote_bull-rush-trap",
		"type": "Actor",
		"target": "pf1en_cote_traps",
		"sources": {
			"pf1": {
				"name": "Bull Rush",
				"type": "compendium",
				"compendium": "~.deid-crypt-of-the-everflame-actors"
			}
		}
	}
}]
,[ "pf1en_cote_kassen-s-blades" ,{
	"helyx": {
		"idname": "pf1en_cote_kassen-s-blades",
		"type": "Actor",
		"target": "pf1en_cote_traps",
		"sources": {
			"pf1": {
				"name": "Kassen's Blades",
				"type": "compendium",
				"compendium": "~.deid-crypt-of-the-everflame-actors"
			}
		}
	}
}]
,[ "pf1en_cote_cover" ,{
	"helyx": {
		"idname": "pf1en_cote_cover",
		"type": "JournalEntry",
		"target": "pf1en_cote_journals"
	},
	"name": "00 {{{xylf 3 97 351 1 'any'}}}",
	"pages": [
		{
			"helyx": {
				"idname": "pf1en_cote_cover",
				"type": "Page"
			},
			"name": "Cover [Image]",
			"img": {
				"src": "{{{imgpath 'cover'}}}"
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_intro_credits",
				"type": "Page"
			},
			"name": "Credits",
			"blocks": [
				{
					"type": "journal-title",
					"title": "Credits"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xylf 3 265 615 1 'b'}}} {{{xyl 3 292 615 1}}}",
						"{{{xylf 3 254 603 1 'b'}}} {{{xyl 3 302 603 1}}}",
						"{{{xylf 3 222 591 1 'b'}}} {{{xyl 3 271 591 1}}}",
						"{{{xylf 3 181 579 1 'b'}}} {{{xyl 3 241 579 1}}}",
						"{{{xylf 3 253 567 1 'b'}}} {{{xyl 3 314 567 1}}}",
						"{{{xylf 3 149 555 1 'b'}}} {{{xyl 3 249 555 1}}}",
						"{{{xylf 3 190 543 1 'b'}}} {{{xyl 3 267 543 1}}}",
						"{{{xylf 3 212 531 1 'b'}}} {{{xyl 3 278 531 1}}}",
						"{{{xylf 3 254 519 1 'b'}}} {{{xyl 3 302 519 1}}}",
						"{{{xylf 3 240 507 1 'b'}}} {{{xyl 3 330 507 1}}}",
						"{{{xylf 3 269 483 1 'b'}}} {{{xyl 3 307 483 1}}}",
						"{{{xylf 3 263 471 1 'b'}}} {{{xyl 3 306 471 1}}}",
						"{{{xylf 3 224 459 1 'b'}}} {{{xyl 3 336 459 3}}}",
						"{{{xylf 3 238 447 1 'b'}}} {{{xyl 3 323 447 1}}}",
						"{{{xylf 3 248 435 1 'b'}}} {{{xyl 3 313 435 1}}}",
						"{{{xylf 3 248 423 1 'b'}}} {{{xyl 3 305 423 1}}}",
						"{{{xylf 3 253 411 1 'b'}}} {{{xyl 3 326 411 1}}}",
						"{{{xylf 3 249 399 1 'b'}}} {{{xyl 3 312 399 1}}}",
						"{{{xylf 3 179 375 1 'b'}}} {{{xyl 3 240 375 1}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_intro_infos",
				"type": "Page"
			},
			"name": "Informations",
			"blocks": [
				{
					"type": "journal-title",
					"title": "Informations"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xylf 3 97 351 1 'bi'}}} {{{xyl 3 162 351 4}}}",
						"{{{xyl 3 92 164 3}}}",
						"{{{xyl 3 92 133 3}}}",
						"{{{xylf 3 92 103 1 'b'}}}{{{xyl 3 152 103 4}}}"
					]
				}
			]
		}
	]
}]
,[ "pf1en_cote_intro" ,{
	"helyx": {
		"idname": "pf1en_cote_intro",
		"type": "JournalEntry",
		"target": "pf1en_cote_journals"
	},
	"name": "01 Introduction",
	"pages": [
		{
			"helyx": {
				"idname": "pf1en_cote_005008",
				"type": "Page"
			},
			"name": "{{{xylf 5 72 687 10 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 5 72 687 10 'an'}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 5 72 675 18}}}",
						"{{{xyl 5 81 531 20}}}",
						"{{{xyl 5 72 363 7}}}",
						"{{{xyl 5 81 279 23}}}",
						"{{{xyl 5 317 687 7}}}",
						"{{{xyl 5 317 603 16}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_005109",
				"type": "Page"
			},
			"name": "{{{xylf 5 308 423 9 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 5 308 423 9 'an'}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 5 308 411 9}}}",
						"{{{xyl 5 317 303 9}}}",
						"{{{xyl 5 317 219 13}}}",
						"{{{xyl 5 317 87 3}}}{{{xyl 6 80 459 9}}}",
						"{{{xyl 6 89 375 4}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_006022",
				"type": "Page"
			},
			"name": "{{{xylf 6 80 315 1 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 6 80 315 1 'an'}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 6 80 303 8}}}",
						"{{{xyl 6 89 207 12}}}",
						"{{{xyl 6 89 111 16}}}",
						"{{{xyl 6 325 567 4}}}"
					]
				},
				{
					"type": "read-section",
					"paragraphs": [
						"{{{xyl 6 316 507 12}}}",
						"{{{xyl 6 325 387 12}}}"
					]
				},
				{
					"type": "section",
					"section": "treasure",
					"title": "{{{slicexylf 6 325 255 1 'n' 0 17}}}",
					"blocks": [
						{
							"type": "inventory",
							"items": [
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Backpack, common",
												"type": "compendium",
												"compendium": "pf1.items"
											}
										}
									}
								},
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Bedroll",
												"type": "compendium",
												"compendium": "pf1.items"
											}
										}
									}
								},
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Blanket",
												"type": "compendium",
												"compendium": "pf1.items"
											}
										}
									}
								},
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Cure Light Wounds",
												"type": "compendium",
												"compendium": "pf1.spells"
											}
										}
									}
								},
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Flint And Steel",
												"type": "compendium",
												"compendium": "pf1.items"
											}
										}
									}
								},
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Grappling hook, common",
												"type": "compendium",
												"compendium": "pf1.items"
											}
										}
									}
								},
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Lantern of the Everflame",
												"type": "compendium",
												"compendium": "~.deid-crypt-of-the-everflame-items"
											}
										}
									}
								},
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Piece of a Map",
												"type": "compendium",
												"compendium": "~.deid-crypt-of-the-everflame-items"
											}
										}
									}
								},
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Trail Rations",
												"type": "compendium",
												"compendium": "pf1.items"
											}
										}
									}
								},
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Rope",
												"type": "compendium",
												"compendium": "pf1.items"
											}
										}
									}
								},
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Small Bottle of Local Brandy",
												"type": "compendium",
												"compendium": "~.deid-crypt-of-the-everflame-items"
											}
										}
									}
								},
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Tent, small",
												"type": "compendium",
												"compendium": "pf1.items"
											}
										}
									}
								},
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Torch",
												"type": "compendium",
												"compendium": "pf1.items"
											}
										}
									}
								},
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Waterskin",
												"type": "compendium",
												"compendium": "pf1.items"
											}
										}
									}
								}
							]
						},
						{
							"type": "text",
							"paragraphs": [
								"{{{xyl 6 325 255 17}}}"
							]
						}
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 6 325 75 4}}}"
					]
				},
				{
					"type": "read-section",
					"paragraphs": [
						"{{{xyl 7 72 687 9}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_006108",
				"type": "Page"
			},
			"name": "{{{xylf 6 89 689 8 'nt'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 6 89 689 8 'nt'}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 6 90 677 5}}}"
					]
				},
				{
					"type": "section",
					"section": "map",
					"title": "{{{xylf 6 90 605 10 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xyl 6 90 593 9}}}"
							]
						}
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_007017",
				"type": "Page"
			},
			"name": "{{{xylf 7 72 567 1 'n'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 7 72 567 1 'n'}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 7 72 555 19}}}"
					]
				}
			]
		}
	]
}]
,[ "pf1en_cote_p1" ,{
	"helyx": {
		"idname": "pf1en_cote_p1",
		"type": "JournalEntry",
		"target": "pf1en_cote_journals"
	},
	"name": "02 {{{xylf 7 72 315 16 'an'}}}",
	"pages": [
		{
			"helyx": {
				"idname": "pf1en_cote_007037",
				"type": "Page"
			},
			"name": "{{{xylf 7 72 315 16 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 7 72 315 16 'an'}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 7 72 303 5}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_t1",
				"type": "Page"
			},
			"name": "{{{slicexylf 7 72 231 3 'an' 0 12}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{slicexylf 7 72 231 3 'an' 0 12}}}",
					"cr": "{{{slicexylf 7 72 231 3 'n' 13 4}}}",
					"xp": "{{{slicexylf 7 153 231 1 'n' 3 7}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 7 72 219 4}}}"
					]
				},
				{
					"type": "read-section",
					"paragraphs": [
						"{{{xyl 7 72 159 3}}}",
						"{{{xyl 7 110 147 4}}}"
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 7 81 87 9}}}",
						"{{{xyl 7 407 663 2}}}"
					]
				},
				{
					"type": "section",
					"section": "encounter",
					"title": "{{{xylf 7 327 639 1 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 7 365 639 13 'f'}}}"
							]
						}
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 7 379 483 5}}}",
						"{{{xyl 7 409 447 5}}}"
					]
				},
				{
					"type": "creature",
					"ref": "pf1en_cote_orc",
					"amount": "3",
					"cr": "{{{slicexylf 7 311 375 11 'nt' 8 9}}}",
					"statblock": [
						"{{{pxyl 7 308 363 1}}}",
						"{{{pxyl 7 308 351 1}}}",
						"{{{pxyl 7 308 339 1}}}",
						"{{{pxyl 7 308 327 6}}}",
						"{{{sbxylf 7 308 315 3 'nt'}}}",
						"{{{pxyl 7 308 303 2}}}",
						"{{{pxyl 7 308 291 2}}}",
						"{{{pxyl 7 308 279 7}}}",
						"{{{pxyl 7 308 267 2}}}",
						"{{{sbxylf 7 308 255 3 'nt'}}}",
						"{{{pxyl 7 308 243 4}}}",
						"{{{pxyl 7 308 231 4}}}",
						"{{{pxyl 7 308 219 2}}}",
						"{{{sbxylf 7 308 207 6 'nt'}}}",
						"{{{pxyl 7 308 195 12}}}",
						"{{{pxyl 7 308 183 6}}}",
						"{{{pxyl 7 308 171 3}}}",
						"{{{pxyl 7 308 159 2}}}",
						"{{{pxyl 7 308 147 2}}}",
						"{{{sbxylf 7 308 135 12 'nt'}}}",
						"{{{pxyl 7 308 123 8}}}",
						"{{{pxyl 7 308 75 8}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_t2",
				"type": "Page"
			},
			"name": "{{{slicexylf 8 80 411 3 'an' 0 17}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{slicexylf 8 80 411 3 'an' 0 17}}}",
					"cr": "{{{slicexylf 8 80 411 3 'n' 18 4}}}",
					"xp": "{{{slicexylf 8 80 411 3 'n' 23 9}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 8 80 399 10}}}",
						"{{{xyl 8 89 303 6}}}",
						"{{{xyl 8 89 255 9}}}",
						"{{{xyl 8 89 147 14}}}",
						"{{{xyl 8 317 639 5}}}",
						"{{{xyl 8 326 579 2}}}"
					]
				},
				{
					"type": "section",
					"section": "encounter",
					"title": "{{{xylf 8 326 555 1 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 8 363 555 15 'f'}}}"
							]
						}
					]
				},
				{
					"type": "creature",
					"ref": "pf1en_cote_wolf",
					"cr": "{{{slicexylf 8 320 387 9 'nt' 10 7}}}",
					"statblock": [
						"{{{pxyl 8 317 375 1}}}",
						"{{{pxyl 8 317 363 1}}}",
						"{{{pxyl 8 317 351 4}}}",
						"{{{sbxylf 8 317 339 3 'nt'}}}",
						"{{{pxyl 8 317 327 2}}}",
						"{{{pxyl 8 317 315 2}}}",
						"{{{pxyl 8 317 303 7}}}",
						"{{{sbxylf 8 317 291 3 'nt'}}}",
						"{{{pxyl 8 317 279 4}}}",
						"{{{pxyl 8 317 267 2}}}",
						"{{{sbxylf 8 317 255 6 'nt'}}}",
						"{{{pxyl 8 317 243 12}}}",
						"{{{pxyl 8 317 231 8}}}",
						"{{{pxyl 8 317 219 3}}}",
						"{{{pxyl 8 317 207 3}}}",
						"{{{sbxylf 8 317 183 12 'nt'}}}",
						"{{{pxyl 8 317 171 7}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_008171",
				"type": "Page"
			},
			"name": "{{{xylf 8 90 691 7 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 8 90 691 7 'an'}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 8 90 679 11}}}",
						"{{{xyl 8 99 595 13}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_t3",
				"type": "Page"
			},
			"name": "{{{xylf 8 317 123 1 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 8 317 123 1 'an'}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 8 317 111 7}}}{{{xyl 9 72 687 2}}}"
					]
				},
				{
					"type": "read-section",
					"paragraphs": [
						"{{{xyl 9 72 651 5}}}"
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 9 81 579 19}}}"
					]
				},
				{
					"type": "inventory",
					"items": [
						{
							"type": "link",
							"link": {
								"type": "Item",
								"sources": {
									"pf1": {
										"name": "Masterwork Short Sword",
										"type": "compendium",
										"compendium": "~.deid-crypt-of-the-everflame-items"
									}
								}
							}
						}
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 9 81 375 5}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_t4",
				"type": "Page"
			},
			"name": "{{{slicexylf 9 72 303 5 'an' 0 21}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{slicexylf 9 72 303 5 'an' 0 21}}}",
					"cr": "{{{slicexylf 9 72 303 5 'n' 22 4}}}",
					"xp": "{{{slicexylf 9 72 303 5 'n' 27 7}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 9 72 291 7}}}"
					]
				},
				{
					"type": "read-section",
					"paragraphs": [
						"{{{xyl 9 72 195 6}}}"
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 9 81 111 5}}}",
						"{{{xyl 9 317 687 12}}}"
					]
				},
				{
					"type": "table",
					"columns": "2",
					"headers": [
						"{{{xylf 9 308 555 1 'an'}}}",
						"{{{xylf 9 366 555 1 'an'}}}"
					],
					"lines": [
						[
							"{{{pxyl 9 308 543 1}}}",
							"{{{pxyl 9 366 543 2}}}"
						],
						[
							"{{{pxyl 9 308 519 1}}}",
							"{{{pxyl 9 366 519 3}}}"
						],
						[
							"{{{pxyl 9 308 483 1}}}",
							"{{{pxyl 9 366 483 6}}}"
						],
						[
							"{{{pxyl 9 308 411 1}}}",
							"{{{pxyl 9 366 411 9}}}"
						],
						[
							"{{{pxyl 9 308 351 1}}}",
							"{{{pxyl 9 366 351 4}}}"
						]
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_entrance",
				"type": "Page"
			},
			"name": "{{{xylf 9 308 279 14 'an'}}} [Image]",
			"img": {
				"src": "{{{imgpath 'entrance'}}}"
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_t5",
				"type": "Page"
			},
			"name": "{{{xylf 9 308 279 14 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 9 308 279 14 'an'}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 9 308 267 3}}}"
					]
				},
				{
					"type": "read-section",
					"paragraphs": [
						"{{{xyl 9 308 219 6}}}",
						"{{{xyl 9 317 147 3}}}"
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 9 317 99 4}}}{{{xyl 10 80 291 12}}}",
						"{{{xyl 10 89 171 9}}}"
					]
				},
				{
					"type": "inventory",
					"items": [
						{
							"type": "link",
							"link": {
								"type": "Item",
								"sources": {
									"pf1": {
										"name": "Blunt Arrow",
										"type": "compendium",
										"compendium": "pf1.weapons-and-ammo"
									}
								}
							}
						},
						{
							"type": "link",
							"link": {
								"type": "Item",
								"sources": {
									"pf1": {
										"name": "Lamp",
										"type": "compendium",
										"compendium": "pf1.items"
									}
								}
							}
						},
						{
							"type": "link",
							"link": {
								"type": "Item",
								"sources": {
									"pf1": {
										"name": "Large Pillow",
										"type": "compendium",
										"compendium": "~.deid-crypt-of-the-everflame-items"
									}
								}
							}
						},
						{
							"type": "link",
							"link": {
								"type": "Item",
								"sources": {
									"pf1": {
										"name": "Trail Rations",
										"type": "compendium",
										"compendium": "pf1.items"
									}
								}
							}
						}
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 10 89 75 2}}} {{{xyl 10 316 291 7}}}"
					]
				}
			]
		}
	]
}]
,[ "pf1en_cote_p2" ,{
	"helyx": {
		"idname": "pf1en_cote_p2",
		"type": "JournalEntry",
		"target": "pf1en_cote_journals"
	},
	"name": "03 {{{xylf 10 316 219 13 'an'}}}",
	"pages": [
		{
			"helyx": {
				"idname": "pf1en_cote_010016",
				"type": "Page"
			},
			"name": "{{{xylf 10 316 219 13 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 10 316 219 13 'an'}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 10 316 207 25}}}",
						"{{{xyl 10 89 171 8}}}",
						"{{{xyl 11 81 687 7}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_011171",
				"type": "Page"
			},
			"name": "{{{xylf 11 317 689 9 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 11 317 689 9 'an'}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 11 317 677 6}}}",
						"{{{xyl 11 327 629 20}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_a1",
				"type": "Page"
			},
			"name": "{{{slicexylf 11 72 615 5 'an' 0 14}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{slicexylf 11 72 615 5 'an' 0 14}}}",
					"cr": "{{{slicexylf 11 72 615 5 'n' 15 4}}}",
					"xp": "{{{slicexylf 11 72 615 5 'n' 20 7}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 11 72 603 4}}}"
					]
				},
				{
					"type": "read-section",
					"paragraphs": [
						"{{{xyl 11 72 543 6}}}"
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 11 72 459 10}}}"
					]
				},
				{
					"type": "inventory",
					"items": [
						{
							"type": "link",
							"link": {
								"type": "Item",
								"sources": {
									"pf1": {
										"name": "Backpack, common",
										"type": "compendium",
										"compendium": "pf1.items"
									}
								}
							}
						},
						{
							"type": "link",
							"link": {
								"type": "Item",
								"sources": {
									"pf1": {
										"name": "Blunt Arrow",
										"type": "compendium",
										"compendium": "pf1.weapons-and-ammo"
									}
								}
							}
						},
						{
							"type": "link",
							"link": {
								"type": "Item",
								"sources": {
									"pf1": {
										"name": "Large Pillow",
										"type": "compendium",
										"compendium": "~.deid-crypt-of-the-everflame-items"
									}
								}
							}
						},
						{
							"type": "link",
							"link": {
								"type": "Item",
								"sources": {
									"pf1": {
										"name": "Trail Rations",
										"type": "compendium",
										"compendium": "pf1.items"
									}
								}
							}
						},
						{
							"type": "link",
							"link": {
								"type": "Item",
								"sources": {
									"pf1": {
										"name": "Smokestick",
										"type": "compendium",
										"compendium": "pf1.items"
									}
								}
							}
						},
						{
							"type": "link",
							"link": {
								"type": "Item",
								"sources": {
									"pf1": {
										"name": "Waterskin",
										"type": "compendium",
										"compendium": "pf1.items"
									}
								}
							}
						}
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 11 81 339 7}}}"
					]
				},
				{
					"type": "section",
					"section": "encounter",
					"title": "{{{xylf 11 81 279 1 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 11 120 279 8 'f'}}}"
							]
						}
					]
				},
				{
					"type": "creature",
					"ref": "pf1en_cote_human-skeleton",
					"amount": "6",
					"cr": "{{{slicexylf 11 75 171 13 'ntx' 19 10}}}",
					"statblock": [
						"{{{pxyl 11 72 159 1}}}",
						"{{{pxyl 11 72 147 1}}}",
						"{{{pxyl 11 72 135 6}}}",
						"{{{sbxylf 11 72 123 3 'nt'}}}",
						"{{{pxyl 11 72 111 2}}}",
						"{{{pxyl 11 72 99 2}}}",
						"{{{pxyl 11 72 87 11}}}",
						"{{{sbxylf 11 72 63 3 'nt'}}}",
						"{{{pxyl 11 308 387 4}}}",
						"{{{pxyl 11 308 375 3}}}",
						"{{{sbxylf 11 308 351 6 'nt'}}}",
						"{{{pxyl 11 308 339 12}}}",
						"{{{pxyl 11 308 327 6}}}",
						"{{{pxyl 11 308 315 3}}}",
						"{{{pxyl 11 308 303 2}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_a2",
				"type": "Page"
			},
			"name": "{{{slicexylf 11 308 279 3 'an' 0 16}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{slicexylf 11 308 279 3 'an' 0 16}}}",
					"cr": "{{{slicexylf 11 308 279 3 'n' 17 4}}}",
					"xp": "{{{slicexylf 11 308 279 3 'n' 22 7}}}"
				},
				{
					"type": "read-section",
					"paragraphs": [
						"{{{xyl 11 308 255 3}}}"
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 11 317 207 8}}}"
					]
				},
				{
					"type": "creature",
					"ref": "pf1en_cote_pit-trap",
					"cr": "{{{slicexylf 11 311 99 10 'nt' 8 9}}}",
					"statblock": [
						"{{{pxyl 11 308 87 1}}}",
						"{{{pxyl 11 308 75 7}}}",
						"{{{sbxylf 11 308 63 5 'n'}}}",
						"{{{pxyl 12 80 687 5}}}",
						"{{{pxyl 12 80 675 7}}}"
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 12 89 651 19}}}"
					]
				},
				{
					"type": "section",
					"section": "treasure",
					"title": "{{{xylf 12 89 495 1 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 12 125 495 11 'f'}}}"
							]
						}
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_012009",
				"type": "Page"
			},
			"name": "{{{xylf 12 277 438 5 'an'}}} [Image]",
			"img": {
				"src": "{{{imgpath 'villager.actor'}}}"
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_a3",
				"type": "Page"
			},
			"name": "{{{slicexylf 12 80 351 3 'an' 0 20}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{slicexylf 12 80 351 3 'an' 0 20}}}",
					"cr": "{{{slicexylf 12 80 351 3 'n' 21 4}}}",
					"xp": "{{{slicexylf 12 80 351 3 'n' 26 7}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 12 80 339 7}}}"
					]
				},
				{
					"type": "read-section",
					"paragraphs": [
						"{{{xyl 12 80 243 3}}}"
					]
				},
				{
					"type": "section",
					"section": "encounter",
					"title": "{{{xylf 12 89 195 1 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 12 124 195 24 'fx'}}}"
							]
						}
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 12 368 615 12}}}",
						"{{{xylf 12 408 471 38 'x'}}}"
					]
				},
				{
					"type": "creature",
					"ref": "pf1en_cote_roldare",
					"cr": "{{{slicexylf 12 319 123 5 'nt' 7 7}}}",
					"statblock": [
						"{{{pxyl 12 316 111 1}}}",
						"{{{pxyl 12 316 99 1}}}",
						"{{{pxyl 12 316 87 1}}}",
						"{{{pxyl 12 316 75 4}}}",
						"{{{sbxylf 12 316 63 3 'nt'}}}",
						"{{{pxyl 13 72 327 2}}}",
						"{{{pxyl 13 72 315 2}}}",
						"{{{pxyl 13 72 303 7}}}",
						"{{{sbxylf 13 72 291 3 'nt'}}}",
						"{{{pxyl 13 72 279 4}}}",
						"{{{pxyl 13 72 267 2}}}",
						"{{{pxyl 13 72 255 2}}}",
						"{{{sbxylf 13 72 243 6 'nt'}}}",
						"{{{pxyl 13 72 231 12}}}",
						"{{{pxyl 13 72 219 8}}}",
						"{{{pxyl 13 72 207 4}}}",
						"{{{pxyl 13 72 183 5}}}",
						"{{{pxyl 13 72 159 2}}}"
					]
				},
				{
					"type": "section",
					"section": "development",
					"title": "{{{xylf 13 81 135 1 'dn'}}}",
					"blocks": [
						{
							"type": "inventory",
							"items": [
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Bedroll",
												"type": "compendium",
												"compendium": "pf1.items"
											}
										}
									}
								},
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Cure Light Wounds",
												"type": "compendium",
												"compendium": "pf1.spells"
											}
										}
									}
								},
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Bullseye Lantern",
												"type": "compendium",
												"compendium": "pf1.items"
											}
										}
									}
								},
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Lamp",
												"type": "compendium",
												"compendium": "pf1.items"
											}
										}
									}
								},
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Trail Rations",
												"type": "compendium",
												"compendium": "pf1.items"
											}
										}
									}
								}
							]
						},
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 13 132 135 11 'f'}}}"
							]
						}
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_a4",
				"type": "Page"
			},
			"name": "{{{slicexylf 13 308 327 5 'an' 0 17}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{slicexylf 13 308 327 5 'an' 0 17}}}",
					"cr": "{{{slicexylf 13 308 327 5 'n' 18 4}}}",
					"xp": "{{{slicexylf 13 308 327 5 'n' 23 7}}}"
				},
				{
					"type": "read-section",
					"paragraphs": [
						"{{{xyl 13 308 303 2}}}"
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 13 317 267 7}}}"
					]
				},
				{
					"type": "section",
					"section": "encounter",
					"title": "{{{xylf 13 317 183 1 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 13 350 183 3 'f'}}}"
							]
						}
					]
				},
				{
					"type": "creature",
					"ref": "pf1en_cote_giant-bombardier-beetle",
					"cr": "{{{slicexylf 13 311 135 8 'nt' 23 7}}}",
					"statblock": [
						"{{{pxyl 13 308 123 1}}}",
						"{{{pxyl 13 308 111 1}}}",
						"{{{pxyl 13 308 99 6}}}",
						"{{{sbxylf 13 308 87 3 'nt'}}}",
						"{{{pxyl 13 308 75 2}}}",
						"{{{pxyl 13 308 63 2}}}",
						"{{{pxyl 14 80 507 13}}}",
						"{{{sbxylf 14 80 483 3 'nt'}}}",
						"{{{pxyl 14 80 471 4}}}",
						"{{{pxyl 14 80 459 2}}}",
						"{{{pxyl 14 80 447 5}}}",
						"{{{sbxylf 14 80 423 6 'nt'}}}",
						"{{{pxyl 14 80 411 12}}}",
						"{{{pxyl 14 80 399 8}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_5img",
				"type": "Page"
			},
			"name": "{{{slicexylf 14 80 375 3 'an' 0 18}}} [Image]",
			"img": {
				"src": "{{{imgpath 'shadows'}}}"
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_014234",
				"type": "Page"
			},
			"name": "{{{xylf 14 89 689 7 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 14 89 689 7 'an'}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 14 90 677 19}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_a5",
				"type": "Page"
			},
			"name": "{{{slicexylf 14 80 375 3 'an' 0 18}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{slicexylf 14 80 375 3 'an' 0 18}}}",
					"cr": "{{{slicexylf 14 80 375 3 'n' 19 4}}}",
					"xp": "{{{slicexylf 14 80 375 3 'n' 24 7}}}"
				},
				{
					"type": "read-section",
					"paragraphs": [
						"{{{xyl 14 80 351 7}}}"
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 14 89 279 9}}}"
					]
				},
				{
					"type": "section",
					"section": "development",
					"title": "{{{xylf 14 89 195 1 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 14 119 195 20 'f'}}}"
							]
						}
					]
				},
				{
					"type": "section",
					"section": "encounter",
					"title": "{{{xylf 14 325 639 1 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 14 359 639 9 'fx'}}}"
							]
						}
					]
				},
				{
					"type": "creature",
					"ref": "pf1en_cote_shadow",
					"cr": "{{{slicexylf 14 319 543 5 'nt' 6 7}}}",
					"statblock": [
						"{{{pxyl 14 316 531 1}}}",
						"{{{pxyl 14 316 519 1}}}",
						"{{{pxyl 14 316 507 6}}}",
						"{{{sbxylf 14 316 495 3 'nt'}}}",
						"{{{pxyl 14 316 483 2}}}",
						"{{{pxyl 14 316 471 2}}}",
						"{{{pxyl 14 316 459 11}}}",
						"{{{sbxylf 14 316 435 3 'nt'}}}",
						"{{{pxyl 14 316 423 4}}}",
						"{{{pxyl 14 316 411 2}}}",
						"{{{pxyl 14 316 399 2}}}",
						"{{{sbxylf 14 316 387 6 'nt'}}}",
						"{{{pxyl 14 316 375 20}}}",
						"{{{pxyl 14 316 351 3}}}",
						"{{{pxyl 14 316 339 5}}}",
						"{{{pxyl 14 316 315 3}}}",
						"{{{pxyl 14 316 303 2}}}",
						"{{{sbxylf 14 316 291 12 'nt'}}}",
						"{{{pxyl 14 316 279 4}}}",
						"{{{pxyl 14 316 243 7}}}"
					]
				},
				{
					"type": "section",
					"section": "treasure",
					"title": "{{{xylf 14 325 183 1 'dn'}}}",
					"blocks": [
						{
							"type": "inventory",
							"items": [
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "+1 Dagger",
												"type": "compendium",
												"compendium": "~.deid-crypt-of-the-everflame-items"
											}
										}
									}
								}
							]
						},
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 14 360 183 17 'f'}}}"
							]
						}
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_a6",
				"type": "Page"
			},
			"name": "{{{slicexylf 15 72 687 5 'an' 0 12}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{slicexylf 15 72 687 5 'an' 0 12}}}",
					"cr": "{{{slicexylf 15 72 687 5 'n' 13 4}}}",
					"xp": "{{{slicexylf 15 72 687 5 'n' 18 7}}}"
				},
				{
					"type": "read-section",
					"paragraphs": [
						"{{{xyl 15 72 663 8}}}"
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 15 72 579 11}}}",
						"{{{xyl 15 81 471 12}}}",
						"{{{xyl 15 81 363 12}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_a7",
				"type": "Page"
			},
			"name": "{{{xylf 15 72 303 5 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 15 72 303 5 'an'}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 15 72 291 8}}}"
					]
				},
				{
					"type": "read-section",
					"paragraphs": [
						"{{{xyl 15 72 231 6}}}"
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 15 81 147 8}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_a8",
				"type": "Page"
			},
			"name": "{{{slicexylf 15 308 687 5 'an' 0 16}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{slicexylf 15 308 687 5 'an' 0 16}}}",
					"cr": "{{{slicexylf 15 308 687 5 'n' 17 4}}}",
					"xp": "{{{slicexylf 15 308 687 5 'n' 22 7}}}"
				},
				{
					"type": "read-section",
					"paragraphs": [
						"{{{xyl 15 308 663 4}}}"
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 15 317 603 9}}}"
					]
				},
				{
					"type": "section",
					"section": "danger",
					"title": "{{{xylf 15 317 519 1 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 15 336 519 16 'f'}}}"
							]
						}
					]
				},
				{
					"type": "creature",
					"ref": "pf1en_cote_bull-rush-trap",
					"cr": "{{{slicexylf 15 311 363 9 'nt' 15 8}}}",
					"statblock": [
						"{{{pxyl 15 308 351 1}}}",
						"{{{pxyl 15 308 339 7}}}",
						"{{{sbxylf 15 308 327 5 'nt'}}}",
						"{{{pxyl 15 308 315 5}}}",
						"{{{pxyl 15 308 303 7}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_a9img",
				"type": "Page"
			},
			"name": "{{{slicexylf 15 308 267 5 'an' 0 23}}} [Image]",
			"img": {
				"src": "{{{imgpath 'wood-statue.actor'}}}"
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_017203",
				"type": "Page"
			},
			"name": "{{{xylf 17 317 689 12 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 17 317 689 12 'an'}}}"
				},
				{
					"type": "read-section",
					"paragraphs": [
						"{{{xyl 17 317 677 16}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_a9",
				"type": "Page"
			},
			"name": "{{{slicexylf 15 308 267 5 'an' 0 23}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{slicexylf 15 308 267 5 'an' 0 23}}}",
					"cr": "{{{slicexylf 15 308 267 5 'n' 24 4}}}",
					"xp": "{{{slicexylf 15 308 267 5 'n' 29 7}}}"
				},
				{
					"type": "read-section",
					"paragraphs": [
						"{{{xyl 15 308 243 7}}}"
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 15 317 171 10}}}"
					]
				},
				{
					"type": "section",
					"section": "encounter",
					"title": "{{{xylf 15 317 75 1 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 15 350 75 2 'f'}}}{{{xyl 16 80 291 9}}}"
							]
						}
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 16 89 207 5}}}",
						"{{{xyl 16 89 147 14}}}"
					]
				},
				{
					"type": "creature",
					"ref": "pf1en_cote_the-golem",
					"cr": "{{{slicexylf 16 319 255 9 'nt' 14 7}}}",
					"statblock": [
						"{{{pxyl 16 316 243 1}}}",
						"{{{pxyl 16 316 231 1}}}",
						"{{{pxyl 16 316 219 6}}}",
						"{{{sbxylf 16 316 207 3 'nt'}}}",
						"{{{pxyl 16 316 195 2}}}",
						"{{{pxyl 16 316 183 2}}}",
						"{{{pxyl 16 316 171 6}}}",
						"{{{pxyl 16 381 171 7}}}",
						"{{{sbxylf 16 316 135 3 'nt'}}}",
						"{{{pxyl 16 316 123 4}}}",
						"{{{pxyl 16 316 111 2}}}",
						"{{{pxyl 16 316 99 8}}}",
						"{{{sbxylf 16 316 87 6 'nt'}}}",
						"{{{pxyl 16 316 75 12}}}",
						"{{{pxyl 16 316 63 8}}}",
						"{{{sbxylf 17 72 687 12 'nt'}}}",
						"{{{pxyl 17 72 675 16}}}"
					]
				},
				{
					"type": "section",
					"section": "treasure",
					"title": "{{{xylf 17 81 555 1 'dn'}}}",
					"blocks": [
						{
							"type": "inventory",
							"items": [
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Tower Shield",
												"type": "compendium",
												"compendium": "pf1.armors-and-shields"
											}
										}
									}
								}
							]
						},
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 17 116 555 14 'f'}}}"
							]
						}
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_a10",
				"type": "Page"
			},
			"name": "{{{xylf 17 72 447 3 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 17 72 447 3 'an'}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 17 72 435 4}}}"
					]
				},
				{
					"type": "read-section",
					"paragraphs": [
						"{{{xyl 17 72 387 3}}}"
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 17 81 339 4}}}"
					]
				},
				{
					"type": "section",
					"section": "treasure",
					"title": "{{{xylf 17 83 291 1 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 17 118 291 6 'f'}}}"
							]
						}
					]
				},
				{
					"type": "section",
					"section": "treasure",
					"title": "{{{xylf 17 81 219 1 'dn'}}}",
					"blocks": [
						{
							"type": "inventory",
							"items": [
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Bull's Strength",
												"type": "compendium",
												"compendium": "pf1.spells"
											}
										}
									}
								},
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Magic Weapon",
												"type": "compendium",
												"compendium": "pf1.spells"
											}
										}
									}
								}
							]
						},
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 17 125 219 6 'f'}}}"
							]
						}
					]
				},
				{
					"type": "section",
					"section": "treasure",
					"title": "{{{xylf 17 81 195 1 'dn'}}}",
					"blocks": [
						{
							"type": "inventory",
							"items": [
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Confusion, Lesser",
												"type": "compendium",
												"compendium": "pf1.spells"
											}
										}
									}
								},
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Cat's Grace",
												"type": "compendium",
												"compendium": "pf1.spells"
											}
										}
									}
								}
							]
						},
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 17 104 195 5 'f'}}}"
							]
						}
					]
				},
				{
					"type": "section",
					"section": "treasure",
					"title": "{{{xylf 17 81 171 1 'dn'}}}",
					"blocks": [
						{
							"type": "inventory",
							"items": [
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Cure Light Wounds",
												"type": "compendium",
												"compendium": "pf1.spells"
											}
										}
									}
								},
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Restoration, Lesser",
												"type": "compendium",
												"compendium": "pf1.spells"
											}
										}
									}
								}
							]
						},
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 17 104 171 6 'f'}}}"
							]
						}
					]
				},
				{
					"type": "section",
					"section": "treasure",
					"title": "{{{xylf 17 81 147 1 'dn'}}}",
					"blocks": [
						{
							"type": "inventory",
							"items": [
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Produce Flame",
												"type": "compendium",
												"compendium": "pf1.spells"
											}
										}
									}
								},
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Barkskin",
												"type": "compendium",
												"compendium": "pf1.spells"
											}
										}
									}
								}
							]
						},
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 17 109 147 5 'f'}}}"
							]
						}
					]
				},
				{
					"type": "section",
					"section": "treasure",
					"title": "{{{xylf 17 81 123 1 'dn'}}}",
					"blocks": [
						{
							"type": "inventory",
							"items": [
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Bear's Endurance",
												"type": "compendium",
												"compendium": "pf1.spells"
											}
										}
									}
								},
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Magic Weapon",
												"type": "compendium",
												"compendium": "pf1.spells"
											}
										}
									}
								}
							]
						},
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 17 116 123 6 'f'}}}"
							]
						}
					]
				},
				{
					"type": "section",
					"section": "treasure",
					"title": "{{{xylf 17 81 99 1 'dn'}}}",
					"blocks": [
						{
							"type": "inventory",
							"items": [
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Owl's Wisdom",
												"type": "compendium",
												"compendium": "pf1.spells"
											}
										}
									}
								},
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Cure Light Wounds",
												"type": "compendium",
												"compendium": "pf1.spells"
											}
										}
									}
								}
							]
						},
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 17 108 99 6 'f'}}}"
							]
						}
					]
				},
				{
					"type": "section",
					"section": "treasure",
					"title": "{{{xylf 17 81 75 1 'dn'}}}",
					"blocks": [
						{
							"type": "inventory",
							"items": [
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Eagle's Splendor",
												"type": "compendium",
												"compendium": "pf1.spells"
											}
										}
									}
								},
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Magic Weapon",
												"type": "compendium",
												"compendium": "pf1.spells"
											}
										}
									}
								}
							]
						},
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 17 117 75 6 'f'}}}"
							]
						}
					]
				},
				{
					"type": "section",
					"section": "treasure",
					"title": "{{{xylf 17 317 459 1 'dn'}}}",
					"blocks": [
						{
							"type": "inventory",
							"items": [
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Cat's Grace",
												"type": "compendium",
												"compendium": "pf1.spells"
											}
										}
									}
								},
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Magic Weapon",
												"type": "compendium",
												"compendium": "pf1.spells"
											}
										}
									}
								}
							]
						},
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 17 350 459 6 'f'}}}"
							]
						}
					]
				},
				{
					"type": "section",
					"section": "treasure",
					"title": "{{{xylf 17 317 435 1 'dn'}}}",
					"blocks": [
						{
							"type": "inventory",
							"items": [
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Invisibility",
												"type": "compendium",
												"compendium": "pf1.spells"
											}
										}
									}
								},
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Cure Light Wounds",
												"type": "compendium",
												"compendium": "pf1.spells"
											}
										}
									}
								}
							]
						},
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 17 347 435 6 'f'}}}"
							]
						}
					]
				},
				{
					"type": "section",
					"section": "treasure",
					"title": "{{{xylf 17 317 411 1 'dn'}}}",
					"blocks": [
						{
							"type": "inventory",
							"items": [
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Magic Missile",
												"type": "compendium",
												"compendium": "pf1.spells"
											}
										}
									}
								},
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Scorching Ray",
												"type": "compendium",
												"compendium": "pf1.spells"
											}
										}
									}
								}
							]
						},
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 17 356 411 6 'f'}}}"
							]
						}
					]
				},
				{
					"type": "section",
					"section": "treasure",
					"title": "{{{xylf 17 317 387 1 'dn'}}}",
					"blocks": [
						{
							"type": "inventory",
							"items": [
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Mage Armor",
												"type": "compendium",
												"compendium": "pf1.spells"
											}
										}
									}
								},
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Web",
												"type": "compendium",
												"compendium": "pf1.spells"
											}
										}
									}
								}
							]
						},
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 17 349 387 5 'f'}}}"
							]
						}
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_a11",
				"type": "Page"
			},
			"name": "{{{slicexylf 17 308 351 5 'an' 0 27}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{slicexylf 17 308 351 5 'an' 0 27}}}",
					"cr": "{{{slicexylf 17 308 351 5 'n' 28 4}}}",
					"xp": "{{{slicexylf 17 308 351 5 'n' 33 7}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 17 308 339 7}}}"
					]
				},
				{
					"type": "read-section",
					"paragraphs": [
						"{{{xyl 17 308 243 4}}}"
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 17 317 183 12}}}"
					]
				},
				{
					"type": "section",
					"section": "development",
					"title": "{{{xylf 17 317 87 1 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 17 335 87 7 'f'}}}{{{xyl 18 80 519 16}}}"
							]
						}
					]
				},
				{
					"type": "creature",
					"ref": "pf1en_cote_pillar-of-arrows",
					"cr": "{{{slicexylf 18 319 687 9 'nt' 22 7}}}",
					"statblock": [
						"{{{pxyl 18 316 675 1}}}",
						"{{{pxyl 18 316 663 7}}}",
						"{{{sbxylf 18 316 651 5 'nt'}}}",
						"{{{pxyl 18 316 639 7}}}",
						"{{{pxyl 18 316 627 9}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_018196",
				"type": "Page"
			},
			"name": "{{{xylf 18 89 679 15 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 18 89 679 15 'an'}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 18 90 667 12}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_a12",
				"type": "Page"
			},
			"name": "{{{slicexylf 18 316 591 6 'an' 0 31}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{slicexylf 18 316 591 6 'an' 0 31}}}",
					"cr": "{{{slicexylf 18 316 591 6 'n' 32 4}}}",
					"xp": "{{{slicexylf 18 316 591 6 'n' 37 7}}}"
				},
				{
					"type": "read-section",
					"paragraphs": [
						"{{{xyl 18 316 555 2}}}"
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 18 325 519 9}}}"
					]
				},
				{
					"type": "section",
					"section": "encounter",
					"title": "{{{xylf 18 325 435 1 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 18 364 435 9 'f'}}}"
							]
						}
					]
				},
				{
					"type": "creature",
					"ref": "pf1en_cote_bloody-skeleton",
					"amount": "4",
					"cr": "{{{slicexylf 18 319 339 14 'nt' 26 9}}}",
					"statblock": [
						"{{{pxyl 18 316 327 1}}}",
						"{{{pxyl 18 316 315 1}}}",
						"{{{pxyl 18 316 303 6}}}",
						"{{{sbxylf 18 316 291 3 'nt'}}}",
						"{{{pxyl 18 316 279 2}}}",
						"{{{pxyl 18 316 267 2}}}",
						"{{{pxyl 18 316 255 11}}}",
						"{{{sbxylf 18 316 231 3 'nt'}}}",
						"{{{pxyl 18 316 219 4}}}",
						"{{{pxyl 18 316 207 2}}}",
						"{{{sbxylf 18 316 195 6 'nt'}}}",
						"{{{pxyl 18 316 183 12}}}",
						"{{{pxyl 18 316 171 8}}}",
						"{{{pxyl 18 316 159 3}}}",
						"{{{pxyl 18 316 147 2}}}",
						"{{{sbxylf 18 316 135 12 'nt'}}}",
						"{{{pxyl 18 316 123 13}}}"
					]
				},
				{
					"type": "section",
					"section": "treasure",
					"title": "{{{xylf 20 89 339 1 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 20 124 339 4 'f'}}}"
							]
						}
					]
				}
			]
		}
	]
}]
,[ "pf1en_cote_p3" ,{
	"helyx": {
		"idname": "pf1en_cote_p3",
		"type": "JournalEntry",
		"target": "pf1en_cote_journals"
	},
	"name": "04 {{{xylf 20 80 279 15 'an'}}}",
	"pages": [
		{
			"helyx": {
				"idname": "pf1en_cote_020014",
				"type": "Page"
			},
			"name": "{{{xylf 20 80 279 15 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 20 80 279 15 'an'}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 20 80 267 7}}}",
						"{{{xyl 20 89 183 15}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_a13",
				"type": "Page"
			},
			"name": "{{{xylf 20 316 339 1 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 20 316 339 1 'an'}}}"
				},
				{
					"type": "read-section",
					"paragraphs": [
						"{{{xyl 20 316 315 5}}}"
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 20 316 243 5}}}",
						"{{{xyl 20 325 183 13}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_a14img",
				"type": "Page"
			},
			"name": "{{{slicexylf 21 72 687 3 'an' 0 16}}} [Image]",
			"img": {
				"src": "{{{imgpath 'giant-frog.actor'}}}"
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_21095",
				"type": "Page"
			},
			"name": "{{{xylf 21 317 679 7 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 21 317 679 7 'an'}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 21 317 667 16}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_a14",
				"type": "Page"
			},
			"name": "{{{slicexylf 21 72 687 3 'an' 0 16}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{slicexylf 21 72 687 3 'an' 0 16}}}",
					"cr": "{{{slicexylf 21 72 687 3 'n' 17 4}}}",
					"xp": "{{{slicexylf 21 72 687 3 'n' 22 9}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 21 72 675 4}}}",
						"{{{xyl 21 81 627 8}}}"
					]
				},
				{
					"type": "read-section",
					"paragraphs": [
						"{{{xyl 21 72 543 5}}}"
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 21 81 471 11}}}"
					]
				},
				{
					"type": "section",
					"section": "encounter",
					"title": "{{{xylf 21 81 363 1 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 21 118 363 12 'f'}}}"
							]
						}
					]
				},
				{
					"type": "creature",
					"ref": "pf1en_cote_giant-frog",
					"amount": "3",
					"cr": "{{{slicexylf 21 75 255 12 'nt' 15 7}}}",
					"statblock": [
						"{{{pxyl 21 72 243 1}}}",
						"{{{pxyl 21 72 231 1}}}",
						"{{{pxyl 21 72 219 4}}}",
						"{{{sbxylf 21 72 207 4 'nt'}}}",
						"{{{pxyl 21 72 195 2}}}",
						"{{{pxyl 21 72 183 2}}}",
						"{{{pxyl 21 72 171 7}}}",
						"{{{sbxylf 21 72 159 3 'nt'}}}",
						"{{{pxyl 21 72 147 6}}}",
						"{{{pxyl 21 72 135 3}}}",
						"{{{pxyl 21 72 111 10}}}",
						"{{{pxyl 21 72 99 3}}}",
						"{{{sbxylf 21 72 75 6 'nt'}}}",
						"{{{pxyl 21 72 63 12}}}",
						"{{{pxyl 21 308 471 6}}}",
						"{{{pxyl 21 308 459 3}}}",
						"{{{pxyl 21 308 447 5}}}",
						"{{{sbxylf 21 308 423 12 'nt'}}}",
						"{{{pxyl 21 308 411 15}}}",
						"{{{pxyl 21 308 291 9}}}",
						"<p class='helyx-p'>{{{xyl 21 308 219 17}}}{{{xyl 22 89 687 3}}}</p>"
					]
				},
				{
					"type": "section",
					"section": "treasure",
					"title": "{{{xylf 22 89 639 1 ''}}}",
					"blocks": [
						{
							"type": "inventory",
							"items": [
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Ring of Swimming",
												"type": "compendium",
												"compendium": "~.deid-crypt-of-the-everflame-items"
											}
										}
									}
								}
							]
						},
						{
							"type": "text",
							"paragraphs": [
								"{{{xyl 22 127 639 15}}}"
							]
						}
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_a15",
				"type": "Page"
			},
			"name": "{{{slicexylf 22 128 495 3 'an' 0 17}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{slicexylf 22 128 495 3 'an' 0 17}}}",
					"cr": "{{{slicexylf 22 128 495 3 'n' 18 4}}}",
					"xp": "{{{slicexylf 22 128 495 3 'n' 23 7}}}"
				},
				{
					"type": "read-section",
					"paragraphs": [
						"{{{xyl 22 138 471 5}}}",
						"{{{xyl 22 171 411 4}}}"
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 22 211 351 11}}}",
						"{{{xyl 22 262 279 9}}}"
					]
				},
				{
					"type": "section",
					"section": "development",
					"title": "{{{xylf 22 184 195 1 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 22 213 195 12 'f'}}}"
							]
						}
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 22 287 75 5}}}",
						"{{{xyl 22 325 663 19}}}",
						"{{{xyl 22 325 459 3}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_a16",
				"type": "Page"
			},
			"name": "{{{slicexylf 22 316 411 3 'an' 0 18}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{slicexylf 22 316 411 3 'an' 0 18}}}",
					"cr": "{{{slicexylf 22 316 411 3 'n' 19 4}}}",
					"xp": "{{{slicexylf 22 316 411 3 'n' 24 9}}}"
				},
				{
					"type": "read-section",
					"paragraphs": [
						"{{{xyl 22 316 387 5}}}"
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 22 316 315 9}}}"
					]
				},
				{
					"type": "section",
					"section": "hazard",
					"title": "{{{xylf 22 325 255 1 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 22 354 255 7 'f'}}}"
							]
						}
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 22 325 195 16}}}"
					]
				},
				{
					"type": "section",
					"section": "encounter",
					"title": "{{{xylf 23 81 687 1 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 23 118 687 9 'f'}}}"
							]
						}
					]
				},
				{
					"type": "creature",
					"ref": "pf1en_cote_human-skeleton",
					"amount": "8",
					"cr": "{{{slicexylf 23 75 591 13 'nt' 19 9}}}",
					"statblock": [
						"{{{pxyl 23 72 579 1}}}",
						"{{{pxyl 23 72 567 2}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_a17",
				"type": "Page"
			},
			"name": "{{{xylf 23 72 543 3 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 23 72 543 3 'an'}}}"
				},
				{
					"type": "read-section",
					"paragraphs": [
						"{{{xyl 23 72 519 5}}}"
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 23 72 447 16}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_a18img",
				"type": "Page"
			},
			"name": "{{{slicexylf 23 72 315 3 'an' 0 19}}} [Image]",
			"img": {
				"src": "{{{imgpath 'bloody-skeleton.actor'}}}"
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_023201",
				"type": "Page"
			},
			"name": "{{{xylf 23 317 689 9 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 23 317 689 9 'an'}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 23 317 677 33}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_a18",
				"type": "Page"
			},
			"name": "{{{slicexylf 23 72 315 3 'an' 0 19}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{slicexylf 23 72 315 3 'an' 0 19}}}",
					"cr": "{{{slicexylf 23 72 315 3 'n' 20 4}}}",
					"xp": "{{{slicexylf 23 72 315 3 'n' 25 7}}}"
				},
				{
					"type": "read-section",
					"paragraphs": [
						"{{{xyl 23 72 291 5}}}"
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 23 81 219 7}}}"
					]
				},
				{
					"type": "section",
					"section": "encounter",
					"title": "{{{xylf 23 81 147 1 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 23 118 147 13 'f'}}}"
							]
						}
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 23 317 423 6}}}"
					]
				},
				{
					"type": "creature",
					"ref": "pf1en_cote_human-plague-zombie",
					"amount": "4",
					"cr": "{{{slicexylf 23 311 363 14 'nt' 24 9}}}",
					"statblock": [
						"{{{pxyl 23 308 351 1}}}",
						"{{{pxyl 23 308 339 1}}}",
						"{{{pxyl 23 308 327 6}}}",
						"{{{sbxylf 23 308 315 3 'nt'}}}",
						"{{{pxyl 23 308 303 2}}}",
						"{{{pxyl 23 308 291 2}}}",
						"{{{pxyl 23 308 279 9}}}",
						"{{{sbxylf 23 308 255 3 'nt'}}}",
						"{{{pxyl 23 308 243 4}}}",
						"{{{pxyl 23 308 231 2}}}",
						"{{{pxyl 23 308 219 2}}}",
						"{{{sbxylf 23 308 207 6 'nt'}}}",
						"{{{pxyl 23 308 195 12}}}",
						"{{{pxyl 23 308 183 6}}}",
						"{{{pxyl 23 308 171 3}}}",
						"{{{sbxylf 23 364 174 1 'nt'}}}",
						"{{{pxyl 23 308 159 2}}}",
						"{{{sbxylf 23 308 147 12 'nt'}}}",
						"{{{pxyl 23 308 135 8}}}",
						"<p class='helyx-p'>{{{xyl 23 308 75 9}}}{{{xyl 24 89 507 12}}}</p>",
						"{{{pxyl 24 80 459 8}}}"
					]
				},
				{
					"type": "section",
					"section": "treasure",
					"title": "{{{xylf 24 89 387 1 'dn'}}}",
					"blocks": [
						{
							"type": "inventory",
							"items": [
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Cure Moderate Wounds",
												"type": "compendium",
												"compendium": "pf1.spells"
											}
										}
									}
								},
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Small Handbill",
												"type": "compendium",
												"compendium": "~.deid-crypt-of-the-everflame-items"
											}
										}
									}
								}
							]
						},
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 24 124 387 15 'f'}}}"
							]
						}
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_024009",
				"type": "Page"
			},
			"name": "{{{xylf 24 90 689 9 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 24 90 689 9 'an'}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 24 90 677 10}}}"
					]
				},
				{
					"type": "creature",
					"statblock": [
						"{{{pxyl 24 90 579 6}}}",
						"{{{pxyl 24 90 567 3}}}",
						"{{{pxyl 24 90 555 5}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_a19",
				"type": "Page"
			},
			"name": "{{{slicexylf 24 80 219 5 'an' 0 26}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{slicexylf 24 80 219 5 'an' 0 26}}}",
					"cr": "{{{slicexylf 24 80 219 5 'n' 27 4}}}",
					"xp": "{{{slicexylf 24 80 219 5 'n' 32 7}}}"
				},
				{
					"type": "read-section",
					"paragraphs": [
						"{{{xyl 24 80 195 5}}}"
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 24 80 123 6}}}",
						"{{{xyl 24 325 687 14}}}"
					]
				},
				{
					"type": "section",
					"section": "hazard",
					"title": "{{{xylf 24 325 567 1 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 24 343 567 12 'f'}}}"
							]
						}
					]
				},
				{
					"type": "creature",
					"ref": "pf1en_cote_pool-of-fear",
					"cr": "{{{slicexylf 24 319 459 10 'nt' 12 7}}}",
					"statblock": [
						"{{{pxyl 24 316 447 1}}}",
						"{{{pxyl 24 316 435 7}}}",
						"{{{sbxylf 24 316 423 5 'nt'}}}",
						"{{{pxyl 24 316 411 7}}}",
						"{{{pxyl 24 316 399 9}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_a20",
				"type": "Page"
			},
			"name": "{{{slicexylf 24 316 363 3 'an' 0 20}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{slicexylf 24 316 363 3 'an' 0 20}}}",
					"cr": "{{{slicexylf 24 316 363 3 'n' 21 4}}}",
					"xp": "{{{slicexylf 24 316 363 3 'n' 26 9}}}"
				},
				{
					"type": "read-section",
					"paragraphs": [
						"{{{xyl 24 316 339 2}}}"
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 24 325 303 6}}}"
					]
				},
				{
					"type": "section",
					"section": "encounter",
					"title": "{{{xylf 24 325 231 1 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 24 364 231 4 'f'}}}"
							]
						}
					]
				},
				{
					"type": "creature",
					"ref": "pf1en_cote_bat-swarm",
					"amount": "2",
					"cr": "{{{slicexylf 24 319 171 11 'nt' 14 7}}}",
					"statblock": [
						"{{{pxyl 24 316 159 1}}}",
						"{{{pxyl 24 316 147 1}}}",
						"{{{pxyl 24 316 135 8}}}",
						"{{{sbxylf 24 316 123 3 'nt'}}}",
						"{{{pxyl 24 316 111 2}}}",
						"{{{pxyl 24 316 99 2}}}",
						"{{{pxyl 24 316 87 7}}}",
						"{{{pxyl 24 316 75 2}}}",
						"{{{sbxylf 24 316 63 3 'nt'}}}",
						"{{{pxyl 25 317 687 1}}}",
						"{{{pxyl 25 317 675 3}}}",
						"{{{pxyl 25 317 663 1}}}",
						"{{{pxyl 25 72 687 6}}}",
						"{{{pxyl 25 72 675 2}}}",
						"{{{pxyl 25 72 663 8}}}",
						"{{{pxyl 25 72 651 2}}}",
						"{{{sbxylf 25 72 639 6 'nt'}}}",
						"{{{pxyl 25 72 627 12}}} {{{pxyl 25 72 615 6}}} {{{pxyl 25 72 603 3}}} {{{pxyl 25 72 591 5}}} {{{pxyl 25 72 567 2}}}",
						"{{{sbxylf 25 72 555 12 'nt'}}}",
						"{{{pxyl 25 72 543 8}}}",
						"{{{pxyl 25 72 507 10}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_a21",
				"type": "Page"
			},
			"name": "{{{slicexylf 25 72 435 5 'an' 0 21}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{slicexylf 25 72 435 5 'an' 0 21}}}",
					"cr": "{{{slicexylf 25 72 435 5 'n' 22 4}}}",
					"xp": "{{{slicexylf 25 72 435 5 'n' 27 8}}}"
				},
				{
					"type": "read-section",
					"paragraphs": [
						"{{{xyl 25 72 411 6}}}"
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 25 72 327 4}}}"
					]
				},
				{
					"type": "section",
					"section": "hazard",
					"title": "{{{xylf 25 81 279 1 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 25 99 279 8 'f'}}}"
							]
						}
					]
				},
				{
					"type": "creature",
					"ref": "pf1en_cote_bull-rush-trap",
					"cr": "{{{slicexylf 25 75 171 14 'nt' 34 7}}}",
					"statblock": [
						"{{{pxyl 25 72 159 1}}}",
						"{{{pxyl 25 72 147 7}}}",
						"{{{sbxylf 25 72 135 5 'nt'}}}",
						"{{{pxyl 25 72 123 5}}}",
						"<p class='helyx-p'>{{{xyl 25 72 111 8}}}{{{xyl 25 317 687 5}}}</p>"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_a22img",
				"type": "Page"
			},
			"name": "{{{slicexylf 25 308 639 5 'an' 0 17}}} [Image]",
			"img": {
				"src": "{{{imgpath 'skeletal-knight.actor'}}}"
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_026170",
				"type": "Page"
			},
			"name": "{{{xylf 26 89 689 7 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 26 89 689 7 'an'}}}"
				},
				{
					"type": "equipment",
					"name": "{{{xlf 26170 6 'an'}}}",
					"statblock": [
						"{{{pxyl 26 90 677 2}}}",
						"{{{pxyl 26 183 677 4}}}",
						"{{{pxyl 26 90 665 2}}}",
						"{{{pxyl 26 134 665 2}}}",
						"{{{pxyl 26 166 665 2}}}",
						"{{{pxyl 26 90 653 10}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_026199",
				"type": "Page"
			},
			"name": "{{{xylf 26 89 541 18 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 26 89 541 18 'an'}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 26 90 501 5}}}",
						"{{{xyl 26 99 441 6}}}",
						"{{{xyl 26 99 369 5}}}",
						"{{{xyl 26 99 309 5}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_a22",
				"type": "Page"
			},
			"name": "{{{slicexylf 25 308 639 5 'an' 0 17}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{slicexylf 25 308 639 4 'an' 0 11}}}",
					"cr": "{{{slicexylf 25 368 639 3 'n' 8 4}}}",
					"xp": "{{{slicexylf 25 368 639 3 'n' 13 9}}}"
				},
				{
					"type": "read-section",
					"paragraphs": [
						"{{{xyl 25 308 615 5}}}",
						"{{{xyl 25 317 555 4}}}"
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 25 317 519 2}}}"
					]
				},
				{
					"type": "read-section",
					"paragraphs": [
						"{{{xyl 25 308 483 5}}}"
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 25 308 411 14}}}"
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 26 80 231 5}}}",
						"{{{xyl 26 89 171 14}}}"
					]
				},
				{
					"type": "section",
					"section": "encounter",
					"title": "{{{xylf 26 325 687 1 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 26 362 687 15 'f'}}}"
							]
						}
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 26 430 531 5}}}"
					]
				},
				{
					"type": "creature",
					"ref": "pf1en_cote_skeletal-knight",
					"cr": "{{{slicexylf 26 337 471 5 'nt' 4 7}}}",
					"statblock": [
						"{{{pxyl 26 316 459 1}}}",
						"{{{pxyl 26 316 447 1}}}",
						"{{{pxyl 26 316 435 1}}}",
						"{{{pxyl 26 316 423 6}}}",
						"{{{sbxylf 26 316 411 3 'nt'}}}",
						"{{{pxyl 26 316 399 2}}}",
						"{{{pxyl 26 316 387 2}}}",
						"{{{pxyl 26 316 375 7}}}",
						"{{{pxyl 26 316 363 4}}}",
						"{{{sbxylf 26 316 351 3 'nt'}}}",
						"{{{pxyl 26 316 339 4}}}",
						"{{{pxyl 26 316 327 4}}}",
						"{{{pxyl 26 316 315 2}}}",
						"{{{sbxylf 26 316 303 3 'nt'}}}",
						"{{{pxyl 26 316 291 5}}}",
						"{{{pxyl 26 316 243 2}}}",
						"{{{pxyl 26 316 231 3}}}",
						"{{{sbxylf 26 316 219 6 'nt'}}}",
						"{{{pxyl 26 316 207 12}}}",
						"{{{pxyl 26 316 195 8}}}",
						"{{{pxyl 26 316 183 5}}}",
						"{{{pxyl 26 316 159 2}}}",
						"{{{pxyl 26 316 147 5}}}"
					]
				},
				{
					"type": "creature",
					"ref": "pf1en_cote_human-skeleton",
					"cr": "{{{slicexylf 26 319 123 13 'nt' 19 9}}}",
					"statblock": [
						"{{{pxyl 26 316 111 1}}}",
						"{{{pxyl 26 316 99 2}}}"
					]
				},
				{
					"type": "section",
					"section": "development",
					"title": "{{{xylf 26 325 87 1 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 26 380 87 5 'f'}}}{{{xyl 27 72 687 7}}}"
							]
						}
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 27 81 603 28}}}",
						"{{{xyl 27 81 363 10}}}"
					]
				},
				{
					"type": "section",
					"section": "treasure",
					"title": "{{{xylf 27 81 315 1 'dn'}}}",
					"blocks": [
						{
							"type": "inventory",
							"items": [
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Bag of Holding",
												"type": "compendium",
												"compendium": "~.deid-crypt-of-the-everflame-items"
											}
										}
									}
								},
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Bashing Shield",
												"type": "compendium",
												"compendium": "~.deid-crypt-of-the-everflame-items"
											}
										}
									}
								},
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Elemental Gem (Water)",
												"type": "compendium",
												"compendium": "~.deid-crypt-of-the-everflame-items"
											}
										}
									}
								},
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Silver Scale",
												"type": "compendium",
												"compendium": "~.deid-crypt-of-the-everflame-items"
											}
										}
									}
								}
							]
						},
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 27 115 315 10 'f'}}}"
							]
						}
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_a23",
				"type": "Page"
			},
			"name": "{{{xylf 27 72 255 5 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 27 72 255 5 'an'}}}"
				},
				{
					"type": "read-section",
					"paragraphs": [
						"{{{xyl 27 72 231 3}}}"
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 27 81 183 4}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_a24",
				"type": "Page"
			},
			"name": "{{{xylf 27 72 123 5 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 27 72 123 5 'an'}}}"
				},
				{
					"type": "read-section",
					"paragraphs": [
						"{{{xyl 27 72 99 4}}}"
					]
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 27 317 687 7}}}",
						"{{{xyl 27 317 603 9}}}"
					]
				},
				{
					"type": "section",
					"section": "treasure",
					"title": "{{{xylf 27 317 495 1 'dn'}}}",
					"blocks": [
						{
							"type": "inventory",
							"items": [
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Magic Missile",
												"type": "compendium",
												"compendium": "pf1.spells"
											}
										}
									}
								},
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Bracers of Armor +1",
												"type": "compendium",
												"compendium": "~.deid-crypt-of-the-everflame-items"
											}
										}
									}
								},
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Horn of Fog",
												"type": "compendium",
												"compendium": "~.deid-crypt-of-the-everflame-items"
											}
										}
									}
								},
								{
									"type": "link",
									"link": {
										"type": "Item",
										"sources": {
											"pf1": {
												"name": "Spellbook",
												"type": "compendium",
												"compendium": "~.deid-crypt-of-the-everflame-items"
											}
										}
									}
								}
							]
						},
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 27 351 495 16 'f'}}}"
							]
						}
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_027118",
				"type": "Page"
			},
			"name": "{{{xylf 27 308 375 6 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 27 308 375 6 'an'}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 27 308 363 3}}}",
						"{{{xyl 27 317 327 12}}}",
						"{{{xyl 27 317 183 13}}}"
					]
				}
			]
		}
	]
}]
,[ "pf1en_cote_apx1" ,{
	"helyx": {
		"idname": "pf1en_cote_apx1",
		"type": "JournalEntry",
		"target": "pf1en_cote_journals"
	},
	"name": "05 {{{xylf 28 80 279 10 'an'}}}",
	"pages": [
		{
			"helyx": {
				"idname": "pf1en_cote_028009",
				"type": "Page"
			},
			"name": "{{{xylf 28 80 279 10 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 28 80 279 10 'an'}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 28 80 267 8}}}"
					]
				},
				{
					"type": "creature",
					"name": "{{{xlf 28018 0 'an'}}}",
					"statblock": [
						"{{{pxyl 28 80 147 2}}}",
						"{{{pxyl 28 186 147 3}}}",
						"{{{pxyl 28 80 135 2}}}",
						"{{{sbxylf 28 80 123 2 'nt'}}}",
						"{{{pxyl 28 80 111 2}}}",
						"{{{pxyl 28 80 99 4}}}",
						"{{{sbxylf 28 80 75 8 'nt'}}}",
						"{{{pxyl 28 80 63 5}}}",
						"{{{pxyl 28 366 279 3}}}",
						"{{{pxyl 28 453 267 4}}}",
						"{{{pxyl 28 367 243 3}}}",
						"{{{pxyl 28 348 231 4}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_028071",
				"type": "Page"
			},
			"name": "{{{xylf 28 316 195 3 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 28 316 195 3 'an'}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 28 316 183 4}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_k1",
				"type": "Page"
			},
			"name": "{{{xylf 28 325 135 1 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 28 325 135 1 'an'}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xylf 28 384 135 9 'f'}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_k2",
				"type": "Page"
			},
			"name": "{{{xylf 29 81 687 1 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 29 81 687 1 'an'}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xylf 29 128 687 8 'f'}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_k3",
				"type": "Page"
			},
			"name": "{{{xylf 29 81 615 1 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 29 81 615 1 'an'}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xylf 29 180 615 8 'f'}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_k4",
				"type": "Page"
			},
			"name": "{{{xylf 29 81 519 1 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 29 81 519 1 'an'}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xylf 29 158 519 8 'f'}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_k5",
				"type": "Page"
			},
			"name": "{{{xylf 29 81 447 1 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 29 81 447 1 'an'}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xylf 29 195 447 7 'f'}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_k6",
				"type": "Page"
			},
			"name": "{{{xylf 29 81 387 1 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 29 81 387 1 'an'}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xylf 29 141 387 5 'f'}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_k7",
				"type": "Page"
			},
			"name": "{{{xylf 29 81 327 1 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 29 81 327 1 'an'}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xylf 29 158 327 7 'f'}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_k8",
				"type": "Page"
			},
			"name": "{{{xylf 29 81 267 1 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 29 81 267 1 'an'}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xylf 29 165 267 2 'f'}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_k9",
				"type": "Page"
			},
			"name": "{{{xylf 29 81 243 1 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 29 81 243 1 'an'}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xylf 29 152 243 5 'f'}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_k10",
				"type": "Page"
			},
			"name": "{{{xylf 29 81 183 1 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 29 81 183 1 'an'}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xylf 29 157 183 3 'f'}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_k11",
				"type": "Page"
			},
			"name": "{{{xylf 29 81 147 1 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 29 81 147 1 'an'}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xylf 29 158 147 2 'f'}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_k12",
				"type": "Page"
			},
			"name": "{{{xylf 29 81 123 1 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 29 81 123 1 'an'}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xylf 29 175 123 4 'f'}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_k13",
				"type": "Page"
			},
			"name": "{{{xylf 29 81 75 1 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 29 81 75 1 'an'}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xylf 29 154 75 4 'f'}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_030009",
				"type": "Page"
			},
			"name": "{{{xylf 30 316 687 3 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 30 316 687 3 'an'}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 30 316 675 6}}}"
					]
				},
				{
					"type": "section",
					"section": "npc",
					"title": "{{{xylf 30 325 603 1 'dn'}}}",
					"img": {
						"src": "{{{tokenpath 'cygar.token'}}}"
					},
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 30 512 603 17 'f'}}}"
							]
						}
					]
				},
				{
					"type": "section",
					"section": "npc",
					"title": "{{{xylf 30 325 423 2 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 30 346 411 20 'f'}}}"
							]
						}
					]
				},
				{
					"type": "section",
					"section": "npc",
					"title": "{{{xylf 30 325 219 1 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 30 529 219 16 'f'}}}"
							]
						}
					]
				},
				{
					"type": "section",
					"section": "npc",
					"title": "{{{xylf 30 325 75 1 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 30 510 75 4 'f'}}} {{{xyl 31 72 687 17}}}"
							]
						}
					]
				},
				{
					"type": "section",
					"section": "npc",
					"title": "{{{xylf 31 81 531 2 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 31 138 519 26 'f'}}}"
							]
						}
					]
				},
				{
					"type": "section",
					"section": "npc",
					"title": "{{{xylf 31 81 231 2 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 31 136 219 20 'f'}}}"
							]
						}
					]
				},
				{
					"type": "section",
					"section": "npc",
					"title": "{{{xylf 31 390 363 3 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 31 422 339 18 'f'}}}"
							]
						}
					]
				},
				{
					"type": "section",
					"section": "npc",
					"title": "{{{xylf 31 317 171 2 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 31 314 159 13 'f'}}}{{{xyl 32 80 687 4}}}"
							]
						}
					]
				},
				{
					"type": "section",
					"section": "npc",
					"title": "{{{xylf 32 89 639 2 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 32 111 627 20 'f'}}}"
							]
						}
					]
				},
				{
					"type": "section",
					"section": "npc",
					"title": "{{{xylf 32 89 435 2 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 32 111 423 13 'f'}}}"
							]
						}
					]
				},
				{
					"type": "section",
					"section": "npc",
					"title": "{{{xylf 32 89 267 2 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 32 167 255 22 'f'}}}"
							]
						}
					]
				},
				{
					"type": "section",
					"section": "npc",
					"title": "{{{xylf 32 89 87 1 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 32 269 87 15 'f'}}}"
							]
						}
					]
				},
				{
					"type": "section",
					"section": "npc",
					"title": "{{{xylf 32 325 567 1 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 32 498 567 23 'f'}}}"
							]
						}
					]
				},
				{
					"type": "section",
					"section": "npc",
					"title": "{{{xylf 32 325 387 2 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 32 346 375 15 'f'}}}"
							]
						}
					]
				},
				{
					"type": "section",
					"section": "npc",
					"title": "{{{xylf 32 325 219 1 'dn'}}}",
					"img": {
						"src": "{{{tokenpath 'jonark-uptal.token'}}}"
					},
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 32 529 219 13 'f'}}}"
							]
						}
					]
				},
				{
					"type": "section",
					"section": "npc",
					"title": "{{{xylf 32 325 87 1 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 32 459 87 5 'f'}}} {{{xyl 33 72 687 19}}}"
							]
						}
					]
				},
				{
					"type": "section",
					"section": "npc",
					"title": "{{{xylf 33 81 507 1 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 33 285 507 16 'f'}}}"
							]
						}
					]
				},
				{
					"type": "section",
					"section": "npc",
					"title": "{{{xylf 33 317 591 2 'dn'}}}",
					"blocks": [
						{
							"type": "text",
							"paragraphs": [
								"{{{xylf 33 404 579 15 'f'}}}"
							]
						}
					]
				}
			]
		},
		{
			"helyx": {
				"idname": "pf1en_cote_031111",
				"type": "Page"
			},
			"name": "{{{xylf 31 317 689 11 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 31 317 689 11 'an'}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 31 317 677 9}}}",
						"{{{xyl 31 406 569 30}}}"
					]
				}
			]
		}
	]
}]
,[ "pf1en_cote_ogl" ,{
	"helyx": {
		"idname": "pf1en_cote_ogl",
		"type": "JournalEntry",
		"target": "pf1en_cote_journals"
	},
	"name": "06 {{{xylf 30 87 683 15 'nx'}}}",
	"pages": [
		{
			"helyx": {
				"idname": "pf1en_cote_ogl",
				"type": "Page"
			},
			"name": "{{{xylf 30 87 683 15 'nx'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xylf 30 87 683 15 'nx'}}}"
				},
				{
					"type": "text",
					"paragraphs": [
						"{{{xyl 30 92 672 1}}}{{{xylf 30 87 665 1 'x'}}}{{{xyl 30 99 665 1}}}",
						"{{{xylf 30 92 658 1 'x'}}}{{{xyl 30 95 658 30}}}",
						"{{{xylf 30 92 462 1 'x'}}}{{{xyl 30 95 462 8}}}",
						"{{{xylf 30 92 420 1 'x'}}}{{{xyl 30 95 420 4}}}",
						"{{{xylf 30 92 406 1 'x'}}}{{{xyl 30 95 406 3}}}",
						"{{{xylf 30 92 385 1 'x'}}}{{{xyl 30 95 385 6}}}",
						"{{{xylf 30 92 357 1 'x'}}}{{{xyl 30 95 357 5}}}",
						"{{{xylf 30 92 322 1 'x'}}}{{{xyl 30 95 322 10}}}",
						"{{{xylf 30 92 252 1 'x'}}}{{{xyl 30 95 252 2}}}",
						"{{{xylf 30 92 238 1 'x'}}}{{{xyl 30 95 238 4}}}",
						"{{{xylf 30 92 210 1 'x'}}}{{{xyl 30 98 210 2}}}",
						"{{{xylf 30 92 196 1 'x'}}}{{{xyl 30 98 196 3}}}",
						"{{{xylf 30 92 175 1 'x'}}}{{{xyl 30 98 175 6}}}",
						"{{{xylf 30 92 147 1 'x'}}}{{{xyl 30 98 147 2}}}{{{xylf 30 223 140 1 'x'}}}{{{xyl 30 229 140 2}}}",
						"{{{xylf 30 92 126 1 'x'}}}{{{xyl 30 98 126 2}}}",
						"{{{xylf 30 92 112 1 'x'}}}{{{xyl 30 98 112 1}}}",
						"{{{xyl 30 92 105 1}}}{{{xylf 30 147 105 1 'x'}}}{{{xyl 30 150 105 1}}}{{{xylf 30 151 105 1 'x'}}}{{{xyl 30 154 105 1}}}{{{xylf 30 184 105 1 'x'}}}{{{xyl 30 196 105 2}}}{{{xylf 30 191 98 1 'x'}}}{{{xyl 30 203 98 3}}}",
						"{{{xylf 30 92 77 3 'b'}}}{{{xyl 30 202 77 1}}}{{{xylf 30 231 77 1 'x'}}}{{{xyl 30 243 77 2}}}"
					]
				}
			]
		}
	]
}]
,[ "pf1en_cote_town" ,{
	"helyx": {
		"idname": "pf1en_cote_town",
		"target": "pf1en_cote_scenes",
		"type": "Scene"
	},
	"name": "{{{xylf 28 83 159 2 'tng'}}}",
	"includes": [
		"modules/pf1-pdf-en-import/datas/imports/crypt-of-the-everflame/kassen.json"
	]
}]
,[ "pf1en_cote_trail" ,{
	"helyx": {
		"idname": "pf1en_cote_trail",
		"target": "pf1en_cote_scenes",
		"type": "Scene"
	},
	"name": "The Trail",
	"includes": [
		"modules/pf1-pdf-en-import/datas/imports/crypt-of-the-everflame/the-trail.json"
	]
}]
,[ "pf1en_cote_level1" ,{
	"helyx": {
		"idname": "pf1en_cote_level1",
		"target": "pf1en_cote_scenes",
		"type": "Scene"
	},
	"name": "{{{xylf 10 391 219 6 'an'}}}",
	"includes": [
		"modules/pf1-pdf-en-import/datas/imports/crypt-of-the-everflame/upper-level.json"
	],
	"tokens": [
		{
			"helyx": {
				"idname": "pf1en_cote_human-skeleton",
				"x": 1600,
				"y": 1300,
				"desc": "a1 skel #1"
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_human-skeleton",
				"x": 1900,
				"y": 1300,
				"desc": "a1 skel #2"
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_human-skeleton",
				"x": 1600,
				"y": 1500,
				"desc": "a1 skel #3"
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_human-skeleton",
				"x": 1900,
				"y": 1600,
				"desc": "a1 skel #4"
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_human-skeleton",
				"x": 1700,
				"y": 1800,
				"desc": "a1 skel #5"
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_human-skeleton",
				"x": 1800,
				"y": 1800,
				"desc": "a1 skel #6"
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_roldare",
				"x": 2800,
				"y": 2900
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_giant-bombardier-beetle",
				"x": 2300,
				"y": 2800
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_shadow",
				"x": 2400,
				"y": 3600
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_the-golem",
				"x": 900,
				"y": 3100
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_bloody-skeleton",
				"x": 1400,
				"y": 3300
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_bloody-skeleton",
				"x": 1800,
				"y": 3300
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_bloody-skeleton",
				"x": 1800,
				"y": 3500
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_bloody-skeleton",
				"x": 1400,
				"y": 3500
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_kassen-s-blades",
				"x": 800,
				"y": 2100
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_pit-trap",
				"x": 2600,
				"y": 900
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_pit-trap",
				"x": 2300,
				"y": 1000
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_pit-trap",
				"x": 2400,
				"y": 1100
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_pit-trap",
				"x": 2800,
				"y": 1100
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_pit-trap",
				"x": 2500,
				"y": 1400
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_pit-trap",
				"x": 2700,
				"y": 1500
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_pit-trap",
				"x": 2400,
				"y": 1700
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_pit-trap",
				"x": 2600,
				"y": 1700
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_pit-trap",
				"x": 2500,
				"y": 1800
			}
		}
	]
}]
,[ "pf1en_cote_lower-level" ,{
	"helyx": {
		"idname": "pf1en_cote_lower-level",
		"target": "pf1en_cote_scenes",
		"type": "Scene"
	},
	"name": "{{{xylf 20 158 279 8 'an'}}}",
	"includes": [
		"modules/pf1-pdf-en-import/datas/imports/crypt-of-the-everflame/lower-level.json"
	],
	"tokens": [
		{
			"helyx": {
				"idname": "pf1en_cote_giant-frog",
				"x": 2600,
				"y": 1200
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_giant-frog",
				"x": 2800,
				"y": 1200
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_giant-frog",
				"x": 3000,
				"y": 1200
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_human-skeleton",
				"x": 2500,
				"y": 2300
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_human-skeleton",
				"x": 2900,
				"y": 2300
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_human-skeleton",
				"x": 2400,
				"y": 2000
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_human-skeleton",
				"x": 2700,
				"y": 2200
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_human-skeleton",
				"x": 2600,
				"y": 2600
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_human-skeleton",
				"x": 2900,
				"y": 2600
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_human-skeleton",
				"x": 2700,
				"y": 2300
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_human-skeleton",
				"x": 2700,
				"y": 2000
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_skeletal-knight",
				"x": 1500,
				"y": 3500
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_human-skeleton",
				"x": 2200,
				"y": 2900
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_human-skeleton",
				"x": 1700,
				"y": 2900
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_human-skeleton",
				"x": 2400,
				"y": 3500
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_human-skeleton",
				"x": 1500,
				"y": 3100
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_bat-swarm",
				"x": 1100,
				"y": 2500
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_bat-swarm",
				"x": 1300,
				"y": 2400
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_human-plague-zombie",
				"x": 1100,
				"y": 1200
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_human-plague-zombie",
				"x": 900,
				"y": 1000
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_human-plague-zombie",
				"x": 1300,
				"y": 1400
			}
		},
		{
			"helyx": {
				"idname": "pf1en_cote_human-plague-zombie",
				"x": 1600,
				"y": 1200
			}
		}
	]
}]
]);    

    static folders = 
    [
        // Journals
        { idname: "pf1en_cote_journals", name: '{{xylf 3 97 351 0 "any"}}', type: "JournalEntry" },

        // Actors
        { idname: "pf1en_cote_actors", name: '{{xylf 3 97 351 0 "any"}}', type: "Actor"},
        { idname: "pf1en_cote_bestiary", name: 'Bestiary', parent: "pf1en_cote_actors"},
        { idname: "pf1en_cote_npcs", name: 'NPCs', parent: "pf1en_cote_actors"},
        { idname: "pf1en_cote_traps", name: 'Traps', parent: "pf1en_cote_actors"},
        
        // Items
        // { idname: "pf1en_cote_items", name: '{{xylf 3 97 351 0 "any"}}',  type:"Item" },
                    
        // Scenes
        { idname: "pf1en_cote_scenes", name: '{{xylf 3 97 351 0 "any"}}',  type:"Scene" },
    ];

    static fonts = [{"src":{"page":5,"index":5000,"x":174,"y":2},"position":5000,"flags":{"skip":true},"roles":["watermark"],"index":0}
,{"src":{"page":5,"index":5001,"x":174,"y":775},"position":5001,"flags":{"skip":true},"roles":["watermark"],"index":1}
,{"src":{"page":5,"index":5002,"x":0,"y":0},"position":5002,"flags":{"skip":true},"roles":["watermark"],"index":2}
,{"src":{"page":5,"index":5008,"x":72,"y":687},"position":5008,"flags":{},"roles":["journal-title"],"index":3}
,{"src":{"page":5,"index":5017,"x":202,"y":687},"position":5017,"flags":{},"roles":["journal-title"],"index":4}
,{"src":{"page":5,"index":5018,"x":72,"y":675},"position":5018,"flags":{},"roles":["paragraph"],"index":5}
,{"src":{"page":5,"index":5020,"x":207,"y":663},"position":5020,"flags":{"glyphs":true},"roles":["paragraph"],"glyphs":{"\"#":"AR","$":"ft"},"index":6}
,{"src":{"page":5,"index":5108,"x":308,"y":447},"position":5108,"flags":{},"roles":["paragraph"],"index":7}
,{"src":{"page":5,"index":5152,"x":206,"y":726},"position":5152,"flags":{"skip":true},"roles":["title"],"index":8}
,{"src":{"page":5,"index":5153,"x":296,"y":38},"position":5153,"flags":{"skip":true},"roles":["page-number"],"index":9}
,{"src":{"page":5,"index":5154,"x":174,"y":2},"position":5154,"flags":{"skip":true},"roles":["watermark"],"index":10}
,{"src":{"page":6,"index":6008,"x":316,"y":719},"position":6008,"flags":{"skip":true},"roles":["title"],"index":11}
,{"src":{"page":6,"index":6021,"x":80,"y":339},"position":6021,"flags":{},"roles":["paragraph"],"index":12}
,{"src":{"page":6,"index":6022,"x":80,"y":315},"position":6022,"flags":{},"roles":["journal-title"],"index":13}
,{"src":{"page":6,"index":6035,"x":108,"y":171},"position":6035,"flags":{"italic":true},"roles":["paragraph"],"index":14}
,{"src":{"page":6,"index":6049,"x":316,"y":687},"position":6049,"flags":{},"roles":["paragraph"],"index":15}
,{"src":{"page":6,"index":6063,"x":316,"y":507},"position":6063,"flags":{},"roles":["read-section"],"index":16}
,{"src":{"page":6,"index":6069,"x":455,"y":447},"position":6069,"flags":{},"roles":["read-section"],"index":17}
,{"src":{"page":6,"index":6086,"x":316,"y":279},"position":6086,"flags":{},"roles":["read-section"],"index":18}
,{"src":{"page":6,"index":6108,"x":89,"y":689},"position":6108,"flags":{},"roles":["journal-title"],"index":19}
,{"src":{"page":6,"index":6109,"x":100,"y":689},"position":6109,"flags":{},"roles":["journal-title"],"index":20}
,{"src":{"page":6,"index":6121,"x":90,"y":605},"position":6121,"flags":{},"roles":["journal-title"],"index":21}
,{"src":{"page":6,"index":6122,"x":97,"y":605},"position":6122,"flags":{},"roles":["journal-title"],"index":22}
,{"src":{"page":7,"index":7016,"x":72,"y":591},"position":7016,"flags":{},"roles":["read-section"],"index":23}
,{"src":{"page":7,"index":7058,"x":72,"y":231},"position":7058,"flags":{},"roles":["journal-title"],"index":24}
,{"src":{"page":7,"index":7075,"x":308,"y":687},"position":7075,"flags":{},"roles":["paragraph"],"index":25}
,{"src":{"page":7,"index":7077,"x":338,"y":675},"position":7077,"flags":{"italic":true},"roles":["paragraph"],"index":26}
,{"src":{"page":7,"index":7083,"x":327,"y":639},"position":7083,"flags":{"bold":true},"roles":["paragraph","section"],"index":27}
,{"src":{"page":7,"index":7106,"x":408,"y":399},"position":7106,"flags":{},"roles":["paragraph"],"index":28}
,{"src":{"page":7,"index":7107,"x":311,"y":375},"position":7107,"flags":{"glyphs":true},"roles":["creature-title"],"glyphs":{"&":"/"},"index":29}
,{"src":{"page":7,"index":7108,"x":318,"y":375},"position":7108,"flags":{"glyphs":true},"roles":["creature-title"],"glyphs":{"&":"/"},"index":30}
,{"src":{"page":7,"index":7117,"x":516,"y":375},"position":7117,"flags":{},"roles":["creature-title"],"index":31}
,{"src":{"page":7,"index":7118,"x":308,"y":363},"position":7118,"flags":{},"roles":["stat-block"],"index":32}
,{"src":{"page":7,"index":7119,"x":308,"y":351},"position":7119,"flags":{},"roles":["stat-block"],"index":33}
,{"src":{"page":7,"index":7121,"x":308,"y":327},"position":7121,"flags":{"bold":true},"roles":["stat-block"],"index":34}
,{"src":{"page":7,"index":7125,"x":406,"y":327},"position":7125,"flags":{"glyphs":true},"roles":["stat-block"],"glyphs":{"!":"ft"},"index":35}
,{"src":{"page":7,"index":7127,"x":308,"y":315},"position":7127,"flags":{},"roles":["stat-block","stat-block-section"],"index":36}
,{"src":{"page":7,"index":7152,"x":397,"y":231},"position":7152,"flags":{},"roles":["stat-block"],"index":37}
,{"src":{"page":7,"index":7213,"x":395,"y":63},"position":7213,"flags":{"italic":true},"roles":["stat-block"],"index":38}
,{"src":{"page":8,"index":8008,"x":316,"y":719},"position":8008,"flags":{"skip":true},"roles":["title"],"index":39}
,{"src":{"page":8,"index":8162,"x":326,"y":147},"position":8162,"flags":{},"roles":["stat-block"],"index":40}
,{"src":{"page":8,"index":8179,"x":105,"y":679},"position":8179,"flags":{"italic":true},"roles":["paragraph"],"index":41}
,{"src":{"page":10,"index":10008,"x":316,"y":719},"position":10008,"flags":{"skip":true},"roles":["title"],"index":42}
,{"src":{"page":10,"index":10038,"x":401,"y":111},"position":10038,"flags":{"bold":true},"roles":["paragraph","section"],"index":43}
,{"src":{"page":11,"index":11098,"x":308,"y":387},"position":11098,"flags":{"bold":true},"roles":["stat-block"],"index":44}
,{"src":{"page":11,"index":11099,"x":321,"y":387},"position":11099,"flags":{},"roles":["stat-block"],"index":45}
,{"src":{"page":11,"index":11100,"x":333,"y":387},"position":11100,"flags":{"glyphs":true},"roles":["stat-block"],"index":46}
,{"src":{"page":11,"index":11105,"x":308,"y":351},"position":11105,"flags":{},"roles":["stat-block","stat-block-section"],"index":47}
,{"src":{"page":11,"index":11136,"x":407,"y":279},"position":11136,"flags":{},"roles":["journal-title"],"index":48}
,{"src":{"page":11,"index":11170,"x":331,"y":63},"position":11170,"flags":{},"roles":["stat-block","stat-block-section"],"index":49}
,{"src":{"page":12,"index":12009,"x":277,"y":438},"position":12009,"flags":{"sideblock":true},"roles":["image-name","journal-title"],"index":50}
,{"src":{"page":12,"index":12013,"x":330,"y":438},"position":12013,"flags":{"sideblock":true},"roles":["image-name","journal-title"],"index":51}
,{"src":{"page":12,"index":12020,"x":85,"y":675},"position":12020,"flags":{"glyphs":true},"roles":["stat-block"],"index":52}
,{"src":{"page":12,"index":12087,"x":376,"y":675},"position":12087,"flags":{"glyphs":true},"roles":["paragraph"],"index":53}
,{"src":{"page":14,"index":14008,"x":316,"y":719},"position":14008,"flags":{"skip":true},"roles":["title"],"index":54}
,{"src":{"page":17,"index":17057,"x":254,"y":411},"position":17057,"flags":{"bold":true},"roles":["paragraph","section"],"index":55}
,{"src":{"page":17,"index":17166,"x":375,"y":375},"position":17166,"flags":{"italic":true},"roles":["paragraph"],"index":56}
,{"src":{"page":18,"index":18168,"x":399,"y":162},"position":18168,"flags":{},"roles":["stat-block","stat-block-section"],"index":57}
,{"src":{"page":18,"index":18195,"x":325,"y":63},"position":18195,"flags":{},"roles":["stat-block"],"index":58}
,{"src":{"page":18,"index":18217,"x":194,"y":607},"position":18217,"flags":{"bold":true},"roles":["paragraph"],"index":59}
,{"src":{"page":19,"index":19008,"x":314,"y":188},"position":19008,"flags":{"skip":true},"roles":["map"],"index":60}
,{"src":{"page":19,"index":19009,"x":314,"y":396},"position":19009,"flags":{"skip":true},"roles":["map"],"index":61}
,{"src":{"page":19,"index":19019,"x":128,"y":248},"position":19019,"flags":{"skip":true},"roles":["map"],"index":62}
,{"src":{"page":19,"index":19020,"x":432,"y":390},"position":19020,"flags":{"skip":true},"roles":["map"],"index":63}
,{"src":{"page":19,"index":19032,"x":128,"y":248},"position":19032,"flags":{"skip":true},"roles":["map"],"index":64}
,{"src":{"page":19,"index":19035,"x":437,"y":70},"position":19035,"flags":{"skip":true},"roles":["map"],"index":65}
,{"src":{"page":24,"index":24012,"x":134,"y":689},"position":24012,"flags":{},"roles":["journal-title"],"index":66}
,{"src":{"page":24,"index":24027,"x":90,"y":617},"position":24027,"flags":{},"roles":["paragraph"],"index":67}
,{"src":{"page":24,"index":24033,"x":136,"y":591},"position":24033,"flags":{"glyphs":true},"roles":["stat-block"],"index":68}
,{"src":{"page":24,"index":24048,"x":89,"y":507},"position":24048,"flags":{},"roles":["stat-block"],"index":69}
,{"src":{"page":24,"index":24049,"x":109,"y":507},"position":24049,"flags":{"italic":true},"roles":["stat-block"],"index":70}
,{"src":{"page":24,"index":24052,"x":168,"y":507},"position":24052,"flags":{"glyphs":true},"roles":["stat-block"],"index":71}
,{"src":{"page":24,"index":24060,"x":80,"y":459},"position":24060,"flags":{"bold":true},"roles":["stat-block"],"index":72}
,{"src":{"page":24,"index":24068,"x":89,"y":387},"position":24068,"flags":{"bold":true},"roles":["paragraph","section"],"index":73}
,{"src":{"page":24,"index":24074,"x":274,"y":339},"position":24074,"flags":{"italic":true},"roles":["paragraph"],"index":74}
,{"src":{"page":25,"index":25016,"x":365,"y":639},"position":25016,"flags":{},"roles":["stat-block"],"index":75}
,{"src":{"page":26,"index":26147,"x":378,"y":147},"position":26147,"flags":{"italic":true},"roles":["stat-block"],"index":76}
,{"src":{"page":27,"index":27117,"x":492,"y":399},"position":27117,"flags":{},"roles":["paragraph"],"index":77}
,{"src":{"page":28,"index":28029,"x":80,"y":147},"position":28029,"flags":{"bold":true},"roles":["stat-block"],"index":78}
,{"src":{"page":30,"index":30095,"x":92,"y":672},"position":30095,"flags":{},"roles":["paragraph"],"index":79}
,{"src":{"page":30,"index":30096,"x":87,"y":665},"position":30096,"flags":{"glyphs":true},"roles":["paragraph"],"index":80}
,{"src":{"page":30,"index":30216,"x":92,"y":77},"position":30216,"flags":{},"roles":["paragraph"],"index":81}
,{"src":{"page":33,"index":33008,"x":84,"y":397},"position":33008,"flags":{},"roles":["journal-title"],"index":82}
,{"src":{"page":33,"index":33012,"x":84,"y":385},"position":33012,"flags":{},"roles":["paragraph"],"index":83}
,{"src":{"page":33,"index":33015,"x":277,"y":361},"position":33015,"flags":{"bold":true},"roles":["paragraph"],"index":84}
,{"src":{"page":33,"index":33018,"x":313,"y":325},"position":33018,"flags":{"bold":true},"roles":["paragraph"],"index":85}
,{"src":{"page":33,"index":33074,"x":338,"y":726},"position":33074,"flags":{"skip":true},"roles":["unknow"],"index":86}
];
    static fonts_files = [ "fonts" ];

    static images = [{"position":{"page":2,"x":-1,"y":-1},"idname":"level_1","target":"scenes"}
,{"position":{"page":1,"x":602,"y":-1},"idname":"cover","target":"assets"}
,{"position":{"page":4,"x":-1,"y":345},"idname":"group","target":"assets"}
,{"position":{"page":7,"x":171,"y":375},"idname":"everflame","target":"items"}
,{"position":{"page":10,"x":-1,"y":314},"idname":"entrance","target":"assets"}
,{"position":{"page":12,"x":186,"y":357},"idname":"villager.actor","target":"actors","tokens":[{"x":79,"y":54,"w":364,"h":364,"idname":"villager.token","target":"actors","model":"green_marble"}]}
,{"position":{"page":13,"x":-1,"y":346},"idname":"shadows","target":"assets"}
,{"position":{"page":16,"x":-1,"y":318},"idname":"wood-statue.actor","target":"actors","tokens":[{"x":532,"y":47,"w":192,"h":182,"idname":"wood-statue.token","target":"actors","model":"red_evil"}]}
,{"position":{"page":18,"x":6,"y":41},"idname":"bloody-skeleton.actor","target":"actors","tokens":[{"x":166,"y":18,"w":284,"h":284,"idname":"bloody-skeleton.token","target":"actors","model":"red_evil"}]}
,{"position":{"page":19,"x":61,"y":61},"idname":"level_2","target":"scenes"}
,{"position":{"page":20,"x":-1,"y":359},"idname":"giant-frog.actor","target":"actors","tokens":[{"x":223,"y":161,"w":238,"h":238,"idname":"giant-frog.token","target":"actors","model":"red_evil"}]}
,{"position":{"page":22,"x":-1,"y":31},"idname":"plague-zombie.actor","target":"actors","tokens":[{"x":113,"y":41,"w":208,"h":208,"idname":"plague-zombie.token","target":"actors","model":"red_evil"}]}
,{"position":{"page":25,"x":604,"y":38},"idname":"skeletal-knight.actor","target":"actors","tokens":[{"x":188,"y":81,"w":250,"h":250,"idname":"skeletal-knight.token","target":"actors","model":"red_evil"}]}
,{"position":{"page":26,"x":175,"y":432},"idname":"ghost.actor","target":"actors","tokens":[{"x":188,"y":81,"w":250,"h":250,"idname":"ghost.token","target":"actors","model":"red_evil"}]}
,{"position":{"page":28,"x":27,"y":299},"idname":"town","target":"scenes"}
,{"position":{"page":29,"x":299,"y":47},"idname":"region-map","target":"scenes"}
,{"position":{"page":31,"x":177,"y":401},"idname":"jonark-uptal.actor","target":"actors","tokens":[{"x":58,"y":7,"w":380,"h":380,"idname":"jonark-uptal.token","target":"actors","model":"green_marble"}]}
,{"position":{"page":31,"x":201,"y":225},"idname":"cygar.actor","target":"actors","tokens":[{"x":34,"y":7,"w":341,"h":341,"idname":"cygar.token","target":"actors","model":"green_marble"}]}
];
    static images_files = [ "images" ];

    static itemsFiles = [ 
      "actors/bestiary", "actors/npcs", "actors/traps",
      "journals/00_cover", "journals/01_intro" , "journals/02_part1", "journals/03_part2", "journals/04_part3", "journals/05_apx1",
      "journals/06_ogl",
      "scenes/kassen", "scenes/the-trail",
      "scenes/upper-level", "scenes/lower-level"
    ]; //"items", "actors", "intro", "part1" ];    

    static conversion_entries = [
        { idname : "cote_cnv_backpack", source : "{{{slicexlf 6093 0 '' 0 8}}}", type: 'item', notes: "a backpack container", 
          conversion: { "type" : "Item", idname : "cote_backpack" } 
        }, 
        { idname: "cote_cnv_bedroll", source : "{{{slicexlf 6094 0 '' 8 14}}}", type: 'item', notes: "a bedroll", 
          conversion: { "type" : "Item", idname : "cote_bedroll" } 
        }, 
        { idname : "cote_cnv_flint_and_steel", source : "{{{slicexlf 6098 0 '' 34 23}}}", type: 'item', notes: "flint and steel box",
           conversion: { "type" : "Item", idname : "cote_flint_and_steel" } 
        }, 
        { idname : "cote_cnv_hook", source : "{{{slicexlf 6102 0 'n' 17 18}}}", type: 'item', notes : "a grapple hook", 
          conversion: { "type" : "Item", idname : "cote_hook" } 
        }, 
        { idname : "cote_cnv_minor_healing_potion", source: "{{{slicexlf 6100 0 'n' 0 30}}}", type: 'item', notes : "a minor healing potion", 
          conversion: { "type" : "Item", idname : "cote_minor_healing_potion" } 
        }, 
        { idname : "cote_cnv_rations", source : "{{{slicexlf 6093 0 '' 47 7}}}", type: 'item', notes : "food ration", 
           conversion : { "type" : "Item", idname : "cote_rations" } 
        },
        { idname : "cote_cnv_rope", source : "{{{slicexlf 6098 0 '' 21 11}}}", type: 'item', notes : "a hemp rope", 
           conversion: { "type" : "Item", idname : "cote_rope" } 
        },
        { idname : "cote_cnv_piece_trail_map", source : "{{{slicexlf 6094 1 'n' 46 24}}}", type: 'item', notes : "a piece of the trail map", 
           conversion: { "type": "Item", idname : "cote_piece_trail_map" } 
        },   
        { idname : "cote_cnv_local_brandy_bottle", source : "{{{slicexlf 6102 1 'n' 46 30}}}", type: 'item', notes : "a local brandy bottle", 
          conversion: { "type": "Item", "idname": "cote_local_brandy_bottle"}
        }, 
        { idname : "cote_cnv_small_tent", source : "{{{slicexlf 6093 1 '' 60 10}}}", type: 'item', notes : "a small tent", 
          conversion: { "type" : "Item", idname : "cote_small_tent" }
        },
        { idname : "cote_cnv_tindertwig", source : "{{{slicexlf 6099 0 '' 10 10}}}", type: 'item', notes : "a tindertwig", 
          conversion: { "type" : "Item", idname : "cote_tindertwig" }
        },
        { idname : "cote_cnv_torch", source : "{{{slicexlf 6102 0 'n' 7 5}}}", type: 'item', notes : "a torch", 
          conversion: { "type" : "Item", idname : "cote_torch" }
        },
        { idname : "cote_cnv_waterskin", source : "{{{slicexlf 6094 0 '' 31 9}}}", notes : "a waterskin", 
          conversion: { "type" : "Item", idname : "cote_waterskin" }   
        }   
    ];

    static default_conversions = [ "pf2e" ];

    static fixes(str, index)
    {
      switch(index)
      {
          case 12071: case 12107:  case 14103:
            while(str.indexOf("$") != -1)
            { str = str.replace("$","ft"); }
            return str;

          case 30080: return str.replace(";.<a", "1.0a");
          case 30209: case 30212:
          case 30096: return str.replace("%&&&","2000");
          case 30207: return '0';
          case 30205:
          case 30098: return '1';
          case 30129: return '2';
          case 30138: return '3';
          case 30143: return '4';
          case 30147: return '5';
          case 30154: return '6';
          case 30160: return '7';
          case 30171: return '8';
          case 30174: return '9';
          case 30179: return '10';
          case 30182: return '11';
          case 30186: return '12';
          case 30193: return '13';
          case 30196: return '30';
          case 30199: return '14';
          case 30202: return '15';
          case 30220: return '2009';

          default: return str;
      }  
    }
}

// End of file

export class HelyxMasksOfTheLivingGod
{
    static idname = "masks-of-the-living-god";
    static prefix = "pf1en_motlg";
    static nbPages = 36;
    static identification = { page: 3, block: 47, value: 'Masks of the Living God ' };

    static resources_directories = [ "actors", "scenes", "items", "assets", "tiles"]; 
    static drm = "PAIZO" ; 
    static dependencies = { "pf1" : [ "pf1-bestiary" ] };
    static system = "pf1";
    static content = { from: 5, to: 33};
    static language="en";
    static color_assign = "reader";
    static flags = { midjourney_content: true, tokens_on_maps: true };

    static summary = 
    {
        cover: { image: "cover", x: 0, y: 546, width: 1261, height: 714 },
        title: "{{{xlf 3047 0 'any'}}}",
        summary: "{{{pxl 36006 12}}} {{{pxl 36019 4}}} {{{pxl 36024 7}}}"
    };

    static contents =  { };

    static glyphs = 
    {
      '0' : 't',
      '1' : 'i',
      '2' : 'p',
      '4' : 'd',
      '5' : 'b',
      '6' : 'h',
      '7' : 'w',
      '8' : 'f',
      '9' : 'y',
      '!' : 'r',
      '-' : 'a',
      "'" : 'o',
      '(' : 'l',
      '*' : 'e',
      ',' : 'm',
      '.' : 'n',
      '#' : 's',
      '+' : 'u',
      '/' : 'k',
      ':' : 'g',

      'i' : '1',
      'm' : ',',
      't' : '0'
    };

    static import_order = [ "pf1en_motlg_intro", "pf1en_motlg_part1", "pf1en_motlg_part2"];
    static items = new Map([[ "pf1en_motlg_intro" ,{
	"helyx": {
		"type": "JournalEntry",
		"idname": "pf1en_motlg_intro",
		"target": "pf1en_motlg_journals"
	},
	"name": "01 Introduction",
	"pages": [
		{
			"helyx": {
				"type": "Page",
				"idname": "pf1en_motlg_005001",
				"desc": "Ad V E N T U R E Ba C K G R O U N D"
			},
			"name": "{{{xlf 5019 3 'ansx'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xlf 5019 3 'ansx'}}}"
				},
				{
					"type": "p",
					"paragraphs": [
						"{{{xl 5023 21}}}",
						"{{{xl 5045 16}}}",
						"{{{xl 5062 5}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"type": "Page",
				"idname": "pf1en_motlg_005002",
				"desc": "Adventure Summary"
			},
			"name": "{{{xlf 5068 0 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xlf 5068 0 'an'}}}"
				},
				{
					"type": "p",
					"paragraphs": [
						"{{{xl 5069 8}}}",
						"{{{xl 5078 11}}}",
						"{{{xl 5090 10}}}",
						"{{{xl 5101 15}}}",
						"{{{xl 5117 4}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"type": "Page",
				"idname": "pf1en_motlg_006001",
				"desc": "Cr Y P T O F T H E Ev E R F L a M E"
			},
			"name": "{{{xlf 6110 7 'ansx'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xlf 6110 7 'an'}}}"
				},
				{
					"type": "p",
					"paragraphs": [
						"{{{xl 6118 21}}}"
					]
				}
			]
		}
	]
}]
,[ "pf1en_motlg_part1" ,{
	"helyx": {
		"type": "JournalEntry",
		"idname": "pf1en_motlg_part1",
		"target": "pf1en_motlg_journals"
	},
	"name": "02 {{{xlf 5122 13 'ansx'}}}",
	"pages": [
		{
			"helyx": {
				"type": "Page",
				"idname": "pf1en_motlg_005003",
				"desc": "Pa R T On E: Th E Jo U R N E Y T O Tamr a N"
			},
			"name": "{{{xlf 5122 13 'ansx'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xlf 5122 13 'an'}}}"
				},
				{
					"type": "p",
					"paragraphs": [
						"{{{xl 5136 6}}}{{{xl 6020 7}}}"
					]
				},
				{
					"type": "read-section",
					"paragraphs": [
						"{{{xl 6028 3}}}"
					]
				},
				{
					"type": "p",
					"paragraphs": [
						"{{{xl 6032 20}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"type": "Page",
				"idname": "pf1en_motlg_006002",
				"desc": "Aboard the Black Mist"
			},
			"name": "{{{xlf 6053 0 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xlf 6053 0 'an'}}}"
				},
				{
					"type": "p",
					"paragraphs": [
						"{{{xl 6054 19}}}",
						"{{{xl 6074 4}}}",
						"{{{xl 6079 11}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"type": "Page",
				"idname": "pf1en_motlg_006003",
				"desc": "Encounters On Lake Encarthan"
			},
			"name": "{{{xlf 6091 0 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xlf 6091 0 'an'}}}"
				},
				{
					"type": "p",
					"paragraphs": [
						"{{{xl 6092 7}}}",
						"{{{xl 6100 3}}}"
					]
				},
				{
					"type": "table",
					"columns": "3",
					"headers": [
						"{{{xlf 6140 0 'an'}}}",
						"{{{xf 6141 'an'}}}",
						"{{{xf 6142 'an'}}}"
					],
					"lines": [
						[
							"{{{pxl 6143 0}}}",
							"{{{pxl 6144 2}}}",
							"{{{pxl 6147 0}}}"
						],
						[
							"{{{pxl 6148 0}}}",
							"{{{pxl 6149 2}}}",
							"{{{pxl 6152 0}}}"
						],
						[
							"{{{pxl 6153 0}}}",
							"{{{pxl 6154 2}}}",
							"{{{pxl 6157 0}}}"
						],
						[
							"{{{pxl 6158 0}}}",
							"{{{pxl 6159 2}}}",
							"{{{pxl 6162 0}}}"
						],
						[
							"{{{pxl 6163 0}}}",
							"{{{pxl 6164 2}}}",
							"{{{pxl 6167 0}}}"
						],
						[
							"{{{pxl 6168 0}}}",
							"{{{pxl 6169 2}}}",
							"{{{pxl 6172 0}}}"
						]
					]
				}
			]
		},
		{
			"helyx": {
				"type": "Page",
				"idname": "pf1en_motlg_007001",
				"desc": "La K E Enco U N T E R S"
			},
			"name": "{{{xlf 7184 5 'ansx'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xlf 7184 5 'ansx'}}}"
				},
				{
					"type": "p",
					"paragraphs": [
						"{{{xl 7190 5}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"type": "Page",
				"idname": "pf1en_motlg_006004",
				"desc": "Approaching Tamran"
			},
			"name": "{{{xlf 6104 0 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xlf 6104 0 'an'}}}"
				},
				{
					"type": "p",
					"paragraphs": [
						"{{{xl 6105 4}}}{{{xl 7019 7}}}"
					]
				},
				{
					"type": "section",
					"section": "encounter",
					"title": "{{{xlf 7027 0 'nd'}}}",
					"blocks": [
						{
							"type": "p",
							"paragraphs": [
								"{{{xlf 7028 11 'nf'}}}"
							]
						}
					]
				},
				{
					"type": "creature",
					"name": "{{{slicexlf 7040 1 'tn' 0 20}}}",
					"amount": "3",
					"statblock": [
						"{{{pxl 7042 0}}}",
						"{{{pxl 7043 0}}}",
						"{{{pxl 7044 0}}}",
						"{{{pxl 7045 3}}}",
						"{{{sbxlf 7049 4 'tn'}}}",
						"{{{pxl 7054 1}}}",
						"{{{pxl 7056 1}}}",
						"{{{pxl 7058 5}}}",
						"{{{sbxlf 7064 2 'tn'}}}",
						"{{{pxl 7067 1}}}",
						"{{{pxl 7069 1}}}",
						"{{{pxl 7071 1}}}",
						"{{{sbxlf 7073 1 'tn'}}}",
						"{{{pxl 7075 2}}}",
						"{{{pxl 7078 2}}}",
						"{{{pxl 7081 3}}}",
						"{{{sbxlf 7085 1 'tn'}}}",
						"{{{pxl 7087 11}}}",
						"{{{pxl 7099 7}}}",
						"{{{pxl 7107 1}}}",
						"{{{pxl 7109 1}}}",
						"{{{pxl 7111 1}}}",
						"{{{pxl 7113 3}}}",
						"{{{pxl 7117 2}}}"
					],
					"cr": "{{{slicexlf 7040 1 'tn' 41 -12}}}"
				},
				{
					"type": "section",
					"section": "treasure",
					"title": "{{{xlf 7120 0 'nd'}}}",
					"blocks": [
						{
							"type": "p",
							"paragraphs": [
								"{{{xlf 7121 19 'nf'}}}"
							]
						}
					]
				},
				{
					"type": "p",
					"paragraphs": [
						"{{{xl 7141 8}}}"
					]
				},
				{
					"type": "read-section",
					"paragraphs": [
						"{{{xl 7150 6}}}"
					]
				}
			]
		}
	]
}]
,[ "pf1en_motlg_part2" ,{
	"helyx": {
		"type": "JournalEntry",
		"idname": "pf1en_motlg_part2",
		"target": "pf1en_motlg_journals"
	},
	"name": "03 {{{xlf 7157 13 'ansx'}}}",
	"pages": [
		{
			"helyx": {
				"type": "Page",
				"idname": "pf1en_motlg_007002",
				"desc": "Pa R T Tw O: in F Ilt R a T I N G T H E Tem P Le"
			},
			"name": "{{{xlf 7157 13 'ansx'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xlf 7157 13 'ansx'}}}"
				},
				{
					"type": "p",
					"paragraphs": [
						"{{{xl 7171 5}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"type": "Page",
				"idname": "pf1en_motlg_008001",
				"desc": "Ta M R a N"
			},
			"name": "{{{xlf 8115 1 'ansx'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xlf 8115 1 'ansx'}}}"
				},
				{
					"type": "settlement",
					"name": "{{{xlf 8115 1 'ansx'}}}",
					"statblock": [
						"{{{pxl 8117 1}}}",
						"{{{pxl 8119 3}}}",
						"{{{pxl 8123 1}}}",
						"{{{pxl 8125 1}}}",
						"{{{pxl 8127 15}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"type": "Page",
				"idname": "pf1en_motlg_007003",
				"desc": "Finding a Place to Stay"
			},
			"name": "{{{xlf 7177 0 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xlf 7177 0 'an'}}}"
				},
				{
					"type": "p",
					"paragraphs": [
						"{{{xl 7178 5}}}{{{xl 8020 2}}}",
						"{{{xl 8023 14}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"type": "Page",
				"idname": "pf1en_motlg_009001",
				"desc": "Re G I N a R"
			},
			"name": "{{{xlf 9018 1 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xlf 9018 1 'an'}}}"
				},
				{
					"type": "p",
					"paragraphs": [
						"{{{xl 9043 8}}}"
					]
				}
			]
		},
		{
			"helyx": {
				"type": "Page",
				"idname": "pf1en_motlg_008002",
				"desc": "Pathfinder Contact"
			},
			"name": "{{{xlf 8038 0 'an'}}}",
			"blocks": [
				{
					"type": "journal-title",
					"title": "{{{xlf 8038 0 'an'}}}"
				},
				{
					"type": "p",
					"paragraphs": [
						"{{{xl 8039 7}}}",
						"{{{xl 8047 6}}}"
					]
				},
				{
					"type": "read-section",
					"paragraphs": [
						"{{{xl 8054 4}}}"
					]
				},
				{
					"type": "section",
					"section": "npc",
					"title": "{{{xlf 8059 0 'nd'}}}",
					"blocks": [
						{
							"type": "p",
							"paragraphs": [
								"{{{xl 8059 6}}}"
							]
						}
					]
				},
				{
					"type": "read-section",
					"paragraphs": [
						"{{{xl 8066 7}}}"
					]
				},
				{
					"type": "p",
					"paragraphs": [
						"{{{xl 8074 5}}}",
						"{{{xl 8080 1}}}",
						"{{{xl 8082 9}}}",
						"{{{xl 8092 7}}}",
						"{{{xl 8100 8}}}",
						"{{{xl 8109 3}}}{{{xl 9021 3}}}",
						"{{{xl 9025 5}}}",
						"{{{xl 9031 9}}}",
						"{{{xl 9041 10}}}"
					]
				}
			]
		}
	]
}]
]);    

    static folders = 
    [
        // Journals
        { idname: "pf1en_motlg_journals", name: '{{xlf 3047 0 "any"}}', type: "JournalEntry" },

        // Actors
        { idname: "pf1en_motlg_actors", name: '{{xlf 3047 0 "any"}}', type: "Actor"},
        { idname: "pf1en_motlg_bestiary", name: 'Bestiary', parent: "pf1en_motlg_actors"},
        { idname: "pf1en_motlg_npcs", name: 'NPCs', parent: "pf1en_motlg_actors"},
        
        // Items
        { idname: "pf1en_motlg_items", name: '{{xlf 3047 0 "any"}}',  type:"Item" },
                    
        // Scenes
        { idname: "pf1en_motlg_scenes", name: '{{xlf 3047 0 "any"}}',  type:"Scene" },
    ];

    static fonts = [{"position":5000,"flags":{"skip":true},"roles":["watermark"],"index":0}
,{"position":5002,"flags":{"skip":true},"roles":["watermark"],"index":1}
,{"position":5008,"flags":{"skip":true},"roles":["title"],"index":2}
,{"position":5009,"flags":{"skip":true},"roles":["title"],"index":3}
,{"position":5018,"flags":{"skip":true},"roles":["page-number"],"index":4}
,{"position":5019,"flags":{},"roles":["journal-title"],"index":5}
,{"position":5020,"flags":{},"roles":["journal-title"],"index":6}
,{"position":5023,"flags":{},"roles":["paragraph"],"index":7}
,{"position":5058,"flags":{"italic":true},"roles":["paragraph"],"index":8}
,{"position":5068,"flags":{},"roles":["journal-title"],"index":9}
,{"position":5122,"flags":{},"roles":["journal-title"],"index":10}
,{"position":5123,"flags":{},"roles":["journal-title"],"index":11}
,{"position":5143,"flags":{"skip":true},"roles":["watermark"],"index":12}
,{"position":6008,"flags":{"skip":true},"roles":["title"],"index":13}
,{"position":6028,"flags":{},"roles":["read-section"],"index":14}
,{"position":6058,"flags":{"bold":true},"roles":["paragraph","section"],"index":15}
,{"position":6110,"flags":{"sideblock":true},"roles":["journal-title"],"index":16}
,{"position":6111,"flags":{"sideblock":true},"roles":["journal-title"],"index":17}
,{"position":6119,"flags":{"italic":true},"roles":["read-section"],"index":18}
,{"position":6136,"flags":{"bold":true},"roles":["read-section"],"index":19}
,{"position":6140,"flags":{},"roles":["paragraph"],"index":20}
,{"position":6143,"flags":{},"roles":["paragraph"],"index":21}
,{"position":6145,"flags":{"italic":true},"roles":["paragraph"],"index":22}
,{"position":7040,"flags":{},"roles":["creature-title"],"index":23}
,{"position":7042,"flags":{"bold":true},"roles":["stat-block"],"index":24}
,{"position":7043,"flags":{},"roles":["stat-block"],"index":25}
,{"position":7045,"flags":{"bold":true},"roles":["stat-block"],"index":26}
,{"position":7049,"flags":{},"roles":["stat-block","stat-block-section"],"index":27}
,{"position":7115,"flags":{"italic":true},"roles":["stat-block"],"index":28}
,{"position":8082,"flags":{},"roles":["paragraph"],"index":29}
,{"position":11118,"flags":{"sideblock":true},"roles":["journal-title"],"index":30}
,{"position":11119,"flags":{"sideblock":true},"roles":["journal-title"],"index":31}
,{"position":26019,"flags":{"sideblock":true},"roles":["paragraph"],"index":32}
,{"position":26033,"size":0,"flags":{"sideblock":true},"roles":["journal-title"],"index":33}
,{"position":32121,"flags":{},"roles":["stat-block"],"index":34}
,{"position":33071,"flags":{},"roles":["journal-title"],"index":35}
,{"position":33072,"flags":{},"roles":["paragraph"],"index":36}
,{"position":33075,"flags":{},"roles":["paragraph"],"index":37}
,{"position":33078,"flags":{},"roles":["paragraph"],"index":38}
];
    static fonts_files = [ "fonts" ];

    static images = [{"position":{"page":1,"index":38},"idname":"cover","target":"assets"}
,{"position":{"page":2,"index":35},"idname":"map-a_tile_11","target":"tiles"}
,{"position":{"page":2,"index":46},"idname":"map-a_tile_21","target":"tiles"}
,{"position":{"page":2,"index":57},"idname":"map-a_tile_31","target":"tiles"}
,{"position":{"page":2,"index":68},"idname":"map-a_tile_12","target":"tiles"}
,{"position":{"page":2,"index":79},"idname":"map-a_tile_22","target":"tiles"}
,{"position":{"page":2,"index":90},"idname":"map-a_tile_32","target":"tiles"}
,{"position":{"page":2,"index":101},"idname":"map-a_tile_13","target":"tiles"}
,{"position":{"page":2,"index":112},"idname":"map-a_tile_23","target":"tiles"}
,{"position":{"page":2,"index":123},"idname":"map-a_tile_33","target":"tiles"}
,{"position":{"page":2,"index":134},"idname":"map-a_tile_14","target":"tiles"}
,{"position":{"page":2,"index":145},"idname":"map-a_tile_24","target":"tiles"}
,{"position":{"page":2,"index":156},"idname":"map-a_tile_34","target":"tiles"}
,{"idname":"scene-temple","size":{"width":1295,"height":1676},"target":"scenes","elements":[{"source":{"idname":"map-a_tile_11"},"position":{"x":0,"y":0}},{"source":{"idname":"map-a_tile_21"},"position":{"x":457,"y":0}},{"source":{"idname":"map-a_tile_31"},"position":{"x":914,"y":0}},{"source":{"idname":"map-a_tile_12"},"position":{"x":0,"y":457}},{"source":{"idname":"map-a_tile_22"},"position":{"x":457,"y":457}},{"source":{"idname":"map-a_tile_32"},"position":{"x":914,"y":533}},{"source":{"idname":"map-a_tile_13"},"position":{"x":0,"y":914}},{"source":{"idname":"map-a_tile_23"},"position":{"x":457,"y":914}},{"source":{"idname":"map-a_tile_33"},"position":{"x":914,"y":1066}},{"source":{"idname":"map-a_tile_14"},"position":{"x":0,"y":1371}},{"source":{"idname":"map-a_tile_24"},"position":{"x":684,"y":1371}},{"source":{"idname":"map-a_tile_34"},"position":{"x":914,"y":1599}}]}
];
    static images_files = [ "images" ];

    static itemsFiles = [ 
      "actors/bestiary", "actors/npcs",
      "journals/00_cover", "journals/01_intro" , "journals/02_part1", "journals/03_part2"
    ];   


    // static default_conversions = [ "pf2e" ];

    static fixes(str, index)
    {
      console.log('@' + index + ' str=|' + str + '|');
      switch(index)
      {
          case 5122 : return str.replace('e:t','e : T');
          case 7157 : return str.replace('o:i', 'o : I');
          default: return str;
      }  
    }
}

// End of file

export class Helyx {

constructor() 
{
    this.config = new HelyxConfiguration();    
    this.hbs = new HelyxHandleBars(this);
    this.game = new HelyxPF2(this);

    this.hbs.initHelpers();
    this.game.initGameSystemHandlebarsHelpers();

    this.adventures = [];
    this.tokens = new Map();

            this.adventures.push(new HelyxAdventure (this, {descriptor: HelyxCryptOfTheEverflame, idname: "crypt-of-the-everflame", datas_directory: "modules/pf1-pdf-en-import/datas", shared_resources_directory: "modules/pf1-pdf-en-import/datas", origin: "pf1-pdf-en-import", export_directory: "crypt-of-the-everflame"}));
        this.adventures.push(new HelyxAdventure (this, {descriptor: HelyxMasksOfTheLivingGod, idname: "masks-of-the-living-god", datas_directory: "modules/pf1-pdf-en-import/datas", shared_resources_directory: "modules/pf1-pdf-en-import/datas", origin: "pf1-pdf-en-import", export_directory: "masks-of-the-living-god"}));
        

    
    this.mainDialog = null;
}

get module_name() { return this.config.moduleName; }

pick_pdf(html_id_, handler_)
{
    this.picker =
    this.picker ??
        new foundry.applications.apps.FilePicker({
            callback: (filename) => 
            {
                this.picker.close();
                this.picker = null;

                // Reconvert html codes to a readable content
                let displayed_filename = $('<div>').html(filename).text();
                displayed_filename = displayed_filename.replaceAll('%20',' ');

                // Keep only the file name
                displayed_filename = Deid.local_filename(displayed_filename);

                $(html_id_).html(displayed_filename);

                handler_.set_pdf_filename(filename);
            },
        });
    this.picker.extensions = ['.pdf'];
    this.picker.render();
}

select_pdf(html_id_, handler_)
{
    this.pick_pdf(html_id_, this.context);
}

when_import_pdf()
{
    this.context = new HelyxContext( this.config );
    this.context.adventures = this.adventures;

    this.machine = new HelyxMachine(this.context);

    let state_00_select_pdf_dialog      = new StateImportPdfDialog(this.machine, {name: 'import_dialog', index: 0, import_state: 1});
    let state_01_setup_import_dialog    = new StateSetupImportDialog(this.machine, {name: 'setup_import_dialog', index: 1, next_state: 2});
    let state_02_open_pdf               = new StateOpenPDF(this.machine, {name: 'open_pdf', index: 2, next_state: 3});
    let state_03_read_pages             = new StateReadPages(this.machine, {name: 'read_pages', index: 3, next_state: 4});
    let state_04_identify_adventure     = new StateIdentifyAdventure(this.machine, {name: 'identify_adventure', index: 4, unknown_adventure_state: 5, adventure_identified_state: 8, });
    let state_08_check_deps             = new StateCheckDependencies(this.machine, {name: 'check_deps', index: 8, next_state: 17});
    let state_17_load_files             = new StateLoadFiles(this.machine, {name: 'load_files', index: 17, next_state: 19});
    let state_19_ready_summary          = new StateReadySummary(this.machine, {name: 'ready_summary', index: 19, next_state: 20});
    let state_20_adventure_summary      = new StateAdventureSummary(this.machine, {name: 'summary', index: 20, next_state: 16, cancel_state: 18});

    let state_05_unknown_adventure      = new StateUnknownAdventure(this.machine, {name: 'unknown_adventure', index: 5 });

    let state_16_colorize_text         = new StateColorizeText(this.machine, {name: 'color_assigner', index: 16, next_state: 9});


    let state_09_check_conversions      = new StateCheckConversion(this.machine, {name: 'check_conversions', index: 9, next_state: 11});

    let state_11_load_items             = new StateLoadItems(this.machine, {name: 'load_items', index: 11, next_state: 12});
    let state_12_pre_import             = new StatePreImport(this.machine, {name: 'pre_import', index: 12, next_state: 13});
    let state_13_import_folders         = new StateImportFolders(this.machine, {name: 'import_folders', index: 13, next_state: 14});
    let state_14_import_images          = new StateImportImages(this.machine, { name: 'import_images', index: 14, next_state: 15});
    let state_15_import_items           = new StateImportItems(this.machine, {name: 'import_items', index: 15, next_state: 18});
    let state_18_compendium_art         = new StateCompendiumArt(this.machine, {name: 'art_map', index: 18, next_state: 21});
    let state_21_completion             = new StateCompletion(this.machine, {name: 'end', index: 21});


    let myself = this;
    this.machine.states 
    ([ 
        state_00_select_pdf_dialog, state_01_setup_import_dialog, state_02_open_pdf, state_03_read_pages, state_04_identify_adventure, 
        state_05_unknown_adventure, null, null, state_08_check_deps, state_09_check_conversions, 
        state_11_load_items, state_12_pre_import, state_13_import_folders,
        state_14_import_images, state_15_import_items, state_16_colorize_text, state_17_load_files , 
        state_18_compendium_art,
        state_19_ready_summary, state_20_adventure_summary, state_21_completion
    ])
    .then( () => { myself.machine.state(0); });

}

import_nav_tab(category_) 
{
    const nav_element = "#helyx-nav-" + category_;
    const tab_element = "#helyx-tab-" + category_;

    $(".helyx-import-nav").removeClass("active");
    $(nav_element).addClass("active");

    $(".helyx-import-tab").hide();
    $(tab_element).removeClass("hidden");
    $(tab_element).show();
    
    //document.getElementById(cityName).style.display = "block";
    //document.getElementById(cityName).style.display = "block";
}

async load_art_map_file(descriptor_)
{
    const has_art_map = descriptor_.flags?.art_map;
    if(!has_art_map)
    { return; }

    Deid.Log.debug('Check art map file for ' + descriptor_.idname);

    const expected_art_map_filename = '/helyx/' + descriptor_.idname + '_art-map.json';

    const file_exist = await Deid.FS.exists(expected_art_map_filename);

    if(!file_exist)
    { 
        Deid.Log.debug(expected_art_map_filename + " doesnt exist");
        return; 
    }

    let art  = await Deid.Art.get_art_map(expected_art_map_filename);
    if(art) 
    { Deid.Art.set_art(art, this.config.moduleName); }

}

// Initialize the array of tokens from token_files
async init_tokens()
{
    if(game.helyx_settings == null)
    { return; }

    const adventures = this.config.modeMaker ? game.helyx_settings.descriptors.values() : this.adventures;
    const mode_maker = this.config.modeMaker ?? false;

    this.global_art_map = [];

    for (let adv of adventures)
    {
        const descriptor   = mode_maker ? adv.jsclass : adv.descriptor;
        await this.load_art_map_file(descriptor);
    }

    //let my_declaration = game.modules.entries().get(this.config.moduleName);
    //my_declaration.flags.[this.config.moduleName]["sfrpg-art"] = global_art_map;
}


}
Hooks.on("renderSettings", function(app_, html_)
{
    if(game.user.isGM)
    {    
            const s=document.createElement("template");
        
            s.innerHTML=
                '<section class="flexcol" id="helyx">\n'+
                  '<h4 class="divider">Helyx</h4>\n' +    
                    '<button type="button" data-action="helyx-import-pdf">\n' +
                        '<i class="fa-solid fa-book" inert></i>Import PDF\n' +    
                    '</button>\n'+            
                 '</section>';
             
            Object.assign
            (
                app_.options.actions,
                {
                    "helyx-import-pdf":()=>game.helyx.when_import_pdf()
                }
            );
                
            html_.querySelector("section.info").after(s.content);


        const importButton=$(
            '<button id="helyx-import-pdf" data-action="helyx-import-pdf">'
            + '<i class="fas fa-fire"></i> Helyx - Import PDF'
            + '</button>'
            
            );
            html_.find("#settings-game").prepend(importButton);
        importButton.on
        (
            "click",
            (()=>{ game.helyx.when_import_pdf(); })
        );    
    }    

})

Hooks.on("init", function()
{
    foundry.applications.handlebars.loadTemplates([ "modules/pf1-pdf-en-import/templates/exported/pdfList.hbs" ]);
    foundry.applications.handlebars.loadTemplates([ "modules/pf1-pdf-en-import/templates/exported/faq.hbs" ]);
})

Hooks.on("ready", async function () 
{
    let h = new Helyx(false);
    game.helyx = h;
    h.config.extractPDFDetails = false;
    h.acceptUnknowPdf = false;
    h.config.moduleName="pf1-pdf-en-import";

    Deid.Log.FILTER.report = false;
    Deid.Log.FILTER.error  = false;
    Deid.Log.FILTER.debug = false;
    h.config.moduleDirectory = "modules/pf1-pdf-en-import";   
    h.config.templatesDirectory = h.config.moduleDirectory + "/templates/exported";
    h.config.bundled = true;

    await h.init_tokens();

})

Hooks.on("renderJournalEntryPageSheet",function(page_,dialog_,doc_)
{
    const flags = page_?.page?.flags;
    if(!flags) return;

    const hm = flags[ game.helyx.module_name ];
    if(!hm) return;

    const title = hm.title;
    if(!title) return;

    dialog_.children[0].className += " helyx-journal-title "
        + (hm.title.css_style ?? "helyx-journal-title-default");

})


