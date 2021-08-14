function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
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

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/**
 * 深度复制（采用JSON解析方式）
 * @param obj 复制对象
 */
var deepCopyJSON = function deepCopyJSON(obj) {
  return JSON.parse(JSON.stringify(obj));
};
/**
  * 深度复制（采用递归式）
  * @param obj 复制对象
  */

function deepCopy(obj) {
  var newObj = Array.isArray(obj) ? [] : {};

  for (var key in obj) {
    // if (Object.prototype.hasOwnProperty.call(obj, key)) {
    newObj[key] = _typeof(obj[key]) === 'object' && obj[key] !== null ? deepCopy(obj[key]) : obj[key]; // }
  }

  return newObj;
}
/** 创建GUID */

function createGuid() {
  function S4() {
    return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
  }

  return "".concat(S4()).concat(S4(), "-").concat(S4(), "-").concat(S4(), "-").concat(S4(), "-").concat(S4()).concat(S4()).concat(S4());
}
/**
  * 创建指定范围的随机整数
  * @param minInt 最小整数
  * @param maxInt 最大整数
  */

function createIntRandom(minInt, maxInt) {
  return minInt + Math.round(Math.random() * (maxInt - minInt));
}
/** 判断网页是否通过移动端设备打开 */

/* istanbul ignore next */

