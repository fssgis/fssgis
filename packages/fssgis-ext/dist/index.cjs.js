'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
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

function extArray(arr) {
  var ret = {
    insert: function insert(index, value) {
      arr.splice(index, 0, value);
      return ret;
    },
    removeIndex: function removeIndex(index, returnRemoveValue) {
      var value = arr[index];
      arr.splice(index, 1);

      if (returnRemoveValue) {
        return value;
      }

      return ret;
    },
    clear: function clear() {
      arr.splice(0, arr.length);
      return ret;
    },
    reset: function reset() {
      for (var _len = arguments.length, items = new Array(_len), _key = 0; _key < _len; _key++) {
        items[_key] = arguments[_key];
      }

      arr.splice.apply(arr, [0, arr.length].concat(items));
      return ret;
    },
    removeValue: function removeValue(value) {
      var removeMany = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (removeMany) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i] === value) {
            arr.splice(i--, 1);
          }
        }
      } else {
        for (var _i = 0; _i < arr.length; _i++) {
          if (arr[_i] === value) {
            arr.splice(_i--, 1);
            break;
          }
        }
      }

      return ret;
    },
    unique: function unique() {
      var _extArray;

      (_extArray = extArray(arr)).reset.apply(_extArray, _toConsumableArray(new Set(arr)));

      return ret;
    },
    getUnique: function getUnique() {
      return _toConsumableArray(new Set(arr));
    },
    equal: function equal(anotherArr) {
      if (arr.length !== anotherArr.length) {
        return false;
      }

      for (var i = 0; i < arr.length; i++) {
        // eslint-disable-next-line
        // @ts-ignore
        if (arr[i] !== anotherArr[i]) {
          return false;
        }
      }

      return true;
    },
    findItem: function findItem(propName, propValue) {
      for (var i = 0; i < arr.length; i++) {
        var item = arr[i];

        if (item[propName] === propValue) {
          return item;
        }
      }

      return undefined;
    },
    findItems: function findItems(propName, propValue) {
      var result = [];

      for (var i = 0; i < arr.length; i++) {
        var item = arr[i];

        if (item[propName] === propValue) {
          result.push(item);
        }
      }

      return result;
    },
    propToArr: function propToArr(propName) {
      return arr.map(function (item) {
        return item[propName];
      });
    },
    last: function last() {
      return arr[arr.length - 1];
    }
  };
  return ret;
}

function extDate(date) {
  return {
    format: function format(fmt) {
      var o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        'S': date.getMilliseconds() //毫秒

      };

      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
      }

      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        }
      }

      return fmt;
    },
    getNextDate: function getNextDate(nDays) {
      return new Date(date.getTime() + 24 * 60 * 60 * 1000 * Number(nDays));
    },
    getMonth: function getMonth() {
      return date.getMonth() + 1;
    }
  };
}

function extNumber(num) {
  return {
    divide: function divide(val) {
      return Math.floor(num / val);
    },
    floor: function floor() {
      return Math.floor(num);
    },
    ceil: function ceil() {
      return Math.ceil(num);
    },
    abs: function abs() {
      return Math.abs(num);
    },
    round: function round() {
      var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var n = 1;

      if (count > 0) {
        n = count * 10;
      } else if (count < 0) {
        n = Math.pow(0.1, extNumber(count).abs());
      }

      return Math.round(num * n) / n;
    },
    toDate: function toDate() {
      return new Date(num);
    },
    toDateFormat: function toDateFormat(fmt) {
      return extDate(new Date(num)).format(fmt);
    },
    toCashString: function toCashString() {
      return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    toChineseString: function toChineseString() {
      var AA = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
      var BB = ['', '十', '百', '千', '万', '亿', '点', ''];
      var a = ('' + num).replace(/(^0*)/g, '').split('.');
      var k = 0,
          re = '';

      for (var i = a[0].length - 1; i >= 0; i--) {
        switch (k) {
          case 0:
            re = BB[7] + re;
            break;

          case 4:
            if (!new RegExp('0{4}\\d{' + (a[0].length - i - 1) + '}$').test(a[0])) {
              re = BB[4] + re;
            }

            break;

          case 8:
            re = BB[5] + re;
            BB[7] = BB[5];
            k = 0;
            break;
        }

        if (k % 4 === 2 && a[0].charAt(i + 2) !== '0' && a[0].charAt(i + 1) === '0') {
          re = AA[0] + re;
        }

        if (a[0].charAt(i) !== '0') {
          re = AA[a[0].charAt(i)] + BB[k % 4] + re;
        }

        k++;
      }

      if (a.length > 1) {
        //加上小数部分(如果有小数部分)
        re += BB[6];

        for (var _i = 0; _i < a[1].length; _i++) {
          re += AA[a[1].charAt(_i)];
        }
      }

      return re;
    }
  };
}

function extString(str) {
  return {
    trimAll: function trimAll() {
      return str.replace(new RegExp(' ', 'g'), '');
    },
    toDate: function toDate() {
      return new Date(str);
    },
    toDateFormat: function toDateFormat(fmt) {
      var date = extString(str).toDate();
      return extDate(date).format(fmt);
    }
  };
}

function ext(_this) {
  if (_this instanceof Date) {
    return extDate(_this);
  }

  if (typeof _this === 'string') {
    return extString(_this);
  }

  if (typeof _this === 'number') {
    return extNumber(_this);
  }

  if (Array.isArray(_this)) {
    return extArray(_this);
  }
}

exports.ext = ext;
exports.extArray = extArray;
exports.extDate = extDate;
exports.extNumber = extNumber;
exports.extString = extString;
