import Polyline from '@arcgis/core/geometry/Polyline'
import { IMap, IView } from '../../../../fssg-esri'
import DrawTool, { IDrawToolEvents, IDrawToolOptions } from './draw-tool'

export type IDrawPolylineToolOptions = IDrawToolOptions
export type IDrawPolylineToolEvents = IDrawToolEvents

export class DrawPolylineTool<
  T_OPTIONS extends IDrawPolylineToolOptions = IDrawPolylineToolOptions,
  T_EVENTS extends IDrawPolylineToolEvents = IDrawPolylineToolEvents,
> extends DrawTool<T_OPTIONS, T_EVENTS> {

  constructor (map: IMap, view: IView, onlyOneGraphic = false) {
    super(map, view, {
      drawType: 'polyline',
      onlyOneGraphic,
      cursorType: 'draw-line',
    } as T_OPTIONS)
  }

  protected override initAction_ () : this {
    this.action_ = this.draw_.create('polyline')
    this.action_.on(['vertex-add', 'cursor-update', 'vertex-remove'], e => {
      const paths = e.vertices
      if (paths.length === 1) {
        e.type === 'vertex-add' && this.fire('draw-start', { x: paths[0][0], y: paths[0][1] })
        return
      }
      const geometry = new Polyline({
        paths, spatialReference: this.view_.spatialReference
      })
      this.fire('draw-move', { geometry })
    })
    this.action_.on('draw-complete', e => {
      const paths = e.vertices
      const geometry = new Polyline({
        paths, spatialReference: this.view_.spatialReference
      })
      this.fire('draw-end', { geometry })
    })
    return this
  }

}

export default DrawPolylineTool
