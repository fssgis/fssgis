import { FssgEsri, IFssgEsriOptions } from '@fssgis/fssg-esri'
import { inject, InjectionKey, provide, ref, Ref, shallowReactive, shallowRef, watch, watchEffect } from 'vue'
import { whenRightReturn } from '@fssgis/utils'
import { controllableWatch, tryOnBeforeUnmounted, tryOnUnmounted } from './base.hooks'

export type EsriWatchCallback<T extends __esri.Accessor, K extends keyof T> = (newValue: T[K], oldValue: T[K], propertyName: K, target: T) => void

export function useEsriWatch<T extends __esri.Accessor, K extends keyof T> (accessor: T, property: K, callback: EsriWatchCallback<T, K>, options?: { defaultStop?: boolean, sync?: boolean }): {
  startWatch() : void
  stopWatch() : void
  watchStatus: Ref<boolean>
} {
  let handle : __esri.WatchHandle | undefined
  const watchStatus = ref(!!options?.defaultStop)
  const stopWatch = () => watchStatus.value = false
  const startWatch = () => watchStatus.value = true
  tryOnBeforeUnmounted(() => stopWatch())

  watchEffect(() => {
    if (watchStatus.value) {
      handle?.remove()
      handle = accessor.watch(property as string, callback as any, options?.sync) // eslint-disable-line
    } else {
      handle?.remove()
      handle = undefined
    }
  })

  return { watchStatus, stopWatch, startWatch }
}

interface IWatchRef {
  watchStatus: Ref<boolean>
  stopWatch () : void
  startWatch () : void
}

export function useWatchRef<T extends __esri.Accessor, K extends keyof T> (accessor: T, property: K) : {
  watchRef: Ref<T[K]>
} & IWatchRef {
  const watchRef = ref(accessor[property]) as Ref<T[K]>

  const { watchStatus, ...others } = useEsriWatch(accessor, property, val => {
    if (watchRef.value !== val) {
      watchRef.value = val
    }
  }, { defaultStop: true })

  const { start, stop } = controllableWatch(watchRef, val => {
    if (val !== accessor[property]) {
      accessor[property] = val
    }
  })

  watch(watchStatus, status => {
    if (status) {
      watchRef.value = accessor[property]
      start()
    } else {
      stop()
    }
  }, { immediate: true })

  return { watchRef, watchStatus, ...others }
}

export function useWatchShallowRef<T extends __esri.Accessor, K extends keyof T> (accessor: T, property: K) : {
  watchRef: Ref<T[K]>
} & IWatchRef {
  const watchRef = shallowRef(accessor[property]) as Ref<T[K]>

  const { watchStatus, ...others } = useEsriWatch(accessor, property, val => {
    if (watchRef.value !== val) {
      watchRef.value = val
    }
  }, { defaultStop: true })

  const { start, stop } = controllableWatch(watchRef, val => {
    if (val !== accessor[property]) {
      accessor[property] = val
    }
  })

  watchEffect(() => {
    if (watchStatus.value) {
      watchRef.value = accessor[property]
      start()
    } else {
      stop()
    }
  })


  return { watchRef, watchStatus, ...others }
}

export function useWatchShallowReactive<T extends __esri.Accessor, K extends keyof T> (accessor: T, properties: K[]) : {
  watchReactive: Pick<{
    [K in keyof T]: T[K]
  }, K>
} & IWatchRef {
  let handle : __esri.WatchHandle | undefined

  const watchReactive = shallowReactive({} as Pick<{
    [K in keyof T]: T[K]
  }, K>)
  const watchStatus = ref(true)
  const stopWatch = () => watchStatus.value = false
  const startWatch = () => watchStatus.value = true

  properties.forEach(prop => {
    watchReactive[prop] = accessor[prop]
  })

  watchEffect(() => {
    if (watchStatus.value) {
      handle?.remove()
      properties.forEach(prop => {
        watchReactive[prop] = accessor[prop]
      })
      handle = accessor.watch(properties as string[], (val, _, prop) => {
        watchReactive[prop] = val
      })
    } else {
      handle?.remove()
      handle = undefined
    }
  })

  tryOnUnmounted(() => stopWatch())

  return { watchReactive, startWatch, stopWatch, watchStatus }
}


export function useZoom (fssgEsri?: FssgEsri) : { zoom: Ref<number> } & IWatchRef {
  if (!fssgEsri) {
    fssgEsri = useFssgEsri()
  }
  const { watchRef: zoom, ...others } = useWatchRef(fssgEsri.view, 'zoom')
  return { zoom, ...others }
}

export function useCenter (fssgEsri?: FssgEsri) : { center: Ref<__esri.Point | number[]> } & IWatchRef {
  if (!fssgEsri) {
    fssgEsri = useFssgEsri()
  }
  const { watchRef: center, ...others } = useWatchShallowRef(fssgEsri.view, 'center')
  return { center, ...others }
}

export function useExtent (fssgEsri?: FssgEsri) : { extent: Ref<__esri.Extent> } & IWatchRef {
  if (!fssgEsri) {
    fssgEsri = useFssgEsri()
  }
  const { watchRef: extent, ...others } = useWatchShallowRef(fssgEsri.view, 'extent')
  return { extent, ...others }
}

export function useCenterZoom (fssgEsri?: FssgEsri) : { state: { center: __esri.Point, zoom: number } } & IWatchRef {
  if (!fssgEsri) {
    fssgEsri = useFssgEsri()
  }
  const { watchReactive: state, ...others } = useWatchShallowReactive(fssgEsri.view, ['center', 'zoom'])
  return { state, ...others }
}

const SYMBOL_FSSG_ESRI : InjectionKey<FssgEsri> = Symbol('fssgEsri')

export function createFssgEsri (container: string, options?: IFssgEsriOptions) : FssgEsri {
  const fssgEsri = new FssgEsri(container, options)
  provide(SYMBOL_FSSG_ESRI, fssgEsri)

  whenRightReturn(500, () => document.getElementById(container)).then(() => {
    fssgEsri.mount()
  })

  return fssgEsri
}

export function useFssgEsri () : FssgEsri {
  return inject(SYMBOL_FSSG_ESRI) as FssgEsri
}

export function useFssgEsriLoaded (fssgEsri?: FssgEsri) : Ref<boolean> {
  if (!fssgEsri) {
    fssgEsri = useFssgEsri()
  }
  const loaded = ref(false)
  fssgEsri.when().then(() => loaded.value = true)
  return loaded
}

