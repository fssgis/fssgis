import BaseClass from '../base-class';
/**
 * 地图应用类（抽象类）
 */
export class FssgMapABS extends BaseClass {
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
export default FssgMapABS;
