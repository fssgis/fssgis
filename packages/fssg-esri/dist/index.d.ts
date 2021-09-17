import { IFssgMapPluginOptions, IFssgMapPluginEvents, FssgMapPlugin, IBaseToolOptions, IBaseToolEvents, BaseTool, OnToolActivedParams, OnToolActivedReture, OnToolDeactivedParams, OnToolDeactivedReture, IFssgMapOptions, IFssgMapEvents, FssgMap } from '@fssgis/fssg-map';
import Geometry from '@arcgis/core/geometry/Geometry';
import Draw from '@arcgis/core/views/draw/Draw';
import DrawAction from '@arcgis/core/views/draw/DrawAction';
import Graphic from '@arcgis/core/Graphic';
import { ICallbackParams } from '@fssgis/observable';
import Point from '@arcgis/core/geometry/Point';

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
    installPlugin(fssgEsri: FssgEsri): this | Promise<this>;
}

/**
 * 底图控制插件配置项
 */
interface IBasemapOptions extends IFssgEsriPluginOptions {
    items?: {
        key: string;
        type?: 'webtilelayer' | 'tilelayer';
        url?: string;
        props?: __esri.LayerProperties;
        lyrs?: {
            type: Required<Required<IBasemapOptions>['items'][0]>['type'];
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
    installPlugin(fssgEsri: FssgEsri): this | Promise<this>;
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
    get graphicsLayer(): __esri.GraphicsLayer;
    get highlightLayer(): __esri.GraphicsLayer;
    /**
     * 构造图元控制插件对象
     * @param options 配置项
     */
    constructor(options?: IMapElementOptions);
    private _init;
    private _getSymbol;
    private _addGraphics;
    private _addHighlight;
    installPlugin(fssgEsri: FssgEsri): this | Promise<this>;
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
    installPlugin(fssgEsri: FssgEsri): this | Promise<this>;
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
 * 缩放至起始位置工具配置项
 */
interface IZoomHomeToolOptions extends IFssgEsriBaseToolOptions {
}
/**
 * 缩放至起始位置工具事件集
 */
interface IZoomHomeToolEvents extends IFssgEsriBaseToolEvents {
}
/**
 * 缩放至起始位置工具
 */
declare class ZoomHomeTool<T_OPTIONS extends IZoomHomeToolOptions = IZoomHomeToolOptions, T_EVENTS extends IZoomHomeToolEvents = IZoomHomeToolEvents> extends FssgEsriBaseTool<T_OPTIONS & IZoomHomeToolOptions, T_EVENTS & IZoomHomeToolEvents> {
    /**
     * 起始位置
     */
    home: __esri.Geometry | {
        center: __esri.Point;
        zoom: number;
    };
    /**
     * 构造缩放至起始位置工具
     * @param map 地图
     * @param view 视图
     * @param options 配置项
     * @param defaultOptions 默认配置项
     */
    constructor(map: IMap, view: IView, options?: T_OPTIONS, defaultOptions?: T_OPTIONS);
    /**
     * 工具激活时触发
     */
    protected onToolActived_(e: OnToolActivedParams<this>): OnToolActivedReture;
}

declare type DrawType = 'point' | 'multipoint' | 'polyline' | 'polygon' | 'rectangle' | 'circle' | 'ellipse';
declare type OnDrawStartParams<T> = ICallbackParams<'draw-start', T> & {
    x: number;
    y: number;
};
declare type OnDrawMoveParams<T> = ICallbackParams<'draw-move', T> & {
    geometry: Geometry;
};
declare type OnDrawEndParams<T> = ICallbackParams<'draw-end', T> & {
    geometry: Geometry;
};
declare type OnDrawStartReture = Point | false;
declare type OnDrawMoveReture = Graphic | false;
declare type OnDrawEndReture = Graphic | false;
interface IDrawToolOptions extends IFssgEsriBaseToolOptions {
    drawType: DrawType;
    onlyOneGraphic?: boolean;
    cursorType?: string;
}
interface IDrawToolEvents extends IFssgEsriBaseToolEvents {
    'draw-start': {
        x: number;
        y: number;
    };
    'draw-move': {
        geometry: Geometry;
    };
    'draw-end': {
        geometry: Geometry;
    };
}
declare abstract class DrawTool<T_OPTIONS extends IDrawToolOptions = IDrawToolOptions, T_EVENTS extends IDrawToolEvents = IDrawToolEvents> extends FssgEsriBaseTool<T_OPTIONS, T_EVENTS> {
    /** 绘制图元存储容器 */
    private _graphics;
    /** 绘制过程图元 */
    private _tempGraphic;
    /** 绘制时样式 */
    private _drawingStyle;
    /** 绘制完成样式 */
    private _drawedStyle;
    /** 绘图对象 */
    protected draw_: Draw;
    /** 绘制任务对象 */
    protected action_: DrawAction;
    /** 绘图类型 */
    protected drawType_: DrawType;
    protected cursorType_: string;
    /** 绘制目标是否仅允许存在一个 */
    private onlyOneGraphic_;
    /**
     * 构造绘图工具对象
     * @param map 地图对象
     * @param view 视图对象
     */
    constructor(map: IMap, view: IView, options: T_OPTIONS);
    private _matchStyle;
    /**
     * 初始化任务
     */
    protected initAction_(): this;
    /**
     * 工具激活处理事件
     */
    protected onToolActived_(e: OnToolActivedParams<this>): OnToolActivedReture;
    /**
     * 工具失活处理事件
     */
    protected onToolDeactived_(e: OnToolDeactivedParams<this>): OnToolDeactivedReture;
    /**
     * 工具绘制开始处理事件
     */
    protected onDrawStart_(e: OnDrawStartParams<this>): OnDrawStartReture;
    /**
     * 工具绘制过程处理事件
     */
    protected onDrawMove_(e: OnDrawMoveParams<this>): OnDrawMoveReture;
    /**
     * 工具绘制完成处理事件
     */
    protected onDrawEnd_(e: OnDrawEndParams<this>): OnDrawEndReture;
    /**
     *清理绘制过的图元
     */
    clearDrawed(): this;
    /**
     * 设置绘制完成图元样式
     */
    setDrawedStyle(style: IMapElementSymbol): this;
    /**
     * 设置绘制时图元样式
     */
    setDrawingStyle(style: IMapElementSymbol): this;
}

declare type IDrawPointToolOptions = IDrawToolOptions;
declare type IDrawPointToolEvents = IDrawToolEvents;
declare class DrawPointTool<T_OPTIONS extends IDrawPointToolOptions = IDrawPointToolOptions, T_EVENTS extends IDrawPointToolEvents = IDrawPointToolEvents> extends DrawTool<T_OPTIONS, T_EVENTS> {
    private _pointerMoveHandler;
    constructor(map: IMap, view: IView, onlyOneGraphic?: boolean);
    protected initAction_(): this;
    protected onToolDeactived_(e: OnToolDeactivedParams<this>): OnToolDeactivedReture;
}

declare type IDrawPolygonToolOptions = IDrawToolOptions;
declare type IDrawPolygonToolEvents = IDrawToolEvents;
declare class DrawPolygonTool<T_OPTIONS extends IDrawPolygonToolOptions = IDrawPolygonToolOptions, T_EVENTS extends IDrawPolygonToolEvents = IDrawPolygonToolEvents> extends DrawTool<T_OPTIONS, T_EVENTS> {
    constructor(map: IMap, view: IView, options?: Omit<T_OPTIONS, 'drawType'>);
    protected initAction_(): this;
}

declare type IDrawPolylineToolOptions = IDrawToolOptions;
declare type IDrawPolylineToolEvents = IDrawToolEvents;
declare class DrawPolylineTool<T_OPTIONS extends IDrawPolylineToolOptions = IDrawPolylineToolOptions, T_EVENTS extends IDrawPolylineToolEvents = IDrawPolylineToolEvents> extends DrawTool<T_OPTIONS, T_EVENTS> {
    constructor(map: IMap, view: IView, onlyOneGraphic?: boolean);
    protected initAction_(): this;
}

interface IMeasureCoordinateToolOptions extends IDrawPointToolOptions {
}
interface IMeasureCoordinateToolEvents extends IDrawPointToolEvents {
}
declare class MeasureCoordinateTool<T_OPTIONS extends IMeasureCoordinateToolOptions = IMeasureCoordinateToolOptions, T_EVENTS extends IMeasureCoordinateToolEvents = IMeasureCoordinateToolEvents> extends DrawPointTool<T_OPTIONS, T_EVENTS> {
    private _overlayIds;
    constructor(map: IMap, view: IView);
    protected onDrawMove_(e: OnDrawMoveParams<this>): OnDrawMoveReture;
    protected onToolDeactived_(e: OnToolDeactivedParams<this>): OnToolDeactivedReture;
    protected onDrawEnd_(e: OnDrawEndParams<this>): OnDrawEndReture;
    clearMeasure(): this;
}

interface IMeasureLengthToolOptions extends IDrawPolylineToolOptions {
}
interface IMeasureLengthToolEvents extends IDrawPolylineToolEvents {
}
declare class MeasureLengthTool<T_OPTIONS extends IMeasureLengthToolOptions = IMeasureLengthToolOptions, T_EVENTS extends IMeasureLengthToolEvents = IMeasureLengthToolEvents> extends DrawPolylineTool<T_OPTIONS, T_EVENTS> {
    private _overlayIds;
    unit: __esri.LinearUnits;
    fixedCount: number;
    private _unitStrDic;
    constructor(map: IMap, view: IView);
    protected onDrawMove_(e: OnDrawMoveParams<this>): OnDrawMoveReture;
    protected onToolDeactived_(e: OnToolDeactivedParams<this>): OnToolDeactivedReture;
    protected onDrawEnd_(e: OnDrawEndParams<this>): OnDrawEndReture;
    clearMeasure(): this;
}

interface IMeasureAreaToolOptions extends IDrawPolygonToolOptions {
}
interface IMeasureAreaToolEvents extends IDrawPolygonToolEvents {
}
declare class MeasureAreaTool<T_OPTIONS extends IMeasureAreaToolOptions = IMeasureAreaToolOptions, T_EVENTS extends IMeasureAreaToolEvents = IMeasureAreaToolEvents> extends DrawPolygonTool<T_OPTIONS, T_EVENTS> {
    private _overlayIds;
    unit: __esri.ArealUnits;
    fixedCount: number;
    private _unitStrDic;
    constructor(map: IMap, view: IView);
    protected onDrawMove_(e: OnDrawMoveParams<this>): OnDrawMoveReture;
    protected onToolDeactived_(e: OnToolDeactivedParams<this>): OnToolDeactivedReture;
    protected onDrawEnd_(e: OnDrawEndParams<this>): OnDrawEndReture;
    clearMeasure(): this;
}

interface IAttributesConfigItem {
    layerName: string;
    fields?: {
        name: string;
        alias: string;
        type?: string;
    }[];
    exclude?: string[];
}
declare type IHitTestToolOptions = IDrawPointToolOptions;
interface IHitTestToolEvents extends IDrawPointToolEvents {
    'finshed': {
        results: __esri.HitTestResultResults[];
    };
}
interface IField {
    name: string;
    alias?: string;
    type?: string;
    value: unknown;
}
declare class HitTestTool<T_OPTIONS extends IHitTestToolOptions = IHitTestToolOptions, T_EVENTS extends IHitTestToolEvents = IHitTestToolEvents> extends DrawPointTool<T_OPTIONS, T_EVENTS> {
    static getAttributesFromGraphic(graphic: __esri.Graphic): IField[];
    static parseAttributesFromArcGISServer(attributes: IField[], graphic: __esri.Graphic): IField[];
    static parseAttributesFromCustomConfig(attributes: IField[], graphic: __esri.Graphic, attributesConfig: IAttributesConfigItem[]): IField[];
    constructor(map: IMap, view: IView);
    private _queryWithMapImageLayer;
    protected onDrawEnd_(e: OnDrawEndParams<this>): OnDrawEndReture;
    protected finsheHitTest_(result: __esri.HitTestResult): __esri.HitTestResultResults[];
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
    installPlugin(fssgEsri: FssgEsri): this | Promise<this>;
}

/**
 * 图层控制插件配置项
 */
interface IMapLayersOptions extends IFssgEsriPluginOptions {
    items?: {
        id: string;
        name: string;
        serverName?: string;
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
     * 图层容器，唯一存储
     */
    private get _layerPoolUnique();
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
    installPlugin(fssgEsri: FssgEsri): this | Promise<this>;
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
     * 查找动态图层
     * @param nameOrId 图层名或Id
     */
    findDynaLayer(nameOrId: string): __esri.Sublayer | undefined;
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
    forEach(callback: (item: [__esri.Layer, LayerOptions]) => void): Promise<this>;
}

/**
 * 鹰眼插件配置项
 */
interface IHawkeyeOptions extends IFssgEsriPluginOptions {
    container?: string;
    symbol?: __esri.SimpleFillSymbolProperties;
    layers?: Required<IMapLayersOptions>['items'];
    fssgEsriOptions?: IFssgEsriOptions;
}
/**
 * 鹰眼插件事件集
 */
interface IHawkeyeEvents extends IFssgEsriPluginEvents {
}
/**
 * 鹰眼插件
 */
declare class Hawkeye extends FssgEsriPlugin<IHawkeyeOptions, IHawkeyeEvents> {
    private _fssgEsri;
    private _container;
    /**
     * 构造鹰眼插件
     * @param options 配置项
     */
    constructor(options?: IHawkeyeOptions);
    /**
     * 初始化
     */
    private _init;
    /**
     * 初始化地图同步
     */
    private _initExtentSync;
    /**
     * 安装插件
     * @param fssgEsri 地图应用
     */
    installPlugin(fssgEsri: FssgEsri): this | Promise<this>;
}

/**
 * 树节点
 */
interface ITreeNode {
    id: string;
    parentId: string;
    name: string;
    layerId: string;
    defaultChecked: boolean;
    associatedLayerIds?: string[];
    children?: ITreeNode[];
}
/**
 * 图层树插件配置项
 */
interface ILayerTreeOptions extends IFssgEsriPluginOptions {
    items?: Omit<ITreeNode, 'children'>[];
}
/**
 * 图层树插件事件集
 */
interface ILayerTreeEvents extends IFssgEsriPluginEvents {
    'change:checked': {
        node: ITreeNode;
        checked: boolean;
    };
}
declare class LayerTree extends FssgEsriPlugin<ILayerTreeOptions, ILayerTreeEvents> {
    /**
   * 图层树列表
   */
    private _list;
    /**
    * 图层树
    */
    private _tree;
    /**
    * 选中的树节点Id
    */
    private _checkedIds;
    /**
    * 图层树列表
    */
    get list(): ITreeNode[];
    /**
    * 图层树
    */
    get tree(): ITreeNode[];
    /**
    * 选中的树节点Id
    */
    get checkedIds(): string[];
    /**
     * 构造图层树插件实例
     * @param options 配置项
     */
    constructor(options?: ILayerTreeOptions);
    /**
     * 设置树节点选中状态
     * @param node 树节点
     * @param checked 选中状态
     * @returns this
     */
    private _setNodeChecked;
    /**
     * 初始化
     */
    private _init;
    /**
     * 安装插件
     * @param fssgEsri 地图应用
     * @returns this
     */
    installPlugin(fssgEsri: FssgEsri): this | Promise<this>;
    /**
     * 通过树节点Id查找图层
     * @param nodeId 树节点Id
     * @returns 图层
     */
    findLayerFromNodeId(nodeId: string): __esri.Layer | undefined;
    /**
     * 通过树节点Id查找树节点
     * @param nodeId 树节点Id
     * @returns 树节点
     */
    findNodeFromNodeId(nodeId: string): ITreeNode | undefined;
    /**
     * 通过树节点名称查找树节点
     * @param nodeName 树节点名称
     * @returns 树节点
     */
    findNodeFromNodeName(nodeName: string): ITreeNode | undefined;
    /**
     * 通过图层Id查找树节点
     * @param layerId 图层Id
     * @returns 树节点
     */
    findNodeFromLayerId(layerId: string): ITreeNode | undefined;
    /**
     * 设置树节点选中状态
     * @param nodeId 树节点Id
     * @param checked 选中状态
     * @returns this
     */
    setNodeCheckById(nodeId: string, checked: boolean): this;
    /**
     * 设置树节点选中状态
     * @param nodeName 树节点名称
     * @param checked 选中状态
     * @returns this
     */
    setNodeCheckByName(nodeName: string, check: boolean): this;
}

/**
 * 地图模块项
 */
interface IModuleItem {
    id: string;
    title: string;
    treeNodeIds: string[];
}
/**
 * 地图模块控制插件配置项
 */
interface IMapModulesOptions extends IFssgEsriPluginOptions {
    items?: IModuleItem[];
    defaultSelectedTitle?: string;
}
/**
 * 地图模块控制插件事件集
 */
interface IMapModulesEvents extends IFssgEsriPluginEvents {
    'change:selected': {
        item?: IModuleItem;
    };
}
/**
 * 地图模块控制插件
 */
declare class MapModules extends FssgEsriPlugin<IMapModulesOptions, IMapModulesEvents> {
    /**
     * 地图模块集合
     */
    private _items;
    private _selectedTitle;
    /**
    * 地图模块集合
    */
    get items(): IModuleItem[];
    get selectedTitle(): string;
    set selectedTitle(title: string);
    /**
    * 构造地图模块插件实例
    * @param options 配置项
    */
    constructor(options?: IMapModulesOptions);
    /**
     * 安装插件
     * @param fssgEsri 地图应用
     * @returns this
     */
    installPlugin(fssgEsri: FssgEsri): this | Promise<this>;
    /**
    * 选择地图模块
    * @param moduleId 模块Id
    * @returns this
    */
    selectById(moduleId: string): this;
    /**
    * 选择地图模块
    * @param moduleTitle 模块名称
    * @returns this
    */
    selectByTitle(moduleTitle: string): this;
}

interface IMouseTipsOptions extends IFssgEsriPluginOptions {
}
interface IMouseTipsEvents extends IFssgEsriPluginEvents {
}
declare class MouseTips extends FssgEsriPlugin<IMouseTipsOptions, IMouseTipsEvents> {
    private _handlers;
    private _tipsDom;
    constructor(options?: IMouseTipsOptions);
    private _init;
    installPlugin(fssgEsri: FssgEsri): this | Promise<this>;
    showTips(tips: string): this;
    cancelTips(): this;
}

interface IOverlaysOptions extends IFssgEsriPluginOptions {
}
interface IOverlaysEvents extends IFssgEsriPluginEvents {
}
interface IOverlayAddOptions {
    id?: string;
    point: __esri.Point;
    content: string | HTMLDivElement;
    offsetX?: number;
    offsetY?: number;
    screenX?: number;
    screenY?: number;
    showBezierCurve?: boolean;
    bezierCurveSymbol?: __esri.LineSymbolProperties;
}
interface IOverlay {
    id: string;
    container: HTMLDivElement;
    mapXY: __esri.Point;
    offsetX: number;
    offsetY: number;
    screenX?: number;
    screenY?: number;
    bezierCurve?: __esri.Graphic;
    bezierCurveSymbol?: __esri.LineSymbolProperties;
}
declare class Overlays extends FssgEsriPlugin<IOverlaysOptions, IOverlaysEvents> {
    private _overlayPool;
    private _overlayContainer;
    constructor(options?: IOverlaysOptions);
    private _init;
    installPlugin(fssgEsri: FssgEsri): this | Promise<this>;
    add(options: IOverlayAddOptions): string;
    removeById(id: string): this;
    clear(): this;
}

interface IViewCliperEvents extends IFssgEsriPluginEvents {
}
interface IViewCliperOptions extends IFssgEsriPluginOptions {
}
declare class ViewCliper extends FssgEsriPlugin<IViewCliperOptions, IViewCliperEvents> {
    constructor(options?: IViewCliperOptions);
    private _cliperLayer;
    get cliperLayer(): __esri.GraphicsLayer;
    private _init;
    installPlugin(fssgEsri: FssgEsri): this | Promise<this>;
    clip(geometry: __esri.Geometry): this;
    clip(graphic: __esri.Graphic): this;
    clip(arg0: __esri.Graphic | __esri.Geometry): this;
    restore(): this;
}

/**
 * 坐标XY
 */
declare type XY = {
    x: number;
    y: number;
} | [number, number] | number[];
declare function getXfromXY(xy: XY): number;
declare function getYfromXY(xy: XY): number;
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
declare function getLonfromLonLat(lonLat: LonLat): number;
declare function getLatfromLonLat(lonLat: LonLat): number;
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
    createBezierCurve(pt1: __esri.Point, pt2: __esri.Point): __esri.Polyline;
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
    /**
     * 创建贝塞尔曲线（二阶） Second-order
     * @param pt1 点1
     * @param pt2 点2
     */
    createBezierCurve(pt1: __esri.Point, pt2: __esri.Point): __esri.Polyline;
}
/**
 * 创建几何工厂
 * @param fssgEsri 地图应用
 */
declare function createGeometryFactory(fssgEsri: FssgEsri): GeometryFacory;

interface ISqlLayerProperties {
    url: string;
    sqlOptions: {
        xField: string;
        yField: string;
        iconUrl?: string;
        iconUrlFuncStr?: string;
    };
    spatialReference?: __esri.SpatialReference;
}
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
        layerType: 'tilelayer';
    } & __esri.TileLayerProperties): __esri.TileLayer;
    createLayer(options: {
        layerType: 'dynamiclayer';
    } & __esri.MapImageLayerProperties & {
        serverName?: string;
    }): __esri.MapImageLayer;
    createLayer(options: {
        layerType: 'mapimagelayer';
    } & __esri.MapImageLayerProperties): __esri.MapImageLayer;
    createLayer(options: {
        layerType: 'sqllayer';
    } & __esri.GraphicsLayerProperties & ISqlLayerProperties): __esri.GraphicsLayer;
    createLayer(options: {
        layerType: 'sqllayer2';
    } & __esri.FeatureLayerProperties & ISqlLayerProperties): __esri.FeatureLayer;
    createLayer(options: {
        layerType: 'featurelayer';
    } & __esri.FeatureLayerProperties): __esri.FeatureLayer;
    createLayer(options: {
        layerType: string;
    } & __esri.LayerProperties): __esri.Layer;
    createGraphicsLayer(options: __esri.GraphicsLayerProperties): __esri.GraphicsLayer;
    createGroupLayer(options: __esri.GroupLayerProperties): __esri.GroupLayer;
    createWebTileLayer(options: __esri.WebTileLayerProperties): __esri.WebTileLayer;
    createTileLayer(options: __esri.TileLayerProperties): __esri.TileLayer;
    createDynamicLayer(options: __esri.MapImageLayerProperties & {
        serverName?: string;
    }): __esri.MapImageLayer;
    createMapImageLayer(options: __esri.MapImageLayerProperties): __esri.MapImageLayer;
    createSqlLayer(options: __esri.GraphicsLayerProperties & ISqlLayerProperties): __esri.GraphicsLayer;
    createSqlLayer2(options: __esri.FeatureLayerProperties & ISqlLayerProperties): __esri.FeatureLayer;
    createFeatureLayer(options: __esri.FeatureLayerProperties): __esri.FeatureLayer;
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
        layerType: 'tilelayer';
    } & __esri.TileLayerProperties): __esri.TileLayer;
    createLayer(options: {
        layerType: 'dynamiclayer';
    } & __esri.MapImageLayerProperties & {
        serverName?: string;
    }): __esri.MapImageLayer;
    createLayer(options: {
        layerType: 'mapimagelayer';
    } & __esri.MapImageLayerProperties): __esri.MapImageLayer;
    createLayer(options: {
        layerType: 'sqllayer';
    } & __esri.GraphicsLayerProperties & ISqlLayerProperties): __esri.GraphicsLayer;
    createLayer(options: {
        layerType: 'sqllayer2';
    } & __esri.FeatureLayerProperties & ISqlLayerProperties): __esri.FeatureLayer;
    createLayer(options: {
        layerType: 'featurelayer';
    } & __esri.FeatureLayerProperties): __esri.FeatureLayer;
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
    /**
     * 创建TileLayer
     * @param options 配置项
     * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-TileLayer.html
     * @example
     * ```ts
     * createLayerFactory().createTileLayer({ \/* xxx *\/ })
     * ```
     */
    createTileLayer(options?: __esri.TileLayerProperties): __esri.TileLayer;
    /**
     * 创建动态图层
     * @param options 配置项
     */
    createDynamicLayer(options?: __esri.MapImageLayerProperties & {
        serverName?: string;
        name?: string;
    }): __esri.MapImageLayer;
    /**
     * 创建MapImageLayer
     * @param options 配置项
     */
    createMapImageLayer(options?: __esri.MapImageLayerProperties): __esri.MapImageLayer;
    /**
     * 创建SQL图层
     * @param options 配置项
     */
    createSqlLayer(options: __esri.GraphicsLayerProperties & ISqlLayerProperties): __esri.GraphicsLayer;
    /**
     * 创建SQL图层
     * @param options 配置项
     */
    createSqlLayer2(options: __esri.FeatureLayerProperties & ISqlLayerProperties): __esri.FeatureLayer;
    /**
     * 创建FeatureLayer
     * @param options 配置项
     * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html
     * @example
     * ```ts
     * createLayerFactory().createFeatureLayer({ \/* xxx *\/ })
     * ```
     */
    createFeatureLayer(options?: __esri.FeatureLayerProperties): __esri.FeatureLayer;
}
/**
 * 创建图层工厂
 */
