function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
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

/**
 * 事件者类，用以观测监听对象实例产生的事件
 */
var Observable = /*#__PURE__*/function () {
  function Observable() {
    _classCallCheck(this, Observable);

    _defineProperty(this, "_eventPool", new Map());
  }

  _createClass(Observable, [{
    key: "on",
    value: // eslint-disable-line @typescript-eslint/no-explicit-any

    /**
     * 绑定监听函数
     * @param name 监听类型名
     * @param callback 监听回调函数
     */
    function on(name, callback) {
      var _this = this;

      var key = name.toLowerCase();

      var eventList = this._eventPool.get(key);

      if (!eventList) {
        this._eventPool.set(name, []);

        eventList = this._eventPool.get(key);
      }

      eventList.push(callback);
      return {
        remove: function remove() {
          return _this.off(name, callback);
        }
      };
    }
    /**
     * 移除监听函数
     * @param name 监听类型名
     * @param callback 监听回调函数（不指定者移除所有）
     */

  }, {
    key: "off",
    value: function off(name, callback) {
      var key = name.toLowerCase();

      var eventList = this._eventPool.get(key);

      if (!eventList || eventList.length === 0) {
        return;
      }

      if (!callback) {
        eventList.splice(0, eventList.length);
        return;
      }

      for (var i = 0; i < eventList.length; i++) {
        if (callback === eventList[i]) {
          eventList.splice(i--, 1); // i-- 预防遍历丢失情况
        }
      }
    }
    /**
     * 触发监听函数
     * @param name 监听函数名
     * @param data 数据
     */

  }, {
    key: "fire",
    value: function fire(name, data) {
      var key = name.toLowerCase();

      var eventList = this._eventPool.get(key);

      if (!eventList) {
        return this;
      }

      var len = eventList.length;

      if (len === 0) {
        return this;
      }

      var params = Object.assign({
        name: key,
        origin: this
      }, data || {});

      for (var i = len - 1; i >= 0; i--) {
        var callback = eventList[i];

        if (typeof callback(params) === 'boolean') {
          return this;
        } // if (eventList.length < len) {
        //   i--
        //   len = eventList.length
        // }

      }

      return this;
    }
    /**
     * 绑定监听函数（仅监听一次）
     * @param name 监听类型名
     * @param callback 监听回调函数
     */

  }, {
    key: "once",
    value: function once(name, callback) {
      var _this2 = this;

      var key = name.toLowerCase();

      var nfn = function nfn() {
        _this2.off(key, nfn);

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        callback.apply(_this2, args);
      };

      this.on(key, nfn);
    }
  }]);

  return Observable;
}();

export { Observable };
