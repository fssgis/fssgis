import { FssgMapPlugin, FssgMap, error, warn, BASEMAP_TIAN_DI_TU_3857, BASEMAP_TIAN_DI_TU_4326, BaseTool, MAP_CURSOR_DIC } from '@fssgis/fssg-map';
import ArcGISMap from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import esriConfig from '@arcgis/core/config';
import Point from '@arcgis/core/geometry/Point';
import Polyline from '@arcgis/core/geometry/Polyline';
import Polygon from '@arcgis/core/geometry/Polygon';
import Extent from '@arcgis/core/geometry/Extent';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import GroupLayer from '@arcgis/core/layers/GroupLayer';
import WebTileLayer from '@arcgis/core/layers/WebTileLayer';
import Layer from '@arcgis/core/layers/Layer';
import TileLayer from '@arcgis/core/layers/TileLayer';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import Graphic from '@arcgis/core/Graphic';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { createGuid, deepCopyJSON, $extend, whenRightReturn, throttle, listToTree } from '@fssgis/utils';
import EsriBasemap from '@arcgis/core/Basemap';
import Geometry from '@arcgis/core/geometry/Geometry';

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
 * 几何工厂类（条件单例模式）
 * @private
 */

class GeometryFacory {
  /**
   * 实例容器
   */

  /**
   * 地图应用
   */

  /**
   * 实例容器绑定的地图应用空间坐标系
   */
  get _spatialReference() {
    return this._fssgEsri.sr;
  }
  /**
   * 构造几何工厂实例
   * @param fssgEsri 地图应用
   */


  constructor(fssgEsri) {
    _defineProperty(this, "_fssgEsri", void 0);

    const instance = GeometryFacory._instanceMap.get(fssgEsri);

    if (instance) {
      return instance;
    }

    this._fssgEsri = fssgEsri;

    GeometryFacory._instanceMap.set(fssgEsri, this);

    return this;
  }
  /**
   * 创建Esri点
   * @param options 配置项
   * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Point.html
   * @example
   * ```ts
   * createGeometryFactory().createPoint({ \/* xxx *\/ })
   * ```
   */


  createPoint(options) {
    return new Point({
      spatialReference: this._spatialReference,
      ...options
    });
  }
  /**
   * 创建Esri线
   * @param options 配置项
   * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Polyline.html
   * @example
   * ```ts
   * createGeometryFactory().createPolyline({ \/* xxx *\/ })
   * ```
   */


  createPolyline(options) {
    return new Polyline({
      spatialReference: this._spatialReference,
      ...options
    });
  }
  /**
   * 创建Esri面
   * @param options 配置项
   * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Polygon.html
   * @example
   * ```ts
   * createGeometryFactory().createPolygon({ \/* xxx *\/ })
   * ```
   */


  createPolygon(options) {
    return new Polygon({
      spatialReference: this._spatialReference,
      ...options
    });
  }
  /**
   * 创建Esri范围
   * @param options 配置项
   * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Extent.html
   * @example
   * ```ts
   * createGeometryFactory().createExtent({ \/* xxx *\/ })
   * ```
   */


  createExtent(options) {
    return new Extent({
      spatialReference: this._spatialReference,
      ...options
    });
  }
  /**
   * 根据XY坐标创建Esri点
   * @param args XY坐标
   * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Point.html
   * @example
   * ```ts
   * createGeometryFactory().createPointFromXY({ x: 0, y: 0 })
   * createGeometryFactory().createPointFromXY(0, 0)
   * ```
   */


  createPointFromXY(...args) {
    if (args.length === 2) {
      const [x, y] = args;
      return this.createPoint({
        x,
        y
      });
    } else {
      const xy = args[0];
      const x = Array.isArray(xy) ? xy[0] : xy.x;
      const y = Array.isArray(xy) ? xy[1] : xy.y;
      return this.createPoint({
        x,
        y
      });
    }
  }
  /**
   * 根据经纬度创建Esri点
   * @param args 经纬度
   * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Point.html
   * @example
   * ```ts
   * createGeometryFactory().createPointFromLonLat({ lon: 113, lat: 23 })
   * createGeometryFactory().createPointFromLonLat({ lng: 113, lat: 23 })
   * createGeometryFactory().createPointFromLonLat({ longitude: 113, latitude: 23 })
   * createGeometryFactory().createPointFromLonLat(113, 23)
   * ```
   */


  createPointFromLonLat(...args) {
    if (args.length === 2) {
      const [longitude, latitude] = args;
      return this.createPoint({
        longitude,
        latitude
      });
    } else {
      const lonlat = args[0]; // eslint-disable-next-line
      // @ts-ignore

      const longitude = Array.isArray(lonlat) ? lonlat[0] : lonlat.lon ?? lonlat.lng ?? lonlat.longitude; // eslint-disable-next-line
      // @ts-ignore

      const latitude = Array.isArray(lonlat) ? lonlat[1] : lonlat.lat ?? lonlat.latitude;
      return this.createPoint({
        longitude,
        latitude
      });
    }
  }
  /**
   * 根据Esri点集创建Esri线
   * @param points Esri点集
   * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Polyline.html
   */


  createPolylineFromPoints(points) {
    const polyline = this.createPolyline({
      paths: []
    });
    polyline.addPath(points);
    return polyline;
  }
  /**
   * 根据XY坐标集创建Esri线
   * @param xys XY坐标集
   * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Polyline.html
   */


  createPolylineFromXYs(xys) {
    const points = xys.map(xy => this.createPointFromXY(xy));
    return this.createPolylineFromPoints(points);
  }
  /**
   * 根据经纬度集创建Esri线
   * @param lonLats 经纬度集
   * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Polyline.html
   */


  createPolylineFromLonLats(lonLats) {
    const points = lonLats.map(lonLat => this.createPointFromLonLat(lonLat));
    return this.createPolylineFromPoints(points);
  }
  /**
   * 根据Esri点集创建Esri面
   * @param points Esri点集
   * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Polygon.html
   */


