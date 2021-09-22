import { Overlays, FssgEsri, IOverlaysOptions, IOverlayAddOptions } from '@fssgis/fssg-esri'
import { warn } from '@fssgis/fssg-map'
import { createGuid } from '@fssgis/utils'
import { App, AppContext, Component, createVNode, getCurrentInstance, inject, InjectionKey, provide, render } from 'vue'
import { useFssgEsri } from './fssg-esri.hooks'

function _getOverlays () : Overlays
function _getOverlays (fssgMap: FssgEsri) : Overlays
function _getOverlays (overlays: Overlays) : Overlays
function _getOverlays (arg0?: FssgEsri | Overlays) : Overlays
function _getOverlays (arg0?: FssgEsri | Overlays) : Overlays {
  let overlays: Overlays
  if (!arg0) {
    const { fssgEsri } = useFssgEsri()
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

export interface IOverlayState {
  setOverlay<T> (options: Omit<IOverlayAddOptions, 'content'> & { component?: Component<T>, props?: Partial<T> }) : string
}

export function useSetOverlays () : IOverlayState
export function useSetOverlays (fssgMap: FssgEsri) : IOverlayState
export function useSetOverlays (overlays: Overlays) : IOverlayState
export function useSetOverlays (arg0?: FssgEsri | Overlays) : IOverlayState
export function useSetOverlays (arg0?: FssgEsri | Overlays) : IOverlayState {
  const overlays = _getOverlays(arg0)
  const app = getCurrentInstance()?.appContext as AppContext
  return {
    setOverlay (options) {
      let content : HTMLDivElement | undefined
      const id = options.id ?? createGuid()
      if (options.component) {
        content = (() => {
          const dom = document.createElement('div')
          const vm = createVNode(options.component, options.props)
          vm.appContext = app
          render(vm, dom)
          return dom.firstElementChild as HTMLDivElement
        })()
      }
      overlays.add({
        content: content ?? '',
        ...options,
        id,
      })
      return id
    }
  }
}


const SYMBOL_OVERLAYS : InjectionKey<Overlays> = Symbol('FssgEsri.Overlays')
export function createOverlays (options: IOverlaysOptions) : Overlays
export function createOverlays (options: IOverlaysOptions, fssgEsri: FssgEsri, app?: App) : Overlays
export function createOverlays (options: IOverlaysOptions, fssgEsri?: FssgEsri, app?: App) : Overlays {
  const overlays = new Overlays(options)
  fssgEsri = fssgEsri ?? useFssgEsri().fssgEsri
  fssgEsri.use(overlays)
  if (app) {
    app.provide(SYMBOL_OVERLAYS, overlays)
  } else {
    provide(SYMBOL_OVERLAYS, overlays)
  }
  return overlays
}

interface IUseOverlays {
  overlays: Overlays
  setOverlay<T> (options: Omit<IOverlayAddOptions, 'content'> & { component?: Component<T>, props?: Partial<T> }) : string
}

export function useOverlays () : IUseOverlays
export function useOverlays (fssgEsri: FssgEsri) : IUseOverlays
export function useOverlays (fssgEsri?: FssgEsri) : IUseOverlays
export function useOverlays (fssgEsri?: FssgEsri) : IUseOverlays {
  const overlays = fssgEsri?.overlays ?? inject(SYMBOL_OVERLAYS) as Overlays
  return {
    overlays,
    ...useSetOverlays(overlays),
  }
}
