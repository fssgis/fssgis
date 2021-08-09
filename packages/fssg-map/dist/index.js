import { deepCopy, $extend } from '@fssgis/utils';
import { Observable } from '@fssgis/observable';

/**
 * 基类（抽象类）
 */
class BaseClass extends Observable {
    //#region 私有属性
    /**
     * 实例初始化完成状态
     */
    _loaded;
    //#endregion
    //#region 保护属性
    /**
     * 实例配置项
     */
    options_;
    //#endregion
    //#region 构造函数
    /**
     * 构造基类
     * @param options 配置项
     * @param defaultOptions 默认配置项
     */
    constructor(options = {}, defaultOptions = {}) {
        super();
        this.options_ = deepCopy(defaultOptions);
        $extend(true, this.options_, options);
        this._loaded = false;
        this.once('loaded', () => this._loaded = true);
    }
    //#endregion
    //#region 公有方法
    /**
     * 监听实例初始化完成
     * @param callback 实例初始化完成回调函数
     */
    when(callback) {
        return new Promise(resolve => {
            if (this._loaded) {
                callback?.();
                resolve();
            }
            else {
                this.once('loaded', () => {
                    callback?.();
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
    _container;
    //#endregion
    //#region getter settter
    /**
     * 地图容器
     */
    get container() {
        return this._container;
    }
    //#endregion
    //#region 构造函数
    /**
     * 构造地图应用实例
     * @param container 地图容器
     * @param options 配置项
     * @param defaultOptions 默认配置项
     */
    constructor(container, options, defaultOptions) {
        super(options, defaultOptions);
        this._container = container;
        this._initDebug();
    }
    //#endregion
    /**
     * 初始化调试
     * @returns this
     */
    _initDebug() {
        const { debug, debugName } = this.options_;
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
    //#region 保护属性
    /**
     * 插件名
     */
    pluginName_;
    //#endregion
    //#region getter setter
    /**
     * 插件名
     */
    get pluginName() {
        return this.pluginName_;
    }
    //#endregion
    //#region 构造函数
    /**
     *构造地图应用插件实例
     * @param pluginName 插件名
     * @param options 配置项
     * @param defaultOptions 默认配置项
     */
    constructor(options, defaultOptions) {
        super(options, defaultOptions);
        const name = this.constructor.name;
        this.pluginName_ = name.replace(name[0], name[0].toLowerCase());
    }
}

export { BaseClass, FssgMap, FssgMapPlugin };