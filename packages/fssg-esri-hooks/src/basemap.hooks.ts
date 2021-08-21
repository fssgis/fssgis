import { Basemap, FssgEsri, IBasemapOptions } from '@fssgis/fssg-esri'
import { inject, InjectionKey, provide, ref, Ref } from 'vue'
import { controllableWatch, useObservableOn } from './base.hooks'
import { useFssgEsri } from './fssg-esri.hooks'
import { warn } from '@fssgis/fssg-map'

function _getBasemap () : Basemap
function _getBasemap (fssgMap: FssgEsri) : Basemap
function _getBasemap (basemap: Basemap) : Basemap
function _getBasemap (arg0?: FssgEsri | Basemap) : Basemap
function _getBasemap (arg0?: FssgEsri | Basemap) : Basemap {
  let basemap: Basemap
  if (!arg0) {
    const fssgEsri = useFssgEsri()
    basemap = fssgEsri.basemap
    if (!basemap) {
      warn(this, 'Basemap实例未挂载到FssgMap实例')
    }
  } else {
    if (arg0 instanceof FssgEsri) {
      basemap = arg0.basemap
    } else {
      basemap = arg0
    }
  }
  return basemap
}

export function useBasemapSelectedKey () : Ref<string>
export function useBasemapSelectedKey (fssgMap: FssgEsri) : Ref<string>
export function useBasemapSelectedKey (basemap: Basemap) : Ref<string>
export function useBasemapSelectedKey (arg0?: FssgEsri | Basemap) : Ref<string>
export function useBasemapSelectedKey (arg0?: FssgEsri | Basemap) : Ref<string> {
  const basemap = _getBasemap(arg0)
  const selectedKey = ref(basemap.selectedKey)

  controllableWatch(selectedKey, key => {
    if (basemap.selectedKey !== key) {
      basemap.selectedKey = key
    }
  })

  useObservableOn(basemap.on('changed:selected-key', e => {
    if (e.selectedKey !== selectedKey.value) {
      selectedKey.value = e.selectedKey
    }
  }))

  return selectedKey
}

export function useBasemapVisible () : Ref<boolean>
export function useBasemapVisible (fssgMap: FssgEsri) : Ref<boolean>
export function useBasemapVisible (basemap: Basemap) : Ref<boolean>
export function useBasemapVisible (arg0?: FssgEsri | Basemap) : Ref<boolean>
export function useBasemapVisible (arg0?: FssgEsri | Basemap) : Ref<boolean> {
  const basemap = _getBasemap(arg0)
  const visible = ref(basemap.visible)

  controllableWatch(visible, v => {
    if (basemap.visible !== v) {
      basemap.visible = v
    }
  })

  useObservableOn(basemap.on('changed:visible', e => {
    if (e.visible !== visible.value) {
      visible.value = e.visible
    }
  }))

  return visible
}

interface IBasemapHook {
  selectedKey: Ref<string>
  visible: Ref<boolean>
  basemap: Basemap
}

export function useBasemapState () : IBasemapHook
export function useBasemapState (fssgMap: FssgEsri) : IBasemapHook
export function useBasemapState (basemap: Basemap) : IBasemapHook
export function useBasemapState (arg0?: FssgEsri | Basemap) : IBasemapHook
export function useBasemapState (arg0?: FssgEsri | Basemap) : IBasemapHook {
  const basemap = _getBasemap(arg0)
  const selectedKey = useBasemapSelectedKey(basemap)
  const visible = useBasemapVisible(basemap)
  return { basemap, selectedKey, visible }
}

const SYMBOL_BASEMAP : InjectionKey<Basemap> = Symbol('FssgEsri.Basemap')
export function createBasemap (options: IBasemapOptions) : Basemap
export function createBasemap (options: IBasemapOptions, fssgMap: FssgEsri) : Basemap
export function createBasemap (options: IBasemapOptions, fssgMap?: FssgEsri) : Basemap {
  const basemap = new Basemap(options)
  fssgMap = fssgMap ?? useFssgEsri()
  fssgMap.use(basemap)
  provide(SYMBOL_BASEMAP, basemap)
  return basemap
}

export function useBasemap () : Basemap
export function useBasemap (fssgEsri: FssgEsri) : Basemap
export function useBasemap (fssgEsri?: FssgEsri) : Basemap
export function useBasemap (fssgEsri?: FssgEsri) : Basemap {
  return fssgEsri?.basemap ?? inject(SYMBOL_BASEMAP) as Basemap
}

