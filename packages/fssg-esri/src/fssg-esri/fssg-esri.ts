import { FssgMap, IFssgMapEvents, IFssgMapOptions } from '@fssgis/fssg-map'
import ArcGISMap from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import esriConfig from '@arcgis/core/config'
import { Basemap, Hawkeye, LayerTree, MapCursor, MapElement, MapLayers, MapModules, MapTools, MouseTips, Overlays } from '../plugins'
import { error } from '@fssgis/fssg-map'
import { createGeometryFactory, LonLat, XY } from '../factories'
import FssgEsriPlugin from '../fssg-esri-plugin'

esriConfig.apiKey = 'AAPKb95001bcb6a34be7a32b3fcb75eb27d1ujL7yX9tcvWSbUPoKwptBe_57mwGWOpklkdWrPt3L3OaW96gkJLjRctcOo1OvJ1S'

/**
 * 地图应用配置项
 */
export interface IFssgEsriOptions extends IFssgMapOptions {
  mapOptions?: __esri.MapProperties
  viewOptions?: __esri.MapViewProperties
  assetsPath?: string
}

/**
 * 地图应用事件集
 */
export interface IFssgEsriEvents extends IFssgMapEvents {
  'center-ready': { center: __esri.Point }
}

export interface IOwner {
  $owner: FssgEsri
}
export type IMap = __esri.Map & IOwner
export type IView = __esri.MapView & IOwner


/**
 * 地图应用
 */
export class FssgEsri extends FssgMap<IFssgEsriOptions, IFssgEsriEvents> {

  public basemap: Basemap
  public mapElement: MapElement
  public mapTools: MapTools
  public mapCursor: MapCursor
  public mapLayers: MapLayers
  public hawkeye: Hawkeye
  public layerTree: LayerTree
  public mapModules: MapModules
  public mouseTips: MouseTips
  public overlays: Overlays

  //#region 私有属性

  /**
   * 地图对象
   */
  private _map: IMap

  /**
    * 视图对象
    */
  private _view: IView

  //#endregion

  //#region getter setter

  /**
    * 地图对象
    */
  public get map () : IMap {
    return this._map
  }

  /**
    * 视图对象
    */
  public get view () : IView {
    return this._view
  }

  /**
   * 配置项
   */
  public get options () : IFssgEsriOptions {
    return this.options_
  }

  /**
   * 空间坐标系
   */
  public get sr () : __esri.SpatialReference {
    if (!this._view) {
      error(this, `_view未实例无法获取spatialReference属性`)
    }
    const sr = this?._view?.spatialReference
    return sr as __esri.SpatialReference
  }

  /**
   * 视图中心点
   */
  public get center () : __esri.Point {
    if (!this._view) {
      error(this, `_view未实例无法获取center属性`)
    }
    const center = this?._view?.center
    return center as __esri.Point
  }

  /**
   * 视图范围
   */
  public get extent () : __esri.Extent {
    if (!this._view) {
      error(this, `_view未实例无法获取extent属性`)
    }
    const extent = this?._view?.extent
    return extent as __esri.Extent
  }

  /**
   * 缩放等级
   */
  public get zoom () : number {
    if (!this._view) {
      error(this, `_view未实例无法获取zoom属性`)
    }
    const zoom = this?._view?.zoom
    return zoom as number
  }

  //#endregion

  //#region 构造函数

  /**
   * 构造地图应用实例
   * @param container 地图容器
   * @param options 配置项
   */
   constructor (container: string, options?: IFssgEsriOptions) {
    super(container, options, {
      viewOptions: {
        center: [0, 0],
        zoom: 1,
        ui: { components: [] },
        constraints: {
          rotationEnabled: false,
        },
        popup: {
          autoOpenEnabled: false,
        }
      },
      mapOptions: {},
      debug: false,
      debugName: 'fssgEsri',
    })
  }

  //#endregion

  //#region 私有方法

  /**
   * 初始化地图
   */
  private _initMap () : this {
    const { mapOptions } = this.options_
    const map = new ArcGISMap(mapOptions)
    this._map = Object.assign(map, { $owner: this })
    return this
  }

