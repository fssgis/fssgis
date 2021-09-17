import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import AnimatedLinesLayerView from '../views/AnimatedLinesLayerView'

// eslint-disable-next-line
// @ts-ignore
export const AnimatedLinesLayer = GraphicsLayer.createSubclass({
  createLayerView: function (view) {
    if (view.type === '2d') {
      return new AnimatedLinesLayerView({
        view: view,
        layer: this
      })
    }
  }
})