  createPolygonFromPoints(points) {
    const polygon = this.createPolygon({
      rings: []
    });
    polygon.addRing(points);
    return polygon;
  }
  /**
   * 根据Esri线创建Esri点集
   * @param polyline Esri线
   * @param pathIndex 线的路径索引，默认值为0
   * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Point.html
   */


  createPointsFromPolyline(polyline, pathIndex = 0) {
    const count = polyline.paths[pathIndex];
    const points = Array(count).map((_, i) => polyline.getPoint(pathIndex, i));
    return points;
  }
  /**
   * 根据Esri线创建Esri面
   * @param polyline Esri线
   * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Polygon.html
   */


  createPolygonFromPolyline(polyline) {
    const polygon = this.createPolygon({
      rings: []
    });
    polyline.paths.forEach((_, i) => {
      const points = this.createPointsFromPolyline(polyline, i);
      polygon.addRing(points);
    });
    return polygon;
  }
  /**
   * 根据XY坐标集创建Esri面
   * @param xys Esri线
   * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Polygon.html
   */


  createPolygonFromXYs(xys) {
    const points = xys.map(xy => this.createPointFromXY(xy));
    const polygon = this.createPolygonFromPoints(points);
    return polygon;
  }
  /**
   * 根据经纬度集创建Esri面
   * @param lonLats 经纬度集
   * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Polygon.html
   */


  createPolygonFromLonLats(lonLats) {
    const points = lonLats.map(lonLat => this.createPointFromLonLat(lonLat));
    const polygon = this.createPolygonFromPoints(points);
    return polygon;
  }

}
/**
 * 创建几何工厂
 * @param fssgEsri 地图应用
 */

_defineProperty(GeometryFacory, "_instanceMap", new Map());

function createGeometryFactory(fssgEsri) {
  return new GeometryFacory(fssgEsri);
}

/**
 * 图层工厂（单例模式）
 * @private
 */

class LayerFactory {
  /**
   * 实例
   */

  /**
   * 构造图层工厂实例
   */
  constructor() {
    if (LayerFactory._instance) {
      return LayerFactory._instance;
    }

    LayerFactory._instance = this;
    return this;
  }

  createLayer(options) {
    switch (options.layerType) {
      case 'graphicslayer':
        return this.createGraphicsLayer(options);

      case 'grouplayer':
        return this.createGroupLayer(options);

      case 'webtilelayer':
        return this.createWebTileLayer(options);

      case 'tilelayer':
        return this.createTileLayer(options);

      case 'dynamiclayer':
        return this.createDynamicLayer(options);

      case 'mapimagelayer':
        return this.createMapImageLayer(options);

      case 'sqllayer':
        return this.createSqlLayer(options);
      // eslint-disable-line

      case 'sqllayer2':
        return this.createSqlLayer2(options);
      // eslint-disable-line

      default:
        return new Layer(options);
    }
  }
  /**
   * 创建GraphicsLayer
   * @param options 配置项
   * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-GraphicsLayer.html
   * @example
   * ```ts
   * createLayerFactory().createGraphicsLayer({ \/* xxx *\/ })
   * ```
   */


  createGraphicsLayer(options) {
    return new GraphicsLayer(options);
  }
  /**
   * 创建GroupLayer
   * @param options 配置项
   * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-GroupLayer.html
   * @example
   * ```ts
   * createLayerFactory().createGroupLayer({ \/* xxx *\/ })
   * ```
   */


  createGroupLayer(options) {
    return new GroupLayer(options);
  }
  /**
   * 创建WebTileLayer
   * @param options 配置项
   * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-WebTileLayer.html
   * @example
   * ```ts
   * createLayerFactory().createWebTileLayer({ \/* xxx *\/ })
   * ```
   */


  createWebTileLayer(options) {
    return new WebTileLayer(options);
  }
  /**
   * 创建TileLayer
   * @param options 配置项
   * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-TileLayer.html
   * @example
   * ```ts
   * createLayerFactory().createTileLayer({ \/* xxx *\/ })
   * ```
   */


  createTileLayer(options) {
    return new TileLayer(options);
  }
  /**
   * 创建动态图层
   * @param options 配置项
   */


  createDynamicLayer(options) {
    const layer = new MapImageLayer({ ...options,
      sublayers: []
    });
    fetch(`${options === null || options === void 0 ? void 0 : options.url}?f=pjson`, {
      method: 'get'
    }).then(res => res.json()).then(result => {
      var _result$layers$find;

      const serverName = (options === null || options === void 0 ? void 0 : options.serverName) ?? (options === null || options === void 0 ? void 0 : options.name) ?? '';
      const id = (_result$layers$find = result.layers.find(item => item.name === serverName)) === null || _result$layers$find === void 0 ? void 0 : _result$layers$find.id; // eslint-disable-next-line
      // @ts-ignore

      layer.sublayers = [{
        id
      }];
    });
    return layer;
  }
  /**
   * 创建MapImageLayer
   * @param options 配置项
   */


  createMapImageLayer(options) {
    return new MapImageLayer(options);
  }
  /**
   * 创建SQL图层
   * @param options 配置项
   */