  /**
   * 初始化视图
   */
  private _initView () : this {
    const { viewOptions } = this.options_
    const view = new MapView({
      ...viewOptions,
      map: this._map,
      container: this.container
    })
    this._view = Object.assign(view, { $owner: this })
    return this
  }

  /**
   * 初始化静态资源
   */
  private _initAssetsPath () : this {
    const { assetsPath } = this.options_
    assetsPath && (esriConfig.assetsPath = assetsPath)
    return this
  }

  /**
   * 初始化地图容器样式（移除focus时的边框样式）
   */
  private _initRemoveOnlineStyle () : this {
    document.styleSheets[0].addRule('.esri-view', 'outline: none !important')
    document.styleSheets[0].addRule('.esri-view .esri-view-surface', 'outline: none !important')
    document.styleSheets[0].addRule('.esri-view .esri-view-surface--inset-outline:focus::after', 'outline: none !important')
    return this
  }

  private _gotoPromise : Promise<unknown> | undefined
  private _handleId: NodeJS.Timeout
  public goto (target: __esri.Geometry | __esri.Graphic | __esri.Geometry[] | __esri.Graphic[] | number[] | __esri.Collection<__esri.Geometry> | __esri.Collection<__esri.Graphic> | { center?: __esri.Point, zoom?: number }, options?: __esri.GoToOptions2D) : this {
    clearTimeout(this._handleId)
    const gotoFunc : () => Promise<unknown> = this.view.goTo.bind(this.view, target, options)
    if (this._gotoPromise) {
      this._gotoPromise = this._gotoPromise.then(() => gotoFunc())
    } else {
      this._gotoPromise = gotoFunc()
    }
    this._handleId = setTimeout(() => this._gotoPromise = undefined, 2500)
    return this
  }

  //#endregion

  //#region 公有方法

  /**
   * 安装
   */
   public mount () : this {
    this
      ._initAssetsPath()
      ._initMap()
      ._initView()
      ._initRemoveOnlineStyle()
      .fire('loaded')
    return this
  }

  /**
   * 缩放
   * @param num 缩放值
   * @param options 配置项
   */
  public zoomIn (num = 1, options?: __esri.GoToOptions2D) : this {
    const zoom = this.zoom
    this.goto({ zoom: zoom + Math.round(num) }, options)
    return this
  }

  /**
   * 缩放
   * @param num 缩放值
   * @param options 配置项
   */
  public zoomOut (num = 1, options?: __esri.GoToOptions2D) : this {
    const zoom = this.zoom
    this.goto({ zoom: zoom - Math.round(num) }, options)
    return this
  }

  /**
   * 缩放至
   * @param num 缩放等级
   * @param options 配置项
   */
  public zoomTo (zoom: number, options?: __esri.GoToOptions2D) : this {
    this.goto({ zoom }, options)
    return this
  }

  /**
   * 定位
   * @param xy XY坐标
   * @param zoom 缩放等级
   * @param options 配置项
   */
  public locateToXY (xy: XY, zoom?: number, options?: __esri.GoToOptions2D & { isZoomAdd?: boolean }) : this {
    const center = createGeometryFactory(this).createPointFromXY(xy)
    if (options?.isZoomAdd && zoom) {
      zoom = this.zoom + zoom
    }
    this.goto({ center, zoom }, options)
    return this
  }

  /**
   * 定位
   * @param lonLat 经纬度
   * @param zoom 缩放等级
   * @param options 配置项
   */
  public locateToLonlat (lonLat: LonLat, zoom?: number, options?: __esri.GoToOptions2D & { isZoomAdd?: boolean }) : this {
    const center = createGeometryFactory(this).createPointFromLonLat(lonLat)
    if (options?.isZoomAdd && zoom) {
      zoom = this.zoom + zoom
    }
    this.goto({ center }, options)
    return this
  }

  /**
   * 重置地图应用
   */
  public reset () : Promise<this> {
    return new Promise(resolve => {
      this._view.destroy()
      this.mount()
      for (const prop in this) {
        if (this[prop] instanceof FssgEsriPlugin) {
          (this[prop] as any).installPlugin(this) // eslint-disable-line
        }
      }
      resolve(this)
    })
  }

  //#endregion
}

export default FssgEsri
