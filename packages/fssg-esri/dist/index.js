import { FssgMap, FssgMapPlugin } from '@fssgis/fssg-map';
import ArcGISMap from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import esriConfig from '@arcgis/core/config';

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

export { FssgEsri, FssgEsriPlugin };
