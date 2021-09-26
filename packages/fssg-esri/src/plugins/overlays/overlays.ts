import { createGuid, throttle } from '@fssgis/utils'
import { createGeometryFactory } from '../../factories'
import FssgEsri from '../../fssg-esri'
import FssgEsriPlugin, { IFssgEsriPluginEvents, IFssgEsriPluginOptions } from '../../fssg-esri-plugin'
import { MapElement } from '../map-element'

export interface IOverlaysOptions extends IFssgEsriPluginOptions { // eslint-disable-line

}

export interface IOverlaysEvents extends IFssgEsriPluginEvents { // eslint-disable-line

}

export interface IOverlayAddOptions {
  id?: string
  classNames?: string[]
  point: __esri.Point
  content: string | HTMLDivElement
  offsetX?: number
  offsetY?: number
  screenX?: number
  screenY?: number
  showBezierCurve?: boolean
  bezierCurveSymbol?: __esri.LineSymbolProperties
}

export interface IOverlay {
  id: string
  classNames?: string[]
  container: HTMLDivElement
  mapXY: __esri.Point
  offsetX: number
  offsetY: number
  screenX?: number
  screenY?: number
  bezierCurve?: __esri.Graphic
  bezierCurveSymbol?: __esri.LineSymbolProperties
}

export class Overlays extends FssgEsriPlugin<IOverlaysOptions, IOverlaysEvents> {

  private _overlayPool : Map<string, IOverlay>

  private _overlayContainer : HTMLDivElement

  constructor (options?: IOverlaysOptions) {
    super(options, {})
  }

  private _init () : this {

    this._overlayContainer = document.createElement('div')
    this._overlayContainer.classList.add('fssg-overlay-container')
    this._overlayContainer.style.height = '100%'
    this._overlayContainer.style.width = '100%'
    this._overlayContainer.style.top = '0'
    this._overlayContainer.style.left = '0'
    this._overlayContainer.style.position = 'absolute'
    this._overlayContainer.style.pointerEvents = 'none'
    this._overlayContainer.style.overflow = 'hidden'
    this.view_.container.append(this._overlayContainer)

    this._overlayPool = new Map()
    this.view_.when().then(() => {
      this.view_.watch('extent', throttle(() => {
        [...this._overlayPool.values()].forEach(item => {
          const screenPt = this.view_.toScreen(item.mapXY)
          if (item.screenX && item.screenY) {
            screenPt.x = item.screenX
            screenPt.y = item.screenY
          }
          item.container.style.top = `${screenPt.y + item.offsetY}px`
          item.container.style.left = `${screenPt.x + item.offsetX}px`

          const mapPt = this.view_.toMap({
            x: screenPt.x + (item.offsetX ?? 0),
            y: screenPt.y + (item.offsetY ?? 0),
          })

          if (item.bezierCurve) {
            item.bezierCurve && this.view_.$owner.getPlugin(MapElement).remove(item.bezierCurve)
            item.bezierCurve = this.view_.$owner.getPlugin(MapElement).add(
              createGeometryFactory(this.$).createBezierCurve(item.mapXY, mapPt),
              item.bezierCurveSymbol,
            )
          }
        })
      }, 200) as __esri.WatchCallback)
    })
    return this
  }

  public override installPlugin (fssgEsri: FssgEsri) : this | Promise<this> {
    super.installPlugin(fssgEsri)
    return this._init()
  }

  public add (options: IOverlayAddOptions) : string {
    const overlay = document.createElement('div')
    overlay.classList.add('fssg-overlay')
    options.classNames?.forEach(name => overlay.classList.add(name))
    overlay.style.position = 'absolute'
    overlay.style.padding = '4px 8px'
    overlay.style.backgroundColor = '#00000085'
    overlay.style.color = '#fff'
    overlay.style.boxShadow = '0 1px 4px rgb(0 0 0 / 80%)'
    overlay.style.width = 'fit-content'
    overlay.style.pointerEvents = 'all'
    overlay.style.transition = 'all .1s ease-in-out'
    typeof options.content === 'string'
      ? overlay.innerHTML = options.content
      : overlay.append(options.content)

    const screenPt = this.view_.toScreen(options.point)
    if (options.screenX && options.screenY) {
      screenPt.x = options.screenX
      screenPt.y = options.screenY
    }
    overlay.style.top = `${screenPt.y + (options.offsetY ?? 0)}px`
    overlay.style.left = `${screenPt.x + (options.offsetX ?? 0)}px`

    const mapPt = this.view_.toMap({
      x: screenPt.x + (options.offsetX ?? 0),
      y: screenPt.y + (options.offsetY ?? 0),
    })
    let bezierCurve: __esri.Graphic | undefined = undefined

    if (options.showBezierCurve) {
      bezierCurve = this.view_.$owner.getPlugin(MapElement).add(
        createGeometryFactory(this.$).createBezierCurve(options.point, mapPt),
        options.bezierCurveSymbol
      )
    }

    const id = options.id ?? `overlay-${createGuid()}`
    overlay.id = id
    this._overlayPool.set(id, {
      id,
      classNames: options.classNames,
      container: overlay,
      mapXY: options.point,
      offsetX: options.offsetX ?? 0,
      offsetY: options.offsetY ?? 0,
      screenX: options.screenX,
      screenY: options.screenY,
      bezierCurve: bezierCurve,
      bezierCurveSymbol: options.bezierCurveSymbol
    })
    this._overlayContainer.append(overlay)

    return id
  }

  public removeById (id: string) : this {
    const item = this._overlayPool.get(id)
    if (item) {
      item.container.remove()
      item.bezierCurve && this.view_.$owner.getPlugin(MapElement).remove(item.bezierCurve)
      this._overlayPool.delete(id)
    }
    return this
  }

  public clear () : this {
    [...this._overlayPool.values()].forEach(item => {
      item.container.remove()
      item.bezierCurve && this.view_.$owner.getPlugin(MapElement).remove(item.bezierCurve)
    })
    this._overlayPool.clear()
    return this
  }

}

export default Overlays
