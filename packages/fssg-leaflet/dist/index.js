import { FssgMap, FssgMapPlugin } from '@fssgis/fssg-map';
import { map, point, latLng, icon, marker, Icon, LayerGroup, tileLayer } from 'leaflet';
import { $extend } from '@fssgis/utils';

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

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
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

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

function isNullOrUndefined(obj) {
  return obj === null || obj === undefined;
}

var _excluded = ["x", "y", "lon", "lat", "zoom"];
/**
 * 地图应用
 */

var FssgLeaflet = /*#__PURE__*/function (_FssgMap) {
  _inherits(FssgLeaflet, _FssgMap);

  var _super = _createSuper(FssgLeaflet);

  /**
   * 构造地图应用
   * @param container 地图容器
   * @param options 配置项
   */
  function FssgLeaflet(container) {
    var _this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, FssgLeaflet);

    _this = _super.call(this, container, options, {
      debugName: 'fssgLeaflet',
      debug: false,
      mapOptions: {
        zoom: 1,
        center: [0, 0],
        zoomControl: true,
        attributionControl: false
      }
    });

    _defineProperty(_assertThisInitialized(_this), "basemap", void 0);

    _defineProperty(_assertThisInitialized(_this), "mapElement", void 0);

    _defineProperty(_assertThisInitialized(_this), "_map", void 0);

    return _this;
  }
  /**
   * 初始化地图实例
   * @returns this
   */


  _createClass(FssgLeaflet, [{
    key: "map",
    get:
    /**
     * leaflet地图实例
     */

    /**
     * leaflet地图实例
     */
    function get() {
      return this._map;
    }
  }, {
    key: "_initMap",
    value: function _initMap() {
      this._map = Object.assign(map(this.container, this.options_.mapOptions), {
        $owner: this
      });
      return this;
    }
    /**
     * 定位
     * @param latLng 经纬度对象
     * @param zoom 缩放等级
     * @param options 配置项
     * @returns this
     */

  }, {
    key: "_locateTo",
    value: function _locateTo(latLng, zoom, options) {
      var _zoom;

      zoom = (_zoom = zoom) !== null && _zoom !== void 0 ? _zoom : this._map.getZoom();

      this._map.flyTo(latLng, zoom, _objectSpread2({}, options));

      return this;
    }
    /**
     * 安装地图应用
     * @returns this
     */

  }, {
    key: "mount",
    value: function mount() {
      return this._initMap().fire('loaded');
    }
    /**
     * 定位
     * @param options 配置项
     * @returns this
     */

  }, {
    key: "locateTo",
    value: function locateTo(options) {
      var x = options.x,
          y = options.y,
          lon = options.lon,
          lat = options.lat,
          zoom = options.zoom,
          zoomPanOptions = _objectWithoutProperties(options, _excluded);

      if (!isNullOrUndefined(x) && !isNullOrUndefined(y)) {
        var _latLng2 = this.xyToLatLng(point(x, y));

        this._locateTo(_latLng2, zoom, zoomPanOptions);

        return this;
      }

      if (!isNullOrUndefined(lon) && !isNullOrUndefined(lat)) {
        this._locateTo(latLng(lat, lon), zoom, zoomPanOptions);

        return this;
      }

      return this;
    }
    /**
     * 经纬度转投影坐标
     * @param _latLng 经纬度
     * @returns 投影坐标
     */

  }, {
    key: "latLngToXY",
    value: function latLngToXY(_latLng) {
      var _this$options_$mapOpt;

      var crs = (_this$options_$mapOpt = this.options_.mapOptions) === null || _this$options_$mapOpt === void 0 ? void 0 : _this$options_$mapOpt.crs;

      if (crs) {
        return crs.project(_latLng);
      }

      return this._map.project(_latLng);
    }
    /**
     * 经纬度转投影坐标
     * @param xy 投影坐标
     * @returns 经纬度
     */

  }, {
    key: "xyToLatLng",
    value: function xyToLatLng(xy) {
      var _this$options_$mapOpt2;

      var crs = (_this$options_$mapOpt2 = this.options_.mapOptions) === null || _this$options_$mapOpt2 === void 0 ? void 0 : _this$options_$mapOpt2.crs;

      var _xy = point(xy.x, xy.y);

      if (crs) {
        return crs.unproject(_xy);
      }

      return this._map.unproject(_xy);
    }
    /**
     * 获取中心点经纬度和投影坐标信息
     * @returns 中心点的经纬度和投影坐标信息
     */

  }, {
    key: "getCenter",
    value: function getCenter() {
      var _latlng = this._map.getCenter();

      var xy = this.latLngToXY(_latlng);
      return {
        x: xy.x,
        y: xy.y,
        lon: _latlng.lng,
        lat: _latlng.lat
      };
    }
    /**
     * 经纬度对象转leaflet敬畏度对象
     * @param lonlat 经纬度
     * @returns leaflet经纬度对象
     */

  }, {
    key: "lonlatToLatlng",
    value: function lonlatToLatlng(lonlat) {
      return latLng(lonlat.lat, lonlat.lon);
    }
    /**
     * 经纬度转投影坐标
     * @param lonlat 经纬度
     * @returns 投影坐标
     */

  }, {
    key: "lonlatToXY",
    value: function lonlatToXY(lonlat) {
      var _latlng = this.lonlatToLatlng(lonlat);

      return this.latLngToXY(_latlng);
    }
  }]);

  return FssgLeaflet;
}(FssgMap);

