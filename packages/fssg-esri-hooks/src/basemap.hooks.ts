import { Basemap, FssgEsri, IBasemapOptions, } from '@fssgis/fssg-esri'
import { App, inject, InjectionKey, provide, ref, Ref } from 'vue'
import { controllableWatch, useObservableOn } from './base.hooks'
import { warn } from '@fssgis/fssg-map'
import { injectFssgEsri } from './fssg-esri.hooks'
import { createIsomorphicDestructurable } from '@fssgis/utils'

function _getBasemap () : Basemap
function _getBasemap (fssgMap: FssgEsri) : Basemap
function _getBasemap (basemap: Basemap) : Basemap
function _getBasemap (arg0?: FssgEsri | Basemap) : Basemap
function _getBasemap (arg0?: FssgEsri | Basemap) : Basemap {
  let basemap: Basemap
  if (!arg0) {
    const fssgEsri = injectFssgEsri()
    basemap = fssgEsri.getPlugin(Basemap)
    if (!basemap) {
      warn(this, 'Basemap实例未挂载到FssgMap实例')
    }
  } else {
    if (arg0 instanceof FssgEsri) {
      basemap = arg0.getPlugin(Basemap)
    } else {
      basemap = arg0
    }
  }
  return basemap
}

const SYMBOL_BASEMAP : InjectionKey<Basemap> = Symbol('FssgEsri.Basemap')
export function createBasemap (options: IBasemapOptions) : Basemap
export function createBasemap (options: IBasemapOptions, fssgEsri: FssgEsri, app?: App) : Basemap
export function createBasemap (options: IBasemapOptions, fssgEsri?: FssgEsri, app?: App) : Basemap {
  const basemap = new Basemap(options)
  fssgEsri = fssgEsri ?? injectFssgEsri()
  fssgEsri.use(basemap)
  if (app) {
    app.provide(SYMBOL_BASEMAP, basemap)
  } else {
    provide(SYMBOL_BASEMAP, basemap)
  }
  return basemap
}

export function injectBasemap () : Basemap {
  return inject(SYMBOL_BASEMAP) as Basemap
}

type UseBasemapSelectedKey = {
  selectedKey: Ref<string>
} & readonly [Ref<string>]

export function useBasemapSelectedKey () : UseBasemapSelectedKey
export function useBasemapSelectedKey (fssgMap: FssgEsri) : UseBasemapSelectedKey
export function useBasemapSelectedKey (basemap: Basemap) : UseBasemapSelectedKey
export function useBasemapSelectedKey (arg0?: FssgEsri | Basemap) : UseBasemapSelectedKey
export function useBasemapSelectedKey (arg0?: FssgEsri | Basemap) : UseBasemapSelectedKey {
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

  return createIsomorphicDestructurable(
    { selectedKey } as const,
    [selectedKey] as const,
  )
}

type UseBasemapVisible = {
  visible: Ref<boolean>
} & readonly [Ref<boolean>]

export function useBasemapVisible () : UseBasemapVisible
export function useBasemapVisible (fssgMap: FssgEsri) : UseBasemapVisible
export function useBasemapVisible (basemap: Basemap) : UseBasemapVisible
export function useBasemapVisible (arg0?: FssgEsri | Basemap) : UseBasemapVisible
export function useBasemapVisible (arg0?: FssgEsri | Basemap) : UseBasemapVisible {
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

  return createIsomorphicDestructurable(
    { visible } as const,
    [visible] as const,
  )
}


type UseBasemap = {
  basemap: Basemap
  selectedKey: Ref<string>
  visible: Ref<boolean>
} & readonly [Basemap, Ref<string>, Ref<boolean>]

export function useBasemap () : UseBasemap
export function useBasemap (fssgEsri: FssgEsri) : UseBasemap
export function useBasemap (fssgEsri?: FssgEsri) : UseBasemap
export function useBasemap (fssgEsri?: FssgEsri) : UseBasemap {
  const basemap = fssgEsri?.getPlugin(Basemap) ?? injectBasemap()
  const { selectedKey } = useBasemapSelectedKey(basemap)
  const { visible } = useBasemapVisible(basemap)
  return createIsomorphicDestructurable(
    { basemap, selectedKey, visible } as const,
    [basemap, selectedKey, visible] as const,
  )
}

