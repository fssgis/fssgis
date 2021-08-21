import { MapTools, FssgEsri, IMapToolsOptions } from '@fssgis/fssg-esri'
import { warn } from '@fssgis/fssg-map'
import { inject, InjectionKey, provide, ref, Ref } from 'vue'
import { controllableWatch, useObservableOn } from './base.hooks'
import { useFssgEsri } from './fssg-esri.hooks'

function _getMapTools () : MapTools
function _getMapTools (fssgMap: FssgEsri) : MapTools
function _getMapTools (mapTools: MapTools) : MapTools
function _getMapTools (arg0?: FssgEsri | MapTools) : MapTools
function _getMapTools (arg0?: FssgEsri | MapTools) : MapTools {
  let mapTools: MapTools
  if (!arg0) {
    const fssgEsri = useFssgEsri()
    mapTools = fssgEsri.mapTools
    if (!mapTools) {
      warn(this, 'MapTools实例未挂载到FssgMap实例')
    }
  } else {
    if (arg0 instanceof FssgEsri) {
      mapTools = arg0.mapTools
    } else {
      mapTools = arg0
    }
  }
  return mapTools
}

interface IMapToolsHook {
  activedKey: Ref<string>
  mapTools: MapTools
}

export function useMapToolsActivedKey () : Ref<string>
export function useMapToolsActivedKey (fssgMap: FssgEsri) : Ref<string>
export function useMapToolsActivedKey (mapTools: MapTools) : Ref<string>
export function useMapToolsActivedKey (arg0?: FssgEsri | MapTools) : Ref<string>
export function useMapToolsActivedKey (arg0?: FssgEsri | MapTools) : Ref<string> {
  const mapTools = _getMapTools(arg0)
  const activedKey = ref(mapTools.activedKey)

  controllableWatch(activedKey, v => {
    if (mapTools.activedKey !== v) {
      mapTools.activedKey = v
    }
  })

  useObservableOn(mapTools.on('change', e => {
    if (e.currentKey !== activedKey.value) {
      activedKey.value = e.currentKey
    }
  }))

  return activedKey
}


export function useMapToolsState () : IMapToolsHook
export function useMapToolsState (fssgMap: FssgEsri) : IMapToolsHook
export function useMapToolsState (mapTools: MapTools) : IMapToolsHook
export function useMapToolsState (arg0?: FssgEsri | MapTools) : IMapToolsHook
export function useMapToolsState (arg0?: FssgEsri | MapTools) : IMapToolsHook {
  const mapTools = _getMapTools(arg0)
  const activedKey = useMapToolsActivedKey(arg0)
  return { mapTools, activedKey }
}

const SYMBOL_MAPTOOLS : InjectionKey<MapTools> = Symbol('FssgEsri.MapTools')
export function createMapTools (options: IMapToolsOptions) : MapTools
export function createMapTools (options: IMapToolsOptions, fssgEsri: FssgEsri) : MapTools
export function createMapTools (options: IMapToolsOptions, fssgEsri?: FssgEsri) : MapTools {
  const mapTools = new MapTools(options)
  fssgEsri = fssgEsri ?? useFssgEsri()
  fssgEsri.use(mapTools)
  provide(SYMBOL_MAPTOOLS, mapTools)
  return mapTools
}

export function useMapTools () : MapTools
export function useMapTools (fssgEsri: FssgEsri) : MapTools
export function useMapTools (fssgEsri?: FssgEsri) : MapTools
export function useMapTools (fssgEsri?: FssgEsri) : MapTools {
  return fssgEsri?.mapTools ?? inject(SYMBOL_MAPTOOLS) as MapTools
}
