import { OnToolDeactivedParams, OnToolDeactivedReture } from '@fssgis/fssg-map'
import { IMap, IView } from '../../../../fssg-esri'
import DrawPointTool, { IDrawPointToolEvents, IDrawPointToolOptions } from '../draw/draw-point-tool'
import { OnDrawEndParams, OnDrawEndReture, OnDrawMoveParams, OnDrawMoveReture } from '../draw/draw-tool'
import { MouseTips } from '../../../mouse-tips'
import { Overlays } from '../../../overlays'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IMeasureCoordinateToolOptions extends IDrawPointToolOptions {
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IMeasureCoordinateToolEvents extends IDrawPointToolEvents {
}

export class MeasureCoordinateTool<
  T_OPTIONS extends IMeasureCoordinateToolOptions = IMeasureCoordinateToolOptions,
  T_EVENTS extends IMeasureCoordinateToolEvents = IMeasureCoordinateToolEvents,
> extends DrawPointTool<T_OPTIONS, T_EVENTS> {

  private _overlayIds: Set<string>

  constructor (map: IMap, view: IView) {
    super(map, view)
    this._overlayIds = new Set()
  }

  protected override onDrawMove_ (e: OnDrawMoveParams<this>) : OnDrawMoveReture {
    const graphic = super.onDrawMove_(e)
    if (!graphic) {
      return false
    }
    const point = graphic.geometry as __esri.Point
    this.view_.$owner.getPlugin(MouseTips).showTips(`x: ${point.x.toFixed(3)}<br>y: ${point.y.toFixed(3)}`)
    return graphic
  }

  protected override onToolDeactived_ (e: OnToolDeactivedParams<this>) : OnToolDeactivedReture {
    if (!super.onToolDeactived_(e)) {
      return false
    }
    this.view_.$owner.getPlugin(MouseTips).cancelTips()
    return true
  }

  protected override onDrawEnd_ (e: OnDrawEndParams<this>) : OnDrawEndReture {
    const graphic = super.onDrawEnd_(e)
    if (!graphic) {
      return false
    }
    const point = graphic.geometry as __esri.Point
    const id = this.view_.$owner.getPlugin(Overlays).add({
      point,
      content: `x: ${point.x.toFixed(3)}<br>y: ${point.y.toFixed(3)}`,
      offsetX: 0,
      offsetY: 0,
      showBezierCurve: true,
    })
    this._overlayIds.add(id)
    return graphic
  }

  public clearMeasure () : this {
    this._overlayIds.forEach(id => {
      this.view_.$owner.getPlugin(Overlays).removeById(id)
    })
    return this.clearDrawed()
  }

}

export default MeasureCoordinateTool
