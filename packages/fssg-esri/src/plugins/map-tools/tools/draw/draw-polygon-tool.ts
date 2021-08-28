import Polygon from '@arcgis/core/geometry/Polygon'
import { IMap, IView } from '../../../../fssg-esri'
import DrawTool, { IDrawToolEvents, IDrawToolOptions } from './draw-tool'

export type IDrawPolygonToolOptions = IDrawToolOptions
export type IDrawPolygonToolEvents = IDrawToolEvents

export class DrawPolygonTool<
  T_OPTIONS extends IDrawPolygonToolOptions = IDrawPolygonToolOptions,
  T_EVENTS extends IDrawPolygonToolEvents = IDrawPolygonToolEvents,
> extends DrawTool<T_OPTIONS, T_EVENTS> {

  constructor (map: IMap, view: IView, options?: Omit<T_OPTIONS, 'drawType'>) {
    super(map, view, {
      ...options,
      drawType: 'polygon',
      cursorType: 'draw-polygon',
    } as T_OPTIONS)
  }

  protected override initAction_ () : this {
    this.action_ = this.draw_.create('polygon')
    this.action_.on(['vertex-add', 'cursor-update', 'vertex-remove'], e => {
      const rings = e.vertices
      if (rings.length === 1) {
        e.type === 'vertex-add' && this.fire('draw-start', { x: rings[0][0][0], y: rings[0][0][1] })
        return
      }
      const geometry = new Polygon({
        rings, spatialReference: this.view_.spatialReference
      })
      this.fire('draw-move', { geometry })
    })
    this.action_.on('draw-complete', e => {
      const rings = e.vertices
      const geometry = new Polygon({
        rings, spatialReference: this.view_.spatialReference
      })
      this.fire('draw-end', { geometry })
    })
    return this
  }

}

export default DrawPolygonTool
