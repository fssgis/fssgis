import { FssgMap, IFssgMapContainer, IFssgMapEvents, IFssgMapOptions } from '@fssgis/fssg-map'
import { Map as LeafletMap, MapOptions, map } from 'leaflet'

/**
 * 地图应用配置项
 */
export interface IFssgLeafletOptions extends IFssgMapOptions {
  mapOptions?: MapOptions
}

/**
 * 地图应用事件集
 */
export interface IFssgLeafletEvents extends IFssgMapEvents { // eslint-disable-line

}

/**
 * 地图接口
 */
export interface IMap extends LeafletMap {
  $owner: FssgLeaflet
}

/**
 * 地图应用
 */
export class FssgLeaflet extends FssgMap<IFssgLeafletOptions, IFssgLeafletEvents> {

  /**
   * leaflet地图实例
   */
  private _map: IMap

  /**
   * leaflet地图实例
   */
  public get map () : IMap {
    return this._map
  }

  constructor (container: IFssgMapContainer, options: IFssgLeafletOptions = {}) {
    super(container, options, {
      debugName: 'fssgLeaflet',
      debug: false,
      mapOptions: {
        zoom: 1,
        center: [0, 0],
        zoomControl: true,
        attributionControl: false,
      }
    })
  }

  private _initMap () : this {
    this._map = Object.assign(
      map(this.container, this.options_.mapOptions),
      { $owner: this }
    )
    return this
  }

  /**
   * 安装地图应用
   * @returns this
   */
  public mount () : this {
    return this
      ._initMap()
      .fire('loaded')
  }

}

export default FssgLeaflet
