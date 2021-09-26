import { MapTools, FssgEsri, IMapToolsOptions } from '@fssgis/fssg-esri'
import { warn } from '@fssgis/fssg-map'
import { App, inject, InjectionKey, provide, ref, Ref } from 'vue'
import { controllableWatch, useObservableOn } from './base.hooks'
import { injectFssgEsri } from './fssg-esri.hooks'
import { createIsomorphicDestructurable } from '@fssgis/utils'

function _getMapTools () : MapTools
function _getMapTools (fssgMap: FssgEsri) : MapTools
function _getMapTools (mapTools: MapTools) : MapTools
function _getMapTools (arg0?: FssgEsri | MapTools) : MapTools
function _getMapTools (arg0?: FssgEsri | MapTools) : MapTools {
  let mapTools: MapTools
  if (!arg0) {
    const fssgEsri = injectFssgEsri()
    mapTools = fssgEsri.getPlugin(MapTools)
    if (!mapTools) {
      warn(this, 'MapTools实例未挂载到FssgMap实例')
    }
  } else {
    if (arg0 instanceof FssgEsri) {
      mapTools = arg0.getPlugin(MapTools)
    } else {
      mapTools = arg0
    }
  }
  return mapTools
}

type UseMapToolsActivedKey = {
  activedKey: Ref<string>
} & readonly [Ref<string>]

export function useMapToolsActivedKey () : UseMapToolsActivedKey
export function useMapToolsActivedKey (fssgMap: FssgEsri) : UseMapToolsActivedKey
export function useMapToolsActivedKey (mapTools: MapTools) : UseMapToolsActivedKey
export function useMapToolsActivedKey (arg0?: FssgEsri | MapTools) : UseMapToolsActivedKey
export function useMapToolsActivedKey (arg0?: FssgEsri | MapTools) : UseMapToolsActivedKey {
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

  return createIsomorphicDestructurable(
    { activedKey } as const,
    [activedKey] as const,
  )
}

const SYMBOL_MAPTOOLS : InjectionKey<MapTools> = Symbol('FssgEsri.MapTools')
export function createMapTools (options: IMapToolsOptions) : MapTools
export function createMapTools (options: IMapToolsOptions, fssgEsri: FssgEsri, app?: App) : MapTools
export function createMapTools (options: IMapToolsOptions, fssgEsri?: FssgEsri, app?: App) : MapTools {
  const mapTools = new MapTools(options)
  fssgEsri = fssgEsri ?? injectFssgEsri()
  fssgEsri.use(mapTools)
  if (app) {
    app.provide(SYMBOL_MAPTOOLS, mapTools)
  } else {
    provide(SYMBOL_MAPTOOLS, mapTools)
  }
  return mapTools
}

export function injectMapTools () : MapTools {
  return inject(SYMBOL_MAPTOOLS) as MapTools
}

type UseMapTools = {
  mapTools: MapTools
  activedKey: Ref<string>
} & readonly [MapTools, Ref<string>]

export function useMapTools () : UseMapTools
export function useMapTools (fssgEsri: FssgEsri) : UseMapTools
export function useMapTools (fssgEsri?: FssgEsri) : UseMapTools
export function useMapTools (fssgEsri?: FssgEsri) : UseMapTools {
  const mapTools = fssgEsri?.getPlugin(MapTools) ?? injectMapTools()
  const { activedKey } = useMapToolsActivedKey(fssgEsri)
  return createIsomorphicDestructurable(
    { mapTools, activedKey } as const,
    [mapTools, activedKey] as const,
  )
}
