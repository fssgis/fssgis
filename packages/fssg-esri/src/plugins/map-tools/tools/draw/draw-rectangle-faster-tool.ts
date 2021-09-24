import { createGeometryFactory } from '../../../../factories'
import { IMap, IView } from '../../../../fssg-esri'
import DrawTool, { IDrawToolEvents, IDrawToolOptions } from './draw-tool'

export type IDrawRectangleFasterToolOptions = IDrawToolOptions
export type IDrawRectangleFasterToolEvents = IDrawToolEvents

export class DrawRectangleFasterTool<
  T_OPTIONS extends IDrawRectangleFasterToolOptions = IDrawRectangleFasterToolOptions,
  T_EVENTS extends IDrawRectangleFasterToolEvents = IDrawRectangleFasterToolEvents,
> extends DrawTool<T_OPTIONS, T_EVENTS> {

  constructor (map: IMap, view: IView, options?: Omit<T_OPTIONS, 'drawType'>) {
    super(map, view, {
      ...options,
      drawType: 'rectangle',
      cursorType: 'draw-polygon',
    } as T_OPTIONS)
  }

  protected override initAction_ () : this {
    this.action_ = this.draw_.create('rectangle', { mode: 'freehand' })
    this.action_.on(['vertex-add', 'cursor-update', 'vertex-remove'], e => {
      const vertices = e.vertices
      if (vertices.length === 1) {
        e.type === 'vertex-add' && this.fire('draw-start', { x: vertices[0][0], y: vertices[0][1] })
        return
      }
      const geometry = createGeometryFactory(this.$)
        .createExtentFromPoints(
          vertices.map(xy => createGeometryFactory(this.$).createPointFromXY(xy))
        )
      this.fire('draw-move', { geometry })
    })
    this.action_.on('draw-complete', e => {
      const vertices = e.vertices
      const geometry = createGeometryFactory(this.$)
        .createExtentFromPoints(
          vertices.map(xy => createGeometryFactory(this.$).createPointFromXY(xy))
        )
      this.fire('draw-end', { geometry })
    })
    return this
  }

}

export default DrawRectangleFasterTool
