import { warn } from '@fssgis/fssg-map'
import FssgEsri from '../../fssg-esri'
import FssgEsriPlugin, { IFssgEsriPluginEvents, IFssgEsriPluginOptions } from '../../fssg-esri-plugin'
import { FssgEsriBaseTool } from './base-tool'
import {
  DrawPointTool,
  DrawPolygonTool,
  DrawPolylineTool,
  DrawRectangleTool,
  DrawRectangleFasterTool,
  ZoomHomeTool,
  ZoomInRectTool,
  ZoomOutRectTool,
  MeasureCoordinateTool,
  MeasureLengthTool,
  MeasureAreaTool,
  HitTestTool,
} from './tools'
import ClearTool from './tools/clear/clear-tool'

/**
 * 地图工具链配置项
 */
export interface IMapToolsOptions extends IFssgEsriPluginOptions { // eslint-disable-line

}

/**
 * 地图工具链事件集
 */
export interface IMapToolsEvents extends IFssgEsriPluginEvents {
  'change': {
    previousKey: string
    executeKey: string
    currentKey: string
  }
}

/**
 * 地图工具链
 */
export class MapTools extends FssgEsriPlugin<IMapToolsOptions, IMapToolsEvents> {

  /**
   * 工具池
   */
  private _toolPool : Map<string, FssgEsriBaseTool> = new Map()

  /**
   * 当前激活工具的Key
   */
  private _activedKey = 'default'

  /**
   * 当前激活工具的Key
   */
  public get activedKey () : string {
    return this._activedKey
  }

  /**
   * 当前激活工具的Key
   */
  public set activedKey (key: string) {
    this._activeTool(key)
  }

  /**
   * 构造地图工具链
   * @param options 配置项
   */
  constructor (options?: IMapToolsOptions) {
    super(options, {})
  }

  /**
   * 初始化
   */
  private _init () : this {
    this._toolPool
      .set('default', new FssgEsriBaseTool(this.map_, this.view_, { isOnceTool: false }))
      .set('zoom-home', new ZoomHomeTool(this.map_, this.view_))
      .set('zoom-in-rect', new ZoomInRectTool(this.map_, this.view_))
      .set('zoom-out-rect', new ZoomOutRectTool(this.map_, this.view_))
      .set('clear', new ClearTool(this.map_, this.view_))
      .set('measure-coordinate', new MeasureCoordinateTool(this.map_, this.view_))
      .set('measure-length', new MeasureLengthTool(this.map_, this.view_))
      .set('measure-area', new MeasureAreaTool(this.map_, this.view_))
      .set('hit-test', new HitTestTool(this.map_, this.view_))
      .set('draw-rectangle', new DrawRectangleTool(this.map_, this.view_))

      .set('draw-point', new DrawPointTool(this.map_, this.view_))
      .set('draw-polyline', new DrawPolylineTool(this.map_, this.view_))
      .set('draw-polygon', new DrawPolygonTool(this.map_, this.view_))
      .set('draw-rectangle-faster', new DrawRectangleFasterTool(this.map_, this.view_))
    return this
  }

  /**
   * 安装插件
   */
  public override installPlugin (fssgEsri: FssgEsri) : this | Promise<this> {
    super.installPlugin(fssgEsri)
    return this._init()
  }

  /**
   * 设置工具
   * @param toolKey 工具Key
   */
  public _activeTool (toolKey: string) : this {
    const tool = this._toolPool.get(toolKey)
    if (!tool) {
      warn(this, `无工具项${toolKey}`)
      return this
    }
    if (tool.isOnceTool) {
      this.fire('change', {
        previousKey: this._activedKey,
        currentKey: this._activedKey,
        executeKey: toolKey,
      })
      tool.active()
      return this
    }
    [...this._toolPool.values()].map(t => {
      if (t !== tool) {
        t.deactive()
      }
    })
    this.fire('change', {
      previousKey: this._activedKey,
      currentKey: toolKey,
      executeKey: toolKey,
    })
    this._activedKey = toolKey
    tool.active()
    return this
  }

  /**
   * 创建自定义工具
   * @param key 工具Key
   * @param tool 工具对象
   */
  public createTool (key: string, tool: FssgEsriBaseTool<any, any>) : this { // eslint-disable-line
    if (this.hasTool(key)) {
      warn(this, `工具项${key}已存在，将会被覆盖`)
    }
    this._toolPool.set(key, tool)
    return this
  }

  /**
   * 检查是否存在工具
   * @param key 工具Key
   */
  public hasTool (key: string) : boolean {
    return this._toolPool.has(key)
  }

  /**
   * 移除工具
   * @param key 工具Key
   */
  public deleteTool (key: string) : this {
    this._toolPool.has(key) && this._toolPool.delete(key)
    if (this._activedKey === key) {
      this._activeTool('default')
    }
    return this
  }

  /**
   * 获取工具
   * @param key 工具Key
   */
  public getTool <T extends FssgEsriBaseTool> (key: string) : T | undefined {
    const tool = this._toolPool.get(key)
    if (tool) {
      return tool as T
    }
  }

}

export default MapTools
