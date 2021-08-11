import { Layer, LayerGroup } from 'leaflet'
import { $extend } from '@fssgis/utils'

interface IExtLayerOptions {
  visible?: boolean
}

export class ExtLayer<LAYER extends Layer> extends LayerGroup {

  protected options_ : IExtLayerOptions

  private layer_ : LAYER

  protected visible_ : boolean

  public get visible () : boolean {
    return this.visible_
  }

  public set visible (v: boolean) {
    if (this.visible_ !== v) {
      this.visible_ = v
      ;(v && this.layer_)
        ? this.addLayer(this.layer_)
        : this.removeLayer(this.layer_)
      this.fire('changed:visible')
    }
  }

  constructor (layer?: LAYER, options?: IExtLayerOptions) {
    super()
    layer && (this.layer_ = layer)
    this.options_ = $extend(true, this.options_, {
      visible: true,
    }, options ?? {})
    this._init()
  }

  private _init () : this {
    this.visible_ = this.options_.visible as boolean
    if (this.visible_ && this.layer_) {
      this.addLayer(this.layer_)
    }
    return this
  }

  public setLayer (layer: LAYER) : this {
    (this.visible_ && this.layer_) && this.removeLayer(this.layer_)
    this.layer_ = layer
    this.visible_ && this.addLayer(layer)
    return this
  }

}

export default ExtLayer
