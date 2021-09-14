import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import GroupLayer from '@arcgis/core/layers/GroupLayer'
import WebTileLayer from '@arcgis/core/layers/WebTileLayer'
import Layer from '@arcgis/core/layers/Layer'
import TileLayer from '@arcgis/core/layers/TileLayer'
import MapImageLayer from '@arcgis/core/layers/MapImageLayer'
import Graphic from '@arcgis/core/Graphic'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import { createGuid, isNullOrUndefined } from '@fssgis/utils'
import Field from '@arcgis/core/layers/support/Field'

interface ISqlLayerProperties {
  url: string
  sqlOptions: {
    xField: string
    yField: string
    iconUrl?: string
    iconUrlFuncStr?: string
  }
  spatialReference?: __esri.SpatialReference
}

/**
 * 图层工厂接口
 */
export interface ILayerFactory {
  createLayer (options: { layerType: 'graphicslayer' } & __esri.GraphicsLayerProperties) : __esri.GraphicsLayer
  createLayer (options: { layerType: 'grouplayer' } & __esri.GroupLayerProperties) : __esri.GroupLayer
  createLayer (options: { layerType: 'webtilelayer' } & __esri.WebTileLayerProperties) : __esri.WebTileLayer
  createLayer (options: { layerType: 'tilelayer' } & __esri.TileLayerProperties) : __esri.TileLayer
  createLayer (options: { layerType: 'dynamiclayer' } & __esri.MapImageLayerProperties & { serverName?: string }) : __esri.MapImageLayer
  createLayer (options: { layerType: 'mapimagelayer' } & __esri.MapImageLayerProperties) : __esri.MapImageLayer
  createLayer (options: { layerType: 'sqllayer' } & __esri.GraphicsLayerProperties & ISqlLayerProperties) : __esri.GraphicsLayer
  createLayer (options: { layerType: 'sqllayer2' } & __esri.FeatureLayerProperties & ISqlLayerProperties) : __esri.FeatureLayer
  createLayer (options: { layerType: 'featurelayer' } & __esri.FeatureLayerProperties) : __esri.FeatureLayer
  createLayer (options: { layerType: string } & __esri.LayerProperties) : __esri.Layer
  createGraphicsLayer (options: __esri.GraphicsLayerProperties) : __esri.GraphicsLayer
  createGroupLayer (options: __esri.GroupLayerProperties) : __esri.GroupLayer
  createWebTileLayer (options: __esri.WebTileLayerProperties) : __esri.WebTileLayer
  createTileLayer (options: __esri.TileLayerProperties) : __esri.TileLayer
  createDynamicLayer (options: __esri.MapImageLayerProperties & { serverName?: string }) : __esri.MapImageLayer
  createMapImageLayer (options: __esri.MapImageLayerProperties) : __esri.MapImageLayer
  createSqlLayer (options: __esri.GraphicsLayerProperties & ISqlLayerProperties) : __esri.GraphicsLayer
  createSqlLayer2 (options: __esri.FeatureLayerProperties & ISqlLayerProperties) : __esri.FeatureLayer
  createFeatureLayer (options: __esri.FeatureLayerProperties) : __esri.FeatureLayer
}

/**
 * 图层工厂（单例模式）
 * @private
 */
class LayerFactory implements ILayerFactory {

  /**
   * 实例
   */
  private static _instance : LayerFactory

  /**
   * 构造图层工厂实例
   */
  constructor () {
    if (LayerFactory._instance) {
      return LayerFactory._instance
    }
    LayerFactory._instance = this
    return this
  }

