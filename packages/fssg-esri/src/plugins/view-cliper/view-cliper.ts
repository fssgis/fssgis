import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import FssgEsri from '../../fssg-esri'
import FssgEsriPlugin, { IFssgEsriPluginEvents, IFssgEsriPluginOptions } from '../../fssg-esri-plugin'
import Geometry from '@arcgis/core/geometry/Geometry'
import Graphic from '@arcgis/core/Graphic'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IViewCliperEvents extends IFssgEsriPluginEvents {

}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IViewCliperOptions extends IFssgEsriPluginOptions { }

export class ViewCliper extends FssgEsriPlugin<IViewCliperOptions, IViewCliperEvents> {

  constructor (options?: IViewCliperOptions) {
    super(options, {})
  }

  private _cliperLayer: __esri.GraphicsLayer

  public get cliperLayer () : __esri.GraphicsLayer {
    return this._cliperLayer
  }

  private _init () : this {
    this._cliperLayer = new GraphicsLayer({ blendMode: 'destination-in', effect: 'bloom(200%)' })
    return this
  }

  public override installPlugin (fssgEsri: FssgEsri) : this | Promise<this> {
    super.installPlugin(fssgEsri)
    return this._init()
  }

  public clip (geometry: __esri.Geometry) : this
  public clip (graphic: __esri.Graphic) : this
  public clip (arg0: __esri.Graphic | __esri.Geometry) : this
  public clip (arg0: __esri.Graphic | __esri.Geometry) : this {
    if (!this.map_.findLayerById(this._cliperLayer.id)) {
      this.map_.add(this._cliperLayer)
    }
    let graphic = arg0.clone()
    if (graphic instanceof Geometry) {
      graphic = new Graphic({ geometry: graphic })
    }
    this._cliperLayer.graphics.removeAll()
    this._cliperLayer.graphics.add(graphic)
    return this
  }

  public restore () : this {
    if (this.map_.findLayerById(this._cliperLayer.id)) {
      this.map_.remove(this._cliperLayer)
    }
    return this
  }

}

export default ViewCliper