  createSqlLayer(options) {
    const layer = this.createGraphicsLayer(options);
    fetch(options.url, {
      method: 'get',
      mode: 'cors'
    }).then(res => res.json()).then(result => {
      result.forEach(row => {
        if (!row[options.sqlOptions.xField] || !row[options.sqlOptions.yField]) {
          return;
        }

        const attributes = row;
        let iconUrl;

        if (options.sqlOptions.iconUrl) {
          iconUrl = options.sqlOptions.iconUrl;
        } else if (options.sqlOptions.iconUrlFuncStr) {
          iconUrl = eval(options.sqlOptions.iconUrlFuncStr);
        }

        const props = {
          attributes,
          geometry: {
            type: 'point',
            x: row[options.sqlOptions.xField],
            y: row[options.sqlOptions.yField],
            spatialReference: options.spatialReference
          },
          symbol: {
            type: 'simple-marker',
            color: '#4FAFEF'
          }
        };

        if (iconUrl) {
          props['symbol'] = {
            type: 'picture-marker',
            url: iconUrl,
            width: '32px',
            height: '32px'
          };
        }

        const graphic = new Graphic(props);
        layer.graphics.add(graphic);
      });
    });
    return layer;
  }
  /**
   * 创建SQL图层
   * @param options 配置项
   */


  createSqlLayer2(options) {
    const {
      url,
      ...others
    } = options;
    const layer = new FeatureLayer({
      spatialReference: options.spatialReference,
      source: [],
      objectIdField: '$objectId',
      geometryType: 'point',
      ...others
    });

    if (options.sqlOptions.iconUrl) {
      layer.renderer = {
        type: 'simple',
        symbol: {
          type: 'picture-marker',
          url: options.sqlOptions.iconUrl,
          width: '32px',
          height: '32px'
        }
      };
    }

    fetch(options.url, {
      method: 'get',
      mode: 'cors'
    }).then(res => res.json()).then(result => {
      const graphics = [];
      result.forEach(row => {
        if (!row[options.sqlOptions.xField] || !row[options.sqlOptions.yField]) {
          return;
        }

        const attributes = row;
        const props = {
          attributes: { ...attributes,
            $objectId: createGuid()
          },
          geometry: {
            type: 'point',
            x: row[options.sqlOptions.xField],
            y: row[options.sqlOptions.yField],
            spatialReference: options.spatialReference
          }
        };
        const graphic = new Graphic(props);
        graphics.push(graphic);
      });
      layer.applyEdits({
        addFeatures: graphics
      });
    });
    return layer;
  }

}
/**
 * 创建图层工厂
 */


_defineProperty(LayerFactory, "_instance", void 0);

function createLayerFactory() {
  return new LayerFactory();
}

/**
 * 地图应用插件抽象类
 */

class FssgEsriPlugin extends FssgMapPlugin {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "map_", void 0);

    _defineProperty(this, "view_", void 0);
  }

  //#endregion

  /**
   * 绑定的地图应用实例
   */
  get $() {
    return this.map_.$owner;
  }
  /**
   * 安装插件
   * @param FssgEsri 地图应用实例
   */


  installPlugin(fssgEsri) {
    this.map_ = fssgEsri.map;
    this.view_ = fssgEsri.view;
    return this;
  }

}

esriConfig.apiKey = 'AAPKb95001bcb6a34be7a32b3fcb75eb27d1ujL7yX9tcvWSbUPoKwptBe_57mwGWOpklkdWrPt3L3OaW96gkJLjRctcOo1OvJ1S';
/**
 * 地图应用
 */

class FssgEsri extends FssgMap {
  //#region 私有属性

  /**
   * 地图对象
   */

  /**
    * 视图对象
    */
  //#endregion
  //#region getter setter

  /**
    * 地图对象
    */
  get map() {
    return this._map;
  }
  /**
    * 视图对象
    */


  get view() {
    return this._view;
  }
  /**
   * 配置项
   */


  get options() {
    return this.options_;
  }
  /**
   * 空间坐标系
   */


  get sr() {
    var _this$_view;

    if (!this._view) {
      error(this, `_view未实例无法获取spatialReference属性`);
    }

    const sr = this === null || this === void 0 ? void 0 : (_this$_view = this._view) === null || _this$_view === void 0 ? void 0 : _this$_view.spatialReference;
    return sr;
  }
  /**
   * 视图中心点
   */


  get center() {
    var _this$_view2;

    if (!this._view) {
      error(this, `_view未实例无法获取center属性`);
    }

    const center = this === null || this === void 0 ? void 0 : (_this$_view2 = this._view) === null || _this$_view2 === void 0 ? void 0 : _this$_view2.center;
    return center;
  }
  /**
   * 视图范围
   */


  get extent() {
    var _this$_view3;

    if (!this._view) {
      error(this, `_view未实例无法获取extent属性`);
    }

    const extent = this === null || this === void 0 ? void 0 : (_this$_view3 = this._view) === null || _this$_view3 === void 0 ? void 0 : _this$_view3.extent;
    return extent;
  }
  /**
   * 缩放等级
   */


  get zoom() {
    var _this$_view4;

    if (!this._view) {
      error(this, `_view未实例无法获取zoom属性`);
    }

    const zoom = this === null || this === void 0 ? void 0 : (_this$_view4 = this._view) === null || _this$_view4 === void 0 ? void 0 : _this$_view4.zoom;
    return zoom;
  } //#endregion
  //#region 构造函数

  /**
   * 构造地图应用实例
   * @param container 地图容器
   * @param options 配置项
   */


  constructor(container, options) {
    super(container, options, {
      viewOptions: {
        center: [0, 0],
        zoom: 1,
        ui: {
          components: []
        },
        constraints: {
          rotationEnabled: false
        },
        popup: {
          autoOpenEnabled: false
        }
      },
      mapOptions: {},
      debug: false,
      debugName: 'fssgEsri'
    });

    _defineProperty(this, "basemap", void 0);

    _defineProperty(this, "mapElement", void 0);

    _defineProperty(this, "mapTools", void 0);

    _defineProperty(this, "mapCursor", void 0);

    _defineProperty(this, "mapLayers", void 0);

    _defineProperty(this, "hawkeye", void 0);

    _defineProperty(this, "layerTree", void 0);

    _defineProperty(this, "_map", void 0);

    _defineProperty(this, "_view", void 0);
  } //#endregion
  //#region 私有方法

  /**
   * 初始化地图
   */


