import { ViewCliper, FssgEsri, IViewCliperOptions } from '@fssgis/fssg-esri'
import { warn } from '@fssgis/fssg-map'
import { App, inject, InjectionKey, provide } from 'vue'
import { useFssgEsri } from './fssg-esri.hooks'

function _getViewCliper () : ViewCliper
function _getViewCliper (fssgMap: FssgEsri) : ViewCliper
function _getViewCliper (viewCliper: ViewCliper) : ViewCliper
function _getViewCliper (arg0?: FssgEsri | ViewCliper) : ViewCliper
function _getViewCliper (arg0?: FssgEsri | ViewCliper) : ViewCliper {
  let viewCliper: ViewCliper
  if (!arg0) {
    const fssgEsri = useFssgEsri()
    viewCliper = fssgEsri.viewCliper
    if (!viewCliper) {
      warn(this, 'ViewCliper实例未挂载到FssgMap实例')
    }
  } else {
    if (arg0 instanceof FssgEsri) {
      viewCliper = arg0.viewCliper
    } else {
      viewCliper = arg0
    }
  }
  return viewCliper
}

const SYMBOL_VIEWCLIPER : InjectionKey<ViewCliper> = Symbol('FssgEsri.ViewCliper')
export function createViewCliper (options: IViewCliperOptions) : ViewCliper
export function createViewCliper (options: IViewCliperOptions, fssgEsri: FssgEsri, app?: App) : ViewCliper
export function createViewCliper (options: IViewCliperOptions, fssgEsri?: FssgEsri, app?: App) : ViewCliper {
  const viewCliper = new ViewCliper(options)
  fssgEsri = fssgEsri ?? useFssgEsri()
  fssgEsri.use(viewCliper)
  if (app) {
    app.provide(SYMBOL_VIEWCLIPER, viewCliper)
  } else {
    provide(SYMBOL_VIEWCLIPER, viewCliper)
  }
  return viewCliper
}

export function useViewCliper () : ViewCliper
export function useViewCliper (fssgEsri: FssgEsri) : ViewCliper
export function useViewCliper (fssgEsri?: FssgEsri) : ViewCliper
export function useViewCliper (fssgEsri?: FssgEsri) : ViewCliper {
  return fssgEsri?.viewCliper ?? inject(SYMBOL_VIEWCLIPER) as ViewCliper
}
