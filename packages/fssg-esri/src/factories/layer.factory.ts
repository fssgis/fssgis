import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import GroupLayer from '@arcgis/core/layers/GroupLayer'
import WebTileLayer from '@arcgis/core/layers/WebTileLayer'
import Layer from '@arcgis/core/layers/Layer'
import TileLayer from '@arcgis/core/layers/TileLayer'
import MapImageLayer from '@arcgis/core/layers/MapImageLayer'

/**
 * 图层工厂接口
 */
export interface ILayerFactory {
  createLayer (options: { layerType: 'graphicslayer' } & __esri.GraphicsLayerProperties) : __esri.GraphicsLayer
  createLayer (options: { layerType: 'grouplayer' } & __esri.GroupLayerProperties) : __esri.GroupLayer
  createLayer (options: { layerType: 'webtilelayer' } & __esri.WebTileLayerProperties) : __esri.WebTileLayer
  createLayer (options: { layerType: 'tilelayer' } & __esri.TileLayerProperties) : __esri.TileLayer
  createLayer (options: { layerType: 'dynamiclayer' } & __esri.MapImageLayerProperties & { serverName?: string }) : __esri.MapImageLayer
  createLayer (options: { layerType: string } & __esri.LayerProperties) : __esri.Layer
  createGraphicsLayer (options: __esri.GraphicsLayerProperties) : __esri.GraphicsLayer
  createGroupLayer (options: __esri.GroupLayerProperties) : __esri.GroupLayer
  createWebTileLayer (options: __esri.WebTileLayerProperties) : __esri.WebTileLayer
  createTileLayer (options: __esri.TileLayerProperties) : __esri.TileLayer
  createDynamicLayer (options: __esri.MapImageLayerProperties & { serverName?: string }) : __esri.MapImageLayer
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

}

/**
 * 创建图层工厂
 */
export function createLayerFactory () : LayerFactory {
  return new LayerFactory()
}
