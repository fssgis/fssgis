import { MapLayers, FssgEsri, IMapLayersOptions } from '@fssgis/fssg-esri'
import { warn } from '@fssgis/fssg-map'
import { inject, InjectionKey, provide } from 'vue'
import { useFssgEsri } from './fssg-esri.hooks'

function _getMapLayers () : MapLayers
function _getMapLayers (fssgMap: FssgEsri) : MapLayers
function _getMapLayers (mapLayers: MapLayers) : MapLayers
function _getMapLayers (arg0?: FssgEsri | MapLayers) : MapLayers
function _getMapLayers (arg0?: FssgEsri | MapLayers) : MapLayers {
  let mapLayers: MapLayers
  if (!arg0) {
    const fssgEsri = useFssgEsri()
    mapLayers = fssgEsri.mapLayers
    if (!mapLayers) {
      warn(this, 'MapLayers实例未挂载到FssgMap实例')
    }
  } else {
    if (arg0 instanceof FssgEsri) {
      mapLayers = arg0.mapLayers
    } else {
      mapLayers = arg0
    }
  }
  return mapLayers
}

const SYMBOL_MAPLAYERS : InjectionKey<MapLayers> = Symbol('FssgEsri.MapLayers')
export function createMapLayers (options: IMapLayersOptions) : MapLayers
export function createMapLayers (options: IMapLayersOptions, fssgEsri: FssgEsri) : MapLayers
export function createMapLayers (options: IMapLayersOptions, fssgEsri?: FssgEsri) : MapLayers {
  const mapLayers = new MapLayers(options)
  fssgEsri = fssgEsri ?? useFssgEsri()
  fssgEsri.use(mapLayers)
  provide(SYMBOL_MAPLAYERS, mapLayers)
  return mapLayers
}

export function useMapLayers () : MapLayers
export function useMapLayers (fssgEsri: FssgEsri) : MapLayers
export function useMapLayers (fssgEsri?: FssgEsri) : MapLayers
export function useMapLayers (fssgEsri?: FssgEsri) : MapLayers {
  return fssgEsri?.mapLayers ?? inject(SYMBOL_MAPLAYERS) as MapLayers
}
