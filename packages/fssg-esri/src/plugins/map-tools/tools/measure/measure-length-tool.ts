import { OnToolDeactivedParams, OnToolDeactivedReture } from '@fssgis/fssg-map'
import { IMap, IView } from '../../../../fssg-esri'
import DrawPolylineTool, { IDrawPolylineToolEvents, IDrawPolylineToolOptions } from '../draw/draw-polyline-tool'
import { OnDrawEndParams, OnDrawEndReture, OnDrawMoveParams, OnDrawMoveReture } from '../draw/draw-tool'
import { planarLength } from '@arcgis/core/geometry/geometryEngineAsync'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IMeasureLengthToolOptions extends IDrawPolylineToolOptions {
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IMeasureLengthToolEvents extends IDrawPolylineToolEvents {
}



export class MeasureLengthTool<
  T_OPTIONS extends IMeasureLengthToolOptions = IMeasureLengthToolOptions,
  T_EVENTS extends IMeasureLengthToolEvents = IMeasureLengthToolEvents,
> extends DrawPolylineTool<T_OPTIONS, T_EVENTS> {

  private _overlayIds: Set<string>

  public unit: __esri.LinearUnits
  public fixedCount: number

  private _unitStrDic : Record<__esri.LinearUnits, string> = {
    'kilometers': 'km',
    'feet': 'feet',
    'meters': 'm',
    'miles': 'miles',
    'nautical-miles': 'nautical-miles',
    'yards': 'yards'
  }

  constructor (map: IMap, view: IView) {
    super(map, view)
    this._overlayIds = new Set()
    this.fixedCount = 3
    this.unit = 'kilometers'
  }

  protected override onDrawMove_ (e: OnDrawMoveParams<this>) : OnDrawMoveReture {
    const graphic = super.onDrawMove_(e)
    if (!graphic) {
      return false
    }
    const line = graphic.geometry as __esri.Polyline
    planarLength(line, this.unit).then(length => {
      this.view_.$owner.mouseTips.showTips(`长度：${length.toFixed(this.fixedCount)}${this._unitStrDic[this.unit]}`)
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
    const line = graphic.geometry as __esri.Polyline
    planarLength(line, this.unit).then(length => {
      const id = this.view_.$owner.overlays.add({
        point: line.extent.center,
        content: `长度：${length.toFixed(this.fixedCount)}${this._unitStrDic[this.unit]}`,
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

export default MeasureLengthTool
