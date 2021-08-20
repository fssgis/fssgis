import { deepCopy, $extend } from '@fssgis/utils';
import { Observable } from '@fssgis/observable';

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
 * 基类（抽象类）
 */

class BaseClass extends Observable {
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
  constructor(options = {}, defaultOptions = {}) {
    super();

    _defineProperty(this, "_loaded", void 0);

    _defineProperty(this, "options_", void 0);

    this.options_ = deepCopy(defaultOptions);
    $extend(true, this.options_, options);
    this._loaded = false;
    this.once('loaded', () => this._loaded = true);
  } //#endregion
  //#region 公有方法

  /**
   * 监听实例初始化完成
   * @param callback 实例初始化完成回调函数
   */


  when(callback) {
    return new Promise(resolve => {
      if (this._loaded) {
        callback === null || callback === void 0 ? void 0 : callback();
        resolve();
      } else {
        this.once('loaded', () => {
          callback === null || callback === void 0 ? void 0 : callback();
          resolve();
        });
      }
    });
  }

}

/**
 * 地图应用类（抽象类）
 */

class FssgMap extends BaseClass {
  //#region 私有属性

  /**
   * 地图容器
   */
  //#endregion
  //#region getter settter

  /**
   * 地图容器
   */
  get container() {
    return this._container;
  } //#endregion
  //#region 构造函数

  /**
   * 构造地图应用实例
   * @param container 地图容器
   * @param options 配置项
   * @param defaultOptions 默认配置项
   */


  constructor(container, options, defaultOptions) {
    super(options, defaultOptions);

    _defineProperty(this, "_container", void 0);

    this._container = container;

    this._initDebug();
  } //#endregion

  /**
   * 初始化调试
   * @returns this
   */


  _initDebug() {
    const {
      debug,
      debugName
    } = this.options_;

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


  use(plugin) {
    this.when().then(() => {
      this[plugin.pluginName] = plugin.installPlugin(this); // eslint-disable-line

      plugin.fire('loaded');
    });
    return this;
  }

}

/**
 * 地图应用插件类（抽象类）
 */

class FssgMapPlugin extends BaseClass {
  /**
   * 从地图应用实例中获取地图应用插件实例
   * @param fssgMap 地图应用
   * @returns 地图应用插件
   */
  static getFrom(fssgMap) {
    const name = this.name;
    return fssgMap[name.replace(name[0], name[0].toLowerCase())];
  } //#region 保护属性

  /**
   * 插件名
   */


  //#endregion
  //#region getter setter

  /**
   * 插件名
   */
  get pluginName() {
    return this.pluginName_;
  } //#endregion
  //#region 构造函数

  /**
   *构造地图应用插件实例
   * @param pluginName 插件名
   * @param options 配置项
   * @param defaultOptions 默认配置项
   */


  constructor(options, defaultOptions) {
    super(options, defaultOptions);

    _defineProperty(this, "pluginName_", void 0);

    const name = this.constructor.name;
    this.pluginName_ = name.replace(name[0], name[0].toLowerCase());
  }

}

/** 天地图密钥 */
const TIAN_DI_TU_KEY = 'd524142425d379adcf285daba823e28a';
/** 天地图墨卡托投影路径集合 */

const BASEMAP_TIAN_DI_TU_3857 = {
  '影像底图': `http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIAN_DI_TU_KEY}`,
  '影像注记': `http://t0.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIAN_DI_TU_KEY}`,
  '矢量底图': `http://t0.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIAN_DI_TU_KEY}`,
  '矢量注记': `http://t0.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIAN_DI_TU_KEY}`,
  '地形底图': `http://t0.tianditu.gov.cn/ter_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIAN_DI_TU_KEY}`,
  '地形注记': `http://t0.tianditu.gov.cn/cta_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIAN_DI_TU_KEY}`
};
/** 天地图经纬度投影路径集合 */

const BASEMAP_TIAN_DI_TU_4326 = {
  '影像底图': `http://t0.tianditu.gov.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIAN_DI_TU_KEY}`,
  '影像注记': `http://t0.tianditu.gov.cn/cia_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIAN_DI_TU_KEY}`,
  '矢量底图': `http://t0.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIAN_DI_TU_KEY}`,
  '矢量注记': `http://t0.tianditu.gov.cn/cva_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIAN_DI_TU_KEY}`,
  '地形底图': `http://t0.tianditu.gov.cn/ter_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIAN_DI_TU_KEY}`,
  '地形注记': `http://t0.tianditu.gov.cn/cta_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIAN_DI_TU_KEY}`
};

class BaseTool extends BaseClass {
  get isOnceTool() {
    return this._isOnceTool;
  }

  get actived() {
    return this._actived;
  }

  constructor(options, defaultOptions) {
    super(options, {
      isOnceTool: true,
      ...defaultOptions
    });

    _defineProperty(this, "_isOnceTool", void 0);

    _defineProperty(this, "_actived", void 0);

    this._isOnceTool = !!this.options_.isOnceTool;
    this.on('tool-actived', e => this.onToolActived_(e));
    this.on('tool-deactived', e => this.onToolDeactived_(e));
  } //#region 保护方法

  /**
   * 工具激化处理事件
   */


  onToolActived_(e) {
    if (!this._actived) {
      return false;
    }

    return true;
  }
  /**
   * 工具失活处理事件
   */


  onToolDeactived_(e) {
    if (!this._actived) {
      return false;
    }

    this._actived = false;
    return true;
  } //#endregion
  //#region 公有方法

  /** 激活工具 */


  active() {
    if (this._actived) {
      return this;
    }

    this._actived = true;
    this.fire('tool-actived');

    if (this._isOnceTool) {
      this.deactive();
    }

    return this;
  }
  /** 接触工具激活状态 */


  deactive() {
    if (!this._actived) {
      return this;
    }

    this.fire('tool-deactived');
    return this;
  }

}

function warn(target, msg, ...others) {
  console.warn(`[FssgMap]: ${msg}`, ...others, target);
}
function error(target, msg, ...others) {
  console.error(`[FssgMap]: ${msg}`, ...others, target);
}

export { BASEMAP_TIAN_DI_TU_3857, BASEMAP_TIAN_DI_TU_4326, BaseClass, BaseTool, FssgMap, FssgMapPlugin, error, warn };
