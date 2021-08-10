import { IFssgMapOptions, IFssgMapEvents, FssgMap, IFssgMapContainer, IFssgMapPluginOptions, IFssgMapPluginEvents, FssgMapPlugin } from '@fssgis/fssg-map';
import { MapOptions, Map } from 'leaflet';

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
    constructor(container: IFssgMapContainer, options?: IFssgLeafletOptions);
    private _initMap;
    /**
     * 安装地图应用
     * @returns this
     */
    mount(): this;
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

export { FssgLeaflet, FssgLeafletPlugin, IFssgLeafletEvents, IFssgLeafletOptions, IFssgLeafletPluginEvents, IFssgLeafletPluginOptions, IMap };