  _initMap() {
    const {
      mapOptions
    } = this.options_;
    const map = new ArcGISMap(mapOptions);
    this._map = Object.assign(map, {
      $owner: this
    });
    return this;
  }
  /**
   * 初始化视图
   */


  _initView() {
    const {
      viewOptions
    } = this.options_;
    const view = new MapView({ ...viewOptions,
      map: this._map,
      container: this.container
    });
    this._view = Object.assign(view, {
      $owner: this
    });
    return this;
  }
  /**
   * 初始化静态资源
   */


  _initAssetsPath() {
    const {
      assetsPath
    } = this.options_;
    assetsPath && (esriConfig.assetsPath = assetsPath);
    return this;
  }
  /**
   * 初始化地图容器样式（移除focus时的边框样式）
   */


  _initRemoveOnlineStyle() {
    document.styleSheets[0].addRule('.esri-view', 'outline: none !important');
    document.styleSheets[0].addRule('.esri-view .esri-view-surface', 'outline: none !important');
    document.styleSheets[0].addRule('.esri-view .esri-view-surface--inset-outline:focus::after', 'outline: none !important');
    return this;
  } //#endregion
  //#region 公有方法

  /**
   * 安装
   */


  mount() {
    this._initAssetsPath()._initMap()._initView()._initRemoveOnlineStyle().fire('loaded');

    return this;
  }
  /**
   * 缩放
   * @param num 缩放值
   * @param options 配置项
   */


  zoomIn(num = 1, options) {
    const zoom = this.zoom;

    this._view.goTo({
      zoom: zoom + Math.round(num)
    }, options);

    return this;
  }
  /**
   * 缩放
   * @param num 缩放值
   * @param options 配置项
   */


  zoomOut(num = 1, options) {
    const zoom = this.zoom;

    this._view.goTo({
      zoom: zoom - Math.round(num)
    }, options);

    return this;
  }
  /**
   * 缩放至
   * @param num 缩放等级
   * @param options 配置项
   */


  zoomTo(zoom, options) {
    this._view.goTo({
      zoom
    }, options);

    return this;
  }
  /**
   * 定位
   * @param xy XY坐标
   * @param zoom 缩放等级
   * @param options 配置项
   */


  locateToXY(xy, zoom, options) {
    const center = createGeometryFactory(this).createPointFromXY(xy);

    if (options !== null && options !== void 0 && options.isZoomAdd && zoom) {
      zoom = this.zoom + zoom;
    }

    this._view.goTo({
      center,
      zoom
    }, options);

    return this;
  }
  /**
   * 定位
   * @param lonLat 经纬度
   * @param zoom 缩放等级
   * @param options 配置项
   */


  locateToLonlat(lonLat, zoom, options) {
    const center = createGeometryFactory(this).createPointFromLonLat(lonLat);

    if (options !== null && options !== void 0 && options.isZoomAdd && zoom) {
      zoom = this.zoom + zoom;
    }

    this._view.goTo({
      center
    }, options);

    return this;
  }
  /**
   * 重置地图应用
   */


  reset() {
    return new Promise(resolve => {
      this._view.destroy();

      this.mount();

      for (const prop in this) {
        if (this[prop] instanceof FssgEsriPlugin) {
          this[prop].installPlugin(this); // eslint-disable-line
        }
      }

      resolve(this);
    });
  }

}

/**
 * 底图控制插件
 */

class Basemap extends FssgEsriPlugin {
  /**
   * 当前底图选中项
   */

  /**
   * 底图可见性
   */

  /**
   * 底图项容器池
   */

  /**
   * 底图可见性
   */
  get visible() {
    return this._visible;
  }
  /**
   * 底图可见性
   */


  set visible(v) {
    if (v === this._visible) {
      return;
    }

    [...this._itemPool.values()].forEach(item => {
      item.forEach(lyr => lyr.visible = v);
    });
    this._visible = v;
    this.fire('changed:visible', {
      visible: v
    });
  }
  /**
   * 当前底图选中项
   */


  get selectedKey() {
    return this._selectedKey;
  }
  /**
   * 当前底图选中项
   */


  set selectedKey(key) {
    if (key === this._selectedKey) {
      return;
    }

    const item = this._itemPool.get(key);

    if (!item) {
      warn(this, `无底图项${key}`);
      return;
    } // eslint-disable-next-line
    // @ts-ignore


    this.map_.basemap.baseLayers = item;
    this._selectedKey = key;
    this.fire('changed:selected-key', {
      selectedKey: key
    });
  }
  /**
   * 构造底图控制插件
   * @param options 配置项
   */


  constructor(options) {
    var _options$items;

    super(options, {
      items: [],
      selectedKey: options === null || options === void 0 ? void 0 : (_options$items = options.items) === null || _options$items === void 0 ? void 0 : _options$items[0].key,
      visible: true
    });

    _defineProperty(this, "_selectedKey", void 0);

    _defineProperty(this, "_visible", void 0);

    _defineProperty(this, "_itemPool", void 0);

    this._itemPool = new Map();
  }
  /**
   * 初始化
   * @returns this
   */


  _init() {
    var _this$options_$items;

    if (!this.map_.basemap) {
      this.map_.basemap = new EsriBasemap();
    }

    (_this$options_$items = this.options_.items) === null || _this$options_$items === void 0 ? void 0 : _this$options_$items.forEach(item => {
      if (item.lyrs) {
        const layers = [];
        item.lyrs.forEach(o => {
          if (o.type === 'webtilelayer') {
            o.props.urlTemplate = o.url;
          } else {
            o.props.url = o.url;
          }

          layers.push(createLayerFactory().createLayer({
            layerType: o.type,
            ...o.props
          }));
        });

        this._itemPool.set(item.key, layers);

        return;
      }

      if (item.type === 'webtilelayer') {
        item.props.urlTemplate = item.url;
      } else {
        item.props.url = item.url;
      }

      const layer = createLayerFactory().createLayer({
        layerType: item.type,
        ...item.props
      });

      if (layer) {
        this._itemPool.set(item.key, [layer]);
      }
    });

    this._createTianDiTu();

    this.visible = !!this.options_.visible;
    this.selectedKey = this.options_.selectedKey ?? '天地图矢量3857';
    return this;
  }
  /**
   * 创建天地图底图项
   * @returns this
   */


