import BaseClass from '../base-class';
/**
 * 地图应用插件类（抽象类）
 */
export class FssgMapPluginABS extends BaseClass {
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
    constructor(pluginName, options, defaultOptions) {
        super(options, defaultOptions);
        this.pluginName_ = pluginName;
    }
}
export default FssgMapPluginABS;
