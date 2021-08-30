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
import Draw from '@arcgis/core/views/draw/Draw';
import { planarLength, planarArea, buffer } from '@arcgis/core/geometry/geometryEngineAsync';

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
  /**
   * 创建贝塞尔曲线（二阶） Second-order
   * @param pt1 点1
   * @param pt2 点2
   */


  createBezierCurve(pt1, pt2) {
    const xys = [];
    const [x1, y1] = [pt1.x, pt1.y];
    const [x2, y2] = [pt2.x, pt2.y];
    const cx = x1 + (x2 - x1) / 2;
    const cy = y2;
    let t = 0;
    const num = 100;

    for (let i = 1; i < num + 1; i++) {
      //用i当作t，算出点坐标，放入数组
      t = i / num;
      const x = Math.pow(1 - t, 2) * x1 + 2 * t * (1 - t) * cx + Math.pow(t, 2) * x2;
      const y = Math.pow(1 - t, 2) * y1 + 2 * t * (1 - t) * cy + Math.pow(t, 2) * y2;
      xys.push([x, y]);
    }

    return this.createPolylineFromXYs(xys);
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

    _defineProperty(this, "mapModules", void 0);

    _defineProperty(this, "mouseTips", void 0);

    _defineProperty(this, "overlays", void 0);

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
  //#region getter
  get graphicsLayer() {
    return this._graphicsLayer;
  }

  get highlightLayer() {
    return this._highlightLayer;
  } //#endregion

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
      const geometries = Array.isArray(arg0) ? arg0 : [arg0];
      geometries.forEach(geometry => {
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
      const geometries = Array.isArray(arg0) ? arg0 : [arg0];
      geometries.forEach(geometry => {
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
 * 缩放至起始位置工具
 */

class ZoomHomeTool extends FssgEsriBaseTool {
  /**
   * 起始位置
   */

  /**
   * 构造缩放至起始位置工具
   * @param map 地图
   * @param view 视图
   * @param options 配置项
   * @param defaultOptions 默认配置项
   */
  constructor(map, view, options, defaultOptions) {
    super(map, view, options, defaultOptions);

    _defineProperty(this, "home", void 0);

    view.when().then(() => this.home = view.extent);
  }
  /**
   * 工具激活时触发
   */


  onToolActived_(e) {
    if (!super.onToolActived_(e)) {
      return false;
    }

    if (!this.home) {
      warn(this, '无定位范围');
      return true;
    }

    this.view_.goTo(this.home);
    return true;
  }

}

class DrawTool extends FssgEsriBaseTool {
  //#region 私有属性

  /** 绘制图元存储容器 */

  /** 绘制过程图元 */

  /** 绘制时样式 */

  /** 绘制完成样式 */
  //#endregion
  //#region 保护属性

  /** 绘图对象 */

  /** 绘制任务对象 */

  /** 绘图类型 */

  /** 绘制目标是否仅允许存在一个 */
  //#endregion
  //#region 构造函数

  /**
   * 构造绘图工具对象
   * @param map 地图对象
   * @param view 视图对象
   */
  constructor(map, view, options) {
    super(map, view, options, {
      cursorType: 'draw',
      isOnceTool: false
    });

    _defineProperty(this, "_graphics", new Set());

    _defineProperty(this, "_tempGraphic", void 0);

    _defineProperty(this, "_drawingStyle", {
      marker: {
        color: [255, 0, 0, .3],
        size: 12,
        outline: {
          color: [255, 0, 0, .5]
        }
      },
      line: {
        color: [255, 0, 0, .3]
      },
      fill: {
        color: [255, 0, 0, .3],
        outline: {
          color: [255, 0, 0, .5]
        }
      }
    });

    _defineProperty(this, "_drawedStyle", {
      marker: {
        color: [255, 0, 0, .5],
        size: 12,
        outline: {
          color: [255, 0, 0, 1]
        }
      },
      line: {
        color: [255, 0, 0, 1]
      },
      fill: {
        color: [255, 0, 0, .5],
        outline: {
          color: [255, 0, 0, 1]
        }
      }
    });

    _defineProperty(this, "draw_", void 0);

    _defineProperty(this, "action_", void 0);

    _defineProperty(this, "drawType_", void 0);

    _defineProperty(this, "cursorType_", void 0);

    _defineProperty(this, "onlyOneGraphic_", void 0);

    this.draw_ = new Draw({
      view
    });
    this.drawType_ = this.options_.drawType;
    this.onlyOneGraphic_ = !!this.options_.onlyOneGraphic;
    this.cursorType_ = this.options_.cursorType ?? 'default';
    this.on('draw-start', e => this.onDrawStart_(e));
    this.on('draw-move', e => this.onDrawMove_(e));
    this.on('draw-end', e => this.onDrawEnd_(e));
  } //#endregion
  //#region 私有方法


  _matchStyle(geometry, symbolOptions) {
    const type = geometry.type;

    switch (type) {
      case 'point':
      case 'multipoint':
        return symbolOptions.marker ?? {};

      case 'polyline':
        return symbolOptions.line ?? {};

      case 'polygon':
      case 'extent':
        return symbolOptions.fill ?? {};

      default:
        return {};
    }
  } //#endregion
  //#region 保护方法

  /**
   * 初始化任务
   */


  initAction_() {
    var _this$action_;

    (_this$action_ = this.action_) === null || _this$action_ === void 0 ? void 0 : _this$action_.destroy();
    return this;
  }
  /**
   * 工具激活处理事件
   */


  onToolActived_(e) {
    if (!super.onToolActived_(e)) {
      return false;
    }

    const {
      mapElement,
      mapCursor
    } = this.$;

    if (!mapElement) {
      // TODO
      return false;
    }

    mapCursor.cursorType = this.cursorType_;
    this.initAction_();
    return true;
  }
  /**
   * 工具失活处理事件
   */


  onToolDeactived_(e) {
    if (!super.onToolDeactived_(e)) {
      return false;
    }

    this.action_.destroy();
    this.draw_.destroy();
    const {
      mapElement
    } = this.map_.$owner;

    if (!mapElement) {
      return false;
    }

    this._tempGraphic && mapElement.remove(this._tempGraphic);
    this._tempGraphic = null;
    const {
      mapCursor
    } = this.$;
    mapCursor.cursorType = 'default';
    return true;
  }
  /**
   * 工具绘制开始处理事件
   */


  onDrawStart_(e) {
    if (!this.actived) {
      return false;
    }

    const {
      x,
      y
    } = e;
    return new Point({
      x,
      y,
      spatialReference: this.view_.spatialReference
    });
  }
  /**
   * 工具绘制过程处理事件
   */


  onDrawMove_(e) {
    if (!this.actived) {
      return false;
    }

    const {
      mapElement
    } = this.map_.$owner;

    if (!mapElement) {
      return false;
    }

    this._tempGraphic && mapElement.remove(this._tempGraphic);
    this._tempGraphic = mapElement.add(e.geometry, this._matchStyle(e.geometry, this._drawingStyle));
    return this._tempGraphic;
  }
  /**
   * 工具绘制完成处理事件
   */


  onDrawEnd_(e) {
    if (!this.actived) {
      return false;
    }

    const {
      mapElement
    } = this.map_.$owner;

    if (!mapElement) {
      return false;
    }

    this._tempGraphic && mapElement.remove(this._tempGraphic);
    this._tempGraphic = null;
    let graphic;

    if (this.onlyOneGraphic_) {
      graphic = mapElement.set(e.geometry, this._matchStyle(e.geometry, this._drawedStyle));

      this._graphics.clear();
    } else {
      graphic = mapElement.add(e.geometry, this._matchStyle(e.geometry, this._drawedStyle));
    }

    this._graphics.add(graphic);

    this.initAction_();
    return graphic;
  } //#endregion
  //#region 公有方法

  /**
   *清理绘制过的图元
   */


  clearDrawed() {
    const {
      mapElement
    } = this.map_.$owner;

    if (!mapElement) {
      return this;
    }

    mapElement.remove([...this._graphics]);

    this._graphics.clear();

    return this;
  }
  /**
   * 设置绘制完成图元样式
   */


  setDrawedStyle(style) {
    $extend(true, this._drawedStyle, style);
    return this;
  }
  /**
   * 设置绘制时图元样式
   */


  setDrawingStyle(style) {
    $extend(true, this._drawingStyle, style);
    return this;
  }

}

class DrawPointTool extends DrawTool {
  constructor(map, view, onlyOneGraphic = false) {
    super(map, view, {
      drawType: 'point',
      onlyOneGraphic,
      cursorType: 'draw-point'
    });

    _defineProperty(this, "_pointerMoveHandler", void 0);
  }

  initAction_() {
    super.initAction_();
    this.action_ = this.draw_.create('point');
    this.action_.on('draw-complete', e => {
      const [x, y] = e.coordinates;
      this.fire('draw-start', {
        x,
        y
      });
      const geometry = new Point({
        x,
        y,
        spatialReference: this.view_.spatialReference
      });
      this.fire('draw-end', {
        geometry
      });
    });
    this._pointerMoveHandler = this.view_.on('pointer-move', e => {
      const geometry = this.view_.toMap(e);
      this.fire('draw-move', {
        geometry
      });
    });
    return this;
  }

  onToolDeactived_(e) {
    if (!super.onToolDeactived_(e)) {
      return false;
    }

    this._pointerMoveHandler.remove();

    return true;
  }

}

class DrawPolygonTool extends DrawTool {
  constructor(map, view, options) {
    super(map, view, { ...options,
      drawType: 'polygon',
      cursorType: 'draw-polygon'
    });
  }

  initAction_() {
    this.action_ = this.draw_.create('polygon');
    this.action_.on(['vertex-add', 'cursor-update', 'vertex-remove'], e => {
      const rings = e.vertices;

      if (rings.length === 1) {
        e.type === 'vertex-add' && this.fire('draw-start', {
          x: rings[0][0][0],
          y: rings[0][0][1]
        });
        return;
      }

      const geometry = new Polygon({
        rings,
        spatialReference: this.view_.spatialReference
      });
      this.fire('draw-move', {
        geometry
      });
    });
    this.action_.on('draw-complete', e => {
      const rings = e.vertices;
      const geometry = new Polygon({
        rings,
        spatialReference: this.view_.spatialReference
      });
      this.fire('draw-end', {
        geometry
      });
    });
    return this;
  }

}

class DrawPolylineTool extends DrawTool {
  constructor(map, view, onlyOneGraphic = false) {
    super(map, view, {
      drawType: 'polyline',
      onlyOneGraphic,
      cursorType: 'draw-line'
    });
  }

  initAction_() {
    this.action_ = this.draw_.create('polyline');
    this.action_.on(['vertex-add', 'cursor-update', 'vertex-remove'], e => {
      const paths = e.vertices;

      if (paths.length === 1) {
        e.type === 'vertex-add' && this.fire('draw-start', {
          x: paths[0][0],
          y: paths[0][1]
        });
        return;
      }

      const geometry = new Polyline({
        paths,
        spatialReference: this.view_.spatialReference
      });
      this.fire('draw-move', {
        geometry
      });
    });
    this.action_.on('draw-complete', e => {
      const paths = e.vertices;
      const geometry = new Polyline({
        paths,
        spatialReference: this.view_.spatialReference
      });
      this.fire('draw-end', {
        geometry
      });
    });
    return this;
  }

}

class MeasureCoordinateTool extends DrawPointTool {
  constructor(map, view) {
    super(map, view);

    _defineProperty(this, "_overlayIds", void 0);

    this._overlayIds = new Set();
  }

  onDrawMove_(e) {
    const graphic = super.onDrawMove_(e);

    if (!graphic) {
      return false;
    }

    const point = graphic.geometry;
    this.view_.$owner.mouseTips.showTips(`x: ${point.x.toFixed(3)}<br>y: ${point.y.toFixed(3)}`);
    return graphic;
  }

  onToolDeactived_(e) {
    if (!super.onToolDeactived_(e)) {
      return false;
    }

    this.view_.$owner.mouseTips.cancelTips();
    return true;
  }

  onDrawEnd_(e) {
    const graphic = super.onDrawEnd_(e);

    if (!graphic) {
      return false;
    }

    const point = graphic.geometry;
    const id = this.view_.$owner.overlays.add({
      point,
      content: `x: ${point.x.toFixed(3)}<br>y: ${point.y.toFixed(3)}`,
      offsetX: 0,
      offsetY: 0,
      showBezierCurve: true
    });

    this._overlayIds.add(id);

    return graphic;
  }

  clearMeasure() {
    this._overlayIds.forEach(id => {
      this.view_.$owner.overlays.removeById(id);
    });

    return this.clearDrawed();
  }

}

class MeasureLengthTool extends DrawPolylineTool {
  constructor(map, view) {
    super(map, view);

    _defineProperty(this, "_overlayIds", void 0);

    _defineProperty(this, "unit", void 0);

    _defineProperty(this, "fixedCount", void 0);

    _defineProperty(this, "_unitStrDic", {
      'kilometers': 'km',
      'feet': 'feet',
      'meters': 'm',
      'miles': 'miles',
      'nautical-miles': 'nautical-miles',
      'yards': 'yards'
    });

    this._overlayIds = new Set();
    this.fixedCount = 3;
    this.unit = 'kilometers';
  }

  onDrawMove_(e) {
    const graphic = super.onDrawMove_(e);

    if (!graphic) {
      return false;
    }

    const line = graphic.geometry;
    planarLength(line, this.unit).then(length => {
      this.view_.$owner.mouseTips.showTips(`长度：${length.toFixed(this.fixedCount)}${this._unitStrDic[this.unit]}`);
    });
    return graphic;
  }

  onToolDeactived_(e) {
    if (!super.onToolDeactived_(e)) {
      return false;
    }

    this.view_.$owner.mouseTips.cancelTips();
    return true;
  }

  onDrawEnd_(e) {
    const graphic = super.onDrawEnd_(e);

    if (!graphic) {
      return false;
    }

    const line = graphic.geometry;
    planarLength(line, this.unit).then(length => {
      const id = this.view_.$owner.overlays.add({
        point: line.extent.center,
        content: `长度：${length.toFixed(this.fixedCount)}${this._unitStrDic[this.unit]}`
      });

      this._overlayIds.add(id);
    });
    this.view_.$owner.mouseTips.cancelTips();
    return graphic;
  }

  clearMeasure() {
    this._overlayIds.forEach(id => {
      this.view_.$owner.overlays.removeById(id);
    });

    return this.clearDrawed();
  }

}

class MeasureAreaTool extends DrawPolygonTool {
  constructor(map, view) {
    super(map, view);

    _defineProperty(this, "_overlayIds", void 0);

    _defineProperty(this, "unit", void 0);

    _defineProperty(this, "fixedCount", void 0);

    _defineProperty(this, "_unitStrDic", {
      'acres': 'acres',
      'ares': 'ares',
      'hectares': 'hectares',
      'square-feet': 'square-feet',
      'square-kilometers': 'km²',
      'square-meters': 'm²',
      'square-miles': 'square-miles',
      'square-yards': 'square-yards'
    });

    this._overlayIds = new Set();
    this.fixedCount = 3;
    this.unit = 'square-kilometers';
  }

  onDrawMove_(e) {
    const graphic = super.onDrawMove_(e);

    if (!graphic) {
      return false;
    }

    const polygon = graphic.geometry;
    planarArea(polygon, this.unit).then(area => {
      area = Math.abs(area);
      this.view_.$owner.mouseTips.showTips(`面积：${area.toFixed(this.fixedCount)}${this._unitStrDic[this.unit]}`);
    });
    return graphic;
  }

  onToolDeactived_(e) {
    if (!super.onToolDeactived_(e)) {
      return false;
    }

    this.view_.$owner.mouseTips.cancelTips();
    return true;
  }

  onDrawEnd_(e) {
    const graphic = super.onDrawEnd_(e);

    if (!graphic) {
      return false;
    }

    const polygon = graphic.geometry;
    planarArea(polygon, this.unit).then(area => {
      area = Math.abs(area);
      const id = this.view_.$owner.overlays.add({
        point: polygon.extent.center,
        content: `面积：${area.toFixed(this.fixedCount)}${this._unitStrDic[this.unit]}`
      });

      this._overlayIds.add(id);
    });
    this.view_.$owner.mouseTips.cancelTips();
    return graphic;
  }

  clearMeasure() {
    this._overlayIds.forEach(id => {
      this.view_.$owner.overlays.removeById(id);
    });

    return this.clearDrawed();
  }

}

class HitTestTool extends DrawPointTool {
  //#region 静态方法
  static getAttributesFromGraphic(graphic) {
    return Object.entries(graphic.attributes).map(([name, value]) => ({
      name,
      value
    }));
  }

  static parseAttributesFromArcGISServer(attributes, graphic) {
    let layer = graphic.layer ?? graphic.sourceLayer; // eslint-disable-line

    const fieldsSelf = layer === null || layer === void 0 ? void 0 : layer.fields; // ArcGIS内置字段配置信息

    if (fieldsSelf) {
      fieldsSelf.forEach(field => {
        const item = attributes.find(v => v.name === field.name);
        item && (item.alias = field.alias);
      });
    }

    return attributes;
  }

  static parseAttributesFromCustomConfig(attributes, graphic, attributesConfig) {
    let layer = graphic.layer ?? graphic.sourceLayer; // eslint-disable-line

    const name = layer.name ?? layer.layer.name; // eslint-disable-line

    const attr = attributesConfig.find(item => item.layerName === name);

    if (attr) {
      var _attr$fields;

      attr.exclude && (attributes = attributes.filter(item => {
        var _attr$exclude;

        return !((_attr$exclude = attr.exclude) !== null && _attr$exclude !== void 0 && _attr$exclude.includes(item.name));
      }));
      (_attr$fields = attr.fields) === null || _attr$fields === void 0 ? void 0 : _attr$fields.forEach(field => {
        const item = attributes.find(v => v.name === field.name);

        if (item) {
          item.alias = field.alias;
          item.type = field.type;
        }
      });
    }

    return attributes;
  } //#endregion


  constructor(map, view) {
    super(map, view);
    this.cursorType_ = 'help';
    this.setDrawingStyle({
      marker: {
        size: 0
      }
    });
  }

  async _queryWithMapImageLayer(geometry) {
    const fssgMap = this.$;
    const ret = [];
    await fssgMap.mapLayers.forEach(async ([layer, options]) => {
      if (!['mapimagelayer', 'dynaimclayer'].includes(options.layerType)) {
        return;
      }

      if (!options.isQuery) {
        return;
      }

      if (!layer.visible) {
        return;
      }

      const sublayer = layer.sublayers.getItemAt(0);
      const screenPoint = this.view_.toScreen(geometry);
      screenPoint.x += 10;
      const point = this.view_.toMap(screenPoint);
      const bufferDistance = Math.abs(geometry.x - point.x);
      const polygon = await buffer(geometry, bufferDistance, 'meters');
      const {
        features
      } = await sublayer.queryFeatures({
        geometry: Array.isArray(polygon) ? polygon[0] : polygon,
        returnGeometry: true,
        // distance: 10000,
        outFields: ['*']
      });

      if (features.length > 0) {
        ret.push(...features);
      }
    });
    return ret;
  } //#region 保护方法


  onDrawEnd_(e) {
    const graphic = super.onDrawEnd_(e);

    if (!graphic) {
      return false;
    }

    this.clearDrawed();
    const point = graphic.geometry;
    const screen = this.view_.toScreen(point);
    const {
      mapElement,
      mapLayers
    } = this.$;
    Promise.all([this._queryWithMapImageLayer(point), this.view_.hitTest(screen, {
      exclude: [mapElement.graphicsLayer, mapElement.highlightLayer, ...mapLayers.layersWhichCantQuery.map(([layer]) => layer)]
    })]).then(([queryResult, hitTestResult]) => {
      var _hitTestResult$result, _hitTestResult$result2;

      const mapPoint = (_hitTestResult$result = hitTestResult.results) === null || _hitTestResult$result === void 0 ? void 0 : (_hitTestResult$result2 = _hitTestResult$result[0]) === null || _hitTestResult$result2 === void 0 ? void 0 : _hitTestResult$result2.mapPoint;
      queryResult.forEach(graphic => {
        hitTestResult.results.push({
          graphic,
          mapPoint
        });
      });
      this.finsheHitTest_(hitTestResult);
    });

    this._queryWithMapImageLayer(point);

    return graphic;
  }

  finsheHitTest_(result) {
    this.fire('finshed', {
      results: result.results
    });
    return result.results;
  }

}

class ClearTool extends FssgEsriBaseTool {
  //#region 构造函数

  /**
   * 构造比例放大工具对象
   * @param map 地图对象
   * @param view 视图对象
   */
  constructor(map, view) {
    super(map, view, {
      isOnceTool: true
    });
  } //#endregion
  //#region 保护方法


  onToolActived_(e) {
    if (!super.onToolActived_(e)) {
      return false;
    }

    const {
      mapElement,
      overlays,
      mouseTips
    } = this.$;

    if (mapElement) {
      mapElement.clear(true);
    }

    if (overlays) {
      overlays.clear();
    }

    if (mouseTips) {
      mouseTips.cancelTips();
    }

    return true;
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
    })).set('zoom-home', new ZoomHomeTool(this.map_, this.view_)).set('draw-point', new DrawPointTool(this.map_, this.view_)).set('draw-polyline', new DrawPolylineTool(this.map_, this.view_)).set('draw-polygon', new DrawPolygonTool(this.map_, this.view_)).set('clear', new ClearTool(this.map_, this.view_)).set('measure-coordinate', new MeasureCoordinateTool(this.map_, this.view_)).set('measure-length', new MeasureLengthTool(this.map_, this.view_)).set('measure-area', new MeasureAreaTool(this.map_, this.view_)).set('hit-test', new HitTestTool(this.map_, this.view_));

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

  async forEach(callback) {
    const values = [...this._layerPool.values()];

    for (let i = 0; i < values.length; i++) {
      await callback(values[i]);
    }

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

        hawkeyeView.goTo({
          zoom: sourceView.zoom - 4,
          center: sourceView.center
        }, {
          duration: 100
        });
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

/**
 * 地图模块控制插件
 */

class MapModules extends FssgEsriPlugin {
  //#region 私有属性

  /**
   * 地图模块集合
   */
  //#endregion
  //#region getter setter

  /**
  * 地图模块集合
  */
  get items() {
    return this._items;
  }

  get selectedTitle() {
    return this._selectedTitle;
  }

  set selectedTitle(title) {
    this.selectByTitle(title);
  } //#endregion
  //#region 构造函数

  /**
  * 构造地图模块插件实例
  * @param options 配置项
  */


  constructor(options = {}) {
    super(options, {
      items: []
    });

    _defineProperty(this, "_items", void 0);

    _defineProperty(this, "_selectedTitle", void 0);

    this._items = this.options_.items ?? [];
    this._selectedTitle = this.options_.defaultSelectedTitle ?? '';
  } //#endregion
  //#region 公有方法

  /**
  * 选择地图模块
  * @param moduleId 模块Id
  * @returns this
  */


  selectById(moduleId) {
    let item;
    this._selectedTitle = '';

    this._items.forEach(module => {
      if (moduleId === module.id) {
        this._selectedTitle = module.title;
        item = module;
        module.treeNodeIds.forEach(nodeId => {
          this.$.layerTree.setNodeCheckById(nodeId, true);
        });
      } else {
        module.treeNodeIds.forEach(nodeId => {
          this.$.layerTree.setNodeCheckById(nodeId, false);
        });
      }
    });

    this.fire('change:selected', {
      item
    });
    return this;
  }
  /**
  * 选择地图模块
  * @param moduleTitle 模块名称
  * @returns this
  */


  selectByTitle(moduleTitle) {
    let item;
    this._selectedTitle = '';

    this._items.forEach(module => {
      if (moduleTitle === module.title) {
        this._selectedTitle = module.title;
        item = module;
        module.treeNodeIds.forEach(nodeId => {
          this.$.layerTree.setNodeCheckById(nodeId, true);
        });
      } else {
        module.treeNodeIds.forEach(nodeId => {
          this.$.layerTree.setNodeCheckById(nodeId, false);
        });
      }
    });

    this.fire('change:selected', {
      item
    });
    return this;
  }

}

class MouseTips extends FssgEsriPlugin {
  constructor(options) {
    super(options, {});

    _defineProperty(this, "_handlers", void 0);

    _defineProperty(this, "_tipsDom", void 0);
  }

  _init() {
    this._handlers = new Set();
    return this;
  }

  installPlugin(fssgEsri) {
    return super.installPlugin(fssgEsri)._init();
  }

  showTips(tips) {
    if (!this._tipsDom) {
      this._tipsDom = document.createElement('div');

      this._tipsDom.classList.add('fssg-mouse-tips');

      this._tipsDom.style.position = 'absolute';
      this._tipsDom.style.padding = '4px 8px';
      this._tipsDom.style.backgroundColor = '#00000085';
      this._tipsDom.style.color = '#fff';
      this._tipsDom.style.boxShadow = '0 1px 4px rgb(0 0 0 / 80%)';
      this.view_.container.append(this._tipsDom);
    }

    this._handlers.forEach(item => item.remove());

    this._handlers.clear();

    this._tipsDom.innerHTML = tips;
    const pointerMouveHandler = this.view_.on('pointer-move', throttle(e => {
      this._tipsDom.style.top = `${e.y + 16}px`;
      this._tipsDom.style.left = `${e.x + 16}px`;
    }, 100));

    this._handlers.add(pointerMouveHandler);

    const pointerLeaveHandler = this.view_.on('pointer-leave', () => {
      this._tipsDom.style.display = 'none';
    });

    this._handlers.add(pointerLeaveHandler);

    const pointerEnter = this.view_.on('pointer-enter', () => {
      this._tipsDom.style.display = 'block';
    });

    this._handlers.add(pointerEnter);

    return this;
  }

  cancelTips() {
    var _this$_tipsDom, _this$_tipsDom$remove;

    (_this$_tipsDom = this._tipsDom) === null || _this$_tipsDom === void 0 ? void 0 : (_this$_tipsDom$remove = _this$_tipsDom.remove) === null || _this$_tipsDom$remove === void 0 ? void 0 : _this$_tipsDom$remove.call(_this$_tipsDom); // eslint-disable-next-line
    // @ts-ignore

    this._tipsDom = null;

    this._handlers.forEach(item => item.remove());

    this._handlers.clear();

    return this;
  }

}

class Overlays extends FssgEsriPlugin {
  constructor(options) {
    super(options, {});

    _defineProperty(this, "_overlayPool", void 0);

    _defineProperty(this, "_overlayContainer", void 0);
  }

  _init() {
    this._overlayContainer = document.createElement('div');

    this._overlayContainer.classList.add('fssg-overlay-container');

    this._overlayContainer.style.height = '100%';
    this._overlayContainer.style.width = '100%';
    this._overlayContainer.style.top = '0';
    this._overlayContainer.style.left = '0';
    this._overlayContainer.style.position = 'absolute';
    this._overlayContainer.style.pointerEvents = 'none';
    this._overlayContainer.style.overflow = 'hidden';
    this.view_.container.append(this._overlayContainer);
    this._overlayPool = new Map();
    this.view_.when().then(() => {
      this.view_.watch('extent', throttle(() => {
        [...this._overlayPool.values()].forEach(item => {
          const screenPt = this.view_.toScreen(item.mapXY);
          item.container.style.top = `${screenPt.y + item.offsetY}px`;
          item.container.style.left = `${screenPt.x + item.offsetX}px`;
          const mapPt = this.view_.toMap({
            x: screenPt.x + (item.offsetX ?? 0),
            y: screenPt.y + (item.offsetY ?? 0)
          });

          if (item.bezierCurve) {
            item.bezierCurve && this.view_.$owner.mapElement.remove(item.bezierCurve);
            item.bezierCurve = this.view_.$owner.mapElement.add(createGeometryFactory(this.$).createBezierCurve(item.mapXY, mapPt), item.bezierCurveSymbol);
          }
        });
      }, 200));
    });
    return this;
  }

  installPlugin(fssgEsri) {
    return super.installPlugin(fssgEsri)._init().fire('loaded');
  }

  add(options) {
    const overlay = document.createElement('div');
    overlay.classList.add('fssg-overlay');
    overlay.style.position = 'absolute';
    overlay.style.padding = '4px 8px';
    overlay.style.backgroundColor = '#00000085';
    overlay.style.color = '#fff';
    overlay.style.boxShadow = '0 1px 4px rgb(0 0 0 / 80%)';
    overlay.style.width = 'fit-content';
    overlay.style.pointerEvents = 'all';
    overlay.style.transition = 'all .1s ease-in-out';
    typeof options.content === 'string' ? overlay.innerHTML = options.content : overlay.append(options.content);
    const screenPt = this.view_.toScreen(options.point);
    overlay.style.top = `${screenPt.y + (options.offsetY ?? 0)}px`;
    overlay.style.left = `${screenPt.x + (options.offsetX ?? 0)}px`;
    const mapPt = this.view_.toMap({
      x: screenPt.x + (options.offsetX ?? 0),
      y: screenPt.y + (options.offsetY ?? 0)
    });
    let bezierCurve = undefined;

    if (options.showBezierCurve) {
      bezierCurve = this.view_.$owner.mapElement.add(createGeometryFactory(this.$).createBezierCurve(options.point, mapPt), options.bezierCurveSymbol);
    }

    const id = createGuid();
    overlay.id = id;

    this._overlayPool.set(id, {
      container: overlay,
      mapXY: options.point,
      offsetX: options.offsetX ?? 0,
      offsetY: options.offsetY ?? 0,
      bezierCurve: bezierCurve,
      bezierCurveSymbol: options.bezierCurveSymbol
    });

    this._overlayContainer.append(overlay);

    return id;
  }

  removeById(id) {
    const item = this._overlayPool.get(id);

    if (item) {
      item.container.remove();
      item.bezierCurve && this.view_.$owner.mapElement.remove(item.bezierCurve);

      this._overlayPool.delete(id);
    }

    return this;
  }

  clear() {
    [...this._overlayPool.values()].forEach(item => {
      item.container.remove();
      item.bezierCurve && this.view_.$owner.mapElement.remove(item.bezierCurve);
    });

    this._overlayPool.clear();

    return this;
  }

}

export { Basemap, DrawPointTool, DrawPolygonTool, DrawPolylineTool, FssgEsri, FssgEsriPlugin, GeometryFacory, Hawkeye, HitTestTool, LayerTree, MapCursor, MapElement, MapLayers, MapModules, MapTools, MeasureAreaTool, MeasureCoordinateTool, MeasureLengthTool, MouseTips, Overlays, ZoomHomeTool, createGeometryFactory, createLayerFactory };
