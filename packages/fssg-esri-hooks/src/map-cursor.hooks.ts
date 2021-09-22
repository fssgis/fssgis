import { MapCursor, FssgEsri, IMapCursorOptions } from '@fssgis/fssg-esri'
import { warn } from '@fssgis/fssg-map'
import { App, inject, InjectionKey, provide, ref, Ref } from 'vue'
import { controllableWatch, useObservableOn } from './base.hooks'
import { injectFssgEsri } from './fssg-esri.hooks'
import { createIsomorphicDestructurable } from '@fssgis/utils'

function _getMapCursor () : MapCursor
function _getMapCursor (fssgMap: FssgEsri) : MapCursor
function _getMapCursor (mapCursor: MapCursor) : MapCursor
function _getMapCursor (arg0?: FssgEsri | MapCursor) : MapCursor
function _getMapCursor (arg0?: FssgEsri | MapCursor) : MapCursor {
  let mapCursor: MapCursor
  if (!arg0) {
    const fssgEsri = injectFssgEsri()
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

type UseMapCursorType = {
  cursorType: Ref<string>
} & readonly [Ref<string>]

export function useMapCursorType () : UseMapCursorType
export function useMapCursorType (fssgMap: FssgEsri) : UseMapCursorType
export function useMapCursorType (mapCursor: MapCursor) : UseMapCursorType
export function useMapCursorType (arg0?: FssgEsri | MapCursor) : UseMapCursorType
export function useMapCursorType (arg0?: FssgEsri | MapCursor) : UseMapCursorType {
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

  return createIsomorphicDestructurable(
    { cursorType } as const,
    [cursorType] as const,
  )
}

const SYMBOL_MAPCURSOR : InjectionKey<MapCursor> = Symbol('FssgEsri.MapCursor')
export function createMapCursor (options: IMapCursorOptions) : MapCursor
export function createMapCursor (options: IMapCursorOptions, fssgEsri: FssgEsri, app?: App) : MapCursor
export function createMapCursor (options: IMapCursorOptions, fssgEsri?: FssgEsri, app?: App) : MapCursor {
  const mapCursor = new MapCursor(options)
  fssgEsri = fssgEsri ?? injectFssgEsri()
  fssgEsri.use(mapCursor)
  if (app) {
    app.provide(SYMBOL_MAPCURSOR, mapCursor)
  } else {
    provide(SYMBOL_MAPCURSOR, mapCursor)
  }
  return mapCursor
}

export function injectMapCursor () : MapCursor {
  return inject(SYMBOL_MAPCURSOR) as MapCursor
}

type UseMapCursor = {
  mapCursor: MapCursor
  cursorType: Ref<string>
} & readonly [MapCursor, Ref<string>]

export function useMapCursor () : UseMapCursor
export function useMapCursor (fssgEsri: FssgEsri) : UseMapCursor
export function useMapCursor (fssgEsri?: FssgEsri) : UseMapCursor
export function useMapCursor (fssgEsri?: FssgEsri) : UseMapCursor {
  const mapCursor = fssgEsri?.mapCursor ?? injectMapCursor()
  const { cursorType } = useMapCursorType()
  return createIsomorphicDestructurable(
    { mapCursor, cursorType } as const,
    [mapCursor, cursorType] as const,
  )
}
