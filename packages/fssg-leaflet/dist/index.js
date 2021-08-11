import { FssgMap, FssgMapPlugin } from '@fssgis/fssg-map';
import { map, point, latLng, Point, icon, marker, LayerGroup, tileLayer } from 'leaflet';
import { $extend } from '@fssgis/utils';

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
        const _xy = xy instanceof Point ? xy : point(xy.x, xy.y);
        if (crs) {
            return crs.unproject(_xy);
        }
        return this._map.unproject(_xy);
    }
    /**
     * 获取中心点经纬度和投影坐标信息
     * @returns 中心点的经纬度和投影坐标信息
     */
    getCenter() {
        const _latlng = this._map.getCenter();
        const xy = this.latLngToXY(_latlng);
        return {
            x: xy.x,
            y: xy.y,
            lon: _latlng.lng,
            lat: _latlng.lat,
        };
    }
    /**
     * 经纬度对象转leaflet敬畏度对象
     * @param lonlat 经纬度
     * @returns leaflet经纬度对象
     */
    lonlatToLatlng(lonlat) {
        return latLng(lonlat.lat, lonlat.lon);
    }
    /**
     * 经纬度转投影坐标
     * @param lonlat 经纬度
     * @returns 投影坐标
     */
    lonlatToXY(lonlat) {
        const _latlng = this.lonlatToLatlng(lonlat);
        return this.latLngToXY(_latlng);
    }
}

class FssgLeafletPlugin extends FssgMapPlugin {
    /**
     * leaflet地图实例
     */
    map_;
    /**
     * 绑定的地图应用实例
     */
    get $() {
        return this.map_.$owner;
    }
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

/**
 * 图元控制插件
 */
class MapElement extends FssgLeafletPlugin {
    /**
     * 图元存储池
     */
    _elementPool;
    /**
     * 构造图元控制插件
     * @param options 配置项
     */
    constructor(options) {
        super(options, {});
        this._elementPool = new Set();
    }
    /**
     * 添加图元
     * @param layer 图元
     * @returns this
     */
    add(layer) {
        this._elementPool.add(layer.addTo(this.map_));
        return this;
    }
    addMarkerByXY(xy, iconOptions, options) {
        let leafletIcon = undefined;
        if (iconOptions) {
            leafletIcon = icon(iconOptions);
        }
        const latlng = this.$.xyToLatLng(xy);
        const _marker = marker(latlng, {
            icon: leafletIcon,
            ...options,
        }).addTo(this.map_);
        this._elementPool.add(_marker);
        return _marker;
    }
    clearAll() {
        this._elementPool.forEach(item => item.removeFrom(this.map_));
        this._elementPool.clear();
        return this;
    }
}

class ExtLayer extends LayerGroup {
    options_;
    layer_;
    visible_;
    get visible() {
        return this.visible_;
    }
    set visible(v) {
        if (this.visible_ !== v) {
            this.visible_ = v;
            (v && this.layer_)
                ? this.addLayer(this.layer_)
                : this.removeLayer(this.layer_);
            this.fire('changed:visible');
        }
    }
    constructor(layer, options) {
        super();
        layer && (this.layer_ = layer);
        this.options_ = $extend(true, this.options_, {
            visible: true,
        }, options ?? {});
        this._init();
    }
    _init() {
        this.visible_ = this.options_.visible;
        if (this.visible_ && this.layer_) {
            this.addLayer(this.layer_);
        }
        return this;
    }
    setLayer(layer) {
        (this.visible_ && this.layer_) && this.removeLayer(this.layer_);
        this.layer_ = layer;
        this.visible_ && this.addLayer(layer);
        return this;
    }
}

/**
 * 底图插件
 */
class Basemap extends FssgLeafletPlugin {
    _basemapLayer;
    _selectedKey;
    _visible;
    _itemPools;
    get visible() {
        return this._visible;
    }
    set visible(v) {
        this._basemapLayer.visible = v;
        this._visible = v;
        this.fire('changed:visible', { visible: v });
    }
    /**
     * 构造底图插件
     * @param options 配置项
     */
    constructor(options) {
        super(options, {
            items: [],
            selectedKey: options?.items?.[0].key,
            visible: true,
        });
    }
    /**
     * 初始化
     * @returns this
     */
    _init() {
        this._selectedKey = this.options_.selectedKey;
        this._visible = this.options_.visible;
        this._basemapLayer = new ExtLayer(undefined, { visible: this._visible })
            .addTo(this.map_)
            .setZIndex(0);
        this._itemPools = new Map();
        return this
            ._initBasemapItems();
    }
    _initBasemapItems() {
        this.options_.items?.forEach(item => {
            let layer = undefined;
            if (item.type === 'tile' && item.url) {
                layer = tileLayer(item.url);
            }
            if (layer) {
                this._itemPools.set(item.key, { options: item, layers: [layer] });
            }
        });
        const selectedItem = this._itemPools.get(this._selectedKey);
        if (selectedItem) {
            this._basemapLayer.setLayer(selectedItem.layers[0]);
        }
        return this;
    }
    /**
     * 安装插件
     * @param fssgLeaflet 地图应用
     * @returns this
     */
    installPlugin(fssgLeaflet) {
        return super.installPlugin(fssgLeaflet)
            ._init();
    }
}

export { Basemap, FssgLeaflet, FssgLeafletPlugin, MapElement };
