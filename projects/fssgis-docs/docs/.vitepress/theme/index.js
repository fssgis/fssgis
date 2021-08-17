import DefaultTheme from 'vitepress/theme'
import StatisticsBox from '../../components/StatisticsBox.vue'
import CreateGuid from '../../components/fssgis-utils/CreateGuid.vue'
import CreateIntRandom from '../../components/fssgis-utils/CreateIntRandom.vue'
import FssgBoxesExample from '../../components/fssgis-grid/FssgBoxesExample.vue'
import FssgGridExample from '../../components/fssgis-grid/FssgGridExample.vue'
import FssgLeafletQuickStartGuide from '../../components/fssg-leaflet/QuickStartGuide.vue'
import EsriBeginToStart from '../../components/fssg-esri/EsriBeginToStart.vue'
import EsriContainer from '../../components/fssg-esri/EsriContainer.vue'
import ExampleUseZoom from '../../components/fssg-esri-hooks/ExampleUseZoom.vue'
import ExampleUseCenter from '../../components/fssg-esri-hooks/ExampleUseCenter.vue'

import { FssgIcon, FssgIconFont } from '@fssgis/ui'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {  
    app.component('StatisticsBox', StatisticsBox)
    app.component('CreateGuid', CreateGuid)
    app.component('CreateIntRandom', CreateIntRandom)
    app.component('FssgBoxesExample', FssgBoxesExample)
    app.component('FssgGridExample', FssgGridExample)
    app.component('FssgLeafletQuickStartGuide', FssgLeafletQuickStartGuide)
    app.component('FssgIcon', FssgIcon)
    app.component('FssgIconFont', FssgIconFont)
    app.component('EsriBeginToStart', EsriBeginToStart)
    app.component('ExampleUseZoom', ExampleUseZoom)
    app.component('EsriContainer', EsriContainer)
    app.component('ExampleUseCenter', ExampleUseCenter)
  }
}