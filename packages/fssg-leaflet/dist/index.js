import { FssgMap, FssgMapPlugin } from '@fssgis/fssg-map';
import { map } from 'leaflet';

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
    _initMap() {
        this._map = Object.assign(map(this.container, this.options_.mapOptions), { $owner: this });
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
