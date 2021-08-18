import { FssgMap, FssgMapPlugin, BASEMAP_TIAN_DI_TU_3857, BASEMAP_TIAN_DI_TU_4326 } from '@fssgis/fssg-map';
import ArcGISMap from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import esriConfig from '@arcgis/core/config';
import WebTileLayer from '@arcgis/core/layers/WebTileLayer';
import EsriBasemap from '@arcgis/core/Basemap';

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
      // TODO msg
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
            layers.push(new WebTileLayer({
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
        layer = new WebTileLayer({
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
      this.createBasemapItem(`天地图${name}${proj}`, new WebTileLayer(Basemap[`BASEMAP_TIAN_DI_TU_${proj}`][`${name}底图`]));
      this.createBasemapItem(`天地图${name}含注记${proj}`, [new WebTileLayer(Basemap[`BASEMAP_TIAN_DI_TU_${proj}`][`${name}底图`]), new WebTileLayer(Basemap[`BASEMAP_TIAN_DI_TU_${proj}`][`${name}注记`])]);
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

export { Basemap, FssgEsri, FssgEsriPlugin };