var FssgLeafletPlugin = /*#__PURE__*/function (_FssgMapPlugin) {
  _inherits(FssgLeafletPlugin, _FssgMapPlugin);

  var _super = _createSuper(FssgLeafletPlugin);

  function FssgLeafletPlugin() {
    var _this;

    _classCallCheck(this, FssgLeafletPlugin);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "map_", void 0);

    return _this;
  }

  _createClass(FssgLeafletPlugin, [{
    key: "$",
    get:
    /**
     * 绑定的地图应用实例
     */
    function get() {
      return this.map_.$owner;
    }
    /**
     * 安装插件
     * @param fssgLeaflet 地图应用实例
     * @returns this
     */

  }, {
    key: "installPlugin",
    value: function installPlugin(fssgLeaflet) {
      this.map_ = fssgLeaflet.map;
      return this;
    }
  }]);

  return FssgLeafletPlugin;
}(FssgMapPlugin);

/**
 * 图元控制插件
 */

var MapElement = /*#__PURE__*/function (_FssgLeafletPlugin) {
  _inherits(MapElement, _FssgLeafletPlugin);

  var _super = _createSuper(MapElement);

  /**
   * 图元存储池
   */

  /**
   * 构造图元控制插件
   * @param options 配置项
   */
  function MapElement(options) {
    var _this;

    _classCallCheck(this, MapElement);

    _this = _super.call(this, options, {});

    _defineProperty(_assertThisInitialized(_this), "_elementPool", void 0);

    _this._elementPool = new Set();
    return _this;
  }
  /**
   * 添加图元
   * @param layer 图元
   * @returns this
   */


  _createClass(MapElement, [{
    key: "add",
    value: function add(layer) {
      this._elementPool.add(layer.addTo(this.map_));

      return this;
    }
  }, {
    key: "addMarkerByXY",
    value: function addMarkerByXY(xy, iconOptions, options) {
      var _leafletIcon;

      var leafletIcon = undefined;

      if (iconOptions) {
        leafletIcon = icon(iconOptions);
      }

      var latlng = this.$.xyToLatLng(xy);

      var _marker = marker(latlng, _objectSpread2({
        icon: (_leafletIcon = leafletIcon) !== null && _leafletIcon !== void 0 ? _leafletIcon : new Icon.Default()
      }, options)).addTo(this.map_);

      this._elementPool.add(_marker);

      return _marker;
    }
  }, {
    key: "clearAll",
    value: function clearAll() {
      var _this2 = this;

      this._elementPool.forEach(function (item) {
        return item.removeFrom(_this2.map_);
      });

      this._elementPool.clear();

      return this;
    }
  }, {
    key: "setMarkersByList",
    value: function setMarkersByList(list, options) {
      var _this3 = this;

      this.clearAll();
      var xField = options.xField,
          yField = options.yField,
          labelField = options.labelField,
          iconUrlField = options.iconUrlField,
          iconOptions = options.iconOptions,
          labelOptions = options.labelOptions,
          classNameField = options.classNameField;
      list.forEach(function (item) {
        var _icon2;

        var x = item[xField];
        var y = item[yField];
        var label = item[labelField];
        var className = item[classNameField !== null && classNameField !== void 0 ? classNameField : ''];

        var _icon;

        if (iconUrlField) {
          _icon = icon(_objectSpread2({
            iconUrl: item[iconUrlField]
          }, iconOptions));
        }

        var _marker = marker(_this3.$.xyToLatLng({
          x: x,
          y: y
        }), {
          icon: (_icon2 = _icon) !== null && _icon2 !== void 0 ? _icon2 : new Icon.Default()
        }).bindTooltip(label, _objectSpread2({
          permanent: true,
          sticky: true,
          className: className
        }, labelOptions));

        _this3.add(_marker);
      });
      return this;
    }
  }]);

  return MapElement;
}(FssgLeafletPlugin);
/*
    Leaflet.label, a plugin that adds labels to markers and vectors for Leaflet powered maps.
    (c) 2012-2013, Jacob Toye, Smartrak

    https://github.com/Leaflet/Leaflet.label
    http://leafletjs.com
    https://github.com/jacobtoye
*/
// ;(function (window, document) {
//   (L as any).labelVersion = '0.2.2-dev'
//   ;(L as any).Label = L.Class.extend({
//     includes: L.Mixin.Events,
//     options: {
//       className: '',
//       clickable: false,
//       direction: 'right',
//       noHide: false,
//       offset: [12, -15], // 6 (width of the label triangle) + 6 (padding)
//       opacity: 1,
//       zoomAnimation: true
//     },
//     initialize: function (options, source) {
//       L.setOptions(this, options)
//       this._source = source
//       this._animated = L.Browser.any3d && this.options.zoomAnimation
//       this._isOpen = false
//     },
//     onAdd: function (map) {
//       this._map = map
//       this._pane = this.options.pane ? map._panes[this.options.pane] :
//         this._source instanceof L.Marker ? map._panes.markerPane : map._panes.popupPane
//       if (!this._container) {
//         this._initLayout()
//       }
//       this._pane.appendChild(this._container)
//       this._initInteraction()
//       this._update()
//       this.setOpacity(this.options.opacity)
//       map
//         .on('moveend', this._onMoveEnd, this)
//         .on('viewreset', this._onViewReset, this)
//       if (this._animated) {
//         map.on('zoomanim', this._zoomAnimation, this)
//       }
//       if (L.Browser.touch && !this.options.noHide) {
//         L.DomEvent.on(this._container, 'click', this.close, this)
//         map.on('click', this.close, this)
//       }
//     },
//     onRemove: function (map) {
//       this._pane.removeChild(this._container)
//       map.off({
//         zoomanim: this._zoomAnimation,
//         moveend: this._onMoveEnd,
//         viewreset: this._onViewReset
//       }, this)
//       this._removeInteraction()
//       this._map = null
//     },
//     setLatLng: function (latlng) {
//       this._latlng = L.latLng(latlng)
//       if (this._map) {
//         this._updatePosition()
//       }
//       return this
//     },
//     setContent: function (content) {
//       // Backup previous content and store new content
//       this._previousContent = this._content
//       this._content = content
//       this._updateContent()
//       return this
//     },
//     close: function () {
//       const map = this._map
//       if (map) {
//         if (L.Browser.touch && !this.options.noHide) {
//           L.DomEvent.off(this._container, 'click', this.close)
//           map.off('click', this.close, this)
//         }
//         map.removeLayer(this)
//       }
//     },
//     updateZIndex: function (zIndex) {
//       this._zIndex = zIndex
//       if (this._container && this._zIndex) {
//         this._container.style.zIndex = zIndex
//       }
//     },
//     setOpacity: function (opacity) {
//       this.options.opacity = opacity
//       if (this._container) {
//         L.DomUtil.setOpacity(this._container, opacity)
//       }
//     },
//     _initLayout: function () {
//       this._container = L.DomUtil.create('div', 'leaflet-label ' + this.options.className + ' leaflet-zoom-animated')
//       this.updateZIndex(this._zIndex)
//     },
//     _update: function () {
//       if (!this._map) {
//  return
// }
//       this._container.style.visibility = 'hidden'
//       this._updateContent()
//       this._updatePosition()
//       this._container.style.visibility = ''
//     },
//     _updateContent: function () {
//       if (!this._content || !this._map || this._prevContent === this._content) {
//         return
//       }
//       if (typeof this._content === 'string') {
//         this._container.innerHTML = this._content
//         this._prevContent = this._content
//         this._labelWidth = this._container.offsetWidth
//       }
//     },
//     _updatePosition: function () {
//       const pos = this._map.latLngToLayerPoint(this._latlng)
//       this._setPosition(pos)
//     },
//     _setPosition: function (pos) {
//       const map = this._map,
//         container = this._container,
//         centerPoint = map.latLngToContainerPoint(map.getCenter()),
//         labelPoint = map.layerPointToContainerPoint(pos),
//         direction = this.options.direction,
//         labelWidth = this._labelWidth,
//         offset = L.point(this.options.offset)
//       // position to the right (right or auto & needs to)
//       if (direction === 'right' || direction === 'auto' && labelPoint.x < centerPoint.x) {
//         L.DomUtil.addClass(container, 'leaflet-label-right')
//         L.DomUtil.removeClass(container, 'leaflet-label-left')
//         pos = pos.add(offset)
//       } else { // position to the left
//         L.DomUtil.addClass(container, 'leaflet-label-left')
//         L.DomUtil.removeClass(container, 'leaflet-label-right')
//         pos = pos.add(L.point(-offset.x - labelWidth, offset.y))
//       }
//       L.DomUtil.setPosition(container, pos)
//     },
//     _zoomAnimation: function (opt) {
//       const pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center).round()
//       this._setPosition(pos)
//     },
//     _onMoveEnd: function () {
//       if (!this._animated || this.options.direction === 'auto') {
//         this._updatePosition()
//       }
//     },
//     _onViewReset: function (e) {
//       /* if map resets hard, we must update the label */
//       if (e && e.hard) {
//         this._update()
//       }
//     },
//     _initInteraction: function () {
//       if (!this.options.clickable) {
//  return
// }
//       const container = this._container,
//         events = ['dblclick', 'mousedown', 'mouseover', 'mouseout', 'contextmenu']
//       L.DomUtil.addClass(container, 'leaflet-clickable')
//       L.DomEvent.on(container, 'click', this._onMouseClick, this)
//       for (let i = 0; i < events.length; i++) {
//         L.DomEvent.on(container, events[i], this._fireMouseEvent, this)
//       }
//     },
//     _removeInteraction: function () {
//       if (!this.options.clickable) {
//  return
// }
//       const container = this._container,
//         events = ['dblclick', 'mousedown', 'mouseover', 'mouseout', 'contextmenu']
//       L.DomUtil.removeClass(container, 'leaflet-clickable')
//       L.DomEvent.off(container, 'click', this._onMouseClick, this)
//       for (let i = 0; i < events.length; i++) {
//         L.DomEvent.off(container, events[i], this._fireMouseEvent, this)
//       }
//     },
//     _onMouseClick: function (e) {
//       if (this.hasEventListeners(e.type)) {
//         L.DomEvent.stopPropagation(e)
//       }
//       this.fire(e.type, {
//         originalEvent: e
//       })
//     },
//     _fireMouseEvent: function (e) {
//       this.fire(e.type, {
//         originalEvent: e
//       })
//       // TODO proper custom event propagation
//       // this line will always be called if marker is in a FeatureGroup
//       if (e.type === 'contextmenu' && this.hasEventListeners(e.type)) {
//         L.DomEvent.preventDefault(e)
//       }
//       if (e.type !== 'mousedown') {
//         L.DomEvent.stopPropagation(e)
//       } else {
//         L.DomEvent.preventDefault(e)
//       }
//     }
//   })
//   // This object is a mixin for L.Marker and L.CircleMarker. We declare it here as both need to include the contents.
//   ;(L as any).BaseMarkerMethods = {
//     showLabel: function () {
//       if (this.label && this._map) {
//         this.label.setLatLng(this._latlng)
//         this._map.showLabel(this.label)
//       }
//       return this
//     },
//     hideLabel: function () {
//       if (this.label) {
//         this.label.close()
//       }
//       return this
//     },
//     setLabelNoHide: function (noHide) {
//       if (this._labelNoHide === noHide) {
//         return
//       }
//       this._labelNoHide = noHide
//       if (noHide) {
//         this._removeLabelRevealHandlers()
//         this.showLabel()
//       } else {
//         this._addLabelRevealHandlers()
//         this.hideLabel()
//       }
//     },
//     bindLabel: function (content, options) {
//       const labelAnchor = this.options.icon ? this.options.icon.options.labelAnchor : this.options.labelAnchor
//       let anchor = L.point(labelAnchor) || L.point(0, 0)
//       anchor = anchor.add(L.Label.prototype.options.offset)
//       if (options && options.offset) {
//         anchor = anchor.add(options.offset)
//       }
//       options = L.Util.extend({offset: anchor}, options)
//       this._labelNoHide = options.noHide
//       if (!this.label) {
//         if (!this._labelNoHide) {
//           this._addLabelRevealHandlers()
//         }
//         this
//           .on('remove', this.hideLabel, this)
//           .on('move', this._moveLabel, this)
//           .on('add', this._onMarkerAdd, this)
//         this._hasLabelHandlers = true
//       }
//       // eslint-disable-next-line
//       // @ts-ignore
//       this.label = new L.Label(options, this)
//         .setContent(content)
//       return this
//     },
//     unbindLabel: function () {
//       if (this.label) {
//         this.hideLabel()
//         this.label = null
//         if (this._hasLabelHandlers) {
//           if (!this._labelNoHide) {
//             this._removeLabelRevealHandlers()
//           }
//           this
//             .off('remove', this.hideLabel, this)
//             .off('move', this._moveLabel, this)
//             .off('add', this._onMarkerAdd, this)
//         }
//         this._hasLabelHandlers = false
//       }
//       return this
//     },
//     updateLabelContent: function (content) {
//       if (this.label) {
//         this.label.setContent(content)
//       }
//     },
//     getLabel: function () {
//       return this.label
//     },
//     _onMarkerAdd: function () {
//       if (this._labelNoHide) {
//         this.showLabel()
//       }
//     },
//     _addLabelRevealHandlers: function () {
//       this
//         .on('mouseover', this.showLabel, this)
//         .on('mouseout', this.hideLabel, this)
//       if (L.Browser.touch) {
//         this.on('click', this.showLabel, this)
//       }
//     },
//     _removeLabelRevealHandlers: function () {
//       this
//         .off('mouseover', this.showLabel, this)
//         .off('mouseout', this.hideLabel, this)
//       if (L.Browser.touch) {
//         this.off('click', this.showLabel, this)
//       }
//     },
//     _moveLabel: function (e) {
//       this.label.setLatLng(e.latlng)
//     }
//   }
//   // Add in an option to icon that is used to set where the label anchor is
//   L.Icon.Default.mergeOptions({
//     labelAnchor: new L.Point(9, -20)
//   })
//   // Have to do this since Leaflet is loaded before this plugin and initializes
//   // L.Marker.options.icon therefore missing our mixin above.
//   L.Marker.mergeOptions({
//     icon: new L.Icon.Default()
//   })
//   L.Marker.include((L as any).BaseMarkerMethods)
//   L.Marker.include({
//     _originalUpdateZIndex: (L.Marker.prototype as any)._updateZIndex,
//     _updateZIndex: function (offset) {
//       const zIndex = this._zIndex + offset
//       this._originalUpdateZIndex(offset)
//       if (this.label) {
//         this.label.updateZIndex(zIndex)
//       }
//     },
//     _originalSetOpacity: L.Marker.prototype.setOpacity,
//     setOpacity: function (opacity, labelHasSemiTransparency) {
//       this.options.labelHasSemiTransparency = labelHasSemiTransparency
//       this._originalSetOpacity(opacity)
//     },
//     _originalUpdateOpacity: (L.Marker.prototype as any)._updateOpacity,
//     _updateOpacity: function () {
//       const absoluteOpacity = this.options.opacity === 0 ? 0 : 1
//       this._originalUpdateOpacity()
//       if (this.label) {
//         this.label.setOpacity(this.options.labelHasSemiTransparency ? this.options.opacity : absoluteOpacity)
//       }
//     },
//     _originalSetLatLng: L.Marker.prototype.setLatLng,
//     setLatLng: function (latlng) {
//       if (this.label && !this._labelNoHide) {
//         this.hideLabel()
//       }
//       return this._originalSetLatLng(latlng)
//     }
//   })
//   // Add in an option to icon that is used to set where the label anchor is
//   L.CircleMarker.mergeOptions({
//     labelAnchor: new L.Point(0, 0)
//   })
//   L.CircleMarker.include((L as any).BaseMarkerMethods)
//   L.Path.include({
//     bindLabel: function (content, options) {
//       if (!this.label || this.label.options !== options) {
//         // eslint-disable-next-line
//         // @ts-ignore
//         this.label = new L.Label(options, this)
//       }
//       this.label.setContent(content)
//       if (!this._showLabelAdded) {
//         this
//           .on('mouseover', this._showLabel, this)
//           .on('mousemove', this._moveLabel, this)
//           .on('mouseout remove', this._hideLabel, this)
//         if (L.Browser.touch) {
//           this.on('click', this._showLabel, this)
//         }
//         this._showLabelAdded = true
//       }
//       return this
//     },
//     unbindLabel: function () {
//       if (this.label) {
//         this._hideLabel()
//         this.label = null
//         this._showLabelAdded = false
//         this
//           .off('mouseover', this._showLabel, this)
//           .off('mousemove', this._moveLabel, this)
//           .off('mouseout remove', this._hideLabel, this)
//       }
//       return this
//     },
//     updateLabelContent: function (content) {
//       if (this.label) {
//         this.label.setContent(content)
//       }
//     },
//     _showLabel: function (e) {
//       this.label.setLatLng(e.latlng)
//       this._map.showLabel(this.label)
//     },
//     _moveLabel: function (e) {
//       this.label.setLatLng(e.latlng)
//     },
//     _hideLabel: function () {
//       this.label.close()
//     }
//   })
//   L.Map.include({
//     showLabel: function (label) {
//       return this.addLayer(label)
//     }
//   })
//   L.FeatureGroup.include({
//     // TODO: remove this when AOP is supported in Leaflet, need this as we cannot put code in removeLayer()
//     clearLayers: function () {
//       this.unbindLabel()
//       this.eachLayer(this.removeLayer, this)
//       return this
//     },
//     bindLabel: function (content, options) {
//       return this.invoke('bindLabel', content, options)
//     },
//     unbindLabel: function () {
//       return this.invoke('unbindLabel')
//     },
//     updateLabelContent: function (content) {
//       this.invoke('updateLabelContent', content)
//     }
//   })
//   }(this, document))

