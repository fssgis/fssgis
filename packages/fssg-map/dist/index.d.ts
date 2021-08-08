import { Observable } from '@fssgis/observable';

/**
 * 基类事件集接口
 */
interface IBaseClassEvents {
    /**
     * 类加载完成触发事件
     */
    'loaded': void;
}
/**
 * 基类配置项接口
 */
interface IBaseClassOptions {
}
/**
 * 基类（抽象类）
 */
declare abstract class BaseClass<T_OPTIONS extends IBaseClassOptions = IBaseClassOptions, T_EVENTS extends IBaseClassEvents = IBaseClassEvents> extends Observable<T_EVENTS & IBaseClassEvents> {
    /**
     * 实例初始化完成状态
     */
    private _loaded;
    /**
     * 实例配置项
     */
    protected options_: T_OPTIONS;
    /**
     * 构造基类
     * @param options 配置项
     * @param defaultOptions 默认配置项
     */
    constructor(options?: T_OPTIONS, defaultOptions?: T_OPTIONS);
    /**
     * 监听实例初始化完成
     * @param callback 实例初始化完成回调函数
     */
    when(callback?: () => void): Promise<void>;
}

/**
 * 地图应用插件事件集接口
 */
interface IFssgMapPluginEvents extends IBaseClassEvents {
}
/**
 * 地图应用插件配置项接口
 */
interface IFssgMapPluginOptions extends IBaseClassOptions {
}
/**
 * 地图应用插件类（抽象类）
 */
declare abstract class FssgMapPlugin<T_OPTIONS extends IFssgMapPluginOptions = IFssgMapPluginOptions, T_EVENTS extends IFssgMapPluginEvents = IFssgMapPluginEvents> extends BaseClass<T_OPTIONS & IFssgMapPluginOptions, T_EVENTS & IFssgMapPluginEvents> {
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
    constructor(options?: T_OPTIONS, defaultOptions?: T_OPTIONS);
    /**
     * 安装插件
     * @param fssgMap 地图应用实例
     */
    abstract installPlugin(fssgMap: FssgMap<any, any>): this;
}

/**
 * 地图应用事件集接口
 */
interface IFssgMapEvents extends IBaseClassEvents {
}
/**
 * 地图容器接口
 */
declare type IFssgMapContainer = string | HTMLDivElement;
/**
 * 地图应用配置项接口
 */
interface IFssgMapOptions {
    debug?: boolean;
    debugName?: string;
}
/**
 * 地图应用类（抽象类）
 */
declare abstract class FssgMap<T_OPTIONS extends IFssgMapOptions = IFssgMapOptions, T_EVENTS extends IFssgMapEvents = IFssgMapEvents> extends BaseClass<T_OPTIONS, T_EVENTS> {
    /**
     * 地图容器
     */
    private _container;
    /**
     * 地图容器
     */
    get container(): IFssgMapContainer;
    /**
     * 构造地图应用实例
     * @param container 地图容器
     * @param options 配置项
     * @param defaultOptions 默认配置项
     */
    constructor(container: IFssgMapContainer, options?: T_OPTIONS, defaultOptions?: T_OPTIONS);
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
    use<T, K extends IFssgMapPluginEvents>(plugin: FssgMapPlugin<T, K>): this;
    /**
     * 安装
     */
    abstract mount(): this;
}

export { BaseClass, FssgMap, FssgMapPlugin, IBaseClassEvents, IBaseClassOptions, IFssgMapContainer, IFssgMapEvents, IFssgMapOptions, IFssgMapPluginEvents, IFssgMapPluginOptions };
