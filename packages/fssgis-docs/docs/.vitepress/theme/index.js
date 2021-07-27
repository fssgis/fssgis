import DefaultTheme from 'vitepress/theme'
import StatisticsBox from '../../components/StatisticsBox.vue'
import FssgIcon from '@fssgis/icon'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('StatisticsBox', StatisticsBox)
    app.component('FssgIcon', FssgIcon)
  }
}