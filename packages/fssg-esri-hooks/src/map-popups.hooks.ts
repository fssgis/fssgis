import { AppContext, Component, createVNode, getCurrentInstance, Ref, ref, render, InjectionKey, App, provide, inject } from 'vue'
import { FssgEsri, IMapPopupsOptions, MapPopups } from '@fssgis/fssg-esri'
import { useFssgEsri } from '.'
import { warn } from '@fssgis/fssg-map'

export interface IPopupState {
  visible: Ref<boolean>
  showPopup<T> (
    xy: number[], // [number, number]
    title: string,
    component: Component<T>,
    props?: Partial<T>,
    options?: __esri.PopupOpenOptions
  ) : void
  cancel () : void
}

export function usePopup () : IPopupState
export function usePopup (fssgEsri: FssgEsri) : IPopupState
export function usePopup (mapPopups: MapPopups) : IPopupState
export function usePopup (arg0?: FssgEsri | MapPopups) : IPopupState
export function usePopup (arg0?: FssgEsri | MapPopups) : IPopupState {
  const mapPopups = _getMapPopups(arg0)
  const app = getCurrentInstance()?.appContext as AppContext
  const visible = ref(mapPopups.visible)
  mapPopups.$.view.watch('popup.visible', v => {
    if (v !== visible.value) {
      visible.value = v
    }
  })
  return {
    visible,
    showPopup ([x, y], title, component, props, options) {
      const content = (() => {
        const dom = document.createElement('div')
        const vm = createVNode(component, props)
        vm.appContext = app
        render(vm, dom)
        return dom
      })()

      mapPopups.openByXY({ x, y}, {
        title,
        content,
        ...options ?? {}
      })
    },
    cancel () {
      mapPopups.cancel()
    }
  }
}

function _getMapPopups () : MapPopups
function _getMapPopups (fssgEsri: FssgEsri) : MapPopups
function _getMapPopups (mapPopups: MapPopups) : MapPopups
function _getMapPopups (arg0?: FssgEsri | MapPopups) : MapPopups
function _getMapPopups (arg0?: FssgEsri | MapPopups) : MapPopups {
  let mapPopups: MapPopups
  if (!arg0) {
    const { fssgEsri } = useFssgEsri()
    mapPopups = fssgEsri.mapPopups
    if (!mapPopups) {
      warn(this, 'MapPopups实例未挂载到FssgMap实例')
    }
  } else {
    if (arg0 instanceof FssgEsri) {
      mapPopups = arg0.mapPopups
    } else {
      mapPopups = arg0
    }
  }
  return mapPopups
}

const SYMBOL_VIEWCLIPER : InjectionKey<MapPopups> = Symbol('FssgEsri.MapPopups')
export function createMapPopups (options: IMapPopupsOptions) : MapPopups
export function createMapPopups (options: IMapPopupsOptions, fssgEsri: FssgEsri, app?: App) : MapPopups
export function createMapPopups (options: IMapPopupsOptions, fssgEsri?: FssgEsri, app?: App) : MapPopups {
  const mapPopups = new MapPopups(options)
  fssgEsri = fssgEsri ?? useFssgEsri().fssgEsri
  fssgEsri.use(mapPopups)
  if (app) {
    app.provide(SYMBOL_VIEWCLIPER, mapPopups)
  } else {
    provide(SYMBOL_VIEWCLIPER, mapPopups)
  }
  return mapPopups
}

interface IUseMapPopups {
  mapPopups: MapPopups
}

export function useMapPopups () : IUseMapPopups
export function useMapPopups (fssgEsri: FssgEsri) : IUseMapPopups
export function useMapPopups (fssgEsri?: FssgEsri) : IUseMapPopups
export function useMapPopups (fssgEsri?: FssgEsri) : IUseMapPopups {
  const mapPopups = fssgEsri?.mapPopups ?? inject(SYMBOL_VIEWCLIPER) as MapPopups
  return {
    mapPopups,
  }
}
