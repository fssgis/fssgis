import { FssgMap, FssgMapPlugin } from '@fssgis/fssg-map';
import { map, point, latLng } from 'leaflet';

/**
 * 深度复制（采用JSON解析方式）
 * @param obj 复制对象
 */
function isNullOrUndefined(obj) {
    return obj === null || obj === undefined;
}

/**
 * 地图应用
 */
class FssgLeaflet extends FssgMap {
    /**
     * leaflet地图实例
     */
    _map;
    /**
     * leaflet地图实例
     */
    get map() {
        return this._map;
    }
    /**
     * 构造地图应用
     * @param container 地图容器
     * @param options 配置项
     */
    constructor(container, options = {}) {
        super(container, options, {
            debugName: 'fssgLeaflet',
            debug: false,
            mapOptions: {
                zoom: 1,
                center: [0, 0],
                zoomControl: true,
                attributionControl: false,
            }
        });
    }
    /**
     * 初始化地图实例
     * @returns this
     */
    _initMap() {
        this._map = Object.assign(map(this.container, this.options_.mapOptions), { $owner: this });
        return this;
    }
    /**
     * 定位
     * @param latLng 经纬度对象
     * @param zoom 缩放等级
     * @param options 配置项
     * @returns this
     */
    _locateTo(latLng, zoom, options) {
        zoom = zoom ?? this._map.getZoom();
        this._map.flyTo(latLng, zoom, options);
        return this;
    }
    /**
     * 安装地图应用
     * @returns this
     */
    mount() {
        return this
            ._initMap()
            .fire('loaded');
    }
    /**
     * 定位
     * @param options 配置项
     * @returns this
     */
    locateTo(options) {
        const { x, y, lon, lat, zoom, ...zoomPanOptions } = options;
        if (!isNullOrUndefined(x) && !isNullOrUndefined(y)) {
            const latLng = this.xyToLatLng(point(x, y));
            this._locateTo(latLng, zoom, zoomPanOptions);
            return this;
        }
        if (!isNullOrUndefined(lon) && !isNullOrUndefined(lat)) {
            this._locateTo(latLng(lat, lon), zoom, zoomPanOptions);
            return this;
        }
        return this;
    }
    /**
     * 经纬度转投影坐标
     * @param _latLng 经纬度
     * @returns 投影坐标
     */
    latLngToXY(_latLng) {
        const crs = this.options_.mapOptions?.crs;
        if (crs) {
            return crs.project(_latLng);
        }
        return this._map.project(_latLng);
    }
    /**
     * 经纬度转投影坐标
     * @param xy 投影坐标
     * @returns 经纬度
     */
    xyToLatLng(xy) {
        const crs = this.options_.mapOptions?.crs;
        if (crs) {
            return crs.unproject(xy);
        }
        return this._map.unproject(xy);
    }
}

class FssgLeafletPlugin extends FssgMapPlugin {
    /**
     * leaflet地图实例
     */
    map_;
    /**
     * 安装插件
     * @param fssgLeaflet 地图应用实例
     * @returns this
     */
    installPlugin(fssgLeaflet) {
        this.map_ = fssgLeaflet.map;
        return this;
    }
}

export { FssgLeaflet, FssgLeafletPlugin };
