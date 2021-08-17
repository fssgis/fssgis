import { IFssgMapOptions, IFssgMapEvents, FssgMap, IFssgMapPluginOptions, IFssgMapPluginEvents, FssgMapPlugin } from '@fssgis/fssg-map';

/**
 * 地图应用配置项
 */
interface IFssgEsriOptions extends IFssgMapOptions {
    mapOptions?: __esri.MapProperties;
    viewOptions?: __esri.MapViewProperties;
    assetsPath?: string;
}
/**
 * 地图应用事件集
 */
interface IFssgEsriEvents extends IFssgMapEvents {
    'center-ready': {
        center: __esri.Point;
    };
}
interface IOwner {
    $owner: FssgEsri;
}
declare type IMap = __esri.Map & IOwner;
declare type IView = __esri.MapView & IOwner;
declare class FssgEsri extends FssgMap<IFssgEsriOptions, IFssgEsriEvents> {
    /**
     * 地图对象
     */
    private _map;
    /**
      * 视图对象
      */
    private _view;
    /**
      * 地图对象
      */
    get map(): IMap;
    /**
      * 视图对象
      */
    get view(): IView;
    /**
     * 构造地图应用实例
     * @param container 地图容器
     * @param options 配置项
     */
    constructor(container: string, options?: IFssgEsriOptions);
    /**
     * 初始化地图
     * @returns this
     */
    private _initMap;
    /**
     * 初始化视图
     * @returns this
     */
    private _initView;
    /**
     * 初始化静态资源
     * @returns this
     */
    private _initAssetsPath;
    /**
     * 初始化地图容器样式（移除focus时的边框样式）
     * @returns this
     */
    private _initRemoveOnlineStyle;
    /**
     * 安装
     * @returns this
     */
    mount(): this;
}

/**
 * 地图应用插件配置项
 */
interface IFssgEsriPluginOptions extends IFssgMapPluginOptions {
}
/**
 * 地图应用插件事件集
 */
interface IFssgEsriPluginEvents extends IFssgMapPluginEvents {
}
declare class FssgEsriPlugin<T_OPTIONS extends IFssgEsriPluginOptions = IFssgEsriPluginOptions, T_EVENTS extends IFssgEsriPluginEvents = IFssgEsriPluginEvents> extends FssgMapPlugin<T_OPTIONS & IFssgEsriPluginOptions, T_EVENTS & IFssgEsriPluginEvents> {
    /**
     * 地图对象
     */
    protected map_: IMap;
    /**
     * 视图对象
     */
    protected view_: IView;
    /**
     * 绑定的地图应用实例
     */
    get $(): FssgEsri;
    /**
     * 安装插件
     * @param FssgEsri 地图应用实例
     * @returns this
     */
    installPlugin(fssgEsri: FssgEsri): this;
}

export { FssgEsri, FssgEsriPlugin, IFssgEsriEvents, IFssgEsriOptions, IFssgEsriPluginEvents, IFssgEsriPluginOptions, IMap, IOwner, IView };
