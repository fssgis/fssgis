import FssgEsri from '../../fssg-esri'
import FssgEsriPlugin, { IFssgEsriPluginOptions, IFssgEsriPluginEvents } from '../../fssg-esri-plugin'
import WebTileLayer from '@arcgis/core/layers/WebTileLayer'
import { BASEMAP_TIAN_DI_TU_3857, BASEMAP_TIAN_DI_TU_4326 } from '@fssgis/fssg-map'
import EsriBasemap from '@arcgis/core/Basemap'

/**
 * 底图控制插件配置项
 */
 export interface IBasemapOptions extends IFssgEsriPluginOptions { // eslint-disable-line
  items?: {
    key: string
    type?: 'webtilelayer'
    url?: string
    props?: __esri.LayerProperties
    lyrs?: {
      type: 'webtilelayer'
      url: string
      props?: __esri.LayerProperties
    }[]
  }[],
  selectedKey?: string
  visible?: boolean
}

/**
 * 底图控制插件事件集
 */
export interface IBasemapEvents extends IFssgEsriPluginEvents { // eslint-disable-line
  'changed:selected-key' : { selectedKey: string }
  'changed:visible': { visible: boolean }
}

export interface IBasemapItem {
  layers: __esri.Layer[]
  options: NonNullable<IBasemapOptions['items']>[0]
}

/**
 * 底图控制插件
 */
export class Basemap extends FssgEsriPlugin<IBasemapOptions, IBasemapEvents> {

  public static readonly BASEMAP_TIAN_DI_TU_3857 = BASEMAP_TIAN_DI_TU_3857
  public static readonly BASEMAP_TIAN_DI_TU_4326 = BASEMAP_TIAN_DI_TU_4326

  private _selectedKey : string

  private _visible : boolean

  private _itemPool : Map<string, __esri.Layer[]>

  public get visible () : boolean {
    return this._visible
  }

  public set visible (v: boolean) {
    if (v === this._visible) {
      return
    }
    [...this._itemPool.values()].forEach(item => {
      item.forEach(lyr => lyr.visible = v)
    })
    this._visible = v
    this.fire('changed:visible', { visible: v })
  }

  constructor (options?: IBasemapOptions) {
    super(options, {
      items: [],
      selectedKey: options?.items?.[0].key,
      visible: true,
    })
    this._itemPool = new Map()
  }

  public get selectedKey () : string {
    return this._selectedKey
  }

  public set selectedKey (key: string) {
    if (key === this._selectedKey) {
      return
    }
    const item = this._itemPool.get(key)
    if (!item) {
      // TODO msg
      return
    }
    // eslint-disable-next-line
    // @ts-ignore
    this.map_.basemap.baseLayers = item
    this._selectedKey = key
    this.fire('changed:selected-key', { selectedKey: key })
  }

  private _init () : this {
    if (!this.map_.basemap) {
      this.map_.basemap = new EsriBasemap()
    }
    this.options_.items?.forEach(item => {
      if (item.lyrs) {
        const layers: __esri.Layer[] = []
        item.lyrs.forEach(o => {
          if (o.type === 'webtilelayer') {
            layers.push(new WebTileLayer({
              urlTemplate: o.url,
              ...o.props
            }))
          }
        })
        this._itemPool.set(item.key, layers)
        return
      }
      let layer: __esri.Layer | undefined
      if (item.type === 'webtilelayer') {
        layer = new WebTileLayer({
          urlTemplate: item.url,
          ...item.props
        })
      }
      if (layer) {
        this._itemPool.set(item.key, [layer])
      }
    })
    this._createTianDiTu()
    this.visible = !!this.options_.visible
    this.selectedKey = this.options_.selectedKey ?? '天地图矢量3857'
    return this
  }

  /**
   * 创建天地图底图项
   * @returns this
   */
   private _createTianDiTu () : this {
    const createTianDiTuItem = (name: string, proj: string) => {
      this.createBasemapItem(`天地图${name}${proj}`, new WebTileLayer(Basemap[`BASEMAP_TIAN_DI_TU_${proj}`][`${name}底图`]))
      this.createBasemapItem(`天地图${name}含注记${proj}`, [
        new WebTileLayer(Basemap[`BASEMAP_TIAN_DI_TU_${proj}`][`${name}底图`]),
        new WebTileLayer(Basemap[`BASEMAP_TIAN_DI_TU_${proj}`][`${name}注记`]),
      ])
      return createTianDiTuItem
    }
    createTianDiTuItem('影像', '4326')('矢量', '4326')('地形', '4326')('影像', '3857')('矢量', '3857')('地形', '3857')
    return this
  }

  public override installPlugin (fssgEsri: FssgEsri) : this {
    return super.installPlugin(fssgEsri)
      ._init()
  }

  /**
   * 创建底图项
   * @param key 底图项Key值
   * @param layer 底图图层
   */
   public createBasemapItem (key: string, layer: __esri.Layer) : this
   /**
    * 创建底图项
    * @param key 底图项Key值
    * @param layers 底图图层数组
    */
   public createBasemapItem (key: string, layers: __esri.Layer[]) : this
   /**
    * 创建底图项
    * @param key 底图项
    * @param arg1 底图图层 or 底图图层数组
    * @returns this
    */
   public createBasemapItem (key: string, arg1: __esri.Layer | __esri.Layer[]) : this {
     const layers = Array.isArray(arg1) ? arg1 : [arg1]
     this._itemPool.set(key, layers)
     return this
   }

}

export default Basemap
