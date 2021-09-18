import { ICallbackParams } from '@fssgis/observable'
import { IMap, IView } from '../../../../fssg-esri'
import DrawPolygonTool, { IDrawPolygonToolEvents, IDrawPolygonToolOptions } from '../draw/draw-polygon-tool'
import { OnDrawEndParams, OnDrawEndReture } from '../draw/draw-tool'

export interface ISelectByPolygonToolOptions extends IDrawPolygonToolOptions {
  querylayers: Array<__esri.Sublayer | __esri.FeatureLayer> // TODO: 支持 __esri.GraphicsLayer
}

export interface ISelectByPolygonToolEvent extends IDrawPolygonToolEvents {
  'selected': {
    features: __esri.Graphic[]
  }
}

export type OnSelectedParams<T> = ICallbackParams<'selected', T> & { features: __esri.Graphic[] }
export type OnSelectedReture = __esri.Graphic[] | false

export class SelectByPolygonTool<
  T_OPTIONS extends ISelectByPolygonToolOptions = ISelectByPolygonToolOptions,
  T_EVENTS extends ISelectByPolygonToolEvent = ISelectByPolygonToolEvent
> extends DrawPolygonTool<T_OPTIONS, T_EVENTS> {

  constructor (map: IMap, view: IView, options: Omit<T_OPTIONS, 'drawType'>) {
    super(map, view, options)

    this.on('selected', e => this.onSelected_(e))
  }

  protected onSelected_ (e: OnSelectedParams<this>) : OnSelectedReture {
    if (!this.actived) {
      return false
    }

    return e.features
  }

  protected override onDrawEnd_ (e: OnDrawEndParams<this>) : OnDrawEndReture {
    const graphic = super.onDrawEnd_(e)
    if (!graphic) {
      return false
    }
    const geometry = graphic.geometry as __esri.Polygon


    Promise.all(this.options_.querylayers.map(layer => {
      return layer.queryFeatures({ geometry, returnGeometry: true, outFields: ['*'] })
    })).then(featureSets => {
      const features = featureSets.reduce<__esri.Graphic[]>((ret, cur) => {
        ret.push(...cur.features)
        return ret
      }, [])
      this.fire('selected', { features })
    })

    return graphic
  }

  public setQueryLayers (layers: Array<__esri.Sublayer | __esri.FeatureLayer>) : this {
    this.options_.querylayers = layers
    return this
  }

}

export default SelectByPolygonTool