  _createTianDiTu() {
    const createTianDiTuItem = (name, proj) => {
      this.createBasemapItem(`天地图${name}${proj}`, createLayerFactory().createWebTileLayer(Basemap[`BASEMAP_TIAN_DI_TU_${proj}`][`${name}底图`]));
      this.createBasemapItem(`天地图${name}含注记${proj}`, [createLayerFactory().createWebTileLayer(Basemap[`BASEMAP_TIAN_DI_TU_${proj}`][`${name}底图`]), createLayerFactory().createWebTileLayer(Basemap[`BASEMAP_TIAN_DI_TU_${proj}`][`${name}注记`])]);
      return createTianDiTuItem;
    };

    createTianDiTuItem('影像', '4326')('矢量', '4326')('地形', '4326')('影像', '3857')('矢量', '3857')('地形', '3857');
    return this;
  }

  installPlugin(fssgEsri) {
    return super.installPlugin(fssgEsri)._init();
  }
  /**
   * 创建底图项
   * @param key 底图项
   * @param arg1 底图图层 or 底图图层数组
   * @returns this
   */


  createBasemapItem(key, arg1) {
    const layers = Array.isArray(arg1) ? arg1 : [arg1];

    this._itemPool.set(key, layers);

    return this;
  }

}

_defineProperty(Basemap, "BASEMAP_TIAN_DI_TU_3857", BASEMAP_TIAN_DI_TU_3857);

_defineProperty(Basemap, "BASEMAP_TIAN_DI_TU_4326", BASEMAP_TIAN_DI_TU_4326);

/**
 * 图元控制插件
 */

class MapElement extends FssgEsriPlugin {
  //#region 私有属性

  /** 基础图元样式 */

  /** 高亮图元样式 */

  /** 基础图元存储图层 */

  /** 高亮图元存储图层 */

  /** 图元图层存储图层组 */
  //#endregion

  /**
   * 构造图元控制插件对象
   * @param options 配置项
   */
  constructor(options) {
    super(options, {
      graphicsSymbol: {
        marker: {
          type: 'simple-marker',
          color: [255, 0, 0, .6],
          style: 'circle',
          size: '14px',
          outline: {
            color: [255, 0, 0],
            width: 1
          }
        },
        line: {
          type: 'simple-line',
          color: [255, 0, 0, .8],
          width: '2px',
          style: 'solid'
        },
        fill: {
          type: 'simple-fill',
          color: [255, 0, 0, .4],
          style: 'solid',
          outline: {
            color: [255, 0, 0],
            width: 1
          }
        }
      },
      highlightSymbol: {
        marker: {
          type: 'simple-marker',
          color: [0, 255, 255, .8],
          style: 'circle',
          size: '14px',
          outline: {
            color: [0, 255, 255],
            width: 1
          }
        },
        line: {
          type: 'simple-line',
          color: [0, 255, 255, .8],
          width: '4px',
          style: 'solid'
        },
        fill: {
          type: 'simple-fill',
          color: [0, 255, 255, .4],
          style: 'solid',
          outline: {
            color: [0, 255, 255],
            width: 4
          }
        }
      }
    });

    _defineProperty(this, "_graphicsSymbol", void 0);

    _defineProperty(this, "_highlightSymbol", void 0);

    _defineProperty(this, "_graphicsLayer", void 0);

    _defineProperty(this, "_highlightLayer", void 0);

    _defineProperty(this, "_groupLayer", void 0);
  }

  _init() {
    this._graphicsSymbol = this.options_.graphicsSymbol ?? {};
    this._highlightSymbol = this.options_.highlightSymbol ?? {};
    this._graphicsLayer = createLayerFactory().createLayer({
      layerType: 'graphicslayer'
    });
    this._highlightLayer = createLayerFactory().createLayer({
      layerType: 'graphicslayer'
    });
    this._groupLayer = createLayerFactory().createLayer({
      layerType: 'grouplayer',
      layers: [this._graphicsLayer, this._highlightLayer]
    });
    this.map_.layers.add(this._groupLayer);
    this.map_.layers.on('after-changes', () => {
      const index = this.map_.layers.indexOf(this._groupLayer);

      if (index !== this.map_.layers.length - 1) {
        this.map_.layers.reorder(this._groupLayer, this.map_.layers.length - 1);
      }
    });
    return this;
  }

  _getSymbol(type, isHighlight) {
    const _symbol = isHighlight ? this._highlightSymbol : this._graphicsSymbol;

    let symbol;

    switch (type) {
      case 'point':
      case 'multipoint':
        symbol = deepCopyJSON(_symbol.marker);
        break;

      case 'polyline':
        symbol = deepCopyJSON(_symbol.line);
        break;

      case 'polygon':
      case 'extent':
        symbol = deepCopyJSON(_symbol.fill);
        break;
      // case 'mesh': // TODO
      //   break

      default:
        warn(this, `类型${type}无法匹配符号`);
        break;
    }

    return symbol ?? {};
  }

  _addGraphics(graphics) {
    this._graphicsLayer.graphics.addMany(graphics);

    return this;
  }

  _addHighlight(graphics) {
    this._highlightLayer.graphics.addMany(graphics);

    return this;
  }

  installPlugin(fssgEsri) {
    return super.installPlugin(fssgEsri)._init();
  }