  public createLayer (options: { layerType: 'graphicslayer' } & __esri.GraphicsLayerProperties) : __esri.GraphicsLayer
  public createLayer (options: { layerType: 'grouplayer' } & __esri.GroupLayerProperties) : __esri.GroupLayer
  public createLayer (options: { layerType: 'webtilelayer' } & __esri.WebTileLayerProperties) : __esri.WebTileLayer
  public createLayer (options: { layerType: 'tilelayer' } & __esri.TileLayerProperties) : __esri.TileLayer
  public createLayer (options: { layerType: 'dynamiclayer' } & __esri.MapImageLayerProperties & { serverName?: string }) : __esri.MapImageLayer
  public createLayer (options: { layerType: 'mapimagelayer' } & __esri.MapImageLayerProperties) : __esri.MapImageLayer
  public createLayer (options: { layerType: 'sqllayer' } & __esri.GraphicsLayerProperties & ISqlLayerProperties) : __esri.GraphicsLayer
  public createLayer (options: { layerType: 'sqllayer2' } & __esri.FeatureLayerProperties & ISqlLayerProperties) : __esri.FeatureLayer
  public createLayer (options: { layerType: 'featurelayer' } & __esri.FeatureLayerProperties) : __esri.FeatureLayer
  public createLayer (options: { layerType: string } & __esri.LayerProperties) : __esri.Layer
  public createLayer (options: { layerType: string } & __esri.LayerProperties) : __esri.Layer {
    switch (options.layerType) {
      case 'graphicslayer':
        return this.createGraphicsLayer(options)
      case 'grouplayer':
        return this.createGroupLayer(options)
      case 'webtilelayer':
        return this.createWebTileLayer(options)
      case 'tilelayer':
        return this.createTileLayer(options)
      case 'dynamiclayer':
        return this.createDynamicLayer(options)
      case 'mapimagelayer':
        return this.createMapImageLayer(options)
      case 'sqllayer':
        return this.createSqlLayer(options as any) // eslint-disable-line
      case 'sqllayer2':
        return this.createSqlLayer2(options as any) // eslint-disable-line
      case 'featurelayer':
        return this.createFeatureLayer(options)
      default:
        return new Layer(options)
    }
  }

  /**
   * 创建GraphicsLayer
   * @param options 配置项
   * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-GraphicsLayer.html
   * @example
   * ```ts
   * createLayerFactory().createGraphicsLayer({ \/* xxx *\/ })
   * ```
   */
  public createGraphicsLayer (options?: __esri.GraphicsLayerProperties) : __esri.GraphicsLayer {
    return new GraphicsLayer(options)
  }

  /**
   * 创建GroupLayer
   * @param options 配置项
   * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-GroupLayer.html
   * @example
   * ```ts
   * createLayerFactory().createGroupLayer({ \/* xxx *\/ })
   * ```
   */
  public createGroupLayer (options?: __esri.GroupLayerProperties) : __esri.GroupLayer {
    return new GroupLayer(options)
  }

  /**
   * 创建WebTileLayer
   * @param options 配置项
   * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-WebTileLayer.html
   * @example
   * ```ts
   * createLayerFactory().createWebTileLayer({ \/* xxx *\/ })
   * ```
   */
  public createWebTileLayer (options?: __esri.WebTileLayerProperties) : __esri.WebTileLayer {
    return new WebTileLayer(options)
  }

  /**
   * 创建TileLayer
   * @param options 配置项
   * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-TileLayer.html
   * @example
   * ```ts
   * createLayerFactory().createTileLayer({ \/* xxx *\/ })
   * ```
   */
  public createTileLayer (options?: __esri.TileLayerProperties) : __esri.TileLayer {
    return new TileLayer(options)
  }

  /**
   * 创建动态图层
   * @param options 配置项
   */
  public createDynamicLayer (options?: __esri.MapImageLayerProperties & { serverName?: string, name?: string }) : __esri.MapImageLayer {
    const layer = new MapImageLayer({ ...options, sublayers: [] })
    fetch(`${options?.url}?f=pjson`, { method: 'get' }).then(res => res.json()).then(result => {
      const serverName = options?.serverName ?? options?.name ?? ''
      const id = result.layers.find(item => item.name === serverName)?.id
      // eslint-disable-next-line
      // @ts-ignore
      layer.sublayers = [{ id }]
    })
    return layer
  }

  /**
   * 创建MapImageLayer
   * @param options 配置项
   */
  public createMapImageLayer (options?: __esri.MapImageLayerProperties) : __esri.MapImageLayer {
    return new MapImageLayer(options)
  }

