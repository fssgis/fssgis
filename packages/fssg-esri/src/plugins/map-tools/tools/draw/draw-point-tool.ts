import Point from '@arcgis/core/geometry/Point'
import { OnToolDeactivedParams, OnToolDeactivedReture } from '@fssgis/fssg-map'
import { IMap, IView } from '../../../../fssg-esri'
import DrawTool, { IDrawToolEvents, IDrawToolOptions } from './draw-tool'

export type IDrawPointToolOptions = IDrawToolOptions
export type IDrawPointToolEvents = IDrawToolEvents

export class DrawPointTool<
  T_OPTIONS extends IDrawPointToolOptions = IDrawPointToolOptions,
  T_EVENTS extends IDrawPointToolEvents = IDrawPointToolEvents,
> extends DrawTool<T_OPTIONS, T_EVENTS> {

  private _pointerMoveHandler : IHandle

  constructor (map: IMap, view: IView, onlyOneGraphic = false) {
    super(map, view, {
      drawType: 'point',
      onlyOneGraphic,
      cursorType: 'draw-point',
    } as T_OPTIONS)
  }

  protected override initAction_ () : this {
    super.initAction_()
    this.action_ = this.draw_.create('point')
    this.action_.on('draw-complete', e => {
      const [x, y] = e.coordinates
      this.fire('draw-start', { x, y })
      const geometry = new Point({
        x, y, spatialReference: this.view_.spatialReference
      })
      this.fire('draw-end', { geometry })
    })
    this._pointerMoveHandler = this.view_.on('pointer-move', e => {
      const geometry = this.view_.toMap(e)
      this.fire('draw-move', { geometry })
    })
    return this
  }

  protected override onToolDeactived_ (e: OnToolDeactivedParams<this>) : OnToolDeactivedReture {
    if (!super.onToolDeactived_(e)) {
      return false
    }
    this._pointerMoveHandler.remove()
    return true
  }

}

export default DrawPointTool
