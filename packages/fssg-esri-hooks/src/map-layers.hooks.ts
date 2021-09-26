import { MapLayers, FssgEsri, IMapLayersOptions } from '@fssgis/fssg-esri'
import { warn } from '@fssgis/fssg-map'
import { App, inject, InjectionKey, provide } from 'vue'
import { injectFssgEsri } from './fssg-esri.hooks'
import { createIsomorphicDestructurable } from '@fssgis/utils'

function _getMapLayers () : MapLayers
function _getMapLayers (fssgMap: FssgEsri) : MapLayers
function _getMapLayers (mapLayers: MapLayers) : MapLayers
function _getMapLayers (arg0?: FssgEsri | MapLayers) : MapLayers
function _getMapLayers (arg0?: FssgEsri | MapLayers) : MapLayers {
  let mapLayers: MapLayers
  if (!arg0) {
    const fssgEsri = injectFssgEsri()
    mapLayers = fssgEsri.getPlugin(MapLayers)
    if (!mapLayers) {
      warn(this, 'MapLayers实例未挂载到FssgMap实例')
    }
  } else {
    if (arg0 instanceof FssgEsri) {
      mapLayers = arg0.getPlugin(MapLayers)
    } else {
      mapLayers = arg0
    }
  }
  return mapLayers
}

const SYMBOL_MAPLAYERS : InjectionKey<MapLayers> = Symbol('FssgEsri.MapLayers')
export function createMapLayers (options: IMapLayersOptions) : MapLayers
export function createMapLayers (options: IMapLayersOptions, fssgEsri: FssgEsri, app?: App) : MapLayers
export function createMapLayers (options: IMapLayersOptions, fssgEsri?: FssgEsri, app?: App) : MapLayers {
  const mapLayers = new MapLayers(options)
  fssgEsri = fssgEsri ?? injectFssgEsri()
  fssgEsri.use(mapLayers)
  if (app) {
    app.provide(SYMBOL_MAPLAYERS, mapLayers)
  } else {
    provide(SYMBOL_MAPLAYERS, mapLayers)
  }
  return mapLayers
}

export function injectMapLayers () : MapLayers {
  return inject(SYMBOL_MAPLAYERS) as MapLayers
}

type UseMapLayers = {
  mapLayers: MapLayers
} & readonly [MapLayers]

export function useMapLayers () : UseMapLayers
export function useMapLayers (fssgEsri: FssgEsri) : UseMapLayers
export function useMapLayers (fssgEsri?: FssgEsri) : UseMapLayers
export function useMapLayers (fssgEsri?: FssgEsri) : UseMapLayers {
  const mapLayers = fssgEsri?.getPlugin(MapLayers) ?? injectMapLayers()
  return createIsomorphicDestructurable(
    { mapLayers } as const,
    [mapLayers] as const,
  )
}
