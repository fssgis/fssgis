import { IFssgMapOptions, IFssgMapEvents, FssgMap, IFssgMapContainer, IFssgMapPluginOptions, IFssgMapPluginEvents, FssgMapPlugin } from '@fssgis/fssg-map';
import { MapOptions, Map, ZoomPanOptions, LatLng, Point, Layer, IconOptions, MarkerOptions, Marker } from 'leaflet';

/**
 * 地图应用配置项
 */
interface IFssgLeafletOptions extends IFssgMapOptions {
    mapOptions?: MapOptions;
}
/**
 * 地图应用事件集
 */
interface IFssgLeafletEvents extends IFssgMapEvents {
}
/**
 * 地图接口
 */
interface IMap extends Map {
    $owner: FssgLeaflet;
}
/**
 * 经纬度接口
 */
interface ILonlat {
    lon: number;
    lat: number;
}
/**
 * 平面坐标接口
 */
interface IXY {
    x: number;
    y: number;
}
interface ILocateOptions extends ZoomPanOptions {
    x?: number;
    y?: number;
    lon?: number;
    lat?: number;
    zoom?: number;
}
/**
 * 地图应用
 */
declare class FssgLeaflet extends FssgMap<IFssgLeafletOptions, IFssgLeafletEvents> {
    /**
     * leaflet地图实例
     */
    private _map;
    /**
     * leaflet地图实例
     */
    get map(): IMap;
    /**
     * 构造地图应用
     * @param container 地图容器
     * @param options 配置项
     */
    constructor(container: IFssgMapContainer, options?: IFssgLeafletOptions);
    /**
     * 初始化地图实例
     * @returns this
     */
    private _initMap;
    /**
     * 定位
     * @param latLng 经纬度对象
     * @param zoom 缩放等级
     * @param options 配置项
     * @returns this
     */
    private _locateTo;
    /**
     * 安装地图应用
     * @returns this
     */
    mount(): this;
    /**
     * 定位
     * @param options 配置项
     * @returns this
     */
    locateTo(options: ILocateOptions): this;
    /**
     * 经纬度转投影坐标
     * @param _latLng 经纬度
     * @returns 投影坐标
     */
    latLngToXY(_latLng: LatLng): Point;
    /**
     * 经纬度转投影坐标
     * @param xy 投影坐标
     * @returns 经纬度
     */
    xyToLatLng(xy: Point | IXY): LatLng;
    /**
     * 获取中心点经纬度和投影坐标信息
     * @returns 中心点的经纬度和投影坐标信息
     */
    getCenter(): {
        x: number;
        y: number;
        lon: number;
        lat: number;
    };
    /**
     * 经纬度对象转leaflet敬畏度对象
     * @param lonlat 经纬度
     * @returns leaflet经纬度对象
     */
    lonlatToLatlng(lonlat: ILonlat): LatLng;
    /**
     * 经纬度转投影坐标
     * @param lonlat 经纬度
     * @returns 投影坐标
     */
    lonlatToXY(lonlat: ILonlat): Point;
}

/**
 * 地图应用插件配置项
 */
interface IFssgLeafletPluginOptions extends IFssgMapPluginOptions {
}
/**
 * 地图应用插件事件集
 */
interface IFssgLeafletPluginEvents extends IFssgMapPluginEvents {
}
declare class FssgLeafletPlugin<T_OPTIONS extends IFssgLeafletPluginOptions = IFssgLeafletPluginOptions, T_EVENTS extends IFssgLeafletPluginEvents = IFssgLeafletPluginEvents> extends FssgMapPlugin<T_OPTIONS & IFssgLeafletPluginOptions, T_EVENTS & IFssgLeafletPluginEvents> {
    /**
     * leaflet地图实例
     */
    protected map_: IMap;
    /**
     * 绑定的地图应用实例
     */
    get $(): FssgLeaflet;
    /**
     * 安装插件
     * @param fssgLeaflet 地图应用实例
     * @returns this
     */
    installPlugin(fssgLeaflet: FssgLeaflet): this;
}

/**
 * 图元控制插件配置项
 */
interface IMapElementOptions extends IFssgLeafletPluginOptions {
}
/**
 * 图元控制插件事件集
 */
interface IMapElementEvents extends IFssgLeafletPluginEvents {
}
/**
 * 图元控制插件
 */
declare class MapElement extends FssgLeafletPlugin<IMapElementOptions, IMapElementEvents> {
    /**
     * 图元存储池
     */
    private _elementPool;
    /**
     * 构造图元控制插件
     * @param options 配置项
     */
    constructor(options?: IMapElementOptions);
    /**
     * 添加图元
     * @param layer 图元
     * @returns this
     */
    add(layer: Layer): this;
    addMarkerByXY(xy: IXY, iconOptions?: IconOptions, options?: MarkerOptions): Marker;
    clearAll(): this;
}

export { FssgLeaflet, FssgLeafletPlugin, IFssgLeafletEvents, IFssgLeafletOptions, IFssgLeafletPluginEvents, IFssgLeafletPluginOptions, ILocateOptions, ILonlat, IMap, IMapElementEvents, IMapElementOptions, IXY, MapElement };
