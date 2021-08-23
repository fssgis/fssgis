import { IFssgEsriPluginEvents, IFssgEsriPluginOptions } from '../../fssg-esri-plugin'
import FssgEsriPlugin from '../../fssg-esri-plugin'
import FssgEsri from '../../fssg-esri'
import Graphic from '@arcgis/core/Graphic'
import Geometry from '@arcgis/core/geometry/Geometry'
import { deepCopyJSON, $extend } from '@fssgis/utils'
import { createLayerFactory } from '../../factories'
import { warn } from '@fssgis/fssg-map'

/**
 * 图元样式接口
 */
 export interface IMapElementSymbol {
  marker?: __esri.SimpleMarkerSymbolProperties
  line?: __esri.SimpleLineSymbolProperties
  fill?: __esri.SimpleFillSymbolProperties
}

/**
 * 图元控制插件配置项
 */
export interface IMapElementOptions extends IFssgEsriPluginOptions {
  graphicsSymbol?: IMapElementSymbol
  highlightSymbol?: IMapElementSymbol
}

/**
 * 图元控制插件事件集
 */
export interface IMapElementEvents extends IFssgEsriPluginEvents {
  'change': void
}

/**
 * 图元控制插件
 */
export class MapElement extends FssgEsriPlugin<IMapElementOptions, IMapElementEvents> {

  //#region 私有属性

  /** 基础图元样式 */
  private _graphicsSymbol: IMapElementSymbol

  /** 高亮图元样式 */
  private _highlightSymbol: IMapElementSymbol

  /** 基础图元存储图层 */
  private _graphicsLayer: __esri.GraphicsLayer

  /** 高亮图元存储图层 */
  private _highlightLayer: __esri.GraphicsLayer

  /** 图元图层存储图层组 */
  private _groupLayer: __esri.GroupLayer

  //#endregion

  /**
   * 构造图元控制插件对象
   * @param options 配置项
   */
  constructor (options?: IMapElementOptions) {
    super(options, {
      graphicsSymbol: {
        marker: {
          type: 'simple-marker',
          color: [255, 0, 0, .6],
          style: 'circle',
          size: '14px',
          outline: { color: [255, 0, 0], width: 1 }
        },
        line: {
          type: 'simple-line',
          color: [255, 0, 0, .8],
          width: '2px',
          style: 'solid'
        },
        fill: {
          type: 'simple-fill',
          color: [255, 0, 0, .4],
          style: 'solid',
          outline: { color: [255, 0, 0], width: 1 }
        },
      },
      highlightSymbol: {
        marker: {
          type: 'simple-marker',
          color: [0, 255, 255, .8],
          style: 'circle',
          size: '14px',
          outline: { color: [0, 255, 255], width: 1 }
        },
        line: {
          type: 'simple-line',
          color: [0, 255, 255, .8],
          width: '4px',
          style: 'solid'
        },
        fill: {
          type: 'simple-fill',
          color: [0, 255, 255, .4],
          style: 'solid',
          outline: { color: [0, 255, 255], width: 4 }
        },
      }
    })
  }

  private _init () : this {
    this._graphicsSymbol = this.options_.graphicsSymbol ?? {}
    this._highlightSymbol = this.options_.highlightSymbol ?? {}
    this._graphicsLayer = createLayerFactory().createLayer({ layerType: 'graphicslayer' })
    this._highlightLayer = createLayerFactory().createLayer({ layerType: 'graphicslayer' })
    this._groupLayer = createLayerFactory().createLayer({
      layerType: 'grouplayer',
      layers: [this._graphicsLayer, this._highlightLayer]
    })
    this.map_.layers.add(this._groupLayer)
    this.map_.layers.on('after-changes', () => {
      const index = this.map_.layers.indexOf(this._groupLayer)
      if (index !== this.map_.layers.length - 1) {
        this.map_.layers.reorder(this._groupLayer, this.map_.layers.length - 1)
      }
    })
    return this
  }

