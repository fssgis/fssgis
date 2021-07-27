import DefaultTheme from 'vitepress/theme'
import StatisticsBox from '../../components/StatisticsBox.vue'
import FssgIcon from '@fssgis/icon'
import CreateGuid from '../../components/fssgis-utils/CreateGuid.vue'
import CreateIntRandom from '../../components/fssgis-utils/CreateIntRandom.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('StatisticsBox', StatisticsBox)
    app.component('FssgIcon', FssgIcon)
    app.component('CreateGuid', CreateGuid)
    app.component('CreateIntRandom', CreateIntRandom)
  }
}