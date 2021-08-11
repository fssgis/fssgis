import { FssgMap, IFssgMapContainer, IFssgMapEvents, IFssgMapOptions } from '@fssgis/fssg-map'
import { Map as LeafletMap, MapOptions, map, LatLng, ZoomPanOptions, latLng, point, Point } from 'leaflet'
import { isNullOrUndefined } from '../../../fssgis-utils/src'
import { Basemap, MapElement } from '../plugins'

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
 * 经纬度接口
 */
export interface ILonlat {
  lon: number
  lat: number
}

/**
 * 平面坐标接口
 */
export interface IXY {
  x: number
  y: number
}

export interface ILocateOptions extends ZoomPanOptions {
  x?: number
  y?: number
  lon?: number
  lat?: number
  zoom?: number
}

/**
 * 地图应用
 */
export class FssgLeaflet extends FssgMap<IFssgLeafletOptions, IFssgLeafletEvents> {

  public basemap: Basemap
  public mapElement: MapElement

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

  /**
   * 构造地图应用
   * @param container 地图容器
   * @param options 配置项
   */
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

  /**
   * 初始化地图实例
   * @returns this
   */
  private _initMap () : this {
    this._map = Object.assign(
      map(this.container, this.options_.mapOptions),
      { $owner: this }
    )
    return this
  }

  /**
   * 定位
   * @param latLng 经纬度对象
   * @param zoom 缩放等级
   * @param options 配置项
   * @returns this
   */
  private _locateTo (latLng: LatLng, zoom?: number, options?: ZoomPanOptions) : this {
    zoom = zoom ?? this._map.getZoom()
    this._map.flyTo(latLng, zoom, {
      ...options,
    })
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

  /**
   * 定位
   * @param options 配置项
   * @returns this
   */
  public locateTo (options: ILocateOptions) : this {
    const { x, y, lon, lat, zoom, ...zoomPanOptions } = options
    if (!isNullOrUndefined(x) && !isNullOrUndefined(y)) {
      const latLng = this.xyToLatLng(point(x as number, y as number))
      this._locateTo(latLng, zoom, zoomPanOptions)
      return this
    }
    if (!isNullOrUndefined(lon) && !isNullOrUndefined(lat)) {
      this._locateTo(latLng(lat as number, lon as number), zoom, zoomPanOptions)
      return this
    }
    return this
  }

  /**
   * 经纬度转投影坐标
   * @param _latLng 经纬度
   * @returns 投影坐标
   */
  public latLngToXY (_latLng: LatLng) : Point {
    const crs = this.options_.mapOptions?.crs
    if (crs) {
      return crs.project(_latLng)
    }
    return this._map.project(_latLng)
  }

  /**
   * 经纬度转投影坐标
   * @param xy 投影坐标
   * @returns 经纬度
   */
  public xyToLatLng (xy: IXY) : LatLng {
    const crs = this.options_.mapOptions?.crs
    const _xy = point(xy.x, xy.y)
    if (crs) {
      return crs.unproject(_xy)
    }
    return this._map.unproject(_xy)
  }

  /**
   * 获取中心点经纬度和投影坐标信息
   * @returns 中心点的经纬度和投影坐标信息
   */
  public getCenter () : { x: number, y: number, lon: number, lat: number } {
    const _latlng = this._map.getCenter()
    const xy = this.latLngToXY(_latlng)
    return {
      x: xy.x,
      y: xy.y,
      lon: _latlng.lng,
      lat: _latlng.lat,
    }
  }

  /**
   * 经纬度对象转leaflet敬畏度对象
   * @param lonlat 经纬度
   * @returns leaflet经纬度对象
   */
  public lonlatToLatlng (lonlat: ILonlat) : LatLng {
    return latLng(lonlat.lat, lonlat.lon)
  }

  /**
   * 经纬度转投影坐标
   * @param lonlat 经纬度
   * @returns 投影坐标
   */
  public lonlatToXY (lonlat: ILonlat) : Point {
    const _latlng = this.lonlatToLatlng(lonlat)
    return this.latLngToXY(_latlng)
  }

}

export default FssgLeaflet