  private _getSymbol (type: __esri.Geometry['type'], isHighlight?: boolean) : __esri.SymbolProperties {
    const _symbol = isHighlight ? this._highlightSymbol : this._graphicsSymbol
    let symbol: __esri.SymbolProperties | undefined
    switch (type) {
      case 'point':
      case 'multipoint':
        symbol = deepCopyJSON(_symbol.marker)
        break
      case 'polyline':
        symbol = deepCopyJSON(_symbol.line)
        break
      case 'polygon':
      case 'extent':
        symbol = deepCopyJSON(_symbol.fill)
        break
      // case 'mesh': // TODO
      //   break
      default:
        warn(this, `类型${type}无法匹配符号`)
        break
    }
    return symbol ?? {}
  }

  private _addGraphics (graphics: __esri.Graphic[]) : this {
    this._graphicsLayer.graphics.addMany(graphics)
    return this
  }

  private _addHighlight (graphics: __esri.Graphic[]) : this {
    this._highlightLayer.graphics.addMany(graphics)
    return this
  }

  public override installPlugin (fssgEsri: FssgEsri) : this {
    return super.installPlugin(fssgEsri)
      ._init()
  }

  public add (geometry: __esri.Geometry, symbol?: __esri.SymbolProperties) : __esri.Graphic
  public add (geometries: __esri.Geometry[], symbol?: __esri.SymbolProperties) : __esri.Graphic[]
  public add (arg0: __esri.Geometry[] | __esri.Geometry, symbol?: __esri.SymbolProperties) : __esri.Graphic[] | __esri.Graphic
  public add (graphic: __esri.Graphic) : this
  public add (graphics: __esri.Graphic[]) : this
  public add (arg0: __esri.Graphic[] | __esri.Graphic) : this
  public add (arg0: __esri.Graphic | __esri.Graphic[] | __esri.Geometry | __esri.Geometry[], arg1?: __esri.SymbolProperties) : __esri.Graphic | __esri.Graphic[] | this
  public add (arg0: __esri.Graphic | __esri.Graphic[] | __esri.Geometry | __esri.Geometry[], arg1?: __esri.SymbolProperties) : __esri.Graphic | __esri.Graphic[] | this {
    if (arg0 instanceof Geometry || arg0?.[0] instanceof Geometry) {
      const graphics : __esri.Graphic[] = []
      arg0 = arg0 as __esri.Geometry | __esri.Geometry[]
      arg0 = Array.isArray(arg0) ? arg0 : [arg0] as __esri.Geometry[]
      arg0.forEach(geometry => {
        arg1 = $extend(true, {}, this._getSymbol(geometry.type), arg1)
        const graphic = new Graphic({ geometry, symbol: arg1 })
        graphics.push(graphic)
      })
      this._addGraphics(graphics)
      return Array.isArray(arg0) ? graphics : graphics[0]
    } else {
      arg0 = Array.isArray(arg0) ? arg0 : [arg0] as __esri.Graphic[]
      return this._addGraphics(arg0 as __esri.Graphic[])
    }
  }

  public remove (graphic: __esri.Graphic) : this
  public remove (graphics: __esri.Graphic[]) : this
  public remove (arg0: __esri.Graphic | __esri.Graphic[]) : this
  public remove (arg0: __esri.Graphic | __esri.Graphic[]) : this {
    arg0 = Array.isArray(arg0) ? arg0 : [arg0]
    this._graphicsLayer.graphics.removeMany(arg0)
    this._highlightLayer.graphics.removeMany(arg0)
    return this
  }

  public clear (withHighlight?: boolean) : this {
    this._graphicsLayer.graphics.removeAll()
    withHighlight && this._highlightLayer.graphics.removeAll()
    return this
  }

  public set (geometry: __esri.Geometry, symbol: __esri.SymbolProperties) : __esri.Graphic
  public set (geometries: __esri.Geometry[], symbol: __esri.SymbolProperties) : __esri.Graphic[]
  public set (arg0: __esri.Geometry[] | __esri.Geometry, symbol: __esri.SymbolProperties) : __esri.Graphic[] | __esri.Graphic
  public set (graphic: __esri.Graphic) : this
  public set (graphics: __esri.Graphic[]) : this
  public set (arg0: __esri.Graphic[] | __esri.Graphic) : this
  public set (arg0: __esri.Graphic | __esri.Graphic[] | __esri.Geometry | __esri.Geometry[], arg1?: __esri.SymbolProperties) : __esri.Graphic | __esri.Graphic[] | this
  public set (arg0: __esri.Graphic | __esri.Graphic[] | __esri.Geometry | __esri.Geometry[], arg1?: __esri.SymbolProperties) : __esri.Graphic | __esri.Graphic[] | this {
    return this
      .clear()
      .add(arg0, arg1)
  }