  add(arg0, arg1) {
    var _arg;

    if (arg0 instanceof Geometry || ((_arg = arg0) === null || _arg === void 0 ? void 0 : _arg[0]) instanceof Geometry) {
      const graphics = [];
      arg0 = arg0;
      arg0 = Array.isArray(arg0) ? arg0 : [arg0];
      arg0.forEach(geometry => {
        arg1 = $extend(true, {}, this._getSymbol(geometry.type), arg1);
        const graphic = new Graphic({
          geometry,
          symbol: arg1
        });
        graphics.push(graphic);
      });

      this._addGraphics(graphics);

      return Array.isArray(arg0) ? graphics : graphics[0];
    } else {
      arg0 = Array.isArray(arg0) ? arg0 : [arg0];
      return this._addGraphics(arg0);
    }
  }

  remove(arg0) {
    arg0 = Array.isArray(arg0) ? arg0 : [arg0];

    this._graphicsLayer.graphics.removeMany(arg0);

    this._highlightLayer.graphics.removeMany(arg0);

    return this;
  }

  clear(withHighlight) {
    this._graphicsLayer.graphics.removeAll();

    withHighlight && this._highlightLayer.graphics.removeAll();
    return this;
  }

  set(arg0, arg1) {
    return this.clear().add(arg0, arg1);
  }

  addHighlight(arg0, arg1) {
    var _arg2;

    if (arg0 instanceof Geometry || ((_arg2 = arg0) === null || _arg2 === void 0 ? void 0 : _arg2[0]) instanceof Geometry) {
      const graphics = [];
      arg0 = arg0;
      arg0 = Array.isArray(arg0) ? arg0 : [arg0];
      arg0.forEach(geometry => {
        arg1 = $extend(true, {}, this._getSymbol(geometry.type, true), arg1);
        const graphic = new Graphic({
          geometry,
          symbol: arg1
        });
        graphics.push(graphic);
      });

      this._addHighlight(graphics);

      return Array.isArray(arg0) ? graphics : graphics[0];
    } else {
      arg0 = Array.isArray(arg0) ? arg0 : [arg0];
      return this._addHighlight(arg0);
    }
  }

  removeHighlight(arg0) {
    arg0 = Array.isArray(arg0) ? arg0 : [arg0];

    this._highlightLayer.graphics.removeMany(arg0);

    return this;
  }

  clearHighlight() {
    this._highlightLayer.graphics.removeAll();

    return this;
  }

  setHighlight(arg0, arg1) {
    return this.clearHighlight().addHighlight(arg0, arg1);
  }

}

/**
 * 基础地图工具类
 */

class FssgEsriBaseTool extends BaseTool {
  //#region 保护属性

  /**
   * 地图对象
   */

  /**
   * 视图对象
   */
  //#endregion
  get $() {
    return this.map_.$owner;
  } //#region 构造函数

  /**
   * 实例化地图地图工具类
   * @param map 地图对象
   * @param view 视图对象
   */


  constructor(map, view, options, defaultOptions) {
    super(options, defaultOptions);

    _defineProperty(this, "map_", void 0);

    _defineProperty(this, "view_", void 0);

    this.map_ = map;
    this.view_ = view;
  }

}

/**
 * 地图工具链
 */

class MapTools extends FssgEsriPlugin {
  /**
   * 工具池
   */

  /**
   * 当前激活工具的Key
   */

  /**
   * 当前激活工具的Key
   */
  get activedKey() {
    return this._activedKey;
  }
  /**
   * 当前激活工具的Key
   */


  set activedKey(key) {
    this._activeTool(key);
  }
  /**
   * 构造地图工具链
   * @param options 配置项
   */


  constructor(options) {
    super(options, {});

    _defineProperty(this, "_toolPool", new Map());

    _defineProperty(this, "_activedKey", 'default');
  }
  /**
   * 初始化
   */


  _init() {
    this._toolPool.set('default', new FssgEsriBaseTool(this.map_, this.view_, {
      isOnceTool: false
    }));

    return this;
  }
  /**
   * 安装插件
   */


  installPlugin(fssgEsri) {
    return super.installPlugin(fssgEsri)._init();
  }
  /**
   * 设置工具
   * @param toolKey 工具Key
   */


  _activeTool(toolKey) {
    const tool = this._toolPool.get(toolKey);

    if (!tool) {
      warn(this, `无工具项${toolKey}`);
      return this;
    }

    if (tool.isOnceTool) {
      this.fire('change', {
        previousKey: this._activedKey,
        currentKey: this._activedKey,
        executeKey: toolKey
      });
      tool.active();
      return this;
    }

    [...this._toolPool.values()].map(t => {
      if (t !== tool) {
        t.deactive();
      }
    });
    this.fire('change', {
      previousKey: this._activedKey,
      currentKey: toolKey,
      executeKey: toolKey
    });
    this._activedKey = toolKey;
    tool.active();
    return this;
  }
  /**
   * 创建自定义工具
   * @param key 工具Key
   * @param tool 工具对象
   */


  createTool(key, tool) {
    if (this.hasTool(key)) {
      warn(this, `工具项${key}已存在，将会被覆盖`);
    }

    this._toolPool.set(key, tool);

    return this;
  }
  /**
   * 检查是否存在工具
   * @param key 工具Key
   */


  hasTool(key) {
    return this._toolPool.has(key);
  }
  /**
   * 移除工具
   * @param key 工具Key
   */


  deleteTool(key) {
    this._toolPool.has(key) && this._toolPool.delete(key);

    if (this._activedKey === key) {
      this._activeTool('default');
    }

    return this;
  }
  /**
   * 获取工具
   * @param key 工具Key
   */


  getTool(key) {
    const tool = this._toolPool.get(key);

    if (tool) {
      return tool;
    }
  }

}

/**
 * 地图鼠标控制插件
 */

class MapCursor extends FssgEsriPlugin {
  /**
   * 鼠标样式
   */

  /**
   * 样式容器池
   */

