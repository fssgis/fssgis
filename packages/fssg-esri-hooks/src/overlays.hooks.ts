import { Overlays, FssgEsri, IOverlaysOptions } from '@fssgis/fssg-esri'
import { warn } from '@fssgis/fssg-map'
import { App, inject, InjectionKey, provide } from 'vue'
import { useFssgEsri } from './fssg-esri.hooks'

function _getOverlays () : Overlays
function _getOverlays (fssgMap: FssgEsri) : Overlays
function _getOverlays (overlays: Overlays) : Overlays
function _getOverlays (arg0?: FssgEsri | Overlays) : Overlays
function _getOverlays (arg0?: FssgEsri | Overlays) : Overlays {
  let overlays: Overlays
  if (!arg0) {
    const fssgEsri = useFssgEsri()
    overlays = fssgEsri.overlays
    if (!overlays) {
      warn(this, 'Overlays实例未挂载到FssgMap实例')
    }
  } else {
    if (arg0 instanceof FssgEsri) {
      overlays = arg0.overlays
    } else {
      overlays = arg0
    }
  }
  return overlays
}

const SYMBOL_OVERLAYS : InjectionKey<Overlays> = Symbol('FssgEsri.Overlays')
export function createOverlays (options: IOverlaysOptions) : Overlays
export function createOverlays (options: IOverlaysOptions, fssgEsri: FssgEsri, app?: App) : Overlays
export function createOverlays (options: IOverlaysOptions, fssgEsri?: FssgEsri, app?: App) : Overlays {
  const overlays = new Overlays(options)
  fssgEsri = fssgEsri ?? useFssgEsri()
  fssgEsri.use(overlays)
  if (app) {
    app.provide(SYMBOL_OVERLAYS, overlays)
  } else {
    provide(SYMBOL_OVERLAYS, overlays)
  }
  return overlays
}

export function useOverlays () : Overlays
export function useOverlays (fssgEsri: FssgEsri) : Overlays
export function useOverlays (fssgEsri?: FssgEsri) : Overlays
export function useOverlays (fssgEsri?: FssgEsri) : Overlays {
  return fssgEsri?.overlays ?? inject(SYMBOL_OVERLAYS) as Overlays
}
