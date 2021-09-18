import Point from '@arcgis/core/geometry/Point'
import { FssgEsriPlugin, IFssgEsriPluginEvents, IFssgEsriPluginOptions } from '../../fssg-esri-plugin'
import { FssgEsri } from '../../fssg-esri'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IMapPopupsEvents extends IFssgEsriPluginEvents {

}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IMapPopupsOptions extends IFssgEsriPluginOptions {

}

export class MapPopups extends FssgEsriPlugin<IMapPopupsOptions, IMapPopupsEvents> {

  public get visible () : boolean {
    return this.view_.popup.visible
  }

  constructor (options?: IMapPopupsOptions) {
    super(options, {})
  }

  public override installPlugin (fssgMap: FssgEsri) : this {
    super.installPlugin(fssgMap)
    return this.fire('loaded')
  }

  public openByXY (xy: { x: number, y: number}, options: __esri.PopupOpenOptions) : this
  public openByXY (xy: [number, number], options: __esri.PopupOpenOptions) : this
  public openByXY (x: number, y: number, options: __esri.PopupOpenOptions) : this
  public openByXY (...args: any[]) : this { // eslint-disable-line
    let x: number, y: number, options: __esri.PopupOpenOptions
    if (Array.isArray(args[0])) {
      [x, y] = [args[0][0], args[0][1]]
      options = args[1]
    } else if (typeof args[1] === 'number') {
      [x, y] = [args[0], args[1]]
      options = args[2]
    } else {
      [x, y] = [args[0].x, args[0].y]
      options = args[1]
    }
    const point = new Point({ x, y, spatialReference: this.view_.spatialReference })
    this.view_.popup.open({
      location: point,
      ...options,
    })
    return this
  }

  public cancel () : this {
    this.view_.popup.visible = false
    return this
  }

}

export default MapPopups
