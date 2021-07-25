import DefaultTheme from 'vitepress/theme'
import StatisticsBox from '../../components/StatisticsBox.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('StatisticsBox', StatisticsBox)
  }
}