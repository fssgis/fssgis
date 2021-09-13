import DefaultTheme from 'vitepress/theme'
import ExampleDeepCopyJSON from '../../components/fssgis-utils/Example.DeepCopyJSON.vue'
import ExampleNumberToChinese from '../../components/fssgis-ext/Example.NumberToChinese.vue'
import ExampleCreateGuid from '../../components/fssgis-utils/Example.CreateGuid.vue'
import BaseIframe from '../../components/_base/BaseIframe.vue'
import ExampleMapInit from '../../components/fssgis-esri/Example.MapInit.vue'
import BaseMapContainer from '../../components/_base/BaseMapContainer.vue'
import ExampleMapInit2 from '../../components/fssgis-esri/Example.MapInit2.vue'
import 'virtual:windi.css'
import './index.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('ExampleDeepCopyJSON', ExampleDeepCopyJSON)
    app.component('ExampleNumberToChinese', ExampleNumberToChinese)
    app.component('ExampleCreateGuid', ExampleCreateGuid)
    app.component('BaseIframe', BaseIframe)
    app.component('ExampleMapInit', ExampleMapInit)
    app.component('ExampleMapInit2', ExampleMapInit2)
    app.component('BaseMapContainer', BaseMapContainer)
  }
}