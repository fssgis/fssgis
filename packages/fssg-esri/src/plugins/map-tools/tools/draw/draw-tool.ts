import FssgEsriBaseTool, { IFssgEsriBaseToolEvents, IFssgEsriBaseToolOptions } from '../../base-tool'
import Geometry from '@arcgis/core/geometry/Geometry'
import Draw from '@arcgis/core/views/draw/Draw'
import DrawAction from '@arcgis/core/views/draw/DrawAction'
import { IMapElementSymbol } from '../../../map-element'
import Graphic from '@arcgis/core/Graphic'
import { $extend } from '@fssgis/utils'
import { ICallbackParams } from '@fssgis/observable'
import Point from '@arcgis/core/geometry/Point'
import { IMap, IView } from '../../../../fssg-esri'
import { OnToolActivedParams, OnToolActivedReture, OnToolDeactivedParams, OnToolDeactivedReture } from '@fssgis/fssg-map'
import { MapCursor } from '../../../map-cursor'
import { MapElement } from '../../../map-element'

type Concrete<Type> = {
  [Property in keyof Type]-?: Type[Property];
}

export type DrawType = 'point' | 'multipoint' | 'polyline' | 'polygon' | 'rectangle' | 'circle' | 'ellipse'

export type OnDrawStartParams<T> = ICallbackParams<'draw-start', T> & { x: number, y: number }
export type OnDrawMoveParams<T> = ICallbackParams<'draw-move', T> & { geometry: Geometry }
export type OnDrawEndParams<T> = ICallbackParams<'draw-end', T> & { geometry: Geometry }
export type OnDrawStartReture = Point | false
export type OnDrawMoveReture = Graphic | false
export type OnDrawEndReture = Graphic | false

export interface IDrawToolOptions extends IFssgEsriBaseToolOptions {
  drawType: DrawType
  onlyOneGraphic?: boolean
  cursorType?: string
}

export interface IDrawToolEvents extends IFssgEsriBaseToolEvents {
  'draw-start': { x: number, y: number }
  'draw-move': { geometry: Geometry }
  'draw-end': { geometry: Geometry }
}

export abstract class DrawTool<
  T_OPTIONS extends IDrawToolOptions = IDrawToolOptions,
  T_EVENTS extends IDrawToolEvents = IDrawToolEvents,
