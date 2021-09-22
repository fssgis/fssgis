import { MapElement, FssgEsri, IMapElementOptions } from '@fssgis/fssg-esri'
import { warn } from '@fssgis/fssg-map'
import { App, inject, InjectionKey, provide } from 'vue'
import { injectFssgEsri } from './fssg-esri.hooks'
import { createIsomorphicDestructurable } from '@fssgis/utils'

function _getMapElement () : MapElement
function _getMapElement (fssgMap: FssgEsri) : MapElement
function _getMapElement (mapElement: MapElement) : MapElement
function _getMapElement (arg0?: FssgEsri | MapElement) : MapElement
function _getMapElement (arg0?: FssgEsri | MapElement) : MapElement {
  let mapElement: MapElement
  if (!arg0) {
    const fssgEsri = injectFssgEsri()
    mapElement = fssgEsri.mapElement
    if (!mapElement) {
      warn(this, 'MapElement实例未挂载到FssgMap实例')
    }
  } else {
    if (arg0 instanceof FssgEsri) {
      mapElement = arg0.mapElement
    } else {
      mapElement = arg0
    }
  }
  return mapElement
}

const SYMBOL_MAPELEMENT : InjectionKey<MapElement> = Symbol('FssgEsri.MapElement')
export function createMapElement (options: IMapElementOptions) : MapElement
export function createMapElement (options: IMapElementOptions, fssgEsri: FssgEsri, app?: App) : MapElement
export function createMapElement (options: IMapElementOptions, fssgEsri?: FssgEsri, app?: App) : MapElement {
  const mapElement = new MapElement(options)
  fssgEsri = fssgEsri ?? injectFssgEsri()
  fssgEsri.use(mapElement)
  if (app) {
    app.provide(SYMBOL_MAPELEMENT, mapElement)
  } else {
    provide(SYMBOL_MAPELEMENT, mapElement)
  }
  return mapElement
}

export function injectMapElement () : MapElement {
  return inject(SYMBOL_MAPELEMENT) as MapElement
}

type UseMapElement = {
  mapElement: MapElement
} & readonly [MapElement]

export function useMapElement () : UseMapElement
export function useMapElement (fssgEsri: FssgEsri) : UseMapElement
export function useMapElement (fssgEsri?: FssgEsri) : UseMapElement
export function useMapElement (fssgEsri?: FssgEsri) : UseMapElement {
  const mapElement = fssgEsri?.mapElement ?? injectMapElement()
  return createIsomorphicDestructurable(
    { mapElement } as const,
    [mapElement] as const,
  )
}
