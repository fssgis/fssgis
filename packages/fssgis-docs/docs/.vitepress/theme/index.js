import DefaultTheme from 'vitepress/theme'
import StatisticsBox from '../../components/StatisticsBox.vue'
import FssgIcon from '@fssgis/icon'
import { FssgGrid, FssgBoxV1, FssgBoxV2, FssgBoxV3, FssgBoxV4 } from '@fssgis/grid'
import CreateGuid from '../../components/fssgis-utils/CreateGuid.vue'
import CreateIntRandom from '../../components/fssgis-utils/CreateIntRandom.vue'
import FssgBoxesExample from '../../components/fssgis-grid/FssgBoxesExample.vue'
import FssgGridExample from '../../components/fssgis-grid/FssgGridExample.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('FssgIcon', FssgIcon)
    app.component('FssgGrid', FssgGrid)
    app.component('FssgBoxV1', FssgBoxV1)
    app.component('FssgBoxV2', FssgBoxV2)
    app.component('FssgBoxV3', FssgBoxV3)
    app.component('FssgBoxV4', FssgBoxV4)

  
    app.component('StatisticsBox', StatisticsBox)
    app.component('CreateGuid', CreateGuid)
    app.component('CreateIntRandom', CreateIntRandom)
    app.component('FssgBoxesExample', FssgBoxesExample)
    app.component('FssgGridExample', FssgGridExample)
  }
}