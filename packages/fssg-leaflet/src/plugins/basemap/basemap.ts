import { Layer, layerGroup, LayerGroup, tileLayer } from 'leaflet'
import { ExtLayer } from '../../extensions'
import FssgLeaflet from '../../fssg-leaflet'
import FssgLeafletPlugin, { IFssgLeafletPluginEvents, IFssgLeafletPluginOptions } from '../../fssg-leaflet-plugin'

/**
 * 底图控制插件配置项
 */
export interface IBasemapOptions extends IFssgLeafletPluginOptions { // eslint-disable-line
  items?: {
    key: string
    type?: 'tile'
    url?: string
    lyrs?: {
      type: 'tile'
      url: string
    }[]
  }[],
  selectedKey?: string
  visible?: boolean
}

/**
 * 底图控制插件事件集
 */
export interface IBasemapEvents extends IFssgLeafletPluginEvents { // eslint-disable-line
  'changed:selected-key' : { selectedKey: string }
  'changed:visible': { visible: boolean }
}

export interface IBasemapItem {
  layers: Layer[]
  options: NonNullable<IBasemapOptions['items']>[0]
}

/**
 * 底图插件
 */
export class Basemap extends FssgLeafletPlugin<IBasemapOptions, IBasemapEvents> {

  private _basemapLayer : ExtLayer<Layer>

  private _selectedKey : string

  private _visible : boolean

  private _itemPools : Map<string, IBasemapItem>

  public get visible () : boolean {
    return this._visible
  }

  public set visible (v: boolean) {
    this._basemapLayer.visible = v
    this._visible = v
    this.fire('changed:visible', { visible: v })
  }

  /**
   * 构造底图插件
   * @param options 配置项
   */
  constructor (options?: IBasemapOptions) {
    super(options, {
      items: [],
      selectedKey: options?.items?.[0].key,
      visible: true,
    })
  }

  /**
   * 初始化
   * @returns this
   */
  private _init () : this {
    this._selectedKey = this.options_.selectedKey as string
    this._visible = this.options_.visible as boolean
    this._basemapLayer = new ExtLayer(undefined, { visible: this._visible })
      .addTo(this.map_)
      .setZIndex(0)
    this._itemPools = new Map()
    return this
      ._initBasemapItems()
  }

  private _initBasemapItems () : this {
    this.options_.items?.forEach(item => {
      let layer: Layer | undefined = undefined
      if (item.type === 'tile' && item.url) {
        layer = tileLayer(item.url)
      }
      if (layer) {
        this._itemPools.set(item.key, { options: item, layers: [layer] })
      }
    })
    const selectedItem = this._itemPools.get(this._selectedKey)
    if (selectedItem) {
      this._basemapLayer.setLayer(selectedItem.layers[0])
    }
    return this
  }

  /**
   * 安装插件
   * @param fssgLeaflet 地图应用
   * @returns this
   */
  public override installPlugin (fssgLeaflet: FssgLeaflet) : this {
    return super.installPlugin(fssgLeaflet)
      ._init()
  }

}

export default Basemap
