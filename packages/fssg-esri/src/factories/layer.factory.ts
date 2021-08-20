import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import GroupLayer from '@arcgis/core/layers/GroupLayer'
import WebTileLayer from '@arcgis/core/layers/WebTileLayer'

/**
 * 图层工厂接口
 */
export interface ILayerFactory {
  createGraphicsLayer (options: __esri.GraphicsLayerProperties) : __esri.GraphicsLayer
  createGroupLayer (options: __esri.GroupLayerProperties) : __esri.GroupLayer
  createWebTileLayer (options: __esri.WebTileLayerProperties) : __esri.WebTileLayer
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

}

/**
 * 创建图层工厂
 */
export function createLayerFactory () : LayerFactory {
  return new LayerFactory()
}
