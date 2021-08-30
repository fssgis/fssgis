import Point from 'esri/geometry/Point'
import { IMap, IView } from '../../../fssg-esri'
import DrawPointTool, { IDrawPointToolEvents, IDrawPointToolOptions } from './draw/draw-point-tool'
import { OnDrawEndParams, OnDrawEndReture } from './draw/draw-tool'
import { buffer } from '@arcgis/core/geometry/geometryEngineAsync'

export interface IAttributesConfigItem {
    layerName: string;
    fields?: {
        name: string;
        alias: string;
        type?: string;
    }[];
    exclude?: string[];
}

export type IHitTestToolOptions = IDrawPointToolOptions
export interface IHitTestToolEvents extends IDrawPointToolEvents {
  'finshed': {
    results: __esri.HitTestResultResults[]
  }
}

export interface IField {
  name: string
  alias?: string
  type?: string
  value: unknown
}

export class HitTestTool<
  T_OPTIONS extends IHitTestToolOptions = IHitTestToolOptions,
  T_EVENTS extends IHitTestToolEvents = IHitTestToolEvents,
> extends DrawPointTool<T_OPTIONS, T_EVENTS> {

  //#region 静态方法

  public static getAttributesFromGraphic (graphic: __esri.Graphic) : IField[] {
    return Object.entries(graphic.attributes).map(([name, value]) => ({ name, value }))
  }

  public static parseAttributesFromArcGISServer (attributes: IField[], graphic: __esri.Graphic) : IField[] {
    let layer = graphic.layer as __esri.Sublayer | __esri.FeatureLayer ?? (graphic as any).sourceLayer // eslint-disable-line
    const fieldsSelf = layer?.fields // ArcGIS内置字段配置信息
    if (fieldsSelf) {
      fieldsSelf.forEach(field => {
        const item = attributes.find(v => v.name === field.name)
        item && (item.alias = field.alias)
      })
    }
    return attributes
  }

  public static parseAttributesFromCustomConfig (attributes: IField[], graphic: __esri.Graphic, attributesConfig: IAttributesConfigItem[]) : IField[] {
    let layer = graphic.layer as __esri.Sublayer | __esri.FeatureLayer ?? (graphic as any).sourceLayer // eslint-disable-line
    const name = (layer as any).name ?? ((layer as __esri.Sublayer).layer as any).name // eslint-disable-line
    const attr = attributesConfig.find(item => item.layerName === name)
    if (attr) {
      attr.exclude && (attributes = attributes.filter(item => !attr.exclude?.includes(item.name)))
      attr.fields?.forEach(field => {
        const item = attributes.find(v => v.name === field.name)
        if (item) {
          item.alias = field.alias
          item.type = field.type
        }
      })
    }
    return attributes
  }

  //#endregion

  constructor (map: IMap, view: IView) {
    super(map, view)
    this.cursorType_ = 'help'
    this.setDrawingStyle({
      marker: {
        size: 0
      }
    })
  }

  private async _queryWithMapImageLayer (geometry: __esri.Point) : Promise<__esri.Graphic[]> {
    const fssgMap = this.$
    const ret : __esri.Graphic[] = []
    await fssgMap.mapLayers.forEach(async ([layer, options]) => {
      if (!['mapimagelayer', 'dynaimclayer'].includes(options.layerType)) {
        return
      }
      if (!options.isQuery) {
        return
      }
      if (!layer.visible) {
        return
      }
      const sublayer = (layer as __esri.MapImageLayer).sublayers.getItemAt(0)
      const screenPoint = this.view_.toScreen(geometry)
      screenPoint.x += 10
      const point = this.view_.toMap(screenPoint)
      const bufferDistance = Math.abs(geometry.x - point.x)
      const polygon = await buffer(geometry, bufferDistance, 'meters')
      const { features } = await sublayer.queryFeatures({
        geometry: Array.isArray(polygon) ? polygon[0] : polygon, returnGeometry: true,
        // distance: 10000,
        outFields: ['*'],
      })
      if (features.length > 0) {
        ret.push(...features)
      }
    })
    return ret
  }

  //#region 保护方法

  protected override onDrawEnd_ (e: OnDrawEndParams<this>) : OnDrawEndReture {
    const graphic = super.onDrawEnd_(e)
    if (!graphic) {
      return false
    }
    this.clearDrawed()
    const point = graphic.geometry as Point
    const screen = this.view_.toScreen(point)
    const { mapElement, mapLayers } = this.$
    Promise.all([
      this._queryWithMapImageLayer(point),
      this.view_.hitTest(screen, {
        exclude: [
          mapElement.graphicsLayer,
          mapElement.highlightLayer,
          ...mapLayers.layersWhichCantQuery.map(([layer]) => layer),
        ],
      })
    ]).then(([queryResult, hitTestResult]) => {
      const mapPoint = hitTestResult.results?.[0]?.mapPoint
      queryResult.forEach(graphic => {
        hitTestResult.results.push({ graphic, mapPoint })
      })
      this.finsheHitTest_(hitTestResult)
    })
    this._queryWithMapImageLayer(point)
    return graphic
  }

  protected finsheHitTest_ (result: __esri.HitTestResult) : __esri.HitTestResultResults[] {
    this.fire('finshed', { results: result.results })
    return result.results
  }

  //#endregion

}

export default HitTestTool
