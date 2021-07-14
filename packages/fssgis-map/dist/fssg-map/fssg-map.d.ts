import BaseClass, { IBaseClassEvents } from '../base-class';
import FssgMapPluginABS, { IFssgMapPluginABSEvents } from '../fssg-map-plugin';
/**
 * 地图应用事件集接口
 */
export declare type IFssgMapABSEvents = IBaseClassEvents;
/**
 * 地图容器
 */
export declare type Container = string | HTMLDivElement;
/**
 * 地图应用配置项接口
 */
export interface IFssgMapABSOptions {
    debug?: boolean;
    debugName?: string;
}
/**
 * 地图应用类（抽象类）
 */
export declare abstract class FssgMapABS<T_OPTIONS extends IFssgMapABSOptions = IFssgMapABSOptions, T_EVENTS extends IFssgMapABSEvents = IFssgMapABSEvents> extends BaseClass<T_OPTIONS, T_EVENTS> {
    /**
     * 地图容器
     */
    private _container;
    /**
     * 地图容器
     */
    get container(): Container;
    /**
     * 构造地图应用实例
     * @param container 地图容器
     * @param options 配置项
     * @param defaultOptions 默认配置项
     */
    constructor(container: Container, options?: T_OPTIONS, defaultOptions?: T_OPTIONS);
    /**
     * 初始化调试
     * @returns this
     */
    private _initDebug;
    /**
     * 安装地图应用插件
     * @param plugin 地图应用插件
     * @returns this
     */
    use<T, K extends IFssgMapPluginABSEvents>(plugin: FssgMapPluginABS<T, K>): this;
    /**
     * 安装
     */
    abstract mount(): this;
}
export default FssgMapABS;
