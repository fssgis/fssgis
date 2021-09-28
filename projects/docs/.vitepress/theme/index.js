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
import {
  FssgIcon,
  FssgGrid,
  FssgBox,
  FssgBoxV1,
  FssgBoxV2,
  FssgBoxV3,
  FssgBoxV4,
  FssgBoxV5,
  FssgBoxV6,
} from '@fssgis/ui'
import ExampleFssgBox from '../../components/fssgis-ui/Example.FssgBox.vue'
import ExamplePictureViewer from '../../components/fssgis-picture-viewer/ExamplePictureViewer.vue'

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
    app.component('FssgIcon', FssgIcon)
    app.component('FssgGrid', FssgGrid)
    app.component('FssgBox', FssgBox)
    app.component('FssgBoxV1', FssgBoxV1)
    app.component('FssgBoxV2', FssgBoxV2)
    app.component('FssgBoxV3', FssgBoxV3)
    app.component('FssgBoxV4', FssgBoxV4)
    app.component('FssgBoxV5', FssgBoxV5)
    app.component('FssgBoxV6', FssgBoxV6)
    app.component('ExampleFssgBox', ExampleFssgBox)
    app.component('ExamplePictureViewer', ExamplePictureViewer)
  }
}