function isFromMobileBrowser() {
  var _navigator$userAgent$, _navigator, _navigator$userAgent;

  return (_navigator$userAgent$ = !!((_navigator = navigator) !== null && _navigator !== void 0 && (_navigator$userAgent = _navigator.userAgent) !== null && _navigator$userAgent !== void 0 && _navigator$userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) !== null && _navigator$userAgent$ !== void 0 ? _navigator$userAgent$ : false;
}
/**
  * 复制文本
  * @param text 文本
  */

/* istanbul ignore next */

function copyText(_x) {
  return _copyText.apply(this, arguments);
}
/**
  * 随机获取数组的其中一个子集
  * @param arr 数组
  */

function _copyText() {
  _copyText = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(text) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return navigator.clipboard.writeText(text);

          case 2:
            return _context.abrupt("return", text);

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _copyText.apply(this, arguments);
}

function getArrayItemRandom(arr) {
  var index = createIntRandom(0, arr.length - 1);
  return arr[index];
}
/**
  * 加载css
  * @param cssUrl CSS路径
  */

/* istanbul ignore next */

function loadCss(cssUrl) {
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = cssUrl;
  link.media = 'all';
  document.head.appendChild(link);
}
/**
  * 加载js
  * @param jsUrl JS路径
  */

/* istanbul ignore next */

function loadJs(jsUrl) {
  var script = document.createElement('script');
  script.src = jsUrl;
  document.head.appendChild(script);
}
/**
  * 对象扩展（JQuery $.extend 实现代码）
  * @param _ 深度复制
  * @param sourceObj 源对象
  * @param targetObj 目标对象
  */

/* istanbul ignore next */

function $extend(_deep, sourceObj) {
  for (var _len = arguments.length, otherObjs = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    otherObjs[_key - 2] = arguments[_key];
  }

  function isPlainObject(obj) {
    var class2type = {};
    var getProto = Object.getPrototypeOf;
    var toString = class2type.toString;
    var hasOwn = class2type.hasOwnProperty;
    var fnToString = hasOwn.toString;
    var ObjectFunctionString = fnToString.call(Object);

    if (!obj || toString.call(obj) !== '[object Object]') {
      return false;
    }

    var proto = getProto(obj);

    if (!proto) {
      return true;
    }

    var Ctor = hasOwn.call(proto, 'constructor') && proto.constructor;
    return typeof Ctor === 'function' && fnToString.call(Ctor) === ObjectFunctionString;
  }

  var options,
      name,
      src,
      copy,
      copyIsArray,
      clone,
      target = arguments[0] || {},
      // eslint-disable-line
  i = 1,
      length = arguments.length,
      // eslint-disable-line
  deep = false; // eslint-disable-line

  if (typeof target === 'boolean') {
    deep = target;
    target = arguments[1] || {}; // eslint-disable-line

    i = 2;
  }

  if (_typeof(target) !== 'object' && typeof target !== 'function') {
    target = {};
  }

  if (length === i) {
    target = this;
    --i;
  }

  for (; i < length; i++) {
    if ((options = arguments[i]) !== null) {
      // eslint-disable-line
      for (name in options) {
        src = target[name];
        copy = options[name];

        if (target === copy) {
          continue;
        }

        if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
          if (copyIsArray) {
            copyIsArray = false;
            clone = src && Array.isArray(src) ? src : [];
          } else {
            clone = src && isPlainObject(src) ? src : {};
          }

          target[name] = $extend(deep, clone, copy); // eslint-disable-line
        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }

  return target;
}
/**
  * 防抖
  * （当持续触发事件时，
  * 一定时间段内没有再触发事件，
  * 事件处理函数才会执行一次，
  * 如果设定的时间到来之前，
  * 又一次触发了事件，
  * 就重新开始延时）
  * @param fn 函数
  * @param wait 延时毫秒数
  * @param immediate 是否立即执行
  */

/* istanbul ignore next */

function debounce(fn, wait) {
  var immediate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var handle,
      ret = null;

  var debounced = function debounced() {
    var _arguments = arguments;
    clearTimeout(handle);

    if (immediate === true) {
      if (!handle) {
        ret = fn.apply(void 0, arguments); // eslint-disable-line
      }

      handle = setTimeout(function () {
        return fn.apply(void 0, _toConsumableArray(_arguments));
      }, wait); // eslint-disable-line
    } else {
      handle = setTimeout(function () {
        return fn.apply(void 0, _toConsumableArray(_arguments));
      }, wait); // eslint-disable-line
    }

    return ret;
  };

  debounced.cancal = function () {
    clearTimeout(handle);
    handle = null;
  };

  return debounced; // eslint-disable-line @typescript-eslint/no-explicit-any
}
/**
  * 节流
  * （当持续触发事件时，
  * 保证一定时间段内只调用一次事件处理函数）
  * @param fn 函数
  * @param wait 间隔毫秒数
  * @param options 配置项
  */

/* istanbul ignore next */

function throttle(fn, wait) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    leading: true,
    trailing: true
  };
  var handle,
      previous = 0;

  var throttled = function throttled() {
    var _arguments2 = arguments;
    var now = Date.now();

    if (!previous && !options.leading) {
      previous = now;
    }

    var remaining = wait - (now - previous);

    if (remaining <= 0 || remaining > wait) {
      if (handle) {
        clearTimeout(handle);
        handle = null;
      }

      previous = now;
      fn.apply(void 0, arguments); // eslint-disable-line
    } else if (!handle && options.trailing) {
      handle = setTimeout(function () {
        previous = !options.leading ? 0 : Date.now();
        handle = null;
        fn.apply(void 0, _toConsumableArray(_arguments2)); // eslint-disable-line
      }, remaining);
    }
  };

  throttled.cancle = function () {
    clearTimeout(handle);
    previous = 0;
    handle = null;
  };

  return throttled; // eslint-disable-line @typescript-eslint/no-explicit-any
}
/**
  * 列表转树形结构
  * @param list 列表数组
  * @param options 配置项
  * @returns 树形结构数组
  */

function listToTree(list, options) {
  var _options = {
    idField: 'id',
    parentIdField: 'parentId',
    checkParentIdCallback: function checkParentIdCallback(parentId) {
      return !!parentId;
    }
  };
  Object.assign(_options, options !== null && options !== void 0 ? options : {});
  var map = {};
  var node, i;
  var roots = [];

  for (i = 0; i < list.length; i += 1) {
    map[list[i][_options.idField]] = i;
    list[i].children = [];
  }

  for (i = 0; i < list.length; i += 1) {
    node = list[i];

    if (_options.checkParentIdCallback(node[_options.parentIdField])) {
      list[map[node[_options.parentIdField]]].children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}
/**
  * 解析列表
  * @param list 列表
  * @param parseFields 解析字段集
  * @returns 解析结果列表
  */

function parseListField(list, parseFields) {
  return list.map(function (item) {
    var newItem = _objectSpread2({}, item); // eslint-disable-line @typescript-eslint/no-explicit-any


    parseFields.forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          fromField = _ref2[0],
          toField = _ref2[1];

      newItem[toField] = newItem[fromField];
    });
    return newItem;
  }); // eslint-disable-line @typescript-eslint/no-explicit-any
}
/* istanbul ignore next */

function whenRightReturn(time, intervalCallback) {
  return new Promise(function (resolve) {
    var handleId = setInterval(function () {
      var ret = intervalCallback();

      if (ret) {
        clearInterval(handleId);
        resolve(ret);
      }
    }, time);
  });
}
/**
  * 判断是否为Promise对象
  * @param obj 对象
  * @returns 判断结果
  */

/* istanbul ignore next */

function isPromise(obj) {
  return obj && Object.prototype.toString.call(obj) === '[object Promise]';
}
function isNullOrUndefined(obj) {
  return obj === null || obj === undefined;
}

export { $extend, copyText, createGuid, createIntRandom, debounce, deepCopy, deepCopyJSON, getArrayItemRandom, isFromMobileBrowser, isNullOrUndefined, isPromise, listToTree, loadCss, loadJs, parseListField, throttle, whenRightReturn };
