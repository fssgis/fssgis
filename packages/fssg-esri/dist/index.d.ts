import { IFssgMapPluginOptions, IFssgMapPluginEvents, FssgMapPlugin, IFssgMapOptions, IFssgMapEvents, FssgMap } from '@fssgis/fssg-map';

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

/**
 * 底图控制插件配置项
 */
interface IBasemapOptions extends IFssgEsriPluginOptions {
    items?: {
        key: string;
        type?: 'webtilelayer';
        url?: string;
        props?: __esri.LayerProperties;
        lyrs?: {
            type: 'webtilelayer';
            url: string;
            props?: __esri.LayerProperties;
        }[];
    }[];
    selectedKey?: string;
    visible?: boolean;
}
/**
 * 底图控制插件事件集
 */
interface IBasemapEvents extends IFssgEsriPluginEvents {
    'changed:selected-key': {
        selectedKey: string;
    };
    'changed:visible': {
        visible: boolean;
    };
}
/**
 * 底图控制插件
 */
declare class Basemap extends FssgEsriPlugin<IBasemapOptions, IBasemapEvents> {
    static readonly BASEMAP_TIAN_DI_TU_3857: Record<string, string>;
    static readonly BASEMAP_TIAN_DI_TU_4326: Record<string, string>;
    /**
     * 当前底图选中项
     */
    private _selectedKey;
    /**
     * 底图可见性
     */
    private _visible;
    /**
     * 底图项容器池
     */
    private _itemPool;
    /**
     * 底图可见性
     */
    get visible(): boolean;
    /**
     * 底图可见性
     */
    set visible(v: boolean);
    /**
     * 当前底图选中项
     */
    get selectedKey(): string;
    /**
     * 当前底图选中项
     */
    set selectedKey(key: string);
    /**
     * 构造底图控制插件
     * @param options 配置项
     */
    constructor(options?: IBasemapOptions);
    /**
     * 初始化
     * @returns this
     */
    private _init;
    /**
     * 创建天地图底图项
     * @returns this
     */
    private _createTianDiTu;
    installPlugin(fssgEsri: FssgEsri): this;
    /**
     * 创建底图项
     * @param key 底图项Key值
     * @param layer 底图图层
     */
    createBasemapItem(key: string, layer: __esri.Layer): this;
    /**
     * 创建底图项
     * @param key 底图项Key值
     * @param layers 底图图层数组
     */
    createBasemapItem(key: string, layers: __esri.Layer[]): this;
    /**
     * 创建底图项
     * @param key 底图项
     * @param arg1 底图图层 or 底图图层数组
     * @returns this
     */
    createBasemapItem(key: string, arg1: __esri.Layer | __esri.Layer[]): this;
}

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
    basemap: Basemap;
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

export { Basemap, FssgEsri, FssgEsriPlugin, IBasemapEvents, IBasemapOptions, IFssgEsriEvents, IFssgEsriOptions, IFssgEsriPluginEvents, IFssgEsriPluginOptions, IMap, IOwner, IView };
