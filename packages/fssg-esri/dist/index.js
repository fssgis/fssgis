import { FssgMap, error, FssgMapPlugin, warn, BASEMAP_TIAN_DI_TU_3857, BASEMAP_TIAN_DI_TU_4326 } from '@fssgis/fssg-map';
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
import EsriBasemap from '@arcgis/core/Basemap';
import Graphic from '@arcgis/core/Graphic';
import Geometry from '@arcgis/core/geometry/Geometry';
import { deepCopyJSON, $extend } from '@fssgis/utils';

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

esriConfig.apiKey = 'AAPKb95001bcb6a34be7a32b3fcb75eb27d1ujL7yX9tcvWSbUPoKwptBe_57mwGWOpklkdWrPt3L3OaW96gkJLjRctcOo1OvJ1S';
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
   * 空间坐标系
   */


  get sr() {
    var _this$_view;

    if (!this._view) {
      error(this, `_view未实例无法获取spatialReference属性`);
    }

    const sr = this === null || this === void 0 ? void 0 : (_this$_view = this._view) === null || _this$_view === void 0 ? void 0 : _this$_view.spatialReference;
    return sr ?? null; // eslint-disable-line
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
        }
      },
      mapOptions: {},
      debug: false,
      debugName: 'fssgEsri'
    });

    _defineProperty(this, "basemap", void 0);

    _defineProperty(this, "mapElement", void 0);

    _defineProperty(this, "_map", void 0);

    _defineProperty(this, "_view", void 0);
  } //#endregion
  //#region 私有方法

  /**
   * 初始化地图
   * @returns this
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
   * @returns this
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
   * @returns this
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
   * @returns this
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
   * @returns this
   */


  mount() {
    this._initAssetsPath()._initMap()._initView()._initRemoveOnlineStyle().fire('loaded');

    return this;
  }

}

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
   * @returns this
   */


  installPlugin(fssgEsri) {
    this.map_ = fssgEsri.map;
    this.view_ = fssgEsri.view;
    return this;
  }

}

class GeometryFacory {
  get _spatialReference() {
    return this._fssgEsri.sr;
  }

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

  createPoint(options) {
    return new Point({
      spatialReference: this._spatialReference,
      ...options
    });
  }

  createPolyline(options) {
    return new Polyline({
      spatialReference: this._spatialReference,
      ...options
    });
  }

  createPolygon(options) {
    return new Polygon({
      spatialReference: this._spatialReference,
      ...options
    });
  }

  createExtent(options) {
    return new Extent({
      spatialReference: this._spatialReference,
      ...options
    });
  }

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

  createPolylineFromPoints(points) {
    const polyline = this.createPolyline({
      paths: []
    });
    polyline.addPath(points);
    return polyline;
  }

  createPolylineFromXYs(xys) {
    const points = xys.map(xy => this.createPointFromXY(xy));
    return this.createPolylineFromPoints(points);
  }

  createPolylineFromLonLats(lonLats) {
    const points = lonLats.map(lonLat => this.createPointFromLonLat(lonLat));
    return this.createPolylineFromPoints(points);
  }

  createPolygonFromPoints(points) {
    const polygon = this.createPolygon({
      rings: []
    });
    polygon.addRing(points);
    return polygon;
  }

  createPointsFromPolyline(polyline, pathIndex = 0) {
    const count = polyline.paths[pathIndex];
    const points = Array(count).map((_, i) => polyline.getPoint(pathIndex, i));
    return points;
  }

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

  createPolygonFromXYs(xys) {
    const points = xys.map(xy => this.createPointFromXY(xy));
    const polygon = this.createPolygonFromPoints(points);
    return polygon;
  }

  createPolygonFromLonLats(lonLats) {
    const points = lonLats.map(lonLat => this.createPointFromLonLat(lonLat));
    const polygon = this.createPolygonFromPoints(points);
    return polygon;
  }

}

_defineProperty(GeometryFacory, "_instanceMap", new Map());

function createGeometryFactory(fssgEsri) {
  return new GeometryFacory(fssgEsri);
}

class LayerFactory {
  constructor() {
    if (LayerFactory._instance) {
      return LayerFactory._instance;
    }

    LayerFactory._instance = this;
    return this;
  }

  createGraphicsLayer(options) {
    return new GraphicsLayer(options);
  }

  createGroupLayer(options) {
    return new GroupLayer(options);
  }

  createWebTileLayer(options) {
    return new WebTileLayer(options);
  }

}

_defineProperty(LayerFactory, "_instance", void 0);

function createLayerFactory() {
  return new LayerFactory();
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
            layers.push(createLayerFactory().createWebTileLayer({
              urlTemplate: o.url,
              ...o.props
            }));
          }
        });

        this._itemPool.set(item.key, layers);

        return;
      }

      let layer;

      if (item.type === 'webtilelayer') {
        layer = createLayerFactory().createWebTileLayer({
          urlTemplate: item.url,
          ...item.props
        });
      }

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
    this._graphicsLayer = createLayerFactory().createGraphicsLayer();
    this._highlightLayer = createLayerFactory().createGraphicsLayer();
    this._groupLayer = createLayerFactory().createGroupLayer({
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

export { Basemap, FssgEsri, FssgEsriPlugin, MapElement, createGeometryFactory, createLayerFactory };
