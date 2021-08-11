import { icon, Icon, IconOptions, Layer, Marker, marker, MarkerOptions } from 'leaflet'
import { IXY } from '../../fssg-leaflet'
import FssgLeafletPlugin, { IFssgLeafletPluginEvents, IFssgLeafletPluginOptions } from '../../fssg-leaflet-plugin'

/**
 * 图元控制插件配置项
 */
export interface IMapElementOptions extends IFssgLeafletPluginOptions { // eslint-disable-line

}

/**
 * 图元控制插件事件集
 */
export interface IMapElementEvents extends IFssgLeafletPluginEvents { // eslint-disable-line

}

/**
 * 图元控制插件
 */
export class MapElement extends FssgLeafletPlugin<IMapElementOptions, IMapElementEvents> {

  /**
   * 图元存储池
   */
  private _elementPool : Set<Layer>

  /**
   * 构造图元控制插件
   * @param options 配置项
   */
  constructor (options?: IMapElementOptions) {
    super(options, {})
    this._elementPool = new Set()
  }

  /**
   * 添加图元
   * @param layer 图元
   * @returns this
   */
  public add (layer: Layer) : this {
    this._elementPool.add(layer.addTo(this.map_))
    return this
  }

  public addMarkerByXY (xy: IXY, iconOptions?: IconOptions, options?: MarkerOptions) : Marker {
    let leafletIcon : Icon | undefined = undefined
    if (iconOptions) {
      leafletIcon = icon(iconOptions)
    }
    const latlng = this.$.xyToLatLng(xy)
    const _marker = marker(latlng, {
      icon: leafletIcon,
      ...options,
    }).addTo(this.map_)
    this._elementPool.add(_marker)
    return _marker
  }

  public clearAll () : this {
    this._elementPool.forEach(
      item => item.removeFrom(this.map_)
    )
    this._elementPool.clear()
    return this
  }

}

export default MapElement