  public addHighlight (geometry: __esri.Geometry, symbol?: __esri.SymbolProperties) : __esri.Graphic
  public addHighlight (geometries: __esri.Geometry[], symbol?: __esri.SymbolProperties) : __esri.Graphic[]
  public addHighlight (arg0: __esri.Geometry[] | __esri.Geometry, symbol?: __esri.SymbolProperties) : __esri.Graphic[] | __esri.Graphic
  public addHighlight (graphic: __esri.Graphic) : this
  public addHighlight (graphics: __esri.Graphic[]) : this
  public addHighlight (arg0: __esri.Graphic[] | __esri.Graphic) : this
  public addHighlight (arg0: __esri.Graphic | __esri.Graphic[] | __esri.Geometry | __esri.Geometry[], arg1?: __esri.SymbolProperties) : __esri.Graphic | __esri.Graphic[] | this
  public addHighlight (arg0: __esri.Graphic | __esri.Graphic[] | __esri.Geometry | __esri.Geometry[], arg1?: __esri.SymbolProperties) : __esri.Graphic | __esri.Graphic[] | this {
    if (arg0 instanceof Geometry || arg0?.[0] instanceof Geometry) {
      const graphics : __esri.Graphic[] = []
      arg0 = arg0 as __esri.Geometry | __esri.Geometry[]
      arg0 = Array.isArray(arg0) ? arg0 : [arg0] as __esri.Geometry[]
      arg0.forEach(geometry => {
        arg1 = $extend(true, {}, this._getSymbol(geometry.type, true), arg1)
        const graphic = new Graphic({ geometry, symbol: arg1 })
        graphics.push(graphic)
      })
      this._addHighlight(graphics)
      return Array.isArray(arg0) ? graphics : graphics[0]
    } else {
      arg0 = Array.isArray(arg0) ? arg0 : [arg0] as __esri.Graphic[]
      return this._addHighlight(arg0 as __esri.Graphic[])
    }
  }

  public removeHighlight (graphic: __esri.Graphic) : this
  public removeHighlight (graphics: __esri.Graphic[]) : this
  public removeHighlight (arg0: __esri.Graphic | __esri.Graphic[]) : this
  public removeHighlight (arg0: __esri.Graphic | __esri.Graphic[]) : this {
    arg0 = Array.isArray(arg0) ? arg0 : [arg0]
    this._highlightLayer.graphics.removeMany(arg0)
    return this
  }

  public clearHighlight () : this {
    this._highlightLayer.graphics.removeAll()
    return this
  }

  public setHighlight (geometry: __esri.Geometry, symbol: __esri.SymbolProperties) : __esri.Graphic
  public setHighlight (geometries: __esri.Geometry[], symbol: __esri.SymbolProperties) : __esri.Graphic[]
  public setHighlight (arg0: __esri.Geometry[] | __esri.Geometry, symbol: __esri.SymbolProperties) : __esri.Graphic[] | __esri.Graphic
  public setHighlight (graphic: __esri.Graphic) : this
  public setHighlight (graphics: __esri.Graphic[]) : this
  public setHighlight (arg0: __esri.Graphic[] | __esri.Graphic) : this
  public setHighlight (arg0: __esri.Graphic | __esri.Graphic[] | __esri.Geometry | __esri.Geometry[], arg1?: __esri.SymbolProperties) : __esri.Graphic | __esri.Graphic[] | this
  public setHighlight (arg0: __esri.Graphic | __esri.Graphic[] | __esri.Geometry | __esri.Geometry[], arg1?: __esri.SymbolProperties) : __esri.Graphic | __esri.Graphic[] | this {
    return this
      .clearHighlight()
      .addHighlight(arg0, arg1)
  }

}

export default MapElement