  /**
   * 鼠标样式
   */
  get cursorType() {
    return this._cursorType;
  }
  /**
   * 鼠标样式
   */


  set cursorType(t) {
    this._setCursor(t);
  }
  /**
   * 构造地图鼠标控制器
   * @param options 配置项
   */


  constructor(options) {
    super(options, {
      items: {}
    });

    _defineProperty(this, "_cursorType", void 0);

    _defineProperty(this, "_typePool", void 0);
  }
  /**
   * 初始化
   */


  _init() {
    this._typePool = new Map();
    Object.entries(MAP_CURSOR_DIC).forEach(([cType, cData]) => this._typePool.set(cType, cData));
    Object.entries(this.options_.items ?? {}).forEach(([cType, cData]) => this._typePool.set(cType, cData));

    this._setCursor('default');

    return this;
  }
  /**
   * 设置鼠标样式
   * @param cursorType 鼠标样式
   */


  _setCursor(cursorType) {
    const cursor = this._typePool.get(cursorType);

    if (!cursor) {
      warn(this, `无鼠标样式项${cursorType}`);
    } else {
      this.fire('change', {
        cursorType
      });
    }

    this.view_.container.style.cursor = cursor ?? 'default';
  }
  /**
   * 安装插件
   */


  installPlugin(fssgEsri) {
    return super.installPlugin(fssgEsri)._init();
  }

}

/**
 * 图层控制插件
 */

class MapLayers extends FssgEsriPlugin {
  /**
   * 图层容器池
   */

  /**
   * 图层容器图层
   */

  /**
   * 可查询的图层集合
   */
  get layersWhichCanQuery() {
    return [...new Set([...this._layerPool.values()])].filter(([_, options]) => options.isQuery);
  }
  /**
   * 不可查询的图层集合
   */


  get layersWhichCantQuery() {
    return [...new Set([...this._layerPool.values()])].filter(([_, options]) => !options.isQuery);
  }
  /**
   * 构造图层控制插件
   * @param options 配置项
   */


  constructor(options) {
    super(options, {
      items: [],
      defaultLayerVisible: true
    });

    _defineProperty(this, "_layerPool", void 0);

    _defineProperty(this, "_group", void 0);
  }
  /**
   * 初始化
   */


  _init() {
    this._layerPool = new Map();
    this._group = createLayerFactory().createGroupLayer();
    this.map_.add(this._group);
    return this._initLayers();
  }
  /**
   * 初始化图层
   */


  _initLayers() {
    var _this$options_$items;

    (_this$options_$items = this.options_.items) === null || _this$options_$items === void 0 ? void 0 : _this$options_$items.forEach(layerOptions => {
      const {
        properties,
        ...others
      } = layerOptions;
      const props = {
        visible: this.options_.defaultLayerVisible,
        ...properties,
        ...others
      };

      if (layerOptions.layerType === 'webtilelayer') {
        props.urlTemplate = layerOptions.layerUrl;
      } else {
        props.url = layerOptions.layerUrl;
      }

      if (layerOptions.layerType === 'sqllayer' || layerOptions.layerType === 'sqllayer2') {
        props.sqlOptions = layerOptions.sqlOptions;
        props.spatialReference = this.view_.spatialReference;
      }

      const layer = createLayerFactory().createLayer(props); // eslint-disable-line

      this._group.add(layer);

      this._layerPool.set(layerOptions.id, [layer, layerOptions]).set(layerOptions.name, [layer, layerOptions]).set(layer, [layer, layerOptions]);

      layer.watch('visible', visible => this.fire('change:visible', {
        visible,
        layer,
        options: layerOptions
      }));
      layer.watch('opacity', opacity => this.fire('change:opacity', {
        opacity,
        layer,
        options: layerOptions
      }));
    });
    return this;
  }
  /**
   * 查找图层项
   * @param key 键
   */


  _findItem(key) {
    const item = this._layerPool.get(key);

    if (!item) {
      throw error(this, `无图层项${key}`);
    }

    return item;
  }
  /**
   * 安装插件
   * @param fssgEsri 地图应用
   */


  installPlugin(fssgEsri) {
    return super.installPlugin(fssgEsri)._init();
  }
  /**
   * 通过图层Id查找图层
   * @param nameOrId 图层名或Id
   */


  findLayer(nameOrId) {
    var _this$_findItem;

    return (_this$_findItem = this._findItem(nameOrId)) === null || _this$_findItem === void 0 ? void 0 : _this$_findItem[0];
  }
  /**
   * 通过图层Id查找配置项
   * @param nameOrIdOrLayer 图层名或Id或图层对象
   */


  findLayerOptions(nameOrIdOrLayer) {
    var _this$_findItem2;

    return (_this$_findItem2 = this._findItem(nameOrIdOrLayer)) === null || _this$_findItem2 === void 0 ? void 0 : _this$_findItem2[1];
  }
  /**
   * 设置图层可见性
   * @param nameOrId 图层名或Id
   * @param visible 可见性，默认为true
   */


  setLayerVisible(nameOrId, visible = true) {
    const layer = this.findLayer(nameOrId);
    layer && (layer.visible = visible);
    return this;
  }
  /**
   * 设置图层不透明度
   * @param nameOrId 图层名或Id
   * @param opacity 不透明度
   */


  setLayerOpacity(nameOrId, opacity) {
    const layer = this.findLayer(nameOrId);
    layer && (layer.opacity = opacity);
    return this;
  }

}

/**
 * 鹰眼插件
 */

class Hawkeye extends FssgEsriPlugin {
  /**
   * 构造鹰眼插件
   * @param options 配置项
   */
  constructor(options) {
    super(options, {
      container: 'hawkeye-container',
      symbol: {
        type: 'simple-fill',
        color: [255, 0, 0, 0.1]
      },
      layers: []
    });

    _defineProperty(this, "_fssgEsri", void 0);

    _defineProperty(this, "_container", void 0);
  }
  /**
   * 初始化
   */


