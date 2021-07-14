import BaseClass, { IBaseClassEvents } from '../base-class';
import FssgMapABS from '../fssg-map/fssg-map';
/**
 * 地图应用插件事件集接口
 */
export declare type IFssgMapPluginABSEvents = IBaseClassEvents;
/**
 * 地图应用插件类（抽象类）
 */
export declare abstract class FssgMapPluginABS<T_OPTIONS, T_EVENTS extends IFssgMapPluginABSEvents = IFssgMapPluginABSEvents> extends BaseClass<T_OPTIONS, T_EVENTS> {
    /**
     * 插件名
     */
    protected pluginName_: string;
    /**
     * 插件名
     */
    get pluginName(): string;
    /**
     *构造地图应用插件实例
     * @param pluginName 插件名
     * @param options 配置项
     * @param defaultOptions 默认配置项
     */
    constructor(pluginName: string, options?: T_OPTIONS, defaultOptions?: T_OPTIONS);
    /**
     * 安装插件
     * @param fssgMap 地图应用实例
     */
    abstract installPlugin(fssgMap: FssgMapABS<any, any>): this;
}
export default FssgMapPluginABS;
