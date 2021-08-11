import { IFssgMapOptions, IFssgMapEvents, FssgMap, IFssgMapContainer, IFssgMapPluginOptions, IFssgMapPluginEvents, FssgMapPlugin } from '@fssgis/fssg-map';
import { MapOptions, Map, ZoomPanOptions, LatLng, Point } from 'leaflet';

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
    xyToLatLng(xy: Point): LatLng;
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
     * 安装插件
     * @param fssgLeaflet 地图应用实例
     * @returns this
     */
    installPlugin(fssgLeaflet: FssgLeaflet): this;
}

export { FssgLeaflet, FssgLeafletPlugin, IFssgLeafletEvents, IFssgLeafletOptions, IFssgLeafletPluginEvents, IFssgLeafletPluginOptions, ILocateOptions, IMap };
