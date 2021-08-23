import { IFssgMapPluginOptions, IFssgMapPluginEvents, FssgMapPlugin, BaseTool, IBaseToolOptions, IBaseToolEvents, IFssgMapOptions, IFssgMapEvents, FssgMap } from '@fssgis/fssg-map';

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
/**
 * 地图应用插件抽象类
 */
declare abstract class FssgEsriPlugin<T_OPTIONS extends IFssgEsriPluginOptions = IFssgEsriPluginOptions, T_EVENTS extends IFssgEsriPluginEvents = IFssgEsriPluginEvents> extends FssgMapPlugin<T_OPTIONS & IFssgEsriPluginOptions, T_EVENTS & IFssgEsriPluginEvents> {
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
 * 图元样式接口
 */
interface IMapElementSymbol {
    marker?: __esri.SimpleMarkerSymbolProperties;
    line?: __esri.SimpleLineSymbolProperties;
    fill?: __esri.SimpleFillSymbolProperties;
}
/**
 * 图元控制插件配置项
 */
interface IMapElementOptions extends IFssgEsriPluginOptions {
    graphicsSymbol?: IMapElementSymbol;
    highlightSymbol?: IMapElementSymbol;
}
/**
 * 图元控制插件事件集
 */
interface IMapElementEvents extends IFssgEsriPluginEvents {
    'change': void;
}
/**
 * 图元控制插件
 */
declare class MapElement extends FssgEsriPlugin<IMapElementOptions, IMapElementEvents> {
    /** 基础图元样式 */
    private _graphicsSymbol;
    /** 高亮图元样式 */
    private _highlightSymbol;
    /** 基础图元存储图层 */
    private _graphicsLayer;
    /** 高亮图元存储图层 */
    private _highlightLayer;
    /** 图元图层存储图层组 */
    private _groupLayer;
    /**
     * 构造图元控制插件对象
     * @param options 配置项
     */
    constructor(options?: IMapElementOptions);
    private _init;
    private _getSymbol;
    private _addGraphics;
    private _addHighlight;
    installPlugin(fssgEsri: FssgEsri): this;
    add(geometry: __esri.Geometry, symbol?: __esri.SymbolProperties): __esri.Graphic;
    add(geometries: __esri.Geometry[], symbol?: __esri.SymbolProperties): __esri.Graphic[];
    add(arg0: __esri.Geometry[] | __esri.Geometry, symbol?: __esri.SymbolProperties): __esri.Graphic[] | __esri.Graphic;
    add(graphic: __esri.Graphic): this;
    add(graphics: __esri.Graphic[]): this;
    add(arg0: __esri.Graphic[] | __esri.Graphic): this;
    add(arg0: __esri.Graphic | __esri.Graphic[] | __esri.Geometry | __esri.Geometry[], arg1?: __esri.SymbolProperties): __esri.Graphic | __esri.Graphic[] | this;
    remove(graphic: __esri.Graphic): this;
    remove(graphics: __esri.Graphic[]): this;
    remove(arg0: __esri.Graphic | __esri.Graphic[]): this;
    clear(withHighlight?: boolean): this;
    set(geometry: __esri.Geometry, symbol: __esri.SymbolProperties): __esri.Graphic;
    set(geometries: __esri.Geometry[], symbol: __esri.SymbolProperties): __esri.Graphic[];
    set(arg0: __esri.Geometry[] | __esri.Geometry, symbol: __esri.SymbolProperties): __esri.Graphic[] | __esri.Graphic;
    set(graphic: __esri.Graphic): this;
    set(graphics: __esri.Graphic[]): this;
    set(arg0: __esri.Graphic[] | __esri.Graphic): this;
    set(arg0: __esri.Graphic | __esri.Graphic[] | __esri.Geometry | __esri.Geometry[], arg1?: __esri.SymbolProperties): __esri.Graphic | __esri.Graphic[] | this;
    addHighlight(geometry: __esri.Geometry, symbol?: __esri.SymbolProperties): __esri.Graphic;
    addHighlight(geometries: __esri.Geometry[], symbol?: __esri.SymbolProperties): __esri.Graphic[];
    addHighlight(arg0: __esri.Geometry[] | __esri.Geometry, symbol?: __esri.SymbolProperties): __esri.Graphic[] | __esri.Graphic;
    addHighlight(graphic: __esri.Graphic): this;
    addHighlight(graphics: __esri.Graphic[]): this;
    addHighlight(arg0: __esri.Graphic[] | __esri.Graphic): this;
    addHighlight(arg0: __esri.Graphic | __esri.Graphic[] | __esri.Geometry | __esri.Geometry[], arg1?: __esri.SymbolProperties): __esri.Graphic | __esri.Graphic[] | this;
    removeHighlight(graphic: __esri.Graphic): this;
    removeHighlight(graphics: __esri.Graphic[]): this;
    removeHighlight(arg0: __esri.Graphic | __esri.Graphic[]): this;
    clearHighlight(): this;
    setHighlight(geometry: __esri.Geometry, symbol: __esri.SymbolProperties): __esri.Graphic;
    setHighlight(geometries: __esri.Geometry[], symbol: __esri.SymbolProperties): __esri.Graphic[];
    setHighlight(arg0: __esri.Geometry[] | __esri.Geometry, symbol: __esri.SymbolProperties): __esri.Graphic[] | __esri.Graphic;
    setHighlight(graphic: __esri.Graphic): this;
    setHighlight(graphics: __esri.Graphic[]): this;
    setHighlight(arg0: __esri.Graphic[] | __esri.Graphic): this;
    setHighlight(arg0: __esri.Graphic | __esri.Graphic[] | __esri.Geometry | __esri.Geometry[], arg1?: __esri.SymbolProperties): __esri.Graphic | __esri.Graphic[] | this;
}

declare type IFssgEsriBaseToolOptions = IBaseToolOptions;
declare type IFssgEsriBaseToolEvents = IBaseToolEvents;
/**
 * 基础地图工具类
 */
declare class FssgEsriBaseTool<T_OPTIONS extends IFssgEsriBaseToolOptions = IFssgEsriBaseToolOptions, T_EVENTS extends IFssgEsriBaseToolEvents = IFssgEsriBaseToolEvents> extends BaseTool<T_OPTIONS & IFssgEsriBaseToolOptions, T_EVENTS & IFssgEsriBaseToolEvents> {
    /**
     * 地图对象
     */
    protected map_: IMap;
    /**
     * 视图对象
     */
    protected view_: IView;
    protected get $(): FssgEsri;
    /**
     * 实例化地图地图工具类
     * @param map 地图对象
     * @param view 视图对象
     */
    constructor(map: IMap, view: IView, options?: T_OPTIONS, defaultOptions?: T_OPTIONS);
}

/**
 * 地图工具链配置项
 */
interface IMapToolsOptions extends IFssgEsriPluginOptions {
}
/**
 * 地图工具链事件集
 */
interface IMapToolsEvents extends IFssgEsriPluginEvents {
    'change': {
        previousKey: string;
        executeKey: string;
        currentKey: string;
    };
}
/**
 * 地图工具链
 */
declare class MapTools extends FssgEsriPlugin<IMapToolsOptions, IMapToolsEvents> {
    /**
     * 工具池
     */
    private _toolPool;
    /**
     * 当前激活工具的Key
     */
    private _activedKey;
    /**
     * 当前激活工具的Key
     */
    get activedKey(): string;
    /**
     * 当前激活工具的Key
     */
    set activedKey(key: string);
    /**
     * 构造地图工具链
     * @param options 配置项
     */
    constructor(options?: IMapToolsOptions);
    /**
     * 初始化
     */
    private _init;
    /**
     * 安装插件
     */
    installPlugin(fssgEsri: FssgEsri): this;
    /**
     * 设置工具
     * @param toolKey 工具Key
     */
    _activeTool(toolKey: string): this;
    /**
     * 创建自定义工具
     * @param key 工具Key
     * @param tool 工具对象
     */
    createTool(key: string, tool: FssgEsriBaseTool): this;
    /**
     * 检查是否存在工具
     * @param key 工具Key
     */
    hasTool(key: string): boolean;
    /**
     * 移除工具
     * @param key 工具Key
     */
    deleteTool(key: string): this;
    /**
     * 获取工具
     * @param key 工具Key
     */
    getTool<T extends FssgEsriBaseTool>(key: string): T | undefined;
}

/**
 * 地图鼠标控制插件配置项
 */
interface IMapCursorOptions extends IFssgEsriPluginOptions {
    items?: Record<string, string>;
}
/**
 * 地图鼠标控制插件事件集
 */
interface IMapCursorEvents extends IFssgEsriPluginEvents {
    'change': {
        cursorType: string;
    };
}
/**
 * 地图鼠标控制插件
 */
declare class MapCursor extends FssgEsriPlugin<IMapCursorOptions, IMapCursorEvents> {
    /**
     * 鼠标样式
     */
    private _cursorType;
    /**
     * 样式容器池
     */
    private _typePool;
    /**
     * 鼠标样式
     */
    get cursorType(): string;
    /**
     * 鼠标样式
     */
    set cursorType(t: string);
    /**
     * 构造地图鼠标控制器
     * @param options 配置项
     */
    constructor(options?: IMapCursorOptions);
    /**
     * 初始化
     */
    private _init;
    /**
     * 设置鼠标样式
     * @param cursorType 鼠标样式
     */
    private _setCursor;
    /**
     * 安装插件
     */
    installPlugin(fssgEsri: FssgEsri): this;
}

/**
 * 图层控制插件配置项
 */
interface IMapLayersOptions extends IFssgEsriPluginOptions {
    items?: {
        id: string;
        name: string;
        layerType: string;
        layerUrl: string;
        properties?: __esri.LayerProperties;
        sqlOptions?: {
            xField: string;
            yField: string;
            iconUrl?: string;
            iconUrlFuncStr?: string;
        };
        isQuery?: boolean;
    }[];
    defaultLayerVisible?: boolean;
}
declare type LayerOptions = Required<IMapLayersOptions>['items'][0];
/**
 * 图层控制插件事件集
 */
interface IMapLayersEvents extends IFssgEsriPluginEvents {
    'change:visible': {
        visible: boolean;
        layer: __esri.Layer;
        options: LayerOptions;
    };
    'change:opacity': {
        opacity: number;
        layer: __esri.Layer;
        options: LayerOptions;
    };
}
/**
 * 图层控制插件
 */
declare class MapLayers extends FssgEsriPlugin<IMapLayersOptions, IMapLayersEvents> {
    /**
     * 图层容器池
     */
    private _layerPool;
    /**
     * 图层容器图层
     */
    private _group;
    /**
     * 可查询的图层集合
     */
    get layersWhichCanQuery(): [__esri.Layer, LayerOptions][];
    /**
     * 不可查询的图层集合
     */
    get layersWhichCantQuery(): [__esri.Layer, LayerOptions][];
    /**
     * 构造图层控制插件
     * @param options 配置项
     */
    constructor(options?: IMapLayersOptions);
    /**
     * 初始化
     */
    private _init;
    /**
     * 初始化图层
     */
    private _initLayers;
    /**
     * 查找图层项
     * @param key 键
     */
    private _findItem;
    /**
     * 安装插件
     * @param fssgEsri 地图应用
     */
    installPlugin(fssgEsri: FssgEsri): this;
    /**
     * 通过图层Id查找图层
     * @param nameOrId 图层名或Id
     */
    findLayer<T extends __esri.Layer = __esri.Layer>(nameOrId: string): T | undefined;
    /**
     * 通过图层Id查找配置项
     * @param nameOrIdOrLayer 图层名或Id或图层对象
     */
    findLayerOptions(nameOrIdOrLayer: string | __esri.Layer): LayerOptions | undefined;
    /**
     * 设置图层可见性
     * @param nameOrId 图层名或Id
     * @param visible 可见性，默认为true
     */
    setLayerVisible(nameOrId: string, visible?: boolean): this;
    /**
     * 设置图层不透明度
     * @param nameOrId 图层名或Id
     * @param opacity 不透明度
     */
    setLayerOpacity(nameOrId: string, opacity: number): this;
}

/**
 * 坐标XY
 */
declare type XY = {
    x: number;
    y: number;
} | [number, number] | number[];
/**
 * 经纬度
 */
declare type LonLat = [number, number] | number[] | {
    lon: number;
    lat: number;
} | {
    lng: number;
    lat: number;
} | {
    longitude: number;
    latitude: number;
};
/**
 * 几何工厂接口
 * TODO: createPointsFromPolygon createPolylineFromPolygon createPolylinesFromPolygon
 */
interface IGeometryFactory {
    createPoint(options: __esri.PointProperties): __esri.Point;
    createPointFromXY(x: number, y: number): __esri.Point;
    createPointFromXY(xy: XY): __esri.Point;
    createPointFromLonLat(lon: number, lat: number): __esri.Point;
    createPointFromLonLat(lonlat: LonLat): __esri.Point;
    createPointsFromPolyline(polyline: __esri.Polyline, pathIndex?: number): __esri.Point[];
    createPolyline(options: __esri.PolylineProperties): __esri.Polyline;
    createPolylineFromPoints(points: __esri.Point[]): __esri.Polyline;
    createPolylineFromXYs(XYs: XY[]): __esri.Polyline;
    createPolylineFromLonLats(lonLats: LonLat[]): __esri.Polyline;
    createPolygon(options: __esri.PolygonProperties): __esri.Polygon;
    createPolygonFromPoints(points: __esri.Point[]): __esri.Polygon;
    createPolygonFromPolyline(polyline: __esri.Polyline): __esri.Polygon;
    createPolygonFromXYs(xys: XY[]): __esri.Polygon;
    createPolygonFromLonLats(lonLats: LonLat[]): __esri.Polygon;
    createExtent(options: __esri.ExtentProperties): __esri.Extent;
}
/**
 * 几何工厂类（条件单例模式）
 * @private
 */
declare class GeometryFacory implements IGeometryFactory {
    /**
     * 实例容器
     */
    private static _instanceMap;
    /**
     * 地图应用
     */
    private _fssgEsri;
    /**
     * 实例容器绑定的地图应用空间坐标系
     */
    private get _spatialReference();
    /**
     * 构造几何工厂实例
     * @param fssgEsri 地图应用
     */
    constructor(fssgEsri: FssgEsri);
    /**
     * 创建Esri点
     * @param options 配置项
     * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Point.html
     * @example
     * ```ts
     * createGeometryFactory().createPoint({ \/* xxx *\/ })
     * ```
     */
    createPoint(options: __esri.PointProperties): __esri.Point;
    /**
     * 创建Esri线
     * @param options 配置项
     * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Polyline.html
     * @example
     * ```ts
     * createGeometryFactory().createPolyline({ \/* xxx *\/ })
     * ```
     */
    createPolyline(options: __esri.PolylineProperties): __esri.Polyline;
    /**
     * 创建Esri面
     * @param options 配置项
     * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Polygon.html
     * @example
     * ```ts
     * createGeometryFactory().createPolygon({ \/* xxx *\/ })
     * ```
     */
    createPolygon(options: __esri.PolygonProperties): __esri.Polygon;
    /**
     * 创建Esri范围
     * @param options 配置项
     * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Extent.html
     * @example
     * ```ts
     * createGeometryFactory().createExtent({ \/* xxx *\/ })
     * ```
     */
    createExtent(options: __esri.ExtentProperties): __esri.Extent;
    /**
     * 根据XY坐标创建Esri点
     * @param args XY坐标
     * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Point.html
     * @example
     * ```ts
     * createGeometryFactory().createPointFromXY({ x: 0, y: 0 })
     * createGeometryFactory().createPointFromXY(0, 0)
     * ```
     */
    createPointFromXY(...args: [XY] | [number, number]): __esri.Point;
    /**
     * 根据经纬度创建Esri点
     * @param args 经纬度
     * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Point.html
     * @example
     * ```ts
     * createGeometryFactory().createPointFromLonLat({ lon: 113, lat: 23 })
     * createGeometryFactory().createPointFromLonLat({ lng: 113, lat: 23 })
     * createGeometryFactory().createPointFromLonLat({ longitude: 113, latitude: 23 })
     * createGeometryFactory().createPointFromLonLat(113, 23)
     * ```
     */
    createPointFromLonLat(...args: [LonLat] | [number, number]): __esri.Point;
    /**
     * 根据Esri点集创建Esri线
     * @param points Esri点集
     * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Polyline.html
     */
    createPolylineFromPoints(points: __esri.Point[]): __esri.Polyline;
    /**
     * 根据XY坐标集创建Esri线
     * @param xys XY坐标集
     * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Polyline.html
     */
    createPolylineFromXYs(xys: XY[]): __esri.Polyline;
    /**
     * 根据经纬度集创建Esri线
     * @param lonLats 经纬度集
     * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Polyline.html
     */
    createPolylineFromLonLats(lonLats: LonLat[]): __esri.Polyline;
    /**
     * 根据Esri点集创建Esri面
     * @param points Esri点集
     * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Polygon.html
     */
    createPolygonFromPoints(points: __esri.Point[]): __esri.Polygon;
    /**
     * 根据Esri线创建Esri点集
     * @param polyline Esri线
     * @param pathIndex 线的路径索引，默认值为0
     * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Point.html
     */
    createPointsFromPolyline(polyline: __esri.Polyline, pathIndex?: number): __esri.Point[];
    /**
     * 根据Esri线创建Esri面
     * @param polyline Esri线
     * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Polygon.html
     */
    createPolygonFromPolyline(polyline: __esri.Polyline): __esri.Polygon;
    /**
     * 根据XY坐标集创建Esri面
     * @param xys Esri线
     * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Polygon.html
     */
    createPolygonFromXYs(xys: XY[]): __esri.Polygon;
    /**
     * 根据经纬度集创建Esri面
     * @param lonLats 经纬度集
     * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Polygon.html
     */
    createPolygonFromLonLats(lonLats: LonLat[]): __esri.Polygon;
}
/**
 * 创建几何工厂
 * @param fssgEsri 地图应用
 */
declare function createGeometryFactory(fssgEsri: FssgEsri): GeometryFacory;

/**
 * 图层工厂接口
 */
interface ILayerFactory {
    createLayer(options: {
        layerType: 'graphicslayer';
    } & __esri.GraphicsLayerProperties): __esri.GraphicsLayer;
    createLayer(options: {
        layerType: 'grouplayer';
    } & __esri.GroupLayerProperties): __esri.GroupLayer;
    createLayer(options: {
        layerType: 'webtilelayer';
    } & __esri.WebTileLayerProperties): __esri.WebTileLayer;
    createLayer(options: {
        layerType: string;
    } & __esri.LayerProperties): __esri.Layer;
    createGraphicsLayer(options: __esri.GraphicsLayerProperties): __esri.GraphicsLayer;
    createGroupLayer(options: __esri.GroupLayerProperties): __esri.GroupLayer;
    createWebTileLayer(options: __esri.WebTileLayerProperties): __esri.WebTileLayer;
}
/**
 * 图层工厂（单例模式）
 * @private
 */
declare class LayerFactory implements ILayerFactory {
    /**
     * 实例
     */
    private static _instance;
    /**
     * 构造图层工厂实例
     */
    constructor();
    createLayer(options: {
        layerType: 'graphicslayer';
    } & __esri.GraphicsLayerProperties): __esri.GraphicsLayer;
    createLayer(options: {
        layerType: 'grouplayer';
    } & __esri.GroupLayerProperties): __esri.GroupLayer;
    createLayer(options: {
        layerType: 'webtilelayer';
    } & __esri.WebTileLayerProperties): __esri.WebTileLayer;
    createLayer(options: {
        layerType: string;
    } & __esri.LayerProperties): __esri.Layer;
    /**
     * 创建GraphicsLayer
     * @param options 配置项
     * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-GraphicsLayer.html
     * @example
     * ```ts
     * createLayerFactory().createGraphicsLayer({ \/* xxx *\/ })
     * ```
     */
    createGraphicsLayer(options?: __esri.GraphicsLayerProperties): __esri.GraphicsLayer;
    /**
     * 创建GroupLayer
     * @param options 配置项
     * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-GroupLayer.html
     * @example
     * ```ts
     * createLayerFactory().createGroupLayer({ \/* xxx *\/ })
     * ```
     */
    createGroupLayer(options?: __esri.GroupLayerProperties): __esri.GroupLayer;
    /**
     * 创建WebTileLayer
     * @param options 配置项
     * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-WebTileLayer.html
     * @example
     * ```ts
     * createLayerFactory().createWebTileLayer({ \/* xxx *\/ })
     * ```
     */
    createWebTileLayer(options?: __esri.WebTileLayerProperties): __esri.WebTileLayer;
}
/**
 * 创建图层工厂
 */
declare function createLayerFactory(): LayerFactory;

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
/**
 * 地图应用
 */
declare class FssgEsri extends FssgMap<IFssgEsriOptions, IFssgEsriEvents> {
    basemap: Basemap;
    mapElement: MapElement;
    mapTools: MapTools;
    mapCursor: MapCursor;
    mapLayers: MapLayers;
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
     * 空间坐标系
     */
    get sr(): __esri.SpatialReference;
    /**
     * 视图中心点
     */
    get center(): __esri.Point;
    /**
     * 视图范围
     */
    get extent(): __esri.Extent;
    /**
     * 缩放等级
     */
    get zoom(): number;
    /**
     * 构造地图应用实例
     * @param container 地图容器
     * @param options 配置项
     */
    constructor(container: string, options?: IFssgEsriOptions);
    /**
     * 初始化地图
     */
    private _initMap;
    /**
     * 初始化视图
     */
    private _initView;
    /**
     * 初始化静态资源
     */
    private _initAssetsPath;
    /**
     * 初始化地图容器样式（移除focus时的边框样式）
     */
    private _initRemoveOnlineStyle;
    /**
     * 安装
     */
    mount(): this;
    /**
     * 缩放
     * @param num 缩放值
     * @param options 配置项
     */
    zoomIn(num?: number, options?: __esri.GoToOptions2D): this;
    /**
     * 缩放
     * @param num 缩放值
     * @param options 配置项
     */
    zoomOut(num?: number, options?: __esri.GoToOptions2D): this;
    /**
     * 缩放至
     * @param num 缩放等级
     * @param options 配置项
     */
    zoomTo(zoom: number, options?: __esri.GoToOptions2D): this;
    /**
     * 定位
     * @param xy XY坐标
     * @param zoom 缩放等级
     * @param options 配置项
     */
    locateToXY(xy: XY, zoom?: number, options?: __esri.GoToOptions2D & {
        isZoomAdd?: boolean;
    }): this;
    /**
     * 定位
     * @param lonLat 经纬度
     * @param zoom 缩放等级
     * @param options 配置项
     */
    locateToLonlat(lonLat: LonLat, zoom?: number, options?: __esri.GoToOptions2D & {
        isZoomAdd?: boolean;
    }): this;
    /**
     * 重置地图应用
     */
    reset(): Promise<this>;
}

export { Basemap, FssgEsri, FssgEsriPlugin, GeometryFacory, IBasemapEvents, IBasemapOptions, IFssgEsriEvents, IFssgEsriOptions, IFssgEsriPluginEvents, IFssgEsriPluginOptions, IGeometryFactory, ILayerFactory, IMap, IMapCursorEvents, IMapCursorOptions, IMapElementEvents, IMapElementOptions, IMapElementSymbol, IMapLayersEvents, IMapLayersOptions, IMapToolsEvents, IMapToolsOptions, IOwner, IView, LonLat, MapCursor, MapElement, MapLayers, MapTools, XY, createGeometryFactory, createLayerFactory };