  _init() {
    this._container = this.options_.container;
    this._fssgEsri = new FssgEsri(this._container, $extend(true, {}, this.$.options, this.options_.fssgEsriOptions, {
      debug: false
    })).use(new MapElement({
      graphicsSymbol: {
        fill: this.options_.symbol
      }
    })).use(new MapLayers({
      items: this.options_.layers
    }));
    this.$.when().then(() => whenRightReturn(1000, () => document.getElementById(this._container))).then(() => {
      this._fssgEsri.mount();

      this._initExtentSync();
    });
    return this;
  }
  /**
   * 初始化地图同步
   */


  _initExtentSync() {
    const sourceView = this.$.view;
    const hawkeyeView = this._fssgEsri.view;
    Promise.all([sourceView.when, hawkeyeView.when]).then(() => {
      this._fssgEsri.mapElement.set(sourceView.extent); //禁止移动地图


      hawkeyeView.on('drag', event => {
        event.stopPropagation();
      });
      hawkeyeView.on('mouse-wheel', event => {
        event.stopPropagation();
      }); // 动态主图绘制范围

      sourceView.watch(['zoom', 'center'], throttle(() => {
        this._fssgEsri.mapElement.set(sourceView.extent);
      }, 200));
    });
    return this;
  }
  /**
   * 安装插件
   * @param fssgEsri 地图应用
   */


  installPlugin(fssgEsri) {
    return super.installPlugin(fssgEsri)._init();
  }

}

class LayerTree extends FssgEsriPlugin {
  //#region 私有属性

  /**
  * 图层树列表
  */

  /**
  * 图层树
  */

  /**
  * 选中的树节点Id
  */
  //#endregion
  //#region getter setter

  /**
  * 图层树列表
  */
  get list() {
    return this._list;
  }
  /**
  * 图层树
  */


  get tree() {
    return this._tree;
  }
  /**
  * 选中的树节点Id
  */


  get checkedIds() {
    return this._checkedIds;
  } //#endregion

  /**
   * 构造图层树插件实例
   * @param options 配置项
   */


  constructor(options = {}) {
    super(options, {
      items: []
    });

    _defineProperty(this, "_list", void 0);

    _defineProperty(this, "_tree", void 0);

    _defineProperty(this, "_checkedIds", void 0);

    this._list = options.items ?? [];
    this._tree = listToTree(this._list);
    this._checkedIds = [];
  } //#region 私有方法

  /**
   * 设置树节点选中状态
   * @param node 树节点
   * @param checked 选中状态
   * @returns this
   */


  _setNodeChecked(node, checked) {
    var _node$associatedLayer;

    if (!node.layerId) {
      return this;
    }

    const layer = this.$.mapLayers.findLayer(node.layerId);
    layer && (layer.visible = checked);
    (_node$associatedLayer = node.associatedLayerIds) === null || _node$associatedLayer === void 0 ? void 0 : _node$associatedLayer.forEach(id => {
      const layer = this.$.mapLayers.findLayer(id);
      layer && (layer.visible = checked);
    });
    return this.fire('change:checked', {
      node,
      checked
    });
  }
  /**
   * 初始化
   */


  _init() {
    this.$.mapLayers.when().then(() => {
      this._list.forEach(item => {
        this._setNodeChecked(item, item.defaultChecked);

        item.defaultChecked && this._checkedIds.push(item.id);
      });
    }); // this.on('change:checked', e => {
    // })

    return this;
  } //#endregion
  //#region 公有方法

  /**
   * 安装插件
   * @param fssgEsri 地图应用
   * @returns this
   */


  installPlugin(fssgEsri) {
    return super.installPlugin(fssgEsri)._init().fire('loaded');
  }
  /**
   * 通过树节点Id查找图层
   * @param nodeId 树节点Id
   * @returns 图层
   */


  findLayerFromNodeId(nodeId) {
    var _this$_list$find;

    const layerId = (_this$_list$find = this._list.find(item => item.id === nodeId)) === null || _this$_list$find === void 0 ? void 0 : _this$_list$find.layerId;

    if (layerId) {
      return this.$.mapLayers.findLayer(layerId);
    }
  }
  /**
   * 通过树节点Id查找树节点
   * @param nodeId 树节点Id
   * @returns 树节点
   */


  findNodeFromNodeId(nodeId) {
    return this._list.find(item => item.id === nodeId);
  }
  /**
   * 通过树节点名称查找树节点
   * @param nodeName 树节点名称
   * @returns 树节点
   */


  findNodeFromNodeName(nodeName) {
    return this._list.find(item => item.name === nodeName);
  }
  /**
   * 通过图层Id查找树节点
   * @param layerId 图层Id
   * @returns 树节点
   */


  findNodeFromLayerId(layerId) {
    for (let i = 0; i < this._list.length; i++) {
      const item = this._list[i];

      if (item.layerId === layerId) {
        return item;
      }
    }
  }
  /**
   * 设置树节点选中状态
   * @param nodeId 树节点Id
   * @param checked 选中状态
   * @returns this
   */


  setNodeCheckById(nodeId, checked) {
    const node = this.findNodeFromNodeId(nodeId);
    node && this._setNodeChecked(node, checked);
    return this;
  }
  /**
   * 设置树节点选中状态
   * @param nodeName 树节点名称
   * @param checked 选中状态
   * @returns this
   */


  setNodeCheckByName(nodeName, check) {
    const node = this.findNodeFromNodeName(nodeName);
    node && this._setNodeChecked(node, check);
    return this;
  }

}

export { Basemap, FssgEsri, FssgEsriPlugin, GeometryFacory, Hawkeye, LayerTree, MapCursor, MapElement, MapLayers, MapTools, createGeometryFactory, createLayerFactory };
