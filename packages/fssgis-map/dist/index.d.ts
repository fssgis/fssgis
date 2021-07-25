import { Observable, ICallbackParams } from '@fssgis/observable';

/**
 * 基类事件集接口
 */
interface IBaseClassEvents {
    'loaded': void;
}
/**
 * 基类（抽象类）
 */
declare abstract class BaseClass<T_OPTIONS, T_EVENTS extends IBaseClassEvents = IBaseClassEvents> extends Observable<T_EVENTS> {
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
declare type IFssgMapPluginABSEvents = IBaseClassEvents;
/**
 * 地图应用插件类（抽象类）
 */
declare abstract class FssgMapPluginABS<T_OPTIONS, T_EVENTS extends IFssgMapPluginABSEvents = IFssgMapPluginABSEvents> extends BaseClass<T_OPTIONS, T_EVENTS> {
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

/**
 * 地图应用事件集接口
 */
declare type IFssgMapABSEvents = IBaseClassEvents;
/**
 * 地图容器
 */
declare type Container = string | HTMLDivElement;
/**
 * 地图应用配置项接口
 */
interface IFssgMapABSOptions {
    debug?: boolean;
    debugName?: string;
}
/**
 * 地图应用类（抽象类）
 */
declare abstract class FssgMapABS<T_OPTIONS extends IFssgMapABSOptions = IFssgMapABSOptions, T_EVENTS extends IFssgMapABSEvents = IFssgMapABSEvents> extends BaseClass<T_OPTIONS, T_EVENTS> {
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

declare const TDT_3857: Record<string, string>;
declare const TDT_4326: Record<string, string>;
declare const GEOQ: Record<string, string>;

declare type MapCursorType = 'default' | 'pan' | 'panning' | 'wait' | 'draw' | 'zoomin' | 'zoomout' | 'clear' | 'help';
declare const MAP_CURSOR_DIC: Record<MapCursorType, string>;

interface IBaseToolABSOptions {
    isOnceTool?: boolean;
}
interface IBaseToolABSEvents extends IBaseClassEvents {
    'tool-actived': void;
    'tool-deactived': void;
}
declare type OnToolActivedParams<THIS> = ICallbackParams<'tool-actived', THIS>;
declare type OnToolDeactivedParams<THIS> = ICallbackParams<'tool-deactived', THIS>;
declare type OnToolActivedReture = boolean;
declare type OnToolDeactivedReture = boolean;
declare abstract class BaseToolABS<T_OPTIONS extends IBaseToolABSOptions = IBaseToolABSOptions, T_EVENTS extends IBaseToolABSEvents = IBaseToolABSEvents> extends BaseClass<T_OPTIONS, T_EVENTS> {
    private _isOnceTool;
    private _actived;
    get isOnceTool(): boolean;
    get actived(): boolean;
    constructor(options?: T_OPTIONS, defaultOptions?: T_OPTIONS);
    /**
     * 工具激化处理事件
     */
    protected onToolActived_(e: OnToolActivedParams<this>): OnToolActivedReture;
    /**
     * 工具失活处理事件
     */
    protected onToolDeactived_(e: OnToolDeactivedParams<this>): OnToolDeactivedReture;
    /** 激活工具 */
    active(): this;
    /** 接触工具激活状态 */
    deactive(): this;
}

export { BaseClass, BaseToolABS, Container, FssgMapABS, FssgMapPluginABS, GEOQ, IBaseClassEvents, IBaseToolABSEvents, IBaseToolABSOptions, IFssgMapABSEvents, IFssgMapABSOptions, IFssgMapPluginABSEvents, MAP_CURSOR_DIC, MapCursorType, OnToolActivedParams, OnToolActivedReture, OnToolDeactivedParams, OnToolDeactivedReture, TDT_3857, TDT_4326 };