> extends FssgEsriBaseTool<T_OPTIONS, T_EVENTS> {

  //#region 私有属性

  /** 绘制图元存储容器 */
  private _graphics: Set<Graphic> = new Set()

  /** 绘制过程图元 */
  private _tempGraphic: Graphic | null

  /** 绘制时样式 */
  private _drawingStyle: Concrete<IMapElementSymbol> = {
    marker: {
      color: [255, 0, 0, .3],
      size: 12,
      outline: {
        color: [255, 0, 0, .5],
      },
    },
    line: {
      color: [255, 0, 0, .3],
    },
    fill: {
      color: [255, 0, 0, .3],
      outline: {
        color: [255, 0, 0, .5],
      },
    },
  }

  /** 绘制完成样式 */
  private _drawedStyle: Concrete<IMapElementSymbol> = {
    marker: {
      color: [255, 0, 0, .5],
      size: 12,
      outline: {
        color: [255, 0, 0, 1],
      },
    },
    line: {
      color: [255, 0, 0, 1],
    },
    fill: {
      color: [255, 0, 0, .5],
      outline: {
        color: [255, 0, 0, 1],
      },
    },
  }

  //#endregion

  //#region 保护属性

  /** 绘图对象 */
  protected draw_: Draw

  /** 绘制任务对象 */
  protected action_: DrawAction

  /** 绘图类型 */
  protected drawType_: DrawType

  protected cursorType_: string

  /** 绘制目标是否仅允许存在一个 */
  private onlyOneGraphic_: boolean


  //#endregion

  //#region 构造函数

  /**
   * 构造绘图工具对象
   * @param map 地图对象
   * @param view 视图对象
   */
  constructor (map: IMap, view: IView, options: T_OPTIONS) {
    super(map, view, options, { cursorType: 'draw', isOnceTool: false } as T_OPTIONS)
    this.draw_ = new Draw({ view })
    this.drawType_ = this.options_.drawType
    this.onlyOneGraphic_ = !!this.options_.onlyOneGraphic
    this.cursorType_ = this.options_.cursorType ?? 'default'
    this.on('draw-start', e => this.onDrawStart_(e))
    this.on('draw-move', e => this.onDrawMove_(e))
    this.on('draw-end', e => this.onDrawEnd_(e))
  }

  //#endregion

  //#region 私有方法

  private _matchStyle (geometry: Geometry, symbolOptions: IMapElementSymbol) : __esri.SymbolProperties {
    const type = geometry.type
    switch (type) {
      case 'point':
      case 'multipoint':
        return symbolOptions.marker ?? {}
      case 'polyline':
        return symbolOptions.line ?? {}
      case 'polygon':
      case 'extent':
        return symbolOptions.fill ?? {}
      default:
        return {}
    }
  }

  //#endregion

  //#region 保护方法

  /**
   * 初始化任务
   */
  protected initAction_ () : this {
    this.action_?.destroy()
    return this
  }

  /**
   * 工具激活处理事件
   */
  protected override onToolActived_ (e: OnToolActivedParams<this>) : OnToolActivedReture {
    if (!super.onToolActived_(e)) {
      return false
    }
    // const { mapElement, mapCursor } = this.$
    const mapElement = this.$.getPlugin(MapElement)
    const mapCursor = this.$.getPlugin(MapCursor)
    if (!mapElement) {
      // TODO
      return false
    }
    mapCursor.cursorType = this.cursorType_
    this.initAction_()
    return true
  }

  /**
   * 工具失活处理事件
   */
  protected override onToolDeactived_ (e: OnToolDeactivedParams<this>) : OnToolDeactivedReture {
    if (!super.onToolDeactived_(e)) {
      return false
    }
    this.action_.destroy()
    this.draw_.destroy()
    const mapElement = this.$.getPlugin(MapElement)
    if (!mapElement) {
      return false
    }
    this._tempGraphic && mapElement.remove(this._tempGraphic)
    this._tempGraphic = null
    const mapCursor = this.$.getPlugin(MapCursor)
    mapCursor.cursorType = 'default'
    return true
  }

  /**
   * 工具绘制开始处理事件
   */
  protected onDrawStart_ (e: OnDrawStartParams<this>) : OnDrawStartReture {
    if (!this.actived) {
      return false
    }
    const { x, y } = e
    return new Point({ x, y, spatialReference: this.view_.spatialReference})
  }

  /**
   * 工具绘制过程处理事件
   */
  protected onDrawMove_ (e: OnDrawMoveParams<this>) : OnDrawMoveReture {
    if (!this.actived) {
      return false
    }
    const mapElement = this.$.getPlugin(MapElement)
    if (!mapElement) {
      return false
    }
    this._tempGraphic && mapElement.remove(this._tempGraphic)
    this._tempGraphic = mapElement.add(e.geometry, this._matchStyle(e.geometry, this._drawingStyle))
    return this._tempGraphic
  }

  /**
   * 工具绘制完成处理事件
   */
  protected onDrawEnd_ (e: OnDrawEndParams<this>) : OnDrawEndReture {
    if (!this.actived) {
      return false
    }
    const mapElement = this.$.getPlugin(MapElement)
    if (!mapElement) {
      return false
    }
    this._tempGraphic && mapElement.remove(this._tempGraphic)
    this._tempGraphic = null
    let graphic: __esri.Graphic
    if (this.onlyOneGraphic_) {
      graphic = mapElement.set(e.geometry, this._matchStyle(e.geometry, this._drawedStyle))
      this._graphics.clear()
    } else {
      graphic = mapElement.add(e.geometry, this._matchStyle(e.geometry, this._drawedStyle))
    }
    this._graphics.add(graphic)
    this.initAction_()
    return graphic
  }

  //#endregion

  //#region 公有方法

  /**
   *清理绘制过的图元
   */
  public clearDrawed () : this {
    const mapElement = this.$.getPlugin(MapElement)
    if (!mapElement) {
      return this
    }
    mapElement.remove([...this._graphics])
    this._graphics.clear()
    return this
  }

  /**
   * 设置绘制完成图元样式
   */
  public setDrawedStyle (style: IMapElementSymbol) : this {
    $extend(true, this._drawedStyle, style)
    return this
  }

  /**
   * 设置绘制时图元样式
   */
  public setDrawingStyle (style: IMapElementSymbol) : this {
    $extend(true, this._drawingStyle, style)
    return this
  }

  //#endregion

}

export default DrawTool