  /**
   * 创建SQL图层
   * @param options 配置项
   */
  public createSqlLayer (options: __esri.GraphicsLayerProperties & ISqlLayerProperties) : __esri.GraphicsLayer {
    const layer = this.createGraphicsLayer(options)
    fetch(options.url, { method: 'get', mode:'cors' }).then(res => res.json()).then(result => {
      result.forEach(row => {
        if (!row[options.sqlOptions.xField] || !row[options.sqlOptions.yField]) {
          return
        }
        const attributes = row
        let iconUrl
        if (options.sqlOptions.iconUrl) {
          iconUrl = options.sqlOptions.iconUrl
        } else if (options.sqlOptions.iconUrlFuncStr) {
          iconUrl = eval(options.sqlOptions.iconUrlFuncStr)
        }
        const props : __esri.GraphicProperties = {
          attributes,
          geometry: {
            type: 'point',
            x: row[options.sqlOptions.xField],
            y: row[options.sqlOptions.yField],
            spatialReference: options.spatialReference,
          } as __esri.PointProperties,
          symbol: {
            type: 'simple-marker',
            color: '#4FAFEF',
          } as __esri.SimpleMarkerSymbolProperties
        }
        if (iconUrl) {
          props['symbol'] = {
            type: 'picture-marker',
            url: iconUrl,
            width: '32px',
            height: '32px'
          } as __esri.PictureMarkerSymbolProperties
        }
        const graphic = new Graphic(props)
        layer.graphics.add(graphic)
      })
    })

    return layer
  }

  /**
   * 创建SQL图层
   * @param options 配置项
   */
  public createSqlLayer2 (options: __esri.FeatureLayerProperties & ISqlLayerProperties) : __esri.FeatureLayer {
    const { url, ...others } = options
    const layer = this.createFeatureLayer({
      spatialReference: options.spatialReference,
      source: [],
      objectIdField: 'oidoid',
      geometryType: 'point',
      outFields: ['*'],
      ...others,
    })
    if (options.sqlOptions.iconUrl) {
      layer.renderer = {
        type: 'simple',
        symbol: {
          type: 'picture-marker',
          url: options.sqlOptions.iconUrl,
          width: '32px',
          height: '32px'
        } as __esri.SimpleMarkerSymbolProperties
      } as __esri.renderers.SimpleRenderer
    }

    fetch(options.url, { method: 'get', mode:'cors' }).then(res => res.json()).then(result => {
      const graphics : __esri.Graphic[] = []
      if (result[0]) {
        layer.fields = [
          new Field({ name: 'oidoid', alias: 'oidoid', type: 'oid' }),
          ...Object.keys(result[0]).map(key => new Field({
            name: key,
            alias: key,
            type: [options.sqlOptions.xField, options.sqlOptions.yField].includes(key) ? 'double' : 'string'
          }))
        ]
      }
      result.forEach((row, index) => {
        if (!row[options.sqlOptions.xField] || !row[options.sqlOptions.yField]) {
          return
        }
        const attributes = row
        attributes.oidoid = index + 1
        Object.keys(attributes).forEach(key => {
          if (isNullOrUndefined(attributes[key])) {
            attributes[key] = ''
          } else if (![options.sqlOptions.xField, options.sqlOptions.yField].includes(key)) {
            attributes[key] = String(attributes[key])
          }
        })
        const props : __esri.GraphicProperties = {
          attributes: Object.fromEntries(layer.fields.map(item => {
            return [item.name, attributes[item.name]]
          })),
          geometry: {
            type: 'point',
            x: row[options.sqlOptions.xField],
            y: row[options.sqlOptions.yField],
            spatialReference: options.spatialReference,
          } as __esri.PointProperties,
        }
        const graphic = new Graphic(props)
        graphics.push(graphic)
      })
      layer.applyEdits({
        addFeatures: graphics
      })
    })
    return layer
  }

  /**
   * 创建FeatureLayer
   * @param options 配置项
   * @link https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html
   * @example
   * ```ts
   * createLayerFactory().createFeatureLayer({ \/* xxx *\/ })
   * ```
   */
  public createFeatureLayer (options?: __esri.FeatureLayerProperties) : __esri.FeatureLayer {
    return new FeatureLayer(options)
  }

}

/**
 * 创建图层工厂
 */
export function createLayerFactory () : LayerFactory {
  return new LayerFactory()
}
