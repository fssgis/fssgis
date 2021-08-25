import MapLayers, { IMapLayersOptions } from '../map-layers'
import FssgEsri, { IFssgEsriOptions } from '../../fssg-esri'
import FssgEsriPlugin, { IFssgEsriPluginEvents, IFssgEsriPluginOptions } from '../../fssg-esri-plugin'
import MapElement from '../map-element'
import { throttle, whenRightReturn, $extend } from '@fssgis/utils'

/**
 * 鹰眼插件配置项
 */
export interface IHawkeyeOptions extends IFssgEsriPluginOptions {
  container?: string
  symbol?: __esri.SimpleFillSymbolProperties
  layers?: Required<IMapLayersOptions>['items']
  fssgEsriOptions?: IFssgEsriOptions
}

/**
 * 鹰眼插件事件集
 */
export interface IHawkeyeEvents extends IFssgEsriPluginEvents { // eslint-disable-line

}

/**
 * 鹰眼插件
 */
export class Hawkeye extends FssgEsriPlugin<IHawkeyeOptions, IHawkeyeEvents> {

  private _fssgEsri: FssgEsri

  private _container: string

  /**
   * 构造鹰眼插件
   * @param options 配置项
   */
  constructor (options?: IHawkeyeOptions) {
    super(options, {
      container: 'hawkeye-container',
      symbol: {
        type: 'simple-fill',
        color: [255, 0, 0, 0.1],
      },
      layers: []
    })
  }

  /**
   * 初始化
   */
  private _init () : this {
    this._container = this.options_.container as string
    this._fssgEsri = new FssgEsri(this._container, $extend(true, {}, this.$.options, this.options_.fssgEsriOptions, { debug: false }))
      .use(new MapElement({
        graphicsSymbol: {
          fill: this.options_.symbol
        }
      }))
      .use(new MapLayers({
        items: this.options_.layers
      }))
    this.$.when()
      .then(() => whenRightReturn(1000, () => document.getElementById(this._container)))
      .then(() => {
        this._fssgEsri.mount()
        this._initExtentSync()
      })
    return this
  }

  /**
   * 初始化地图同步
   */
  private _initExtentSync () : this {
    const sourceView = this.$.view
    const hawkeyeView = this._fssgEsri.view
    Promise.all([sourceView.when, hawkeyeView.when]).then(() => {
      this._fssgEsri.mapElement
        .set(sourceView.extent)
      //禁止移动地图
      hawkeyeView.on('drag', event => {
        event.stopPropagation()
      })
      hawkeyeView.on('mouse-wheel', event => {
        event.stopPropagation()
      })
      // 动态主图绘制范围
      sourceView.watch(['zoom', 'center'], throttle(() => {
        this._fssgEsri.mapElement
          .set(sourceView.extent)
      }, 200) as __esri.WatchCallback)
    })
    return this
  }

  /**
   * 安装插件
   * @param fssgEsri 地图应用
   */
  public override installPlugin (fssgEsri: FssgEsri) : this {
    return super.installPlugin(fssgEsri)
      ._init()
  }

}

export default Hawkeye