var ExtLayer = /*#__PURE__*/function (_LayerGroup) {
  _inherits(ExtLayer, _LayerGroup);

  var _super = _createSuper(ExtLayer);

  function ExtLayer(layer, options) {
    var _this;

    _classCallCheck(this, ExtLayer);

    _this = _super.call(this);

    _defineProperty(_assertThisInitialized(_this), "options_", void 0);

    _defineProperty(_assertThisInitialized(_this), "layer_", void 0);

    _defineProperty(_assertThisInitialized(_this), "visible_", void 0);

    layer && (_this.layer_ = layer);
    _this.options_ = $extend(true, _this.options_, {
      visible: true
    }, options !== null && options !== void 0 ? options : {});

    _this._init();

    return _this;
  }

  _createClass(ExtLayer, [{
    key: "visible",
    get: function get() {
      return this.visible_;
    },
    set: function set(v) {
      if (this.visible_ !== v) {
        this.visible_ = v;
        v && this.layer_ ? this.addLayer(this.layer_) : this.removeLayer(this.layer_);
        this.fire('changed:visible');
      }
    }
  }, {
    key: "_init",
    value: function _init() {
      this.visible_ = this.options_.visible;

      if (this.visible_ && this.layer_) {
        this.addLayer(this.layer_);
      }

      return this;
    }
  }, {
    key: "setLayer",
    value: function setLayer(layer) {
      this.visible_ && this.layer_ && this.removeLayer(this.layer_);
      this.layer_ = layer;
      this.visible_ && this.addLayer(layer);
      return this;
    }
  }]);

  return ExtLayer;
}(LayerGroup);

