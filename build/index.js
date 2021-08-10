import fssgisAxios from './build.fssgis-axios'
import fssgisExt from './build.fssgis-ext'
import fssgisObservable from './build.fssgis-observable'
import fssgisUtils from './build.fssgis-utils'
import fssgisWatcher from './build.fssgis-watcher'

export default [
  ...fssgisAxios,
  ...fssgisExt,
  ...fssgisObservable,
  ...fssgisUtils,
  ...fssgisWatcher,
]