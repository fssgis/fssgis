import { Observable } from '@fssgis/observable'
import { Map as LeafletMap, CRS, imageOverlay } from 'leaflet'

export interface IPictureViewerOptions {
  url: string
}

export class PictureViewer extends Observable<{

}> {

  private _map: LeafletMap

  private _options: IPictureViewerOptions

  constructor (divId: string, options: IPictureViewerOptions) {
    super()
    this._map = new LeafletMap(divId, {
      crs: CRS.Simple,
      minZoom: -2,
    }).setView([0, 0], 0)
    this._options = options
    this._init()
  }

  private _init () : this {
    const url = this._options.url
    const img = new Image()
    img.src = url
    img.onload = () => {
      console.log(img.width, img.height)
    }


    imageOverlay(url, [[0, 0], [img.width, img.height]]).addTo(this._map)
    this._map.setView([img.width / 2, img.height / 2], 0)
    return this
  }

}

export default PictureViewer
