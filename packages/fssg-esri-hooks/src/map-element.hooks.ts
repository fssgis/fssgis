import { MapElement, FssgEsri, IMapElementOptions } from '@fssgis/fssg-esri'
import { warn } from '@fssgis/fssg-map'
import { App, inject, InjectionKey, provide } from 'vue'
import { useFssgEsri } from './fssg-esri.hooks'

function _getMapElement () : MapElement
function _getMapElement (fssgMap: FssgEsri) : MapElement
function _getMapElement (mapElement: MapElement) : MapElement
function _getMapElement (arg0?: FssgEsri | MapElement) : MapElement
function _getMapElement (arg0?: FssgEsri | MapElement) : MapElement {
  let mapElement: MapElement
  if (!arg0) {
    const fssgEsri = useFssgEsri()
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
  fssgEsri = fssgEsri ?? useFssgEsri()
  fssgEsri.use(mapElement)
  if (app) {
    app.provide(SYMBOL_MAPELEMENT, mapElement)
  } else {
    provide(SYMBOL_MAPELEMENT, mapElement)
  }
  return mapElement
}

export function useMapElement () : MapElement
export function useMapElement (fssgEsri: FssgEsri) : MapElement
export function useMapElement (fssgEsri?: FssgEsri) : MapElement
export function useMapElement (fssgEsri?: FssgEsri) : MapElement {
  return fssgEsri?.mapElement ?? inject(SYMBOL_MAPELEMENT) as MapElement
}
