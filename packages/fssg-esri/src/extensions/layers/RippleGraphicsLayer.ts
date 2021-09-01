import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import RippleLayerView from '../views/RippleLayerView'

// eslint-disable-next-line
// @ts-ignore
export const RippleGraphicsLayer = GraphicsLayer.createSubclass({
  createLayerView: function (view) {
    // We only support MapView, so we only need to return a
    // custom layer view for the `2d` case.
    if (view.type === '2d') {
      return new RippleLayerView({
        view: view,
        layer: this
      })
    }
  }
})

export default RippleGraphicsLayer