declare function createLayerFactory(): LayerFactory;

/**
 * 地图应用配置项
 */
interface IFssgEsriOptions extends IFssgMapOptions {
    centerX?: number;
    centerY?: number;
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
    hawkeye: Hawkeye;
    layerTree: LayerTree;
    mapModules: MapModules;
    mouseTips: MouseTips;
    overlays: Overlays;
    viewCliper: ViewCliper;
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
     * 配置项
     */
    get options(): IFssgEsriOptions;
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
    private _initBeginCenter;
    goto(target: __esri.Geometry | __esri.Graphic | __esri.Geometry[] | __esri.Graphic[] | number[] | __esri.Collection<__esri.Geometry> | __esri.Collection<__esri.Graphic> | {
        center?: __esri.Point;
        zoom?: number;
    }, options?: __esri.GoToOptions2D): this;
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
    /**
     * 经纬度转投影坐标
     * @param lonLat 经纬度
     * @param sr 投影坐标系
     */
    lonLatToXY(lonLat: LonLat, sr?: __esri.SpatialReference): [number, number];
    /**
     * 投影坐标转经纬度
     * @param xy 投影坐标
     * @param sr 投影坐标系
     */
    xyToLonLat(xy: XY, sr?: __esri.SpatialReference): [number, number];
}

