import { FssgMap, IFssgMapEvents, IFssgMapOptions } from '@fssgis/fssg-map'
import ArcGISMap from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import esriConfig from '@arcgis/core/config'
import { Basemap, MapElement, MapTools } from '../plugins'
import { error } from '@fssgis/fssg-map'

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
   * 空间坐标系
   */
  public get sr () : __esri.SpatialReference {
    if (!this._view) {
      error(this, `_view未实例无法获取spatialReference属性`)
    }
    const sr = this?._view?.spatialReference
    return sr ?? null as any // eslint-disable-line
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
        ui: { components: [] }
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

  //#endregion
}

export default FssgEsri
