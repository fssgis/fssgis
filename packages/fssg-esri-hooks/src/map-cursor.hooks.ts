import { MapCursor, FssgEsri, IMapCursorOptions } from '@fssgis/fssg-esri'
import { warn } from '@fssgis/fssg-map'
import { App, inject, InjectionKey, provide, ref, Ref } from 'vue'
import { controllableWatch, useObservableOn } from './base.hooks'
import { useFssgEsri } from './fssg-esri.hooks'

function _getMapCursor () : MapCursor
function _getMapCursor (fssgMap: FssgEsri) : MapCursor
function _getMapCursor (mapCursor: MapCursor) : MapCursor
function _getMapCursor (arg0?: FssgEsri | MapCursor) : MapCursor
function _getMapCursor (arg0?: FssgEsri | MapCursor) : MapCursor {
  let mapCursor: MapCursor
  if (!arg0) {
    const fssgEsri = useFssgEsri()
    mapCursor = fssgEsri.mapCursor
    if (!mapCursor) {
      warn(this, 'MapCursor实例未挂载到FssgMap实例')
    }
  } else {
    if (arg0 instanceof FssgEsri) {
      mapCursor = arg0.mapCursor
    } else {
      mapCursor = arg0
    }
  }
  return mapCursor
}

interface IMapCursorHook {
  cursorType: Ref<string>
  mapCursor: MapCursor
}

export function useMapCursorType () : Ref<string>
export function useMapCursorType (fssgMap: FssgEsri) : Ref<string>
export function useMapCursorType (mapCursor: MapCursor) : Ref<string>
export function useMapCursorType (arg0?: FssgEsri | MapCursor) : Ref<string>
export function useMapCursorType (arg0?: FssgEsri | MapCursor) : Ref<string> {
  const mapCursor = _getMapCursor(arg0)
  const cursorType = ref(mapCursor.cursorType)

  controllableWatch(cursorType, v => {
    if (mapCursor.cursorType !== v) {
      mapCursor.cursorType = v
    }
  })

  useObservableOn(mapCursor.on('change', e => {
    if (e.cursorType !== cursorType.value) {
      cursorType.value = e.cursorType
    }
  }))

  return cursorType
}


export function useMapCursorState () : IMapCursorHook
export function useMapCursorState (fssgMap: FssgEsri) : IMapCursorHook
export function useMapCursorState (mapCursor: MapCursor) : IMapCursorHook
export function useMapCursorState (arg0?: FssgEsri | MapCursor) : IMapCursorHook
export function useMapCursorState (arg0?: FssgEsri | MapCursor) : IMapCursorHook {
  const mapCursor = _getMapCursor(arg0)
  const cursorType = useMapCursorType(arg0)
  return { mapCursor, cursorType }
}

const SYMBOL_MAPCURSOR : InjectionKey<MapCursor> = Symbol('FssgEsri.MapCursor')
export function createMapCursor (options: IMapCursorOptions) : MapCursor
export function createMapCursor (options: IMapCursorOptions, fssgEsri: FssgEsri, app?: App) : MapCursor
export function createMapCursor (options: IMapCursorOptions, fssgEsri?: FssgEsri, app?: App) : MapCursor {
  const mapCursor = new MapCursor(options)
  fssgEsri = fssgEsri ?? useFssgEsri()
  fssgEsri.use(mapCursor)
  if (app) {
    app.provide(SYMBOL_MAPCURSOR, mapCursor)
  } else {
    provide(SYMBOL_MAPCURSOR, mapCursor)
  }
  return mapCursor
}

export function useMapCursor () : MapCursor
export function useMapCursor (fssgEsri: FssgEsri) : MapCursor
export function useMapCursor (fssgEsri?: FssgEsri) : MapCursor
export function useMapCursor (fssgEsri?: FssgEsri) : MapCursor {
  return fssgEsri?.mapCursor ?? inject(SYMBOL_MAPCURSOR) as MapCursor
}
