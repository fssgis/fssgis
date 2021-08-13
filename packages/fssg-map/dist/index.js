import { deepCopy, $extend } from '@fssgis/utils';
import { Observable } from '@fssgis/observable';

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

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

/**
 * 基类（抽象类）
 */

var BaseClass = /*#__PURE__*/function (_Observable) {
  _inherits(BaseClass, _Observable);

  var _super = _createSuper(BaseClass);

  //#region 私有属性

  /**
   * 实例初始化完成状态
   */
  //#endregion
  //#region 保护属性

  /**
   * 实例配置项
   */
  //#endregion
  //#region 构造函数

  /**
   * 构造基类
   * @param options 配置项
   * @param defaultOptions 默认配置项
   */
  function BaseClass() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var defaultOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, BaseClass);

    _this = _super.call(this);

    _defineProperty(_assertThisInitialized(_this), "_loaded", void 0);

    _defineProperty(_assertThisInitialized(_this), "options_", void 0);

    _this.options_ = deepCopy(defaultOptions);
    $extend(true, _this.options_, options);
    _this._loaded = false;

    _this.once('loaded', function () {
      return _this._loaded = true;
    });

    return _this;
  } //#endregion
  //#region 公有方法

  /**
   * 监听实例初始化完成
   * @param callback 实例初始化完成回调函数
   */


  _createClass(BaseClass, [{
    key: "when",
    value: function when(callback) {
      var _this2 = this;

      return new Promise(function (resolve) {
        if (_this2._loaded) {
          callback === null || callback === void 0 ? void 0 : callback();
          resolve();
        } else {
          _this2.once('loaded', function () {
            callback === null || callback === void 0 ? void 0 : callback();
            resolve();
          });
        }
      });
    }
  }]);

  return BaseClass;
}(Observable);

/**
 * 地图应用类（抽象类）
 */

var FssgMap = /*#__PURE__*/function (_BaseClass) {
  _inherits(FssgMap, _BaseClass);

  var _super = _createSuper(FssgMap);

  //#endregion
  //#region 构造函数

  /**
   * 构造地图应用实例
   * @param container 地图容器
   * @param options 配置项
   * @param defaultOptions 默认配置项
   */
  function FssgMap(container, options, defaultOptions) {
    var _this;

    _classCallCheck(this, FssgMap);

    _this = _super.call(this, options, defaultOptions);

    _defineProperty(_assertThisInitialized(_this), "_container", void 0);

    _this._container = container;

    _this._initDebug();

    return _this;
  } //#endregion

  /**
   * 初始化调试
   * @returns this
   */


  _createClass(FssgMap, [{
    key: "container",
    get: //#region 私有属性

    /**
     * 地图容器
     */
    //#endregion
    //#region getter settter

    /**
     * 地图容器
     */
    function get() {
      return this._container;
    }
  }, {
    key: "_initDebug",
    value: function _initDebug() {
      var _this$options_ = this.options_,
          debug = _this$options_.debug,
          debugName = _this$options_.debugName;

      if (debug && debugName) {
        debug && (window[debugName] = this);
      }

      return this;
    }
    /**
     * 安装地图应用插件
     * @param plugin 地图应用插件
     * @returns this
     */

  }, {
    key: "use",
    value: function use(plugin) {
      var _this2 = this;

      this.when().then(function () {
        _this2[plugin.pluginName] = plugin.installPlugin(_this2); // eslint-disable-line

        plugin.fire('loaded');
      });
      return this;
    }
  }]);

  return FssgMap;
}(BaseClass);

/**
 * 地图应用插件类（抽象类）
 */

var FssgMapPlugin = /*#__PURE__*/function (_BaseClass) {
  _inherits(FssgMapPlugin, _BaseClass);

  var _super = _createSuper(FssgMapPlugin);

  //#endregion
  //#region 构造函数

  /**
   *构造地图应用插件实例
   * @param pluginName 插件名
   * @param options 配置项
   * @param defaultOptions 默认配置项
   */
  function FssgMapPlugin(options, defaultOptions) {
    var _this;

    _classCallCheck(this, FssgMapPlugin);

    _this = _super.call(this, options, defaultOptions);

    _defineProperty(_assertThisInitialized(_this), "pluginName_", void 0);

    var name = _this.constructor.name;
    _this.pluginName_ = name.replace(name[0], name[0].toLowerCase());
    return _this;
  }

  _createClass(FssgMapPlugin, [{
    key: "pluginName",
    get: //#region 保护属性

    /**
     * 插件名
     */
    //#endregion
    //#region getter setter

    /**
     * 插件名
     */
    function get() {
      return this.pluginName_;
    }
  }]);

  return FssgMapPlugin;
}(BaseClass);

export { BaseClass, FssgMap, FssgMapPlugin };
