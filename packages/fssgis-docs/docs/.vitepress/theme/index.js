import DefaultTheme from 'vitepress/theme'
import StatisticsBox from '../../components/StatisticsBox.vue'
import FssgIcon from '@fssgis/icon'
import { FssgGrid, FssgBoxV1, FssgBoxV2, FssgBoxV3, FssgBoxV4 } from '@fssgis/grid'
import CreateGuid from '../../components/fssgis-utils/CreateGuid.vue'
import CreateIntRandom from '../../components/fssgis-utils/CreateIntRandom.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('StatisticsBox', StatisticsBox)
    app.component('FssgIcon', FssgIcon)
    app.component('FssgGrid', FssgGrid)
    app.component('FssgBoxV1', FssgBoxV1)
    app.component('FssgBoxV2', FssgBoxV2)
    app.component('FssgBoxV3', FssgBoxV3)
    app.component('FssgBoxV4', FssgBoxV4)
    app.component('CreateGuid', CreateGuid)
    app.component('CreateIntRandom', CreateIntRandom)
  }
}