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
import { isNullOrUndefined, deepCopyJSON, $extend, throttle, createGuid, whenRightReturn, listToTree } from '@fssgis/utils';
import Field from '@arcgis/core/layers/support/Field';
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
import { load, project } from '@arcgis/core/geometry/projection';
import SpatialReference from '@arcgis/core/geometry/SpatialReference';
import EsriBasemap from '@arcgis/core/Basemap';
import Geometry from '@arcgis/core/geometry/Geometry';
import Draw from '@arcgis/core/views/draw/Draw';
import { planarLength, planarArea, buffer } from '@arcgis/core/geometry/geometryEngineAsync';
import BaseLayerViewGL2D from '@arcgis/core/views/2d/layers/BaseLayerViewGL2D';
import { on } from '@arcgis/core/core/watchUtils';
import { resolve } from '@arcgis/core/core/promiseUtils';

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

function getXfromXY(xy) {
  return Array.isArray(xy) ? xy[0] : xy.x;
}
function getYfromXY(xy) {
  return Array.isArray(xy) ? xy[1] : xy.y;
}
function getLonfromLonLat(lonLat) {
  // eslint-disable-next-line
  // @ts-ignore
  return Array.isArray(lonLat) ? lonLat[0] : lonLat.lon ?? lonLat.lng ?? lonLat.longitude;
}
function getLatfromLonLat(lonLat) {
  // eslint-disable-next-line
  // @ts-ignore
  return Array.isArray(lonLat) ? lonLat[1] : lonLat.lat ?? lonLat.latitude;
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
      const x = getXfromXY(xy);
      const y = getYfromXY(xy);
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
      const lonlat = args[0];
      const longitude = getLonfromLonLat(lonlat);
      const latitude = getLatfromLonLat(lonlat);
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
  /**
   * 根据esri范围创建Esri面
   * @param extent esri范围
   */


  createPolygonFromExtent(extent) {
    const {
      xmax,
      xmin,
      ymax,
      ymin
    } = extent;
    const xys = [[xmin, ymin], [xmin, ymax], [xmax, ymax], [xmax, ymin]];
    return this.createPolygonFromXYs(xys);
  }
  /**
   * 根据esri点集创建esri范围
   * @param points esri点集
   */


  createExtentFromPoints(points) {
    var _points$, _points$2, _points$3, _points$4;

    const xmin = points.reduce((ret, cur) => {
      ret < cur.x && (ret = cur.x);
      return ret;
    }, (_points$ = points[0]) === null || _points$ === void 0 ? void 0 : _points$.x);
    const xmax = points.reduce((ret, cur) => {
      ret > cur.x && (ret = cur.x);
      return ret;
    }, (_points$2 = points[0]) === null || _points$2 === void 0 ? void 0 : _points$2.x);
    const ymin = points.reduce((ret, cur) => {
      ret < cur.y && (ret = cur.y);
      return ret;
    }, (_points$3 = points[0]) === null || _points$3 === void 0 ? void 0 : _points$3.y);
    const ymax = points.reduce((ret, cur) => {
      ret > cur.y && (ret = cur.y);
      return ret;
    }, (_points$4 = points[0]) === null || _points$4 === void 0 ? void 0 : _points$4.y);
    return this.createExtent({
      xmin,
      xmax,
      ymin,
      ymax
    });
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

      case 'sqllayer3':
        return this.createSqlLayer3(options);
      // eslint-disable-line

      case 'featurelayer':
        return this.createFeatureLayer(options);

      case 'geojsonlayer':
        return this.createGeoJSONLayer(options);

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
    const layer = this.createFeatureLayer({
      spatialReference: options.spatialReference,
      source: [],
      objectIdField: '$objectId',
      geometryType: 'point',
      outFields: ['*'],
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

      if (result[0]) {
        layer.fields = [new Field({
          name: '$objectId',
          alias: '$objectId',
          type: 'oid'
        }), ...Object.keys(result[0]).map(key => new Field({
          name: key,
          alias: key,
          type: [options.sqlOptions.xField, options.sqlOptions.yField].includes(key) ? 'double' : 'string'
        }))];
      }

      result.forEach((row, index) => {
        if (!row[options.sqlOptions.xField] || !row[options.sqlOptions.yField]) {
          return;
        }

        const attributes = row;
        Object.keys(attributes).forEach(key => {
          if (isNullOrUndefined(attributes[key])) {
            attributes[key] = '';
          } else if (![options.sqlOptions.xField, options.sqlOptions.yField].includes(key)) {
            attributes[key] = String(attributes[key]);
          }
        });
        const props = {
          attributes: Object.fromEntries(layer.fields.map(item => {
            return [item.name, attributes[item.name]];
          })),
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
  /**
   * 创建FeatureLayer
   * @param options 配置项
   * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html
   * @example
   * ```ts
   * createLayerFactory().createFeatureLayer({ \/* xxx *\/ })
   * ```
   */


  createFeatureLayer(options) {
    return new FeatureLayer(options);
  }

  createSqlLayer3(options) {
    const {
      url,
      ...others
    } = options;
    const layer = this.createGeoJSONLayer({
      geometryType: 'point',
      objectIdField: '$objectId',
      outFields: ['*'],
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

      if (result[0]) {
        layer.fields = [new Field({
          name: '$objectId',
          alias: '$objectId',
          type: 'oid'
        }), ...Object.keys(result[0]).map(key => new Field({
          name: key,
          alias: key,
          type: [options.sqlOptions.xField, options.sqlOptions.yField].includes(key) ? 'double' : 'string'
        }))];
      }

      result.forEach((row, index) => {
        if (!row[options.sqlOptions.xField] || !row[options.sqlOptions.yField]) {
          return;
        }

        const attributes = row;
        Object.keys(attributes).forEach(key => {
          if (isNullOrUndefined(attributes[key])) {
            attributes[key] = '';
          } else if (![options.sqlOptions.xField, options.sqlOptions.yField].includes(key)) {
            attributes[key] = String(attributes[key]);
          }
        });
        const props = {
          attributes: Object.fromEntries(layer.fields.map(item => {
            return [item.name, attributes[item.name]];
          })),
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

  createGeoJSONLayer(options) {
    return new GeoJSONLayer(options);
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

let _gotoPromise;

let _handleId;

function goto(view, target, options) {
  clearTimeout(_handleId);
  const gotoFunc = view.goTo.bind(view, target, options);

  if (_gotoPromise) {
    _gotoPromise = _gotoPromise.then(() => gotoFunc());
  } else {
    _gotoPromise = gotoFunc();
  }

  _handleId = setTimeout(() => _gotoPromise = undefined, 2500);
}

load();
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
    document.styleSheets[0].insertRule(`.esri-view { outline: none !important }`);
    document.styleSheets[0].insertRule(`.esri-view .esri-view-surface { outline: none !important }`);
    document.styleSheets[0].insertRule(`.esri-view .esri-view-surface--inset-outline:focus::after { outline: none !important }`);
    return this;
  }

  _initBeginCenter() {
    const {
      centerX,
      centerY
    } = this.options_;

    if (isNullOrUndefined(centerX) || isNullOrUndefined(centerY)) {
      return this;
    }

    this.when().then(() => {
      const point = createGeometryFactory(this).createPoint({
        x: centerX,
        y: centerY,
        spatialReference: this.sr
      });
      this.view.center = point;
    });
    return this;
  }

  goto(target, options) {
    goto(this.view, target, options);

    return this;
  } //#endregion
  //#region 公有方法

  /**
   * 安装
   */


  mount() {
    this._initAssetsPath()._initMap()._initView()._initRemoveOnlineStyle()._initBeginCenter().fire('loaded');

    return this;
  }
  /**
   * 缩放
   * @param num 缩放值
   * @param options 配置项
   */


  zoomIn(num = 1, options) {
    const zoom = this.zoom;
    this.goto({
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
    this.goto({
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
    this.goto({
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

    this.goto({
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

    this.goto({
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
  /**
   * 经纬度转投影坐标
   * @param lonLat 经纬度
   * @param sr 投影坐标系
   */


  lonLatToXY(lonLat, sr = this.sr) {
    const longitude = getLonfromLonLat(lonLat);
    const latitude = getLatfromLonLat(lonLat);
    const point = createGeometryFactory(this).createPoint({
      longitude,
      latitude,
      spatialReference: new SpatialReference({
        wkid: 4326
      })
    });
    const {
      x,
      y
    } = project(point, sr);
    return [x, y];
  }
  /**
   * 投影坐标转经纬度
   * @param xy 投影坐标
   * @param sr 投影坐标系
   */


  xyToLonLat(xy, sr = this.sr) {
    const x = getXfromXY(xy);
    const y = getYfromXY(xy);
    const point = createGeometryFactory(this).createPoint({
      x,
      y,
      spatialReference: sr
    });
    const {
      longitude,
      latitude
    } = project(point, new SpatialReference({
      wkid: 4326
    }));
    return [longitude, latitude];
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

    this._createTianDiTu(); // eslint-disable-next-line
    // @ts-ignore


    this._visible = void 0; // eslint-disable-next-line
    // @ts-ignore

    this._selectedKey = void 0;
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
    super.installPlugin(fssgEsri);
    return this._init();
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
    super.installPlugin(fssgEsri);
    return this._init();
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

    this.$.goto(this.home);
    return true;
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
    super.installPlugin(fssgEsri);
    return this._init();
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
    } // const { mapElement, mapCursor } = this.$


    const mapElement = this.$.getPlugin(MapElement);
    const mapCursor = this.$.getPlugin(MapCursor);

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
    const mapElement = this.$.getPlugin(MapElement);

    if (!mapElement) {
      return false;
    }

    this._tempGraphic && mapElement.remove(this._tempGraphic);
    this._tempGraphic = null;
    const mapCursor = this.$.getPlugin(MapCursor);
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

    const mapElement = this.$.getPlugin(MapElement);

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

    const mapElement = this.$.getPlugin(MapElement);

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
    const mapElement = this.$.getPlugin(MapElement);

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

class DrawRectangleFasterTool extends DrawTool {
  constructor(map, view, options) {
    super(map, view, { ...options,
      drawType: 'rectangle',
      cursorType: 'draw-polygon'
    });
  }

  initAction_() {
    this.action_ = this.draw_.create('rectangle', {
      mode: 'freehand'
    });
    this.action_.on(['vertex-add', 'cursor-update', 'vertex-remove'], e => {
      const vertices = e.vertices;

      if (vertices.length === 1) {
        e.type === 'vertex-add' && this.fire('draw-start', {
          x: vertices[0][0],
          y: vertices[0][1]
        });
        return;
      }

      const geometry = createGeometryFactory(this.$).createExtentFromPoints(vertices.map(xy => createGeometryFactory(this.$).createPointFromXY(xy)));
      this.fire('draw-move', {
        geometry
      });
    });
    this.action_.on('draw-complete', e => {
      const vertices = e.vertices;
      const geometry = createGeometryFactory(this.$).createExtentFromPoints(vertices.map(xy => createGeometryFactory(this.$).createPointFromXY(xy)));
      this.fire('draw-end', {
        geometry
      });
    });
    return this;
  }

}

/** 拉框放大工具类 */

class ZoomInRectTool extends DrawRectangleFasterTool {
  //#region 构造函数

  /**
   * 构造拉框放大工具类
   * @param map 地图对象
   * @param view 视图对象
   */
  constructor(map, view) {
    super(map, view);
    this.cursorType_ = 'zoomin';
    this.setDrawingStyle({
      fill: {
        color: [0, 0, 0, .5],
        outline: {
          color: [0, 0, 0, .3],
          width: 4
        }
      }
    });
  } //#endregion
  //#region 保护方法

  /** 重写绘制完成处理事件 */


  onDrawEnd_(e) {
    const graphic = super.onDrawEnd_(e);

    if (!graphic) {
      return false;
    }

    this.clearDrawed();
    this.view_.goTo(graphic);
    return graphic;
  }

}

/** 拉框缩小工具类 */

class ZoomOutRectTool extends DrawRectangleFasterTool {
  //#region 构造函数

  /**
   * 构造拉框缩小工具类
   * @param map 地图对象
   * @param view 视图对象
   */
  constructor(map, view) {
    super(map, view);
    this.cursorType_ = 'zoomout';
    this.setDrawingStyle({
      fill: {
        color: [0, 0, 0, .5],
        outline: {
          color: [0, 0, 0, .3],
          width: 4
        }
      }
    });
  } //#endregion
  //#region 保护方法

  /** 重写绘制完成处理事件 */


  onDrawEnd_(e) {
    const graphic = super.onDrawEnd_(e);

    if (!graphic) {
      return false;
    }

    this.clearDrawed();
    const {
      xmin,
      ymin,
      xmax,
      ymax
    } = graphic.geometry.extent;
    const {
      xmin: vXmin,
      ymin: vYmin,
      xmax: vXmax,
      ymax: vYmax
    } = this.view_.extent;
    const [gWidth, gHeight] = [xmax - xmin, ymax, ymin];
    const [vWidth, vHeight] = [vXmax - vXmin, vYmax - vYmin];
    const nWidth = vWidth ** 2 / gWidth;
    const nHeight = vHeight ** 2 / gHeight;
    const nXmin = vXmin - (xmin - vXmin) * vWidth / gWidth;
    const nYmin = vYmin - (ymin - vYmin) * vHeight / gHeight;
    const nXmax = nXmin + Math.abs(nWidth);
    const nYMax = nYmin + Math.abs(nHeight);
    this.view_.goTo(new Extent({
      xmin: nXmin,
      ymin: nYmin,
      xmax: nXmax,
      ymax: nYMax,
      spatialReference: this.view_.spatialReference
    }));
    return graphic;
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

class DrawRectangleTool extends DrawTool {
  constructor(map, view, options) {
    super(map, view, { ...options,
      drawType: 'rectangle',
      cursorType: 'draw-polygon'
    });
  }

  initAction_() {
    this.action_ = this.draw_.create('rectangle', {
      mode: 'click'
    });
    this.action_.on(['vertex-add', 'cursor-update', 'vertex-remove'], e => {
      const vertices = e.vertices;

      if (vertices.length === 1) {
        e.type === 'vertex-add' && this.fire('draw-start', {
          x: vertices[0][0],
          y: vertices[0][1]
        });
        return;
      }

      const geometry = createGeometryFactory(this.$).createExtentFromPoints(vertices.map(xy => createGeometryFactory(this.$).createPointFromXY(xy)));
      this.fire('draw-move', {
        geometry
      });
    });
    this.action_.on('draw-complete', e => {
      const vertices = e.vertices;
      const geometry = createGeometryFactory(this.$).createExtentFromPoints(vertices.map(xy => createGeometryFactory(this.$).createPointFromXY(xy)));
      this.fire('draw-end', {
        geometry
      });
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
    super.installPlugin(fssgEsri);
    return this._init();
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

          if (item.screenX && item.screenY) {
            screenPt.x = item.screenX;
            screenPt.y = item.screenY;
          }

          item.container.style.top = `${screenPt.y + item.offsetY}px`;
          item.container.style.left = `${screenPt.x + item.offsetX}px`;
          const mapPt = this.view_.toMap({
            x: screenPt.x + (item.offsetX ?? 0),
            y: screenPt.y + (item.offsetY ?? 0)
          });

          if (item.bezierCurve) {
            item.bezierCurve && this.view_.$owner.getPlugin(MapElement).remove(item.bezierCurve);
            item.bezierCurve = this.view_.$owner.getPlugin(MapElement).add(createGeometryFactory(this.$).createBezierCurve(item.mapXY, mapPt), item.bezierCurveSymbol);
          }
        });
      }, 200));
    });
    return this;
  }

  installPlugin(fssgEsri) {
    super.installPlugin(fssgEsri);
    return this._init();
  }

  add(options) {
    var _options$classNames;

    const overlay = document.createElement('div');
    overlay.classList.add('fssg-overlay');
    (_options$classNames = options.classNames) === null || _options$classNames === void 0 ? void 0 : _options$classNames.forEach(name => overlay.classList.add(name));
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

    if (options.screenX && options.screenY) {
      screenPt.x = options.screenX;
      screenPt.y = options.screenY;
    }

    overlay.style.top = `${screenPt.y + (options.offsetY ?? 0)}px`;
    overlay.style.left = `${screenPt.x + (options.offsetX ?? 0)}px`;
    const mapPt = this.view_.toMap({
      x: screenPt.x + (options.offsetX ?? 0),
      y: screenPt.y + (options.offsetY ?? 0)
    });
    let bezierCurve = undefined;

    if (options.showBezierCurve) {
      bezierCurve = this.view_.$owner.getPlugin(MapElement).add(createGeometryFactory(this.$).createBezierCurve(options.point, mapPt), options.bezierCurveSymbol);
    }

    const id = options.id ?? `overlay-${createGuid()}`;
    overlay.id = id;

    this._overlayPool.set(id, {
      id,
      classNames: options.classNames,
      container: overlay,
      mapXY: options.point,
      offsetX: options.offsetX ?? 0,
      offsetY: options.offsetY ?? 0,
      screenX: options.screenX,
      screenY: options.screenY,
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
      item.bezierCurve && this.view_.$owner.getPlugin(MapElement).remove(item.bezierCurve);

      this._overlayPool.delete(id);
    }

    return this;
  }

  clear() {
    [...this._overlayPool.values()].forEach(item => {
      item.container.remove();
      item.bezierCurve && this.view_.$owner.getPlugin(MapElement).remove(item.bezierCurve);
    });

    this._overlayPool.clear();

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
    this.view_.$owner.getPlugin(MouseTips).showTips(`x: ${point.x.toFixed(3)}<br>y: ${point.y.toFixed(3)}`);
    return graphic;
  }

  onToolDeactived_(e) {
    if (!super.onToolDeactived_(e)) {
      return false;
    }

    this.view_.$owner.getPlugin(MouseTips).cancelTips();
    return true;
  }

  onDrawEnd_(e) {
    const graphic = super.onDrawEnd_(e);

    if (!graphic) {
      return false;
    }

    const point = graphic.geometry;
    const id = this.view_.$owner.getPlugin(Overlays).add({
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
      this.view_.$owner.getPlugin(Overlays).removeById(id);
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
      this.view_.$owner.getPlugin(MouseTips).showTips(`长度：${length.toFixed(this.fixedCount)}${this._unitStrDic[this.unit]}`);
    });
    return graphic;
  }

  onToolDeactived_(e) {
    if (!super.onToolDeactived_(e)) {
      return false;
    }

    this.view_.$owner.getPlugin(MouseTips).cancelTips();
    return true;
  }

  onDrawEnd_(e) {
    const graphic = super.onDrawEnd_(e);

    if (!graphic) {
      return false;
    }

    const line = graphic.geometry;
    planarLength(line, this.unit).then(length => {
      const id = this.view_.$owner.getPlugin(Overlays).add({
        point: line.extent.center,
        content: `长度：${length.toFixed(this.fixedCount)}${this._unitStrDic[this.unit]}`
      });

      this._overlayIds.add(id);
    });
    this.view_.$owner.getPlugin(MouseTips).cancelTips();
    return graphic;
  }

  clearMeasure() {
    this._overlayIds.forEach(id => {
      this.view_.$owner.getPlugin(Overlays).removeById(id);
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
      this.view_.$owner.getPlugin(MouseTips).showTips(`面积：${area.toFixed(this.fixedCount)}${this._unitStrDic[this.unit]}`);
    });
    return graphic;
  }

  onToolDeactived_(e) {
    if (!super.onToolDeactived_(e)) {
      return false;
    }

    this.view_.$owner.getPlugin(MouseTips).cancelTips();
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
      const id = this.view_.$owner.getPlugin(Overlays).add({
        point: polygon.extent.center,
        content: `面积：${area.toFixed(this.fixedCount)}${this._unitStrDic[this.unit]}`
      });

      this._overlayIds.add(id);
    });
    this.view_.$owner.getPlugin(MouseTips).cancelTips();
    return graphic;
  }

  clearMeasure() {
    this._overlayIds.forEach(id => {
      this.view_.$owner.getPlugin(Overlays).removeById(id);
    });

    return this.clearDrawed();
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
    return [...this._layerPoolUnique.values()].filter(([_, options]) => options.isQuery);
  }
  /**
   * 不可查询的图层集合
   */


  get layersWhichCantQuery() {
    return [...this._layerPoolUnique.values()].filter(([_, options]) => !options.isQuery);
  }
  /**
   * 图层容器，唯一存储
   */


  get _layerPoolUnique() {
    const set = new Set([...this._layerPool.values()]);
    const map = new Map();
    set.forEach(item => map.set(item[0].id, item));
    return map;
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
    super.installPlugin(fssgEsri);
    return this._init();
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
   * 查找动态图层
   * @param nameOrId 图层名或Id
   */


  findDynaLayer(nameOrId) {
    const [layer, options] = this._findItem(nameOrId);

    if (options.layerType === 'dynamiclayer' && layer instanceof MapImageLayer) {
      return layer.sublayers.getItemAt(0);
    } else {
      throw error(this, `图层${nameOrId}为非动态图层`);
    }
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
    const values = [...this._layerPoolUnique.values()];

    for (let i = 0; i < values.length; i++) {
      await callback(values[i]);
    }

    return this;
  }

}

class ViewCliper extends FssgEsriPlugin {
  constructor(options) {
    super(options, {});

    _defineProperty(this, "_cliperLayer", void 0);
  }

  get cliperLayer() {
    return this._cliperLayer;
  }

  _init() {
    this._cliperLayer = new GraphicsLayer({
      blendMode: 'destination-in',
      effect: 'bloom(200%)'
    });
    return this;
  }

  installPlugin(fssgEsri) {
    super.installPlugin(fssgEsri);
    return this._init();
  }

  clip(arg0) {
    if (!this.map_.findLayerById(this._cliperLayer.id)) {
      this.map_.add(this._cliperLayer);
    }

    let graphic = arg0.clone();

    if (graphic instanceof Geometry) {
      graphic = new Graphic({
        geometry: graphic
      });
    }

    this._cliperLayer.graphics.removeAll();

    this._cliperLayer.graphics.add(graphic);

    return this;
  }

  restore() {
    if (this.map_.findLayerById(this._cliperLayer.id)) {
      this.map_.remove(this._cliperLayer);
    }

    return this;
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
    await fssgMap.getPlugin(MapLayers).forEach(async ([layer, options]) => {
      if (!['mapimagelayer', 'dynamiclayer'].includes(options.layerType)) {
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
    const screen = this.view_.toScreen(point); // const { mapElement, mapLayers, viewCliper } = this.$

    const mapElement = this.$.getPlugin(MapElement);
    const mapLayers = this.$.getPlugin(MapLayers);
    const viewCliper = this.$.getPlugin(ViewCliper);
    Promise.all([this._queryWithMapImageLayer(point), this.view_.hitTest(screen, {
      exclude: [mapElement === null || mapElement === void 0 ? void 0 : mapElement.graphicsLayer, mapElement === null || mapElement === void 0 ? void 0 : mapElement.highlightLayer, ...(mapLayers === null || mapLayers === void 0 ? void 0 : mapLayers.layersWhichCantQuery.map(([layer]) => layer)), viewCliper === null || viewCliper === void 0 ? void 0 : viewCliper.cliperLayer]
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
    return graphic;
  }

  finsheHitTest_(result) {
    this.fire('finshed', {
      results: result.results
    });
    return result.results;
  }

}

class SelectByPolygonTool extends DrawPolygonTool {
  constructor(map, view, options) {
    super(map, view, options);
    this.on('selected', e => this.onSelected_(e));
  }

  onSelected_(e) {
    if (!this.actived) {
      return false;
    }

    return e.features;
  }

  onDrawEnd_(e) {
    const graphic = super.onDrawEnd_(e);

    if (!graphic) {
      return false;
    }

    const geometry = graphic.geometry;
    Promise.all(this.options_.querylayers.map(layer => {
      return layer.queryFeatures({
        geometry,
        returnGeometry: true,
        outFields: ['*']
      });
    })).then(featureSets => {
      const features = featureSets.reduce((ret, cur) => {
        ret.push(...cur.features);
        return ret;
      }, []);
      this.fire('selected', {
        features
      });
    });
    return graphic;
  }

  setQueryLayers(layers) {
    this.options_.querylayers = layers;
    return this;
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

    const mapElement = this.$.getPlugin(MapElement);
    const overlays = this.$.getPlugin(Overlays);
    const mouseTips = this.$.getPlugin(MouseTips);

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
    })).set('zoom-home', new ZoomHomeTool(this.map_, this.view_)).set('zoom-in-rect', new ZoomInRectTool(this.map_, this.view_)).set('zoom-out-rect', new ZoomOutRectTool(this.map_, this.view_)).set('clear', new ClearTool(this.map_, this.view_)).set('measure-coordinate', new MeasureCoordinateTool(this.map_, this.view_)).set('measure-length', new MeasureLengthTool(this.map_, this.view_)).set('measure-area', new MeasureAreaTool(this.map_, this.view_)).set('hit-test', new HitTestTool(this.map_, this.view_)).set('draw-rectangle', new DrawRectangleTool(this.map_, this.view_)).set('draw-point', new DrawPointTool(this.map_, this.view_)).set('draw-polyline', new DrawPolylineTool(this.map_, this.view_)).set('draw-polygon', new DrawPolygonTool(this.map_, this.view_)).set('draw-rectangle-faster', new DrawRectangleFasterTool(this.map_, this.view_));

    return this;
  }
  /**
   * 安装插件
   */


  installPlugin(fssgEsri) {
    super.installPlugin(fssgEsri);
    return this._init();
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
      this._fssgEsri.getPlugin(MapElement).set(sourceView.extent); //禁止移动地图


      hawkeyeView.on('drag', event => {
        event.stopPropagation();
      });
      hawkeyeView.on('mouse-wheel', event => {
        event.stopPropagation();
      }); // 动态主图绘制范围

      sourceView.watch(['zoom', 'center'], throttle(() => {
        this._fssgEsri.getPlugin(MapElement).set(sourceView.extent);

        this._fssgEsri.goto({
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
    super.installPlugin(fssgEsri);
    return this._init();
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
    return [...this._checkedIds];
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
    this._checkedIds = new Set();
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

    const layer = this.$.getPlugin(MapLayers).findLayer(node.layerId);
    layer && (layer.visible = checked);
    (_node$associatedLayer = node.associatedLayerIds) === null || _node$associatedLayer === void 0 ? void 0 : _node$associatedLayer.forEach(id => {
      const layer = this.$.getPlugin(MapLayers).findLayer(id);
      layer && (layer.visible = checked);
    });

    if (checked) {
      this._checkedIds.add(node.id);
    } else {
      this._checkedIds.delete(node.id);
    }

    return this.fire('change:checked', {
      node,
      checked
    });
  }
  /**
   * 初始化
   */


  _init() {
    this.$.getPlugin(MapLayers).when().then(() => {
      this._list.forEach(item => {
        this._setNodeChecked(item, item.defaultChecked);

        item.defaultChecked && this._checkedIds.add(item.id);
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
    super.installPlugin(fssgEsri);
    return this.$.getPlugin(MapLayers).when().then(() => this._init());
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
      return this.$.getPlugin(MapLayers).findLayer(layerId);
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
   * 安装插件
   * @param fssgEsri 地图应用
   * @returns this
   */


  installPlugin(fssgEsri) {
    super.installPlugin(fssgEsri);
    return this.$.getPlugin(LayerTree).when().then(() => this);
  }
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
          this.$.getPlugin(LayerTree).setNodeCheckById(nodeId, true);
        });
      } else {
        module.treeNodeIds.forEach(nodeId => {
          this.$.getPlugin(LayerTree).setNodeCheckById(nodeId, false);
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
          this.$.getPlugin(LayerTree).setNodeCheckById(nodeId, true);
        });
      } else {
        module.treeNodeIds.forEach(nodeId => {
          this.$.getPlugin(LayerTree).setNodeCheckById(nodeId, false);
        });
      }
    });

    this.fire('change:selected', {
      item
    });
    return this;
  }

}

class MapPopups extends FssgEsriPlugin {
  get visible() {
    return this.view_.popup.visible;
  }

  constructor(options) {
    super(options, {});
  }

  installPlugin(fssgMap) {
    super.installPlugin(fssgMap);
    return this.fire('loaded');
  }

  openByXY(...args) {
    let x, y, options;

    if (Array.isArray(args[0])) {
      [x, y] = [args[0][0], args[0][1]];
      options = args[1];
    } else if (typeof args[1] === 'number') {
      [x, y] = [args[0], args[1]];
      options = args[2];
    } else {
      [x, y] = [args[0].x, args[0].y];
      options = args[1];
    }

    const point = new Point({
      x,
      y,
      spatialReference: this.view_.spatialReference
    });
    this.view_.popup.open({
      location: point,
      ...options
    });
    return this;
  }

  cancel() {
    this.view_.popup.visible = false;
    return this;
  }

}

/**
 * Common utilities
 * @module glMatrix
 */
// Configuration Constants
var EPSILON = 0.000001;
var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
if (!Math.hypot) Math.hypot = function () {
  var y = 0,
      i = arguments.length;

  while (i--) {
    y += arguments[i] * arguments[i];
  }

  return Math.sqrt(y);
};

/**
 * 3x3 Matrix
 * @module mat3
 */

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */

function create$4() {
  var out = new ARRAY_TYPE(9);

  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
  }

  out[0] = 1;
  out[4] = 1;
  out[8] = 1;
  return out;
}
/**
 * Create a new mat3 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m10 Component in column 1, row 0 position (index 3)
 * @param {Number} m11 Component in column 1, row 1 position (index 4)
 * @param {Number} m12 Component in column 1, row 2 position (index 5)
 * @param {Number} m20 Component in column 2, row 0 position (index 6)
 * @param {Number} m21 Component in column 2, row 1 position (index 7)
 * @param {Number} m22 Component in column 2, row 2 position (index 8)
 * @returns {mat3} A new mat3
 */

function fromValues$2(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
  var out = new ARRAY_TYPE(9);
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m10;
  out[4] = m11;
  out[5] = m12;
  out[6] = m20;
  out[7] = m21;
  out[8] = m22;
  return out;
}
/**
 * Set a mat3 to the identity matrix
 *
 * @param {mat3} out the receiving matrix
 * @returns {mat3} out
 */

function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 1;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}
/**
 * Translate a mat3 by the given vector
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the matrix to translate
 * @param {ReadonlyVec2} v vector to translate by
 * @returns {mat3} out
 */

function translate(out, a, v) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a10 = a[3],
      a11 = a[4],
      a12 = a[5],
      a20 = a[6],
      a21 = a[7],
      a22 = a[8],
      x = v[0],
      y = v[1];
  out[0] = a00;
  out[1] = a01;
  out[2] = a02;
  out[3] = a10;
  out[4] = a11;
  out[5] = a12;
  out[6] = x * a00 + y * a10 + a20;
  out[7] = x * a01 + y * a11 + a21;
  out[8] = x * a02 + y * a12 + a22;
  return out;
}
/**
 * Rotates a mat3 by the given angle
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */

function rotate(out, a, rad) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a10 = a[3],
      a11 = a[4],
      a12 = a[5],
      a20 = a[6],
      a21 = a[7],
      a22 = a[8],
      s = Math.sin(rad),
      c = Math.cos(rad);
  out[0] = c * a00 + s * a10;
  out[1] = c * a01 + s * a11;
  out[2] = c * a02 + s * a12;
  out[3] = c * a10 - s * a00;
  out[4] = c * a11 - s * a01;
  out[5] = c * a12 - s * a02;
  out[6] = a20;
  out[7] = a21;
  out[8] = a22;
  return out;
}
/**
 * Scales the mat3 by the dimensions in the given vec2
 *
 * @param {mat3} out the receiving matrix
 * @param {ReadonlyMat3} a the matrix to rotate
 * @param {ReadonlyVec2} v the vec2 to scale the matrix by
 * @returns {mat3} out
 **/

function scale(out, a, v) {
  var x = v[0],
      y = v[1];
  out[0] = x * a[0];
  out[1] = x * a[1];
  out[2] = x * a[2];
  out[3] = y * a[3];
  out[4] = y * a[4];
  out[5] = y * a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}

/**
 * 3 Dimensional Vector
 * @module vec3
 */

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */

function create$3() {
  var out = new ARRAY_TYPE(3);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }

  return out;
}
/**
 * Calculates the length of a vec3
 *
 * @param {ReadonlyVec3} a vector to calculate length of
 * @returns {Number} length of a
 */

function length(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return Math.hypot(x, y, z);
}
/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */

function fromValues$1(x, y, z) {
  var out = new ARRAY_TYPE(3);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to normalize
 * @returns {vec3} out
 */

function normalize$2(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var len = x * x + y * y + z * z;

  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
  }

  out[0] = a[0] * len;
  out[1] = a[1] * len;
  out[2] = a[2] * len;
  return out;
}
/**
 * Calculates the dot product of two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} dot product of a and b
 */

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function cross(out, a, b) {
  var ax = a[0],
      ay = a[1],
      az = a[2];
  var bx = b[0],
      by = b[1],
      bz = b[2];
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}
/**
 * Alias for {@link vec3.length}
 * @function
 */

var len = length;
/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

(function () {
  var vec = create$3();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 3;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
    }

    return a;
  };
})();

/**
 * 4 Dimensional Vector
 * @module vec4
 */

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */

function create$2() {
  var out = new ARRAY_TYPE(4);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
  }

  return out;
}
/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to normalize
 * @returns {vec4} out
 */

function normalize$1(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  var len = x * x + y * y + z * z + w * w;

  if (len > 0) {
    len = 1 / Math.sqrt(len);
  }

  out[0] = x * len;
  out[1] = y * len;
  out[2] = z * len;
  out[3] = w * len;
  return out;
}
/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

(function () {
  var vec = create$2();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 4;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      vec[3] = a[i + 3];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
      a[i + 3] = vec[3];
    }

    return a;
  };
})();

/**
 * Quaternion
 * @module quat
 */

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */

function create$1() {
  var out = new ARRAY_TYPE(4);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }

  out[3] = 1;
  return out;
}
/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyVec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/

function setAxisAngle(out, axis, rad) {
  rad = rad * 0.5;
  var s = Math.sin(rad);
  out[0] = s * axis[0];
  out[1] = s * axis[1];
  out[2] = s * axis[2];
  out[3] = Math.cos(rad);
  return out;
}
/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 */

function slerp(out, a, b, t) {
  // benchmarks:
  //    http://jsperf.com/quaternion-slerp-implementations
  var ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  var bx = b[0],
      by = b[1],
      bz = b[2],
      bw = b[3];
  var omega, cosom, sinom, scale0, scale1; // calc cosine

  cosom = ax * bx + ay * by + az * bz + aw * bw; // adjust signs (if necessary)

  if (cosom < 0.0) {
    cosom = -cosom;
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
  } // calculate coefficients


  if (1.0 - cosom > EPSILON) {
    // standard case (slerp)
    omega = Math.acos(cosom);
    sinom = Math.sin(omega);
    scale0 = Math.sin((1.0 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    // "from" and "to" quaternions are very close
    //  ... so we can do a linear interpolation
    scale0 = 1.0 - t;
    scale1 = t;
  } // calculate final values


  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;
  return out;
}
/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyMat3} m rotation matrix
 * @returns {quat} out
 * @function
 */

function fromMat3(out, m) {
  // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
  // article "Quaternion Calculus and Fast Animation".
  var fTrace = m[0] + m[4] + m[8];
  var fRoot;

  if (fTrace > 0.0) {
    // |w| > 1/2, may as well choose w > 1/2
    fRoot = Math.sqrt(fTrace + 1.0); // 2w

    out[3] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot; // 1/(4w)

    out[0] = (m[5] - m[7]) * fRoot;
    out[1] = (m[6] - m[2]) * fRoot;
    out[2] = (m[1] - m[3]) * fRoot;
  } else {
    // |w| <= 1/2
    var i = 0;
    if (m[4] > m[0]) i = 1;
    if (m[8] > m[i * 3 + i]) i = 2;
    var j = (i + 1) % 3;
    var k = (i + 2) % 3;
    fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
    out[i] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
    out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
    out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
  }

  return out;
}
/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */

var normalize = normalize$1;
/**
 * Sets a quaternion to represent the shortest rotation from one
 * vector to another.
 *
 * Both vectors are assumed to be unit length.
 *
 * @param {quat} out the receiving quaternion.
 * @param {ReadonlyVec3} a the initial vector
 * @param {ReadonlyVec3} b the destination vector
 * @returns {quat} out
 */

(function () {
  var tmpvec3 = create$3();
  var xUnitVec3 = fromValues$1(1, 0, 0);
  var yUnitVec3 = fromValues$1(0, 1, 0);
  return function (out, a, b) {
    var dot$1 = dot(a, b);

    if (dot$1 < -0.999999) {
      cross(tmpvec3, xUnitVec3, a);
      if (len(tmpvec3) < 0.000001) cross(tmpvec3, yUnitVec3, a);
      normalize$2(tmpvec3, tmpvec3);
      setAxisAngle(out, tmpvec3, Math.PI);
      return out;
    } else if (dot$1 > 0.999999) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      return out;
    } else {
      cross(tmpvec3, a, b);
      out[0] = tmpvec3[0];
      out[1] = tmpvec3[1];
      out[2] = tmpvec3[2];
      out[3] = 1 + dot$1;
      return normalize(out, out);
    }
  };
})();
/**
 * Performs a spherical linear interpolation with two control points
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @param {ReadonlyQuat} c the third operand
 * @param {ReadonlyQuat} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 */

(function () {
  var temp1 = create$1();
  var temp2 = create$1();
  return function (out, a, b, c, d, t) {
    slerp(temp1, a, d, t);
    slerp(temp2, b, c, t);
    slerp(out, temp1, temp2, 2 * t * (1 - t));
    return out;
  };
})();
/**
 * Sets the specified quaternion with values corresponding to the given
 * axes. Each axis is a vec3 and is expected to be unit length and
 * perpendicular to all other specified axes.
 *
 * @param {ReadonlyVec3} view  the vector representing the viewing direction
 * @param {ReadonlyVec3} right the vector representing the local "right" direction
 * @param {ReadonlyVec3} up    the vector representing the local "up" direction
 * @returns {quat} out
 */

(function () {
  var matr = create$4();
  return function (out, view, right, up) {
    matr[0] = right[0];
    matr[3] = right[1];
    matr[6] = right[2];
    matr[1] = up[0];
    matr[4] = up[1];
    matr[7] = up[2];
    matr[2] = -view[0];
    matr[5] = -view[1];
    matr[8] = -view[2];
    return normalize(out, fromMat3(out, matr));
  };
})();

/**
 * 2 Dimensional Vector
 * @module vec2
 */

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */

function create() {
  var out = new ARRAY_TYPE(2);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
  }

  return out;
}
/**
 * Creates a new vec2 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} a new 2D vector
 */

function fromValues(x, y) {
  var out = new ARRAY_TYPE(2);
  out[0] = x;
  out[1] = y;
  return out;
}
/**
 * Subtracts vector b from vector a
 *
 * @param {vec2} out the receiving vector
 * @param {ReadonlyVec2} a the first operand
 * @param {ReadonlyVec2} b the second operand
 * @returns {vec2} out
 */

function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  return out;
}
/**
 * Alias for {@link vec2.subtract}
 * @function
 */

var sub = subtract;
/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

(function () {
  var vec = create();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 2;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
    }

    return a;
  };
})();

// @ts-ignore

const RippleLayerView = BaseLayerViewGL2D.createSubclass({
  // Locations of the two vertex attributes that we use. They
  // will be bound to the shader program before linking.
  aPosition: 0,
  aOffset: 1,
  constructor: function () {
    // Geometrical transformations that must be recomputed
    // from scratch at every frame.
    this.transform = create$4();
    this.translationToCenter = create();
    this.screenTranslation = create(); // Geometrical transformations whose only a few elements
    // must be updated per frame. Those elements are marked
    // with NaN.

    this.display = fromValues$2(NaN, 0, 0, 0, NaN, 0, -1, 1, 1);
    this.screenScaling = fromValues$1(NaN, NaN, 1); // Whether the vertex and index buffers need to be updated
    // due to a change in the layer data.

    this.needsUpdate = false; // We listen for changes to the graphics collection of the layer
    // and trigger the generation of new frames. A frame rendered while
    // `needsUpdate` is true may cause an update of the vertex and
    // index buffers.

    const requestUpdate = () => {
      this.needsUpdate = true;
      this.requestRender();
    };

    this.watcher = on(this, 'layer.graphics', 'change', requestUpdate, requestUpdate, requestUpdate);
  },
  // Called once a custom layer is added to the map.layers collection and this layer view is instantiated.
  attach: function () {
    const gl = this.context;
    const rippleOptions = this.layer.rippleOptions;
    const color = (rippleOptions === null || rippleOptions === void 0 ? void 0 : rippleOptions.color) ?? '0.23, 0.43, 0.70';
    const size = ((rippleOptions === null || rippleOptions === void 0 ? void 0 : rippleOptions.size) ?? 70.0).toFixed(2);
    const freq = ((rippleOptions === null || rippleOptions === void 0 ? void 0 : rippleOptions.freq) ?? 1.0).toFixed(2);
    const rings = ((rippleOptions === null || rippleOptions === void 0 ? void 0 : rippleOptions.rings) ?? 3.0).toFixed(2); // Define and compile shaders.

    const vertexSource = `
      precision highp float;
      uniform mat3 u_transform;
      uniform mat3 u_display;
      attribute vec2 a_position;
      attribute vec2 a_offset;
      varying vec2 v_offset;
      const float SIZE = ${size};
      void main(void) {
          gl_Position.xy = (u_display * (u_transform * vec3(a_position, 1.0) + vec3(a_offset * SIZE, 0.0))).xy;
          gl_Position.zw = vec2(0.0, 1.0);
          v_offset = a_offset;
      }`;
    const fragmentSource = `
      precision highp float;
      uniform float u_current_time;
      varying vec2 v_offset;
      const float PI = 3.14159;
      const float N_RINGS = ${rings};
      const vec3 COLOR = vec3(${color});
      const float FREQ = ${freq};
      void main(void) {
          float l = length(v_offset);
          float intensity = clamp(cos(l * PI), 0.0, 1.0) * clamp(cos(2.0 * PI * (l * 2.0 * N_RINGS - FREQ * u_current_time)), 0.0, 1.0);
          gl_FragColor = vec4(COLOR * intensity, intensity);
      }`;
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexSource);
    gl.compileShader(vertexShader);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentSource);
    gl.compileShader(fragmentShader); // Create the shader program.

    this.program = gl.createProgram();
    gl.attachShader(this.program, vertexShader);
    gl.attachShader(this.program, fragmentShader); // Bind attributes.

    gl.bindAttribLocation(this.program, this.aPosition, 'a_position');
    gl.bindAttribLocation(this.program, this.aOffset, 'a_offset'); // Link.

    gl.linkProgram(this.program); // Shader objects are not needed anymore.

    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader); // Retrieve uniform locations once and for all.

    this.uTransform = gl.getUniformLocation(this.program, 'u_transform');
    this.uDisplay = gl.getUniformLocation(this.program, 'u_display');
    this.uCurrentTime = gl.getUniformLocation(this.program, 'u_current_time'); // Create the vertex and index buffer. They are initially empty. We need to track the
    // size of the index buffer because we use indexed drawing.

    this.vertexBuffer = gl.createBuffer();
    this.indexBuffer = gl.createBuffer(); // Number of indices in the index buffer.

    this.indexBufferSize = 0; // When certain conditions occur, we update the buffers and re-compute and re-encode
    // all the attributes. When buffer update occurs, we also take note of the current center
    // of the view state, and we reset a vector called `translationToCenter` to [0, 0], meaning that the
    // current center is the same as it was when the attributes were recomputed.

    this.centerAtLastUpdate = fromValues(this.view.state.center[0], this.view.state.center[1]);
  },
  // Called once a custom layer is removed from the map.layers collection and this layer view is destroyed.
  detach: function () {
    // Stop watching the `layer.graphics` collection.
    this.watcher.remove();
    const gl = this.context; // Delete buffers and programs.

    gl.deleteBuffer(this.vertexBuffer);
    gl.deleteBuffer(this.indexBuffer);
    gl.deleteProgram(this.program);
  },
  // Called every time a frame is rendered.
  render: function (renderParameters) {
    const gl = renderParameters.context;
    const state = renderParameters.state; // Update vertex positions. This may trigger an update of
    // the vertex coordinates contained in the vertex buffer.
    // There are three kinds of updates:
    //  - Modification of the layer.graphics collection ==> Buffer update
    //  - The view state becomes non-stationary ==> Only view update, no buffer update
    //  - The view state becomes stationary ==> Buffer update

    this.updatePositions(renderParameters); // If there is nothing to render we return.

    if (this.indexBufferSize === 0) {
      return;
    } // Update view `transform` matrix; it converts from map units to pixels.


    identity(this.transform);
    this.screenTranslation[0] = state.pixelRatio * state.size[0] / 2;
    this.screenTranslation[1] = state.pixelRatio * state.size[1] / 2;
    translate(this.transform, this.transform, this.screenTranslation);
    rotate(this.transform, this.transform, Math.PI * state.rotation / 180);
    this.screenScaling[0] = state.pixelRatio / state.resolution;
    this.screenScaling[1] = -state.pixelRatio / state.resolution;
    scale(this.transform, this.transform, this.screenScaling);
    translate(this.transform, this.transform, this.translationToCenter); // Update view `display` matrix; it converts from pixels to normalized device coordinates.

    this.display[0] = 2 / (state.pixelRatio * state.size[0]);
    this.display[4] = -2 / (state.pixelRatio * state.size[1]); // Draw.

    gl.useProgram(this.program);
    gl.uniformMatrix3fv(this.uTransform, false, this.transform);
    gl.uniformMatrix3fv(this.uDisplay, false, this.display);
    gl.uniform1f(this.uCurrentTime, performance.now() / 1000.0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.enableVertexAttribArray(this.aPosition);
    gl.enableVertexAttribArray(this.aOffset);
    gl.vertexAttribPointer(this.aPosition, 2, gl.FLOAT, false, 16, 0);
    gl.vertexAttribPointer(this.aOffset, 2, gl.FLOAT, false, 16, 8);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.drawElements(gl.TRIANGLES, this.indexBufferSize, gl.UNSIGNED_SHORT, 0); // Request new render because markers are animated.

    this.requestRender();
  },
  // Called by the map view or the popup view when hit testing is required.
  hitTest: function (x, y) {
    // The map view.
    const view = this.view;

    if (this.layer.graphics.length === 0) {
      // Nothing to do.
      return resolve(null);
    } // Compute screen distance between each graphic and the test point.


    const distances = this.layer.graphics.map(graphic => {
      const graphicPoint = view.toScreen(graphic.geometry);
      return Math.sqrt((graphicPoint.x - x) * (graphicPoint.x - x) + (graphicPoint.y - y) * (graphicPoint.y - y));
    }); // Find the minimum distance.

    let minIndex = 0;
    distances.forEach((distance, i) => {
      if (distance < distances.getItemAt(minIndex)) {
        minIndex = i;
      }
    });
    const minDistance = distances.getItemAt(minIndex); // If the minimum distance is more than 35 pixel then nothing was hit.

    if (minDistance > 35) {
      return resolve(null);
    } // Otherwise it is a hit; We set the layer as the source layer for the graphic
    // (required for the popup view to work) and we return a resolving promise to
    // the graphic.


    const graphic = this.layer.graphics.getItemAt(minIndex);
    graphic.sourceLayer = this.layer;
    return resolve(graphic);
  },
  // Called internally from render().
  updatePositions: function (renderParameters) {
    const gl = renderParameters.context;
    const stationary = renderParameters.stationary;
    const state = renderParameters.state; // If we are not stationary we simply update the `translationToCenter` vector.

    if (!stationary) {
      sub(this.translationToCenter, this.centerAtLastUpdate, state.center);
      this.requestRender();
      return;
    } // If we are stationary, the `layer.graphics` collection has not changed, and
    // we are centered on the `centerAtLastUpdate`, we do nothing.


    if (!this.needsUpdate && this.translationToCenter[0] === 0 && this.translationToCenter[1] === 0) {
      return;
    } // Otherwise, we record the new encoded center, which imply a reset of the `translationToCenter` vector,
    // we record the update time, and we proceed to update the buffers.


    this.centerAtLastUpdate.set(state.center);
    this.translationToCenter[0] = 0;
    this.translationToCenter[1] = 0;
    this.needsUpdate = false;
    const graphics = this.layer.graphics; // Generate vertex data.

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    const vertexData = new Float32Array(16 * graphics.length);
    let i = 0;
    graphics.forEach(graphic => {
      const point = graphic.geometry; // The (x, y) position is relative to the encoded center.

      const x = point.x - this.centerAtLastUpdate[0];
      const y = point.y - this.centerAtLastUpdate[1];
      vertexData[i * 16 + 0] = x;
      vertexData[i * 16 + 1] = y;
      vertexData[i * 16 + 2] = -0.5;
      vertexData[i * 16 + 3] = -0.5;
      vertexData[i * 16 + 4] = x;
      vertexData[i * 16 + 5] = y;
      vertexData[i * 16 + 6] = 0.5;
      vertexData[i * 16 + 7] = -0.5;
      vertexData[i * 16 + 8] = x;
      vertexData[i * 16 + 9] = y;
      vertexData[i * 16 + 10] = -0.5;
      vertexData[i * 16 + 11] = 0.5;
      vertexData[i * 16 + 12] = x;
      vertexData[i * 16 + 13] = y;
      vertexData[i * 16 + 14] = 0.5;
      vertexData[i * 16 + 15] = 0.5;
      ++i;
    });
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW); // Generates index data.

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    const indexData = new Uint16Array(6 * graphics.length);

    for (let i = 0; i < graphics.length; ++i) {
      indexData[i * 6 + 0] = i * 4 + 0;
      indexData[i * 6 + 1] = i * 4 + 1;
      indexData[i * 6 + 2] = i * 4 + 2;
      indexData[i * 6 + 3] = i * 4 + 1;
      indexData[i * 6 + 4] = i * 4 + 3;
      indexData[i * 6 + 5] = i * 4 + 2;
    }

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW); // Record number of indices.

    this.indexBufferSize = indexData.length;
  }
});

// @ts-ignore

const RippleGraphicsLayer = GraphicsLayer.createSubclass({
  createLayerView: function (view) {
    // We only support MapView, so we only need to return a
    // custom layer view for the `2d` case.
    if (view.type === '2d') {
      return new RippleLayerView({
        view: view,
        layer: this
      });
    }
  }
});

// @ts-ignore

const AnimatedLinesLayerView = BaseLayerViewGL2D.createSubclass({
  // Locations of the two vertex attributes that we use. They
  // will be bound to the shader program before linking.
  aPosition: 0,
  aOffset: 1,
  aDistance: 2,
  aSide: 3,
  aColor: 4,
  constructor: function () {
    // Geometrical transformations that must be recomputed
    // from scratch at every frame.
    this.transform = create$4();
    this.extrude = create$4();
    this.translationToCenter = create();
    this.screenTranslation = create(); // Geometrical transformations whose only a few elements
    // must be updated per frame. Those elements are marked
    // with NaN.

    this.display = fromValues$2(NaN, 0, 0, 0, NaN, 0, -1, 1, 1);
    this.screenScaling = fromValues$1(NaN, NaN, 1); // Whether the vertex and index buffers need to be updated
    // due to a change in the layer data.

    this.needsUpdate = false; // We listen for changes to the graphics collection of the layer
    // and trigger the generation of new frames. A frame rendered while
    // `needsUpdate` is true may cause an update of the vertex and
    // index buffers.

    const requestUpdate = () => {
      this.needsUpdate = true;
      this.requestRender();
    };

    this.watcher = on(this, 'layer.graphics', 'change', requestUpdate, requestUpdate, requestUpdate);
  },
  // Called once a custom layer is added to the map.layers collection and this layer view is instantiated.
  attach: function () {
    const gl = this.context;
    const animatedOptions = this.layer.animatedOptions;
    const trailSpeed = ((animatedOptions === null || animatedOptions === void 0 ? void 0 : animatedOptions.trailSpeed) ?? 50.0).toFixed(2);
    const trailLength = ((animatedOptions === null || animatedOptions === void 0 ? void 0 : animatedOptions.trailLength) ?? 300.0).toFixed(2);
    const trailCycle = ((animatedOptions === null || animatedOptions === void 0 ? void 0 : animatedOptions.trailCycle) ?? 1000.0).toFixed(2);
    const vertexSource = `
      precision highp float;

      uniform mat3 u_transform;
      uniform mat3 u_extrude;
      uniform mat3 u_display;

      attribute vec2 a_position;
      attribute vec2 a_offset;
      attribute float a_distance;
      attribute float a_side;
      attribute vec4 a_color;

      varying float v_distance;
      varying float v_side;
      varying vec4 v_color;

      void main(void) {
        gl_Position.xy = (u_display * (u_transform * vec3(a_position, 1.0) + u_extrude * vec3(a_offset, 0.0))).xy;
        gl_Position.zw = vec2(0.0, 1.0);
        v_distance = a_distance;
        v_side = a_side;
        v_color = a_color;
      }`;
    const fragmentSource = `
      precision highp float;

      uniform float u_current_time;

      varying float v_distance;
      varying float v_side;
      varying vec4 v_color;

      const float TRAIL_SPEED = ${trailSpeed};
      const float TRAIL_LENGTH = ${trailLength};
      const float TRAIL_CYCLE = ${trailCycle};

      void main(void) {
        float d = mod(v_distance - u_current_time * TRAIL_SPEED, TRAIL_CYCLE);
        float a1 = d < TRAIL_LENGTH ? mix(0.0, 1.0, d / TRAIL_LENGTH) : 0.0;
        float a2 = exp(-abs(v_side) * 3.0);
        float a = a1 * a2;
        gl_FragColor = v_color * a;
      }`;
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexSource);
    gl.compileShader(vertexShader);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentSource);
    gl.compileShader(fragmentShader); // Create the shader program.

    this.program = gl.createProgram();
    gl.attachShader(this.program, vertexShader);
    gl.attachShader(this.program, fragmentShader); // Bind attributes.

    gl.bindAttribLocation(this.program, this.aPosition, 'a_position');
    gl.bindAttribLocation(this.program, this.aOffset, 'a_offset');
    gl.bindAttribLocation(this.program, this.aDistance, 'a_distance');
    gl.bindAttribLocation(this.program, this.aSide, 'a_side');
    gl.bindAttribLocation(this.program, this.aColor, 'a_color'); // Link.

    gl.linkProgram(this.program); // Shader objects are not needed anymore.

    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader); // Retrieve uniform locations once and for all.

    this.uTransform = gl.getUniformLocation(this.program, 'u_transform');
    this.uExtrude = gl.getUniformLocation(this.program, 'u_extrude');
    this.uDisplay = gl.getUniformLocation(this.program, 'u_display');
    this.uCurrentTime = gl.getUniformLocation(this.program, 'u_current_time'); // Create the vertex and index buffer. They are initially empty. We need to track the
    // size of the index buffer because we use indexed drawing.

    this.vertexBuffer = gl.createBuffer();
    this.indexBuffer = gl.createBuffer(); // Number of indices in the index buffer.

    this.indexBufferSize = 0; // When certain conditions occur, we update the buffers and re-compute and re-encode
    // all the attributes. When buffer update occurs, we also take note of the current center
    // of the view state, and we reset a vector called `translationToCenter` to [0, 0], meaning that the
    // current center is the same as it was when the attributes were recomputed.

    this.centerAtLastUpdate = fromValues(this.view.state.center[0], this.view.state.center[1]);
  },
  // Called once a custom layer is removed from the map.layers collection and this layer view is destroyed.
  detach: function () {
    // Stop watching the `layer.graphics` collection.
    this.watcher.remove();
    const gl = this.context; // Delete buffers and programs.

    gl.deleteBuffer(this.vertexBuffer);
    gl.deleteBuffer(this.indexBuffer);
    gl.deleteProgram(this.program);
  },
  // Called every time a frame is rendered.
  render: function (renderParameters) {
    const gl = renderParameters.context;
    const state = renderParameters.state; // Update vertex positions. This may trigger an update of
    // the vertex coordinates contained in the vertex buffer.
    // There are three kinds of updates:
    //  - Modification of the layer.graphics collection ==> Buffer update
    //  - The view state becomes non-stationary ==> Only view update, no buffer update
    //  - The view state becomes stationary ==> Buffer update

    this.updatePositions(renderParameters); // If there is nothing to render we return.

    if (this.indexBufferSize === 0) {
      return;
    } // Update view `transform` matrix; it converts from map units to pixels.


    identity(this.transform);
    this.screenTranslation[0] = state.pixelRatio * state.size[0] / 2;
    this.screenTranslation[1] = state.pixelRatio * state.size[1] / 2;
    translate(this.transform, this.transform, this.screenTranslation);
    rotate(this.transform, this.transform, Math.PI * state.rotation / 180);
    this.screenScaling[0] = state.pixelRatio / state.resolution;
    this.screenScaling[1] = -state.pixelRatio / state.resolution;
    scale(this.transform, this.transform, this.screenScaling);
    translate(this.transform, this.transform, this.translationToCenter); // Update view `extrude` matrix; it causes offset vectors to rotate and scale
    // with the view, but caps the maximum width a polyline is allowed to be.

    identity(this.extrude);
    rotate(this.extrude, this.extrude, Math.PI * state.rotation / 180);
    const HALF_WIDTH = 6;
    scale(this.extrude, this.extrude, [HALF_WIDTH, -HALF_WIDTH, 1]); // Update view `display` matrix; it converts from pixels to normalized device coordinates.

    this.display[0] = 2 / (state.pixelRatio * state.size[0]);
    this.display[4] = -2 / (state.pixelRatio * state.size[1]); // Draw.

    gl.useProgram(this.program);
    gl.uniformMatrix3fv(this.uTransform, false, this.transform);
    gl.uniformMatrix3fv(this.uExtrude, false, this.extrude);
    gl.uniformMatrix3fv(this.uDisplay, false, this.display);
    gl.uniform1f(this.uCurrentTime, performance.now() / 1000.0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.enableVertexAttribArray(this.aPosition);
    gl.enableVertexAttribArray(this.aOffset);
    gl.enableVertexAttribArray(this.aDistance);
    gl.enableVertexAttribArray(this.aSide);
    gl.enableVertexAttribArray(this.aColor);
    gl.vertexAttribPointer(this.aPosition, 2, gl.FLOAT, false, 28, 0);
    gl.vertexAttribPointer(this.aOffset, 2, gl.FLOAT, false, 28, 8);
    gl.vertexAttribPointer(this.aDistance, 1, gl.FLOAT, false, 28, 16);
    gl.vertexAttribPointer(this.aSide, 1, gl.FLOAT, false, 28, 20);
    gl.vertexAttribPointer(this.aColor, 4, gl.UNSIGNED_BYTE, true, 28, 24);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.drawElements(gl.TRIANGLES, this.indexBufferSize, gl.UNSIGNED_SHORT, 0); // Request new render because markers are animated.

    this.requestRender();
  },
  // Called internally from render().
  updatePositions: function (renderParameters) {
    const gl = renderParameters.context;
    const stationary = renderParameters.stationary;
    const state = renderParameters.state;
    const animatedOptions = this.layer.animatedOptions;
    const defaultColor = (animatedOptions === null || animatedOptions === void 0 ? void 0 : animatedOptions.defaultColor) ?? [255, 0, 0]; // If we are not stationary we simply update the `translationToCenter` vector.

    if (!stationary) {
      sub(this.translationToCenter, this.centerAtLastUpdate, state.center);
      this.requestRender();
      return;
    } // If we are stationary, the `layer.graphics` collection has not changed, and
    // we are centered on the `centerAtLastUpdate`, we do nothing.


    if (!this.needsUpdate && this.translationToCenter[0] === 0 && this.translationToCenter[1] === 0) {
      return;
    } // Otherwise, we record the new encoded center, which imply a reset of the `translationToCenter` vector,
    // we record the update time, and we proceed to update the buffers.


    this.centerAtLastUpdate.set(state.center);
    this.translationToCenter[0] = 0;
    this.translationToCenter[1] = 0;
    this.needsUpdate = false;
    const graphics = this.layer.graphics; // Allocate memory.

    let vtxCount = 0;
    let idxCount = 0;

    for (let i = 0; i < graphics.items.length; ++i) {
      const graphic = graphics.items[i];
      const path = graphic.geometry.paths[0];
      vtxCount += path.length * 2;
      idxCount += (path.length - 1) * 6;
    }

    const vertexData = new ArrayBuffer(7 * vtxCount * 4);
    const floatData = new Float32Array(vertexData);
    const colorData = new Uint8Array(vertexData);
    const indexData = new Uint16Array(idxCount); // Generate attribute and index data. These cursors count the number
    // of GPU vertices and indices emitted by the triangulator; writes to
    // vertex and index memory occur at the positions pointed by the cursors.

    let vtxCursor = 0;
    let idxCursor = 0;

    for (let i = 0; i < graphics.items.length; ++i) {
      var _graphic$attributes;

      const graphic = graphics.items[i];
      const path = graphic.geometry.paths[0];
      const color = ((_graphic$attributes = graphic.attributes) === null || _graphic$attributes === void 0 ? void 0 : _graphic$attributes['color']) ?? defaultColor; // Initialize new triangulation state.

      const s = {}; // eslint-disable-line
      // Process each vertex.

      for (let j = 0; j < path.length; ++j) {
        // Point p is an original vertex of the polyline; we need to produce two extruded
        // GPU vertices, for each original vertex.
        const p = path[j];

        if (s.current) {
          // If this is not the first point, we compute the vector between the previous
          // and the next vertex.
          s.delta = [p[0] - s.current[0], p[1] - s.current[1]]; // And we normalize it. This is the direction of the current line segment
          // that we are processing.

          const deltaLength = Math.sqrt(s.delta[0] * s.delta[0] + s.delta[1] * s.delta[1]);
          s.direction = [s.delta[0] / deltaLength, s.delta[1] / deltaLength]; // We want to compute the normal to that segment. The normal of a
          // vector (x, y) can be computed by rotating it by 90 degrees; this yields (-y, x).

          const normal = [-s.direction[1], s.direction[0]];

          if (s.normal) {
            // If there is already a normal vector in the state, then the offset is the
            // average of that normal and the next normal, i.e. the bisector of the turn.
            s.offset = [s.normal[0] + normal[0], s.normal[1] + normal[1]]; // We first normalize it.

            const offsetLength = Math.sqrt(s.offset[0] * s.offset[0] + s.offset[1] * s.offset[1]);
            s.offset[0] /= offsetLength;
            s.offset[1] /= offsetLength; // Then we scale it like the cosine of the half turn angle. This can
            // be computed as the dot product between the previous normal and the
            // normalized bisector.

            const d = s.normal[0] * s.offset[0] + s.normal[1] * s.offset[1];
            s.offset[0] /= d;
            s.offset[1] /= d;
          } else {
            // Otherwise, this is the offset of the first vertex; it is equal to the
            // normal we just computed.
            s.offset = [normal[0], normal[1]];
          } // All the values that we computed are written to the first GPU vertex.


          floatData[vtxCursor * 7 + 0] = s.current[0] - this.centerAtLastUpdate[0];
          floatData[vtxCursor * 7 + 1] = s.current[1] - this.centerAtLastUpdate[1];
          floatData[vtxCursor * 7 + 2] = s.offset[0];
          floatData[vtxCursor * 7 + 3] = s.offset[1];
          floatData[vtxCursor * 7 + 4] = s.distance;
          floatData[vtxCursor * 7 + 5] = +1;
          colorData[4 * (vtxCursor * 7 + 6) + 0] = color[0];
          colorData[4 * (vtxCursor * 7 + 6) + 1] = color[1];
          colorData[4 * (vtxCursor * 7 + 6) + 2] = color[2];
          colorData[4 * (vtxCursor * 7 + 6) + 3] = 255; // We also write the same values to the second vertex, but we negate the
          // offset and the side (these are the attributes at positions +9, +10 and +12).

          floatData[vtxCursor * 7 + 7] = s.current[0] - this.centerAtLastUpdate[0];
          floatData[vtxCursor * 7 + 8] = s.current[1] - this.centerAtLastUpdate[1];
          floatData[vtxCursor * 7 + 9] = -s.offset[0];
          floatData[vtxCursor * 7 + 10] = -s.offset[1];
          floatData[vtxCursor * 7 + 11] = s.distance;
          floatData[vtxCursor * 7 + 12] = -1;
          colorData[4 * (vtxCursor * 7 + 13) + 0] = color[0];
          colorData[4 * (vtxCursor * 7 + 13) + 1] = color[1];
          colorData[4 * (vtxCursor * 7 + 13) + 2] = color[2];
          colorData[4 * (vtxCursor * 7 + 13) + 3] = 255;
          vtxCursor += 2;

          if (j >= 2) {
            // If this is the third iteration then it means that we have emitted
            // four GPU vertices already; we can form a triangle with them.
            indexData[idxCursor + 0] = vtxCursor - 4;
            indexData[idxCursor + 1] = vtxCursor - 3;
            indexData[idxCursor + 2] = vtxCursor - 2;
            indexData[idxCursor + 3] = vtxCursor - 3;
            indexData[idxCursor + 4] = vtxCursor - 1;
            indexData[idxCursor + 5] = vtxCursor - 2;
            idxCursor += 6;
          } // The next normal becomes the current normal at the next iteration.


          s.normal = normal; // We increment the distance along the line by the length of the segment
          // that we just processed.

          s.distance += deltaLength;
        } else {
          s.distance = 0;
        } // We move to the next point.


        s.current = p;
      } // Finishing up (last 2 extruded vertices and 6 indices).


      s.offset = [s.normal[0], s.normal[1]];
      floatData[vtxCursor * 7 + 0] = s.current[0] - this.centerAtLastUpdate[0];
      floatData[vtxCursor * 7 + 1] = s.current[1] - this.centerAtLastUpdate[1];
      floatData[vtxCursor * 7 + 2] = s.offset[0];
      floatData[vtxCursor * 7 + 3] = s.offset[1];
      floatData[vtxCursor * 7 + 4] = s.distance;
      floatData[vtxCursor * 7 + 5] = +1;
      colorData[4 * (vtxCursor * 7 + 6) + 0] = color[0];
      colorData[4 * (vtxCursor * 7 + 6) + 1] = color[1];
      colorData[4 * (vtxCursor * 7 + 6) + 2] = color[2];
      colorData[4 * (vtxCursor * 7 + 6) + 3] = 255;
      floatData[vtxCursor * 7 + 7] = s.current[0] - this.centerAtLastUpdate[0];
      floatData[vtxCursor * 7 + 8] = s.current[1] - this.centerAtLastUpdate[1];
      floatData[vtxCursor * 7 + 9] = -s.offset[0];
      floatData[vtxCursor * 7 + 10] = -s.offset[1];
      floatData[vtxCursor * 7 + 11] = s.distance;
      floatData[vtxCursor * 7 + 12] = -1;
      colorData[4 * (vtxCursor * 7 + 13) + 0] = color[0];
      colorData[4 * (vtxCursor * 7 + 13) + 1] = color[1];
      colorData[4 * (vtxCursor * 7 + 13) + 2] = color[2];
      colorData[4 * (vtxCursor * 7 + 13) + 3] = 255;
      vtxCursor += 2;
      indexData[idxCursor + 0] = vtxCursor - 4;
      indexData[idxCursor + 1] = vtxCursor - 3;
      indexData[idxCursor + 2] = vtxCursor - 2;
      indexData[idxCursor + 3] = vtxCursor - 3;
      indexData[idxCursor + 4] = vtxCursor - 1;
      indexData[idxCursor + 5] = vtxCursor - 2;
      idxCursor += 6; // There is no next vertex.

      s.current = null;
    } // Upload data to the GPU.


    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW); // Record number of indices.

    this.indexBufferSize = indexData.length;
  }
});

// @ts-ignore

const AnimatedLinesLayer = GraphicsLayer.createSubclass({
  createLayerView: function (view) {
    if (view.type === '2d') {
      return new AnimatedLinesLayerView({
        view: view,
        layer: this
      });
    }
  }
});

export { AnimatedLinesLayer, Basemap, DrawPointTool, DrawPolygonTool, DrawPolylineTool, DrawRectangleFasterTool, DrawRectangleTool, FssgEsri, FssgEsriPlugin, GeometryFacory, Hawkeye, HitTestTool, LayerTree, MapCursor, MapElement, MapLayers, MapModules, MapPopups, MapTools, MeasureAreaTool, MeasureCoordinateTool, MeasureLengthTool, MouseTips, Overlays, RippleGraphicsLayer, RippleLayerView, SelectByPolygonTool, ViewCliper, ZoomHomeTool, ZoomInRectTool, ZoomOutRectTool, createGeometryFactory, createLayerFactory, getLatfromLonLat, getLonfromLonLat, getXfromXY, getYfromXY };
