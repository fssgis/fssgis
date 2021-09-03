import FssgEsri from '../../fssg-esri'
import FssgEsriPlugin, { IFssgEsriPluginOptions, IFssgEsriPluginEvents } from '../../fssg-esri-plugin'
import { MAP_CURSOR_DIC, warn } from '@fssgis/fssg-map'

/**
 * 地图鼠标控制插件配置项
 */
export interface IMapCursorOptions extends IFssgEsriPluginOptions {
  items?: Record<string, string>
}

/**
 * 地图鼠标控制插件事件集
 */
export interface IMapCursorEvents extends IFssgEsriPluginEvents {
  'change': {
    cursorType: string
  }
}

/**
 * 地图鼠标控制插件
 */
export class MapCursor extends FssgEsriPlugin<IMapCursorOptions, IMapCursorEvents> {

  /**
   * 鼠标样式
   */
  private _cursorType: string

  /**
   * 样式容器池
   */
  private _typePool: Map<string, string>

  /**
   * 鼠标样式
   */
  public get cursorType () : string {
    return this._cursorType
  }

  /**
   * 鼠标样式
   */
  public set cursorType (t: string) {
    this._setCursor(t)
  }

  /**
   * 构造地图鼠标控制器
   * @param options 配置项
   */
  constructor (options?: IMapCursorOptions) {
    super(options, { items: {} })
  }

  /**
   * 初始化
   */
  private _init () : this {
    this._typePool = new Map()
    Object.entries(MAP_CURSOR_DIC).forEach(([cType, cData]) => this._typePool.set(cType, cData))
    Object.entries(this.options_.items ?? {}).forEach(([cType, cData]) => this._typePool.set(cType, cData))
    this._setCursor('default')
    return this
  }

  /**
   * 设置鼠标样式
   * @param cursorType 鼠标样式
   */
  private _setCursor (cursorType: string) {
    const cursor = this._typePool.get(cursorType)
    if (!cursor) {
      warn(this, `无鼠标样式项${cursorType}`)
    } else {
      this.fire('change', { cursorType })
    }
    this.view_.container.style.cursor = cursor ?? 'default'
  }

  /**
   * 安装插件
   */
  public override installPlugin (fssgEsri: FssgEsri) : this | Promise<this> {
    super.installPlugin(fssgEsri)
    return this._init()
  }

}

export default MapCursor
