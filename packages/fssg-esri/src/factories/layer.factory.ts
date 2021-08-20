import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import GroupLayer from '@arcgis/core/layers/GroupLayer'
import WebTileLayer from '@arcgis/core/layers/WebTileLayer'

export interface ILayerFactory {
  createGraphicsLayer (options: __esri.GraphicsLayerProperties) : __esri.GraphicsLayer
  createGroupLayer (options: __esri.GroupLayerProperties) : __esri.GroupLayer
  createWebTileLayer (options: __esri.WebTileLayerProperties) : __esri.WebTileLayer
}

class LayerFactory implements ILayerFactory {
  private static _instance : LayerFactory

  constructor () {
    if (LayerFactory._instance) {
      return LayerFactory._instance
    }
    LayerFactory._instance = this
    return this
  }

  public createGraphicsLayer (options: __esri.GraphicsLayerProperties) : __esri.GraphicsLayer {
    return new GraphicsLayer(options)
  }

  public createGroupLayer (options: __esri.GroupLayerProperties) : __esri.GroupLayer {
    return new GroupLayer(options)
  }

  public createWebTileLayer (options: __esri.WebTileLayerProperties) : __esri.WebTileLayer {
    return new WebTileLayer(options)
  }

}

export function createLayerFactory () : LayerFactory {
  return new LayerFactory()
}
