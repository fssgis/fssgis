import { OnToolDeactivedParams, OnToolDeactivedReture } from '@fssgis/fssg-map'
import { IMap, IView } from '../../../../fssg-esri'
import { OnDrawEndParams, OnDrawEndReture, OnDrawMoveParams, OnDrawMoveReture } from '../draw/draw-tool'
import { planarArea } from '@arcgis/core/geometry/geometryEngineAsync'
import DrawPolygonTool, { IDrawPolygonToolEvents, IDrawPolygonToolOptions } from '../draw/draw-polygon-tool'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IMeasureAreaToolOptions extends IDrawPolygonToolOptions {
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IMeasureAreaToolEvents extends IDrawPolygonToolEvents {
}



export class MeasureAreaTool<
  T_OPTIONS extends IMeasureAreaToolOptions = IMeasureAreaToolOptions,
  T_EVENTS extends IMeasureAreaToolEvents = IMeasureAreaToolEvents,
> extends DrawPolygonTool<T_OPTIONS, T_EVENTS> {

  private _overlayIds: Set<string>

  public unit: __esri.ArealUnits
  public fixedCount: number

  private _unitStrDic : Record<__esri.ArealUnits, string> = {
    'acres': 'acres',
    'ares': 'ares',
    'hectares': 'hectares',
    'square-feet': 'square-feet',
    'square-kilometers': 'km²',
    'square-meters': 'm²',
    'square-miles': 'square-miles',
    'square-yards': 'square-yards',
  }

  constructor (map: IMap, view: IView) {
    super(map, view)
    this._overlayIds = new Set()
    this.fixedCount = 3
    this.unit = 'square-kilometers'
  }

  protected override onDrawMove_ (e: OnDrawMoveParams<this>) : OnDrawMoveReture {
    const graphic = super.onDrawMove_(e)
    if (!graphic) {
      return false
    }
    const polygon = graphic.geometry as __esri.Polygon
    planarArea(polygon, this.unit).then(area => {
      area = Math.abs(area)
      this.view_.$owner.mouseTips.showTips(`面积：${area.toFixed(this.fixedCount)}${this._unitStrDic[this.unit]}`)
    })
    return graphic
  }

  protected override onToolDeactived_ (e: OnToolDeactivedParams<this>) : OnToolDeactivedReture {
    if (!super.onToolDeactived_(e)) {
      return false
    }
    this.view_.$owner.mouseTips.cancelTips()
    return true
  }

  protected override onDrawEnd_ (e: OnDrawEndParams<this>) : OnDrawEndReture {
    const graphic = super.onDrawEnd_(e)
    if (!graphic) {
      return false
    }
    const polygon = graphic.geometry as __esri.Polygon
    planarArea(polygon, this.unit).then(area => {
      area = Math.abs(area)
      const id = this.view_.$owner.overlays.add({
        point: polygon.extent.center,
        content: `面积：${area.toFixed(this.fixedCount)}${this._unitStrDic[this.unit]}`,
      })
      this._overlayIds.add(id)
    })
    this.view_.$owner.mouseTips.cancelTips()
    return graphic
  }

  public clearMeasure () : this {
    this._overlayIds.forEach(id => {
      this.view_.$owner.overlays.removeById(id)
    })
    return this.clearDrawed()
  }

}

export default MeasureAreaTool