declare const RippleGraphicsLayer: any;

declare const RippleLayerView: any;

declare const AnimatedLinesLayer: any;

export { AnimatedLinesLayer, Basemap, DrawPointTool, DrawPolygonTool, DrawPolylineTool, FssgEsri, FssgEsriPlugin, GeometryFacory, Hawkeye, HitTestTool, IAttributesConfigItem, IBasemapEvents, IBasemapOptions, IDrawPointToolEvents, IDrawPointToolOptions, IDrawPolygonToolEvents, IDrawPolygonToolOptions, IDrawPolylineToolEvents, IDrawPolylineToolOptions, IField, IFssgEsriEvents, IFssgEsriOptions, IFssgEsriPluginEvents, IFssgEsriPluginOptions, IGeometryFactory, IHawkeyeEvents, IHawkeyeOptions, IHitTestToolEvents, IHitTestToolOptions, ILayerFactory, ILayerTreeEvents, ILayerTreeOptions, IMap, IMapCursorEvents, IMapCursorOptions, IMapElementEvents, IMapElementOptions, IMapElementSymbol, IMapLayersEvents, IMapLayersOptions, IMapModulesEvents, IMapModulesOptions, IMapToolsEvents, IMapToolsOptions, IMeasureAreaToolEvents, IMeasureAreaToolOptions, IMeasureCoordinateToolEvents, IMeasureCoordinateToolOptions, IMeasureLengthToolEvents, IMeasureLengthToolOptions, IModuleItem, IMouseTipsEvents, IMouseTipsOptions, IOverlay, IOverlayAddOptions, IOverlaysEvents, IOverlaysOptions, IOwner, ITreeNode, IView, IViewCliperEvents, IViewCliperOptions, IZoomHomeToolEvents, IZoomHomeToolOptions, LayerTree, LonLat, MapCursor, MapElement, MapLayers, MapModules, MapTools, MeasureAreaTool, MeasureCoordinateTool, MeasureLengthTool, MouseTips, Overlays, RippleGraphicsLayer, RippleLayerView, ViewCliper, XY, ZoomHomeTool, createGeometryFactory, createLayerFactory, getLatfromLonLat, getLonfromLonLat, getXfromXY, getYfromXY };