/**
 * 底图插件
 */

var Basemap = /*#__PURE__*/function (_FssgLeafletPlugin) {
  _inherits(Basemap, _FssgLeafletPlugin);

  var _super = _createSuper(Basemap);

  /**
   * 构造底图插件
   * @param options 配置项
   */
  function Basemap(options) {
    var _options$items;

    var _this;

    _classCallCheck(this, Basemap);

    _this = _super.call(this, options, {
      items: [],
      selectedKey: options === null || options === void 0 ? void 0 : (_options$items = options.items) === null || _options$items === void 0 ? void 0 : _options$items[0].key,
      visible: true
    });

    _defineProperty(_assertThisInitialized(_this), "_basemapLayer", void 0);

    _defineProperty(_assertThisInitialized(_this), "_selectedKey", void 0);

    _defineProperty(_assertThisInitialized(_this), "_visible", void 0);

    _defineProperty(_assertThisInitialized(_this), "_itemPools", void 0);

    return _this;
  }
  /**
   * 初始化
   * @returns this
   */


  _createClass(Basemap, [{
    key: "visible",
    get: function get() {
      return this._visible;
    },
    set: function set(v) {
      this._basemapLayer.visible = v;
      this._visible = v;
      this.fire('changed:visible', {
        visible: v
      });
    }
  }, {
    key: "_init",
    value: function _init() {
      this._selectedKey = this.options_.selectedKey;
      this._visible = this.options_.visible;
      this._basemapLayer = new ExtLayer(undefined, {
        visible: this._visible
      }).addTo(this.map_).setZIndex(0);
      this._itemPools = new Map();
      return this._initBasemapItems();
    }
  }, {
    key: "_initBasemapItems",
    value: function _initBasemapItems() {
      var _this$options_$items,
          _this2 = this;

      (_this$options_$items = this.options_.items) === null || _this$options_$items === void 0 ? void 0 : _this$options_$items.forEach(function (item) {
        var layer = undefined;

        if (item.type === 'tile' && item.url) {
          layer = tileLayer(item.url);
        }

        if (layer) {
          _this2._itemPools.set(item.key, {
            options: item,
            layers: [layer]
          });
        }
      });

      var selectedItem = this._itemPools.get(this._selectedKey);

      if (selectedItem) {
        this._basemapLayer.setLayer(selectedItem.layers[0]);
      }

      return this;
    }
    /**
     * 安装插件
     * @param fssgLeaflet 地图应用
     * @returns this
     */

  }, {
    key: "installPlugin",
    value: function installPlugin(fssgLeaflet) {
      return _get(_getPrototypeOf(Basemap.prototype), "installPlugin", this).call(this, fssgLeaflet)._init();
    }
  }]);

  return Basemap;
}(FssgLeafletPlugin);

export { Basemap, FssgLeaflet, FssgLeafletPlugin, MapElement };
