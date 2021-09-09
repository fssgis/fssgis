import { error } from '@fssgis/fssg-map'
import { createLayerFactory } from '../../factories'
import FssgEsri from '../../fssg-esri'
import FssgEsriPlugin, { IFssgEsriPluginOptions, IFssgEsriPluginEvents } from '../../fssg-esri-plugin'

/**
 * 图层控制插件配置项
 */
export interface IMapLayersOptions extends IFssgEsriPluginOptions {
  items?: {
    id: string
    name: string
    serverName?: string // 针对动态图层
    layerType: string
    layerUrl: string
    properties?: __esri.LayerProperties
    sqlOptions?: {
      xField: string
      yField: string
      iconUrl?: string
      iconUrlFuncStr?: string
    },
    isQuery?: boolean
  }[],
  defaultLayerVisible?: boolean
}

type LayerOptions = Required<IMapLayersOptions>['items'][0]

/**
 * 图层控制插件事件集
 */
export interface IMapLayersEvents extends IFssgEsriPluginEvents {
  'change:visible': {
    visible: boolean
    layer: __esri.Layer
    options: LayerOptions
  },
  'change:opacity': {
    opacity: number
    layer: __esri.Layer
    options:LayerOptions
  },
}

/**
 * 图层控制插件
 */
export class MapLayers extends FssgEsriPlugin<IMapLayersOptions, IMapLayersEvents> {

  /**
   * 图层容器池
   */
  private _layerPool : Map<string | __esri.Layer, [__esri.Layer, LayerOptions]>

  /**
   * 图层容器图层
   */
  private _group: __esri.GroupLayer

  /**
   * 可查询的图层集合
   */
  public get layersWhichCanQuery () : [__esri.Layer, LayerOptions][] {
    return [...this._layerPoolUnique.values()]
      .filter(([_, options]) => options.isQuery)
  }

  /**
   * 不可查询的图层集合
   */
  public get layersWhichCantQuery () : [__esri.Layer, LayerOptions][] {
    return [...this._layerPoolUnique.values()]
      .filter(([_, options]) => !options.isQuery)
  }

  /**
   * 图层容器，唯一存储
   */
  private get _layerPoolUnique () : Map<string, [__esri.Layer, LayerOptions]> {
    const set = new Set([...this._layerPool.values()])
    const map = new Map<string, [__esri.Layer, LayerOptions]>()
    set.forEach(item => map.set(item[0].id, item))
    return map
  }

  /**
   * 构造图层控制插件
   * @param options 配置项
   */
  constructor (options?: IMapLayersOptions) {
    super(options, { items: [], defaultLayerVisible: true })
  }

  /**
   * 初始化
   */
  private _init () : this {
    this._layerPool = new Map()
    this._group = createLayerFactory().createGroupLayer()
    this.map_.add(this._group)
    return this
      ._initLayers()
  }

  /**
   * 初始化图层
   */
  private _initLayers () : this {
    this.options_.items?.forEach(layerOptions => {
      const { properties, ...others } = layerOptions
      const props : Record<string, unknown> = {
        visible: this.options_.defaultLayerVisible,
        ...properties,
        ...others,
      }
      if (layerOptions.layerType === 'webtilelayer') {
        props.urlTemplate = layerOptions.layerUrl
      } else {
        props.url = layerOptions.layerUrl
      }
      if (layerOptions.layerType === 'sqllayer' || layerOptions.layerType === 'sqllayer2') {
        props.sqlOptions = layerOptions.sqlOptions
        props.spatialReference = this.view_.spatialReference
      }
      const layer = createLayerFactory().createLayer(props as any) // eslint-disable-line
      this._group.add(layer)
      this._layerPool
        .set(layerOptions.id, [layer, layerOptions])
        .set(layerOptions.name, [layer, layerOptions])
        .set(layer, [layer, layerOptions])
      layer.watch('visible', visible => this.fire('change:visible', {
        visible, layer, options: layerOptions
      }))
      layer.watch('opacity', opacity => this.fire('change:opacity', {
        opacity, layer, options: layerOptions
      }))
    })
    return this
  }

  /**
   * 查找图层项
   * @param key 键
   */
  private _findItem (key: string | __esri.Layer) : [__esri.Layer, LayerOptions] {
    const item = this._layerPool.get(key)
    if (!item) {
      throw error(this, `无图层项${key}`)
    }
    return item
  }

  /**
   * 安装插件
   * @param fssgEsri 地图应用
   */
  public override installPlugin (fssgEsri: FssgEsri) : this | Promise<this> {
    super.installPlugin(fssgEsri)
    return this._init()
  }

  /**
   * 通过图层Id查找图层
   * @param nameOrId 图层名或Id
   */
  public findLayer <T extends __esri.Layer = __esri.Layer> (nameOrId: string) : T | undefined {
    return this._findItem(nameOrId)?.[0] as T
  }

  /**
   * 通过图层Id查找配置项
   * @param nameOrIdOrLayer 图层名或Id或图层对象
   */
  public findLayerOptions (nameOrIdOrLayer: string | __esri.Layer) : LayerOptions | undefined {
    return this._findItem(nameOrIdOrLayer)?.[1]
  }

  /**
   * 设置图层可见性
   * @param nameOrId 图层名或Id
   * @param visible 可见性，默认为true
   */
  public setLayerVisible (nameOrId: string, visible = true) : this {
    const layer = this.findLayer(nameOrId)
    layer && (layer.visible = visible)
    return this
  }

  /**
   * 设置图层不透明度
   * @param nameOrId 图层名或Id
   * @param opacity 不透明度
   */
  public setLayerOpacity (nameOrId: string, opacity: number) : this {
    const layer = this.findLayer(nameOrId)
    layer && (layer.opacity = opacity)
    return this
  }

  public async forEach (callback: (item: [__esri.Layer, LayerOptions]) => void) : Promise<this> {
    const values = [...this._layerPoolUnique.values()]
    for (let i = 0; i < values.length; i++) {
      await callback(values[i])
    }
    return this
  }

}

export default MapLayers
